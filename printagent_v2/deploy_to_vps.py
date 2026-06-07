import paramiko
import os
from pathlib import Path

root_dir = Path(__file__).resolve().parent
local_backend = root_dir / "backend"

# Determine SSH key path dynamically
home = Path.home()
key_candidates = [
    home / ".ssh" / "id_ed25519_20260422_155451",
    home / ".ssh" / "id_ed25519",
    home / ".ssh" / "id_rsa",
    Path(r"C:\Users\Kythuat-02\.ssh\id_ed25519_20260422_155451"),
    Path(r"C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519"),
]

key_filename = None
for k in key_candidates:
    if k.exists():
        key_filename = str(k)
        break

if not key_filename:
    raise FileNotFoundError("Could not find a valid SSH key file in candidate locations.")

print("Initializing SSH client...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
print(f"Connecting to VPS at 31.97.76.62 using key: {key_filename}...")
ssh.connect('31.97.76.62', username='root', key_filename=key_filename)

print("Opening SFTP session...")
sftp = ssh.open_sftp()
print("SFTP session opened successfully.")

remote_backend = "/opt/printagent"

# Upload all .py files in backend
for py_file in local_backend.glob("*.py"):
    remote_path = f"{remote_backend}/{py_file.name}"
    print(f"Uploading {py_file} to {remote_path}...")
    sftp.put(str(py_file), remote_path)

# HTML templates
for html_file in local_backend.glob("templates/*.html"):
    remote_path = f"{remote_backend}/templates/{html_file.name}"
    print(f"Uploading {html_file} to {remote_path}...")
    sftp.put(str(html_file), remote_path)

# Static and Storage releases
import shutil
local_exe = root_dir / "dist" / "printagent.exe"
dest_exe = local_backend / "static" / "releases" / "printagent.exe"
if local_exe.exists():
    print(f"Copying {local_exe} to {dest_exe}...")
    dest_exe.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(str(local_exe), str(dest_exe))

files_to_copy = [
    (str(local_backend / 'storage' / 'releases' / 'agent_release.json'), '/opt/printagent/storage/releases/agent_release.json'),
    (str(local_backend / 'storage' / 'releases' / 'agent_core_release.json'), '/opt/printagent/storage/releases/agent_core_release.json'),
    (str(local_backend / 'static' / 'releases' / 'agent_core.zip'), '/opt/printagent/static/releases/agent_core.zip'),
    (str(local_backend / 'static' / 'releases' / 'printagent.exe'), '/opt/printagent/static/releases/printagent.exe'),
    (str(local_backend / 'static' / 'releases' / 'diagnose.py'), '/opt/printagent/static/releases/diagnose.py')
]

for local_file, remote_file in files_to_copy:
    if os.path.exists(local_file):
        print(f"Uploading {local_file} to {remote_file}...")
        sftp.put(local_file, remote_file)

sftp.close()

print("Running database migrations on remote VPS...")
_, out, err = ssh.exec_command('/opt/printagent/venv/bin/python3 /opt/printagent/init_db.py')
print("Migration STDOUT:", out.read().decode('utf-8'))
print("Migration STDERR:", err.read().decode('utf-8'))

print("Restarting printagent service on remote VPS...")
_, out, err = ssh.exec_command('systemctl restart printagent.service || systemctl restart printagent')
print("Restart STDOUT:", out.read().decode('utf-8'))
print("Restart STDERR:", err.read().decode('utf-8'))

ssh.close()
print("Done!")
