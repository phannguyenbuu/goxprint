from __future__ import annotations

import json
import logging
import re
import socket
import subprocess
import threading
import time
import uuid
from datetime import datetime, timedelta, timezone
from collections.abc import Callable
from pathlib import Path
from urllib.parse import urlparse

import requests

from agent.config import AppConfig
from agent.modules.ricoh.service import RicohService
from agent.modules.toshiba.service import ToshibaService
from agent.services.api_client import APIClient, Printer
from agent.services.scan_drop import ensure_active_drop_folder
from agent.services.updater import AutoUpdater
from agent.services.runtime import get_machine_agent_uid, no_window_subprocess_kwargs, user_temp_root
from agent.utils.scanner import SubnetScanner
from agent.services.ftp_store import load_config, find_site_by_port, find_site_by_name, normalize_site_name


LOGGER = logging.getLogger(__name__)
DEFAULT_WEB_PORT = 9173
SCAN_UPLOAD_STATE_FILE = Path("storage/data/scan_upload_state.json")
MAX_SCAN_UPLOAD_HISTORY = 5000


class PollingBridge:
    def __init__(
        self,
        config: AppConfig,
        api_client: APIClient,
        ricoh_service: RicohService,
        toshiba_service: ToshibaService | None = None,
        updater: AutoUpdater | None = None,
        run_mode: str = "web",
        web_port: int = DEFAULT_WEB_PORT,
        restart_callback: Callable[[], None] | None = None,
    ) -> None:
        self._config = config
        self._api_client = api_client
        self._ricoh_service = ricoh_service
        self._toshiba_service = toshiba_service
        self._updater = updater
        self._run_mode = str(run_mode or "web").strip() or "web"
        self._web_port = int(web_port or DEFAULT_WEB_PORT)
        self._restart_callback = restart_callback
        self._thread: threading.Thread | None = None
        self._stop_event = threading.Event()
        self._last_started_at = ""
        self._last_cycle_at = ""
        self._last_success_at = ""
        self._last_error = ""
        self._last_cycle_total_printers = 0
        self._last_cycle_ricoh_printers = 0
        self._last_cycle_sent = 0
        self._last_cycle_failed = 0
        self._last_control_pull_at = ""
        self._last_control_total = 0
        self._last_control_apply_error = ""
        self._last_ftp_control_pull_at = ""
        self._last_ftp_control_total = 0
        self._last_ftp_control_apply_error = ""
        self._applied_controls: dict[str, bool] = {}
        self._applied_ftp_controls: dict[str, bool] = {}
        self._control_retry_after: dict[str, datetime] = {}
        self._resolved_lan_uid = ""
        self._control_thread: threading.Thread | None = None
        self._running_commands: set[int] = set()
        self._running_commands_lock = threading.Lock()
        raw_agent_uid = self._config.get_string("polling.agent_uid", "").strip()
        self._agent_uid = get_machine_agent_uid(raw_agent_uid)
        if not raw_agent_uid:
            try:
                self._config.set_value("polling.agent_uid", self._agent_uid)
                LOGGER.info("Saved resolved agent_uid '%s' to settings.json", self._agent_uid)
            except Exception as exc:
                LOGGER.warning("Failed to save agent_uid to settings.json: %s", exc)
        self._scan_last_cycle_at = ""
        self._scan_last_detected_at = ""
        self._scan_last_detected_file = ""
        self._scan_last_detected_size = 0
        self._scan_last_detected_status = ""
        self._scan_last_upload_at = ""
        self._scan_last_upload_file = ""
        self._scan_last_upload_status = ""
        self._scan_last_upload_drive_path = ""
        self._scan_last_error = ""
        self._scan_uploaded_total = 0
        self._scan_failed_total = 0
        self._scan_pending_total = 0
        self._release_last_check_at = ""
        self._release_last_error = ""
        self._scan_counter_last_by_ip: dict[str, int] = {}
        self._scan_file_state: dict[str, dict[str, object]] = {}
        self._scan_uploaded_fingerprints: dict[str, str] = {}
        self._scan_lock = threading.Lock()
        self._trigger_event = threading.Event()
        self._is_master = False
        self._emails = []
        self._last_discovered_printers = []
        self._printer_online_states: dict[str, bool] = {}
        self._printer_physical_statuses: dict[str, str] = {}
        self._load_scan_upload_state()
        self._recent_commands = []
        self._recent_commands_lock = threading.Lock()
        self._update_staged = False
        self._ip_change_thread = None
        self._ip_change_lock = threading.Lock()

    @staticmethod
    def _printer_type(value: str) -> str:
        return str(value or "").strip().lower()

    def _collector_service_for(self, printer: Printer) -> RicohService | ToshibaService:
        if self._toshiba_service is not None and self._printer_type(printer.printer_type) == "toshiba":
            return self._toshiba_service
        return self._ricoh_service

    @staticmethod
    def _device_info_probe_name(info: dict[str, Any]) -> tuple[str, str]:
        model_name = (
            str(info.get("Model Name", "") or "").strip()
            or str(info.get("Machine Name", "") or "").strip()
            or str(info.get("model_name", "") or "").strip()
            or str(info.get("Host Name", "") or "").strip()
            or str(info.get("host_name", "") or "").strip()
        )
        machine_id = (
            str(info.get("Machine ID", "") or "").strip()
            or str(info.get("machine_id", "") or "").strip()
        )
        return model_name, machine_id

    def _candidate_probe_types(self, preferred_type: str = "") -> list[str]:
        candidates: list[str] = []
        normalized = self._printer_type(preferred_type)
        if normalized in {"ricoh", "toshiba"}:
            candidates.append(normalized)
        if "ricoh" not in candidates:
            candidates.append("ricoh")
        if self._toshiba_service is not None and "toshiba" not in candidates:
            candidates.append("toshiba")
        return candidates

    def _resolve_scanned_mac(
        self,
        ip: str,
        row: dict[str, object],
        neighbor_mac_map: dict[str, str],
        preferred_type: str = "",
    ) -> str:
        mac = self._normalize_mac(str(row.get("mac_id", "") or row.get("mac_address", "") or ""))
        if not mac:
            mac = self._normalize_mac(neighbor_mac_map.get(ip, ""))
        if not mac and self._printer_type(preferred_type) == "ricoh":
            mac = self._normalize_mac(str(self._ricoh_service.fetch_mac_address_direct(ip) or "").strip())
        return mac

    def _probe_discovered_printer(
        self,
        *,
        ip: str,
        mac: str,
        preferred_type: str = "",
    ) -> Printer | None:
        for candidate_type in self._candidate_probe_types(preferred_type):
            collector = (
                self._toshiba_service
                if candidate_type == "toshiba" and self._toshiba_service is not None
                else self._ricoh_service
            )
            temp = Printer(
                name="Discovery",
                ip=ip,
                user="",
                password="",
                printer_type=candidate_type,
                mac_address=mac,
            )
            try:
                info_payload = collector.process_device_info(temp, should_post=False)
                info = info_payload.get("device_info", {}) if isinstance(info_payload, dict) else {}
                model_name, machine_id = self._device_info_probe_name(info if isinstance(info, dict) else {})
            except Exception as exc:  # noqa: BLE001
                LOGGER.debug("Polling %s discovery probe failed: ip=%s error=%s", candidate_type, ip, exc)
                continue
            if not model_name and not machine_id:
                continue
            return Printer(
                id=0,
                name=model_name or machine_id or ip,
                ip=ip,
                user="",
                password="",
                printer_type=candidate_type,
                status="online",
                mac_address=mac,
            )
        return None

    def _fallback_discovery_candidates(
        self,
        active_rows: list[tuple[str, dict[str, object]]],
    ) -> list[tuple[str, dict[str, object]]]:
        preferred = [
            (ip, row)
            for ip, row in active_rows
            if bool(row.get("has_printer_ports")) or self._printer_type(str(row.get("printer_type", "") or "")) in {"ricoh", "toshiba"}
        ]
        return preferred or active_rows

    def _merge_server_printers(self, printers: list[Printer]) -> list[Printer]:
        try:
            server_printers = self._api_client.get_printers()
        except Exception as exc:  # noqa: BLE001
            LOGGER.debug("Polling printer merge from server failed: %s", exc)
            return printers

        if not server_printers:
            return printers

        ordered: list[Printer] = list(printers)
        by_ip: dict[str, Printer] = {
            str(printer.ip or "").strip(): printer
            for printer in ordered
            if str(printer.ip or "").strip()
        }

        for printer in server_printers:
            ip = str(printer.ip or "").strip()
            if not ip:
                continue
            existing = by_ip.get(ip)
            if existing is None:
                ordered.append(printer)
                by_ip[ip] = printer
                continue
            if printer.id and not existing.id:
                existing.id = printer.id
            if str(printer.name or "").strip() and (
                not str(existing.name or "").strip() or str(existing.name or "").strip() == ip
            ):
                existing.name = printer.name
            if str(printer.user or "").strip():
                existing.user = printer.user
            if str(printer.password or "").strip():
                existing.password = printer.password
            if str(printer.printer_type or "").strip() and (
                self._printer_type(existing.printer_type) in {"", "unknown"}
                or self._printer_type(printer.printer_type) == "toshiba"
            ):
                existing.printer_type = printer.printer_type
            if str(printer.status or "").strip():
                existing.status = printer.status
            if str(printer.mac_address or "").strip() and not str(existing.mac_address or "").strip():
                existing.mac_address = printer.mac_address
        return ordered

    def _agent_runtime_metadata(self) -> dict[str, object]:
        version = ""
        if self._updater is not None:
            version = str(self._updater.status().get("current_version", "") or "")
        local_ip = self._resolve_local_ip()
        gateway_ip = self._resolve_default_gateway()
        gateway_mac = self._resolve_gateway_mac(gateway_ip) if gateway_ip else ""
        ftp_ports: list[str] = []
        ftp_sites: list[dict[str, object]] = []
        try:
            share_manager = getattr(self._ricoh_service, "share_manager", None)
            if share_manager is not None and hasattr(share_manager, "list_ftp_sites"):
                site_rows: list[dict[str, Any]] = []
                ports = []
                for site in share_manager.list_ftp_sites():
                    port = int(site.get("port", 0) or 0)
                    if port > 0:
                        ports.append(port)
                    site_rows.append(
                        {
                            "name": str(site.get("name", "") or ""),
                            "path": str(site.get("path", "") or ""),
                            "port": port,
                            "ftp_url": str(site.get("ftp_url", "") or ""),
                            "ftp_user": str(site.get("ftp_user", "") or ""),
                            "ftp_password": str(site.get("ftp_password", "") or ""),
                            "running": bool(site.get("running", False)),
                            "state": str(site.get("state", "configured") or "configured"),
                            "error": str(site.get("error", "") or ""),
                        }
                    )
                if ports:
                    ftp_ports = [str(port) for port in sorted(set(ports))]
                if site_rows:
                    ftp_sites = sorted(
                        site_rows,
                        key=lambda item: (
                            int(item.get("port", 0) or 0),
                            str(item.get("name", "") or ""),
                        ),
                    )
        except Exception:  # noqa: BLE001
            ftp_ports = []
            ftp_sites = []
        return {
            "app_version": version,
            "run_mode": self._run_mode,
            "web_port": self._web_port,
            "local_ip": local_ip,
            "gateway_ip": gateway_ip,
            "gateway_mac": gateway_mac,
            "subnet_cidr": self._subnet_hint(local_ip),
            "ftp_ports": ",".join(ftp_ports),
            "ftp_sites": ftp_sites,
            "scan_auto_open_file": self._config.get_bool("polling.scan_auto_open_file", True),
            "scan_auto_open_dir": self._config.get_bool("polling.scan_auto_open_dir", True),
            "gds_status": self._get_gds_status(),
        }

    def _ensure_and_register_ssh_key(self, lead: str, agent_uid: str) -> None:
        try:
            from agent.services.tunnel_manager import TunnelManager
            tm = TunnelManager(self._config)
            pub_key = tm.get_public_key_content()
            if not pub_key:
                LOGGER.error("[PollingBridge] SSH public key content is empty!")
                return
                
            base_url = self._polling_base_url()
            token = self._config.get_string("polling.token").strip()
            headers = {"Content-Type": "application/json", "X-Lead-Token": token}
            url = f"{base_url}/api/agents/{agent_uid}/register-ssh-key"
            payload = {
                "lead": lead,
                "public_key": pub_key
            }
            LOGGER.info("[PollingBridge] Registering SSH public key with VPS. URL=%s, KeyLength=%d", url, len(pub_key))
            resp = self._api_client.session.post(url, json=payload, headers=headers, timeout=15)
            resp.raise_for_status()
            LOGGER.info("[PollingBridge] SSH public key registered successfully on VPS.")
        except Exception as exc:
            LOGGER.error("[PollingBridge] Failed to register SSH public key on VPS: %s", exc)

    def _get_gds_status(self) -> str:
        """Check GoxDriverService status: running | stopped | not_installed | unknown"""
        try:
            import win32file as _w32f
            import pywintypes as _pwt
            PIPE_NAME = r"\\.\pipe\GoxDriverService"
            try:
                h = _w32f.CreateFile(PIPE_NAME, _w32f.GENERIC_READ | _w32f.GENERIC_WRITE,
                                     0, None, _w32f.OPEN_EXISTING, 0, None)
                _w32f.CloseHandle(h)
                return "running"
            except _pwt.error as e:
                if e.winerror == 2:  # pipe not found
                    # Check if service is installed but stopped
                    import subprocess
                    r = subprocess.run(
                        ["sc", "query", "GoxDriverService"],
                        capture_output=True, text=True,
                        **no_window_subprocess_kwargs(),
                    )
                    if r.returncode == 0:
                        return "stopped"
                    return "not_installed"
                return "unknown"
        except ImportError:
            return "unknown"
        except Exception:
            return "unknown"


    def is_configured(self) -> bool:
        return bool(self._config.get_string("polling.url").strip()) and bool(self._config.get_string("polling.lead").strip()) and bool(
            self._config.get_string("polling.token").strip()
        )

    def _config_issues(self) -> list[str]:
        issues: list[str] = []
        if not self._config.get_string("polling.url").strip():
            issues.append("missing polling.url")
        if not self._config.get_string("polling.lead").strip():
            issues.append("missing polling.lead")
        if not self._config.get_string("polling.token").strip():
            issues.append("missing polling.token")
        return issues

    @staticmethod
    def _now_iso() -> str:
        return datetime.now(timezone.utc).isoformat()

    @staticmethod
    def _is_valid_lan_ipv4(value: str) -> bool:
        text = str(value or "").strip()
        parts = text.split(".")
        if len(parts) != 4:
            return False
        try:
            octets = [int(part) for part in parts]
        except Exception:  # noqa: BLE001
            return False
        if any(o < 0 or o > 255 for o in octets):
            return False
        if octets[0] == 127 or octets[0] == 0:
            return False
        if octets[0] == 169 and octets[1] == 254:
            return False
        if octets[0] == 100 and 64 <= octets[1] <= 127:
            return False
        return True

    @staticmethod
    def _ipv4_scope_score(value: str) -> int:
        text = str(value or "").strip()
        if not PollingBridge._is_valid_lan_ipv4(text):
            return -1
        octets = [int(part) for part in text.split(".")]
        if octets[0] == 10:
            return 300
        if octets[0] == 192 and octets[1] == 168:
            return 400
        if octets[0] == 172 and 16 <= octets[1] <= 31:
            return 350
        return 200

    @staticmethod
    def _resolve_local_ip() -> str:
        candidates: list[str] = []

        def _push(value: str) -> None:
            text = str(value or "").strip()
            if text and text not in candidates:
                candidates.append(text)

        hostname = socket.gethostname()
        try:
            host_info = socket.gethostbyname_ex(hostname)
            for value in host_info[2]:
                _push(value)
        except Exception:  # noqa: BLE001
            pass

        try:
            for info in socket.getaddrinfo(hostname, None, family=socket.AF_INET):
                _push(str(info[4][0] or "").strip())
        except Exception:  # noqa: BLE001
            pass

        for probe_ip in ("8.8.8.8", "1.1.1.1", "192.168.1.1"):
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
                    sock.connect((probe_ip, 80))
                    _push(sock.getsockname()[0])
            except Exception:  # noqa: BLE001
                continue

        try:
            script = r"""
$ErrorActionPreference='SilentlyContinue'
Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -and $_.IPAddress -ne '127.0.0.1' -and $_.IPAddress -ne '0.0.0.0' } |
  Select-Object IPAddress,InterfaceAlias,PrefixOrigin,AddressState |
  ConvertTo-Json -Depth 4
"""
            result = subprocess.run(
                ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
                capture_output=True,
                text=True,
                timeout=8,
                check=True,
                **no_window_subprocess_kwargs(),
            )
            payload = json.loads(result.stdout or "[]")
            if isinstance(payload, dict):
                payload = [payload]
            if isinstance(payload, list):
                for item in payload:
                    if not isinstance(item, dict):
                        continue
                    ip = str(item.get("IPAddress", "") or "").strip()
                    if ip:
                        _push(ip)
        except Exception:  # noqa: BLE001
            pass

        best_ip = ""
        best_score = -1
        for candidate in candidates:
            score = PollingBridge._ipv4_scope_score(candidate)
            if score > best_score:
                best_ip = candidate
                best_score = score
        return best_ip or ""

    def polling_when_ip_change(self) -> None:
        if not self._ip_change_lock.acquire(blocking=False):
            LOGGER.debug("[polling_when_ip_change] Already running, skipping concurrent run.")
            return
        try:
            current_ip = self._resolve_local_ip()
            if not current_ip:
                LOGGER.warning("[polling_when_ip_change] Cannot resolve local IP.")
                return

            stored_ip = self._config.get_string("pc_ip", "").strip()
            if not stored_ip:
                LOGGER.info("[polling_when_ip_change] pc_ip in settings.json is empty. Initializing with %s", current_ip)
                self._config.set_value("pc_ip", current_ip)
                return

            if current_ip == stored_ip:
                LOGGER.debug("[polling_when_ip_change] IP is unchanged (%s). Skipping.", current_ip)
                return

            LOGGER.info("[polling_when_ip_change] IP change detected: old=%s, new=%s", stored_ip, current_ip)
            self._config.set_value("pc_ip", current_ip)

            # Retrieve copiers
            printers = self._load_printers()
            if not printers:
                LOGGER.info("[polling_when_ip_change] No printers/copiers found.")
                return

            ftp_user = self._config.get_string("ftp_user", "goxprint")
            ftp_pass = self._config.get_string("ftp_pass", "goxprint")
            fields = {
                "folderAuthUserNameIn": ftp_user,
                "folderAuthUserName": ftp_user,
                "folderPasswordIn": ftp_pass,
                "wk_folderPasswordIn": ftp_pass,
                "folderPasswordConfirmIn": ftp_pass,
                "wk_folderPasswordConfirmIn": ftp_pass,
            }

            for printer in printers:
                if self._printer_type(printer.printer_type) != "ricoh":
                    continue

                LOGGER.info("[polling_when_ip_change] Checking address book on copier %s (IP=%s)...", printer.name, printer.ip)
                session = None
                try:
                    session = self._ricoh_service.create_http_client(printer, authenticated=True)
                    payload = self._ricoh_service.process_address_list(printer, session=session)
                    entries = payload.get("address_list", [])

                    for entry in entries:
                        folder = str(entry.get("folder", "") or "").strip()
                        if folder and ("ftp://" in folder or folder.startswith("ftp:")) and stored_ip in folder:
                            new_folder = folder.replace(stored_ip, current_ip)
                            reg_no = str(entry.get("registration_no", "")).strip()
                            name = str(entry.get("name", "") or "").strip()
                            email = str(entry.get("email_address", "") or "").strip()

                            LOGGER.info("[polling_when_ip_change] Modifying FTP destination for %s (IP=%s) entry %s: name='%s' path=%s -> %s",
                                        printer.name, printer.ip, reg_no, name, folder, new_folder)

                            res = self._ricoh_service.modify_address_user_wizard(
                                printer=printer,
                                registration_no=reg_no,
                                name=name,
                                email=email,
                                folder=new_folder,
                                fields=fields,
                                session=session
                            )
                            if res.get("ok"):
                                LOGGER.info("[polling_when_ip_change] Success updating copier %s entry %s to folder %s",
                                            printer.ip, reg_no, new_folder)
                            else:
                                LOGGER.warning("[polling_when_ip_change] Failed updating copier %s entry %s: %s",
                                               printer.ip, reg_no, res)
                except Exception as e:
                    LOGGER.error("[polling_when_ip_change] Error checking/updating copier %s (IP=%s): %s",
                                 printer.name, printer.ip, e, exc_info=True)
                finally:
                    if session:
                        try:
                            self._ricoh_service._reset_web_session(session, printer)
                            session.close()
                        except Exception:
                            pass
        except Exception as global_exc:
            LOGGER.error("[polling_when_ip_change] Global error: %s", global_exc, exc_info=True)
        finally:
            self._ip_change_lock.release()

    def _ip_change_polling_loop(self) -> None:
        LOGGER.info("IP change polling worker loop started")
        # Run immediately on start
        try:
            self.polling_when_ip_change()
        except Exception as exc:
            LOGGER.warning("Initial polling_when_ip_change call failed: %s", exc)

        while not self._stop_event.is_set():
            # Wait 1 hour (3600 seconds) checking stop event every second
            for _ in range(3600):
                if self._stop_event.is_set():
                    break
                time.sleep(1.0)
            
            if self._stop_event.is_set():
                break
                
            try:
                self.polling_when_ip_change()
            except Exception as exc:
                LOGGER.warning("Periodic polling_when_ip_change call failed: %s", exc)

    @staticmethod
    def _normalize_mac(value: str) -> str:
        text = str(value or "").strip().replace("-", ":").upper()
        if not text:
            return ""
        if not re.fullmatch(r"[0-9A-F:]{17}", text):
            return ""
        parts = text.split(":")
        if len(parts) != 6 or any(len(part) != 2 for part in parts):
            return ""
        if text == "00:00:00:00:00:00":
            return ""
        return text

    @staticmethod
    def _sanitize_lan_token(value: str) -> str:
        text = str(value or "").strip()
        if not text:
            return ""
        text = text.replace("-", "_").replace(":", "_").replace(".", "_")
        text = re.sub(r"[^A-Za-z0-9_]+", "_", text)
        text = re.sub(r"_+", "_", text).strip("_")
        return text

    @classmethod
    def _compose_lan_uid(cls, lead: str, gateway_mac: str, gateway_ip: str) -> str:
        lead_token = cls._sanitize_lan_token(lead)
        mac_token = cls._sanitize_lan_token(cls._normalize_mac(gateway_mac))
        ip_token = cls._sanitize_lan_token(cls._normalize_ipv4(gateway_ip))
        if lead_token and mac_token and ip_token:
            return f"{lead_token}_{mac_token}_{ip_token}"
        return ""

    def _load_neighbor_mac_map(self) -> dict[str, str]:
        script = r"""
$ErrorActionPreference='Stop'
Get-NetNeighbor -AddressFamily IPv4 |
  Select-Object IPAddress,LinkLayerAddress,State |
  ConvertTo-Json -Depth 4
"""
        try:
            result = subprocess.run(
                ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
                capture_output=True,
                text=True,
                timeout=8,
                check=True,
                **no_window_subprocess_kwargs(),
            )
            payload = json.loads(result.stdout or "[]")
            if isinstance(payload, dict):
                payload = [payload]
            if isinstance(payload, list):
                mapping: dict[str, str] = {}
                for item in payload:
                    if not isinstance(item, dict):
                        continue
                    ip = str(item.get("IPAddress", "") or "").strip()
                    mac = self._normalize_mac(str(item.get("LinkLayerAddress", "") or ""))
                    if ip and mac:
                        mapping[ip] = mac
                if mapping:
                    return mapping
        except Exception:  # noqa: BLE001
            pass

        try:
            result = subprocess.run(
                ["arp", "-a"],
                capture_output=True,
                text=True,
                timeout=8,
                check=True,
            )
        except Exception:  # noqa: BLE001
            return {}

        mapping: dict[str, str] = {}
        for line in result.stdout.splitlines():
            match = re.search(r"\b(\d{1,3}(?:\.\d{1,3}){3})\s+([0-9a-fA-F:-]{17})\s+\w+", line)
            if not match:
                continue
            ip = match.group(1)
            mac = self._normalize_mac(match.group(2))
            if mac:
                mapping[ip] = mac
        return mapping

    def interval_seconds(self) -> int:
        raw = self._config.get_string("polling.device_interval_seconds", self._config.get_string("polling.interval_seconds", "1")).strip()
        try:
            value = int(raw)
            return max(1, value)
        except Exception:  # noqa: BLE001
            return 1

    def control_interval_seconds(self) -> float:
        raw = self._config.get_string("polling.control_interval_seconds", "1").strip()
        try:
            value = float(raw)
            return max(0.1, value)
        except Exception:
            return 1.0

    def scan_enabled(self) -> bool:
        return self._config.get_bool("polling.scan_enabled", True)

    def scan_interval_seconds(self) -> int:
        return self.interval_seconds()

    def _scan_dirs(self) -> list[str]:
        raw = self._config.get_string("polling.scan_dirs", "").strip()
        if not raw:
            return ["storage/scans/inbox"]
        parts = re.split(r"[,;\n]+", raw)
        cleaned = [str(p).strip() for p in parts if str(p).strip()]
        return cleaned or ["storage/scans/inbox"]

    def _scan_recursive(self) -> bool:
        return False

    def start(self) -> tuple[bool, str]:
        if not self.is_configured():
            issues = ", ".join(self._config_issues()) or "unknown"
            LOGGER.warning("Polling bridge not configured: %s", issues)
            return False, f"Polling not configured ({issues})"

        if self._thread and self._thread.is_alive() and self._control_thread and self._control_thread.is_alive():
            LOGGER.info("Polling bridge is already running")
            return True, "Polling already running"

        self._stop_event.clear()
        
        if not self._thread or not self._thread.is_alive():
            self._thread = threading.Thread(target=self._worker, daemon=True, name="polling-bridge")
            self._thread.start()
            LOGGER.info("Device polling thread initialized")
            
        if not self._control_thread or not self._control_thread.is_alive():
            self._control_thread = threading.Thread(target=self._control_loop, daemon=True, name="polling-control")
            self._control_thread.start()
            LOGGER.info("Control polling thread initialized")

        if not self._ip_change_thread or not self._ip_change_thread.is_alive():
            self._ip_change_thread = threading.Thread(target=self._ip_change_polling_loop, daemon=True, name="polling-ip-change")
            self._ip_change_thread.start()
            LOGGER.info("IP change polling thread initialized")

        self._last_started_at = self._now_iso()
        return True, "Polling started"

    def stop(self) -> None:
        self._stop_event.set()
        self._trigger_event.set()
        try:
            if self._thread and self._thread.is_alive():
                self._thread.join(timeout=3)
        except Exception:  # noqa: BLE001
            pass
        try:
            if self._control_thread and self._control_thread.is_alive():
                self._control_thread.join(timeout=3)
        except Exception:  # noqa: BLE001
            pass
        try:
            if self._ip_change_thread and self._ip_change_thread.is_alive():
                self._ip_change_thread.join(timeout=3)
        except Exception:  # noqa: BLE001
            pass
        LOGGER.info("Polling bridge stop requested")

    def trigger_once(self) -> tuple[bool, str]:
        if not self._config.get_bool("polling.enabled", False) or not self._config.get_bool("polling.device_enabled", True):
            return False, "Device polling is disabled"
        if not self.is_configured():
            issues = ", ".join(self._config_issues()) or "unknown"
            return False, f"Polling not configured ({issues})"
        if not (self._thread and self._thread.is_alive()):
            ok, message = self.start()
            if not ok:
                return False, message
        self._trigger_event.set()
        LOGGER.info("Polling trigger requested: immediate next cycle")
        return True, "Trigger queued"

    def status(self) -> dict[str, object]:
        issues = self._config_issues()
        device_running = bool(self._thread and self._thread.is_alive())
        control_running = bool(self._control_thread and self._control_thread.is_alive())
        return {
            "configured": self.is_configured(),
            "config_issues": issues,
            "enabled": self._config.get_bool("polling.enabled", False),
            "device_enabled": self._config.get_bool("polling.device_enabled", True),
            "control_enabled": self._config.get_bool("polling.control_enabled", True),
            "device_running": device_running,
            "control_running": control_running,
            "running": device_running or control_running,
            "interval_seconds": self.interval_seconds(),
            "control_interval_seconds": self.control_interval_seconds(),
            "url": self._config.get_string("polling.url"),
            "lead": self._config.get_string("polling.lead"),
            "last_started_at": self._last_started_at,
            "last_cycle_at": self._last_cycle_at,
            "last_success_at": self._last_success_at,
            "last_error": self._last_error,
            "last_cycle_total_printers": self._last_cycle_total_printers,
            "last_cycle_ricoh_printers": self._last_cycle_ricoh_printers,
            "last_cycle_sent": self._last_cycle_sent,
            "last_cycle_failed": self._last_cycle_failed,
            "last_control_pull_at": getattr(self, "_last_control_pull_at", ""),
            "last_control_total": getattr(self, "_last_control_total", 0),
            "last_control_apply_error": getattr(self, "_last_control_apply_error", ""),
            "last_ftp_control_pull_at": getattr(self, "_last_ftp_control_pull_at", ""),
            "last_ftp_control_total": getattr(self, "_last_ftp_control_total", 0),
            "last_ftp_control_apply_error": getattr(self, "_last_ftp_control_apply_error", ""),
            "resolved_lan_uid": getattr(self, "_resolved_lan_uid", ""),
            "scan_enabled": self.scan_enabled(),
            "scan_running": device_running if self.scan_enabled() else False,
            "scan_interval_seconds": self.scan_interval_seconds(),
            "scan_dirs": self._scan_dirs(),
            "scan_last_cycle_at": self._scan_last_cycle_at,
            "scan_last_detected_at": self._scan_last_detected_at,
            "scan_last_detected_file": self._scan_last_detected_file,
            "scan_last_detected_size": self._scan_last_detected_size,
            "scan_last_detected_status": self._scan_last_detected_status,
            "scan_last_upload_at": self._scan_last_upload_at,
            "scan_last_upload_file": self._scan_last_upload_file,
            "scan_last_upload_status": self._scan_last_upload_status,
            "scan_last_upload_drive_path": self._scan_last_upload_drive_path,
            "scan_last_error": self._scan_last_error,
            "scan_uploaded_total": self._scan_uploaded_total,
            "scan_failed_total": self._scan_failed_total,
            "scan_pending_total": self._scan_pending_total,
            "release_last_check_at": self._release_last_check_at,
            "release_last_error": self._release_last_error,
            "release_status": self._updater.status() if self._updater is not None else {},
            "recent_commands": getattr(self, "_recent_commands", []),
        }

    def _load_printers(self) -> list[Printer]:
        try:
            scanner = SubnetScanner(max_workers=100)
            scan_rows = scanner.scan_subnet()
            neighbor_mac_map = self._load_neighbor_mac_map()
            printers: list[Printer] = []
            active_rows: list[tuple[str, dict[str, object]]] = []
            seen: set[str] = set()
            for row in scan_rows:
                if not isinstance(row, dict):
                    continue
                ip = str(row.get("ip", "") or "").strip()
                if not ip or ip in seen:
                    continue
                seen.add(ip)
                active_rows.append((ip, row))
                printer_type = self._printer_type(str(row.get("printer_type", "") or ""))
                if printer_type not in {"ricoh", "toshiba"}:
                    continue
                mac = self._resolve_scanned_mac(ip, row, neighbor_mac_map, preferred_type=printer_type)
                discovered = self._probe_discovered_printer(ip=ip, mac=mac, preferred_type=printer_type)
                if discovered is None:
                    discovered = Printer(
                        id=0,
                        name=ip,
                        ip=ip,
                        user="",
                        password="",
                        printer_type=printer_type,
                        status="online",
                        mac_address=mac,
                    )
                printers.append(discovered)
                if not mac:
                    LOGGER.warning(
                        "Polling MAC unresolved for ip=%s type=%s (UI may still resolve from separate scan path)",
                        ip,
                        printer_type,
                    )
            if not printers and active_rows:
                LOGGER.info(
                    "Polling local scan found %s active hosts but no classified printer hits; probing device-info fallback",
                    len(active_rows),
                )
                for ip, row in self._fallback_discovery_candidates(active_rows):
                    preferred_type = self._printer_type(str(row.get("printer_type", "") or ""))
                    mac = self._resolve_scanned_mac(ip, row, neighbor_mac_map, preferred_type=preferred_type)
                    discovered = self._probe_discovered_printer(ip=ip, mac=mac, preferred_type=preferred_type)
                    if discovered is None:
                        continue
                    printers.append(discovered)
                    if not mac:
                        LOGGER.warning(
                            "Polling fallback MAC unresolved for ip=%s type=%s (printer was detected via device info)",
                            ip,
                            discovered.printer_type,
                        )
            if not printers and self._last_discovered_printers:
                printers = list(self._last_discovered_printers)
                LOGGER.debug(
                    "Polling bridge using cached printer list: count=%s",
                    len(printers),
                )
            elif not printers:
                try:
                    cached = self._api_client.get_printers()
                    if cached:
                        printers = list(cached)
                        LOGGER.info(
                            "Polling bridge using server printer fallback: count=%s",
                            len(printers),
                        )
                except Exception as exc:  # noqa: BLE001
                    LOGGER.debug("Polling server printer fallback failed: %s", exc)
            printers = self._merge_server_printers(printers)
            ricoh_count = sum(1 for printer in printers if self._printer_type(printer.printer_type) == "ricoh")
            toshiba_count = sum(1 for printer in printers if self._printer_type(printer.printer_type) == "toshiba")
            LOGGER.debug(
                "Polling bridge printers source=local_scan count=%s ricoh=%s toshiba=%s",
                len(printers),
                ricoh_count,
                toshiba_count,
            )
            if printers:
                self._last_discovered_printers = list(printers)
            return printers
        except Exception as exc:  # noqa: BLE001
            LOGGER.warning("Polling bridge local scan failed: %s", exc)
            if self._last_discovered_printers:
                LOGGER.info(
                    "Polling bridge falling back to cached printers after scan error: count=%s",
                    len(self._last_discovered_printers),
                )
                return list(self._last_discovered_printers)
            try:
                cached = self._api_client.get_printers()
                if cached:
                    LOGGER.info(
                        "Polling bridge falling back to server printer list after scan error: count=%s",
                        len(cached),
                    )
                    self._last_discovered_printers = list(cached)
                    return cached
            except Exception as fallback_exc:  # noqa: BLE001
                LOGGER.debug("Polling bridge server printer fallback after scan error failed: %s", fallback_exc)
            return []

    def _post_payload(self, payload: dict) -> dict:
        self._write_last_payload(payload)
        base_url = self._polling_base_url()
        if not base_url:
            raise ValueError("polling.url is not configured")
        url = f"{base_url}/api/polling"
        token = self._config.get_string("polling.token").strip()
        headers = {"Content-Type": "application/json", "X-Lead-Token": token}
        last_exc: Exception | None = None
        for attempt in range(1, 4):
            try:
                resp = requests.post(url, json=payload, headers=headers, timeout=(5, 30))
                resp.raise_for_status()
                try:
                    data = resp.json()
                    return data if isinstance(data, dict) else {"status_code": resp.status_code}
                except Exception:  # noqa: BLE001
                    return {"status_code": resp.status_code}
            except Exception as exc:  # noqa: BLE001
                last_exc = exc
                if attempt < 3:
                    LOGGER.warning("Polling post failed (attempt %s/3): %s", attempt, exc)
                    time.sleep(2)
        if last_exc is not None:
            raise last_exc

    @staticmethod
    def _write_last_payload(payload: dict) -> None:
        LOGGER.debug("Polling payload kept in-memory only; not writing local snapshot")

    def _check_and_update_scripts(self, remote_scripts: dict[str, str]) -> None:
        if remote_scripts is None or not isinstance(remote_scripts, dict):
            return
        
        import os
        from pathlib import Path
        temp_dir = os.environ.get("TEMP")
        if temp_dir:
            scripts_dir = Path(temp_dir) / "GoPrinxAgent" / "scripts"
        else:
            import tempfile
            scripts_dir = Path(tempfile.gettempdir()) / "GoPrinxAgent" / "scripts"
            
        try:
            scripts_dir.mkdir(parents=True, exist_ok=True)
        except Exception:
            pass
            
        # Clean up local scripts that are not present in remote_scripts
        updated_any = False
        for item in scripts_dir.glob("*.py"):
            if item.name not in remote_scripts:
                try:
                    LOGGER.info("Deleting obsolete local script: %s", item.name)
                    item.unlink()
                    updated_any = True
                except Exception as del_exc:
                    LOGGER.warning("Failed to delete obsolete script %s: %s", item.name, del_exc)
                    # If file is locked, try to truncate it to 0 bytes so it becomes empty/inactive
                    try:
                        with open(item, "w") as f:
                            pass
                        LOGGER.info("Successfully truncated obsolete local script: %s", item.name)
                        updated_any = True
                    except Exception as trunc_exc:
                        LOGGER.warning("Failed to truncate obsolete script %s: %s", item.name, trunc_exc)

        base_url = self._polling_base_url()
        if not base_url:
            return
            
        token = self._config.get_string("polling.token").strip()
        headers = {"X-Lead-Token": token}
        
        import hashlib
        
        for name, expected_hash in remote_scripts.items():
            script_path = scripts_dir / name
            current_hash = ""
            if script_path.exists():
                try:
                    current_hash = hashlib.md5(script_path.read_bytes()).hexdigest()
                except Exception:
                    pass
            
            if current_hash != expected_hash:
                LOGGER.info("Script %s needs update (local hash: %s, remote hash: %s)", name, current_hash, expected_hash)
                script_url = f"{base_url}/static/releases/{name}"
                try:
                    resp = requests.get(script_url, headers=headers, timeout=15)
                    if resp.status_code == 200:
                        script_path.write_bytes(resp.content)
                        LOGGER.info("Successfully updated dynamic script: %s", name)
                        updated_any = True
                    else:
                        LOGGER.warning("Failed to download script %s: status %s", name, resp.status_code)
                except Exception as exc:
                    LOGGER.warning("Error downloading script %s: %s", name, exc)
                    
        if updated_any:
            LOGGER.info("Dynamic scripts updated. Re-compiling...")
            try:
                from agent.main import load_dynamic_scripts
                load_dynamic_scripts()
            except Exception as exc:
                LOGGER.warning("Failed to reload dynamic scripts: %s", exc)

    @staticmethod
    def _normalize_ipv4(value: str) -> str:
        text = str(value or "").strip()
        if not re.fullmatch(r"(\d{1,3}\.){3}\d{1,3}", text):
            return ""
        parts = text.split(".")
        if any(int(p) > 255 for p in parts):
            return ""
        return ".".join(str(int(p)) for p in parts)

    @staticmethod
    def _subnet_hint(ipv4: str) -> str:
        ip = PollingBridge._normalize_ipv4(ipv4)
        if not ip:
            return ""
        parts = ip.split(".")
        return ".".join(parts[:3]) + ".0/24"

    @staticmethod
    def _mac_address() -> str:
        node = uuid.getnode()
        raw = f"{node:012x}".upper()
        return ":".join(raw[i : i + 2] for i in range(0, 12, 2))

    def _resolve_lan_from_server(self, printer_macs: list[str]) -> str:
        """
        Ask the server: "anyone on this lead already owns these MAC addresses?"
        Returns lan_uid string if found, empty string otherwise.
        Called during agent startup before computing local fingerprint so that
        all agents on the same LAN automatically share the same lan_uid.
        """
        base_url = self._polling_base_url()
        if not base_url:
            return ""
        lead = self._config.get_string("polling.lead", "").strip()
        token = self._config.get_string("polling.token", "").strip()
        if not lead or not token:
            return ""
        clean = [m for m in (self._normalize_mac(m) for m in printer_macs) if m]
        if not clean:
            return ""
        try:
            url = f"{base_url}/api/agent/resolve-lan"
            payload = {
                "lead": lead,
                "mac_ids": clean,
                "subnet": self._subnet_hint(self._resolve_local_ip()),   # e.g. "192.168.1.0/24"
                "gateway_ip": self._resolve_default_gateway(),           # e.g. "192.168.1.1"
                "gateway_mac": self._resolve_gateway_mac(self._resolve_default_gateway()),
            }
            headers = {"Content-Type": "application/json", "X-Lead-Token": token}
            resp = requests.post(url, json=payload, headers=headers, timeout=(4, 10))
            if resp.status_code == 200:
                data = resp.json()
                server_uid = str(data.get("lan_uid") or "").strip()
                if server_uid:
                    LOGGER.info(
                        "resolve-lan: server matched mac=%s -> lan_uid=%s",
                        data.get("matched_mac"), server_uid,
                    )
                    return server_uid
        except Exception as exc:  # noqa: BLE001
            LOGGER.debug("resolve-lan server lookup failed (non-critical): %s", exc)
        return ""

    @staticmethod
    def _resolve_default_gateway() -> str:
        script = r"""
$ErrorActionPreference='SilentlyContinue'
$r = Get-NetRoute -DestinationPrefix '0.0.0.0/0' -AddressFamily IPv4 |
  Sort-Object RouteMetric,InterfaceMetric |
  Select-Object -First 1 -ExpandProperty NextHop
if ($r) { $r }
"""
        try:
            result = subprocess.run(
                ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
                capture_output=True,
                text=True,
                timeout=6,
                check=False,
                **no_window_subprocess_kwargs(),
            )
            val = PollingBridge._normalize_ipv4(result.stdout.strip())
            if val:
                return val
        except Exception:  # noqa: BLE001
            pass

        # Fallback to route print command when powershell fails or is blocked
        try:
            result = subprocess.run(
                ["route", "print", "0.0.0.0"],
                capture_output=True,
                text=True,
                timeout=6,
                check=False,
                **no_window_subprocess_kwargs(),
            )
            for line in (result.stdout or "").splitlines():
                parts = line.strip().split()
                if len(parts) >= 4 and parts[0] == "0.0.0.0" and parts[1] == "0.0.0.0":
                    gateway = PollingBridge._normalize_ipv4(parts[2])
                    if gateway and gateway != "0.0.0.0":
                        return gateway
        except Exception:  # noqa: BLE001
            pass
        return ""



    @staticmethod
    def _resolve_gateway_mac(gateway_ip: str) -> str:
        ip = PollingBridge._normalize_ipv4(gateway_ip)
        if not ip:
            return ""
        script = rf"""
$ErrorActionPreference='SilentlyContinue'
$ip = '{ip}'
$node = (Get-NetNeighbor -AddressFamily IPv4 | Where-Object {{ $_.IPAddress -eq $ip }} | Select-Object -First 1 -ExpandProperty LinkLayerAddress)
if ($node) {{ $node }}
"""
        try:
            result = subprocess.run(
                ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
                capture_output=True,
                text=True,
                timeout=6,
                check=False,
                **no_window_subprocess_kwargs(),
            )
            mac = PollingBridge._normalize_mac(result.stdout.strip())
            if mac:
                return mac
        except Exception:  # noqa: BLE001
            pass
        try:
            result = subprocess.run(
                ["arp", "-a", ip],
                capture_output=True,
                text=True,
                timeout=6,
                check=False,
                **no_window_subprocess_kwargs(),
            )
            match = re.search(r"\b([0-9a-fA-F]{2}(?:-[0-9a-fA-F]{2}){5})\b", result.stdout or "")
            if not match:
                return ""
            return match.group(1).replace("-", ":").upper()
        except Exception:  # noqa: BLE001
            return ""

    def _resolve_lan_info(self, hostname: str, local_ip: str) -> tuple[str, str]:
        """
        Returns (lan_uid, fingerprint_signature)

        Resolution order:
        1. Derive LAN UID from lead + gateway MAC + gateway IP.
        2. Reuse the last successfully derived LAN UID if the current network
           lookup is temporarily unavailable.

        The agent no longer generates legacy temporary LAN identifiers.
        """
        gateway_ip = self._resolve_default_gateway()
        gateway_mac = self._resolve_gateway_mac(gateway_ip) if gateway_ip else ""
        subnet = self._subnet_hint(local_ip)
        local_mac = self._mac_address()
        lead = self._config.get_string("polling.lead", "").strip()

        lan_core_parts = [
            f"lead={lead}",
            f"subnet={subnet}",
            f"gateway_ip={gateway_ip}",
        ]
        if gateway_mac:
            lan_core_parts.append(f"gateway_mac={gateway_mac}")
        if not gateway_ip and not subnet:
            lan_core_parts.append(f"fallback_local_mac={local_mac}")
            lan_core_parts.append(f"fallback_hostname={hostname}")
        signature = "|".join(lan_core_parts)

        composed_uid = self._compose_lan_uid(lead, gateway_mac, gateway_ip)
        if composed_uid:
            self._resolved_lan_uid = composed_uid
            return composed_uid, signature

        if self._resolved_lan_uid:
            return self._resolved_lan_uid, signature

        return "", signature

    def _polling_base_url(self) -> str:
        raw = self._config.get_string("polling.url").strip()
        if not raw:
            return ""
        parsed = urlparse(raw)
        if not parsed.scheme or not parsed.netloc:
            return ""
        return f"{parsed.scheme}://{parsed.netloc}"

    def _scan_upload_url(self) -> str:
        base = self._polling_base_url()
        if not base:
            return ""
        return f"{base}/api/polling/scan-upload"

    def _check_for_agent_update(self, lead: str, lan_uid: str, agent_uid: str, hostname: str, local_ip: str) -> bool:
        if self._updater is None or not self._config.get_bool("modules.updater.enabled", True) or not self._updater.should_check():
            return False
        base_url = self._polling_base_url()
        token = self._config.get_string("polling.token").strip()
        if not base_url or not token or not lead:
            return False
        self._release_last_check_at = self._now_iso()
        ok, message, restart_required = self._updater.check_remote_release(
            session=self._api_client.session,
            base_url=base_url,
            token=token,
            lead=lead,
            agent_uid=agent_uid,
            lan_uid=lan_uid,
            hostname=hostname,
            local_ip=local_ip,
        )
        if ok:
            self._release_last_error = ""
            LOGGER.info("Agent release check: %s", message)
        else:
            self._release_last_error = message
            LOGGER.warning("Agent release check failed: %s", message)
        if restart_required:
            self._update_staged = True
            # Wait for all currently running commands to finish before shutting down
            while True:
                with self._running_commands_lock:
                    running_count = len(self._running_commands)
                if running_count == 0:
                    break
                LOGGER.info("Delaying agent restart for update: waiting for %d running copier commands to finish...", running_count)
                time.sleep(1.0)

            if self._restart_callback is not None:
                try:
                    self._restart_callback()
                except Exception as exc:  # noqa: BLE001
                    LOGGER.warning("Restart callback failed: %s", exc)
            self._stop_event.set()
            self._trigger_event.set()
            return True
        return False

    def _register_with_server(
        self,
        lead: str,
        lan_uid: str,
        agent_uid: str,
        hostname: str,
        local_ip: str,
        fingerprint: str,
    ) -> str:
        base_url = self._polling_base_url()
        token = self._config.get_string("polling.token").strip()
        if not base_url or not token or not lead:
            return lan_uid
        reg_url = f"{base_url}/api/agent/register"
        reg_payload = {
            "lead": lead,
            "lan_uid": lan_uid,
            "agent_uid": agent_uid,
            "hostname": hostname,
            "local_ip": local_ip,
            "local_mac": self._mac_address(),
            "gateway_ip": self._resolve_default_gateway(),
            "gateway_mac": self._resolve_gateway_mac(self._resolve_default_gateway()),
            "fingerprint_signature": fingerprint,
        }
        reg_payload.update(self._agent_runtime_metadata())
        reg_headers = {"Content-Type": "application/json", "X-Lead-Token": token}
        reg_resp = requests.post(reg_url, json=reg_payload, headers=reg_headers, timeout=20)
        if reg_resp.ok:
            server_data = reg_resp.json()
            server_lan_uid = str(server_data.get("lan_uid") or "").strip()
            if server_lan_uid and server_lan_uid != lan_uid:
                LOGGER.info("Server reassigned lan_uid: %s -> %s", lan_uid, server_lan_uid)
                lan_uid = server_lan_uid
            self._resolved_lan_uid = lan_uid
            
            self._is_master = bool(server_data.get("is_master", False))
            self._emails = server_data.get("emails") if isinstance(server_data.get("emails"), list) else []
            try:
                self._reconcile_scan_address_ftp(self._is_master, self._emails)
            except Exception as ftp_exc:
                LOGGER.warning("FTP reconciliation failed during registration: %s", ftp_exc)
        return lan_uid

    @staticmethod
    def _is_scan_candidate(path: Path) -> bool:
        name = path.name.lower()
        if name.endswith((".tmp", ".part", ".partial", ".crdownload")):
            return False
        return path.is_file()

    @staticmethod
    def _scan_root_label(root: Path) -> str:
        label = str(root.name or root.drive or "scan-root").strip()
        label = re.sub(r"[^A-Za-z0-9._@-]+", "-", label).strip(" -_.")
        return label or "scan-root"

    @staticmethod
    def _relative_scan_path(root: Path, path: Path) -> str:
        try:
            relative = path.resolve().relative_to(root.resolve())
        except Exception:
            try:
                relative = path.relative_to(root)
            except Exception:
                relative = Path(path.name)
        return relative.as_posix()

    def _iter_scan_files(self) -> list[tuple[Path, Path]]:
        files: list[tuple[Path, Path]] = []
        recursive = self._scan_recursive()
        for raw in self._scan_dirs():
            try:
                root = Path(raw).expanduser()
                if not root.exists():
                    continue
                ensure_active_drop_folder(root)
                iterator = root.rglob("*") if recursive else root.glob("*")
                for item in iterator:
                    if self._is_scan_candidate(item):
                        files.append((root, item))
            except Exception:  # noqa: BLE001
                continue
        files.sort(key=lambda item: str(item[1]))
        return files

    @staticmethod
    def _file_fingerprint(path: Path, size: int, mtime_ns: int) -> str:
        return f"{path.resolve()}|{size}|{mtime_ns}"

    def _load_scan_upload_state(self) -> None:
        path = SCAN_UPLOAD_STATE_FILE
        if not path.exists():
            return
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            uploaded = payload.get("uploaded_fingerprints", {}) if isinstance(payload, dict) else {}
            cleaned: dict[str, str] = {}
            if isinstance(uploaded, dict):
                for key, value in uploaded.items():
                    finger = str(key or "").strip()
                    stamp = str(value or "").strip()
                    if finger:
                        cleaned[finger] = stamp
            self._scan_uploaded_fingerprints = cleaned
        except Exception as exc:  # noqa: BLE001
            LOGGER.warning("Failed to load scan upload state: %s", exc)

    def _save_scan_upload_state(self) -> None:
        try:
            items = sorted(
                self._scan_uploaded_fingerprints.items(),
                key=lambda item: item[1],
            )
            if len(items) > MAX_SCAN_UPLOAD_HISTORY:
                items = items[-MAX_SCAN_UPLOAD_HISTORY:]
            payload = {
                "updated_at": self._now_iso(),
                "uploaded_fingerprints": {key: value for key, value in items},
            }
            SCAN_UPLOAD_STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
            SCAN_UPLOAD_STATE_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        except Exception as exc:  # noqa: BLE001
            LOGGER.warning("Failed to save scan upload state: %s", exc)

    def _upload_scan_file(
        self,
        root: Path,
        path: Path,
        fingerprint: str,
        lead: str,
        lan_uid: str,
        agent_uid: str,
        hostname: str,
        local_ip: str,
    ) -> None:
        url = self._scan_upload_url()
        token = self._config.get_string("polling.token").strip()
        if not url or not token:
            raise RuntimeError("Scan upload endpoint/token not configured")
        headers = {"X-Lead-Token": token}
        now_iso = datetime.now(timezone.utc).isoformat()
        rel_path = str(path.resolve())
        relative_scan_path = self._relative_scan_path(root, path)
        data = {
            "lead": lead,
            "lan_uid": lan_uid,
            "agent_uid": agent_uid,
            "hostname": hostname,
            "local_ip": local_ip,
            "timestamp": now_iso,
            "source_path": rel_path,
            "source_root": str(root.resolve()),
            "source_root_label": self._scan_root_label(root),
            "source_relative_path": relative_scan_path,
            "fingerprint": fingerprint,
        }
        with path.open("rb") as fp:
            files = {"file": (path.name, fp, "application/octet-stream")}
            resp = self._api_client.session.post(url, data=data, files=files, headers=headers, timeout=(10, 120))
        resp.raise_for_status()
        payload: dict[str, object] = {}
        if "json" in (resp.headers.get("Content-Type", "").lower()):
            try:
                parsed = resp.json()
                if isinstance(parsed, dict):
                    payload = parsed
            except Exception:  # noqa: BLE001
                payload = {}
        self._scan_uploaded_fingerprints[fingerprint] = now_iso
        self._scan_uploaded_total += 1
        self._scan_last_upload_at = self._now_iso()
        self._scan_last_error = ""
        self._save_scan_upload_state()
        return payload

    def _get_owned_emails(self, is_master: bool, emails: list[dict]) -> list[dict]:
        import socket
        hostname = socket.gethostname().strip().lower()
        owned = []
        for em in (emails or []):
            etype = str(em.get("email_type") or "common").strip().lower()
            if etype == "private":
                epc = str(em.get("pc_name") or "").strip().lower()
                if epc == hostname:
                    owned.append(em)
            else:  # common
                if is_master:
                    owned.append(em)
        return owned

    def _reconcile_scan_address_ftp(self, is_master: bool, emails: list[dict]) -> None:
        if not self._config.get_bool("modules.ftp.enabled", True):
            return
        share_manager = getattr(self._ricoh_service, "share_manager", None)
        if share_manager is None:
            LOGGER.warning("share_manager not available in ricoh_service; skipping FTP reconciliation")
            return

        owned_emails = self._get_owned_emails(is_master, emails)
        LOGGER.debug("Reconciling FTP scan addresses: is_master=%s, total_emails=%d, owned_count=%d", 
                    is_master, len(emails) if emails else 0, len(owned_emails))

        # 1. Fetch current FTP sites
        try:
            current_sites = share_manager.list_ftp_sites()
        except Exception as exc:
            LOGGER.warning("Failed to list FTP sites: %s", exc)
            current_sites = []

        # 1.5. Clean up any obsolete FTP sites starting with "gox_scan_" first
        # so that their ports are freed in the configuration before we search for a new port.
        for site in current_sites:
            name = str(site.get("name") or "")
            if name.startswith("gox_scan_"):
                LOGGER.info("Deleting obsolete/inactive FTP site: %s", name)
                try:
                    share_manager.delete_ftp_site(name)
                except Exception as exc:
                    LOGGER.warning("Failed to delete FTP site %s: %s", name, exc)

        # 2. Get or select single FTP port for 'goxprint'
        ftp_name = "goxprint"
        config_data = load_config()
        
        config_port = None
        val = self._config.get_string("ftp_port")
        if val and val.isdigit():
            config_port = int(val)
                
        if config_port is not None:
            actual_port = config_port
        else:
            # Scan starting from 2130
            actual_port = 2130
            while True:
                existing_by_port = find_site_by_port(config_data, actual_port)
                is_assigned_elsewhere = False
                if existing_by_port:
                    if normalize_site_name(str(existing_by_port.get("name", "") or "")) != normalize_site_name(ftp_name):
                        is_assigned_elsewhere = True
                
                is_physically_bound = False
                if not is_assigned_elsewhere:
                    import socket
                    try:
                        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                            s.bind(('0.0.0.0', actual_port))
                    except Exception:
                        is_physically_bound = True
                
                if not is_assigned_elsewhere and not is_physically_bound:
                    break
                actual_port += 1
            
            # Save port to config
            try:
                self._config.set_value("ftp_port", actual_port)
            except Exception:
                pass

        # Ensure local directory %TEMP%/GoPrinxAgent/ftp exists
        local_dir = user_temp_root() / "ftp"
        try:
            if not local_dir.exists():
                local_dir.mkdir(parents=True, exist_ok=True)
                LOGGER.info("Created scan folder: %s", local_dir)
        except Exception as exc:
            LOGGER.error("Failed to create scan folder %s: %s", local_dir, exc)

        # 3. Ensure single 'goxprint' FTP site exists and points to local_dir
        existing = find_site_by_name(config_data, ftp_name)
        if existing:
            existing_port = int(existing.get("port") or 0)
            existing_path = str(existing.get("path") or "")
            if existing_port != actual_port or Path(existing_path).resolve() != local_dir.resolve():
                LOGGER.info("FTP site %s matches but has different configuration (port %s->%s, path %s->%s). Updating.",
                            ftp_name, existing_port, actual_port, existing_path, local_dir)
                try:
                    share_manager.update_ftp_site(
                        ftp_name,
                        local_path=local_dir,
                        port=actual_port
                    )
                except Exception as exc:
                    LOGGER.warning("Failed to update FTP site %s: %s", ftp_name, exc)
        else:
            LOGGER.info("Creating new FTP site %s on port %d pointing to %s", ftp_name, actual_port, local_dir)
            try:
                share_manager.create_ftp_site(
                    site_name=ftp_name,
                    local_path=local_dir,
                    port=actual_port
                )
            except Exception as exc:
                LOGGER.warning("Failed to create FTP site %s: %s", ftp_name, exc)

    @staticmethod
    def _safe_int(value: object) -> int:
        try:
            return int(str(value or "0").replace(",", "").strip() or "0")
        except Exception:  # noqa: BLE001
            return 0

    def _has_new_scan_counter(self, ip: str, counter_data: dict[str, object]) -> bool:
        ip_key = str(ip or "").strip()
        if not ip_key:
            return False
        scan_bw = self._safe_int(counter_data.get("scanner_send_bw"))
        scan_color = self._safe_int(counter_data.get("scanner_send_color"))
        total_scan = max(0, scan_bw) + max(0, scan_color)
        previous = self._scan_counter_last_by_ip.get(ip_key)
        self._scan_counter_last_by_ip[ip_key] = total_scan
        if previous is None:
            return False
        return total_scan > previous

    def _run_scan_cycle(
        self,
        lead: str,
        lan_uid: str,
        agent_uid: str,
        hostname: str,
        local_ip: str,
        fingerprint: str,
        reason: str = "timer",
    ) -> None:
        if not self._scan_lock.acquire(blocking=False):
            return
        try:
            self._scan_last_cycle_at = self._now_iso()
            files = self._iter_scan_files()
            pending_total = 0
            active_keys: set[str] = set()
            for root, path in files:
                try:
                    stat = path.stat()
                except Exception:  # noqa: BLE001
                    continue
                size = int(stat.st_size or 0)
                mtime_ns = int(getattr(stat, "st_mtime_ns", int(stat.st_mtime * 1_000_000_000)))
                if size <= 0:
                    continue
                key = str(path.resolve())
                active_keys.add(key)
                state = self._scan_file_state.get(key, {"size": -1, "mtime_ns": -1, "stable": 0})
                same = int(state.get("size", -1)) == size and int(state.get("mtime_ns", -1)) == mtime_ns
                previously_seen = int(state.get("size", -1)) >= 0
                stable = int(state.get("stable", 0)) + 1 if same else 0
                state = {"size": size, "mtime_ns": mtime_ns, "stable": stable}
                self._scan_file_state[key] = state
                if not previously_seen:
                    self._scan_last_detected_at = self._now_iso()
                    self._scan_last_detected_file = key
                    self._scan_last_detected_size = size
                    self._scan_last_detected_status = "new"
                    LOGGER.info("Scan file detected: file=%s size=%s reason=%s stage=new", path, size, reason)
                elif not same:
                    self._scan_last_detected_at = self._now_iso()
                    self._scan_last_detected_file = key
                    self._scan_last_detected_size = size
                    self._scan_last_detected_status = "changed"
                    LOGGER.info("Scan file changed: file=%s size=%s reason=%s stage=changed", path, size, reason)
                elif stable == 1:
                    self._scan_last_detected_at = self._now_iso()
                    self._scan_last_detected_file = key
                    self._scan_last_detected_size = size
                    self._scan_last_detected_status = "waiting"
                    LOGGER.info("Scan file pending: file=%s size=%s reason=%s stage=stable-1/2", path, size, reason)
                if stable < 2:
                    pending_total += 1
                    continue
                file_finger = self._file_fingerprint(path=path, size=size, mtime_ns=mtime_ns)
                if file_finger in self._scan_uploaded_fingerprints:
                    continue
                try:
                    self._scan_last_upload_file = key
                    self._scan_last_upload_status = "uploading"
                    self._scan_last_upload_drive_path = ""
                    LOGGER.info("Scan upload start: file=%s size=%s reason=%s", path, size, reason)
                    upload_payload = self._upload_scan_file(root, path, file_finger, lead, lan_uid, agent_uid, hostname, local_ip)
                    drive_sync = upload_payload.get("drive_sync") if isinstance(upload_payload, dict) and isinstance(upload_payload.get("drive_sync"), dict) else {}
                    drive_path = str(drive_sync.get("drive_path", "") or "").strip()
                    self._scan_last_upload_file = key
                    self._scan_last_upload_status = "ok"
                    self._scan_last_upload_drive_path = drive_path
                    LOGGER.info("Scan upload ok: file=%s size=%s reason=%s drive=%s", path, size, reason, drive_path or "-")
                    
                    try:
                        import sys
                        import os
                        import subprocess
                        
                        # Auto open scan file
                        if self._config.get_bool("polling.scan_auto_open_file", True):
                            LOGGER.info("Auto-opening scan file: %s", path)
                            if sys.platform == "win32":
                                os.startfile(str(path))
                            elif sys.platform == "darwin":
                                subprocess.Popen(["open", str(path)])
                            else:
                                subprocess.Popen(["xdg-open", str(path)])
                                
                        # Auto open scan directory
                        if self._config.get_bool("polling.scan_auto_open_dir", True):
                            LOGGER.info("Auto-opening scan directory: %s", path.parent)
                            if sys.platform == "win32":
                                os.startfile(str(path.parent))
                            elif sys.platform == "darwin":
                                subprocess.Popen(["open", str(path.parent)])
                            else:
                                subprocess.Popen(["xdg-open", str(path.parent)])
                    except Exception as open_exc:
                        LOGGER.warning("Failed to auto-open scan file/dir: %s", open_exc)
                except Exception as exc:  # noqa: BLE001
                    self._scan_failed_total += 1
                    pending_total += 1
                    self._scan_last_upload_file = key
                    self._scan_last_upload_status = "failed"
                    self._scan_last_upload_drive_path = ""
                    self._scan_last_error = str(exc)
                    LOGGER.warning("Scan upload failed: file=%s reason=%s error=%s", path, reason, exc)
            stale_keys = [k for k in self._scan_file_state.keys() if k not in active_keys]
            for key in stale_keys:
                self._scan_file_state.pop(key, None)
            self._scan_pending_total = pending_total
        except Exception as exc:  # noqa: BLE001
            self._scan_last_error = str(exc)
            LOGGER.warning("Scan watcher cycle failed: reason=%s error=%s", reason, exc)
        finally:
            self._scan_lock.release()

    def _pull_device_controls(self, lan_uid: str) -> dict[str, Any]:
        base_url = self._polling_base_url()
        if not base_url:
            return {"printer_controls": {}, "agent_commands": []}
        token = self._config.get_string("polling.token").strip()
        lead = self._config.get_string("polling.lead").strip()
        params = {"lead": lead, "lan_uid": lan_uid, "agent_uid": self._agent_uid}
        headers = {"Accept": "application/json", "X-Lead-Token": token}
        url = f"{base_url}/api/polling/controls"
        response = self._api_client.session.get(url, params=params, headers=headers, timeout=20)
        response.raise_for_status()
        payload = response.json()
        rows = payload.get("rows", []) if isinstance(payload, dict) else []
        mapping: dict[str, dict[str, object]] = {}
        if isinstance(rows, list):
            for row in rows:
                if not isinstance(row, dict):
                    continue
                ip = str(row.get("ip", "") or "").strip()
                if not ip:
                    continue
                command = row.get("command") if isinstance(row.get("command"), dict) else None
                mapping[ip] = {
                    "enabled": bool(row.get("enabled", True)),
                    "command": command,
                }
        self._last_control_pull_at = self._now_iso()
        self._last_control_total = len(mapping)
        return {
            "printer_controls": mapping,
            "agent_commands": payload.get("agent_commands", []) if isinstance(payload, dict) else [],
        }

    def _push_inventory(self, printers: list[Printer], hostname: str, local_ip: str, lan_uid: str, fingerprint: str = "") -> None:
        base_url = self._polling_base_url()
        if not base_url:
            return
        token = self._config.get_string("polling.token").strip()
        lead = self._config.get_string("polling.lead").strip()
        agent_uid = self._agent_uid or hostname
        devices: list[dict[str, str]] = []
        for printer in printers:
            devices.append(
                {
                    "printer_name": str(printer.name or "").strip(),
                    "ip": str(printer.ip or "").strip(),
                    "mac_address": str(printer.mac_address or "").strip(),
                    "printer_type": str(printer.printer_type or "").strip(),
                    "status": str(printer.status or "").strip(),
                    "user": str(printer.user or "").strip(),
                }
            )
        payload = {
            "lead": lead,
            "lan_uid": lan_uid,
            "agent_uid": agent_uid,
            "hostname": hostname,
            "local_ip": local_ip,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "devices": devices,
            "fingerprint_signature": fingerprint,
        }
        payload.update(self._agent_runtime_metadata())
        headers = {"Content-Type": "application/json", "X-Lead-Token": token}
        url = f"{base_url}/api/polling/inventory"
        response = self._api_client.session.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

    def _log_control_event(self, printer: Printer, enabled: bool, result: str, detail: str = "") -> None:
        LOGGER.info(
            "Control event: timestamp=%s printer=%s ip=%s enabled=%s action=%s result=%s detail=%s",
            datetime.now(timezone.utc).isoformat(),
            str(printer.name or ""),
            str(printer.ip or ""),
            str(bool(enabled)).lower(),
            "enable" if enabled else "lock",
            result,
            detail,
        )

    def _apply_machine_control(self, printer: Printer, enabled: bool) -> None:
        ip = str(printer.ip or "").strip()
        if not ip:
            return
        retry_after = self._control_retry_after.get(ip)
        if retry_after and retry_after > datetime.now(timezone.utc):
            return
        current = self._applied_controls.get(ip)
        if current is enabled:
            return
        if not str(printer.user or "").strip():
            printer.user = self._config.get_string("test.user", "").strip()
        if not str(printer.password or "").strip():
            printer.password = self._config.get_string("test.password", "").strip()
        action = "enable" if enabled else "lock"
        LOGGER.info("Applying machine control: action=%s name=%s ip=%s", action, printer.name, ip)
        try:
            if enabled:
                self._ricoh_service.enable_machine(printer)
            else:
                self._ricoh_service.lock_machine(printer)
            self._applied_controls[ip] = enabled
            self._control_retry_after.pop(ip, None)
            self._last_control_apply_error = ""
            self._log_control_event(printer, enabled, "ok", "")
        except Exception as exc:  # noqa: BLE001
            cooldown_seconds = 300
            retry_at = datetime.now(timezone.utc) + timedelta(seconds=cooldown_seconds)
            self._control_retry_after[ip] = retry_at
            self._log_control_event(printer, enabled, "error", str(exc))
            LOGGER.warning(
                "Control apply cooldown: name=%s ip=%s retry_after=%s",
                printer.name,
                ip,
                retry_at.isoformat(),
            )
            raise

    def _post_control_result(
        self,
        command_id: int,
        ok: bool,
        error: str = "",
        address_book_data: dict[str, Any] | None = None,
        ftp_host: str = "",
        ftp_port: int | None = None,
        ftp_url: str = "",
        ftp_upload_url: str = "",
        ftp_upload_path: str = "",
        short_name: str = "",
        registration_no: str = "",
        entry_name: str = "",
        source_email: str = "",
    ) -> None:
        base_url = self._polling_base_url()
        if not base_url:
            return
        token = self._config.get_string("polling.token").strip()
        lead = self._config.get_string("polling.lead").strip()
        url = f"{base_url}/api/polling/control-result"
        payload: dict[str, Any] = {
            "lead": lead,
            "command_id": int(command_id),
            "ok": bool(ok),
            "error": str(error or ""),
        }
        if address_book_data:
            payload["address_book_data"] = address_book_data
        # Enriched FTP metadata so VPS can persist accurate folder details
        if ftp_host:
            payload["ftp_host"] = str(ftp_host)
        if ftp_port is not None:
            payload["ftp_port"] = int(ftp_port)
        if ftp_url:
            payload["ftp_url"] = str(ftp_url)
        if ftp_upload_url:
            payload["ftp_upload_url"] = str(ftp_upload_url)
        if ftp_upload_path:
            payload["ftp_upload_path"] = str(ftp_upload_path)
        if short_name:
            payload["short_name"] = str(short_name)
        if registration_no:
            payload["registration_no"] = str(registration_no)
        if entry_name:
            payload["entry_name"] = str(entry_name)
        if source_email:
            payload["source_email"] = str(source_email)
        headers = {"Content-Type": "application/json", "X-Lead-Token": token}
        response = self._api_client.session.post(url, json=payload, headers=headers, timeout=20)
        response.raise_for_status()

    def _make_ftp_short_name(self, email: str) -> str:
        """Generate a short name from an email prefix using config helper."""
        return self._config.get_or_create_short_name(email)

    def _record_ftp_name_mapping(self, short_name: str, email: str) -> None:
        """Persist short_name→email into settings.json using config helper."""
        self._config.record_ftp_name_mapping(short_name, email)

    def _enrich_address_book_entry(
        self,
        addr_result: dict[str, Any],
        registration_no: str,
        ftp_host: str,
        ftp_port: int,
        ftp_url: str,
        ftp_path: str,
    ) -> None:
        """Overwrite folder fields for the newly created entry in addr_result.

        Ricoh AJAX often returns an empty folder string for a newly registered
        FTP destination — this patches the entry in-place using the exact data
        the wizard used, so VPS can store accurate folder_port_no / protocol.
        """
        try:
            address_list = addr_result.get("address_list")
            if not isinstance(address_list, list):
                return
            norm_reg = registration_no.lstrip("0") if registration_no else ""
            for entry in address_list:
                if not isinstance(entry, dict):
                    continue
                entry_reg = str(entry.get("registration_no", "") or "").lstrip("0")
                if entry_reg and entry_reg == norm_reg:
                    # Patch folder fields
                    entry["folder"] = ftp_url
                    entry["folder_path"] = ftp_url
                    LOGGER.info(
                        "[PollingBridge] Enriched address entry reg_no=%s with ftp_host=%s ftp_port=%s path=%s",
                        registration_no, ftp_host, ftp_port, ftp_path,
                    )
                    return
            LOGGER.debug(
                "[PollingBridge] _enrich_address_book_entry: reg_no=%s not found in %d entries",
                registration_no, len(address_list),
            )
        except Exception as exc:
            LOGGER.warning("[PollingBridge] _enrich_address_book_entry failed: %s", exc)

    def _post_command_ack(self, command_id: int) -> None:

        base_url = self._polling_base_url()
        if not base_url:
            return
        token = self._config.get_string("polling.token").strip()
        lead = self._config.get_string("polling.lead").strip()
        url = f"{base_url}/api/polling/command-ack"
        payload = {
            "lead": lead,
            "command_id": int(command_id),
        }
        headers = {"Content-Type": "application/json", "X-Lead-Token": token}
        try:
            response = self._api_client.session.post(url, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            LOGGER.info("[PollingBridge] Sent command ACK for ID=%s", command_id)
        except Exception as ack_exc:
            LOGGER.warning("[PollingBridge] Failed to send command ACK for ID=%s: %s", command_id, ack_exc)

    def _post_command_progress(self, command_id: int, progress_text: str) -> None:
        """Send intermediate progress text for a pending command back to the server."""
        base_url = self._polling_base_url()
        if not base_url:
            return
        token = self._config.get_string("polling.token").strip()
        lead = self._config.get_string("polling.lead").strip()
        url = f"{base_url}/api/polling/command-progress"
        payload = {
            "lead": lead,
            "command_id": int(command_id),
            "progress_text": str(progress_text),
        }
        headers = {"Content-Type": "application/json", "X-Lead-Token": token}
        try:
            self._api_client.session.post(url, json=payload, headers=headers, timeout=10)
        except Exception as exc:
            LOGGER.warning("[PollingBridge] Failed to send progress for ID=%s: %s", command_id, exc)

    def _resolve_ftp_target_printer(self, command: FtpControlCommand, site_name: str) -> tuple[Printer, str]:
        fallback = Printer(
            id=0,
            name=command.printer_name or site_name,
            ip=command.printer_ip,
            user=command.printer_auth_user,
            password=command.printer_auth_password,
            printer_type="ricoh",
            status="online",
            mac_address=command.printer_mac_id,
        )
        normalized_mac = self._normalize_mac(command.printer_mac_id)
        if not normalized_mac:
            return fallback, ""
        try:
            printers = self._load_printers()
        except Exception as exc:  # noqa: BLE001
            return (
                fallback,
                f"Could not refresh printer discovery for mac_id {normalized_mac}; using queued printer IP {command.printer_ip or '-'}. Error: {exc}",
            )
        matched = next(
            (
                item
                for item in printers
                if self._normalize_mac(str(item.mac_address or "")) == normalized_mac
            ),
            None,
        )
        if matched is None:
            return (
                fallback,
                f"Printer mac_id {normalized_mac} was not found in current agent discovery; using queued printer IP {command.printer_ip or '-'}.",
            )
        matched.user = command.printer_auth_user or matched.user
        matched.password = command.printer_auth_password or matched.password
        warning = ""
        if command.printer_ip and matched.ip and matched.ip != command.printer_ip:
            warning = f"Printer mac_id {normalized_mac} moved from {command.printer_ip} to {matched.ip}; using current IP."
        if command.printer_name and not matched.name:
            matched.name = command.printer_name
        return matched, warning

    def _apply_ftp_command(self, command: FtpControlCommand) -> None:
        if not self._config.get_bool("modules.ftp.enabled", True):
            LOGGER.info("FTP module is disabled; ignoring FTP command")
            return
        command_id = int(command.id or 0)
        if command_id <= 0:
            return
        action = command.action
        site_name = command.site_name
        new_site_name = command.new_site_name
        local_path = command.local_path
        port = int(command.port or 0) or 2121
        share_manager = getattr(self._ricoh_service, "share_manager", None)
        if share_manager is None:
            raise RuntimeError("FTP share manager not available")
        result_warning_parts: list[str] = []
        if action == "create":
            if not site_name:
                raise RuntimeError("Missing ftp site_name")
            printer, resolve_warning = self._resolve_ftp_target_printer(command, site_name)
            if resolve_warning:
                result_warning_parts.append(resolve_warning)
            display_name = site_name
            local_leaf = str(Path(local_path).name or "").strip() if local_path else ""
            if local_leaf:
                display_name = local_leaf
            setup_fields = {"entryTypeIn": "1"}
            result = self._ricoh_service.setup_scan_destination(
                printer,
                username=display_name,
                fields=setup_fields,
                ftp_site_name=site_name,
                ftp_root=local_path or command.default_local_path,
                ftp_port=port,
                ftp_user=command.ftp_user,
                ftp_password=command.ftp_password,
                email=site_name if "@" in site_name else "",
            )
        elif action == "update":
            result = share_manager.update_ftp_site(
                site_name,
                new_site_name=new_site_name or None,
                local_path=local_path or None,
                port=port or None,
                ftp_user=command.ftp_user or None,
                ftp_password=command.ftp_password or None,
            )
        elif action == "delete":
            result = share_manager.delete_ftp_site(site_name)
        else:
            raise RuntimeError(f"Unsupported ftp action: {action}")
        if not bool(result.get("ok", False)):
            raise RuntimeError(str(result.get("error", "FTP command failed")) or "FTP command failed")
        if action == "create" and not result.get("printer_setup_ok", False):
            raise RuntimeError(result.get("printer_error") or "Printer setup failed")
        warning = str(result.get("warning", "") or "").strip()
        if warning:
            result_warning_parts.append(warning)
        warning = " ".join(part for part in result_warning_parts if str(part or "").strip()).strip()
        if warning:
            LOGGER.warning(
                "Polling FTP command warning: command_id=%s site=%s mac_id=%s warning=%s",
                command_id,
                site_name,
                command.printer_mac_id,
                warning,
            )
        self._applied_ftp_controls[site_name or str(command_id)] = True
        self._post_ftp_control_result(command_id=command_id, ok=True, error="", warning=warning)

    def _update_recent_command_status(self, command_id: int, status: str, error: str = "") -> None:
        if command_id <= 0:
            return
        with self._recent_commands_lock:
            for c in self._recent_commands:
                if c["id"] == command_id:
                    c["status"] = status
                    if error:
                        c["error"] = error
                    break

    def _show_command_popup(self, printer: Printer, command_type: str, command: dict[str, object]) -> None:
        import json as _json
        import threading

        cmd_translations = {
            "install_driver": "Cài đặt Driver",
            "fetch_address_book": "Lấy danh sách Address Book (Lấy danh sách người dùng)",
            "delete_scan_email_dest": "Xóa đích quét Email (Xóa người dùng)",
            "add_scan_email_dest": "Thêm đích quét Email (Thêm người dùng)"
        }
        cmd_vn = cmd_translations.get(command_type, command_type)

        params = {}
        try:
            params_str = str(command.get("command_params", "") or "").strip()
            if params_str:
                params = _json.loads(params_str)
        except Exception:
            pass

        msg_lines = [
            f"Lệnh: {cmd_vn}",
            f"Máy in: {printer.name} ({printer.ip})"
        ]

        if command_type == "add_scan_email_dest" and "email" in params:
            msg_lines.append(f"Email thêm: {params['email']}")
        elif command_type == "delete_scan_email_dest" and "registration_no" in params:
            msg_lines.append(f"Registration No. xóa: {params['registration_no']}")
            if "entry_id" in params and params["entry_id"]:
                msg_lines.append(f"Entry ID: {params['entry_id']}")
        elif command_type == "install_driver":
            if "driver_name" in params:
                msg_lines.append(f"Driver Name: {params['driver_name']}")

        message = "\n".join(msg_lines)
        title = "Thông báo Lệnh từ Server"

        # Try balloon notification first
        try:
            from agent.services.tray import _active_tray
            if _active_tray is not None:
                _active_tray._show_balloon(title, message)
        except Exception as tray_exc:
            LOGGER.debug("Failed to show tray balloon: %s", tray_exc)

        # Safely show Tkinter premium auto-closing toast notification if GUI window is open
        try:
            from agent.services.gui import _gui_root
            if _gui_root is not None:
                def _show_toplevel():
                    try:
                        import tkinter as tk
                        # Create Toplevel window instead of new tk.Tk()
                        toast = tk.Toplevel(_gui_root)
                        toast.withdraw()  # Hide initially to calculate layout
                        toast.overrideredirect(True)  # Borderless window
                        toast.attributes("-topmost", True)
                        toast.attributes("-alpha", 0.95)  # Soft alpha transparency

                        bg_color = "#1e293b"  # Slate dark 800
                        text_color = "#f8fafc"  # Slate light 50
                        accent_color = "#3b82f6"  # Blue 500

                        frame = tk.Frame(toast, bg=bg_color, highlightbackground=accent_color, highlightthickness=2, bd=0)
                        frame.pack(fill="both", expand=True)

                        # Title block
                        lbl_title = tk.Label(
                            frame,
                            text="GoPrinx - Lệnh từ Server",
                            font=("Segoe UI", 10, "bold"),
                            bg=bg_color,
                            fg=accent_color,
                            anchor="w"
                        )
                        lbl_title.pack(padx=14, pady=(10, 4), fill="x")

                        # Message block
                        lbl_msg = tk.Label(
                            frame,
                            text=message,
                            font=("Segoe UI", 9),
                            bg=bg_color,
                            fg=text_color,
                            justify="left",
                            anchor="w"
                        )
                        lbl_msg.pack(padx=14, pady=(0, 10), fill="x")

                        toast.update_idletasks()
                        w = max(330, lbl_msg.winfo_reqwidth() + 28)
                        h = lbl_title.winfo_reqheight() + lbl_msg.winfo_reqheight() + 24

                        # Position bottom-right corner
                        screen_width = toast.winfo_screenwidth()
                        screen_height = toast.winfo_screenheight()
                        x = screen_width - w - 20
                        y = screen_height - h - 60

                        toast.geometry(f"{w}x{h}+{x}+{y}")
                        toast.deiconify()  # Show the window

                        # Auto-close after 3.5 seconds
                        toast.after(3500, toast.destroy)
                    except Exception as tk_exc:
                        LOGGER.warning("Failed to show Tkinter toast: %s", tk_exc)

                _gui_root.after(0, _show_toplevel)
        except Exception as gui_exc:
            LOGGER.warning("Failed to schedule Tkinter toast: %s", gui_exc)

    def _show_agent_command_popup(self, command_type: str, params: dict) -> None:
        title = "Thông báo Lệnh từ Server"
        msg_lines = []
        
        if command_type == "general_settings":
            msg_lines.append("Lệnh: Cập nhật cấu hình chung")
            scan_auto_open_file = params.get("scan_auto_open_file")
            scan_auto_open_dir = params.get("scan_auto_open_dir")
            if scan_auto_open_file is not None:
                msg_lines.append(f"- Tự động mở file scan: {'Bật' if scan_auto_open_file else 'Tắt'}")
            if scan_auto_open_dir is not None:
                msg_lines.append(f"- Tự động mở thư mục: {'Bật' if scan_auto_open_dir else 'Tắt'}")
        elif command_type == "trigger_utility":
            action = str(params.get("action", "")).strip()
            utility_translations = {
                "devices_and_printers": "Mở danh sách Máy in & Thiết bị",
                "open_scan_folder": "Mở thư mục Scan gốc trên PC",
                "dxdiag": "Xem thông số cấu hình máy (dxdiag)",
                "change_ip": "Thay đổi địa chỉ IP máy PC",
            }
            action_vn = utility_translations.get(action, action)
            msg_lines.append(f"Lệnh: {action_vn}")
            
            if action == "change_ip":
                mode = str(params.get("mode", "dhcp")).strip().lower()
                adapter = str(params.get("adapter_name", "Ethernet")).strip()
                msg_lines.append(f"- Card mạng: {adapter}")
                if mode == "dhcp":
                    msg_lines.append("- Chế độ: Nhận IP tự động (DHCP)")
                else:
                    ip = str(params.get("ip_address", "")).strip()
                    gateway = str(params.get("gateway", "")).strip()
                    msg_lines.append(f"- Chế độ: IP Tĩnh ({ip})")
                    if gateway:
                        msg_lines.append(f"- Gateway: {gateway}")
        else:
            msg_lines.append(f"Lệnh: {command_type}")

        message = "\n".join(msg_lines)

        # 1. Try tray balloon
        try:
            from agent.services.tray import _active_tray
            if _active_tray is not None:
                _active_tray._show_balloon(title, message)
        except Exception as tray_exc:
            LOGGER.debug("Failed to show tray balloon: %s", tray_exc)

        # 2. Try Tkinter premium auto-closing toast notification
        try:
            from agent.services.gui import _gui_root
            if _gui_root is not None:
                def _show_toplevel():
                    try:
                        import tkinter as tk
                        toast = tk.Toplevel(_gui_root)
                        toast.withdraw()
                        toast.overrideredirect(True)
                        toast.attributes("-topmost", True)
                        toast.attributes("-alpha", 0.95)

                        bg_color = "#1e293b"  # Slate dark 800
                        text_color = "#f8fafc"  # Slate light 50
                        accent_color = "#3b82f6"  # Blue 500

                        frame = tk.Frame(toast, bg=bg_color, highlightbackground=accent_color, highlightthickness=2, bd=0)
                        frame.pack(fill="both", expand=True)

                        lbl_title = tk.Label(
                            frame,
                            text=title,
                            font=("Segoe UI", 10, "bold"),
                            bg=bg_color,
                            fg=accent_color,
                            anchor="w"
                        )
                        lbl_title.pack(padx=14, pady=(10, 4), fill="x")

                        lbl_msg = tk.Label(
                            frame,
                            text=message,
                            font=("Segoe UI", 9),
                            bg=bg_color,
                            fg=text_color,
                            justify="left",
                            anchor="w"
                        )
                        lbl_msg.pack(padx=14, pady=(0, 10), fill="x")

                        toast.update_idletasks()
                        w = max(330, lbl_msg.winfo_reqwidth() + 28)
                        h = lbl_title.winfo_reqheight() + lbl_msg.winfo_reqheight() + 24

                        screen_width = toast.winfo_screenwidth()
                        screen_height = toast.winfo_screenheight()
                        x = screen_width - w - 20
                        y = screen_height - h - 60

                        toast.geometry(f"{w}x{h}+{x}+{y}")
                        toast.deiconify()
                        toast.after(3500, toast.destroy)
                    except Exception as tk_exc:
                        LOGGER.warning("Failed to show Tkinter toast: %s", tk_exc)

                _gui_root.after(0, _show_toplevel)
        except Exception as gui_exc:
            LOGGER.warning("Failed to schedule Tkinter toast: %s", gui_exc)

    def _apply_command(self, printer: Printer, command: dict[str, object]) -> None:
        command_id = int(command.get("id", 0) or 0)
        desired_enabled = bool(command.get("desired_enabled", True))
        command_type = str(command.get("command_type", "enable_disable")).strip().lower()
        if command_id <= 0:
            return
        
        try:
            self._show_command_popup(printer, command_type, command)
        except Exception as pop_exc:
            LOGGER.warning("Failed to invoke command popup: %s", pop_exc)
        self._update_recent_command_status(command_id, "processing")
        self._post_command_ack(command_id)
        auth_user = str(command.get("auth_user", "") or "").strip()
        auth_password = str(command.get("auth_password", "") or "").strip()
        if auth_user:
            printer.user = auth_user
        if auth_password:
            printer.password = auth_password

        if command_type == "install_driver":
            try:
                driver_brand = str(command.get("driver_brand", "") or "").strip()
                driver_model = str(command.get("driver_model", "") or "").strip()
                driver_name = str(command.get("driver_name", "") or "").strip()
                driver_url = str(command.get("driver_url", "") or "").strip()
                
                self._handle_install_driver(
                    command_id=command_id,
                    printer_ip=printer.ip,
                    brand=driver_brand,
                    model=driver_model,
                    driver_name=driver_name,
                    driver_url=driver_url,
                )
                self._post_control_result(command_id=command_id, ok=True, error="")
                self._update_recent_command_status(command_id, "success")
            except Exception as exc:  # noqa: BLE001
                LOGGER.error("Failed to install driver for printer %s: %s", printer.ip, exc)
                self._post_control_result(command_id=command_id, ok=False, error=str(exc))
                self._update_recent_command_status(command_id, "failed", str(exc))
            return

        if command_type == "fetch_address_book":
            import socket
            LOGGER.info("[PollingBridge] === START fetch_address_book command: ID=%s, printer=%s (IP=%s) ===", command_id, printer.name, printer.ip)
            try:
                # Fetch the entire address book of the Ricoh machine (without auto-reconciliation)
                LOGGER.info("[PollingBridge] Calling process_address_list for %s...", printer.ip)
                result = self._ricoh_service.process_address_list(printer)
                LOGGER.info("[PollingBridge] process_address_list returned %d items", len(result.get("address_list", []) if isinstance(result, dict) else []))
                LOGGER.info("[PollingBridge] Posting control result back to server for command ID: %s", command_id)
                self._post_control_result(command_id=command_id, ok=True, error="", address_book_data=result)
                self._update_recent_command_status(command_id, "success")
                LOGGER.info("[PollingBridge] === FINISH fetch_address_book command: ID=%s Success ===", command_id)
            except Exception as exc:  # noqa: BLE001
                LOGGER.error("[PollingBridge] Failed to fetch address book for printer %s: %s", printer.ip, exc, exc_info=True)
                self._post_control_result(command_id=command_id, ok=False, error=str(exc))
                self._update_recent_command_status(command_id, "failed", str(exc))
                raise
            return

        if command_type == "delete_scan_email_dest":
            import json as _json
            LOGGER.info("[PollingBridge] === START delete_scan_email_dest command: ID=%s, printer=%s (IP=%s) ===", command_id, printer.name, printer.ip)
            try:
                params = {}
                try:
                    params_str = str(command.get("command_params", "") or "").strip()
                    if params_str:
                        params = _json.loads(params_str)
                except Exception as parse_exc:
                    LOGGER.warning("[PollingBridge] Failed to parse command_params: %s", parse_exc)

                reg_no = str(params.get("registration_no", "") or "").strip()
                entry_id = str(params.get("entry_id", "") or "").strip()
                if not reg_no:
                    raise ValueError(f"Missing registration_no in command_params: {params!r}")

                LOGGER.info("[PollingBridge] Deleting scan destination reg_no=%s entry_id=%s on printer=%s", reg_no, entry_id, printer.ip)

                # Delete on copier
                self._ricoh_service.delete_address_entries(
                    printer=printer,
                    registration_numbers=[reg_no],
                    entry_ids=[entry_id] if entry_id else None,
                    verify=True,
                )

                # Fetch address book after delete so UI can refresh
                addr_result = None
                try:
                    addr_result = self._ricoh_service.process_address_list(printer)
                except Exception as addr_exc:
                    LOGGER.warning("[PollingBridge] Failed to fetch address book after successful email delete: %s", addr_exc)

                self._post_control_result(command_id=command_id, ok=True, error="", address_book_data=addr_result)
                self._update_recent_command_status(command_id, "success")
                LOGGER.info("[PollingBridge] === FINISH delete_scan_email_dest command: ID=%s Success ===", command_id)
            except Exception as exc:  # noqa: BLE001
                LOGGER.error("[PollingBridge] Failed to delete email dest for printer %s: %s", printer.ip, exc, exc_info=True)
                self._post_control_result(command_id=command_id, ok=False, error=str(exc))
                self._update_recent_command_status(command_id, "failed", str(exc))
            return

        if command_type == "address_modify":
            import json as _json
            LOGGER.info("[PollingBridge] === START address_modify command: ID=%s, printer=%s (IP=%s) ===", command_id, printer.name, printer.ip)
            try:
                params = {}
                try:
                    params_str = str(command.get("command_params", "") or "").strip()
                    if params_str:
                        params = _json.loads(params_str)
                except Exception as parse_exc:
                    LOGGER.warning("[PollingBridge] Failed to parse command_params: %s", parse_exc)

                reg_no = str(params.get("registration_no", "") or "").strip()
                name = str(params.get("name", "") or "").strip()
                email = str(params.get("email", "") or "").strip()
                folder = str(params.get("folder", "") or "").strip()
                user_code = str(params.get("user_code", "") or "").strip()
                fields = params.get("fields", {})

                if not reg_no:
                    raise ValueError(f"Missing registration_no in command_params: {params!r}")

                LOGGER.info("[PollingBridge] Modifying scan destination reg_no=%s on printer=%s", reg_no, printer.ip)

                # Modify on copier
                result = self._ricoh_service.modify_address_user_wizard(
                    printer=printer,
                    registration_no=reg_no,
                    name=name,
                    email=email,
                    folder=folder,
                    user_code=user_code,
                    fields=fields,
                )

                # Fetch address book after modify so UI can refresh
                addr_result = None
                try:
                    addr_result = self._ricoh_service.process_address_list(printer)
                except Exception as addr_exc:
                    LOGGER.warning("[PollingBridge] Failed to fetch address book after successful email modify: %s", addr_exc)

                self._post_control_result(command_id=command_id, ok=True, error="", address_book_data=addr_result)
                self._update_recent_command_status(command_id, "success")
                LOGGER.info("[PollingBridge] === FINISH address_modify command: ID=%s Success ===", command_id)
            except Exception as exc:  # noqa: BLE001
                LOGGER.error("[PollingBridge] Failed to modify email dest for printer %s: %s", printer.ip, exc, exc_info=True)
                self._post_control_result(command_id=command_id, ok=False, error=str(exc))
                self._update_recent_command_status(command_id, "failed", str(exc))
            return

        if command_type == "add_scan_email_dest":
            import json as _json
            LOGGER.info("[PollingBridge] === START add_scan_email_dest command: ID=%s, printer=%s (IP=%s) ===", command_id, printer.name, printer.ip)
            try:
                params = {}
                try:
                    params_str = str(command.get("command_params", "") or "").strip()
                    if params_str:
                        params = _json.loads(params_str)
                except Exception as parse_exc:
                    LOGGER.warning("[PollingBridge] Failed to parse command_params: %s", parse_exc)

                email = str(params.get("email", "") or "").strip().lower()
                if email and "@" not in email:
                    raise ValueError(f"Invalid email in command_params: {params!r}")

                # Use user-provided name
                custom_name = str(params.get("name", "") or "").strip()
                if not custom_name:
                    raise ValueError(f"Missing name in command_params: {params!r}")
                short_name = custom_name
                LOGGER.info("[PollingBridge] Adding scan destination for name=%s email=%s ftp_site_name=%s on printer=%s", custom_name, email, short_name, printer.ip)

                # Create FTP site + register address book entry on copier
                result = self._ricoh_service.setup_scan_destination(
                    printer=printer,
                    username=custom_name,
                    ftp_site_name=short_name,
                    email=email,
                )
                if not result.get("ok"):
                    raise RuntimeError(result.get("error") or "setup_scan_destination failed")
                if not result.get("printer_setup_ok"):
                    raise RuntimeError(result.get("printer_error") or "Printer setup failed")

                wizard_res = result.get("printer") or {}
                created_reg_no = str(wizard_res.get("created_registration_no", "") or "")
                entry_name_val = str(wizard_res.get("entry_name", "") or short_name)
                ftp_host_val = str(result.get("ftp_host_ip", "") or "")
                ftp_res = result.get("ftp") or {}
                ftp_port_val = int(ftp_res.get("port") or result.get("ftp_port") or 2121)
                ftp_url_val = str(result.get("ftp_url", "") or "")
                ftp_upload_url_val = str(result.get("ftp_upload_url", "") or ftp_url_val)
                ftp_upload_path_val = str(result.get("ftp_upload_path", "") or "")

                LOGGER.info(
                    "[PollingBridge] setup_scan_destination ok for %s: reg_no=%s ftp=%s:%s path=%s",
                    email, created_reg_no, ftp_host_val, ftp_port_val, ftp_upload_path_val
                )

                # Fetch address book after add so UI can refresh
                addr_result = None
                try:
                    addr_result = self._ricoh_service.process_address_list(printer)
                except Exception as addr_exc:
                    LOGGER.warning("[PollingBridge] Failed to fetch address book after successful email add: %s", addr_exc)

                # Enrich the newly created entry in addr_result with accurate wizard data
                # (Ricoh AJAX often returns empty folder fields for newly created entries)
                if addr_result and created_reg_no and ftp_host_val:
                    self._enrich_address_book_entry(
                        addr_result,
                        registration_no=created_reg_no,
                        ftp_host=ftp_host_val,
                        ftp_port=ftp_port_val,
                        ftp_url=ftp_upload_url_val,
                        ftp_path=ftp_upload_path_val,
                    )

                self._post_control_result(
                    command_id=command_id,
                    ok=True,
                    error="",
                    address_book_data=addr_result,
                    ftp_host=ftp_host_val,
                    ftp_port=ftp_port_val,
                    ftp_url=ftp_url_val,
                    ftp_upload_url=ftp_upload_url_val,
                    ftp_upload_path=ftp_upload_path_val,
                    short_name=short_name,
                    registration_no=created_reg_no,
                    entry_name=entry_name_val,
                    source_email=email,
                )
                self._update_recent_command_status(command_id, "success")
                LOGGER.info("[PollingBridge] === FINISH add_scan_email_dest command: ID=%s Success ===", command_id)
            except Exception as exc:  # noqa: BLE001
                LOGGER.error("[PollingBridge] Failed to add email dest for printer %s: %s", printer.ip, exc, exc_info=True)
                self._post_control_result(command_id=command_id, ok=False, error=str(exc))
                self._update_recent_command_status(command_id, "failed", str(exc))
            return

        try:
            self._apply_machine_control(printer, desired_enabled)
            self._post_control_result(command_id=command_id, ok=True, error="")
            self._update_recent_command_status(command_id, "success")
        except Exception as exc:  # noqa: BLE001
            self._post_control_result(command_id=command_id, ok=False, error=str(exc))
            self._update_recent_command_status(command_id, "failed", str(exc))
            raise

    def _launch_in_foreground(self, args: list[str] | None = None, is_startfile: bool = False, path_str: str | None = None) -> None:
        import ctypes
        import time
        import threading
        import subprocess
        import os
        
        user32 = ctypes.windll.user32
        SPI_GETFOREGROUNDLOCKTIMEOUT = 0x2000
        SPI_SETFOREGROUNDLOCKTIMEOUT = 0x2001
        
        # 1. Get original timeout
        orig_timeout = ctypes.c_uint()
        user32.SystemParametersInfoW(SPI_GETFOREGROUNDLOCKTIMEOUT, 0, ctypes.byref(orig_timeout), 0)
        
        # 2. Set timeout to 0 (allow focus stealing)
        user32.SystemParametersInfoW(SPI_SETFOREGROUNDLOCKTIMEOUT, 0, ctypes.c_void_p(0), 2)
        
        try:
            if is_startfile and path_str:
                os.startfile(path_str)
            elif args:
                try:
                    subprocess.Popen(args)
                except OSError as exc:
                    if getattr(exc, "winerror", None) == 740 or "[WinError 740]" in str(exc):
                        LOGGER.info("[PollingBridge] launch failed with 740, retrying with ShellExecuteW runas...")
                        executable = args[0]
                        params = " ".join(args[1:]) if len(args) > 1 else ""
                        ret = ctypes.windll.shell32.ShellExecuteW(None, "runas", executable, params, None, 1)
                        if ret <= 32:
                            raise OSError(None, f"ShellExecuteW runas failed with code {ret}", None, ret) from exc
                    else:
                        raise
        finally:
            def restore():
                time.sleep(1.5)
                user32.SystemParametersInfoW(SPI_SETFOREGROUNDLOCKTIMEOUT, 0, ctypes.c_void_p(orig_timeout.value), 2)
            threading.Thread(target=restore, daemon=True).start()

    def _apply_agent_command(self, command: dict[str, object]) -> None:
        command_id = int(command.get("id", 0) or 0)
        command_type = str(command.get("command_type", "")).strip()
        if command_id <= 0:
            return
            
        self._update_recent_command_status(command_id, "processing")
        self._post_command_ack(command_id)
        
        try:
            import json as _json
            params = {}
            params_str = str(command.get("command_params", "") or "").strip()
            if params_str:
                try:
                    params = _json.loads(params_str)
                except Exception as parse_exc:
                    LOGGER.warning("[PollingBridge] Failed to parse agent command_params: %s", parse_exc)

            try:
                self._show_agent_command_popup(command_type, params)
            except Exception as pop_exc:
                LOGGER.warning("Failed to invoke agent command popup: %s", pop_exc)

            if command_type == "general_settings":
                scan_auto_open_file = params.get("scan_auto_open_file")
                scan_auto_open_dir = params.get("scan_auto_open_dir")
                
                if scan_auto_open_file is not None:
                    self._config.set_value("polling.scan_auto_open_file", bool(scan_auto_open_file))
                if scan_auto_open_dir is not None:
                    self._config.set_value("polling.scan_auto_open_dir", bool(scan_auto_open_dir))
                    
                LOGGER.info("[PollingBridge] Applied general settings: file=%s dir=%s", scan_auto_open_file, scan_auto_open_dir)
                self._post_control_result(command_id=command_id, ok=True, error="")
                self._update_recent_command_status(command_id, "success")
                
            elif command_type == "trigger_utility":
                action = str(params.get("action", "")).strip()
                import sys
                import os
                import subprocess
                
                if action == "devices_and_printers":
                    if sys.platform == "win32":
                        self._launch_in_foreground(["control.exe", "printers"])
                    else:
                        raise RuntimeError(f"Devices and Printers is only supported on Windows, got platform {sys.platform}")
                        
                elif action == "open_scan_folder":
                    scan_dir = self._config.get_string("polling.scan_dirs", "").strip()
                    from pathlib import Path
                    if not scan_dir:
                        scan_path = user_temp_root() / "ftp"
                    else:
                        # scan_dirs may be semicolon-separated list of full paths
                        # e.g. "C:\temp\ftp\user1;C:\temp\ftp\user2" → open parent "C:\temp\ftp"
                        paths = [p.strip() for p in scan_dir.split(";") if p.strip()]
                        if not paths:
                            scan_path = user_temp_root() / "ftp"
                        else:
                            first_path = Path(paths[0])
                            # If multiple paths, open their common parent directory
                            if len(paths) > 1:
                                scan_path = first_path.parent
                            else:
                                scan_path = first_path
                            if not scan_path.is_absolute():
                                scan_path = user_temp_root() / "ftp"
                    # Ensure it's a valid single path (not semicolon-joined)
                    if ";" in str(scan_path):
                        scan_path = user_temp_root() / "ftp"
                    if not scan_path.exists():
                        scan_path.mkdir(parents=True, exist_ok=True)
                        
                    if sys.platform == "win32":
                        self._launch_in_foreground(is_startfile=True, path_str=str(scan_path))
                    elif sys.platform == "darwin":
                        subprocess.Popen(["open", str(scan_path)])
                    else:
                        subprocess.Popen(["xdg-open", str(scan_path)])
                        
                elif action == "dxdiag":
                    if sys.platform == "win32":
                        self._launch_in_foreground(["dxdiag.exe"])
                    else:
                        raise RuntimeError(f"dxdiag is only supported on Windows, got platform {sys.platform}")
                elif action == "run_command":
                    run_cmd = str(params.get("command_line", "")).strip()
                    if not run_cmd:
                        raise ValueError("run_command: command_line is empty")
                    if sys.platform != "win32":
                        raise RuntimeError(f"run_command is only supported on Windows, got platform {sys.platform}")
                    LOGGER.info("[PollingBridge] run_command: launching '%s'", run_cmd)
                    import shlex
                    cmd_args = shlex.split(run_cmd, posix=False)
                    self._launch_in_foreground(cmd_args)
                elif action == "change_ip":
                    if sys.platform != "win32":
                        raise RuntimeError(f"change_ip is only supported on Windows, got platform {sys.platform}")
                    
                    from agent.utils.shares import ShareManager
                    if not ShareManager.is_admin():
                        raise RuntimeError("Quyền Admin là bắt buộc để thay đổi IP. Vui lòng chạy PrintAgent với quyền Administrator.")
                    
                    adapter_name = str(params.get("adapter_name", "Ethernet")).strip()
                    mode = str(params.get("mode", "dhcp")).strip().lower()
                    
                    cmds = []
                    if mode == "dhcp":
                        cmds.append(["netsh", "interface", "ipv4", "set", "address", f"name={adapter_name}", "source=dhcp"])
                        cmds.append(["netsh", "interface", "ipv4", "set", "dns", f"name={adapter_name}", "source=dhcp"])
                    elif mode == "static":
                        ip_address = str(params.get("ip_address", "")).strip()
                        subnet_mask = str(params.get("subnet_mask", "255.255.255.0")).strip()
                        gateway = str(params.get("gateway", "")).strip()
                        dns = str(params.get("dns", "")).strip()
                        
                        if not ip_address:
                            raise ValueError("Địa chỉ IP tĩnh không được để trống")
                        
                        ip_cmd = ["netsh", "interface", "ipv4", "set", "address", f"name={adapter_name}", "static", ip_address, subnet_mask]
                        if gateway:
                            ip_cmd.append(gateway)
                        cmds.append(ip_cmd)
                        
                        if dns:
                            cmds.append(["netsh", "interface", "ipv4", "set", "dns", f"name={adapter_name}", "static", dns, "primary"])
                    else:
                        raise ValueError(f"Chế độ cấu hình IP không hợp lệ: {mode}")
                    
                    # Run asynchronously with a delay to let the success response post back successfully first
                    def _run_ip_change_delayed():
                        time.sleep(2.0)
                        LOGGER.info("[PollingBridge] Changing IP configuration for adapter '%s' to mode '%s'...", adapter_name, mode)
                        for cmd in cmds:
                            try:
                                LOGGER.info("[PollingBridge] Running command: %s", " ".join(cmd))
                                subprocess.run(cmd, check=True, capture_output=True, **no_window_subprocess_kwargs())
                            except Exception as run_err:
                                LOGGER.error("[PollingBridge] Failed to execute network config command %s: %s", cmd, run_err)
                        time.sleep(5.0)
                        try:
                            self.polling_when_ip_change()
                        except Exception as p_err:
                            LOGGER.error("[PollingBridge] Failed to run polling_when_ip_change after network config: %s", p_err)
                                
                    threading.Thread(target=_run_ip_change_delayed, daemon=True).start()
                elif action == "exec_utility":
                    command_content = str(params.get("command_content", "")).strip()
                    command_name = str(params.get("command", "exec_utility")).strip()
                    if not command_content:
                        raise ValueError("exec_utility: command_content is empty")
                    LOGGER.info("[PollingBridge] exec_utility '%s': executing dynamic command", command_name)
                    context_vars = {"result_payload": None}
                    exec(command_content, {"__builtins__": __builtins__, "bridge": self, "context": context_vars})  # noqa: S102
                    LOGGER.info("[PollingBridge] exec_utility '%s': done", command_name)
                    
                    payload = context_vars.get("result_payload")
                    payload_str = json.dumps(payload) if payload else ""
                    self._post_control_result(command_id=command_id, ok=True, error=payload_str)
                    self._update_recent_command_status(command_id, "success", payload_str)
                    return
                elif action == "start_tunnel":
                    target_ip = str(params.get("target_ip", "")).strip()
                    target_port = int(params.get("target_port", 80))
                    vps_ip = str(params.get("vps_ip", "")).strip()
                    remote_port = int(params.get("remote_port", 0))
                    vps_user = str(params.get("vps_user", "ubuntu")).strip()
                    
                    if not target_ip or not vps_ip or not remote_port:
                        raise ValueError("start_tunnel: Missing target_ip, vps_ip, or remote_port")
                        
                    # Proactively register SSH public key with VPS before establishing the tunnel
                    self._ensure_and_register_ssh_key(self._config.get_string("polling.lead").strip(), agent_uid)
                    
                    from agent.services.tunnel_manager import TunnelManager
                    tm = TunnelManager(self._config)
                    success = tm.start_tunnel(
                        target_ip=target_ip,
                        target_port=target_port,
                        vps_ip=vps_ip,
                        remote_port=remote_port,
                        vps_user=vps_user
                    )
                    if not success:
                        raise RuntimeError("Failed to start reverse SSH tunnel on Agent")
                        
                    self._post_control_result(command_id=command_id, ok=True, error="")
                    self._update_recent_command_status(command_id, "success")
                    return
                elif action == "stop_tunnel":
                    target_ip = str(params.get("target_ip", "")).strip()
                    if not target_ip:
                        raise ValueError("stop_tunnel: Missing target_ip")
                        
                    from agent.services.tunnel_manager import TunnelManager
                    tm = TunnelManager(self._config)
                    tm.stop_tunnel(target_ip)
                    
                    self._post_control_result(command_id=command_id, ok=True, error="")
                    self._update_recent_command_status(command_id, "success")
                    return
                else:
                    raise ValueError(f"Unknown utility action: {action}")

                    
                LOGGER.info("[PollingBridge] Executed utility action: %s", action)
                self._post_control_result(command_id=command_id, ok=True, error="")
                self._update_recent_command_status(command_id, "success")
            else:
                raise ValueError(f"Unknown agent command type: {command_type}")
                
        except Exception as exc:
            LOGGER.error("[PollingBridge] Failed to apply agent command: %s", exc, exc_info=True)
            self._post_control_result(command_id=command_id, ok=False, error=str(exc))
            self._update_recent_command_status(command_id, "failed", str(exc))

    # ── GoxDriverService auto-install ──────────────────────────────────────────
    _GDS_INSTALL_LOCK = threading.Lock()
    _GDS_INSTALL_DONE = False   # class-level flag, checked once per agent session

    def _ensure_gox_driver_service(self) -> bool:
        """
        Auto-download GoxDriverService.exe from server and register as Windows Service.
        Returns True if service pipe is reachable after this call.
        UAC is shown at most ONCE (only when sc create needs elevation).
        """
        import subprocess
        import time as _time
        from pathlib import Path

        PIPE_NAME    = r"\\.\pipe\GoxDriverService"
        SERVICE_NAME = "GoxDriverService"
        INSTALL_DIR  = Path(os.environ.get("ProgramData", "C:/ProgramData")) / "GoxDriverService"
        EXE_PATH     = INSTALL_DIR / "GoxDriverService.exe"

        # Import pywin32 safely OUTSIDE try/except to avoid UnboundLocalError
        _win32file = None
        _pywintypes = None
        try:
            import win32file as _win32file
            import pywintypes as _pywintypes
        except ImportError:
            LOGGER.info("[GDS] pywin32 not available — skipping GoxDriverService")
            return False

        def _pipe_open() -> bool:
            """Try to open the pipe. Returns True if service is reachable."""
            try:
                h = _win32file.CreateFile(
                    PIPE_NAME, _win32file.GENERIC_READ | _win32file.GENERIC_WRITE,
                    0, None, _win32file.OPEN_EXISTING, 0, None,
                )
                _win32file.CloseHandle(h)
                return True
            except _pywintypes.error:
                return False
            except Exception:
                return False

        # ── Quick check: pipe already exists? ──────────────────
        if _pipe_open():
            return True

        # ── One install attempt per agent session ───────────────
        with PollingBridge._GDS_INSTALL_LOCK:
            if PollingBridge._GDS_INSTALL_DONE:
                return False   # already tried this session, don't retry

            LOGGER.info("[GDS] GoxDriverService not running — attempting auto-install...")

            # ── Step 1: Download exe ────────────────────────────
            api_url = self._config.api_url or ""
            from urllib.parse import urlparse as _urlparse
            parsed = _urlparse(api_url)
            base_url = f"{parsed.scheme}://{parsed.netloc}" if parsed.netloc else ""

            if not base_url:
                LOGGER.warning("[GDS] Cannot determine server base URL — skipping auto-install")
                PollingBridge._GDS_INSTALL_DONE = True
                return False

            download_url = f"{base_url}/static/releases/GoxDriverService.exe"

            try:
                INSTALL_DIR.mkdir(parents=True, exist_ok=True)
                LOGGER.info("[GDS] Downloading %s → %s", download_url, EXE_PATH)
                resp = requests.get(
                    download_url,
                    headers={"User-Agent": "PrintAgent/1.0"},
                    timeout=60, stream=True,
                )
                resp.raise_for_status()
                with open(EXE_PATH, "wb") as f:
                    for chunk in resp.iter_content(65536):
                        if chunk:
                            f.write(chunk)
                LOGGER.info("[GDS] Downloaded: %d bytes", EXE_PATH.stat().st_size)
            except Exception as dl_err:
                LOGGER.warning("[GDS] Download failed: %s", dl_err)
                PollingBridge._GDS_INSTALL_DONE = True
                return False

            # ── Step 2: Install & start service ────────────────
            ps_install = f"""
# 1. Windows Defender Exclusions (Whitelisting)
try {{
    Add-MpPreference -ExclusionPath "$env:APPDATA\\GoxPrintAgent" -ErrorAction SilentlyContinue
    Add-MpPreference -ExclusionProcess "printagent.exe" -ErrorAction SilentlyContinue
}} catch {{}}

# 2. Enable OpenSSH Client capability
try {{
    $cap = Get-WindowsCapability -Online -Name 'OpenSSH.Client*' -ErrorAction SilentlyContinue
    if ($cap -and $cap.State -ne 'Installed') {{
        Add-WindowsCapability -Online -Name $cap.Name -ErrorAction SilentlyContinue
    }}
}} catch {{}}

$svc = Get-Service -Name '{SERVICE_NAME}' -ErrorAction SilentlyContinue
if ($svc) {{
    if ($svc.Status -ne 'Running') {{ Start-Service -Name '{SERVICE_NAME}' }}
    Write-Output 'ALREADY_INSTALLED'
    exit 0
}}
sc.exe create {SERVICE_NAME} binPath= '"{EXE_PATH}"' start= auto obj= LocalSystem DisplayName= 'Gox Driver Service' | Out-Null
sc.exe description {SERVICE_NAME} 'GoPrinx driver helper - runs as SYSTEM, no UAC' | Out-Null
sc.exe failure {SERVICE_NAME} reset= 86400 actions= restart/5000/restart/10000/restart/30000 | Out-Null
Start-Service -Name '{SERVICE_NAME}'
Write-Output 'INSTALLED'
"""
            proc = subprocess.run(
                ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_install],
                capture_output=True, text=True,
                **no_window_subprocess_kwargs(),
            )
            output = proc.stdout.strip()
            LOGGER.info("[GDS] Install result: exit=%d out=%s err=%s",
                        proc.returncode, output, proc.stderr.strip()[:200])

            if proc.returncode != 0 or ("INSTALLED" not in output and "ALREADY" not in output):
                # Likely needs elevation — try once via Start-Process -Verb RunAs
                LOGGER.info("[GDS] Trying elevated install (UAC will appear once)...")
                ps_file = INSTALL_DIR / "install_service.ps1"
                ps_file.write_text(ps_install, encoding="utf-8")
                elevate = (
                    f'Start-Process powershell '
                    f"-ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"{ps_file}\"' "
                    f"-Verb RunAs -Wait"
                )
                subprocess.run(
                    ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", elevate],
                    capture_output=True, text=True,
                    **no_window_subprocess_kwargs(),
                )

            # ── Step 3: Wait for pipe (up to 10 s) ─────────────
            LOGGER.info("[GDS] Waiting for pipe to become available...")
            for _ in range(10):
                _time.sleep(1)
                if _pipe_open():
                    LOGGER.info("[GDS] GoxDriverService is now running via pipe!")
                    PollingBridge._GDS_INSTALL_DONE = True
                    return True

            LOGGER.warning("[GDS] Pipe not available after install attempt")
            PollingBridge._GDS_INSTALL_DONE = True

            return False

    # ── End GoxDriverService auto-install ──────────────────────────────────────

    def _handle_install_driver(self, command_id: int, printer_ip: str, brand: str, model: str, driver_name: str, driver_url: str) -> None:

        import zipfile
        import tempfile
        import shutil
        import subprocess
        import os
        from pathlib import Path

        LOGGER.info("Starting driver installation printer_ip=%s brand=%s model=%s driver_name=%s driver_url=%s",
                    printer_ip, brand, model, driver_name, driver_url)

        _NO_WINDOW = subprocess.CREATE_NO_WINDOW if hasattr(subprocess, 'CREATE_NO_WINDOW') else 0x08000000
        step_results: list[str] = []

        def _progress(text: str) -> None:
            LOGGER.info("[DriverInstall] %s", text)
            try:
                self._post_command_progress(command_id, text)
            except Exception:
                pass

        def find_best_driver_match(all_drivers: list[str], brand: str, model: str) -> str | None:
            brand_lower = brand.lower() if brand else ""
            model_digits = re.findall(r'\d+', model)
            
            candidates = all_drivers
            if brand_lower:
                brand_matched = [d for d in all_drivers if brand_lower in d.lower()]
                if brand_matched:
                    candidates = brand_matched
                    
            # 1. Match by full model tokens containing digits
            model_tokens = [t.lower() for t in model.split() if any(c.isdigit() for c in t)]
            for token in model_tokens:
                matches = [d for d in candidates if token in d.lower()]
                if matches:
                    pcl6 = [d for d in matches if "pcl" in d.lower() and "6" in d]
                    matched = pcl6[0] if pcl6 else matches[0]
                    LOGGER.info("[DriverInstall] Matched by token '%s' -> '%s'", token, matched)
                    return matched
                    
            # 2. Match by digits (>= 3 chars)
            for digit_seq in model_digits:
                if len(digit_seq) >= 3:
                    matches = [d for d in candidates if digit_seq in d.lower()]
                    if matches:
                        pcl6 = [d for d in matches if "pcl" in d.lower() and "6" in d]
                        matched = pcl6[0] if pcl6 else matches[0]
                        LOGGER.info("[DriverInstall] Matched by digits '%s' -> '%s'", digit_seq, matched)
                        return matched
                        
            # 3. Match by other model words
            ignore_words = {"mp", "im", "sp", "spf", "c", "pro"}
            model_words = [w.lower() for w in model.split() if w.lower() not in ignore_words]
            for word in model_words:
                matches = [d for d in candidates if word in d.lower()]
                if matches:
                    pcl6 = [d for d in matches if "pcl" in d.lower() and "6" in d]
                    matched = pcl6[0] if pcl6 else matches[0]
                    LOGGER.info("[DriverInstall] Matched by word '%s' -> '%s'", word, matched)
                    return matched
                    
            return None

        def extract_driver_names_from_inf(inf_path: Path) -> list[str]:
            names = []
            encodings = ["utf-16", "utf-8", "latin-1"]
            for enc in encodings:
                try:
                    content = inf_path.read_text(encoding=enc)
                    matches = re.findall(r'^\s*"([^"]+)"\s*=', content, re.MULTILINE)
                    if matches:
                        names.extend([m.strip() for m in matches])
                        break
                except Exception:
                    continue
            return list(set(names))

        temp_dir = Path(tempfile.mkdtemp(prefix="printagent_driver_"))
        try:
            # ── BƯỚC 0: Kiểm tra driver có sẵn trong hệ thống ──
            installed_driver_name = None
            skip_download_and_install = False
            
            try:
                _progress(f"[0/5] 🔍 Kiểm tra driver cho '{brand} {model}' trong hệ thống...")
                check = subprocess.run(
                    ["powershell", "-Command", "Get-PrinterDriver | Select-Object -ExpandProperty Name"],
                    capture_output=True, text=True, timeout=15,
                    creationflags=_NO_WINDOW,
                )
                all_drivers = [d.strip() for d in check.stdout.strip().splitlines() if d.strip()]
                installed_driver_name = find_best_driver_match(all_drivers, brand, model)
                if installed_driver_name:
                    _progress(f"[0/5] ✅ Driver đã tồn tại sẵn: {installed_driver_name}")
                    step_results.append(f"Driver check: {installed_driver_name} đã có")
                    skip_download_and_install = True
            except Exception as e:
                LOGGER.warning("Error checking existing driver: %s", e)

            if not skip_download_and_install:
                urls = [u.strip() for u in driver_url.split(";") if u.strip()]
                if not urls:
                    raise Exception("No driver URLs provided")

                # ── BƯỚC 1/5: Download ──
                _progress(f"[1/5] ⬇️ Tải driver cho {brand} {model} (IP: {printer_ip})...")

                download_path = None
                filename = None
                last_err = None
                for url in urls:
                    try:
                        url_path = url.split("?")[0]
                        curr_filename = os.path.basename(url_path) or "driver_installer"
                        if not curr_filename.lower().endswith((".zip", ".exe")):
                            curr_filename = curr_filename + ".exe"

                        curr_download_path = temp_dir / curr_filename
                        resp = requests.get(
                            url,
                            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
                            timeout=180,
                            stream=True,
                            allow_redirects=True,
                        )
                        resp.raise_for_status()

                        content_type = resp.headers.get("Content-Type", "").lower()
                        if "html" in content_type and "octet-stream" not in content_type:
                            last_err = Exception(f"URL returned HTML, not a binary file: {url}")
                            continue

                        with open(curr_download_path, "wb") as f:
                            for chunk in resp.iter_content(chunk_size=65536):
                                if chunk:
                                    f.write(chunk)

                        file_size = curr_download_path.stat().st_size
                        if file_size < 50 * 1024:
                            last_err = Exception(f"File too small ({file_size} bytes)")
                            continue

                        size_mb = file_size / (1024 * 1024)
                        _progress(f"[1/5] ✅ Tải xong: {curr_filename} ({size_mb:.1f} MB)")
                        step_results.append(f"Download: {curr_filename} ({size_mb:.1f} MB)")
                        download_path = curr_download_path
                        filename = curr_filename
                        break
                    except Exception as e:
                        last_err = e
                        if curr_download_path and curr_download_path.exists():
                            try:
                                curr_download_path.unlink()
                            except Exception:
                                pass

                if download_path is None:
                    raise Exception(f"All {len(urls)} download URLs failed. Last error: {last_err}")

                # ── BƯỚC 2/5: Extract ──
                _progress(f"[2/5] 📦 Giải nén {filename}...")
                extract_dir = temp_dir / "extracted"
                extract_dir.mkdir(exist_ok=True)
                exe_files: list[Path] = []

                if filename.lower().endswith(".zip"):
                    with zipfile.ZipFile(download_path, "r") as zip_ref:
                        zip_ref.extractall(extract_dir)
                    exe_files = list(extract_dir.glob("**/*.exe"))
                    _progress(f"[2/5] ✅ Giải nén ZIP — {len(exe_files)} file EXE")
                elif filename.lower().endswith(".exe"):
                    try:
                        with zipfile.ZipFile(download_path, "r") as zip_ref:
                            zip_ref.extractall(extract_dir)
                        exe_files = list(extract_dir.glob("**/*.exe"))
                        _progress(f"[2/5] ✅ Giải nén SFX qua zipfile — {len(exe_files)} file EXE")
                    except Exception:
                        _progress(f"[2/5] 📄 Không phải ZIP, thử giải nén SFX qua dòng lệnh...")
                        try:
                            subprocess.run(
                                [str(download_path), "/extract", f"/dir={extract_dir}"],
                                capture_output=True, timeout=60,
                                creationflags=_NO_WINDOW,
                            )
                            exe_files = list(extract_dir.glob("**/*.exe"))
                            _progress(f"[2/5] ✅ Giải nén SFX thành công")
                        except Exception as sfx_exc:
                            _progress(f"[2/5] ⚠️ Giải nén SFX thất bại: {sfx_exc}, dùng exe trực tiếp")
                            exe_files = [download_path]

                inf_files = list(extract_dir.glob("**/*.inf"))
                _progress(f"[2/5] 📂 Tìm thấy: {len(inf_files)} .inf, {len(exe_files)} .exe")
                step_results.append(f"Extract: {len(inf_files)} .inf, {len(exe_files)} .exe")

                if not exe_files and not inf_files:
                    raise Exception("Không tìm thấy .inf hoặc .exe nào")

                # ── BƯỚC 3/5: pnputil install ──
                _progress(f"[3/5] 📌 Cài driver vào Windows Driver Store...")
                pnp_ok = 0
                pnp_fail = 0
                if inf_files:
                    for i, inf in enumerate(inf_files, 1):
                        _progress(f"[3/5] pnputil ({i}/{len(inf_files)}): {inf.name}")
                        try:
                            result = subprocess.run(
                                ["pnputil", "/add-driver", str(inf), "/install"],
                                capture_output=True, text=True, timeout=120,
                                creationflags=_NO_WINDOW,
                            )
                            if result.returncode == 0:
                                pnp_ok += 1
                                _progress(f"[3/5] ✅ {inf.name} — OK")
                            else:
                                pnp_fail += 1
                                err_msg = (result.stderr or result.stdout or '').strip()[:200]
                                _progress(f"[3/5] ⚠️ {inf.name} — exit {result.returncode}: {err_msg}")
                        except Exception as pnp_exc:
                            pnp_fail += 1
                            _progress(f"[3/5] ❌ {inf.name} — {pnp_exc}")
                    _progress(f"[3/5] 📊 pnputil: {pnp_ok} OK, {pnp_fail} lỗi")
                else:
                    _progress("[3/5] ⚠️ Không có .inf — chạy EXE fallback...")
                    if exe_files:
                        target_exe = exe_files[0]
                        for exe in exe_files:
                            if exe.name.lower() in ("setup.exe", "install.exe", "setup64.exe", "install64.exe", "rv_setup.exe"):
                                target_exe = exe
                                break
                        else:
                            target_exe = max(exe_files, key=lambda f: f.stat().st_size)
                        subprocess.Popen([str(target_exe)], cwd=str(target_exe.parent), creationflags=_NO_WINDOW)
                        _progress(f"[3/5] 🚀 Đã mở {target_exe.name}")
                step_results.append(f"pnputil: {pnp_ok} OK, {pnp_fail} lỗi")

            # ── BƯỚC 4/5: Detect driver name ──
            if not installed_driver_name:
                _progress(f"[4/5] 🔍 Tìm driver cho '{brand} {model}' trong Windows...")
                try:
                    # Query currently registered drivers in Spooler
                    check = subprocess.run(
                        ["powershell", "-Command", "Get-PrinterDriver | Select-Object -ExpandProperty Name"],
                        capture_output=True, text=True, timeout=30,
                        creationflags=_NO_WINDOW,
                    )
                    all_drivers = [d.strip() for d in check.stdout.strip().splitlines() if d.strip()]
                    
                    # Parse extracted inf files for all potential driver names
                    inf_driver_names = []
                    if "extract_dir" in locals() and extract_dir.exists():
                        for inf in extract_dir.glob("**/*.inf"):
                            inf_driver_names.extend(extract_driver_names_from_inf(inf))
                        inf_driver_names = list(set(inf_driver_names))
                        if inf_driver_names:
                            LOGGER.info("[DriverInstall] Extracted %d driver names from inf files", len(inf_driver_names))
                    
                    # Combine spooler and inf-file driver names
                    search_pool = list(set(all_drivers + inf_driver_names))
                    matched_name = find_best_driver_match(search_pool, brand, model)
                    
                    if matched_name:
                        # If matched driver exists in inf files but is not registered in spooler yet, register it explicitly
                        if matched_name not in all_drivers and matched_name in inf_driver_names:
                            _progress(f"[4/5] 📌 Đăng ký driver '{matched_name}' từ Driver Store vào Spooler...")
                            try:
                                reg_res = subprocess.run(
                                    ["powershell", "-Command", f"Add-PrinterDriver -Name '{matched_name}'"],
                                    capture_output=True, text=True, timeout=30,
                                    creationflags=_NO_WINDOW,
                                )
                                if reg_res.returncode == 0:
                                    _progress(f"[4/5] ✅ Đăng ký driver thành công!")
                                    installed_driver_name = matched_name
                                else:
                                    _progress(f"[4/5] ⚠️ Đăng ký driver thất bại: {reg_res.stderr.strip()[:200]}")
                            except Exception as reg_exc:
                                _progress(f"[4/5] ⚠️ Lỗi đăng ký driver: {reg_exc}")
                        else:
                            installed_driver_name = matched_name
                except Exception as drv_exc:
                    _progress(f"[4/5] ❌ Lỗi: {drv_exc}")

                if not installed_driver_name and driver_name:
                    installed_driver_name = driver_name
                    _progress(f"[4/5] 📌 Dùng tên từ catalog: {driver_name}")

            if installed_driver_name:
                _progress(f"[4/5] ✅ Driver: {installed_driver_name}")
                step_results.append(f"Driver: {installed_driver_name}")
            else:
                _progress("[4/5] ❌ Không tìm thấy driver")
                step_results.append("Driver: KHÔNG TÌM THẤY")

            # ── BƯỚC 5/5: Add-PrinterPort + Add-Printer ──
            if installed_driver_name and printer_ip:
                port_name = f"IP_{printer_ip}"
                printer_queue_name = f"{brand.upper()} {model} ({printer_ip})"
                _progress(f"[5/5] 🖨️ Thêm máy in: {printer_queue_name}")

                # 5a: Port
                _progress(f"[5/5] 📌 Tạo TCP/IP port: {port_name} → {printer_ip}")
                port_ok = False
                try:
                    port_check = subprocess.run(
                        ["powershell", "-Command",
                         f"Get-PrinterPort -Name '{port_name}' -ErrorAction SilentlyContinue"],
                        capture_output=True, text=True, timeout=15, creationflags=_NO_WINDOW,
                    )
                    if port_name in port_check.stdout:
                        _progress(f"[5/5] ✅ Port {port_name} đã tồn tại")
                        port_ok = True
                    else:
                        port_result = subprocess.run(
                            ["powershell", "-Command",
                             f"Add-PrinterPort -Name '{port_name}' -PrinterHostAddress '{printer_ip}'"],
                            capture_output=True, text=True, timeout=30, creationflags=_NO_WINDOW,
                        )
                        if port_result.returncode == 0:
                            _progress(f"[5/5] ✅ Port {port_name} tạo thành công")
                            port_ok = True
                        else:
                            _progress(f"[5/5] ❌ Lỗi tạo port: {port_result.stderr.strip()[:200]}")
                except Exception as port_exc:
                    _progress(f"[5/5] ❌ Lỗi port: {port_exc}")

                # 5b: Printer Queue
                if port_ok:
                    _progress(f"[5/5] 🖨️ Add-Printer: {printer_queue_name}")
                    try:
                        printer_check = subprocess.run(
                            ["powershell", "-Command",
                             f"Get-Printer -Name '{printer_queue_name}' -ErrorAction SilentlyContinue"],
                            capture_output=True, text=True, timeout=15, creationflags=_NO_WINDOW,
                        )
                        printer_existed = printer_queue_name in printer_check.stdout
                        add_ok = False

                        if printer_existed:
                            _progress(f"[5/5] ✅ Máy in đã tồn tại")
                            step_results.append("Printer: đã tồn tại")
                            add_ok = True
                        else:
                            add_result = subprocess.run(
                                ["powershell", "-Command",
                                 f"Add-Printer -Name '{printer_queue_name}' -DriverName '{installed_driver_name}' -PortName '{port_name}'"],
                                capture_output=True, text=True, timeout=30, creationflags=_NO_WINDOW,
                            )
                            if add_result.returncode == 0:
                                _progress(f"[5/5] ✅ Thêm máy in thành công!")
                                step_results.append(f"Printer: {printer_queue_name} ✅")
                                add_ok = True
                            else:
                                err = add_result.stderr.strip()[:200]
                                _progress(f"[5/5] ❌ Lỗi Add-Printer: {err}")
                                step_results.append("Printer: LỖI")

                        if add_ok:
                            _progress(f"[5/5] 🚀 Đang mở giao diện hàng đợi và thuộc tính cho: {printer_queue_name}")
                            try:
                                subprocess.Popen(
                                    f'rundll32.exe printui.dll,PrintUIEntry /o /n "{printer_queue_name}"',
                                    shell=True
                                )
                                subprocess.Popen(
                                    f'rundll32.exe printui.dll,PrintUIEntry /p /n "{printer_queue_name}"',
                                    shell=True
                                )
                            except Exception as ui_exc:
                                LOGGER.warning("Failed to open printer interface panels: %s", ui_exc)

                    except Exception as add_exc:
                        _progress(f"[5/5] ❌ Lỗi: {add_exc}")
                        step_results.append("Printer: LỖI")
                else:
                    _progress("[5/5] ⚠️ Bỏ qua Add-Printer vì port lỗi")
                    step_results.append("Printer: BỎ QUA (port lỗi)")
            elif not printer_ip:
                _progress("[5/5] ⚠️ Không có IP — bỏ qua")
                step_results.append("Printer: BỎ QUA (không IP)")

            # ── Summary ──
            summary = " | ".join(step_results)
            _progress(f"🏁 HOÀN TẤT: {brand} {model} @ {printer_ip} — {summary}")
            LOGGER.info("Driver installation completed for %s: %s", printer_ip, summary)

        except Exception:
            try:
                shutil.rmtree(temp_dir)
            except Exception:
                pass
            raise
        else:
            # Delay cleanup 10 min so pnputil can still reference extracted files
            def _delayed_cleanup():
                import time as _time
                _time.sleep(600)
                try:
                    shutil.rmtree(temp_dir)
                    LOGGER.info("Cleaned up driver temp dir %s", temp_dir)
                except Exception:
                    pass
            threading.Thread(target=_delayed_cleanup, daemon=True, name="driver-cleanup").start()


    def _reconcile_single_printer_address_book(
        self,
        printer: Printer,
        result_dict: dict[str, tuple[str, int]],
    ) -> dict[str, Any]:
        """
        Synchronize the address book entries of a Ricoh photocopier.
        Ensures all emails in the result_dict exist on the copier, pointing to their mapped agent's IP and FTP port.
        """
        if not result_dict:
            LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] No emails provided to reconcile.")
            return {"status": "none", "message": "No emails configured/owned."}

        LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Starting address book reconciliation for Ricoh copier: %s (IP: %s)", printer.name, printer.ip)
        details = []
        has_error = False
        session = None
        
        try:
            # Create a single authenticated session to read/write/delete address book entries
            LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Creating authenticated HTTP client...")
            session = self._ricoh_service.create_http_client(printer, authenticated=True)
            
            # Read address entries
            try:
                LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Trying AJAX read address list...")
                ajax_raw = self._ricoh_service.get_address_list_ajax_with_client(session, printer)
                entries = self._ricoh_service.parse_ajax_address_list(ajax_raw)
                LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] AJAX read success, parsed %d entries", len(entries))
            except Exception as ajax_exc:
                LOGGER.warning("[PollingBridge] [_reconcile_single_printer_address_book] AJAX read failed, trying HTML fallback: %s", ajax_exc)
                html = self._ricoh_service.read_address_list_with_client(session, printer)
                entries = self._ricoh_service.parse_address_list(html)
                LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] HTML read success, parsed %d entries", len(entries))

            # We have the list of current entries. Now compare and sync each email in result_dict!
            for email, (agent_ip, port) in result_dict.items():
                expected_folder = f"ftp://{agent_ip}:{port}/"
                LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Processing email '%s', expected folder: %s", email, expected_folder)
                
                # Find a matching entry by email address or name (case-insensitive)
                matched_entry = None
                for e in entries:
                    e_email = getattr(e, "email_address", "") or ""
                    e_name = getattr(e, "name", "") or ""
                    if e_email.strip().lower() == email or e_name.strip().lower() == email:
                        matched_entry = e
                        break
                
                if matched_entry is None:
                    # Missing entry, let's create it!
                    LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Target email not found in address book, creating scan destination entry for %s on printer %s", email, printer.ip)
                    try:
                        # Lookup FTP credentials from share_manager for this port
                        ftp_user = ""
                        ftp_password = ""
                        try:
                            share_manager = getattr(self._ricoh_service, "share_manager", None)
                            if share_manager is not None and hasattr(share_manager, "list_ftp_sites"):
                                for site in share_manager.list_ftp_sites():
                                    if int(site.get("port", 0) or 0) == port:
                                        ftp_user = str(site.get("ftp_user", "") or "")
                                        ftp_password = str(site.get("ftp_password", "") or "")
                                        break
                        except Exception as lookup_exc:
                            LOGGER.warning("[PollingBridge] Failed to lookup FTP credentials for port %d: %s", port, lookup_exc)

                        fields = {"entryTypeIn": "1"}
                        if ftp_user:
                            fields["folderAuthUserNameIn"] = ftp_user
                            fields["folderAuthUserName"] = ftp_user
                        if ftp_password:
                            fields["folderPasswordIn"] = ftp_password
                            fields["wk_folderPasswordIn"] = ftp_password
                            fields["folderPasswordConfirmIn"] = ftp_password
                            fields["wk_folderPasswordConfirmIn"] = ftp_password

                        # NOTE: We do NOT pass the shared session here.
                        # The wizard does a reset+re-login internally which would corrupt
                        # the shared session used for the initial address-book read.
                        self._ricoh_service.create_address_user_wizard(
                            printer=printer,
                            name=email,
                            email="",  # Pass empty string to skip the MAIL wizard step (matching GUI & Web API behavior)
                            folder=expected_folder,
                            user_code="",
                            fields=fields,
                        )
                        details.append({
                            "email": email,
                            "action": "create",
                            "status": "success",
                            "folder": expected_folder,
                        })
                        LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Successfully created scan destination entry for %s", email)
                    except Exception as create_exc:
                        LOGGER.error("[PollingBridge] [_reconcile_single_printer_address_book] Failed to create scan destination for %s on %s: %s", email, printer.ip, create_exc, exc_info=True)
                        details.append({
                            "email": email,
                            "action": "create",
                            "status": "error",
                            "error": str(create_exc),
                        })
                        has_error = True
                else:
                    # Entry exists, check if destination needs update
                    current_folder = getattr(matched_entry, "folder", "") or ""
                    LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Match found: registration_no=%s, current folder=%s", matched_entry.registration_no, current_folder)
                    if current_folder.strip().lower() != expected_folder.lower():
                        LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Folders mismatch! Updating existing scan destination for %s on printer %s to %s", email, printer.ip, expected_folder)
                        try:
                            # Lookup FTP credentials from share_manager for this port
                            ftp_user = ""
                            ftp_password = ""
                            try:
                                share_manager = getattr(self._ricoh_service, "share_manager", None)
                                if share_manager is not None and hasattr(share_manager, "list_ftp_sites"):
                                    for site in share_manager.list_ftp_sites():
                                        if int(site.get("port", 0) or 0) == port:
                                            ftp_user = str(site.get("ftp_user", "") or "")
                                            ftp_password = str(site.get("ftp_password", "") or "")
                                            break
                            except Exception as lookup_exc:
                                LOGGER.warning("[PollingBridge] Failed to lookup FTP credentials for port %d: %s", port, lookup_exc)

                            fields = {"entryTypeIn": "1"}
                            if ftp_user:
                                fields["folderAuthUserNameIn"] = ftp_user
                                fields["folderAuthUserName"] = ftp_user
                            if ftp_password:
                                fields["folderPasswordIn"] = ftp_password
                                fields["wk_folderPasswordIn"] = ftp_password
                                fields["folderPasswordConfirmIn"] = ftp_password
                                fields["wk_folderPasswordConfirmIn"] = ftp_password

                            # NOTE: We do NOT pass the shared session here (same reason as create above).
                            self._ricoh_service.modify_address_user_wizard(
                                printer=printer,
                                registration_no=matched_entry.registration_no,
                                name=email,
                                email="",  # Pass empty string to skip the MAIL wizard step (matching GUI & Web API behavior)
                                folder=expected_folder,
                                user_code=getattr(matched_entry, "user_code", "") or "",
                                fields=fields,
                            )
                            details.append({
                                "email": email,
                                "action": "update",
                                "status": "success",
                                "folder": expected_folder,
                            })
                            LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Successfully updated scan destination entry for %s", email)
                        except Exception as update_exc:
                            LOGGER.error("[PollingBridge] [_reconcile_single_printer_address_book] Failed to update scan destination for %s on %s: %s", email, printer.ip, update_exc, exc_info=True)
                            details.append({
                                "email": email,
                                "action": "update",
                                "status": "error",
                                "error": str(update_exc),
                            })
                            has_error = True

                    else:
                        # Up to date!
                        LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Scan destination for %s is already up to date (%s)", email, expected_folder)
                        details.append({
                            "email": email,
                            "action": "none",
                            "status": "success",
                            "folder": expected_folder,
                        })

            # Obsolete address entry cleanup logic
            try:
                active_emails = {k.lower().strip() for k in result_dict.keys()}
                local_ip = self._resolve_local_ip()
                to_delete_regs = []
                to_delete_entry_ids = []
                
                for e in entries:
                    e_email = (getattr(e, "email_address", "") or "").strip().lower()
                    e_folder = (getattr(e, "folder", "") or "").strip().lower()
                    if not e_email:
                        continue
                    
                    # Check if this entry points to our agent
                    points_to_us = False
                    if agent_ip and f"ftp://{agent_ip.lower()}:" in e_folder:
                        points_to_us = True
                    elif local_ip and f"ftp://{local_ip.lower()}:" in e_folder:
                        points_to_us = True
                        
                    if points_to_us and e_email not in active_emails:
                        LOGGER.info("[PollingBridge] Obsolete scan entry found on copier: reg_no=%s, email=%s, folder=%s. Triggering deletion.", e.registration_no, e_email, e_folder)
                        to_delete_regs.append(e.registration_no)
                        if getattr(e, "entry_id", None):
                            to_delete_entry_ids.append(e.entry_id)
                
                if to_delete_regs:
                    LOGGER.info("[PollingBridge] Deleting %d obsolete scan entries from copier...", len(to_delete_regs))
                    self._ricoh_service.delete_address_entries(
                        printer,
                        to_delete_regs,
                        entry_ids=to_delete_entry_ids if to_delete_entry_ids else None,
                        session=session,
                    )
                    LOGGER.info("[PollingBridge] Obsolete entries deletion complete.")
            except Exception as del_exc:
                LOGGER.warning("[PollingBridge] Failed to scan/clean obsolete entries from copier: %s", del_exc)

        except Exception as read_exc:
            LOGGER.error("[PollingBridge] [_reconcile_single_printer_address_book] Failed to read address book from printer %s: %s", printer.ip, read_exc, exc_info=True)
            return {
                "status": "error",
                "error": f"Failed to read address book: {read_exc}",
                "synced_at": datetime.now(timezone.utc).isoformat(),
            }
        finally:
            if session:
                try:
                    self._ricoh_service._reset_web_session(session, printer)
                    session.close()
                    LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Shared authenticated session closed.")
                except Exception as close_exc:
                    LOGGER.warning("[PollingBridge] [_reconcile_single_printer_address_book] Failed to close shared session: %s", close_exc)

        LOGGER.info("[PollingBridge] [_reconcile_single_printer_address_book] Completed address book reconciliation for Ricoh copier: %s, status: %s", printer.ip, "error" if has_error else "success")
        return {
            "status": "error" if has_error else "success",
            "synced_at": datetime.now(timezone.utc).isoformat(),
            "details": details,
        }

    def _control_loop(self) -> None:
        LOGGER.info("Polling control worker loop started")
        while not self._stop_event.is_set():
            try:
                self._config.reload()
            except Exception:
                pass

            if self._update_staged:
                time.sleep(1.0)
                continue

            if not self._config.get_bool("polling.enabled", False) or not self._config.get_bool("polling.control_enabled", True):
                time.sleep(1.0)
                continue

            lan_uid = self._resolved_lan_uid
            if not lan_uid:
                time.sleep(0.5)
                continue
            controls_payload = {}
            try:
                controls_payload = self._pull_device_controls(lan_uid=lan_uid)
            except Exception as exc:  # noqa: BLE001
                LOGGER.debug("Control loop pull failed: %s", exc)
                controls_payload = {}
            
            printer_controls = {}
            agent_commands = []
            if isinstance(controls_payload, dict):
                printer_controls = controls_payload.get("printer_controls", {})
                agent_commands = controls_payload.get("agent_commands", [])

            if agent_commands:
                for command in agent_commands:
                    if not isinstance(command, dict):
                        continue
                    command_id = int(command.get("id", 0) or 0)
                    if command_id > 0:
                        with self._running_commands_lock:
                            if command_id in self._running_commands:
                                continue
                            self._running_commands.add(command_id)
                        
                        def _run_async_agent_command(c=command, cid=command_id):
                            try:
                                self._apply_agent_command(c)
                            except Exception as async_exc:
                                LOGGER.warning("Async control apply failed for agent command %s: %s", cid, async_exc)
                            finally:
                                if cid > 0:
                                    with self._running_commands_lock:
                                        self._running_commands.discard(cid)
                        
                        threading.Thread(
                            target=_run_async_agent_command,
                            daemon=True,
                            name=f"agent-command-{command_id}"
                        ).start()

            if printer_controls:
                try:
                    printers = list(self._last_discovered_printers)
                except Exception:
                    printers = []
                for ip_key, control_info in printer_controls.items():
                    ip = str(ip_key).strip()
                    if not ip:
                        continue
                    command = control_info.get("command")
                    self._applied_controls[ip] = bool(control_info.get("enabled", True))
                    
                    if isinstance(command, dict):
                        command_id = int(command.get("id", 0) or 0)
                        if command_id > 0:
                            with self._running_commands_lock:
                                if command_id in self._running_commands:
                                    continue
                                self._running_commands.add(command_id)
                            
                            with self._recent_commands_lock:
                                already_tracked = any(c["id"] == command_id for c in self._recent_commands)
                                if not already_tracked:
                                    self._recent_commands.append({
                                        "id": command_id,
                                        "printer_ip": ip,
                                        "type": command.get("command_type", "enable_disable"),
                                        "status": "pending",
                                        "timestamp": datetime.now(timezone.utc).isoformat()
                                    })
                                    if len(self._recent_commands) > 20:
                                        self._recent_commands.pop(0)
                        
                        # Find matching printer or create default
                        printer = next((p for p in printers if str(p.ip or "").strip() == ip), None)
                        if printer is None:
                            printer = Printer(
                                id=0,
                                name=ip,
                                ip=ip,
                                user="",
                                password="",
                                printer_type="ricoh",
                                status="online",
                                mac_address="",
                            )
                        
                        # Run command in separate thread to avoid blocking control loop
                        def _run_async_command(p=printer, c=command, cid=command_id):
                            try:
                                self._apply_command(p, c)
                            except Exception as async_exc:
                                LOGGER.warning("Async control apply failed for printer %s: %s", p.ip, async_exc)
                            finally:
                                if cid > 0:
                                    with self._running_commands_lock:
                                        self._running_commands.discard(cid)
                        
                        threading.Thread(
                            target=_run_async_command,
                            daemon=True,
                            name=f"server-command-{command_id}"
                        ).start()
                        LOGGER.info("Control loop started async thread to apply command for printer %s", ip)
            time.sleep(self.control_interval_seconds())
        LOGGER.info("Polling control worker loop stopped")

    def _worker(self) -> None:
        interval = self.interval_seconds()
        lead = self._config.get_string("polling.lead").strip()
        hostname = socket.gethostname()
        local_ip = self._resolve_local_ip()
        try:
            self._config.update_pc_info(hostname, local_ip)
        except Exception as config_exc:
            LOGGER.warning("Failed to save pc info to settings.json: %s", config_exc)
        lan_uid, fingerprint = self._resolve_lan_info(hostname=hostname, local_ip=local_ip)
        agent_uid = self._agent_uid or hostname
        
        # Initial registration to get/confirm lan_uid from server
        try:
            lan_uid = self._register_with_server(
                lead=lead,
                lan_uid=lan_uid,
                agent_uid=agent_uid,
                hostname=hostname,
                local_ip=local_ip,
                fingerprint=fingerprint,
            )
            # Register SSH public key right after successful registration
            self._ensure_and_register_ssh_key(lead, agent_uid)
            
            # Pre-populate printers list from server instantly on startup
            try:
                server_printers = self._api_client.get_printers()
                if server_printers:
                    self._last_discovered_printers = list(server_printers)
                    LOGGER.info("[PollingBridge] Pre-populated %d printers from server on startup", len(server_printers))
            except Exception as pre_exc:
                LOGGER.debug("[PollingBridge] Failed to pre-populate printers from server: %s", pre_exc)
        except Exception as exc:  # noqa: BLE001
            LOGGER.warning("Initial agent registration failed: %s", exc)

        LOGGER.info("Polling worker loop running: hostname=%s local_ip=%s lan_uid=%s", hostname, local_ip, lan_uid)
        if self._check_for_agent_update(lead, lan_uid, agent_uid, hostname, local_ip):
            return
        while not self._stop_event.is_set():
            try:
                self._config.reload()
            except Exception as exc:
                LOGGER.warning("Failed to reload configuration: %s", exc)

            if not self._config.get_bool("polling.enabled", False) or not self._config.get_bool("polling.device_enabled", True):
                time.sleep(1.0)
                continue

            LOGGER.debug("Heartbeat: agent running")
            refreshed_lan_uid, refreshed_fingerprint = self._resolve_lan_info(hostname=hostname, local_ip=local_ip)
            if refreshed_lan_uid and refreshed_lan_uid != lan_uid:
                LOGGER.info("LAN identity changed during runtime: %s -> %s", lan_uid, refreshed_lan_uid)
                lan_uid = refreshed_lan_uid
                fingerprint = refreshed_fingerprint or fingerprint
                try:
                    lan_uid = self._register_with_server(
                        lead=lead,
                        lan_uid=lan_uid,
                        agent_uid=agent_uid,
                        hostname=hostname,
                        local_ip=local_ip,
                        fingerprint=fingerprint,
                    )
                except Exception as exc:  # noqa: BLE001
                    LOGGER.warning("Runtime LAN re-registration failed: %s", exc)
            cycle_started_at = self._now_iso()
            self._last_cycle_at = self._now_iso()
            printers = self._load_printers()
            try:
                self._push_inventory(printers, hostname=hostname, local_ip=local_ip, lan_uid=lan_uid, fingerprint=fingerprint)
            except Exception as exc:  # noqa: BLE001
                LOGGER.warning("Polling inventory sync failed: %s", exc)
            # Legacy FTP control command queue (superseded by _reconcile_scan_address_ftp)
            pass
            self._last_cycle_total_printers = len(printers)
            self._last_cycle_ricoh_printers = 0
            self._last_cycle_sent = 0
            self._last_cycle_failed = 0
            runtime_metadata = self._agent_runtime_metadata()
            LOGGER.debug(
                "Polling cycle start: ts=%s total_printers=%s interval=%ss",
                cycle_started_at,
                self._last_cycle_total_printers,
                interval,
            )
            from concurrent.futures import ThreadPoolExecutor
            cycle_lock = threading.Lock()

            def _process_single_printer(printer: Printer) -> None:
                if self._stop_event.is_set():
                    return
                ip = str(printer.ip or "").strip()
                if not ip:
                    return
                if not self._applied_controls.get(ip, True):
                    LOGGER.debug("Polling skipped (disabled): name=%s ip=%s", printer.name, printer.ip)
                    return
                
                printer_type = self._printer_type(printer.printer_type)
                if printer_type == "ricoh" and not self._config.get_bool("modules.ricoh.enabled", True):
                    LOGGER.debug("Polling skipped (Ricoh disabled): name=%s ip=%s", printer.name, printer.ip)
                    return
                if printer_type == "toshiba" and not self._config.get_bool("modules.toshiba.enabled", True):
                    LOGGER.debug("Polling skipped (Toshiba disabled): name=%s ip=%s", printer.name, printer.ip)
                    return

                with cycle_lock:
                    self._last_cycle_ricoh_printers += 1
                
                try:
                    collector = self._collector_service_for(printer)
                    LOGGER.debug("Polling collect: name=%s ip=%s type=%s", printer.name, printer.ip, printer.printer_type)
                    counter_payload = collector.process_counter(printer, should_post=False)
                    status_payload = collector.process_status(printer, should_post=False)
                    counter_data = counter_payload.get("counter_data", {})
                    payload = {
                        "lead": lead,
                        "lan_uid": lan_uid,
                        "agent_uid": agent_uid,
                        "hostname": hostname,
                        "local_ip": local_ip,
                        "printer_name": counter_payload.get("printer_name", printer.name),
                        "ip": counter_payload.get("ip", printer.ip),
                        "mac_id": printer.mac_address,
                        "mac_address": printer.mac_address,
                        "timestamp": counter_payload.get("timestamp", datetime.now(timezone.utc).isoformat()),
                        "counter_data": counter_data,
                        "status_data": status_payload.get("status_data", {}),
                        "collector_ok": True,
                        "fingerprint_signature": fingerprint,
                    }
                    
                    payload.update(runtime_metadata)
                    LOGGER.debug("Polling payload -> %s", json.dumps(payload, ensure_ascii=False))
                    ack = self._post_payload(payload)
                    
                    # Check and update dynamic scripts if provided by server
                    remote_scripts = ack.get("scripts")
                    if isinstance(remote_scripts, dict):
                        try:
                            self._check_and_update_scripts(remote_scripts)
                        except Exception as script_exc:
                            LOGGER.warning("Failed to check or update scripts: %s", script_exc)
                    
                    with cycle_lock:
                        self._is_master = bool(ack.get("is_master", False))
                        self._emails = ack.get("emails") if isinstance(ack.get("emails"), list) else []
                        self._last_cycle_sent += 1
                        self._last_success_at = self._now_iso()
                        self._last_error = ""
                    
                    try:
                        self._reconcile_scan_address_ftp(self._is_master, self._emails)
                    except Exception as ftp_exc:
                        LOGGER.warning("FTP reconciliation failed during polling cycle: %s", ftp_exc)
                    
                    LOGGER.debug(
                        "Polling ack <- inserted(counter=%s,status=%s) skipped(counter=%s,status=%s)",
                        ack.get("inserted_counter", "?"),
                        ack.get("inserted_status", "?"),
                        ack.get("skipped_counter", "?"),
                        ack.get("skipped_status", "?"),
                    )
                    status_data = status_payload.get("status_data", {})
                    sys_status = status_data.get("system_status") or status_data.get("printer_status") or "OK"
                    
                    # Append status messages if present and not redundant
                    status_json = status_data.get("status_json")
                    if isinstance(status_json, dict):
                        alert_data = status_json.get("alert")
                        if isinstance(alert_data, dict):
                            messages = (alert_data.get("messages") or "").strip()
                            if messages and messages.lower() not in sys_status.lower():
                                sys_status = f"{sys_status} - {messages}"
                                
                    self._printer_physical_statuses[printer.ip] = sys_status
                    self._printer_online_states[printer.ip] = True
                except Exception as exc:  # noqa: BLE001
                    self._printer_online_states[printer.ip] = False
                    self._printer_physical_statuses[printer.ip] = "Offline"
                    with cycle_lock:
                        self._last_cycle_failed += 1
                        self._last_error = str(exc)
                    LOGGER.warning("Polling bridge failed for %s (%s): %s", printer.name, printer.ip, exc)
                    # Always send heartbeat payload even when collector fails.
                    try:
                        fallback_payload = {
                            "lead": lead,
                            "lan_uid": lan_uid,
                            "agent_uid": agent_uid,
                            "hostname": hostname,
                            "local_ip": local_ip,
                            "printer_name": str(printer.name or "").strip() or "Unknown Printer",
                            "ip": str(printer.ip or "").strip(),
                            "mac_id": str(printer.mac_address or "").strip(),
                            "mac_address": str(printer.mac_address or "").strip(),
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                            "counter_data": {},
                            "status_data": {},
                            "collector_ok": False,
                            "skip_data_update": True,
                            "collector_error": str(exc),
                            "fingerprint_signature": fingerprint,
                        }
                        
                        fallback_payload.update(runtime_metadata)
                        ack = self._post_payload(fallback_payload)
                        
                        # Check and update dynamic scripts if provided by server
                        remote_scripts = ack.get("scripts")
                        if isinstance(remote_scripts, dict):
                            try:
                                self._check_and_update_scripts(remote_scripts)
                            except Exception as script_exc:
                                LOGGER.warning("Failed to check or update scripts in fallback: %s", script_exc)
                        
                        with cycle_lock:
                            self._is_master = bool(ack.get("is_master", False))
                            self._emails = ack.get("emails") if isinstance(ack.get("emails"), list) else []
                            self._last_cycle_sent += 1
                            self._last_success_at = self._now_iso()
                        
                        try:
                            self._reconcile_scan_address_ftp(self._is_master, self._emails)
                        except Exception as ftp_exc:
                            LOGGER.warning("FTP reconciliation failed during polling fallback: %s", ftp_exc)
                        
                        LOGGER.debug(
                            "Polling fallback ack <- inserted(counter=%s,status=%s) skipped(counter=%s,status=%s)",
                            ack.get("inserted_counter", "?"),
                            ack.get("inserted_status", "?"),
                            ack.get("skipped_counter", "?"),
                            ack.get("skipped_status", "?"),
                        )
                    except Exception as post_exc:  # noqa: BLE001
                        LOGGER.warning("Polling fallback post failed for %s (%s): %s", printer.name, printer.ip, post_exc)

            # Poll printers in parallel using ThreadPoolExecutor
            if printers:
                with ThreadPoolExecutor(max_workers=min(16, len(printers))) as executor:
                    executor.map(_process_single_printer, printers)
            
            # Save printer online states to local file for GUI
            try:
                status_list = []
                for printer in printers:
                    ip = str(printer.ip or "").strip()
                    if not ip:
                        continue
                    is_online = self._printer_online_states.get(ip, False)
                    phys_status = self._printer_physical_statuses.get(ip, "Unknown") if is_online else "Offline"
                    status_list.append({
                        "name": printer.name,
                        "ip": printer.ip,
                        "mac_address": printer.mac_address,
                        "printer_type": printer.printer_type,
                        "status": "online" if is_online else "offline",
                        "physical_status": phys_status,
                        "is_online": is_online
                    })
                
                status_file = Path("storage/data/printers_status.json")
                status_file.parent.mkdir(parents=True, exist_ok=True)
                with status_file.open("w", encoding="utf-8") as f:
                    json.dump(status_list, f, indent=2, ensure_ascii=False)
            except Exception as write_err:
                LOGGER.warning("Failed to write printers_status.json: %s", write_err)

            LOGGER.info(
                "Polling cycle done: total=%s ricoh=%s sent=%s failed=%s",
                self._last_cycle_total_printers,
                self._last_cycle_ricoh_printers,
                self._last_cycle_sent,
                self._last_cycle_failed,
            )
            if self.scan_enabled():
                current_lan_uid = self._resolved_lan_uid or lan_uid
                self._run_scan_cycle(lead, current_lan_uid, agent_uid, hostname, local_ip, fingerprint, reason="polling-cycle")
            if self._check_for_agent_update(lead, lan_uid, agent_uid, hostname, local_ip):
                break
            triggered = self._trigger_event.wait(self.interval_seconds())
            if triggered:
                self._trigger_event.clear()
