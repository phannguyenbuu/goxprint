
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
