import paramiko
import sqlite3
import os

scripts = {
    'toshiba_create_scan': 'toshiba_create_scan.py',
    'toshiba_delete_scan': 'toshiba_del.py',
    'toshiba_list_scan': 'toshiba_list_scan.py'
}

# Upload files to VPS
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('157.66.80.125', username='root', password='@baoLong0511')
sftp = ssh.open_sftp()

for cmd_name, filepath in scripts.items():
    if os.path.exists(filepath):
        print(f"Uploading {filepath}...")
        sftp.put(filepath, f'/tmp/{cmd_name}.py')

sftp.close()

# Update DB using python script on VPS
update_script = """
import sqlite3
import os

scripts = ['toshiba_create_scan', 'toshiba_delete_scan', 'toshiba_list_scan']
conn = sqlite3.connect('/opt/printagent/printagent.db')
c = conn.cursor()

for cmd_name in scripts:
    filepath = f'/tmp/{cmd_name}.py'
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        c.execute('UPDATE UtilityCommands SET command_content = ? WHERE command = ?', (content, cmd_name))
        print(f'Updated {cmd_name} in DB')

conn.commit()
conn.close()
"""

with open('remote_update.py', 'w', encoding='utf-8') as f:
    f.write(update_script)

sftp = ssh.open_sftp()
sftp.put('remote_update.py', '/tmp/remote_update.py')
sftp.close()

stdin, stdout, stderr = ssh.exec_command('python3 /tmp/remote_update.py')
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
ssh.close()
print("Done!")
