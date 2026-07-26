import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import ServerConfig
from db import create_session_factory
from models import Printer, AgentNode, LanSite, DeviceInfor

def stats():
    cfg = ServerConfig()
    sf = create_session_factory(cfg)
    with sf() as session:
        print("===============================================================")
        print("          BÁO CÁO THỐNG KÊ BẢNG PRINTER TRÊN POSTGRESQL VPS     ")
        print("===============================================================")
        
        # 1. Lan Sites Info
        sites = session.query(LanSite).all()
        print(f"\n1. TỔNG SỐ LAN SITES: {len(sites)}")
        for s in sites:
            if s.lan_name or "default" in s.lan_uid:
                print(f"   - ID: {s.id:3d} | Name: '{s.lan_name}' | lan_uid: '{s.lan_uid}' | lead: '{s.lead}'")

        # 2. Online Agents
        agents = session.query(AgentNode).filter(AgentNode.is_online == True).all()
        print(f"\n2. TỔNG SỐ AGENT ONLINE ({len(agents)} agent):")
        for a in agents:
            print(f"   - Agent UID: {a.agent_uid:12s} | IP: {a.local_ip:15s} | lan_uid: '{a.lan_uid}' | Version: {a.app_version} | Last seen: {a.last_seen_at}")

        # 3. Printers Table Details
        printers = session.query(Printer).all()
        print(f"\n3. CHI TIẾT BẢNG PRINTERS (TỔNG SỐ: {len(printers)} máy in):")
        if not printers:
            print("   (Hiện tại không có bản ghi máy in nào trong bảng Printer)")
        for idx, p in enumerate(printers, 1):
            print(f"\n   [{idx}] ID: {p.id}")
            print(f"       - Tên máy in:    {p.printer_name}")
            print(f"       - IP:            {p.ip}")
            print(f"       - Địa chỉ MAC:   {p.mac_address or '(Trống)'}")
            print(f"       - Trạng thái:    {'🟢 ONLINE' if p.is_online else '🔴 OFFLINE'}")
            print(f"       - Kích hoạt:     {p.enabled}")
            print(f"       - Lead:          {p.lead}")
            print(f"       - LAN UID:       {p.lan_uid}")
            print(f"       - Agent UID:     {p.agent_uid}")
            print(f"       - Cập nhật lúc:  {p.updated_at}")
            print(f"       - Tạo lúc:       {p.created_at}")

        # 4. DeviceInfor Table Summary
        devices_infor = session.query(DeviceInfor).all()
        print(f"\n4. TỔNG SỐ BẢN GHI TRONG DEVICEINFOR: {len(devices_infor)}")
        for d in devices_infor:
            print(f"   - ID: {d.id:3d} | Name: {d.printer_name:25s} | IP: {d.ip:15s} | MAC: {d.mac_id:18s} | Updated: {d.updated_at}")

        print("\n===============================================================")

if __name__ == "__main__":
    stats()
