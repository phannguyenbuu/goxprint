lines = open('lan_routes.py', encoding='utf-8').read().split('\n')
new_lines = []
skip = False
for i, line in enumerate(lines):
    if 'ram_printers_lookup: dict[str, dict] = {}' in line:
        new_lines.append('''            from active_agents_registry import ACTIVE_AGENTS, prune_offline_agents
            prune_offline_agents(timeout_seconds=120)

            ram_printers_lookup: dict[str, dict] = {}
            for agent_uid, agent_info in ACTIVE_AGENTS.items():
                devices = agent_info.get("devices", {})
                for mac_id, dev in devices.items():
                    norm_mac = mac_id.upper().replace("-", ":")
                    if norm_mac:
                        ram_printers_lookup[norm_mac] = dev
                        ram_printers_lookup[norm_mac]["_agent_uid"] = agent_uid
                        ram_printers_lookup[norm_mac]["_lan_uid"] = agent_info.get("lan_uid", "default")''')
        skip = True
        continue

    if skip and 'agent_stmt = select(AgentNode)' in line:
        skip = False
        new_lines.append('''
            for p_row in printer_rows:
                p_mac = (p_row.mac_address or "").strip().replace("-", ":").upper()
                p_ip = (p_row.ip or "").strip()
                p_lan = p_row.lan_uid or "default"
                p_name = p_row.printer_name or "Photocopy"

                if not p_ip and not p_mac:
                    continue

                dedupe_key = (p_lan, p_mac or p_ip)
                if dedupe_key in seen_printers:
                    continue
                seen_printers.add(dedupe_key)

                ram_dev = ram_printers_lookup.get(p_mac) or {}

                cred = creds_map.get(p_mac) or {}
                p_user = cred.get("user") or p_row.auth_user or ""
                p_pass = cred.get("password") or p_row.auth_password or ""

                sync_data = p_row.address_book_sync if p_row.address_book_sync else {}
                if not sync_data and p_mac:
                    try:
                        from models import ScanPoint
                        sp_rec = session.get(ScanPoint, p_mac)
                        if sp_rec and sp_rec.address_book_data:
                            sync_data = sp_rec.address_book_data
                    except Exception:
                        pass

                is_online_db = bool(p_row.is_online)
                if ram_dev and "is_online" in ram_dev:
                    is_online_db = bool(ram_dev.get("is_online"))

                printers_by_lan[p_lan].append({
                    "id": p_row.id,
                    "printer_name": ram_dev.get("printer_name") or p_name,
                    "ip": ram_dev.get("ip") or p_ip,
                    "mac_id": p_mac,
                    "is_online": is_online_db,
                    "last_scanned_at": p_row.last_scanned_at.isoformat() if getattr(p_row, "last_scanned_at", None) else "",
                    "probed": bool(ram_dev.get("probed", False)),
                    "enabled": bool(p_row.enabled),
                    "auth_user": p_user,
                    "auth_password": p_pass,
                    "address_book_sync": sync_data,
                    "suggested_drivers": _match_printer_drivers(p_name),
                    "agent_uid": p_row.agent_uid or ram_dev.get("_agent_uid", ""),
                })

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
                            sync_data = sp_rec.address_book_data
                    except Exception:
                        pass

                printers_by_lan[p_lan].append({
                    "id": 0,
                    "printer_name": p_name,
                    "ip": p_ip,
                    "mac_id": p_mac,
                    "is_online": bool(dev.get("is_online", True)),
                    "last_scanned_at": dev.get("updated_at", ""),
                    "probed": bool(dev.get("probed", False)),
                    "enabled": True,
                    "auth_user": cred.get("user", ""),
                    "auth_password": cred.get("password", ""),
                    "address_book_sync": sync_data,
                    "suggested_drivers": _match_printer_drivers(p_name),
                    "agent_uid": dev.get("_agent_uid", ""),
                })
''')
        
    if not skip:
        new_lines.append(line)

open('lan_routes.py', 'w', encoding='utf-8').write('\n'.join(new_lines))
