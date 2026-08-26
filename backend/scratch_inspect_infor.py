import sys, requests, json
sys.path.append("/opt/printagent")

r = requests.get("http://127.0.0.1:8005/api/infor/list?limit=100").json()
rows = r.get("rows", [])
print(f"=== TOTAL ROWS: {len(rows)} ===")

for idx, row in enumerate(rows, 1):
    name = row.get("printer_name")
    ip = row.get("ip")
    mac = row.get("mac_id")
    counter = row.get("counter") or {}
    status = row.get("status") or {}
    agent = row.get("agent_uid")
    has_counter = bool(counter and isinstance(counter, dict) and len(counter) > 0)
    has_status = bool(status and isinstance(status, dict) and (status.get("copier_status") or status.get("printer_status")))
    print(f"#{idx:02d} | Agent: {agent:<12} | IP: {ip:<15} | MAC: {mac:<17} | Name: {name:<20} | HasCounter: {has_counter} | HasStatus: {has_status}")
    if has_counter:
        print(f"     -> Counter Total: {counter.get('total')}")
    else:
        print(f"     -> Counter: EMPTY {{}}")
