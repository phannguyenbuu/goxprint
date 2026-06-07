from __future__ import annotations

import logging
from typing import Any

from agent.config import AppConfig
from agent.modules.ricoh.service import RicohService
from agent.services.api_client import APIClient, Printer
from agent.services.runtime import default_ftp_root
from agent.services.scan_drop import build_drop_folder_metadata
from agent.web_collect import _resolve_printer
from agent.web_discovery import _load_printers, _normalize_ipv4
from agent.web_scan_support import _register_scan_root, _sanitize_ftp_name

LOGGER = logging.getLogger(__name__)


def resolve_target_printer(
    config: AppConfig,
    api_client: APIClient,
    *,
    ip: str,
    user: str = "",
    password: str = "",
) -> Printer:
    devices = _load_printers(api_client)
    target = _resolve_printer(ip, devices)
    if not target:
        try:
            LOGGER.info("[ResolvePrinter] Target %s not in cache, fetching directly from VPS...", ip)
            vps_devices = api_client.get_printers()
            target = _resolve_printer(ip, vps_devices)
        except Exception as exc:
            LOGGER.warning("[ResolvePrinter] Direct VPS query failed: %s", exc)

    if not target:
        target = Printer(
            name="Local Printer",
            ip=ip,
            user=config.get_string("test.user"),
            password=config.get_string("test.password"),
            printer_type="ricoh",
            status="unknown",
        )
    if str(user or "").strip():
        target.user = str(user).strip()
    if str(password or "").strip():
        target.password = str(password).strip()
    if not str(target.user or "").strip():
        target.user = config.get_string("test.user")
    if target.password is None or str(target.password).strip() == "":
        target.password = config.get_string("test.password")
    return target


def create_local_ftp_for_address(
    config: AppConfig,
    ricoh_service: RicohService,
    address_name: str,
    *,
    printer_ip: str = "",
) -> dict[str, Any]:
    ftp_host_info = ricoh_service.resolve_ftp_host_ip(printer_ip)
    local_ip = _normalize_ipv4(str(ftp_host_info.get("ip", "") or "")) or "127.0.0.1"
    
    ftp_name = "goxprint"
    from agent.services.runtime import user_temp_root
    ftp_root = user_temp_root() / "ftp"
    ftp_root.mkdir(parents=True, exist_ok=True)
    
    from agent.services.ftp_store import load_config, find_site_by_port, normalize_site_name
    import socket
    
    config_data = load_config()
    config_port = None
    val = config.get_string("ftp_port")
    if val and val.isdigit():
        config_port = int(val)
            
    if config_port is not None:
        actual_port = config_port
    else:
        actual_port = 2130
        while True:
            existing_by_port = find_site_by_port(config_data, actual_port)
            is_assigned_elsewhere = False
            if existing_by_port:
                if normalize_site_name(str(existing_by_port.get("name", "") or "")) != normalize_site_name(ftp_name):
                    is_assigned_elsewhere = True
            
            is_physically_bound = False
            if not is_assigned_elsewhere:
                try:
                    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                        s.bind(('0.0.0.0', actual_port))
                except Exception:
                    is_physically_bound = True
            
            if not is_assigned_elsewhere and not is_physically_bound:
                break
            actual_port += 1
            
        try:
            config.set_value("ftp_port", actual_port)
        except Exception:
            pass

    ftp_user = config.get_string("ftp_user", "goxprint")
    ftp_pass = config.get_string("ftp_pass", "goxprint")

    result = ricoh_service.share_manager.create_ftp_site(
        site_name=ftp_name, 
        local_path=ftp_root, 
        port=actual_port,
        ftp_user=ftp_user,
        ftp_password=ftp_pass
    )
    ftp_ok = bool(result.get("ok"))
    ftp_port = int(result.get("port") or actual_port)
    ftp_url = f"ftp://{local_ip}:{ftp_port}/"
    
    email_clean = str(address_name or "").strip()
    scan_sync: dict[str, Any] = {}
    if ftp_ok:
        if email_clean:
            user_folder = ftp_root / email_clean
            user_folder.mkdir(parents=True, exist_ok=True)
            ftp_user_url = f"ftp://{local_ip}:{ftp_port}/{email_clean}/"
            drop_folder = build_drop_folder_metadata(user_folder, base_url=ftp_user_url)
            scan_sync = _register_scan_root(config, user_folder)
        else:
            drop_folder = build_drop_folder_metadata(ftp_root, base_url=ftp_url)
            scan_sync = _register_scan_root(config, ftp_root)
    else:
        drop_folder = build_drop_folder_metadata(ftp_root, base_url=ftp_url)
    return {
        "ok": ftp_ok,
        "ftp_name": ftp_name,
        "ftp_root": str(ftp_root),
        "ftp_url": ftp_url,
        "upload_url": str(drop_folder.get("upload_url", "") or ftp_url),
        "upload_path": str(drop_folder.get("drop_folder_path", "") or ""),
        "drop_folder_name": str(drop_folder.get("drop_folder_name", "") or ""),
        "drop_relative_path": str(drop_folder.get("drop_relative_path", "") or ""),
        "local_ip": local_ip,
        "ftp_host_ip": local_ip,
        "ftp_ip_candidates": list(ftp_host_info.get("candidates", []) or []),
        "ftp_ip_strategy": str(ftp_host_info.get("strategy", "") or ""),
        "warning": str(ftp_host_info.get("warning", "") or "").strip(),
        "result": result,
        **scan_sync,
    }
