import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('agentapi.quanlymay.com', username='root', password='@baoLong0511')
cmd = "sudo -u postgres psql -d GoPrinx -t -c 'SELECT COUNT(*) FROM \"Printer\"'"
_, out, err = ssh.exec_command(cmd)
print('Count:', out.read().decode('utf-8').strip())
cmd = "sudo -u postgres psql -d GoPrinx -t -c 'SELECT id, printer_name, ip FROM \"Printer\"'"
_, out, err = ssh.exec_command(cmd)
print('Records:', out.read().decode('utf-8'))
print('ERR:', err.read().decode('utf-8'))
ssh.close()
