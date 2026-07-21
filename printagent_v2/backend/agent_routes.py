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

TUNNEL_REGISTRY: dict[tuple[str, str, int], int] = {}
TUNNEL_TOKENS: dict[str, int] = {}
TUNNEL_KEYS: dict[tuple[str, str, int], str] = {}

def is_port_free(port: int) -> bool:
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("0.0.0.0", port))
            return True
        except socket.error:
            return False



def register_agent_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:

    @app.before_request
    def handle_subdomain_proxy():
        host = request.host
        if host.endswith(".app.goxprint.com") and host != "app.goxprint.com":
            subdomain = host.split(".")[0]
            port = TUNNEL_TOKENS.get(subdomain)
            if port:
                import requests
                from flask import Response
                
                path = request.path
                if request.query_string:
                    path += "?" + request.query_string.decode("utf-8", errors="ignore")
                
                # Determine target_port and scheme
                target_port = 80
                for k, val in TUNNEL_REGISTRY.items():
                    if val == port:
                        target_port = k[2]
                        break
                
                is_https = target_port in (443, 10443)
                scheme = "https" if is_https else "http"
                url = f"{scheme}://127.0.0.1:{port}{path}"
                headers = {key: value for key, value in request.headers.items() if key.lower() not in ("host", "content-length", "connection", "transfer-encoding")}
                headers["Connection"] = "close"
                
                resp = None
                last_exc = None
                import time
                for attempt in range(4):
                    try:
                        resp = requests.request(
                            method=request.method,
                            url=url,
                            headers=headers,
                            data=request.get_data(),
                            cookies=request.cookies,
                            allow_redirects=False,
                            stream=True,
                            timeout=10,
                            verify=False if is_https else True
                        )
                        break
                    except Exception as exc:
                        last_exc = exc
                        time.sleep(0.05 * (attempt + 1))
                
                if resp is None:
                    return f"Tunnel Proxy Error: Failed to connect to local port {port} after retries: {last_exc}", 502
                
                try:
                    excluded_headers = ["content-length", "transfer-encoding", "connection", "content-encoding"]
                    resp_headers = [(name, val) for name, val in resp.raw.headers.items() if name.lower() not in excluded_headers]
                    resp_headers.append(("Connection", "close"))
                    
                    return Response(
                        resp.iter_content(chunk_size=1024*64),
                        status=resp.status_code,
                        headers=resp_headers
                    )
                except Exception as exc:
                    return f"Tunnel Proxy Error: Failed to read response from local port {port}: {exc}", 502

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
                    "printers": printers_by_agent.get((_to_text(agent.lead), _to_text(agent.lan_uid), _to_text(agent.agent_uid)), []),
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
                    for row in rows
                ],
                "limit": limit,
            }
        )

    @app.get("/api/jobs")
    def list_jobs() -> Any:
        lead = _to_text(request.args.get("lead"))
        lan_uid = _to_text(request.args.get("lan_uid"))
        agent_uid = _to_text(request.args.get("agent_uid"))
        limit = _to_int(request.args.get("limit")) or 100
        limit = max(1, min(limit, 1000))
        
        with session_factory() as session:
            stmt = select(PrinterControlCommand).order_by(PrinterControlCommand.id.desc())
            if lead:
                stmt = stmt.where(PrinterControlCommand.lead == lead)
            if lan_uid:
                stmt = stmt.where(PrinterControlCommand.lan_uid == lan_uid)
            if agent_uid:
                stmt = stmt.where(PrinterControlCommand.agent_uid == agent_uid)
                
            rows = session.execute(stmt.limit(limit)).scalars().all()
            
            jobs = []
            for row in rows:
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
                    "status": row.status,
                    "error_message": row.error_message,
                    "requested_at": _format_agents_datetime_ui(row.requested_at) if row.requested_at else "",
                    "responded_at": _format_agents_datetime_ui(row.responded_at) if row.responded_at else "",
                })
        return jsonify({"ok": True, "jobs": jobs})

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

    @app.post("/api/agent/register")
    def register_agent() -> Any:
        body = request.get_json(silent=True) or {}
        if not isinstance(body, dict):
            LOGGER.warning("register: invalid json body from %s", request.remote_addr)
            return jsonify({"ok": False, "error": "Invalid JSON body"}), 400
        sent_token = _request_api_token()
        ok_auth, lead, auth_error = _resolve_request_lead(body, lead_key_map, sent_token)
        if not ok_auth:
            LOGGER.warning("register: unauthorized lead=%s ip=%s", _to_text(body.get("lead")), request.remote_addr)
            return auth_error

        with session_factory() as session:
            lan_uid, fingerprint = _resolve_lan_uid_with_session(session, lead, body)
            agent_uid = _to_text(body.get("agent_uid")) or "legacy-agent"
            lan_name = _to_text(body.get("lan_name"))
            subnet_cidr = _to_text(body.get("subnet_cidr"))
            gateway_ip = _to_text(body.get("gateway_ip"))
            gateway_mac = _to_text(body.get("gateway_mac"))
            hostname = _to_text(body.get("hostname"))
            local_ip = _to_text(body.get("local_ip"))
            local_mac = _to_text(body.get("local_mac"))
            app_version = _to_text(body.get("app_version"))
            run_mode = _to_text(body.get("run_mode")) or "web"
            web_port = _to_int(body.get("web_port")) or 9173
            ftp_ports = _to_text(body.get("ftp_ports"))
            ftp_sites = body.get("ftp_sites") if isinstance(body.get("ftp_sites"), list) else None
            _refresh_stale_agent_offline(session=session, lead=lead, stale_seconds=ONLINE_STALE_SECONDS)
            lan_uid = _upsert_lan_and_agent(
                session=session,
                lead=lead,
                lan_uid=lan_uid,
                agent_uid=agent_uid,
                lan_name=lan_name,
                subnet_cidr=subnet_cidr,
                gateway_ip=gateway_ip,
                gateway_mac=gateway_mac,
                hostname=hostname,
                local_ip=local_ip,
                local_mac=local_mac,
                app_version=app_version,
                run_mode=run_mode,
                web_port=web_port,
                ftp_ports=ftp_ports,
                ftp_sites=ftp_sites,
                fingerprint_signature=fingerprint,
            )
            is_master, emails = _is_agent_master_and_get_emails(session, lead, lan_uid, agent_uid)
            session.commit()
        LOGGER.info("register: lead=%s lan_uid=%s agent_uid=%s hostname=%s master=%s", lead, lan_uid, agent_uid, hostname, is_master)

        return jsonify(
            {
                "ok": True,
                "lead": lead,
                "lan_uid": lan_uid,
                "agent_uid": agent_uid,
                "is_master": is_master,
                "emails": emails,
            }
        )

    @app.get("/api/agent/core-release")
    def get_agent_core_release() -> Any:
        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead({}, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error

        current_version = _to_text(request.args.get("current_version"))
        manifest_path = Path("storage/releases/agent_core_release.json")
        payload = {}
        if manifest_path.exists():
            try:
                payload = json.loads(manifest_path.read_text(encoding="utf-8"))
            except Exception:
                pass
        if not payload:
            payload = {
                "version": "1.0.0",
                "download_url": "/static/releases/agent_core.zip",
                "sha256": "",
            }

        version = _to_text(payload.get("version"))
        sha256 = _to_text(payload.get("sha256")).lower()
        current_sha = _to_text(request.args.get("current_sha256")).lower()
        if sha256 and current_sha:
            update_available = sha256 != current_sha
        else:
            update_available = _is_newer_version(version, current_version)

        return jsonify({
            "ok": True,
            "version": version,
            "download_url": _to_text(payload.get("download_url")),
            "sha256": sha256,
            "update_available": update_available,
        })

    @app.get("/api/agent/release")
    def get_agent_release() -> Any:
        sent_token = _request_api_token()
        ok_auth, lead_valid, auth_error = _resolve_request_lead({}, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error

        current_version = _to_text(request.args.get("current_version"))
        current_sha256 = _to_text(request.args.get("current_sha256")).lower()

        lan_uid = _to_text(request.args.get("lan_uid"))
        agent_uid = _to_text(request.args.get("agent_uid"))
        hostname = _to_text(request.args.get("hostname"))
        local_ip = _to_text(request.args.get("local_ip"))

        if lan_uid and agent_uid:
            try:
                with session_factory() as session:
                    _upsert_lan_and_agent(
                        session=session,
                        lead=lead_valid,
                        lan_uid=lan_uid,
                        agent_uid=agent_uid,
                        lan_name="",
                        subnet_cidr="",
                        gateway_ip="",
                        gateway_mac="",
                        hostname=hostname,
                        local_ip=local_ip,
                        local_mac="",
                        app_version=current_version,
                        run_mode="",
                        web_port=0,
                        ftp_ports="",
                        ftp_sites=None,
                    )
                    session.commit()
            except Exception as upsert_exc:
                LOGGER.warning("Failed to upsert agent in release check: %s", upsert_exc)

        manifest = _load_agent_release_manifest()
        version = _to_text(manifest.get("version"))
        sha256 = _to_text(manifest.get("sha256")).lower()
        if sha256 and current_sha256:
            update_available = sha256 != current_sha256
        else:
            update_available = _is_newer_version(version, current_version)
        return jsonify(
            {
                "ok": True,
                "lead": lead_valid,
                "version": version,
                "download_url": _to_text(manifest.get("download_url")),
                "sha256": sha256,
                "size": int(manifest.get("size") or 0),
                "published_at": _to_text(manifest.get("published_at")),
                "notes": _to_text(manifest.get("notes")),
                "mandatory": bool(manifest.get("mandatory", False)),
                "channel": _to_text(manifest.get("channel")),
                "update_available": update_available,
            }
        )

    @app.post("/api/agent/resolve-lan")
    def resolve_lan_by_mac() -> Any:
        body = request.get_json(silent=True) or {}
        sent_token = _request_api_token()
        ok_auth, lead, auth_error = _resolve_request_lead(body, lead_key_map, sent_token)
        if not ok_auth:
            return auth_error

        with session_factory() as session:
            lan_uid, fingerprint = _resolve_lan_uid_with_session(session, lead, body)
        if not lan_uid:
            return jsonify({"ok": True, "lan_uid": None, "reason": "no_network_identity"})
        derived_lan_uid = _resolve_lan_uid_from_body(body)

        LOGGER.info(
            "resolve-lan: lead=%s gateway_ip=%s gateway_mac=%s -> lan_uid=%s",
            lead,
            _normalize_ipv4(_to_text(body.get("gateway_ip"))),
            _normalize_mac(_to_text(body.get("gateway_mac"))),
            lan_uid,
        )
        return jsonify(
            {
                "ok": True,
                "lan_uid": lan_uid,
                "fingerprint_signature": fingerprint,
                "reason": "remapped" if lan_uid != derived_lan_uid else "derived",
            }
        )

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
        with session_factory() as session:
            agent = session.execute(
                select(AgentNode).where(
                    AgentNode.lead == lead_valid,
                    AgentNode.agent_uid == agent_uid
                ).order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
            ).scalars().first()
            if agent is None:
                return jsonify({"ok": False, "error": "Agent not found"}), 404
            
            import json as _json
            params = {
                "action": action,
            }
            if body and isinstance(body, dict):
                for k, v in body.items():
                    if k != "action":
                        params[k] = v
            params_str = _json.dumps(params)
            
            command = PrinterControlCommand(
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
            session.add(command)
            session.commit()
            command_id = int(command.id)
            
        return jsonify({
            "ok": True,
            "message": f"Utility action '{action}' queued",
            "command_id": command_id,
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

    @app.get("/api/agent/watchdog-check")
    def agent_watchdog_check() -> Any:
        # Expected from watchdog.bat via query string
        hostname = _to_text(request.args.get("hostname")).lower()
        if not hostname:
            return "OK", 200, {'Content-Type': 'text/plain'}
            
        with session_factory() as session:
            # Find the most recent pending emergency_restart for this hostname
            # Note: We match hostname because watchdog.bat might not know the exact agent_uid easily
            # But AgentNode stores hostname
            agent = session.execute(
                select(AgentNode).where(
                    AgentNode.hostname.ilike(f"%{hostname}%")
                ).order_by(AgentNode.updated_at.desc())
            ).scalars().first()
            
            if agent is None:
                return "OK", 200, {'Content-Type': 'text/plain'}
                
            cmd = session.execute(
                select(PrinterControlCommand).where(
                    PrinterControlCommand.agent_uid == agent.agent_uid,
                    PrinterControlCommand.command_type == "emergency_restart",
                    PrinterControlCommand.status == "pending"
                ).order_by(PrinterControlCommand.id.desc())
            ).scalars().first()
            
            if cmd:
                # Mark it as completed since the watchdog has picked it up
                cmd.status = "completed"
                cmd.responded_at = datetime.now(timezone.utc)
                cmd.error_message = '{"result": "Picked up by watchdog.bat"}'
                session.commit()
                return "RESTART", 200, {'Content-Type': 'text/plain'}
                
        return "OK", 200, {'Content-Type': 'text/plain'}

    @app.post("/api/agents/<agent_uid>/register-ssh-key")
    def register_agent_ssh_key(agent_uid: str) -> Any:
        body = request.get_json(silent=True) or {}
        public_key = body.get("public_key", "").strip()
        if not public_key:
            return jsonify({"ok": False, "error": "Missing public_key"}), 400
            
        try:
            from ssh_key_manager import register_public_ssh_key
        except ModuleNotFoundError:
            from backend.ssh_key_manager import register_public_ssh_key
            
        success = register_public_ssh_key(public_key)
        if not success:
            return jsonify({"ok": False, "error": "Failed to register public SSH key"}), 500
            
        return jsonify({"ok": True})

    @app.post("/api/agents/<agent_uid>/tunnel/start")
    def start_printer_tunnel(agent_uid: str) -> Any:
        body = request.get_json(silent=True) or {}
        printer_ip = body.get("printer_ip", "").strip()
        printer_port = int(body.get("printer_port", 80))
        
        if not printer_ip:
            return jsonify({"ok": False, "error": "Missing printer_ip"}), 400
            
        key = (agent_uid, printer_ip, printer_port)
        if key in TUNNEL_REGISTRY:
            port = TUNNEL_REGISTRY[key]
            if is_port_free(port):
                TUNNEL_REGISTRY.pop(key, None)
                token = TUNNEL_KEYS.pop(key, None)
                if token:
                    TUNNEL_TOKENS.pop(token, None)
            else:
                token = TUNNEL_KEYS.get(key)
                if not token:
                    import time
                    token = f"wim{int(time.time())}{port}"
                    TUNNEL_KEYS[key] = token
                    TUNNEL_TOKENS[token] = port
                vps_host = request.host.split(":")[0]
                url_wildcard = f"https://{token}.app.goxprint.com"
                url_port = f"http://{vps_host}:{port}"
                return jsonify({"ok": True, "url": url_wildcard, "url_port": url_port})
            
        try:
            port = None
            for p in range(8100, 8200):
                if p not in TUNNEL_REGISTRY.values() and is_port_free(p):
                    port = p
                    break
            if not port:
                return jsonify({"ok": False, "error": "No free ports available on VPS"}), 503
        except Exception as exc:
            return jsonify({"ok": False, "error": f"Port allocation error: {exc}"}), 500
            
        requested_at = datetime.now(timezone.utc)
        vps_host = request.host.split(":")[0]
        params = {
            "action": "start_tunnel",
            "target_ip": printer_ip,
            "target_port": printer_port,
            "vps_ip": vps_host,
            "remote_port": port,
            "vps_user": "root"
        }
        
        with session_factory() as session:
            # Query the most recently active AgentNode for this agent_uid to get current active lan_uid
            active_agent = session.execute(
                select(AgentNode)
                .where(AgentNode.agent_uid == agent_uid)
                .order_by(AgentNode.last_seen_at.desc())
            ).scalars().first()

            printer = None
            if active_agent:
                # 1. Prioritize matching ip on the active agent's lan_uid (ignoring agent_uid, since multiple agents share same LAN Site)
                printer = session.execute(
                    select(Printer).where(
                        Printer.ip == printer_ip,
                        Printer.lan_uid == active_agent.lan_uid
                    )
                ).scalars().first()

            if not printer:
                # 2. Fallback to matching agent_uid and ip
                printer = session.execute(
                    select(Printer).where(
                        Printer.agent_uid == agent_uid,
                        Printer.ip == printer_ip
                    )
                ).scalars().first()

            if not printer:
                # 3. Last fallback to ip only
                printer = session.execute(
                    select(Printer).where(Printer.ip == printer_ip)
                ).scalars().first()
            if not printer:
                return jsonify({"ok": False, "error": f"Printer with IP {printer_ip} not found in database"}), 404

            command = PrinterControlCommand(
                printer_id=printer.id,
                lead=printer.lead,
                lan_uid=active_agent.lan_uid if active_agent else printer.lan_uid,
                agent_uid=agent_uid,
                printer_name=printer.printer_name,
                ip=printer_ip,
                command_type="trigger_utility",
                command_params=json.dumps(params),
                status="pending",
                requested_at=requested_at,
            )
            session.add(command)
            session.commit()
            command_id = int(command.id)
            
        success = False
        error_msg = "Timeout waiting for Agent to establish tunnel"
        import time
        for _ in range(30):
            time.sleep(0.5)
            with session_factory() as session:
                cmd_status = session.execute(
                    select(PrinterControlCommand).where(PrinterControlCommand.id == command_id)
                ).scalars().first()
                if cmd_status:
                    if cmd_status.status == "success":
                        success = True
                        break
                    elif cmd_status.status == "failed":
                        success = False
                        error_msg = cmd_status.error_message or "Agent failed to establish tunnel"
                        break
                        
        if success:
            TUNNEL_REGISTRY[key] = port
            import time
            token = f"wim{int(time.time())}{port}"
            TUNNEL_KEYS[key] = token
            TUNNEL_TOKENS[token] = port
            url_wildcard = f"https://{token}.app.goxprint.com"
            url_port = f"http://{vps_host}:{port}"
            return jsonify({"ok": True, "url": url_wildcard, "url_port": url_port})
        else:
            return jsonify({"ok": False, "error": error_msg}), 504

    @app.post("/api/agents/<agent_uid>/tunnel/stop")
    def stop_printer_tunnel(agent_uid: str) -> Any:
        body = request.get_json(silent=True) or {}
        printer_ip = body.get("printer_ip", "").strip()
        
        if not printer_ip:
            return jsonify({"ok": False, "error": "Missing printer_ip"}), 400
            
        keys_to_remove = [k for k in TUNNEL_REGISTRY.keys() if k[0] == agent_uid and k[1] == printer_ip]
        for k in keys_to_remove:
            TUNNEL_REGISTRY.pop(k, None)
            token = TUNNEL_KEYS.pop(k, None)
            if token:
                TUNNEL_TOKENS.pop(token, None)
        
        requested_at = datetime.now(timezone.utc)
        params = {
            "action": "stop_tunnel",
            "target_ip": printer_ip
        }
        with session_factory() as session:
            active_agent = session.execute(
                select(AgentNode)
                .where(AgentNode.agent_uid == agent_uid)
                .order_by(AgentNode.last_seen_at.desc())
            ).scalars().first()

            printer = None
            if active_agent:
                # 1. Prioritize matching ip on the active agent's lan_uid (ignoring agent_uid, since multiple agents share same LAN Site)
                printer = session.execute(
                    select(Printer).where(
                        Printer.ip == printer_ip,
                        Printer.lan_uid == active_agent.lan_uid
                    )
                ).scalars().first()

            if not printer:
                # 2. Fallback to matching agent_uid and ip
                printer = session.execute(
                    select(Printer).where(
                        Printer.agent_uid == agent_uid,
                        Printer.ip == printer_ip
                    )
                ).scalars().first()

            if not printer:
                # 3. Last fallback to ip only
                printer = session.execute(
                    select(Printer).where(Printer.ip == printer_ip)
                ).scalars().first()
            if not printer:
                return jsonify({"ok": False, "error": f"Printer with IP {printer_ip} not found in database"}), 404

            command = PrinterControlCommand(
                printer_id=printer.id,
                lead=printer.lead,
                lan_uid=active_agent.lan_uid if active_agent else printer.lan_uid,
                agent_uid=agent_uid,
                printer_name=printer.printer_name,
                ip=printer_ip,
                command_type="trigger_utility",
                command_params=json.dumps(params),
                status="pending",
                requested_at=requested_at,
            )
            session.add(command)
            session.commit()
            
        return jsonify({"ok": True})


    def _get_clean_manufacturer(mac: str, mac_vendors: dict, rtsp_url: str = None) -> str:
        # 1. Try MAC OUI lookup first (highest confidence)
        if mac and mac_vendors:
            clean_mac = "".join(c for c in mac if c.isalnum()).upper()
            if len(clean_mac) >= 6:
                oui = f"{clean_mac[0:2]}:{clean_mac[2:4]}:{clean_mac[4:6]}"
                vendor_info = mac_vendors.get(oui)
                if vendor_info:
                    vendor_name = vendor_info.get("manufacturer") or ""
                    vendor_lower = vendor_name.lower()
                    if "dahua" in vendor_lower:
                        return "Dahua"
                    elif "hikvision" in vendor_lower:
                        return "Hikvision"
                    elif "ezviz" in vendor_lower:
                        return "Ezviz"
                    elif "imou" in vendor_lower or "huacheng" in vendor_lower:
                        return "Imou"
                    elif "sigmastar" in vendor_lower:
                        return "Sigmastar"
                    elif "sony" in vendor_lower:
                        return "Sony"
                    elif "panasonic" in vendor_lower:
                        return "Panasonic"
                    elif "tp-link" in vendor_lower:
                        return "TP-Link"
                    elif "brother" in vendor_lower:
                        return "Brother"
                    elif "canon" in vendor_lower:
                        return "Canon"
                    elif "epson" in vendor_lower:
                        return "Epson"
                    elif "toshiba" in vendor_lower or "tokyo electric" in vendor_lower:
                        return "Toshiba"
                    elif "ricoh" in vendor_lower:
                        return "Ricoh"
                    return vendor_name

        # 2. Fallback to RTSP URL pattern mapping if MAC OUI was not found or resolved
        if rtsp_url:
            url_lower = rtsp_url.lower()
            if "/cam/realmonitor" in url_lower:
                return "Imou"
            if "/streaming/channels" in url_lower or "/h264/ch" in url_lower or "/h265/ch" in url_lower:
                return "Hikvision"
            if "/onvif1" in url_lower or "/onvif2" in url_lower:
                return "Yoosee"

        return "Generic"

    def _update_live_camera_config_state(agent_uid: str, ip: str, config_dict: dict):
        import json
        from pathlib import Path
        live_file = Path(f"storage/live_cameras_{agent_uid}.json")
        try:
            payload_data = {"cameras": [], "configs": []}
            if live_file.exists():
                with open(live_file, "r", encoding="utf-8") as f:
                    payload_data = json.load(f)
                    if not isinstance(payload_data, dict):
                        payload_data = {"cameras": [], "configs": []}
            
            configs = payload_data.get("configs")
            if not isinstance(configs, list):
                configs = []
            
            updated = False
            for c in configs:
                c_rtsp = c.get("rtsp_url", "")
                import re
                c_ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', c_rtsp)
                c_ip = c_ip_match.group(1) if c_ip_match else c.get("ip")
                if c_ip == ip:
                    c.update(config_dict)
                    updated = True
                    break
            if not updated:
                configs.append(config_dict)
                
            payload_data["configs"] = configs
            with open(live_file, "w", encoding="utf-8") as f:
                json.dump(payload_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            LOGGER.error("Failed to update live camera config state: %s", e)

    def _delete_live_camera_config_state(agent_uid: str, ip: str):
        import json
        from pathlib import Path
        live_file = Path(f"storage/live_cameras_{agent_uid}.json")
        if live_file.exists():
            try:
                with open(live_file, "r", encoding="utf-8") as f:
                    payload_data = json.load(f)
                    if not isinstance(payload_data, dict):
                        payload_data = {"cameras": [], "configs": []}
                
                configs = payload_data.get("configs")
                if isinstance(configs, list):
                    import re
                    new_configs = []
                    for c in configs:
                        c_rtsp = c.get("rtsp_url", "")
                        c_ip_match = re.search(r'rtsp://([^:/]+)', c_rtsp)
                        c_ip = c_ip_match.group(1) if c_ip_match else c.get("ip")
                        if c_ip != ip:
                            new_configs.append(c)
                    payload_data["configs"] = new_configs
                    with open(live_file, "w", encoding="utf-8") as f:
                        json.dump(payload_data, f, indent=2, ensure_ascii=False)
            except Exception as e:
                LOGGER.error("Failed to delete live camera config state: %s", e)

    class MockCameraConfig:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)

    def _get_or_create_camera_config(session, agent_uid, camera_id):
        import ipaddress
        import json
        from pathlib import Path
        
        try:
            ip_str = str(ipaddress.IPv4Address(camera_id))
        except Exception:
            return None
            
        # Read from live JSON file
        live_file = Path(f"storage/live_cameras_{agent_uid}.json")
        config_data = {}
        if live_file.exists():
            try:
                with open(live_file, "r", encoding="utf-8") as f:
                    payload_data = json.load(f)
                    if isinstance(payload_data, dict):
                        configs = payload_data.get("configs") or []
                        cameras = payload_data.get("cameras") or []
                        
                        # Search in configs first
                        for c in configs:
                            rtsp = c.get("rtsp_url", "")
                            import re
                            c_ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', rtsp)
                            c_ip = c_ip_match.group(1) if c_ip_match else c.get("ip")
                            if c_ip == ip_str:
                                config_data = c
                                break
                                
                        # If not found in configs, search in scanned cameras
                        if not config_data:
                            for item in cameras:
                                if item.get("ip") == ip_str:
                                    config_data = {
                                        "camera_name": item.get("camera_name") or f"Camera {ip_str}",
                                        "rtsp_url": item.get("rtsp_url") or f"rtsp://{ip_str}:554/cam/realmonitor?channel=1&subtype=0",
                                        "segment_duration": 60,
                                        "prefix": "rec",
                                        "video_codec": "copy",
                                        "audio_codec": "copy",
                                        "no_audio": True,
                                        "ip": ip_str,
                                        "mac_address": item.get("mac_address") or item.get("mac") or ""
                                    }
                                    break
            except Exception:
                pass
                
        if not config_data:
            config_data = {
                "camera_name": f"Camera {ip_str}",
                "rtsp_url": f"rtsp://{ip_str}:554/cam/realmonitor?channel=1&subtype=0",
                "segment_duration": 60,
                "prefix": "rec",
                "video_codec": "copy",
                "audio_codec": "copy",
                "no_audio": True,
                "ip": ip_str,
                "mac_address": ""
            }
            
        return MockCameraConfig(
            id=camera_id,
            camera_name=config_data.get("camera_name"),
            rtsp_url=config_data.get("rtsp_url"),
            segment_duration=config_data.get("segment_duration", 60),
            prefix=config_data.get("prefix", "rec"),
            video_codec=config_data.get("video_codec", "copy"),
            audio_codec=config_data.get("audio_codec", "copy"),
            no_audio=config_data.get("no_audio", True),
            ip=config_data.get("ip", ip_str),
            mac_address=config_data.get("mac_address", ""),
            is_recording=config_data.get("is_recording", False)
        )

    @app.get("/api/agents/<agent_uid>/cameras")
    def get_agent_cameras(agent_uid: str) -> Any:
        from models import AgentNode
        import ipaddress
        import json
        from pathlib import Path
        
        with session_factory() as session:
            agent = session.execute(
                select(AgentNode)
                .where(AgentNode.agent_uid == agent_uid)
                .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
            ).scalars().first()
            
            if not agent:
                return jsonify({"ok": True, "cameras": []})
                
            online_agents = session.execute(
                select(AgentNode).where(AgentNode.lan_uid == agent.lan_uid, AgentNode.is_online == True)
            ).scalars().all()
            online_uids = [a.agent_uid for a in online_agents]
            
            # Load offline MAC vendors database
            mac_vendors = {}
            mac_file = Path("storage/mac_vendors.json")
            if mac_file.exists():
                try:
                    with open(mac_file, "r", encoding="utf-8") as f:
                        mac_vendors = json.load(f)
                except Exception as e:
                    LOGGER.error("Failed to load mac_vendors.json: %s", e)

            live_cameras = []
            local_configs = []
            seen_ips = set()
            toshiba_ips = set()
            
            for uid in online_uids:
                live_file = Path(f"storage/live_cameras_{uid}.json")
                if live_file.exists():
                    try:
                        with open(live_file, "r", encoding="utf-8") as f:
                            payload_data = json.load(f)
                            cams_list = []
                            cfg_list = []
                            if isinstance(payload_data, dict):
                                cams_list = payload_data.get("cameras") or []
                                cfg_list = payload_data.get("configs") or []
                            elif isinstance(payload_data, list):
                                cams_list = payload_data
                                
                            if isinstance(cams_list, list):
                                for item in cams_list:
                                    ip = (item.get("ip") or "").strip()
                                    if not ip or ip.lower() in ("admin", "generic", "unknown", "camera ip"):
                                        continue
                                    if ip in seen_ips:
                                        continue
                                        
                                    mac = (item.get("mac_address") or item.get("mac") or "").strip()
                                    clean_mac = "".join(c for c in mac if c.isalnum()).upper()
                                    if len(clean_mac) != 12 or not all(c in "0123456789ABCDEF" for c in clean_mac):
                                        continue
                                        
                                    # Filter out Toshiba/Tokyo Electric devices by MAC OUI
                                    is_toshiba = False
                                    if mac_vendors:
                                        clean_mac = "".join(c for c in mac if c.isalnum()).upper()
                                        if len(clean_mac) >= 6:
                                            oui_hex = f"{clean_mac[0:2]}:{clean_mac[2:4]}:{clean_mac[4:6]}"
                                            vendor_info = mac_vendors.get(oui_hex)
                                            if vendor_info:
                                                vendor_name = vendor_info.get("manufacturer", "")
                                                vendor_lower = vendor_name.lower()
                                                if "toshiba" in vendor_lower or "tokyo electric" in vendor_lower:
                                                    is_toshiba = True
                                                    
                                    if is_toshiba:
                                        toshiba_ips.add(ip)
                                        continue
                                        
                                    seen_ips.add(ip)
                                    live_cameras.append(item)
                                    
                            if isinstance(cfg_list, list):
                                for cfg_item in cfg_list:
                                    local_configs.append(cfg_item)
                    except Exception as e:
                        LOGGER.error("Failed to read live cameras file for %s: %s", uid, e)
            
            # Group local configs by IP
            configs_by_ip = {}
            for c in local_configs:
                rtsp = c.get("rtsp_url", "")
                import re
                ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', rtsp)
                ip = ip_match.group(1) if ip_match else c.get("ip")
                if ip:
                    configs_by_ip[ip] = c

            # Group live cameras by MAC address for deduplication
            grouped_by_mac = {}
            for item in live_cameras:
                mac = (item.get("mac_address") or item.get("mac") or "").strip()
                clean_mac = "".join(c for c in mac if c.isalnum()).upper()
                if len(clean_mac) == 12 and all(c in "0123456789ABCDEF" for c in clean_mac):
                    if clean_mac not in grouped_by_mac:
                        grouped_by_mac[clean_mac] = []
                    grouped_by_mac[clean_mac].append(item)

            results = []
            seen_macs = set()

            for clean_mac, items in grouped_by_mac.items():
                seen_macs.add(clean_mac)
                # Primary item is the one recording or first in list
                primary_item = next((it for it in items if it.get("is_recording")), items[0])
                primary_ip = primary_item.get("ip")
                
                all_ips = [it.get("ip") for it in items if it.get("ip")]
                
                # Check if custom name/config exists for any of the IPs
                config = None
                for it_ip in all_ips:
                    if it_ip in configs_by_ip:
                        config = configs_by_ip[it_ip]
                        break
                        
                mac_formatted = f"{clean_mac[0:2]}:{clean_mac[2:4]}:{clean_mac[4:6]}:{clean_mac[6:8]}:{clean_mac[8:10]}:{clean_mac[10:12]}"
                
                try:
                    virtual_id = int(ipaddress.IPv4Address(primary_ip))
                except Exception:
                    virtual_id = 9999
                    
                rtsp_url = (config.get("rtsp_url") if config else None) or primary_item.get("rtsp_url")
                resolved_manufacturer = _get_clean_manufacturer(mac_formatted, mac_vendors, rtsp_url=rtsp_url)
                if resolved_manufacturer == "Toshiba":
                    continue
                
                final_manufacturer = resolved_manufacturer
                if final_manufacturer == "Generic":
                    reported_mfr = primary_item.get("manufacturer") or "Generic"
                    if reported_mfr != "Generic":
                        final_manufacturer = reported_mfr
                
                model_str = primary_item.get("model") or "Camera IP"
                model_lower = model_str.lower()
                if any(err_kw in model_lower for err_kw in ("timeout", "lỗi", "error", "404", "504", "conn")):
                    if final_manufacturer != "Generic":
                        model_str = "Camera IP"
                    else:
                        model_str = "Camera IP (Chưa rõ dòng)"

                # Build combined camera name if multiple IPs share the same MAC
                if config and config.get("camera_name"):
                    camera_name = config.get("camera_name")
                else:
                    if len(all_ips) > 1:
                        other_ips_str = ", ".join(f"Camera {ip}" for ip in all_ips[1:])
                        camera_name = f"Camera {all_ips[0]} ({other_ips_str})"
                    else:
                        camera_name = f"Camera {all_ips[0]}"

                is_any_recording = any(it.get("is_recording", False) for it in items)

                combined_ip_str = ", ".join(all_ips) if len(all_ips) > 1 else primary_ip

                results.append({
                    "id": virtual_id,
                    "agent_uid": agent_uid,
                    "camera_name": camera_name,
                    "rtsp_url": rtsp_url or f"rtsp://{primary_ip}:554/cam/realmonitor?channel=1&subtype=0",
                    "segment_duration": config.get("segment_duration", 60) if config else 60,
                    "prefix": config.get("prefix", "rec") if config else "rec",
                    "video_codec": config.get("video_codec", "copy") if config else "copy",
                    "audio_codec": config.get("audio_codec", "copy") if config else "copy",
                    "no_audio": config.get("no_audio", True) if config else True,
                    "is_recording": is_any_recording,
                    "ip": combined_ip_str,
                    "mac_address": mac_formatted,
                    "manufacturer": final_manufacturer,
                    "model": model_str,
                    "is_online": True,
                })

            # Add offline configured cameras
            for ip, config in configs_by_ip.items():
                if ip not in seen_ips and ip not in toshiba_ips:
                    mac = config.get("mac_address") or ""
                    clean_mac = "".join(c for c in mac if c.isalnum()).upper()
                    if len(clean_mac) != 12 or not all(c in "0123456789ABCDEF" for c in clean_mac):
                        continue
                    if clean_mac in seen_macs:
                        continue
                    seen_macs.add(clean_mac)

                    try:
                        virtual_id = int(ipaddress.IPv4Address(ip))
                    except Exception:
                        virtual_id = 9999
                    
                    rtsp = config.get("rtsp_url") or ""
                    resolved_manufacturer = _get_clean_manufacturer(config.get("mac_address"), mac_vendors, rtsp_url=rtsp)
                    
                    results.append({
                        "id": virtual_id,
                        "agent_uid": agent_uid,
                        "camera_name": config.get("camera_name") or f"Camera {ip}",
                        "rtsp_url": rtsp,
                        "segment_duration": config.get("segment_duration", 60),
                        "prefix": config.get("prefix", "rec"),
                        "video_codec": config.get("video_codec", "copy"),
                        "audio_codec": config.get("audio_codec", "copy"),
                        "no_audio": config.get("no_audio", True),
                        "is_recording": False,
                        "ip": ip,
                        "mac_address": config.get("mac_address") or "",
                        "manufacturer": resolved_manufacturer if resolved_manufacturer != "Generic" else (config.get("manufacturer") or "Generic"),
                        "model": "Camera IP",
                        "is_online": False,
                    })
                    
            return jsonify({"ok": True, "cameras": results})

    @app.post("/api/agents/<agent_uid>/cameras")
    def save_agent_camera(agent_uid: str) -> Any:
        body = request.get_json(silent=True) or {}
        camera_id = body.get("id")
        camera_name = str(body.get("camera_name", "Camera")).strip()
        rtsp_url = str(body.get("rtsp_url", "")).strip()
        segment_duration = int(body.get("segment_duration", 60))
        prefix = str(body.get("prefix", "rec")).strip()
        video_codec = str(body.get("video_codec", "copy")).strip()
        audio_codec = str(body.get("audio_codec", "copy")).strip()
        no_audio = bool(body.get("no_audio", True))
        
        if not rtsp_url:
            return jsonify({"ok": False, "error": "Missing rtsp_url"}), 400
            
        params = {
            "camera_name": camera_name,
            "rtsp_url": rtsp_url,
            "segment_duration": segment_duration,
            "prefix": prefix,
            "video_codec": video_codec,
            "audio_codec": audio_codec,
            "no_audio": no_audio
        }
        
        import ipaddress
        import re
        camera_ip = ""
        if camera_id:
            try:
                camera_ip = str(ipaddress.IPv4Address(camera_id))
            except Exception:
                pass
        
        if not camera_ip:
            ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', rtsp_url)
            if ip_match:
                camera_ip = ip_match.group(1)
                
        # Send save command to Agent (saves to agent's local JSON)
        success, err = _queue_camera_utility_command(agent_uid, "save_camera_config", camera_name, params)
        if success:
            try:
                virtual_id = int(ipaddress.IPv4Address(camera_ip))
            except Exception:
                virtual_id = 9999
                
            # Update Server's local JSON cache instantly
            _update_live_camera_config_state(agent_uid, camera_ip, {
                "camera_name": camera_name,
                "rtsp_url": rtsp_url,
                "segment_duration": segment_duration,
                "prefix": prefix,
                "video_codec": video_codec,
                "audio_codec": audio_codec,
                "no_audio": no_audio,
                "ip": camera_ip
            })
            return jsonify({"ok": True, "camera_id": virtual_id})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/delete")
    def delete_agent_camera(agent_uid: str, camera_id: int) -> Any:
        import ipaddress
        try:
            camera_ip = str(ipaddress.IPv4Address(camera_id))
        except Exception:
            return jsonify({"ok": False, "error": "Invalid camera ID"}), 400
            
        # Get camera name from live file config
        from pathlib import Path
        import json
        live_file = Path(f"storage/live_cameras_{agent_uid}.json")
        camera_name = f"Camera {camera_ip}"
        if live_file.exists():
            try:
                with open(live_file, "r", encoding="utf-8") as f:
                    payload_data = json.load(f)
                    if isinstance(payload_data, dict):
                        for c in (payload_data.get("configs") or []):
                            rtsp = c.get("rtsp_url", "")
                            import re
                            c_ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', rtsp)
                            c_ip = c_ip_match.group(1) if c_ip_match else c.get("ip")
                            if c_ip == camera_ip:
                                camera_name = c.get("camera_name")
                                break
            except Exception:
                pass

        # Stop recording first (just in case)
        _queue_camera_utility_command(agent_uid, "stop_camera_recorder", camera_name, {})
        
        # Send delete config command to Agent
        success, err = _queue_camera_utility_command(agent_uid, "delete_camera_config", camera_name, {})
        if success:
            # Delete config from server JSON cache instantly
            _delete_live_camera_config_state(agent_uid, camera_ip)
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

    def _queue_camera_utility_command(agent_uid: str, action: str, camera_name: str, params: dict, wait_seconds: float = 12.0) -> tuple[bool, str]:
        requested_at = datetime.now(timezone.utc)
        cmd_params = {
            "action": action,
            "camera_name": camera_name,
            **params
        }
        from models import AgentNode
        with session_factory() as session:
            agent = session.execute(
                select(AgentNode)
                .where(AgentNode.agent_uid == agent_uid)
                .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
                .limit(1)
            ).scalars().first()
            lead_val = agent.lead if agent else "default"
            lan_uid_val = agent.lan_uid if agent else ""
            
            command = PrinterControlCommand(
                printer_id=0,
                lead=lead_val,
                lan_uid=lan_uid_val,
                agent_uid=agent_uid,
                printer_name="",
                ip="",
                command_type="trigger_utility",
                command_params=json.dumps(cmd_params),
                status="pending",
                requested_at=requested_at,
            )
            session.add(command)
            session.commit()
            command_id = int(command.id)
            
        success = False
        error_msg = "Timeout waiting for Agent response"
        import time
        iterations = int(wait_seconds / 0.5)
        for _ in range(iterations):
            time.sleep(0.5)
            with session_factory() as session:
                cmd_status = session.execute(
                    select(PrinterControlCommand).where(PrinterControlCommand.id == command_id)
                ).scalars().first()
                if cmd_status:
                    if cmd_status.status == "success":
                        success = True
                        error_msg = cmd_status.error_message or ""
                        break
                    elif cmd_status.status == "failed":
                        success = False
                        error_msg = cmd_status.error_message or "Agent failed execution"
                        break
                        
        return success, error_msg

    def _update_live_camera_recording_state(agent_uid: str, ip: str, is_recording: bool):
        import json
        from pathlib import Path
        live_file = Path(f"storage/live_cameras_{agent_uid}.json")
        if live_file.exists():
            try:
                payload_data = {"cameras": [], "configs": []}
                with open(live_file, "r", encoding="utf-8") as f:
                    payload_data = json.load(f)
                    if not isinstance(payload_data, dict):
                        payload_data = {"cameras": [], "configs": []}
                
                cams = payload_data.get("cameras") or []
                updated = False
                for item in cams:
                    if item.get("ip") == ip:
                        item["is_recording"] = is_recording
                        updated = True
                        break
                        
                configs = payload_data.get("configs") or []
                for item in configs:
                    c_rtsp = item.get("rtsp_url", "")
                    import re
                    c_ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', c_rtsp)
                    c_ip = c_ip_match.group(1) if c_ip_match else item.get("ip")
                    if c_ip == ip:
                        item["is_recording"] = is_recording
                        updated = True
                        break
                        
                if updated:
                    payload_data["cameras"] = cams
                    payload_data["configs"] = configs
                    with open(live_file, "w", encoding="utf-8") as f:
                        json.dump(payload_data, f, indent=2, ensure_ascii=False)
            except Exception as e:
                LOGGER.error("Failed to update live cameras JSON state: %s", e)

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/start")
    def start_agent_camera_recording(agent_uid: str, camera_id: int) -> Any:
        body = request.get_json(silent=True) or {}
        duration = body.get("duration")
        
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
                
            params = {
                "rtsp_url": cfg.rtsp_url,
                "segment_duration": cfg.segment_duration,
                "video_codec": cfg.video_codec,
                "audio_codec": cfg.audio_codec,
                "no_audio": cfg.no_audio,
                "prefix": cfg.prefix
            }
            if duration is not None:
                try:
                    params["duration_limit"] = int(duration) * 60
                except (ValueError, TypeError):
                    pass
            camera_name = cfg.camera_name
            camera_ip = cfg.ip
            
        success, err = _queue_camera_utility_command(agent_uid, "start_camera_recorder", camera_name, params)
        if success:
            _update_live_camera_recording_state(agent_uid, camera_ip, True)
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/stop")
    def stop_agent_camera_recording(agent_uid: str, camera_id: int) -> Any:
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name
            camera_ip = cfg.ip
            
        success, err = _queue_camera_utility_command(agent_uid, "stop_camera_recorder", camera_name, {})
        if success:
            _update_live_camera_recording_state(agent_uid, camera_ip, False)
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/status")
    def get_agent_camera_status(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name
            
        success, payload = _queue_camera_utility_command(agent_uid, "get_camera_status", camera_name, {})
        if success:
            try:
                status_dict = json.loads(payload)
                return jsonify({"ok": True, "status": status_dict, "result": status_dict})
            except Exception as e:
                return jsonify({"ok": False, "error": f"Failed parsing payload: {e}"}), 500
        return jsonify({"ok": False, "error": payload}), 200

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/test")
    def test_agent_camera_rtsp(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            rtsp_url = cfg.rtsp_url
            
        success, payload = _queue_camera_utility_command(agent_uid, "test_camera_rtsp", "", {"rtsp_url": rtsp_url})
        if success:
            try:
                test_dict = json.loads(payload)
                return jsonify({"ok": True, "result": test_dict})
            except Exception as e:
                return jsonify({"ok": False, "error": f"Failed parsing payload: {e}"}), 500
        return jsonify({"ok": False, "error": payload}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/files")
    def get_agent_camera_files(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name
            
        success, payload = _queue_camera_utility_command(agent_uid, "list_camera_files", camera_name, {}, wait_seconds=30.0)
        if success:
            try:
                files_dict = json.loads(payload)
                return jsonify({"ok": True, "files": files_dict.get("files", [])})
            except Exception as e:
                return jsonify({"ok": False, "error": f"Failed parsing payload: {e}"}), 500
        return jsonify({"ok": False, "error": payload}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/delete-file")
    def delete_agent_camera_file(agent_uid: str, camera_id: int) -> Any:
        body = request.get_json(silent=True) or {}
        filename = str(body.get("filename", "")).strip()
        if not filename:
            return jsonify({"ok": False, "error": "Missing filename"}), 400
            
        success, err = _queue_camera_utility_command(agent_uid, "delete_camera_file", "", {"filename": filename})
        if success:
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/query-video")
    def query_agent_camera_video(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        body = request.get_json(silent=True) or {}
        timestamp = str(body.get("timestamp", "")).strip()
        duration = int(body.get("duration", 10))
        
        if not timestamp:
            return jsonify({"ok": False, "error": "Missing timestamp"}), 400
            
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name

        # Instantly return success if the video clip is already cached on the server
        target_ts = None
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S.%f"):
            try:
                from datetime import datetime
                target_ts = datetime.strptime(timestamp, fmt)
                break
            except ValueError:
                continue

        if target_ts:
            expected_filename = f"clip_{camera_name}_{target_ts.strftime('%Y%m%d_%H%M%S')}.mp4"
            dest_dir = Path(__file__).resolve().parent / "static" / "camera_clips" / agent_uid
            dest_path = dest_dir / expected_filename
            if dest_path.exists():
                return jsonify({"ok": True})
            
        success, err = _queue_camera_utility_command(
            agent_uid, "query_camera_video", camera_name,
            {"timestamp": timestamp, "duration": duration},
            wait_seconds=110.0
        )
        if success:
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 200

    @app.post("/api/agents/<agent_uid>/cameras/upload-video")
    def upload_agent_camera_video(agent_uid: str) -> Any:
        if "file" not in request.files:
            return jsonify({"ok": False, "error": "No file uploaded"}), 400
            
        uploaded_file = request.files["file"]
        if not uploaded_file.filename:
            return jsonify({"ok": False, "error": "Empty filename"}), 400
            
        dest_dir = Path(__file__).resolve().parent / "static" / "camera_clips" / agent_uid
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest_path = dest_dir / uploaded_file.filename
        
        uploaded_file.save(str(dest_path))
        return jsonify({"ok": True, "filename": uploaded_file.filename})

    @app.get("/api/agents/<agent_uid>/cameras/clips/<filename>")
    def get_agent_camera_clip(agent_uid: str, filename: str) -> Any:
        dest_dir = Path(__file__).resolve().parent / "static" / "camera_clips" / agent_uid
        return send_from_directory(str(dest_dir), filename)

    @app.post("/api/cameras/record-control")
    def control_camera_recording_by_mac() -> Any:
        from models import CameraConfig, AgentNode
        body = request.get_json(silent=True) or {}
        mac_id = str(body.get("mac_id", "")).strip()
        agent_uid_req = str(body.get("agent_uid", "")).strip()
        action = str(body.get("action", "")).strip().lower()
        duration = int(body.get("duration", 30))

        if not mac_id:
            return jsonify({"ok": False, "error": "Thiếu MAC ID của camera (mac_id)"}), 400
        if action not in ("start", "stop", "record"):
            return jsonify({"ok": False, "error": "Hành động không hợp lệ (action phải là start, stop hoặc record)"}), 400

        # Normalize mac_id for robust matching
        norm_mac_id = mac_id.replace(":", "").replace("-", "").lower()

        with session_factory() as session:
            # Query all camera configs ordered by ID descending to prefer newer configurations
            cameras_list = session.execute(select(CameraConfig).order_by(CameraConfig.id.desc())).scalars().all()
            
            # Find candidates by MAC ID matching
            candidates = []
            for c in cameras_list:
                if c.mac_address:
                    c_norm = c.mac_address.replace(":", "").replace("-", "").lower()
                    if c_norm == norm_mac_id:
                        candidates.append(c)

            if not candidates:
                # Fallback to checking live_cameras JSON files in storage_dir on server
                storage_dir = Path(app.config.get("STORAGE_DIR", "storage"))
                live_cam_item = None
                live_agent_uid = agent_uid_req
                
                # Search across all online agents' live_cameras files
                online_agents_list = session.execute(select(AgentNode).where(AgentNode.is_online == True)).scalars().all()
                for ag in online_agents_list:
                    ag_file = storage_dir / f"live_cameras_{ag.agent_uid}.json"
                    if ag_file.exists():
                        try:
                            with open(ag_file, "r", encoding="utf-8") as f:
                                payload_data = json.load(f)
                                cams_list = payload_data.get("cameras") if isinstance(payload_data, dict) else (payload_data if isinstance(payload_data, list) else [])
                                for item in cams_list:
                                    item_mac = (item.get("mac_address") or item.get("mac") or "").strip()
                                    if item_mac and item_mac.replace(":", "").replace("-", "").lower() == norm_mac_id:
                                        live_cam_item = item
                                        live_agent_uid = ag.agent_uid
                                        break
                        except Exception:
                            pass
                    if live_cam_item:
                        break

                if live_cam_item:
                    # Construct a transient config object
                    cam_ip = live_cam_item.get("ip", "")
                    cfg = CameraConfig(
                        agent_uid=live_agent_uid,
                        camera_name=live_cam_item.get("camera_name") or f"Camera {cam_ip}",
                        rtsp_url=live_cam_item.get("rtsp_url") or f"rtsp://{cam_ip}:554/cam/realmonitor?channel=1&subtype=0",
                        segment_duration=60,
                        prefix="rec",
                        video_codec="copy",
                        audio_codec="copy",
                        no_audio=True,
                        ip=cam_ip,
                        mac_address=mac_id
                    )
                    candidates = [cfg]
                else:
                    return jsonify({"ok": False, "error": f"Không tìm thấy cấu hình camera với MAC ID: {mac_id}"}), 404

            # Candidate config to read parameters from
            cfg = candidates[0]

            # Determine the online agent to run the command on:
            online_agent = None
            
            # 1. If explicit agent_uid was requested, check if it's online
            if agent_uid_req:
                agent = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == agent_uid_req)
                    .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
                ).scalars().first()
                if agent and agent.is_online:
                    online_agent = agent

            # 2. Fallback: Find candidate whose managing agent is online
            if not online_agent:
                for cand in candidates:
                    agent = session.execute(
                        select(AgentNode)
                        .where(AgentNode.agent_uid == cand.agent_uid)
                        .order_by(AgentNode.last_seen_at.desc())
                    ).scalars().first()
                    if agent and agent.is_online:
                        cfg = cand
                        online_agent = agent
                        break

            # 3. Fallback: Find any online agent in the same LAN as the camera config
            if not online_agent:
                for cand in candidates:
                    if cand.lan_uid and cand.lan_uid != "default":
                        agent = session.execute(
                            select(AgentNode)
                            .where(AgentNode.lan_uid == cand.lan_uid, AgentNode.is_online == True)
                            .order_by(AgentNode.last_seen_at.desc())
                        ).scalars().first()
                        if agent:
                            cfg = cand
                            online_agent = agent
                            break

            # 4. Fallback: First candidate's managing agent (offline)
            if not online_agent:
                online_agent = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == cfg.agent_uid)
                    .order_by(AgentNode.last_seen_at.desc())
                ).scalars().first()

            if not online_agent or not online_agent.is_online:
                return jsonify({"ok": False, "error": f"Không có Agent trực tuyến nào để thực hiện thao tác (Agent yêu cầu: {agent_uid_req or cfg.agent_uid} đang ngoại tuyến)"}), 400

            agent_uid = online_agent.agent_uid
            camera_name = cfg.camera_name
            params = {
                "rtsp_url": cfg.rtsp_url,
                "segment_duration": cfg.segment_duration,
                "video_codec": cfg.video_codec,
                "audio_codec": cfg.audio_codec,
                "no_audio": cfg.no_audio,
                "prefix": cfg.prefix,
                "mac_address": cfg.mac_address or mac_id
            }

        if action == "start":
            params["duration_limit"] = duration * 60
            success, err = _queue_camera_utility_command(agent_uid, "start_camera_recorder", camera_name, params)
            if success:
                _update_live_camera_recording_state(agent_uid, cfg.ip, True)
                return jsonify({"ok": True, "message": f"Đã bắt đầu ghi hình thành công với giới hạn {duration} phút"})
            return jsonify({"ok": False, "error": f"Không thể bắt đầu ghi hình: {err}"}), 504

        elif action == "stop":
            success, err = _queue_camera_utility_command(agent_uid, "stop_camera_recorder", camera_name, {})
            if success:
                _update_live_camera_recording_state(agent_uid, cfg.ip, False)
                return jsonify({"ok": True, "message": "Đã dừng ghi hình thành công"})
            return jsonify({"ok": False, "error": f"Không thể dừng ghi hình: {err}"}), 504

        elif action == "record":
            # Ensure the segment duration is long enough so FFmpeg does not split the recording
            record_params = dict(params)
            record_params["segment_duration"] = max(cfg.segment_duration, duration + 15)
            record_params["duration_limit"] = duration

            success, err = _queue_camera_utility_command(agent_uid, "start_camera_recorder", camera_name, record_params, wait_seconds=3.0)
            if not success and err != "Timeout waiting for Agent response":
                return jsonify({"ok": False, "error": f"Không thể bắt đầu ghi hình: {err}"}), 504

            _update_live_camera_recording_state(agent_uid, cfg.ip, True)
            return jsonify({"ok": True, "message": f"Đã gửi lệnh bắt đầu ghi hình {duration}s tới Agent!"})

