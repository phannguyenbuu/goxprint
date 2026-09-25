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



def register_agent_settings_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:

    @app.get("/api/agents/<agent_uid>/settings")
    def get_agent_settings(agent_uid: str) -> Any:
        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead({}, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error
        
        with session_factory() as session:
            agent = session.execute(
                select(AgentNode).where(
                    AgentNode.lead == lead_valid,
                    AgentNode.agent_uid == agent_uid
                ).order_by(AgentNode.updated_at.desc())
            ).scalars().first()
            
            if agent is None:
                return jsonify({"ok": False, "error": "Agent not found"}), 404
            
            return jsonify({
                "ok": True,
                "scan_auto_open_file": bool(agent.scan_auto_open_file),
                "scan_auto_open_dir": bool(agent.scan_auto_open_dir),
            })

    @app.post("/api/agents/<agent_uid>/settings")
    def update_agent_settings(agent_uid: str) -> Any:
        body = request.get_json(silent=True) or {}
        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead(body, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error
        
        scan_auto_open_file = body.get("scan_auto_open_file")
        scan_auto_open_dir = body.get("scan_auto_open_dir")
        
        if scan_auto_open_file is None or scan_auto_open_dir is None:
            return jsonify({"ok": False, "error": "Missing scan_auto_open_file or scan_auto_open_dir"}), 400
        
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
            
            # Cancel existing pending general_settings commands for this agent
            pending = session.execute(
                select(PrinterControlCommand).where(
                    PrinterControlCommand.lead == lead_valid,
                    PrinterControlCommand.agent_uid == agent_uid,
                    PrinterControlCommand.printer_id == 0,
                    PrinterControlCommand.command_type == "general_settings",
                    PrinterControlCommand.status == "pending",
                )
            ).scalars().all()
            for cmd in pending:
                cmd.status = "failed"
                cmd.error_message = "Superseded by newer settings command"
                cmd.responded_at = requested_at
            
            import json as _json
            params_str = _json.dumps({
                "scan_auto_open_file": bool(scan_auto_open_file),
                "scan_auto_open_dir": bool(scan_auto_open_dir),
            })
            
            command = PrinterControlCommand(
                printer_id=0,
                lead=lead_valid,
                lan_uid=agent.lan_uid,
                agent_uid=agent_uid,
                printer_name="AgentNode",
                ip="0.0.0.0",
                desired_enabled=True,
                command_type="general_settings",
                command_params=params_str,
                status="pending",
                requested_at=requested_at,
            )
            session.add(command)
            session.commit()
            command_id = int(command.id)
            
        return jsonify({
            "ok": True,
            "message": "Settings command queued",
            "command_id": command_id,
        })

    @app.post("/api/agents/bulk-set-interval")
    def bulk_set_device_interval() -> Any:
        """Patch nhiều field vào settings.json của tất cả agent online.
        Dùng trigger_utility exec_utility — không cần rebuild agent."""
        body = request.get_json(silent=True) or {}
        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead(body, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error

        # Đọc và validate các field
        ftp_port = body.get("ftp_port")
        ftp_user = body.get("ftp_user")
        ftp_pass = body.get("ftp_pass")
        device_interval = body.get("device_interval_seconds")
        control_interval = body.get("control_interval_seconds")
        driver_preference = body.get("driver_preference")
        show_tray_icon = body.get("show_tray_icon")
        scan_auto_open_file = body.get("scan_auto_open_file")
        scan_auto_open_dir = body.get("scan_auto_open_dir")

        if device_interval is not None:
            try:
                device_interval = int(device_interval)
                if device_interval < 5 or device_interval > 3600:
                    return jsonify({"ok": False, "error": "device_interval_seconds phải từ 5 đến 3600 giây"}), 400
            except (ValueError, TypeError):
                return jsonify({"ok": False, "error": "device_interval_seconds phải là số nguyên"}), 400

        if control_interval is not None:
            try:
                control_interval = int(control_interval)
                if control_interval < 1 or control_interval > 60:
                    return jsonify({"ok": False, "error": "control_interval_seconds phải từ 1 đến 60 giây"}), 400
            except (ValueError, TypeError):
                return jsonify({"ok": False, "error": "control_interval_seconds phải là số nguyên"}), 400

        if ftp_port is not None:
            try:
                ftp_port = int(ftp_port)
                if ftp_port < 1 or ftp_port > 65535:
                    return jsonify({"ok": False, "error": "ftp_port phải từ 1 đến 65535"}), 400
            except (ValueError, TypeError):
                return jsonify({"ok": False, "error": "ftp_port phải là số nguyên"}), 400

        # Build patch lines cho script Python
        patch_lines = []
        if ftp_port is not None:
            patch_lines.append(f"cfg['ftp_port'] = {ftp_port}")
        if ftp_user is not None:
            patch_lines.append(f"cfg['ftp_user'] = {repr(str(ftp_user))}")
        if ftp_pass is not None:
            patch_lines.append(f"cfg['ftp_pass'] = {repr(str(ftp_pass))}")
        if show_tray_icon is not None:
            patch_lines.append(f"cfg['show_tray_icon'] = {repr(bool(show_tray_icon))}")

        polling_lines = []
        if device_interval is not None:
            polling_lines.append(f"cfg['polling']['device_interval_seconds'] = {repr(str(device_interval))}")
        if control_interval is not None:
            polling_lines.append(f"cfg['polling']['control_interval_seconds'] = {repr(str(control_interval))}")
        if driver_preference is not None:
            polling_lines.append(f"cfg['polling']['driver_preference'] = {repr(str(driver_preference))}")
        if scan_auto_open_file is not None:
            polling_lines.append(f"cfg['polling']['scan_auto_open_file'] = {repr(bool(scan_auto_open_file))}")
        if scan_auto_open_dir is not None:
            polling_lines.append(f"cfg['polling']['scan_auto_open_dir'] = {repr(bool(scan_auto_open_dir))}")

        if not patch_lines and not polling_lines:
            return jsonify({"ok": False, "error": "Không có thông số nào được gửi"}), 400

        polling_init = ""
        if polling_lines:
            polling_init = "\nif 'polling' not in cfg or not isinstance(cfg.get('polling'), dict):\n    cfg['polling'] = {}"

        patch_body = "\n".join(patch_lines) or ""
        polling_body = "\n".join(polling_lines) or ""

        patch_script = f"""import os, json
appdata = os.getenv('APPDATA', '')
if not appdata:
    userprofile = os.getenv('USERPROFILE', '')
    if userprofile:
        appdata = os.path.join(userprofile, 'AppData', 'Roaming')
target = os.path.join(appdata, 'GoxPrintAgent', 'settings.json')
with open(target, 'r', encoding='utf-8') as f:
    cfg = json.load(f)
{patch_body}{polling_init}
{polling_body}
with open(target, 'w', encoding='utf-8') as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)
print(f"OK: settings.json da duoc cap nhat tai {{target}}")
"""

        import json as _json
        requested_at = datetime.now(timezone.utc)
        params_str = _json.dumps({
            "action": "exec_utility",
            "command": "bulk_save_settings",
            "command_content": patch_script,
            "is_auto": True,
        })

        queued_count = 0
        with session_factory() as session:
            stale_cutoff = requested_at - timedelta(seconds=ONLINE_STALE_SECONDS)
            online_agents = session.execute(
                select(AgentNode).where(
                    AgentNode.lead == lead_valid,
                    AgentNode.last_seen_at >= stale_cutoff,
                )
            ).scalars().all()

            for agent in online_agents:
                cmd = PrinterControlCommand(
                    printer_id=0,
                    lead=lead_valid,
                    lan_uid=agent.lan_uid or "default",
                    agent_uid=agent.agent_uid,
                    printer_name="AgentNode",
                    ip="0.0.0.0",
                    desired_enabled=True,
                    command_type="trigger_utility",
                    command_params=params_str,
                    status="pending",
                    requested_at=requested_at,
                )
                session.add(cmd)
                queued_count += 1

            session.commit()

        LOGGER.info(
            "[bulk-save-settings] Queued settings patch for %d online agents (lead=%s)",
            queued_count, lead_valid,
        )
        return jsonify({
            "ok": True,
            "message": f"Đã gửi lệnh cập nhật settings.json cho {queued_count} Agent đang online.",
            "queued_count": queued_count,
        })


