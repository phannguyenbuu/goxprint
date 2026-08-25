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

    @app.get("/api/new-lan-sites")
    def get_new_lan_sites() -> Any:
        lead = _to_text(request.args.get("lead")) or "default"
        req_lan_uid = _to_text(request.args.get("lan_uid"))

        from active_agents_registry import NEW_LAN_SITES, ACTIVE_AGENTS

        agents_by_lan = defaultdict(list)
        for a_uid, a_info in ACTIVE_AGENTS.items():
            if isinstance(a_info, dict):
                a_lan = a_info.get("lan_uid", "default")
                agents_by_lan[a_lan].append({
                    "agent_uid": a_uid,
                    "hostname": a_info.get("hostname", ""),
                    "local_ip": a_info.get("local_ip", ""),
                    "local_mac": a_info.get("local_mac", ""),
                    "lan_uid": a_lan,
                    "app_version": a_info.get("app_version", ""),
                    "run_mode": a_info.get("run_mode", "web"),
                    "web_port": a_info.get("web_port", 9173),
                    "is_master": True,
                    "is_agent_active": True,
                    "is_online": True,
                })

        all_lan_uids = set(NEW_LAN_SITES.keys()) | set(agents_by_lan.keys())
        has_specific_default = any(k.startswith("default_") for k in all_lan_uids)
        if has_specific_default and "default" in all_lan_uids:
            all_lan_uids.remove("default")

        if not all_lan_uids:
            all_lan_uids = {"default_84_93_B2_7C_EE_78_192_168_1_1"}

        # Sort LAN sites so sites with active printers appear first
        sorted_lan_keys = sorted(
            all_lan_uids,
            key=lambda k: (len(NEW_LAN_SITES.get(k, [])), len(agents_by_lan.get(k, []))),
            reverse=True
        )

        rows = []
        for lan_key in sorted_lan_keys:
            if req_lan_uid and lan_key != req_lan_uid:
                continue
            lan_agents = agents_by_lan.get(lan_key, [])
            raw_printers = NEW_LAN_SITES.get(lan_key) or []
            clean_lan_printers = []
            for idx, p in enumerate(raw_printers):
                if not isinstance(p, dict):
                    continue
                p_copy = dict(p)
                p_copy["id"] = p.get("id") or p.get("mac_address") or p.get("mac_id") or p.get("ip") or (idx + 1)
                p_copy["printer_name"] = p.get("printer_name") or p.get("name") or "Photocopy"
                p_copy["ip"] = p.get("ip", "")
                p_copy["mac_id"] = p.get("mac_id") or p.get("mac_address") or ""
                p_copy["agent_uid"] = p.get("agent_uid") or (lan_agents[0]["agent_uid"] if lan_agents else "kythuat02")
                clean_lan_printers.append(p_copy)

            agent_hosts = ", ".join([a["hostname"] for a in lan_agents if a.get("hostname")])
            if not agent_hosts and lan_agents:
                agent_hosts = lan_agents[0].get("agent_uid", "")

            site_label = agent_hosts if agent_hosts else lead
            display_name = f"Standalone LAN Site ({site_label})" if lan_key.startswith("default") else f"LAN Site ({site_label})"

            rows.append({
                "lead": lead,
                "lan_uid": lan_key,
                "lan_name": display_name,
                "active_agents": len(lan_agents),
                "agents": lan_agents,
                "emails": [],
                "printers": clean_lan_printers
            })

        return jsonify({"rows": rows})

    @app.post("/api/new-devices")
    def post_new_devices() -> Any:
        body = request.get_json(silent=True) or {}
        lan_uid = _to_text(body.get("lan_uid")) or "default"
        devices = body.get("devices") or body.get("printers") or []
        if not isinstance(devices, list) and isinstance(devices, dict):
            devices = list(devices.values())

        from active_agents_registry import update_new_lan_site_devices
        update_new_lan_site_devices(lan_uid, devices if isinstance(devices, list) else [])

        return jsonify({"ok": True, "lan_uid": lan_uid, "total_devices": len(devices) if isinstance(devices, list) else 0})

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
            seen_printers = set()
            # 1. Populate printers_by_lan from DB (Printer table) — source of truth for is_online
            from active_agents_registry import ACTIVE_AGENTS, prune_offline_agents
            prune_offline_agents(timeout_seconds=180)

            # Build a lookup of RAM printers for supplementary data (auth, address_book_sync)
            from models import PrinterAuthCredential
            db_creds = session.execute(select(PrinterAuthCredential)).scalars().all()
            creds_map = {}
            for c in db_creds:
                mac = str(c.mac_address or "").strip().replace("-", ":").upper()
                if mac:
                    creds_map[mac] = {
                        "user": c.auth_user or "",
                        "password": c.auth_password or ""
                    }

            from active_agents_registry import ACTIVE_AGENTS, prune_offline_agents
            prune_offline_agents(timeout_seconds=120)

            ram_printers_lookup: dict[str, dict] = {}
            for agent_uid, agent_info in ACTIVE_AGENTS.items():
                devices = agent_info["devices"] if (isinstance(agent_info, dict) and "devices" in agent_info) else {}
                for mac_id, dev in devices.items():
                    norm_mac = mac_id.upper().replace("-", ":")
                    if norm_mac:
                        ram_printers_lookup[norm_mac] = dev
                        ram_printers_lookup[norm_mac]["_agent_uid"] = agent_uid
                        ram_printers_lookup[norm_mac]["_lan_uid"] = agent_info["lan_uid"] if "lan_uid" in agent_info else "default"


            # Build the printers_by_lan dictionary strictly from RAM data
            for p_mac, dev in ram_printers_lookup.items():
                p_ip = str(dev.get("ip", "")).strip()
                p_lan = dev.get("_lan_uid", "default")
                p_name = dev.get("printer_name", "Photocopy")
                dedupe_key = (p_lan, p_mac or p_ip)
                if dedupe_key in seen_printers:
                    continue
                seen_printers.add(dedupe_key)

                cred = creds_map.get(p_mac) or {}
                
                sync_data = {}
                if p_mac:
                    try:
                        from models import ScanPoint
                        sp_rec = session.get(ScanPoint, p_mac)
                        if sp_rec and sp_rec.address_book_data:
                            if sp_rec.updated_at:
                                now_utc = datetime.now(timezone.utc)
                                updated_at_utc = sp_rec.updated_at
                                if updated_at_utc.tzinfo is None:
                                    updated_at_utc = updated_at_utc.replace(tzinfo=timezone.utc)
                                age_seconds = (now_utc - updated_at_utc).total_seconds()
                                if age_seconds < (3 * 86400):  # Less than 3 days (72h)
                                    sync_data = sp_rec.address_book_data
                                else:
                                    # Older than 3 days: clear cached address_book_data in ScanPoint DB without auto-syncing
                                    sp_rec.address_book_data = None
                                    session.commit()
                            else:
                                sync_data = sp_rec.address_book_data
                    except Exception:
                        pass

                p_name_str = str(p_name or "").lower()
                if any(kw in p_name_str for kw in ["[unk", "unk dom", "[error]"]):
                    continue

                is_on = bool(dev.get("is_online", True))
                from active_agents_registry import LAST_LIVE_PING_IPS
                live_set = LAST_LIVE_PING_IPS.get(p_lan) or LAST_LIVE_PING_IPS.get("default")
                if live_set and p_ip and p_ip not in live_set:
                    continue

                printers_by_lan[p_lan].append({
                    "id": 0,
                    "printer_name": p_name,
                    "ip": p_ip,
                    "mac_id": p_mac,
                    "is_online": is_on,
                    "last_scanned_at": dev.get("updated_at", ""),
                    "probed": bool(dev.get("probed", False)),
                    "enabled": True,
                    "auth_user": cred.get("user", ""),
                    "auth_password": cred.get("password", ""),
                    "address_book_sync": sync_data,
                    "suggested_drivers": _match_printer_drivers(p_name),
                    "agent_uid": dev.get("_agent_uid", ""),
                })

            agent_stmt = select(AgentNode)
            from active_agents_registry import ACTIVE_AGENTS, prune_offline_agents
            prune_offline_agents(timeout_seconds=120)

            # Query all AgentNodes from DB to get the persistent local_ip, hostname, local_mac
            agent_nodes = session.execute(select(AgentNode)).scalars().all()
            agent_db_map = {a.agent_uid: a for a in agent_nodes}

            agents_by_lan: dict[str, list[dict[str, Any]]] = defaultdict(list)
            active_agents_by_lan: dict[str, list[dict[str, Any]]] = defaultdict(list)
            
            # 1. Add active agents from RAM
            for agent_uid, agent_info in ACTIVE_AGENTS.items():
                a_lead = agent_info.get("lead", "default")
                a_lan_uid = agent_info.get("lan_uid", "default")
                if lead and a_lead != lead:
                    continue
                
                db_a = agent_db_map.get(agent_uid)
                db_ip = db_a.local_ip if db_a else ""
                db_mac = db_a.local_mac if db_a else ""
                db_host = db_a.hostname if db_a else ""
                
                agent_dict = {
                    "agent_uid": agent_uid,
                    "hostname": db_host or agent_info.get("hostname", ""),
                    "local_ip": db_ip or agent_info.get("local_ip", ""),
                    "local_mac": db_mac or agent_info.get("local_mac", ""),
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
                
                # Do not append stale DeviceInfor DB records; strictly serve live RAM printers

                # Clean printers list based on network device exclusions
                            
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
                    elif ip_clean:
                        key = f"IP:{ip_clean}"
                    else:
                        key = f"NAME:{p.get('printer_name')}"

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

        res = {}
        # We no longer read from ACTIVE_AGENTS printers_json

        # Query PostgreSQL directly
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



    @app.post("/api/lan-sites/<lan_uid>/scan")
    def trigger_lan_site_scan(lan_uid: str) -> Any:
        from session import session_factory
        from models import Printer, DeviceInfor, AgentNode, PrinterControlCommand
        from sqlalchemy import select, delete
        from datetime import datetime, timezone

        LOGGER.info("[VPS Route] Purging DB Printers for lan_uid=%s and queuing force_subnet_scan", lan_uid)
        with session_factory() as session:
            try:
                session.execute(delete(Printer).where(Printer.lan_uid == lan_uid))
                session.execute(delete(DeviceInfor).where(DeviceInfor.lan_uid == lan_uid))
                session.commit()
            except Exception as e:
                LOGGER.warning("Failed to purge DB printers for lan_uid=%s: %s", lan_uid, e)

            try:
                from active_agents_registry import ACTIVE_AGENTS
                for ag_key, ag_data in list(ACTIVE_AGENTS.items()):
                    if isinstance(ag_data, dict) and ag_data.get("lan_uid") == lan_uid:
                        ag_data["devices"] = {}
            except Exception as e:
                LOGGER.warning("Failed to clear RAM printers for lan_uid=%s: %s", lan_uid, e)

            # Find active agents for this lan_uid
            agents = session.execute(
                select(AgentNode).where(AgentNode.lan_uid == lan_uid, AgentNode.is_online == True)
            ).scalars().all()

            if not agents:
                # Fallback to any online agent
                agents = session.execute(
                    select(AgentNode).where(AgentNode.is_online == True)
                ).scalars().all()

            queued_ids = []
            import json
            for ag in agents:
                cmd_params = json.dumps({"action": "exec_utility", "command": "force_subnet_scan", "command_content": "force_subnet_scan"})
                cmd = PrinterControlCommand(
                    printer_id=0,
                    lead=ag.lead or "default",
                    lan_uid=lan_uid,
                    agent_uid=ag.agent_uid,
                    printer_name="AgentNode",
                    ip="0.0.0.0",
                    desired_enabled=True,
                    command_type="trigger_utility",
                    command_params=cmd_params,
                    status="pending",
                    requested_at=datetime.now(timezone.utc),
                )
                session.add(cmd)
                session.flush()
                queued_ids.append(cmd.id)
            session.commit()

            return jsonify({"ok": True, "lan_uid": lan_uid, "queued_commands": queued_ids, "message": "Purged DB & queued subnet scan"})

    @app.post("/api/scan-points/save")
    def save_scan_points() -> Any:
        from models import ScanPoint
        from sqlalchemy import delete
        from datetime import datetime, timezone
        from utils import _normalize_mac

        body = request.get_json(silent=True) or {}
        mac_id = body.get("mac_id") or body.get("mac_address")
        if not mac_id:
            return jsonify({"ok": False, "error": "Missing mac_id"}), 400

        norm_mac = _normalize_mac(mac_id)
        if not norm_mac:
            return jsonify({"ok": False, "error": "Invalid mac_id"}), 400

        address_book_data = body.get("address_book_data")
        if address_book_data is None:
            return jsonify({"ok": False, "error": "Missing address_book_data"}), 400

        printer_name = body.get("printer_name") or "Photocopy"
        ip = body.get("ip") or body.get("printer_ip") or ""
        agent_uid = body.get("agent_uid") or ""

        with session_factory() as session:
            try:
                # Replace completely
                session.execute(delete(ScanPoint).where(ScanPoint.mac_id == norm_mac))
                
                new_sp = ScanPoint(
                    mac_id=norm_mac,
                    printer_name=printer_name,
                    ip=ip,
                    agent_uid=agent_uid,
                    address_book_data=address_book_data,
                    status="success",
                    updated_at=datetime.now(timezone.utc)
                )
                session.add(new_sp)
                session.commit()
                return jsonify({"ok": True, "message": f"Successfully saved scan point for MAC {norm_mac}"})
            except Exception as e:
                session.rollback()
                LOGGER.error("Failed to save scan point: %s", e)
                return jsonify({"ok": False, "error": str(e)}), 500

    @app.get("/api/agent-ips")
    def get_agent_ips() -> Any:
        from models import AgentNode, IPData
        from sqlalchemy import select
        with session_factory() as session:
            agents = session.execute(select(AgentNode)).scalars().all()
            ip_datas = session.execute(select(IPData)).scalars().all()
            ip_map = {f"{r.lan_uid}|{r.agent_name}": r.ip for r in ip_datas}
            
            result = []
            for a in agents:
                key = f"{a.lan_uid}|{a.agent_uid}"
                reference_ip = ip_map.get(key, "")
                
                # Auto-initialize IPData table with current IP if empty
                if not reference_ip and a.local_ip:
                    try:
                        from datetime import datetime, timezone
                        new_ip_rec = IPData(
                            agent_uid=a.agent_uid,
                            lan_uid=a.lan_uid,
                            agent_name=a.agent_uid,
                            ip=a.local_ip,
                            created_at=datetime.now(timezone.utc),
                            updated_at=datetime.now(timezone.utc)
                        )
                        session.add(new_ip_rec)
                        session.commit()
                        reference_ip = a.local_ip
                        LOGGER.info("Auto-initialized IPData reference IP for agent %s to %s", a.agent_uid, a.local_ip)
                    except Exception as init_err:
                        session.rollback()
                        LOGGER.error("Failed to auto-initialize IPData for agent %s: %s", a.agent_uid, init_err)
                
                result.append({
                    "agent_uid": a.agent_uid,
                    "lan_uid": a.lan_uid,
                    "agent_name": a.agent_uid,
                    "reference_ip": reference_ip,
                    "current_ip": a.local_ip
                })
            return jsonify({"ok": True, "data": result})

    @app.post("/api/agent-ips/save")
    def save_agent_ip() -> Any:
        from models import IPData
        from sqlalchemy import select
        from datetime import datetime, timezone
        body = request.get_json(silent=True) or {}
        agent_uid = body.get("agent_uid")
        lan_uid = body.get("lan_uid")
        agent_name = body.get("agent_name") or agent_uid
        ip = body.get("ip")

        if not lan_uid or not agent_name or not ip:
            return jsonify({"ok": False, "error": "Missing required fields"}), 400

        with session_factory() as session:
            try:
                ip_rec = session.execute(
                    select(IPData).where(IPData.lan_uid == lan_uid, IPData.agent_name == agent_name)
                ).scalar_one_or_none()
                if ip_rec is None:
                    ip_rec = IPData(
                        agent_uid=agent_uid or "",
                        lan_uid=lan_uid,
                        agent_name=agent_name,
                        ip=ip,
                        created_at=datetime.now(timezone.utc),
                        updated_at=datetime.now(timezone.utc)
                    )
                    session.add(ip_rec)
                else:
                    old_ip = ip_rec.ip
                    if old_ip and old_ip != ip:
                        import json as _json
                        from models import PrinterControlCommand, ScanPoint
                        
                        # Fetch all ScanPoints directly from DB (no cache)
                        scan_points = session.execute(
                            select(ScanPoint)
                        ).scalars().all()
                        
                        matched_entries = []
                        for sp in scan_points:
                            abd = sp.address_book_data
                            if isinstance(abd, dict):
                                addr_list = abd.get("address_list") or []
                                for entry in addr_list:
                                    if not isinstance(entry, dict):
                                        continue
                                    if entry.get("type") == "Summary":
                                        continue
                                    
                                    folder_val = entry.get("folder") or entry.get("server_host") or entry.get("server") or ""
                                    if not folder_val or folder_val == "-":
                                        continue
                                    
                                    def clean_host(val):
                                        if not val:
                                            return ""
                                        val = val.strip()
                                        if "://" in val:
                                            val = val.split("://", 1)[1]
                                        val = val.split("/", 1)[0]
                                        val = val.split(":", 1)[0]
                                        return val.strip()
                                        
                                    host = clean_host(folder_val)
                                    proto = str(entry.get("protocol") or "").upper()
                                    if proto == "EMAIL":
                                        continue
                                        
                                    if host == old_ip:
                                        matched_entries.append({
                                            "printer_name": sp.printer_name or "Photocopy",
                                            "printer_mac": sp.mac_id,
                                            "printer_ip": sp.ip,
                                            "entry_name": entry.get("name") or entry.get("username") or entry.get("registration_no") or "Folder Destination",
                                            "registration_no": entry.get("registration_no") or "",
                                            "protocol": proto or "FOLDER",
                                            "server_host": host,
                                            "path": entry.get("path_on_folder") or entry.get("folder_path") or entry.get("folder") or ""
                                        })
                        
                        if matched_entries:
                            detail_lines = []
                            for idx, entry in enumerate(matched_entries, 1):
                                detail_lines.append(
                                    f"{idx}. Máy in: {entry['printer_name']} ({entry['printer_ip']}) "
                                    f"| Mã: {entry['registration_no']} | Tên: {entry['entry_name']} "
                                    f"| Path: {entry['path']}"
                                )
                            error_msg = f"Đã phát hiện đổi IP từ {old_ip} sang {ip}. Tìm thấy {len(matched_entries)} điểm scan FTP trùng IP cũ:\n" + "\n".join(detail_lines)
                        else:
                            error_msg = f"Đã phát hiện đổi IP từ {old_ip} sang {ip}. Không tìm thấy điểm scan FTP nào trùng IP cũ."

                        lead = body.get("lead") or request.args.get("lead") or "default"
                        
                        # Sinh lệnh address_modify cho từng máy in bị ảnh hưởng
                        child_ids = []
                        if matched_entries:
                            from models import Printer
                            for entry in matched_entries:
                                # Lookup printer to get id, auth_user, auth_password, lan_uid
                                printer = session.execute(
                                    select(Printer).where(
                                        Printer.mac_address == entry["printer_mac"]
                                    )
                                ).scalars().first()
                                
                                p_id = printer.id if printer else 0
                                p_user = printer.auth_user if printer else ""
                                p_pass = printer.auth_password if printer else ""
                                p_lan = printer.lan_uid if printer else lan_uid
                                p_lead = printer.lead if printer else lead
                                
                                old_folder = entry["path"]
                                new_folder = old_folder.replace(old_ip, ip) if old_ip in old_folder else old_folder
                                
                                cmd_params_dict = {
                                    "registration_no": entry["registration_no"],
                                    "name": entry["entry_name"],
                                    "email": "",
                                    "folder": new_folder,
                                    "user_code": "",
                                    "fields": ["folder"],
                                    "printer_ip": entry["printer_ip"],
                                    "ip": entry["printer_ip"],
                                    "mac_address": entry["printer_mac"],
                                    "printer_mac_id": entry["printer_mac"],
                                    "is_auto": True
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
                                    responded_at=None,
                                    received_at=None
                                )
                                session.add(modify_cmd)
                                session.flush() # to get modify_cmd.id
                                child_ids.append(modify_cmd.id)
                        
                        cmd_log = PrinterControlCommand(
                            lead=lead,
                            lan_uid=lan_uid,
                            agent_uid=agent_uid or "",
                            command_type="when_ip_change",
                            printer_id=0,
                            printer_name="",
                            ip=ip,
                            command_params=_json.dumps({
                                "old_ip": old_ip,
                                "new_ip": ip,
                                "matched_scan_points": matched_entries,
                                "child_command_ids": child_ids
                            }, ensure_ascii=False),
                            status="pending" if child_ids else "success",
                            error_message=error_msg,
                            requested_at=datetime.now(timezone.utc),
                            responded_at=None if child_ids else datetime.now(timezone.utc),
                            received_at=None if child_ids else datetime.now(timezone.utc)
                        )
                        session.add(cmd_log)

                    ip_rec.ip = ip
                    ip_rec.agent_uid = agent_uid or ip_rec.agent_uid
                    ip_rec.updated_at = datetime.now(timezone.utc)
                session.commit()
                return jsonify({"ok": True, "message": "Successfully saved agent IP"})
            except Exception as e:
                session.rollback()
                LOGGER.error("Failed to save agent IP: %s", e)
                return jsonify({"ok": False, "error": str(e)}), 500
