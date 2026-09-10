from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from flask import Flask, jsonify, request
from sqlalchemy import select, or_, and_

from utils import _to_text
from app_helpers import _serialize_audit_payload_iso
from serializers import (
    _refresh_stale_offline,
)
from models import Printer, PrinterEnableLog, PrinterOnlineLog, PrinterControlCommand
from device_core_routes import _resolve_printer_control_target

import json

LOGGER = logging.getLogger(__name__)

TOSHIBA_DRIVER_INSTALL_SCRIPT_TEMPLATE = r'''import os
import sys
import time
import zipfile
import tempfile
import shutil
import subprocess
import urllib.request
from pathlib import Path

PRINTER_IP = "__PRINTER_IP__"
MODEL = "__MODEL__"
DRIVER_URL = "__DRIVER_URL__"

def log(msg):
    print(f"[*] {msg}", flush=True)

log(f"Bắt đầu cài đặt driver Toshiba cho {PRINTER_IP} (Model: {MODEL})...")

# 1. Clean up print queue / Spooler jobs for this printer if exists
try:
    log("1/6. Dọn dẹp hàng đợi in và giải phóng khóa file DLL...")
    ps_clean = f"""
    $printers = Get-Printer -ErrorAction SilentlyContinue | Where-Object {{ $_.Name -like "*TOSHIBA*" -or $_.PortName -eq "IP_{PRINTER_IP}" }}
    foreach ($p in $printers) {{
        Get-PrintJob -PrinterName $p.Name -ErrorAction SilentlyContinue | Remove-PrintJob -ErrorAction SilentlyContinue
    }}
    """
    subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_clean],
                   capture_output=True, text=True, timeout=15)
except Exception as e:
    log(f"    Cảnh báo dọn dẹp hàng đợi: {e}")

temp_dir = Path(tempfile.mkdtemp(prefix="toshiba_install_"))
try:
    log("2/6. Đang tải gói driver Toshiba CSW2202CUPD01...")
    download_url = DRIVER_URL if (DRIVER_URL and "http" in DRIVER_URL) else "https://business.toshiba.com/downloads/KB/f1Ulds/20898/CSW2202CUPD01.zip"
    zip_path = temp_dir / "CSW2202CUPD01.zip"
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    req = urllib.request.Request(download_url, headers=headers)
    with urllib.request.urlopen(req, timeout=180) as resp, open(zip_path, "wb") as out_f:
        while True:
            chunk = resp.read(65536)
            if not chunk:
                break
            out_f.write(chunk)
            
    file_size_mb = zip_path.stat().st_size / (1024 * 1024)
    log(f"    Đã tải xong: {file_size_mb:.1f} MB")
    
    # 3. Extract main zip + all nested zips
    log("3/6. Đang giải nén gói driver và toàn bộ file thành phần (nested zip)...")
    extract_dir = temp_dir / "extracted"
    extract_dir.mkdir(exist_ok=True)
    with zipfile.ZipFile(zip_path, "r") as z:
        z.extractall(extract_dir)
        
    nested_zips = list(extract_dir.glob("**/*.zip"))
    log(f"    Tìm thấy {len(nested_zips)} file zip con, đang giải nén để lộ file DLL...")
    for nz_path in nested_zips:
        try:
            with zipfile.ZipFile(nz_path, "r") as nz:
                nz.extractall(nz_path.parent)
        except Exception as nz_err:
            log(f"    Lỗi giải nén {nz_path.name}: {nz_err}")
            
    # Find eSf6u.inf (x64)
    inf_candidates = list(extract_dir.glob("**/eSf6u.inf"))
    if not inf_candidates:
        inf_candidates = list(extract_dir.glob("**/*.inf"))
    
    inf_path = None
    for inf in inf_candidates:
        if "64" in str(inf.parent).lower() or "x64" in str(inf.parent).lower():
            inf_path = inf
            break
    if not inf_path and inf_candidates:
        inf_path = inf_candidates[0]
        
    if not inf_path or not inf_path.exists():
        raise RuntimeError("Không tìm thấy file eSf6u.inf trong gói driver giải nén!")
        
    log(f"    File INF đã chọn: {inf_path}")

    # 4. pnputil /add-driver with /force
    log("4/6. Nạp driver cưỡng bức vào Windows Driver Store (pnputil /force)...")
    pnp_cmd = ["pnputil", "/add-driver", str(inf_path), "/install", "/force"]
    pnp_res = subprocess.run(pnp_cmd, capture_output=True, text=True, timeout=120)
    log(f"    pnputil exit {pnp_res.returncode}: {pnp_res.stdout.strip()[:150]}")
    
    # Fallback to GoxDriverService (SYSTEM) if pnputil returned non-zero
    if pnp_res.returncode != 0:
        log("    pnputil cần quyền SYSTEM, gọi GoxDriverService qua Named Pipe...")
        try:
            import ctypes, json as _json
            kernel32 = ctypes.windll.kernel32
            pipe_handle = kernel32.CreateFileW(r"\\.\pipe\GoxDriverService", 0xC0000000, 0, None, 3, 0, None)
            if pipe_handle not in (-1, 0, 0xFFFFFFFFFFFFFFFF):
                gds_req = {
                    "action": "install_driver",
                    "inf_files": [str(inf_path)],
                    "printer_ip": PRINTER_IP,
                    "model": MODEL,
                    "driver_name": "TOSHIBA Universal Printer 2"
                }
                payload = _json.dumps(gds_req).encode("utf-8")
                bw = ctypes.c_ulong(0)
                kernel32.WriteFile(pipe_handle, payload, len(payload), ctypes.byref(bw), None)
                buf = ctypes.create_string_buffer(65536)
                br = ctypes.c_ulong(0)
                kernel32.ReadFile(pipe_handle, buf, 65536, ctypes.byref(br), None)
                kernel32.CloseHandle(pipe_handle)
                log("    GoxDriverService đã nạp INF thành công.")
        except Exception as gds_err:
            log(f"    GoxDriverService notice: {gds_err}")

    # 5. Register Driver in Spooler
    log("5/6. Đăng ký driver 'TOSHIBA Universal Printer 2' vào Windows Spooler...")
    reg_driver_cmd = [
        "powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command",
        'Add-PrinterDriver -Name "TOSHIBA Universal Printer 2" -ErrorAction SilentlyContinue'
    ]
    subprocess.run(reg_driver_cmd, capture_output=True, text=True, timeout=30)
    
    # 6. Setup Port & Printer Queue (Force Overwrite)
    log(f"6/6. Cấu hình Port IP_{PRINTER_IP} và tạo/cập nhật hàng đợi máy in...")
    printer_name = f"TOSHIBA {MODEL} ({PRINTER_IP})" if MODEL else f"TOSHIBA Universal Printer ({PRINTER_IP})"
    port_name = f"IP_{PRINTER_IP}"
    
    ps_setup = f"""
    $ErrorActionPreference = 'Stop'
    $portName = '{port_name}'
    $ip = '{PRINTER_IP}'
    $pName = '{printer_name}'
    $dName = 'TOSHIBA Universal Printer 2'
    
    # Port
    try {{
        $port = Get-PrinterPort -Name $portName -ErrorAction SilentlyContinue
        if (-not $port) {{
            Add-PrinterPort -Name $portName -PrinterHostAddress $ip -ErrorAction Stop
        }}
    }} catch {{
        Write-Host "Port warning: $_"
    }}
    
    # Printer
    try {{
        $existing = Get-Printer -Name $pName -ErrorAction SilentlyContinue
        if ($existing) {{
            Set-Printer -Name $pName -DriverName $dName -PortName $portName -ErrorAction Stop
            Write-Output 'UPDATED'
        }} else {{
            Add-Printer -Name $pName -DriverName $dName -PortName $portName -ErrorAction Stop
            Write-Output 'ADDED'
        }}
    }} catch {{
        try {{
            Remove-Printer -Name $pName -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 1
            Add-Printer -Name $pName -DriverName $dName -PortName $portName -ErrorAction Stop
            Write-Output 'RE-ADDED'
        }} catch {{
            Write-Error $_
        }}
    }}
    """
    printer_res = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_setup],
        capture_output=True, text=True, timeout=45
    )
    log(f"    Kết quả máy in: {printer_res.stdout.strip()}")
    if printer_res.returncode != 0 or ("ADDED" not in printer_res.stdout and "UPDATED" not in printer_res.stdout and "RE-ADDED" not in printer_res.stdout):
        raise RuntimeError(f"Lỗi tạo máy in: {printer_res.stderr.strip() or printer_res.stdout.strip()}")
        
    success_msg = f"✓ Cài đặt & ghi đè Driver Toshiba ({printer_name}) thành công!"
    log(success_msg)
    if globals().get("context"):
        globals()["context"]["result_payload"] = success_msg
        
except Exception as e:
    err_msg = f"[-] Lỗi cài đặt driver Toshiba: {str(e)}"
    log(err_msg)
    if globals().get("context"):
        globals()["context"]["result_payload"] = err_msg
    raise
finally:
    try:
        shutil.rmtree(temp_dir, ignore_errors=True)
    except Exception:
        pass
'''


