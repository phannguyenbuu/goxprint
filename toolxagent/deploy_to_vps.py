import os
import time
import hashlib
from pathlib import Path
import paramiko

# Configurations
DEPLOY_HOST = "157.66.80.125"
SSH_KEY_PATH = r"C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519"
REMOTE_DIR = "/opt/toolx"

root_dir = Path(__file__).resolve().parent
local_backend = root_dir / "backend"
local_exe = root_dir / "dist" / "toolxagent_v1.5.2.exe"

print("Connecting to VPS at {}...".format(DEPLOY_HOST))
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(DEPLOY_HOST, username='root', key_filename=SSH_KEY_PATH)

print("Opening SFTP session...")
sftp = ssh.open_sftp()

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

# Create remote directory structure
print("Creating remote directories...")
for subdir in ["", "templates", "static", "static/releases"]:
    try:
        sftp.mkdir(f"{REMOTE_DIR}/{subdir}")
    except IOError:
        pass

# Upload app.py and models.py
for py_file in ["app.py", "models.py"]:
    local_path = local_backend / py_file
    remote_path = f"{REMOTE_DIR}/{py_file}"
    print(f"Uploading {py_file}...")
    sftp.put(str(local_path), remote_path)

# Upload templates
for html_file in local_backend.glob("templates/*.html"):
    remote_path = f"{REMOTE_DIR}/templates/{html_file.name}"
    print(f"Uploading template {html_file.name}...")
    sftp.put(str(html_file), remote_path)

# Upload toolxagent.exe and toolx_core.zip if compiled
local_core = root_dir / "dist" / "toolx_core.zip"
sha256_val = ""
core_sha256_val = ""

if local_exe.exists() and local_core.exists():
    # Ensure remote storage directories exist
    try:
        sftp.mkdir(f"{REMOTE_DIR}/storage")
    except IOError:
        pass
    try:
        sftp.mkdir(f"{REMOTE_DIR}/storage/releases")
    except IOError:
        pass

    # Calculate toolxagent.exe sha256
    sha256_hash = hashlib.sha256()
    with open(local_exe, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    sha256_val = sha256_hash.hexdigest()
    
    # Calculate toolx_core.zip sha256
    core_sha256_hash = hashlib.sha256()
    with open(local_core, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            core_sha256_hash.update(byte_block)
    core_sha256_val = core_sha256_hash.hexdigest()
    
    # Upload files directly into storage/releases (which is served via /static/releases/)
    remote_exe_path = f"{REMOTE_DIR}/storage/releases/toolxagent_v1.5.2.exe"
    remote_core_path = f"{REMOTE_DIR}/storage/releases/toolx_core.zip"
    
    print(f"Uploading compiled toolxagent.exe (SHA256: {sha256_val})...")
    sftp.put(str(local_exe), remote_exe_path)
    
    print(f"Uploading compiled toolx_core.zip (SHA256: {core_sha256_val})...")
    sftp.put(str(local_core), remote_core_path)
    
    # Write and upload release JSON
    import json
    release_info = {
        "version": "1.5.2",
        "url": "/static/releases/toolxagent_v1.5.2.exe",
        "sha256": sha256_val,
        "core_version": "1.5.2",
        "core_url": "/static/releases/toolx_core.zip",
        "core_sha256": core_sha256_val,
        "update_available": True
    }
    local_release_json = local_backend / "agent_release.json"
    local_release_json.write_text(json.dumps(release_info, indent=2))
    
    remote_release_json = f"{REMOTE_DIR}/storage/releases/agent_release.json"
    sftp.put(str(local_release_json), remote_release_json)
    
    # Clean up local release JSON
    try:
        local_release_json.unlink()
    except Exception:
        pass
else:
    print("WARNING: Compiled toolxagent.exe or toolx_core.zip not found. Skipping agent upload.")

sftp.close()

# Systemd Service Configuration
systemd_service = f"""[Unit]
Description=Toolx Render Backend Service
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory={REMOTE_DIR}
ExecStart={REMOTE_DIR}/venv/bin/python3 app.py
Restart=always
Environment=FLASK_SECRET_KEY=toolx-secret-key-128gb-ram DB_USER=postgres DB_PASSWORD=myPass DB_HOST=localhost DB_PORT=5432 DB_NAME=toolx

[Install]
WantedBy=multi-user.target
"""

print("Configuring Systemd service on remote VPS...")
temp_service_file = "/tmp/toolx.service"
# Write systemd file on VPS
stdin, stdout, stderr = ssh.exec_command(f"cat << 'EOF' > {temp_service_file}\n{systemd_service}\nEOF")
stdout.read()  # Wait for write
ssh.exec_command(f"mv {temp_service_file} /etc/systemd/system/toolx.service")

print("Initializing python virtual environment and installing dependencies on remote VPS...")
vps_setup_commands = [
    "apt-get update -y && apt-get install -y python3-pip python3-venv python3-dev libpq-dev postgresql-client",
    f"python3 -m venv {REMOTE_DIR}/venv",
    f"{REMOTE_DIR}/venv/bin/pip install --upgrade pip",
    f"{REMOTE_DIR}/venv/bin/pip install flask sqlalchemy psycopg2-binary requests werkzeug"
]

for cmd in vps_setup_commands:
    print(f"Running command on VPS: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    exit_status = stdout.channel.recv_exit_status()
    if exit_status != 0:
        print(f"Command failed with status {exit_status}")
        print("STDERR:", stderr.read().decode('utf-8'))
        print("STDOUT:", stdout.read().decode('utf-8'))

print("Starting/Restarting Toolx service on remote VPS...")
restart_commands = [
    "systemctl daemon-reload",
    "systemctl enable toolx.service",
    "systemctl restart toolx.service"
]

for cmd in restart_commands:
    stdin, stdout, stderr = ssh.exec_command(cmd)
    stdout.read()

print("Checking toolx service status...")
stdin, stdout, stderr = ssh.exec_command("systemctl status toolx.service")
status_text = stdout.read().decode('utf-8', errors='ignore')
print(status_text.encode('ascii', errors='replace').decode('ascii'))

ssh.close()
print("Deployment completed successfully!")
