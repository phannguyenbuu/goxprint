from __future__ import annotations

import logging
import json
import re
from pathlib import Path
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from typing import Any

from flask import Flask, jsonify, request
from sqlalchemy import select

from utils import _to_text, _format_datetime_ui, _apply_date_filters, _normalize_mac
from serializers import _refresh_stale_agent_offline, _refresh_stale_offline
from app_helpers import _serialize_audit_payload_iso
from models import LanSite, AgentNode, LanEmail, Printer, DeviceInfor

LOGGER = logging.getLogger(__name__)

DRIVERS_CATALOG_ROOT = Path("storage/drivers")
_DRIVERS_CACHE: dict[str, list[dict[str, Any]]] = {}

def _clean_tokens(name: str) -> list[str]:
    return re.findall(r'[a-zA-Z0-9]+', name.lower())

def _load_driver_catalog(brand: str) -> list[dict[str, Any]]:
    brand_clean = brand.lower().strip()
    if brand_clean in _DRIVERS_CACHE:
        return _DRIVERS_CACHE[brand_clean]
    catalog_file = DRIVERS_CATALOG_ROOT / f"{brand_clean}.json"
    if not catalog_file.exists():
        return []
    try:
        with open(catalog_file, encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, list):
            _DRIVERS_CACHE[brand_clean] = data
            return data
    except Exception as e:
        LOGGER.error("Failed to load catalog for brand=%s: %s", brand_clean, e)
    return []

def _match_printer_drivers(printer_name: str) -> list[dict[str, Any]]:
    query_tokens = _clean_tokens(printer_name)
    if not query_tokens:
        return []
        
    name_lower = printer_name.lower()
    brands_to_search = []
    
    is_ricoh = any(k in name_lower for k in ["ricoh", "aficio", "savin", "gestetner", "lanier", "infotec", "mp ", "im ", "pro "])
    is_toshiba = any(k in name_lower for k in ["toshiba", "e-studio"])
    is_fuji = any(k in name_lower for k in ["fujifilm", "fuji", "xerox", "apeos", "docucentre", "docuprint"])
    
    if is_ricoh:
        brands_to_search.append(("ricoh", _load_driver_catalog("ricoh")))
    if is_toshiba:
        brands_to_search.append(("toshiba", _load_driver_catalog("toshiba")))
    if is_fuji:
        brands_to_search.append(("fujifilm", _load_driver_catalog("fujifilm")))
        
    if not brands_to_search:
        brands_to_search = [
            ("ricoh", _load_driver_catalog("ricoh")),
            ("toshiba", _load_driver_catalog("toshiba")),
            ("fujifilm", _load_driver_catalog("fujifilm")),
        ]
        
    matches = []
    digits_in_query = re.findall(r'\d+', printer_name)
    
    for brand, catalog in brands_to_search:
        for item in catalog:
            model_name = item.get("model") or item.get("name") or ""
            if not model_name:
                continue
                
            model_tokens = _clean_tokens(model_name)
            score = 0
            
            # Intersection bonus
            intersection = set(query_tokens) & set(model_tokens)
            score += len(intersection) * 10
            
            # Substring bonus
            model_lower = model_name.lower()
            if name_lower in model_lower or model_lower in name_lower:
                score += 30
                
            # Digits match bonus / penalty
            digits_in_model = re.findall(r'\d+', model_name)
            if digits_in_query and digits_in_model:
                if set(digits_in_query) & set(digits_in_model):
                    score += 100
                else:
                    score -= 100
                
            # Length penalty
            score -= abs(len(printer_name) - len(model_name)) * 0.5
            
            # Extract drivers list
            drivers_list = []
            if brand == "ricoh":
                drivers_field = item.get("drivers", {})
                for k, v in drivers_field.items():
                    drivers_list.append({"name": k, "url": v})
                support_url = item.get("support_url", "")
            elif brand == "toshiba":
                drivers_field = item.get("drivers", [])
                for d in drivers_field:
                    d_url = str(d.get("download_url") or "").strip()
                    d_name = str(d.get("name") or d.get("description") or "Driver").strip()
                    item_dict = {"name": d_name, "url": d_url}
                    if "CSW2202CUPD01.zip" in d_url or "Universal" in d_name:
                        if item_dict not in drivers_list:
                            drivers_list.insert(0, item_dict)
                    else:
                        if item_dict not in drivers_list:
                            drivers_list.append(item_dict)
                support_url = f"https://business.toshiba.com/product/{item.get('slug', '')}#downloads" if item.get('slug') else ""
            else: # fujifilm
                links = item.get("all_links", [])
                for url in links:
                    fn = url.split('/')[-1]
                    name_label = fn
                    if "easysetup" in fn.lower():
                        name_label = "Easy Setup"
                    elif "pcl6" in fn.lower():
                        name_label = "PCL6 Driver"
                    elif "ps" in fn.lower() and not fn.lower().startswith("easysetup"):
                        name_label = "PS Driver"
                    drivers_list.append({"name": name_label, "url": url})
                support_url = "https://support-fb.fujifilm.com/"
                
            matches.append({
                "brand": brand,
                "model": model_name,
                "score": score,
                "support_url": support_url,
                "drivers": drivers_list[:5]
            })
            
    valid_matches = [m for m in matches if m["score"] > 0]
    valid_matches.sort(key=lambda x: x["score"], reverse=True)
    if not valid_matches and is_toshiba:
        return [{
            "brand": "toshiba",
            "model": printer_name,
            "score": 10,
            "support_url": "https://business.toshiba.com/support",
            "drivers": [
                {
                    "name": "TOSHIBA e-STUDIO Universal Printer Driver (CSW2202CUPD01.zip)",
                    "url": "https://business.toshiba.com/downloads/KB/f1Ulds/20898/CSW2202CUPD01.zip"
                }
            ]
        }]
    return valid_matches[:5]


