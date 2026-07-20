import paramiko
from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8')

home = Path.home()
key_candidates = [
    home / ".ssh" / "id_ed25519",
    Path(r"C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519"),
]
key_filename = next((str(k) for k in key_candidates if k.exists()), None)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("157.66.80.125", username="root", key_filename=key_filename)

def run(cmd):
    _, out, err = ssh.exec_command(cmd)
    return out.read().decode('utf-8', errors='replace').strip()

print("=== Service status ===")
print(run("systemctl status printagent"))

print("\n=== Recent logs ===")
print(run("journalctl -u printagent -n 20 --no-pager"))

ssh.close()
