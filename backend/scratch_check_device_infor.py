import sys
sys.path.append("/opt/printagent")
from app import create_app
from config import ServerConfig
from db import create_session_factory
from models import DeviceInfor, DeviceInforHistory, Printer
from sqlalchemy import select

app = create_app()
session_factory = create_session_factory(ServerConfig())

with session_factory() as session:
    dis = session.execute(select(DeviceInfor)).scalars().all()
    print(f"=== DeviceInfor total rows: {len(dis)} ===")
    for d in dis:
        print(f"  ID:{d.id} | MAC:{d.mac_id} | IP:{d.ip} | Lead:{d.lead} | Counter:{d.counter_data}")

    dhs = session.execute(select(DeviceInforHistory)).scalars().all()
    print(f"\n=== DeviceInforHistory total rows: {len(dhs)} ===")
    for dh in dhs:
        print(f"  ID:{dh.id} | MAC:{dh.mac_id} | IP:{dh.ip} | Lead:{dh.lead} | Counter:{dh.counter_data}")
