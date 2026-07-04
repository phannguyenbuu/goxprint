from __future__ import annotations

import logging
import json
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from typing import Any

from flask import Flask, jsonify, request
from sqlalchemy import select, func

from utils import (
    _to_text,
    _to_int,
    _normalize_mac,
    _apply_baseline,
    _format_datetime,
    _format_date,
    COUNTER_KEYS,
)

from app_helpers import (
    _coalesce_request_lead,
    _serialize_audit_payload_iso,
    ONLINE_STALE_SECONDS,
    _request_api_token,
    _resolve_request_lead,
)
from models import (
    Printer,
    AgentNode,
    LanSite,
    CounterInfor,
    StatusInfor,
    CounterBaseline,
    DeviceInfor,
    NetworkInfo,
    DeviceFeatureFlag,
    MachineAlert,
    AlertStatus,
    DeviceLockHistory,
)

LOGGER = logging.getLogger(__name__)


def register_public_core_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:

    @app.get("/api/public/crm/printers")
    def public_crm_printers() -> Any:
        sent_token = _request_api_token()
        ok_auth, lead, auth_error = _resolve_request_lead({}, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error

        with session_factory() as session:
            stmt = (
                select(Printer, AgentNode.hostname, LanSite.lan_name)
                .join(AgentNode, (Printer.lead == AgentNode.lead) & (Printer.lan_uid == AgentNode.lan_uid) & (Printer.agent_uid == AgentNode.agent_uid), isouter=True)
                .join(LanSite, (Printer.lead == LanSite.lead) & (Printer.lan_uid == LanSite.lan_uid), isouter=True)
                .where(Printer.lead == lead)
            )
            results = session.execute(stmt).all()

            output = []
            for row in results:
                p: Printer = row[0]
                hostname = row[1] or "Unknown"
                lan_name = row[2] or "Unknown"

                latest_counter = session.execute(
                    select(CounterInfor)
                    .where(CounterInfor.lead == lead, CounterInfor.lan_uid == p.lan_uid, CounterInfor.ip == p.ip)
                    .order_by(CounterInfor.timestamp.desc(), CounterInfor.id.desc())
                    .limit(1)
                ).scalar_one_or_none()

                latest_status = session.execute(
                    select(StatusInfor)
                    .where(StatusInfor.lead == lead, StatusInfor.lan_uid == p.lan_uid, StatusInfor.ip == p.ip)
                    .order_by(StatusInfor.timestamp.desc(), StatusInfor.id.desc())
                    .limit(1)
                ).scalar_one_or_none()

                baseline_row = session.execute(
                    select(CounterBaseline)
                    .where(CounterBaseline.lead == lead, CounterBaseline.lan_uid == p.lan_uid, CounterBaseline.ip == p.ip)
                ).scalar_one_or_none()
                base = baseline_row.raw_payload if baseline_row and isinstance(baseline_row.raw_payload, dict) else {}

                total_bw = 0
                if latest_counter:
                    total_bw = _apply_baseline(latest_counter.total, base, "total") or 0

                output.append({
                    "lan_uid": p.lan_uid,
                    "agent_uid": p.agent_uid,
                    "lan_name": lan_name,
                    "hostname": hostname,
                    "printer_name": p.printer_name,
                    "ip": p.ip,
                    "mac": p.mac_address,
                    "counter": total_bw,
                    "status": latest_status.system_status if latest_status else "Unknown",
                    "alerts": latest_status.printer_alerts if latest_status else "",
                    "toner": latest_status.toner_black if latest_status else "Unknown",
                    "last_seen_at": p.updated_at.isoformat() if p.updated_at else "",
                    **_serialize_audit_payload_iso(p.created_at, p.updated_at),
                })

        return jsonify({"ok": True, "printers": output})

    @app.get("/api/public/device/by-mac")
    def public_device_by_mac() -> Any:
        mac_input = _to_text(request.args.get("mac_id") or request.args.get("mac"))
        if not mac_input:
            return jsonify({"ok": False, "error": "Missing parameter: mac_id"}), 400

        normalized_mac = _normalize_mac(mac_input)
        if not normalized_mac:
            return jsonify({"ok": False, "error": "Invalid mac_id"}), 400

        with session_factory() as session:
            row = session.execute(
                select(DeviceInfor)
                .where(func.upper(DeviceInfor.mac_id) == normalized_mac)
                .order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
                .limit(1)
            ).scalar_one_or_none()

            if row is None:
                printer = session.execute(
                    select(Printer)
                    .where(func.upper(Printer.mac_address) == normalized_mac)
                    .order_by(Printer.updated_at.desc(), Printer.id.desc())
                    .limit(1)
                ).scalar_one_or_none()
                if printer is not None:
                    row = session.execute(
                        select(DeviceInfor)
                        .where(
                            DeviceInfor.lead == printer.lead,
                            DeviceInfor.lan_uid == printer.lan_uid,
                            DeviceInfor.ip == printer.ip,
                        )
                        .order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
                        .limit(1)
                    ).scalar_one_or_none()
                    if row is None and _to_text(printer.ip):
                        row = session.execute(
                            select(DeviceInfor)
                            .where(
                                DeviceInfor.lead == printer.lead,
                                DeviceInfor.ip == printer.ip,
                            )
                            .order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
                            .limit(1)
                        ).scalar_one_or_none()

            if row is None:
                return jsonify({"ok": False, "error": "Device not found for mac_id"}), 404

            counter_data = row.counter_data if isinstance(row.counter_data, dict) else {}
            status_data = row.status_data if isinstance(row.status_data, dict) else {}
            return jsonify(
                {
                    "ok": True,
                    "mac_id": normalized_mac,
                    "lead": row.lead,
                    "lan_uid": row.lan_uid,
                    "agent_uid": row.agent_uid,
                    "printer_name": row.printer_name,
                    "ip": row.ip,
                    "counter": counter_data,
                    "status": status_data,
                    "counter_data": counter_data,
                    "status_data": status_data,
                    "last_counter_at": row.last_counter_at.isoformat() if row.last_counter_at else "",
                    "last_status_at": row.last_status_at.isoformat() if row.last_status_at else "",
                    **_serialize_audit_payload_iso(row.created_at, row.updated_at),
                }
            )

    @app.get("/api/public/device/by-mac-now")
    def public_device_by_mac_now() -> Any:
        mac_input = _to_text(request.args.get("mac_id") or request.args.get("mac"))
        if not mac_input:
            return jsonify({"ok": False, "error": "Missing parameter: mac_id"}), 400

        normalized_mac = _normalize_mac(mac_input)
        if not normalized_mac:
            return jsonify({"ok": False, "error": "Invalid mac_id"}), 400

        with session_factory() as session:
            printer = session.execute(
                select(Printer)
                .where(func.upper(Printer.mac_address) == normalized_mac)
                .order_by(Printer.updated_at.desc(), Printer.id.desc())
                .limit(1)
            ).scalar_one_or_none()
            
            if not printer:
                row = session.execute(
                    select(DeviceInfor)
                    .where(func.upper(DeviceInfor.mac_id) == normalized_mac)
                    .order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
                    .limit(1)
                ).scalar_one_or_none()
                if not row:
                    return jsonify({"ok": False, "error": "Device not found in database"}), 404
                agent_uid = row.agent_uid
                ip = row.ip
                printer_name = row.printer_name
            else:
                agent_uid = printer.agent_uid
                ip = printer.ip
                printer_name = printer.printer_name

            # Determine printer_type from printer_name
            name_lower = printer_name.lower() if printer_name else ""
            if "toshiba" in name_lower:
                printer_type = "toshiba"
            elif "epson" in name_lower:
                printer_type = "epson"
            else:
                printer_type = "ricoh"

        with session_factory() as session:
            agent = session.execute(
                select(AgentNode)
                .where(AgentNode.agent_uid == agent_uid)
                .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
                .limit(1)
            ).scalars().first()
            if not agent or not agent.is_online:
                return jsonify({"ok": False, "error": "Agent managing this device is offline"}), 400

            lead_val = agent.lead
            lan_uid_val = agent.lan_uid

        code_content = """
import json
import subprocess
from agent.services.api_client import Printer

def resolve_ip(mac, default_ip):
    try:
        # Check if default_ip is responding first (ping with 1 packet, timeout 1s)
        ping_cmd = f"ping -n 1 -w 1000 {default_ip}"
        res = subprocess.run(ping_cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if res.returncode == 0:
            arp_out = subprocess.check_output(f"arp -a {default_ip}", shell=True, timeout=2).decode('ansi', errors='ignore')
            cleaned_mac = mac.replace(':', '-').lower()
            if cleaned_mac in arp_out.replace(':', '-').lower():
                return default_ip
    except:
        pass

    try:
        out = subprocess.check_output("arp -a", shell=True, timeout=3).decode('ansi', errors='ignore')
        cleaned_mac = mac.replace(':', '-').lower()
        for line in out.splitlines():
            if cleaned_mac in line.replace(':', '-').lower():
                parts = line.split()
                if parts and len(parts) >= 2:
                    return parts[0]
    except:
        pass
    return default_ip

ip = resolve_ip("__MAC__", "__IP__")
printer_name = "__NAME__"
mac_address = "__MAC__"
printer_type = "__TYPE__"

printer = Printer(
    id=0,
    name=printer_name,
    ip=ip,
    user="",
    password="",
    printer_type=printer_type,
    status="online",
    mac_address=mac_address,
)

try:
    collector = bridge._collector_service_for(printer)
    counter_payload = collector.process_counter(printer, should_post=False)
    status_payload = collector.process_status(printer, should_post=False)
    counter_data = counter_payload.get("counter_data", {})
    status_data = status_payload.get("status_data", {})
    
    payload = {
        "ok": True,
        "counter": counter_data,
        "status": status_data,
        "printer_name": counter_payload.get("printer_name", printer.name),
        "ip": printer.ip,
        "mac_id": printer.mac_address,
    }
except Exception as e:
    payload = {
        "ok": False,
        "error": str(e)
    }

context["result_payload"] = payload
""".replace("__MAC__", normalized_mac)\
   .replace("__IP__", ip)\
   .replace("__NAME__", printer_name)\
   .replace("__TYPE__", printer_type)

        from models import PrinterControlCommand
        cmd_params = {
            "action": "exec_utility",
            "command": "query_device_now",
            "command_content": code_content
        }
        
        requested_at = datetime.now(timezone.utc)
        with session_factory() as session:
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
        result_payload_str = ""
        import time
        for _ in range(100):
            time.sleep(0.2)
            with session_factory() as session:
                cmd_status = session.execute(
                    select(PrinterControlCommand).where(PrinterControlCommand.id == command_id)
                ).scalars().first()
                if cmd_status:
                    if cmd_status.status == "success":
                        success = True
                        result_payload_str = cmd_status.error_message or ""
                        break
                    elif cmd_status.status == "failed":
                        success = False
                        result_payload_str = cmd_status.error_message or "Agent failed execution"
                        break

        if not success:
            return jsonify({"ok": False, "error": f"Timeout or failed waiting for Agent response: {result_payload_str}"}), 504

        try:
            res_dict = json.loads(result_payload_str)
            if not res_dict.get("ok", False):
                return jsonify({"ok": False, "error": res_dict.get("error", "Unknown error querying printer")}), 500
            
            with session_factory() as session:
                row = session.execute(
                    select(DeviceInfor)
                    .where(func.upper(DeviceInfor.mac_id) == normalized_mac)
                    .order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
                    .limit(1)
                ).scalar_one_or_none()
                if row:
                    row.counter_data = res_dict.get("counter")
                    row.status_data = res_dict.get("status")
                    if res_dict.get("ip"):
                        row.ip = res_dict.get("ip")
                    row.updated_at = datetime.now(timezone.utc)
                
                printer_row = session.execute(
                    select(Printer)
                    .where(func.upper(Printer.mac_address) == normalized_mac)
                    .order_by(Printer.updated_at.desc(), Printer.id.desc())
                    .limit(1)
                ).scalar_one_or_none()
                if printer_row and res_dict.get("ip"):
                    printer_row.ip = res_dict.get("ip")
                    printer_row.updated_at = datetime.now(timezone.utc)

                session.commit()

            return jsonify({
                "ok": True,
                "mac_id": normalized_mac,
                "lead": lead_val,
                "lan_uid": lan_uid_val,
                "agent_uid": agent_uid,
                "printer_name": res_dict.get("printer_name"),
                "ip": res_dict.get("ip"),
                "counter": res_dict.get("counter"),
                "status": res_dict.get("status"),
                "counter_data": res_dict.get("counter"),
                "status_data": res_dict.get("status"),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        except Exception as e:
            return jsonify({"ok": False, "error": f"Failed parsing payload: {e}. Raw: {result_payload_str}"}), 500

    @app.get("/api/public/device/online-status")
    def public_device_online_status() -> Any:
        mac_input = _to_text(request.args.get("mac_id") or request.args.get("mac"))
        if not mac_input:
            return jsonify({"ok": False, "error": "Missing parameter: mac_id"}), 400

        stale_seconds = max(30, min(3600, int(request.args.get("stale_seconds", ONLINE_STALE_SECONDS))))
        normalized_mac = _normalize_mac(mac_input)
        if not normalized_mac:
            return jsonify({"ok": False, "error": "Invalid mac_id"}), 400
        now_utc = datetime.now(timezone.utc)
        stale_cutoff = now_utc - timedelta(seconds=stale_seconds)

        with session_factory() as session:
            dev = session.execute(
                select(DeviceInfor)
                .where(func.upper(DeviceInfor.mac_id) == normalized_mac)
                .order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
                .limit(1)
            ).scalar_one_or_none()

            printer = session.execute(
                select(Printer)
                .where(func.upper(Printer.mac_address) == normalized_mac)
                .order_by(Printer.updated_at.desc(), Printer.id.desc())
                .limit(1)
            ).scalar_one_or_none()

            if dev is None and printer is None:
                return jsonify({"ok": False, "error": "Device not found"}), 404

            last_seen: datetime | None = None
            if dev is not None and dev.updated_at:
                last_seen = dev.updated_at if dev.updated_at.tzinfo else dev.updated_at.replace(tzinfo=timezone.utc)
            if printer is not None and printer.updated_at:
                p_seen = printer.updated_at if printer.updated_at.tzinfo else printer.updated_at.replace(tzinfo=timezone.utc)
                if last_seen is None or p_seen > last_seen:
                    last_seen = p_seen

            is_online_by_polling = last_seen is not None and last_seen >= stale_cutoff
            is_online_by_flag = bool(printer.is_online) if printer is not None else None

            is_online = is_online_by_polling or bool(is_online_by_flag)
            online_source = "polling" if is_online_by_polling else ("printer_flag" if is_online_by_flag else "none")

            seconds_since_seen = int((now_utc - last_seen).total_seconds()) if last_seen else None

            src = dev or printer
            return jsonify({
                "ok": True,
                "mac_id": normalized_mac,
                "is_online": is_online,
                "printer_name": src.printer_name if src else "",
                "ip": src.ip if src else "",
                "lead": src.lead if src else "",
                "lan_uid": src.lan_uid if src else "",
                "last_seen_at": last_seen.isoformat() if last_seen else None,
                "seconds_since_seen": seconds_since_seen,
                "stale_threshold_seconds": stale_seconds,
                "online_source": online_source,
                "is_online_by_polling": is_online_by_polling,
                "is_online_by_flag": is_online_by_flag,
                **_serialize_audit_payload_iso(
                    getattr(src, "created_at", None),
                    getattr(src, "updated_at", None),
                ),
            })

    @app.get("/api/public/network/by-lan")
    def public_network_by_lan() -> Any:
        lan_uid = _to_text(request.args.get("lan_uid"))
        lead = _to_text(request.args.get("lead"))
        if not lan_uid:
            return jsonify({"ok": False, "error": "Missing parameter: lan_uid"}), 400

        with session_factory() as session:
            stmt = (
                select(DeviceInfor)
                .where(DeviceInfor.lan_uid == lan_uid)
                .order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
            )
            if lead:
                stmt = stmt.where(DeviceInfor.lead == lead)
            records = session.execute(stmt).scalars().all()
            if not records:
                return jsonify({"ok": False, "error": "No device found for lan_uid"}), 404

            seen: set[tuple[str, str, str]] = set()
            rows: list[dict[str, Any]] = []
            for row in records:
                mac_id = _to_text(row.mac_id).replace("-", ":").upper()
                dedupe_token = mac_id or f"IP:{_to_text(row.ip)}"
                dedupe_key = (_to_text(row.lead), _to_text(row.lan_uid), dedupe_token)
                if dedupe_key in seen:
                    continue
                seen.add(dedupe_key)
                counter_data = row.counter_data if isinstance(row.counter_data, dict) else {}
                status_data = row.status_data if isinstance(row.status_data, dict) else {}
                rows.append(
                    {
                        "lead": row.lead,
                        "lan_uid": row.lan_uid,
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
                        **_serialize_audit_payload_iso(row.created_at, row.updated_at),
                    }
                )
            rows.sort(key=lambda x: (_to_text(x.get("lead")), _to_text(x.get("printer_name")), _to_text(x.get("ip"))))
            return jsonify(
                {
                    "ok": True,
                    "lan_uid": lan_uid,
                    "count": len(rows),
                    "rows": rows,
                }
            )

    @app.get("/api/public/device/latest")
    def public_device_latest() -> Any:
        lan_uid = _to_text(request.args.get("lan_uid"))
        mac = _normalize_mac(request.args.get("mac"))

        sent_token = _request_api_token()
        ok_auth, lead, auth_error = _resolve_request_lead({}, lead_key_map, sent_token, request.args.get("lead"))
        if not ok_auth:
            return auth_error
        if not lan_uid or not mac:
            return jsonify({"ok": False, "error": "Missing parameters: lan_uid, mac"}), 400

        with session_factory() as session:
            printer = session.execute(
                select(Printer).where(
                    Printer.lead == lead,
                    Printer.lan_uid == lan_uid,
                    func.upper(Printer.mac_address) == mac
                )
            ).scalar_one_or_none()

            if not printer:
                return jsonify({"ok": False, "error": "Printer not found with given mac and lan_uid"}), 404

            latest_counter = session.execute(
                select(CounterInfor)
                .where(CounterInfor.lead == lead, CounterInfor.lan_uid == lan_uid, CounterInfor.ip == printer.ip)
                .order_by(CounterInfor.timestamp.desc(), CounterInfor.id.desc())
                .limit(1)
            ).scalar_one_or_none()

            latest_status = session.execute(
                select(StatusInfor)
                .where(StatusInfor.lead == lead, StatusInfor.lan_uid == lan_uid, StatusInfor.ip == printer.ip)
                .order_by(StatusInfor.timestamp.desc(), StatusInfor.id.desc())
                .limit(1)
            ).scalar_one_or_none()

            baseline_row = session.execute(
                select(CounterBaseline)
                .where(CounterBaseline.lead == lead, CounterBaseline.lan_uid == lan_uid, CounterBaseline.ip == printer.ip)
            ).scalar_one_or_none()
            base = baseline_row.raw_payload if baseline_row and isinstance(baseline_row.raw_payload, dict) else {}

            result = {
                "ok": True,
                "printer_name": printer.printer_name,
                "ip": printer.ip,
                "mac": printer.mac_address,
                "lan_uid": printer.lan_uid,
                "last_seen_at": printer.updated_at.isoformat() if printer.updated_at else "",
                "counter": None,
                "status": None,
                **_serialize_audit_payload_iso(printer.created_at, printer.updated_at),
            }

            if latest_counter:
                counter_payload = latest_counter.raw_payload if isinstance(latest_counter.raw_payload, dict) else {}
                combined_counter = {}
                for key in COUNTER_KEYS:
                    val = _apply_baseline(getattr(latest_counter, key, None), base, key)
                    combined_counter[key] = val
                
                result["counter"] = {
                    "timestamp": latest_counter.timestamp.isoformat(),
                    "data": combined_counter,
                    "raw_delta": counter_payload
                }

            if latest_status:
                result["status"] = {
                    "timestamp": latest_status.timestamp.isoformat(),
                    "system_status": latest_status.system_status,
                    "printer_status": latest_status.printer_status,
                    "printer_alerts": latest_status.printer_alerts,
                    "copier_status": latest_status.copier_status,
                    "copier_alerts": latest_status.copier_alerts,
                    "scanner_status": latest_status.scanner_status,
                    "scanner_alerts": latest_status.scanner_alerts,
                    "toner_black": latest_status.toner_black,
                    "tray_1_status": latest_status.tray_1_status,
                    "tray_2_status": latest_status.tray_2_status,
                    "tray_3_status": latest_status.tray_3_status,
                    "bypass_tray_status": latest_status.bypass_tray_status,
                    "other_info": latest_status.other_info,
                    "raw_payload": latest_status.raw_payload
                }

            return jsonify(result)

    @app.get("/api/public/agent-machines")
    def public_agent_machines() -> Any:
        lead = _coalesce_request_lead(request.args.get("lead"), lead_key_map)
        agent_uid = _to_text(request.args.get("agent_uid"))
        if not agent_uid:
            return jsonify({"ok": False, "error": "Missing parameter: agent_uid"}), 400

        with session_factory() as session:
            records = session.execute(
                select(DeviceInfor)
                .where(DeviceInfor.lead == lead, DeviceInfor.agent_uid == agent_uid)
                .order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
            ).scalars().all()

            normalized_macs: set[str] = set()
            lan_uids: set[str] = set()
            for row in records:
                normalized = _normalize_mac(row.mac_id)
                if normalized:
                    normalized_macs.add(normalized)
                if row.lan_uid:
                    lan_uids.add(row.lan_uid)

            lan_map: dict[str, LanSite] = {}
            if lan_uids:
                lan_rows = session.execute(
                    select(LanSite).where(LanSite.lead == lead, LanSite.lan_uid.in_(lan_uids))
                ).scalars().all()
                lan_map = {row.lan_uid: row for row in lan_rows}

            network_map: dict[str, NetworkInfo] = {}
            if lan_uids:
                network_rows = session.execute(
                    select(NetworkInfo).where(NetworkInfo.lead == lead, NetworkInfo.lan_uid.in_(lan_uids))
                ).scalars().all()
                for net in network_rows:
                    network_map.setdefault(net.lan_uid, net)

            features_by_mac: dict[str, list[dict[str, Any]]] = defaultdict(list)
            if normalized_macs:
                feature_rows = session.execute(
                    select(DeviceFeatureFlag).where(
                        DeviceFeatureFlag.lead == lead,
                        DeviceFeatureFlag.mac_id.in_(normalized_macs),
                    )
                ).scalars().all()
                for feature in feature_rows:
                    normalized = _normalize_mac(feature.mac_id) or feature.mac_id
                    features_by_mac[normalized].append(
                        {
                            "feature": feature.feature_name,
                            "enabled": bool(feature.is_enabled),
                            "metadata": feature.metadata,
                            "last_seen_at": _format_datetime(feature.last_seen_at),
                        }
                    )

            alerts_by_mac: dict[str, MachineAlert] = {}
            if normalized_macs:
                alert_rows = session.execute(
                    select(MachineAlert)
                    .where(
                        MachineAlert.lead == lead,
                        MachineAlert.mac_id.in_(normalized_macs),
                        MachineAlert.status != AlertStatus.RESOLVED.value,
                    )
                    .order_by(MachineAlert.triggered_at.desc())
                ).scalars().all()
                for alert in alert_rows:
                    normalized = _normalize_mac(alert.mac_id)
                    if normalized and normalized not in alerts_by_mac:
                        alerts_by_mac[normalized] = alert

            lock_history_by_mac: dict[str, list[dict[str, Any]]] = defaultdict(list)
            if normalized_macs:
                lock_rows = session.execute(
                    select(DeviceLockHistory)
                    .where(DeviceLockHistory.lead == lead, DeviceLockHistory.mac_id.in_(normalized_macs))
                    .order_by(DeviceLockHistory.event_at.desc())
                ).scalars().all()
                for lock in lock_rows:
                    normalized = _normalize_mac(lock.mac_id)
                    if not normalized:
                        continue
                    history = lock_history_by_mac[normalized]
                    if len(history) >= 3:
                        continue
                    history.append(
                        {
                            "action": lock.action,
                            "reason": lock.reason,
                            "source": lock.source,
                            "event_at": _format_datetime(lock.event_at),
                            "metadata": lock.metadata,
                        }
                    )

            agent_node = session.execute(
                select(AgentNode)
                .where(AgentNode.lead == lead, AgentNode.agent_uid == agent_uid)
                .limit(1)
            ).scalar_one_or_none()

            machines: list[dict[str, Any]] = []
            seen_keys: set[tuple[str, str, str]] = set()
            for row in records:
                normalized_mac = _normalize_mac(row.mac_id)
                machine_mac = normalized_mac or _to_text(row.mac_id)
                dedupe_token = machine_mac or _to_text(row.ip) or row.printer_name
                dedupe_key = (row.lead, row.lan_uid, dedupe_token)
                if dedupe_token and dedupe_key in seen_keys:
                    continue
                seen_keys.add(dedupe_key)

                counter_data = row.counter_data if isinstance(row.counter_data, dict) else {}
                status_data = row.status_data if isinstance(row.status_data, dict) else {}
                lan_info = lan_map.get(row.lan_uid)
                network_info = network_map.get(row.lan_uid)
                alert_entry = alerts_by_mac.get(normalized_mac) if normalized_mac else None
                auto_alert = (
                    {
                        "severity": alert_entry.severity,
                        "message": alert_entry.message,
                        "status": alert_entry.status,
                        "triggered_at": _format_datetime(alert_entry.triggered_at),
                        "resolved_at": _format_datetime(alert_entry.resolved_at),
                    }
                    if alert_entry
                    else None
                )

                machines.append(
                    {
                        "lead": row.lead,
                        "lan_uid": row.lan_uid,
                        "lan_name": lan_info.lan_name if lan_info else "",
                        "fingerprint_signature": lan_info.fingerprint_signature if lan_info else "",
                        "network": {
                            "network_id": network_info.network_id,
                            "network_name": network_info.network_name,
                            "office_name": network_info.office_name,
                            "real_address": network_info.real_address,
                        }
                        if network_info
                        else {},
                        "agent_uid": row.agent_uid,
                        "printer_name": row.printer_name,
                        "mac_id": machine_mac,
                        "ip": row.ip,
                        "counter_total": _to_int(counter_data.get("total")) or 0,
                        "counter_summary": {
                            "copier_bw": _to_int(counter_data.get("copier_bw")),
                            "printer_bw": _to_int(counter_data.get("printer_bw")),
                            "fax_bw": _to_int(counter_data.get("fax_bw")),
                        },
                        "status": _to_text(status_data.get("system_status") or status_data.get("printer_status")),
                        "alert": _to_text(status_data.get("printer_alerts")),
                        "toner": status_data.get("toner_black") or {},
                        "counter_data": counter_data,
                        "status_data": status_data,
                        "features": features_by_mac.get(normalized_mac or machine_mac, []),
                        "lock_history": lock_history_by_mac.get(normalized_mac or machine_mac, []),
                        "auto_alert": auto_alert,
                        "last_counter_at": _format_datetime(row.last_counter_at),
                        "last_status_at": _format_datetime(row.last_status_at),
                        "updated_at": _format_datetime(row.updated_at),
                        "created_at": _format_date(row.created_at),
                        "createAt": _format_date(row.created_at),
                        "updateAt": _format_datetime(row.updated_at),
                    }
                )

            machines.sort(
                key=lambda item: (
                    _to_text(item.get("lan_name")),
                    _to_text(item.get("printer_name")),
                    _to_text(item.get("ip")),
                )
            )

            return jsonify(
                {
                    "ok": True,
                    "lead": lead,
                    "agent_uid": agent_uid,
                    "agent": {
                        "hostname": _to_text(agent_node.hostname) if agent_node else "",
                        "local_ip": _to_text(agent_node.local_ip) if agent_node else "",
                        "local_mac": _to_text(agent_node.local_mac) if agent_node else "",
                    },
                    "count": len(machines),
                    "machines": machines,
                }
            )

    @app.post("/api/public/agent-diagnostics")
    def post_agent_diagnostics() -> Any:
        import json
        body = request.get_json(silent=True) or {}
        agent_uid = _to_text(body.get("agent_uid", "unknown"))
        LOGGER.info("Received diagnostics from agent: %s", agent_uid)
        
        dest = f"/tmp/diagnostics_{agent_uid}.json"
        try:
            with open(dest, "w", encoding="utf-8") as f:
                json.dump(body, f, indent=2, ensure_ascii=False)
        except Exception as exc:
            LOGGER.error("Failed to write agent diagnostics to file: %s", exc)
            
        return jsonify({"ok": True})

