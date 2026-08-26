import paramiko
import os
import stat
from pathlib import Path

HOST = '100.73.10.37'
USER = 'root'
PASS = 'H@2026'

def sftp_upload_dir(sftp, local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except IOError:
        pass

    for item in os.listdir(local_dir):
        if item in ('__pycache__', '.build-venv', 'build', 'dist', 'scratch', 'storage', 'node_modules', '.git'):
            continue
        local_path = os.path.join(local_dir, item)
        remote_path = remote_dir + '/' + item

        if os.path.isfile(local_path):
            print(f"Uploading {local_path} to {remote_path}")
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            sftp_upload_dir(sftp, local_path, remote_path)

def main():
    print(f"Connecting to {HOST}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=60, banner_timeout=120, auth_timeout=120)

    sftp = ssh.open_sftp()
    
    remote_base = '/opt/GoxAgent'
    print(f"Uploading to {remote_base}...")
    ssh.exec_command(f'mkdir -p {remote_base}/agent')
    ssh.exec_command(f'mkdir -p {remote_base}/agent/modules/ricoh')
    ssh.exec_command(f'mkdir -p {remote_base}/agent/modules/toshiba')
    ssh.exec_command(f'mkdir -p {remote_base}/agent/scripts')
    ssh.exec_command(f'mkdir -p {remote_base}/agent/services')
    ssh.exec_command(f'mkdir -p {remote_base}/agent/templates')
    ssh.exec_command(f'mkdir -p {remote_base}/agent/utils')
    ssh.exec_command(f'mkdir -p {remote_base}/agent/webs')
    
    sftp_upload_dir(sftp, 'D:/Dropbox/_Documents/Goxprint/GoxAgent/agent', remote_base + '/agent')
    sftp.put('D:/Dropbox/_Documents/Goxprint/GoxAgent/settings.json', remote_base + '/settings.json')
    sftp.close()

    print("Configuring service...")
    
    # We will create a systemd service to run the agent
    service_content = f"""[Unit]
Description=GoxAgent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory={remote_base}
ExecStart=/usr/bin/python3 {remote_base}/agent/main.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
"""
    
    stdin, stdout, stderr = ssh.exec_command(f'cat > /etc/systemd/system/goxagent.service', get_pty=True)
    stdin.write(service_content)
    stdin.flush()
    stdin.close()
    
    ssh.exec_command('systemctl daemon-reload')
    ssh.exec_command('systemctl enable goxagent')
    ssh.exec_command('systemctl restart goxagent')
    
    print("Done! GoxAgent is now running as a service on the TVBox.")
    ssh.close()

if __name__ == '__main__':
    main()
