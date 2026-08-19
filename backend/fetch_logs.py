import paramiko

deploy_host = "157.66.80.125"
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(deploy_host, username='root', password='@baoLong0511', timeout=10)

stdin, stdout, stderr = ssh.exec_command("journalctl -u printagent --since '1 hour ago' --no-pager | grep -A 20 -i 'traceback'")
print(stdout.read().decode('utf-8'))
