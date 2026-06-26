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
from app import db, AgentNode
import sys

def main():
    try:
        from sqlalchemy import text
        from datetime import timezone
        
        # Cấu hình app để query DB
        from app import app
        with app.app_context():
            agents = db.session.query(AgentNode).all()
            for p in agents:
                print(f"ID: {p.id} | Name: {p.agent_uid} | IP: {p.ip_address} | Online: {p.is_online} | Last Seen: {p.last_seen_at} | Changed At: {p.online_changed_at}")
    except Exception as e:
        print(f"STDERR:\n{e}", file=sys.stderr)

if __name__ == "__main__":
    main()
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
