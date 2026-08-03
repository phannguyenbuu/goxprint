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



def register_agent_utility_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:

    @app.get("/api/agents/<agent_uid>/utility-commands")
    def get_agent_utility_commands(agent_uid: str) -> Any:
        """Return the dynamic utility command list from JSON config."""
        commands_path = Path(os.path.dirname(__file__)) / "storage" / "utility_commands.json"
        if not commands_path.exists():
            return jsonify({"ok": True, "commands": []})
        try:
            commands = json.loads(commands_path.read_text(encoding="utf-8"))
        except Exception as exc:
            LOGGER.error("[utility-commands] Failed to load: %s", exc)
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
        
        # Override with fresh content from utility_commands.json if available
        commands_path = Path(os.path.dirname(__file__)) / "storage" / "utility_commands.json"
        if commands_path.exists():
            try:
                commands = json.loads(commands_path.read_text(encoding="utf-8"))
                for cmd_entry in commands:
                    if cmd_entry.get("command") == command:
                        fresh_content = cmd_entry.get("command_content")
                        if fresh_content:
                            if command in {"change_agent_ip", "check_scan_ip_match", "open_web_setting"}:
                                import re
                                match_ip = re.search(r"target_ip\s*=\s*['\"]([^'\"]+)['\"]", command_content)
                                if match_ip:
                                    target_ip = match_ip.group(1)
                                    fresh_content = fresh_content.replace("__TARGET_IP__", target_ip)
                                if command == "open_web_setting":
                                    match_path = re.search(r"target_path\s*=\s*['\"]([^'\"]*)['\"]", command_content)
                                    target_path = match_path.group(1) if match_path else ""
                                    fresh_content = fresh_content.replace("__TARGET_PATH__", target_path)

                                    match_method = re.search(r"target_method\s*=\s*['\"]([^'\"]*)['\"]", command_content)
                                    target_method = match_method.group(1) if match_method else "GET"
                                    fresh_content = fresh_content.replace("__TARGET_METHOD__", target_method)

                                    match_data = re.search(r"target_data\s*=\s*['\"]([^'\"]*)['\"]", command_content)
                                    target_data = match_data.group(1) if match_data else ""
                                    fresh_content = fresh_content.replace("__TARGET_DATA__", target_data)
                            command_content = fresh_content
                            break
            except Exception as exc:
                LOGGER.warning("Failed to override with fresh utility command content: %s", exc)

        if not command_content:
            return jsonify({"ok": False, "error": "Missing command_content"}), 400

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

            params_str = json.dumps({"action": "exec_utility", "command": command, "command_content": command_content})
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
            output_val = command.error_message or ""
            return jsonify({
                "ok": True,
                "id": command_id,
                "agent_uid": agent_uid,
                "status": command.status,
                "command_type": command.command_type,
                "error": output_val if command.status == "failed" else "",
                "error_message": output_val if command.status == "failed" else "",
                "result": output_val,
                "output": output_val,
                "result_payload": output_val,
                "data": output_val,
                "message": output_val,
                "received_at": command.received_at.isoformat() if command.received_at else None,
                "responded_at": command.responded_at.isoformat() if command.responded_at else None,
                "progress_text": output_val if command.status == "pending" else "",
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
