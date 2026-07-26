import os
import sys
import time
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import ServerConfig
from db import create_session_factory
from models import Printer, AgentNode

def clean_printers():
    cfg = ServerConfig()
    session_factory = create_session_factory(cfg)
    
    print("=== 1. Sleeping 15s to capture latest polling cycles from all active agents ===")
    time.sleep(15)
    
    with session_factory() as session:
        all_printers = session.query(Printer).all()
        print(f"\n=== Current Printers in PostgreSQL DB (Total: {len(all_printers)}) ===")
        
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=1)
        
        to_keep = []
        to_delete = []
        
        for p in all_printers:
            # Check if printer was updated within last 1 hour
            p_updated = p.updated_at
            if p_updated is not None and p_updated.tzinfo is None:
                p_updated = p_updated.replace(tzinfo=timezone.utc)
                
            if p_updated and p_updated >= cutoff_time:
                to_keep.append(p)
            else:
                to_delete.append(p)
                
        print(f"\n✅ Printers reported in active printers.json (TO KEEP: {len(to_keep)}):")
        for k in to_keep:
            print(f"   - [KEEP] ID: {k.id:4d} | IP: {k.ip:15s} | MAC: {k.mac_address:17s} | Name: {k.printer_name} | Updated: {k.updated_at}")
            
        print(f"\n❌ Printers NOT found in any active printers.json (TO DELETE: {len(to_delete)}):")
        for d in to_delete:
            print(f"   - [DELETE] ID: {d.id:4d} | IP: {d.ip:15s} | MAC: {d.mac_address:17s} | Name: {d.printer_name} | Updated: {d.updated_at}")
            
        if to_delete:
            delete_ids = [d.id for d in to_delete]
            session.query(Printer).filter(Printer.id.in_(delete_ids)).delete(synchronize_session=False)
            session.commit()
            print(f"\n🎉 Successfully deleted {len(delete_ids)} stale printer records from PostgreSQL Printer table!")
        else:
            print("\n✨ No stale printers to delete. Database is clean!")

if __name__ == "__main__":
    clean_printers()
