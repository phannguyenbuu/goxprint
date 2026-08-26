import sys
sys.path.append("/opt/printagent")
from app import create_app
from config import ServerConfig
from db import create_session_factory
from models import DeviceInforHistory, DeviceInfor, CounterInfor, CounterBaseline, Printer
from sqlalchemy import select, func, or_

app = create_app()
session_factory = create_session_factory(ServerConfig())

test_macs = [
    "58:38:79:79:A3:EB",
    "00:80:91:B6:18:FF",
    "00:80:91:EE:02:B3",
]

with session_factory() as session:
    print("=== TESTING ROBUST MAC MATCHING IN ALL TABLES ===")
    for raw_mac in test_macs:
        clean = raw_mac.replace(":", "").replace("-", "").upper()
        print(f"\nTarget MAC: {raw_mac} (Clean: {clean})")

        # 1. DeviceInforHistory robust search
        dh_stmt = select(DeviceInforHistory).where(
            func.upper(func.replace(func.replace(DeviceInforHistory.mac_id, ':', ''), '-', '')) == clean
        ).order_by(DeviceInforHistory.id.desc()).limit(1)
        dh = session.execute(dh_stmt).scalars().first()
        print("  -> DeviceInforHistory:", f"Found ID {dh.id}, IP {dh.ip}, counter {dh.counter_data}" if dh else "NOT FOUND")

        # 2. DeviceInfor robust search
        di_stmt = select(DeviceInfor).where(
            func.upper(func.replace(func.replace(DeviceInfor.mac_id, ':', ''), '-', '')) == clean
        ).order_by(DeviceInfor.id.desc()).limit(1)
        di = session.execute(di_stmt).scalars().first()
        print("  -> DeviceInfor:", f"Found ID {di.id}, IP {di.ip}, counter {di.counter_data}" if di else "NOT FOUND")

        # 3. CounterInfor robust search
        ci_stmt = select(CounterInfor).where(
            func.upper(func.replace(func.replace(CounterInfor.mac_id, ':', ''), '-', '')) == clean
        ).order_by(CounterInfor.id.desc()).limit(1)
        ci = session.execute(ci_stmt).scalars().first()
        print("  -> CounterInfor:", f"Found ID {ci.id}, IP {ci.ip}, total {ci.total_page_count}" if ci else "NOT FOUND")

        # 4. Printer robust search
        p_stmt = select(Printer).where(
            func.upper(func.replace(func.replace(Printer.mac_address, ':', ''), '-', '')) == clean
        ).order_by(Printer.id.desc()).limit(1)
        p = session.execute(p_stmt).scalars().first()
        print("  -> Printer:", f"Found ID {p.id}, IP {p.ip}, name {p.printer_name}" if p else "NOT FOUND")
