from __future__ import annotations

import json
import logging
import time as time_module
from datetime import datetime, timezone, timedelta
from typing import Any

from flask import Flask, jsonify, request
from sqlalchemy import select, func, or_, and_

from utils import _to_text, _normalize_mac
from serializers import (
    _refresh_stale_offline,
)
from app_helpers import _serialize_audit_payload_iso
from models import Printer, PrinterControlCommand

LOGGER = logging.getLogger(__name__)


def _resolve_printer_control_target(session: Any, device_ref: Any, body: dict[str, Any] | None = None) -> Printer | None:
    import re
    ref_list = [device_ref]
    if body and isinstance(body, dict):
        for k in ["mac_address", "mac_id", "printer_mac_id", "printer_id", "id", "printer_ip", "ip"]:
            v = body.get(k)
            if v:
                ref_list.append(v)

    ref_str = _to_text(device_ref)
    if ref_str:
        # Extract embedded MAC addresses (00:80:91:B6:18:FF or 00-80-91-B6-18-FF)
        for m in re.findall(r"(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}", ref_str):
            norm = _normalize_mac(m)
            if norm and norm not in ref_list:
                ref_list.append(norm)

    # 1. Try querying PostgreSQL database first
    for ref in ref_list:
        if not ref:
            continue
        raw_ref = _to_text(ref).strip()
        if raw_ref.isdigit():
            p = session.get(Printer, int(raw_ref))
            if p:
                return p
        normalized_mac = _normalize_mac(ref)
        if normalized_mac:
            p = (
                session.execute(
                    select(Printer)
                    .where(func.upper(Printer.mac_address) == normalized_mac)
                    .order_by(Printer.updated_at.desc(), Printer.id.desc())
                    .limit(1)
                )
                .scalars()
                .first()
            )
            if p:
                return p

    # 1b. Try querying PostgreSQL scan_points table
    try:
        from models import ScanPoint
        for ref in ref_list:
            if not ref:
                continue
            normalized_mac = _normalize_mac(ref)
            if normalized_mac:
                sp = session.get(ScanPoint, normalized_mac)
                if sp:
                    p = Printer(
                        id=0,
                        mac_address=sp.mac_id,
                        ip=sp.ip or "",
                        printer_name=sp.printer_name or "Photocopy",
                        agent_uid=sp.agent_uid or "",
                        lead="default",
                        lan_uid="default",
                        enabled=True,
                    )
                    return p
    except Exception:
        pass

    # 2. Fallback: Search in-memory ACTIVE_AGENTS RAM registry for RAM-only printers
    try:
        from active_agents_registry import ACTIVE_AGENTS
        for a_uid, agent_info in ACTIVE_AGENTS.items():
            printers_list = agent_info.get("printers_json") or []
            if not isinstance(printers_list, list):
                continue
            for p_dict in printers_list:
                if not isinstance(p_dict, dict):
                    continue
                p_mac = _normalize_mac(p_dict.get("mac_address") or p_dict.get("mac_id") or "")
                p_ip = str(p_dict.get("ip") or "").strip()
                p_name = str(p_dict.get("printer_name") or p_dict.get("name") or "").strip()
                
                matched = False
                for ref in ref_list:
                    if not ref:
                        continue
                    n_ref = _normalize_mac(ref)
                    if n_ref and p_mac and n_ref == p_mac:
                        matched = True
                        break

                if not matched and p_mac and p_mac in _normalize_mac(ref_str):
                    matched = True

                if matched:
                    return Printer(
                        id=0,
                        lead=agent_info.get("lead") or "default",
                        lan_uid=agent_info.get("lan_uid") or "",
                        agent_uid=a_uid,
                        printer_name=p_name or "Copier",
                        ip=p_ip,
                        mac_address=p_mac or str(p_dict.get("mac_address") or ""),
                        auth_user=str(p_dict.get("auth_user") or ""),
                        auth_password=str(p_dict.get("auth_password") or ""),
                        enabled=True,
                        is_online=True,
                    )
    except Exception as exc:
        LOGGER.warning("Error resolving printer control target from ACTIVE_AGENTS: %s", exc)

    if body:
        p_mac = _normalize_mac(body.get("mac_address") or body.get("mac_id") or "")
        if p_mac:
            p_ip = str(body.get("printer_ip") or body.get("ip") or "").strip()
            if p_ip == "0.0.0.0":
                p_ip = ""
            p_name = str(body.get("printer_name") or body.get("name") or "Photocopy").strip()
            p_type = str(body.get("printer_type") or body.get("type") or body.get("brand") or "").strip().lower()
            a_uid = str(body.get("agent_uid") or "").strip()

            p = Printer(
                mac_address=p_mac,
                ip=p_ip,
                printer_name=p_name,
                printer_type=p_type,
                agent_uid=a_uid,
                lead="default",
                lan_uid="default",
                enabled=True,
            )
            session.add(p)
            session.commit()
            session.refresh(p)
            return p

    return None


