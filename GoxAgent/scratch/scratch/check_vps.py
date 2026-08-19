import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('agentapi.quanlymay.com', username='root', password='@baoLong0511', timeout=10)

stdin, stdout, stderr = ssh.exec_command('journalctl -u printagent.service -n 5000 --no-pager | grep result')
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()
