import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('agentapi.quanlymay.com', username='root', password='@baoLong0511', timeout=10)
stdin, stdout, stderr = ssh.exec_command('sudo -u postgres psql -d GoPrinx -c "SELECT id, command_type, status, error_message FROM \\"PrinterControlCommand\\" WHERE id = 3417;"')
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()
