from __future__ import annotations

import json
import logging
import os
import re
import socket
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any

from agent.config import AppConfig
from agent.web_collect import _supports_collection_vendor
from agent.modules.ricoh.service import RicohService
from agent.services.api_client import APIClient, Printer
from agent.services.polling_bridge import PollingBridge
from agent.services.runtime import no_window_subprocess_kwargs
from agent.utils.scanner import SubnetScanner

LOGGER = logging.getLogger(__name__)
CACHE_TTL_SECONDS = 300
_DEVICES_CACHE: dict[str, Any] = {"cached_at": "", "devices": []}
DEFAULT_IGNORE_PREFIXES = ["RustDesk", "RuskDesk", "Microsoft", "Fax", "AnyDesk", "Foxit"]


def _load_printers(api_client: APIClient) -> list[Printer]:
    try:
        return api_client.get_printers()
    except Exception as exc:  # noqa: BLE001
        LOGGER.warning("Failed to fetch printers from API: %s", exc)
        return []


def _extract_ip(value: str) -> str:
    match = re.search(r"\b(\d{1,3}(?:\.\d{1,3}){3})\b", value or "")
    return match.group(1) if match else ""


def _normalize_ipv4(value: str) -> str:
    text = str(value or "").strip()
    if not text:
        return ""
    match = re.fullmatch(r"(\d{1,3})(?:\.(\d{1,3})){3}", text)
    if not match:
        return ""
    parts = text.split(".")
    if any(int(part) > 255 for part in parts):
        return ""
    return ".".join(str(int(part)) for part in parts)


def _clean_printer_display_name(name: str, ip: str = "") -> str:
    text = str(name or "").strip()
    if text:
        photo_prefix = "^\\s*(m[a\\u00e1\\u00e0\\u1ea3\\u00e3\\u1ea1]y|may)\\s*photo\\s*"
        text = re.sub(photo_prefix, "", text, flags=re.IGNORECASE).strip(" -_()")
    if text:
        normalized = _normalize_ipv4(text)
        if normalized and (not ip or normalized == _normalize_ipv4(ip)):
            return "unknown"
        return text
    return "unknown"


def _extract_port_link_id(port_name: str) -> str:
    text = str(port_name or "").strip()
    if not text:
        return ""
    # For local/WSD printers without reachable IP, use port identifier as a stable ID fallback.
    return text


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


def _load_neighbor_mac_map() -> dict[str, str]:
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
        payload = _safe_json_load(result.stdout)
        if isinstance(payload, dict):
            payload = [payload]
        if isinstance(payload, list):
            mapping: dict[str, str] = {}
            for item in payload:
                if not isinstance(item, dict):
                    continue
                ip = str(item.get("IPAddress", "") or "").strip()
                mac = _normalize_mac(str(item.get("LinkLayerAddress", "") or ""))
                if ip and mac:
                    mapping[ip] = mac
            if mapping:
                return mapping
    except Exception as exc:  # noqa: BLE001
        LOGGER.debug("Get-NetNeighbor lookup failed: %s", exc)

    try:
        result = subprocess.run(
            ["arp", "-a"],
            capture_output=True,
            text=True,
            timeout=8,
            check=True,
            **no_window_subprocess_kwargs(),
        )
    except Exception as exc:  # noqa: BLE001
        LOGGER.debug("arp lookup failed: %s", exc)
        return {}

    mapping: dict[str, str] = {}
    for line in result.stdout.splitlines():
        match = re.search(r"\b(\d{1,3}(?:\.\d{1,3}){3})\s+([0-9a-fA-F:-]{17})\s+\w+", line)
        if not match:
            continue
        ip = match.group(1)
        mac = _normalize_mac(match.group(2))
        if mac:
            mapping[ip] = mac
    return mapping


