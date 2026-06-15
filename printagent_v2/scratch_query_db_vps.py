import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('31.97.76.62', username='root', key_filename=r'C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519')

# Lệnh Python chạy trên VPS để query DB PostgreSQL
# Ta sẽ dump file .env ở /opt/printagent/.env hoặc cấu hình mặc định để lấy URL kết nối.
python_code = """
import psycopg2
from dotenv import load_dotenv
import os
from pathlib import Path

# Load config từ .env của server
env_path = Path("/opt/printagent/.env")
if env_path.exists():
    load_dotenv(env_path)
db_url = os.getenv("DATABASE_URL", "postgresql://postgres:myPass@localhost:5432/GoPrinx")
if db_url.startswith("postgresql+psycopg2://"):
    db_url = db_url.replace("postgresql+psycopg2://", "postgresql://")

print("Connecting to DB:", db_url)
try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute('SELECT id, lead, printer_name, ip, is_online FROM "Printer"')
    rows = cursor.fetchall()
    print("Found", len(rows), "printers:")
    for r in rows:
        print(f"ID: {r[0]} | Lead: {r[1]} | Name: {r[2]} | IP: {r[3]} | Online: {r[4]}")
    conn.close()
except Exception as e:
    print("Error querying database:", e)
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

print("Uploading temporary script to VPS...")
sftp = ssh.open_sftp()
temp_remote_file = "/tmp/check_agent_temp.py"
with sftp.file(temp_remote_file, "w") as f:
    f.write(python_code)
sftp.close()

print("Executing database check on VPS...")
stdin, stdout, stderr = ssh.exec_command(f"/opt/printagent/venv/bin/python3 {temp_remote_file}")
print("STDOUT:")
print(stdout.read().decode('utf-8', errors='replace'))
print("STDERR:")
print(stderr.read().decode('utf-8', errors='replace'))

# Clean up
ssh.exec_command(f"rm -f {temp_remote_file}")
ssh.close()
