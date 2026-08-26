import os
filename = '/opt/printagent/ui_routes.py'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('if not command_content:',
    'print(f"DEBUG: command={command}, cmd_entry_is_none={cmd_entry is None}, cmd_entry={getattr(cmd_entry, \'command\', \'\')}, content_len={len(command_content) if command_content else 0}")\n        if not command_content:')

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)
