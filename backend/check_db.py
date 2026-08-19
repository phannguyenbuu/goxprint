import paramiko

deploy_host = "157.66.80.125"
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(deploy_host, username='root', password='@baoLong0511', timeout=10)

stdin, stdout, stderr = ssh.exec_command(
    "sudo -u postgres psql -d GoPrinx -c \"SELECT id, status, error_message FROM \\\"PrinterControlCommand\\\" WHERE error_message != '' ORDER BY id DESC LIMIT 5;\""
)
print(stdout.read().decode('utf-8'))
