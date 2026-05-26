import requests
import json
import paramiko
import os

print("=" * 60)
print("1. QUERYING DISCOVERED COPIERS FROM LOCAL AGENT API...")
print("=" * 60)

try:
    url = "http://127.0.0.1:9173/api/devices"
    res = requests.get(url, timeout=15)
    if res.status_code == 200:
        data = res.json()
        devices = data.get("devices", [])
        print(f"Found {len(devices)} discovered/configured devices from local agent:")
        print("-" * 60)
        for idx, d in enumerate(devices, 1):
            ip = d.get("ip") or "-"
            name = d.get("name") or "Unknown"
            mac = d.get("mac_id") or "-"
            dtype = d.get("type") or "unknown"
            source = d.get("source") or "unknown"
            status = d.get("status") or "unknown"
            print(f"[{idx}] Name: {name:<20} | IP: {ip:<15} | MAC: {mac:<17} | Type: {dtype:<8} | Status: {status:<8} | Source: {source}")
    else:
        print(f"Local agent returned status code {res.status_code}")
except Exception as e:
    print(f"Could not connect to local agent: {e}")

print("\n" + "=" * 60)
print("2. QUERYING ALL PRINTERS RECORDED IN THE VPS DATABASE (VIA PARAMIKO SSH)...")
print("=" * 60)

ssh_key = r"C:\Users\Kythuat-02\.ssh\id_ed25519_20260422_155451"
vps_host = "31.97.76.62"

python_vps_code = """
import psycopg2
import os
from pathlib import Path
from dotenv import load_dotenv
import json

env_path = Path("/opt/printagent/.env")
if env_path.exists():
    load_dotenv(env_path)
db_url = os.getenv("DATABASE_URL", "postgresql://postgres:myPass@localhost:5432/GoPrinx")
if db_url.startswith("postgresql+psycopg2://"):
    db_url = db_url.replace("postgresql+psycopg2://", "postgresql://")

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute('SELECT id, printer_name, ip, mac_address, agent_uid, lan_uid, is_online, updated_at FROM "Printer" ORDER BY printer_name ASC')
    rows = cursor.fetchall()
    print(json.dumps({"ok": True, "rows": rows}, default=str))
    conn.close()
except Exception as e:
    print(json.dumps({"ok": False, "error": str(e)}))
"""

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(vps_host, username='root', key_filename=ssh_key, timeout=10)
    
    # SFTP upload
    sftp = ssh.open_sftp()
    remote_path = "/tmp/list_printers_scratch.py"
    with sftp.file(remote_path, "w") as f:
        f.write(python_vps_code)
    sftp.close()
    
    # Run script using production venv python3
    stdin, stdout, stderr = ssh.exec_command(f"/opt/printagent/venv/bin/python3 {remote_path}")
    output_str = stdout.read().decode('utf-8', errors='replace').strip()
    error_str = stderr.read().decode('utf-8', errors='replace').strip()
    
    # Cleanup remote script
    ssh.exec_command(f"rm -f {remote_path}")
    ssh.close()
    
    if output_str:
        try:
            db_data = json.loads(output_str)
            if db_data.get("ok"):
                rows = db_data.get("rows", [])
                print(f"Found {len(rows)} registered printers in the production database:")
                print("-" * 60)
                for idx, r in enumerate(rows, 1):
                    pid, name, ip, mac, agent_uid, lan_uid, online, updated = r
                    print(f"[{idx}] Name: {name:<20} | IP: {ip:<15} | MAC: {mac:<17} | Online: {str(online):<5} | Lead: {lan_uid:<10} | Updated: {updated}")
            else:
                print("Database error:", db_data.get("error"))
        except Exception:
            print("Failed to parse remote output:")
            print(output_str)
    
    if error_str:
        print("Remote STDERR:")
        print(error_str)
        
except Exception as e:
    print(f"Failed to query VPS database: {e}")

print("=" * 60)
