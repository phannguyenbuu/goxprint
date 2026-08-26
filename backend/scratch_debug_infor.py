import sys, traceback
from datetime import datetime, timezone
sys.path.append("/opt/printagent")
from app import create_app
from active_agents_registry import ACTIVE_AGENTS

ACTIVE_AGENTS["kythuat02"] = {
    "lead": "default",
    "lan_uid": "default_lan",
    "agent_uid": "kythuat02",
    "last_seen_at": datetime.now(timezone.utc),
    "printers_json": [
        {"printer_name": "RICOH MP 7503", "ip": "192.168.1.50", "mac_address": "58:38:79:79:A3:EB", "status": "online"},
        {"printer_name": "TOSHIBA e-STUDIO", "ip": "192.168.1.156", "mac_address": "00:80:91:EE:02:B3", "status": "online"}
    ],
    "devices": {
        "58:38:79:79:A3:EB": {
            "printer_name": "RICOH MP 7503",
            "ip": "192.168.1.226",
            "counter": {"total": "673524"},
            "status": {"printer_status": "online"}
        }
    }
}

app = create_app()
client = app.test_client()

try:
    res = client.get("/api/infor/list?lead=default&page=1&limit=50")
    print("STATUS:", res.status)
    if res.status_code != 200:
        print("BODY:", res.data.decode("utf-8", "ignore"))
    else:
        print("SUCCESS! Rows:", len(res.json.get("rows", [])))
        for r in res.json.get("rows", []):
            print(f"  Item ID: {r.get('id')} | Name: {r.get('printer_name')} | IP: {r.get('ip')} | Counter: {r.get('counter')}")
except Exception as e:
    print("EXCEPTION:", e)
    traceback.print_exc()
