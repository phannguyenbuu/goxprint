import sys, paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('157.66.80.125', username='root', key_filename=r'C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519')

script = """
import sys
sys.path.insert(0, '/opt/printagent')
import config, db, models, sqlalchemy as sa

cfg = config.ServerConfig()
session_factory = db.create_session_factory(cfg)
s = session_factory()

print("--- Searching Printer table ---")
printers = s.scalars(sa.select(models.Printer)).all()
for p in printers:
    print(f"Printer ID:{p.id} IP:{p.ip} MAC:{p.mac_address} Name:{p.printer_name} Lead:{p.lead}")

print("--- Searching CounterInfor table ---")
counters = s.scalars(sa.select(models.CounterInfor)).all()
print("CounterInfor count:", len(counters))
for c in counters:
    print(f"CounterInfor ID:{c.id} IP:{c.ip} Lead:{c.lead} Raw:{c.raw_payload}")

print("--- Searching StatusInfor table ---")
statuses = s.scalars(sa.select(models.StatusInfor)).all()
print("StatusInfor count:", len(statuses))
for st in statuses:
    print(f"StatusInfor ID:{st.id} IP:{st.ip} Lead:{st.lead} Raw:{st.raw_payload}")

print("--- Searching DeviceInforHistory table ---")
dev_h = s.scalars(sa.select(models.DeviceInforHistory)).all()
print("DeviceInforHistory count:", len(dev_h))
for dh in dev_h:
    print(f"DeviceInforHistory ID:{dh.id} IP:{dh.ip} MAC:{dh.mac_id} Counter:{dh.counter_data} Status:{dh.status_data}")

print("--- Searching DeviceInfor table ---")
dev_i = s.scalars(sa.select(models.DeviceInfor)).all()
print("DeviceInfor count:", len(dev_i))
for di in dev_i:
    print(f"DeviceInfor ID:{di.id} IP:{di.ip} MAC:{di.mac_id} Counter:{di.counter_data} Status:{di.status_data}")
"""

sftp = client.open_sftp()
with sftp.file('/tmp/chk_infor.py', 'w') as f:
    f.write(script)
sftp.close()

stdin, stdout, stderr = client.exec_command('/opt/printagent/venv/bin/python3 /tmp/chk_infor.py')
sys.stdout.buffer.write(stdout.read())
sys.stdout.buffer.write(stderr.read())
client.close()
