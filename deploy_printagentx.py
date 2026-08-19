import paramiko
import os
import subprocess
from pathlib import Path

def main():
    root_dir = Path(__file__).resolve().parent
    local_dist = root_dir / "auto-gox-react" / "dist"
    
    print("Building auto-gox-react locally...")
    subprocess.run("npm run build", shell=True, cwd=str(root_dir / "auto-gox-react"), check=True)
    
    deploy_host = "157.66.80.125"
    
    print(f"Connecting to VPS at {deploy_host} using password...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(deploy_host, username='root', password='@baoLong0511', timeout=10)
    
    print("Opening SFTP session...")
    sftp = ssh.open_sftp()
    
    remote_dir = "/var/www/printagentx.com/html"
    
    # Empty remote directory first (optional, but good for clean deploy)
    print("Cleaning remote directory...")
    ssh.exec_command(f"rm -rf {remote_dir}/*")
    
    # Helper to recursively upload
    def upload_dir(local_path, remote_path):
        try:
            sftp.mkdir(remote_path)
        except IOError:
            pass
            
        for entry in os.scandir(local_path):
            if entry.is_dir():
                upload_dir(entry.path, f"{remote_path}/{entry.name}")
            else:
                r_file = f"{remote_path}/{entry.name}"
                print(f"Uploading {entry.name}...")
                sftp.put(entry.path, r_file)
                
    print(f"Uploading frontend assets to {remote_dir}...")
    upload_dir(str(local_dist), remote_dir)
    
    sftp.close()
    ssh.close()
    print("Deployment completed successfully!")

if __name__ == "__main__":
    main()
