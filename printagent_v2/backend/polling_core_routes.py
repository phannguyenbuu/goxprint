from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any

from flask import Flask, jsonify, request
from sqlalchemy import select

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
        )

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