def _resolve_device_machine_ids(
    service: RicohService, devices: list[Printer], neighbor_mac_map: dict[str, str] | None = None
) -> dict[str, str]:
    mapping: dict[str, str] = {}
    for device in devices:
        ip = str(device.ip or "").strip()
        if not ip:
            continue
        if str(device.printer_type or "").strip().lower() != "ricoh":
            continue
        try:
            payload = service.process_device_info(device, should_post=False)
            info = payload.get("device_info", {}) if isinstance(payload, dict) else {}
            if not isinstance(info, dict):
                continue
            machine_id = str(info.get("machine_id", "") or "").strip()
            if machine_id:
                mapping[ip] = machine_id
                continue
            mac_address = _normalize_mac(str(info.get("mac_address", "") or ""))
            if mac_address:
                mapping[ip] = mac_address
        except Exception as exc:  # noqa: BLE001
            LOGGER.debug("Cannot resolve machine_id for %s (%s): %s", device.name, ip, exc)
            # Persistence: Fallback to neighbor_mac_map if available
            if neighbor_mac_map and ip in neighbor_mac_map:
                mapping[ip] = neighbor_mac_map[ip]
    return mapping


def _save_devices_cache(devices: list[dict[str, Any]]) -> None:
    _DEVICES_CACHE["cached_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    _DEVICES_CACHE["devices"] = list(devices or [])


def _load_devices_cache() -> tuple[list[dict[str, Any]], str]:
    cached_devices = _DEVICES_CACHE.get("devices", [])
    cached_at = str(_DEVICES_CACHE.get("cached_at", "") or "")
    if isinstance(cached_devices, list):
        return cached_devices, cached_at
    return [], ""


def _safe_json_load(raw: str) -> Any:
    text = (raw or "").strip()
    if not text:
        return []
    try:
        import json

        return json.loads(text)
    except Exception:  # noqa: BLE001
        return []


def _load_local_windows_printers() -> list[dict[str, Any]]:
    script = r"""
$ErrorActionPreference='Stop'
$printers = Get-Printer | Select-Object Name,DriverName,PortName,PrinterStatus,WorkOffline,Type,Shared
$ports = Get-PrinterPort | Select-Object Name,PrinterHostAddress,PortMonitor
[PSCustomObject]@{
  printers = $printers
  ports = $ports
} | ConvertTo-Json -Depth 6
"""
    try:
        result = subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
            capture_output=True,
            text=True,
            timeout=20,
            check=True,
            **no_window_subprocess_kwargs(),
        )
    except Exception as exc:  # noqa: BLE001
        LOGGER.warning("Cannot read local Windows printers: %s", exc)
        return []

    payload = _safe_json_load(result.stdout)
    if not isinstance(payload, dict):
        return []

    raw_printers = payload.get("printers", [])
    raw_ports = payload.get("ports", [])
    if isinstance(raw_printers, dict):
        raw_printers = [raw_printers]
    if isinstance(raw_ports, dict):
        raw_ports = [raw_ports]

    port_map: dict[str, dict[str, Any]] = {}
    for port in raw_ports:
        if not isinstance(port, dict):
            continue
        name = str(port.get("Name", "") or "")
        if not name:
            continue
        port_map[name] = port

    devices: list[dict[str, Any]] = []
    for item in raw_printers:
        if not isinstance(item, dict):
            continue
        name = str(item.get("Name", "") or "")
        port_name = str(item.get("PortName", "") or "")
        status_raw = str(item.get("PrinterStatus", "") or "")
        work_offline = bool(item.get("WorkOffline", False))
        port_info = port_map.get(port_name, {})
        host_addr = str(port_info.get("PrinterHostAddress", "") or "")
        port_monitor = str(port_info.get("PortMonitor", "") or "")
        # Read printer IP directly from PrinterHostAddress.
        ip = _normalize_ipv4(host_addr)

        connection_type = "unknown"
        upper_port = port_name.upper()
        if "USB" in upper_port or "DOT4" in upper_port:
            connection_type = "usb"
        elif ip:
            connection_type = "ip"
        elif "WSD" in upper_port:
            connection_type = "wsd"

        status = "offline" if work_offline else "online"
        if status_raw and status_raw.lower() in {"error", "degraded", "stopped"}:
            status = "offline"

        devices.append(
            {
                "id": 0,
                "name": name or "Local Printer",
                "ip": ip,
                "mac_id": _extract_port_link_id(port_name),
                "type": "windows-local",
                "status": status,
                "user": "",
                "port_name": port_name,
                "port_monitor": port_monitor,
                "connection_type": connection_type,
                "source": "local",
                "printer_status_raw": status_raw,
            }
        )
    return devices


