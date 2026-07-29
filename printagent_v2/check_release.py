import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('157.66.80.125', username='root', key_filename=r'C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519')

script = """
import os, json
for path in [
    '/opt/printagent/storage/releases/agent_release.json',
    '/opt/printagent/storage/releases/agent_core_release.json',
    '/opt/printagent/static/releases/agent_release.json',
    '/opt/printagent/static/releases/agent_core_release.json',
]:
    if os.path.exists(path):
        with open(path) as f:
            print(path, "->", f.read())
    else:
        print(path, "-> DOES NOT EXIST")
"""

sftp = client.open_sftp()
with sftp.file('/tmp/chk_rel.py', 'w') as f:
    f.write(script)
sftp.close()

stdin, stdout, stderr = client.exec_command('/opt/printagent/venv/bin/python3 /tmp/chk_rel.py')
print("STDOUT:", stdout.read().decode('utf-8', 'ignore'))
print("STDERR:", stderr.read().decode('utf-8', 'ignore'))
client.close()
