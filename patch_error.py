import os

for filename in ['/opt/printagent/ui_routes.py', '/opt/printagent/agent_utility_routes.py']:
    if not os.path.exists(filename): continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'except Exception as e: print(e)' in content:
        content = content.replace('except Exception as e: print(e)',
                                  'except Exception as e:\n            from flask import jsonify\n            return jsonify({"ok": False, "error": f"VPS DB load error: {e}"}), 500')
    
    if 'LOGGER.warning("[utility/exec] Failed to load fresh UtiCommand: %s", exc)' in content:
        # For agent_utility_routes.py
        new_block = '''LOGGER.error(f"[utility/exec] DB error: {exc}")
            from flask import jsonify
            return jsonify({"ok": False, "error": f"VPS DB load error: {exc}"}), 500'''
        content = content.replace('LOGGER.warning("[utility/exec] Failed to load fresh UtiCommand: %s", exc)', new_block)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
