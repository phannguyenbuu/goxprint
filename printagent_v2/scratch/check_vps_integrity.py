import paramiko
import json

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('31.97.76.62', username='root', key_filename=r'C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519')

print("--- VPS printagent.exe info ---")
stdin, stdout, stderr = ssh.exec_command("sha256sum /opt/printagent/static/releases/printagent.exe; stat -c %s /opt/printagent/static/releases/printagent.exe")
print("STDOUT:")
print(stdout.read().decode())
print("STDERR:")
print(stderr.read().decode())

print("--- VPS agent_release.json content ---")
stdin, stdout, stderr = ssh.exec_command("cat /opt/printagent/storage/releases/agent_release.json")
print("STDOUT:")
print(stdout.read().decode())
print("STDERR:")
print(stderr.read().decode())

ssh.close()
