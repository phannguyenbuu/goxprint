from __future__ import annotations

import logging
import json
import time as time_module
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
    DeviceInforHistory,
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
        ok_auth, lead, auth_error = _resolve_request_lead({}, lead_key_map, sent_token, request.args.get("lead"), session_factory=session_factory)
        if not ok_auth:
            return auth_error

        client_ip = request.headers.get("X-Forwarded-For", request.remote_addr or "").split(",")[0].strip()

        from active_agents_registry import get_all_devices_in_memory
        devices = get_all_devices_in_memory(client_ip=client_ip, session_factory=session_factory)
        return jsonify({"ok": True, "printers": devices})


    @app.route("/api/public/device/by-macs", methods=["GET", "POST"])
    def public_device_by_macs_batch() -> Any:
        raw_macs = []
        if request.method == "POST":
            body = request.get_json(silent=True) or {}
            raw_macs = body.get("mac_ids") or body.get("macs") or []
        if not raw_macs:
            macs_arg = request.args.get("mac_ids") or request.args.get("macs") or ""
            if macs_arg:
                raw_macs = [m.strip() for m in macs_arg.split(",") if m.strip()]

        if not isinstance(raw_macs, list) or not raw_macs:
            return jsonify({"ok": False, "error": "Missing or empty mac_ids list"}), 400

        # Limit to 100 MACs per batch
        norm_macs = []
        for m in raw_macs[:100]:
            cleaned = _normalize_mac(_to_text(m))
            if cleaned and cleaned not in norm_macs:
                norm_macs.append(cleaned)

        if not norm_macs:
            return jsonify({"ok": False, "error": "No valid mac_ids provided"}), 400

        result_devices: dict[str, Any] = {}

        # 1. Quick check memory registry first
        from active_agents_registry import get_device_by_mac_in_memory
        for mac in list(norm_macs):
            mem_dev = get_device_by_mac_in_memory(mac)
            if mem_dev and mem_dev.get("ok"):
                result_devices[mac] = {
                    "printer_name": mem_dev.get("printer_name", ""),
                    "ip": mem_dev.get("ip", ""),
                    "lead": mem_dev.get("lead", ""),
                    "lan_uid": mem_dev.get("lan_uid", ""),
                    "agent_uid": mem_dev.get("agent_uid", ""),
                    "counter": mem_dev.get("counter") or {},
                    "status": mem_dev.get("status") or {},
                    "last_seen_at": mem_dev.get("last_seen_at") or "",
                }

        # 2. Database batch query for any missing from memory
        remaining_macs = [m for m in norm_macs if m not in result_devices]
        if remaining_macs:
            with session_factory() as session:
                rows = session.execute(
                    select(DeviceInfor)
                    .where(func.upper(DeviceInfor.mac_id).in_(remaining_macs))
                    .order_by(DeviceInfor.updated_at.desc())
                ).scalars().all()
                for r in rows:
                    mac_upper = (r.mac_id or "").upper().replace("-", ":")
                    if mac_upper not in result_devices:
                        result_devices[mac_upper] = {
                            "printer_name": r.printer_name or "",
                            "ip": r.ip or "",
                            "lead": r.lead or "",
                            "lan_uid": r.lan_uid or "",
                            "agent_uid": r.agent_uid or "",
                            "counter": r.counter_data or {},
                            "status": r.status_data or {},
                            "last_seen_at": r.updated_at.isoformat() if r.updated_at else "",
                        }

                still_missing = [m for m in remaining_macs if m not in result_devices]
                if still_missing:
                    p_rows = session.execute(
                        select(Printer)
                        .where(func.upper(Printer.mac_address).in_(still_missing))
                        .order_by(Printer.updated_at.desc())
                    ).scalars().all()
                    for p in p_rows:
                        mac_upper = (p.mac_address or "").upper().replace("-", ":")
                        if mac_upper not in result_devices:
                            result_devices[mac_upper] = {
                                "printer_name": p.printer_name or "",
                                "ip": p.ip or "",
                                "lead": p.lead or "",
                                "lan_uid": p.lan_uid or "",
                                "agent_uid": p.agent_uid or "",
                                "counter": {},
                                "status": {},
                                "last_seen_at": p.updated_at.isoformat() if p.updated_at else "",
                            }

                # Query DeviceInforHistory to supply counter/status for any device where counter is empty
                dh_rows = session.execute(
                    select(DeviceInforHistory)
                    .where(func.upper(DeviceInforHistory.mac_id).in_(norm_macs))
                    .order_by(DeviceInforHistory.updated_at.desc(), DeviceInforHistory.id.desc())
                ).scalars().all()
                for dh in dh_rows:
                    mac_upper = (dh.mac_id or "").upper().replace("-", ":")
                    if mac_upper in result_devices:
                        if not result_devices[mac_upper].get("counter"):
                            result_devices[mac_upper]["counter"] = dh.counter_data or {}
                        if not result_devices[mac_upper].get("status"):
                            result_devices[mac_upper]["status"] = dh.status_data or {}
                    elif mac_upper in norm_macs:
                        result_devices[mac_upper] = {
                            "printer_name": dh.printer_name or "",
                            "ip": dh.ip or "",
                            "lead": dh.lead or "",
                            "lan_uid": dh.lan_uid or "",
                            "agent_uid": dh.agent_uid or "",
                            "counter": dh.counter_data or {},
                            "status": dh.status_data or {},
                            "last_seen_at": dh.updated_at.isoformat() if dh.updated_at else "",
                        }

        return jsonify({
            "ok": True,
            "count": len(result_devices),
            "total_requested": len(norm_macs),
            "devices": result_devices,
        })


    @app.route("/webhook/infor_get", methods=["GET", "POST"])
    @app.route("/api/webhook/infor_get", methods=["GET", "POST"])
    @app.route("/webhook/infor", methods=["GET", "POST"])
    @app.route("/api/webhook/infor", methods=["GET", "POST"])
    @app.route("/api/admin/crm/webhook-url", methods=["GET", "POST"])
    def admin_crm_webhook_url() -> Any:
        from webhook_dispatcher import get_crm_webhook_url, set_crm_webhook_url
        from webhook_logger import log_webhook_event
        t0 = time_module.perf_counter()
        caller_ip = request.headers.get("X-Forwarded-For") or request.remote_addr or ""
        if "," in caller_ip:
            caller_ip = caller_ip.split(",")[0].strip()
        user_agent = request.headers.get("User-Agent", "")

        if request.method == "POST":
            body = request.get_json(silent=True) or {}
            # 1. Update webhook URL if url or webhook_url is passed
            url_val = body.get("url") or body.get("webhook_url") or request.form.get("url")
            if url_val is not None:
                clean_url = _to_text(url_val).strip()
                set_crm_webhook_url(session_factory, clean_url)
                resp_data = {
                    "ok": True,
                    "webhook_url": clean_url,
                    "endpoint": "/webhook/infor_get",
                    "message": f"Webhook destination URL updated to: {clean_url or '(disabled)'}",
                }
                dur = int((time_module.perf_counter() - t0) * 1000)
                log_webhook_event(
                    session_factory=session_factory,
                    endpoint="/webhook/infor_get",
                    method="POST",
                    ip_address=caller_ip,
                    user_agent=user_agent,
                    request_payload=body,
                    response_status=200,
                    response_payload=resp_data,
                    duration_ms=dur,
                )
                return jsonify(resp_data)

            # 2. Accept incoming event payload (test/receiver mode)
            event = body.get("event", "device_data_changed")
            mac_id = body.get("mac_id", "")
            LOGGER.info("[WebhookInfor] Received webhook POST event='%s' mac='%s'", event, mac_id)
            resp_data = {
                "ok": True,
                "received": True,
                "event": event,
                "mac_id": mac_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            dur = int((time_module.perf_counter() - t0) * 1000)
            log_webhook_event(
                session_factory=session_factory,
                endpoint="/webhook/infor_get",
                method="POST",
                ip_address=caller_ip,
                user_agent=user_agent,
                request_payload=body,
                response_status=200,
                response_payload=resp_data,
                mac_id=mac_id,
                duration_ms=dur,
            )
            return jsonify(resp_data), 200

        # GET method
        mac_q = _to_text(request.args.get("mac_id") or request.args.get("mac"))
        all_q = _to_text(request.args.get("all"))
        current_url = get_crm_webhook_url(session_factory)

        # If user queries a specific device by mac_id:
        if mac_q:
            clean_mac = _normalize_mac(mac_q)
            device_infor_row = None
            counter_row = None
            status_row = None
            with session_factory() as session:
                device_infor_row = session.execute(
                    select(DeviceInfor).where(DeviceInfor.mac_id == clean_mac)
                ).scalars().first()
                counter_row = session.execute(
                    select(CounterInfor).where(CounterInfor.mac_id == clean_mac).order_by(CounterInfor.timestamp.desc())
                ).scalars().first()
                status_row = session.execute(
                    select(StatusInfor).where(StatusInfor.mac_id == clean_mac).order_by(StatusInfor.timestamp.desc())
                ).scalars().first()

            p_name = device_infor_row.printer_name if device_infor_row else (counter_row.printer_name if counter_row else "")
            p_ip = device_infor_row.ip if device_infor_row else (counter_row.ip if counter_row else "")
            c_data = (counter_row.raw_payload if counter_row and counter_row.raw_payload else (device_infor_row.counter_data if device_infor_row else {})) or {}
            s_data = (status_row.raw_payload if status_row and status_row.raw_payload else (device_infor_row.status_data if device_infor_row else {})) or {}

            dev_summary = {}
            if device_infor_row:
                dev_summary = {
                    "printer_name": device_infor_row.printer_name or "",
                    "ip": device_infor_row.ip or "",
                    "lead": device_infor_row.lead or "",
                    "lan_uid": device_infor_row.lan_uid or "",
                    "agent_uid": device_infor_row.agent_uid or "",
                    "last_counter_at": device_infor_row.last_counter_at.isoformat() if device_infor_row.last_counter_at else "",
                    "last_status_at": device_infor_row.last_status_at.isoformat() if device_infor_row.last_status_at else "",
                }

            resp_data = {
                "ok": True,
                "endpoint": "/webhook/infor_get",
                "mac_id": clean_mac,
                "printer_name": p_name,
                "ip": p_ip,
                "device_infor": dev_summary,
                "counter": c_data,
                "status": s_data,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            dur = int((time_module.perf_counter() - t0) * 1000)
            log_webhook_event(
                session_factory=session_factory,
                endpoint="/webhook/infor_get",
                method="GET",
                ip_address=caller_ip,
                user_agent=user_agent,
                query_params=dict(request.args),
                response_status=200,
                response_payload=resp_data,
                mac_id=clean_mac,
                printer_name=p_name,
                duration_ms=dur,
            )
            return jsonify(resp_data)

        # Standard GET: return webhook config + usage info
        resp_data = {
            "ok": True,
            "webhook_url": current_url or "",
            "configured": bool(current_url),
            "endpoint": "/webhook/infor_get",
            "description": "CRM Real-time Webhook URL configuration & data retrieval endpoint",
            "usage": {
                "read_config": "GET /webhook/infor_get",
                "get_device_infor": "GET /webhook/infor_get?mac_id=<MAC_ADDRESS>",
                "update_url": "POST /webhook/infor_get with {'url': 'https://your-crm.com/webhook'}",
                "trigger_test": "POST /webhook/infor_post",
            },
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        dur = int((time_module.perf_counter() - t0) * 1000)
        log_webhook_event(
            session_factory=session_factory,
            endpoint="/webhook/infor_get",
            method="GET",
            ip_address=caller_ip,
            user_agent=user_agent,
            query_params=dict(request.args),
            response_status=200,
            response_payload=resp_data,
            duration_ms=dur,
        )
        return jsonify(resp_data)


    @app.route("/webhook/infor_post", methods=["GET", "POST"])
    @app.route("/api/webhook/infor_post", methods=["GET", "POST"])
    @app.route("/infor/webhook", methods=["GET", "POST"])
    @app.route("/api/infor/webhook", methods=["GET", "POST"])
    @app.route("/infor/push", methods=["GET", "POST"])
    @app.route("/infor/send", methods=["GET", "POST"])
    @app.route("/infor/dispatch", methods=["GET", "POST"])
    @app.route("/infor/trigger", methods=["GET", "POST"])
    @app.route("/webhook/test", methods=["GET", "POST"])
    @app.route("/api/webhook/test", methods=["GET", "POST"])
    @app.route("/webhook/infor/test", methods=["GET", "POST"])
    @app.route("/api/admin/crm/test-webhook", methods=["GET", "POST"])
    def admin_crm_test_webhook() -> Any:
        from webhook_dispatcher import get_crm_webhook_url
        from webhook_logger import log_webhook_event
        import requests
        t0 = time_module.perf_counter()
        caller_ip = request.headers.get("X-Forwarded-For") or request.remote_addr or ""
        if "," in caller_ip:
            caller_ip = caller_ip.split(",")[0].strip()
        user_agent = request.headers.get("User-Agent", "")

        body = request.get_json(silent=True) or {}
        custom_url = body.get("url") or body.get("webhook_url") or request.args.get("url")
        url = (custom_url or get_crm_webhook_url(session_factory) or "").strip()

        test_payload = {
            "event": "device_data_changed",
            "test": True,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "mac_id": "58:38:79:41:80:7C",
            "printer_name": "RICOH MP 6503 (Test Webhook)",
            "ip": "192.168.1.222",
            "agent_uid": "test-agent",
            "lead": "default",
            "lan_uid": "default_84_93_B2_7C_EE_78_192_168_1_1",
            "counter": {
                "total": "57393",
                "copier_bw": "13421",
                "printer_bw": "43972",
                "a3_dlt": "8955",
                "duplex": "18026",
                "scanner_send_bw": "1",
                "send_tx_total_bw": "1"
            },
            "status": {
                "copier_status": "Ready",
                "printer_status": "Ready",
                "toner_black": "Status OK",
                "is_online": True
            }
        }

        if not url:
            resp_data = {
                "ok": True,
                "configured": False,
                "endpoint": "/webhook/infor_post",
                "status": "not_configured",
                "message": "Chưa cấu hình URL Webhook CRM đích! Vui lòng vào System Settings (/configs) để nhập URL CRM của bạn hoặc gửi POST /webhook/infor_get.",
                "guide": "Cấu hình tại https://agentapi.quanlymay.com/configs mục '🔔 CRM Webhook Settings'. Sau đó bấm lại nút này để bắn test sang CRM.",
                "sample_payload": test_payload
            }
            dur = int((time_module.perf_counter() - t0) * 1000)
            log_webhook_event(
                session_factory=session_factory,
                endpoint="/webhook/infor_post",
                method=request.method,
                ip_address=caller_ip,
                user_agent=user_agent,
                request_payload=body,
                response_status=200,
                response_payload=resp_data,
                mac_id=test_payload["mac_id"],
                printer_name=test_payload["printer_name"],
                duration_ms=dur,
            )
            return jsonify(resp_data), 200

        try:
            resp = requests.post(
                url,
                json=test_payload,
                headers={"Content-Type": "application/json", "User-Agent": "Goxprint-Webhook-Test/1.0"},
                timeout=5.0
            )
            resp_data = {
                "ok": resp.status_code < 400,
                "endpoint": "/webhook/infor_post",
                "target_url": url,
                "status_code": resp.status_code,
                "message": f"Webhook test sent to {url} (HTTP {resp.status_code})",
                "response_text": resp.text[:500],
                "payload_sent": test_payload
            }
            dur = int((time_module.perf_counter() - t0) * 1000)
            log_webhook_event(
                session_factory=session_factory,
                endpoint="/webhook/infor_post",
                method=request.method,
                ip_address=caller_ip,
                user_agent=user_agent,
                request_payload=body or test_payload,
                response_status=resp.status_code,
                response_payload=resp_data,
                mac_id=test_payload["mac_id"],
                printer_name=test_payload["printer_name"],
                duration_ms=dur,
            )
            return jsonify(resp_data), 200
        except requests.exceptions.Timeout:
            resp_data = {
                "ok": False,
                "endpoint": "/webhook/infor_post",
                "target_url": url,
                "error": f"Connection timed out after 5.0s contacting CRM endpoint: {url}",
                "payload_sent": test_payload
            }
            dur = int((time_module.perf_counter() - t0) * 1000)
            log_webhook_event(
                session_factory=session_factory,
                endpoint="/webhook/infor_post",
                method=request.method,
                ip_address=caller_ip,
                user_agent=user_agent,
                request_payload=body or test_payload,
                response_status=408,
                response_payload=resp_data,
                mac_id=test_payload["mac_id"],
                printer_name=test_payload["printer_name"],
                duration_ms=dur,
            )
            return jsonify(resp_data), 200
        except Exception as exc:
            resp_data = {
                "ok": False,
                "endpoint": "/webhook/infor_post",
                "target_url": url,
                "error": f"Failed to dispatch test webhook to {url}: {exc}",
                "payload_sent": test_payload
            }
            dur = int((time_module.perf_counter() - t0) * 1000)
            log_webhook_event(
                session_factory=session_factory,
                endpoint="/webhook/infor_post",
                method=request.method,
                ip_address=caller_ip,
                user_agent=user_agent,
                request_payload=body or test_payload,
                response_status=500,
                response_payload=resp_data,
                mac_id=test_payload["mac_id"],
                printer_name=test_payload["printer_name"],
                duration_ms=dur,
            )
            return jsonify(resp_data), 200


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

    @app.get("/api/public/ip/public")
    def public_ip_check() -> Any:
        ip = request.headers.get("X-Forwarded-For")
        if ip:
            ip = ip.split(",")[0].strip()
        else:
            ip = request.remote_addr
        return jsonify({"ok": True, "public_ip": ip or "unknown"})

    @app.get("/api/public/ip/workstation")
    def public_workstation_ip_check() -> Any:
        agent_uid = _to_text(request.args.get("agent_uid"))
        lan_uid = _to_text(request.args.get("lan_uid"))
        mac = _to_text(request.args.get("mac") or request.args.get("mac_id"))
        
        with session_factory() as session:
            agent_node = None
            
            if agent_uid:
                agent_node = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == agent_uid)
                    .order_by(AgentNode.updated_at.desc())
                    .limit(1)
                ).scalar_one_or_none()
                
            elif lan_uid:
                agent_node = session.execute(
                    select(AgentNode)
                    .where(AgentNode.lan_uid == lan_uid)
                    .order_by(AgentNode.updated_at.desc())
                    .limit(1)
                ).scalar_one_or_none()
                
            elif mac:
                normalized_mac = _normalize_mac(mac)
                if normalized_mac:
                    printer = session.execute(
                        select(Printer)
                        .where(func.upper(Printer.mac_address) == normalized_mac)
                        .order_by(Printer.updated_at.desc())
                        .limit(1)
                    ).scalar_one_or_none()
                    
                    if printer and printer.agent_uid:
                        agent_node = session.execute(
                            select(AgentNode)
                            .where(AgentNode.agent_uid == printer.agent_uid)
                            .order_by(AgentNode.updated_at.desc())
                            .limit(1)
                        ).scalar_one_or_none()
                        
                    if not agent_node:
                        device = session.execute(
                            select(DeviceInfor)
                            .where(func.upper(DeviceInfor.mac_id) == normalized_mac)
                            .order_by(DeviceInfor.updated_at.desc())
                            .limit(1)
                        ).scalar_one_or_none()
                        
                        if device and device.agent_uid:
                            agent_node = session.execute(
                                select(AgentNode)
                                .where(AgentNode.agent_uid == device.agent_uid)
                                .order_by(AgentNode.updated_at.desc())
                                .limit(1)
                            ).scalar_one_or_none()
            
            if not agent_node:
                lead_val = _coalesce_request_lead(request.args.get("lead"), lead_key_map)
                agent_node = session.execute(
                    select(AgentNode)
                    .where(AgentNode.lead == lead_val)
                    .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
                    .limit(1)
                ).scalar_one_or_none()

            if not agent_node:
                return jsonify({"ok": False, "error": "Agent workstation not found"}), 404
                
            return jsonify({
                "ok": True,
                "local_ip": _to_text(agent_node.local_ip),
                "hostname": _to_text(agent_node.hostname),
                "agent_uid": _to_text(agent_node.agent_uid),
                "lan_uid": _to_text(agent_node.lan_uid),
                "app_version": _to_text(agent_node.app_version),
                "is_online": bool(agent_node.is_online),
                "last_seen_at": agent_node.last_seen_at.isoformat() if agent_node.last_seen_at else None
            })



    @app.get("/api/config/scanner-ports")
    @app.get("/api/public/config/scanner-ports")
    def get_scanner_ports() -> Any:
        try:
            from models import PrinterRecognizePort
            with session_factory() as session:
                ports = session.query(PrinterRecognizePort).filter(PrinterRecognizePort.enabled == True).all()
                def_ports = [p.port for p in ports if p.port_type == "definitive"]
                web_ports = [p.port for p in ports if p.port_type == "web"]
                all_ports = [p.port for p in ports]
                if not def_ports:
                    def_ports = [9100]
                    all_ports = [9100]
                return jsonify({
                    "ok": True,
                    "definitive_ports": def_ports,
                    "web_ports": web_ports,
                    "all_ports": all_ports,
                })
        except Exception as e:
            return jsonify({"ok": True, "definitive_ports": [9100], "web_ports": [], "all_ports": [9100]})
