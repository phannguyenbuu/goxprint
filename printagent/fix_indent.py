import os

filepath = r"d:\Dropbox\_Documents\Goxprint\printagent\agent\services\polling_worker_mixin.py"
with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
in_process_block = False

for i, line in enumerate(lines):
    if i >= 855 and i <= 1113:
        if line.strip() == "":
            new_lines.append(line)
        else:
            new_lines.append("    " + line)
    else:
        new_lines.append(line)

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Fixed indentation!")
