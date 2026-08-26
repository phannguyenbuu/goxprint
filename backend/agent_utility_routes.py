from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, render_template, request, send_from_directory
from sqlalchemy import select

from app_helpers import (
    ONLINE_STALE_SECONDS,
    _load_agent_release_manifest,
    _format_agents_datetime_ui,
    _serialize_audit_payload_agents,
    _request_api_token,
    _resolve_request_lead,
    _resolve_lan_uid_with_session,
    _is_agent_master_and_get_emails,
    _is_newer_version,
)
from utils import (
    _to_text,
    _to_int,
    _normalize_mac,
    _normalize_ipv4,
    _resolve_lan_uid_from_body,
)
from serializers import (
    _refresh_stale_agent_offline,
    _upsert_lan_and_agent,
)
from models import AgentNode, LanSite, Printer, AgentPresenceLog, PrinterControlCommand

LOGGER = logging.getLogger(__name__)



BUILTIN_UTILITY_COMMANDS: dict[str, str] = {
    "get_public_ip": """import urllib.request
try:
    ip = urllib.request.urlopen('https://api.ipify.org', timeout=5).read().decode('utf8')
    print(f"Public IP: {ip}")
except Exception as e:
    print(f"Error getting public IP: {e}")
""",
    "view_stout": """import os
path = os.path.expandvars(r"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\stout.txt")
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        print("".join(lines[-100:]))
else:
    print(f"[PATH] File not found: {path}")
""",
    "view_sterror": """import os
path = os.path.expandvars(r"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\sterror.txt")
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        print("".join(lines[-100:]))
else:
    print(f"[PATH] File not found: {path}")
""",
    "view_settings_json": """import os
path = os.path.expandvars(r"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\settings.json")
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        print(f.read())
else:
    print(f"[PATH] File not found: {path}")
""",
    "view_printers_json": """import os
path = os.path.expandvars(r"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\printers.json")
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        print(f.read())
else:
    print(f"[PATH] File not found: {path}")
""",
    "view_scan_points_json": """import os
path = os.path.expandvars(r"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\scan_points.json")
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        print(f.read())
else:
    print(f"[PATH] File not found: {path}")
""",
    "view_agent_loader_debug": """import os
path = os.path.expandvars(r"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\agent_loader_debug.txt")
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        print("".join(lines[-100:]))
else:
    print(f"[PATH] File not found: {path}")
""",
    "check_watchdog": """import os, subprocess
out = subprocess.getoutput("tasklist /FI \\"IMAGENAME eq printagent.exe\\"")
print(out)
""",
    "get_agent_ip": """import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
try:
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
except Exception:
    ip = "127.0.0.1"
finally:
    s.close()
print(f"Local IP: {ip}")
""",
    "open_web_setting": """import webbrowser
webbrowser.open("http://__TARGET_IP__")
""",
    "emergency_restart": """import os, sys
print("Triggering emergency exit/restart...")
os._exit(0)
""",
    "create_scan_shortcut": """import os, sys
try:
    import win32com.client
    desktop = os.path.join(os.environ['USERPROFILE'], 'Desktop')
    path = os.path.join(desktop, "Scan Files.lnk")
    target = os.path.expandvars(r"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\ftp")
    os.makedirs(target, exist_ok=True)
    shell = win32com.client.Dispatch("WScript.Shell")
    shortcut = shell.CreateShortCut(path)
    shortcut.TargetPath = target
    shortcut.save()
    print("Desktop shortcut created successfully.")
except Exception as e:
    print(f"Error creating shortcut: {e}")
""",
    "printers": """import subprocess
print(subprocess.getoutput("powershell -Command Get-Printer"))
""",
    "scan": """import os
path = os.path.expandvars(r"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\ftp")
if os.path.exists(path):
    print("Scan files in directory:")
    for f in os.listdir(path):
        print(f"  - {f}")
else:
    print(f"Directory not found: {path}")
""",
    "clean_temp": """import os, shutil
path = os.path.expandvars(r"%LOCALAPPDATA%\\Temp\\GoPrinxAgent\\temp")
if os.path.exists(path):
    shutil.rmtree(path, ignore_errors=True)
    print("Temp folder cleaned.")
else:
    print(f"Temp folder does not exist: {path}")
""",
    "dxdiag": """import subprocess, os
temp_path = os.path.expandvars(r"%TEMP%\\dxdiag_output.txt")
subprocess.run(f"dxdiag /t {temp_path}", shell=True, timeout=30)
if os.path.exists(temp_path):
    with open(temp_path, 'r', encoding='utf-8', errors='ignore') as f:
        print(f.read()[:5000])
else:
    print("Failed to run dxdiag.")
""",
}


