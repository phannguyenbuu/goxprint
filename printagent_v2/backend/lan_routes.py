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

from utils import _to_text, _format_datetime_ui, _apply_date_filters
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
    query_numbers = [t for t in query_tokens if t.isdigit() or (any(c.isdigit() for c in t) and len(t) >= 2)]
    
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
                
            # Numeric token matching
            numeric_match = True
            for q_num in query_numbers:
                matched_num = False
                for m_tok in model_tokens:
                    if q_num in m_tok or m_tok in q_num:
                        matched_num = True
                        break
                if not matched_num:
                    numeric_match = False
                    break
                    
            if numeric_match and query_numbers:
                score += 100
            elif query_numbers and not numeric_match:
                score -= 50
                
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
                    drivers_list.append({"name": d.get("name") or d.get("description") or "Driver", "url": d.get("download_url") or ""})
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
            for p in printer_rows:
                sync_data = p.address_book_sync
                if isinstance(sync_data, str):
                    try:
                        sync_data = json.loads(sync_data)
                    except Exception:
                        sync_data = {}
                if isinstance(sync_data, dict) and "address_list" in sync_data:
                    from utils import _safe_path_token
                    safe_lan_uid = _safe_path_token(p.lan_uid)
                    enriched_list = []
                    for entry in sync_data.get("address_list", []):
                        if not isinstance(entry, dict):
                            enriched_list.append(entry)
                            continue
                        
                        email_val = entry.get("email_address") or entry.get("email") or ""
                        folder_val = entry.get("physical_path") or entry.get("folder") or entry.get("folder_path") or ""
                        dest_val = (email_val or folder_val or "").strip()
                        
                        file_count = 0
                        if dest_val:
                            if "\\" in dest_val:
                                dest_val_clean = dest_val.replace("\\", "/")
                            else:
                                dest_val_clean = dest_val
                            
                            safe_dest = _safe_path_token(dest_val_clean)
                            if dest_val_clean.startswith("ftp://") or "/" in dest_val_clean:
                                parts = [x for x in dest_val_clean.split("/") if x]
                                if parts:
                                    safe_dest = _safe_path_token(parts[-1])
                            
                            static_dir = Path("static/scans") / safe_lan_uid / safe_dest
                            if static_dir.exists():
                                try:
                                    file_count = len([x for x in static_dir.iterdir() if x.is_file() and not x.name.endswith(".meta.json")])
                                except Exception:
                                    pass
                        
                        entry_copy = dict(entry)
                        entry_copy["file_count"] = file_count
                        enriched_list.append(entry_copy)
                    
                    sync_data = dict(sync_data)
                    sync_data["address_list"] = enriched_list

                printers_by_lan[p.lan_uid].append({
                    "id": p.id,
                    "printer_name": p.printer_name,
                    "ip": p.ip,
                    "mac_id": p.mac_address,
                    "is_online": p.is_online,
                    "enabled": p.enabled,
                    "auth_user": p.auth_user or "",
                    "auth_password": p.auth_password or "",
                    "address_book_sync": sync_data,
                    "suggested_drivers": _match_printer_drivers(p.printer_name),
                    "agent_uid": p.agent_uid or "",
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
                    "is_online": True,
                    "updated_at": agent_info.get("last_seen_at").isoformat() if agent_info.get("last_seen_at") else "",
                }
                agents_by_lan[a_lan_uid].append(agent_dict)
                active_agents_by_lan[a_lan_uid].append(agent_dict)

            # 2. Add fallback active agents from DB (AgentNode) seen within last 5 minutes
            five_mins_ago = datetime.now(timezone.utc) - timedelta(minutes=5)
            db_agent_stmt = select(AgentNode).where(AgentNode.last_seen_at >= five_mins_ago)
            if lead:
                db_agent_stmt = db_agent_stmt.where(AgentNode.lead == lead)
            db_agents = session.execute(db_agent_stmt).scalars().all()
            for db_a in db_agents:
                a_lan_uid = db_a.lan_uid or "default"
                existing_uids = {a["agent_uid"] for a in agents_by_lan[a_lan_uid]}
                if db_a.agent_uid not in existing_uids:
                    agent_dict = {
                        "agent_uid": db_a.agent_uid,
                        "hostname": db_a.hostname or "",
                        "local_ip": db_a.local_ip or "",
                        "local_mac": db_a.local_mac or "",
                        "app_version": db_a.app_version or "",
                        "run_mode": db_a.run_mode or "web",
                        "web_port": db_a.web_port or 9173,
                        "is_master": True,
                        "is_online": db_a.is_online,
                        "updated_at": db_a.last_seen_at.isoformat() if db_a.last_seen_at else "",
                    }
                    agents_by_lan[a_lan_uid].append(agent_dict)
                    if db_a.is_online:
                        active_agents_by_lan[a_lan_uid].append(agent_dict)

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
                
                for p in lan_printers:
                    if has_online_agent and p.get("enabled") != False:
                        p["is_online"] = True

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
                        "is_online": has_online_agent,
                        "enabled": True,
                        "auth_user": "",
                        "auth_password": "",
                        "address_book_sync": {},
                        "suggested_drivers": _match_printer_drivers(name),
                        "agent_uid": dev.agent_uid or "",
                    })
                    if dev_ip:
                        existing_ips.add(dev_ip)

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

                for p in sorted_lan_printers:
                    mac_clean = _to_text(p.get("mac_id")).replace("-", ":").upper().strip()
                    ip_clean = _to_text(p.get("ip")).strip()
                    
                    if mac_clean and not mac_clean.startswith("IP:"):
                        key = f"MAC:{mac_clean}"
                    elif ip_clean:
                        key = f"IP:{ip_clean}"
                    else:
                        key = f"ID:{p.get('id')}"

                    if key in seen_keys:
                        continue
                    seen_keys.add(key)
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
