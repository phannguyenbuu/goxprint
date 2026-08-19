import sys
import json
from pathlib import Path

# Add GoxAgent to path
sys.path.insert(0, r"d:\Dropbox\_Documents\GoxAgent")

from agent.services.polling_bridge import PollingBridge
from agent.config import AppConfig

config = AppConfig({"api_url": "https://printagentx.com/api"})

bridge = PollingBridge(config)
bridge._last_discovered_printers = [] # empty to test fallback

script = """
import json
printers = []
if bridge:
    items = getattr(bridge, '_last_discovered_printers', [])
    if not items and hasattr(bridge, '_load_local_printers_json'):
        try:
            items = bridge._load_local_printers_json()
        except:
            pass
    for p in items:
        printers.append({
            'id': getattr(p, 'id', 0),
            'printer_name': getattr(p, 'name', '') or getattr(p, 'printer_name', ''),
            'ip': getattr(p, 'ip', ''),
            'mac_address': getattr(p, 'mac_address', ''),
            'status': 'online' if getattr(p, 'is_online', True) else 'offline',
            'is_online': getattr(p, 'is_online', True),
            'physical_status': getattr(p, 'physical_status', ''),
            'printer_type': getattr(p, 'printer_type', ''),
            'brand': getattr(p, 'brand', ''),
            'auth_user': getattr(p, 'auth_user', ''),
            'user': getattr(p, 'user', ''),
            'auth_password': getattr(p, 'auth_password', ''),
            'password': getattr(p, 'password', '')
        })
    if not printers:
        try:
            items = bridge._api_client.get_printers()
            for p in items:
                printers.append({
                    'id': getattr(p, 'id', 0),
                    'printer_name': getattr(p, 'name', '') or getattr(p, 'printer_name', ''),
                    'ip': getattr(p, 'ip', ''),
                    'mac_address': getattr(p, 'mac_address', ''),
                    'status': 'online' if getattr(p, 'is_online', True) else 'offline',
                    'is_online': getattr(p, 'is_online', True),
                    'physical_status': getattr(p, 'physical_status', ''),
                    'printer_type': getattr(p, 'printer_type', ''),
                    'brand': getattr(p, 'brand', ''),
                    'auth_user': getattr(p, 'auth_user', ''),
                    'user': getattr(p, 'user', ''),
                    'auth_password': getattr(p, 'auth_password', ''),
                    'password': getattr(p, 'password', '')
                })
        except:
            pass
context['result_payload'] = json.dumps(printers)
"""

context_vars = {"result_payload": None}

try:
    exec(script, {"__builtins__": __builtins__, "bridge": bridge, "context": context_vars})
    print("SUCCESS")
    print(context_vars["result_payload"])
except Exception as e:
    import traceback
    traceback.print_exc()