def register_device_detail_routes(app: Flask, session_factory: Any) -> None:

    @app.get("/api/devices/<int:printer_id>/events")
    def device_events(printer_id: int) -> Any:
        with session_factory() as session:
            printer = session.get(Printer, printer_id)
            if printer is None:
                return jsonify({"ok": False, "error": "Printer not found"}), 404
            _refresh_stale_offline(
                session=session,
                lead=printer.lead,
                lan_uid=printer.lan_uid,
                agent_uid=printer.agent_uid,
            )
            session.commit()
            printer = session.get(Printer, printer_id)
            logs = session.execute(
                select(PrinterEnableLog)
                .where(PrinterEnableLog.printer_id == printer_id)
                .order_by(PrinterEnableLog.changed_at.desc(), PrinterEnableLog.id.desc())
            ).scalars().all()
            online_logs = session.execute(
                select(PrinterOnlineLog)
                .where(PrinterOnlineLog.printer_id == printer_id)
                .order_by(PrinterOnlineLog.changed_at.desc(), PrinterOnlineLog.id.desc())
            ).scalars().all()
        events: list[dict[str, Any]] = []
        events.extend(
            {
                "id": f"enable-{int(e.id)}",
                "kind": "enable",
                "value": "Enabled" if bool(e.enabled) else "Disabled",
                "changed_at": e.changed_at.isoformat() if e.changed_at else "",
                **_serialize_audit_payload_iso(e.created_at, e.updated_at),
            }
            for e in logs
        )
        events.extend(
            {
                "id": f"online-{int(e.id)}",
                "kind": "online",
                "value": "Online" if bool(e.is_online) else "Offline",
                "changed_at": e.changed_at.isoformat() if e.changed_at else "",
                **_serialize_audit_payload_iso(e.created_at, e.updated_at),
            }
            for e in online_logs
        )
        events.sort(key=lambda x: str(x.get("changed_at", "")), reverse=True)
        return jsonify(
            {
                "printer": {
                    "id": int(printer.id),
                    "lead": printer.lead,
                    "lan_uid": printer.lan_uid,
                    "mac_id": printer.mac_address or "",
                    "agent_uid": printer.agent_uid,
                    "printer_name": printer.printer_name,
                    "ip": printer.ip,
                    "enabled": bool(printer.enabled),
                    "enabled_changed_at": printer.enabled_changed_at.isoformat() if printer.enabled_changed_at else "",
                    "is_online": bool(printer.is_online),
                    "online_changed_at": printer.online_changed_at.isoformat() if printer.online_changed_at else "",
                    "last_seen_at": printer.updated_at.isoformat() if printer.updated_at else "",
                    "auth_user": printer.auth_user or "",
                    "auth_password": printer.auth_password or "",
                    "address_book_sync": printer.address_book_sync,
                    **_serialize_audit_payload_iso(printer.created_at, printer.updated_at),
                },
                "events": events,
            }
        )

    @app.post("/api/devices/install-driver")
    def device_install_driver_general() -> Any:
        return _handle_device_install_driver(device_ref="")

    @app.post("/api/devices/<path:device_ref>/install-driver")
    def device_install_driver_by_ref(device_ref: str = "") -> Any:
        return _handle_device_install_driver(device_ref=device_ref)

    def _handle_device_install_driver(device_ref: str = "") -> Any:
        body = request.get_json(silent=True) or {}
        brand = str(body.get("brand", "")).strip()
        model = str(body.get("model", "")).strip()
        driver_name = str(body.get("driver_name", "")).strip()
        driver_url = str(body.get("driver_url", "")).strip()
        target_agent_uid = str(body.get("agent_uid", "")).strip()

        if not brand or not model or not driver_name or not driver_url:
            return jsonify({"ok": False, "error": "brand, model, driver_name, and driver_url are required"}), 200

        driver_url_combined = driver_url

        requested_at = datetime.now(timezone.utc)
        with session_factory() as session:
            printer = _resolve_printer_control_target(session, device_ref, body)
            if printer is None:
                return jsonify({"ok": False, "error": f"Printer not found for reference '{device_ref}'"}), 200

            pending = session.execute(
                select(PrinterControlCommand).where(
                    or_(
                        and_(printer.id != 0, PrinterControlCommand.printer_id == printer.id),
                        and_(printer.id == 0, PrinterControlCommand.printer_id == 0, PrinterControlCommand.ip == printer.ip)
                    ),
                    PrinterControlCommand.status == "pending",
                    PrinterControlCommand.command_type == "install_driver",
                )
            ).scalars().all()
            for cmd in pending:
                cmd.status = "superseded"
                cmd.error_message = "Máy photo đang bận xử lý một lệnh khác. Vui lòng thử lại sau."
                cmd.responded_at = requested_at

            from models import AgentNode
            resolved_agent_uid = target_agent_uid or printer.agent_uid
            active_agent = None
            if resolved_agent_uid:
                active_agent = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == resolved_agent_uid)
                    .order_by(AgentNode.last_seen_at.desc())
                ).scalars().first()
            active_lan_uid = active_agent.lan_uid if active_agent else printer.lan_uid

            printer_ip_val = str(body.get("printer_ip") or body.get("ip") or "").strip() or printer.ip

            if brand.lower() == "toshiba":
                script = TOSHIBA_DRIVER_INSTALL_SCRIPT_TEMPLATE.replace("__PRINTER_IP__", printer_ip_val)
                script = script.replace("__MODEL__", model)
                script = script.replace("__DRIVER_URL__", driver_url_combined)

                command = PrinterControlCommand(
                    printer_id=printer.id,
                    lead=printer.lead,
                    lan_uid=active_lan_uid,
                    agent_uid=resolved_agent_uid,
                    printer_name=printer.printer_name,
                    ip=printer_ip_val,
                    desired_enabled=printer.enabled,
                    command_type="trigger_utility",
                    driver_brand=brand,
                    driver_model=model,
                    driver_name=driver_name,
                    driver_url=driver_url_combined,
                    auth_user=printer.auth_user,
                    auth_password=printer.auth_password,
                    command_params=json.dumps({
                        "action": "exec_utility",
                        "command": "toshiba_install_driver",
                        "command_content": script,
                        "printer_ip": printer_ip_val,
                        "model": model,
                    }),
                    status="pending",
                    error_message="",
                    requested_at=requested_at,
                    responded_at=None,
                )
                session.add(command)
                session.commit()
                command_id = int(command.id)

                return jsonify({
                    "ok": True,
                    "status": "pending",
                    "message": "Toshiba driver installation command queued (clean force overwrite).",
                    "command_id": command_id,
                }), 202

            command = PrinterControlCommand(
                printer_id=printer.id,
                lead=printer.lead,
                lan_uid=active_lan_uid,
                agent_uid=resolved_agent_uid,
                printer_name=printer.printer_name,
                ip=printer_ip_val,
                desired_enabled=printer.enabled,
                command_type="install_driver",
                driver_brand=brand,
                driver_model=model,
                driver_name=driver_name,
                driver_url=driver_url_combined,
                auth_user=printer.auth_user,
                auth_password=printer.auth_password,
                status="pending",
                error_message="",
                requested_at=requested_at,
                responded_at=None,
            )
            session.add(command)
            session.commit()
            command_id = int(command.id)

        return jsonify({
            "ok": True,
            "status": "pending",
            "message": "Driver installation command queued.",
            "command_id": command_id,
        }), 202

