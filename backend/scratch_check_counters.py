import sys
sys.path.append("/opt/printagent")
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from models import CounterInfor, DeviceInfor, DeviceInforHistory, CounterBaseline, Printer

engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
Session = sessionmaker(bind=engine)
session = Session()

print("=== COUNTER INFOR ===")
for c in session.execute(select(CounterInfor).order_by(CounterInfor.id.desc()).limit(10)).scalars().all():
    print(f"ID:{c.id} IP:{c.ip} MAC:{c.mac_id} Total:{c.total}")

print("\n=== DEVICE INFOR ===")
for d in session.execute(select(DeviceInfor).order_by(DeviceInfor.id.desc()).limit(10)).scalars().all():
    tot = d.counter_data.get("total") if isinstance(d.counter_data, dict) else None
    print(f"ID:{d.id} IP:{d.ip} MAC:{d.mac_id} CounterTotal:{tot}")

print("\n=== DEVICE INFOR HISTORY ===")
for dh in session.execute(select(DeviceInforHistory).order_by(DeviceInforHistory.id.desc()).limit(10)).scalars().all():
    tot = dh.counter_data.get("total") if isinstance(dh.counter_data, dict) else None
    print(f"ID:{dh.id} IP:{dh.ip} MAC:{dh.mac_id} CounterTotal:{tot}")

print("\n=== COUNTER BASELINE ===")
for cb in session.execute(select(CounterBaseline).order_by(CounterBaseline.id.desc()).limit(10)).scalars().all():
    tot = cb.raw_payload.get("total") if isinstance(cb.raw_payload, dict) else None
    print(f"ID:{cb.id} IP:{cb.ip} CounterTotal:{tot}")

session.close()
