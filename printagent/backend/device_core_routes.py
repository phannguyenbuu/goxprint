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

        # Extract embedded IP addresses
        for ip in re.findall(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", ref_str):
            if ip not in ref_list:
                ref_list.append(ip)

    # 1. Try querying PostgreSQL database first
    for ref in ref_list:
        if not ref:
            continue
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
        raw_ref = _to_text(ref).strip()
        if raw_ref.isdigit():
            p = session.get(Printer, int(raw_ref))
            if p:
                return p
        if raw_ref:
            if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", raw_ref):
                p = (
                    session.execute(
                        select(Printer)
                        .where(Printer.ip == raw_ref)
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
                    raw = _to_text(ref).strip()
                    if raw and (raw == p_ip or raw == p_name):
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
            printer_lan_val = active_agent.lan_uid if active_agent else (printer.lan_uid if printer else device_ref)
            printer_name_val = printer.printer_name if printer else str(body.get("printer_name") or "Photocopy")
            frontend_ip = str(body.get("printer_ip") or body.get("ip") or "").strip()
            printer_ip_val = frontend_ip or (printer.ip if printer else "0.0.0.0")
            printer_enabled_val = printer.enabled if printer else True
            printer_auth_user_val = (printer.auth_user if printer else str(body.get("auth_user") or "")) or ""
            printer_auth_pass_val = (printer.auth_password if printer else str(body.get("auth_password") or "")) or ""

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

            command = PrinterControlCommand(
                printer_id=printer_id_value,
                lead=printer_lead_val,
                lan_uid=printer_lan_val,
                agent_uid=target_agent_uid,
                printer_name=printer_name_val,
                ip=printer_ip_val,
                desired_enabled=printer_enabled_val,
                command_type="fetch_address_book",
                auth_user=printer_auth_user_val,
                auth_password=printer_auth_pass_val,
                command_params=_json.dumps({
                    "printer_ip": printer_ip_val,
                    "ip": printer_ip_val,
                    "mac_address": printer_mac_value,
                    "printer_mac_id": printer_mac_value,
                }),
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

        clean_mac = _normalize_mac(device_ref) or _normalize_mac(_to_text(body.get("mac_address") or body.get("mac_id")))
        ref_text = _to_text(device_ref).strip()

        # 1. Update in-memory ACTIVE_AGENTS printers_json
        from active_agents_registry import ACTIVE_AGENTS
        ram_updated = False
        target_lan_uid = ""
        target_agent_uid = request.args.get("agent_uid", "").strip() or body.get("agent_uid", "").strip()
        target_ip = ""
        
        for agent_uid, agent_info in ACTIVE_AGENTS.items():
            if not target_lan_uid:
                target_lan_uid = agent_info.get("lan_uid") or ""
            if not target_agent_uid:
                target_agent_uid = agent_uid
            printers_list = agent_info.get("printers_json") or []
            for dev in printers_list:
                if isinstance(dev, dict):
                    dev_mac = _normalize_mac(_to_text(dev.get("mac_address") or dev.get("mac_id")))
                    dev_ip = _to_text(dev.get("ip") or dev.get("printer_ip"))
                    dev_id = str(dev.get("id", ""))
                    
                    if (clean_mac and dev_mac == clean_mac) or (ref_text and (ref_text in {dev_id, dev_ip, dev_mac})):
                        target_lan_uid = agent_info.get("lan_uid") or target_lan_uid
                        target_agent_uid = agent_uid
                        target_ip = dev_ip
                        break
            if target_ip:
                break

        if not target_agent_uid and ACTIVE_AGENTS:
            target_agent_uid = list(ACTIVE_AGENTS.keys())[0]

        # 2. Enqueue command for active agent to save auth directly to local printers.json disk file
        with session_factory() as session:
            printer = _resolve_printer_control_target(session, device_ref, body=body)
            p_id = int(printer.id) if printer else 0
            p_mac = _normalize_mac(printer.mac_address) if printer else clean_mac
            
            if printer:
                # Không lưu auth_user/auth_password vào DB ngay lập tức
                # Sẽ cập nhật ở route trả kết quả command sau khi Agent login thử thành công
                pass

            import json as _json
            cmd = PrinterControlCommand(
                lead="default",
                lan_uid=target_lan_uid or (printer.lan_uid if printer else ""),
                agent_uid=target_agent_uid or (printer.agent_uid if printer else ""),
                printer_id=p_id,
                ip=target_ip or (printer.ip if printer else ""),
                command_type="save_printer_auth",
                desired_enabled=True,
                status="pending",
                auth_user=auth_user,
                auth_password=auth_password,
                command_params=_json.dumps({
                    "mac_address": p_mac or clean_mac,
                    "printer_mac_id": p_mac or clean_mac,
                    "printer_ip": target_ip or (printer.ip if printer else ""),
                    "auth_user": auth_user,
                    "auth_password": auth_password,
                }),
                requested_at=datetime.now(timezone.utc),
            )
            session.add(cmd)
            session.commit()
            LOGGER.info("[device_update_credentials] Enqueued save_printer_auth command ID=%s for mac=%s auth_user=%s", cmd.id, p_mac, auth_user)

        return jsonify({"ok": True, "auth_user": auth_user, "ram_updated": ram_updated, "command_id": cmd.id})

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
            printer_ip_val = frontend_ip or (printer.ip if printer else "0.0.0.0")
            printer_enabled_val = printer.enabled if printer else True
            printer_auth_user_val = (printer.auth_user if printer else str(body.get("auth_user") or "")) or ""
            printer_auth_pass_val = (printer.auth_password if printer else str(body.get("auth_password") or "")) or ""

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

            command = PrinterControlCommand(
                printer_id=printer_id_value,
                lead=printer_lead_val,
                lan_uid=printer_lan_val,
                agent_uid=target_agent_uid,
                printer_name=printer_name_val,
                ip=printer_ip_val,
                desired_enabled=printer_enabled_val,
                command_type="add_scan_email_dest",
                auth_user=printer_auth_user_val,
                auth_password=printer_auth_pass_val,
                command_params=_json.dumps({
                    "email": email,
                    "name": name,
                    "printer_ip": printer_ip_val,
                    "ip": printer_ip_val,
                    "mac_address": printer_mac_value,
                    "printer_mac_id": printer_mac_value,
                }),
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
            effective_ip = frontend_ip or (printer.ip if printer else "")

            command = PrinterControlCommand(
                printer_id=printer.id,
                lead=printer.lead,
                lan_uid=printer.lan_uid,
                agent_uid=target_agent_uid,
                printer_name=printer.printer_name,
                ip=effective_ip,
                desired_enabled=printer.enabled,
                command_type="delete_scan_email_dest",
                auth_user=printer.auth_user or "",
                auth_password=printer.auth_password or "",
                command_params=_json.dumps({
                    "registration_no": reg_no,
                    "entry_id": entry_id,
                    "printer_ip": effective_ip,
                    "ip": effective_ip,
                    "mac_address": printer_mac_value,
                    "printer_mac_id": printer_mac_value,
                }),
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
                if cmd.command_type in ("fetch_address_book", "add_scan_email_dest", "delete_scan_email_dest", "address_modify") and cmd.error_message:
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
