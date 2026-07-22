from __future__ import annotations

import os
import sys
import json
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

# Bypass retention background thread & DB requirement for fast test
import retention
retention.start_retention_thread = lambda *args, **kwargs: None

from active_agents_registry import update_agent_in_memory, get_device_by_mac_in_memory

def test_api():
    print("=== LIVE TEST: IN-MEMORY ACTIVE REGISTRY & BY-MAC API ===")
    
    print("\n[Step 1] Simulating Agent Live Polling to Memory")
    polling_payload = {
        "lead": "default",
        "lan_uid": "default_84_93_B2_70",
        "agent_uid": "agent-pc-01",
        "printer_name": "MP 6503",
        "ip": "192.168.1.41",
        "mac_id": "00:26:73:7D:78:F9",
        "counter_data": {
            "total": "3653272",
            "copier_bw": "1200000",
            "printer_bw": "2453272",
            "duplex": "191268",
            "fax_bw": "0",
            "fax_transmission_total": "0"
        },
        "status_data": {
            "system_status": "Ready",
            "toner_black": "100%",
            "bypass_tray_status": "Unknown Thick Paper 2"
        }
    }

    # Direct memory registry update
    update_agent_in_memory(
        lead=polling_payload["lead"],
        lan_uid=polling_payload["lan_uid"],
        agent_uid=polling_payload["agent_uid"],
        printer_name=polling_payload["printer_name"],
        ip=polling_payload["ip"],
        mac_id=polling_payload["mac_id"],
        counter_data=polling_payload["counter_data"],
        status_data=polling_payload["status_data"],
    )
    print("-> Updated in-memory active agents registry successfully.")

    print("\n[Step 2] Executing Live Lookup for MAC: 00:26:73:7D:78:F9")
    device_res = get_device_by_mac_in_memory("00:26:73:7D:78:F9")
    print("-> Result JSON:\n", json.dumps(device_res, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    test_api()
