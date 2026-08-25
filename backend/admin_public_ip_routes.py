from __future__ import annotations

import logging
import ipaddress
from datetime import datetime, timezone
from typing import Any

from flask import Flask, jsonify, request
from sqlalchemy import select, func, or_

from models import AllowedPublicIp
from utils import _to_text

LOGGER = logging.getLogger(__name__)


def is_public_ip_allowed(client_ip: str, session_factory: Any) -> bool:
    """Helper to check if a given client_ip is allowed to access all LANs."""
    if not client_ip:
        return False
    client_ip = client_ip.strip()
    if client_ip in ("127.0.0.1", "localhost", "::1"):
        return True

    try:
        c_ip_obj = ipaddress.ip_address(client_ip)
    except ValueError:
        c_ip_obj = None

    try:
        with session_factory() as session:
            rows = session.execute(
                select(AllowedPublicIp).where(AllowedPublicIp.enabled == True)  # noqa: E712
            ).scalars().all()
            
            for row in rows:
                rule_str = (row.ip_address or "").strip()
                if not rule_str:
                    continue
                if rule_str == "*" or rule_str == client_ip:
                    return True
                if "/" in rule_str and c_ip_obj:
                    try:
                        net = ipaddress.ip_network(rule_str, strict=False)
                        if c_ip_obj in net:
                            return True
                    except ValueError:
                        pass
    except Exception as exc:
        LOGGER.warning("[is_public_ip_allowed] Error querying allowed_public_ips: %s", exc)
    return False


