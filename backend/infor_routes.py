from __future__ import annotations

import logging
import re
from datetime import datetime, timezone, timedelta
from typing import Any

from flask import Flask, jsonify, request
from sqlalchemy import select, func

from utils import (
    UI_TZ,
    _to_text,
    _to_int,
    _to_page,
    _parse_query_datetime,
    _parse_timestamp,
    _normalize_mac,
)
from serializers import (
    _refresh_stale_offline,
    _resolve_public_mac,
)
from app_helpers import _serialize_audit_payload_iso
from models import DeviceInforHistory, DeviceInfor

LOGGER = logging.getLogger(__name__)


def register_infor_routes(app: Flask, session_factory: Any) -> None:

    @app.get("/api/infor/list")
    def infor_list() -> Any:
        lead = _to_text(request.args.get("lead"))
        if lead and lead.lower() in {"_t", "undefined", "null", "none", "all", "*"}:
            lead = None
        row_id_query = _to_text(request.args.get("id"))
        printer_name_query = _to_text(request.args.get("printer_name") or request.args.get("name"))
        ip_query = _to_text(request.args.get("ip"))
        mac_query = _to_text(request.args.get("mac_id"))
        lan_uid_query = _to_text(request.args.get("lan_uid"))
        counter_min = _to_int(request.args.get("counter_min"))
        counter_max = _to_int(request.args.get("counter_max"))
        printed_paper_min = _to_int(
            request.args.get("printed_paper_min")
            or request.args.get("printer_page_min")
            or request.args.get("printerpage_min")
        )
        printed_paper_max = _to_int(
            request.args.get("printed_paper_max")
            or request.args.get("printer_page_max")
            or request.args.get("printerpage_max")
        )
        cartridge_status_query = _to_text(request.args.get("cartridge_status")).lower()
        updated_from = _parse_query_datetime(request.args.get("updated_from"), end_of_minute=False)
        updated_to = _parse_query_datetime(request.args.get("updated_to"), end_of_minute=True)
        page = _to_page(request.args.get("page"), 1)
        limit = _to_int(request.args.get("limit"))
        if limit is None:
            limit = 50

        def serialize_infor_row(
            row_id: int,
            row_lead: str,
            row_lan_uid: str,
            row_agent_uid: str,
            row_printer_name: str,
            row_ip: str,
            row_mac_id: str,
            row_machine_uid: str,
            row_is_latest: bool,
            counter_data: dict[str, Any],
            status_data: dict[str, Any],
            last_counter_at: datetime | None,
            last_status_at: datetime | None,
            created_at: datetime | None,
            updated_at: datetime | None,
        ) -> dict[str, Any]:
            return {
                "id": int(row_id),
                "lead": row_lead,
                "lan_uid": row_lan_uid,
                "agent_uid": row_agent_uid,
                "printer_name": row_printer_name,
                "ip": row_ip,
                "mac_id": row_mac_id or "unknown",
                "machine_uid": row_machine_uid or "unknown",
                "is_latest": row_is_latest,
                "counter": counter_data,
                "status": status_data,
                "counter_data": counter_data,
                "status_data": status_data,
                "counter_total": _to_int(counter_data.get("total")) or 0,
                "status_system": _to_text(status_data.get("system_status")) or _to_text(status_data.get("printer_status")),
                "last_counter_at": last_counter_at.isoformat() if last_counter_at else "",
                "last_status_at": last_status_at.isoformat() if last_status_at else "",
                **_serialize_audit_payload_iso(created_at, updated_at),
            }

        def row_updated_dt(row: dict[str, Any]) -> datetime | None:
            raw = (
                _to_text(row.get("updated_at"))
                or _to_text(row.get("updateAt"))
                or _to_text(row.get("last_counter_at"))
                or _to_text(row.get("last_status_at"))
                or _to_text(row.get("created_at"))
                or _to_text(row.get("createAt"))
            )
            if not raw:
                return None
            return _parse_timestamp(raw)

        def row_counter_total(row: dict[str, Any]) -> int:
            return _to_int(row.get("counter_total")) or 0

        def row_cartridge_state(row: dict[str, Any]) -> str:
            status_data = row.get("status_data") if isinstance(row.get("status_data"), dict) else {}
            toner_black = _to_text(status_data.get("toner_black")).lower()
            if toner_black in {"ok", "status ok", "ready", "normal"}:
                return "ok"
            if toner_black and any(token in toner_black for token in ["empty", "replace", "low", "end", "near"]):
                return "empty"
            return ""

        def mac_matches(query_value: str, row_value: str) -> bool:
            query_text = _to_text(query_value).upper()
            row_text = _to_text(row_value).upper()
            if not query_text:
                return True
            query_compact = re.sub(r"[^0-9A-F]", "", query_text)
            row_compact = re.sub(r"[^0-9A-F]", "", row_text)
            if query_compact and row_compact:
                return query_compact in row_compact
            return query_text in row_text

        def apply_printed_paper(rows: list[dict[str, Any]]) -> None:
            start_today_utc = datetime.now(UI_TZ).replace(hour=0, minute=0, second=0, microsecond=0).astimezone(timezone.utc)
            baseline: dict[tuple[str, str], tuple[datetime, int]] = {}
            for row in rows:
                lan_value = _to_text(row.get("lan_uid"))
                mac_value = _normalize_mac(row.get("mac_id"))
                updated_dt = row_updated_dt(row)
                if not lan_value or not mac_value or updated_dt is None or updated_dt < start_today_utc:
                    continue
                key = (lan_value, mac_value)
                total_value = row_counter_total(row)
                current = baseline.get(key)
                if current is None or updated_dt < current[0]:
                    baseline[key] = (updated_dt, total_value)

            for row in rows:
                lan_value = _to_text(row.get("lan_uid"))
                mac_value = _normalize_mac(row.get("mac_id"))
                total_value = row_counter_total(row)
                base_total = total_value
                if lan_value and mac_value:
                    baseline_row = baseline.get((lan_value, mac_value))
                    if baseline_row is not None:
                        base_total = baseline_row[1]
                printed_paper = max(0, total_value - base_total)
                row["printed_paper"] = printed_paper
                row["printer_page"] = printed_paper
                row["cartridge_status"] = row_cartridge_state(row)

        def matches_infor_filters(row: dict[str, Any]) -> bool:
            if row_id_query:
                row_id_text = str(int(row.get("id") or 0))
                if row_id_query.isdigit():
                    if row_id_text != str(int(row_id_query)):
                        return False
                elif row_id_query not in row_id_text:
                    return False
            if printer_name_query and printer_name_query.lower() not in _to_text(row.get("printer_name")).lower():
                return False
            if ip_query and ip_query.lower() not in _to_text(row.get("ip")).lower():
                return False
            if mac_query and not mac_matches(mac_query, _to_text(row.get("mac_id"))):
                return False
            if lan_uid_query and lan_uid_query.lower() not in _to_text(row.get("lan_uid")).lower():
                return False
            total_value = row_counter_total(row)
            if counter_min is not None and total_value < counter_min:
                return False
            if counter_max is not None and total_value > counter_max:
                return False
            printed_value = _to_int(row.get("printed_paper")) or 0
            if printed_paper_min is not None and printed_value < printed_paper_min:
                return False
            if printed_paper_max is not None and printed_value > printed_paper_max:
                return False
            if cartridge_status_query and row_cartridge_state(row) != cartridge_status_query:
                return False
            updated_dt = row_updated_dt(row)
            if updated_from is not None:
                if updated_dt is None or updated_dt < updated_from:
                    return False
            if updated_to is not None:
                if updated_dt is None or updated_dt > updated_to:
                    return False
            return True

        with session_factory() as session:
            _refresh_stale_offline(session=session, lead=lead)
            session.commit()
            
            rows: list[dict[str, Any]] = []

            # 1. Pipeline: mac_id -> resolve ip -> fetch counter & status (from RAM devices or SQL DeviceInforHistory/DeviceInfor)
            from active_agents_registry import ACTIVE_AGENTS, prune_offline_agents
            from sqlalchemy import select, func
            from models import CounterInfor, CounterBaseline, StatusInfor, DeviceInfor, DeviceInforHistory, Printer
            prune_offline_agents(timeout_seconds=180)
            dummy_id = 1

            agent_items = list(ACTIVE_AGENTS.items())
            if lead:
                matching = [(a_uid, a_info) for a_uid, a_info in agent_items if a_info.get("lead") == lead]
                if matching:
                    agent_items = matching

            for agent_uid, agent_info in agent_items:
                a_lead = agent_info.get("lead", "default")
                a_lan_uid = agent_info.get("lan_uid", "default")

                printers_list = agent_info.get("printers_json") or []
                printers_list = [p for p in printers_list if isinstance(p, dict) and _to_text(p.get("status")).lower() != "offline"]
                devices_dict = agent_info.get("devices") or {}

                for dev in printers_list:
                    if not isinstance(dev, dict):
                        continue

                    # Bước 1: mac_id -> tìm ra ip
                    p_mac = _normalize_mac(_to_text(dev.get("mac_address") or dev.get("mac_id")))
                    p_ip = _to_text(dev.get("ip"))
                    p_name = _to_text(dev.get("printer_name") or dev.get("name")) or "Photocopy"
                    p_type = _to_text(dev.get("printer_type") or dev.get("type")).lower()
                    p_name_lower = p_name.lower()

                    if p_name.startswith("[ERROR]") or "probe failed" in p_name_lower or "[error]" in p_name_lower:
                        continue

                    # Bỏ qua modem mạng, router, gateway, switch, access point
                    router_keywords = [
                        "router", "modem", "gateway", "access point", "switch", "f671y", "draytek",
                        "tp-link", "tplink", "mikrotik", "cisco", "tenda", "netgear", "linksys", "asus",
                        "hgw", "g-97", "hg8145", "hg8045", "ont", "zte", "totolink",
                        "f6600", "f66", "h3601", "h36"
                    ]
                    if any(kw in p_name_lower for kw in router_keywords) or any(kw in p_type for kw in ["router", "gateway", "modem", "switch", "access_point"]):
                        continue

                    if not p_ip and p_mac:
                        if p_mac in devices_dict and devices_dict[p_mac].get("ip"):
                            p_ip = devices_dict[p_mac]["ip"]
                        else:
                            p_obj = session.execute(
                                select(Printer).where(
                                    Printer.lead == a_lead,
                                    func.upper(Printer.mac_address) == p_mac
                                )
                            ).scalars().first()
                            if p_obj and p_obj.ip:
                                p_ip = p_obj.ip

                    if not p_ip and not p_mac:
                        continue

                    # Bước 2 & 3: Lấy counter_data và status_data
                    counter_data = {}
                    status_data = {}
                    last_counter_at = None
                    last_status_at = None

                    # Ưu tiên lấy từ RAM (devices_dict)
                    ram_dev = None
                    if p_mac and p_mac in devices_dict:
                        ram_dev = devices_dict[p_mac]
                    if not ram_dev and p_ip:
                        for r_k, r_v in devices_dict.items():
                            if isinstance(r_v, dict) and _to_text(r_v.get("ip")) == p_ip:
                                ram_dev = r_v
                                break

                    if ram_dev:
                        counter_data = ram_dev.get("counter") or ram_dev.get("counter_data") or {}
                        status_data = ram_dev.get("status") or ram_dev.get("status_data") or {}

                    from sqlalchemy import or_

                    # 1. Nếu RAM chưa có, lấy từ DeviceInforHistory trong CSDL theo mac_id / ip
                    if not counter_data and (p_mac or p_ip):
                        try:
                            def _get_dh(filter_lead=True):
                                stmt = select(DeviceInforHistory)
                                if filter_lead:
                                    stmt = stmt.where(DeviceInforHistory.lead == a_lead)
                                if p_mac and p_ip:
                                    stmt = stmt.where(or_(func.replace(func.upper(DeviceInforHistory.mac_id), '-', ':') == p_mac, DeviceInforHistory.ip == p_ip))
                                elif p_mac:
                                    stmt = stmt.where(func.replace(func.upper(DeviceInforHistory.mac_id), '-', ':') == p_mac)
                                elif p_ip:
                                    stmt = stmt.where(DeviceInforHistory.ip == p_ip)
                                return session.execute(stmt.order_by(DeviceInforHistory.updated_at.desc(), DeviceInforHistory.id.desc()).limit(1)).scalars().first()

                            dh_row = _get_dh(filter_lead=True) or _get_dh(filter_lead=False)
                            if dh_row:
                                if isinstance(dh_row.counter_data, dict) and dh_row.counter_data:
                                    counter_data = dh_row.counter_data
                                if isinstance(dh_row.status_data, dict) and dh_row.status_data:
                                    status_data = dh_row.status_data
                                last_counter_at = dh_row.last_counter_at or dh_row.updated_at
                                last_status_at = dh_row.last_status_at or dh_row.updated_at
                        except Exception as dh_err:
                            LOGGER.warning("[infor_list] DeviceInforHistory lookup exception: %s", dh_err)

                    # 2. Lấy từ DeviceInfor
                    if not counter_data and (p_mac or p_ip):
                        try:
                            def _get_di(filter_lead=True):
                                stmt = select(DeviceInfor)
                                if filter_lead:
                                    stmt = stmt.where(DeviceInfor.lead == a_lead)
                                if p_mac and p_ip:
                                    stmt = stmt.where(or_(func.replace(func.upper(DeviceInfor.mac_id), '-', ':') == p_mac, DeviceInfor.ip == p_ip))
                                elif p_mac:
                                    stmt = stmt.where(func.replace(func.upper(DeviceInfor.mac_id), '-', ':') == p_mac)
                                elif p_ip:
                                    stmt = stmt.where(DeviceInfor.ip == p_ip)
                                return session.execute(stmt.order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc()).limit(1)).scalars().first()

                            d_row = _get_di(filter_lead=True) or _get_di(filter_lead=False)
                            if d_row:
                                if isinstance(d_row.counter_data, dict) and d_row.counter_data:
                                    counter_data = d_row.counter_data
                                if not status_data and isinstance(d_row.status_data, dict) and d_row.status_data:
                                    status_data = d_row.status_data
                                last_counter_at = d_row.last_counter_at or d_row.updated_at
                                last_status_at = d_row.last_status_at or d_row.updated_at
                        except Exception as d_err:
                            LOGGER.warning("[infor_list] DeviceInfor lookup exception: %s", d_err)

                    # 3. Nếu vẫn chưa có counter_data, truy vấn trực tiếp từ bảng CounterInfor
                    if not counter_data and (p_mac or p_ip):
                        try:
                            def _get_ci(filter_lead=True):
                                stmt = select(CounterInfor)
                                if filter_lead:
                                    stmt = stmt.where(CounterInfor.lead == a_lead)
                                if p_mac and p_ip:
                                    stmt = stmt.where(or_(func.replace(func.upper(CounterInfor.mac_id), '-', ':') == p_mac, CounterInfor.ip == p_ip))
                                elif p_mac:
                                    stmt = stmt.where(func.replace(func.upper(CounterInfor.mac_id), '-', ':') == p_mac)
                                elif p_ip:
                                    stmt = stmt.where(CounterInfor.ip == p_ip)
                                return session.execute(stmt.order_by(CounterInfor.created_at.desc(), CounterInfor.id.desc()).limit(1)).scalars().first()

                            c_row = _get_ci(filter_lead=True) or _get_ci(filter_lead=False)
                            if c_row:
                                if isinstance(c_row.raw_payload, dict) and c_row.raw_payload:
                                    counter_data = c_row.raw_payload
                                else:
                                    counter_data = {
                                        "total": c_row.total or 0,
                                        "copier_bw": c_row.copier_bw or 0,
                                        "printer_bw": c_row.printer_bw or 0,
                                        "a3_dlt": c_row.a3_dlt or 0,
                                        "duplex": c_row.duplex or 0,
                                    }
                                last_counter_at = c_row.created_at or c_row.updated_at
                        except Exception as c_err:
                            LOGGER.warning("[infor_list] CounterInfor lookup exception: %s", c_err)

                    # 3.5. Nếu vẫn chưa có counter_data, truy vấn trực tiếp từ bảng CounterBaseline
                    if not counter_data and (p_mac or p_ip):
                        try:
                            cb_stmt = select(CounterBaseline).where(CounterBaseline.lead == a_lead)
                            if p_ip:
                                cb_stmt = cb_stmt.where(CounterBaseline.ip == p_ip)
                            cb_row = session.execute(cb_stmt.order_by(CounterBaseline.baseline_timestamp.desc(), CounterBaseline.id.desc()).limit(1)).scalars().first()
                            if not cb_row and p_ip:
                                cb_stmt_global = select(CounterBaseline).where(CounterBaseline.ip == p_ip)
                                cb_row = session.execute(cb_stmt_global.order_by(CounterBaseline.baseline_timestamp.desc(), CounterBaseline.id.desc()).limit(1)).scalars().first()
                            if cb_row and isinstance(cb_row.raw_payload, dict) and cb_row.raw_payload:
                                counter_data = cb_row.raw_payload
                                last_counter_at = cb_row.baseline_timestamp or cb_row.created_at
                        except Exception as cb_err:
                            LOGGER.warning("[infor_list] CounterBaseline lookup exception: %s", cb_err)

                    # 4. Nếu vẫn chưa có status_data, truy vấn trực tiếp từ bảng StatusInfor
                    if not status_data and (p_mac or p_ip):
                        try:
                            def _get_si(filter_lead=True):
                                stmt = select(StatusInfor)
                                if filter_lead:
                                    stmt = stmt.where(StatusInfor.lead == a_lead)
                                if p_mac and p_ip:
                                    stmt = stmt.where(or_(func.replace(func.upper(StatusInfor.mac_id), '-', ':') == p_mac, StatusInfor.ip == p_ip))
                                elif p_mac:
                                    stmt = stmt.where(func.replace(func.upper(StatusInfor.mac_id), '-', ':') == p_mac)
                                elif p_ip:
                                    stmt = stmt.where(StatusInfor.ip == p_ip)
                                return session.execute(stmt.order_by(StatusInfor.created_at.desc(), StatusInfor.id.desc()).limit(1)).scalars().first()

                            s_row = _get_si(filter_lead=True) or _get_si(filter_lead=False)
                            if s_row and isinstance(s_row.raw_payload, dict) and s_row.raw_payload:
                                status_data = s_row.raw_payload
                                last_status_at = s_row.created_at or s_row.updated_at
                        except Exception as s_err:
                            LOGGER.warning("[infor_list] StatusInfor lookup exception: %s", s_err)

                    # 5. Lấy chính xác trạng thái online/offline thực tế từ bảng Printer
                    p_online_state = True
                    try:
                        if p_mac or p_ip:
                            p_check_stmt = select(Printer).where(Printer.lead == a_lead)
                            if p_mac and p_ip:
                                p_check_stmt = p_check_stmt.where(or_(func.replace(func.upper(Printer.mac_address), '-', ':') == p_mac, Printer.ip == p_ip))
                            elif p_mac:
                                p_check_stmt = p_check_stmt.where(func.replace(func.upper(Printer.mac_address), '-', ':') == p_mac)
                            elif p_ip:
                                p_check_stmt = p_check_stmt.where(Printer.ip == p_ip)
                            p_check = session.execute(p_check_stmt).scalars().first()
                            if p_check:
                                p_online_state = bool(p_check.is_online)
                    except Exception as p_err:
                        LOGGER.warning("[infor_list] Printer online check exception: %s", p_err)
                        LOGGER.warning("[infor_list] Printer online check exception: %s", p_err)

                    if not status_data or list(status_data.keys()) == ["printer_status"]:
                        status_data = {
                            "printer_status": "online" if p_online_state else "offline",
                            "system_status": "Ready" if p_online_state else "Offline",
                            "printer_alerts": [],
                            "copier_status": "Ready" if p_online_state else "Offline",
                            "copier_alerts": [],
                            "scanner_status": "Ready" if p_online_state else "Offline",
                            "scanner_alerts": [],
                            "toner_black": "OK" if p_online_state else "Unknown",
                            "toner_cyan": "OK" if p_online_state else "Unknown",
                            "toner_magenta": "OK" if p_online_state else "Unknown",
                            "toner_yellow": "OK" if p_online_state else "Unknown",
                            "tray_1_status": "OK" if p_online_state else "Unknown",
                            "tray_2_status": "OK" if p_online_state else "Unknown",
                            "tray_3_status": "OK" if p_online_state else "Unknown",
                            "bypass_tray_status": "OK" if p_online_state else "Unknown",
                            "other_info": {}
                        }
                    elif "printer_status" not in status_data and "system_status" not in status_data:
                        status_data["printer_status"] = "online" if p_online_state else "offline"

                    now_dt = datetime.now(timezone.utc)
                    rows.append(
                        serialize_infor_row(
                            row_id=dummy_id,
                            row_lead=a_lead,
                            row_lan_uid=a_lan_uid,
                            row_agent_uid=agent_uid,
                            row_printer_name=p_name,
                            row_ip=p_ip,
                            row_mac_id=p_mac,
                            row_machine_uid=p_mac or (f"IP:{p_ip}" if p_ip else "unknown"),
                            row_is_latest=True,
                            counter_data=counter_data or {},
                            status_data=status_data,
                            last_counter_at=last_counter_at or now_dt,
                            last_status_at=last_status_at or now_dt,
                            created_at=now_dt,
                            updated_at=now_dt,
                        )
                    )
                    dummy_id += 1

            # 2. FALLBACK ONLY IF RAM IS EMPTY (e.g. right after server reboot)
            if not rows:
                def _get_history(filter_lead=True):
                    history_stmt = select(DeviceInforHistory).order_by(
                        DeviceInforHistory.updated_at.desc(), DeviceInforHistory.id.desc()
                    )
                    if filter_lead and lead:
                        history_stmt = history_stmt.where(DeviceInforHistory.lead == lead)
                    if updated_from:
                        history_stmt = history_stmt.where(DeviceInforHistory.updated_at >= updated_from)
                    return session.execute(history_stmt).scalars().all()

                history_rows = _get_history(filter_lead=True) or _get_history(filter_lead=False)
                if history_rows:
                    latest_by_lan_mac: set[tuple[str, str, str]] = set()
                    for h in history_rows:
                        counter_data = h.counter_data if isinstance(h.counter_data, dict) else {}
                        status_data = h.status_data if isinstance(h.status_data, dict) else {}
                        if not counter_data and not status_data:
                            continue
                        resolved_mac = _normalize_mac(h.mac_id)
                        if not resolved_mac and _to_text(h.ip):
                            resolved_mac = _resolve_public_mac(
                                session=session,
                                lead=_to_text(h.lead),
                                lan_uid=_to_text(h.lan_uid),
                                ip=_to_text(h.ip),
                                incoming_mac="",
                            )
                        machine_uid = _to_text(h.machine_uid) or resolved_mac or (f"IP:{_to_text(h.ip)}" if _to_text(h.ip) else "")
                        is_latest = False
                        if resolved_mac:
                            latest_key = (_to_text(h.lead), _to_text(h.lan_uid), resolved_mac)
                            if latest_key not in latest_by_lan_mac:
                                latest_by_lan_mac.add(latest_key)
                                is_latest = True
                        rows.append(
                            serialize_infor_row(
                                row_id=int(h.id),
                                row_lead=h.lead,
                                row_lan_uid=h.lan_uid,
                                row_agent_uid=h.agent_uid,
                                row_printer_name=h.printer_name,
                                row_ip=h.ip,
                                row_mac_id=resolved_mac,
                                row_machine_uid=machine_uid,
                                row_is_latest=is_latest,
                                counter_data=counter_data,
                                status_data=status_data,
                                last_counter_at=h.last_counter_at,
                                last_status_at=h.last_status_at,
                                created_at=h.created_at,
                                updated_at=h.updated_at,
                            )
                        )

            if not rows:
                def _get_base(filter_lead=True):
                    base_stmt = select(DeviceInfor).order_by(DeviceInfor.updated_at.desc(), DeviceInfor.id.desc())
                    if filter_lead and lead:
                        base_stmt = base_stmt.where(DeviceInfor.lead == lead)
                    return session.execute(base_stmt).scalars().all()

                base_rows = _get_base(filter_lead=True) or _get_base(filter_lead=False)
                for d in base_rows:
                    counter_data = d.counter_data if isinstance(d.counter_data, dict) else {}
                    status_data = d.status_data if isinstance(d.status_data, dict) else {}
                    resolved_mac = _normalize_mac(d.mac_id)
                    if not resolved_mac and _to_text(d.ip):
                        resolved_mac = _resolve_public_mac(
                            session=session,
                            lead=_to_text(d.lead),
                            lan_uid=_to_text(d.lan_uid),
                            ip=_to_text(d.ip),
                            incoming_mac="",
                        )
                    rows.append(
                        serialize_infor_row(
                            row_id=int(d.id),
                            row_lead=d.lead,
                            row_lan_uid=d.lan_uid,
                            row_agent_uid=d.agent_uid,
                            row_printer_name=d.printer_name,
                            row_ip=d.ip,
                            row_mac_id=resolved_mac,
                            row_machine_uid=_to_text(d.mac_id) or (f"IP:{_to_text(d.ip)}" if _to_text(d.ip) else "unknown"),
                            row_is_latest=bool(resolved_mac),
                            counter_data=counter_data,
                            status_data=status_data,
                            last_counter_at=d.last_counter_at,
                            last_status_at=d.last_status_at,
                            created_at=d.created_at,
                            updated_at=d.updated_at,
                        )
                    )

            if not rows:
                from models import Printer
                def _get_printers(filter_lead=True):
                    p_stmt = select(Printer)
                    if filter_lead and lead:
                        p_stmt = p_stmt.where(Printer.lead == lead)
                    return session.execute(p_stmt).scalars().all()

                now_dt = datetime.now(timezone.utc)
                for p in (_get_printers(filter_lead=True) or _get_printers(filter_lead=False)):
                    p_mac = _normalize_mac(p.mac_address)
                    rows.append(
                        serialize_infor_row(
                            row_id=int(p.id),
                            row_lead=p.lead or "default",
                            row_lan_uid=p.lan_uid or "default",
                            row_agent_uid=p.agent_uid or "",
                            row_printer_name=getattr(p, "printer_name", None) or getattr(p, "name", None) or "Photocopy",
                            row_ip=p.ip or "",
                            row_mac_id=p_mac,
                            row_machine_uid=p_mac or (f"IP:{p.ip}" if p.ip else "unknown"),
                            row_is_latest=True,
                            counter_data={"total": 0},
                            status_data={"printer_status": "online" if p.is_online else "offline", "system_status": "Ready" if p.is_online else "Offline"},
                            last_counter_at=now_dt,
                            last_status_at=now_dt,
                            created_at=getattr(p, "created_at", now_dt),
                            updated_at=getattr(p, "updated_at", now_dt),
                        )
                    )

            apply_printed_paper(rows)
            rows = [row for row in rows if matches_infor_filters(row)]

            total = len(rows)
            if limit > 0:
                start_index = max(0, (page - 1) * limit)
                rows = rows[start_index:start_index + limit]

            page_size = len(rows)
            total_pages = 1
            if limit > 0:
                total_pages = max(1, (total + limit - 1) // limit)

            return jsonify({
                "rows": rows,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages,
                "limit": limit
            })
