import os

filename = '/opt/printagent/ui_routes.py'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken line
broken_line = 'return jsonify({" ok: False, error: fDatabase error when fetching UtiCommand: -encodedCommand ZQA= }), 500'
fixed_line = 'return jsonify({"ok": False, "error": f"VPS DB load error: {e}"}), 500'

content = content.replace(broken_line, fixed_line)

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)

filename2 = '/opt/printagent/agent_utility_routes.py'
if os.path.exists(filename2):
    with open(filename2, 'r', encoding='utf-8') as f:
        content2 = f.read()
    content2 = content2.replace(broken_line, fixed_line)
    with open(filename2, 'w', encoding='utf-8') as f:
        f.write(content2)

