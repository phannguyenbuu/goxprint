import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    print("Connecting to TVBox...")
    client.connect('100.73.10.37', username='root', password='H@2026', timeout=60, banner_timeout=120, auth_timeout=120)
    stdin, stdout, stderr = client.exec_command('journalctl -u goxagent --no-pager | grep "subnet scan"')
    print(stdout.read().decode())
    
    # We should upload the modified scanner.py to the TVBox!
    print("Uploading scanner.py...")
    sftp = client.open_sftp()
    sftp.put('D:/Dropbox/_Documents/Goxprint/GoxAgent/agent/utils/scanner.py', '/opt/GoxAgent/agent/utils/scanner.py')
    sftp.close()
    
    print("Restarting goxagent...")
    client.exec_command('systemctl restart goxagent')
    time.sleep(2)
    stdin, stdout, stderr = client.exec_command('systemctl status goxagent')
    print(stdout.read().decode())
    
except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
