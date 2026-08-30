from __future__ import annotations

import hashlib
import json
import logging
import time as time_module
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from sqlalchemy import select

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
from models import Printer, PrinterControlCommand, ScanEmailAlias, AgentNode, AgentPresenceLog, DeviceInfor

LOGGER = logging.getLogger(__name__)

SCAN_UPLOAD_ROOT = Path("storage/uploads/scans")


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

    @app.get("/api/polling/controls")
    def polling_controls() -> Any:
        agent_uid = _to_text(request.args.get("agent_uid"))
        sent_token = _request_api_token()
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
                    "hostname": "",
                    "local_ip": "",
                    "gateway_ip": _to_text(request.args.get("gateway_ip")),
                    "gateway_mac": _to_text(request.args.get("gateway_mac")),
                },
            )

            # Heartbeat update: refresh last_seen_at and is_online since controls check-in is the most frequent agent activity
            now = datetime.now(timezone.utc)
            agent = session.execute(
                select(AgentNode).where(
                    AgentNode.lead == lead_valid,
                    AgentNode.lan_uid == lan_uid,
                    AgentNode.agent_uid == agent_uid
                )
            ).scalar_one_or_none()
            if agent:
                agent.last_seen_at = now
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

            from active_agents_registry import update_agent_in_memory, ACTIVE_AGENTS
            client_pub_ip = request.headers.get("X-Forwarded-For", request.remote_addr or "").split(",")[0].strip()
            update_agent_in_memory(
                lead=lead_valid,
                lan_uid=lan_uid,
                agent_uid=agent_uid,
                hostname=agent.hostname if agent else "",
                local_ip=agent.local_ip if agent else "",
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

            stmt = select(Printer).where(Printer.lead == lead_valid, Printer.lan_uid == lan_uid).order_by(Printer.id.asc())
            if agent_uid:
                cmd_subq = (
                    select(PrinterControlCommand.printer_id)
                    .where(
                        PrinterControlCommand.lead == lead_valid,
                        PrinterControlCommand.lan_uid == lan_uid,
                        PrinterControlCommand.agent_uid == agent_uid,
                        PrinterControlCommand.status == "pending",
                    )
                )
                stmt = stmt.where(
                    or_(
                        Printer.agent_uid == agent_uid,
                        Printer.id.in_(cmd_subq)
                    )
                )
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

        return jsonify(
            {
                "ok": True,
                "lead": lead_valid,
                "lan_uid": lan_uid,
                "agent_uid": agent_uid,
                "request_inventory_push": req_push,
                "agent_commands": agent_commands_serialized,
                "rows": [
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
                ],
            }
        )

    @app.post("/api/polling/address-book-sync")
    def polling_address_book_sync() -> Any:
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
                from models import ScanPoint
                from sqlalchemy import delete
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
                        printer_ip = _to_text(item.get("ip") or item.get("printer_ip"))
                        
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
        printer_ip = _to_text(body.get("printer_ip") or body.get("ip"))
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
            from models import ScanPoint
            from sqlalchemy import delete
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

    @app.post("/api/polling/control-result")
    def polling_control_result() -> Any:
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
                            from models import ScanPoint
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
                                if sp_rec is None:
                                    sp_rec = ScanPoint(
                                        mac_id=target_mac,
                                        printer_name=printer.printer_name if printer else (command.printer_name or "Photocopy"),
                                        ip=target_ip,
                                        agent_uid=command.agent_uid or "",
                                        address_book_data=sync_data,
                                        status="success"
                                    )
                                    session.add(sp_rec)
                                else:
                                    sp_rec.address_book_data = sync_data
                                    sp_rec.updated_at = datetime.now(timezone.utc)
                                session.flush()
                                LOGGER.info("[polling_control_result] Updated ScanPoint PostgreSQL table for mac_id=%s", target_mac)
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
                                from models import ScanPoint
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
                        
                        if retry_count < 2:
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

                has_error_kw = any(err in (error_message or "") for err in ["[-] LỖI THỰC THI:", "[❌ LỖI CRITICAL", "SyntaxError:", "IndentationError:"])
                if isinstance(raw_payload, list) or ok_value or not has_error_kw:
                    command.status = "success"
                    command.error_message = error_message or ""
                    command.responded_at = responded_at

                    if isinstance(raw_payload, dict):
                        raw_payload = raw_payload.get("printers") or raw_payload.get("printers_list") or [raw_payload]

                    if isinstance(raw_payload, list) and len(raw_payload) > 0:
                        agent = session.execute(
                            select(AgentNode)
                            .where(AgentNode.agent_uid == command.agent_uid)
                            .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
                        ).scalars().first()
                        target_lan_uid = agent.lan_uid if agent and agent.lan_uid else "default"

                        # Update ACTIVE_AGENTS RAM registry
                        from active_agents_registry import ACTIVE_AGENTS
                        if command.agent_uid in ACTIVE_AGENTS:
                            ACTIVE_AGENTS[command.agent_uid]["printers_json"] = raw_payload

                        # Upsert into PostgreSQL Printer table
                        existing_printers = session.execute(
                            select(Printer).where(Printer.lead == lead, Printer.lan_uid == target_lan_uid)
                        ).scalars().all()
                        existing_by_mac = { (p.mac_address or "").upper().replace("-", ":"): p for p in existing_printers if p.mac_address }

                        scanned_macs = set()
                        for p_item in raw_payload:
                            if not isinstance(p_item, dict): continue
                            mac = str(p_item.get("mac_address") or p_item.get("mac_id") or "").strip().upper().replace("-", ":")
                            ip = str(p_item.get("ip") or "").strip()
                            p_name = str(p_item.get("name") or p_item.get("printer_name") or "Photocopy").strip()
                            if not mac: continue
                            scanned_macs.add(mac)

                            if mac in existing_by_mac:
                                p_rec = existing_by_mac[mac]
                                p_rec.ip = ip
                                p_rec.printer_name = p_name
                                p_rec.is_online = bool(p_item.get("is_online", True))
                                p_rec.last_scanned_at = datetime.now(timezone.utc)
                                if command.agent_uid: p_rec.agent_uid = command.agent_uid
                            elif bool(p_item.get("is_online", True)):
                                new_p = Printer(
                                    lead=lead,
                                    lan_uid=target_lan_uid,
                                    printer_name=p_name,
                                    ip=ip,
                                    mac_address=mac,
                                    is_online=True,
                                    enabled=True,
                                    agent_uid=command.agent_uid or "",
                                    last_scanned_at=datetime.now(timezone.utc)
                                )
                                session.add(new_p)

                        # Completely remove old un-scanned printers for this LAN site from PostgreSQL
                        for mac, old_p in existing_by_mac.items():
                            if mac not in scanned_macs:
                                session.delete(old_p)
                        session.flush()
                        LOGGER.info("[polling_control_result] Cleaned fresh scan: kept %d online printers for lan_uid=%s in VPS DB", len(scanned_macs), target_lan_uid)

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
                                from models import CameraConfig
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

                        from models import DeviceInfor, ScanPoint
                        if not norm_mac and target_ip:
                            dev_info = session.execute(select(DeviceInfor).where(DeviceInfor.ip == target_ip)).scalars().first()
                            if dev_info and dev_info.mac_id:
                                norm_mac = _normalize_mac(dev_info.mac_id)

                        # Update ONLY ScanPoint table in PostgreSQL DB
                        if norm_mac:
                            try:
                                sp_rec = session.get(ScanPoint, norm_mac)
                                if sp_rec is None:
                                    sp_rec = ScanPoint(
                                        mac_id=norm_mac,
                                        printer_name="Photocopy",
                                        ip=target_ip or "",
                                        agent_uid=command.agent_uid or "",
                                        address_book_data=abd,
                                        status="success",
                                        created_at=datetime.now(timezone.utc),
                                        updated_at=datetime.now(timezone.utc)
                                    )
                                    session.add(sp_rec)
                                else:
                                    sp_rec.address_book_data = abd
                                    sp_rec.updated_at = datetime.now(timezone.utc)
                                LOGGER.info("[polling_control_result] Persisted ScanPoint to PostgreSQL for mac_id=%s", norm_mac)
                            except Exception as sp_err:
                                LOGGER.warning("[polling_control_result] Failed to persist ScanPoint: %s", sp_err)

                        command.error_message = json.dumps(abd, ensure_ascii=False)
                else:
                    try:
                        import json as _json
                        cmd_params = _json.loads(command.command_params) if command.command_params else {}
                        retry_count = int(cmd_params.get("retry_count", 0))
                        if retry_count < 2:
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
                        if retry_count < 2:
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
            
            # If the command succeeded and is of type trigger_utility, run our IP update logic
            if command.status == "success" and command.command_type == "trigger_utility":
                # Update IPData table when change_agent_ip succeeds
                try:
                    import json as _json
                    cp = _json.loads(command.command_params or "{}")
                    if cp.get("command") == "change_agent_ip":
                        target_ip = cp.get("printer_ip") or cp.get("ip") or cp.get("target_ip")
                        if target_ip:
                            from models import IPData
                            ip_rec = session.execute(
                                select(IPData).where(IPData.lan_uid == command.lan_uid, IPData.agent_name == command.agent_uid)
                            ).scalar_one_or_none()
                            if ip_rec is None:
                                ip_rec = IPData(
                                    agent_uid=command.agent_uid,
                                    lan_uid=command.lan_uid,
                                    agent_name=command.agent_uid,
                                    ip=target_ip,
                                    created_at=datetime.now(timezone.utc),
                                    updated_at=datetime.now(timezone.utc)
                                )
                                session.add(ip_rec)
                            else:
                                ip_rec.ip = target_ip
                                ip_rec.updated_at = datetime.now(timezone.utc)
                            
                            # Update AgentNode local_ip in DB
                            agent_node = session.execute(
                                select(AgentNode).where(AgentNode.agent_uid == command.agent_uid).order_by(AgentNode.last_seen_at.desc())
                            ).scalars().first()
                            if agent_node:
                                agent_node.local_ip = target_ip
                                agent_node.updated_at = datetime.now(timezone.utc)
                            
                            # Update ACTIVE_AGENTS in memory
                            from active_agents_registry import ACTIVE_AGENTS
                            agent_entry = ACTIVE_AGENTS.get(command.agent_uid)
                            if agent_entry:
                                agent_entry["local_ip"] = target_ip
                                agent_entry["last_seen_at"] = datetime.now(timezone.utc)
                            LOGGER.info("[polling_control_result] Updated IPData and AgentNode/memory for change_agent_ip: agent=%s IP=%s", command.agent_uid, target_ip)
                except Exception as ip_err:
                    LOGGER.error("[polling_control_result] Failed to update IPData and AgentNode/memory for change_agent_ip: %s", ip_err)

                # Update AgentNode local_ip and memory registry when get_agent_ip succeeds
                try:
                    import json as _json
                    cp = _json.loads(command.command_params or "{}")
                    if cp.get("command") == "get_agent_ip":
                        new_ip = command.error_message or error_message or body.get("result_payload") or body.get("output")
                        if new_ip and isinstance(new_ip, str):
                            new_ip = new_ip.strip()
                            import re
                            if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", new_ip):
                                agent_node = session.execute(
                                    select(AgentNode).where(AgentNode.agent_uid == command.agent_uid).order_by(AgentNode.last_seen_at.desc())
                                ).scalars().first()
                                if agent_node:
                                    agent_node.local_ip = new_ip
                                    agent_node.updated_at = datetime.now(timezone.utc)
                                    LOGGER.info("[polling_control_result] Updated AgentNode local_ip via get_agent_ip refresh: %s", new_ip)
                                
                                # Update in-memory ACTIVE_AGENTS registry for real-time frontend update
                                from active_agents_registry import ACTIVE_AGENTS
                                agent_entry = ACTIVE_AGENTS.get(command.agent_uid)
                                if agent_entry:
                                    agent_entry["local_ip"] = new_ip
                                    agent_entry["last_seen_at"] = datetime.now(timezone.utc)
                                    LOGGER.info("[polling_control_result] Updated ACTIVE_AGENTS local_ip via get_agent_ip refresh: %s", new_ip)
                except Exception as refresh_err:
                    LOGGER.error("[polling_control_result] Failed to update AgentNode/memory local_ip on get_agent_ip refresh: %s", refresh_err)
            else:
                if ok_value:
                    command.status = "success"
                else:
                    command.status = "failed"
                command.error_message = error_message
                command.responded_at = responded_at
            
            # Delete check_scan_ip_match and automatic utility commands to prevent DB bloating
            if command.command_type == "trigger_utility" and command.command_params:
                if "check_scan_ip_match" in command.command_params or '"is_auto": true' in command.command_params:
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


    @app.post("/api/polling/command-ack")
    def polling_command_ack() -> Any:
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

    @app.post("/api/polling/inventory")
    def ingest_polling_inventory() -> Any:
        body = request.get_json(silent=True) or {}
        if not isinstance(body, dict):
            return jsonify({"ok": False, "error": "Invalid JSON body"}), 400

        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead(body, lead_key_map, sent_token)
        if not ok_auth:
            return auth_error

        lan_uid = _to_text(body.get("lan_uid"))
        agent_uid = _to_text(body.get("agent_uid")) or "legacy-agent"
        devices_list = body.get("devices")
        if not isinstance(devices_list, list):
            devices_list = []

        LOGGER.info("[INVENTORY INGEST] Received %d devices from agent '%s' (lan_uid: %s)", len(devices_list), agent_uid, lan_uid)

        from active_agents_registry import update_agent_in_memory
        update_agent_in_memory(
            lead=lead_valid,
            lan_uid=lan_uid,
            agent_uid=agent_uid,
            hostname=_to_text(body.get("hostname")),
            local_ip=_to_text(body.get("local_ip")),
            devices_list=devices_list,
        )

        utc_now = datetime.now(timezone.utc)
        active_macs = set()
        active_ips = set()
        count = 0

        with session_factory() as session:
            try:
                for dev in devices_list:
                    if not isinstance(dev, dict):
                        continue
                    d_ip = str(dev.get("ip") or "").strip()
                    d_mac = str(dev.get("mac_address") or dev.get("mac_id") or "").strip().replace("-", ":").upper()
                    d_name = str(dev.get("printer_name") or dev.get("name") or "").strip()
                    if not d_ip and not d_mac:
                        continue

                    if d_mac:
                        active_macs.add(d_mac)
                    if d_ip:
                        active_ips.add(d_ip)

                    # 1. Upsert Printer table
                    p_stmt = select(Printer).where(Printer.lead == lead_valid)
                    if d_mac:
                        p_stmt = p_stmt.where(func.upper(Printer.mac_address) == d_mac)
                    else:
                        p_stmt = p_stmt.where(Printer.ip == d_ip)
                    p_obj = session.execute(p_stmt).scalars().first()
                    if p_obj:
                        if d_ip:
                            p_obj.ip = d_ip
                        if d_mac:
                            p_obj.mac_address = d_mac
                        if d_name:
                            p_obj.printer_name = d_name
                        p_obj.agent_uid = agent_uid
                        if lan_uid:
                            p_obj.lan_uid = lan_uid
                        p_obj.is_online = True
                        p_obj.updated_at = utc_now
                    else:
                        p_obj = Printer(
                            lead=lead_valid,
                            lan_uid=lan_uid,
                            agent_uid=agent_uid,
                            printer_name=d_name or "Unknown Printer",
                            ip=d_ip,
                            mac_address=d_mac,
                            enabled=True,
                            is_online=True,
                            updated_at=utc_now,
                            auth_user="",
                            auth_password="",
                            address_book_sync={},
                        )
                        session.add(p_obj)

                    # 2. Upsert DeviceInfor table
                    d_stmt = select(DeviceInfor).where(DeviceInfor.lead == lead_valid)
                    if d_mac:
                        d_stmt = d_stmt.where(func.upper(DeviceInfor.mac_id) == d_mac)
                    else:
                        d_stmt = d_stmt.where(DeviceInfor.ip == d_ip)
                    d_obj = session.execute(d_stmt).scalars().first()
                    if d_obj:
                        if d_ip:
                            d_obj.ip = d_ip
                        if d_mac:
                            d_obj.mac_id = d_mac
                        if d_name:
                            d_obj.printer_name = d_name
                        d_obj.agent_uid = agent_uid
                        if lan_uid:
                            d_obj.lan_uid = lan_uid
                        d_obj.updated_at = utc_now
                    else:
                        d_obj = DeviceInfor(
                            lead=lead_valid,
                            lan_uid=lan_uid,
                            agent_uid=agent_uid,
                            mac_id=d_mac,
                            ip=d_ip,
                            printer_name=d_name or "Unknown Printer",
                            counter_data={},
                            status_data={},
                            updated_at=utc_now,
                        )
                        session.add(d_obj)
                    count += 1

                # Purge stale Printer records for this lead not in agent printers.json
                if len(devices_list) > 0 and (active_macs or active_ips):
                    existing_printers = session.execute(select(Printer).where(Printer.lead == lead_valid)).scalars().all()
                    for ep in existing_printers:
                        ep_mac = (ep.mac_address or "").strip().upper()
                        ep_ip = (ep.ip or "").strip()
                        if not (ep_mac and ep_mac in active_macs) and not (ep_ip and ep_ip in active_ips):
                            session.delete(ep)
                            LOGGER.info("[inventory] Deleted stale Printer ID %s (%s, IP %s) for lead %s", ep.id, ep.printer_name, ep.ip, lead_valid)

                session.commit()
                LOGGER.info("[inventory] Ingested %d devices for lead=%s lan_uid=%s agent_uid=%s", count, lead_valid, lan_uid, agent_uid)
            except Exception as exc:
                session.rollback()
                LOGGER.warning("[inventory] Ingest inventory failed: %s", exc)

        return jsonify({"ok": True, "lead": lead_valid, "lan_uid": lan_uid, "agent_uid": agent_uid, "count": count})
