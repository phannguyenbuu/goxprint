import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('100.73.10.37', username='root', password='H@2026', timeout=120)
stdin, stdout, stderr = client.exec_command('python3 -c "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect((\'8.8.8.8\', 1)); print(s.getsockname()[0])"')
print("IP:", stdout.read().decode())
