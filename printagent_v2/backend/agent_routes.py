from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, render_template, request
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

TUNNEL_REGISTRY: dict[tuple[str, str], int] = {}
TUNNEL_TOKENS: dict[str, int] = {}
TUNNEL_KEYS: dict[tuple[str, str], str] = {}

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
                
                url = f"http://127.0.0.1:{port}{path}"
                headers = {key: value for key, value in request.headers.items() if key.lower() not in ("host", "content-length", "connection", "transfer-encoding")}
                
                try:
                    resp = requests.request(
                        method=request.method,
                        url=url,
                        headers=headers,
                        data=request.get_data(),
                        cookies=request.cookies,
                        allow_redirects=False,
                        stream=True,
                        timeout=30
                    )
                    
                    excluded_headers = ["content-length", "transfer-encoding", "connection"]
                    resp_headers = [(name, val) for name, val in resp.raw.headers.items() if name.lower() not in excluded_headers]
                    
                    return Response(
                        resp.iter_content(chunk_size=1024*64),
                        status=resp.status_code,
                        headers=resp_headers
                    )
                except Exception as exc:
                    return f"Tunnel Proxy Error: Failed to connect to local port {port}: {exc}", 502

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
        valid_actions = {"devices_and_printers", "open_scan_folder", "dxdiag", "change_ip", "exec", "run_command"}
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
                ).order_by(AgentNode.updated_at.desc())
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
            
        key = (agent_uid, printer_ip)
        if key in TUNNEL_REGISTRY:
            port = TUNNEL_REGISTRY[key]
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
                # Prioritize matching agent_uid, ip, and the active lan_uid
                printer = session.execute(
                    select(Printer).where(
                        Printer.agent_uid == agent_uid,
                        Printer.ip == printer_ip,
                        Printer.lan_uid == active_agent.lan_uid
                    )
                ).scalars().first()

            if not printer:
                printer = session.execute(
                    select(Printer).where(Printer.agent_uid == agent_uid, Printer.ip == printer_ip)
                ).scalars().first()

            if not printer:
                printer = session.execute(
                    select(Printer).where(Printer.ip == printer_ip)
                ).scalars().first()
            if not printer:
                return jsonify({"ok": False, "error": f"Printer with IP {printer_ip} not found in database"}), 404

            command = PrinterControlCommand(
                printer_id=printer.id,
                lead=printer.lead,
                lan_uid=printer.lan_uid,
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
            
        key = (agent_uid, printer_ip)
        TUNNEL_REGISTRY.pop(key, None)
        token = TUNNEL_KEYS.pop(key, None)
        if token:
            TUNNEL_TOKENS.pop(token, None)
        
        requested_at = datetime.now(timezone.utc)
        params = {
            "action": "stop_tunnel",
            "target_ip": printer_ip
        }
        with session_factory() as session:
            printer = session.execute(
                select(Printer).where(Printer.agent_uid == agent_uid, Printer.ip == printer_ip)
            ).scalars().first()
            if not printer:
                printer = session.execute(
                    select(Printer).where(Printer.ip == printer_ip)
                ).scalars().first()
            if not printer:
                return jsonify({"ok": False, "error": f"Printer with IP {printer_ip} not found in database"}), 404

            command = PrinterControlCommand(
                printer_id=printer.id,
                lead=printer.lead,
                lan_uid=printer.lan_uid,
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


    @app.get("/api/agents/<agent_uid>/cameras")
    def get_agent_cameras(agent_uid: str) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            configs = session.execute(
                select(CameraConfig).where(CameraConfig.agent_uid == agent_uid)
            ).scalars().all()
            
            results = []
            for c in configs:
                results.append({
                    "id": c.id,
                    "agent_uid": c.agent_uid,
                    "camera_name": c.camera_name,
                    "rtsp_url": c.rtsp_url,
                    "segment_duration": c.segment_duration,
                    "prefix": c.prefix,
                    "video_codec": c.video_codec,
                    "audio_codec": c.audio_codec,
                    "no_audio": c.no_audio,
                    "is_recording": c.is_recording,
                })
            return jsonify({"ok": True, "cameras": results})

    @app.post("/api/agents/<agent_uid>/cameras")
    def save_agent_camera(agent_uid: str) -> Any:
        from models import CameraConfig
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
            
        with session_factory() as session:
            if camera_id:
                cfg = session.execute(
                    select(CameraConfig).where(CameraConfig.id == camera_id, CameraConfig.agent_uid == agent_uid)
                ).scalars().first()
                if not cfg:
                    return jsonify({"ok": False, "error": "Camera config not found"}), 404
            else:
                cfg = CameraConfig(agent_uid=agent_uid)
                session.add(cfg)
                
            cfg.camera_name = camera_name
            cfg.rtsp_url = rtsp_url
            cfg.segment_duration = segment_duration
            cfg.prefix = prefix
            cfg.video_codec = video_codec
            cfg.audio_codec = audio_codec
            cfg.no_audio = no_audio
            
            session.commit()
            return jsonify({"ok": True, "camera_id": cfg.id})

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/delete")
    def delete_agent_camera(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = session.execute(
                select(CameraConfig).where(CameraConfig.id == camera_id, CameraConfig.agent_uid == agent_uid)
            ).scalars().first()
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            session.delete(cfg)
            session.commit()
            return jsonify({"ok": True})

    def _queue_camera_utility_command(agent_uid: str, action: str, camera_name: str, params: dict, wait_seconds: float = 15.0) -> tuple[bool, str]:
        requested_at = datetime.now(timezone.utc)
        cmd_params = {
            "action": action,
            "camera_name": camera_name,
            **params
        }
        with session_factory() as session:
            command = PrinterControlCommand(
                printer_id=0,
                lead="",
                lan_uid="",
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

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/start")
    def start_agent_camera_recording(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = session.execute(
                select(CameraConfig).where(CameraConfig.id == camera_id, CameraConfig.agent_uid == agent_uid)
            ).scalars().first()
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
            camera_name = cfg.camera_name
            
        success, err = _queue_camera_utility_command(agent_uid, "start_camera_recorder", camera_name, params)
        if success:
            with session_factory() as session:
                cfg = session.execute(
                    select(CameraConfig).where(CameraConfig.id == camera_id)
                ).scalars().first()
                if cfg:
                    cfg.is_recording = True
                    session.commit()
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/stop")
    def stop_agent_camera_recording(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = session.execute(
                select(CameraConfig).where(CameraConfig.id == camera_id, CameraConfig.agent_uid == agent_uid)
            ).scalars().first()
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name
            
        success, err = _queue_camera_utility_command(agent_uid, "stop_camera_recorder", camera_name, {})
        if success:
            with session_factory() as session:
                cfg = session.execute(
                    select(CameraConfig).where(CameraConfig.id == camera_id)
                ).scalars().first()
                if cfg:
                    cfg.is_recording = False
                    session.commit()
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/status")
    def get_agent_camera_status(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = session.execute(
                select(CameraConfig).where(CameraConfig.id == camera_id, CameraConfig.agent_uid == agent_uid)
            ).scalars().first()
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name
            
        success, payload = _queue_camera_utility_command(agent_uid, "get_camera_status", camera_name, {})
        if success:
            try:
                status_dict = json.loads(payload)
                return jsonify({"ok": True, "status": status_dict})
            except Exception as e:
                return jsonify({"ok": False, "error": f"Failed parsing payload: {e}"}), 500
        return jsonify({"ok": False, "error": payload}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/test")
    def test_agent_camera_rtsp(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = session.execute(
                select(CameraConfig).where(CameraConfig.id == camera_id, CameraConfig.agent_uid == agent_uid)
            ).scalars().first()
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
            cfg = session.execute(
                select(CameraConfig).where(CameraConfig.id == camera_id, CameraConfig.agent_uid == agent_uid)
            ).scalars().first()
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name
            
        success, payload = _queue_camera_utility_command(agent_uid, "list_camera_files", camera_name, {})
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
            cfg = session.execute(
                select(CameraConfig).where(CameraConfig.id == camera_id, CameraConfig.agent_uid == agent_uid)
            ).scalars().first()
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name
            
        success, err = _queue_camera_utility_command(
            agent_uid, "query_camera_video", camera_name,
            {"timestamp": timestamp, "duration": duration},
            wait_seconds=35.0
        )
        if success:
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

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
