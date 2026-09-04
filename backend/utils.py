from __future__ import annotations

import hashlib
import json
import logging
import os
import re
from datetime import datetime, timedelta, timezone, date
from pathlib import Path
from typing import Any

from flask import request
from werkzeug.utils import secure_filename
from sqlalchemy import func

LOGGER = logging.getLogger(__name__)
UI_TZ = timezone(timedelta(hours=7))
MAC_PATTERN = re.compile(r"^[0-9A-F]{2}(:[0-9A-F]{2}){5}$")
LAST_DATA_FILE = Path("storage/data/last_data.json")

COUNTER_KEYS = [
    "total",
    "copier_bw",
    "printer_bw",
    "fax_bw",
    "send_tx_total_bw",
    "send_tx_total_color",
    "fax_transmission_total",
    "scanner_send_bw",
    "scanner_send_color",
    "coverage_copier_bw",
    "coverage_printer_bw",
    "coverage_fax_bw",
    "a3_dlt",
    "duplex",
]

def _to_int(value: Any) -> int | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    try:
        return int(text)
    except Exception:  # noqa: BLE001
        return None


def _to_text(value: Any) -> str:
    return str(value or "").strip()


def _to_text_max(value: Any, max_len: int) -> str:
    text = _to_text(value)
    if max_len <= 0:
        return ""
    if len(text) <= max_len:
        return text
    return text[:max_len]


SYSTEM_SETTINGS_FILE = Path("storage/system_settings.json")


