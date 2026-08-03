from __future__ import annotations
import logging
import json
import os
import re
import socket
import subprocess
import tempfile
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
import requests
from typing import Any
from agent.services.api_client import APIClient, Printer
from agent.services.runtime import get_machine_agent_uid, no_window_subprocess_kwargs, user_temp_root
from agent.services.ftp_store import load_config, find_site_by_port, find_site_by_name, normalize_site_name
from agent.services.ftp_control import FtpControlCommand

LOGGER = logging.getLogger(__name__)

class PollingScanPointsMixin:

    def _sync_down_scan_points_from_vps(self) -> None:
        """
        Per user directive:
        1. Fetch all scan_points from VPS (GET /api/lan-sites/scan-points?lead=default).
        2. Filter items matching printers managed by this agent (by MAC address / IP).
        3. Write filtered result to local scan_points.json ONLY for user inspection (never read for logic).
        """
        try:
            base_url = self._polling_base_url()
            if not base_url:
                return
            lead = self._config.get_string("polling.lead", "default").strip()
            url = f"{base_url}/api/lan-sites/scan-points?lead={lead}"
            
            headers = {}
            token = self._config.get_string("polling.token").strip()
            if token:
                headers["X-API-Token"] = token
                
            import requests
            resp = requests.get(url, headers=headers, timeout=10)
            if not resp.ok:
                LOGGER.warning("[ScanPointSyncDown] VPS fetch scan-points returned HTTP %s", resp.status_code)
                return
                
            resp_data = resp.json()
            vps_points = {}
            if isinstance(resp_data, dict):
                vps_points = resp_data.get("scan_points") or resp_data
            elif isinstance(resp_data, list):
                for item in resp_data:
                    if isinstance(item, dict):
                        m_id = str(item.get("mac_address") or item.get("mac_id") or item.get("mac") or "").upper().replace("-", ":")
                        if m_id:
                            vps_points[m_id] = item
                            
            if not isinstance(vps_points, dict):
                return

            # Collect managed printer MACs & IPs for this agent
            managed_macs = set()
            managed_ips = set()
            printers = self._load_local_printers_json() or self._load_printers() or getattr(self, "_last_discovered_printers", [])
            for p in printers:
                p_mac = str(getattr(p, "mac_address", "") or getattr(p, "mac_id", "") or "").upper().replace("-", ":")
                p_ip = str(getattr(p, "ip", "") or "").strip()
                if p_mac:
                    managed_macs.add(p_mac)
                if p_ip:
                    managed_ips.add(p_ip)

            filtered_points = {}
            for k_mac, sp_item in vps_points.items():
                if not isinstance(sp_item, dict):
                    continue
                item_mac = str(sp_item.get("mac_address") or sp_item.get("mac_id") or k_mac).upper().replace("-", ":")
                item_ip = str(sp_item.get("ip") or "").strip()
                item_agent = str(sp_item.get("agent_uid") or "").strip()
                
                # Match if item belongs to printers managed by this agent or matching agent_uid
                if (item_mac in managed_macs) or (item_ip in managed_ips) or (item_agent and item_agent == self._agent_uid) or not managed_macs:
                    key = item_mac or item_ip
                    if key:
                        # Flatten: unwrap nested address_book_sync
                        flat_item = dict(sp_item)
                        while "address_book_sync" in flat_item and "address_list" not in flat_item:
                            inner = flat_item.pop("address_book_sync", {})
                            if isinstance(inner, dict):
                                flat_item.update(inner)
                            else:
                                break
                        filtered_points[key] = flat_item

            if filtered_points:
                self._write_scan_points_json_to_disk(filtered_points)
                LOGGER.info("[ScanPointSyncDown] Updated local scan_points.json from VPS with %d managed printer scan points", len(filtered_points))
            else:
                LOGGER.debug("[ScanPointSyncDown] VPS returned empty scan points. Preserving local cache.")
        except Exception as exc:
            LOGGER.warning("[ScanPointSyncDown] Failed to fetch/sync scan points from VPS: %s", exc)

    @classmethod
    def _write_scan_points_json_to_disk(cls, points_data: dict[str, Any]) -> None:
        try:
            import json, os, tempfile
            local_app = os.getenv("LOCALAPPDATA", "")
            user_prof = os.getenv("USERPROFILE", "")
            save_dirs = [
                Path(tempfile.gettempdir()) / "GoPrinxAgent",
                Path("storage") / "data",
                Path("C:/Users/Kythuat-02/AppData/Local/Temp/GoPrinxAgent"),
                Path("C:/ProgramData/GoPrinxAgent"),
            ]
            if user_prof:
                save_dirs.insert(0, Path(user_prof) / "AppData" / "Local" / "Temp" / "GoPrinxAgent")
            if local_app:
                save_dirs.insert(0, Path(local_app) / "Temp" / "GoPrinxAgent")

            for target_dir in save_dirs:
                try:
                    target_dir.mkdir(parents=True, exist_ok=True)
                    target_file = target_dir / "scan_points.json"
                    with open(target_file, "w", encoding="utf-8") as f:
                        json.dump(points_data, f, indent=2, ensure_ascii=False)
                except Exception as file_exc:
                    LOGGER.warning("[ScanPointSyncDown] Failed writing scan_points.json to %s: %s", target_dir, file_exc)
        except Exception as exc:
            LOGGER.warning("_write_scan_points_json_to_disk failed: %s", exc)

    def _scan_point_sync_loop(self) -> None:
        """Periodic sync thread: scans real address books from printers, posts to VPS, then downloads scan_points from VPS to scan_points.json."""
        LOGGER.info("[ScanPointSync] Scheduled scan points sync thread started.")
        
        # Initial sync down from VPS at startup
        try:
            self._sync_down_scan_points_from_vps()
        except Exception as exc:
            LOGGER.warning("[ScanPointSync] Initial VPS sync down failed: %s", exc)
        
        # Initial real address book scan cycle
        try:
            LOGGER.info("[ScanPointSync] Running initial real address book scan cycle...")
            self.run_scan_point_sync_cycle()
        except Exception as exc:
            LOGGER.error("[ScanPointSync] Initial scan points sync cycle failed: %s", exc, exc_info=True)

        # Periodic loop every 30 seconds
        while not self._stop_event.is_set():
            try:
                self._sync_down_scan_points_from_vps()
            except Exception as exc:
                LOGGER.error("[ScanPointSync] Periodic scan points sync down failed: %s", exc)

            for _ in range(30):
                if self._stop_event.is_set():
                    break
                time.sleep(1.0)

    def _acquire_lan_sync_lock(self, slot: str) -> dict[str, Any]:
        base_url = self._polling_base_url()
        if not base_url or not self._resolved_lan_uid:
            return {"acquired": True}
        url = f"{base_url}/api/lan-sites/acquire-sync-lock"
        payload = {
            "lan_uid": self._resolved_lan_uid,
            "slot": slot,
            "agent_uid": self._agent_uid,
        }
        headers = {"Content-Type": "application/json"}
        token = self._config.get_string("polling.token").strip()
        if token:
            headers["X-API-Token"] = token
        try:
            import requests
            resp = requests.post(url, json=payload, headers=headers, timeout=5)
            if resp.ok:
                return resp.json()
        except Exception as exc:  # noqa: BLE001
            LOGGER.warning("[_acquire_lan_sync_lock] Failed to check sync lock: %s", exc)
        return {"acquired": True}

    def _post_address_book_sync_data(self, printer: Any, address_book_data: dict[str, Any]) -> None:
        p_mac = str(getattr(printer, "mac_address", "") or "").strip().upper().replace("-", ":")
        p_ip = str(getattr(printer, "ip", "") or "").strip()
        p_name = str(getattr(printer, "name", "") or "").strip()

        base_url = self._polling_base_url()
        if not base_url:
            return
        token = self._config.get_string("polling.token").strip()
        lead = self._config.get_string("polling.lead").strip()
        url = f"{base_url}/api/polling/address-book-sync"
        payload = {
            "lead": lead,
            "agent_uid": self._agent_uid,
            "printer_ip": p_ip,
            "mac_address": p_mac,
            "printer_name": p_name,
            "address_book_data": address_book_data,
        }
        headers = {"Content-Type": "application/json"}
        if token:
            headers["X-API-Token"] = token
        try:
            import requests
            resp = requests.post(url, json=payload, headers=headers, timeout=15)
            LOGGER.debug("[_post_address_book_sync_data] Response status: %s", resp.status_code)
            
            # Immediately download updated scan points from VPS to local scan_points.json for inspection
            self._sync_down_scan_points_from_vps()
        except Exception as exc:  # noqa: BLE001
            LOGGER.warning("[_post_address_book_sync_data] Failed to post address book sync data to VPS: %s", exc)

    def run_scan_point_sync_cycle(self, slot: str = "") -> None:
        printers = self._load_local_printers_json() or self._load_printers()
        if not printers:
            LOGGER.info("[ScanPointSync] No printers configured for scan point sync.")
            return

        local_ip = self._resolve_local_ip()

        for printer in printers:
            if self._stop_event.is_set():
                break
            if not getattr(printer, "is_online", True):
                continue

            try:
                LOGGER.info("[ScanPointSync] Fetching scan points (address_list) for copier %s (IP: %s)...", printer.name, printer.ip)
                collector = self._collector_service_for(printer)
                payload = collector.process_address_list(printer)
                entries = payload.get("address_list", []) if isinstance(payload, dict) else []

                # --- Requirement (2): Scan Point FTP IP Repair Logic ---
                has_repaired = False
                for entry in entries:
                    folder = str(entry.get("folder", "") or entry.get("folder_path", "") or "").strip()
                    if not folder or ("ftp://" not in folder.lower() and not folder.lower().startswith("ftp:")):
                        continue

                    # Extract FTP server IP
                    ftp_ip = ""
                    if folder.lower().startswith("ftp://"):
                        match = re.match(r"ftp://([^:/]+)", folder, re.I)
                        if match:
                            ftp_ip = match.group(1)

                    if ftp_ip and local_ip and ftp_ip != local_ip:
                        import subprocess
                        ping_res = subprocess.run(["ping", "-n", "1", "-w", "400", ftp_ip], capture_output=True)
                        if ping_res.returncode != 0:
                            # Stale/non-existent FTP IP detected! Repair scan_point FTP IP on copier to current local_ip
                            LOGGER.info(
                                "[ScanPointRepair] Dead FTP IP %s detected for entry '%s' (reg_no=%s) on copier %s (%s). Repairing to current Agent IP %s...",
                                ftp_ip, entry.get("name"), entry.get("registration_no"), printer.name, printer.ip, local_ip
                            )
                            try:
                                entry_name = entry.get("name") or "Scan"
                                self._ricoh_service.setup_scan_destination(
                                    printer=printer,
                                    username=entry_name,
                                    email="",
                                    session=None
                                )
                                has_repaired = True
                                LOGGER.info("[ScanPointRepair] Successfully updated scan point FTP IP on copier %s to %s!", printer.ip, local_ip)
                            except Exception as rep_exc:
                                LOGGER.warning("[ScanPointRepair] Failed to repair scan point FTP IP on copier %s: %s", printer.ip, rep_exc)

                if has_repaired:
                    payload = collector.process_address_list(printer)

                p_mac = str(getattr(printer, "mac_address", "") or "").strip().upper().replace("-", ":")
                p_ip = str(getattr(printer, "ip", "") or "").strip()
                p_name = str(getattr(printer, "name", "") or "").strip()
                if p_mac or p_ip:
                    self._save_scan_points_json(mac_address=p_mac, ip=p_ip, printer_name=p_name, sync_data=payload)

                self._post_address_book_sync_data(printer, payload)
                LOGGER.info("[ScanPointSync] Completed scan points fetch for copier %s (%s) and saved to scan_points.json & PostgreSQL.", printer.name, printer.ip)

            except Exception as exc:  # noqa: BLE001
                LOGGER.warning("[ScanPointSync] Failed scan point sync for printer %s (%s): %s", printer.name, printer.ip, exc)
                p_mac = str(getattr(printer, "mac_address", "") or "").strip().upper().replace("-", ":")
                p_ip = str(getattr(printer, "ip", "") or "").strip()
                p_name = str(getattr(printer, "name", "") or "").strip()
                if p_mac or p_ip:
                    err_text = str(exc)
                    err_entry = {
                        "registration_no": "ERR",
                        "name": f"[ERROR] {err_text}",
                        "type": "Error",
                        "error_details": err_text,
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }
                    self._save_scan_points_json(mac_address=p_mac, ip=p_ip, printer_name=p_name, sync_data={"address_list": [err_entry], "error": err_text})

        LOGGER.info("[ScanPointSync] Finished scan points sync cycle for all online copiers.")

    @classmethod
    def _load_scan_points_json(cls) -> dict[str, dict[str, Any]]:
        try:
            import json, os, tempfile
            local_app = os.getenv("LOCALAPPDATA", "")
            candidates = [
                Path(tempfile.gettempdir()) / "GoPrinxAgent" / "scan_points.json",
                Path("storage") / "data" / "scan_points.json",
                Path("C:/Users/Kythuat-02/AppData/Local/Temp/GoPrinxAgent/scan_points.json"),
                Path("C:/ProgramData/GoPrinxAgent/scan_points.json"),
            ]
            if local_app:
                candidates.insert(0, Path(local_app) / "Temp" / "GoPrinxAgent" / "scan_points.json")

            for target_file in candidates:
                if target_file.exists():
                    with open(target_file, "r", encoding="utf-8", errors="replace") as f:
                        raw_data = json.load(f)
                        if isinstance(raw_data, dict):
                            # Auto-flatten nested address_book_sync
                            for k, v in raw_data.items():
                                if isinstance(v, dict):
                                    while "address_book_sync" in v and "address_list" not in v:
                                        inner = v.pop("address_book_sync", {})
                                        if isinstance(inner, dict):
                                            v.update(inner)
                                        else:
                                            break
                            return raw_data
        except Exception as exc:
            LOGGER.warning("_load_scan_points_json failed: %s", exc)
        return {}

    @classmethod
    def _ensure_scan_points_json_exists(cls) -> None:
        try:
            import json, os, tempfile
            local_app = os.getenv("LOCALAPPDATA", "")
            user_prof = os.getenv("USERPROFILE", "")
            save_dirs = [
                Path(tempfile.gettempdir()) / "GoPrinxAgent",
                Path("storage") / "data",
                Path("C:/Users/Kythuat-02/AppData/Local/Temp/GoPrinxAgent"),
                Path("C:/ProgramData/GoPrinxAgent"),
            ]
            if user_prof:
                save_dirs.insert(0, Path(user_prof) / "AppData" / "Local" / "Temp" / "GoPrinxAgent")
            if local_app:
                save_dirs.insert(0, Path(local_app) / "Temp" / "GoPrinxAgent")

            existing_data = cls._load_scan_points_json() or {}
            seeded_data = dict(existing_data)

            try:
                for target_dir in save_dirs:
                    p_file = target_dir / "printers.json"
                    if p_file.exists():
                        with open(p_file, "r", encoding="utf-8") as pf:
                            p_list = json.load(pf)
                            if isinstance(p_list, list):
                                for p in p_list:
                                    if isinstance(p, dict):
                                        mac = str(p.get("mac_address") or p.get("mac_id") or "").upper().replace("-", ":")
                                        ip = str(p.get("ip") or "").strip()
                                        name = str(p.get("name") or p.get("printer_name") or "").strip()
                                        key = mac or ip
                                        if key:
                                            old_item = seeded_data.get(key) or (seeded_data.get(mac) if mac else {}) or {}
                                            item = dict(old_item)
                                            item["mac_address"] = mac or old_item.get("mac_address") or ""
                                            item["ip"] = ip or old_item.get("ip") or ""
                                            item["printer_name"] = name or old_item.get("printer_name") or ""
                                            item["timestamp"] = datetime.now(timezone.utc).isoformat()
                                            if "address_list" not in item:
                                                item["address_list"] = []
                                            seeded_data[key] = item
                                            if mac:
                                                seeded_data[mac] = item
                                break
            except Exception:
                pass

            for target_dir in save_dirs:
                try:
                    target_dir.mkdir(parents=True, exist_ok=True)
                    target_file = target_dir / "scan_points.json"
                    with open(target_file, "w", encoding="utf-8") as f:
                        json.dump(seeded_data, f, indent=2, ensure_ascii=False)
                    LOGGER.info("[ScanPointSync] Immediately updated scan_points.json at %s with %d items", target_file, len(seeded_data))
                except Exception:
                    pass
        except Exception as exc:
            LOGGER.warning("_ensure_scan_points_json_exists failed: %s", exc)

    @classmethod
    def _save_scan_points_json(cls, mac_address: str, ip: str = "", printer_name: str = "", sync_data: dict[str, Any] | None = None) -> None:
        try:
            import json, os, tempfile
            norm_mac = mac_address.upper().replace("-", ":") if mac_address else ""
            key = norm_mac or ip
            if not key:
                return

            current_points = cls._load_scan_points_json()
            existing_item = current_points.get(key) or (current_points.get(norm_mac) if norm_mac else {}) or (current_points.get(ip) if ip else {}) or {}
            
            updated_item = dict(existing_item)
            if norm_mac:
                updated_item["mac_address"] = norm_mac
            if ip:
                updated_item["ip"] = ip
            if printer_name:
                updated_item["printer_name"] = printer_name
            if isinstance(sync_data, dict):
                # Flatten: unwrap nested address_book_sync
                flat_sync = sync_data
                while isinstance(flat_sync, dict) and "address_book_sync" in flat_sync and "address_list" not in flat_sync:
                    flat_sync = flat_sync["address_book_sync"]
                updated_item["timestamp"] = flat_sync.get("timestamp") or datetime.now(timezone.utc).isoformat()
                new_list = flat_sync.get("address_list")
                err_msg = str(sync_data.get("error") or "").strip()
                if err_msg:
                    # On error, preserve existing cached address_list instead of clearing
                    updated_item["last_error"] = err_msg
                    LOGGER.debug("[ScanPoints] Error for %s: %s. Preserving cached address_list.", key, err_msg)
                elif isinstance(new_list, list):
                    updated_item["address_list"] = new_list

            current_points[key] = updated_item
            if norm_mac and key != norm_mac:
                current_points[norm_mac] = updated_item

            local_app = os.getenv("LOCALAPPDATA", "")
            user_prof = os.getenv("USERPROFILE", "")
            save_dirs = [
                Path(tempfile.gettempdir()) / "GoPrinxAgent",
                Path("storage") / "data",
                Path("C:/Users/Kythuat-02/AppData/Local/Temp/GoPrinxAgent"),
                Path("C:/ProgramData/GoPrinxAgent"),
            ]
            if user_prof:
                save_dirs.insert(0, Path(user_prof) / "AppData" / "Local" / "Temp" / "GoPrinxAgent")
            if local_app:
                save_dirs.insert(0, Path(local_app) / "Temp" / "GoPrinxAgent")

            for target_dir in save_dirs:
                try:
                    target_dir.mkdir(parents=True, exist_ok=True)
                    target_file = target_dir / "scan_points.json"
                    with open(target_file, "w", encoding="utf-8") as f:
                        json.dump(current_points, f, indent=2, ensure_ascii=False)
                    LOGGER.info("[ScanPointSync] Saved scan_points.json at %s for printer '%s' (IP: %s, MAC: %s)", target_file, printer_name, ip, norm_mac)
                except Exception as file_exc:
                    LOGGER.warning("[ScanPointSync] Failed writing to %s: %s", target_dir, file_exc)
        except Exception as exc:
            LOGGER.warning("_save_scan_points_json failed: %s", exc)

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
    def _is_scan_candidate(path: Path) -> bool:
        name = path.name.lower()
        if name.endswith((".tmp", ".part", ".partial", ".crdownload")):
            return False
        return path.is_file()

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
                    self._send_gui_status("Quét tài liệu", f"Phát hiện file scan mới: {path.name}")
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
                    self._send_gui_status("Tải tài liệu", f"Tải lên thành công: {path.name}")
                    
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
                    if self._printer_type(printer.printer_type) == "toshiba":
                        self._toshiba_service.delete_address_entries(
                            printer,
                            to_delete_regs,
                            entry_ids=to_delete_entry_ids if to_delete_entry_ids else None,
                        )
                    else:
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
