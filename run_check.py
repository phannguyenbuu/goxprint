import paramiko
import os
import sys

# Windows console encoding fix
sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('157.66.80.125', username='root', password='@baoLong0511')

_, out, err = ssh.exec_command('/opt/printagent/venv/bin/python3 /opt/printagent/check_uti.py')
print(out.read().decode('utf-8', errors='ignore'))
ssh.close()