def get_system_settings() -> dict[str, Any]:
    default_settings = {
        "scan_point_retention_days": 30,
        "control_interval_seconds": 1,
        "device_interval_seconds": 60,
        "ui_refresh_interval_seconds": 5,
        "crm_webhook_url": "",
    }
    try:
        if SYSTEM_SETTINGS_FILE.exists():
            with open(SYSTEM_SETTINGS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    default_settings.update(data)
    except Exception as err:
        logging.getLogger(__name__).warning("Failed to read system settings: %s", err)
    return default_settings


def save_system_settings(new_settings: dict[str, Any]) -> dict[str, Any]:
    current = get_system_settings()
    for k in ["scan_point_retention_days", "control_interval_seconds", "device_interval_seconds", "ui_refresh_interval_seconds"]:
        if k in new_settings:
            try:
                val = int(new_settings[k])
                if val > 0:
                    current[k] = val
            except (ValueError, TypeError):
                pass
    if "crm_webhook_url" in new_settings:
        current["crm_webhook_url"] = str(new_settings["crm_webhook_url"] or "").strip()

    try:
        SYSTEM_SETTINGS_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(SYSTEM_SETTINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(current, f, indent=2)
    except Exception as err:
        logging.getLogger(__name__).error("Failed to write system settings: %s", err)
    return current


def _to_json_value(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, (dict, list, bool, int, float)):
        return value
    text = _to_text(value)
    return text if text else None


def _normalize_status_payload(payload: dict[str, Any]) -> dict[str, str]:
    out: dict[str, str] = {}
    for key, value in payload.items():
        k = _to_text(key)
        if not k:
            continue
        out[k] = _to_text(value)
    return out


def _normalize_mac(value: Any) -> str:
    text = _to_text(value).upper()
    if not text:
        return ""
    compact = re.sub(r"[^0-9A-F]", "", text)
    if len(compact) == 12 and all(ch in "0123456789ABCDEF" for ch in compact):
        text = ":".join(compact[i:i + 2] for i in range(0, 12, 2))
    else:
        text = text.replace("-", ":")
    if MAC_PATTERN.fullmatch(text):
        if text == "00:00:00:00:00:00":
            return ""
        return text
    return ""


def _safe_path_token(value: str) -> str:
    text = _to_text(value)
    if not text:
        return "unknown"
    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", text):
        return base64.urlsafe_b64encode(text.encode("utf-8")).decode("utf-8").rstrip("=")
    m = re.match(r"^pub_(\d{1,3})_(\d{1,3})_(\d{1,3})_(\d{1,3})$", text)
    if m:
        raw_ip = f"{m.group(1)}.{m.group(2)}.{m.group(3)}.{m.group(4)}"
        return base64.urlsafe_b64encode(raw_ip.encode("utf-8")).decode("utf-8").rstrip("=")
    import unicodedata
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    cleaned = re.sub(r'[^a-zA-Z0-9._@-]', '-', text)
    cleaned = cleaned.strip(" -_.")
    return cleaned or "unknown"


def _safe_relative_path_parts(value: Any) -> list[str]:
    text = _to_text(value).replace("\\", "/")
    if not text:
        return []
    parts: list[str] = []
    for part in text.split("/"):
        token = part.strip()
        if not token or token in {".", ".."}:
            continue
        cleaned = secure_filename(token)
        if cleaned:
            parts.append(cleaned)
    return parts


def _normalize_ipv4(value: str) -> str:
    text = _to_text(value)
    parts = text.split(".")
    if len(parts) != 4:
        return ""
    try:
        nums = [int(p) for p in parts]
    except Exception:  # noqa: BLE001
        return ""
    if any(n < 0 or n > 255 for n in nums):
        return ""
    return ".".join(str(n) for n in nums)


def _sanitize_lan_token(value: Any) -> str:
    text = _to_text(value)
    if not text:
        return ""
    text = text.replace("-", "_").replace(":", "_").replace(".", "_")
    text = re.sub(r"[^A-Za-z0-9_]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")
    return text


def _compose_lan_uid(lead: Any, gateway_mac: Any, gateway_ip: Any) -> str:
    lead_token = _sanitize_lan_token(lead)
    mac_token = _sanitize_lan_token(_normalize_mac(gateway_mac))
    ip_token = _sanitize_lan_token(_normalize_ipv4(gateway_ip))
    if lead_token and mac_token and ip_token:
        return f"{lead_token}_{mac_token}_{ip_token}"
    return ""


def _parse_timestamp(value: Any) -> datetime:
    text = _to_text(value)
    if not text:
        return datetime.now(timezone.utc)
    normalized = text.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(normalized)
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:  # noqa: BLE001
        return datetime.now(timezone.utc)


def _write_last_data(payload: dict[str, Any]) -> None:
    try:
        LAST_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        LAST_DATA_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    except Exception as exc:  # noqa: BLE001
        LOGGER.warning("last_data write failed: %s", exc)


def _parse_query_datetime(value: Any, end_of_minute: bool = False) -> datetime | None:
    text = _to_text(value)
    if not text:
        return None
    normalized = text.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(normalized)
    except Exception:  # noqa: BLE001
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=UI_TZ)
    if end_of_minute and len(text) <= 16:
        dt = dt.replace(second=59, microsecond=999999)
    return dt.astimezone(timezone.utc)


def _resolve_lan_info_from_body(body: dict[str, Any]) -> tuple[str, str]:
    """
    Returns (lan_uid, fingerprint_signature)
    """
    raw_lan_uid = _to_text(body.get("lan_uid"))
    fingerprint = _to_text(body.get("fingerprint_signature") or body.get("fingerprint"))

    lead = _to_text(body.get("lead"))
    local_ip = _normalize_ipv4(_to_text(body.get("local_ip")))
    gateway_ip = _normalize_ipv4(_to_text(body.get("gateway_ip")))
    gateway_mac = _to_text(body.get("gateway_mac")).replace("-", ":").upper()
    subnet = ".".join(local_ip.split(".")[:3]) + ".0/24" if local_ip else ""

    # Signature is the physical identifier used for audit/history.
    signature = "|".join(
        [
            f"lead={lead}",
            f"subnet={subnet}",
            f"gateway_ip={gateway_ip}",
            f"gateway_mac={gateway_mac}",
        ]
    )

    if not fingerprint:
        fingerprint = signature

    composed_uid = _compose_lan_uid(lead, gateway_mac, gateway_ip)
    if composed_uid:
        # Prefer the deterministic LAN UID derived from gateway identity.
        # This keeps the backend aligned with the actual network fingerprint
        # even when an older agent still sends a stale lan_uid value.
        return composed_uid, fingerprint

    if raw_lan_uid and raw_lan_uid.lower() not in {"lan-default", "legacy-lan", "default", "lan_default"}:
        return raw_lan_uid, fingerprint

    # Last-resort fallback when gateway identity cannot be read.
    digest = hashlib.sha1(signature.encode("utf-8")).hexdigest()[:16]
    generated_uid = f"lanf-{digest}"
    return generated_uid, fingerprint


def _resolve_lan_uid_from_body(body: dict[str, Any]) -> str:
    uid, _ = _resolve_lan_info_from_body(body)
    return uid


def _to_page(value: Any, default: int) -> int:
    try:
        return max(1, int(str(value)))
    except Exception:  # noqa: BLE001
        return default


def _time_scope_start(scope: str) -> datetime | None:
    now = datetime.now(timezone.utc)
    key = (scope or "").strip().lower()
    if key in {"hour", "1h"}:
        return now - timedelta(hours=1)
    if key in {"day", "1d"}:
        return now - timedelta(days=1)
    if key in {"7d", "7days", "week"}:
        return now - timedelta(days=7)
    if key in {"month", "1m"}:
        return now - timedelta(days=30)
    if key in {"3months", "3m"}:
        return now - timedelta(days=90)
    if key in {"6months", "6m"}:
        return now - timedelta(days=180)
    if key in {"year", "1y"}:
        return now - timedelta(days=365)
    if key in {"all", ""}:
        return None
    return None


def _is_same_utc_minute(left: datetime | None, right: datetime | None) -> bool:
    if left is None or right is None:
        return False
    l = left.astimezone(timezone.utc).replace(second=0, microsecond=0)
    r = right.astimezone(timezone.utc).replace(second=0, microsecond=0)
    return l == r


def _normalize_counter_payload(counter_data: dict[str, Any]) -> dict[str, int]:
    result: dict[str, int] = {}
    for key in COUNTER_KEYS:
        value = _to_int(counter_data.get(key))
        if value is not None:
            result[key] = value
    return result


def _compute_delta_payload(current: dict[str, int], baseline: dict[str, int]) -> tuple[dict[str, int], bool]:
    delta: dict[str, int] = {}
    has_reset = False
    for key in COUNTER_KEYS:
        cur = current.get(key)
        base = baseline.get(key)
        if cur is None:
            continue
        if base is None:
            delta[key] = cur
            continue
        diff = cur - base
        if diff < 0:
            has_reset = True
            delta[key] = 0
            continue
        delta[key] = diff
    return delta, has_reset


def _apply_baseline(delta_value: int | None, baseline_payload: dict[str, Any], key: str) -> int | None:
    if delta_value is None:
        return None
    base = _to_int(baseline_payload.get(key))
    if base is None:
        base = 0
    return base + delta_value


def _parse_date(value: Any) -> Any:
    text = _to_text(value)
    if not text:
        return datetime.now(timezone.utc).date()
    try:
        return date.fromisoformat(text)
    except Exception:  # noqa: BLE001
        return datetime.now(timezone.utc).date()


def _format_datetime(value: datetime | None) -> str:
    if value is None:
        return ""
    return value.isoformat()


def _format_datetime_ui(value: datetime | None) -> str:
    if value is None:
        return ""
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(UI_TZ).strftime("%Y-%m-%d %H:%M:%S")


def _format_date(value: datetime | None) -> str:
    if value is None:
        return ""
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(UI_TZ).strftime("%Y-%m-%d")

def _apply_common_filters(
    stmt: Any,
    model: Any,
    lead: str,
    ip: str,
    printer_name: str,
    printer_type: str,
    time_scope: str,
    favorite_only: bool = False,
    datetime_from: str = "",
    datetime_to: str = "",
) -> Any:
    if lead:
        stmt = stmt.where(model.lead == lead)
    if ip:
        stmt = stmt.where(model.ip == ip)
    if printer_name:
        stmt = stmt.where(model.printer_name == printer_name)
    if printer_type in {"ricoh", "toshiba", "epson"}:
        stmt = stmt.where(func.lower(model.printer_name).like(f"%{printer_type}%"))
    from_dt = _parse_query_datetime(datetime_from, end_of_minute=False)
    to_dt = _parse_query_datetime(datetime_to, end_of_minute=True)
    
    # Detect time column
    time_col = None
    if hasattr(model, "timestamp"):
        time_col = model.timestamp
    elif hasattr(model, "updated_at"):
        time_col = model.updated_at
    elif hasattr(model, "created_at"):
        time_col = model.created_at

    if time_col is not None:
        if from_dt:
            stmt = stmt.where(time_col >= from_dt)
        if to_dt:
            stmt = stmt.where(time_col <= to_dt)
        if not from_dt and not to_dt:
            scope_start = _time_scope_start(time_scope)
            if scope_start:
                stmt = stmt.where(time_col >= scope_start)
    
    if favorite_only and hasattr(model, "is_favorite"):
        stmt = stmt.where(model.is_favorite.is_(True))
    return stmt

def _apply_date_filters(stmt: Any, model: Any, date_from: str | None, date_to: str | None) -> Any:
    if date_from:
        try:
            dt_from = datetime.fromisoformat(date_from).replace(tzinfo=timezone.utc)
            stmt = stmt.where(model.created_at >= dt_from)
        except (ValueError, TypeError):
            pass
    if date_to:
        try:
            dt_to = datetime.fromisoformat(date_to).replace(tzinfo=timezone.utc)
            if len(date_to) == 10:
                dt_to = dt_to.replace(hour=23, minute=59, second=59)
            stmt = stmt.where(model.created_at <= dt_to)
        except (ValueError, TypeError):
            pass
    return stmt

def resolve_utility_command_content(session: Any, command_content: str) -> str:
    if not command_content:
        return ""
    
    from models import UtiCommand
    from sqlalchemy import select
    
    if "# __RICOH_LOGIN__" in command_content or "__RICOH_LOGIN__" in command_content:
        stmt = select(UtiCommand).where(UtiCommand.command == "ricoh_login_helper")
        helper = session.execute(stmt).scalar_one_or_none()
        if not helper or not helper.command_content:
            raise RuntimeError("Thiếu helper 'ricoh_login_helper' trong DB — không thể build script Ricoh")
        command_content = command_content.replace("# __RICOH_LOGIN__", helper.command_content).replace("__RICOH_LOGIN__", helper.command_content)
        
    if "# __RICOH_LIST__" in command_content or "__RICOH_LIST__" in command_content:
        stmt = select(UtiCommand).where(UtiCommand.command == "ricoh_list_helper")
        helper = session.execute(stmt).scalar_one_or_none()
        if not helper or not helper.command_content:
            raise RuntimeError("Thiếu helper 'ricoh_list_helper' trong DB — không thể build script Ricoh")
        command_content = command_content.replace("# __RICOH_LIST__", helper.command_content).replace("__RICOH_LIST__", helper.command_content)
        
    if "# __TOSHIBA_LOGIN__" in command_content or "__TOSHIBA_LOGIN__" in command_content:
        stmt = select(UtiCommand).where(UtiCommand.command == "toshiba_login_helper")
        helper = session.execute(stmt).scalar_one_or_none()
        if not helper or not helper.command_content:
            raise RuntimeError("Thiếu helper 'toshiba_login_helper' trong DB — không thể build script Toshiba")
        command_content = command_content.replace("# __TOSHIBA_LOGIN__", helper.command_content).replace("__TOSHIBA_LOGIN__", helper.command_content)
        
    if "# __TOSHIBA_LIST__" in command_content or "__TOSHIBA_LIST__" in command_content:
        stmt = select(UtiCommand).where(UtiCommand.command == "toshiba_list_helper")
        helper = session.execute(stmt).scalar_one_or_none()
        if not helper or not helper.command_content:
            raise RuntimeError("Thiếu helper 'toshiba_list_helper' trong DB — không thể build script Toshiba")
        command_content = command_content.replace("# __TOSHIBA_LIST__", helper.command_content).replace("__TOSHIBA_LIST__", helper.command_content)
        
    return command_content


def try_resolve_when_ip_change_parent(session: Any, completed_child_id: int) -> None:
    """Auto-resolve when_ip_change parent to 'success' once all its address_modify children are done."""
    import json as _json
    import logging
    from datetime import datetime, timezone
    from models import PrinterControlCommand
    from sqlalchemy import select

    logger = logging.getLogger(__name__)
    try:
        # Find pending when_ip_change parents that reference this child
        parents = session.execute(
            select(PrinterControlCommand).where(
                PrinterControlCommand.command_type == "when_ip_change",
                PrinterControlCommand.status == "pending"
            )
        ).scalars().all()

        for parent in parents:
            try:
                params = _json.loads(parent.command_params or "{}")
                child_ids = params.get("child_command_ids", [])
                if completed_child_id not in child_ids:
                    continue
                # Check all children have finished
                children = session.execute(
                    select(PrinterControlCommand).where(
                        PrinterControlCommand.id.in_(child_ids)
                    )
                ).scalars().all()
                all_done = all(c.status in ("success", "failed") for c in children)
                if all_done:
                    parent.status = "success"
                    parent.responded_at = datetime.now(timezone.utc)
                    logger.info(
                        "[when_ip_change] Auto-resolved parent #%d to success — all %d children done.",
                        parent.id, len(child_ids)
                    )
            except Exception as inner_exc:
                logger.warning("[when_ip_change] Error checking parent #%d: %s", parent.id, inner_exc)
    except Exception as exc:
        logger.error("[when_ip_change] try_resolve_when_ip_change_parent error: %s", exc)


def trigger_ip_change_workflow(session: Any, lead: str, lan_uid: str, agent_uid: str, old_ip: str, new_ip: str) -> None:
    if not old_ip or not new_ip or old_ip == new_ip:
        return
    import json as _json
    import logging
    from datetime import datetime, timezone
    from models import PrinterControlCommand, ScanPoint, Printer, IPData
    from sqlalchemy import select

    logger = logging.getLogger(__name__)
    try:
        # Bug fix 1: use .first() instead of scalar_one_or_none() to survive duplicate IPDatas rows
        ip_rec = session.execute(
            select(IPData).where(IPData.agent_name == agent_uid)
            .order_by(IPData.updated_at.desc())
        ).scalars().first()
        if ip_rec is None:
            ip_rec = IPData(
                agent_uid=agent_uid,
                lan_uid=lan_uid,
                agent_name=agent_uid,
                ip=new_ip,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            session.add(ip_rec)
        else:
            ip_rec.ip = new_ip
            ip_rec.lan_uid = lan_uid
            ip_rec.updated_at = datetime.now(timezone.utc)

        # Auto-resolve any pending or processing change_agent_ip command for this agent
        pending_ip_cmds = session.execute(
            select(PrinterControlCommand).where(
                PrinterControlCommand.agent_uid == agent_uid,
                PrinterControlCommand.status.in_(["pending", "processing"])
            )
        ).scalars().all()
        for pic in pending_ip_cmds:
            if pic.command_type == "trigger_utility":
                pic.status = "success"
                pic.responded_at = datetime.now(timezone.utc)
                pic.error_message = f"[✓] Đã cập nhật thành công IP tĩnh mới: {new_ip}"

        # Bug fix 2: filter scan_points by agent_uid — only this agent's copiers, not all globally
        scan_points = session.execute(
            select(ScanPoint).where(ScanPoint.agent_uid == agent_uid)
        ).scalars().all()
        matched_entries = []
        for sp in scan_points:
            abd = sp.address_book_data
            if isinstance(abd, dict):
                addr_list = abd.get("address_list") or []
                for entry in addr_list:
                    if not isinstance(entry, dict) or entry.get("type") == "Summary":
                        continue
                    folder_val = entry.get("folder") or entry.get("server_host") or entry.get("server") or ""
                    if not folder_val or folder_val == "-":
                        continue
                    
                    def clean_host(val):
                        v = str(val or "").strip()
                        if "://" in v: v = v.split("://", 1)[1]
                        v = v.split("/", 1)[0]
                        v = v.split(":", 1)[0]
                        return v.strip()

                    host = clean_host(folder_val)
                    if host == old_ip:
                        matched_entries.append({
                            "printer_name": sp.printer_name or "Photocopy",
                            "printer_mac": sp.mac_id,
                            "printer_ip": sp.ip,
                            "entry_name": entry.get("name") or entry.get("username") or entry.get("registration_no") or "Folder Destination",
                            "registration_no": entry.get("registration_no") or "",
                            "protocol": str(entry.get("protocol") or "FOLDER").upper(),
                            "server_host": host,
                            "path": entry.get("path_on_folder") or entry.get("folder_path") or entry.get("folder") or "",
                        })

        child_ids = []
        if matched_entries:
            from models import PrinterAuthCredential
            from sqlalchemy import func as _func
            for entry in matched_entries:
                printer = session.execute(
                    select(Printer).where(Printer.mac_address == entry["printer_mac"])
                ).scalars().first()
                p_id = printer.id if printer else 0
                p_lan = printer.lan_uid if printer else lan_uid
                p_lead = printer.lead if printer else lead
                
                # Bug fix 3: look up PrinterAuthCredential — no silent empty fallback
                norm_mac = entry["printer_mac"].upper().replace(":", "").replace("-", "")
                cred = session.execute(
                    select(PrinterAuthCredential).where(
                        _func.upper(_func.replace(_func.replace(PrinterAuthCredential.mac_address, ":", ""), "-", "")) == norm_mac
                    )
                ).scalars().first()
                
                if cred and cred.auth_user:
                    p_user = cred.auth_user.strip()
                    p_pass = (cred.auth_password or "").strip()
                elif printer and printer.auth_user:
                    p_user = printer.auth_user.strip()
                    p_pass = (printer.auth_password or "").strip()
                else:
                    p_user = ""
                    p_pass = ""
                    logger.warning("[when_ip_change] No credentials found for printer %s (mac=%s) — address_modify sent with empty auth", entry["printer_ip"], entry["printer_mac"])
                
                old_folder = entry["path"]
                new_folder = old_folder.replace(old_ip, new_ip) if old_ip in old_folder else old_folder

                # Infer printer brand from printer_name (Printer table has no printer_type column)
                _pname_low = (entry["printer_name"] or "").lower()
                p_type = "toshiba" if ("toshiba" in _pname_low or "e-studio" in _pname_low) else "ricoh"

                cmd_params_dict = {
                    "registration_no": entry["registration_no"],
                    "name": entry["entry_name"],
                    "email": "",
                    "folder": new_folder,
                    "user_code": "",
                    "fields": {},
                    "printer_type": p_type,
                    "printer_ip": entry["printer_ip"],
                    "ip": entry["printer_ip"],
                    "mac_address": entry["printer_mac"],
                    "printer_mac_id": entry["printer_mac"],
                    "is_auto": True,
                }
                modify_cmd = PrinterControlCommand(
                    printer_id=p_id,
                    lead=p_lead,
                    lan_uid=p_lan,
                    agent_uid=agent_uid or "",
                    printer_name=entry["printer_name"],
                    ip=entry["printer_ip"],
                    desired_enabled=True,
                    command_type="address_modify",
                    auth_user=p_user,
                    auth_password=p_pass,
                    command_params=_json.dumps(cmd_params_dict, ensure_ascii=False),
                    status="pending",
                    error_message="",
                    requested_at=datetime.now(timezone.utc),
                )
                session.add(modify_cmd)
                session.flush()
                child_ids.append(modify_cmd.id)

        detail_lines = []
        for idx, e in enumerate(matched_entries, 1):
            detail_lines.append(
                f"{idx}. Máy in: {e['printer_name']} ({e['printer_ip']}) | Mã: {e['registration_no']} | Tên: {e['entry_name']} | Path: {e['path']}"
            )
        error_msg = (
            f"Đã phát hiện đổi IP từ {old_ip} sang {new_ip}. Tìm thấy {len(matched_entries)} điểm scan FTP trùng IP cũ:\n"
            + "\n".join(detail_lines)
            if matched_entries
            else f"Đã phát hiện đổi IP từ {old_ip} sang {new_ip}. Không tìm thấy điểm scan FTP nào trùng IP cũ."
        )

        cmd_log = PrinterControlCommand(
            lead=lead or "default",
            lan_uid=lan_uid or "default",
            agent_uid=agent_uid or "",
            command_type="when_ip_change",
            printer_id=0,
            printer_name="",
            ip=new_ip,
            command_params=_json.dumps({
                "old_ip": old_ip,
                "new_ip": new_ip,
                "matched_scan_points": matched_entries,
                "child_command_ids": child_ids,
            }, ensure_ascii=False),
            status="pending" if child_ids else "success",
            error_message=error_msg,
            requested_at=datetime.now(timezone.utc),
            responded_at=None if child_ids else datetime.now(timezone.utc),
        )
        session.add(cmd_log)
        session.flush()
        logger.info("[when_ip_change] Triggered when_ip_change command #%d with %d child address_modify commands for agent %s (%s -> %s)", cmd_log.id, len(child_ids), agent_uid, old_ip, new_ip)
    except Exception as exc:
        logger.error("[when_ip_change] Failed to trigger IP change workflow for agent %s: %s", agent_uid, exc)


