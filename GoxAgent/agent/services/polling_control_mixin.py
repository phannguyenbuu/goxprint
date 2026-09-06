from __future__ import annotations
import logging
import json
import os
import re
import socket
import subprocess
import sys
import shlex
import traceback
import tempfile
import threading
import time
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse
import requests
from typing import Any
from agent.services.api_client import APIClient, Printer
from agent.services.runtime import get_machine_agent_uid, no_window_subprocess_kwargs, user_temp_root
from agent.services.dynamic_exec import execute_dynamic_code

LOGGER = logging.getLogger(__name__)

class PollingControlMixin:
    _GDS_INSTALL_LOCK = threading.Lock()
    _GDS_INSTALL_DONE = False

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

    def _trigger_background_camera_scan(self) -> None:
        def run_scan():
            try:
                import socket
                import urllib.request
                import re
                import json
                from concurrent.futures import ThreadPoolExecutor
                from agent.services.camera_manager import CameraManager
                cm = CameraManager()
                
                # 0. Pre-load configurations to access RTSP credentials
                cfg_path = Path("storage/camera_configs.json")
                configs = []
                if cfg_path.exists():
                    try:
                        with cfg_path.open("r", encoding="utf-8") as f:
                            configs = json.load(f)
                    except Exception:
                        configs = []

                # Helper to find credentials from configs
                def find_credentials(ip_addr: str) -> tuple[str | None, str | None]:
                    for c in configs:
                        rtsp = c.get("rtsp_url", "")
                        ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', rtsp)
                        if ip_match and ip_match.group(1) == ip_addr:
                            cred_match = re.search(r'rtsp://([^:@]+):([^:@]+)@', rtsp)
                            if cred_match:
                                return cred_match.group(1), cred_match.group(2)
                    return None, None

                # Helper to detect manufacturer brand from landing page keywords
                def detect_manufacturer_from_web(ip_addr: str) -> str | None:
                    ports = [80, 81, 8080, 88]
                    keywords = {
                        "Hikvision": ["hikvision", "hik-connect", "hik_client", "hiddns"],
                        "Dahua": ["dahua", "netdvr", "quickddns", "dss express"],
                        "Ezviz": ["ezviz"],
                        "Imou": ["imou"],
                        "Yoosee": ["yoosee", "ycc365"],
                        "KBVision": ["kbvision"],
                        "Uniview": ["uniview", "unv", "mycloud"],
                        "TP-Link / Tapo": ["tp-link", "tapo"],
                        "Xiaomi": ["mi home", "xiaomi"],
                        "Axis": ["axis communications", "axis camera"],
                        "Hanwha Wisenet": ["wisenet", "hanwha"],
                        "Vivotek": ["vivotek"],
                    }
                    for port in ports:
                        try:
                            url = f"http://{ip_addr}:{port}"
                            req = urllib.request.Request(url, method='GET')
                            with urllib.request.urlopen(req, timeout=0.8) as response:
                                content = response.read().decode('utf-8', errors='ignore').lower()
                                server_header = response.headers.get("Server", "").lower()
                                for brand, kw_list in keywords.items():
                                    if any(kw in server_header for kw in kw_list):
                                        return brand
                                    if any(kw in content for kw in kw_list):
                                        return brand
                        except Exception:
                            continue
                    return None

                # 1. Discover subnets
                subnets = []
                try:
                    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                    s.connect(("8.8.8.8", 80))
                    ip = s.getsockname()[0]
                    s.close()
                    parts = ip.split(".")
                    if len(parts) == 4:
                        subnets.append(f"{parts[0]}.{parts[1]}.{parts[2]}")
                except Exception:
                    pass
                if not subnets:
                    subnets.append("192.168.1")
                    subnets.append("192.168.0")
                
                # SOAP info query with WS-Security and fallback mechanisms
                def get_onvif_info(ip_addr: str) -> dict[str, str]:
                    username, password = find_credentials(ip_addr)
                    credentials_candidates = []
                    if username and password:
                        credentials_candidates.append((username, password))
                    else:
                        credentials_candidates.append((None, None))
                    endpoints = [
                        f"http://{ip_addr}/onvif/device_service",
                        f"http://{ip_addr}:80/onvif/device_service",
                        f"http://{ip_addr}:888/onvif/device_service",
                        f"http://{ip_addr}:8080/onvif/device_service",
                    ]
                    last_error = "ONVIF tắt/Không kết nối"
                    
                    for user, pwd in credentials_candidates:
                        if user and pwd:
                            soap_msg = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
               xmlns:tds="http://www.onvif.org/ver10/device/wsdl">
  <soap:Header>
    <Security xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <UsernameToken>
        <Username>{user}</Username>
        <Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">{pwd}</Password>
      </UsernameToken>
    </Security>
  </soap:Header>
  <soap:Body>
    <tds:GetDeviceInformation/>
  </soap:Body>
