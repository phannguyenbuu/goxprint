import paramiko
import os
from pathlib import Path

root_dir = Path(__file__).resolve().parent
local_dist = root_dir.parent / "app-gox" / "dist"

# Determine SSH key path dynamically
home = Path.home()
key_candidates = [
    home / ".ssh" / "id_ed25519",
    home / ".ssh" / "id_rsa",
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

remote_dist = "/var/www/app-gox"

# Clean remote directory or ensure it exists
try:
    sftp.mkdir(remote_dist)
    print(f"Created remote directory: {remote_dist}")
except IOError:
    pass  # Already exists

def sftp_put_dir(local_path, remote_path):
    """Recursively uploads a directory via SFTP"""
    for item in os.listdir(local_path):
        local_item = os.path.join(local_path, item)
        remote_item = f"{remote_path}/{item}"
        
        if os.path.isdir(local_item):
            try:
                sftp.mkdir(remote_item)
                print(f"Created remote directory: {remote_item}")
            except IOError:
                pass  # Directory already exists
            sftp_put_dir(local_item, remote_item)
        else:
            print(f"Uploading {local_item} -> {remote_item}...")
            sftp.put(local_item, remote_item)

if not local_dist.exists():
    raise FileNotFoundError(f"Local dist directory not found: {local_dist}. Please run npm run build first.")

print(f"Uploading {local_dist} to {remote_dist} on VPS...")
sftp_put_dir(str(local_dist), remote_dist)

sftp.close()
ssh.close()
print("Frontend deployment completed successfully!")
