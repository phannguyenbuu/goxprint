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



def register_agent_history_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:

    @app.get("/agents")
    def agents_page() -> Any:
        manifest = _load_agent_release_manifest()
        version = _to_text(manifest.get("version")) or "unknown"
        published_at = _to_text(manifest.get("published_at"))
        release_date = ""
        if published_at:
            from utils import _parse_timestamp, UI_TZ
            release_date = _format_agents_datetime_ui(_parse_timestamp(published_at))
        
        script_release_date = ""
        try:
            from utils import UI_TZ
            script_names = ["get_address_book.py"]
            mtimes = []
            for name in script_names:
                script_path = os.path.join(os.path.dirname(__file__), "static", "releases", name)
                if os.path.exists(script_path):
                    mtimes.append(os.path.getmtime(script_path))
            if mtimes:
                max_mtime = max(mtimes)
                dt = datetime.fromtimestamp(max_mtime, tz=UI_TZ)
                script_release_date = _format_agents_datetime_ui(dt)
        except Exception:
            pass
        if not script_release_date:
            script_release_date = release_date

        size_bytes = int(manifest.get("size") or 0)
        size_mb = f"{size_bytes / (1024 * 1024):.1f} MB" if size_bytes > 0 else "-"
        return render_template(
            "agents.html",
            active_tab="agents",
            page_title="Agents",
            agent_release={
                "version": version,
                "release_date": release_date,
                "size_label": size_mb,
                "download_url": _to_text(manifest.get("download_url")) or "https://download.goxprint.com/printagent.exe",
                "notes": _to_text(manifest.get("notes")),
                "channel": _to_text(manifest.get("channel")) or "stable",
            },
            script_release_date=script_release_date,
        )

    @app.get("/api/agents")
    def list_agents() -> Any:
        lead = _to_text(request.args.get("lead"))
        lan_uid = _to_text(request.args.get("lan_uid"))
        agent_uid = _to_text(request.args.get("agent_uid"))
        status = _to_text(request.args.get("status")).lower() or "online"
        stale_seconds = _to_int(request.args.get("stale_seconds")) or ONLINE_STALE_SECONDS
        stale_seconds = max(30, stale_seconds)

        with session_factory() as session:
            _refresh_stale_agent_offline(session=session, lead=lead, lan_uid=lan_uid, agent_uid=agent_uid, stale_seconds=stale_seconds)
            session.commit()
            stmt = (
                select(AgentNode, LanSite.lan_name, LanSite.subnet_cidr, LanSite.gateway_ip)
                .join(LanSite, (AgentNode.lead == LanSite.lead) & (AgentNode.lan_uid == LanSite.lan_uid), isouter=True)
                .order_by(AgentNode.last_seen_at.desc(), AgentNode.id.desc())
            )
            if lead:
                stmt = stmt.where(AgentNode.lead == lead)
            if lan_uid:
                stmt = stmt.where(AgentNode.lan_uid.ilike(f"%{lan_uid}%"))
            if agent_uid:
                stmt = stmt.where(AgentNode.agent_uid.ilike(f"%{agent_uid}%"))
            rows = session.execute(stmt).all()

            printer_stmt = select(
                Printer.lead,
                Printer.lan_uid,
                Printer.agent_uid,
                Printer.printer_name,
                Printer.ip,
                Printer.mac_address,
                Printer.auth_user,
                Printer.auth_password,
            )
            if lead:
                printer_stmt = printer_stmt.where(Printer.lead == lead)
            if lan_uid:
                printer_stmt = printer_stmt.where(Printer.lan_uid.ilike(f"%{lan_uid}%"))
            printer_rows = session.execute(printer_stmt).all()
            printer_ips_by_lan: dict[tuple[str, str], list[str]] = {}
            printers_by_lan: dict[tuple[str, str], list[dict[str, Any]]] = {}
            seen_printers_by_lan: dict[tuple[str, str], set[tuple[str, str, str, str]]] = {}
            printers_by_agent: dict[tuple[str, str, str], list[dict[str, Any]]] = {}
            seen_printers_by_agent: dict[tuple[str, str, str], set[tuple[str, str, str]]] = {}
            for p_lead, p_lan_uid, p_agent_uid, p_name, p_ip, p_mac, p_auth_user, p_auth_password in printer_rows:
                key = (_to_text(p_lead), _to_text(p_lan_uid))
                ip_text = _to_text(p_ip)
                mac_text = _normalize_mac(p_mac)
                if not ip_text:
                    ip_text = ""
                if ip_text:
                    bucket = printer_ips_by_lan.setdefault(key, [])
                    if ip_text not in bucket:
                        bucket.append(ip_text)
                lan_printer_row = {
                    "printer_name": _to_text(p_name),
                    "ip": ip_text,
                    "mac_id": mac_text,
                    "agent_uid": _to_text(p_agent_uid),
                    "auth_configured": bool(_to_text(p_auth_user) and _to_text(p_auth_password)),
                }
                lan_dedupe_key = (
                    _to_text(lan_printer_row.get("agent_uid")),
                    _to_text(lan_printer_row.get("mac_id")),
                    _to_text(lan_printer_row.get("ip")),
                    _to_text(lan_printer_row.get("printer_name")),
                )
                seen_lan_bucket = seen_printers_by_lan.setdefault(key, set())
                if lan_dedupe_key not in seen_lan_bucket:
                    seen_lan_bucket.add(lan_dedupe_key)
                    printers_by_lan.setdefault(key, []).append(lan_printer_row)
                agent_key = (_to_text(p_lead), _to_text(p_lan_uid), _to_text(p_agent_uid))
                dedupe_key = (mac_text, ip_text, _to_text(p_name))
                seen_bucket = seen_printers_by_agent.setdefault(agent_key, set())
                if dedupe_key in seen_bucket:
                    continue
                seen_bucket.add(dedupe_key)
                printers_by_agent.setdefault(agent_key, []).append(
                    {
                        "printer_name": _to_text(p_name),
                        "ip": ip_text,
                        "mac_id": mac_text,
                        "auth_configured": bool(_to_text(p_auth_user) and _to_text(p_auth_password)),
                    }
                )
            for key in printer_ips_by_lan:
                printer_ips_by_lan[key].sort()
            for key in printers_by_lan:
                printers_by_lan[key].sort(
                    key=lambda item: (
                        _to_text(item.get("printer_name")),
                        _to_text(item.get("ip")),
                        _to_text(item.get("mac_id")),
                        _to_text(item.get("agent_uid")),
                    )
                )
            for key in printers_by_agent:
                printers_by_agent[key].sort(
                    key=lambda item: (
                        _to_text(item.get("printer_name")),
                        _to_text(item.get("ip")),
                        _to_text(item.get("mac_id")),
                    )
                )

            lan_keys = {(_to_text(r[0].lead), _to_text(r[0].lan_uid)) for r in rows}
            master_by_lan = {}
            for l_lead, l_lan in lan_keys:
                if not l_lead or not l_lan:
                    continue
                online_stmt = select(AgentNode).where(
                    AgentNode.lead == l_lead,
                    AgentNode.lan_uid == l_lan,
                    AgentNode.is_online.is_(True)
                ).order_by(AgentNode.id.asc())
                master_agent = session.execute(online_stmt).scalars().first()
                if not master_agent:
                    fallback_stmt = select(AgentNode).where(
                        AgentNode.lead == l_lead,
                        AgentNode.lan_uid == l_lan
                    ).order_by(AgentNode.id.asc())
                    master_agent = session.execute(fallback_stmt).scalars().first()
                if master_agent:
                    master_by_lan[(l_lead, l_lan)] = master_agent.agent_uid

        result_rows: list[dict[str, Any]] = []
        for agent, lan_name, subnet_cidr, gateway_ip in rows:
            last_seen = agent.last_seen_at if agent.last_seen_at and agent.last_seen_at.tzinfo else (
                agent.last_seen_at.replace(tzinfo=timezone.utc) if agent.last_seen_at else None
            )
            online_changed_at = agent.online_changed_at if agent.online_changed_at and agent.online_changed_at.tzinfo else (
                agent.online_changed_at.replace(tzinfo=timezone.utc) if agent.online_changed_at else None
            )
            is_online = bool(agent.is_online)
            if status == "online" and not is_online:
                continue
            if status == "offline" and is_online:
                continue
            port = int(agent.web_port or 9173)
            is_master = master_by_lan.get((_to_text(agent.lead), _to_text(agent.lan_uid))) == agent.agent_uid
            result_rows.append(
                {
                    "id": int(agent.id),
                    "lead": agent.lead,
                    "lan_uid": agent.lan_uid,
                    "lan_name": _to_text(lan_name),
                    "subnet_cidr": _to_text(subnet_cidr),
                    "gateway_ip": _to_text(gateway_ip),
                    "agent_uid": agent.agent_uid,
                    "hostname": agent.hostname,
                    "local_ip": agent.local_ip,
                    "local_mac": agent.local_mac,
                    "app_version": agent.app_version,
                    "run_mode": agent.run_mode or "web",
                    "web_port": port,
                    "ftp_ports": _to_text(agent.ftp_ports),
                    "printer_ips": printer_ips_by_lan.get((_to_text(agent.lead), _to_text(agent.lan_uid)), []),
                    "printers": printers_by_lan.get((_to_text(agent.lead), _to_text(agent.lan_uid)), []),
                    "lan_printers": printers_by_lan.get((_to_text(agent.lead), _to_text(agent.lan_uid)), []),
                    "last_seen_at": _format_agents_datetime_ui(last_seen),
                    "online_changed_at": _format_agents_datetime_ui(online_changed_at),
                    "is_online": is_online,
                    "is_master": is_master,
                    "gds_status": _to_text(getattr(agent, 'gds_status', 'unknown')) or 'unknown',
                    "localhost_url": f"http://127.0.0.1:{port}",
                    "ftp_page_url": f"http://127.0.0.1:{port}/ftp",
                    **_serialize_audit_payload_agents(agent.created_at, agent.updated_at),
                }
            )
        return jsonify({"rows": result_rows, "stale_seconds": stale_seconds})

    @app.delete("/api/agents/<int:agent_id>")
    def delete_agent(agent_id: int) -> Any:
        lead = _to_text(request.args.get("lead"))
        with session_factory() as session:
            stmt = select(AgentNode).where(AgentNode.id == agent_id)
            if lead:
                stmt = stmt.where(AgentNode.lead == lead)
            agent = session.execute(stmt).scalar_one_or_none()
            if agent is None:
                return jsonify({"ok": False, "error": "Agent not found"}), 404
            if bool(agent.is_online):
                return jsonify({"ok": False, "error": "Agent is online; stop it before deleting"}), 409

            session.delete(agent)
            session.commit()
        LOGGER.info("agent deleted: id=%s lead=%s", agent_id, lead or "-")
        return jsonify({"ok": True, "agent_id": agent_id})

    @app.get("/api/agents/history")
    def list_agent_history() -> Any:
        lead = _to_text(request.args.get("lead"))
        lan_uid = _to_text(request.args.get("lan_uid"))
        agent_uid = _to_text(request.args.get("agent_uid"))
        status = _to_text(request.args.get("status")).lower()
        limit = _to_int(request.args.get("limit")) or 500
        limit = max(1, min(limit, 5000))
        with session_factory() as session:
            stmt = select(AgentPresenceLog).order_by(AgentPresenceLog.changed_at.desc(), AgentPresenceLog.id.desc())
            if lead:
                stmt = stmt.where(AgentPresenceLog.lead == lead)
            if lan_uid:
                stmt = stmt.where(AgentPresenceLog.lan_uid.ilike(f"%{lan_uid}%"))
            if agent_uid:
                stmt = stmt.where(AgentPresenceLog.agent_uid.ilike(f"%{agent_uid}%"))
            if status == "online":
                stmt = stmt.where(AgentPresenceLog.is_online.is_(True))
            elif status == "offline":
                stmt = stmt.where(AgentPresenceLog.is_online.is_(False))
            rows = session.execute(stmt.limit(limit)).scalars().all()
        return jsonify(
            {
                "rows": [
                    {
                        "id": int(row.id),
                        "lead": row.lead,
                        "lan_uid": row.lan_uid,
                        "agent_uid": row.agent_uid,
                        "hostname": row.hostname,
                        "local_ip": row.local_ip,
                        "local_mac": row.local_mac,
                        "app_version": row.app_version,
                        "run_mode": row.run_mode,
                        "web_port": int(row.web_port or 9173),
                        "ftp_ports": row.ftp_ports,
                        "is_online": bool(row.is_online),
                        "changed_at": _format_agents_datetime_ui(row.changed_at),
                        "last_seen_at": _format_agents_datetime_ui(row.last_seen_at),
                        **_serialize_audit_payload_agents(row.created_at, row.updated_at),
                    }
                ],
                "limit": limit,
            }
        )

    @app.post("/api/jobs/log")
    def create_job_log() -> Any:
        body = request.get_json(silent=True) or {}
        event = _to_text(body.get("event"))
        agent_uid = _to_text(body.get("agent_uid")) or "administrator"
        old_ip = _to_text(body.get("old_ip"))
        new_ip = _to_text(body.get("new_ip"))
        log_text = _to_text(body.get("log_text"))
        LOGGER.info("[JOB LOG - %s] Agent: %s, Old IP: %s, New IP: %s - Text: %s", 
                    event, agent_uid, old_ip, new_ip, log_text)

        # Record PrinterControlCommand job entry so it appears in AppGox Job History
        try:
            import json
            from datetime import datetime, timezone
            from models import AgentNode, PrinterControlCommand
            with session_factory() as session:
                agent = session.execute(
                    select(AgentNode).where(AgentNode.agent_uid == agent_uid)
                ).scalars().first()
                lan_uid = agent.lan_uid if agent else f"default_{agent_uid}"
                lead = agent.lead if agent else "default"
                now = datetime.now(timezone.utc)

                msg = log_text or f"⚡ Tự động cập nhật điểm scan do IP máy PC ({agent_uid}) đổi từ {old_ip} ➔ {new_ip}"
                cmd_params = json.dumps({
                    "event": event or "ip_changed",
                    "agent_uid": agent_uid,
                    "old_ip": old_ip,
                    "new_ip": new_ip
                })

                command = PrinterControlCommand(
                    printer_id=0,
                    lead=lead,
                    lan_uid=lan_uid,
                    agent_uid=agent_uid,
                    printer_name=f"AgentNode ({agent_uid})",
                    ip=new_ip or "0.0.0.0",
                    desired_enabled=True,
                    command_type="ip_changed",
                    command_params=cmd_params,
                    status="success",
                    error_message=msg,
                    requested_at=now,
                    responded_at=now,
                )
                session.add(command)
                session.commit()
                LOGGER.info("[JOB LOG] Saved IP change job record #%d into DB", command.id)
        except Exception as db_exc:
            LOGGER.warning("[JOB LOG DB SAVE ERROR] %s", db_exc)

        return jsonify({"ok": True})

    @app.post("/api/jobs/record")
    def record_job() -> Any:
        try:
            body = request.get_json(silent=True) or {}
            agent_uid = _to_text(body.get("agent_uid")) or "administrator"
            printer_name = _to_text(body.get("printer_name")) or "AgentNode"
            ip = _to_text(body.get("ip")) or "0.0.0.0"
            command_type = _to_text(body.get("command_type")) or "trigger_utility"
            command_params = _to_text(body.get("command_params"))
            status = _to_text(body.get("status")) or "success"
            output = _to_text(body.get("output"))
            error_message = _to_text(body.get("error_message"))

            from datetime import datetime, timezone
            from models import AgentNode

            with session_factory() as session:
                agent = session.execute(
                    select(AgentNode).where(AgentNode.agent_uid == agent_uid)
                ).scalars().first()
                
                lan_uid = agent.lan_uid if agent else f"default_{agent_uid}"
                lead = agent.lead if agent else "default"
                now = datetime.now(timezone.utc)

                command = PrinterControlCommand(
                    printer_id=0,
                    lead=lead,
                    lan_uid=lan_uid,
                    agent_uid=agent_uid,
                    printer_name=printer_name,
                    ip=ip,
                    desired_enabled=True,
                    command_type=command_type,
                    command_params=command_params,
                    status=status,
                    error_message=error_message or output,
                    requested_at=now,
                    responded_at=now,
                )
                session.add(command)
                session.commit()
                job_id = int(command.id)
                LOGGER.info("[JOB RECORD] Recorded job #%d for %s (Agent: %s, Status: %s)", job_id, printer_name, agent_uid, status)
                return jsonify({"ok": True, "job_id": job_id})
        except Exception as exc:
            LOGGER.error("[POST /api/jobs/record ERROR] %s", exc, exc_info=True)
            return jsonify({"ok": False, "error": str(exc)}), 500

    @app.post("/api/jobs/clear-pending")
    def clear_pending_jobs() -> Any:
        try:
            with session_factory() as session:
                from sqlalchemy import delete, or_
                stmt = (
                    delete(PrinterControlCommand)
                    .where(
                        or_(
                            PrinterControlCommand.status.in_(["pending", "processing", "received"]),
                            PrinterControlCommand.error_message.ilike("%Đã hủy bởi Admin%")
                        )
                    )
                )
                res = session.execute(stmt)
                session.commit()
                count = res.rowcount
                LOGGER.info("[JOB CLEAR PENDING] Permanently deleted %s unfinished/cancelled jobs", count)
                return jsonify({"ok": True, "message": f"Đã xóa hoàn toàn {count} lệnh khỏi hệ thống", "cleared_count": count})
        except Exception as exc:
            LOGGER.error("[JOB CLEAR PENDING FAIL] Error: %s", exc)
            return jsonify({"ok": False, "error": str(exc)}), 500

    @app.delete("/api/jobs/<int:job_id>")
    def delete_single_job(job_id: int) -> Any:
        try:
            with session_factory() as session:
                cmd = session.query(PrinterControlCommand).get(job_id)
                if not cmd:
                    return jsonify({"ok": False, "error": "Lệnh không tồn tại"}), 404
                session.delete(cmd)
                session.commit()
                return jsonify({"ok": True, "message": f"Đã xóa lệnh #{job_id}"})
        except Exception as exc:
            return jsonify({"ok": False, "error": str(exc)}), 500

    @app.get("/api/jobs")
    def list_jobs() -> Any:
        try:
            lead = _to_text(request.args.get("lead"))
            lan_uid = _to_text(request.args.get("lan_uid"))
            agent_uid = _to_text(request.args.get("agent_uid"))
            printer_q = _to_text(request.args.get("printer"))
            cmd_type_q = _to_text(request.args.get("command_type"))
            date_q = _to_text(request.args.get("date") or request.args.get("time"))
            
            limit = _to_int(request.args.get("limit")) or 50
            limit = max(1, min(limit, 1000))
            page = _to_int(request.args.get("page")) or 1
            page = max(1, page)
            offset = (page - 1) * limit
            
            status_filter = _to_text(request.args.get("status")).lower()
            search_q = _to_text(request.args.get("q"))
            
            with session_factory() as session:
                stmt = select(PrinterControlCommand).order_by(PrinterControlCommand.requested_at.desc(), PrinterControlCommand.id.desc())
                if lead:
                    stmt = stmt.where(PrinterControlCommand.lead == lead)
                if lan_uid:
                    stmt = stmt.where(PrinterControlCommand.lan_uid == lan_uid)
                if agent_uid and agent_uid.lower() != 'all':
                    stmt = stmt.where(PrinterControlCommand.agent_uid.ilike(f"%{agent_uid}%"))
                if printer_q:
                    stmt = stmt.where(
                        (PrinterControlCommand.printer_name.ilike(f"%{printer_q}%")) |
                        (PrinterControlCommand.ip.ilike(f"%{printer_q}%"))
                    )
                if cmd_type_q and cmd_type_q.lower() != 'all':
                    stmt = stmt.where(PrinterControlCommand.command_type.ilike(f"%{cmd_type_q}%"))
                if date_q:
                    try:
                        from datetime import timedelta
                        d_start = datetime.strptime(date_q[:10], "%Y-%m-%d").replace(tzinfo=timezone.utc)
                        d_end = d_start + timedelta(days=1)
                        stmt = stmt.where((PrinterControlCommand.requested_at >= d_start) & (PrinterControlCommand.requested_at < d_end))
                    except Exception:
                        pass
                    
                if status_filter and status_filter != 'all':
                    if status_filter == 'failed':
                        stmt = stmt.where(~PrinterControlCommand.status.in_(["success", "pending"]))
                    else:
                        stmt = stmt.where(PrinterControlCommand.status == status_filter)
                        
                if search_q:
                    # Cố gắng parse ID nếu user nhập số
                    if search_q.isdigit():
                        stmt = stmt.where(
                            (PrinterControlCommand.id == int(search_q)) |
                            (PrinterControlCommand.command_type.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.agent_uid.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.printer_name.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.ip.ilike(f"%{search_q}%"))
                        )
                    else:
                        stmt = stmt.where(
                            (PrinterControlCommand.command_type.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.agent_uid.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.printer_name.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.ip.ilike(f"%{search_q}%"))
                        )
                    
                stmt = stmt.where(
                    (PrinterControlCommand.command_type != "trigger_utility") |
                    (PrinterControlCommand.command_params == None) |
                    (
                        (
                            (~PrinterControlCommand.command_params.like("%check_scan_ip_match%")) &
                            (~PrinterControlCommand.command_params.like("%query_device_now%")) &
                            (~PrinterControlCommand.command_params.like('%"is_auto": true%'))
                        ) |
                        (PrinterControlCommand.command_params.like('%child_command_ids%'))
                    )
                )
                
                from sqlalchemy import func
                count_stmt = select(func.count(PrinterControlCommand.id))
                if lead:
                    count_stmt = count_stmt.where(PrinterControlCommand.lead == lead)
                if lan_uid:
                    count_stmt = count_stmt.where(PrinterControlCommand.lan_uid == lan_uid)
                if agent_uid and agent_uid.lower() != 'all':
                    count_stmt = count_stmt.where(PrinterControlCommand.agent_uid.ilike(f"%{agent_uid}%"))
                if printer_q:
                    count_stmt = count_stmt.where(
                        (PrinterControlCommand.printer_name.ilike(f"%{printer_q}%")) |
                        (PrinterControlCommand.ip.ilike(f"%{printer_q}%"))
                    )
                if cmd_type_q and cmd_type_q.lower() != 'all':
                    count_stmt = count_stmt.where(PrinterControlCommand.command_type.ilike(f"%{cmd_type_q}%"))
                if date_q:
                    try:
                        from datetime import timedelta
                        d_start = datetime.strptime(date_q[:10], "%Y-%m-%d").replace(tzinfo=timezone.utc)
                        d_end = d_start + timedelta(days=1)
                        count_stmt = count_stmt.where((PrinterControlCommand.requested_at >= d_start) & (PrinterControlCommand.requested_at < d_end))
                    except Exception:
                        pass
                if status_filter and status_filter != 'all':
                    if status_filter == 'failed':
                        count_stmt = count_stmt.where(~PrinterControlCommand.status.in_(["success", "pending"]))
                    else:
                        count_stmt = count_stmt.where(PrinterControlCommand.status == status_filter)
                if search_q:
                    if search_q.isdigit():
                        count_stmt = count_stmt.where(
                            (PrinterControlCommand.id == int(search_q)) |
                            (PrinterControlCommand.command_type.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.agent_uid.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.printer_name.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.ip.ilike(f"%{search_q}%"))
                        )
                    else:
                        count_stmt = count_stmt.where(
                            (PrinterControlCommand.command_type.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.agent_uid.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.printer_name.ilike(f"%{search_q}%")) |
                            (PrinterControlCommand.ip.ilike(f"%{search_q}%"))
                        )
                count_stmt = count_stmt.where(
                    (PrinterControlCommand.command_type != "trigger_utility") |
                    (PrinterControlCommand.command_params == None) |
                    (
                        (
                            (~PrinterControlCommand.command_params.like("%check_scan_ip_match%")) &
                            (~PrinterControlCommand.command_params.like("%query_device_now%")) &
                            (~PrinterControlCommand.command_params.like('%"is_auto": true%'))
                        ) |
                        (PrinterControlCommand.command_params.like('%child_command_ids%'))
                    )
                )

                total = session.execute(count_stmt).scalar() or 0
                rows = session.execute(stmt.offset(offset).limit(limit)).scalars().all()
                
                jobs = []
                need_commit = False
                for row in rows:
                    status = row.status
                    error_message = row.error_message or ""
                    
                    # Check parent-child command status resolution
                    if row.command_params and "child_command_ids" in row.command_params and status == "pending":
                        try:
                            import json
                            params = json.loads(row.command_params)
                            child_ids = params.get("child_command_ids")
                            if child_ids and isinstance(child_ids, list):
                                child_cmds = session.execute(
                                    select(PrinterControlCommand).where(PrinterControlCommand.id.in_(child_ids))
                                ).scalars().all()
                                
                                total_child = len(child_ids)
                                done = sum(1 for c in child_cmds if c.status not in ("pending", "processing", "received"))
                                
                                if done < total_child:
                                    error_message = (row.error_message or "") + f"\n\n⌛ Đang xử lý ({done}/{total_child}) lệnh..."
                                else:
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
                                    
                                    error_message = (row.error_message or "") + f"\n\n{msg_prefix}\n" + "\n".join(details)
                                    
                                    # Write resolution back to database
                                    row.status = status
                                    row.error_message = error_message
                                    from datetime import datetime, timezone
                                    row.responded_at = datetime.now(timezone.utc)
                                    session.add(row)
                                    need_commit = True
                        except Exception as res_err:
                            LOGGER.warning("Failed to resolve parent status for job %s: %s", row.id, res_err)

                    jobs.append({
                        "id": int(row.id),
                        "lead": row.lead,
                        "lan_uid": row.lan_uid,
                        "agent_uid": row.agent_uid,
                        "printer_id": int(row.printer_id or 0),
                        "printer_name": row.printer_name,
                        "ip": row.ip,
                        "command_type": row.command_type,
                        "command_params": row.command_params,
                        "command_content": row.__dict__.get("command_content") or row.command_params or "",
                        "output": row.__dict__.get("output") or row.__dict__.get("result_payload") or error_message or "",
                        "result_payload": row.__dict__.get("result_payload") or row.__dict__.get("output") or error_message or "",
                        "status": status,
                        "error_message": error_message,
                        "requested_at": _format_agents_datetime_ui(row.requested_at) if row.requested_at else "",
                        "responded_at": _format_agents_datetime_ui(row.responded_at) if row.responded_at else "",
                    })
                if need_commit:
                    try:
                        session.commit()
                    except Exception:
                        session.rollback()
            return jsonify({"ok": True, "jobs": jobs, "total": total, "page": page, "limit": limit})
        except Exception as exc:
            LOGGER.error("[GET /api/jobs ERROR] %s", exc, exc_info=True)
            return jsonify({"ok": False, "error": str(exc), "jobs": [], "total": 0, "page": 1, "limit": 50}), 500

    @app.get("/api/agents/history/export")
    def export_agent_history() -> Any:
        lead = _to_text(request.args.get("lead"))
        lan_uid = _to_text(request.args.get("lan_uid"))
        agent_uid = _to_text(request.args.get("agent_uid"))
        status = _to_text(request.args.get("status")).lower()
        limit = _to_int(request.args.get("limit")) or 5000
        limit = max(1, min(limit, 5000))
        with session_factory() as session:
            stmt = select(AgentPresenceLog).order_by(AgentPresenceLog.changed_at.desc(), AgentPresenceLog.id.desc())
            if lead:
                stmt = stmt.where(AgentPresenceLog.lead == lead)
            if lan_uid:
                stmt = stmt.where(AgentPresenceLog.lan_uid.ilike(f"%{lan_uid}%"))
            if agent_uid:
                stmt = stmt.where(AgentPresenceLog.agent_uid.ilike(f"%{agent_uid}%"))
            if status == "online":
                stmt = stmt.where(AgentPresenceLog.is_online.is_(True))
            elif status == "offline":
                stmt = stmt.where(AgentPresenceLog.is_online.is_(False))
            rows = session.execute(stmt.limit(limit)).scalars().all()

        payload = {
            "ok": True,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "limit": limit,
            "rows": [
                {
                    "id": int(row.id),
                    "lead": row.lead,
                    "lan_uid": row.lan_uid,
                    "agent_uid": row.agent_uid,
                    "hostname": row.hostname,
                    "local_ip": row.local_ip,
                    "local_mac": row.local_mac,
                    "app_version": row.app_version,
                    "run_mode": row.run_mode,
                    "web_port": int(row.web_port or 9173),
                    "ftp_ports": row.ftp_ports,
                    "is_online": bool(row.is_online),
                    "changed_at": _format_agents_datetime_ui(row.changed_at),
                    "last_seen_at": _format_agents_datetime_ui(row.last_seen_at),
                    **_serialize_audit_payload_agents(row.created_at, row.updated_at),
                }
                for row in rows
            ],
        }
        filename = f"agent-presence-history-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}.json"
        response = jsonify(payload)
        response.headers["Content-Disposition"] = f'attachment; filename="{filename}"'
        response.headers["Content-Type"] = "application/json; charset=utf-8"
        return response
