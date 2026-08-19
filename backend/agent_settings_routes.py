from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
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
