import re

with open('app-gox/src/pages/Agent/hooks/useAgentCoreLogic.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find("const scriptContent = `") + len("const scriptContent = `")
end = content.find("`;", start)
script_content = content[start:end].strip()
script_content = script_content.replace('\\\\', '\\')

out = "import psycopg2\n"
out += "conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')\n"
out += "c = conn.cursor()\n"
out += f"script_content = {repr(script_content)}\n"
out += "c.execute('UPDATE uti_commands SET command_content=%s WHERE command=%s', (script_content, 'force_subnet_scan'))\n"
out += "conn.commit()\n"
out += "print('UPDATED DB SUCCESSFULLY')\n"

with open('update_db.py', 'w', encoding='utf-8') as f:
    f.write(out)
