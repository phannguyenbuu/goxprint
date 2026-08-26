import os
import sys
sys.path.insert(0, '/opt/printagent')
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import LanSite, AgentNode, DeviceInfor, DeviceInforHistory, Printer

engine = create_engine("postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx")
Session = sessionmaker(bind=engine)

with Session() as session:
    print("LanSite count:", session.query(LanSite).count())
    for l in session.query(LanSite).all():
        print(f"  - LanSite: lan_uid={l.lan_uid}, lan_name={l.lan_name}, lead={l.lead}")

    print("\nAgentNode count:", session.query(AgentNode).count())
    for a in session.query(AgentNode).all():
        print(f"  - AgentNode: agent_uid={a.agent_uid}, lan_uid={a.lan_uid}, lead={a.lead}, is_online={a.is_online}")

    print("\nDeviceInfor count:", session.query(DeviceInfor).count())
    for d in session.query(DeviceInfor).limit(10).all():
        print(f"  - DeviceInfor: mac={d.mac_id}, name={d.printer_name}, ip={d.ip}, lan_uid={d.lan_uid}, lead={d.lead}")

    print("\nPrinter count:", session.query(Printer).count())
    for p in session.query(Printer).limit(10).all():
        print(f"  - Printer: mac={p.mac_address}, name={p.printer_name}, ip={p.ip}, lan_uid={p.lan_uid}, lead={p.lead}")
