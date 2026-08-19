import sys
import json
from dataclasses import dataclass

@dataclass
class Printer:
    id: int = 1
    name: str = "Test Printer"
    ip: str = "192.168.1.100"
    mac_address: str = "00:11:22:33:44:55"
    is_online: bool = True
    physical_status: str = "Ready"
    printer_type: str = "toshiba"
    brand: str = "toshiba"
    auth_user: str = "admin"
    user: str = "admin"
    auth_password: str = "123"
    password: str = "123"

class MockBridge:
    def __init__(self):
        self._last_discovered_printers = [Printer()]
        
    def _load_local_printers_json(self):
        return []

bridge = MockBridge()

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

