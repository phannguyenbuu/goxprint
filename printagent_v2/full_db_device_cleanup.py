import os
import sys
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import ServerConfig
from db import create_session_factory
from models import Printer, DeviceInfor

def clean_all():
    cfg = ServerConfig()
    sf = create_session_factory(cfg)
    
    cutoff = datetime.now(timezone.utc) - timedelta(hours=2)
    
    with sf() as session:
        # 1. Clean Printer table
        all_printers = session.query(Printer).all()
        print(f"=== Total Printer records in DB: {len(all_printers)} ===")
        del_p = 0
        for p in all_printers:
            p_up = p.updated_at
            if p_up is not None and p_up.tzinfo is None:
                p_up = p_up.replace(tzinfo=timezone.utc)
            if not p_up or p_up < cutoff:
                print(f" - [DELETE Printer] ID {p.id}: {p.printer_name} ({p.ip}) | Updated: {p.updated_at}")
                session.delete(p)
                del_p += 1
        
        # 2. Clean DeviceInfor table
        all_devices = session.query(DeviceInfor).all()
        print(f"\n=== Total DeviceInfor records in DB: {len(all_devices)} ===")
        del_d = 0
        for d in all_devices:
            d_up = d.updated_at
            if d_up is not None and d_up.tzinfo is None:
                d_up = d_up.replace(tzinfo=timezone.utc)
            if not d_up or d_up < cutoff:
                print(f" - [DELETE DeviceInfor] ID {d.id}: {d.printer_name} ({d.ip}) | Updated: {d.updated_at}")
                session.delete(d)
                del_d += 1
                
        session.commit()
        print(f"\n🎉 Cleaned {del_p} Printer records and {del_d} DeviceInfor records from PostgreSQL DB!")

if __name__ == "__main__":
    clean_all()