def register_admin_public_ip_routes(app: Flask, session_factory: Any) -> None:

    @app.get("/api/public-ips")
    def get_public_ips() -> Any:
        q = _to_text(request.args.get("q", "")).strip()
        status_val = _to_text(request.args.get("status", "all")).strip().lower()
        page = max(1, int(request.args.get("page", 1)))
        limit = min(200, max(1, int(request.args.get("limit", 50))))
        offset = (page - 1) * limit

        try:
            with session_factory() as session:
                stmt = select(AllowedPublicIp)
                count_stmt = select(func.count(AllowedPublicIp.id))

                filters = []
                if q:
                    filters.append(
                        or_(
                            AllowedPublicIp.ip_address.ilike(f"%{q}%"),
                            AllowedPublicIp.description.ilike(f"%{q}%"),
                        )
                    )
                if status_val in ("enabled", "active", "true"):
                    filters.append(AllowedPublicIp.enabled == True)  # noqa: E712
                elif status_val in ("disabled", "inactive", "false"):
                    filters.append(AllowedPublicIp.enabled == False)  # noqa: E712

                if filters:
                    stmt = stmt.where(*filters)
                    count_stmt = count_stmt.where(*filters)

                total = session.execute(count_stmt).scalar() or 0
                stmt = stmt.order_by(AllowedPublicIp.id.desc()).offset(offset).limit(limit)
                rows = session.execute(stmt).scalars().all()

                res = []
                for r in rows:
                    res.append({
                        "id": r.id,
                        "ip_address": r.ip_address,
                        "description": r.description or "",
                        "enabled": bool(r.enabled),
                        "created_at": r.created_at.isoformat() if r.created_at else "",
                        "updated_at": r.updated_at.isoformat() if r.updated_at else "",
                    })
                return jsonify({
                    "ok": True,
                    "public_ips": res,
                    "total": total,
                    "page": page,
                    "limit": limit
                })
        except Exception as exc:
            LOGGER.error("[get_public_ips] Error: %s", exc)
            return jsonify({"ok": False, "error": str(exc)}), 500

    @app.post("/api/public-ips")
    def create_public_ip() -> Any:
        body = request.get_json(silent=True) or {}
        ip_address = _to_text(body.get("ip_address")).strip()
        description = _to_text(body.get("description")).strip()
        enabled = bool(body.get("enabled", True))

        if not ip_address:
            return jsonify({"ok": False, "error": "Vui lòng nhập Public IP"}), 400

        # Validate IP address format (supports single IP, CIDR subnet, or *)
        if ip_address != "*":
            try:
                if "/" in ip_address:
                    ipaddress.ip_network(ip_address, strict=False)
                else:
                    ipaddress.ip_address(ip_address)
            except ValueError:
                return jsonify({"ok": False, "error": f"Định dạng IP không hợp lệ: {ip_address}"}), 400

        try:
            with session_factory() as session:
                existing = session.execute(
                    select(AllowedPublicIp).where(AllowedPublicIp.ip_address == ip_address)
                ).scalar_one_or_none()
                if existing:
                    return jsonify({"ok": False, "error": f"Public IP '{ip_address}' đã tồn tại"}), 400

                new_ip = AllowedPublicIp(
                    ip_address=ip_address,
                    description=description,
                    enabled=enabled,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                )
                session.add(new_ip)
                session.commit()
                return jsonify({"ok": True, "message": "Thêm Public IP thành công", "id": new_ip.id})
        except Exception as exc:
            LOGGER.error("[create_public_ip] Error: %s", exc)
            return jsonify({"ok": False, "error": str(exc)}), 500

    @app.put("/api/public-ips/<int:ip_id>")
    def update_public_ip(ip_id: int) -> Any:
        body = request.get_json(silent=True) or {}
        ip_address = _to_text(body.get("ip_address")).strip()
        description = _to_text(body.get("description")).strip()
        enabled = body.get("enabled")

        try:
            with session_factory() as session:
                rec = session.get(AllowedPublicIp, ip_id)
                if not rec:
                    return jsonify({"ok": False, "error": "Không tìm thấy Public IP"}), 404

                if ip_address and ip_address != rec.ip_address:
                    if ip_address != "*":
                        try:
                            if "/" in ip_address:
                                ipaddress.ip_network(ip_address, strict=False)
                            else:
                                ipaddress.ip_address(ip_address)
                        except ValueError:
                            return jsonify({"ok": False, "error": f"Định dạng IP không hợp lệ: {ip_address}"}), 400

                    dup = session.execute(
                        select(AllowedPublicIp).where(
                            AllowedPublicIp.ip_address == ip_address,
                            AllowedPublicIp.id != ip_id
                        )
                    ).scalar_one_or_none()
                    if dup:
                        return jsonify({"ok": False, "error": f"Public IP '{ip_address}' đã tồn tại"}), 400
                    rec.ip_address = ip_address

                if description is not None:
                    rec.description = description
                if enabled is not None:
                    rec.enabled = bool(enabled)

                rec.updated_at = datetime.now(timezone.utc)
                session.commit()
                return jsonify({"ok": True, "message": "Cập nhật Public IP thành công"})
        except Exception as exc:
            LOGGER.error("[update_public_ip] Error: %s", exc)
            return jsonify({"ok": False, "error": str(exc)}), 500

    @app.delete("/api/public-ips/<int:ip_id>")
    def delete_public_ip(ip_id: int) -> Any:
        try:
            with session_factory() as session:
                rec = session.get(AllowedPublicIp, ip_id)
                if not rec:
                    return jsonify({"ok": False, "error": "Không tìm thấy Public IP"}), 404

                session.delete(rec)
                session.commit()
                return jsonify({"ok": True, "message": "Xóa Public IP thành công"})
        except Exception as exc:
            LOGGER.error("[delete_public_ip] Error: %s", exc)
            return jsonify({"ok": False, "error": str(exc)}), 500

    @app.post("/api/public-ips/<int:ip_id>/toggle")
    def toggle_public_ip(ip_id: int) -> Any:
        try:
            with session_factory() as session:
                rec = session.get(AllowedPublicIp, ip_id)
                if not rec:
                    return jsonify({"ok": False, "error": "Không tìm thấy Public IP"}), 404

                rec.enabled = not rec.enabled
                rec.updated_at = datetime.now(timezone.utc)
                session.commit()
                return jsonify({"ok": True, "enabled": rec.enabled, "message": f"Đã {'bật' if rec.enabled else 'tắt'} Public IP"})
        except Exception as exc:
            LOGGER.error("[toggle_public_ip] Error: %s", exc)
            return jsonify({"ok": False, "error": str(exc)}), 500
