import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import ServerConfig
from db import create_session_factory
from models import AgentNode

def check():
    cfg = ServerConfig()
    sf = create_session_factory(cfg)
    with sf() as session:
        print("=== ONLINE AGENTS & VERSIONS ===")
        agents = session.query(AgentNode).filter(AgentNode.is_online == True).all()
        for a in agents:
            print(f"Agent UID: {a.agent_uid:12s} | IP: {a.local_ip:15s} | App Version: '{a.app_version}' | Last Seen: {a.last_seen_at}")

    print("\n=== VPS RELEASE MANIFESTS ===")
    for path in ["storage/releases/agent_release.json", "storage/releases/agent_core_release.json"]:
        full_path = os.path.join("/opt/printagent", path)
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                print(f"{path}: {f.read().strip()}")

if __name__ == "__main__":
    check()
