lines = open('active_agents_registry.py', encoding='utf-8').read().split('\n')
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if 'agent_entry = ACTIVE_AGENTS[key]' in line and i > 85:
        start_idx = i
    if 'def prune_offline_agents' in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx]
    
    new_code = '''    agent_entry = ACTIVE_AGENTS[key]
    devices_dict = agent_entry.setdefault("devices", {})

    # If the agent sends a full devices_list (e.g. from polling), clear and rebuild
    # the RAM registry so that offline/removed printers are actually cleared out.
    if isinstance(devices_list, list) and len(devices_list) > 0:
        agent_entry["printers_json"] = devices_list
        _save_cached_printers_for_agent(key, devices_list)
        
        devices_dict.clear()
        
        for d in devices_list:
            if not isinstance(d, dict):
                continue
            d_mac = str(d.get("mac_address") or d.get("mac_id") or "").strip().upper().replace("-", ":")
            if not d_mac:
                continue
            
            p_name = d.get("printer_name") or d.get("model") or "Unknown Printer"
            d_counter = d.get("counter") if isinstance(d.get("counter"), dict) and d.get("counter") else (d.get("counter_data") if isinstance(d.get("counter_data"), dict) else {})
            d_status = d.get("status") if isinstance(d.get("status"), dict) and d.get("status") else (d.get("status_data") if isinstance(d.get("status_data"), dict) else {})
            devices_dict[d_mac] = {
                "printer_name": str(p_name),
                "ip": str(d.get("ip", "")).strip(),
                "counter": d_counter,
                "status": d_status,
                "is_online": bool(d.get("is_online", True)),
                "probed": bool(d.get("probed", False)),
                "updated_at": now.isoformat(),
            }

    # If there is a specific single-device update (e.g. counter/status ping)
    if mac_id:
        norm_mac = mac_id.upper().replace("-", ":")
        dev = devices_dict.setdefault(norm_mac, {})
        if printer_name and "unknown" not in printer_name.lower():
            dev["printer_name"] = printer_name
        elif "printer_name" not in dev or "unknown" in str(dev.get("printer_name", "")).lower():
            dev["printer_name"] = printer_name or "Unknown Printer"
        
        if ip:
            dev["ip"] = ip
        if isinstance(counter_data, dict) and counter_data:
            dev["counter"] = counter_data
        if isinstance(status_data, dict) and status_data:
            dev["status"] = status_data
            s = str(status_data.get("status", "")).lower()
            dev["is_online"] = (s != "offline") if s else dev.get("is_online", True)
        dev["updated_at"] = now.isoformat()
'''
    new_lines.append(new_code)
    new_lines.extend(lines[end_idx:])
    
    with open('active_agents_registry.py', 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    print("Patched successfully")
