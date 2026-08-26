import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('agentapi.quanlymay.com', username='root', password='@baoLong0511')
_, out, err = ssh.exec_command('sudo -u postgres psql -l')
print('DBs:', out.read().decode('utf-8'))
ssh.close()
