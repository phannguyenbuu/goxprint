from __future__ import annotations

from app_helpers import _serialize_audit_payload_iso

import logging
from typing import Any

from flask import Flask, jsonify, request
from sqlalchemy import select, func

from utils import _to_text, _to_int
from models import DeviceInfor, Printer

LOGGER = logging.getLogger(__name__)


import socket
import subprocess
import platform
from concurrent.futures import ThreadPoolExecutor

def _is_ip_reachable(ip: str) -> bool:
    if not ip or not ip.strip():
        return False
    ip_str = ip.strip()
    for port in (80, 9100, 443, 515, 8080):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(0.4)
            res = s.connect_ex((ip_str, port))
            s.close()
            if res == 0:
                return True
        except Exception:
            pass
    try:
        cmd = ["ping", "-n", "1", "-w", "800", ip_str] if platform.system() == "Windows" else ["ping", "-c", "1", "-W", "1", ip_str]
        ret = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=1.2)
        return ret.returncode == 0
    except Exception:
        return False


from datetime import datetime, timedelta, timezone

def register_public_device_routes(app: Flask, session_factory: Any) -> None:

    @app.get("/machinelist/")
    def public_machine_list() -> Any:
        lead = _to_text(request.args.get("lead"))
        lan_uid = _to_text(request.args.get("lan_uid"))
        check_ping = _to_text(request.args.get("check_ping")).lower() in ("true", "1")
        max_age_seconds = _to_int(request.args.get("max_age_seconds")) or 600

        # 1. Read directly from ACTIVE_AGENTS in-memory printers_json payload (bypassing PostgreSQL)
        from active_agents_registry import ACTIVE_AGENTS, prune_offline_agents
        prune_offline_agents(timeout_seconds=180)

        seen: set[tuple[str, str, str]] = set()
        machines: list[dict[str, Any]] = []

        for agent_uid, agent_info in ACTIVE_AGENTS.items():
            a_lead = agent_info.get("lead", "default")
            a_lan_uid = agent_info.get("lan_uid", "default")

            if lead and a_lead != lead:
                continue
            if lan_uid and a_lan_uid != lan_uid:
                continue

            printers_list = agent_info.get("printers_json") or []
            printers_list = [p for p in printers_list if isinstance(p, dict) and _to_text(p.get("status")).lower() != "offline"]
            for dev in printers_list:
                if not isinstance(dev, dict):
                    continue
                p_mac = _to_text(dev.get("mac_address") or dev.get("mac_id")).replace("-", ":").upper()
                p_ip = _to_text(dev.get("ip"))
                p_name = _to_text(dev.get("printer_name") or dev.get("name")) or "Unknown Printer"

                if not p_ip and not p_mac:
                    continue

                dedupe_token = p_mac or f"IP:{p_ip}"
                dedupe_key = (a_lead, a_lan_uid, dedupe_token)
                if dedupe_key in seen:
                    continue
                seen.add(dedupe_key)

                last_seen_iso = agent_info.get("last_seen_at").isoformat() if agent_info.get("last_seen_at") else ""
                machines.append(
                    {
                        "lead": a_lead,
                        "lan_uid": a_lan_uid,
                        "mac_id": p_mac,
                        "agent_uid": agent_uid,
                        "printer_name": p_name,
                        "ip": p_ip,
                        "auth_user": _to_text(dev.get("auth_user") or dev.get("user")),
                        "auth_password": _to_text(dev.get("auth_password") or dev.get("password")),
                        "counter_total": 0,
                        "system_status": "online",
                        "toner_black": None,
                        "last_counter_at": "",
                        "last_status_at": "",
                        "created_at": last_seen_iso,
                        "updated_at": last_seen_iso,
                    }
                )

        if machines:
            if check_ping:
                with ThreadPoolExecutor(max_workers=min(20, len(machines))) as executor:
                    reachability = list(executor.map(lambda m: _is_ip_reachable(m.get("ip", "")), machines))
                machines = [m for m, reachable in zip(machines, reachability) if reachable]

            machines.sort(key=lambda x: (_to_text(x.get("lead")), _to_text(x.get("lan_uid")), _to_text(x.get("printer_name"))))
            return jsonify(
                {
                    "ok": True,
                    "count": len(machines),
                    "machines": machines,
                }
            )

        now = datetime.now(timezone.utc)
        cutoff_time = now - timedelta(seconds=max_age_seconds)

        with session_factory() as session:
            p_stmt = select(Printer)
            if lead:
                p_stmt = p_stmt.where(Printer.lead == lead)
            p_rows = session.execute(p_stmt).scalars().all()

            mac_to_name: dict[str, str] = {}
            ip_to_name: dict[str, str] = {}
            for p in p_rows:
                p_mac = _to_text(p.mac_address).replace("-", ":").upper()
                p_ip = _to_text(p.ip)
                p_name = _to_text(p.printer_name)
                if p_name and "unknown" not in p_name.lower():
                    if p_mac:
                        mac_to_name[p_mac] = p_name
                    if p_ip:
                        ip_to_name[p_ip] = p_name

            stmt = select(DeviceInfor).where(DeviceInfor.lan_uid != "").order_by(
                DeviceInfor.updated_at.desc(), DeviceInfor.id.desc()
            )
            if lead:
                stmt = stmt.where(DeviceInfor.lead == lead)
            if lan_uid:
                stmt = stmt.where(DeviceInfor.lan_uid == lan_uid)
            records = session.execute(stmt).scalars().all()
            seen_db: set[tuple[str, str, str]] = set()
            db_machines: list[dict[str, Any]] = []
            for row in records:
                mac_id = _to_text(row.mac_id).replace("-", ":").upper()
                dedupe_token = mac_id or f"IP:{_to_text(row.ip)}"
                dedupe_key = (_to_text(row.lead), _to_text(row.lan_uid), dedupe_token)
                if dedupe_key in seen_db:
                    continue

                if row.updated_at:
                    updated_at_utc = row.updated_at if row.updated_at.tzinfo else row.updated_at.replace(tzinfo=timezone.utc)
                    if updated_at_utc < cutoff_time:
                        continue

                seen_db.add(dedupe_key)
                counter_data = row.counter_data if isinstance(row.counter_data, dict) else {}
                status_data = row.status_data if isinstance(row.status_data, dict) else {}

                resolved_name = mac_to_name.get(mac_id) or ip_to_name.get(_to_text(row.ip)) or _to_text(row.printer_name)
                if not resolved_name or "unknown" in resolved_name.lower():
                    resolved_name = mac_to_name.get(mac_id) or ip_to_name.get(_to_text(row.ip)) or _to_text(row.printer_name) or "Unknown Printer"

                db_machines.append(
                    {
                        "lead": row.lead,
                        "lan_uid": row.lan_uid,
                        "mac_id": mac_id,
                        "agent_uid": row.agent_uid,
                        "printer_name": resolved_name,
                        "ip": row.ip,
                        "counter_total": _to_int(counter_data.get("total")) or 0,
                        "system_status": _to_text(status_data.get("system_status")),
                        "toner_black": status_data.get("toner_black"),
                        "last_counter_at": row.last_counter_at.isoformat() if row.last_counter_at else "",
                        "last_status_at": row.last_status_at.isoformat() if row.last_status_at else "",
                        "created_at": row.created_at.isoformat() if row.created_at else "",
                        "updated_at": row.updated_at.isoformat() if row.updated_at else "",
                    }
                )

            for p in p_rows:
                p_mac = _to_text(p.mac_address).replace("-", ":").upper()
                p_ip = _to_text(p.ip)
                p_name = _to_text(p.printer_name) or "Unknown Printer"
                dedupe_token = p_mac or f"IP:{p_ip}"
                dedupe_key = (_to_text(p.lead), _to_text(p.lan_uid), dedupe_token)
                if dedupe_key in seen_db:
                    continue

                if p.updated_at:
                    p_updated_utc = p.updated_at if p.updated_at.tzinfo else p.updated_at.replace(tzinfo=timezone.utc)
                    if p_updated_utc < cutoff_time:
                        continue

                seen_db.add(dedupe_key)
                db_machines.append(
                    {
                        "lead": p.lead,
                        "lan_uid": p.lan_uid,
                        "mac_id": p_mac,
                        "agent_uid": p.agent_uid,
                        "printer_name": p_name,
                        "ip": p_ip,
                        "counter_total": 0,
                        "system_status": "online" if p.is_online else "offline",
                        "toner_black": None,
                        "last_counter_at": "",
                        "last_status_at": "",
                        "created_at": p.created_at.isoformat() if p.created_at else "",
                        "updated_at": p.updated_at.isoformat() if p.updated_at else "",
                    }
                )

            if check_ping and db_machines:
                with ThreadPoolExecutor(max_workers=min(20, len(db_machines))) as executor:
                    reachability = list(executor.map(lambda m: _is_ip_reachable(m.get("ip", "")), db_machines))
                online_machines = [m for m, reachable in zip(db_machines, reachability) if reachable]
            else:
                online_machines = db_machines

            online_machines.sort(key=lambda x: (_to_text(x.get("lead")), _to_text(x.get("lan_uid")), _to_text(x.get("mac_id"))))
            return jsonify(
                {
                    "ok": True,
                    "count": len(online_machines),
                    "machines": online_machines,
                }
            )

    @app.get("/networklist/")
    def public_network_list() -> Any:
        lead = _to_text(request.args.get("lead"))
        with session_factory() as session:
            stmt = (
                select(
                    DeviceInfor.lead,
                    DeviceInfor.lan_uid,
                    func.count(DeviceInfor.id),
                    func.max(DeviceInfor.updated_at),
                )
                .where(DeviceInfor.lan_uid != "")
                .group_by(DeviceInfor.lead, DeviceInfor.lan_uid)
                .order_by(DeviceInfor.lead.asc(), DeviceInfor.lan_uid.asc())
            )
            if lead:
                stmt = stmt.where(DeviceInfor.lead == lead)
            rows = session.execute(stmt).all()
            networks: list[dict[str, Any]] = []
            for lead_value, lan_uid_value, machine_count, last_seen in rows:
                networks.append(
                    {
                        "lead": _to_text(lead_value),
                        "lan_uid": _to_text(lan_uid_value),
                        "machine_count": int(machine_count or 0),
                        "last_seen_at": last_seen.isoformat() if last_seen else "",
                    }
                )
            return jsonify(
                {
                    "ok": True,
                    "count": len(networks),
                    "networks": networks,
                }
            )

    @app.get("/all/")
    def public_all_data() -> Any:
        lead = _to_text(request.args.get("lead"))
        lan_uid = _to_text(request.args.get("lan_uid"))
        with session_factory() as session:
            stmt = select(DeviceInfor).order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
            if lead:
                stmt = stmt.where(DeviceInfor.lead == lead)
            if lan_uid:
                stmt = stmt.where(DeviceInfor.lan_uid == lan_uid)
            records = session.execute(stmt).scalars().all()
            seen: set[tuple[str, str, str]] = set()
            rows: list[dict[str, Any]] = []
            for row in records:
                mac_id = _to_text(row.mac_id).replace("-", ":").upper()
                machine_uid = mac_id or f"IP:{_to_text(row.ip)}"
                dedupe_key = (_to_text(row.lead), _to_text(row.lan_uid), machine_uid)
                if dedupe_key in seen:
                    continue
                seen.add(dedupe_key)
                counter_data = row.counter_data if isinstance(row.counter_data, dict) else {}
                status_data = row.status_data if isinstance(row.status_data, dict) else {}
                rows.append(
                    {
                        "lead": row.lead,
                        "lan_uid": row.lan_uid,
                        "machine_uid": machine_uid,
                        "mac_id": mac_id or _to_text(row.mac_id),
                        "agent_uid": row.agent_uid,
                        "printer_name": row.printer_name,
                        "ip": row.ip,
                        "counter": counter_data,
                        "status": status_data,
                        "counter_data": counter_data,
                        "status_data": status_data,
                        "last_counter_at": row.last_counter_at.isoformat() if row.last_counter_at else "",
                        "last_status_at": row.last_status_at.isoformat() if row.last_status_at else "",
                        "created_at": row.created_at.isoformat() if row.created_at else "",
                        "updated_at": row.updated_at.isoformat() if row.updated_at else "",
                    }
                )
            rows.sort(key=lambda x: (_to_text(x.get("lead")), _to_text(x.get("lan_uid")), _to_text(x.get("machine_uid"))))
            return jsonify(
                {
                    "ok": True,
                    "count": len(rows),
                    "rows": rows,
                }
            )