</soap:Envelope>"""
                        else:
                            soap_msg = (
                                '<?xml version="1.0" encoding="utf-8"?>'
                                '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" '
                                'xmlns:tds="http://www.onvif.org/ver10/device/wsdl">'
                                '<soap:Body>'
                                '<tds:GetDeviceInformation/>'
                                '</soap:Body>'
                                '</soap:Envelope>'
                            )
                        headers = {
                            'Content-Type': 'application/soap+xml; charset=utf-8',
                            'Content-Length': str(len(soap_msg))
                        }
                        for url in endpoints:
                            try:
                                req = urllib.request.Request(url, data=soap_msg.encode('utf-8'), headers=headers, method='POST')
                                with urllib.request.urlopen(req, timeout=0.8) as response:
                                    html = response.read().decode('utf-8', errors='ignore')
                                    manufacturer = "Generic"
                                    model = "Camera IP"
                                    m_match = re.search(r'<[^:>]*Manufacturer[^>]*>([^<]+)</[^>]*Manufacturer[^>]*>', html)
                                    if m_match:
                                        manufacturer = m_match.group(1).strip()
                                    mo_match = re.search(r'<[^:>]*Model[^>]*>([^<]+)</[^>]*Model[^>]*>', html)
                                    if mo_match:
                                        model = mo_match.group(1).strip()
                                    return {"manufacturer": manufacturer, "model": model}
                            except urllib.error.HTTPError as he:
                                if he.code == 401:
                                    last_error = "Yêu cầu mật khẩu (401)"
                                else:
                                    last_error = f"Lỗi HTTP {he.code}"
                            except urllib.error.URLError as ue:
                                import socket as sk
                                if isinstance(ue.reason, sk.timeout):
                                    last_error = "ONVIF Timeout"
                                elif isinstance(ue.reason, ConnectionRefusedError):
                                    last_error = "Cổng đóng"
                                else:
                                    last_error = "Lỗi kết nối"
                            except BaseException as e:
                                last_error = f"Lỗi: {type(e).__name__}"
                                
                    web_brand = detect_manufacturer_from_web(ip_addr)
                    if web_brand:
                        return {"manufacturer": web_brand, "model": last_error}
                    return {"manufacturer": "Generic", "model": last_error}

                # Port scan helper
                def scan_ip_port(ip_addr: str) -> bool:
                    try:
                        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                        s.settimeout(0.6)
                        res = s.connect_ex((ip_addr, 554))
                        s.close()
                        return res == 0
                    except Exception:
                        return False

                # Dynamic MAC lookup
                def get_mac_address(ip_addr: str) -> str:
                    # 1. Try /proc/net/arp on Linux (fastest, direct)
                    try:
                        from pathlib import Path
                        arp_path = Path("/proc/net/arp")
                        if arp_path.exists():
                            with arp_path.open("r", encoding="utf-8") as f:
                                for line in f:
                                    parts = line.split()
                                    if len(parts) >= 4 and parts[0] == ip_addr:
                                        mac = parts[3].strip()
                                        if mac and mac != "00:00:00:00:00:00":
                                            return mac.upper()
                    except Exception:
                        pass

                    # 2. Try ip neigh on Linux
                    try:
                        import subprocess
                        output = subprocess.check_output(f"ip neigh show {ip_addr}", shell=True, timeout=0.8).decode('utf-8', errors='ignore')
                        mac_match = re.search(r'([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}', output)
                        if mac_match:
                            return mac_match.group(0).upper().replace("-", ":")
                    except Exception:
                        pass

                    # 3. Try arp -a (full table or specific IP)
                    for cmd in [["arp", "-a", ip_addr], ["arp", "-a"]]:
                        try:
                            import subprocess
                            output = subprocess.check_output(cmd, timeout=0.8, **no_window_subprocess_kwargs()).decode('utf-8', errors='ignore')
                            for line in output.splitlines():
                                if ip_addr in line:
                                    mac_match = re.search(r'([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}', line)
                                    if mac_match:
                                        return mac_match.group(0).upper().replace("-", ":")
                        except Exception:
                            pass
                    return "Unknown"

                # 2. Multicast WS-Discovery
                discovered_ips = []
                MCAST_GRP = '239.255.255.250'
                MCAST_PORT = 3702
                probe_msg = (
                    '<?xml version="1.0" encoding="utf-8"?>'
                    '<Envelope xmlns:tds="http://www.onvif.org/ver10/device/wsdl" '
                    'xmlns:dn="http://www.onvif.org/ver10/network/wsdl" '
                    'xmlns="http://www.w3.org/2003/05/soap-envelope">'
                    '<Header>'
                    '<MessageID xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">'
                    'uuid:a801e0c8-1111-a8a8-b8b8-0123456789ab'
                    '</MessageID>'
                    '<To xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">urn:schemas-xmlsoap-org:ws:2004:08:d_d</To>'
                    '<Action xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</Action>'
                    '</Header>'
                    '<Body>'
                    '<Probe xmlns="http://schemas.xmlsoap.org/ws/2005/04/discovery">'
                    '<Types>tds:Device</Types>'
                    '</Probe>'
                    '</Body>'
                    '</Envelope>'
                )
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
                    sock.settimeout(1.0)
                    sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 2)
                    sock.sendto(probe_msg.encode('utf-8'), (MCAST_GRP, MCAST_PORT))
                    while True:
                        try:
                            data, addr = sock.recvfrom(65535)
                            response = data.decode('utf-8', errors='ignore')
                            ipv4_pattern = re.compile(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')
                            urls = re.findall(r'https?://[^\s<>"]+', response)
                            for url in urls:
                                ip_match = re.search(r'https?://([^:/]+)', url)
                                if ip_match:
                                    ip_found = ip_match.group(1)
                                    if ipv4_pattern.match(ip_found) and ip_found not in discovered_ips and not ip_found.startswith("127."):
                                        discovered_ips.append(ip_found)
                        except socket.timeout:
                            break
                    sock.close()
                except Exception:
                    pass

                # 3. Subnet Port Scan
                for subnet_prefix in subnets:
                    ips_to_scan = [f"{subnet_prefix}.{i}" for i in range(1, 255) if f"{subnet_prefix}.{i}" not in discovered_ips]
                    with ThreadPoolExecutor(max_workers=50) as executor:
                        futures = {executor.submit(scan_ip_port, ip_addr): ip_addr for ip_addr in ips_to_scan}
                        for future in futures:
                            ip_addr = futures[future]
                            try:
                                if future.result():
                                    discovered_ips.append(ip_addr)
                            except Exception:
                                pass

                # Compile results
                cameras_payload = []
                for ip_addr in discovered_ips:
                    mac_addr = get_mac_address(ip_addr)
                    clean_mac = "".join(c for c in mac_addr if c.isalnum()).upper()
                    if len(clean_mac) != 12 or not all(c in "0123456789ABCDEF" for c in clean_mac):
                        continue
                        
                    info = get_onvif_info(ip_addr)
                    
                    camera_name = f"Camera {ip_addr}"
                    rtsp_url = f"rtsp://{ip_addr}:554/"
                    
                    is_rec = False
                    for cfg_item in configs:
                        cfg_rtsp = cfg_item.get("rtsp_url", "")
                        cfg_ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', cfg_rtsp)
                        if (cfg_ip_match and cfg_ip_match.group(1) == ip_addr) or cfg_item.get("camera_name") == camera_name:
                            is_rec = cm.get_status(cfg_item.get("camera_name")).get("running", False)
                            camera_name = cfg_item.get("camera_name")
                            rtsp_url = cfg_rtsp
                            break
                    
                    cameras_payload.append({
                        "ip": ip_addr,
                        "mac_address": mac_addr,
                        "camera_name": camera_name,
                        "manufacturer": info.get("manufacturer", "Generic"),
                        "model": info.get("model", "Camera IP"),
                        "rtsp_url": rtsp_url,
                        "is_online": True,
                        "is_recording": is_rec
                    })
                
                # Check status of configured cameras not found in discovery
                for c in configs:
                    rtsp = c.get("rtsp_url", "")
                    ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', rtsp)
                    if ip_match:
                        ip_addr = ip_match.group(1)
                        if not any(item["ip"] == ip_addr for item in cameras_payload):
                            is_online, _ = cm.test_rtsp_connection(rtsp)
                            mac_addr = get_mac_address(ip_addr)
                            info = get_onvif_info(ip_addr)
                            is_rec = cm.get_status(c.get("camera_name")).get("running", False)
                            cameras_payload.append({
                                "ip": ip_addr,
                                "mac_address": mac_addr,
                                "camera_name": c.get("camera_name"),
                                "manufacturer": info.get("manufacturer", "Generic"),
                                "model": info.get("model", "Camera IP"),
                                "rtsp_url": rtsp,
                                "is_online": is_online,
                                "is_recording": is_rec
                            })
                            
                self._last_discovered_cameras = cameras_payload
                LOGGER.info("[PollingBridge] Camera discovery completed: found %d cameras", len(cameras_payload))
            except Exception as e:
                LOGGER.exception("[PollingBridge] Camera background scan failed")
                
        threading.Thread(target=run_scan, daemon=True, name="polling-camera-discovery").start()

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

    def _apply_command(self, printer: Printer, command: dict[str, object]) -> None:
        import socket
        agent_uid = self._agent_uid or socket.gethostname()
        command_id = int(command.get("id", 0) or 0)
        desired_enabled = bool(command.get("desired_enabled", True))
        command_type = str(command.get("command_type", "enable_disable")).strip().lower()
        if command_id <= 0:
            return
        
        self._update_recent_command_status(command_id, "processing")
        self._post_command_ack(command_id)

        # Parse command_params if present to extract printer IP & MAC
        params_raw = command.get("command_params") or command.get("parameters_json") or "{}"
        params = {}
        if isinstance(params_raw, str) and params_raw.strip():
            try:
                params = json.loads(params_raw)
            except Exception:
                params = {}
        elif isinstance(params_raw, dict):
            params = params_raw

        cmd_ip = str(
            params.get("printer_ip")
            or params.get("ip")
            or command.get("printer_ip")
            or command.get("ip")
            or getattr(printer, "ip", "")
            or ""
        ).strip()

        cmd_mac = str(
            params.get("mac_address")
            or params.get("printer_mac_id")
            or command.get("printer_mac_id")
            or command.get("mac_address")
            or getattr(printer, "mac_address", "")
            or ""
        ).strip().upper().replace("-", ":")

        if cmd_ip:
            printer.ip = cmd_ip
        if cmd_mac:
            printer.mac_address = cmd_mac

        # If IP is still missing, try to resolve IP from MAC address in local scan_points / scanned printers
        if not getattr(printer, "ip", "") and cmd_mac:
            printers_to_check = getattr(self, "_last_discovered_printers", [])
            for p in printers_to_check:
                p_mac = str(getattr(p, "mac_address", "") or getattr(p, "mac_id", "")).strip().upper().replace("-", ":")
                if p_mac == cmd_mac and getattr(p, "ip", ""):
                    printer.ip = getattr(p, "ip", "")
                    break

        auth_user = str(command.get("auth_user", "") or "").strip()
        auth_password = str(command.get("auth_password", "") or "").strip()
        if command_type not in {"save_printer_auth", "update_credentials", "update_copier_credentials"}:
            if auth_user:
                printer.user = auth_user
            if auth_password:
                printer.password = auth_password

        if command_type in {"save_printer_auth", "update_credentials", "update_copier_credentials"}:
            params_raw = command.get("command_params") or command.get("parameters_json") or "{}"
            params = {}
            if isinstance(params_raw, str) and params_raw.strip():
                try:
                    params = json.loads(params_raw)
                except Exception:
                    params = {}
            elif isinstance(params_raw, dict):
                params = params_raw

            cmd_mac = str(
                params.get("mac_address")
                or params.get("printer_mac_id")
                or command.get("printer_mac_id")
                or command.get("mac_address")
                or getattr(printer, "mac_address", "")
                or ""
            ).strip().upper().replace("-", ":")
            
            cmd_ip = str(
                params.get("printer_ip")
                or params.get("ip")
                or command.get("printer_ip")
                or command.get("ip")
                or getattr(printer, "ip", "")
                or ""
            ).strip()

            if not auth_user:
                auth_user = str(params.get("auth_user") or "").strip()
            if not auth_password:
                auth_password = str(params.get("auth_password") or "").strip()
            
            # --- START Verify credentials before saving ---
            if not getattr(printer, "printer_type", ""):
                printer.printer_type = str(params.get("printer_type") or command.get("printer_type") or "").strip()
                if not printer.printer_type:
                    printers_to_check = getattr(self, "_last_discovered_printers", [])
                    for p in printers_to_check:
                        p_mac = str(getattr(p, "mac_address", "") or getattr(p, "mac_id", "")).strip().upper().replace("-", ":")
                        if (cmd_mac and p_mac == cmd_mac) or (cmd_ip and getattr(p, "ip", "") == cmd_ip):
                            printer.printer_type = getattr(p, "printer_type", "")
                            if printer.printer_type:
                                break

            is_toshiba = self._printer_type(printer.printer_type) == "toshiba"
            
            test_success = False
            error_reason = "Failed to login with the provided credentials."
            
            try:
                if is_toshiba:
                    if self._toshiba_service:
                        try:
                            sess, landing_url, content_url, csrf_token = self._toshiba_service._build_session(printer)
                            local_ip = "127.0.0.1"
                            try:
                                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                                s.connect((printer.ip, 80))
                                local_ip = s.getsockname()[0]
                                s.close()
                            except Exception:
                                pass
                            
                            login_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<SetValue><Authentication><UserCredential><userName>{auth_user}</userName><passwd>{auth_password}</passwd><ipaddress>{local_ip}</ipaddress><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue>
<Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login></Command>
</DeviceInformationModel>"""
                            r = sess.post(content_url, data=login_xml, headers={'Content-Type': 'text/plain; charset=UTF-8'}, verify=False, timeout=8)
                            if r.status_code == 200 and "<LoginResult>Success</LoginResult>" in r.text:
                                test_success = True
                                try:
                                    logout_xml = """<?xml version="1.0" encoding="UTF-8"?>\n<DeviceInformationModel><Command><Logout><commandNode>Authentication/UserCredential</commandNode></Logout></Command></DeviceInformationModel>"""
                                    sess.post(content_url, data=logout_xml, headers={'Content-Type': 'text/plain; charset=UTF-8'}, verify=False, timeout=3)
                                except Exception:
                                    pass
                        except Exception as e:
                            error_reason = str(e)
                else:
                    sess = requests.Session()
                    if self._ricoh_service:
                        used_u, used_p = self._ricoh_service._login(sess, printer, credential_candidates=[(auth_user, auth_password)])
                        if used_u == auth_user and used_p == auth_password:
                            test_success = True
                        elif not auth_user and not auth_password:
                             test_success = True
                        else:
                            error_reason = f"Tài khoản không đúng. (Máy photocopy đang dùng tài khoản: {used_u}/****)"
                        
                        extra_msg = ""
                        if test_success:
                            try:
                                wizard_resp = sess.get(f"http://{printer.ip}/web/entry/en/address/adrsGetUserWizard.cgi", timeout=3)
                                if wizard_resp.status_code == 200:
                                    extra_msg = "Web đời mới - Hỗ trợ Wizard"
                                elif wizard_resp.status_code == 404:
                                    extra_msg = "Web đời cũ - 404 Wizard"
                                else:
                                    extra_msg = f"Web lạ (Status: {wizard_resp.status_code})"
                            except Exception:
                                extra_msg = "Không xác định đời Web"
                                
                            try:
                                self._ricoh_service._logout(sess, printer)
                            except Exception:
                                pass
            except Exception as e:
                trace = getattr(printer, "_last_verify_trace", "")
                error_reason = f"Xác thực đăng nhập thất bại: {e}"
                if trace:
                    error_reason += f" | Debug: {trace}"
                
            if not test_success:
                trace = getattr(printer, "_last_verify_trace", "")
                if trace and trace not in error_reason:
                    error_reason += f" | Debug: {trace}"
                LOGGER.warning("[save_printer_auth] Login verification failed for %s: %s", printer.ip, error_reason)
                self._post_control_result(command_id=command_id, ok=False, error=error_reason)
                self._update_recent_command_status(command_id, "failed", error_reason)
                return
            else:
                # Success, store extra_msg for later
                pass
            # --- END Verify credentials before saving ---

            if auth_user:
                setattr(printer, "user", auth_user)
                try:
                    setattr(printer, "auth_user", auth_user)
                except Exception:
                    pass
            if auth_password:
                setattr(printer, "password", auth_password)
                try:
                    setattr(printer, "auth_password", auth_password)
                except Exception:
                    pass


            raw_items = []
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
                            raw_items = json.load(f)
                            if isinstance(raw_items, list):
                                break
                    except Exception:
                        pass
            
            if isinstance(raw_items, list):
                updated_any = False
                for item in raw_items:
                    if isinstance(item, dict):
                        item_mac = str(item.get("mac_address") or item.get("mac_id") or "").strip().upper().replace("-", ":")
                        item_ip = str(item.get("ip") or "").strip()
                        if (cmd_mac and item_mac == cmd_mac) or (cmd_ip and item_ip == cmd_ip):
                            item["auth_user"] = auth_user
                            item["auth_password"] = auth_password
                            item["user"] = auth_user
                            item["password"] = auth_password
                            updated_any = True
                if updated_any:
                    self._save_printers_json(raw_items)
                    LOGGER.info("[save_printer_auth] Saved auth credentials (%s / ***) to printers.json for MAC %s / IP %s", auth_user, cmd_mac, cmd_ip)

            self._post_control_result(command_id=command_id, ok=True, error=extra_msg if self._ricoh_service else "")
            self._update_recent_command_status(command_id, "success")
            self._sync_inventory_to_server()
            return

        if command_type == "trigger_utility":
            return self._apply_agent_command(command)

        if command_type == "install_driver":
            try:
                driver_brand = str(command.get("driver_brand", "") or "").strip()
                driver_model = str(command.get("driver_model", "") or "").strip()
                driver_name = str(command.get("driver_name", "") or "").strip()
                driver_url = str(command.get("driver_url", "") or "").strip()
                
                self._send_gui_status("Cài đặt", f"Bắt đầu cài đặt driver {driver_name} cho {printer.ip}...")
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
                self._send_gui_status("Cài đặt", f"Cài đặt thành công driver {driver_name} cho {printer.ip}!")
            except Exception as exc:  # noqa: BLE001
                LOGGER.error("Failed to install driver for printer %s: %s", printer.ip, exc)
                self._post_control_result(command_id=command_id, ok=False, error=str(exc))
                self._update_recent_command_status(command_id, "failed", str(exc))
            return

        if command_type == "fetch_address_book":
            import socket
            LOGGER.info("[PollingBridge] === START fetch_address_book command: ID=%s, printer=%s (IP=%s) ===", command_id, printer.name, printer.ip)
            self._send_gui_status("Lệnh", f"Đồng bộ danh bạ máy in {printer.name} ({printer.ip})...")
            try:
                # Fetch the entire address book of the copier machine (Ricoh / Toshiba)
                LOGGER.info("[PollingBridge] Calling process_address_list for %s...", printer.ip)
                collector = self._collector_service_for(printer)
                result = collector.process_address_list(printer)
                LOGGER.info("[PollingBridge] process_address_list returned %d items", len(result.get("address_list", []) if isinstance(result, dict) else []))
                LOGGER.info("[PollingBridge] Posting control result back to server for command ID: %s", command_id)
                self._post_address_book_sync_data(printer, result)
                self._post_control_result(command_id=command_id, ok=True, error="", address_book_data=result)
                self._update_recent_command_status(command_id, "success")
                self._sync_inventory_to_server()
                LOGGER.info("[PollingBridge] === FINISH fetch_address_book command: ID=%s Success ===", command_id)
                self._send_gui_status("Lệnh", f"Đồng bộ thành công danh bạ máy in {printer.name}!")
            except Exception as exc:  # noqa: BLE001
                LOGGER.error("[PollingBridge] Failed to fetch address book for printer %s: %s", printer.ip, exc, exc_info=True)
                self._post_control_result(command_id=command_id, ok=False, error=str(exc))
                self._update_recent_command_status(command_id, "failed", str(exc))
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

                # Delete on copier — branch by printer type
                is_toshiba = self._printer_type(printer.printer_type) == "toshiba"
                if is_toshiba and self._toshiba_service is not None:
                    self._toshiba_service.delete_address_entries(
                        printer=printer,
                        registration_numbers=[reg_no],
                        entry_ids=[entry_id] if entry_id else None,
                        verify=True,
                    )
                else:
                    self._ricoh_service.delete_address_entries(
                        printer=printer,
                        registration_numbers=[reg_no],
                        entry_ids=[entry_id] if entry_id else None,
                        verify=True,
                    )

                # Fetch address book after delete so UI can refresh
                addr_result = None
                try:
                    collector = self._collector_service_for(printer)
                    addr_result = collector.process_address_list(printer)
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

                # Modify on copier — branch by printer type
                is_toshiba = self._printer_type(printer.printer_type) == "toshiba"
                if is_toshiba and self._toshiba_service is not None and hasattr(self._toshiba_service, 'modify_address_user_wizard'):
                    result = self._toshiba_service.modify_address_user_wizard(
                        printer=printer,
                        registration_no=reg_no,
                        name=name,
                        email=email,
                        folder=folder,
                        user_code=user_code,
                        fields=fields,
                    )
                else:
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
                    collector = self._collector_service_for(printer)
                    addr_result = collector.process_address_list(printer)
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

                is_toshiba = self._printer_type(printer.printer_type) == "toshiba"
                if is_toshiba:
                    if self._toshiba_service is None:
                        raise RuntimeError("Toshiba Service is not initialized on the agent")
                    result = self._toshiba_service.setup_scan_destination(
                        printer=printer,
                        username=custom_name,
                        email=email,
                    )
                else:
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

                # Fetch address book after add so UI can refresh (Toshiba & Ricoh)
                addr_result = None
                try:
                    collector = self._collector_service_for(printer)
                    addr_result = collector.process_address_list(printer)
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

                if addr_result:
                    self._post_address_book_sync_data(printer, addr_result)

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
                self._sync_inventory_to_server()
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

    def _send_gui_status(self, title: str, message: str) -> None:
        try:
            from pathlib import Path
            status_file = Path("storage/data/status_message.txt")
            status_file.parent.mkdir(parents=True, exist_ok=True)
            clean_msg = message.replace("\n", " | ")
            status_file.write_text(f"{title}: {clean_msg}", encoding="utf-8")
        except Exception as e:
            LOGGER.warning("Failed to write GUI status message: %s", e)

    def _show_agent_command_popup(self, command_type: str, params: dict) -> None:
        title = "Thông báo Lệnh từ Server"
        msg_lines = []
        
        if command_type == "general_settings":
            msg_lines.append("Cập nhật cấu hình chung")
            scan_auto_open_file = params.get("scan_auto_open_file")
            scan_auto_open_dir = params.get("scan_auto_open_dir")
            if scan_auto_open_file is not None:
                msg_lines.append(f"Tự động mở file scan: {'Bật' if scan_auto_open_file else 'Tắt'}")
            if scan_auto_open_dir is not None:
                msg_lines.append(f"Tự động mở thư mục: {'Bật' if scan_auto_open_dir else 'Tắt'}")
        elif command_type == "trigger_utility":
            action = str(params.get("action", "")).strip()
            utility_translations = {
                "devices_and_printers": "Mở danh sách Máy in & Thiết bị",
                "open_scan_folder": "Mở thư mục Scan gốc trên PC",
                "dxdiag": "Xem thông số cấu hình máy (dxdiag)",
                "change_ip": "Thay đổi địa chỉ IP máy PC",
            }
            action_vn = utility_translations.get(action, action)
            msg_lines.append(f"{action_vn}")
            
            if action == "change_ip":
                mode = str(params.get("mode", "dhcp")).strip().lower()
                adapter = str(params.get("adapter_name", "Ethernet")).strip()
                msg_lines.append(f"Card: {adapter}")
                if mode == "dhcp":
                    msg_lines.append("Chế độ: DHCP")
                else:
                    ip = str(params.get("ip_address", "")).strip()
                    msg_lines.append(f"Chế độ: IP Tĩnh ({ip})")
        else:
            msg_lines.append(f"Lệnh: {command_type}")

        message = " | ".join(msg_lines)
        self._send_gui_status(title, message)

    def _apply_agent_command(self, command: dict[str, object]) -> None:
        command_id = int(command.get("id", 0) or 0)
        command_type = str(command.get("command_type", "")).strip()
        if command_id <= 0:
            return
            
        import socket
        agent_uid = self._agent_uid or socket.gethostname()
            
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

            from agent.services.polling_bridge import PRINTER_ACTION_COMMANDS
            if command_type in PRINTER_ACTION_COMMANDS:
                dummy_p = Printer(name="Photocopy")
                return self._apply_command(dummy_p, command)

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
                
            elif command_type == "install_driver":
                try:
                    driver_brand = str(command.get("driver_brand", "") or params.get("driver_brand", "") or "").strip()
                    driver_model = str(command.get("driver_model", "") or params.get("driver_model", "") or "").strip()
                    driver_name = str(command.get("driver_name", "") or params.get("driver_name", "") or "").strip()
                    driver_url = str(command.get("driver_url", "") or params.get("driver_url", "") or "").strip()
                    printer_ip = str(command.get("ip", "") or params.get("ip", "") or "").strip()
                    
                    self._send_gui_status("Cài đặt", f"Bắt đầu cài đặt driver {driver_name} cho {printer_ip}...")
                    self._handle_install_driver(
                        command_id=command_id,
                        printer_ip=printer_ip,
                        brand=driver_brand,
                        model=driver_model,
                        driver_name=driver_name,
                        driver_url=driver_url,
                    )
                    self._post_control_result(command_id=command_id, ok=True, error="")
                    self._update_recent_command_status(command_id, "success")
                    self._send_gui_status("Cài đặt", f"Cài đặt thành công driver {driver_name} cho {printer_ip}!")
                except Exception as exc:
                    LOGGER.error("Failed to install driver for printer %s: %s", command.get("ip"), exc)
                    self._post_control_result(command_id=command_id, ok=False, error=str(exc))
                    self._update_recent_command_status(command_id, "failed", str(exc))

            elif command_type in ("force_subnet_scan", "scan_lan", "scan_subnet"):
                LOGGER.info("[PollingBridge] Received ON-DEMAND subnet scan request from Frontend/VPS! Scanning LAN...")
                try:
                    self._send_gui_status("Quét LAN", "Đang tiến hành quét mạng LAN theo yêu cầu...")
                    live_printers = self._load_printers(force_live=True)
                    loc_ip = self._resolve_local_ip()
                    l_uid = self._agent_lan_uid() or "default"
                    self._push_inventory(live_printers, hostname=agent_uid, local_ip=loc_ip, lan_uid=l_uid)
                    self._post_control_result(command_id=command_id, ok=True, error="")
                    self._update_recent_command_status(command_id, "success")
                    self._send_gui_status("Quét LAN", f"Đã quét xong dải LAN! Tìm thấy {len(live_printers)} thiết bị.")
                except Exception as scan_err:
                    LOGGER.error("[PollingBridge] On-demand LAN scan failed: %s", scan_err)
                    self._post_control_result(command_id=command_id, ok=False, error=str(scan_err))
                    self._update_recent_command_status(command_id, "failed", str(scan_err))

            elif command_type == "trigger_utility":
                action = str(params.get("action", "")).strip()
                
                if action == "devices_and_printers":
                    if sys.platform == "win32":
                        self._launch_in_foreground(["control.exe", "printers"])
                    else:
                        raise RuntimeError(f"Devices and Printers is only supported on Windows, got platform {sys.platform}")
                        
                elif action == "open_scan_folder":
                    scan_dir = self._config.get_string("polling.scan_dirs", "").strip()
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
                    cmd_args = shlex.split(run_cmd, posix=False)
                    self._launch_in_foreground(cmd_args)
                elif action == "change_ip":
                    if sys.platform != "win32":
                        raise RuntimeError(f"change_ip is only supported on Windows, got platform {sys.platform}")
                    
                    from agent.utils.shares import ShareManager
                    if not ShareManager.is_admin():
                        raise RuntimeError("❌ Lỗi: Quyền Administrator là bắt buộc để đổi IP tĩnh trên Windows. Vui lòng chạy PrintAgent bằng 'Run as Administrator'.")
                    
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
                            raise ValueError("Địa chỉ IP tĩnh không được để trống!")
                        
                        ip_cmd = ["netsh", "interface", "ipv4", "set", "address", f"name={adapter_name}", "static", ip_address, subnet_mask]
                        if gateway:
                            ip_cmd.append(gateway)
                        cmds.append(ip_cmd)
                        
                        if dns:
                            cmds.append(["netsh", "interface", "ipv4", "set", "dns", f"name={adapter_name}", "static", dns, "primary"])
                    else:
                        raise ValueError(f"Chế độ cấu hình IP không hợp lệ: {mode}")
                    
                    LOGGER.info("[PollingBridge] Changing IP configuration for adapter '%s' to mode '%s'...", adapter_name, mode)
                    for cmd in cmds:
                        LOGGER.info("[PollingBridge] Running command: %s", " ".join(cmd))
                        proc = subprocess.run(cmd, capture_output=True, text=True, **no_window_subprocess_kwargs())
                        if proc.returncode != 0:
                            err_detail = (proc.stderr or proc.stdout or "").strip()
                            err_msg = f"❌ Lỗi đổi IP tĩnh (Command: {' '.join(cmd)}): {err_detail or ('Exit code ' + str(proc.returncode))}"
                            LOGGER.error("[PollingBridge] %s", err_msg)
                            raise RuntimeError(err_msg)
                    
                    # If all netsh commands succeeded, trigger IP change notification
                    try:
                        self.polling_when_ip_change()
                    except Exception as p_err:
                        LOGGER.warning("[PollingBridge] Warning running polling_when_ip_change: %s", p_err)
                elif action == "exec_utility":
                    command_content = str(params.get("command_content", "")).strip()
                    command_name = str(params.get("command", "exec_utility")).strip()
                    if not command_content:
                        raise ValueError("exec_utility: command_content is empty")

                    target_ip = str(params.get("printer_ip") or params.get("ip") or params.get("target_ip") or "").strip()
                    target_user = str(params.get("auth_user") or params.get("user") or params.get("target_user") or "").strip()
                    target_pass = str(params.get("auth_password") or params.get("password") or params.get("target_pass") or "").strip()

                    if target_ip and "__TARGET_IP__" in command_content:
                        command_content = command_content.replace("__TARGET_IP__", target_ip)
                    if target_user and "__TARGET_USER__" in command_content:
                        command_content = command_content.replace("__TARGET_USER__", target_user)
                    if target_pass and "__TARGET_PASS__" in command_content:
                        command_content = command_content.replace("__TARGET_PASS__", target_pass)

                    def _run_dynamic_command():
                        try:
                            LOGGER.info("[PollingBridge] exec_utility '%s': executing dynamic command in background thread...", command_name)
                            res = execute_dynamic_code(
                                bridge=self,
                                code_content=command_content,
                                name=command_name,
                            )
                            is_ok = bool(res.get("ok"))
                            final_output = str(res.get("output", "") or "")
                            addr_data = res.get("address_book_data")
                            self._post_control_result(command_id=command_id, ok=is_ok, error=final_output, address_book_data=addr_data)
                            self._update_recent_command_status(command_id, "success" if is_ok else "failed", final_output)
                        except BaseException as e:
                            LOGGER.error("[PollingBridge] exec_utility '%s' crashed: %s\n%s", command_name, e, traceback.format_exc())
                            error_msg = f"{e}\n{traceback.format_exc()}"
                            self._post_control_result(command_id=command_id, ok=False, error=error_msg)
                            self._update_recent_command_status(command_id, "failed", error_msg)
                    try:
                        threading.Thread(target=_run_dynamic_command, daemon=True).start()
                    except Exception as thread_err:
                        LOGGER.error("[PollingBridge] Failed to start dynamic command thread for '%s': %s", command_name, thread_err)
                        self._post_control_result(command_id=command_id, ok=False, error=f"Lỗi Agent: Không thể tạo luồng mới ({thread_err}). Vui lòng khởi động lại Agent.")
                        self._update_recent_command_status(command_id, "failed", str(thread_err))
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
                elif action == "start_camera_recorder":
                    camera_name = str(params.get("camera_name", "")).strip()
                    rtsp_url = str(params.get("rtsp_url", "")).strip()
                    segment_duration = int(params.get("segment_duration", 60))
                    video_codec = str(params.get("video_codec", "copy")).strip()
                    audio_codec = str(params.get("audio_codec", "copy")).strip()
                    no_audio = bool(params.get("no_audio", True))
                    prefix = str(params.get("prefix", "rec")).strip()
                    
                    if not camera_name or not rtsp_url:
                        raise ValueError("start_camera_recorder: Missing camera_name or rtsp_url")
                        
                    from agent.services.camera_manager import CameraManager
                    cm = CameraManager()
                    import tempfile
                    default_out = str(Path(tempfile.gettempdir()) / "GoPrinxAgent" / "video")
                    output_dir = self._config.get_string("camera.output_dir", default_out)
                    
                    # Upsert config locally for the Local UI / Desktop GUI
                    try:
                        local_cfg_path = Path("storage/camera_configs.json")
                        local_cfg_path.parent.mkdir(parents=True, exist_ok=True)
                        configs = []
                        if local_cfg_path.exists():
                            try:
                                with local_cfg_path.open("r", encoding="utf-8") as f:
                                    configs = json.load(f)
                            except Exception:
                                configs = []
                        
                        found = False
                        for c in configs:
                            if c.get("camera_name") == camera_name:
                                c.update({
                                    "rtsp_url": rtsp_url,
                                    "segment_duration": segment_duration,
                                    "prefix": prefix,
                                    "video_codec": video_codec,
                                    "audio_codec": audio_codec,
                                    "no_audio": no_audio
                                })
                                found = True
                                break
                        if not found:
                            configs.append({
                                "camera_name": camera_name,
                                "rtsp_url": rtsp_url,
                                "segment_duration": segment_duration,
                                "prefix": prefix,
                                "video_codec": video_codec,
                                "audio_codec": audio_codec,
                                "no_audio": no_audio
                            })
                        with local_cfg_path.open("w", encoding="utf-8") as f:
                            json.dump(configs, f, indent=2, ensure_ascii=False)
                    except Exception as e:
                        LOGGER.error("Failed to save local camera config: %s", e)

                    duration_limit = params.get("duration_limit")
                    if duration_limit is not None:
                        try:
                            duration_limit = int(duration_limit)
                        except (ValueError, TypeError):
                            duration_limit = None

                    mac_address = str(params.get("mac_address", params.get("mac", ""))).strip()

                    success = cm.start_recording(
                        camera_name=camera_name,
                        rtsp_url=rtsp_url,
                        output_dir=output_dir,
                        segment_duration=segment_duration,
                        video_codec=video_codec,
                        audio_codec=audio_codec,
                        no_audio=no_audio,
                        prefix=prefix,
                        duration_limit=duration_limit,
                        mac_address=mac_address
                    )
                    if not success:
                        raise RuntimeError("Failed to start camera recorder")
                        
                    self._post_control_result(command_id=command_id, ok=True, error="")
                    self._update_recent_command_status(command_id, "success")
                    return
                elif action == "save_camera_config":
                    camera_name = str(params.get("camera_name", "")).strip()
                    rtsp_url = str(params.get("rtsp_url", "")).strip()
                    segment_duration = int(params.get("segment_duration", 60))
                    video_codec = str(params.get("video_codec", "copy")).strip()
                    audio_codec = str(params.get("audio_codec", "copy")).strip()
                    no_audio = bool(params.get("no_audio", True))
                    prefix = str(params.get("prefix", "rec")).strip()
                    
                    if not camera_name or not rtsp_url:
                        raise ValueError("save_camera_config: Missing camera_name or rtsp_url")
                        
                    try:
                        local_cfg_path = Path("storage/camera_configs.json")
                        local_cfg_path.parent.mkdir(parents=True, exist_ok=True)
                        configs = []
                        if local_cfg_path.exists():
                            try:
                                with local_cfg_path.open("r", encoding="utf-8") as f:
                                    configs = json.load(f)
                            except Exception:
                                configs = []
                        
                        found = False
                        for c in configs:
                            if c.get("camera_name") == camera_name:
                                c.update({
                                    "rtsp_url": rtsp_url,
                                    "segment_duration": segment_duration,
                                    "prefix": prefix,
                                    "video_codec": video_codec,
                                    "audio_codec": audio_codec,
                                    "no_audio": no_audio
                                })
                                found = True
                                break
                        if not found:
                            configs.append({
                                "camera_name": camera_name,
                                "rtsp_url": rtsp_url,
                                "segment_duration": segment_duration,
                                "prefix": prefix,
                                "video_codec": video_codec,
                                "audio_codec": audio_codec,
                                "no_audio": no_audio
                            })
                        with local_cfg_path.open("w", encoding="utf-8") as f:
                            json.dump(configs, f, indent=2, ensure_ascii=False)
                    except Exception as e:
                        LOGGER.error("Failed to save local camera config: %s", e)
                        
                    self._post_control_result(command_id=command_id, ok=True, error="")
                    self._update_recent_command_status(command_id, "success")
                    return
                elif action == "delete_camera_config":
                    camera_name = str(params.get("camera_name", "")).strip()
                    if not camera_name:
                        raise ValueError("delete_camera_config: Missing camera_name")
                        
                    try:
                        local_cfg_path = Path("storage/camera_configs.json")
                        if local_cfg_path.exists():
                            with local_cfg_path.open("r", encoding="utf-8") as f:
                                configs = json.load(f)
                            configs = [c for c in configs if c.get("camera_name") != camera_name]
                            with local_cfg_path.open("w", encoding="utf-8") as f:
                                json.dump(configs, f, indent=2, ensure_ascii=False)
                    except Exception as e:
                        LOGGER.error("Failed to delete local camera config: %s", e)
                        
                    self._post_control_result(command_id=command_id, ok=True, error="")
                    self._update_recent_command_status(command_id, "success")
                    return
                elif action == "stop_camera_recorder":
                    camera_name = str(params.get("camera_name", "")).strip()
                    if not camera_name:
                        raise ValueError("stop_camera_recorder: Missing camera_name")
                        
                    from agent.services.camera_manager import CameraManager
                    cm = CameraManager()
                    cm.stop_recording(camera_name)
                    
                    self._post_control_result(command_id=command_id, ok=True, error="")
                elif action == "scan_cameras":
                    LOGGER.info("[PollingBridge] Received scan_cameras command, starting background scan...")
                    self._trigger_background_camera_scan()
                    cameras = getattr(self, "_last_discovered_cameras", [])
                    payload_str = json.dumps({"cameras": cameras})
                    self._post_control_result(command_id=command_id, ok=True, error=payload_str)
                    self._update_recent_command_status(command_id, "success", payload_str)
                    return
                elif action == "get_camera_status":
                    camera_name = str(params.get("camera_name", "")).strip()
                    if not camera_name:
                        raise ValueError("get_camera_status: Missing camera_name")
                        
                    from agent.services.camera_manager import CameraManager
                    cm = CameraManager()
                    status_data = cm.get_status(camera_name)
                    status_data["logs"] = cm.get_logs(camera_name)
                    
                    payload_str = json.dumps(status_data)
                    self._post_control_result(command_id=command_id, ok=True, error=payload_str)
                    self._update_recent_command_status(command_id, "success", payload_str)
                    return
                elif action == "list_camera_files":
                    camera_name = str(params.get("camera_name", "")).strip()
                    if not camera_name:
                        raise ValueError("list_camera_files: Missing camera_name")
                        
                    from agent.services.camera_manager import CameraManager
                    cm = CameraManager()
                    import tempfile
                    default_out = str(Path(tempfile.gettempdir()) / "GoPrinxAgent" / "video")
                    output_dir = self._config.get_string("camera.output_dir", default_out)
                    files = cm.list_recordings(camera_name, output_dir)
                    
                    payload_str = json.dumps({"files": files})
                    self._post_control_result(command_id=command_id, ok=True, error=payload_str)
                    self._update_recent_command_status(command_id, "success", payload_str)
                    return
                elif action == "delete_camera_file":
                    filename = str(params.get("filename", "")).strip()
                    if not filename:
                        raise ValueError("delete_camera_file: Missing filename")
                        
                    from agent.services.camera_manager import CameraManager
                    cm = CameraManager()
                    import tempfile
                    default_out = str(Path(tempfile.gettempdir()) / "GoPrinxAgent" / "video")
                    output_dir = self._config.get_string("camera.output_dir", default_out)
                    success = cm.delete_recording(output_dir, filename)
                    if not success:
                        raise RuntimeError("Failed to delete recording file")
                        
                    self._post_control_result(command_id=command_id, ok=True, error="")
                    self._update_recent_command_status(command_id, "success")
                    return
                elif action == "test_camera_rtsp":
                    rtsp_url = str(params.get("rtsp_url", "")).strip()
                    if not rtsp_url:
                        raise ValueError("test_camera_rtsp: Missing rtsp_url")
                        
                    from agent.services.camera_manager import CameraManager
                    cm = CameraManager()
                    ok, msg = cm.test_rtsp_connection(rtsp_url)
                    
                    payload_str = json.dumps({"ok": ok, "msg": msg})
                    self._post_control_result(command_id=command_id, ok=True, error=payload_str)
                    self._update_recent_command_status(command_id, "success", payload_str)
                    return
                elif action == "query_camera_video":
                    camera_name = str(params.get("camera_name", "")).strip()
                    timestamp = str(params.get("timestamp", "")).strip()
                    duration = int(params.get("duration", 10))
                    
                    if not camera_name or not timestamp:
                        raise ValueError("query_camera_video: Missing camera_name or timestamp")
                        
                    from agent.services.camera_manager import CameraManager
                    cm = CameraManager()
                    import tempfile
                    default_out = str(Path(tempfile.gettempdir()) / "GoPrinxAgent" / "video")
                    output_dir = self._config.get_string("camera.output_dir", default_out)
                    clip_path = cm.render_video_clip(camera_name, output_dir, timestamp, duration)
                    if not clip_path or not os.path.exists(clip_path):
                        raise FileNotFoundError("Video clip could not be rendered for the given timestamp")
                        
                    base_url = self._polling_base_url()
                    token = self._config.get_string("polling.token").strip()
                    headers = {"X-Lead-Token": token}
                    url = f"{base_url}/api/agents/{agent_uid}/cameras/upload-video"
                    
                    import requests
                    with open(clip_path, "rb") as f:
                        files = {"file": (os.path.basename(clip_path), f, "video/mp4")}
                        data = {"camera_name": camera_name, "timestamp": timestamp}
                        resp = requests.post(url, files=files, data=data, headers=headers, timeout=60)
                        resp.raise_for_status()
                        
                    self._post_control_result(command_id=command_id, ok=True, error="")
                    self._update_recent_command_status(command_id, "success")
                    return
                else:
                    raise ValueError(f"Unknown utility action: {action}")

                    
                LOGGER.info("[PollingBridge] Executed utility action: %s", action)
                self._post_control_result(command_id=command_id, ok=True, error="")
                self._update_recent_command_status(command_id, "success")
            elif command_type == "emergency_restart":
                LOGGER.warning("[PollingBridge] Received emergency_restart command from server. Restarting agent process...")
                self._post_control_result(command_id=command_id, ok=True, error="Restarting agent process...")
                self._update_recent_command_status(command_id, "success")
                def _do_restart():
                    time.sleep(1)
                    os._exit(0)
                threading.Thread(target=_do_restart, daemon=True).start()
                return
            else:
                raise ValueError(f"Unknown agent command type: {command_type}")
                
        except Exception as exc:
            LOGGER.error("[PollingBridge] Failed to apply agent command: %s", exc, exc_info=True)
            self._post_control_result(command_id=command_id, ok=False, error=str(exc))
            self._update_recent_command_status(command_id, "failed", str(exc))

    def _ensure_gox_driver_service(self) -> bool:
        """
        Auto-download GoxDriverService.exe from server and register as Windows Service.
        Returns True if service pipe is reachable after this call.
        UAC is shown at most ONCE (only when sc create needs elevation).
        """
        import subprocess
        import time as _time

        PIPE_NAME    = r"\\.\pipe\GoxDriverService"
        SERVICE_NAME = "GoxDriverService"
        INSTALL_DIR  = Path(os.environ.get("ProgramData", "C:/ProgramData")) / "GoxDriverService"
        EXE_PATH     = INSTALL_DIR / "GoxDriverService.exe"

        def _pipe_open() -> bool:
            """Try to open the pipe using ctypes. Returns True if service is reachable."""
            try:
                import ctypes
                kernel32 = ctypes.windll.kernel32
                h = kernel32.CreateFileW(
                    PIPE_NAME, 0xC0000000, 0, None, 3, 0, None
                )
                if h != -1 and h != 0 and h != 0xFFFFFFFFFFFFFFFF:
                    kernel32.CloseHandle(h)
                    return True
                return False
            except Exception:
                return False

        # ── Quick check: pipe already exists? ──────────────────
        if _pipe_open():
            return True

        # ── One install attempt per agent session ───────────────
        with PollingControlMixin._GDS_INSTALL_LOCK:
            if PollingControlMixin._GDS_INSTALL_DONE:
                return False   # already tried this session, don't retry

            LOGGER.info("[GDS] GoxDriverService not running — attempting auto-install...")

            # ── Step 1: Download exe ────────────────────────────
            api_url = self._config.api_url or ""
            from urllib.parse import urlparse as _urlparse
            parsed = _urlparse(api_url)
            base_url = f"{parsed.scheme}://{parsed.netloc}" if parsed.netloc else ""

            if not base_url:
                LOGGER.warning("[GDS] Cannot determine server base URL — skipping auto-install")
                PollingControlMixin._GDS_INSTALL_DONE = True
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
                PollingControlMixin._GDS_INSTALL_DONE = True
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
                    PollingControlMixin._GDS_INSTALL_DONE = True
                    return True

            LOGGER.warning("[GDS] Pipe not available after install attempt")
            PollingControlMixin._GDS_INSTALL_DONE = True

            return False

    # ── End GoxDriverService auto-install ──────────────────────────────────────

    def _handle_install_driver(self, command_id: int, printer_ip: str, brand: str, model: str, driver_name: str, driver_url: str) -> None:

        import zipfile
        import tempfile
        import shutil
        import subprocess
        import os
        import sys

        LOGGER.info("Starting driver installation printer_ip=%s brand=%s model=%s driver_name=%s driver_url=%s",
                    printer_ip, brand, model, driver_name, driver_url)

        _NO_WINDOW = subprocess.CREATE_NO_WINDOW if hasattr(subprocess, 'CREATE_NO_WINDOW') else 0x08000000
        step_results: list[str] = []

        def get_system32_file(filename: str) -> str:
            sysnative = os.path.join(os.environ.get("SystemRoot", "C:\\Windows"), "Sysnative")
            if os.path.isdir(sysnative):
                target = os.path.join(sysnative, filename)
                if os.path.exists(target):
                    return target
            return os.path.join(os.environ.get("SystemRoot", "C:\\Windows"), "System32", filename)

        pnputil_path = get_system32_file("pnputil.exe")
        powershell_path = get_system32_file("WindowsPowerShell\\v1.0\\powershell.exe")

        def _progress(text: str) -> None:
            LOGGER.info("[DriverInstall] %s", text)
            try:
                self._post_command_progress(command_id, text)
            except Exception:
                pass
            try:
                # Write to status_message.txt for GUI status bar updates
                status_file = Path("storage/data/status_message.txt")
                status_file.parent.mkdir(parents=True, exist_ok=True)
                status_file.write_text(text, encoding="utf-8")
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
                    
            model_tokens = [t.lower() for t in model.split() if any(c.isdigit() for c in t)]

            # 0. Highest priority: Exact word boundary match for full token (e.g. \b6503\b or \bc6503\b or \bw8140\b)
            for token in model_tokens:
                pattern = r'\b' + re.escape(token) + r'\b'
                exact_matches = [d for d in candidates if re.search(pattern, d.lower())]
                if exact_matches:
                    pcl6 = [d for d in exact_matches if "pcl" in d.lower() and "6" in d]
                    matched = pcl6[0] if pcl6 else exact_matches[0]
                    LOGGER.info("[DriverInstall] Exact boundary match by token '%s' -> '%s'", token, matched)
                    return matched

            # 1. Match by full model tokens containing digits (substring)
            for token in model_tokens:
                matches = [d for d in candidates if token in d.lower()]
                if matches:
                    pcl6 = [d for d in matches if "pcl" in d.lower() and "6" in d]
                    matched = pcl6[0] if pcl6 else matches[0]
                    LOGGER.info("[DriverInstall] Matched by token '%s' -> '%s'", token, matched)
                    return matched
                    
            # 2. Match by digits (>= 3 chars with word boundary first)
            for digit_seq in model_digits:
                if len(digit_seq) >= 3:
                    pattern = r'\b' + re.escape(digit_seq) + r'\b'
                    boundary_matches = [d for d in candidates if re.search(pattern, d.lower())]
                    if boundary_matches:
                        pcl6 = [d for d in boundary_matches if "pcl" in d.lower() and "6" in d]
                        matched = pcl6[0] if pcl6 else boundary_matches[0]
                        LOGGER.info("[DriverInstall] Matched by digits boundary '%s' -> '%s'", digit_seq, matched)
                        return matched

                    matches = [d for d in candidates if digit_seq in d.lower()]
                    if matches:
                        pcl6 = [d for d in matches if "pcl" in d.lower() and "6" in d]
                        matched = pcl6[0] if pcl6 else matches[0]
                        LOGGER.info("[DriverInstall] Matched by digits '%s' -> '%s'", digit_seq, matched)
                        return matched
                        
            # 3. Match by other model words
            ignore_words = {"mp", "im", "sp", "spf", "c", "pro", "w"}
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

        # Try to delegate driver installation to elevated GoxDriverService (SYSTEM) to bypass UAC and standard user permission limits
        try:
            use_service = self._ensure_gox_driver_service()
            if use_service:
                _progress("[GDS] GoxDriverService is running. Delegating driver installation to service (SYSTEM)...")
                
                def _call_gds(request: dict, timeout_s: float = 300.0) -> dict:
                    import ctypes
                    import json
                    import time

                    PIPE_NAME = r"\\.\pipe\GoxDriverService"
                    deadline = time.time() + timeout_s
                    pipe_handle = -1
                    kernel32 = ctypes.windll.kernel32

                    while time.time() < deadline:
                        pipe_handle = kernel32.CreateFileW(
                            PIPE_NAME,
                            0xC0000000,
                            0, None,
                            3,
                            0, None,
                        )
                        if pipe_handle != -1 and pipe_handle != 0 and pipe_handle != 0xFFFFFFFFFFFFFFFF:
                            break
                        time.sleep(0.5)

                    if pipe_handle == -1 or pipe_handle == 0 or pipe_handle == 0xFFFFFFFFFFFFFFFF:
                        raise TimeoutError("Could not connect to GoxDriverService pipe")

                    try:
                        payload = json.dumps(request).encode("utf-8")
                        bytes_written = ctypes.c_ulong(0)
                        kernel32.WriteFile(pipe_handle, payload, len(payload), ctypes.byref(bytes_written), None)

                        buffer = ctypes.create_string_buffer(65536)
                        bytes_read = ctypes.c_ulong(0)
                        chunks = []
                        while True:
                            res = kernel32.ReadFile(pipe_handle, buffer, 65536, ctypes.byref(bytes_read), None)
                            if not res or bytes_read.value == 0:
                                break
                            chunks.append(buffer.raw[:bytes_read.value])
                            if bytes_read.value < 65536:
                                break
                        
                        raw = b"".join(chunks)
                        if not raw:
                            return {"success": False, "error": "Empty response from GoxDriverService"}
                        return json.loads(raw.decode("utf-8"))
                    finally:
                        try:
                            kernel32.CloseHandle(pipe_handle)
                        except Exception:
                            pass

                req = {
                    "action": "download_and_install",
                    "driver_url": driver_url,
                    "printer_ip": printer_ip,
                    "model": model,
                    "driver_name": driver_name,
                }
                res = _call_gds(req, timeout_s=360.0)
                
                service_out = res.get("output", "")
                for line in service_out.splitlines():
                    if line.strip():
                        LOGGER.info("[GDS-Service] %s", line)
                
                if res.get("success"):
                    installed_driver_name = res.get("driver_name")
                    summary = f"🏁 HOÀN TẤT: {brand} {model} @ {printer_ip} — Cài qua dịch vụ (SYSTEM) thành công | Driver: {installed_driver_name}"
                    _progress(summary)
                    LOGGER.info("Driver installation completed via SYSTEM service: %s", summary)
                    return  # Early success return, skipping standard non-admin path
        except Exception as gds_err:
            LOGGER.warning("Failed to install driver via GoxDriverService: %s. Falling back to direct mode.", gds_err)
            _progress(f"[GDS] ⚠️ Lỗi cài qua dịch vụ: {gds_err}. Chuyển sang cài trực tiếp...")

        try:
            for old_tmp in Path(tempfile.gettempdir()).glob("gox_driver_*"):
                shutil.rmtree(old_tmp, ignore_errors=True)
            for old_tmp in Path(tempfile.gettempdir()).glob("printagent_driver_*"):
                shutil.rmtree(old_tmp, ignore_errors=True)
        except Exception:
            pass

        temp_dir = Path(tempfile.mkdtemp(prefix="printagent_driver_"))
        try:
            # ── BƯỚC 0: Kiểm tra driver có sẵn trong hệ thống ──
            installed_driver_name = None
            skip_download_and_install = False
            
            # If driver_url is provided, we always download/extract to guarantee exact INF files exist
            if not driver_url or not driver_url.strip():
                try:
                    _progress(f"[0/5] 🔍 Kiểm tra driver cho '{brand} {model}' trong hệ thống...")
                    check = subprocess.run(
                        [powershell_path, "-Command", "Get-PrinterDriver | Select-Object -ExpandProperty Name"],
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
                        for sfx_flag in [["-y", f"-o{extract_dir}"], ["/extract", f"/dir={extract_dir}"], ["/s", f"/p{extract_dir}"]]:
                            try:
                                subprocess.run(
                                    [str(download_path)] + sfx_flag,
                                    capture_output=True, timeout=60,
                                    creationflags=_NO_WINDOW,
                                )
                                exe_files = list(extract_dir.glob("**/*.exe"))
                                if exe_files or list(extract_dir.glob("**/*.inf")):
                                    _progress(f"[2/5] ✅ Giải nén SFX thành công qua {sfx_flag}")
                                    break
                            except Exception:
                                pass
                        if not exe_files and not list(extract_dir.glob("**/*.inf")):
                            _progress(f"[2/5] ⚠️ Dùng exe trực tiếp")
                            exe_files = [download_path]

                # Extract nested ZIPs if present inside extracted folder
                for nested_zip in list(extract_dir.glob("**/*.zip")):
                    try:
                        with zipfile.ZipFile(nested_zip, "r") as nz:
                            nz.extractall(nested_zip.parent)
                    except Exception:
                        pass

                # If no INF files found yet, attempt silent SFX extraction on any nested EXEs (e.g. Toshiba SFX Web packages)
                if not list(extract_dir.glob("**/*.inf")):
                    for nested_exe in list(extract_dir.glob("**/*.exe")):
                        try:
                            with zipfile.ZipFile(nested_exe, "r") as nz:
                                nz.extractall(nested_exe.parent)
                                continue
                        except Exception:
                            pass
                        for sfx_flag in [["-y", f"-o{nested_exe.parent}"], ["/extract", f"/dir={nested_exe.parent}"], ["/s", f"/p{nested_exe.parent}"]]:
                            try:
                                subprocess.run(
                                    [str(nested_exe)] + sfx_flag,
                                    capture_output=True, timeout=60,
                                    creationflags=_NO_WINDOW,
                                )
                                if list(extract_dir.glob("**/*.inf")):
                                    _progress(f"[2/5] ✅ Giải nén SFX {nested_exe.name} thành công!")
                                    break
                            except Exception:
                                pass

                all_infs = list(extract_dir.glob("**/*.inf"))
                is_64 = sys.maxsize > 2**32 or os.environ.get("PROCESSOR_ARCHITECTURE") == "AMD64" or os.environ.get("PROCESSOR_ARCHITEW6432") == "AMD64"
                if is_64:
                    matched_infs = [f for f in all_infs if "64" in str(f.parent).lower() or "x64" in str(f.parent).lower() or "amd64" in str(f.parent).lower()]
                    if matched_infs:
                        inf_files = matched_infs
                    else:
                        inf_files = [f for f in all_infs if "32" not in str(f.parent).lower() and "x86" not in str(f.parent).lower()] or all_infs
                else:
                    matched_infs = [f for f in all_infs if "32" in str(f.parent).lower() or "x86" in str(f.parent).lower()]
                    inf_files = matched_infs if matched_infs else all_infs

                _progress(f"[2/5] 📂 Tìm thấy: {len(all_infs)} .inf ({len(inf_files)} khớp OS { '64-bit' if is_64 else '32-bit' }), {len(exe_files)} .exe")
                step_results.append(f"Extract: {len(inf_files)} .inf, {len(exe_files)} .exe")

                if not exe_files and not inf_files:
                    raise Exception("Không tìm thấy .inf hoặc .exe nào")

                # ── BƯỚC 3/5: pnputil install ──
                _progress(f"[3/5] 📌 Cài driver vào Windows Driver Store...")
                pnp_ok = 0
                pnp_fail = 0
                pnp_err_details = []
                if inf_files:
                    for i, inf in enumerate(inf_files, 1):
                        _progress(f"[3/5] pnputil ({i}/{len(inf_files)}): {inf.name}")
                        try:
                            result = subprocess.run(
                                [pnputil_path, "/add-driver", str(inf), "/install"],
                                capture_output=True, text=True, timeout=120,
                                creationflags=_NO_WINDOW,
                            )
                            out_text = (result.stdout or "") + " " + (result.stderr or "")
                            is_pnp_success = (
                                result.returncode in (0, 3010) or
                                "successfully" in out_text.lower() or
                                "up-to-date" in out_text.lower() or
                                "already exists" in out_text.lower()
                            )
                            if is_pnp_success:
                                pnp_ok += 1
                                _progress(f"[3/5] ✅ {inf.name} — OK (DriverStore updated)")
                            else:
                                pnp_fail += 1
                                err_msg = out_text.strip()[:200]
                                pnp_err_details.append(f"{inf.name}: {err_msg}")
                                _progress(f"[3/5] ⚠️ {inf.name} — exit {result.returncode}: {err_msg}")
                        except Exception as pnp_exc:
                            pnp_fail += 1
                            pnp_err_details.append(f"{inf.name}: {pnp_exc}")
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
                        [powershell_path, "-Command", "Get-PrinterDriver | Select-Object -ExpandProperty Name"],
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
                    if not matched_name and inf_driver_names:
                        matched_name = inf_driver_names[0]
                        _progress(f"[4/5] 📌 Chọn driver trực tiếp từ file INF: '{matched_name}'")
                    
                    if matched_name:
                        if matched_name not in all_drivers and matched_name in inf_driver_names:
                            _progress(f"[4/5] 📌 Đăng ký driver '{matched_name}' từ Driver Store vào Spooler...")
                            try:
                                reg_res = subprocess.run(
                                    [powershell_path, "-Command", f"Add-PrinterDriver -Name '{matched_name}'"],
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

                def _registry_key_exists(reg_path: str) -> bool:
                    try:
                        import winreg
                        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, reg_path, 0, winreg.KEY_READ)
                        winreg.CloseKey(key)
                        return True
                    except Exception:
                        return False

                # 5a: Port
                _progress(f"[5/5] 📌 Tạo TCP/IP port: {port_name} → {printer_ip}")
                port_ok = False
                try:
                    # Direct registry check in Python takes < 1ms and never hangs/timeouts
                    reg_ports_path = f"SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors\\Standard TCP/IP Port\\Ports\\{port_name}"
                    if _registry_key_exists(reg_ports_path):
                        _progress(f"[5/5] ✅ Port {port_name} đã tồn tại")
                        port_ok = True
                    else:
                        port_result = subprocess.run(
                            [powershell_path, "-Command",
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
                        # Direct registry check in Python for printer existence
                        reg_printers_path = f"SYSTEM\\CurrentControlSet\\Control\\Print\\Printers\\{printer_queue_name}"
                        printer_existed = _registry_key_exists(reg_printers_path)
                        add_ok = False

                        if printer_existed:
                            _progress(f"[5/5] ✅ Máy in đã tồn tại")
                            step_results.append("Printer: đã tồn tại")
                            add_ok = True
                        elif inf_files and pnp_ok == 0:
                            err_summary = "; ".join(pnp_err_details[:2]) if pnp_err_details else "Cần quyền Admin"
                            _progress(f"[5/5] ❌ Bỏ qua Add-Printer vì pnputil cài driver thất bại (0/len(inf_files)): {err_summary}")
                            step_results.append(f"Printer: LỖI (pnputil thất bại: {err_summary}. Chạy lại bộ cài printagentinstall.exe mới nhất bằng Admin)")
                        else:
                            try:
                                add_result = subprocess.run(
                                    [powershell_path, "-Command",
                                     f"Add-Printer -Name '{printer_queue_name}' -DriverName '{installed_driver_name}' -PortName '{port_name}'"],
                                    capture_output=True, text=True, timeout=15, creationflags=_NO_WINDOW,
                                )
                                if add_result.returncode == 0:
                                    _progress(f"[5/5] ✅ Thêm máy in thành công!")
                                    step_results.append(f"Printer: {printer_queue_name} ✅")
                                    add_ok = True
                                else:
                                    err = (add_result.stderr or add_result.stdout or '').strip()[:200]
                                    _progress(f"[5/5] ❌ Lỗi Add-Printer: {err}")
                                    step_results.append(f"Printer: LỖI ({err or 'exit ' + str(add_result.returncode)})")
                            except subprocess.TimeoutExpired:
                                _progress("[5/5] ❌ Lỗi Add-Printer: Quá thời gian chờ (15s)")
                                step_results.append("Printer: LỖI (Add-Printer treo 15s — Thiếu quyền Admin hoặc chưa chạy GoxDriverService)")

                        if add_ok:
                            try:
                                # 2 lệnh hiển thị cửa sổ Hàng đợi in (/o) và Thuộc tính máy in (/p)
                                subprocess.Popen(f'rundll32.exe printui.dll,PrintUIEntry /o /n "{printer_queue_name}"', shell=True)
                                subprocess.Popen(f'rundll32.exe printui.dll,PrintUIEntry /p /n "{printer_queue_name}"', shell=True)
                                _progress(f"[5/5] 🖥️ Đã mở cửa sổ Hàng đợi in & Thuộc tính máy in cho '{printer_queue_name}'")
                            except Exception as ui_exc:
                                LOGGER.warning("[DriverInstall] Could not open printer GUI: %s", ui_exc)

                    except Exception as add_exc:
                        _progress(f"[5/5] ❌ Lỗi: {add_exc}")
                        step_results.append(f"Printer: LỖI ({add_exc})")
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
            if any(k in summary for k in ["Printer: LỖI", "BỎ QUA", "KHÔNG TÌM THẤY"]):
                raise RuntimeError(summary)

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

    def _control_loop(self) -> None:
        LOGGER.info("Polling control worker loop started")
        while not self._stop_event.is_set():
            try:
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
                    # Self-resolve lan_uid instead of waiting for polling worker
                    try:
                        import socket
                        hostname = socket.gethostname()
                        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                        s.connect(("8.8.8.8", 80))
                        local_ip = s.getsockname()[0]
                        s.close()
                        lan_uid, _ = self._resolve_lan_info(hostname=hostname, local_ip=local_ip)
                    except Exception:
                        pass
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
                    if controls_payload.get("request_inventory_push"):
                        LOGGER.info("[PollingBridge] VPS RAM has empty printers payload for agent %s, auto-triggering inventory push...", self._agent_uid)
                        try:
                            self._sync_inventory_to_server()
                        except Exception as push_exc:
                            LOGGER.warning("[PollingBridge] Auto inventory push failed: %s", push_exc)

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
            except Exception as loop_exc:
                LOGGER.exception("Unhandled exception in _control_loop (recovered): %s", loop_exc)
                time.sleep(5.0)

        LOGGER.info("Polling control worker loop stopped")
