from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any

from flask import Flask, jsonify, request
from sqlalchemy import select, func

from utils import (
    _to_text,
    _to_int,
    _parse_timestamp,
    _normalize_mac,
    _write_last_data,
    _normalize_counter_payload,
    _normalize_status_payload,
    _compute_delta_payload,
    _to_text_max,
    _to_json_value,
)
from serializers import (
    _upsert_lan_and_agent,
    _upsert_printer_from_polling,
    _set_printer_online_state,
    _resolve_public_mac,
)
from models import (
    Printer,
    DeviceInfor,
    DeviceInforHistory,
    CounterInfor,
    CounterBaseline,
    StatusInfor,
)
from app_helpers import (
    _request_api_token,
    _validate_polling_auth,
    _resolve_lan_uid_with_session,
    _is_agent_master_and_get_emails,
)
from polling_aux_routes import parse_folder_str

LOGGER = logging.getLogger(__name__)


def register_polling_core_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:

    @app.post("/api/polling")
    def ingest_polling() -> Any:
        body = request.get_json(silent=True) or {}
        if not isinstance(body, dict):
            LOGGER.warning("polling: invalid json body from %s", request.remote_addr)
            return jsonify({"ok": False, "error": "Invalid JSON body"}), 400

        sent_token = _request_api_token()
        ok_auth, lead, auth_error = _validate_polling_auth(body, lead_key_map, sent_token)
        if not ok_auth:
            LOGGER.warning("polling: unauthorized lead=%s ip=%s", lead, request.remote_addr)
            return auth_error

        # ── Handle explicit IP change event from Agent ───────────────────────────
        event_type = _to_text(body.get("event"))
        if event_type == "pc_ip_changed":
            old_ip_ev = _to_text(body.get("old_ip", "")).strip()
            new_ip_ev = _to_text(body.get("new_ip", "")).strip()
            agent_uid_ev = _to_text(body.get("agent_uid")) or "legacy-agent"
            with session_factory() as session:
                lan_uid_ev, _ = _resolve_lan_uid_with_session(session, lead, body)
            if old_ip_ev and new_ip_ev and old_ip_ev != new_ip_ev:
                with session_factory() as session:
                    try:
                        from models import IPData
                        ip_rec_ev = session.execute(
                            select(IPData).where(IPData.agent_name == agent_uid_ev)
                        ).scalars().first()
                        if ip_rec_ev and (ip_rec_ev.ip or "").strip() == old_ip_ev:
                            # Reference still on old_ip — workflow not yet triggered
                            from utils import trigger_ip_change_workflow
                            trigger_ip_change_workflow(
                                session, lead, lan_uid_ev, agent_uid_ev, old_ip_ev, new_ip_ev
                            )
                            # trigger_ip_change_workflow updates IPData.ip internally
                            LOGGER.info(
                                "[pc_ip_changed] Agent %s IP change %s → %s. Workflow triggered (Path A primary).",
                                agent_uid_ev, old_ip_ev, new_ip_ev
                            )
                        elif ip_rec_ev and (ip_rec_ev.ip or "").strip() == new_ip_ev:
                            LOGGER.info(
                                "[pc_ip_changed] Agent %s: IPData already at %s — dedup skip.",
                                agent_uid_ev, new_ip_ev
                            )
                        else:
                            LOGGER.warning(
                                "[pc_ip_changed] Agent %s: IPData.ip=%s, event old_ip=%s — mismatch, skip.",
                                agent_uid_ev, ip_rec_ev.ip if ip_rec_ev else "N/A", old_ip_ev
                            )
                        session.commit()
                    except Exception as ev_exc:
                        LOGGER.error("[pc_ip_changed] Error handling event for %s: %s", agent_uid_ev, ev_exc)
            else:
                LOGGER.warning("[pc_ip_changed] Invalid ip pair: old=%s new=%s", old_ip_ev, new_ip_ev)
            return jsonify({"ok": True, "event": "pc_ip_changed", "processed": True})
        # ── End event handler ────────────────────────────────────────────────────

        printer_name = _to_text(body.get("printer_name"))
        ip = _to_text(body.get("ip"))
        with session_factory() as session:
            lan_uid, _ = _resolve_lan_uid_with_session(session, lead, body)
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
        timestamp = _parse_timestamp(body.get("timestamp"))
        counter_data = body.get("counter_data") if isinstance(body.get("counter_data"), dict) else {}
        status_data = body.get("status_data") if isinstance(body.get("status_data"), dict) else {}
        collector_ok = bool(body.get("collector_ok", True))
        skip_data_update = bool(body.get("skip_data_update", False))
        incoming_mac_id = _to_text(body.get("mac_id")) or _to_text(body.get("mac_address"))
        mac_id = _normalize_mac(incoming_mac_id)
        device_mac_address = mac_id
        LOGGER.info(
            "polling request: lead=%s lan=%s agent=%s printer=%s ip=%s ts=%s counter_keys=%s status_keys=%s",
            lead,
            lan_uid,
            agent_uid,
            printer_name or "-",
            ip or "-",
            timestamp.isoformat(),
            len(counter_data.keys()) if isinstance(counter_data, dict) else 0,
            len(status_data.keys()) if isinstance(status_data, dict) else 0,
        )
        logging_payload = {
            "received_at": datetime.now(timezone.utc).isoformat(),
            "remote_addr": _to_text(request.remote_addr),
            "path": "/api/polling",
            "payload": body,
        }
        LOGGER.info("polling payload json: %s", json.dumps(logging_payload, ensure_ascii=False))
        _write_last_data(logging_payload)

        inserted_counter = 0
        inserted_status = 0
        skipped_counter = 0
        skipped_status = 0
        skipped_disabled = 0
        scan_auto_open_file = body.get("scan_auto_open_file")
        if scan_auto_open_file is None:
            scan_auto_open_file = True
        else:
            scan_auto_open_file = bool(scan_auto_open_file)

        scan_auto_open_dir = body.get("scan_auto_open_dir")
        if scan_auto_open_dir is None:
            scan_auto_open_dir = True
        else:
            scan_auto_open_dir = bool(scan_auto_open_dir)

        gds_status = _to_text(body.get("gds_status")) or "unknown"
        # Normalize to valid values
        if gds_status not in ("running", "stopped", "not_installed", "unknown"):
            gds_status = "unknown"

        client_pub_ip = (
            request.headers.get("X-Forwarded-For")
            or request.headers.get("X-Real-IP")
            or request.remote_addr
            or ""
        ).split(",")[0].strip()

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
            printer_name=printer_name,
            ip=ip,
            mac_id=mac_id,
            counter_data=counter_data,
            status_data=status_data,
            devices_list=body.get("devices"),
            public_ip=client_pub_ip,
        )

        def _is_placeholder_name(name_str: str, ip_str: str = "") -> bool:
            if not name_str or not str(name_str).strip():
                return True
            text = str(name_str).strip().lower()
            if text in {"unknown", "unknown printer", "printer", "copier"}:
                return True
            return False

        devices_list = body.get("devices")
        with session_factory() as session:
            try:
                active_macs = set()
                active_ips = set()

                if isinstance(devices_list, list) and len(devices_list) > 0:
                    for dev in devices_list:
                        if not isinstance(dev, dict):
                            continue
                        d_ip = str(dev.get("ip") or "").strip()
                        d_mac = str(dev.get("mac_address") or dev.get("mac_id") or "").strip().replace("-", ":").upper()
                        d_name = str(dev.get("printer_name") or dev.get("name") or "").strip()
                        d_online = bool(dev.get("is_online", True))
                        if not d_ip and not d_mac:
                            continue
                        if d_mac:
                            active_macs.add(d_mac)
                        if d_ip:
                            active_ips.add(d_ip)

                        stmt = select(Printer).where(Printer.lead == lead)
                        if d_mac:
                            stmt = stmt.where(func.upper(Printer.mac_address) == d_mac)
                        else:
                            stmt = stmt.where(Printer.ip == d_ip)
                        p_obj = session.execute(stmt).scalars().first()
                        if p_obj:
                            if d_ip:
                                p_obj.ip = d_ip
                            if d_mac:
                                p_obj.mac_address = d_mac
                            if d_name:
                                p_obj.printer_name = d_name
                            p_obj.agent_uid = agent_uid
                            p_obj.lan_uid = lan_uid
                            p_obj.is_online = d_online
                            p_obj.last_scanned_at = utc_now
                            p_obj.updated_at = utc_now
                        elif d_online:
                            p_obj = Printer(
                                lead=lead,
                                lan_uid=lan_uid,
                                agent_uid=agent_uid,
                                printer_name=d_name or "Unknown Printer",
                                ip=d_ip,
                                mac_address=d_mac,
                                enabled=True,
                                is_online=d_online,
                                last_scanned_at=utc_now,
                                updated_at=utc_now,
                                auth_user="",
                                auth_password="",
                                address_book_sync={},
                            )
                            session.add(p_obj)
                
                if ip and (mac_id or printer_name):
                    d_mac = mac_id.upper() if mac_id else ""
                    if d_mac:
                        active_macs.add(d_mac)
                    if ip:
                        active_ips.add(ip)

                    stmt = select(Printer).where(Printer.lead == lead)
                    if d_mac:
                        stmt = stmt.where(func.upper(Printer.mac_address) == d_mac)
                    else:
                        stmt = stmt.where(Printer.ip == ip)
                    p_obj = session.execute(stmt).scalars().first()
                    
                    is_collector_ok = body.get("collector_ok", True)
                    
                    if p_obj:
                        p_obj.ip = ip
                        if mac_id:
                            p_obj.mac_address = mac_id
                        if printer_name:
                            p_obj.printer_name = printer_name
                        p_obj.agent_uid = agent_uid
                        p_obj.lan_uid = lan_uid
                        if is_collector_ok:
                            p_obj.is_online = True
                        p_obj.updated_at = utc_now
                    elif is_collector_ok:
                        p_obj = Printer(
                            lead=lead,
                            lan_uid=lan_uid,
                            agent_uid=agent_uid,
                            printer_name=printer_name or "Unknown Printer",
                            ip=ip,
                            mac_address=mac_id or "",
                            enabled=True,
                            is_online=is_collector_ok,
                            updated_at=utc_now,
                            auth_user="",
                            auth_password="",
                            address_book_sync={},
                        )
                        session.add(p_obj)

                # Purge stale DB printers for this lead if agent explicitly reported devices list (printers.json)
                if isinstance(devices_list, list) and (active_macs or active_ips):
                    existing_db_printers = session.execute(select(Printer).where(Printer.lead == lead)).scalars().all()
                    for ep in existing_db_printers:
                        ep_mac = (ep.mac_address or "").strip().upper()
                        ep_ip = (ep.ip or "").strip()
                        is_active = (ep_mac and ep_mac in active_macs) or (ep_ip and ep_ip in active_ips)
                        if not is_active:
                            session.delete(ep)
                            LOGGER.info("[ingest_polling] Deleted stale DB printer ID %s (%s, IP %s, MAC %s) for lead %s - not found in agent printers.json", ep.id, ep.printer_name, ep.ip, ep.mac_address, lead)

                    # Upsert DeviceInfor for every reported printer in devices_list
                    for dev in (devices_list or []):
                        if not isinstance(dev, dict):
                            continue
                        d_ip = str(dev.get("ip") or "").strip()
                        d_mac = str(dev.get("mac_address") or dev.get("mac_id") or "").strip().replace("-", ":").upper()
                        d_name = str(dev.get("printer_name") or dev.get("name") or "").strip()
                        if not d_ip and not d_mac:
                            continue

                        dev_counter = dev.get("counter") if isinstance(dev.get("counter"), dict) and dev.get("counter") else (dev.get("counter_data") if isinstance(dev.get("counter_data"), dict) else {})
                        dev_status = dev.get("status") if isinstance(dev.get("status"), dict) and dev.get("status") else (dev.get("status_data") if isinstance(dev.get("status_data"), dict) else {})

                        if not dev_counter:
                            try:
                                c_hist_stmt = select(CounterInfor).where(CounterInfor.lead == lead)
                                if d_mac:
                                    c_hist_stmt = c_hist_stmt.where(func.upper(CounterInfor.mac_id) == d_mac)
                                else:
                                    c_hist_stmt = c_hist_stmt.where(CounterInfor.ip == d_ip)
                                c_hist = session.execute(c_hist_stmt.order_by(CounterInfor.created_at.desc(), CounterInfor.id.desc()).limit(1)).scalars().first()
                                if c_hist:
                                    dev_counter = c_hist.raw_payload or {
                                        "total": c_hist.total or 0,
                                        "copier_bw": c_hist.copier_bw or 0,
                                        "printer_bw": c_hist.printer_bw or 0,
                                        "a3_dlt": c_hist.a3_dlt or 0,
                                        "duplex": c_hist.duplex or 0,
                                    }
                            except Exception as c_exc:
                                LOGGER.warning("[ingest_polling] CounterInfor lookup error: %s", c_exc)

                        if not dev_counter and d_ip:
                            try:
                                cb_hist = session.execute(
                                    select(CounterBaseline).where(CounterBaseline.ip == d_ip)
                                    .order_by(CounterBaseline.baseline_timestamp.desc(), CounterBaseline.id.desc()).limit(1)
                                ).scalars().first()
                                if cb_hist and isinstance(cb_hist.raw_payload, dict):
                                    dev_counter = cb_hist.raw_payload
                            except Exception as cb_exc:
                                LOGGER.warning("[ingest_polling] CounterBaseline lookup error: %s", cb_exc)

                        if not dev_status:
                            try:
                                s_hist_stmt = select(StatusInfor).where(StatusInfor.lead == lead)
                                if d_mac:
                                    s_hist_stmt = s_hist_stmt.where(func.upper(StatusInfor.mac_id) == d_mac)
                                else:
                                    s_hist_stmt = s_hist_stmt.where(StatusInfor.ip == d_ip)
                                s_hist = session.execute(s_hist_stmt.order_by(StatusInfor.created_at.desc(), StatusInfor.id.desc()).limit(1)).scalars().first()
                                if s_hist and isinstance(s_hist.raw_payload, dict):
                                    dev_status = s_hist.raw_payload
                            except Exception as s_exc:
                                LOGGER.warning("[ingest_polling] StatusInfor lookup error: %s", s_exc)

                        d_stmt = select(DeviceInfor).where(DeviceInfor.lead == lead)
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
                            d_obj.lan_uid = lan_uid
                            d_obj.updated_at = utc_now
                            if dev_counter:
                                d_obj.counter_data = dev_counter
                                d_obj.last_counter_at = utc_now
                            if dev_status:
                                d_obj.status_data = dev_status
                                d_obj.last_status_at = utc_now
                        else:
                            d_obj = DeviceInfor(
                                lead=lead,
                                lan_uid=lan_uid,
                                agent_uid=agent_uid,
                                mac_id=d_mac,
                                ip=d_ip,
                                printer_name=d_name or "Unknown Printer",
                                counter_data=dev_counter or {},
                                status_data=dev_status or {},
                                last_counter_at=utc_now if dev_counter else None,
                                last_status_at=utc_now if dev_status else None,
                                updated_at=utc_now,
                            )
                            session.add(d_obj)

                        # Write history snapshot if counter_data or status_data is available
                        if dev_counter or dev_status:
                            from models import DeviceInforHistory
                            dh_obj = DeviceInforHistory(
                                lead=lead,
                                lan_uid=lan_uid,
                                machine_uid=d_mac or (f"IP:{d_ip}" if d_ip else "unknown"),
                                mac_id=d_mac,
                                agent_uid=agent_uid,
                                printer_name=d_name or "Unknown Printer",
                                ip=d_ip,
                                counter_data=dev_counter,
                                status_data=dev_status,
                                last_counter_at=utc_now if dev_counter else None,
                                last_status_at=utc_now if dev_status else None,
                                updated_at=utc_now,
                            )
                            session.add(dh_obj)

                    # Auto-update AgentNode, LanSite, and AllowedPublicIp DB tables with client_pub_ip
                    if client_pub_ip and client_pub_ip not in ("127.0.0.1", "localhost", "::1"):
                        from models import AgentNode, LanSite, AllowedPublicIp
                        agent_node = session.execute(
                            select(AgentNode).where(AgentNode.agent_uid == agent_uid)
                        ).scalars().first()
                        if agent_node:
                            agent_node.public_ip = client_pub_ip
                            agent_node.is_online = True
                            agent_node.last_seen_at = utc_now
                        else:
                            agent_node = AgentNode(
                                lead=lead,
                                lan_uid=lan_uid,
                                agent_uid=agent_uid,
                                hostname=hostname,
                                local_ip=local_ip,
                                local_mac=local_mac,
                                public_ip=client_pub_ip,
                                app_version=app_version,
                                run_mode=run_mode,
                                web_port=web_port,
                                is_online=True,
                                last_seen_at=utc_now
                            )
                            session.add(agent_node)

                        lan_site_rec = session.execute(
                            select(LanSite).where(LanSite.lan_uid == lan_uid)
                        ).scalars().first()
                        if lan_site_rec:
                            lan_site_rec.public_ip = client_pub_ip
                        else:
                            lan_site_rec = LanSite(
                                lead=lead,
                                lan_uid=lan_uid,
                                lan_name=f"LAN {lan_uid}",
                                public_ip=client_pub_ip
                            )
                            session.add(lan_site_rec)

                        ip_rule = session.execute(
                            select(AllowedPublicIp).where(AllowedPublicIp.ip_address == client_pub_ip)
                        ).scalars().first()
                        if not ip_rule:
                            desc = f"Auto-registered from Agent {hostname or agent_uid} ({lan_uid})"
                            session.add(AllowedPublicIp(
                                ip_address=client_pub_ip,
                                description=desc,
                                enabled=True,
                                client_local_ip=local_ip or "",
                                client_public_ip=client_pub_ip,
                                machine_info=f"Agent: {agent_uid} ({hostname or ''})"
                            ))
                            try:
                                from admin_public_ip_routes import record_public_ip_history
                                record_public_ip_history(
                                    session,
                                    ip_address=client_pub_ip,
                                    action="auto_discover",
                                    description=desc,
                                    client_local_ip=local_ip or "",
                                    client_public_ip=client_pub_ip,
                                    machine_info=f"Agent: {agent_uid} ({hostname or ''})"
                                )
                            except Exception as h_exc:
                                LOGGER.warning("[ingest_polling] History log error: %s", h_exc)

                session.commit()
            except Exception as p_exc:  # noqa: BLE001
                session.rollback()
                LOGGER.warning("[ingest_polling] Auto-upsert Printer failed: %s", p_exc)

        with session_factory() as session:
            is_master, emails = _is_agent_master_and_get_emails(session, lead, lan_uid, agent_uid)

        LOGGER.info(
            "polling: lead=%s lan=%s agent=%s printer=%s ip=%s inserted(counter=%s,status=%s) skipped(counter=%s,status=%s,disabled=%s) master=%s",
            lead,
            lan_uid,
            agent_uid,
            printer_name or "-",
            ip or "-",
            inserted_counter,
            inserted_status,
            skipped_counter,
            skipped_status,
            skipped_disabled,
            is_master,
        )

        # Compute script MD5 hashes
        scripts_info = {}
        try:
            import os
            from pathlib import Path
            for name in ["diagnose.py"]:
                script_path = os.path.join(os.path.dirname(__file__), "static", "releases", name)
                if os.path.exists(script_path):
                    import hashlib
                    h = hashlib.md5(Path(script_path).read_bytes()).hexdigest()
                    scripts_info[name] = h
        except Exception:
            pass

        return jsonify(
            {
                "ok": True,
                "lead": lead,
                "lan_uid": lan_uid,
                "agent_uid": agent_uid,
                "printer_name": printer_name,
                "ip": ip,
                "timestamp": timestamp.isoformat(),
                "inserted_counter": inserted_counter,
                "inserted_status": inserted_status,
                "skipped_counter": skipped_counter,
                "skipped_status": skipped_status,
                "skipped_disabled": skipped_disabled,
                "collector_ok": collector_ok,
                "skip_data_update": skip_data_update,
                "is_master": is_master,
                "emails": emails,
                "scripts": scripts_info,
            }
        )
