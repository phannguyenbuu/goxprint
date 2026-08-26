import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('agentapi.quanlymay.com', username='root', password='@baoLong0511')
script = """
import psycopg2
import re

def remove_fallback(content):
    if not content: return content
    return re.sub(
        r'for p in \\["123456", "1234", "12345", "admin", ""\\]:\\s*if p not in pws: pws\\.append\\(p\\)',
        '',
        content
    )

try:
    conn = psycopg2.connect("dbname=GoPrinx user=postgres password=myPass host=localhost")
    conn.autocommit = True
    cur = conn.cursor()
    
    cur.execute("SELECT command, command_content FROM uti_commands")
    rows = cur.fetchall()
    
    updated = 0
    for cmd_name, content in rows:
        if content and 'for p in ["123456"' in content:
            new_content = remove_fallback(content)
            cur.execute("UPDATE uti_commands SET command_content = %s WHERE command = %s", (new_content, cmd_name))
            print(f"Updated {cmd_name} in DB.")
            updated += 1
            
    print(f"Total updated: {updated}")
except Exception as e:
    print(f"DB Error: {e}")
"""
import base64
b64_script = base64.b64encode(script.encode('utf-8')).decode('utf-8')
cmd = f"echo {b64_script} | base64 -d | /opt/printagent/venv/bin/python3"
_, out, err = ssh.exec_command(cmd)
print("OUT:", out.read().decode('utf-8'))
print("ERR:", err.read().decode('utf-8'))
ssh.close()
