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

_DRIVERS_CACHE: dict[str, list[dict[str, Any]]] = {}

def _auto_record_client_public_ip(session: Any, req: Any) -> None:
    """Check if the requesting client's WAN public IP is already recorded in public_ip_history or allowed_public_ips.
    If not recorded yet, insert a new auto_discover record into public_ip_history."""
    try:
        raw_x_forwarded = req.headers.get("X-Forwarded-For", "")
        c_pub_ip = raw_x_forwarded.split(",")[0].strip() if raw_x_forwarded else (req.headers.get("X-Real-IP", "").strip() or req.remote_addr or "")
        if not c_pub_ip or c_pub_ip in ("127.0.0.1", "localhost", "::1"):
            return

        from models import PublicIpHistory, AllowedPublicIp
        from sqlalchemy import select
        existing_hist = session.execute(
            select(PublicIpHistory).where(
                (PublicIpHistory.ip_address == c_pub_ip) | (PublicIpHistory.client_public_ip == c_pub_ip)
            )
        ).scalars().first()

        existing_allowed = session.execute(
            select(AllowedPublicIp).where(
                (AllowedPublicIp.ip_address == c_pub_ip) | (AllowedPublicIp.client_public_ip == c_pub_ip)
            )
        ).scalars().first()

        if not existing_hist and not existing_allowed:
            m_info = (req.headers.get("User-Agent") or "")[:250]
            new_hist = PublicIpHistory(
                ip_address=c_pub_ip,
                action="auto_discover",
                description="Tự động phát hiện khi bấm nút quét mạng LAN (App Gox)",
                client_local_ip="",
                client_public_ip=c_pub_ip,
                machine_info=m_info,
                created_at=datetime.now(timezone.utc)
            )
            session.add(new_hist)
            session.flush()
            LOGGER.info("[_auto_record_client_public_ip] Auto-saved new client Public IP to history: %s", c_pub_ip)
    except Exception as exc:
        LOGGER.warning("[_auto_record_client_public_ip] Warning: %s", exc)

def _clean_tokens(name: str) -> list[str]:
    return re.findall(r'[a-zA-Z0-9]+', name.lower())

