from __future__ import annotations

import json
import logging
import os
import re
import socket
import subprocess
import tempfile
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
from .polling_worker_mixin import PollingWorkerMixin
from .polling_control_mixin import PollingControlMixin
from .polling_ip_change_mixin import PollingIpChangeMixin
from .polling_scan_points_mixin import PollingScanPointsMixin


LOGGER = logging.getLogger(__name__)
DEFAULT_WEB_PORT = 9173
SCAN_UPLOAD_STATE_FILE = Path("storage/data/scan_upload_state.json")
MAX_SCAN_UPLOAD_HISTORY = 5000

PRINTER_ACTION_COMMANDS: list[str] = [
    "save_printer_auth",
    "update_credentials",
    "update_copier_credentials",
    "fetch_address_book",
    "add_scan_email_dest",
    "delete_scan_email_dest",
    "address_modify",
    "add_scan_point",
    "add_email",
    "delete_email",
    "enable_disable",
]


class PollingBridge(PollingWorkerMixin, PollingControlMixin, PollingIpChangeMixin, PollingScanPointsMixin):
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
        self._last_camera_scan_at: datetime | None = None
        self._last_discovered_cameras: list[dict] = []
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
        self._scan_point_sync_thread = None
        self._ip_change_lock = threading.Lock()
        self._force_next_scan_live = False

    @staticmethod
    def _printer_type(value: str) -> str:
        return str(value or "").strip().lower()

    def _collector_service_for(self, printer: Printer) -> RicohService | ToshibaService:
        ptype = str(getattr(printer, "printer_type", "") or "").lower()
        pname = str(getattr(printer, "name", "") or "").lower()
        if self._toshiba_service is not None and any(kw in ptype or kw in pname for kw in ("toshiba", "estudio", "e-studio")):
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
    def _is_placeholder_printer_name(name: str, ip: str = "") -> bool:
        if not name or not name.strip():
            return True
        text = str(name).strip().lower()
        ip_str = str(ip).strip().lower()
        if ip_str and text == ip_str:
            return True
        if any(kw in text for kw in ("unknown", "copier (", "thiết bị photocopy", "discovery")):
            return True
        return False

    @staticmethod
    def _probe_real_device_name(ip: str) -> str:
        """Tự động thám dò TÊN THẬT SỰ & MODEL CHÍNH XÁC của thiết bị Ricoh, Toshiba, HP, Canon, Brother, Fujifilm..."""
        if not ip or not ip.strip():
            return ""
        ip_str = ip.strip()

        # 1. Probe via Ricoh / Toshiba / HP / Canon Web Scraping (Port 80/443)
        for proto in ("http", "https"):
            try:
                import urllib.request
                import ssl
                import re
                ctx = ssl.create_default_context()
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE
                
                urls = [
                    f"{proto}://{ip_str}/",
                    f"{proto}://{ip_str}/web/guest/en/websys/webArch/topPage.cgi",
                    f"{proto}://{ip_str}/main.asp",
                ]
                for url in urls:
                    try:
                        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                        with urllib.request.urlopen(req, timeout=1.5, context=ctx) as resp:
                            html = resp.read().decode("utf-8", errors="ignore")
                            
                            # Extract Ricoh / Toshiba / HP / Canon / Xerox / Fujifilm model from HTML
                            m = re.search(r"\b(Aficio\s+MP\s*\d+|MP\s*\d+|e-STUDIO\s*\d+\w*|HP\s+[A-Za-z0-9\s\-]+|Canon\s+[A-Za-z0-9\s\-]+|DocuCentre\s+[A-Za-z0-9\s\-]+)\b", html, re.IGNORECASE)
                            if m:
                                model_str = re.sub(r"\s+", " ", m.group(1)).strip()
                                if len(model_str) >= 4 and not model_str.lower().startswith("http"):
                                    return model_str

                            # Fallback to <title>
                            match_title = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
                            if match_title:
                                title = match_title.group(1).strip()
                                clean_title = re.sub(r"\s+", " ", title)
                                if clean_title and clean_title.lower() not in ("index", "home", "login", "welcome"):
                                    if clean_title.lower() == "web image monitor":
                                        m2 = re.search(r"\b(MP\s*\d+|Aficio\s+MP\s*\d+)\b", html, re.IGNORECASE)
                                        if m2:
                                            return m2.group(1).strip()
                                    else:
                                        return clean_title
                    except Exception:
                        pass
            except Exception:
                pass

        # 2. Probe via PJL @PJL INFO ID (Port 9100)
        try:
            import socket
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1.0)
            s.connect((ip_str, 9100))
            s.sendall(b"\x1b%-12345X@PJL INFO ID\r\n\x1b%-12345X")
            data = s.recv(1024).decode("utf-8", errors="ignore")
            s.close()
            if data and "ID" in data.upper():
                for line in data.splitlines():
                    if "ID" in line.upper() and "=" in line:
                        name = line.split("=", 1)[1].replace('"', '').strip()
                        if name:
                            return name
        except Exception:
            pass

        return ""

    @staticmethod
    def _resolve_local_ip() -> str:
        import time
        now = time.time()
        cached_ip = getattr(PollingBridge._resolve_local_ip, "_cached_ip", "")
        cached_time = getattr(PollingBridge._resolve_local_ip, "_cached_time", 0.0)
        if cached_ip and (now - cached_time < 15.0):
            return cached_ip

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

        # If we already have a valid unicast IP, skip running the slow powershell command!
        has_unicast = any(PollingBridge._ipv4_scope_score(c) >= 200 for c in candidates)
        if not has_unicast:
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

        ret_ip = best_ip or ""
        PollingBridge._resolve_local_ip._cached_ip = ret_ip
        PollingBridge._resolve_local_ip._cached_time = now
        return ret_ip

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
                **no_window_subprocess_kwargs(),
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

        if not self._scan_point_sync_thread or not self._scan_point_sync_thread.is_alive():
            self._ensure_scan_points_json_exists()
            self._scan_point_sync_thread = threading.Thread(target=self._scan_point_sync_loop, daemon=True, name="polling-scan-point-sync")
            self._scan_point_sync_thread.start()
            LOGGER.info("Scan point periodic sync thread initialized (30-sec initial delay, fixed schedule)")

        # Auto-resume camera recordings on startup ONLY if camera.auto_resume is enabled
        try:
            if self._config.get_bool("camera.auto_resume", False):
                from agent.services.camera_manager import CameraManager
                cm = CameraManager()
                local_cfg_path = Path("storage/camera_configs.json")
                if local_cfg_path.exists():
                    with local_cfg_path.open("r", encoding="utf-8") as f:
                        configs = json.load(f)
                import tempfile
                default_out = str(Path(tempfile.gettempdir()) / "GoPrinxAgent" / "video")
                output_dir = self._config.get_string("camera.output_dir", default_out)
                for cfg in configs:
                    camera_name = cfg.get("camera_name")
                    rtsp_url = cfg.get("rtsp_url")
                    if camera_name and rtsp_url:
                        LOGGER.info("[PollingBridge] Auto-resuming camera recording for: %s", camera_name)
                        cm.start_recording(
                            camera_name=camera_name,
                            rtsp_url=rtsp_url,
                            output_dir=output_dir,
                            segment_duration=cfg.get("segment_duration", 60),
                            video_codec=cfg.get("video_codec", "copy"),
                            audio_codec=cfg.get("audio_codec", "copy"),
                            no_audio=cfg.get("no_audio", True),
                            prefix=cfg.get("prefix", "rec")
                        )
        except Exception as e:
            LOGGER.error("Failed to auto-resume camera recordings on startup: %s", e)

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
        try:
            if self._scan_point_sync_thread and self._scan_point_sync_thread.is_alive():
                self._scan_point_sync_thread.join(timeout=3)
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

    def _run_subnet_scan_cycle(self, force_live: bool = False) -> None:
        self._force_next_scan_live = force_live
        LOGGER.info("[PollingBridge] Configured next scan cycle to run with force_live=%s", force_live)

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

    @staticmethod
    def _is_generic_printer_name(name: str, ip: str = "") -> bool:
        s = str(name or "").strip()
        if not s or s.lower() in {"unknown", "copier", "discovery", "unknown printer", "printer"}:
            return True
        if s.startswith("[ERROR]") or "error" in s.lower() or "failed" in s.lower():
            return True
        clean_ip = str(ip or "").strip()
        if clean_ip and (s == clean_ip or s == f"Copier ({clean_ip})" or s == f"Printer ({clean_ip})"):
            return True
        import re
        if re.fullmatch(r"\d{1,3}(?:\.\d{1,3}){3}", s):
            return True
        return False

    @staticmethod
    def _is_printer_vendor_mac(mac: str) -> bool:
        clean = str(mac or "").replace("-", ":").upper()
        # Known printer vendor MAC OUIs: Ricoh, Toshiba, Xerox, Canon, HP, Epson, Brother, Kyocera, Fujifilm, Konica Minolta
        prefixes = (
            "00:26:73", "58:38:79", "00:00:74", "00:80:91", "00:10:A4", "00:00:AA",
            "00:1B:A9", "00:00:85", "00:1E:0B", "00:08:C7", "00:00:48", "00:21:B7", "00:15:99",
            "00:25:07", "00:20:6B", "00:04:00"
        )
        return clean.startswith(prefixes)

    @staticmethod
    def _extract_model_from_html(html: str) -> str:
        if not html:
            return ""
        import re
        import html as html_module
        unescaped_html = html_module.unescape(html)

        # 1. Match Printer model names across ALL major brands (Ricoh, Toshiba, HP, Canon, Xerox, Brother, Epson, Kyocera, Fujifilm, Samsung, Konica)
        patterns = [
            # Ricoh
            r"\b(Aficio\s+MP\s*\d{3,4}[A-Z0-9_-]*)\b",
            r"\b(MP\s+[WCS]?\d{3,4}[A-Z0-9_-]*)\b",
            r"\b(Pro\s+C?\d{4,5}[A-Z0-9_-]*)\b",
            r"\b(SP\s+C?\d{3,4}[A-Z0-9_-]*)\b",
            r"\b(RICOH\s+[A-Z0-9_\s-]{3,25})\b",
            # Toshiba
            r"\b(e-STUDIO\s*\d{3,4}[A-Z0-9_-]*)\b",
            r"\b(e-STUDIO\d{3,4}[A-Z0-9_-]*)\b",
            r"\b(TOSHIBA\s+[A-Z0-9_\s-]{3,25})\b",
            # HP
            r"\b(HP\s+(?:Color\s+)?(?:LaserJet|OfficeJet|PageWide|DeskJet|ENVY|Smart\s+Tank)\s+[A-Z0-9_\s-]{3,25})\b",
            r"\b(LaserJet\s+(?:Pro\s+|Enterprise\s+|Managed\s+)?[A-Z0-9_\s-]{3,20})\b",
            r"\b(OfficeJet\s+(?:Pro\s+)?[A-Z0-9_\s-]{3,20})\b",
            r"\b(PageWide\s+(?:Pro\s+|Managed\s+)?[A-Z0-9_\s-]{3,20})\b",
            # Canon
            r"\b(imageRUNNER\s+(?:ADVANCE\s+)?[A-Z0-9_\s-]{3,25})\b",
            r"\b(iR-ADV\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(iR\s*\d{3,4}[A-Z0-9_-]*)\b",
            r"\b(imageCLASS\s+[A-Z0-9_\s-]{3,25})\b",
            r"\b(PIXMA\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(MAXIFY\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(Canon\s+[A-Z0-9_\s-]{3,25})\b",
            # Xerox
            r"\b(Xerox\s+[A-Z0-9_\s-]{3,25})\b",
            r"\b(VersaLink\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(AltaLink\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(WorkCentre\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(Phaser\s+[A-Z0-9_\s-]{3,20})\b",
            # Brother
            r"\b(Brother\s+[A-Z0-9_\s-]{3,25})\b",
            r"\b(HL-[A-Z0-9_-]{3,15})\b",
            r"\b(MFC-[A-Z0-9_-]{3,15})\b",
            r"\b(DCP-[A-Z0-9_-]{3,15})\b",
            # Epson
            r"\b(Epson\s+[A-Z0-9_\s-]{3,25})\b",
            r"\b(WorkForce\s+(?:Pro\s+)?[A-Z0-9_\s-]{3,20})\b",
            r"\b(EcoTank\s+[A-Z0-9_\s-]{3,20})\b",
            # Kyocera
            r"\b(TASKalfa\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(ECOSYS\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(Kyocera\s+[A-Z0-9_\s-]{3,25})\b",
            # Fujifilm / Fuji Xerox
            r"\b(ApeosPort\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(DocuCentre\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(Fujifilm\s+[A-Z0-9_\s-]{3,25})\b",
            # Samsung
            r"\b(MultiXpress\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(ProXpress\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(Samsung\s+[A-Z0-9_\s-]{3,25})\b",
            # Konica Minolta
            r"\b(bizhub\s+[A-Z0-9_\s-]{3,20})\b",
            r"\b(Konica\s+Minolta\s+[A-Z0-9_\s-]{3,25})\b",
        ]
        for pat in patterns:
            m = re.search(pat, unescaped_html, re.IGNORECASE)
            if m:
                res = re.sub(r"\s+", " ", m.group(1)).strip()
                if len(res) >= 3 and not re.fullmatch(r"\d{1,3}(?:\.\d{1,3}){3}", res):
                    return res

        # 2. Check <title>
        title_m = re.search(r"<title[^>]*>(.*?)</title>", unescaped_html, re.IGNORECASE | re.DOTALL)
        if title_m:
            t = re.sub(r"<[^>]*>", "", title_m.group(1)).strip()
            t = re.sub(
                r"^(Web Image Monitor|TopAccess|Device Status|Printer|Copier|System Status|HP Embedded Web Server|Embedded Web Server|Remote UI|CentreWare Internet Services|SyncThru Web Service|SyncThru|EWS)\s*[-:|]?\s*",
                "",
                t,
                flags=re.IGNORECASE,
            ).strip()
            t_lower = t.lower()
            if any(ign in t_lower for ign in ("router", "gateway", "tp-link", "asus", "d-link", "huawei", "zte", "totolink", "draytek", "mikrotik")):
                return ""
            if t and len(t) < 40 and t_lower not in {"web image monitor", "topaccess", "login", "home", "index", "main", "embedded web server", "remote ui"} and not re.fullmatch(r"\d{1,3}(?:\.\d{1,3}){3}", t):
                return t

        return ""

    @staticmethod
    def _probe_snmp_model_name(ip: str) -> str:
        import socket
        import re
        # Raw SNMP v1 request for sysDescr / sysName with community "public"
        packet = b"\x30\x26\x02\x01\x00\x04\x06public\xa0\x19\x02\x04\x12\x34\x56\x78\x02\x01\x00\x02\x01\x00\x30\x0b\x30\x09\x06\x05\x2b\x06\x01\x02\x01\x01\x00"
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(1.2)
        try:
            sock.sendto(packet, (ip, 161))
            data, _ = sock.recvfrom(2048)
            text = data.decode("latin1", errors="ignore")
            m = re.search(r"(Ricoh|Toshiba|Canon|Epson|HP|Xerox|Fujifilm|Brother|MP\s*\d{3,4}|e-STUDIO\s*\d{3,4})[^\x00-\x1f\x7f-\xff]*", text, re.IGNORECASE)
            if m:
                clean = re.sub(r"\s+", " ", m.group(0)).strip()
                if len(clean) >= 3 and not re.fullmatch(r"\d{1,3}(?:\.\d{1,3}){3}", clean):
                    return clean
        except Exception:
            pass
        finally:
            sock.close()
        return ""

    @staticmethod
    def _probe_snmp_counter(ip: str) -> int:
        import socket
        if not ip:
            return 0
        # SNMP v1 GetRequest for OID .1.3.6.1.2.1.43.10.2.1.4.1.1 (prtMarkerLifeCount)
        packet = b"\x30\x2f\x02\x01\x00\x04\x06public\xa0\x22\x02\x04\x12\x34\x56\x79\x02\x01\x00\x02\x01\x00\x30\x14\x30\x12\x06\x0e\x2b\x06\x01\x02\x01\x2b\x0a\x02\x01\x04\x01\x01\x00\x05\x00"
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(1.5)
        try:
            sock.sendto(packet, (ip, 161))
            data, _ = sock.recvfrom(2048)
            if len(data) > 10:
                for idx in range(len(data) - 1, 10, -1):
                    if data[idx - 1] in (0x02, 0x41):
                        val_len = data[idx]
                        if 1 <= val_len <= 8 and idx + val_len < len(data):
                            val_bytes = data[idx + 1 : idx + 1 + val_len]
                            val = int.from_bytes(val_bytes, byteorder="big", signed=False)
                            if val > 0:
                                return val
        except Exception:
            pass
        finally:
            sock.close()
        return 0

    def _ensure_printer_name_via_web_probe(self, printer: Printer) -> Printer:
        ip = str(getattr(printer, "ip", "") or "").strip()
        # curr_name = str(getattr(printer, "name", "") or "").strip()

        # if ip and not self._is_generic_printer_name(curr_name, ip):
        #     return printer

        if not ip:
            if not printer.name:
                printer.name = "[ERROR] Web probe failed: Missing IP address"
                LOGGER.error("[PollingBridge] HTTP/HTTPS Probing failed: Missing IP address")
            return printer

        mac = self._normalize_mac(str(getattr(printer, "mac_address", "") or "").strip())
        p_type = self._printer_type(str(getattr(printer, "printer_type", "") or ""))
        probe_errors: list[str] = []

        # Retry up to 3 consecutive attempts to resolve the printer name
        for attempt in range(1, 4):
            # 1. Standard collector probe
            try:
                probed = self._probe_discovered_printer(ip=ip, mac=mac, preferred_type=p_type)
                if probed is not None and probed.name and not self._is_generic_printer_name(probed.name, ip):
                    LOGGER.info("[PollingBridge] Attempt %s/3: Standard probe resolved name '%s' for ip=%s", attempt, probed.name, ip)
                    printer.name = probed.name
                    printer.printer_type = self._detect_printer_type(probed.name, mac)
                    if probed.mac_address and not mac:
                        printer.mac_address = probed.mac_address
                    printer.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    return printer
            except Exception as exc:
                probe_errors.append(f"Attempt {attempt} Collector: {exc}")

            # 2. Fast parallel Web UI frame probing (Ricoh header/topPage/mainFrame + Toshiba TopAccess)
            probe_urls = [
                f"http://{ip}/",
                f"https://{ip}/",
                f"http://{ip}/web/guest/en/websys/webArch/header.cgi",
                f"http://{ip}/web/guest/en/websys/webArch/topPage.cgi",
                f"http://{ip}/web/guest/en/websys/webArch/mainFrame.cgi",
                f"http://{ip}/web/guest/en/websys/status/configuration.cgi",
                f"https://{ip}/web/guest/en/websys/webArch/header.cgi",
                f"http://{ip}/?MAIN=TOPACCESS",
                f"https://{ip}/?MAIN=TOPACCESS",
                f"http://{ip}/hp/device/this.LCDispatcher",
                f"http://{ip}/m_index.cgi",
                f"http://{ip}/general/status.html",
            ]

            import requests
            from concurrent.futures import ThreadPoolExecutor, as_completed

            def _fetch_url_model(target_url: str) -> tuple[str, str]:
                try:
                    resp = requests.get(target_url, timeout=2.0, verify=False)
                    if resp.status_code in {200, 301, 302}:
                        model = self._extract_model_from_html(resp.text)
                        if model:
                            return model, ""
                        return "", f"{target_url} HTTP {resp.status_code} (no model parsed)"
                    return "", f"{target_url} HTTP {resp.status_code}"
                except Exception as exc:
                    return "", f"{target_url}: {exc}"

            try:
                with ThreadPoolExecutor(max_workers=len(probe_urls)) as executor:
                    futures = [executor.submit(_fetch_url_model, url) for url in probe_urls]
                    for future in as_completed(futures, timeout=3.0):
                        model_found, err_detail = future.result()
                        if model_found and not self._is_generic_printer_name(model_found, ip):
                            LOGGER.info("[PollingBridge] Attempt %s/3: Parallel Web UI probe resolved model '%s' for ip=%s", attempt, model_found, ip)
                            printer.name = model_found
                            printer.printer_type = self._detect_printer_type(model_found, mac)
                            printer.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                            return printer
                        elif err_detail:
                            probe_errors.append(err_detail)
            except Exception as exc:
                probe_errors.append(f"Attempt {attempt} Parallel probe error: {exc}")

            # 3. SNMP sysDescr probe fallback
            snmp_model = self._probe_snmp_model_name(ip)
            if snmp_model and not self._is_generic_printer_name(snmp_model, ip):
                LOGGER.info("[PollingBridge] Attempt %s/3: SNMP probe resolved model '%s' for ip=%s", attempt, snmp_model, ip)
                printer.name = snmp_model
                printer.printer_type = self._detect_printer_type(snmp_model, mac)
                printer.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                return printer

            if attempt < 3:
                time.sleep(0.5)

        # 4. Probe Failed after 3 attempts: Store specific error in printer.name & write to sterror.txt via LOGGER.error
        first_err = probe_errors[0] if probe_errors else "HTTP/HTTPS & SNMP probe timed out"
        if len(first_err) > 60:
            first_err = first_err[:57] + "..."
        error_name = f"[ERROR] Web probe failed after 3 attempts for {ip}: {first_err}"
        printer.name = error_name
        printer.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        LOGGER.error("[PollingBridge] HTTP/HTTPS Probing (1) failed after 3 consecutive attempts for ip=%s: %s", ip, first_err)

        return printer

    def _deduplicate_printers_by_mac(self, printers: list[Printer]) -> list[Printer]:
        by_mac: dict[str, Printer] = {}
        by_ip: dict[str, Printer] = {}

        for p in printers:
            mac = self._normalize_mac(str(getattr(p, "mac_address", "") or ""))
            ip = str(getattr(p, "ip", "") or "").strip()
            p_name = str(getattr(p, "name", "") or "").strip()

            if mac:
                if mac not in by_mac:
                    by_mac[mac] = p
                else:
                    existing = by_mac[mac]
                    ex_name = str(getattr(existing, "name", "") or "").strip()
                    ex_ip = str(getattr(existing, "ip", "") or "").strip()
                    if self._is_generic_printer_name(ex_name, ex_ip) and not self._is_generic_printer_name(p_name, ip):
                        by_mac[mac] = p
                    elif not getattr(existing, "id", None) and getattr(p, "id", None):
                        by_mac[mac] = p
            elif ip:
                if ip not in by_ip:
                    by_ip[ip] = p

        existing_ips_in_mac = {str(getattr(p, "ip", "") or "").strip() for p in by_mac.values() if getattr(p, "ip", None)}
        filtered_by_ip = [p for ip, p in by_ip.items() if ip not in existing_ips_in_mac]

        return list(by_mac.values()) + filtered_by_ip

    @staticmethod
    def _load_local_printers_json() -> list[Printer]:
        try:
            import json, os, tempfile
            local_app = os.getenv("LOCALAPPDATA", "")
            candidates = [
                Path(tempfile.gettempdir()) / "GoPrinxAgent" / "printers.json",
                Path("storage") / "data" / "printers.json",
            ]
            if local_app:
                candidates.insert(0, Path(local_app) / "Temp" / "GoPrinxAgent" / "printers.json")

            for target_file in candidates:
                if target_file.exists():
                    with open(target_file, "r", encoding="utf-8", errors="replace") as f:
                        raw_list = json.load(f)
                        if isinstance(raw_list, list):
                            res: list[Printer] = []
                            for item in raw_list:
                                if isinstance(item, dict):
                                    p_name = str(item.get("name", "") or "").strip()
                                    ip = str(item.get("ip", "") or "").strip()
                                    raw_mac = str(item.get("mac_address", "") or "").strip()
                                    clean_mac = raw_mac.replace("-", ":").upper() if raw_mac else ""

                                    is_router = any(kw in p_name.lower() for kw in ("f6600", "h3601", "router", "gateway", "tp-link", "asus", "d-link", "huawei", "zte", "totolink", "draytek", "mikrotik"))
                                    if is_router:
                                        continue

                                    p_user = str(item.get("auth_user", "") or item.get("user", "") or "").strip()
                                    p_pass = str(item.get("auth_password", "") or item.get("password", "") or "").strip()
                                    p_is_online = bool(item.get("is_online", True)) if "is_online" in item else (str(item.get("status", "")).lower() != "offline")
                                    res.append(Printer(
                                        id=item.get("id", 0) or 0,
                                        name=p_name,
                                        ip=ip,
                                        user=p_user,
                                        password=p_pass,
                                        printer_type=str(item.get("printer_type", "") or item.get("type", "") or "").strip(),
                                        status="online" if p_is_online else "offline",
                                        is_online=p_is_online,
                                        mac_address=clean_mac or raw_mac,
                                        updated_at=str(item.get("updated_at", "") or "").strip(),
                                    ))
                            return res
        except Exception as exc:
            LOGGER.warning("_load_local_printers_json failed: %s", exc)
        return []

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
        import time
        now = time.time()
        if hasattr(self, "_last_lan_info_time") and (now - self._last_lan_info_time < 60.0):
            if getattr(self, "_cached_lan_uid", ""):
                return self._cached_lan_uid, getattr(self, "_cached_signature", "")

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
        ret_uid = ""
        if composed_uid:
            self._resolved_lan_uid = composed_uid
            ret_uid = composed_uid
        elif self._resolved_lan_uid:
            ret_uid = self._resolved_lan_uid

        if not ret_uid:
            ret_uid = ""

        self._last_lan_info_time = now
        self._cached_lan_uid = ret_uid
        self._cached_signature = signature

        return ret_uid, signature

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

