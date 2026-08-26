import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('agentapi.quanlymay.com', username='root', password='@baoLong0511')
_, out, err = ssh.exec_command('cat /var/www/agentapi/.env || cat /opt/agentapi/.env || cat /root/goxprint/backend/.env')
print('ENV:', out.read().decode('utf-8'))
ssh.close()
