import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('157.66.80.125', username='root', key_filename=r'C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519')

script = """
import sys
sys.path.insert(0, '/opt/printagent')
from init_db import create_session_factory
from models import Printer, DeviceInfor, DeviceInforHistory
from active_agents_registry import ACTIVE_AGENTS
from sqlalchemy import select

print("=== ACTIVE AGENTS IN RAM ===")
for agent_uid, info in ACTIVE_AGENTS.items():
    print("Agent:", agent_uid, "lead:", info.get("lead"), "lan_uid:", info.get("lan_uid"))
    printers = info.get("printers_json") or []
    for p in printers:
        print("  Printer:", p)

session_factory = create_session_factory()
with session_factory() as session:
    print("\\n=== PRINTER TABLE ===")
    printers = session.execute(select(Printer)).scalars().all()
    for p in printers:
        print("  Printer:", p.id, p.lead, p.mac_address, p.ip, p.printer_name)

    print("\\n=== DEVICE INFOR TABLE ===")
    devs = session.execute(select(DeviceInfor)).scalars().all()
    for d in devs:
        print("  DeviceInfor:", d.id, d.lead, d.mac_id, d.ip, d.printer_name)

    print("\\n=== DEVICE INFOR HISTORY TABLE ===")
    hist = session.execute(select(DeviceInforHistory)).scalars().all()
    for h in hist:
        print("  DeviceInforHistory:", h.id, h.lead, h.mac_id, h.ip, h.printer_name)
"""

sftp = client.open_sftp()
with sftp.file('/tmp/search_mac.py', 'w') as f:
    f.write(script)
sftp.close()

stdin, stdout, stderr = client.exec_command('/opt/printagent/venv/bin/python3 /tmp/search_mac.py')
print("STDOUT:", stdout.read().decode('utf-8', 'ignore'))
print("STDERR:", stderr.read().decode('utf-8', 'ignore'))
client.close()
