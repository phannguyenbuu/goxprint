import os
filename = '/opt/printagent/ui_routes.py'
with open(filename, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'DEBUG: command' in line or '-encodedCommand' in line:
        continue
    new_lines.append(line)

with open(filename, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
