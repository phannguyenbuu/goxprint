lines = open('polling_aux_routes.py', encoding='utf-8').read().split('\n')
for i in range(len(lines)):
    if 'return jsonify({"ok": False, "error": "Command not found"}), 404' in lines[i]:
        lines[i] = lines[i].replace('return jsonify({"ok": False, "error": "Command not found"}), 404', 'return jsonify({"ok": True, "error": "Command not found (assumed already processed)"}), 200')
open('polling_aux_routes.py', 'w', encoding='utf-8').write('\n'.join(lines))
