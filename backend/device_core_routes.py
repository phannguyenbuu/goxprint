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

    # 1c. Try querying PostgreSQL DeviceInfor table (LAN Scanned Devices)
    try:
        from models import DeviceInfor
        for ref in ref_list:
            if not ref:
                continue
            normalized_mac = _normalize_mac(ref)
            raw_ref = _to_text(ref).strip()
            dev_row = None
            if normalized_mac:
                dev_row = session.execute(
                    select(DeviceInfor)
                    .where(func.upper(DeviceInfor.mac_id) == normalized_mac)
                    .order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
                    .limit(1)
                ).scalars().first()
            if not dev_row and raw_ref and re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", raw_ref):
                dev_row = session.execute(
                    select(DeviceInfor)
                    .where(DeviceInfor.ip == raw_ref)
                    .order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
                    .limit(1)
                ).scalars().first()
            if dev_row:
                return Printer(
                    id=0,
                    mac_address=dev_row.mac_id or normalized_mac or "",
                    ip=dev_row.ip or "",
                    printer_name=dev_row.printer_name or "Photocopy",
                    agent_uid="",
                    lead=dev_row.lead or "default",
                    lan_uid=dev_row.lan_uid or "default",
                    enabled=True,
                    is_online=True,
                )
    except Exception as e:
        LOGGER.warning("Error looking up DeviceInfor for printer target: %s", e)

    # 2. Search in-memory NEW_LAN_SITES and ACTIVE_AGENTS RAM registries
    try:
        from active_agents_registry import NEW_LAN_SITES
        if isinstance(NEW_LAN_SITES, dict):
            for site in NEW_LAN_SITES.values():
                printers = site.get("printers", []) if isinstance(site, dict) else []
                for p_dict in printers:
                    if not isinstance(p_dict, dict):
                        continue
                    p_mac = _normalize_mac(p_dict.get("mac_address") or p_dict.get("mac_id") or "")
                    p_ip = str(p_dict.get("ip") or "").strip()
                    for ref in ref_list:
                        if not ref:
                            continue
                        n_ref = _normalize_mac(ref)
                        if (n_ref and p_mac and n_ref == p_mac) or (_to_text(ref).strip() == p_ip):
                            return Printer(
                                id=0,
                                mac_address=p_mac or n_ref or "",
                                ip=p_ip,
                                printer_name=p_dict.get("name") or p_dict.get("printer_name") or "Photocopy",
                                agent_uid=p_dict.get("agent_uid") or "",
                                lead=site.get("lead") or "default",
                                lan_uid=site.get("lan_uid") or "default",
                                enabled=True,
                                is_online=True,
                            )
    except Exception as e:
        LOGGER.warning("Error checking NEW_LAN_SITES for printer target: %s", e)

    try:
        from active_agents_registry import ACTIVE_AGENTS
        for a_uid, agent_info in ACTIVE_AGENTS.items():
            devices_map = agent_info.get("devices", {})
            printers_list = list(devices_map.values()) if isinstance(devices_map, dict) and devices_map else (agent_info.get("printers_json") or [])
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

    # 3. Dynamic Fallback: If device_ref or body contains a valid MAC or IP, construct virtual target!
    for ref in ref_list:
        if not ref:
            continue
        n_mac = _normalize_mac(ref)
        if n_mac:
            return Printer(
                id=0,
                mac_address=n_mac,
                ip=_to_text(body.get("ip") or body.get("printer_ip") if body else ""),
                printer_name=_to_text(body.get("model") or body.get("name") if body else "Photocopy"),
                agent_uid=_to_text(body.get("agent_uid") if body else ""),
                lead="default",
                lan_uid="default",
                enabled=True,
                is_online=True,
            )
        raw_ref = _to_text(ref).strip()
        if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", raw_ref):
            return Printer(
                id=0,
                mac_address=_normalize_mac(body.get("mac_address") or body.get("mac_id") if body else "") or "",
                ip=raw_ref,
                printer_name=_to_text(body.get("model") or body.get("name") if body else "Photocopy"),
                agent_uid=_to_text(body.get("agent_uid") if body else ""),
                lead="default",
                lan_uid="default",
                enabled=True,
                is_online=True,
            )

    return None

