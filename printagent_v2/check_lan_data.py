import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import ServerConfig
from db import create_session_factory
from models import Printer, AgentNode, LanSite

def check():
    cfg = ServerConfig()
    sf = create_session_factory(cfg)
    with sf() as session:
        print("=== LAN SITES ===")
        for site in session.query(LanSite).all():
            print(f"LanSite ID: {site.id} | Name: {site.lan_name} | lan_uid: '{site.lan_uid}' | lead: '{site.lead}'")
            
        print("\n=== PRINTERS ===")
        for p in session.query(Printer).all():
            print(f"Printer ID: {p.id} | Name: {p.printer_name} | IP: {p.ip} | MAC: {p.mac_address} | lan_uid: '{p.lan_uid}' | lead: '{p.lead}' | agent_uid: '{p.agent_uid}'")

        print("\n=== ONLINE AGENTS ===")
        for a in session.query(AgentNode).filter(AgentNode.is_online == True).all():
            print(f"Agent UID: '{a.agent_uid}' | IP: {a.local_ip} | lan_uid: '{a.lan_uid}' | lead: '{a.lead}'")

if __name__ == "__main__":
    check()
