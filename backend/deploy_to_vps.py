import paramiko
import os
from pathlib import Path

local_backend = Path(__file__).resolve().parent
root_dir = local_backend.parent

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
deploy_host = os.environ.get("DEPLOY_HOST", "agentapi.quanlymay.com")
print(f"Connecting to VPS at {deploy_host} using password...")
ssh.connect(deploy_host, username='root', password='@baoLong0511', timeout=10)

print("Opening SFTP session...")
sftp = ssh.open_sftp()
print("SFTP session opened successfully.")

remote_backend = "/opt/printagent"

def ensure_remote_parent_dir(remote_filepath):
    remote_dir = str(Path(remote_filepath).parent).replace("\\", "/")
    parts = remote_dir.strip("/").split("/")
    current = ""
    for part in parts:
        current += "/" + part
        try:
            sftp.mkdir(current)
        except IOError:
            pass

# Upload all .py files in backend
for py_file in local_backend.glob("*.py"):
    remote_path = f"{remote_backend}/{py_file.name}"
    ensure_remote_parent_dir(remote_path)
    print(f"Uploading {py_file} to {remote_path}...")
    sftp.put(str(py_file), remote_path)

# Upload PUBLIC_API.md
local_api_md = local_backend / "PUBLIC_API.md"
if local_api_md.exists():
    remote_path = f"{remote_backend}/PUBLIC_API.md"
    ensure_remote_parent_dir(remote_path)
    print(f"Uploading {local_api_md} to {remote_path}...")
    sftp.put(str(local_api_md), remote_path)

# HTML templates
for html_file in local_backend.glob("templates/*.html"):
    remote_path = f"{remote_backend}/templates/{html_file.name}"
    ensure_remote_parent_dir(remote_path)
    print(f"Uploading {html_file} to {remote_path}...")
    sftp.put(str(html_file), remote_path)

# Static and Storage releases
files_to_copy = [
    (str(local_backend / 'storage' / 'releases' / 'agent_release.json'), '/opt/printagent/storage/releases/agent_release.json'),
    (str(local_backend / 'storage' / 'drivers' / 'toshiba.json'), '/opt/printagent/storage/drivers/toshiba.json'),
    (str(local_backend / 'storage' / 'drivers' / 'ricoh.json'), '/opt/printagent/storage/drivers/ricoh.json'),
    (str(local_backend / 'storage' / 'drivers' / 'fujifilm.json'), '/opt/printagent/storage/drivers/fujifilm.json'),
    (str(local_backend / 'storage' / 'mac_vendors.json'), '/opt/printagent/storage/mac_vendors.json'),
]

for local_file, remote_file in files_to_copy:
    if os.path.exists(local_file):
        ensure_remote_parent_dir(remote_file)
        print(f"Uploading {local_file} to {remote_file}...")
        sftp.put(local_file, remote_file)

sftp.close()

print("Cleaning up obsolete utility_commands.json on VPS...")
ssh.exec_command('rm -f /opt/printagent/storage/utility_commands.json')

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