def _resolve_target_agent_uid(session: Any, printer: Printer | None, req_agent_uid: str, mac_address: str = "") -> str:
    agent_uid = req_agent_uid.strip()
    if agent_uid and agent_uid != "default":
        return agent_uid

    mac = _normalize_mac(mac_address or (printer.mac_address if printer else ""))
    if mac:
        try:
            from models import ScanPoint
            sp = session.get(ScanPoint, mac)
            if sp and sp.agent_uid and sp.agent_uid != "default":
                return sp.agent_uid
        except Exception:
            pass

    if printer and printer.agent_uid and printer.agent_uid != "default":
        return printer.agent_uid

    try:
        from models import AgentNode
        online_agent = session.execute(
            select(AgentNode)
            .order_by(AgentNode.last_seen_at.desc())
        ).scalars().first()
        if online_agent and online_agent.agent_uid:
            return online_agent.agent_uid
    except Exception:
        pass

    return "default"


def register_device_core_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:

    @app.get("/api/devices")
    @app.get("/api/devices/list")
    def devices_list() -> Any:
        lead = _to_text(request.args.get("lead"))
        with session_factory() as session:
            _refresh_stale_offline(session=session, lead=lead)
            session.commit()
            stmt = select(Printer).order_by(Printer.lan_uid.asc(), Printer.printer_name.asc(), Printer.ip.asc())
            if lead:
                stmt = stmt.where(Printer.lead == lead)
            raw_rows = session.execute(stmt).scalars().all()
            deduped: dict[str, Printer] = {}
            for r in raw_rows:
                ip_key = _to_text(r.ip)
                if ip_key:
                    key = f"{_to_text(r.lead)}|ip:{ip_key}"
                else:
                    key = f"{_to_text(r.lead)}|name:{_to_text(r.agent_uid).lower()}:{_to_text(r.printer_name).lower()}"
                previous = deduped.get(key)
                if previous is None:
                    deduped[key] = r
                    continue
                prev_updated = previous.updated_at or datetime.fromtimestamp(0, tz=timezone.utc)
                cur_updated = r.updated_at or datetime.fromtimestamp(0, tz=timezone.utc)
                if cur_updated >= prev_updated:
                    deduped[key] = r
            rows = sorted(deduped.values(), key=lambda x: (_to_text(x.lan_uid), _to_text(x.printer_name), _to_text(x.ip)))
        return jsonify(
            {
                "rows": [
                    {
                        "id": int(r.id),
                        "lead": r.lead,
                        "lan_uid": r.lan_uid,
                        "agent_uid": r.agent_uid,
                        "printer_name": r.printer_name,
                        "ip": r.ip,
                        "enabled": bool(r.enabled),
                        "enabled_changed_at": r.enabled_changed_at.isoformat() if r.enabled_changed_at else "",
                        "is_online": bool(r.is_online),
                        "online_changed_at": r.online_changed_at.isoformat() if r.online_changed_at else "",
                        "last_seen_at": r.updated_at.isoformat() if r.updated_at else "",
                        "label": f"{r.lan_uid} / {r.printer_name}",
                        "mac_id": r.mac_address or "",
                        "user": r.auth_user or "",
                        "password": r.auth_password or "",
                        "address_book_sync": r.address_book_sync,
                        **_serialize_audit_payload_iso(r.created_at, r.updated_at),
                    }
                    for r in rows
                ]
            }
        )

    def _submit_printer_control_command(
        device_ref: Any,
        *,
        enabled: bool,
        action_name: str = "",
    ) -> Any:
        requested_at = datetime.now(timezone.utc)
        action_label = _to_text(action_name).lower() or ("unlock" if enabled else "lock")
        with session_factory() as session:
            printer = _resolve_printer_control_target(session, device_ref)
            if printer is None:
                return jsonify({"ok": False, "error": "Printer not found", "action": action_label}), 404
            printer_id_value = int(printer.id)
            printer_mac_value = _normalize_mac(printer.mac_address) or printer.mac_address or ""

            pending = session.execute(
                select(PrinterControlCommand).where(
                    or_(
                        and_(printer.id != 0, PrinterControlCommand.printer_id == printer.id),
                        and_(printer.id == 0, PrinterControlCommand.printer_id == 0, PrinterControlCommand.ip == printer.ip)
                    ),
                    PrinterControlCommand.status == "pending",
                )
            ).scalars().all()
            for cmd in pending:
                cmd.status = "superseded"
                cmd.error_message = "Máy photo đang bận xử lý một lệnh khác. Vui lòng thử lại sau."
                cmd.responded_at = requested_at

            from models import AgentNode
            active_agent = None
            if printer.agent_uid:
                active_agent = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == printer.agent_uid)
                    .order_by(AgentNode.last_seen_at.desc())
                ).scalars().first()
            active_lan_uid = active_agent.lan_uid if active_agent else printer.lan_uid

            command = PrinterControlCommand(
                printer_id=printer.id,
                lead=printer.lead,
                lan_uid=active_lan_uid,
                agent_uid=printer.agent_uid,
                printer_name=printer.printer_name,
                ip=printer.ip,
                desired_enabled=enabled,
                auth_user=printer.auth_user,
                auth_password=printer.auth_password,
                status="pending",
                error_message="",
                requested_at=requested_at,
                responded_at=None,
            )
            session.add(command)
            session.commit()
            command_id = int(command.id)

        timeout_seconds = 25
        deadline = datetime.now(timezone.utc) + timedelta(seconds=timeout_seconds)
        while datetime.now(timezone.utc) < deadline:
            with session_factory() as session:
                current = session.get(PrinterControlCommand, command_id)
                if current is None:
                    break
                if current.status == "success":
                    changed_at = current.responded_at or datetime.now(timezone.utc)
                    return jsonify(
                        {
                            "ok": True,
                            "id": printer_id_value,
                            "mac_id": printer_mac_value,
                            "enabled": enabled,
                            "action": action_label,
                            "changed_at": changed_at.isoformat(),
                            "command_id": command_id,
                        }
                    )
                if current.status == "failed":
                    return (
                        jsonify(
                            {
                                "ok": False,
                                "error": current.error_message or "Control command failed",
                                "action": action_label,
                                "command_id": command_id,
                            }
                        ),
                        409,
                    )
            time_module.sleep(0.5)

        with session_factory() as session:
            timeout_cmd = session.get(PrinterControlCommand, command_id)
            if timeout_cmd is not None and timeout_cmd.status == "pending":
                timeout_cmd.status = "failed"
                timeout_cmd.error_message = "Timeout waiting agent lock/unlock result"
                timeout_cmd.responded_at = datetime.now(timezone.utc)
                session.commit()
        return (
            jsonify(
                {
                    "ok": False,
                    "error": "Timeout waiting agent lock/unlock result",
                    "action": action_label,
                    "command_id": command_id,
                }
            ),
            504,
        )

    def _submit_printer_fetch_address_book_command(device_ref: Any) -> Any:
        import json as _json
        requested_at = datetime.now(timezone.utc)
        body = request.get_json(silent=True) or {}
        with session_factory() as session:
            printer = _resolve_printer_control_target(session, device_ref, body=body)
            req_agent_uid = request.args.get("agent_uid", "").strip() or str(body.get("agent_uid", "")).strip()

            from models import AgentNode
            active_agent = None
            if req_agent_uid:
                active_agent = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == req_agent_uid)
                    .order_by(AgentNode.last_seen_at.desc())
                ).scalars().first()

            printer_id_value = int(printer.id) if printer else 0
            printer_mac_value = _normalize_mac(printer.mac_address if printer else (body.get("mac_address") or body.get("mac_id") or "")) or ""
            printer_lead_val = printer.lead if printer else (active_agent.lead if active_agent else "default")
            printer_lan_val = active_agent.lan_uid if active_agent else (printer.lan_uid if printer else str(device_ref))
            printer_name_val = printer.printer_name if printer else str(body.get("printer_name") or body.get("name") or "Photocopy")
            frontend_ip = str(body.get("printer_ip") or body.get("ip") or "").strip()
            if not frontend_ip and "." in str(device_ref):
                frontend_ip = str(device_ref).strip()

            printer_ip_val = frontend_ip or (printer.ip if printer else "")

            # If still missing IP, fallback to searching ACTIVE_AGENTS RAM registry by MAC address
            if not printer_ip_val or printer_ip_val == "0.0.0.0":
                ref_mac = _normalize_mac(_to_text(device_ref)) or printer_mac_value
                if ref_mac:
                    try:
                        from active_agents_registry import ACTIVE_AGENTS
                        for a_uid, agent_info in ACTIVE_AGENTS.items():
                            for p_dict in (agent_info.get("printers_json") or []):
                                p_mac = _normalize_mac(p_dict.get("mac_address") or p_dict.get("mac_id") or "")
                                if p_mac == ref_mac and p_dict.get("ip"):
                                    printer_ip_val = str(p_dict.get("ip")).strip()
                                    break
                            if printer_ip_val:
                                break
                    except Exception:
                        pass

            # Strict validation: If printer IP is missing, invalid or 0.0.0.0, reject immediately with 400 Bad Request
            if not printer_ip_val or printer_ip_val == "0.0.0.0":
                return jsonify({"ok": False, "error": "Thiếu thông tin IP máy in hợp lệ. Vui lòng chọn máy in cụ thể."}), 400
            printer_enabled_val = printer.enabled if printer else True
            printer_auth_user_val = (str(body.get("auth_user") or "").strip()) or (printer.auth_user if printer and printer.auth_user else "")
            printer_auth_pass_val = (str(body.get("auth_password") or "").strip()) or (printer.auth_password if printer and printer.auth_password else "")
            if not printer_auth_user_val:
                printer_auth_user_val = "admin"

            target_agent_uid = _resolve_target_agent_uid(session, printer, req_agent_uid, mac_address=printer_mac_value)

            if printer:
                pending = session.execute(
                    select(PrinterControlCommand).where(
                        or_(
                            and_(printer.id != 0, PrinterControlCommand.printer_id == printer.id),
                            and_(printer.id == 0, PrinterControlCommand.printer_id == 0, PrinterControlCommand.ip == printer.ip)
                        ),
                        PrinterControlCommand.status == "pending",
                        PrinterControlCommand.command_type == "fetch_address_book",
                    )
                ).scalars().all()
                for cmd in pending:
                    cmd.status = "superseded"
                    cmd.error_message = "Máy photo đang bận xử lý một lệnh khác. Vui lòng thử lại sau."
                    cmd.responded_at = requested_at

            is_toshiba = (printer and getattr(printer, 'printer_type', '') == 'toshiba') or 'toshiba' in printer_name_val.lower() or 'e-studio' in printer_name_val.lower()
            is_xerox = (printer and getattr(printer, 'printer_type', '') in ['fujifilm', 'xerox']) or 'fujifilm' in printer_name_val.lower() or 'xerox' in printer_name_val.lower()
            
            if is_toshiba:
                cmd_name = "toshiba_list_scan"
            elif is_xerox:
                cmd_name = "xerox_list_scan"
            else:
                cmd_name = "ricoh_list_scan"
                
            cmd_content = ""
            try:
                from models import UtiCommand
                with session_factory() as session:
                    cmd_entry = session.execute(
                        select(UtiCommand).where(UtiCommand.command == cmd_name)
                    ).scalar_one_or_none()
                    if cmd_entry:
                        from utils import resolve_utility_command_content
                        cmd_content = resolve_utility_command_content(session, cmd_entry.command_content)
            except Exception as uc_err:
                LOGGER.warning("Error querying %s from database UtiCommand: %s", cmd_name, uc_err)

            if cmd_content:
                cmd_content = cmd_content.replace("__TARGET_IP__", printer_ip_val).replace("__PRINTER_IP__", printer_ip_val)
                cmd_content = cmd_content.replace("__TARGET_USER__", printer_auth_user_val).replace("__AUTH_USER__", printer_auth_user_val)
                cmd_content = cmd_content.replace("__TARGET_PASS__", printer_auth_pass_val).replace("__AUTH_PASS__", printer_auth_pass_val)

            command_type_val = "trigger_utility"
            command_params_val = _json.dumps({
                "action": "exec_utility",
                "command": cmd_name,
                "command_content": cmd_content,
                "printer_ip": printer_ip_val,
                "ip": printer_ip_val,
                "auth_user": printer_auth_user_val,
                "auth_password": printer_auth_pass_val,
                "mac_address": printer_mac_value,
                "printer_mac_id": printer_mac_value,
            })

            command = PrinterControlCommand(
                printer_id=printer_id_value,
                lead=printer_lead_val,
                lan_uid=printer_lan_val,
                agent_uid=target_agent_uid,
                printer_name=printer_name_val,
                ip=printer_ip_val,
                desired_enabled=printer_enabled_val,
                command_type=command_type_val,
                auth_user=printer_auth_user_val,
                auth_password=printer_auth_pass_val,
                command_params=command_params_val,
                status="pending",
                error_message="",
                requested_at=requested_at,
                responded_at=None,
            )
            session.add(command)
            session.commit()
            command_id = int(command.id)

        return jsonify(
            {
                "ok": True,
                "status": "pending",
                "command_id": command_id,
                "printer_id": printer_id_value,
                "mac_id": printer_mac_value,
            }
        )

    @app.patch("/api/devices/<device_ref>/enable")
    def device_set_enable(device_ref: str) -> Any:
        body = request.get_json(silent=True) or {}
        enabled_raw = body.get("enabled", True)
        enabled = enabled_raw if isinstance(enabled_raw, bool) else str(enabled_raw).strip().lower() in {"1", "true", "yes", "on"}
        return _submit_printer_control_command(
            device_ref,
            enabled=enabled,
            action_name="unlock" if enabled else "lock",
        )

    @app.post("/api/devices/<device_ref>/unlock")
    def device_unlock(device_ref: str) -> Any:
        return _submit_printer_control_command(
            device_ref,
            enabled=True,
            action_name="unlock",
        )

    @app.post("/api/devices/<device_ref>/lock")
    def device_lock(device_ref: str) -> Any:
        return _submit_printer_control_command(
            device_ref,
            enabled=False,
            action_name="lock",
        )

    @app.patch("/api/devices/<path:device_ref>/credentials")
    @app.post("/api/devices/<path:device_ref>/credentials")
    def device_update_credentials(device_ref: str) -> Any:
        body = request.get_json(silent=True) or {}
        if not isinstance(body, dict):
            return jsonify({"ok": False, "error": "Invalid JSON body"}), 400
        auth_user = str(body.get("auth_user", "") or body.get("user", "")).strip()
        auth_password = str(body.get("auth_password", "") or body.get("password", "")).strip()
        req_printer_type = str(body.get("printer_type", "")).strip()

        clean_mac = _normalize_mac(device_ref) or _normalize_mac(_to_text(body.get("mac_address") or body.get("mac_id")))
        ref_text = _to_text(device_ref).strip()

        # Save directly to PrinterAuthCredential dedicated table on VPS DB
        with session_factory() as session:
            printer = _resolve_printer_control_target(session, device_ref, body=body)
            p_id = int(printer.id) if printer else 0
            p_mac = _normalize_mac(printer.mac_address) if printer else clean_mac
            p_ip = printer.ip if printer else ""
            p_lead = printer.lead if printer else "default"
            p_lan = printer.lan_uid if printer else ""

            if p_mac:
                from models import PrinterAuthCredential
                auth_cred = session.query(PrinterAuthCredential).filter(
                    PrinterAuthCredential.mac_address == p_mac
                ).first()
                if not auth_cred:
                    auth_cred = PrinterAuthCredential(
                        lead=p_lead,
                        lan_uid=p_lan,
                        mac_address=p_mac,
                        ip=p_ip,
                        printer_name=printer.printer_name if printer else "",
                        auth_user=auth_user,
                        auth_password=auth_password,
                    )
                    session.add(auth_cred)
                else:
                    auth_cred.auth_user = auth_user
                    auth_cred.auth_password = auth_password
                    if p_ip: auth_cred.ip = p_ip
                    if p_lan: auth_cred.lan_uid = p_lan
                    auth_cred.updated_at = datetime.now(timezone.utc)
                
                # Also update Printer table if exists
                if printer:
                    printer.auth_user = auth_user
                    printer.auth_password = auth_password
                    printer.updated_at = datetime.now(timezone.utc)
                
                session.commit()
                LOGGER.info("[device_update_credentials] Saved Auth Credential in VPS DB for mac=%s auth_user=%s", p_mac, auth_user)

        return jsonify({"ok": True, "auth_user": auth_user, "ram_updated": False, "command_id": None})

    @app.get("/api/devices/credentials-map")
    def device_credentials_map() -> Any:
        """Returns a map of all saved copier login credentials keyed by MAC address."""
        from models import PrinterAuthCredential
        with session_factory() as session:
            creds = session.query(PrinterAuthCredential).all()
            res_map = {}
            for c in creds:
                mac = str(c.mac_address or "").strip().upper()
                if mac:
                    res_map[mac] = {
                        "auth_user": c.auth_user or "",
                        "auth_password": c.auth_password or "",
                        "ip": c.ip or "",
                        "mac_address": mac,
                        "updated_at": c.updated_at.isoformat() if c.updated_at else ""
                    }
            return jsonify({"ok": True, "credentials": res_map})

    @app.post("/api/devices/<device_ref>/fetch-address-book")
    def device_fetch_address_book(device_ref: str) -> Any:
        return _submit_printer_fetch_address_book_command(device_ref)

    @app.post("/api/devices/<device_ref>/add-email-dest")
    def device_add_email_dest(device_ref: str) -> Any:
        """Enqueue an add_scan_email_dest command so the agent creates an FTP
        scan destination on the copier for the given email address."""
        import json as _json
        body = request.get_json(silent=True) or {}
        email = str(body.get("email", "")).strip().lower()
        name = str(body.get("name", "")).strip()
        if not name:
            if email:
                name = email.split("@")[0]
            else:
                return jsonify({"ok": False, "error": "Tên điểm scan là bắt buộc"}), 400
        if email and "@" not in email:
            return jsonify({"ok": False, "error": "Địa chỉ email không hợp lệ"}), 400

        requested_at = datetime.now(timezone.utc)
        with session_factory() as session:
            printer = _resolve_printer_control_target(session, device_ref, body=body)
            req_agent_uid = request.args.get("agent_uid", "").strip() or str(body.get("agent_uid", "")).strip()

            from models import AgentNode
            active_agent = None
            if req_agent_uid:
                active_agent = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == req_agent_uid)
                    .order_by(AgentNode.last_seen_at.desc())
                ).scalars().first()

            printer_id_value = int(printer.id) if printer else 0
            printer_mac_value = _normalize_mac(printer.mac_address if printer else (body.get("mac_address") or body.get("mac_id") or "")) or ""
            printer_lead_val = printer.lead if printer else (active_agent.lead if active_agent else "default")
            printer_lan_val = active_agent.lan_uid if active_agent else (printer.lan_uid if printer else device_ref)
            printer_name_val = printer.printer_name if printer else str(body.get("name") or body.get("printer_name") or "Photocopy")
            frontend_ip = str(body.get("printer_ip") or body.get("ip") or "").strip()
            if frontend_ip == "0.0.0.0":
                frontend_ip = ""
            printer_ip_val = frontend_ip or (printer.ip if printer and printer.ip and printer.ip != "0.0.0.0" else "") or "0.0.0.0"
            printer_enabled_val = printer.enabled if printer else True
            printer_auth_user_val = (str(body.get("auth_user") or "").strip()) or (printer.auth_user if printer and printer.auth_user else "")
            printer_auth_pass_val = (str(body.get("auth_password") or "").strip()) or (printer.auth_password if printer and printer.auth_password else "")
            if not printer_auth_user_val:
                printer_auth_user_val = "admin"

            target_agent_uid = _resolve_target_agent_uid(session, printer, req_agent_uid, mac_address=printer_mac_value)

            if printer:
                pending = session.execute(
                    select(PrinterControlCommand).where(
                        or_(
                            and_(printer.id != 0, PrinterControlCommand.printer_id == printer.id),
                            and_(printer.id == 0, PrinterControlCommand.printer_id == 0, PrinterControlCommand.ip == printer.ip)
                        ),
                        PrinterControlCommand.status == "pending",
                        PrinterControlCommand.command_type == "add_scan_email_dest",
                    )
                ).scalars().all()
                for cmd in pending:
                    cmd.status = "superseded"
                    cmd.error_message = "Máy photo đang bận xử lý một lệnh khác. Vui lòng thử lại sau."
                    cmd.responded_at = requested_at

            req_type = str(body.get("printer_type") or body.get("type") or body.get("brand") or "").lower()
            is_toshiba = False
            if req_type:
                is_toshiba = req_type == "toshiba"
            else:
                is_toshiba = (
                    (printer and (getattr(printer, 'printer_type', '') == 'toshiba' or 'toshiba' in (printer.printer_name or '').lower() or 'e-studio' in (printer.printer_name or '').lower())) or
                    'toshiba' in printer_name_val.lower() or
                    'e-studio' in printer_name_val.lower()
                )
            is_xerox = False
            if req_type:
                is_xerox = req_type in ["fujifilm", "xerox"]
            else:
                is_xerox = (
                    (printer and (getattr(printer, 'printer_type', '') in ['fujifilm', 'xerox'] or 'fujifilm' in (printer.printer_name or '').lower() or 'xerox' in (printer.printer_name or '').lower())) or
                    'fujifilm' in printer_name_val.lower() or 'xerox' in printer_name_val.lower()
                )
            
            if is_toshiba:
                create_cmd_name = "toshiba_create_scan"
            elif is_xerox:
                create_cmd_name = "xerox_create_scan"
            else:
                create_cmd_name = "ricoh_create_scan"
                
            cmd_content = ""
            try:
                from models import UtiCommand
                with session_factory() as session:
                    cmd_entry = session.execute(
                        select(UtiCommand).where(UtiCommand.command == create_cmd_name)
                    ).scalar_one_or_none()
                    if cmd_entry:
                        from utils import resolve_utility_command_content
                        cmd_content = resolve_utility_command_content(session, cmd_entry.command_content)
            except Exception as uc_err:
                LOGGER.warning("Error querying %s from database UtiCommand: %s", create_cmd_name, uc_err)

            if cmd_content:
                cmd_content = cmd_content.replace("__TARGET_IP__", printer_ip_val).replace("__PRINTER_IP__", printer_ip_val)
                cmd_content = cmd_content.replace("__TARGET_USER__", printer_auth_user_val).replace("__AUTH_USER__", printer_auth_user_val)
                cmd_content = cmd_content.replace("__TARGET_PASS__", printer_auth_pass_val).replace("__AUTH_PASS__", printer_auth_pass_val)
                cmd_content = cmd_content.replace("__TARGET_SCAN_USER__", name).replace("__TARGET_NAME__", name).replace("__SCAN_USERNAME__", name)
                cmd_content = cmd_content.replace("__TARGET_EMAIL__", email).replace("__EMAIL__", email)

            command_type_val = "trigger_utility"
            command_params_val = _json.dumps({
                "action": "exec_utility",
                "command": create_cmd_name,
                "command_content": cmd_content,
                "printer_ip": printer_ip_val,
                "ip": printer_ip_val,
                "auth_user": printer_auth_user_val,
                "auth_password": printer_auth_pass_val,
                "name": name,
                "target_name": name,
                "email": email,
                "mac_address": printer_mac_value,
                "printer_mac_id": printer_mac_value,
            })

            command = PrinterControlCommand(
                printer_id=printer_id_value,
                lead=printer_lead_val,
                lan_uid=printer_lan_val,
                agent_uid=target_agent_uid,
                printer_name=printer_name_val,
                ip=printer_ip_val,
                desired_enabled=printer_enabled_val,
                command_type=command_type_val,
                auth_user=printer_auth_user_val,
                auth_password=printer_auth_pass_val,
                command_params=command_params_val,
                status="pending",
                error_message="",
                requested_at=requested_at,
                responded_at=None,
            )
            session.add(command)

            session.commit()

            command_id = int(command.id)

        return jsonify({
            "ok": True,
            "status": "pending",
            "command_id": command_id,
            "printer_id": printer_id_value,
            "mac_id": printer_mac_value,
        })

    @app.post("/api/devices/<device_ref>/delete-email-dest")
    def device_delete_email_dest(device_ref: str) -> Any:
        """Enqueue a delete_scan_email_dest command so the agent deletes the FTP
        scan destination on the copier for the given registration number & entry ID."""
        import json as _json
        body = request.get_json(silent=True) or {}
        reg_no = str(body.get("registration_no", "")).strip()
        entry_id = str(body.get("entry_id", "")).strip()
        if not reg_no:
            return jsonify({"ok": False, "error": "registration_no is required"}), 400

        requested_at = datetime.now(timezone.utc)
        with session_factory() as session:
            printer = _resolve_printer_control_target(session, device_ref, body=body)
            if printer is None:
                return jsonify({"ok": False, "error": "Printer not found"}), 404
            printer_id_value = int(printer.id)
            printer_mac_value = _normalize_mac(printer.mac_address) or printer.mac_address or ""

            # Cancel existing pending delete commands for this printer to avoid session conflicts
            pending = session.execute(
                select(PrinterControlCommand).where(
                    or_(
                        and_(printer.id != 0, PrinterControlCommand.printer_id == printer.id),
                        and_(printer.id == 0, PrinterControlCommand.printer_id == 0, PrinterControlCommand.ip == printer.ip)
                    ),
                    PrinterControlCommand.status == "pending",
                    PrinterControlCommand.command_type == "delete_scan_email_dest",
                )
            ).scalars().all()
            for cmd in pending:
                cmd.status = "superseded"
                cmd.error_message = "Máy photo đang bận xử lý một lệnh khác. Vui lòng thử lại sau."
                cmd.responded_at = requested_at

            # Resolve target_agent_uid (prioritize req_agent_uid passed from Frontend / UI)
            req_agent_uid = request.args.get("agent_uid", "").strip() or str(body.get("agent_uid", "")).strip()
            target_agent_uid = _resolve_target_agent_uid(session, printer, req_agent_uid, mac_address=printer_mac_value)

            frontend_ip = str(body.get("printer_ip") or body.get("ip") or "").strip()
            if frontend_ip == "0.0.0.0":
                frontend_ip = ""
            effective_ip = frontend_ip or (printer.ip if printer and printer.ip and printer.ip != "0.0.0.0" else "") or "0.0.0.0"
            printer_user_val = (str(body.get("auth_user") or "").strip()) or (printer.auth_user if printer and printer.auth_user else "admin")
            printer_pass_val = (str(body.get("auth_password") or "").strip()) or (printer.auth_password if printer and printer.auth_password else "")
            if not printer_user_val:
                printer_user_val = "admin"

            req_type = str(body.get("printer_type") or body.get("type") or body.get("brand") or "").lower()
            is_toshiba = False
            if req_type:
                is_toshiba = req_type == "toshiba"
            else:
                is_toshiba = (
                    (printer and (getattr(printer, 'printer_type', '') == 'toshiba' or 'toshiba' in (printer.printer_name or '').lower() or 'e-studio' in (printer.printer_name or '').lower())) or
                    'toshiba' in (printer.printer_name if printer else '').lower()
                )
            target_id_val = entry_id or (reg_no.split("-")[0] if "-" in reg_no else reg_no)

            is_xerox = False
            if req_type:
                is_xerox = req_type in ["fujifilm", "xerox"]
            else:
                is_xerox = (
                    (printer and (getattr(printer, 'printer_type', '') in ['fujifilm', 'xerox'] or 'fujifilm' in (printer.printer_name or '').lower() or 'xerox' in (printer.printer_name or '').lower())) or
                    'fujifilm' in (printer.printer_name if printer else '').lower() or 'xerox' in (printer.printer_name if printer else '').lower()
                )
            
            if is_toshiba:
                delete_cmd_name = "toshiba_delete_scan"
            elif is_xerox:
                delete_cmd_name = "xerox_delete_scan"
            else:
                delete_cmd_name = "ricoh_delete_scan"
                
            cmd_content = ""
            try:
                from models import UtiCommand
                with session_factory() as session:
                    cmd_entry = session.execute(
                        select(UtiCommand).where(UtiCommand.command == delete_cmd_name)
                    ).scalar_one_or_none()
                    if cmd_entry:
                        from utils import resolve_utility_command_content
                        cmd_content = resolve_utility_command_content(session, cmd_entry.command_content)
            except Exception as uc_err:
                LOGGER.warning("Error querying %s from database UtiCommand: %s", delete_cmd_name, uc_err)

            if cmd_content:
                cmd_content = cmd_content.replace("__TARGET_IP__", effective_ip).replace("__PRINTER_IP__", effective_ip)
                cmd_content = cmd_content.replace("__TARGET_USER__", printer_user_val).replace("__AUTH_USER__", printer_user_val)
                cmd_content = cmd_content.replace("__TARGET_PASS__", printer_pass_val).replace("__AUTH_PASS__", printer_pass_val)
                cmd_content = cmd_content.replace("__TARGET_ID__", target_id_val).replace("__ENTRY_ID__", target_id_val).replace("__REGISTRATION_NO__", target_id_val)

            command_type_val = "trigger_utility"
            command_params_val = _json.dumps({
                "action": "exec_utility",
                "command": delete_cmd_name,
                "command_content": cmd_content,
                "printer_ip": effective_ip,
                "ip": effective_ip,
                "auth_user": printer_user_val,
                "auth_password": printer_pass_val,
                "registration_no": reg_no,
                "entry_id": entry_id,
                "target_id": target_id_val,
                "mac_address": printer_mac_value,
                "printer_mac_id": printer_mac_value,
            })

            command = PrinterControlCommand(
                printer_id=printer.id,
                lead=printer.lead,
                lan_uid=printer.lan_uid,
                agent_uid=target_agent_uid,
                printer_name=printer.printer_name,
                ip=effective_ip,
                desired_enabled=printer.enabled,
                command_type=command_type_val,
                auth_user=printer.auth_user or "",
                auth_password=printer.auth_password or "",
                command_params=command_params_val,
                status="pending",
                error_message="",
                requested_at=requested_at,
                responded_at=None,
            )
            session.add(command)

            session.commit()
            command_id = int(command.id)

        return jsonify({
            "ok": True,
            "status": "pending",
            "command_id": command_id,
            "printer_id": printer_id_value,
            "mac_id": printer_mac_value,
        })

    @app.post("/api/devices/action")
    def api_device_action() -> Any:
        import json as _json
        body = request.get_json(silent=True) or {}
        ip = str(body.get("ip", "")).strip()
        action = str(body.get("action", "")).strip().lower()
        if not ip:
            return jsonify({"ok": False, "error": "Missing ip"}), 400
        if not action:
            return jsonify({"ok": False, "error": "Missing action"}), 400

        if action == "address_modify":
            registration_no = str(body.get("registration_no", "")).strip()
            name = str(body.get("name", "")).strip()
            email = str(body.get("email", "")).strip()
            folder = str(body.get("folder", "")).strip()
            user_code = str(body.get("user_code", "")).strip()
            fields = body.get("fields", {})

            if not registration_no:
                return jsonify({"ok": False, "error": "Missing registration_no"}), 400

            printer_id_val = body.get("printer_id") or body.get("id")
            requested_at = datetime.now(timezone.utc)
            with session_factory() as session:
                printer = _resolve_printer_control_target(session, ip, body=body)
                if printer is None:
                    return jsonify({"ok": False, "error": f"Printer with IP {ip} not found"}), 404

                printer_id_value = int(printer.id)
                printer_mac_value = _normalize_mac(printer.mac_address) or printer.mac_address or ""

                pending = session.execute(
                    select(PrinterControlCommand).where(
                        or_(
                            and_(printer.id != 0, PrinterControlCommand.printer_id == printer.id),
                            and_(printer.id == 0, PrinterControlCommand.printer_id == 0, PrinterControlCommand.ip == printer.ip)
                        ),
                        PrinterControlCommand.status == "pending",
                        PrinterControlCommand.command_type == "address_modify",
                    )
                ).scalars().all()
                for cmd in pending:
                    cmd.status = "superseded"
                    cmd.error_message = "Máy photo đang bận xử lý một lệnh khác. Vui lòng thử lại sau."
                    cmd.responded_at = requested_at

                req_agent_uid = request.args.get("agent_uid", "").strip() or body.get("agent_uid", "").strip()
                target_agent_uid = _resolve_target_agent_uid(session, printer, req_agent_uid)

                cmd_params_dict = {
                    "registration_no": registration_no,
                    "name": name,
                    "email": email,
                    "folder": folder,
                    "user_code": user_code,
                    "fields": fields,
                    "printer_ip": printer.ip or ip,
                    "ip": printer.ip or ip,
                    "mac_address": printer_mac_value,
                    "printer_mac_id": printer_mac_value,
                }

                command = PrinterControlCommand(
                    printer_id=printer.id,
                    lead=printer.lead,
                    lan_uid=printer.lan_uid,
                    agent_uid=target_agent_uid,
                    printer_name=printer.printer_name,
                    ip=printer.ip or ip,
                    desired_enabled=printer.enabled,
                    command_type="address_modify",
                    auth_user=printer.auth_user or "",
                    auth_password=printer.auth_password or "",
                    command_params=_json.dumps(cmd_params_dict),
                    status="pending",
                    error_message="",
                    requested_at=requested_at,
                    responded_at=None,
                )
                session.add(command)
                session.commit()
                command_id = int(command.id)

            return jsonify({
                "ok": True,
                "status": "pending",
                "command_id": command_id,
                "printer_id": printer_id_value,
                "mac_id": printer_mac_value,
            })

        return jsonify({"ok": False, "error": f"Unsupported action: {action}"}), 400

    @app.get("/api/commands/<int:command_id>/status")
    def get_command_status(command_id: int) -> Any:
        with session_factory() as session:
            cmd = session.get(PrinterControlCommand, command_id)
            if cmd is None:
                return jsonify({"ok": False, "error": "Command not found"}), 404
            
            now = datetime.now(timezone.utc)
            created_at = cmd.created_at
            if created_at and created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
                
            if cmd.status == "pending" and created_at and (now - created_at).total_seconds() > 180:
                cmd.status = "failed"
                cmd.error_message = "Timeout: Agent did not respond in 180 seconds"
                session.commit()

            if cmd.status == "success":
                address_book_sync = None
                if cmd.command_type in ("fetch_address_book", "add_scan_email_dest", "delete_scan_email_dest", "address_modify", "trigger_utility") and cmd.error_message:
                    try:
                        import json as _json
                        address_book_sync = _json.loads(cmd.error_message)
                    except Exception:
                        pass
                res_text = cmd.error_message or ""
                if isinstance(res_text, str) and res_text.startswith('"') and res_text.endswith('"'):
                    try:
                        import json as _json
                        decoded = _json.loads(res_text)
                        if isinstance(decoded, str):
                            res_text = decoded
                    except Exception:
                        pass
                return jsonify(
                    {
                        "ok": True,
                        "status": "success",
                        "command_id": command_id,
                        "id": int(cmd.printer_id),
                        "address_book_sync": address_book_sync,
                        "result_payload": res_text,
                        "created_at": cmd.created_at.isoformat() if cmd.created_at else None,
                        "received_at": cmd.received_at.isoformat() if cmd.received_at else None,
                        "responded_at": cmd.responded_at.isoformat() if cmd.responded_at else None,
                    }
                )
            if cmd.status == "failed":
                return (
                    jsonify(
                        {
                            "ok": False,
                            "status": "failed",
                            "command_id": command_id,
                            "error": cmd.error_message or "Command failed",
                            "created_at": cmd.created_at.isoformat() if cmd.created_at else None,
                            "received_at": cmd.received_at.isoformat() if cmd.received_at else None,
                            "responded_at": cmd.responded_at.isoformat() if cmd.responded_at else None,
                        }
                    ),
                    200,
                )
            return jsonify(
                {
                    "ok": True,
                    "status": "pending",
                    "command_id": command_id,
                    "created_at": cmd.created_at.isoformat() if cmd.created_at else None,
                    "received_at": cmd.received_at.isoformat() if cmd.received_at else None,
                    "progress_text": cmd.error_message or "",
                }
            )
