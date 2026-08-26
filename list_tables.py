import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('agentapi.quanlymay.com', username='root', password='@baoLong0511')
cmd = "sudo -u postgres psql -d GoPrinx -c '\\dt'"
_, out, err = ssh.exec_command(cmd)
print('Tables:', out.read().decode('utf-8'))
ssh.close()