def _resolve_copier_auth(session, printer, body: dict = None) -> tuple[str, str]:
    from models import PrinterAuthCredential
    if body is None:
        body = {}
    mac = _normalize_mac(printer.mac_address if printer else (body.get("mac_address") or body.get("mac_id") or "")) or ""
    ip = (printer.ip if printer else (body.get("printer_ip") or body.get("ip") or "")).strip()

    cred = None
    if mac:
        cred = session.query(PrinterAuthCredential).filter(
            func.upper(PrinterAuthCredential.mac_address) == mac.upper()
        ).first()
    if not cred and ip and ip != "0.0.0.0":
        cred = session.query(PrinterAuthCredential).filter(
            PrinterAuthCredential.ip == ip
        ).first()

    if cred and cred.auth_user:
        return (cred.auth_user.strip(), (cred.auth_password or "").strip())

    if printer and printer.auth_user:
        return (printer.auth_user.strip(), (printer.auth_password or "").strip())

    user = str(body.get("auth_user") or body.get("user") or "admin").strip()
    pwd = str(body.get("auth_password") or body.get("password") or "").strip()
    return (user, pwd)


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

    target_public_ip = ""
    if printer:
        if hasattr(printer, 'public_ip') and getattr(printer, 'public_ip', None):
            target_public_ip = str(getattr(printer, 'public_ip')).strip()
        elif printer.lan_uid and str(printer.lan_uid).startswith("pub_"):
            target_public_ip = str(printer.lan_uid).replace("pub_", "").replace("_", ".")

    try:
        from models import AgentNode
        if target_public_ip:
            same_ip_agent = session.execute(
                select(AgentNode)
                .where(or_(AgentNode.public_ip == target_public_ip, AgentNode.wan_ip == target_public_ip))
                .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc())
            ).scalars().first()
            if same_ip_agent and same_ip_agent.agent_uid:
                return same_ip_agent.agent_uid

        if printer and printer.lan_uid:
            same_lan_agent = session.execute(
                select(AgentNode)
                .where(AgentNode.lan_uid == printer.lan_uid)
                .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc())
            ).scalars().first()
            if same_lan_agent and same_lan_agent.agent_uid:
                return same_lan_agent.agent_uid

    except Exception:
        pass

    return ""


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
            try:
                p_dict = _json.loads(command.command_params or '{}')
                if isinstance(p_dict, dict):
                    p_dict['command_id'] = command_id
                    p_dict['exec_uid'] = command_id
                    command.command_params = _json.dumps(p_dict, ensure_ascii=False)
                    session.commit()
            except Exception:
                pass

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
            printer_auth_user_val, printer_auth_pass_val = _resolve_copier_auth(session, printer, body)

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

            clean_mac_str = _normalize_mac(printer_mac_value or str(device_ref)).replace(":", "").upper()
            is_toshiba = (
                (printer and (getattr(printer, 'printer_type', '') == 'toshiba' or 'toshiba' in (printer.printer_name or '').lower() or 'e-studio' in (printer.printer_name or '').lower())) or
                'toshiba' in printer_name_val.lower() or
                'e-studio' in printer_name_val.lower() or
                str(body.get("printer_type", "")).lower() == "toshiba" or
                str(body.get("brand", "")).lower() == "toshiba" or
                str(body.get("type", "")).lower() == "toshiba" or
                clean_mac_str.startswith("008091")
            )
            list_cmd_name = "toshiba_list_scan" if is_toshiba else "ricoh_list_scan"
            cmd_content = ""
            try:
                from models import UtiCommand
                with session_factory() as session:
                    cmd_entry = session.execute(
                        select(UtiCommand).where(UtiCommand.command == list_cmd_name)
                    ).scalar_one_or_none()
                    if cmd_entry:
                        from utils import resolve_utility_command_content
                        cmd_content = resolve_utility_command_content(session, cmd_entry.command_content)
            except Exception as uc_err:
                LOGGER.warning("Error querying %s from database UtiCommand: %s", list_cmd_name, uc_err)

            if cmd_content:
                cmd_content = cmd_content.replace("__TARGET_IP__", printer_ip_val).replace("__PRINTER_IP__", printer_ip_val)
                cmd_content = cmd_content.replace("__TARGET_USER__", printer_auth_user_val).replace("__AUTH_USER__", printer_auth_user_val)
                cmd_content = cmd_content.replace("__TARGET_PASS__", printer_auth_pass_val).replace("__AUTH_PASS__", printer_auth_pass_val)

            command_type_val = "trigger_utility"
            command_params_val = _json.dumps({
                "action": "exec_utility",
                "command": list_cmd_name,
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
            try:
                p_dict = _json.loads(command.command_params or '{}')
                if isinstance(p_dict, dict):
                    p_dict['command_id'] = command_id
                    p_dict['exec_uid'] = command_id
                    command.command_params = _json.dumps(p_dict, ensure_ascii=False)
                    session.commit()
            except Exception:
                pass

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

        # 2. Save directly to PrinterAuthCredential dedicated table on VPS DB
        with session_factory() as session:
            printer = _resolve_printer_control_target(session, device_ref, body=body)
            p_id = int(printer.id) if printer else 0
            p_mac = _normalize_mac(printer.mac_address) if printer else clean_mac
            p_ip = target_ip or (printer.ip if printer else "")
            p_lead = printer.lead if printer else "default"
            p_lan = target_lan_uid or (printer.lan_uid if printer else "")

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

            import json as _json
            from utils import resolve_utility_command_content
            
            req_ptype_lower = (req_printer_type or "").lower()
            pname_lower = (printer.printer_name or "").lower() if printer else ""
            computed_printer_type = ""
            
            if "toshiba" in req_ptype_lower or "e-studio" in req_ptype_lower or "toshiba" in pname_lower or "e-studio" in pname_lower:
                computed_printer_type = "toshiba"
            elif "ricoh" in req_ptype_lower or "mp " in req_ptype_lower or "sp " in req_ptype_lower or "ricoh" in pname_lower or "mp " in pname_lower or "sp " in pname_lower or "im " in pname_lower or "imc" in pname_lower or "c200" in pname_lower:
                computed_printer_type = "ricoh"
            script = """import sys, os, time, socket, requests, ssl
urllib3 = requests.packages.urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"
MAC = "__TARGET_MAC__"
PRINTER_TYPE = "__TARGET_TYPE__"

if globals().get('context'):
    ctx = globals()['context']
    IP = str(ctx.get('printer_ip') or ctx.get('ip') or IP).strip()
    USER = str(ctx.get('auth_user') or USER).strip()
    PASSWORD = str(ctx.get('auth_password') or PASSWORD).strip()
    MAC = str(ctx.get('mac_address') or ctx.get('printer_mac_id') or MAC).strip().upper().replace("-", ":")
    PRINTER_TYPE = str(ctx.get('printer_type') or PRINTER_TYPE).strip()

# __TOSHIBA_LOGIN__

def verify_auth():
    test_success = False
    error_reason = "Failed to login with the provided credentials."
    
    if PRINTER_TYPE == "toshiba":
        try:
            local_ip = get_local_ip(IP)
            session = requests.Session()
            session.mount("https://", ToshibaSSLAdapter())
            origin = f"http://{IP}"
            landing = f"{origin}/?MAIN=TOPACCESS"
            cgi = f"{origin}/contentwebserver"
            session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; ToshibaTopAccessAgent/1.0)", "Accept": "*/*", "Cache-Control": "no-cache", "Pragma": "no-cache", "Referer": landing})
            session.cookies.set("pageTrack", "MAIN=TOPACCESS")
            try:
                session.get(landing, verify=False, timeout=8)
            except Exception as e:
                raise Exception(f"Không thể kết nối đến máy photo: {e}")
            csrf = session.cookies.get("Session") or ""
            if not csrf:
                raise Exception("Không lấy được Session cookie! Máy photo không phản hồi đúng chuẩn TopAccess.")
                
            headers = {"Content-Type": "text/plain; charset=utf-8", "csrfpId": csrf}
            login_xml = f"<?xml version='1.0' encoding='UTF-8'?><DeviceInformationModel><SetValue><Authentication><UserCredential><userName>{USER}</userName><passwd>{PASSWORD}</passwd><ipaddress>{local_ip}</ipaddress><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue><Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login></Command></DeviceInformationModel>"
            
            r = session.post(cgi, data=login_xml.encode("utf-8"), headers=headers, verify=False, timeout=8)
            if r.status_code == 200 and ("<LoginResult>Success</LoginResult>" in r.text or "STATUS_OK" in r.text):
                test_success = True
            else:
                error_reason = "Tài khoản hoặc mật khẩu quản trị viên (Admin) không đúng."
                
            try:
                session.post(cgi, data=\"\"\"<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><Command><Logout><commandNode>Authentication/UserCredential</commandNode></Logout></Command></DeviceInformationModel>\"\"\".encode("utf-8"), headers=headers, verify=False, timeout=3)
            except:
                pass
        except Exception as e:
            error_reason = f"Lỗi kết nối Toshiba: {str(e)}"
            
    elif PRINTER_TYPE == "ricoh":
        try:
            bridge_obj = globals().get('bridge') or locals().get('bridge')
            if bridge_obj and hasattr(bridge_obj, '_api_client'):
                from agent.modules.ricoh.service import RicohService
                ric_srv = RicohService(bridge_obj._api_client)
                
                from agent.services.api_client import Printer as AgentPrinter
                p = AgentPrinter(ip=IP, mac_address=MAC, name="RicohPrinter", printer_type="ricoh")
                sess = requests.Session()
                used_u, used_p = ric_srv._login(sess, p, credential_candidates=[(USER, PASSWORD)])
                if used_u == USER and used_p == PASSWORD:
                    test_success = True
                elif not USER and not PASSWORD:
                    test_success = True
                else:
                    error_reason = f"Tài khoản không đúng. (Máy photocopy đang dùng tài khoản: {used_u}/****)"
                try:
                    ric_srv._logout(sess, p)
                except:
                    pass
            else:
                error_reason = "Không tìm thấy service Ricoh trong môi trường Agent để xác thực"
        except Exception as e:
            error_reason = f"Lỗi kết nối Ricoh: {str(e)}"
            
    if not test_success:
        raise Exception(error_reason)
        
    # Cập nhật thông tin vào bộ nhớ Agent (printers.json) để có tác dụng ngay
    try:
        bridge_obj = globals().get('bridge') or locals().get('bridge')
        if bridge_obj:
            local_printers = bridge_obj._load_local_printers_json() or []
            updated = False
            for p_item in local_printers:
                p_item_mac = str(p_item.get("mac_address", "") or p_item.get("mac_id", "")).strip().upper().replace("-", ":")
                p_item_ip = str(p_item.get("ip", "")).strip()
                if (MAC and p_item_mac == MAC) or (IP and p_item_ip == IP):
                    p_item["auth_user"] = USER
                    p_item["auth_password"] = PASSWORD
                    updated = True
            if updated:
                bridge_obj._save_local_printers_json(local_printers)
    except:
        pass
        
    res_str = "Xác thực đăng nhập và lưu thành công."
    if globals().get('context'):
        globals()['context']['result_payload'] = res_str
    print(res_str)

verify_auth()
"""
            script = resolve_utility_command_content(session, script)
            script = script.replace("__TARGET_IP__", p_ip)
            script = script.replace("__TARGET_USER__", auth_user)
            script = script.replace("__TARGET_PASS__", auth_password)
            script = script.replace("__TARGET_MAC__", p_mac or clean_mac)
            script = script.replace("__TARGET_TYPE__", computed_printer_type)
            
            cmd = PrinterControlCommand(
                lead="default",
                lan_uid=target_lan_uid or (printer.lan_uid if printer else ""),
                agent_uid=target_agent_uid or (printer.agent_uid if printer else ""),
                printer_id=p_id,
                ip=p_ip,
                command_type="trigger_utility",
                desired_enabled=True,
                status="pending",
                auth_user=auth_user,
                auth_password=auth_password,
                command_params=_json.dumps({
                    "action": "exec_utility",
                    "command_content": script,
                    "mac_address": p_mac or clean_mac,
                    "printer_mac_id": p_mac or clean_mac,
                    "printer_ip": p_ip,
                    "printer_type": computed_printer_type,
                    "auth_user": auth_user,
                    "auth_password": auth_password,
                }),
                requested_at=datetime.now(timezone.utc),
            )
            session.add(cmd)
            session.commit()
            LOGGER.info("[device_update_credentials] Enqueued dynamic exec_python auth verify for command ID=%s for mac=%s auth_user=%s", cmd.id, p_mac, auth_user)

        return jsonify({"ok": True, "auth_user": auth_user, "ram_updated": ram_updated, "command_id": cmd.id})

    @app.get("/api/devices/credentials-map")
    def device_credentials_map() -> Any:
        """Returns a map of all saved copier login credentials keyed by MAC address and IP address."""
        from models import PrinterAuthCredential
        with session_factory() as session:
            creds = session.query(PrinterAuthCredential).all()
            res_map = {}
            for c in creds:
                mac = str(c.mac_address or "").strip().upper().replace("-", ":")
                ip = str(c.ip or "").strip()
                user = c.auth_user or ""
                pwd = c.auth_password or ""
                item = {
                    "user": user,
                    "password": pwd,
                    "auth_user": user,
                    "auth_password": pwd,
                    "ip": ip,
                    "mac_address": mac,
                    "updated_at": c.updated_at.isoformat() if c.updated_at else ""
                }
                if mac:
                    res_map[mac] = item
                    res_map[mac.replace(":", "")] = item
                    res_map[mac.replace(":", "-")] = item
                if ip:
                    res_map[ip] = item
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
            printer_ip_val = (printer.ip if printer and printer.ip and printer.ip != "0.0.0.0" else "") or frontend_ip or "0.0.0.0"
            printer_enabled_val = printer.enabled if printer else True
            printer_auth_user_val, printer_auth_pass_val = _resolve_copier_auth(session, printer, body)

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

            is_toshiba = (
                (printer and (getattr(printer, 'printer_type', '') == 'toshiba' or 'toshiba' in (printer.printer_name or '').lower() or 'e-studio' in (printer.printer_name or '').lower())) or
                'toshiba' in printer_name_val.lower() or
                'e-studio' in printer_name_val.lower() or
                str(body.get("printer_type", "")).lower() == "toshiba" or
                str(body.get("type", "")).lower() == "toshiba" or
                str(body.get("brand", "")).lower() == "toshiba"
            )
            create_cmd_name = "toshiba_create_scan" if is_toshiba else "ricoh_create_scan"
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
            try:
                p_dict = _json.loads(command.command_params or '{}')
                if isinstance(p_dict, dict):
                    p_dict['command_id'] = command_id
                    p_dict['exec_uid'] = command_id
                    command.command_params = _json.dumps(p_dict, ensure_ascii=False)
                    session.commit()
            except Exception:
                pass

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
            effective_ip = (printer.ip if printer and printer.ip and printer.ip != "0.0.0.0" else "") or frontend_ip or "0.0.0.0"
            printer_user_val, printer_pass_val = _resolve_copier_auth(session, printer, body)

            is_toshiba = (
                (printer and (getattr(printer, 'printer_type', '') == 'toshiba' or 'toshiba' in (printer.printer_name or '').lower() or 'e-studio' in (printer.printer_name or '').lower())) or
                'toshiba' in (printer.printer_name if printer else '').lower() or
                "toshiba" in str(body.get("printer_type", "")).lower() or "e-studio" in str(body.get("printer_type", "")).lower() or
                "toshiba" in str(body.get("type", "")).lower() or "e-studio" in str(body.get("type", "")).lower() or
                "toshiba" in str(body.get("brand", "")).lower() or "e-studio" in str(body.get("brand", "")).lower()
            )
            target_id_val = entry_id or (reg_no.split("-")[0] if "-" in reg_no else reg_no)

            delete_cmd_name = "toshiba_delete_scan" if is_toshiba else "ricoh_delete_scan"
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
            try:
                p_dict = _json.loads(command.command_params or '{}')
                if isinstance(p_dict, dict):
                    p_dict['command_id'] = command_id
                    p_dict['exec_uid'] = command_id
                    command.command_params = _json.dumps(p_dict, ensure_ascii=False)
                    session.commit()
            except Exception:
                pass

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

                del_user, del_pass = _resolve_copier_auth(session, printer, body)
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
                    "auth_user": del_user,
                    "auth_password": del_pass,
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
                    auth_user=del_user,
                    auth_password=del_pass,
                    command_params=_json.dumps(cmd_params_dict),
                    status="pending",
                    error_message="",
                    requested_at=requested_at,
                    responded_at=None,
                )
                session.add(command)
                session.commit()
                command_id = int(command.id)
                try:
                    p_dict = _json.loads(command.command_params or '{}')
                    if isinstance(p_dict, dict):
                        p_dict['command_id'] = command_id
                        p_dict['exec_uid'] = command_id
                        command.command_params = _json.dumps(p_dict, ensure_ascii=False)
                        session.commit()
                except Exception:
                    pass

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
        try:
            with session_factory() as session:
                cmd = session.get(PrinterControlCommand, command_id)
                if cmd is None:
                    return jsonify({
                        "ok": False,
                        "status": "failed",
                        "error": "Lệnh không tồn tại hoặc đã bị xóa khỏi hệ thống",
                        "error_message": "Lệnh không tồn tại hoặc đã bị xóa khỏi hệ thống"
                    }), 200
                
                now = datetime.now(timezone.utc)
                created_at = cmd.created_at
                if created_at and created_at.tzinfo is None:
                    created_at = created_at.replace(tzinfo=timezone.utc)
                    
                if cmd.status in ("pending", "processing") and created_at and (now - created_at).total_seconds() > 60:
                    cmd.status = "failed"
                    cmd.error_message = "Lỗi: Agent quá thời gian phản hồi (Timeout 60s)"
                    session.commit()

                cmd_status = cmd.status
                cmd_printer_id = int(cmd.printer_id or 0)
                cmd_command_type = cmd.command_type
                cmd_error_msg = cmd.error_message or ""
                cmd_created_at = cmd.created_at.isoformat() if cmd.created_at else None
                cmd_received_at = cmd.received_at.isoformat() if cmd.received_at else None
                cmd_responded_at = cmd.responded_at.isoformat() if cmd.responded_at else None
                res_text = cmd.__dict__.get("output") or cmd.__dict__.get("result_payload") or cmd_error_msg or ""

                if cmd_status == "success":
                    address_book_sync = None
                    if cmd_command_type in ("fetch_address_book", "add_scan_email_dest", "delete_scan_email_dest", "address_modify", "trigger_utility") and cmd_error_msg:
                        msg_str = str(cmd_error_msg)
                        if "__ADDRESS_BOOK_JSON_START__" in msg_str:
                            try:
                                import json as _json
                                part = msg_str.split("__ADDRESS_BOOK_JSON_START__")[1].split("__ADDRESS_BOOK_JSON_END__")[0].strip()
                                address_book_sync = _json.loads(part)
                            except Exception:
                                pass
                        if not address_book_sync:
                            try:
                                import json as _json, re
                                m = re.search(r'(\{[\s\S]*"address_list"[\s\S]*\})', msg_str)
                                if m:
                                    address_book_sync = _json.loads(m.group(1))
                            except Exception:
                                pass
                        if not address_book_sync:
                            try:
                                import json as _json
                                address_book_sync = _json.loads(msg_str)
                            except Exception:
                                pass
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
                            "id": cmd_printer_id,
                            "address_book_sync": address_book_sync,
                            "result_payload": res_text,
                            "output": res_text,
                            "error_message": cmd_error_msg,
                            "created_at": cmd_created_at,
                            "received_at": cmd_received_at,
                            "responded_at": cmd_responded_at,
                        }
                    )
                if cmd_status == "failed":
                    return (
                        jsonify(
                            {
                                "ok": False,
                                "status": "failed",
                                "command_id": command_id,
                                "error": cmd_error_msg or "Command failed",
                                "output": res_text,
                                "created_at": cmd_created_at,
                                "received_at": cmd_received_at,
                                "responded_at": cmd_responded_at,
                            }
                        ),
                        200,
                    )
                return jsonify(
                    {
                        "ok": True,
                        "status": cmd_status,
                        "command_id": command_id,
                        "output": res_text,
                        "created_at": cmd_created_at,
                        "received_at": cmd_received_at,
                        "progress_text": cmd_error_msg,
                    }
                )
        except Exception as exc:
            LOGGER.error("[GET /api/commands/%s/status ERROR] %s", command_id, exc, exc_info=True)
            return jsonify({
                "ok": False,
                "status": "failed",
                "error": str(exc),
                "error_message": str(exc)
            }), 200
