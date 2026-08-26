import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('157.66.80.125', username='root', password='@baoLong0511')
cmd = "sqlite3 /opt/printagent/printagent.db \"SELECT command_content FROM UtilityCommands WHERE command = 'toshiba_delete_scan';\""
_, out, _ = ssh.exec_command(cmd)
with open('toshiba_del.py', 'w', encoding='utf-8') as f:
    f.write(out.read().decode('utf-8'))
ssh.close()
