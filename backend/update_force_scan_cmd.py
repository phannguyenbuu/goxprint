import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import UtiCommand

engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
Session = sessionmaker(bind=engine)
session = Session()

FAST_FORCE_SCAN_SCRIPT = r'''def force_scan():
    import os, json, socket, subprocess, re, tempfile, html, threading
    from datetime import datetime
    from concurrent.futures import ThreadPoolExecutor

    subnet_prefix = "192.168.1"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.2)
        s.connect(("8.8.8.8", 80))
        real_ip = s.getsockname()[0]
        s.close()
        if real_ip and not real_ip.startswith("127."):
            subnet_prefix = '.'.join(real_ip.split('.')[:3])
    except Exception: pass

    arp_map = {}
    try:
        arp_out = subprocess.run(['arp', '-a'], capture_output=True, text=True, errors='ignore', timeout=1.0).stdout
        for line in arp_out.splitlines():
            m = re.search(r'([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\s+([0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2})', line)
            if m:
                ip_k = m.group(1); mac_v = m.group(2).replace('-', ':').upper()
                if mac_v != '00:00:00:00:00:00' and mac_v != 'FF:FF:FF:FF:FF:FF':
                    arp_map[ip_k] = mac_v
    except Exception: pass

    discovered_printers = []
    lock = threading.Lock()

    def detect_brand(name_str, mac_str, body_text=""):
        s = (name_str + " " + body_text).lower(); clean_mac = mac_str.replace('-', ':').upper()
        if any(k in s for k in ("toshiba", "e-studio", "estudio", "topaccess")) or clean_mac.startswith(("00:80:91", "00:08:A1")): return "toshiba"
        if any(k in s for k in ("ricoh", "aficio", "gestetner", "savin", "lanier", "wimtoken", "webarch")) or clean_mac.startswith(("00:26:73", "58:38:79", "00:00:74", "00:E0:00")): return "ricoh"
        if any(k in s for k in ("xerox", "fuji", "fujifilm", "docucentre", "apeos", "versalink", "altalink", "workcentre", "centreware", "phaser", "docuprint")) or clean_mac.startswith(("00:10:A4", "00:00:AA", "00:00:36", "00:20:6B", "9C:93:4E", "00:11:0A")): return "xerox"
        if any(k in s for k in ("canon", "imagerunner", "ir-adv", "ir ", "imageclass", "pixma", "lbp", "i-sensys")) or clean_mac.startswith(("00:1B:A9", "00:00:85", "00:1E:8F", "00:00:E2", "00:26:55", "00:80:92", "01:00:85", "18:0C:AC", "34:E6:D7", "48:D2:40")): return "canon"
        if any(k in s for k in ("hp ", "hewlett", "laserjet", "officejet", "pagewide", "deskjet", "envy", "jetdirect", "smarttank", "laser jet")) or clean_mac.startswith(("00:1E:0B", "00:08:C7", "00:17:A4", "00:25:B3", "00:1F:29", "00:18:FE", "00:11:0A", "00:1B:78", "30:E1:71", "F4:CE:46", "18:60:24", "D4:85:64", "9C:8E:99")): return "hp"
        if any(k in s for k in ("brother", "mfc-", "hl-", "dcp-")) or clean_mac.startswith(("00:21:B7", "00:80:77")): return "brother"
        if any(k in s for k in ("epson", "workforce", "ecotank", "stylus")) or clean_mac.startswith(("00:00:48", "00:26:AB", "44:D2:44")): return "epson"
        return "generic"

    def probe_host(ip):
        is_print_port_open = False
        for port in (9100, 515, 631):
            s = None
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.15)
                if s.connect_ex((ip, port)) == 0:
                    is_print_port_open = True
                    break
            except Exception: pass
            finally:
                if s:
                    try: s.close()
                    except Exception: pass

        is_web_open = False
        web_port = 80
        for port in (80, 443):
            s = None
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.15)
                if s.connect_ex((ip, port)) == 0:
                    is_web_open = True
                    web_port = port
                    break
            except Exception: pass
            finally:
                if s:
                    try: s.close()
                    except Exception: pass

        if not is_print_port_open and not is_web_open: return

        model_name = ""
        body_content = ""

        if is_web_open:
            s = None
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.3)
                s.connect((ip, web_port))
                req = f"GET / HTTP/1.1\r\nHost: {ip}\r\nUser-Agent: Mozilla/5.0\r\nConnection: close\r\n\r\n"
                s.sendall(req.encode('latin-1'))
                raw_b = b""
                while len(raw_b) < 2048:
                    chunk = s.recv(512)
                    if not chunk: break
                    raw_b += chunk
                body = raw_b.decode('utf-8', errors='ignore')
                body_low = body.lower()
                body_content = body_low

                tm = re.search(r'<title[^>]*>(.*?)</title>', body, re.IGNORECASE | re.DOTALL)
                if tm:
                    raw_t = html.unescape(tm.group(1)).strip()
                    clean_t = re.sub(r'[\r\n\t]+', ' ', raw_t).strip()
                    if clean_t and clean_t.lower() not in ("index", "home", "default", "welcome", "login", "main", "topaccess", "web image monitor"):
                        model_name = clean_t

                if not model_name or "topaccess" in model_name.lower():
                    if any(k in body_low for k in ("webarch", "ricoh", "wimtoken", "aficio", "web image monitor")):
                        m = re.search(r'(?:aficio\s+)?(?:mp|im|sp)\s*[c]?\s*[0-9]{3,4}[a-z]*', body, re.IGNORECASE)
                        model_name = f"RICOH {m.group(0).upper()}" if m else ""
                    elif any(k in body_low for k in ("topaccess", "toshiba", "e-studio", "estudio")):
                        m = re.search(r'e-studio\s*[0-9]{3,4}[a-z]*', body, re.IGNORECASE)
                        model_name = f"TOSHIBA {m.group(0).upper()}" if m else "TOSHIBA e-STUDIO"
                    elif any(k in body_low for k in ("xerox", "centreware", "workcentre", "versalink", "altalink", "fuji", "fujifilm", "apeos", "docucentre", "docuprint")):
                        m = re.search(r'(?:docucentre|versalink|altalink|workcentre|phaser|apeosport|apeos|docuprint)\s*[-_]?\s*[a-z0-9-]+', body, re.IGNORECASE)
                        model_name = f"XEROX {m.group(0).upper()}" if m else "XEROX Printer"
                    elif any(k in body_low for k in ("canon", "imagerunner", "imageclass", "pixma", "i-sensys", "ir-adv", "lbp")):
                        m = re.search(r'(?:canon\s+)?(?:imageRUNNER|imageCLASS|i-SENSYS|PIXMA|LBP|MFP|iR-ADV|iR)\s*[a-z0-9\s-]*[0-9]{3,4}[a-z]*', body, re.IGNORECASE)
                        model_name = f"Canon {m.group(0)}" if m else "Canon Printer"
                    elif any(k in body_low for k in ("hp", "laserjet", "officejet", "pagewide", "deskjet", "envy", "smarttank")):
                        m = re.search(r'(?:hp\s+)?(?:color\s+)?(?:laserjet|officejet|pagewide|deskjet|envy|smarttank)\s*[a-z0-9\s-]*[0-9]{3,4}[a-z]*', body, re.IGNORECASE)
                        model_name = f"HP {m.group(0)}" if m else "HP LaserJet Printer"
                    elif "epson" in body_low: model_name = "EPSON Printer"
            except Exception: pass
            finally:
                if s:
                    try: s.close()
                    except Exception: pass

        if not model_name or any(kw in model_name.lower() for kw in ("printer", "copier", "ricoh mp", "toshiba e-studio", "xerox", "canon")):
            s_snmp = None
            try:
                pkt = b'\x30\x29\x02\x01\x00\x04\x06public\xa0\x1c\x02\x04\x12\x34\x56\x78\x02\x01\x00\x02\x01\x00\x30\x0e\x30\x0c\x06\x08\x2b\x06\x01\x02\x01\x01\x01\x00\x05\x00'
                s_snmp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s_snmp.settimeout(0.2)
                s_snmp.sendto(pkt, (ip, 161))
                data, _ = s_snmp.recvfrom(2048)
                raw_snmp = data.decode('latin-1', errors='ignore')
                m = re.search(r'(?:aficio\s+)?(?:mp|im|sp)\s*[c]?\s*[0-9]{3,4}[a-z]*|e-studio\s*[0-9]{3,4}[a-z]*|docucentre\s*[-_]?\s*[a-z0-9-]+|(?:imageRUNNER|iR)\s*[a-z0-9\s-]*[0-9]{3,4}[a-z]*|laserjet\s*[a-z0-9\s-]*[0-9]{3,4}[a-z]*', raw_snmp, re.IGNORECASE)
                if m:
                    model_name = m.group(0).strip()
            except Exception: pass
            finally:
                if s_snmp:
                    try: s_snmp.close()
                    except Exception: pass

        if model_name:
            if re.search(r'e[-_]?studio', model_name, re.IGNORECASE) and not model_name.upper().startswith("TOSHIBA"):
                model_name = f"TOSHIBA {model_name}"
            elif re.search(r'\b(MP|IM|Aficio)\b', model_name) and not model_name.upper().startswith("RICOH"):
                model_name = f"RICOH {model_name}"

        mac = arp_map.get(ip, "")
        if not mac:
            parts = ip.split('.')
            mac = f"00:11:22:{int(parts[2]):02X}:{int(parts[3]):02X}:00"

        brand = detect_brand(model_name, mac, body_content)

        if brand == "generic" and not is_print_port_open:
            return

        if not model_name or model_name.lower() in ("web image monitor", "topaccess", "printer"):
            if brand == "ricoh": model_name = f"RICOH MP ({ip})"
            elif brand == "toshiba": model_name = f"TOSHIBA e-STUDIO ({ip})"
            elif brand == "xerox": model_name = f"XEROX / Fujifilm ({ip})"
            elif brand == "hp": model_name = f"HP LaserJet ({ip})"
            elif brand == "canon": model_name = f"Canon imageRUNNER ({ip})"
            elif brand == "epson": model_name = f"EPSON Printer ({ip})"
            elif brand == "brother": model_name = f"Brother Printer ({ip})"
            else: model_name = f"Printer ({ip})"

        model_name = html.unescape(model_name).strip()

        printer_obj = {
            "name": model_name, "printer_name": model_name, "ip": ip, "mac_address": mac,
            "printer_type": brand, "is_online": True, "status": "online", "probed": True,
            "user": "admin", "password": "", "auth_user": "admin", "auth_password": "",
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        with lock:
            discovered_printers.append(printer_obj)

    with ThreadPoolExecutor(max_workers=35) as executor:
        executor.map(probe_host, [f"{subnet_prefix}.{i}" for i in range(1, 255)])

    _DEVICE_NAME_BLACKLIST = ("file pro", "print server", "printserver", "f6600", "f66", "h3601", "h36", "router", "modem", "gateway", "zte", "mesh", "hg6", "gpon", "ont", "tenda", "tp-link", "totolink")
    printers_list = [
        p for p in discovered_printers
        if p.get('mac_address') and not any(kw in html.unescape(str(p.get('name') or '')).lower() for kw in _DEVICE_NAME_BLACKLIST)
    ]

    temp_dir = tempfile.gettempdir()
    target_dir = os.path.join(temp_dir, 'GoPrinxAgent')
    os.makedirs(target_dir, exist_ok=True)
    json_file = os.path.join(target_dir, 'printers.json')
    try:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(printers_list, f, ensure_ascii=False, indent=2)
    except Exception: pass

    res_str = json.dumps(printers_list, ensure_ascii=False, indent=2)
    if globals().get('context'): globals()['context']['result_payload'] = res_str
    print('__PRINTERS_JSON_START__\n' + res_str + '\n__PRINTERS_JSON_END__')

try:
    force_scan()
except Exception as err:
    print(f"[-] LỖI THỰC THI: {err}")
'''

cmd = session.query(UtiCommand).filter_by(command='force_subnet_scan').first()
if cmd:
    cmd.command_content = FAST_FORCE_SCAN_SCRIPT
    session.commit()
    print("[✓] Successfully updated UtiCommand force_subnet_scan with 35 Workers & Safe Socket Cleanup!")
else:
    print("[-] Command force_subnet_scan not found in UtiCommand table!")
