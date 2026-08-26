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



def register_agent_core_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:

    @app.before_request
    def handle_subdomain_proxy():
        host = request.host
        if host.endswith(".app.goxprint.com") and host != "app.goxprint.com":
            subdomain = host.split(".")[0]
            port = TUNNEL_TOKENS.get(subdomain)
            if not port:
                from flask import redirect
                return redirect("https://app.goxprint.com/test-404")
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
            devices_payload = body.get("devices") or body.get("printers") or body.get("devices_list") or body.get("printers_json")
            if not isinstance(devices_payload, list) and isinstance(devices_payload, dict):
                devices_payload = list(devices_payload.values())

            client_pub_ip = request.headers.get("X-Forwarded-For", request.remote_addr or "").split(",")[0].strip()

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
                devices_list=devices_payload if isinstance(devices_payload, list) else None,
                public_ip=client_pub_ip,
            )

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



    @app.get("/api/agent/release")
    def get_agent_release() -> Any:
        current_version = _to_text(request.args.get("current_version"))
        current_sha256 = _to_text(request.args.get("current_sha256")).lower()

        manifest_path = Path("storage/releases/agent_release.json")
        payload = {}
        if manifest_path.exists():
            try:
                payload = json.loads(manifest_path.read_text(encoding="utf-8"))
            except Exception:
                pass

        version = _to_text(payload.get("version")) or "2.3.8"
        sha256 = _to_text(payload.get("sha256")).lower()
        update_available = _is_newer_version(version, current_version)

        dl_url = _to_text(payload.get("download_url")) or "https://download.goxprint.com/printagent.exe"
        if not dl_url.lower().endswith(".zip") and "?" not in dl_url:
            dl_url = f"{dl_url}?v={version}"

        return jsonify({
            "ok": True,
            "version": version,
            "download_url": dl_url,
            "sha256": sha256,
            "size": int(payload.get("size") or 0),
            "published_at": _to_text(payload.get("published_at")),
            "mandatory": bool(payload.get("mandatory", False)),
            "notes": _to_text(payload.get("notes")),
            "channel": _to_text(payload.get("channel") or "stable"),
            "update_available": update_available,
        })

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
        import os
        vps_host = os.environ.get("VPS_SSH_HOST") or request.host.split(":")[0]
        vps_user = os.environ.get("VPS_SSH_USER") or "root"
        params = {
            "action": "start_tunnel",
            "target_ip": printer_ip,
            "target_port": printer_port,
            "vps_ip": vps_host,
            "remote_port": port,
            "vps_user": vps_user
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
            printer_id = printer.id if printer else 0
            printer_lead = printer.lead if printer else (active_agent.lead if active_agent else "default")
            printer_lan_uid = active_agent.lan_uid if active_agent else (printer.lan_uid if printer else "default")
            printer_name = printer.printer_name if printer else f"Printer {printer_ip}"

            command = PrinterControlCommand(
                printer_id=printer_id,
                lead=printer_lead,
                lan_uid=printer_lan_uid,
                agent_uid=agent_uid,
                printer_name=printer_name,
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
            printer_id = printer.id if printer else 0
            printer_lead = printer.lead if printer else (active_agent.lead if active_agent else "default")
            printer_lan_uid = active_agent.lan_uid if active_agent else (printer.lan_uid if printer else "default")
            printer_name = printer.printer_name if printer else f"Printer {printer_ip}"

            command = PrinterControlCommand(
                printer_id=printer_id,
                lead=printer_lead,
                lan_uid=printer_lan_uid,
                agent_uid=agent_uid,
                printer_name=printer_name,
                ip=printer_ip,
                command_type="trigger_utility",
                command_params=json.dumps(params),
                status="pending",
                requested_at=requested_at,
            )
            session.add(command)
            session.commit()
            
        return jsonify({"ok": True})