def register_agent_utility_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:

    @app.get("/api/agents/<agent_uid>/utility-commands")
    def get_agent_utility_commands(agent_uid: str) -> Any:
        """Return the dynamic utility command list from Database."""
        from models import UtiCommand
        from sqlalchemy import select
        try:
            with session_factory() as session:
                cmds = session.execute(select(UtiCommand).order_by(UtiCommand.command.asc())).scalars().all()
                commands = []
                for c in cmds:
                    commands.append({
                        "command": c.command,
                        "label": c.label,
                        "icon": c.icon or "",
                        "description": c.description or "",
                        "category": c.category or "",
                        "output_modal": c.output_modal,
                        "command_content": c.command_content
                    })
        except Exception as exc:
            LOGGER.error("[utility-commands] Failed to query DB: %s", exc)
            return jsonify({"ok": False, "error": str(exc)}), 500
        
        resp = jsonify({"ok": True, "commands": commands})
        resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        resp.headers["Pragma"] = "no-cache"
        resp.headers["Expires"] = "0"
        return resp

    @app.post("/api/agents/<agent_uid>/utility/exec")
    def trigger_agent_utility_exec(agent_uid: str) -> Any:
        """Queue a dynamic utility command to the agent for exec() execution."""
        body = request.get_json(silent=True) or {}
        command = _to_text(body.get("command", "exec"))
        command_content = _to_text(body.get("command_content", ""))

        target_ip = _to_text(body.get("printer_ip") or body.get("ip") or body.get("target_ip") or "")
        target_user = _to_text(body.get("auth_user") or body.get("user") or body.get("target_user") or "")
        target_pass = _to_text(body.get("auth_password") or body.get("password") or body.get("target_pass") or "")
        target_id = _to_text(body.get("target_id") or body.get("entry_id") or body.get("id") or body.get("registration_no") or "")
        
        # ALWAYS prefer fresh content from Database if available
        from models import UtiCommand
        from sqlalchemy import select
        try:
            with session_factory() as session:
                cmd_entry = session.execute(
                    select(UtiCommand).where(UtiCommand.command == command)
                ).scalar_one_or_none()
                if cmd_entry and cmd_entry.command_content:
                    from utils import resolve_utility_command_content
                    command_content = resolve_utility_command_content(session, cmd_entry.command_content)
        except Exception as exc:
            LOGGER.warning("[utility/exec] Failed to load fresh UtiCommand: %s", exc)

        if not command_content and command in BUILTIN_UTILITY_COMMANDS:
            command_content = BUILTIN_UTILITY_COMMANDS[command]

        if not command_content and body.get("command_line"):
            cmd_line = str(body.get("command_line")).strip()
            command_content = f"""import subprocess\nprint(subprocess.getoutput(r'''{cmd_line}'''))"""

        if not command_content:
            command_content = f"""# Fallback execution for command: {command}
import sys
print(f"Executing utility command: {command}")
"""

        target_ip = str(body.get("printer_ip") or body.get("ip") or body.get("target_ip") or "").strip()
        target_user = str(body.get("auth_user") or body.get("user") or body.get("target_user") or "admin").strip()
        raw_pass = body.get("auth_password") if body.get("auth_password") is not None else body.get("password", body.get("target_pass", ""))
        target_pass = str(raw_pass or "").strip()
        target_id = str(body.get("target_id") or body.get("entry_id") or body.get("id") or body.get("registration_no") or "").strip()
        target_name = str(body.get("target_name") or body.get("name") or body.get("scan_username") or body.get("username") or body.get("user") or "").strip()
        old_ip = str(body.get("old_ip") or "").strip()
        new_ip = str(body.get("new_ip") or "").strip()
        is_auto = bool(body.get("is_auto", False))

        # Always replace placeholders unconditionally
        command_content = command_content.replace("__TARGET_IP__", target_ip).replace("__PRINTER_IP__", target_ip)
        command_content = command_content.replace("__TARGET_USER__", target_user).replace("__AUTH_USER__", target_user)
        command_content = command_content.replace("__TARGET_PASS__", target_pass).replace("__AUTH_PASS__", target_pass)
        command_content = command_content.replace("__TARGET_ID__", target_id).replace("__ENTRY_ID__", target_id).replace("__REGISTRATION_NO__", target_id)
        command_content = command_content.replace("__TARGET_SCAN_USER__", target_name).replace("__TARGET_NAME__", target_name).replace("__SCAN_USERNAME__", target_name)
        base64_content = str(body.get("base64_content") or body.get("base64") or body.get("content_base64") or "").strip()
        command_content = command_content.replace("__BASE64_CONTENT__", base64_content)
        command_content = command_content.replace("__OLD_IP__", old_ip).replace("__NEW_IP__", new_ip)

        if not command_content:
            return jsonify({"ok": False, "error": "Missing command_content"}), 400

        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead(body, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error

        requested_at = datetime.now(timezone.utc)
        with session_factory() as session:
            from active_agents_registry import ACTIVE_AGENTS
            agent_in_ram = ACTIVE_AGENTS.get(agent_uid)
            agent = session.execute(
                select(AgentNode).where(
                    AgentNode.lead == lead_valid,
                    AgentNode.agent_uid == agent_uid
                ).order_by(AgentNode.updated_at.desc())
            ).scalars().first()
            if agent is None:
                if agent_in_ram:
                    lan_u = agent_in_ram.get("lan_uid", "default")
                    agent = AgentNode(
                        lead=lead_valid,
                        lan_uid=lan_u,
                        agent_uid=agent_uid,
                        hostname=agent_in_ram.get("hostname", agent_uid),
                        is_master=True,
                        is_online=True
                    )
                else:
                    return jsonify({"ok": False, "error": "Agent not found"}), 404

            if command == "sync_all_scanpoints":
                from models import PrinterAuthCredential, UtiCommand
                try:
                    printers = session.execute(
                        select(PrinterAuthCredential).where(PrinterAuthCredential.lead == lead_valid)
                    ).scalars().all()
                    
                    commands_created = 0
                    now = datetime.now(timezone.utc)
                    printer_details = []
                    child_commands = []
                    
                    for idx, printer_db in enumerate(printers):
                        agent_node = session.execute(
                            select(AgentNode).where(
                                AgentNode.lead == lead_valid,
                                AgentNode.lan_uid == printer_db.lan_uid,
                                AgentNode.is_online == True
                            )
                        ).scalars().first()
                        
                        if not agent_node:
                            continue
                            
                        name_lower = (printer_db.printer_name or "").lower()
                        brand_name = "ricoh" if "ricoh" in name_lower else "toshiba" if "toshiba" in name_lower else "ricoh"
                        list_cmd_name = f"{brand_name}_list_scan"
                        
                        cmd_entry = session.execute(
                            select(UtiCommand).where(UtiCommand.command == list_cmd_name)
                        ).scalar_one_or_none()
                        
                        if cmd_entry and cmd_entry.command_content:
                            from utils import resolve_utility_command_content
                            raw_content = resolve_utility_command_content(session, cmd_entry.command_content)
                            
                            p_user = (printer_db.auth_user or "admin").strip()
                            p_pass = (printer_db.auth_password or "").strip()
                            
                            c_content = raw_content.replace("__TARGET_IP__", printer_db.ip).replace("__PRINTER_IP__", printer_db.ip)
                            c_content = c_content.replace("__TARGET_USER__", p_user).replace("__AUTH_USER__", p_user)
                            c_content = c_content.replace("__TARGET_PASS__", p_pass).replace("__AUTH_PASS__", p_pass)
                            
                            p_params = json.dumps({
                                "action": "exec_utility",
                                "command": list_cmd_name,
                                "command_content": c_content,
                                "printer_ip": printer_db.ip,
                                "ip": printer_db.ip,
                                "auth_user": p_user,
                                "auth_password": p_pass,
                                "target_id": "",
                                "entry_id": "",
                                "is_auto": False
                            })
                            
                            new_cmd = PrinterControlCommand(
                                printer_id=0,
                                lead=lead_valid,
                                lan_uid=printer_db.lan_uid,
                                agent_uid=agent_node.agent_uid,
                                printer_name=printer_db.printer_name,
                                ip=printer_db.ip,
                                desired_enabled=True,
                                command_type="trigger_utility",
                                command_params=p_params,
                                status="pending",
                                requested_at=now + timedelta(seconds=idx * 10)
                            )
                            session.add(new_cmd)
                            child_commands.append(new_cmd)
                            commands_created += 1
                            printer_details.append(f"- {printer_db.printer_name} ({printer_db.ip}) qua Agent '{agent_node.agent_uid}' (Lệnh #{commands_created})")
                    
                    if commands_created == 0:
                        msg = "Không tìm thấy máy photocopy hoặc Agent online nào để thực hiện quét đồng bộ danh bạ."
                        child_ids = []
                    else:
                        session.commit()  # Generate IDs for child commands
                        child_ids = [c.id for c in child_commands]
                        msg = f"🚀 Bắt đầu quét đồng bộ danh bạ toàn hệ thống thành công!\nĐã tạo {commands_created} lệnh quét tuần tự (giãn cách 10s):\n" + "\n".join(printer_details)
                        
                    params_str = json.dumps({
                        "action": "exec_utility",
                        "command": command,
                        "command_content": "",
                        "is_auto": False,
                        "child_command_ids": child_ids
                    })
                    
                    cmd = PrinterControlCommand(
                        printer_id=0,
                        lead=lead_valid,
                        lan_uid=agent.lan_uid,
                        agent_uid=agent_uid,
                        printer_name="AgentNode",
                        ip="0.0.0.0",
                        desired_enabled=True,
                        command_type="trigger_utility",
                        command_params=params_str,
                        status="pending" if child_ids else "success",
                        error_message=msg,
                        requested_at=requested_at,
                        responded_at=None if child_ids else datetime.now(timezone.utc),
                        received_at=None if child_ids else datetime.now(timezone.utc)
                    )
                    session.add(cmd)
                    session.commit()
                    return jsonify({
                        "ok": True,
                        "message": "Utility exec 'sync_all_scanpoints' enqueued successfully",
                        "command_id": int(cmd.id),
                    })
                except Exception as db_err:
                    LOGGER.error("[sync_all_scanpoints] DB query failed: %s", db_err)
                    return jsonify({"ok": False, "error": f"DB query failed: {db_err}"}), 500

            if command == "check_scan_ip_match":
                from models import ScanPoint, PrinterAuthCredential, UtiCommand
                try:
                    change_all_to = str(body.get("change_all_to") or "").strip()
                    commands_created = 0
                    child_commands = []
                    
                    scan_points = session.execute(select(ScanPoint)).scalars().all()
                    matching_copiers = []
                    for sp in scan_points:
                        abd = sp.address_book_data
                        if isinstance(abd, dict):
                            addr_list = abd.get("address_list") or []
                            match_entries = []
                            for entry in addr_list:
                                if not isinstance(entry, dict):
                                    continue
                                if entry.get("type") == "Summary":
                                    continue
                                
                                # Extract folder/FTP path
                                folder_val = entry.get("folder") or entry.get("server_host") or entry.get("server") or entry.get("physical_path") or entry.get("folder_path") or ""
                                if not folder_val or folder_val == "-":
                                    continue
                                    
                                # Normalize path to split correctly
                                val = str(folder_val).strip().replace("\\", "/")
                                if "://" in val:
                                    val = val.split("://", 1)[1]
                                val = val.lstrip("/")
                                val = val.split("/", 1)[0]
                                val = val.split(":", 1)[0]
                                host = val.strip()
                                
                                # Don't check Email destinations
                                proto = str(entry.get("protocol") or "").upper()
                                if proto == "EMAIL":
                                    continue
                                
                                # Check match
                                if host == target_ip:
                                    entry_name = entry.get("name") or entry.get("username") or "Folder Destination"
                                    reg_no = entry.get("registration_no") or entry.get("entry_id") or ""
                                    match_entries.append({
                                        "name": entry_name,
                                        "id": reg_no
                                    })
                            
                            if match_entries:
                                printer_name = sp.printer_name or "Photocopy"
                                entry_strs = [f"{e['name']} ({e['id']})" if e['id'] else e['name'] for e in match_entries]
                                matching_copiers.append(f"{printer_name} ({sp.ip}): {', '.join(entry_strs)}")
                                
                                if change_all_to:
                                    # Look up PrinterAuthCredential in DB by mac_address
                                    printer_db = session.execute(
                                        select(PrinterAuthCredential).where(PrinterAuthCredential.mac_address == sp.mac_id)
                                    ).scalars().first()
                                    if not printer_db:
                                        # Fallback to lookup by IP
                                        printer_db = session.execute(
                                            select(PrinterAuthCredential).where(PrinterAuthCredential.ip == sp.ip)
                                        ).scalars().first()
                                        
                                    if printer_db:
                                        name_lower = (printer_db.printer_name or "").lower()
                                        brand_name = "ricoh" if "ricoh" in name_lower else "toshiba" if "toshiba" in name_lower else "ricoh"
                                        cmd_name = f"{brand_name}_change_ftp"
                                        
                                        cmd_entry = session.execute(
                                            select(UtiCommand).where(UtiCommand.command == cmd_name)
                                        ).scalar_one_or_none()
                                        
                                        if cmd_entry and cmd_entry.command_content:
                                            from utils import resolve_utility_command_content
                                            raw_content = resolve_utility_command_content(session, cmd_entry.command_content)
                                            
                                            for e in match_entries:
                                                p_user = (printer_db.auth_user or "admin").strip()
                                                p_pass = (printer_db.auth_password or "").strip()
                                                p_id = str(e["id"]).strip()
                                                p_name = str(e["name"]).strip()
                                                
                                                c_content = raw_content.replace("__TARGET_IP__", printer_db.ip).replace("__PRINTER_IP__", printer_db.ip)
                                                c_content = c_content.replace("__TARGET_USER__", p_user).replace("__AUTH_USER__", p_user)
                                                c_content = c_content.replace("__TARGET_PASS__", p_pass).replace("__AUTH_PASS__", p_pass)
                                                c_content = c_content.replace("__TARGET_ID__", p_id).replace("__ENTRY_ID__", p_id).replace("__REGISTRATION_NO__", p_id)
                                                c_content = c_content.replace("__TARGET_SCAN_USER__", p_name).replace("__TARGET_NAME__", p_name).replace("__SCAN_USERNAME__", p_name)
                                                c_content = c_content.replace("__OLD_IP__", target_ip).replace("__NEW_IP__", change_all_to)
                                                
                                                p_params = json.dumps({
                                                    "action": "exec_utility",
                                                    "command": cmd_name,
                                                    "command_content": c_content,
                                                    "printer_ip": printer_db.ip,
                                                    "ip": printer_db.ip,
                                                    "auth_user": p_user,
                                                    "auth_password": p_pass,
                                                    "target_id": p_id,
                                                    "entry_id": p_id,
                                                    "is_auto": False,
                                                    "old_ip": target_ip,
                                                    "new_ip": change_all_to
                                                })
                                                
                                                new_cmd = PrinterControlCommand(
                                                    printer_id=0,
                                                    lead=lead_valid,
                                                    lan_uid=agent.lan_uid,
                                                    agent_uid=agent_uid,
                                                    printer_name=printer_db.printer_name,
                                                    ip=printer_db.ip,
                                                    desired_enabled=True,
                                                    command_type="trigger_utility",
                                                    command_params=p_params,
                                                    status="pending",
                                                    requested_at=datetime.now(timezone.utc)
                                                )
                                                session.add(new_cmd)
                                                child_commands.append(new_cmd)
                                                commands_created += 1
                                                
                                        # Now, enqueue the corresponding *_list_scan command to update the address book ScanPoints!
                                        list_cmd_name = f"{brand_name}_list_scan"
                                        list_cmd_entry = session.execute(
                                            select(UtiCommand).where(UtiCommand.command == list_cmd_name)
                                        ).scalar_one_or_none()
                                        
                                        if list_cmd_entry and list_cmd_entry.command_content:
                                            from utils import resolve_utility_command_content
                                            raw_list_content = resolve_utility_command_content(session, list_cmd_entry.command_content)
                                            
                                            p_user = (printer_db.auth_user or "admin").strip()
                                            p_pass = (printer_db.auth_password or "").strip()
                                            
                                            l_content = raw_list_content.replace("__TARGET_IP__", printer_db.ip).replace("__PRINTER_IP__", printer_db.ip)
                                            l_content = l_content.replace("__TARGET_USER__", p_user).replace("__AUTH_USER__", p_user)
                                            l_content = l_content.replace("__TARGET_PASS__", p_pass).replace("__AUTH_PASS__", p_pass)
                                            
                                            l_params = json.dumps({
                                                "action": "exec_utility",
                                                "command": list_cmd_name,
                                                "command_content": l_content,
                                                "printer_ip": printer_db.ip,
                                                "ip": printer_db.ip,
                                                "auth_user": p_user,
                                                "auth_password": p_pass,
                                                "target_id": "",
                                                "entry_id": "",
                                                "is_auto": False
                                            })
                                            
                                            # Enqueue list_scan command to run 5 seconds after the change_ftp command
                                            list_cmd = PrinterControlCommand(
                                                printer_id=0,
                                                lead=lead_valid,
                                                lan_uid=agent.lan_uid,
                                                agent_uid=agent_uid,
                                                printer_name=printer_db.printer_name,
                                                ip=printer_db.ip,
                                                desired_enabled=True,
                                                command_type="trigger_utility",
                                                command_params=l_params,
                                                status="pending",
                                                requested_at=datetime.now(timezone.utc) + timedelta(seconds=5)
                                            )
                                            session.add(list_cmd)
                                            child_commands.append(list_cmd)
                                            commands_created += 1
                    
                    if child_commands:
                        session.commit() # Commit to generate child command IDs
                        child_ids = [c.id for c in child_commands]
                    else:
                        child_ids = []

                    if not matching_copiers:
                        msg = f"Hoàn thành! Không có copier nào có scan entry khớp với IP {target_ip}."
                    else:
                        msg = f"Tìm thấy {len(matching_copiers)} copier khớp IP {target_ip}:\n" + "\n".join([f"- {item}" for item in matching_copiers])
                        if change_all_to:
                            msg += f"\n\n🚀 Đã tạo tự động các lệnh đổi IP và quét lại danh bạ ('*_list_scan') sang '{change_all_to}' cho các máy photocopy trên (Tổng cộng: {commands_created} lệnh)!"
                        
                    params_str = json.dumps({
                        "action": "exec_utility",
                        "command": command,
                        "command_content": command_content,
                        "printer_ip": target_ip,
                        "ip": target_ip,
                        "auth_user": target_user,
                        "auth_password": target_pass,
                        "target_id": target_id,
                        "entry_id": target_id,
                        "is_auto": is_auto,
                        "change_all_to": change_all_to,
                        "child_command_ids": child_ids
                    })
                    
                    cmd = PrinterControlCommand(
                        printer_id=0,
                        lead=lead_valid,
                        lan_uid=agent.lan_uid,
                        agent_uid=agent_uid,
                        printer_name="AgentNode",
                        ip="0.0.0.0",
                        desired_enabled=True,
                        command_type="trigger_utility",
                        command_params=params_str,
                        status="pending" if child_ids else "success",
                        error_message=msg,
                        requested_at=requested_at,
                        responded_at=None if child_ids else datetime.now(timezone.utc),
                        received_at=None if child_ids else datetime.now(timezone.utc)
                    )
                    session.add(cmd)
                    session.commit()
                    return jsonify({
                        "ok": True,
                        "message": "Utility exec 'check_scan_ip_match' completed via DB search",
                        "command_id": int(cmd.id),
                    })
                except Exception as db_err:
                    LOGGER.error("[check_scan_ip_match] DB query failed: %s", db_err)
                    return jsonify({"ok": False, "error": f"DB Query failed: {db_err}"}), 500

            # Default fallback for other utility commands
            params_str = json.dumps({
                "action": "exec_utility",
                "command": command,
                "command_content": command_content,
                "printer_ip": target_ip,
                "ip": target_ip,
                "auth_user": target_user,
                "auth_password": target_pass,
                "target_id": target_id,
                "entry_id": target_id,
                "is_auto": is_auto,
            })
            cmd = PrinterControlCommand(
                printer_id=0,
                lead=lead_valid,
                lan_uid=agent.lan_uid,
                agent_uid=agent_uid,
                printer_name="AgentNode",
                ip="0.0.0.0",
                desired_enabled=True,
                command_type="trigger_utility",
                command_params=params_str,
                status="pending",
                requested_at=requested_at,
            )
            session.add(cmd)
            session.commit()
            command_id = int(cmd.id)

        return jsonify({
            "ok": True,
            "message": f"Utility exec '{command}' queued",
            "command_id": command_id,
        })

    @app.get("/api/agents/<agent_uid>/commands/<int:command_id>")
    @app.get("/api/agents/<agent_uid>/commands/<int:command_id>/status")
    @app.get("/api/agents/<agent_uid>/utility/status/<int:command_id>")
    def get_agent_command_status_by_uid(agent_uid: str, command_id: int) -> Any:
        with session_factory() as session:
            command = session.get(PrinterControlCommand, command_id)
            if command is None:
                return jsonify({"ok": False, "error": "Command not found"}), 404
            
            status = command.status
            output_val = command.error_message or ""
            progress_text = ""
            
            if command.command_params:
                try:
                    params = json.loads(command.command_params)
                    child_ids = params.get("child_command_ids")
                    if child_ids and isinstance(child_ids, list) and status == "pending":
                        child_cmds = session.execute(
                            select(PrinterControlCommand).where(PrinterControlCommand.id.in_(child_ids))
                        ).scalars().all()
                        
                        total = len(child_ids)
                        done = sum(1 for c in child_cmds if c.status not in ("pending", "processing", "received"))
                        
                        if done < total:
                            # Still pending, build dynamic progress log message
                            progress_text = f"Đang xử lý ({done}/{total}) lệnh..."
                            details = []
                            for c in child_cmds:
                                status_desc = "Chờ xử lý" if c.status == "pending" else "Đang chạy" if c.status in ("processing", "received") else "Thành công" if c.status == "success" else f"Thất bại ({c.error_message or 'Lỗi'})"
                                details.append(f"- {c.printer_name or c.ip} ({c.ip}): {status_desc}")
                            output_val = (command.error_message or "") + "\n\n⌛ Tiến độ chi tiết:\n" + "\n".join(details)
                        else:
                            # All child commands are finished!
                            details = []
                            success_count = 0
                            failed_count = 0
                            
                            for c in child_cmds:
                                if c.status == "success":
                                    status_label = "Thành công"
                                    success_count += 1
                                else:
                                    status_label = f"Thất bại ({c.error_message or 'Lỗi'})"
                                    failed_count += 1
                                details.append(f"- {c.printer_name or c.ip} ({c.ip}): {status_label}")
                            
                            if failed_count == 0:
                                status = "success"
                                msg_prefix = "✅ Đã hoàn tất tất cả các lệnh! Chi tiết:"
                            elif success_count == 0:
                                status = "failed"
                                msg_prefix = "❌ Thất bại tất cả các lệnh! Chi tiết:"
                            else:
                                status = "partial_success"
                                msg_prefix = "⚠️ Hoàn thành một phần! Chi tiết:"
                            
                            output_val = (command.error_message or "") + f"\n\n{msg_prefix}\n" + "\n".join(details)
                            command.status = status
                            command.error_message = output_val
                            command.responded_at = datetime.now(timezone.utc)
                            session.commit()
                except Exception as parse_err:
                    LOGGER.warning("Failed to check child command status for parent command %s: %s", command_id, parse_err)
            
            return jsonify({
                "ok": True,
                "id": command_id,
                "agent_uid": agent_uid,
                "status": status,
                "command_type": command.command_type,
                "error": output_val,
                "error_message": output_val,
                "result": output_val,
                "output": output_val,
                "result_payload": output_val,
                "data": output_val,
                "message": output_val,
                "received_at": command.received_at.isoformat() if command.received_at else None,
                "responded_at": command.responded_at.isoformat() if command.responded_at else None,
                "progress_text": progress_text if status == "pending" else "",
            })

    @app.post("/api/agents/<agent_uid>/utility/<action>")
    def trigger_agent_utility(agent_uid: str, action: str) -> Any:
        valid_actions = {"devices_and_printers", "open_scan_folder", "dxdiag", "change_ip", "exec", "run_command", "scan_cameras"}
        if action not in valid_actions:
            return jsonify({"ok": False, "error": f"Invalid utility action: {action}"}), 400
            
        body = request.get_json(silent=True) or {}
        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead(body, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error
            
        requested_at = datetime.now(timezone.utc)
        from active_agents_registry import ACTIVE_AGENTS
        agent_mem = ACTIVE_AGENTS.get(agent_uid)
        lan_uid_val = agent_mem.get("lan_uid", "default") if agent_mem else "default"

        import json as _json
        params = {
            "action": action,
        }
        if body and isinstance(body, dict):
            for k, v in body.items():
                if k != "action":
                    params[k] = v

        if action == "change_ip":
            params["adapter_name"] = str(params.get("adapter_name") or "Ethernet").strip()
            params["mode"] = str(params.get("mode") or "dhcp").strip().lower()
            if params["mode"] == "static":
                params["ip_address"] = str(params.get("ip_address") or "").strip()
                params["subnet_mask"] = str(params.get("subnet_mask") or "255.255.255.0").strip()
                params["gateway"] = str(params.get("gateway") or "").strip()
                params["dns"] = str(params.get("dns") or "").strip()

        params_str = _json.dumps(params)
        
        with session_factory() as session:
            command = PrinterControlCommand(
                printer_id=0,
                lead=lead_valid,
                lan_uid=lan_uid_val,
                agent_uid=agent_uid,
                printer_name="AgentNode",
                ip="0.0.0.0",
                desired_enabled=True,
                command_type="trigger_utility",
                command_params=params_str,
                status="pending",
                requested_at=requested_at,
            )
            session.add(command)
            session.commit()
            command_id = int(command.id)
            
        return jsonify({
            "ok": True,
            "message": f"Utility action '{action}' queued",
            "command_id": command_id,
            "params": params,
        })


    @app.post("/api/agents/<agent_uid>/emergency-restart")
    def trigger_emergency_restart(agent_uid: str) -> Any:
        body = request.get_json(silent=True) or {}
        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead(body, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error
            
        requested_at = datetime.now(timezone.utc)
        with session_factory() as session:
            agent = session.execute(
                select(AgentNode).where(
                    AgentNode.lead == lead_valid,
                    AgentNode.agent_uid == agent_uid
                ).order_by(AgentNode.updated_at.desc())
            ).scalars().first()
            if agent is None:
                return jsonify({"ok": False, "error": "Agent not found"}), 404
            
            # Create a command of type 'emergency_restart'
            import json as _json
            params_str = _json.dumps({"action": "emergency_restart"})
            
            command = PrinterControlCommand(
                printer_id=0,
                lead=lead_valid,
                lan_uid=agent.lan_uid,
                agent_uid=agent_uid,
                printer_name="AgentNode",
                ip="0.0.0.0",
                desired_enabled=True,
                command_type="emergency_restart",
                command_params=params_str,
                status="pending",
                requested_at=requested_at,
            )
            session.add(command)
            session.commit()
            command_id = int(command.id)
            
        return jsonify({
            "ok": True,
            "message": "Emergency restart queued",
            "command_id": command_id,
        })
