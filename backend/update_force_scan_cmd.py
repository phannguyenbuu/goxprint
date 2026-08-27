import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import UtiCommand

engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
Session = sessionmaker(bind=engine)
session = Session()

FAST_FORCE_SCAN_SCRIPT = '''def force_scan():
    import logging, threading, sys, os, json, socket, time, subprocess, re, tempfile
    from datetime import datetime
    from concurrent.futures import ThreadPoolExecutor
    
    bridge_obj = globals().get('bridge') or locals().get('bridge')
    
    if bridge_obj:
        print("[*] Đang thực thi Clean Fresh Scan qua Native PrintAgent...")
        try:
            printers = bridge_obj._load_printers(force_live=True)
            try: bridge_obj.trigger_once()
            except Exception: pass
            
            printers_list = []
            for p in (printers or []):
                mac = str(getattr(p, "mac_address", "") or getattr(p, "mac_id", "") or "").strip().upper().replace("-", ":")
                ip = str(getattr(p, "ip", "") or "").strip()
                name = str(getattr(p, "name", "") or "").strip()
                p_type = str(getattr(p, "printer_type", "") or "unknown").strip().lower()
                
                if not mac: continue
                if p_type == "unknown" and (name.startswith("Copier (") or "printer" not in name.lower()): continue
                
                p_dict = {
                    "name": name, "printer_name": name, "ip": ip, "mac_address": mac,
                    "printer_type": p_type, "is_online": getattr(p, "is_online", True),
                    "status": "online" if getattr(p, "is_online", True) else "offline", "probed": True,
                    "user": getattr(p, "user", "") or getattr(p, "auth_user", ""),
                    "password": getattr(p, "password", "") or getattr(p, "auth_password", ""),
                    "auth_user": getattr(p, "auth_user", "") or getattr(p, "user", ""),
                    "auth_password": getattr(p, "auth_password", "") or getattr(p, "password", ""),
                    "updated_at": getattr(p, "updated_at", "") or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                printers_list.append(p_dict)
            
            res_str = json.dumps(printers_list, ensure_ascii=False, indent=2)
            if globals().get('context'): globals()['context']['result_payload'] = res_str
            print('__PRINTERS_JSON_START__\\n' + res_str + '\\n__PRINTERS_JSON_END__')
        except Exception as e:
            err_msg = f"[-] LỖI THỰC THI NATIVE: {e}"
            print(err_msg); raise RuntimeError(err_msg)
    else:
        print("==================================================")
        print("  [FAST CLEAN SCAN] DÒ QUÉT TẠO MỚI PRINTERS.JSON")
        print("==================================================")
        try:
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            subnet_prefix = '.'.join(local_ip.split('.')[:3])
        except Exception:
            subnet_prefix = "192.168.1"

        arp_map = {}
        try:
            arp_out = subprocess.run(['arp', '-a'], capture_output=True, text=True, errors='ignore').stdout
            for line in arp_out.splitlines():
                m = re.search(r'([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})\\s+([0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2})', line)
                if m:
                    ip_k = m.group(1); mac_v = m.group(2).replace('-', ':').upper()
                    if mac_v != '00:00:00:00:00:00' and mac_v != 'FF:FF:FF:FF:FF:FF':
                        arp_map[ip_k] = mac_v
        except Exception: pass

        temp_dir = tempfile.gettempdir()
        target_dir = os.path.join(temp_dir, 'GoPrinxAgent')
        os.makedirs(target_dir, exist_ok=True)
        json_file = os.path.join(target_dir, 'printers.json')

        discovered_printers = []
        lock = threading.Lock()
        PORTS_TO_CHECK = [80, 9100, 443]

        def detect_brand(name_str, mac_str):
            s = name_str.lower(); clean_mac = mac_str.replace('-', ':').upper()
            if "toshiba" in s or "e-studio" in s or clean_mac.startswith("00:80:91"): return "toshiba"
            if any(k in s for k in ("ricoh", "aficio", "mp ", "sp ", "pro ")) or clean_mac.startswith(("00:26:73", "58:38:79", "00:00:74")): return "ricoh"
            if any(k in s for k in ("hp", "laserjet", "officejet", "pagewide", "deskjet", "envy")) or clean_mac.startswith(("00:1E:0B", "00:08:C7")): return "hp"
            if any(k in s for k in ("canon", "imagerunner", "ir-adv", "ir ", "imageclass", "pixma")) or clean_mac.startswith(("00:1B:A9", "00:00:85")): return "canon"
            if any(k in s for k in ("xerox", "versalink", "altalink", "workcentre")) or clean_mac.startswith(("00:10:A4", "00:00:AA")): return "xerox"
            if any(k in s for k in ("brother", "mfc-", "hl-", "dcp-")) or clean_mac.startswith("00:21:B7"): return "brother"
            if any(k in s for k in ("epson", "workforce", "ecotank")) or clean_mac.startswith("00:00:48"): return "epson"
            return "unknown"

        def probe_host(ip):
            has_open = False
            for port in PORTS_TO_CHECK:
                try:
                    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                        s.settimeout(0.18)
                        if s.connect_ex((ip, port)) == 0:
                            has_open = True
                            break
                except Exception: pass
            if not has_open: return

            model_name = ""
            try:
                import urllib.request, ssl
                ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
                req = urllib.request.Request(f"http://{ip}/", headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, context=ctx, timeout=0.8) as r:
                    body = r.read().decode('utf-8', errors='ignore'); body_low = body.lower()
                    if "topaccess" in body_low or "toshiba" in body_low:
                        m = re.search(r'e-studio[a-z0-9]+', body, re.IGNORECASE)
                        model_name = f"TOSHIBA {m.group(0)}" if m else "TOSHIBA e-STUDIO"
                    elif "webarch" in body_low or "ricoh" in body_low or "wimtoken" in body_low:
                        m = re.search(r'(?:aficio\\s+)?mp\\s+[0-9a-z]+', body, re.IGNORECASE)
                        model_name = f"RICOH {m.group(0).upper()}" if m else "RICOH MP"
                    elif "epson" in body_low: model_name = "EPSON Printer"
                    elif "canon" in body_low: model_name = "Canon Printer"
                    elif "hp " in body_low or "laserjet" in body_low: model_name = "HP LaserJet Printer"
            except Exception: pass

            mac = arp_map.get(ip, "")
            if not mac: return
            if not model_name: model_name = f"Printer ({ip})"
            brand = detect_brand(model_name, mac)
            if brand == "unknown" and (model_name.startswith("Copier (") or "printer" not in model_name.lower()): return

            printer_obj = {
                "name": model_name, "printer_name": model_name, "ip": ip, "mac_address": mac,
                "printer_type": brand, "is_online": True, "status": "online", "probed": True,
                "user": "admin", "password": "", "auth_user": "admin", "auth_password": "",
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            with lock:
                discovered_printers.append(printer_obj)

        with ThreadPoolExecutor(max_workers=100) as executor:
            executor.map(probe_host, [f"{subnet_prefix}.{i}" for i in range(1, 255)])

        _DEVICE_NAME_BLACKLIST = ("file pro", "print server", "printserver", "f6600", "f66", "h3601", "h36", "router", "modem")
        valid_final_printers = [
            p for p in discovered_printers
            if p.get('mac_address') and not any(kw in str(p.get('name') or '').lower() for kw in _DEVICE_NAME_BLACKLIST)
        ]

        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(valid_final_printers, f, ensure_ascii=False, indent=2)

        res_str = json.dumps(valid_final_printers, ensure_ascii=False, indent=2)
        if globals().get('context'): globals()['context']['result_payload'] = res_str
        print('__PRINTERS_JSON_START__\\n' + res_str + '\\n__PRINTERS_JSON_END__')

try:
    force_scan()
except Exception as err:
    print(f"[-] LỖI THỰC THI: {err}")
'''

cmd = session.query(UtiCommand).filter_by(command='force_subnet_scan').first()
if cmd:
    cmd.command_content = FAST_FORCE_SCAN_SCRIPT
    session.commit()
    print("[✓] Successfully updated UtiCommand force_subnet_scan in Database!")
else:
    print("[-] Command force_subnet_scan not found in UtiCommand table!")
