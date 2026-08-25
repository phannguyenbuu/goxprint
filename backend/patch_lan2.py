lines = open('lan_routes.py', encoding='utf-8').read().split('\n')
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if 'for p_row in printer_rows:' in line:
        start_idx = i
    if 'agent_stmt = select(AgentNode)' in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx]
    
    new_code = '''
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
'''
    new_lines.append(new_code)
    new_lines.extend(lines[end_idx:])
    
    with open('lan_routes.py', 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    print("Patched successfully")
