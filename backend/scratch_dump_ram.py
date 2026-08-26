import sys, json
sys.path.append("/opt/printagent")
from active_agents_registry import ACTIVE_AGENTS

print("Active agent count:", len(ACTIVE_AGENTS))
for agent_uid, info in ACTIVE_AGENTS.items():
    print(f"\n--- AGENT: {agent_uid} (lead: {info.get('lead')}) ---")
    devices = info.get("devices", {})
    print(f"Devices dict count: {len(devices)}")
    for mac, dev in devices.items():
        print(f"  MAC: {mac} | Name: {dev.get('printer_name')} | IP: {dev.get('ip')} | Counter: {dev.get('counter')}")
