import paramiko
from pathlib import Path

home = Path.home()
key = str(home / '.ssh' / 'id_ed25519')
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('31.97.76.62', username='root', key_filename=key)

cmd = """
ls -la /opt/printagent/static/releases/printagentinstall.exe
"""

_, out, err = ssh.exec_command(cmd)
print("OUT:", out.read().decode())
print("ERR:", err.read().decode())
ssh.close()
