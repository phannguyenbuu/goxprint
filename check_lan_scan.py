import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('157.66.80.125', username='root', password='@baoLong0511')
cmd = "cat /opt/printagent/utility_commands.json | grep -o '\"[^\"]*lan_[^\"]*\"'"
_, out, err = ssh.exec_command(cmd)
print('OUT:', out.read().decode('utf-8'))
ssh.close()
