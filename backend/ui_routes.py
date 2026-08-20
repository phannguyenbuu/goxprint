from __future__ import annotations

import logging
from typing import Any
from pathlib import Path
import time as time_module

from flask import Flask, redirect, render_template, request, url_for, jsonify

from utils import _to_text, _parse_timestamp
from serializers import _serialize_lead_model
from app_helpers import _load_agent_release_manifest, _format_agents_datetime_ui

PUBLIC_API_FILE = Path("PUBLIC_API.md")

LOGGER = logging.getLogger(__name__)

def register_ui_routes(app: Flask, session_factory: Any) -> None:

    @app.post("/ui/agents/<agent_uid>/utility/exec")
    def ui_trigger_agent_utility_exec(agent_uid: str) -> Any:
        body = request.get_json(silent=True) or {}
        command = _to_text(body.get("command", "exec"))
        command_content = _to_text(body.get("command_content", ""))
        lead = _to_text(body.get("lead", "default"))

        if not command_content:
            return jsonify({"ok": False, "error": "Missing command_content"}), 400

        with session_factory() as db_session:
            from models import AgentNode, PrinterControlCommand
            from datetime import datetime, timezone
            from sqlalchemy import select
            import json

            agent = db_session.execute(
                select(AgentNode).where(AgentNode.agent_uid == agent_uid).order_by(AgentNode.updated_at.desc())
            ).scalars().first()
            if not agent:
                return jsonify({"ok": False, "error": "Agent not found"}), 404

            if command == "force_subnet_scan":
                target_lan = agent.lan_uid or "default"
                LOGGER.info("[VPS] Clearing DB printers & RAM cache for lan_uid=%s on force_subnet_scan", target_lan)
                try:
                    from models import Printer, DeviceInfor
                    from sqlalchemy import delete
                    db_session.execute(delete(Printer).where(Printer.lan_uid == target_lan))
                    db_session.execute(delete(DeviceInfor).where(DeviceInfor.lan_uid == target_lan))
                    db_session.commit()
                except Exception as del_err:
                    LOGGER.warning("[VPS] Could not delete DB printers for lan_uid %s: %s", target_lan, del_err)
                
                try:
                    from active_agents_registry import ACTIVE_AGENTS
                    for ag_key, ag_data in list(ACTIVE_AGENTS.items()):
                        if isinstance(ag_data, dict) and ag_data.get("lan_uid") == target_lan:
                            ag_data["devices"] = {}
                            ag_data["printers_json"] = []
                except Exception as ram_err:
                    LOGGER.warning("[VPS] Could not clear RAM printers for lan_uid %s: %s", target_lan, ram_err)

                existing = db_session.execute(
                    select(PrinterControlCommand).where(
                        PrinterControlCommand.agent_uid == agent_uid,
                        PrinterControlCommand.status == "pending",
                        PrinterControlCommand.command_type == "trigger_utility",
                        PrinterControlCommand.command_params.like('%"force_subnet_scan"%')
                    )
                ).scalars().first()
                if existing:
                    return jsonify({"ok": True, "skipped": True, "message": "Already pending", "id": existing.id})

            target_ip = str(body.get("printer_ip") or body.get("ip") or body.get("target_ip") or "").strip()
            target_user = str(body.get("auth_user") or body.get("user") or body.get("target_user") or "admin").strip()
            raw_pass = body.get("auth_password") if body.get("auth_password") is not None else body.get("password", body.get("target_pass", ""))
            target_pass = str(raw_pass or "").strip()
            target_id = str(body.get("target_id") or body.get("entry_id") or body.get("id") or body.get("registration_no") or "").strip()
            target_name = str(body.get("target_name") or body.get("name") or body.get("scan_username") or body.get("username") or body.get("user") or "").strip()

            from utils import resolve_utility_command_content
            command_content = resolve_utility_command_content(db_session, command_content)
            command_content = command_content.replace("__TARGET_IP__", target_ip).replace("__PRINTER_IP__", target_ip)
            command_content = command_content.replace("__TARGET_USER__", target_user).replace("__AUTH_USER__", target_user)
            command_content = command_content.replace("__TARGET_PASS__", target_pass).replace("__AUTH_PASS__", target_pass)
            command_content = command_content.replace("__TARGET_ID__", target_id).replace("__ENTRY_ID__", target_id).replace("__REGISTRATION_NO__", target_id)
            command_content = command_content.replace("__TARGET_SCAN_USER__", target_name).replace("__TARGET_NAME__", target_name).replace("__SCAN_USERNAME__", target_name)

            params_str = json.dumps({
                "action": "exec_utility",
                "command": command,
                "command_content": command_content,
                "printer_ip": target_ip,
                "ip": target_ip,
                "auth_user": target_user,
                "auth_password": target_pass,
            })
            cmd = PrinterControlCommand(
                printer_id=0,
                lead=lead,
                lan_uid=agent.lan_uid,
                agent_uid=agent_uid,
                printer_name="AgentNode",
                ip="0.0.0.0",
                desired_enabled=True,
                command_type="trigger_utility",
                command_params=params_str,
                status="pending",
                requested_at=datetime.now(timezone.utc),
            )
            db_session.add(cmd)
            db_session.commit()
            return jsonify({"ok": True, "id": cmd.id})

    @app.get("/")
    def index() -> Any:
        return redirect(url_for("dashboard"))

    @app.get("/dashboard")
    def dashboard() -> Any:
        return render_template("dashboard.html", active_tab="dashboard", page_title="Configuration")

    @app.get("/configs")
    def configs_page() -> Any:
        return render_template("configs.html", active_tab="configs", page_title="Display Configs")

    @app.get("/devices")
    def devices_page() -> Any:
        return redirect(url_for("infor_page"))

    @app.get("/infor")
    def infor_page() -> Any:
        return render_template("devices.html", active_tab="infor", page_title="Infor")

    @app.get("/api-docs")
    def api_docs_page() -> Any:
        markdown_text = ""
        try:
            markdown_text = PUBLIC_API_FILE.read_text(encoding="utf-8")
        except Exception as exc:
            LOGGER.warning("Cannot read PUBLIC_API.md: %s", exc)
        return render_template(
            "api_docs.html",
            active_tab="api_docs",
            page_title="Public API",
            api_markdown=markdown_text,
        )

    @app.get("/lan-network")
    @app.get("/lan-sites")
    def lan_sites_page() -> Any:
        return render_template("lan_sites.html", active_tab="lan_sites", page_title="Lan Network")

    @app.get("/printagent")
    def printagent_page() -> Any:
        from models import Printer
        from sqlalchemy import select
        with session_factory() as session:
            printer = session.execute(
                select(Printer).where(Printer.ip == "192.168.1.226")
            ).scalar_one_or_none()
            printer_id = printer.id if printer else None
            lead = printer.lead if printer else None
            lan_uid = printer.lan_uid if printer else None
        return render_template(
            "printagent.html",
            active_tab="printagent",
            page_title="PrintAgent Manager",
            printer_ip="192.168.1.226",
            printer_id=printer_id,
            lead=lead,
            lan_uid=lan_uid
        )

    @app.get("/printers")
    def printers_page() -> Any:
        return render_template("printers_dashboard.html", active_tab="printers", page_title="Printers")

    @app.get("/counter")
    def counter_page() -> Any:
        return render_template("counter.html", active_tab="counter", page_title="Counter Infor")

    @app.get("/status")
    def status_page() -> Any:
        return render_template("status.html", active_tab="status", page_title="Status Infor")

    @app.get("/heatmap")
    def heatmap_page() -> Any:
        return render_template("heatmap.html", active_tab="heatmap", page_title="Heatmap")

    @app.get("/health")
    def health_page() -> Any:
        return render_template("health.html", active_tab="health", page_title="Health Monitor")

    @app.get("/scan-points")
    def scan_points_page() -> Any:
        return render_template("scan_points.html", active_tab="scan_points", page_title="Scan Points")

    @app.get("/copier-auths")
    def copier_auths_page() -> Any:
        return render_template("copier_auths.html", active_tab="copier_auths", page_title="Copier Auths")

    @app.get("/uticommands")
    def uticommands_page() -> Any:
        return render_template("uticommands.html", active_tab="uticommands", page_title="Uti Commands")

    @app.get("/jobs")
    def jobs_page() -> Any:
        return render_template("jobs.html", active_tab="jobs", page_title="Job Manager")

    @app.get("/api/uticommands")
    def get_all_uticommands() -> Any:
        from models import UtiCommand
        from sqlalchemy import select
        try:
            with session_factory() as session:
                cmds = session.execute(select(UtiCommand).order_by(UtiCommand.command.asc())).scalars().all()
                res = []
                for c in cmds:
                    res.append({
                        "command": c.command,
                        "label": c.label,
                        "icon": c.icon or "",
                        "description": c.description or "",
                        "output_modal": c.output_modal,
                        "command_content": c.command_content or ""
                    })
                return jsonify({"ok": True, "commands": res})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500

    @app.post("/api/uticommands/<command_name>")
    def update_uticommand_content(command_name: str) -> Any:
        from models import UtiCommand
        from sqlalchemy import select
        body = request.get_json(silent=True) or {}
        new_content = body.get("command_content")
        if new_content is None:
            return jsonify({"ok": False, "error": "Missing command_content"}), 400
        try:
            with session_factory() as session:
                cmd = session.execute(select(UtiCommand).where(UtiCommand.command == command_name)).scalar_one_or_none()
                if not cmd:
                    return jsonify({"ok": False, "error": "Command not found"}), 404
                cmd.command_content = new_content
                session.commit()
                return jsonify({"ok": True, "message": "Updated successfully"})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500


    @app.get("/api/scan-points")
    def get_all_scan_points() -> Any:
        q = _to_text(request.args.get("q", "")).strip()
        with session_factory() as session:
            from models import ScanPoint
            from sqlalchemy import select
            stmt = select(ScanPoint).order_by(ScanPoint.updated_at.desc())
            if q:
                stmt = stmt.where(
                    (ScanPoint.printer_name.ilike(f"%{q}%")) |
                    (ScanPoint.mac_id.ilike(f"%{q}%")) |
                    (ScanPoint.ip.ilike(f"%{q}%")) |
                    (ScanPoint.agent_uid.ilike(f"%{q}%"))
                )
            rows = session.execute(stmt).scalars().all()
            
            res = []
            for r in rows:
                ab_data = r.address_book_data or {}
                dest_count = len(ab_data) if isinstance(ab_data, dict) else (len(ab_data) if isinstance(ab_data, list) else 0)
                res.append({
                    "mac_id": r.mac_id,
                    "printer_name": r.printer_name or "",
                    "ip": r.ip or "",
                    "agent_uid": r.agent_uid or "",
                    "status": r.status or "success",
                    "updated_at": r.updated_at.isoformat() if r.updated_at else "",
                    "destination_count": dest_count,
                    "address_book_data": ab_data
                })
            return jsonify({"ok": True, "rows": res})

    @app.get("/api/copier-auths")
    def get_all_copier_auths() -> Any:
        from active_agents_registry import ACTIVE_AGENTS
        from models import Printer, PrinterAuthCredential
        from sqlalchemy import select
        
        # 1. Fetch credentials map from PrinterAuthCredential
        creds_map = {}
        with session_factory() as session:
            db_creds = session.execute(select(PrinterAuthCredential)).scalars().all()
            for c in db_creds:
                mac = str(c.mac_address or "").strip().replace("-", ":").upper()
                if mac:
                    creds_map[mac] = {
                        "user": c.auth_user or "",
                        "password": c.auth_password or ""
                    }
                    
            # 2. Fetch printers from Printer database table
            db_printers = session.execute(select(Printer)).scalars().all()
            
        printers_dict = {}
        
        # Add DB printers
        for p in db_printers:
            mac = str(p.mac_address or "").strip().replace("-", ":").upper()
            if not mac:
                mac = f"ID:{p.id}"
            
            # Use credentials from credentials map, fallback to Printer table auth
            cred = creds_map.get(mac) or {}
            user = cred.get("user") or p.auth_user or ""
            password = cred.get("password") or p.auth_password or ""
            
            printers_dict[mac] = {
                "id": p.id,
                "printer_name": p.printer_name or "Generic Copier",
                "ip": p.ip or "",
                "mac_id": p.mac_address or "",
                "lan_uid": p.lan_uid or "",
                "agent_uid": p.agent_uid or "",
                "user": user,
                "password": password
            }
            
        # 3. Add / merge RAM printers from ACTIVE_AGENTS
        for agent_uid, agent_info in ACTIVE_AGENTS.items():
            ag_devs = agent_info.get("devices", {}) if isinstance(agent_info, dict) else {}
            lan_uid = agent_info.get("lan_uid") or ""
            for dev_mac, dev_data in ag_devs.items():
                mac = str(dev_mac or "").strip().replace("-", ":").upper()
                if not mac:
                    continue
                
                # Fetch credentials
                cred = creds_map.get(mac) or {}
                user = cred.get("user") or ""
                password = cred.get("password") or ""
                
                if mac in printers_dict:
                    # Update existing record if details are fresher or empty in DB
                    p_data = printers_dict[mac]
                    if not p_data["ip"] and dev_data.get("ip"):
                        p_data["ip"] = dev_data.get("ip")
                    if (not p_data["printer_name"] or p_data["printer_name"] == "Generic Copier") and dev_data.get("printer_name"):
                        p_data["printer_name"] = dev_data.get("printer_name")
                    if not p_data["user"] and user:
                        p_data["user"] = user
                    if not p_data["password"] and password:
                        p_data["password"] = password
                else:
                    # Create new entry for RAM printer
                    printers_dict[mac] = {
                        "id": len(printers_dict) + 10000,  # Temp ID for UI mapping
                        "printer_name": dev_data.get("printer_name") or "Generic Copier",
                        "ip": dev_data.get("ip") or "",
                        "mac_id": mac,
                        "lan_uid": lan_uid,
                        "agent_uid": agent_uid,
                        "user": user,
                        "password": password
                    }
                    
        # Sort rows by lan_uid, then name, then ip
        rows = sorted(printers_dict.values(), key=lambda x: (x["lan_uid"], x["printer_name"], x["ip"]))
        return jsonify({"ok": True, "rows": rows})

    from models import LanSite, CounterInfor, StatusInfor, AgentNode, Printer
    from sqlalchemy import select, func
    @app.get("/api/leads")
    def list_leads() -> Any:
        with session_factory() as session:
            leads: set[str] = set()
            for model in (LanSite, CounterInfor, StatusInfor, AgentNode, Printer):
                values = session.execute(select(func.distinct(model.lead))).scalars().all()
                for value in values:
                    text = _to_text(value)
                    if text:
                        leads.add(text)
        return jsonify({"leads": sorted(leads, key=str.lower)})