def _load_driver_catalog(brand: str) -> list[dict[str, Any]]:
    brand_clean = brand.lower().strip()
    if brand_clean in _DRIVERS_CACHE:
        return _DRIVERS_CACHE[brand_clean]
    
    base_dir = Path(__file__).resolve().parent
    candidates = [
        base_dir / "storage" / "drivers" / f"{brand_clean}.json",
        Path("/opt/printagent/storage/drivers") / f"{brand_clean}.json",
        Path.cwd() / "storage" / "drivers" / f"{brand_clean}.json",
        Path.cwd() / "backend" / "storage" / "drivers" / f"{brand_clean}.json",
    ]
    for catalog_file in candidates:
        if catalog_file.exists():
            try:
                with open(catalog_file, encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    _DRIVERS_CACHE[brand_clean] = data
                    LOGGER.info("Loaded %d catalog entries for %s from %s", len(data), brand_clean, catalog_file)
                    return data
            except Exception as e:
                LOGGER.error("Failed to load catalog for brand=%s from %s: %s", brand_clean, catalog_file, e)
    return []

def _match_printer_drivers(printer_name: str) -> list[dict[str, Any]]:
    if not printer_name:
        return []

    raw_p_name = str(printer_name).strip()

    # Prepend brand names if missing based on user directives:
    # 1. If name contains 'estudio' or 'e-studio' and doesn't start with TOSHIBA, prepend 'TOSHIBA '
    if re.search(r'e[-_]?studio', raw_p_name, re.IGNORECASE) and not raw_p_name.upper().startswith("TOSHIBA"):
        raw_p_name = f"TOSHIBA {raw_p_name}"
    # 2. If name contains uppercase 'MP' (or IM/Aficio) and doesn't start with RICOH, prepend 'RICOH '
    elif re.search(r'\b(MP|IM|Aficio)\b', raw_p_name) and not raw_p_name.upper().startswith("RICOH"):
        raw_p_name = f"RICOH {raw_p_name}"

    # Clean out IP addresses from printer_name (e.g. "RICOH MP (192.168.1.250)" -> "RICOH MP")
    clean_p_name = re.sub(r'\(?\b(?:\d{1,3}\.){3}\d{1,3}\b\)?', '', raw_p_name).strip()
    query_tokens = _clean_tokens(clean_p_name)
    if not query_tokens:
        query_tokens = _clean_tokens(raw_p_name)

    name_lower = (clean_p_name or raw_p_name).lower()
    brands_to_search = []
    
    is_ricoh = any(k in name_lower for k in ["ricoh", "aficio", "savin", "gestetner", "lanier", "infotec", "mp", "im", "pro"])
    is_toshiba = any(k in name_lower for k in ["toshiba", "e-studio", "estudio"])
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
    digits_in_query = re.findall(r'\d+', clean_p_name)
    
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
            score -= abs(len(clean_p_name) - len(model_name)) * 0.5
            
            # Extract drivers list (include ALL drivers for this model)
            drivers_list = []
            if brand == "ricoh":
                drivers_field = item.get("drivers", {})
                if isinstance(drivers_field, dict):
                    for k, v in drivers_field.items():
                        if v:
                            drivers_list.append({"name": str(k).strip(), "url": str(v).strip()})
                elif isinstance(drivers_field, list):
                    for d in drivers_field:
                        if isinstance(d, dict):
                            d_url = str(d.get("url") or d.get("download_url") or "").strip()
                            d_name = str(d.get("name") or d.get("description") or "Driver").strip()
                            if d_url:
                                drivers_list.append({"name": d_name, "url": d_url})
                
                # Include all_exe packages for complete Ricoh driver list!
                all_exe = item.get("all_exe", [])
                if isinstance(all_exe, list):
                    for exe_url in all_exe:
                        exe_str = str(exe_url).strip()
                        if exe_str and not any(d["url"] == exe_str for d in drivers_list):
                            fn = exe_str.split("/")[-1]
                            drivers_list.append({"name": f"Driver Package ({fn})", "url": exe_str})

                support_url = item.get("support_url", "")
            elif brand == "toshiba":
                drivers_field = item.get("drivers", [])
                if isinstance(drivers_field, list):
                    for d in drivers_field:
                        if isinstance(d, dict):
                            d_url = str(d.get("download_url") or d.get("url") or "").strip()
                            d_name = str(d.get("name") or d.get("description") or "Driver").strip()
                            if d_url:
                                item_dict = {"name": d_name, "url": d_url}
                                if "CSW2202CUPD01.zip" in d_url or "Universal" in d_name:
                                    if item_dict not in drivers_list:
                                        drivers_list.insert(0, item_dict)
                                else:
                                    if item_dict not in drivers_list:
                                        drivers_list.append(item_dict)
                support_url = f"https://business.toshiba.com/product/{item.get('slug', '')}#downloads" if item.get('slug') else ""
            else: # fujifilm
                links = item.get("all_links", []) or item.get("drivers", [])
                if isinstance(links, list):
                    for url_item in links:
                        if isinstance(url_item, str):
                            url = url_item.strip()
                            fn = url.split('/')[-1]
                            name_label = fn
                            if "easysetup" in fn.lower():
                                name_label = "Easy Setup"
                            elif "pcl6" in fn.lower():
                                name_label = "PCL6 Driver"
                            elif "ps" in fn.lower() and not fn.lower().startswith("easysetup"):
                                name_label = "PS Driver"
                            drivers_list.append({"name": name_label, "url": url})
                        elif isinstance(url_item, dict):
                            d_url = str(url_item.get("url") or url_item.get("download_url") or "").strip()
                            d_name = str(url_item.get("name") or "Driver").strip()
                            if d_url:
                                drivers_list.append({"name": d_name, "url": d_url})
                support_url = "https://support-fb.fujifilm.com/"
                
            if drivers_list:
                matches.append({
                    "brand": brand,
                    "model": model_name,
                    "score": score,
                    "support_url": support_url,
                    "drivers": drivers_list  # Return ALL drivers!
                })
            
    if matches:
        matches.sort(key=lambda x: x["score"], reverse=True)
        # If query has specific model digits (e.g. 7503, 6503, 4515), return ONLY exact model matches!
        if digits_in_query:
            exact_digit_matches = [m for m in matches if m["score"] > 50]
            if exact_digit_matches:
                return exact_digit_matches
        
        # If query is brand-wide (no model digits), return top matching brand models
        positive_matches = [m for m in matches if m["score"] >= 0]
        if positive_matches:
            return positive_matches[:10]
            
        return matches[:5]

    return []


def register_lan_routes(app: Flask, session_factory: Any) -> None:

    @app.get("/api/v1/match-drivers")
    @app.get("/api/match-drivers")
    def match_drivers_endpoint() -> Any:
        name = request.args.get("name") or request.args.get("printer_name") or request.args.get("model") or ""
        if not name:
            return jsonify({"success": False, "matches": [], "message": "Missing name parameter"}), 400
        matches = _match_printer_drivers(name)
        return jsonify({
            "success": True,
            "query": name,
            "total_matches": len(matches),
            "matches": matches
        })


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
            _auto_record_client_public_ip(session, request)
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
            existing_lan_map = {s.lan_uid: s for s in rows}

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
                        ag_pub = agent_info.get("public_ip") or agent_info.get("wan_ip", "")
                        ram_printers_lookup[norm_mac]["_lan_uid"] = ag_pub or agent_info.get("lan_uid", "default")


            # Sweep & hard-delete all ScanPoint records in PostgreSQL DB older than retention_days (default 30 days)
            from models import ScanPoint
            from sqlalchemy import delete
            from utils import get_system_settings
            sys_cfg = get_system_settings()
            retention_days = int(sys_cfg.get("scan_point_retention_days", 30))
            cutoff_date = datetime.now(timezone.utc) - timedelta(days=retention_days)
            try:
                deleted_count = session.execute(
                    delete(ScanPoint).where(ScanPoint.updated_at < cutoff_date)
                ).rowcount
                if deleted_count > 0:
                    session.commit()
                    LOGGER.info("[ScanPoint Cleanup] Hard deleted %d ScanPoint DB rows older than %d days from VPS DB", deleted_count, retention_days)
            except Exception as sweep_err:
                LOGGER.warning("Error running ScanPoint retention hard delete sweep: %s", sweep_err)

            for p_mac, dev in ram_printers_lookup.items():
                p_ip = str(dev.get("ip", "")).strip()
                p_lan = dev.get("_lan_uid", "default")
                p_name = dev.get("printer_name", "Photocopy")

                p_name_str = str(p_name or "").lower()
                if any(kw in p_name_str for kw in ["[unk", "unk dom", "[error]"]):
                    continue

                dedupe_key = (p_lan, p_mac or p_ip)
                if dedupe_key in seen_printers:
                    continue
                seen_printers.add(dedupe_key)

                cred = creds_map.get(p_mac) or creds_map.get(p_ip) or {}

                # Look up address_book_data in ScanPoint DB table by mac_id
                sync_data = {}
                if p_mac:
                    try:
                        sp_rec = session.get(ScanPoint, p_mac)
                        if sp_rec:
                            if sp_rec.updated_at:
                                now_utc = datetime.now(timezone.utc)
                                updated_at_utc = sp_rec.updated_at
                                if updated_at_utc.tzinfo is None:
                                    updated_at_utc = updated_at_utc.replace(tzinfo=timezone.utc)
                                age_seconds = (now_utc - updated_at_utc).total_seconds()
                                if age_seconds < (retention_days * 86400):  # Less than retention_days (< N days)
                                    sync_data = sp_rec.address_book_data or {}
                                else:
                                    # Hard delete the actual ScanPoint row from DB if older than retention_days
                                    session.delete(sp_rec)
                                    session.flush()
                                    LOGGER.info("[ScanPoint] Hard deleted ScanPoint DB row for mac_id=%s (age=%.1f days)", p_mac, age_seconds / 86400.0)
                            else:
                                sync_data = sp_rec.address_book_data or {}
                    except Exception as db_err:
                        LOGGER.warning("Error looking up ScanPoint for mac %s: %s", p_mac, db_err)

                is_on = bool(dev.get("is_online", True))

                printers_by_lan[p_lan].append({
                    "id": 0,
                    "name": p_name,
                    "printer_name": p_name,
                    "ip": p_ip,
                    "mac_address": p_mac,
                    "mac_id": p_mac,
                    "printer_type": "ricoh" if "ricoh" in p_name.lower() else ("toshiba" if "toshiba" in p_name.lower() or "e-studio" in p_name.lower() else "generic"),
                    "is_online": is_on,
                    "status": "online" if is_on else "offline",
                    "probed": bool(dev.get("probed", True)),
                    "user": cred.get("user", ""),
                    "password": cred.get("password", ""),
                    "auth_user": cred.get("user", ""),
                    "auth_password": cred.get("password", ""),
                    "updated_at": dev.get("updated_at", "") or datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
                    "last_scanned_at": dev.get("updated_at", ""),
                    "enabled": True,
                    "address_book_sync": sync_data,
                    "suggested_drivers": _match_printer_drivers(p_name),
                    "agent_uid": dev.get("_agent_uid", ""),
                })

            # 2. Include DB Printer table records mapped by agent public IP
            for pr in printer_rows:
                p_mac = (pr.mac_address or pr.mac_id or "").upper().replace("-", ":")
                p_ip = str(pr.ip or "").strip()
                p_name = pr.printer_name or "Photocopy"
                ag_uid = pr.agent_uid or ""
                
                ag_info = ACTIVE_AGENTS.get(ag_uid, {})
                ag_pub = ag_info.get("public_ip") if isinstance(ag_info, dict) else ""
                p_lan = ag_pub or pr.lan_uid or "default"
                
                dedupe_key = (p_lan, p_mac or p_ip)
                if dedupe_key in seen_printers:
                    continue
                seen_printers.add(dedupe_key)
                
                cred = creds_map.get(p_mac) or creds_map.get(p_ip) or {}
                sync_data = {}
                if p_mac:
                    try:
                        sp_rec = session.get(ScanPoint, p_mac)
                        if sp_rec and sp_rec.address_book_data:
                            sync_data = sp_rec.address_book_data
                    except Exception:
                        pass
                
                printers_by_lan[p_lan].append({
                    "id": pr.id,
                    "name": p_name,
                    "printer_name": p_name,
                    "ip": p_ip,
                    "mac_address": p_mac,
                    "mac_id": p_mac,
                    "printer_type": "ricoh" if "ricoh" in p_name.lower() else ("toshiba" if "toshiba" in p_name.lower() or "e-studio" in p_name.lower() else "generic"),
                    "is_online": bool(pr.is_online),
                    "status": "online" if pr.is_online else "offline",
                    "probed": True,
                    "user": cred.get("user", ""),
                    "password": cred.get("password", ""),
                    "auth_user": cred.get("user", ""),
                    "auth_password": cred.get("password", ""),
                    "updated_at": pr.updated_at.isoformat() if getattr(pr, "updated_at", None) else datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
                    "last_scanned_at": "",
                    "enabled": True,
                    "address_book_sync": sync_data,
                    "suggested_drivers": _match_printer_drivers(p_name),
                    "agent_uid": ag_uid,
                })



            agent_stmt = select(AgentNode)
            from active_agents_registry import ACTIVE_AGENTS, prune_offline_agents
            prune_offline_agents(timeout_seconds=120)

            # Query all AgentNodes from DB to get the persistent local_ip, hostname, local_mac
            agent_nodes = session.execute(select(AgentNode)).scalars().all()
            agent_db_map = {a.agent_uid: a for a in agent_nodes}

            agents_by_lan: dict[str, list[dict[str, Any]]] = defaultdict(list)
            active_agents_by_lan: dict[str, list[dict[str, Any]]] = defaultdict(list)

            client_ip = request.headers.get("X-Forwarded-For", request.remote_addr or "").split(",")[0].strip()
            override_connect_ip = (request.args.get("connect_ip") or request.args.get("public_ip") or request.args.get("ip") or "").strip()
            is_whitelisted = False
            if client_ip:
                try:
                    from admin_public_ip_routes import is_public_ip_allowed
                    is_whitelisted = is_public_ip_allowed(client_ip, session_factory)
                except Exception:
                    pass
            if override_connect_ip and not is_whitelisted:
                try:
                    from admin_public_ip_routes import is_public_ip_allowed
                    is_whitelisted = is_public_ip_allowed(override_connect_ip, session_factory)
                except Exception:
                    pass
            
            # 1. Add active agents from RAM
            for agent_uid, agent_info in ACTIVE_AGENTS.items():
                if (client_ip or override_connect_ip) and not is_whitelisted:
                    a_pub_ip = agent_info.get("public_ip", "") or agent_info.get("wan_ip", "")
                    a_loc_ip = agent_info.get("local_ip", "")
                    effective_check_ip = override_connect_ip or client_ip
                    if a_pub_ip != effective_check_ip and a_loc_ip != effective_check_ip and a_pub_ip != client_ip and a_loc_ip != client_ip:
                        continue

                a_lead = agent_info.get("lead", "default")
                pub_ip = agent_info.get("public_ip", "") or agent_info.get("wan_ip", "")
                a_lan_uid = pub_ip or agent_info.get("lan_uid", "default")
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
                    "public_ip": pub_ip,
                    "wan_ip": pub_ip,
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

            # 2. Add fallback agents from DB (AgentNode)
            db_agents = session.execute(select(AgentNode)).scalars().all()
            for db_a in db_agents:
                db_pub_ip = getattr(db_a, "public_ip", "") or getattr(db_a, "wan_ip", "") or ""
                a_lan_uid = db_pub_ip or db_a.lan_uid or "default"
                existing_uids = {a["agent_uid"] for a in agents_by_lan[a_lan_uid]}
                if db_a.agent_uid not in existing_uids:
                    site_obj = existing_lan_map.get(a_lan_uid)
                    site_pub = getattr(site_obj, "public_ip", "") if site_obj else ""
                    db_pub_ip = getattr(db_a, "public_ip", "") or getattr(db_a, "wan_ip", "") or site_pub
                    agent_dict = {
                        "agent_uid": db_a.agent_uid,
                        "hostname": db_a.hostname or "",
                        "local_ip": db_a.local_ip or "",
                        "local_mac": db_a.local_mac or "",
                        "public_ip": db_pub_ip,
                        "wan_ip": db_pub_ip,
                        "app_version": db_a.app_version or "",
                        "run_mode": db_a.run_mode or "web",
                        "web_port": db_a.web_port or 9173,
                        "is_master": True,
                        "is_agent_active": db_a.is_online,
                        "is_online": db_a.is_online,
                        "updated_at": db_a.last_seen_at.isoformat() if db_a.last_seen_at else "",
                    }
                    agents_by_lan[a_lan_uid].append(agent_dict)
                    if db_a.is_online:
                        active_agents_by_lan[a_lan_uid].append(agent_dict)

            # 3. Dynamic LanSite creation & mapping for all active LANs
            rows_list = list(rows)
            existing_lan_map = {r.lan_uid: r for r in rows_list if r and r.lan_uid}
            all_active_lan_uids = {
                uid for uid in (
                    set(existing_lan_map.keys()) |
                    set(active_agents_by_lan.keys()) |
                    set(agents_by_lan.keys()) |
                    set(printers_by_lan.keys())
                ) if uid
            }
            
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

            rows = [
                r for r in rows_list 
                if (len(agents_by_lan.get(r.lan_uid, [])) > 0 or len(printers_by_lan.get(r.lan_uid, [])) > 0 or r.lan_uid in existing_lan_map)
            ]

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

                lan_pub_ip = getattr(r, "public_ip", "") or ""
                if not lan_pub_ip and agents_by_lan.get(r.lan_uid):
                    for ag in agents_by_lan.get(r.lan_uid, []):
                        if ag.get("public_ip"):
                            lan_pub_ip = ag.get("public_ip")
                            break

                out_rows.append({
                    "lead": r.lead,
                    "lan_uid": r.lan_uid,
                    "lan_name": r.lan_name,
                    "address": r.address or "",
                    "subnet_cidr": r.subnet_cidr,
                    "gateway_ip": r.gateway_ip,
                    "gateway_mac": r.gateway_mac,
                    "public_ip": lan_pub_ip,
                    "wan_ip": lan_pub_ip,
                    "fingerprint_signature": r.fingerprint_signature,
                    "active_agents": len(active_agents_by_lan.get(r.lan_uid, [])),
                    "agents": agents_by_lan.get(r.lan_uid, []),
                    "emails": emails_by_lan.get(r.lan_uid, []),
                    "printers": deduped_printers,
                    **_serialize_audit_payload_iso(r.created_at, r.updated_at),
                })

            # Group out_rows strictly by public_ip as the PRIMARY KEY
            pub_ip_map: dict[str, dict] = {}
            for row in out_rows:
                pub_ip = (row.get("public_ip") or "").strip()
                if not pub_ip:
                    pub_ip = row.get("lan_uid") or "default"
                
                if pub_ip not in pub_ip_map:
                    pub_ip_map[pub_ip] = {
                        "lead": row.get("lead", "default"),
                        "lan_uid": pub_ip,
                        "lan_name": f"IP Public {pub_ip}" if pub_ip != "default" else "Mạng mặc định",
                        "address": row.get("address") or "",
                        "subnet_cidr": row.get("subnet_cidr") or "",
                        "gateway_ip": row.get("gateway_ip") or "",
                        "gateway_mac": row.get("gateway_mac") or "",
                        "public_ip": pub_ip,
                        "wan_ip": pub_ip,
                        "active_agents": 0,
                        "agents": [],
                        "emails": [],
                        "printers": [],
                        "created_at": row.get("created_at"),
                        "updated_at": row.get("updated_at"),
                    }
                
                group = pub_ip_map[pub_ip]
                existing_agent_uids = {a.get("agent_uid") for a in group["agents"]}
                for ag in row.get("agents", []):
                    if ag.get("agent_uid") not in existing_agent_uids:
                        group["agents"].append(ag)
                        existing_agent_uids.add(ag.get("agent_uid"))
                        if ag.get("is_agent_active"):
                            group["active_agents"] += 1
                
                existing_printer_keys = {(p.get("mac_id") or p.get("ip")) for p in group["printers"]}
                for pr in row.get("printers", []):
                    pkey = pr.get("mac_id") or pr.get("ip")
                    if pkey not in existing_printer_keys:
                        group["printers"].append(pr)
                        existing_printer_keys.add(pkey)

            final_rows = list(pub_ip_map.values())

            from admin_public_ip_routes import get_active_public_ips
            active_ips = get_active_public_ips(session_factory)
            return jsonify({
                "rows": final_rows,
                "client_ip": client_ip,
                "is_allowed": is_whitelisted,
                "active_public_ips": active_ips
            })

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

    @app.delete("/api/lan-sites/<string:lan_uid>/printers")
    def purge_lan_printers(lan_uid: str) -> Any:
        """Xóa toàn bộ Printer + DeviceInfor cũ cho lan_uid và clear RAM cache.
        Gọi trước force_subnet_scan để đảm bảo kết quả quét hoàn toàn sạch."""
        from models import Printer, DeviceInfor
        from sqlalchemy import delete as sql_delete

        with session_factory() as session:
            try:
                del_p = session.execute(sql_delete(Printer).where(Printer.lan_uid == lan_uid))
                del_d = session.execute(sql_delete(DeviceInfor).where(DeviceInfor.lan_uid == lan_uid))
                session.commit()
                deleted = del_p.rowcount + del_d.rowcount

                # Clear RAM cache (ACTIVE_AGENTS)
                try:
                    from active_agents_registry import ACTIVE_AGENTS
                    for ag_data in ACTIVE_AGENTS.values():
                        if isinstance(ag_data, dict) and ag_data.get("lan_uid") == lan_uid:
                            ag_data["devices"] = {}
                except Exception as ram_err:
                    LOGGER.warning("[purge_lan_printers] RAM clear error: %s", ram_err)

                LOGGER.info("[purge_lan_printers] Purged %d rows for lan_uid=%s", deleted, lan_uid)
                return jsonify({"ok": True, "lan_uid": lan_uid, "deleted_rows": deleted})
            except Exception as e:
                session.rollback()
                LOGGER.error("[purge_lan_printers] Error: %s", e)
                return jsonify({"ok": False, "error": str(e)}), 500

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
        from models import Printer, DeviceInfor, AgentNode, PrinterControlCommand
        from sqlalchemy import select, delete
        from datetime import datetime, timezone

        LOGGER.info("[VPS Route] Purging DB Printers for lan_uid=%s and queuing force_subnet_scan", lan_uid)
        with session_factory() as session:
            _auto_record_client_public_ip(session, request)
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
                # Tuyệt đối không fallback chọn bừa Agent khác từ LAN khác
                return jsonify({
                    "ok": False,
                    "error": f"Không có Agent nào đang hoạt động trong mạng LAN '{lan_uid}' để thực hiện quét."
                }), 404

            from datetime import timedelta
            cutoff = datetime.now(timezone.utc) - timedelta(seconds=120)
            queued_ids = []
            import json
            for ag in agents:
                # Kiểm tra xem agent này đã có lệnh scan đang pending hoặc processing hay chưa
                existing = session.execute(
                    select(PrinterControlCommand).where(
                        PrinterControlCommand.agent_uid == ag.agent_uid,
                        PrinterControlCommand.command_type == "trigger_utility",
                        PrinterControlCommand.status.in_(["pending", "processing"]),
                        PrinterControlCommand.requested_at >= cutoff,
                        PrinterControlCommand.command_params.like('%"force_subnet_scan"%')
                    ).order_by(PrinterControlCommand.id.desc())
                ).scalars().first()

                if existing:
                    LOGGER.info("[trigger_lan_site_scan] Agent %s đã có lệnh force_subnet_scan đang chạy (ID: %s, trạng thái: %s), bỏ qua không tạo trùng",
                                ag.agent_uid, existing.id, existing.status)
                    queued_ids.append(existing.id)
                    continue

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

    @app.get("/api/scan-points")
    def get_all_scan_points() -> Any:
        q = _to_text(request.args.get("q", "")).strip()
        with session_factory() as session:
            from models import ScanPoint
            from sqlalchemy import select
            stmt = select(ScanPoint).order_by(ScanPoint.updated_at.desc())
            if q:
                stmt = stmt.where(
                    (ScanPoint.printer_name.ilike(f"%{q}%")) |
                    (ScanPoint.mac_id.ilike(f"%{q}%")) |
                    (ScanPoint.ip.ilike(f"%{q}%")) |
                    (ScanPoint.agent_uid.ilike(f"%{q}%"))
                )
            rows = session.execute(stmt).scalars().all()
            
            res = []
            for r in rows:
                ab_data = r.address_book_data or {}
                dest_count = len(ab_data) if isinstance(ab_data, dict) else (len(ab_data) if isinstance(ab_data, list) else 0)
                res.append({
                    "mac_id": r.mac_id,
                    "printer_name": r.printer_name or "",
                    "ip": r.ip or "",
                    "agent_uid": r.agent_uid or "",
                    "status": r.status or "success",
                    "updated_at": r.updated_at.isoformat() if r.updated_at else "",
                    "destination_count": dest_count,
                    "address_book_data": ab_data
                })
            return jsonify({"ok": True, "rows": res})

    @app.post("/api/scan-points")
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

    @app.delete("/api/scan-points/<string:mac_id>")
    def delete_scan_point_by_mac(mac_id: str) -> Any:
        """Xóa toàn bộ ScanPoint record cho một máy in theo MAC.
        Được gọi từ frontend trước khi đồng bộ danh bạ để đảm bảo data hoàn toàn sạch."""
        from models import ScanPoint
        from sqlalchemy import delete as sql_delete
        from utils import _normalize_mac

        norm_mac = _normalize_mac(mac_id)
        if not norm_mac:
            return jsonify({"ok": False, "error": "Invalid mac_id"}), 400

        with session_factory() as session:
            try:
                result = session.execute(
                    sql_delete(ScanPoint).where(ScanPoint.mac_id == norm_mac)
                )
                session.commit()
                deleted = result.rowcount
                LOGGER.info("[delete_scan_point] Cleared ScanPoint for mac=%s (%d rows deleted)", norm_mac, deleted)
                return jsonify({"ok": True, "mac_id": norm_mac, "deleted_rows": deleted})
            except Exception as e:
                session.rollback()
                LOGGER.error("[delete_scan_point] Error clearing ScanPoint mac=%s: %s", norm_mac, e)
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
