import sys
sys.path.append("/opt/printagent")
from app import create_app
from config import ServerConfig
from db import create_session_factory
from models import DeviceInforHistory, DeviceInfor, CounterInfor, CounterBaseline, Printer
from sqlalchemy import select, func, or_

app = create_app()
session_factory = create_session_factory(ServerConfig())

macs = [
    "58:38:79:79:A3:EB", # RICOH MP 7503
    "00:80:91:B6:18:FF", # TOSHIBA e-STUDIO 155
    "00:80:91:EE:02:B3", # TOSHIBA e-STUDIO 156
    "58:38:79:41:91:08", # RICOH MP 7503
    "58:38:79:47:06:5A", # RICOH MP 6055
]

with session_factory() as session:
    print("=== CHECKING POSTGRES DB TABLES FOR COUNTERS ===")
    for mac in macs:
        print(f"\n--- MAC: {mac} ---")
        
        # 1. DeviceInforHistory
        dhs = session.execute(select(DeviceInforHistory).where(func.replace(func.upper(DeviceInforHistory.mac_id), '-', ':') == mac).order_by(DeviceInforHistory.id.desc()).limit(3)).scalars().all()
        print(f"DeviceInforHistory count: {len(dhs)}")
        for dh in dhs:
            print(f"   [DH] id:{dh.id} ip:{dh.ip} counter:{dh.counter_data} status:{dh.status_data}")

        # 2. DeviceInfor
        dis = session.execute(select(DeviceInfor).where(func.replace(func.upper(DeviceInfor.mac_id), '-', ':') == mac).limit(3)).scalars().all()
        print(f"DeviceInfor count: {len(dis)}")
        for di in dis:
            print(f"   [DI] id:{di.id} ip:{di.ip} counter:{di.counter_data}")

        # 3. CounterInfor
        cis = session.execute(select(CounterInfor).where(func.replace(func.upper(CounterInfor.mac_id), '-', ':') == mac).limit(3)).scalars().all()
        print(f"CounterInfor count: {len(cis)}")
        for ci in cis:
            print(f"   [CI] id:{ci.id} ip:{ci.ip} total:{ci.total_page_count}")

        # 4. CounterBaseline
        cbs = session.execute(select(CounterBaseline).where(func.replace(func.upper(CounterBaseline.mac_id), '-', ':') == mac).limit(3)).scalars().all()
        print(f"CounterBaseline count: {len(cbs)}")
        for cb in cbs:
            print(f"   [CB] id:{cb.id} ip:{cb.ip} payload:{cb.raw_payload}")
