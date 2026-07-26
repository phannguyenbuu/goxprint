import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import ServerConfig
from db import create_session_factory
from models import Printer, AgentNode

def inspect():
    cfg = ServerConfig()
    session_factory = create_session_factory(cfg)
    
    with session_factory() as session:
        printers = session.query(Printer).all()
        print(f"=== Total Printers in PostgreSQL DB: {len(printers)} ===")
        for p in printers:
            print(f"ID: {p.id:3d} | IP: {p.ip:15s} | MAC: {p.mac_address:17s} | Name: {p.printer_name} | Lead: {p.lead} | Agent: {p.agent_uid} | Updated: {p.updated_at}")
            
        agents = session.query(AgentNode).all()
        print(f"\n=== Total Agent Nodes in DB: {len(agents)} ===")
        for a in agents:
            print(f"Agent UID: {a.agent_uid} | IP: {a.local_ip} | Online: {a.is_online} | Last Seen: {a.last_seen_at}")

if __name__ == "__main__":
    inspect()
