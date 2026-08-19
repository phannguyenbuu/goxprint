from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from flask import Flask, jsonify, request
from sqlalchemy import select, or_, and_

from utils import _to_text
from app_helpers import _serialize_audit_payload_iso
from serializers import (
    _refresh_stale_offline,
)
from models import Printer, PrinterEnableLog, PrinterOnlineLog, PrinterControlCommand
from device_core_routes import _resolve_printer_control_target

LOGGER = logging.getLogger(__name__)


def register_device_detail_routes(app: Flask, session_factory: Any) -> None:

    @app.get("/api/devices/<int:printer_id>/events")
    def device_events(printer_id: int) -> Any:
        with session_factory() as session:
            printer = session.get(Printer, printer_id)
            if printer is None:
                return jsonify({"ok": False, "error": "Printer not found"}), 404
            _refresh_stale_offline(
                session=session,
                lead=printer.lead,
                lan_uid=printer.lan_uid,
                agent_uid=printer.agent_uid,
            )
            session.commit()
            printer = session.get(Printer, printer_id)
            logs = session.execute(
                select(PrinterEnableLog)
                .where(PrinterEnableLog.printer_id == printer_id)
                .order_by(PrinterEnableLog.changed_at.desc(), PrinterEnableLog.id.desc())
            ).scalars().all()
            online_logs = session.execute(
                select(PrinterOnlineLog)
                .where(PrinterOnlineLog.printer_id == printer_id)
                .order_by(PrinterOnlineLog.changed_at.desc(), PrinterOnlineLog.id.desc())
            ).scalars().all()
        events: list[dict[str, Any]] = []
        events.extend(
            {
                "id": f"enable-{int(e.id)}",
                "kind": "enable",
                "value": "Enabled" if bool(e.enabled) else "Disabled",
                "changed_at": e.changed_at.isoformat() if e.changed_at else "",
                **_serialize_audit_payload_iso(e.created_at, e.updated_at),
            }
            for e in logs
        )
        events.extend(
            {
                "id": f"online-{int(e.id)}",
                "kind": "online",
                "value": "Online" if bool(e.is_online) else "Offline",
                "changed_at": e.changed_at.isoformat() if e.changed_at else "",
                **_serialize_audit_payload_iso(e.created_at, e.updated_at),
            }
            for e in online_logs
        )
        events.sort(key=lambda x: str(x.get("changed_at", "")), reverse=True)
        return jsonify(
            {
                "printer": {
                    "id": int(printer.id),
                    "lead": printer.lead,
                    "lan_uid": printer.lan_uid,
                    "mac_id": printer.mac_address or "",
                    "agent_uid": printer.agent_uid,
                    "printer_name": printer.printer_name,
                    "ip": printer.ip,
                    "enabled": bool(printer.enabled),
                    "enabled_changed_at": printer.enabled_changed_at.isoformat() if printer.enabled_changed_at else "",
                    "is_online": bool(printer.is_online),
                    "online_changed_at": printer.online_changed_at.isoformat() if printer.online_changed_at else "",
                    "last_seen_at": printer.updated_at.isoformat() if printer.updated_at else "",
                    "auth_user": printer.auth_user or "",
                    "auth_password": printer.auth_password or "",
                    "address_book_sync": printer.address_book_sync,
                    **_serialize_audit_payload_iso(printer.created_at, printer.updated_at),
                },
                "events": events,
            }
        )

    @app.post("/api/devices/install-driver")
    def device_install_driver_general() -> Any:
        return _handle_device_install_driver(device_ref="")

    @app.post("/api/devices/<path:device_ref>/install-driver")
    def device_install_driver_by_ref(device_ref: str = "") -> Any:
        return _handle_device_install_driver(device_ref=device_ref)

    def _handle_device_install_driver(device_ref: str = "") -> Any:
        body = request.get_json(silent=True) or {}
        brand = str(body.get("brand", "")).strip()
        model = str(body.get("model", "")).strip()
        driver_name = str(body.get("driver_name", "")).strip()
        driver_url = str(body.get("driver_url", "")).strip()
        target_agent_uid = str(body.get("agent_uid", "")).strip()

        if not brand or not model or not driver_name or not driver_url:
            return jsonify({"ok": False, "error": "brand, model, driver_name, and driver_url are required"}), 200

        driver_url_combined = driver_url

        requested_at = datetime.now(timezone.utc)
        with session_factory() as session:
            printer = _resolve_printer_control_target(session, device_ref, body)
            if printer is None:
                return jsonify({"ok": False, "error": f"Printer not found for reference '{device_ref}'"}), 200

            pending = session.execute(
                select(PrinterControlCommand).where(
                    or_(
                        and_(printer.id != 0, PrinterControlCommand.printer_id == printer.id),
                        and_(printer.id == 0, PrinterControlCommand.printer_id == 0, PrinterControlCommand.ip == printer.ip)
                    ),
                    PrinterControlCommand.status == "pending",
                    PrinterControlCommand.command_type == "install_driver",
                )
            ).scalars().all()
            for cmd in pending:
                cmd.status = "superseded"
                cmd.error_message = "Máy photo đang bận xử lý một lệnh khác. Vui lòng thử lại sau."
                cmd.responded_at = requested_at

            from models import AgentNode
            resolved_agent_uid = target_agent_uid or printer.agent_uid
            active_agent = None
            if resolved_agent_uid:
                active_agent = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == resolved_agent_uid)
                    .order_by(AgentNode.last_seen_at.desc())
                ).scalars().first()
            active_lan_uid = active_agent.lan_uid if active_agent else printer.lan_uid

            command = PrinterControlCommand(
                printer_id=printer.id,
                lead=printer.lead,
                lan_uid=active_lan_uid,
                agent_uid=resolved_agent_uid,
                printer_name=printer.printer_name,
                ip=printer.ip,
                desired_enabled=printer.enabled,
                command_type="install_driver",
                driver_brand=brand,
                driver_model=model,
                driver_name=driver_name,
                driver_url=driver_url_combined,
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

        return jsonify({
            "ok": True,
            "status": "pending",
            "message": "Driver installation command queued.",
            "command_id": command_id,
        }), 202

    @app.get("/api/commands/<int:command_id>/status")
    @app.get("/api/commands/<int:command_id>")
    def get_printer_command_status(command_id: int) -> Any:
        """Poll the status of a PrinterControlCommand by ID."""
        with session_factory() as session:
            command = session.get(PrinterControlCommand, command_id)
            if command is None:
                return jsonify({"ok": False, "error": "Command not found"}), 404
            
            status = command.status
            output_val = command.error_message or ""
            progress_text = ""
            
            if command.command_params:
                try:
                    import json as _json
                    params = _json.loads(command.command_params)
                    child_ids = params.get("child_command_ids")
                    if child_ids and isinstance(child_ids, list) and status == "pending":
                        from models import PrinterControlCommand as PCCommand
                        from sqlalchemy import select
                        child_cmds = session.execute(
                            select(PCCommand).where(PCCommand.id.in_(child_ids))
                        ).scalars().all()
                        
                        total = len(child_ids)
                        done = sum(1 for c in child_cmds if c.status not in ("pending", "processing", "received"))
                        
                        if done < total:
                            progress_text = f"Đang xử lý ({done}/{total}) lệnh..."
                            details = []
                            for c in child_cmds:
                                status_desc = "Chờ xử lý" if c.status == "pending" else "Đang chạy" if c.status in ("processing", "received") else "Thành công" if c.status == "success" else f"Thất bại ({c.error_message or 'Lỗi'})"
                                details.append(f"- {c.printer_name or c.ip} ({c.ip}): {status_desc}")
                            output_val = (command.error_message or "") + "\n\n⌛ Tiến độ chi tiết:\n" + "\n".join(details)
                        else:
                            status = "success"
                            details = []
                            for c in child_cmds:
                                status_label = "Thành công" if c.status == "success" else f"Thất bại ({c.error_message or 'Lỗi'})"
                                details.append(f"- {c.printer_name or c.ip} ({c.ip}): {status_label}")
                            
                            output_val = (command.error_message or "") + "\n\n✅ Đã hoàn tất tất cả các lệnh! Chi tiết:\n" + "\n".join(details)
                            command.status = "success"
                            command.error_message = output_val
                            from datetime import datetime, timezone
                            command.responded_at = datetime.now(timezone.utc)
                            session.commit()
                except Exception as parse_err:
                    import logging
                    logging.getLogger("printagent").warning("Failed to check child command status for parent command %s: %s", command_id, parse_err)

            addr_sync = None
            if command.printer_id:
                try:
                    printer_item = session.get(Printer, int(command.printer_id))
                    if printer_item and printer_item.address_book_sync:
                        addr_sync = printer_item.address_book_sync
                except Exception:
                    pass

            if not addr_sync and output_val:
                if isinstance(output_val, str) and ("address_list" in output_val or output_val.strip().startswith("{")):
                    try:
                        import json as _json
                        parsed_json = _json.loads(output_val)
                        if isinstance(parsed_json, dict) and "address_list" in parsed_json:
                            addr_sync = parsed_json
                    except Exception:
                        pass

            return jsonify({
                "ok": True,
                "id": command_id,
                "status": status,
                "command_type": command.command_type,
                "error": output_val if status == "failed" else "",
                "error_message": output_val if status == "failed" else "",
                "result": output_val,
                "output": output_val,
                "result_payload": output_val,
                "data": output_val,
                "message": output_val,
                "address_book_sync": addr_sync,
                "received_at": command.received_at.isoformat() if command.received_at else None,
                "responded_at": command.responded_at.isoformat() if command.responded_at else None,
                "progress_text": progress_text if status == "pending" else "",
            })
