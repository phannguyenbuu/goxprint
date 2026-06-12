import paramiko
from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8')

home = Path.home()
key_candidates = [
    home / ".ssh" / "id_ed25519",
    home / ".ssh" / "id_ed25519_20260422_155451",
    Path(r"C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519"),
]
key_filename = next((str(k) for k in key_candidates if k.exists()), None)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("31.97.76.62", username="root", key_filename=key_filename)

def run(cmd):
    _, out, err = ssh.exec_command(cmd)
    return out.read().decode('utf-8', errors='replace').strip()

# Check actual crash reason - journalctl for today
print("=== Crash reason (journalctl today) ===")
print(run("journalctl -u printagent --no-pager -n 50 --since '5 minutes ago' 2>&1"))

print("\n=== Try running app directly ===")
print(run("cd /opt/printagent && timeout 5 /opt/printagent/venv/bin/python3 app.py 2>&1 | head -40 || true"))

ssh.close()