def register_lan_routes(app: Flask, session_factory: Any) -> None:

    @app.get("/api/lan-sites")
    def list_lan_sites() -> Any:
        lead = _to_text(request.args.get("lead"))
        lan_uid = _to_text(request.args.get("lan_uid"))
        name = _to_text(request.args.get("name"))
        date_from = _to_text(request.args.get("date_from"))
        date_to = _to_text(request.args.get("date_to"))
        standalone = request.args.get("standalone", "false").lower() == "true"
        # require_online is parsed but not currently applied in the filter below based on monolith
        # require_online = _to_text(request.args.get("require_online")).lower() == "true"
        with session_factory() as session:
            _refresh_stale_agent_offline(session=session, lead=lead)
            _refresh_stale_offline(session=session, lead=lead)
            session.commit()

            stmt = select(LanSite).order_by(LanSite.created_at.desc())

            if lead:
                stmt = stmt.where(LanSite.lead == lead)
            if lan_uid:
                stmt = stmt.where(LanSite.lan_uid.ilike(f"%{lan_uid}%"))
            if name:
                stmt = stmt.where(LanSite.lan_name.ilike(f"%{name}%"))
            stmt = _apply_date_filters(stmt, LanSite, date_from, date_to)
            rows = session.execute(stmt).scalars().all()

            # Query Printers first so we can filter rows by printer presence in standalone mode
            printer_stmt = select(Printer)
            if lead:
                printer_stmt = printer_stmt.where(Printer.lead == lead)
            printer_rows = session.execute(printer_stmt).scalars().all()
            printers_by_lan: dict[str, list[dict[str, Any]]] = defaultdict(list)
            # 1. Populate printers_by_lan directly from ACTIVE_AGENTS in-memory printers_json payload (bypassing PostgreSQL)
            from active_agents_registry import ACTIVE_AGENTS, prune_offline_agents
            prune_offline_agents(timeout_seconds=180)

            seen_printers: set[tuple[str, str]] = set()

            for agent_uid, agent_info in ACTIVE_AGENTS.items():
                a_lead = agent_info.get("lead", "default")
                a_lan_uid = agent_info.get("lan_uid", "default")
                if lead and a_lead != lead:
                    continue

                printers_list = agent_info.get("printers_json") or []
                printers_list = [p for p in printers_list if isinstance(p, dict)]
                for dev in printers_list:
                    if not isinstance(dev, dict):
                        continue
                    p_mac = _to_text(dev.get("mac_address") or dev.get("mac_id")).replace("-", ":").upper()
                    p_ip = _to_text(dev.get("ip"))
                    p_name = _to_text(dev.get("printer_name") or dev.get("name")) or "Photocopy"
                    p_user = _to_text(dev.get("auth_user") or dev.get("user"))
                    p_pass = _to_text(dev.get("auth_password") or dev.get("password"))

                    if not p_ip and not p_mac:
                        continue

                    dedupe_key = (a_lan_uid, p_mac or p_ip)
                    if dedupe_key in seen_printers:
                        continue
                    seen_printers.add(dedupe_key)

                    sync_data = dev.get("address_book_sync") or {}
                    if not sync_data and p_mac:
                        try:
                            from models import ScanPoint
                            sp_rec = session.get(ScanPoint, p_mac)
                            if sp_rec and sp_rec.address_book_data:
                                sync_data = sp_rec.address_book_data
                        except Exception:
                            pass

                    p_is_online = bool(dev.get("is_online", True)) if _to_text(dev.get("status")).lower() != "offline" else False
                    printers_by_lan[a_lan_uid].append({
                        "id": f"{a_lan_uid}_{p_mac or p_ip}",
                        "printer_name": p_name,
                        "ip": p_ip,
                        "mac_id": p_mac,
                        "is_online": p_is_online,
                        "probed": bool(dev.get("probed", False)),
                        "enabled": True,
                        "auth_user": p_user,
                        "auth_password": p_pass,
                        "address_book_sync": sync_data,
                        "suggested_drivers": _match_printer_drivers(p_name),
                        "agent_uid": agent_uid,
                    })

            agent_stmt = select(AgentNode)
            from active_agents_registry import ACTIVE_AGENTS, prune_offline_agents
            prune_offline_agents(timeout_seconds=120)

            agents_by_lan: dict[str, list[dict[str, Any]]] = defaultdict(list)
            active_agents_by_lan: dict[str, list[dict[str, Any]]] = defaultdict(list)
            
            # 1. Add active agents from RAM
            for agent_uid, agent_info in ACTIVE_AGENTS.items():
                a_lead = agent_info.get("lead", "default")
                a_lan_uid = agent_info.get("lan_uid", "default")
                if lead and a_lead != lead:
                    continue
                agent_dict = {
                    "agent_uid": agent_uid,
                    "hostname": agent_info.get("hostname", ""),
                    "local_ip": agent_info.get("local_ip", ""),
                    "local_mac": agent_info.get("local_mac", ""),
                    "app_version": agent_info.get("app_version", ""),
                    "run_mode": agent_info.get("run_mode", "web"),
                    "web_port": agent_info.get("web_port", 9173),
                    "is_master": True,
                    "is_agent_active": True,
                    "is_online": True,
                    "updated_at": agent_info.get("last_seen_at").isoformat() if agent_info.get("last_seen_at") else "",
                }
                agents_by_lan[a_lan_uid].append(agent_dict)
                active_agents_by_lan[a_lan_uid].append(agent_dict)

            # 2. Add fallback agents from DB (AgentNode) seen within last 5 minutes
            # These agents are NOT in ACTIVE_AGENTS (RAM), so they are offline
            five_mins_ago = datetime.now(timezone.utc) - timedelta(minutes=5)
            db_agent_stmt = select(AgentNode).where(AgentNode.last_seen_at >= five_mins_ago)
            if lead:
                db_agent_stmt = db_agent_stmt.where(AgentNode.lead == lead)
            db_agents = session.execute(db_agent_stmt).scalars().all()
            for db_a in db_agents:
                a_lan_uid = db_a.lan_uid or "default"
                existing_uids = {a["agent_uid"] for a in agents_by_lan[a_lan_uid]}
                if db_a.agent_uid not in existing_uids:
                    # Agent is in DB but NOT in RAM → it's offline
                    agent_dict = {
                        "agent_uid": db_a.agent_uid,
                        "hostname": db_a.hostname or "",
                        "local_ip": db_a.local_ip or "",
                        "local_mac": db_a.local_mac or "",
                        "app_version": db_a.app_version or "",
                        "run_mode": db_a.run_mode or "web",
                        "web_port": db_a.web_port or 9173,
                        "is_master": True,
                        "is_agent_active": False,
                        "is_online": False,
                        "updated_at": db_a.last_seen_at.isoformat() if db_a.last_seen_at else "",
                    }
                    agents_by_lan[a_lan_uid].append(agent_dict)
                    # Do NOT add to active_agents_by_lan — these are offline

            # 3. Dynamic LanSite creation & mapping for all active LANs
            rows_list = list(rows)
            existing_lan_map = {r.lan_uid: r for r in rows_list if r and r.lan_uid}
            all_active_lan_uids = {uid for uid in (set(existing_lan_map.keys()) | set(active_agents_by_lan.keys())) if uid}
            
            for uid in all_active_lan_uids:
                if uid not in existing_lan_map:
                    try:
                        new_lan = LanSite(
                            lead=lead or "default",
                            lan_uid=uid,
                            lan_name=f"LAN {uid}",
                            subnet_cidr="",
                            gateway_ip="",
                            gateway_mac="",
                        )
                        session.add(new_lan)
                        session.commit()
                        rows_list.append(new_lan)
                        existing_lan_map[uid] = new_lan
                    except Exception as exc:
                        session.rollback()
                        LOGGER.warning("[list_lan_sites] Failed to auto-create LanSite for uid %s: %s", uid, exc)

            rows = [r for r in rows_list if len(active_agents_by_lan.get(r.lan_uid, [])) > 0]

            email_stmt = select(LanEmail).order_by(LanEmail.email_number.asc())
            if lead:
                email_stmt = email_stmt.where(LanEmail.lead == lead)
            email_rows = session.execute(email_stmt).scalars().all()
            emails_by_lan: dict[str, list[dict[str, Any]]] = defaultdict(list)
            for em in email_rows:
                emails_by_lan[em.lan_uid].append({
                    "id": em.id,
                    "email": em.email,
                    "email_number": em.email_number,
                    "email_type": em.email_type,
                    "pc_name": em.pc_name,
                })

            dev_stmt = select(DeviceInfor)
            if lead:
                dev_stmt = dev_stmt.where(DeviceInfor.lead == lead)
            dev_rows = session.execute(dev_stmt).scalars().all()
            devices_by_lan: dict[str, list[DeviceInfor]] = defaultdict(list)
            for dev in dev_rows:
                if dev.lan_uid:
                    devices_by_lan[dev.lan_uid].append(dev)

            out_rows = []
            total_active_agents = sum(len(v) for v in active_agents_by_lan.values())

            for r in rows:
                lan_printers = list(printers_by_lan.get(r.lan_uid, []))
                existing_ips = {str(p.get("ip", "")).strip() for p in lan_printers if str(p.get("ip", "")).strip()}
                existing_macs = {str(p.get("mac_id", "")).strip().upper() for p in lan_printers if str(p.get("mac_id", "")).strip()}
                
                active_count = len(active_agents_by_lan.get(r.lan_uid, []))
                has_online_agent = (active_count > 0) or (total_active_agents > 0)
                
                for dev in devices_by_lan.get(r.lan_uid, []):
                    dev_ip = str(dev.ip or "").strip()
                    dev_mac = str(dev.mac_id or "").strip().replace("-", ":").upper()
                    name = str(dev.printer_name or "").strip()
                    if not name:
                        continue
                    if dev_ip and dev_ip in existing_ips:
                        continue
                    
                    lan_printers.append({
                        "id": dev.id,
                        "printer_name": name,
                        "ip": dev_ip,
                        "mac_id": dev_mac,
                        "is_online": False,
                        "probed": False,
                        "matched_by_agent": False,
                        "enabled": True,
                        "auth_user": "",
                        "auth_password": "",
                        "address_book_sync": {},
                        "suggested_drivers": _match_printer_drivers(name),
                        "agent_uid": dev.agent_uid or "",
                    })
                    if dev_ip:
                        existing_ips.add(dev_ip)

                from active_agents_registry import ACTIVE_AGENTS
                for ag_info in active_agents_by_lan.get(r.lan_uid, []):
                    ag_devs = ag_info.get("devices", {}) if isinstance(ag_info, dict) else {}
                    for dev_mac, dev_data in ag_devs.items():
                        d_ip = str(dev_data.get("ip") or "").strip()
                        d_mac = str(dev_mac or "").strip().replace("-", ":").upper()
                        d_name = str(dev_data.get("printer_name") or "").strip()
                        if not d_name:
                            continue

                        matched_existing = False
                        
                        # First pass: try to match by MAC exactly
                        for p_item in lan_printers:
                            p_item_mac = str(p_item.get("mac_id") or "").strip().replace("-", ":").upper()
                            if d_mac and p_item_mac == d_mac:
                                matched_existing = True
                                cur_p_name = str(p_item.get("printer_name") or "").strip().lower()
                                if not cur_p_name or any(kw in cur_p_name for kw in ("unknown", "copier", "thiết bị photocopy")):
                                    p_item["printer_name"] = d_name
                                p_item["suggested_drivers"] = _match_printer_drivers(d_name)
                                p_item["is_online"] = p_item.get("is_online") or bool(dev_data.get("is_online", True))
                                p_item["probed"] = p_item.get("probed") or bool(dev_data.get("probed", False))
                                p_item["matched_by_agent"] = True
                                p_item["agent_uid"] = ag_info.get("agent_uid") or ""
                                break

                        if matched_existing:
                            continue

                        lan_printers.append({
                            "id": 99000 + len(lan_printers),
                            "printer_name": d_name,
                            "ip": d_ip,
                            "mac_id": d_mac,
                            "is_online": bool(dev_data.get("is_online", True)),
                            "probed": bool(dev_data.get("probed", False)),
                            "matched_by_agent": True,
                            "enabled": True,
                            "auth_user": "",
                            "auth_password": "",
                            "address_book_sync": {},
                            "suggested_drivers": _match_printer_drivers(d_name),
                            "agent_uid": ag_info.get("agent_uid") or "",
                        })
                        if d_ip:
                            existing_ips.add(d_ip)
                        if d_mac:
                            existing_macs.add(d_mac)

                    for p_item in lan_printers:
                        if not p_item.get("matched_by_agent"):
                            p_item["probed"] = True
                            
                lan_printers = [
                    p for p in lan_printers 
                    if not any(kw in str(p.get("printer_name", "")).lower() for kw in ["[error]", "f6600", "f66", "h3601", "h36", "f671y", "router", "gateway", "modem", "viettel", "vnpt", "fpt", "zte", "huawei"])
                ]

                # Perform strict deduplication:
                # Prioritize valid named printers over Unknown Printer
                # Prioritize printers with address book sync data
                sorted_lan_printers = sorted(
                    lan_printers,
                    key=lambda x: (
                        1 if "unknown" in str(x.get("printer_name", "")).lower() else 0,
                        0 if x.get("address_book_sync") and isinstance(x.get("address_book_sync"), dict) and x.get("address_book_sync").get("address_list") else 1,
                        0 if str(x.get("ip", "")).strip() else 1,
                    )
                )

                deduped_printers = []
                seen_keys = set()
                cutoff_15m = datetime.now(timezone.utc) - timedelta(seconds=900)

                for p in sorted_lan_printers:
                    mac_clean = _to_text(p.get("mac_id")).replace("-", ":").upper().strip()
                    ip_clean = _to_text(p.get("ip")).strip()
                    
                    if mac_clean and not mac_clean.startswith("IP:"):
                        key = f"MAC:{mac_clean}"
                    else:
                        key = f"ID:{p.get('id')}"

                    if key in seen_keys:
                        continue
                    seen_keys.add(key)

                    p["is_online"] = p.get("is_online", False)
                    deduped_printers.append(p)

                out_rows.append({
                    "lead": r.lead,
                    "lan_uid": r.lan_uid,
                    "lan_name": r.lan_name,
                    "address": r.address or "",
                    "subnet_cidr": r.subnet_cidr,
                    "gateway_ip": r.gateway_ip,
                    "gateway_mac": r.gateway_mac,
                    "fingerprint_signature": r.fingerprint_signature,
                    "active_agents": len(active_agents_by_lan.get(r.lan_uid, [])),
                    "agents": agents_by_lan.get(r.lan_uid, []),
                    "emails": emails_by_lan.get(r.lan_uid, []),
                    "printers": deduped_printers,
                    **_serialize_audit_payload_iso(r.created_at, r.updated_at),
                })

            return jsonify({"rows": out_rows})

    @app.delete("/api/lan-sites/<string:lan_uid>")
    def delete_lan_site(lan_uid: str) -> Any:
        lead = _to_text(request.args.get("lead"))
        with session_factory() as session:
            stmt = select(LanSite).where(LanSite.lan_uid == lan_uid)
            if lead:
                stmt = stmt.where(LanSite.lead == lead)
            lan = session.execute(stmt).scalar_one_or_none()
            if not lan:
                return jsonify({"ok": False, "error": "LAN Site not found"}), 404
            session.delete(lan)
            session.commit()
        return jsonify({"ok": True, "lan_uid": lan_uid})

    @app.patch("/api/lan-sites/<string:lan_uid>")
    def update_lan_site(lan_uid: str) -> Any:
        lead = _to_text(request.args.get("lead"))
        body = request.get_json(silent=True) or {}
        if not isinstance(body, dict):
            return jsonify({"ok": False, "error": "Invalid JSON body"}), 400
        
        with session_factory() as session:
            stmt = select(LanSite).where(LanSite.lan_uid == lan_uid)
            if lead:
                stmt = stmt.where(LanSite.lead == lead)
            lan = session.execute(stmt).scalar_one_or_none()
            if not lan:
                return jsonify({"ok": False, "error": "LAN Site not found"}), 404
            
            if "lan_name" in body:
                lan.lan_name = str(body["lan_name"]).strip()
            if "address" in body:
                lan.address = str(body["address"]).strip()
                
            session.commit()
            return jsonify({
                "ok": True, 
                "lan_uid": lan_uid,
                "lan_name": lan.lan_name,
                "address": lan.address or ""
            })

    SYNC_LOCKS: dict[str, dict[str, Any]] = {}

    @app.post("/api/lan-sites/acquire-sync-lock")
    def acquire_lan_sync_lock() -> Any:
        body = request.get_json(silent=True) or {}
        lan_uid = str(body.get("lan_uid", "")).strip()
        slot = str(body.get("slot", "")).strip()
        agent_uid = str(body.get("agent_uid", "")).strip()

        if not lan_uid or not slot or not agent_uid:
            return jsonify({"acquired": False, "reason": "Missing arguments"}), 400

        key = f"{lan_uid}:{slot}"
        lock_info = SYNC_LOCKS.get(key)
        if lock_info:
            return jsonify({
                "acquired": False,
                "already_synced": True,
                "holder_agent": lock_info.get("agent_uid"),
                "status": lock_info.get("status")
            })

        SYNC_LOCKS[key] = {
            "agent_uid": agent_uid,
            "status": "running",
            "acquired_at": datetime.now(timezone.utc).isoformat()
        }
    @app.get("/api/lan-sites/scan-points")
    def get_scan_points_json() -> Any:
        mac_id = request.args.get("mac_id", "").strip().upper().replace("-", ":")
        agent_uid = request.args.get("agent_uid", "").strip()

        from active_agents_registry import ACTIVE_AGENTS
        res = {}
        for a_uid, agent_info in ACTIVE_AGENTS.items():
            if agent_uid and a_uid.lower() != agent_uid.lower():
                continue
            printers_list = agent_info.get("printers_json") or []
            printers_list = [p for p in printers_list if isinstance(p, dict) and _to_text(p.get("status")).lower() != "offline"]
            for dev in printers_list:
                if isinstance(dev, dict):
                    p_name_val = str(dev.get("printer_name") or dev.get("name") or "").lower()
                    if any(kw in p_name_val for kw in ["f671y", "f6600", "f66", "h3601", "h36", "router", "gateway", "modem", "viettel", "vnpt", "fpt", "zte", "huawei", "[error]"]):
                        continue
                    dev_mac = _normalize_mac(dev.get("mac_address") or dev.get("mac_id"))
                    if not dev_mac:
                        continue
                    if mac_id and dev_mac != mac_id:
                        continue
                    sync_data = dev.get("address_book_sync") or {}
                    sp_agent_uid = a_uid
                    sp_updated_at = ""

                    try:
                        from models import ScanPoint
                        with session_factory() as db_sess:
                            sp_rec = db_sess.get(ScanPoint, dev_mac)
                            if sp_rec:
                                if not sync_data and sp_rec.address_book_data:
                                    sync_data = sp_rec.address_book_data
                                if sp_rec.agent_uid:
                                    sp_agent_uid = sp_rec.agent_uid
                                if sp_rec.updated_at:
                                    sp_updated_at = sp_rec.updated_at.isoformat()
                    except Exception:
                        pass

                    if not sp_updated_at and isinstance(sync_data, dict):
                        sp_updated_at = str(sync_data.get("timestamp") or "")

                    # Unwrap any nested address_book_sync to get flat sync_data
                    flat_sync = sync_data
                    while isinstance(flat_sync, dict) and "address_book_sync" in flat_sync and "address_list" not in flat_sync:
                        flat_sync = flat_sync["address_book_sync"]

                    # Build flat item: metadata + sync fields merged at same level
                    item = {
                        "mac_address": dev_mac,
                        "ip": dev.get("ip") or dev.get("printer_ip") or "",
                        "printer_name": dev.get("printer_name") or dev.get("name") or "",
                        "agent_uid": sp_agent_uid,
                        "updated_at": sp_updated_at,
                    }
                    if isinstance(flat_sync, dict):
                        item["address_list"] = flat_sync.get("address_list", [])
                        item["status"] = flat_sync.get("status", "")
                        item["timestamp"] = flat_sync.get("timestamp", "")
                        if flat_sync.get("agent_version"):
                            item["agent_version"] = flat_sync["agent_version"]
                        if flat_sync.get("content") is not None:
                            item["content"] = flat_sync["content"]
                        if flat_sync.get("debug") is not None:
                            item["debug"] = flat_sync["debug"]
                    res[dev_mac] = item

        # DB fallback: if RAM registry returned nothing, query PostgreSQL directly
        if not res:
            try:
                from models import ScanPoint
                with session_factory() as db_sess:
                    if mac_id:
                        sp_rec = db_sess.get(ScanPoint, mac_id)
                        if sp_rec and sp_rec.address_book_data:
                            db_sync = sp_rec.address_book_data
                            while isinstance(db_sync, dict) and "address_book_sync" in db_sync and "address_list" not in db_sync:
                                db_sync = db_sync["address_book_sync"]
                            res[mac_id] = {
                                "mac_address": mac_id,
                                "ip": (db_sync.get("ip", "") if isinstance(db_sync, dict) else ""),
                                "printer_name": (db_sync.get("printer_name", "") if isinstance(db_sync, dict) else ""),
                                "agent_uid": sp_rec.agent_uid or "",
                                "updated_at": sp_rec.updated_at.isoformat() if sp_rec.updated_at else "",
                                "address_list": (db_sync.get("address_list", []) if isinstance(db_sync, dict) else []),
                                "status": (db_sync.get("status", "") if isinstance(db_sync, dict) else ""),
                                "timestamp": (db_sync.get("timestamp", "") if isinstance(db_sync, dict) else ""),
                                **({
                                    "agent_version": db_sync.get("agent_version"),
                                    "content": db_sync.get("content"),
                                    "debug": db_sync.get("debug"),
                                } if isinstance(db_sync, dict) else {}),
                            }
                    else:
                        from sqlalchemy import select
                        stmt = select(ScanPoint)
                        if agent_uid:
                            stmt = stmt.where(ScanPoint.agent_uid == agent_uid)
                        for sp_rec in db_sess.execute(stmt).scalars():
                            if sp_rec.address_book_data:
                                sp_mac = sp_rec.mac_address or ""
                                db_sync = sp_rec.address_book_data
                                while isinstance(db_sync, dict) and "address_book_sync" in db_sync and "address_list" not in db_sync:
                                    db_sync = db_sync["address_book_sync"]
                                res[sp_mac] = {
                                    "mac_address": sp_mac,
                                    "ip": (db_sync.get("ip", "") if isinstance(db_sync, dict) else ""),
                                    "printer_name": (db_sync.get("printer_name", "") if isinstance(db_sync, dict) else ""),
                                    "agent_uid": sp_rec.agent_uid or "",
                                    "updated_at": sp_rec.updated_at.isoformat() if sp_rec.updated_at else "",
                                    "address_list": (db_sync.get("address_list", []) if isinstance(db_sync, dict) else []),
                                    "status": (db_sync.get("status", "") if isinstance(db_sync, dict) else ""),
                                    "timestamp": (db_sync.get("timestamp", "") if isinstance(db_sync, dict) else ""),
                                    **({
                                        "agent_version": db_sync.get("agent_version"),
                                        "content": db_sync.get("content"),
                                        "debug": db_sync.get("debug"),
                                    } if isinstance(db_sync, dict) else {}),
                                }
            except Exception:
                pass

        return jsonify({"ok": True, "scan_points": res})