def _should_ignore_device(name: str, ignored_prefixes: list[str]) -> bool:
    lowered = str(name or "").strip().lower()
    if not lowered:
        return False
    for prefix in ignored_prefixes:
        pref = str(prefix or "").strip().lower()
        if pref and lowered.startswith(pref):
            return True
    return False



def _load_vps_db_printers() -> list[dict[str, Any]]:
    ssh_key = r"C:\Users\Kythuat-02\.ssh\id_ed25519_20260422_155451"
    vps_host = "31.97.76.62"

    python_vps_code = """
import psycopg2
import os
from pathlib import Path
from dotenv import load_dotenv
import json

env_path = Path("/opt/printagent/.env")
if env_path.exists():
    load_dotenv(env_path)
db_url = os.getenv("DATABASE_URL", "postgresql://postgres:myPass@localhost:5432/GoPrinx")
if db_url.startswith("postgresql+psycopg2://"):
    db_url = db_url.replace("postgresql+psycopg2://", "postgresql://")

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute('SELECT id, printer_name, ip, mac_address, agent_uid, lan_uid, is_online, updated_at FROM "Printer" ORDER BY printer_name ASC')
    rows = cursor.fetchall()
    print(json.dumps({"ok": True, "rows": rows}, default=str))
    conn.close()
except Exception as e:
    print(json.dumps({"ok": False, "error": str(e)}))
"""

    devices = []
    try:
        import paramiko
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(vps_host, username='root', key_filename=ssh_key, timeout=10)
        
        sftp = ssh.open_sftp()
        remote_path = "/tmp/list_printers_web_discovery.py"
        with sftp.file(remote_path, "w") as f:
            f.write(python_vps_code)
        sftp.close()
        
        stdin, stdout, stderr = ssh.exec_command(f"/opt/printagent/venv/bin/python3 {remote_path}")
        output_str = stdout.read().decode('utf-8', errors='replace').strip()
        
        ssh.exec_command(f"rm -f {remote_path}")
        ssh.close()
        
        if output_str:
            db_data = json.loads(output_str)
            if db_data.get("ok"):
                for r in db_data.get("rows", []):
                    pid, name, ip_addr, mac, agent_uid, lan_uid, online, updated = r
                    devices.append({
                        "id": pid,
                        "name": name or "VPS Copier",
                        "ip": ip_addr,
                        "mac_id": mac or "",
                        "type": "ricoh",
                        "status": "online" if online else "offline",
                        "user": "",
                        "port_name": "",
                        "port_monitor": "",
                        "connection_type": "ip",
                        "source": "api",
                    })
    except Exception as exc:
        LOGGER.warning("Failed to load printers from VPS DB: %s", exc)
    return devices


def _scan_devices_payload(
    config: AppConfig,
    api_client: APIClient,
    ricoh_service: RicohService,
    ignored_prefixes: list[str],
    filter_mode: str = "all",
    force_refresh: bool = False,
) -> list[dict[str, Any]]:
    payload: list[dict[str, Any]] = []
    try:
        scanner = SubnetScanner(max_workers=100)
        results = scanner.scan_subnet()
        for r in results:
            payload.append({
                "id": 0,
                "name": "Discovered Device",
                "ip": r["ip"],
                "mac_id": "",
                "type": "printer" if r["is_printer"] else "unknown",
                "status": "online",
                "user": "",
                "port_name": "",
                "port_monitor": "",
                "connection_type": "ip",
                "source": "network",
            })
    except Exception as exc:
        LOGGER.warning("Quick subnet scan failed: %s", exc)

    # Re-integrate list_all_copiers.py VPS database registered printers
    vps_devices = _load_vps_db_printers()
    payload.extend(vps_devices)

    return payload