from __future__ import annotations

import hashlib
import json
import logging
import os
import time as time_module
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from sqlalchemy import select, or_, delete

from app_helpers import (
    ONLINE_STALE_SECONDS,
    _request_api_token,
    _resolve_request_lead,
    _validate_polling_auth,
    _resolve_lan_uid_with_session,
)
from utils import (
    UI_TZ,
    _to_text,
    _to_int,
    _parse_timestamp,
    _safe_path_token,
    _safe_relative_path_parts,
    _normalize_mac,
)
from serializers import (
    _refresh_stale_agent_offline,
    _upsert_lan_and_agent,
    _upsert_printer_from_polling,
    _apply_printer_enabled_state,
    _set_printer_online_state,
)
from models import (
    Printer,
    PrinterControlCommand,
    ScanEmailAlias,
    AgentNode,
    AgentPresenceLog,
    DeviceInfor,
    ScanPoint,
    IPData,
    CameraConfig,
    LanSite,
)
from active_agents_registry import update_agent_in_memory, ACTIVE_AGENTS

LOGGER = logging.getLogger(__name__)

SCAN_UPLOAD_ROOT = Path("storage/uploads/scans")


def enqueue_get_agent_ip_command(session: Any, lead: str, lan_uid: str, agent_uid: str) -> None:
    """Automatically enqueue a get_agent_ip utility command for an agent so it returns its new IP right away after change_agent_ip."""
    try:
        from agent_utility_routes import BUILTIN_UTILITY_COMMANDS
        get_ip_script = BUILTIN_UTILITY_COMMANDS.get(
            "get_agent_ip",
            "import socket\\ndef get_local_ip():\\n    try:\\n        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)\\n        s.connect(('8.8.8.8', 80))\\n        ip = s.getsockname()[0]\\n        s.close()\\n        return ip\\n    except Exception:\\n        return '127.0.0.1'\\n\\nprint(get_local_ip())\n"
        )
        params = {
            "action": "exec_utility",
            "command": "get_agent_ip",
            "command_content": get_ip_script,
            "is_auto": True
        }

        pending = session.execute(
            select(PrinterControlCommand).where(
                PrinterControlCommand.agent_uid == agent_uid,
                PrinterControlCommand.status.in_(["pending", "processing"]),
                PrinterControlCommand.command_type == "trigger_utility"
            )
        ).scalars().all()

        for p_cmd in pending:
            try:
                p_json = json.loads(p_cmd.command_params or "{}")
                if p_json.get("command") == "get_agent_ip":
                    LOGGER.info("[AUTO get_agent_ip] Pending get_agent_ip command #%s already exists for agent %s", p_cmd.id, agent_uid)
                    return
            except Exception:
                pass

        new_cmd = PrinterControlCommand(
            printer_id=0,
            lead=lead or "default",
            lan_uid=lan_uid or "default",
            agent_uid=agent_uid,
            printer_name="Auto Get Agent IP",
            ip="",
            command_type="trigger_utility",
            command_params=json.dumps(params),
            status="pending",
            requested_at=datetime.now(timezone.utc),
        )
        session.add(new_cmd)
        session.commit()
        LOGGER.info("[AUTO get_agent_ip] Created automatic get_agent_ip job #%s for agent %s", new_cmd.id, agent_uid)
    except Exception as err:
        LOGGER.error("[AUTO get_agent_ip] Failed to enqueue get_agent_ip job for %s: %s", agent_uid, err)



def parse_folder_str(folder_str: str) -> dict[str, str]:
    if not folder_str:
        return {"protocol": "", "server": "", "port": "", "path": ""}
    proto = ""
    server = ""
    port = ""
    path = ""
    if folder_str.startswith("ftp://"):
        proto = "FTP"
        import re
        match = re.match(r"ftp://([^:/]+)(?::(\d+))?(.*)", folder_str)
        if match:
            server = match.group(1)
            port = match.group(2) or "21"
            path = match.group(3) or "/"
    elif folder_str.startswith("\\\\"):
        proto = "SMB"
        import re
        match = re.match(r"\\\\([^\\]+)\\(.*)", folder_str)
        if match:
            server = match.group(1)
            path = "\\" + match.group(2)
            port = "445"
        else:
            server = folder_str[2:]
            path = "\\"
            port = "445"
    elif folder_str and folder_str not in ("—", "-"):
        server = folder_str
        port = ""
        path = ""
    return {
        "protocol": proto,
        "server": server,
        "port": port,
        "path": path
    }


