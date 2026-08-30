from __future__ import annotations
import logging
import json
import os
import re
import socket
import tempfile
import threading
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
import requests
from typing import Any
from agent.services.api_client import APIClient, Printer
from agent.utils.scanner import SubnetScanner

LOGGER = logging.getLogger(__name__)

class PollingWorkerMixin:

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
            if str(printer.name or "").strip() and not self._is_generic_printer_name(printer.name, ip) and (
                self._is_generic_printer_name(existing.name, ip)
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

    def _load_printers(self, force_live: bool = False) -> list[Printer]:
        if getattr(self, "_force_next_scan_live", False):
            force_live = True
            self._force_next_scan_live = False
        try:
            # 1. Load existing local printers.json as the persistent base
            existing_local = self._load_local_printers_json()
            existing_by_mac: dict[str, Printer] = {}
            for p in existing_local:
                mac = self._normalize_mac(str(getattr(p, "mac_address", "") or ""))
                if mac:
                    existing_by_mac[mac] = p

            # 2. Scan active subnet hosts
            scanner = SubnetScanner(max_workers=100)
            if hasattr(self, "server_url") and self.server_url:
                scanner.fetch_ports_from_vps(self.server_url)
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
                has_ports = bool(row.get("has_printer_ports"))
                
                mac = self._resolve_scanned_mac(ip, row, neighbor_mac_map, preferred_type=printer_type)
                
                # Check if this MAC already exists in local printers.json with a valid name
                existing_p = existing_by_mac.get(mac) if mac else None
                if existing_p and existing_p.name and not self._is_generic_printer_name(existing_p.name, ip):
                    if has_ports or printer_type in {"ricoh", "toshiba"}:
                        existing_p.ip = ip  # update IP in case DHCP assigned a new IP
                        existing_p.status = "online"
                        existing_p.is_online = True
                        printers.append(existing_p)
                        continue

                if printer_type not in {"ricoh", "toshiba"}:
                    if not has_ports and not force_live:
                        continue
                    discovered = self._probe_discovered_printer(ip=ip, mac=mac, preferred_type="")
                    if discovered is None:
                        discovered = Printer(
                            id=0,
                            name=f"Copier ({ip})",
                            ip=ip,
                            user=existing_p.user if existing_p else "",
                            password=existing_p.password if existing_p else "",
                            auth_user=getattr(existing_p, "auth_user", "") if existing_p else "",
                            auth_password=getattr(existing_p, "auth_password", "") if existing_p else "",
                            printer_type=self._detect_printer_type("", mac),
                            status="online",
                            is_online=True,
                            mac_address=mac,
                        )
                    elif existing_p:
                        discovered.user = existing_p.user or getattr(discovered, "user", "")
                        discovered.password = existing_p.password or getattr(discovered, "password", "")
                        discovered.auth_user = getattr(existing_p, "auth_user", "") or getattr(discovered, "auth_user", "")
                        discovered.auth_password = getattr(existing_p, "auth_password", "") or getattr(discovered, "auth_password", "")
                        discovered.status = "online"
                        discovered.is_online = True
                    printers.append(discovered)
                    continue

                discovered = self._probe_discovered_printer(ip=ip, mac=mac, preferred_type=printer_type)
                if discovered is None:
                    discovered = Printer(
                        id=0,
                        name=ip,
                        ip=ip,
                        user=existing_p.user if existing_p else "",
                        password=existing_p.password if existing_p else "",
                        auth_user=getattr(existing_p, "auth_user", "") if existing_p else "",
                        auth_password=getattr(existing_p, "auth_password", "") if existing_p else "",
                        printer_type=printer_type or self._detect_printer_type(ip, mac),
                        status="online",
                        is_online=True,
                        mac_address=mac,
                    )
                elif existing_p:
                    discovered.user = existing_p.user or getattr(discovered, "user", "")
                    discovered.password = existing_p.password or getattr(discovered, "password", "")
                    discovered.auth_user = getattr(existing_p, "auth_user", "") or getattr(discovered, "auth_user", "")
                    discovered.auth_password = getattr(existing_p, "auth_password", "") or getattr(discovered, "auth_password", "")
                    discovered.status = "online"
                    discovered.is_online = True
                printers.append(discovered)

            # 3. Clean Fresh Scan: Do NOT merge old offline printers from past file.
            # Attach auth_user and auth_password from VPS PrinterAuthCredential DB by MAC address
            vps_auth_map = {}
            try:
                if hasattr(self, "server_url") and self.server_url:
                    import urllib.request
                    res = urllib.request.urlopen(f"{self.server_url.rstrip('/')}/api/devices/credentials-map", timeout=2)
                    data = json.loads(res.read().decode('utf-8'))
                    if data.get("ok"):
                        vps_auth_map = data.get("credentials") or {}
            except Exception: pass

            all_persistent_printers: list[Printer] = list(printers)
            for p in all_persistent_printers:
                mac = self._normalize_mac(str(getattr(p, "mac_address", "") or ""))
                if mac and mac in vps_auth_map:
                    cred = vps_auth_map[mac]
                    p.auth_user = cred.get("auth_user") or getattr(p, "auth_user", "")
                    p.auth_password = cred.get("auth_password") or getattr(p, "auth_password", "")
                    p.user = p.auth_user
                    p.password = p.auth_password


            # 4. Ensure names via web probe only for online printers
            now_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            valid_printers = []
            for p in all_persistent_printers:
                if getattr(p, "status", "online") == "online":
                    p = self._ensure_printer_name_via_web_probe(p)
                
                if str(getattr(p, "name", "")).startswith("[ERROR] Web probe failed"):
                    LOGGER.info("[ScanPointSync] Excluding printer ip=%s because web probe failed.", getattr(p, "ip", ""))
                    continue
                LOGGER.debug("[LoadPrinters] PASS web probe: ip=%s name=%s mac=%s", getattr(p, 'ip', ''), getattr(p, 'name', ''), getattr(p, 'mac_address', ''))

                if not getattr(p, "updated_at", None):
                    setattr(p, "updated_at", now_time)
                valid_printers.append(p)
            
            all_persistent_printers = valid_printers

            # Filter out known non-copier devices by name (virtual print servers, routers, etc.)
            _DEVICE_NAME_BLACKLIST = ("file pro", "print server", "printserver", "f6600", "f66", "h3601", "h36")
            before_filter = len(all_persistent_printers)
            filtered_out_blacklist = [p for p in all_persistent_printers if any(kw in str(getattr(p, "name", "") or "").lower() for kw in _DEVICE_NAME_BLACKLIST)]
            for fp in filtered_out_blacklist:
                LOGGER.info("[LoadPrinters] BLACKLIST excluded: ip=%s name=%s mac=%s", getattr(fp, 'ip', ''), getattr(fp, 'name', ''), getattr(fp, 'mac_address', ''))
            all_persistent_printers = [
                p for p in all_persistent_printers
                if not any(kw in str(getattr(p, "name", "") or "").lower() for kw in _DEVICE_NAME_BLACKLIST)
            ]
            if len(all_persistent_printers) < before_filter:
                LOGGER.info("[LoadPrinters] Filtered out %d blacklisted device(s) by name", before_filter - len(all_persistent_printers))

            # Deduplicate strictly by mac_address, filter out printers without MAC
            all_persistent_printers = self._deduplicate_printers_by_mac(all_persistent_printers)
            no_mac_printers = [p for p in all_persistent_printers if not self._normalize_mac(str(getattr(p, "mac_address", "") or ""))]
            for fp in no_mac_printers:
                LOGGER.info("[LoadPrinters] NO-MAC excluded: ip=%s name=%s mac='%s'", getattr(fp, 'ip', ''), getattr(fp, 'name', ''), getattr(fp, 'mac_address', ''))
            all_persistent_printers = [p for p in all_persistent_printers if self._normalize_mac(str(getattr(p, "mac_address", "") or ""))]

            # Save ALL printers (online & offline) directly to local printers.json disk file
            # self._save_printers_json(all_persistent_printers)

            # Return ALL printers (online + offline) for VPS push; VPS & frontend handle filtering
            LOGGER.info("[ScanPointSync] Persistent printers in local printers.json: %d (online=%d, offline=%d)", len(all_persistent_printers), sum(1 for p in all_persistent_printers if getattr(p, 'is_online', False)), sum(1 for p in all_persistent_printers if not getattr(p, 'is_online', True)))
            return all_persistent_printers
        except Exception as exc:  # noqa: BLE001
            LOGGER.warning("Polling bridge local scan failed: %s", exc)
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

    @staticmethod
    def _detect_printer_type(name: str, mac: str = "") -> str:
        s = str(name or "").lower()
        clean_mac = str(mac or "").replace("-", ":").upper()
        if "toshiba" in s or "e-studio" in s or clean_mac.startswith("00:80:91"):
            return "toshiba"
        if any(k in s for k in ("ricoh", "aficio", "mp ", "sp ", "pro ")) or clean_mac.startswith(("00:26:73", "58:38:79", "00:00:74")):
            return "ricoh"
        if any(k in s for k in ("hp", "laserjet", "officejet", "pagewide", "deskjet", "envy", "smart tank")) or clean_mac.startswith(("00:1E:0B", "00:08:C7", "E4:E7:49", "A4:5D:36", "EC:9A:74")):
            return "hp"
        if any(k in s for k in ("canon", "imagerunner", "ir-adv", "ir ", "imageclass", "pixma", "maxify")) or clean_mac.startswith(("00:1B:A9", "00:00:85")):
            return "canon"
        if any(k in s for k in ("xerox", "versalink", "altalink", "workcentre", "phaser")) or clean_mac.startswith(("00:10:A4", "00:00:AA")):
            return "xerox"
        if any(k in s for k in ("brother", "mfc-", "hl-", "dcp-")) or clean_mac.startswith("00:21:B7"):
            return "brother"
        if any(k in s for k in ("epson", "workforce", "ecotank")) or clean_mac.startswith("00:00:48"):
            return "epson"
        if any(k in s for k in ("kyocera", "taskalfa", "ecosys")):
            return "kyocera"
        if any(k in s for k in ("fujifilm", "fuji", "apeosport", "docucentre")):
            return "fujifilm"
        if any(k in s for k in ("samsung", "multixpress", "proxpress")):
            return "samsung"
        if any(k in s for k in ("konica", "bizhub")):
            return "konica"
        return "unknown"

    def _save_printers_json(self, printers: list[Printer]) -> None:
        try:
            import json, os, tempfile
            existing_auth_map: dict[str, tuple[str, str]] = {}
            try:
                local_app = os.getenv("LOCALAPPDATA", "")
                candidates = [
                    Path(tempfile.gettempdir()) / "GoPrinxAgent" / "printers.json",
                    Path("storage") / "data" / "printers.json",
                ]
                if local_app:
                    candidates.insert(0, Path(local_app) / "Temp" / "GoPrinxAgent" / "printers.json")

                for target_file in candidates:
                    if target_file.exists():
                        try:
                            with open(target_file, "r", encoding="utf-8", errors="replace") as f:
                                existing_items = json.load(f)
                                if isinstance(existing_items, list):
                                    for item in existing_items:
                                        if isinstance(item, dict):
                                            item_mac = str(item.get("mac_address") or item.get("mac_id") or "").strip().upper().replace("-", ":")
                                            item_ip = str(item.get("ip") or "").strip()
                                            u = str(item.get("auth_user") or item.get("user") or "").strip()
                                            pw = str(item.get("auth_password") or item.get("password") or "").strip()
                                            if u or pw:
                                                if item_mac:
                                                    existing_auth_map[item_mac] = (u, pw)
                                                if item_ip:
                                                    existing_auth_map[item_ip] = (u, pw)
                                    break
                        except Exception:
                            pass
            except Exception:
                pass

            data = []
            seen_macs: set[str] = set()
            seen_ips: set[str] = set()
            for p in printers:
                if isinstance(p, dict):
                    if not bool(p.get("is_port_9100", True)):
                        continue
                    p_name = str(p.get("name") or p.get("printer_name") or "").strip()
                    p_ip = str(p.get("ip") or p.get("printer_ip") or "").strip()
                    p_mac = str(p.get("mac_address") or p.get("mac_id") or "").strip().upper().replace("-", ":")
                    p_type = str(p.get("printer_type") or p.get("type") or "").strip()
                    p_user = str(p.get("auth_user") or p.get("user") or "").strip()
                    p_pass = str(p.get("auth_password") or p.get("password") or "").strip()
                    if not p_user and not p_pass:
                        if p_mac and p_mac in existing_auth_map:
                            p_user, p_pass = existing_auth_map[p_mac]
                        elif p_ip and p_ip in existing_auth_map:
                            p_user, p_pass = existing_auth_map[p_ip]
                    p_time = str(p.get("updated_at") or "").strip() or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    p_is_online = bool(p.get("is_online", True)) if str(p.get("status", "")).lower() != "offline" else False
                    p_ip = str(p.get("ip") or p.get("printer_ip") or "").strip()
                    p_probed = p_ip in self._printer_online_states if p_ip else False
                    data.append({
                        "name": p_name,
                        "ip": p_ip,
                        "mac_address": p_mac,
                        "printer_type": p_type,
                        "is_online": p_is_online,
                        "probed": p_probed,
                        "auth_user": p_user,
                        "auth_password": p_pass,
                        "updated_at": p_time,
                    })
                else:
                    ip = str(getattr(p, "ip", "") or "").strip()
                    raw_mac = str(getattr(p, "mac_address", "") or getattr(p, "mac_id", "") or "").strip()
                    clean_mac = raw_mac.replace("-", ":").upper() if raw_mac else ""
                    p_name = str(getattr(p, "name", "") or "").strip()

                    is_generic = self._is_generic_printer_name(p_name, ip)
                    is_printer_mac = self._is_printer_vendor_mac(clean_mac)
                    detected_type = self._detect_printer_type(p_name, clean_mac)
                    is_router = any(kw in p_name.lower() for kw in ("f6600", "h3601", "router", "gateway", "tp-link", "asus", "d-link", "huawei", "zte", "totolink", "draytek", "mikrotik"))

                    # Filter out non-printer devices (routers, modems, PCs, phones, TVs, etc.)
                    if not is_printer_mac and (is_generic or is_router or detected_type == "unknown"):
                        continue

                    if is_generic:
                        if detected_type == "toshiba":
                            p_name = "Toshiba Copier (Offline)" if not ip else f"Toshiba Copier ({ip})"
                        elif detected_type == "ricoh":
                            p_name = "Ricoh Copier (Offline)" if not ip else f"Ricoh Copier ({ip})"
                        elif detected_type == "hp":
                            p_name = "HP Printer (Offline)" if not ip else f"HP Printer ({ip})"
                        elif detected_type == "canon":
                            p_name = "Canon Printer (Offline)" if not ip else f"Canon Printer ({ip})"
                        else:
                            p_name = f"Printer ({ip})" if ip else "Printer"

                    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    updated_at_val = str(getattr(p, "updated_at", "") or "").strip() or now_str

                    p_user = str(getattr(p, "user", "") or getattr(p, "auth_user", "") or "").strip()
                    p_pass = str(getattr(p, "password", "") or getattr(p, "auth_password", "") or "").strip()
                    if not p_user and not p_pass:
                        norm_mac = clean_mac.upper() if clean_mac else ""
                        if norm_mac and norm_mac in existing_auth_map:
                            p_user, p_pass = existing_auth_map[norm_mac]
                        elif ip and ip in existing_auth_map:
                            p_user, p_pass = existing_auth_map[ip]
                    p_is_online = bool(getattr(p, "is_online", True)) if str(getattr(p, "status", "")).lower() != "offline" else False
                    p_probed = ip in self._printer_online_states if ip else False
                    is_p9100 = bool(getattr(p, "is_port_9100", True))
                    det_ports = str(getattr(p, "detected_ports", "") or ("Port 9100 (RAW)" if is_p9100 else "Port Detected"))
                    data.append({
                        "name": p_name,
                        "ip": ip,
                        "mac_address": clean_mac or raw_mac,
                        "printer_type": detected_type,
                        "is_online": p_is_online,
                        "probed": p_probed,
                        "auth_user": p_user,
                        "auth_password": p_pass,
                        "updated_at": updated_at_val,
                        "detected_ports": det_ports,
                        "is_port_9100": is_p9100,
                    })
            
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
                    target_file = target_dir / "printers.json"
                    with open(target_file, "w", encoding="utf-8") as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                except Exception:
                    pass
        except Exception:
            pass

    def _check_and_update_scripts(self, remote_scripts: dict[str, str]) -> None:
        if remote_scripts is None or not isinstance(remote_scripts, dict):
            return
        
        import os
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

    def _check_for_agent_update(self, lead: str, lan_uid: str, agent_uid: str, hostname: str, local_ip: str) -> bool:
        if self._updater is None or not self._config.get_bool("modules.updater.enabled", True) or not self._updater.should_check():
            return False
        base_url = self._polling_base_url()
        token = self._config.get_string("polling.token").strip()
        if not base_url:
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

    def _push_inventory(self, printers: list[Printer], hostname: str, local_ip: str, lan_uid: str, fingerprint: str = "") -> None:
        base_url = self._polling_base_url()
        if not base_url:
            return
        token = self._config.get_string("polling.token").strip()
        lead = self._config.get_string("polling.lead").strip()
        agent_uid = self._agent_uid or hostname
        devices: list[dict[str, str]] = []
        all_disc = self._load_local_printers_json()
        p_src = all_disc if all_disc else printers
        for printer in p_src:
            if isinstance(printer, dict):
                p_name = str(printer.get("name") or printer.get("printer_name") or "").strip()
                p_ip = str(printer.get("ip") or printer.get("printer_ip") or "").strip()
                p_mac = str(printer.get("mac_address") or printer.get("mac_id") or "").strip()
                p_type = str(printer.get("printer_type") or printer.get("type") or "").strip()
                p_status = str(printer.get("status") or "").strip()
                p_user = str(printer.get("auth_user") or printer.get("user") or "").strip()
                p_pass = str(printer.get("auth_password") or printer.get("password") or "").strip()
            else:
                p_name = str(getattr(printer, "name", "") or "").strip()
                p_ip = str(getattr(printer, "ip", "") or "").strip()
                p_mac = str(getattr(printer, "mac_address", "") or getattr(printer, "mac_id", "") or "").strip()
                p_type = str(getattr(printer, "printer_type", "") or "").strip()
                p_status = str(getattr(printer, "status", "") or "").strip()
                p_user = str(getattr(printer, "user", "") or getattr(printer, "auth_user", "") or "").strip()
                p_pass = str(getattr(printer, "password", "") or getattr(printer, "auth_password", "") or "").strip()
            if not p_mac:
                continue  # Skip printers without MAC — MAC is the primary key

            # Determine is_online from the actual attribute, not just status string
            if isinstance(printer, dict):
                p_is_online = bool(printer.get("is_online", True)) if p_status.lower() != "offline" else False
            else:
                p_is_online = bool(getattr(printer, "is_online", True)) if p_status.lower() != "offline" else False

            devices.append(
                {
                    "printer_name": p_name,
                    "name": p_name,
                    "ip": p_ip,
                    "mac_address": p_mac,
                    "mac_id": p_mac,
                    "printer_type": p_type,
                    "status": p_status or ("online" if p_is_online else "offline"),
                    "is_online": p_is_online,
                    "user": p_user,
                    "password": p_pass,
                    "auth_user": p_user,
                    "auth_password": p_pass,
                }
            )
        local_configs = []
        cfg_path = Path("storage/camera_configs.json")
        if cfg_path.exists():
            try:
                with cfg_path.open("r", encoding="utf-8") as f:
                    local_configs = json.load(f)
            except Exception:
                pass

        # Merge scan_points.json into devices strictly by mac_address
        all_scan_points = self._load_scan_points_json()
        for dev in devices:
            dev_mac = str(dev.get("mac_address") or dev.get("mac_id") or "").strip().upper().replace("-", ":")
            if dev_mac in all_scan_points:
                sp_item = all_scan_points[dev_mac]
                # Unwrap: if sp_item has address_book_sync key but no address_list, use inner
                if isinstance(sp_item, dict) and "address_book_sync" in sp_item and "address_list" not in sp_item:
                    sp_item = sp_item["address_book_sync"]
                dev["address_book_sync"] = sp_item

        LOGGER.info("[PUSH INVENTORY] Pushing %d printers from printers.json/discovery to VPS for agent %s", len(devices), agent_uid)
        payload = {
            "lead": lead,
            "lan_uid": lan_uid,
            "agent_uid": agent_uid,
            "hostname": hostname,
            "local_ip": local_ip,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "devices": devices,
            "cameras": getattr(self, "_last_discovered_cameras", []),
            "configs": local_configs,
            "fingerprint_signature": fingerprint,
        }
        payload.update(self._agent_runtime_metadata())
        headers = {"Content-Type": "application/json", "X-Lead-Token": token}
        url = f"{base_url}/api/polling/inventory"
        response = self._api_client.session.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()

    def _sync_inventory_to_server(self) -> None:
        try:
            import socket
            hostname = socket.gethostname()
            local_ip = self._resolve_local_ip()
            lan_uid = self._agent_lan_uid() or "default"
            printers = self._load_local_printers_json()
            self._push_inventory(printers, hostname=hostname, local_ip=local_ip, lan_uid=lan_uid)
        except Exception as exc:
            LOGGER.warning("[_sync_inventory_to_server] Failed: %s", exc)

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
                try:
                    self._config.reload()
                except Exception as exc:
                    LOGGER.warning("Failed to reload configuration: %s", exc)

                if not self._config.get_bool("polling.enabled", True) or not self._config.get_bool("polling.device_enabled", True):
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
                
                # Run camera scan periodically (every 5 minutes / 300 seconds)
                now_dt = datetime.now(timezone.utc)
                if (not self._last_camera_scan_at or 
                    (now_dt - self._last_camera_scan_at).total_seconds() > 300):
                    self._last_camera_scan_at = now_dt
                    self._trigger_background_camera_scan()
                    
                # Periodic background polling does NOT auto-scan LAN or push printers.
                # Printers are only scanned and pushed on-demand when requested by Frontend / VPS.
                printers = self._load_local_printers_json()

                # Sync down latest scan points from VPS for managed printers & update local scan_points.json
                try:
                    self._sync_down_scan_points_from_vps()
                except Exception as sp_exc:
                    LOGGER.debug("Scan points sync-down failed: %s", sp_exc)
                # Legacy FTP control command queue (superseded by _reconcile_scan_address_ftp)
                pass
                # We process all printers. For offline ones (ping failed), we skip heavy SNMP but record their state.
                online_printers = printers
                self._last_cycle_total_printers = len(online_printers)
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
                
                    if not getattr(printer, "is_online", True) or getattr(printer, "status", "online") == "offline":
                        self._printer_online_states[printer.ip] = False
                        self._printer_physical_statuses[printer.ip] = "Offline"
                        return

                    try:
                        collector = self._collector_service_for(printer)
                        LOGGER.debug("Polling collect: name=%s ip=%s type=%s", printer.name, printer.ip, printer.printer_type)
                        counter_payload = collector.process_counter(printer, should_post=False)
                        status_payload = collector.process_status(printer, should_post=False)
                        counter_data = counter_payload.get("counter_data", {})
                        if not isinstance(counter_data, dict):
                            counter_data = {}
                        if not counter_data.get("total") or int(counter_data.get("total") or 0) <= 0:
                            snmp_tot = self._probe_snmp_counter(printer.ip)
                            if snmp_tot > 0:
                                counter_data["total"] = snmp_tot
                                counter_data["copier_bw"] = snmp_tot

                        resolved_printer_name = printer.name if printer.name and not self._is_generic_printer_name(printer.name, printer.ip) else counter_payload.get("printer_name", printer.name)

                        devices_payload_list = []
                        for p in printers:
                            devices_payload_list.append({
                                "printer_name": str(getattr(p, "name", "") or "").strip(),
                                "ip": str(getattr(p, "ip", "") or "").strip(),
                                "mac_address": str(getattr(p, "mac_address", "") or "").strip(),
                                "mac_id": str(getattr(p, "mac_address", "") or "").strip(),
                                "printer_type": str(getattr(p, "printer_type", "") or "").strip(),
                            })

                        payload = {
                            "lead": lead,
                            "lan_uid": lan_uid,
                            "agent_uid": agent_uid,
                            "hostname": hostname,
                            "local_ip": local_ip,
                            "printer_name": resolved_printer_name,
                            "ip": counter_payload.get("ip", printer.ip),
                            "mac_id": printer.mac_address,
                            "mac_address": printer.mac_address,
                            "devices": devices_payload_list,
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
                        printer.is_online = True
                        printer.status = "online"
                    except Exception as exc:  # noqa: BLE001
                        self._printer_online_states[printer.ip] = False
                        self._printer_physical_statuses[printer.ip] = "Offline"
                        printer.is_online = False
                        printer.status = "offline"
                        with cycle_lock:
                            self._last_cycle_failed += 1
                            self._last_error = str(exc)
                        LOGGER.warning("Polling bridge failed for %s (%s): %s", printer.name, printer.ip, exc)
                        pass

                try:
                    if online_printers:
                        with ThreadPoolExecutor(max_workers=min(6, len(online_printers))) as executor:
                            for printer in online_printers:
                                executor.submit(_process_single_printer, printer)

                    LOGGER.debug("Polling cycle finished. Next cycle in %ss.", interval)
                except Exception as outer_exc:
                    LOGGER.warning("ThreadPoolExecutor error: %s", outer_exc)
            
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
            except Exception as loop_exc:
                LOGGER.exception("Unhandled exception in _worker loop (recovered): %s", loop_exc)
                time.sleep(5.0)

        LOGGER.info("Polling worker loop stopped")