def register_polling_aux_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str], drive_sync: Any, cfg: Any) -> None:
    server_mode = os.getenv("SERVER_MODE", "full").strip().lower()
    is_ingest_only = (server_mode == "ingest")

    @app.get("/api/polling/controls")
    def polling_controls() -> Any:
        if is_ingest_only:
            return jsonify({"ok": False, "error": "Control dispatch is disabled on Ingest server. Handled by Control Plane on Port 8005."}), 404
        agent_uid = _to_text(request.args.get("agent_uid"))
        sent_token = _request_api_token()
        client_pub_ip = request.headers.get("X-Forwarded-For", request.remote_addr or "").split(",")[0].strip()
        ok_auth, lead_valid, auth_error = _resolve_request_lead({}, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error
        with session_factory() as session:
            lan_uid, _ = _resolve_lan_uid_with_session(
                session,
                lead_valid,
                {
                    "lead": lead_valid,
                    "lan_uid": _to_text(request.args.get("lan_uid")),
                    "agent_uid": agent_uid,
                    "hostname": _to_text(request.args.get("hostname")),
                    "local_ip": _to_text(request.args.get("local_ip")),
                    "gateway_ip": _to_text(request.args.get("gateway_ip")),
                    "gateway_mac": _to_text(request.args.get("gateway_mac")),
                },
            )

            # Heartbeat update: refresh last_seen_at and is_online since controls check-in is the most frequent agent activity
            now = datetime.now(timezone.utc)
            agent = session.execute(
                select(AgentNode).where(
                    AgentNode.lead == lead_valid,
                    AgentNode.agent_uid == agent_uid
                ).order_by(AgentNode.last_seen_at.desc(), AgentNode.id.desc())
            ).scalars().first()
            if agent:
                agent.last_seen_at = now
                if client_pub_ip and client_pub_ip not in ("127.0.0.1", "localhost", "::1"):
                    agent.public_ip = client_pub_ip
                    try:
                        lan_site_row = session.execute(
                            select(LanSite).where((LanSite.lan_uid == lan_uid) | (LanSite.lan_uid == agent.lan_uid) | (LanSite.lan_uid == client_pub_ip))
                        ).scalars().first()
                        if lan_site_row and lan_site_row.public_ip != client_pub_ip:
                            lan_site_row.public_ip = client_pub_ip
                    except Exception:
                        pass
                if not agent.is_online:
                    agent.is_online = True
                    agent.online_changed_at = now
                    session.add(
                        AgentPresenceLog(
                            lead=lead_valid,
                            lan_uid=lan_uid,
                            agent_uid=agent_uid,
                            hostname=agent.hostname or "",
                            local_ip=agent.local_ip or "",
                            local_mac=agent.local_mac or "",
                            app_version=agent.app_version or "",
                            run_mode=agent.run_mode or "web",
                            web_port=int(agent.web_port or 9173),
                            is_online=True,
                            changed_at=now,
                            last_seen_at=now,
                        )
                    )
                session.commit()

            req_body = request.get_json(silent=True) or {}
            devices_payload = req_body.get("devices") or req_body.get("printers") or req_body.get("devices_list") or req_body.get("printers_json")
            if not isinstance(devices_payload, list) and isinstance(devices_payload, dict):
                devices_payload = list(devices_payload.values())

            incoming_local_ip = _to_text(request.args.get("local_ip")) or _to_text(req_body.get("local_ip")) or (agent.local_ip if agent else "")

            # 1. Natural IP Change detection during polling controls check-in (Update DB first)
            if incoming_local_ip:
                try:
                    ip_rec = session.execute(
                        select(IPData).where(IPData.agent_name == agent_uid)
                    ).scalars().first()
                    old_ref_ip = (ip_rec.ip if ip_rec and ip_rec.ip else "") or (agent.local_ip if agent else "")
                    if old_ref_ip and old_ref_ip != incoming_local_ip:
                        # Dedup guard: check if pc_ip_changed event already triggered workflow in last 5 min
                        recent_cutoff = datetime.now(timezone.utc) - timedelta(minutes=5)
                        existing_workflow = session.execute(
                            select(PrinterControlCommand).where(
                                PrinterControlCommand.agent_uid == agent_uid,
                                PrinterControlCommand.command_type == "when_ip_change",
                                PrinterControlCommand.requested_at >= recent_cutoff
                            )
                        ).scalars().first()

                        if not existing_workflow:
                            LOGGER.info("[polling_controls] Natural agent IP change detected for %s: %s -> %s. Triggering workflow...", agent_uid, old_ref_ip, incoming_local_ip)
                            from utils import trigger_ip_change_workflow
                            trigger_ip_change_workflow(session, lead_valid, lan_uid, agent_uid, old_ref_ip, incoming_local_ip)
                        else:
                            LOGGER.info("[polling_controls] Dedup: when_ip_change #%d already exists for agent %s (%s -> %s). Skipping duplicate workflow.", existing_workflow.id, agent_uid, old_ref_ip, incoming_local_ip)

                        # Always update IPData and AgentNode regardless of dedup
                        if ip_rec:
                            ip_rec.ip = incoming_local_ip
                            ip_rec.updated_at = datetime.now(timezone.utc)
                        if agent:
                            agent.local_ip = incoming_local_ip
                            agent.updated_at = datetime.now(timezone.utc)
                        session.commit()
                except Exception as ip_detect_err:
                    LOGGER.error("Error detecting natural IP change in polling_controls: %s", ip_detect_err)


            # 2. Update RAM memory so UI endpoints get the new IP text immediately
            update_agent_in_memory(
                lead=lead_valid,
                lan_uid=lan_uid,
                agent_uid=agent_uid,
                hostname=agent.hostname if agent else "",
                local_ip=incoming_local_ip,
                local_mac=agent.local_mac if agent else "",
                app_version=agent.app_version if agent else "",
                run_mode=agent.run_mode if agent else "web",
                web_port=int(agent.web_port or 9173) if agent else 9173,
                devices_list=devices_payload if isinstance(devices_payload, list) else None,
                public_ip=client_pub_ip,
            )


            agent_ram = ACTIVE_AGENTS.get(agent_uid)
            req_push = False
            if agent_ram and len(agent_ram.get("devices", {})) == 0 and len(agent_ram.get("printers_json", [])) == 0:
                req_push = True

            from sqlalchemy import or_

            target_lans = {lan_uid}
            if agent and getattr(agent, "lan_uid", None):
                target_lans.add(agent.lan_uid)
            if agent and getattr(agent, "public_ip", None):
                target_lans.add(agent.public_ip)
            if client_pub_ip:
                target_lans.add(client_pub_ip)

            if agent_uid:
                cmd_subq = (
                    select(PrinterControlCommand.printer_id)
                    .where(
                        PrinterControlCommand.lead == lead_valid,
                        PrinterControlCommand.agent_uid == agent_uid,
                        PrinterControlCommand.status == "pending",
                    )
                )
                stmt = select(Printer).where(
                    Printer.lead == lead_valid,
                    or_(
                        Printer.agent_uid == agent_uid,
                        Printer.lan_uid.in_(target_lans),
                        Printer.id.in_(cmd_subq),
                    )
                ).order_by(Printer.id.asc())
            else:
                stmt = select(Printer).where(
                    Printer.lead == lead_valid,
                    Printer.lan_uid.in_(target_lans),
                ).order_by(Printer.id.asc())
            rows = session.execute(stmt).scalars().all()
            
            pending_cmds_stmt = select(PrinterControlCommand).where(
                PrinterControlCommand.lead == lead_valid,
                PrinterControlCommand.status == "pending",
            )
            if agent_uid:
                pending_cmds_stmt = pending_cmds_stmt.where(
                    or_(
                        PrinterControlCommand.agent_uid == agent_uid,
                        PrinterControlCommand.agent_uid == "default",
                        PrinterControlCommand.agent_uid == "",
                        PrinterControlCommand.agent_uid.is_(None),
                    )
                )
            pending_cmds_stmt = pending_cmds_stmt.order_by(PrinterControlCommand.requested_at.asc(), PrinterControlCommand.id.asc())
            pending_cmds = session.execute(pending_cmds_stmt).scalars().all()
            pending_by_printer: dict[int, PrinterControlCommand] = {}
            pending_agent_cmds = []
            for cmd in pending_cmds:
                if cmd.command_params and "child_command_ids" in cmd.command_params:
                    continue
                if cmd.printer_id and int(cmd.printer_id) > 0:
                    if int(cmd.printer_id) not in pending_by_printer:
                        pending_by_printer[int(cmd.printer_id)] = cmd
                else:
                    pending_agent_cmds.append(cmd)

            agent_commands_serialized = [
                {
                    "id": int(cmd.id),
                    "command_type": cmd.command_type,
                    "printer_id": int(cmd.printer_id or 0),
                    "printer_name": cmd.printer_name or "",
                    "ip": cmd.ip or "",
                    "driver_brand": cmd.driver_brand or "",
                    "driver_model": cmd.driver_model or "",
                    "driver_name": cmd.driver_name or "",
                    "driver_url": cmd.driver_url or "",
                    "auth_user": cmd.auth_user or "",
                    "auth_password": cmd.auth_password or "",
                    "command_params": cmd.command_params or "",
                    "requested_at": cmd.requested_at.isoformat() if cmd.requested_at else "",
                }
                for cmd in pending_agent_cmds
            ]

            rows_serialized = [
                {
                    "id": int(r.id),
                    "ip": r.ip,
                    "printer_name": r.printer_name,
                    "enabled": bool(r.enabled),
                    "enabled_changed_at": r.enabled_changed_at.isoformat() if r.enabled_changed_at else "",
                    "command": (
                        {
                            "id": int(pending_by_printer[int(r.id)].id),
                            "desired_enabled": bool(pending_by_printer[int(r.id)].desired_enabled),
                            "command_type": pending_by_printer[int(r.id)].command_type or "enable_disable",
                            "auth_user": pending_by_printer[int(r.id)].auth_user or "",
                            "auth_password": pending_by_printer[int(r.id)].auth_password or "",
                            "driver_brand": pending_by_printer[int(r.id)].driver_brand or "",
                            "driver_model": pending_by_printer[int(r.id)].driver_model or "",
                            "driver_name": pending_by_printer[int(r.id)].driver_name or "",
                            "driver_url": pending_by_printer[int(r.id)].driver_url or "",
                            "command_params": pending_by_printer[int(r.id)].command_params or "",
                        }
                        if int(r.id) in pending_by_printer
                        else None
                    ),
                }
                for r in rows
            ]

            existing_row_ids = {int(r.id) for r in rows}
            for pid, pcmd in pending_by_printer.items():
                if pid not in existing_row_ids and pcmd.ip:
                    rows_serialized.append(
                        {
                            "id": pid,
                            "ip": pcmd.ip,
                            "printer_name": pcmd.printer_name or pcmd.ip,
                            "enabled": True,
                            "enabled_changed_at": "",
                            "command": {
                                "id": int(pcmd.id),
                                "desired_enabled": bool(pcmd.desired_enabled),
                                "command_type": pcmd.command_type or "enable_disable",
                                "auth_user": pcmd.auth_user or "",
                                "auth_password": pcmd.auth_password or "",
                                "driver_brand": pcmd.driver_brand or "",
                                "driver_model": pcmd.driver_model or "",
                                "driver_name": pcmd.driver_name or "",
                                "driver_url": pcmd.driver_url or "",
                                "command_params": pcmd.command_params or "",
                            },
                        }
                    )

        return jsonify(
            {
                "ok": True,
                "lead": lead_valid,
                "lan_uid": lan_uid,
                "agent_uid": agent_uid,
                "request_inventory_push": req_push,
                "agent_commands": agent_commands_serialized,
                "rows": rows_serialized,
                "settings": (lambda: __import__('utils').get_system_settings())()
            }
        )

    @app.route("/api/system-settings", methods=["GET", "POST"])
    def system_settings_api() -> Any:
        from utils import get_system_settings, save_system_settings
        if request.method == "POST":
            data = request.get_json(silent=True) or {}
            updated = save_system_settings(data)
            return jsonify({"ok": True, "message": "System settings updated successfully", "settings": updated})
        else:
            settings = get_system_settings()
            return jsonify({"ok": True, "settings": settings})

    @app.post("/api/polling/address-book-sync")
    def polling_address_book_sync() -> Any:
        if is_ingest_only:
            return jsonify({"ok": False, "error": "Address book sync is disabled on Ingest server. Handled by Control Plane on Port 8005."}), 404
        body = request.get_json(silent=True) or {}
        if not isinstance(body, dict):
            return jsonify({"ok": False, "error": "Invalid JSON body"}), 400
        sent_token = _request_api_token()
        ok_auth, lead, auth_error = _validate_polling_auth(body, lead_key_map, sent_token)
        if not ok_auth:
            return auth_error

        posting_agent_uid = _to_text(body.get("agent_uid")) or _to_text(request.args.get("agent_uid")) or _to_text(body.get("lead")) or "kythuat02"

        # Check if body is a bulk dictionary of scan_points (keyed by MAC address)
        bulk_items = {}
        if isinstance(body.get("scan_points"), dict):
            bulk_items = body.get("scan_points")
        elif "address_book_data" not in body and any(_normalize_mac(k) for k in body.keys()):
            bulk_items = body

        if bulk_items:
            try:
                saved_count = 0
                from active_agents_registry import ACTIVE_AGENTS

                with session_factory() as db_session:
                    for k, item in bulk_items.items():
                        if not isinstance(item, dict):
                            continue
                        mac_address = _normalize_mac(item.get("mac_address") or item.get("mac_id") or k)
                        if not mac_address:
                            continue
                        printer_name = _to_text(item.get("printer_name") or item.get("name"))
                        if any(kw in printer_name.lower() for kw in ["f671y", "f6600", "f66", "h3601", "h36", "router", "gateway", "modem", "viettel", "vnpt", "fpt", "zte", "huawei", "[error]"]):
                            continue
                        printer_ip = _to_text(item.get("ip") or item.get("printer_ip")).strip()
                        if not printer_ip or printer_ip == "0.0.0.0":
                            sp_exist = db_session.get(ScanPoint, mac_address)
                            if sp_exist and sp_exist.ip and sp_exist.ip != "0.0.0.0":
                                printer_ip = sp_exist.ip
                            else:
                                p_row = db_session.execute(select(Printer).where(or_(Printer.mac_address == mac_address, Printer.mac_id == mac_address))).scalars().first()
                                if p_row and p_row.ip and p_row.ip != "0.0.0.0":
                                    printer_ip = p_row.ip

                        if not printer_ip or printer_ip == "0.0.0.0":
                            LOGGER.error("[polling_address_book_sync] Bulk item missing valid IP for MAC %s, skipping scan_points insert", mac_address)
                            continue
                        
                        raw_list = item.get("address_list") or []
                        if not raw_list and isinstance(item.get("address_book_data"), dict):
                            raw_list = item.get("address_book_data", {}).get("address_list") or []

                        enriched_list = []
                        for entry in raw_list:
                            if isinstance(entry, dict):
                                try:
                                    folder_str = str(entry.get("folder_path") or entry.get("folder") or "")
                                    parsed = parse_folder_str(folder_str)
                                    entry["protocol"] = parsed.get("protocol", "")
                                    entry["server_host"] = parsed.get("server", "")
                                    entry["folder_port_no"] = parsed.get("port", "")
                                    entry["path_on_folder"] = parsed.get("path", "")
                                except Exception:
                                    pass
                            enriched_list.append(entry)

                        sync_data = {
                            "status": "success",
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                            "address_list": enriched_list,
                            "agent_version": item.get("agent_version", "unknown"),
                        }

                        # 1. Update in-memory ACTIVE_AGENTS
                        for agent_info in ACTIVE_AGENTS.values():
                            printers_list = agent_info.get("printers_json") or []
                            for dev in printers_list:
                                if isinstance(dev, dict):
                                    dev_mac = _normalize_mac(_to_text(dev.get("mac_address") or dev.get("mac_id")))
                                    if dev_mac == mac_address:
                                        dev["address_book_sync"] = sync_data

                        # 2. Persist to PostgreSQL scan_points
                        db_session.execute(delete(ScanPoint).where(ScanPoint.mac_id == mac_address))
                        try:
                            new_record = ScanPoint(
                                mac_id=mac_address,
                                printer_name=printer_name,
                                ip=printer_ip,
                                agent_uid=posting_agent_uid,
                                address_book_data=sync_data,
                                status="success",
                            )
                            db_session.add(new_record)
                            db_session.flush()
                        except Exception:
                            db_session.rollback()
                            db_session.execute(delete(ScanPoint).where(ScanPoint.mac_id == mac_address))
                            new_record = ScanPoint(
                                mac_id=mac_address,
                                printer_name=printer_name,
                                ip=printer_ip,
                                address_book_data=sync_data,
                                status="success",
                            )
                            db_session.add(new_record)
                            db_session.flush()
                        saved_count += 1

                    db_session.commit()

                LOGGER.info("[polling_address_book_sync] Ingested bulk scan_points dictionary (%d items) for agent_uid=%s", saved_count, posting_agent_uid)
                return jsonify({"ok": True, "bulk_saved": saved_count, "stored": "postgresql_database"})
            except Exception as exc:
                LOGGER.exception("[polling_address_book_sync] Bulk ingest failed: %s", exc)
                return jsonify({"ok": False, "error": str(exc)}), 500

        mac_address = _normalize_mac(_to_text(body.get("mac_address") or body.get("mac_id")))
        printer_ip = _to_text(body.get("printer_ip") or body.get("ip")).strip()
        printer_name = _to_text(body.get("printer_name") or body.get("name"))
        
        # Exclude router/gateway devices like F671Y
        if any(kw in printer_name.lower() for kw in ["f671y", "f6600", "f66", "h3601", "h36", "router", "gateway", "modem", "viettel", "vnpt", "fpt", "zte", "huawei", "[error]"]):
            return jsonify({"ok": False, "error": "Router/Error device excluded from scan_points"}), 400

        address_book_data = body.get("address_book_data")
        if not isinstance(address_book_data, dict):
            return jsonify({"ok": False, "error": "Missing address_book_data"}), 400

        if not mac_address and printer_ip:
            try:
                from active_agents_registry import ACTIVE_AGENTS
                for agent_info in ACTIVE_AGENTS.values():
                    printers_list = agent_info.get("printers_json") or []
                    for dev in printers_list:
                        if isinstance(dev, dict) and dev.get("ip") == printer_ip:
                            mac_address = _normalize_mac(_to_text(dev.get("mac_address") or dev.get("mac_id")))
                            if mac_address:
                                break
                    if mac_address:
                        break
                if not mac_address:
                    with session_factory() as db_sess:
                        p_row = db_sess.execute(select(PrinterModel).where(PrinterModel.ip == printer_ip)).scalars().first()
                        if p_row and p_row.mac_id:
                            mac_address = _normalize_mac(p_row.mac_id)
            except Exception as mac_res_exc:
                LOGGER.warning("[polling_address_book_sync] MAC resolution by IP failed: %s", mac_res_exc)

        if not mac_address:
            return jsonify({"ok": False, "error": "Missing mac_address for scan_points matching"}), 400

        if not printer_ip or printer_ip == "0.0.0.0":
            try:
                with session_factory() as db_session:
                    sp_exist = db_session.get(ScanPoint, mac_address)
                    if sp_exist and sp_exist.ip and sp_exist.ip != "0.0.0.0":
                        printer_ip = sp_exist.ip
                    else:
                        p_row = db_session.execute(select(Printer).where(or_(Printer.mac_address == mac_address, Printer.mac_id == mac_address))).scalars().first()
                        if p_row and p_row.ip and p_row.ip != "0.0.0.0":
                            printer_ip = p_row.ip
            except Exception:
                pass

        if not printer_ip or printer_ip == "0.0.0.0":
            return jsonify({"ok": False, "error": f"Thiếu IP máy in hợp lệ cho MAC {mac_address}! Cấm lưu ScanPoint không có IP."}), 400

        raw_list = address_book_data.get("address_list") or []
        enriched_list = []
        for entry in raw_list:
            if isinstance(entry, dict):
                folder_str = entry.get("folder_path") or entry.get("folder") or ""
                parsed = parse_folder_str(folder_str)
                entry["protocol"] = parsed["protocol"]
                entry["server_host"] = parsed["server"]
                entry["folder_port_no"] = parsed["port"]
                entry["path_on_folder"] = parsed["path"]
            enriched_list.append(entry)

        sync_data = {
            "status": "success",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "address_list": enriched_list,
            "agent_version": address_book_data.get("agent_version", ""),
            "content": address_book_data.get("content"),
            "debug": address_book_data.get("debug"),
        }

        # 1. Update in-memory printers_json in ACTIVE_AGENTS strictly by mac_address
        from active_agents_registry import ACTIVE_AGENTS
        ram_updated = False
        for agent_info in ACTIVE_AGENTS.values():
            printers_list = agent_info.get("printers_json") or []
            for dev in printers_list:
                if isinstance(dev, dict):
                    dev_mac = _normalize_mac(_to_text(dev.get("mac_address") or dev.get("mac_id")))
                    if dev_mac == mac_address:
                        dev["address_book_sync"] = sync_data
                        ram_updated = True

        # 2. Persist to PostgreSQL scan_points table (strictly match & replace by mac_id)
        try:
            with session_factory() as db_session:
                db_session.execute(delete(ScanPoint).where(ScanPoint.mac_id == mac_address))
                try:
                    new_record = ScanPoint(
                        mac_id=mac_address,
                        printer_name=printer_name,
                        ip=printer_ip,
                        agent_uid=posting_agent_uid,
                        address_book_data=sync_data,
                        status="success",
                    )
                    db_session.add(new_record)
                    db_session.commit()
                except Exception:
                    db_session.rollback()
                    db_session.execute(delete(ScanPoint).where(ScanPoint.mac_id == mac_address))
                    new_record = ScanPoint(
                        mac_id=mac_address,
                        printer_name=printer_name,
                        ip=printer_ip,
                        address_book_data=sync_data,
                        status="success",
                    )
                    db_session.add(new_record)
                    db_session.commit()
            LOGGER.info("[polling_address_book_sync] Replaced scan_points in PostgreSQL database for mac_id %s (agent_uid=%s)", mac_address, posting_agent_uid)
        except Exception as db_exc:
            LOGGER.warning("[polling_address_book_sync] Could not persist scan_points to PostgreSQL database: %s", db_exc)

        LOGGER.info("[polling_address_book_sync] Stored address_book_sync for mac_address %s (ram_updated=%s)", mac_address, ram_updated)
        return jsonify({"ok": True, "mac_address": mac_address, "stored": "postgresql_database"})

    def _execute_polling_control_result() -> Any:
        if is_ingest_only:
            return jsonify({"ok": False, "error": "Control result processing is disabled on Ingest server. Handled by Control Plane on Port 8005."}), 404
        body = request.get_json(silent=True) or {}
        if not isinstance(body, dict):
            return jsonify({"ok": False, "error": "Invalid JSON body"}), 400
        sent_token = _request_api_token()
        ok_auth, lead, auth_error = _validate_polling_auth(body, lead_key_map, sent_token)
        if not ok_auth:
            return auth_error

        command_id = _to_int(body.get("command_id"))
        if command_id is None or command_id <= 0:
            return jsonify({"ok": False, "error": "Missing command_id"}), 400
        ok_value = bool(body.get("ok", False))
        error_message = _to_text(body.get("error"))
        responded_at = datetime.now(timezone.utc)

        with session_factory() as session:
            command = session.get(PrinterControlCommand, int(command_id))
            if command is None:
                return jsonify({"ok": True, "error": "Command not found (assumed already processed)"}), 200
            if command.lead != lead:
                return jsonify({"ok": False, "error": "Lead mismatch"}), 400
            if command.status not in ("pending", "processing"):
                return jsonify({"ok": True, "status": command.status, "id": int(command.id)})

            printer = None
            cmd_mac = getattr(command, 'mac_address', None) or getattr(command, 'mac_id', None)
            if not cmd_mac and command.command_params:
                try:
                    params_dict = json.loads(command.command_params) if isinstance(command.command_params, str) else command.command_params
                    if isinstance(params_dict, dict):
                        cmd_mac = params_dict.get('mac_address') or params_dict.get('mac_id') or params_dict.get('mac')
                except Exception:
                    pass
            if cmd_mac:
                norm_mac = str(cmd_mac).strip().upper().replace("-", ":")
                clean_mac = norm_mac.replace(":", "")
                printer = session.query(Printer).filter(
                    (Printer.mac_address == norm_mac) | (Printer.mac_address == clean_mac)
                ).first()

            if command.command_type in ("fetch_address_book", "add_scan_email_dest", "delete_scan_email_dest", "address_modify"):
                if ok_value:
                    command.status = "success"
                    command.error_message = ""
                    command.responded_at = responded_at
                    # Auto-resolve when_ip_change parent if this address_modify is a child of one
                    if command.command_type == "address_modify":
                        try:
                            from utils import try_resolve_when_ip_change_parent
                            try_resolve_when_ip_change_parent(session, command.id)
                        except Exception as resolve_exc:
                            LOGGER.warning("[polling_control_result] resolve parent error: %s", resolve_exc)
                    address_book_data = body.get("address_book_data") or body.get("result_payload") or body.get("output") or body.get("error_message")
                    if isinstance(address_book_data, str):
                        raw_str = address_book_data.strip()
                        if raw_str.startswith("{") or raw_str.startswith("["):
                            try:
                                import json as _json
                                address_book_data = _json.loads(raw_str)
                            except Exception:
                                pass
                        elif "{" in raw_str and "address_list" in raw_str:
                            try:
                                import json as _json
                                json_substr = raw_str[raw_str.find("{"):raw_str.rfind("}")+1]
                                address_book_data = _json.loads(json_substr)
                            except Exception:
                                pass

                    # Enriched FTP metadata sent by agent from wizard result
                    wizard_ftp_host = _to_text(body.get("ftp_host"))
                    wizard_ftp_port = int(body.get("ftp_port") or 0) or None
                    wizard_ftp_url = _to_text(body.get("ftp_url"))
                    wizard_ftp_upload_url = _to_text(body.get("ftp_upload_url"))
                    wizard_ftp_upload_path = _to_text(body.get("ftp_upload_path"))
                    wizard_short_name = _to_text(body.get("short_name"))
                    wizard_reg_no = _to_text(body.get("registration_no"))
                    wizard_entry_name = _to_text(body.get("entry_name"))
                    wizard_source_email = _to_text(body.get("source_email"))

                    if isinstance(address_book_data, dict):
                        raw_list = address_book_data.get("address_list") or []
                        enriched_list = []
                        for entry in raw_list:
                            if isinstance(entry, dict):
                                # For the newly created FTP entry: prefer wizard data over AJAX data
                                is_new_entry = (
                                    wizard_reg_no
                                    and str(entry.get("registration_no", "") or "").lstrip("0")
                                    == str(wizard_reg_no).lstrip("0")
                                )
                                if is_new_entry and wizard_ftp_host:
                                    # Build canonical FTP URL from wizard data
                                    ftp_url_for_parse = wizard_ftp_upload_url or wizard_ftp_url or ""
                                    if not ftp_url_for_parse and wizard_ftp_host and wizard_ftp_port:
                                        ftp_url_for_parse = f"ftp://{wizard_ftp_host}:{wizard_ftp_port}/"
                                    parsed = parse_folder_str(ftp_url_for_parse)
                                    entry["protocol"] = parsed["protocol"] or "FTP"
                                    entry["server_host"] = parsed["server"] or wizard_ftp_host
                                    entry["folder_port_no"] = parsed["port"] or str(wizard_ftp_port or 21)
                                    entry["path_on_folder"] = parsed["path"] or wizard_ftp_upload_path or "/"
                                    LOGGER.info(
                                        "[polling_control_result] Enriched new entry reg_no=%s with wizard ftp data: %s:%s%s",
                                        wizard_reg_no, entry["server_host"], entry["folder_port_no"], entry["path_on_folder"],
                                    )
                                else:
                                    folder_str = entry.get("folder_path") or entry.get("folder") or ""
                                    parsed = parse_folder_str(folder_str)
                                    entry["protocol"] = parsed["protocol"]
                                    entry["server_host"] = parsed["server"]
                                    entry["folder_port_no"] = parsed["port"]
                                    entry["path_on_folder"] = parsed["path"]
                            enriched_list.append(entry)
                        sync_data = {
                            "status": "success",
                            "timestamp": responded_at.isoformat(),
                            "address_list": enriched_list,
                        }
                        command.error_message = json.dumps(sync_data, ensure_ascii=False)
                        if printer is not None:
                            printer.address_book_sync = sync_data
                            LOGGER.info("[polling_control_result] Updated Printer.address_book_sync for printer_id=%d in PostgreSQL", printer.id)

                        try:
                            target_mac = (printer.mac_address if printer and printer.mac_address else "").strip().upper().replace("-", ":")
                            if not target_mac:
                                target_mac = _to_text(body.get("mac_id") or body.get("mac_address") or body.get("printer_mac_id"))
                                if not target_mac and command.command_params:
                                    try:
                                        cp = _json.loads(command.command_params)
                                        target_mac = _to_text(cp.get("mac_address") or cp.get("mac_id") or cp.get("printer_mac_id"))
                                    except Exception:
                                        pass
                                target_mac = _normalize_mac(target_mac)

                            target_ip = (printer.ip if printer and printer.ip else "").strip() or _to_text(command.ip)
                            if not target_mac and target_ip:
                                sp_by_ip = session.execute(select(ScanPoint).where(ScanPoint.ip == target_ip)).scalars().first()
                                if sp_by_ip:
                                    target_mac = sp_by_ip.mac_id

                            if target_mac:
                                sp_rec = session.get(ScanPoint, target_mac)
                                clean_ip = target_ip.strip() if target_ip else ""
                                p_name = printer.printer_name if printer else (command.printer_name or "")
                                if not clean_ip or clean_ip == "0.0.0.0":
                                    p_row = session.execute(select(Printer).where(or_(Printer.mac_address == target_mac, Printer.mac_id == target_mac))).scalars().first()
                                    if p_row and p_row.ip and p_row.ip != "0.0.0.0":
                                        clean_ip = p_row.ip

                                if sp_rec is None:
                                    if clean_ip and clean_ip != "0.0.0.0":
                                        sp_rec = ScanPoint(
                                            mac_id=target_mac,
                                            printer_name=p_name or "Photocopy",
                                            ip=clean_ip,
                                            agent_uid=command.agent_uid or "",
                                            address_book_data=sync_data,
                                            status="success"
                                        )
                                        session.add(sp_rec)
                                        LOGGER.info("[polling_control_result] Created ScanPoint PostgreSQL table for mac_id=%s (ip=%s)", target_mac, clean_ip)
                                    else:
                                        LOGGER.error("[polling_control_result] CANNOT create ScanPoint without valid IP for MAC %s!", target_mac)
                                else:
                                    sp_rec.address_book_data = sync_data
                                    if clean_ip and clean_ip != "0.0.0.0":
                                        sp_rec.ip = clean_ip
                                    if p_name and p_name != "Photocopy":
                                        sp_rec.printer_name = p_name
                                    if command.agent_uid:
                                        sp_rec.agent_uid = command.agent_uid
                                    sp_rec.updated_at = datetime.now(timezone.utc)
                                    LOGGER.info("[polling_control_result] Updated ScanPoint PostgreSQL table for mac_id=%s (ip=%s)", target_mac, sp_rec.ip)
                                session.flush()
                        except Exception as sp_update_err:
                            LOGGER.warning("[polling_control_result] Error updating ScanPoint DB table: %s", sp_update_err)

                    if not command.error_message:
                        command.error_message = _to_text(body.get("result_payload") or body.get("output") or error_message or "")

                    # Extract live IPs and scanned printers array from force_subnet_scan output to update RAM
                    raw_out = _to_text(body.get("result_payload") or body.get("output") or "")
                    if "thiết bị đang phản hồi Ping" in raw_out or "IP ADDRESS" in raw_out or ("[" in raw_out and "ip" in raw_out.lower()):
                        import re
                        live_ips = re.findall(r"\b192\.168\.\d{1,3}\.\d{1,3}\b", raw_out)
                        if live_ips:
                            from active_agents_registry import update_live_ping_ips
                            update_live_ping_ips(command.lan_uid or "default", live_ips)

                        scanned_printers = []
                        if "[" in raw_out and "]" in raw_out:
                            try:
                                json_str = raw_out[raw_out.find("["):raw_out.rfind("]")+1]
                                parsed = json.loads(json_str)
                                if isinstance(parsed, list) and len(parsed) > 0 and isinstance(parsed[0], dict) and ("ip" in parsed[0] or "mac_address" in parsed[0] or "printer_name" in parsed[0]):
                                    scanned_printers = parsed
                            except Exception:
                                pass

                        if scanned_printers:
                            try:
                                now_utc = datetime.now(timezone.utc)
                                for p_item in scanned_printers:
                                    p_mac = str(p_item.get("mac_address") or p_item.get("mac_id") or "").strip().upper().replace("-", ":")
                                    if p_mac:
                                        sp_rec = session.get(ScanPoint, p_mac)
                                        if sp_rec and sp_rec.address_book_data:
                                            if sp_rec.updated_at:
                                                up_utc = sp_rec.updated_at
                                                if up_utc.tzinfo is None:
                                                    up_utc = up_utc.replace(tzinfo=timezone.utc)
                                                if (now_utc - up_utc).total_seconds() < (3 * 86400):
                                                    p_item["address_book_sync"] = sp_rec.address_book_data
                                                else:
                                                    session.delete(sp_rec)
                                                    session.flush()
                                            else:
                                                p_item["address_book_sync"] = sp_rec.address_book_data

                                enriched_json_str = _json.dumps(scanned_printers, ensure_ascii=False, indent=2)
                                command.result_payload = f"[*] Đang thực thi 100% Clean Fresh Scan theo Native Built-in PrintAgent Service...\n  [✓] CLEAN SCAN SUCCESS: Đã quét xong mạng LAN (Clean Fresh Scan). Tìm thấy {len(scanned_printers)} máy in ({len(scanned_printers)} Online).\n__PRINTERS_JSON_START__\n{enriched_json_str}\n__PRINTERS_JSON_END__\n\n{enriched_json_str}"
                                command.output = command.result_payload
                                session.flush()
                            except Exception as sp_merge_err:
                                LOGGER.warning("Error attaching ScanPoint in force_subnet_scan: %s", sp_merge_err)

                            from active_agents_registry import update_new_lan_site_devices, update_agent_in_memory
                            target_lan = command.lan_uid or "default"
                            update_new_lan_site_devices(target_lan, scanned_printers, agent_uid=command.agent_uid)
                            update_agent_in_memory(
                                lead=command.lead or "default",
                                lan_uid=target_lan,
                                agent_uid=command.agent_uid or "kythuat02",
                                devices_list=scanned_printers
                            )
                            LOGGER.info("[polling_control_result] Updated NEW_LAN_SITES RAM printers directly from force_subnet_scan output: %d printers", len(scanned_printers))

                    # Upsert ScanEmailAlias for add_scan_email_dest
                    if command.command_type == "add_scan_email_dest" and wizard_short_name:
                        try:
                            import json as _json
                            # Extract email from command_params as fallback
                            email_for_alias = wizard_source_email or ""
                            if not email_for_alias:
                                try:
                                    cp = _json.loads(command.command_params or "{}")
                                    email_for_alias = str(cp.get("email", "") or "").lower()
                                except Exception:
                                    pass

                            existing_alias = session.execute(
                                select(ScanEmailAlias).where(
                                    ScanEmailAlias.lead == lead,
                                    ScanEmailAlias.printer_id == int(command.printer_id),
                                    ScanEmailAlias.short_name == wizard_short_name,
                                )
                            ).scalar_one_or_none()
                            if existing_alias is None:
                                alias = ScanEmailAlias(
                                    lead=lead,
                                    printer_id=int(command.printer_id),
                                    email=email_for_alias,
                                    short_name=wizard_short_name,
                                    registration_no=wizard_reg_no or "",
                                    entry_name=wizard_entry_name or "",
                                    ftp_host=wizard_ftp_host or "",
                                    ftp_port=wizard_ftp_port or 2121,
                                    ftp_url=wizard_ftp_url or "",
                                    ftp_upload_url=wizard_ftp_upload_url or "",
                                    ftp_upload_path=wizard_ftp_upload_path or "",
                                )
                                session.add(alias)
                            else:
                                # Update existing record
                                existing_alias.email = email_for_alias
                                existing_alias.registration_no = wizard_reg_no or existing_alias.registration_no
                                existing_alias.entry_name = wizard_entry_name or existing_alias.entry_name
                                if wizard_ftp_host:
                                    existing_alias.ftp_host = wizard_ftp_host
                                if wizard_ftp_port:
                                    existing_alias.ftp_port = wizard_ftp_port
                                if wizard_ftp_url:
                                    existing_alias.ftp_url = wizard_ftp_url
                                if wizard_ftp_upload_url:
                                    existing_alias.ftp_upload_url = wizard_ftp_upload_url
                                if wizard_ftp_upload_path:
                                    existing_alias.ftp_upload_path = wizard_ftp_upload_path
                            LOGGER.info(
                                "[polling_control_result] Upserted ScanEmailAlias: lead=%s printer=%s email=%s short_name=%s ftp=%s:%s",
                                lead, command.printer_id, email_for_alias, wizard_short_name,
                                wizard_ftp_host, wizard_ftp_port,
                            )
                        except Exception as alias_exc:
                            LOGGER.warning("[polling_control_result] Failed to upsert ScanEmailAlias: %s", alias_exc)
                else:
                    try:
                        import json as _json
                        cmd_params = _json.loads(command.command_params) if command.command_params else {}
                        retry_count = int(cmd_params.get("retry_count", 0))
                        # address_modify / delete_scan_email_dest are stateful wizard operations —
                        # retrying mid-flow can corrupt or delete the copier entry. Never auto-retry.
                        no_retry_types = {"address_modify", "delete_scan_email_dest"}
                        if retry_count < 3 and command.command_type not in no_retry_types:
                            cmd_params["retry_count"] = retry_count + 1
                            command.command_params = _json.dumps(cmd_params, ensure_ascii=False)
                            command.status = "pending"
                            command.error_message = ""
                            command.requested_at = datetime.now(timezone.utc)
                            command.responded_at = None
                        else:
                            command.status = "failed"
                            command.error_message = f"(Đã thử lại {retry_count} lần) " + (error_message or "Command failed")
                            command.responded_at = responded_at
                    except Exception:
                        command.status = "failed"
                        command.error_message = error_message or "Command failed"
                        command.responded_at = responded_at
            elif command.command_type in ("trigger_utility", "force_subnet_scan") or "force_subnet_scan" in (command.command_params or ""):
                raw_payload = body.get("address_book_data") or body.get("result_payload") or body.get("printers") or error_message
                if isinstance(raw_payload, str):
                    if "__PRINTERS_JSON_START__" in raw_payload:
                        try:
                            json_str = raw_payload.split("__PRINTERS_JSON_START__")[1].split("__PRINTERS_JSON_END__")[0].strip()
                            raw_payload = json.loads(json_str)
                        except Exception: pass
                    elif raw_payload.strip().startswith("[") or raw_payload.strip().startswith("{"):
                        try: raw_payload = json.loads(raw_payload)
                        except Exception: pass
                    else:
                        import re
                        m = re.search(r'(\[\s*\{[\s\S]*\}\s*\])', raw_payload)
                        if m:
                            try: raw_payload = json.loads(m.group(1))
                            except Exception: pass

                has_error_kw = any(err in (error_message or "") for err in ["[-] LỖI THỰC THI", "[❌ LỖI CRITICAL", "SyntaxError:", "IndentationError:", "Authentication failed:", "RuntimeError:"])
                is_payload_error = isinstance(raw_payload, dict) and raw_payload.get("status") == "error"
                is_list_scan_cmd = "ricoh_list_scan" in (command.command_params or "") or "toshiba_list_scan" in (command.command_params or "") or command.command_type == "fetch_address_book"

                # Check if __ADDRESS_BOOK_JSON_START__ or valid address_list JSON is present in output text or body
                has_fresh_address_book_json = False
                for text_field in (body.get("output"), body.get("result"), body.get("result_payload"), body.get("error_message"), body.get("stdout"), error_message):
                    if text_field and isinstance(text_field, str):
                        if "__ADDRESS_BOOK_JSON_START__" in text_field or '"address_list"' in text_field:
                            has_fresh_address_book_json = True
                            break

                abd_in_body = body.get("address_book_data") or body.get("result_payload")
                if isinstance(abd_in_body, dict) and "address_list" in abd_in_body:
                    has_fresh_address_book_json = True

                has_address_book_json = (isinstance(raw_payload, dict) and (raw_payload.get("status") == "success" or "address_list" in raw_payload)) or has_fresh_address_book_json

                if ok_value and not has_error_kw and not is_payload_error and (not is_list_scan_cmd or has_address_book_json):
                    command.status = "success"
                    command.error_message = error_message or ""
                    command.responded_at = responded_at

                    printers_to_process = []
                    is_subnet_scan = (
                        command.command_type == "force_subnet_scan"
                        or "force_subnet_scan" in (command.command_params or "")
                    )
                    if isinstance(raw_payload, dict):
                        if "printers" in raw_payload and isinstance(raw_payload["printers"], list):
                            printers_to_process = [p for p in raw_payload["printers"] if isinstance(p, dict)]
                            is_subnet_scan = True
                        elif "printers_list" in raw_payload and isinstance(raw_payload["printers_list"], list):
                            printers_to_process = [p for p in raw_payload["printers_list"] if isinstance(p, dict)]
                            is_subnet_scan = True
                        elif raw_payload.get("mac_address") or raw_payload.get("mac_id") or raw_payload.get("ip"):
                            printers_to_process = [raw_payload]
                    elif isinstance(raw_payload, list):
                        printers_to_process = [p for p in raw_payload if isinstance(p, dict)]

                    if printers_to_process:
                        agent = session.execute(
                            select(AgentNode)
                            .where(AgentNode.agent_uid == command.agent_uid)
                            .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
                        ).scalars().first()
                        target_lan_uid = (agent.public_ip if agent and agent.public_ip else (agent.lan_uid if agent and agent.lan_uid else "default"))

                        # Update ACTIVE_AGENTS RAM registry only if this is a subnet scan or discovery
                        from active_agents_registry import ACTIVE_AGENTS
                        if is_subnet_scan and command.agent_uid in ACTIVE_AGENTS:
                            ACTIVE_AGENTS[command.agent_uid]["printers_json"] = printers_to_process

                        # Upsert printers safely WITHOUT wiping all printers or DeviceInfor from database
                        added_count = 0
                        now_ts = datetime.now(timezone.utc)
                        for p_item in printers_to_process:
                            mac = str(p_item.get("mac_address") or p_item.get("mac_id") or "").strip().upper().replace("-", ":")
                            ip = str(p_item.get("ip") or "").strip()
                            p_name = str(p_item.get("name") or p_item.get("printer_name") or "Photocopy").strip()
                            if not mac and not ip:
                                continue

                            _upsert_printer_from_polling(
                                session=session,
                                lead=lead,
                                lan_uid=target_lan_uid,
                                agent_uid=command.agent_uid or "",
                                printer_name=p_name,
                                ip=ip,
                                event_time=now_ts,
                                touch_seen=True,
                                mark_online_on_create=bool(p_item.get("is_online", True)),
                                mac_address=mac,
                                auth_user=str(p_item.get("auth_user") or p_item.get("user") or ""),
                                auth_password=str(p_item.get("auth_password") or p_item.get("pass") or ""),
                            )
                            added_count += 1
                        session.flush()
                        LOGGER.info("[polling_control_result] Upserted %d printers for lead=%s agent=%s (is_scan=%s) in VPS DB", added_count, lead, command.agent_uid, is_subnet_scan)

                    try:
                        import json as _json
                        cp = _json.loads(command.command_params or "{}")
                        action = cp.get("action", "")
                    except Exception:
                        action = ""
                        
                    if action == "scan_cameras":
                        address_book_data = body.get("address_book_data")
                        if isinstance(address_book_data, dict):
                            cameras_data = address_book_data.get("cameras_data")
                            if isinstance(cameras_data, list):
                                agent = session.execute(
                                    select(AgentNode)
                                    .where(AgentNode.agent_uid == command.agent_uid)
                                    .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
                                ).scalars().first()
                                lan_uid_val = agent.lan_uid if agent else lan_uid
                                
                                for item in cameras_data:
                                    if not isinstance(item, dict):
                                        continue
                                    ip = _to_text(item.get("ip"))
                                    mac = _to_text(item.get("mac_address")) or _to_text(item.get("mac"))
                                    camera_name = _to_text(item.get("camera_name")) or f"Camera {ip}"
                                    manufacturer = _to_text(item.get("manufacturer")) or "Generic"
                                    model = _to_text(item.get("model")) or "Camera IP"
                                    rtsp_url = _to_text(item.get("rtsp_url")) or f"rtsp://{ip}:554/cam/realmonitor?channel=1&subtype=0"
                                    is_online = bool(item.get("is_online", True))
                                    
                                    existed_cam = None
                                    if mac:
                                        existed_cam = session.execute(
                                            select(CameraConfig).where(CameraConfig.lead == lead, CameraConfig.agent_uid == command.agent_uid, CameraConfig.mac_address == mac)
                                        ).scalars().first()
                                    if not existed_cam and ip:
                                        existed_cam = session.execute(
                                            select(CameraConfig).where(CameraConfig.lead == lead, CameraConfig.agent_uid == command.agent_uid, CameraConfig.ip == ip)
                                        ).scalars().first()
                                        
                                    if existed_cam:
                                        if existed_cam.rtsp_url and existed_cam.ip and existed_cam.ip != ip:
                                            existed_cam.rtsp_url = existed_cam.rtsp_url.replace(existed_cam.ip, ip)
                                        elif not existed_cam.rtsp_url:
                                            existed_cam.rtsp_url = rtsp_url
                                        existed_cam.ip = ip
                                        if mac:
                                            existed_cam.mac_address = mac
                                        existed_cam.manufacturer = manufacturer
                                        existed_cam.model = model
                                        existed_cam.is_online = is_online
                                    else:
                                        new_cam = CameraConfig(
                                            lead=lead,
                                            lan_uid=lan_uid_val,
                                            agent_uid=command.agent_uid,
                                            camera_name=camera_name,
                                            ip=ip,
                                            mac_address=mac,
                                            manufacturer=manufacturer,
                                            model=model,
                                            rtsp_url=rtsp_url,
                                            is_online=is_online,
                                            is_recording=False
                                        )
                                        session.add(new_cam)

                    # Update Printer.address_book_sync in PostgreSQL if trigger_utility returns address_book_data or JSON block
                    abd = body.get("address_book_data") or body.get("result_payload")
                    
                    # Search for __ADDRESS_BOOK_JSON_START__ in all string fields
                    if not abd or not (isinstance(abd, dict) and "address_list" in abd):
                        for field_val in (body.get("output"), body.get("result"), body.get("result_payload"), body.get("error_message"), body.get("stdout")):
                            if field_val and isinstance(field_val, str) and "__ADDRESS_BOOK_JSON_START__" in field_val:
                                try:
                                    json_str = field_val.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].strip()
                                    parsed_json = json.loads(json_str)
                                    if isinstance(parsed_json, dict) and "address_list" in parsed_json:
                                        abd = parsed_json
                                        break
                                except Exception as json_exc:
                                    LOGGER.warning("[polling_control_result] Failed to parse __ADDRESS_BOOK_JSON_START__: %s", json_exc)

                    if isinstance(abd, str) and abd.strip().startswith("{"):
                        try: abd = json.loads(abd)
                        except Exception: pass

                    if isinstance(abd, dict) and "address_list" in abd:
                        # Extract target MAC & IP
                        target_ip = command.ip
                        target_mac = ""
                        if command.command_params:
                            try:
                                cp = json.loads(command.command_params)
                                target_mac = _to_text(cp.get("mac_address") or cp.get("mac_id") or cp.get("printer_mac_id") or cp.get("mac"))
                                if not target_ip:
                                    target_ip = _to_text(cp.get("printer_ip") or cp.get("ip"))
                            except Exception: pass

                        norm_mac = _normalize_mac(target_mac) if target_mac else ""

                        if not norm_mac and target_ip:
                            dev_info = session.execute(select(DeviceInfor).where(DeviceInfor.ip == target_ip)).scalars().first()
                            if dev_info and dev_info.mac_id:
                                norm_mac = _normalize_mac(dev_info.mac_id)

                        if norm_mac and (not target_ip or target_ip == "0.0.0.0"):
                            p_row = session.execute(select(Printer).where(or_(Printer.mac_address == norm_mac, Printer.mac_id == norm_mac))).scalars().first()
                            if p_row and p_row.ip and p_row.ip != "0.0.0.0":
                                target_ip = p_row.ip
                            else:
                                dev_info = session.execute(select(DeviceInfor).where(DeviceInfor.mac_id == norm_mac)).scalars().first()
                                if dev_info and dev_info.ip and dev_info.ip != "0.0.0.0":
                                    target_ip = dev_info.ip

                        # Update ONLY ScanPoint table in PostgreSQL DB
                        if norm_mac:
                            try:
                                sp_rec = session.get(ScanPoint, norm_mac)
                                clean_ip = target_ip.strip() if target_ip else ""
                                p_name = command.printer_name if (command.printer_name and command.printer_name != "Photocopy") else ""
                                if sp_rec is None:
                                    if clean_ip and clean_ip != "0.0.0.0":
                                        sp_rec = ScanPoint(
                                            mac_id=norm_mac,
                                            printer_name=p_name or "Photocopy",
                                            ip=clean_ip,
                                            agent_uid=command.agent_uid or "",
                                            address_book_data=abd,
                                            status="success",
                                            created_at=datetime.now(timezone.utc),
                                            updated_at=datetime.now(timezone.utc)
                                        )
                                        session.add(sp_rec)
                                        LOGGER.info("[polling_control_result] Persisted ScanPoint to PostgreSQL for mac_id=%s with ip=%s", norm_mac, clean_ip)
                                    else:
                                        LOGGER.error("[polling_control_result] CANNOT create ScanPoint without valid IP for MAC %s!", norm_mac)
                                else:
                                    sp_rec.address_book_data = abd
                                    if clean_ip and clean_ip != "0.0.0.0":
                                        sp_rec.ip = clean_ip
                                    if p_name:
                                        sp_rec.printer_name = p_name
                                    if command.agent_uid:
                                        sp_rec.agent_uid = command.agent_uid
                                    sp_rec.updated_at = datetime.now(timezone.utc)
                                    LOGGER.info("[polling_control_result] Updated ScanPoint in PostgreSQL for mac_id=%s (ip=%s)", norm_mac, sp_rec.ip)
                            except Exception as sp_err:
                                LOGGER.warning("[polling_control_result] Failed to persist ScanPoint: %s", sp_err)

                        command.error_message = json.dumps(abd, ensure_ascii=False)
                else:
                    try:
                        import json as _json
                        cmd_params = _json.loads(command.command_params) if command.command_params else {}
                        retry_count = int(cmd_params.get("retry_count", 0))
                        if retry_count < 3:
                            cmd_params["retry_count"] = retry_count + 1
                            command.command_params = _json.dumps(cmd_params, ensure_ascii=False)
                            command.status = "pending"
                            command.error_message = ""
                            command.requested_at = datetime.now(timezone.utc)
                            command.responded_at = None
                        else:
                            command.status = "failed"
                            if is_list_scan_cmd and not has_address_book_json:
                                command.error_message = (error_message or "").strip() + "\n[-] LỖI THỰC THI QUÉT DANH BẠ: Không nhận được dữ liệu danh bạ từ máy in (Kết nối bị gián đoạn, Timeout hoặc WIM không phản hồi)!"
                            else:
                                command.error_message = f"(Đã thử lại {retry_count} lần) " + (error_message or "Agent command failed")
                            command.responded_at = responded_at
                    except Exception:
                        command.status = "failed"
                        if is_list_scan_cmd and not has_address_book_json:
                            command.error_message = (error_message or "").strip() + "\n[-] LỖI THỰC THI QUÉT DANH BẠ: Không nhận được dữ liệu danh bạ từ máy in (Kết nối bị gián đoạn, Timeout hoặc WIM không phản hồi)!"
                        else:
                            command.error_message = error_message or "Agent command failed"
                        command.responded_at = responded_at
            else:
                if ok_value:
                    command.status = "success"
                    if error_message:
                        command.error_message = error_message
                    command.responded_at = responded_at
                    
                    if command.command_type == "save_printer_auth" and printer is not None:
                        import json as _json
                        try:
                            cp = _json.loads(command.command_params or "{}")
                            printer.auth_user = cp.get("auth_user", command.auth_user)
                            printer.auth_password = cp.get("auth_password", command.auth_password)
                            printer.user = printer.auth_user
                            printer.password = printer.auth_password
                        except Exception:
                            pass
                            
                    if printer is not None:
                        _apply_printer_enabled_state(session, printer, bool(command.desired_enabled), responded_at)
                else:
                    try:
                        import json as _json
                        cmd_params = _json.loads(command.command_params) if command.command_params else {}
                        retry_count = int(cmd_params.get("retry_count", 0))
                        if retry_count < 3:
                            cmd_params["retry_count"] = retry_count + 1
                            command.command_params = _json.dumps(cmd_params, ensure_ascii=False)
                            command.status = "pending"
                            command.error_message = ""
                            command.requested_at = datetime.now(timezone.utc)
                            command.responded_at = None
                        else:
                            command.status = "failed"
                            command.error_message = f"(Đã thử lại {retry_count} lần) " + (error_message or "Agent command failed")
                            command.responded_at = responded_at
                    except Exception:
                        command.status = "failed"
                        command.error_message = error_message or "Agent command failed"
                        command.responded_at = responded_at
            
            # If the command succeeded and is of type trigger_utility (change_agent_ip or get_agent_ip), update IP & trigger workflow
            if command.status == "success" and command.command_type == "trigger_utility":
                try:
                    import json as _json
                    cp = _json.loads(command.command_params or "{}")
                    cmd_name = cp.get("command")
                    if cmd_name in ["change_agent_ip", "get_agent_ip"]:
                        target_ip = cp.get("target_ip") or cp.get("ip") or ""
                        new_ip_raw = str(command.error_message or error_message or body.get("result_payload") or body.get("output") or "")
                        import re
                        ip_match = re.search(r"(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})", new_ip_raw)
                        parsed_ip = ip_match.group(1) if ip_match else target_ip

                        if parsed_ip:
                            ip_rec = session.execute(
                                select(IPData).where(IPData.agent_name == command.agent_uid)
                            ).scalars().first()
                            
                            agent_node = session.execute(
                                select(AgentNode).where(AgentNode.agent_uid == command.agent_uid).order_by(AgentNode.last_seen_at.desc())
                            ).scalars().first()

                            old_ip = (ip_rec.ip if ip_rec and ip_rec.ip else "") or (agent_node.local_ip if agent_node else "")

                            if old_ip and old_ip != parsed_ip:
                                LOGGER.info("[polling_control_result] IP change detected via %s for %s: %s -> %s. Triggering workflow...", cmd_name, command.agent_uid, old_ip, parsed_ip)
                                from utils import trigger_ip_change_workflow
                                trigger_ip_change_workflow(session, command.lead or "default", command.lan_uid or "default", command.agent_uid, old_ip, parsed_ip)

                            if agent_node:
                                agent_node.local_ip = parsed_ip
                                agent_node.updated_at = datetime.now(timezone.utc)
                            
                            if ip_rec is None:
                                ip_rec = IPData(
                                    agent_uid=command.agent_uid,
                                    lan_uid=command.lan_uid or "default",
                                    agent_name=command.agent_uid,
                                    ip=parsed_ip,
                                    created_at=datetime.now(timezone.utc),
                                    updated_at=datetime.now(timezone.utc)
                                )
                                session.add(ip_rec)
                            else:
                                ip_rec.ip = parsed_ip
                                ip_rec.updated_at = datetime.now(timezone.utc)

                            # Update in-memory ACTIVE_AGENTS registry for real-time frontend update
                            from active_agents_registry import ACTIVE_AGENTS
                            agent_entry = ACTIVE_AGENTS.get(command.agent_uid)
                            if agent_entry:
                                agent_entry["local_ip"] = parsed_ip
                                agent_entry["last_seen_at"] = datetime.now(timezone.utc)
                            LOGGER.info("[polling_control_result] Updated AgentNode/IPData/ACTIVE_AGENTS local_ip via %s: %s", cmd_name, parsed_ip)
                    
                    if cmd_name in ["toshiba_change_ftp", "ricoh_change_ftp"]:
                        try:
                            t_id = str(cp.get("target_id") or cp.get("entry_id") or "").strip().lstrip("0")
                            t_name = str(cp.get("target_name") or "").strip().lower()
                            o_ip = str(cp.get("old_ip") or "").strip()
                            n_ip = str(cp.get("new_ip") or "").strip()
                            p_mac = _to_text(cp.get("mac_address") or cp.get("mac_id") or cp.get("printer_mac_id"))
                            norm_mac = _normalize_mac(p_mac) if p_mac else ""
                            if not norm_mac and command.ip:
                                d_info = session.execute(select(DeviceInfor).where(DeviceInfor.ip == command.ip)).scalars().first()
                                if d_info and d_info.mac_id:
                                    norm_mac = _normalize_mac(d_info.mac_id)

                            if norm_mac and n_ip:
                                sp_row = session.get(ScanPoint, norm_mac)
                                if sp_row and sp_row.address_book_data:
                                    s_abd = dict(sp_row.address_book_data)
                                    s_list = list(s_abd.get("address_list") or [])
                                    s_mod = False
                                    for entry in s_list:
                                        if not isinstance(entry, dict) or entry.get("type") == "Summary":
                                            continue
                                        e_reg = str(entry.get("registration_no") or "").strip().lstrip("0")
                                        e_eid = str(entry.get("entry_id") or "").strip().lstrip("0")
                                        e_nm = str(entry.get("name") or "").strip().lower()

                                        is_match = False
                                        if t_id and (e_reg == t_id or e_eid == t_id):
                                            is_match = True
                                        elif t_name and e_nm == t_name:
                                            is_match = True

                                        if is_match:
                                            entry["server_host"] = n_ip
                                            old_f = str(entry.get("folder") or "")
                                            if o_ip and o_ip in old_f:
                                                new_f = old_f.replace(o_ip, n_ip)
                                            elif "ftp://" in old_f:
                                                c_nm = (t_name or entry.get("name") or "scan").strip("/\\")
                                                new_f = f"ftp://{n_ip}:2130/{c_nm}/"
                                            elif ":/" in old_f:
                                                c_nm = (t_name or entry.get("name") or "scan").strip("/\\")
                                                new_f = f"{n_ip}:/{c_nm}"
                                            else:
                                                c_nm = (t_name or entry.get("name") or "scan").strip("/\\")
                                                new_f = f"ftp://{n_ip}:2130/{c_nm}/"

                                            entry["folder"] = new_f
                                            if "folder_path" in entry: entry["folder_path"] = new_f
                                            if "physical_path" in entry: entry["physical_path"] = new_f
                                            entry["folder_port_no"] = "2130"
                                            entry["protocol"] = "FTP"
                                            s_mod = True
                                            LOGGER.info("[polling_control_result] Backend replaced ScanPoint old IP for %s: %s -> %s", norm_mac, old_f, new_f)

                                    if s_mod:
                                        s_abd["address_list"] = s_list
                                        sp_row.address_book_data = s_abd
                                        sp_row.updated_at = datetime.now(timezone.utc)
                                        session.flush()
                        except Exception as sp_sync_err:
                            LOGGER.warning("[polling_control_result] Backend scanpoint update error: %s", sp_sync_err)
                except Exception as refresh_err:
                    LOGGER.error("[polling_control_result] Failed to update AgentNode/memory local_ip: %s", refresh_err)

            # Auto-resolve when_ip_change parent if this command is a child of one
            try:
                from utils import try_resolve_when_ip_change_parent
                try_resolve_when_ip_change_parent(session, command.id)
            except Exception as resolve_exc:
                LOGGER.warning("[polling_control_result] resolve parent error: %s", resolve_exc)
            
            # Delete check_scan_ip_match and automatic utility commands to prevent DB bloating
            if command.command_type == "trigger_utility" and command.command_params:
                if "check_scan_ip_match" in command.command_params:
                    session.delete(command)
            
            session.commit()

        return jsonify(
            {
                "ok": True,
                "id": int(command_id),
                "status": "success" if ok_value else "failed",
                "responded_at": responded_at.isoformat(),
            }
        )

    @app.post("/api/polling/control-result")
    def polling_control_result() -> Any:
        try:
            return _execute_polling_control_result()
        except Exception as exc:
            LOGGER.error("[polling_control_result] Critical unhandled error: %s", exc, exc_info=True)
            try:
                body = request.get_json(silent=True) or {}
                command_id = _to_int(body.get("command_id")) if isinstance(body, dict) else None
                if command_id:
                    with session_factory() as err_session:
                        err_cmd = err_session.get(PrinterControlCommand, int(command_id))
                        if err_cmd and err_cmd.status in ("pending", "processing"):
                            err_cmd.status = "failed"
                            err_cmd.error_message = f"[-] Lỗi máy chủ khi tiếp nhận kết quả: {str(exc)}"
                            err_cmd.responded_at = datetime.now(timezone.utc)
                            err_session.commit()
                            LOGGER.info("[polling_control_result] Auto-marked command #%d as failed in DB due to server error", command_id)
            except Exception as commit_err:
                LOGGER.error("[polling_control_result] Failed to mark command as failed: %s", commit_err)
            return jsonify({"ok": False, "error": f"Lỗi máy chủ khi xử lý kết quả: {str(exc)}"}), 500


    @app.post("/api/polling/command-ack")
    def polling_command_ack() -> Any:
        if is_ingest_only:
            return jsonify({"ok": False, "error": "Command ack is disabled on Ingest server. Handled by Control Plane on Port 8005."}), 404
        body = request.get_json(silent=True) or {}
        if not isinstance(body, dict):
            return jsonify({"ok": False, "error": "Invalid JSON body"}), 400
        sent_token = _request_api_token()
        ok_auth, lead, auth_error = _validate_polling_auth(body, lead_key_map, sent_token)
        if not ok_auth:
            return auth_error

        command_id = _to_int(body.get("command_id"))
        if command_id is None or command_id <= 0:
            return jsonify({"ok": False, "error": "Missing command_id"}), 400

        with session_factory() as session:
            command = session.get(PrinterControlCommand, int(command_id))
            if command is None:
                return jsonify({"ok": True, "error": "Command not found (assumed already processed)"}), 200
            if command.lead != lead:
                return jsonify({"ok": False, "error": "Lead mismatch"}), 400
            
            if command.status == "pending":
                now_utc = datetime.now(timezone.utc)
                if command.received_at is None:
                    command.received_at = now_utc
                # trigger_utility commands are fire-and-forget: mark done on first ACK
                # to prevent the agent from re-executing them on every poll cycle
                if command.command_type == "trigger_utility":
                    command.status = "processing"
                    command.received_at = now_utc
                session.commit()

            return jsonify(
                {
                    "ok": True,
                    "id": int(command_id),
                    "received_at": command.received_at.isoformat() if command.received_at else None,
                }
            )

    @app.post("/api/polling/command-progress")
    def polling_command_progress() -> Any:
        """Agent sends intermediate progress text for a pending command.
        Stored in error_message field while status is still 'pending'.
        Frontend polls GET /api/commands/{id}/status and reads progress_text."""
        if is_ingest_only:
            return jsonify({"ok": False, "error": "Command progress is disabled on Ingest server. Handled by Control Plane on Port 8005."}), 404
        body = request.get_json(silent=True) or {}
        if not isinstance(body, dict):
            return jsonify({"ok": False, "error": "Invalid JSON body"}), 400
        sent_token = _request_api_token()
        ok_auth, lead, auth_error = _validate_polling_auth(body, lead_key_map, sent_token)
        if not ok_auth:
            return auth_error

        command_id = _to_int(body.get("command_id"))
        if command_id is None or command_id <= 0:
            return jsonify({"ok": False, "error": "Missing command_id"}), 400

        progress_text = _to_text(body.get("progress_text"))

        with session_factory() as session:
            command = session.get(PrinterControlCommand, int(command_id))
            if command is None:
                return jsonify({"ok": True, "error": "Command not found (assumed already processed)"}), 200
            if command.lead != lead:
                return jsonify({"ok": False, "error": "Lead mismatch"}), 400

            if command.status == "pending":
                command.error_message = progress_text
                session.commit()

            return jsonify({"ok": True, "id": int(command_id), "progress_text": progress_text})

    @app.post("/api/polling/inventory")
    def ingest_inventory() -> Any:
        body = request.get_json(silent=True) or {}
        if not isinstance(body, dict):
            LOGGER.warning("inventory: invalid json body from %s", request.remote_addr)
            return jsonify({"ok": False, "error": "Invalid JSON body"}), 400
        sent_token = _request_api_token()
        ok_auth, lead, auth_error = _validate_polling_auth(body, lead_key_map, sent_token)
        if not ok_auth:
            LOGGER.warning("inventory: unauthorized lead=%s ip=%s", _to_text(body.get("lead")), request.remote_addr)
            return auth_error

        with session_factory() as session:
            lan_uid, _ = _resolve_lan_uid_with_session(session, lead, body)
            agent_uid = _to_text(body.get("agent_uid")) or "legacy-agent"
            hostname = _to_text(body.get("hostname"))
            local_ip = _to_text(body.get("local_ip"))
            local_mac = _to_text(body.get("local_mac"))
            app_version = _to_text(body.get("app_version"))
            run_mode = _to_text(body.get("run_mode")) or "web"
            web_port = _to_int(body.get("web_port")) or 9173
            ftp_ports = _to_text(body.get("ftp_ports"))
            ftp_sites = body.get("ftp_sites") if isinstance(body.get("ftp_sites"), list) else None
            timestamp = _parse_timestamp(body.get("timestamp"))
            devices = body.get("devices") if isinstance(body.get("devices"), list) else []
            inserted = 0
            updated = 0
            _refresh_stale_agent_offline(session=session, lead=lead, stale_seconds=ONLINE_STALE_SECONDS)
            _upsert_lan_and_agent(
                session=session,
                lead=lead,
                lan_uid=lan_uid,
                agent_uid=agent_uid,
                lan_name="",
                subnet_cidr="",
                gateway_ip="",
                gateway_mac="",
                hostname=hostname,
                local_ip=local_ip,
                local_mac=local_mac,
                app_version=app_version,
                run_mode=run_mode,
                web_port=web_port,
                ftp_ports=ftp_ports,
                ftp_sites=ftp_sites,
            )
            from active_agents_registry import update_agent_in_memory
            update_agent_in_memory(
                lead=lead,
                lan_uid=lan_uid,
                agent_uid=agent_uid,
                hostname=hostname,
                local_ip=local_ip,
                local_mac=local_mac,
                app_version=app_version,
                run_mode=run_mode,
                web_port=web_port,
                devices_list=devices,
            )
            for item in devices:
                if not isinstance(item, dict):
                    continue
                printer_name = _to_text(item.get("printer_name")) or _to_text(item.get("name"))
                ip = _to_text(item.get("ip"))
                mac_address = _normalize_mac(_to_text(item.get("mac_address") or item.get("mac_id")))
                if not mac_address and not ip:
                    continue  # Skip printers without both MAC and IP
                is_online = _to_text(item.get("status")).lower() != "offline"
                _upsert_printer_from_polling(
                    session=session,
                    lead=lead,
                    lan_uid=lan_uid,
                    agent_uid=agent_uid,
                    printer_name=printer_name,
                    ip=ip,
                    event_time=timestamp,
                    touch_seen=is_online,
                    mark_online_on_create=is_online,
                    mac_address=mac_address,
                    auth_user=_to_text(item.get("auth_user") or item.get("user")),
                    auth_password=_to_text(item.get("auth_password") or item.get("password")),
                )

                # Also upsert DeviceInfor table to keep in sync
                try:
                    d_stmt = select(DeviceInfor).where(DeviceInfor.lead == lead)
                    if mac_address:
                        from sqlalchemy import func
                        d_stmt = d_stmt.where(func.upper(DeviceInfor.mac_id) == mac_address.upper())
                    elif ip:
                        d_stmt = d_stmt.where(DeviceInfor.ip == ip)
                    else:
                        d_stmt = None
                    if d_stmt is not None:
                        d_obj = session.execute(d_stmt).scalars().first()
                        if d_obj:
                            if ip:
                                d_obj.ip = ip
                            if mac_address:
                                d_obj.mac_id = mac_address
                            if printer_name:
                                d_obj.printer_name = printer_name
                            d_obj.agent_uid = agent_uid
                            if lan_uid:
                                d_obj.lan_uid = lan_uid
                            d_obj.updated_at = timestamp
                        else:
                            d_obj = DeviceInfor(
                                lead=lead,
                                lan_uid=lan_uid,
                                agent_uid=agent_uid,
                                mac_id=mac_address,
                                ip=ip,
                                printer_name=printer_name or "Unknown Printer",
                                counter_data={},
                                status_data={},
                                updated_at=timestamp,
                            )
                            session.add(d_obj)
                except Exception as d_err:
                    LOGGER.debug("DeviceInfor upsert error: %s", d_err)

                updated += 1
            # Mark printers not in the new inventory as offline
            pushed_macs = {_normalize_mac(_to_text(item.get("mac_address") or item.get("mac_id"))) for item in devices if isinstance(item, dict)}
            pushed_macs.discard("")
            if pushed_macs:
                from sqlalchemy import func
                existing_printers = session.execute(
                    select(Printer).where(
                        Printer.lead == lead,
                        Printer.lan_uid == lan_uid,
                        Printer.agent_uid == agent_uid,
                        Printer.is_online.is_(True),
                    )
                ).scalars().all()
                for ep in existing_printers:
                    ep_mac = _normalize_mac(_to_text(ep.mac_address))
                    if ep_mac and ep_mac not in pushed_macs:
                        _set_printer_online_state(session, ep, False, timestamp)

            # Ingest cameras inventory
            cameras = body.get("cameras") if isinstance(body.get("cameras"), list) else []
            
            # Save raw live payload to json file (so we get live results directly without database records)
            import json
            from pathlib import Path
            storage_dir = Path("storage")
            storage_dir.mkdir(parents=True, exist_ok=True)
            live_file = storage_dir / f"live_cameras_{agent_uid}.json"
            try:
                payload_data = {
                    "cameras": cameras,
                    "configs": body.get("configs") if isinstance(body.get("configs"), list) else []
                }
                with open(live_file, "w", encoding="utf-8") as f:
                    json.dump(payload_data, f, indent=2, ensure_ascii=False)
            except Exception as e:
                LOGGER.error("Failed to save live cameras JSON: %s", e)

            try:
                session.commit()
            except Exception as commit_err:
                session.rollback()
                LOGGER.error("Failed to commit inventory session: %s", commit_err)

        LOGGER.info(
            "inventory: lead=%s lan=%s agent=%s devices=%s inserted=%s updated=%s",
            lead,
            lan_uid,
            agent_uid,
            len(devices),
            inserted,
            updated,
        )
        return jsonify(
            {
                "ok": True,
                "lead": lead,
                "lan_uid": lan_uid,
                "agent_uid": agent_uid,
                "devices": len(devices),
                "inserted": inserted,
                "updated": updated,
            }
        )

    @app.get("/api/scan-uploads")
    def list_scan_uploads() -> Any:
        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead({"lead": request.args.get("lead")}, lead_key_map, sent_token)
        if not ok_auth:
            return auth_error

        limit = _to_int(request.args.get("limit")) or 200
        limit = max(1, min(limit, 1000))
        root = SCAN_UPLOAD_ROOT / _safe_path_token(lead_valid)
        rows: list[dict[str, Any]] = []
        if root.exists():
            files = [p for p in root.rglob("*") if p.is_file()]
            files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
            for pth in files[:limit]:
                try:
                    st = pth.stat()
                except Exception:
                    continue
                rel = str(pth.relative_to(SCAN_UPLOAD_ROOT).as_posix())
                rows.append({
                    "path": rel,
                    "file_name": pth.name,
                    "size": int(getattr(st, "st_size", 0) or 0),
                    "mtime": datetime.fromtimestamp(st.st_mtime, timezone.utc).isoformat(),
                })
        return jsonify({"ok": True, "lead": lead_valid, "rows": rows})

    @app.post("/api/polling/scan-upload")
    def ingest_scan_upload() -> Any:
        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead(
            {"lead": request.form.get("lead")},
            lead_key_map,
            sent_token,
        )
        if not ok_auth:
            return auth_error

        upload = request.files.get("file")
        if upload is None:
            return jsonify({"ok": False, "error": "Missing file"}), 400

        original_name = secure_filename(upload.filename or "scan.bin")
        if not original_name:
            original_name = "scan.bin"

        lan_uid = _safe_path_token(_to_text(request.form.get("lan_uid")) or "legacy-lan")
        agent_uid = _safe_path_token(_to_text(request.form.get("agent_uid")) or "legacy-agent")
        hostname = _to_text(request.form.get("hostname"))
        local_ip = _to_text(request.form.get("local_ip"))
        source_path = _to_text(request.form.get("source_path"))
        source_root = _to_text(request.form.get("source_root"))
        source_root_label = _safe_path_token(_to_text(request.form.get("source_root_label")) or "scan-root")
        source_relative_parts = _safe_relative_path_parts(request.form.get("source_relative_path"))
        fingerprint = _to_text(request.form.get("fingerprint"))
        event_time = _parse_timestamp(request.form.get("timestamp"))

        if source_relative_parts:
            sync_mode = "mirror"
            dest_name = source_relative_parts[-1]
            target_dir = SCAN_UPLOAD_ROOT / _safe_path_token(lead_valid) / lan_uid / agent_uid
            for part in source_relative_parts[:-1]:
                target_dir = target_dir / part
            target_dir.mkdir(parents=True, exist_ok=True)
            dest_path = target_dir / dest_name
            drive_remote_parts = [_safe_path_token(lead_valid), lan_uid, agent_uid, *source_relative_parts]
        else:
            sync_mode = "append"
            date_folder = event_time.astimezone(UI_TZ).strftime("%Y%m%d")
            target_dir = SCAN_UPLOAD_ROOT / _safe_path_token(lead_valid) / lan_uid / agent_uid / date_folder
            target_dir.mkdir(parents=True, exist_ok=True)

            stamp = event_time.astimezone(UI_TZ).strftime("%H%M%S")
            digest_seed = f"{fingerprint}|{source_path}|{event_time.isoformat()}|{original_name}"
            digest = hashlib.sha1(digest_seed.encode("utf-8")).hexdigest()[:10]
            dest_name = f"{stamp}_{digest}_{original_name}"
            dest_path = target_dir / dest_name
            index = 1
            while dest_path.exists():
                dest_path = target_dir / f"{stamp}_{digest}_{index}_{original_name}"
                index += 1
            drive_remote_parts = [_safe_path_token(lead_valid), lan_uid, agent_uid, date_folder, dest_path.name]

        temp_path = target_dir / f".upload-{time_module.time_ns()}-{dest_name}"
        upload.save(temp_path)
        temp_path.replace(dest_path)
        file_size = int(dest_path.stat().st_size if dest_path.exists() else 0)
        relative_path = str(dest_path.as_posix())

        # Replicate to public static folder for Dropbox-style direct web access
        try:
            import shutil
            original_folder_name = "default"
            if source_root:
                # Handle both Windows backslash and Posix forward slash
                source_root_clean = source_root.replace("\\", "/")
                original_folder_name = Path(source_root_clean).name or "default"
            
            safe_lan_uid = _safe_path_token(lan_uid)
            safe_folder_name = _safe_path_token(original_folder_name)
            static_scans_dir = Path("static/scans") / safe_lan_uid / safe_folder_name
            static_scans_dir.mkdir(parents=True, exist_ok=True)
            static_scans_path = static_scans_dir / dest_path.name
            shutil.copy2(dest_path, static_scans_path)
            LOGGER.info("Replicated scan to public static path: %s", static_scans_path)
            
            # Save metadata file with upload stats
            try:
                meta_path = static_scans_path.with_name(f"{static_scans_path.name}.meta.json")
                upload_completed_at = datetime.now(timezone.utc)
                duration_seconds = (upload_completed_at - event_time).total_seconds()
                if duration_seconds < 0:
                    duration_seconds = 0.0
                
                meta_data = {
                    "upload_started_at": event_time.isoformat(),
                    "upload_completed_at": upload_completed_at.isoformat(),
                    "upload_duration": round(duration_seconds, 2),
                    "client_ip": local_ip or "",
                    "hostname": hostname or "",
                }
                with open(meta_path, "w", encoding="utf-8") as meta_f:
                    json.dump(meta_data, meta_f, ensure_ascii=False, indent=2)
                LOGGER.info("Saved scan upload metadata to: %s", meta_path)
            except Exception as meta_exc:
                LOGGER.warning("Failed to save scan upload metadata: %s", meta_exc)
        except Exception as static_exc:
            LOGGER.warning("Failed to replicate scan to static/scans directory: %s", static_exc)

        drive_sync_payload = drive_sync.disabled_result().as_dict()
        if drive_sync.enabled:
            try:
                drive_sync_result = drive_sync.upload_scan(
                    dest_path,
                    remote_parts=drive_remote_parts,
                    source_path=source_path,
                )
                drive_sync_payload = drive_sync_result.as_dict()
            except Exception as exc:  # noqa: BLE001
                drive_sync_payload = {"enabled": True, "ok": False, "error": str(exc)}
                LOGGER.warning(
                    "scan-upload drive sync failed: lead=%s lan=%s agent=%s file=%s error=%s",
                    lead_valid,
                    lan_uid,
                    agent_uid,
                    relative_path,
                    exc,
                )

        LOGGER.info(
            "scan-upload: lead=%s lan=%s agent=%s host=%s ip=%s file=%s size=%s source=%s source_root=%s mode=%s drive_ok=%s",
            lead_valid,
            lan_uid,
            agent_uid,
            hostname,
            local_ip,
            relative_path,
            file_size,
            source_path,
            source_root,
            sync_mode,
            drive_sync_payload.get("ok", False),
        )
        return jsonify(
            {
                "ok": True,
                "lead": lead_valid,
                "lan_uid": lan_uid,
                "agent_uid": agent_uid,
                "path": relative_path,
                "size": file_size,
                "timestamp": event_time.isoformat(),
                "sync_mode": sync_mode,
                "source_root": source_root,
                "source_root_label": source_root_label,
                "source_relative_path": "/".join(source_relative_parts),
                "drive_sync": drive_sync_payload,
            }
        )


