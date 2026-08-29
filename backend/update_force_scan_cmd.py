import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import UtiCommand

engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
Session = sessionmaker(bind=engine)
session = Session()

FAST_FORCE_SCAN_SCRIPT = r'''def force_scan():
    import os, json, socket, subprocess, re, tempfile, html, ssl, threading
    import urllib.request
    from datetime import datetime
    from concurrent.futures import ThreadPoolExecutor

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("==================================================")
    print(f"  [QUÉT MẠNG LAN 3 BƯỚC FULL 254 IP] {now_str}")
    print("==================================================")

    # Lấy IP local & xác định dải subnet
    subnet_prefix = "192.168.1"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        s.connect(("8.8.8.8", 80))
        real_ip = s.getsockname()[0]
        s.close()
        if real_ip and not real_ip.startswith("127."):
            subnet_prefix = '.'.join(real_ip.split('.')[:3])
    except Exception:
        try:
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            if local_ip and not local_ip.startswith("127."):
                subnet_prefix = '.'.join(local_ip.split('.')[:3])
        except Exception: pass

    # Lấy bảng ARP cache để tra cứu MAC
    arp_map = {}
    try:
        arp_out = subprocess.run(['arp', '-a'], capture_output=True, text=True, errors='ignore', timeout=1.5).stdout
        for line in arp_out.splitlines():
            m = re.search(r'([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\s+([0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2})', line)
            if m:
                ip_k = m.group(1); mac_v = m.group(2).replace('-', ':').upper()
                if mac_v != '00:00:00:00:00:00' and mac_v != 'FF:FF:FF:FF:FF:FF':
                    arp_map[ip_k] = mac_v
    except Exception: pass

    print(f"[*] Dải subnet mục tiêu: {subnet_prefix}.1 -> {subnet_prefix}.254 (Bảng ARP có {len(arp_map)} MAC)")

    target_ips = [f"{subnet_prefix}.{i}" for i in range(1, 255)]

    def detect_brand(name_str, mac_str, body_str=""):
        s = (name_str or "").lower()
        clean_mac = (mac_str or "").replace('-', ':').upper()
        b = (body_str or "").lower()
        
        if any(k in s or k in b for k in ("toshiba", "e-studio", "estudio", "topaccess")) or clean_mac.startswith(("00:80:91", "00:08:A1")): return "toshiba"
        if any(k in s or k in b for k in ("ricoh", "aficio", "gestetner", "savin", "lanier", "wimtoken", "webarch")) or clean_mac.startswith(("00:26:73", "58:38:79", "00:00:74", "00:E0:00")): return "ricoh"
        if any(k in s or k in b for k in ("xerox", "fuji", "fujifilm", "docucentre", "apeos", "versalink", "altalink", "workcentre", "centreware", "phaser", "docuprint")) or clean_mac.startswith(("00:10:A4", "00:00:AA", "00:00:36", "00:20:6B", "9C:93:4E", "00:11:0A")): return "xerox"
        if any(k in s or k in b for k in ("canon", "imagerunner", "ir-adv", "ir ", "imageclass", "pixma", "lbp", "i-sensys")) or clean_mac.startswith(("00:1B:A9", "00:00:85", "00:1E:8F", "00:00:E2", "00:26:55", "00:80:92", "01:00:85", "18:0C:AC", "34:E6:D7", "48:D2:40")): return "canon"
        if any(k in s or k in b for k in ("hp", "hewlett", "laserjet", "officejet", "pagewide", "deskjet", "envy", "jetdirect", "smarttank")) or clean_mac.startswith(("00:1E:0B", "00:08:C7", "00:17:A4", "00:25:B3", "00:1F:29", "00:18:FE", "00:11:0A", "00:1B:78", "30:E1:71", "F4:CE:46", "18:60:24", "D4:85:64", "E4:E7:49", "A4:5D:36", "EC:9A:74")): return "hp"
        if any(k in s or k in b for k in ("brother", "mfc-", "hl-", "dcp-")) or clean_mac.startswith(("00:21:B7", "00:80:77")): return "brother"
        if any(k in s or k in b for k in ("epson", "workforce", "ecotank", "stylus")) or clean_mac.startswith(("00:00:48", "00:26:AB", "44:D2:44")): return "epson"
        if any(k in s or k in b for k in ("fiery", "konica", "minolta", "bizhub", "accurio", "wt2parser")) or clean_mac.startswith(("00:20:6B", "00:00:4E", "00:C0:EE", "00:1E:C9")): return "konica"
        return "generic"

    discovered_printers = []
    lock = threading.Lock()

    def process_single_ip(ip):
        # BƯỚC 1: KIỂM TRA PHẢN HỒI KẾT NỐI (Socket Reachability + ARP Cache)
        is_alive = False
        if ip in arp_map:
            is_alive = True
        else:
            for p_check in (9100, 80, 443, 515, 631):
                s_chk = None
                try:
                    s_chk = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    s_chk.settimeout(0.12)
                    if s_chk.connect_ex((ip, p_check)) == 0:
                        is_alive = True
                        break
                except Exception: pass
                finally:
                    if s_chk:
                        try: s_chk.close()
                        except Exception: pass

        if not is_alive:
            return

        print(f"[Bước 1 OK] IP {ip}: Phản hồi kết nối thành công (ARP/Socket).")

        # BƯỚC 2: CHECK CỔNG MÁY IN (9100 / 80)
        port_9100_open = False
        port_80_open = False

        s9100 = None
        try:
            s9100 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s9100.settimeout(0.15)
            if s9100.connect_ex((ip, 9100)) == 0:
                port_9100_open = True
        except Exception: pass
        finally:
            if s9100:
                try: s9100.close()
                except Exception: pass

        s80 = None
        try:
            s80 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s80.settimeout(0.15)
            if s80.connect_ex((ip, 80)) == 0:
                port_80_open = True
        except Exception: pass
        finally:
            if s80:
                try: s80.close()
                except Exception: pass

        if not port_9100_open and not port_80_open:
            print(f"[Bước 2 FAIL] IP {ip}: Cổng 9100 & 80 đều đóng -> Bỏ qua.")
            return

        print(f"[Bước 2 OK] IP {ip}: Cổng 9100={port_9100_open}, Cổng 80={port_80_open}.")

        # BƯỚC 3: KHỞI TẠO REQUEST ĐỌC TÊN THIẾT BỊ (LOGIC 1, 2, 3 CỦA JOB #632288 + WIM / EWS LEDM / FIERY)
        model_name = ""
        body_content = ""

        if port_80_open:
            urls_to_check = [f"http://{ip}/", f"https://{ip}/"]
            for target_url in urls_to_check:
                if model_name: break
                try:
                    ctx = ssl.create_default_context()
                    ctx.check_hostname = False
                    ctx.verify_mode = ssl.CERT_NONE
                    req = urllib.request.Request(target_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                    with urllib.request.urlopen(req, context=ctx, timeout=1.5) as r:
                        body = r.read().decode('utf-8', errors='ignore')
                        body_content += " " + body.lower()

                        tm = re.search(r'<title[^>]*>(.*?)</title>', body, re.IGNORECASE | re.DOTALL)
                        if tm:
                            raw_t = html.unescape(tm.group(1)).strip()
                            clean_t = re.sub(r'[\r\n\t]+', ' ', raw_t).strip()
                            if clean_t and clean_t.lower() not in ("index", "home", "default", "welcome", "login", "main", "topaccess", "web image monitor"):
                                model_name = clean_t

                        # Nếu là Ricoh Web Image Monitor
                        if any(k in body_content for k in ("webarch", "wimtoken", "mainframe.cgi", "toppage.cgi", "header.cgi", "web image monitor", "ricoh")):
                            for sub_p in ["web/guest/en/websys/webArch/header.cgi", "web/guest/en/websys/webArch/topPage.cgi"]:
                                if model_name and model_name.lower() not in ("web image monitor", "ricoh"): break
                                try:
                                    sub_url = f"{target_url.rstrip('/')}/{sub_p}"
                                    sub_req = urllib.request.Request(sub_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                                    with urllib.request.urlopen(sub_req, context=ctx, timeout=1.2) as sub_r:
                                        sub_body = sub_r.read().decode('utf-8', errors='ignore')
                                        body_content += " " + sub_body.lower()
                                        
                                        mh2 = re.search(r'<h2[^>]*id=["\']modelName["\'][^>]*>(.*?)</h2>', sub_body, re.IGNORECASE)
                                        if mh2:
                                            h2_val = html.unescape(mh2.group(1)).strip()
                                            if h2_val:
                                                model_name = f"RICOH {h2_val}" if not h2_val.upper().startswith("RICOH") else h2_val
                                                break

                                        mdev = re.search(r'<dt[^>]*>\s*Device\s+Name\s*</dt>\s*<dd[^>]*>\s*:\s*(.*?)</dd>', sub_body, re.IGNORECASE)
                                        if mdev:
                                            dev_val = html.unescape(mdev.group(1)).strip()
                                            if dev_val and dev_val.lower() not in ("web image monitor", "ricoh"):
                                                model_name = dev_val
                                                break
                                except Exception: pass

                        # Nếu là HP Embedded Web Server (EWS / LEDM XML / HP PageWide / HP LaserJet)
                        if any(k in body_content for k in ("hp", "hewlett", "pagewide", "laserjet", "officejet", "ews", "unified.js")):
                            m_xml_pname = re.search(r'<(?:[a-z0-9]+:)?(?:ProductName|MakeAndModel)[^>]*>(.*?)</(?:[a-z0-9]+:)?(?:ProductName|MakeAndModel)>', body, re.IGNORECASE)
                            if m_xml_pname:
                                p_val = html.unescape(m_xml_pname.group(1)).strip()
                                if p_val and p_val.lower() not in ("printer", "hp"):
                                    model_name = p_val if p_val.upper().startswith("HP") else f"HP {p_val}"

                            if not model_name or model_name.lower() in ("hp", "printer", "hp laserjet printer"):
                                for hp_xml_path in ["DevMgmt/ProductConfigDyn.xml", "devmgmt/productconfigxml.xml", "devmgmt/productstatusxml.xml", "DevMgmt/ProductStatusDyn.xml"]:
                                    if model_name and "pagewide" in model_name.lower(): break
                                    try:
                                        hp_sub_url = f"{target_url.rstrip('/')}/{hp_xml_path}"
                                        hp_req = urllib.request.Request(hp_sub_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                                        with urllib.request.urlopen(hp_req, context=ctx, timeout=1.2) as hp_r:
                                            hp_xml_body = hp_r.read().decode('utf-8', errors='ignore')
                                            body_content += " " + hp_xml_body.lower()
                                            m_hp_pname = re.search(r'<(?:[a-z0-9]+:)?(?:ProductName|MakeAndModel)[^>]*>(.*?)</(?:[a-z0-9]+:)?(?:ProductName|MakeAndModel)>', hp_xml_body, re.IGNORECASE)
                                            if m_hp_pname:
                                                hp_p_val = html.unescape(m_hp_pname.group(1)).strip()
                                                if hp_p_val:
                                                    model_name = hp_p_val if hp_p_val.upper().startswith("HP") else f"HP {hp_p_val}"
                                                    break
                                    except Exception: pass

                        # Nếu là Konica Minolta / EFI Fiery Web Connection
                        if any(k in body_content for k in ("wt2parser.cgi", "fiery", "konica", "minolta", "bizhub")):
                            for fiery_sub_p in ["wt2parser.cgi?home_en", "wt2parser.cgi"]:
                                if model_name and "fiery" in model_name.lower(): break
                                try:
                                    fiery_sub_url = f"{target_url.rstrip('/')}/{fiery_sub_p}"
                                    fiery_req = urllib.request.Request(fiery_sub_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                                    with urllib.request.urlopen(fiery_req, context=ctx, timeout=1.2) as fiery_r:
                                        fiery_body = fiery_r.read().decode('utf-8', errors='ignore')
                                        body_content += " " + fiery_body.lower()
                                        m_fiery = re.search(r'(?:konica\s+minolta\s+)?(?:bizhub\s+)?(?:press\s+|pro\s+|accuriopress\s+|accurioprint\s*)?[a-z0-9-_]+[-_]?fiery(?:\s+printer)?|(?:bizhub\s+)?(?:press\s+|pro\s+|accuriopress\s+)?[c|p][0-9]{3,4}[a-z]*', fiery_body, re.IGNORECASE)
                                        if m_fiery:
                                            model_name = m_fiery.group(0).strip()
                                            break
                                except Exception: pass

                        # Matching Regex mở rộng (Ricoh, Toshiba, Xerox, Canon, HP, Konica Minolta Fiery)
                        if not model_name or "topaccess" in model_name.lower() or "web image monitor" in model_name.lower():
                            if any(k in body_content for k in ("webarch", "ricoh", "wimtoken", "aficio", "web image monitor")):
                                m = re.search(r'(?:aficio\s+)?(?:mp|im|sp|cw|pro)\s*[a-z]?\s*[0-9]{3,4}[a-z]*', body_content, re.IGNORECASE)
                                model_name = f"RICOH {m.group(0).upper()}" if m else "RICOH MP"
                            elif any(k in body_content for k in ("topaccess", "toshiba", "e-studio", "estudio")):
                                m = re.search(r'e-studio\s*[0-9]{3,4}[a-z]*', body_content, re.IGNORECASE)
                                model_name = f"TOSHIBA {m.group(0).upper()}" if m else "TOSHIBA e-STUDIO"
                            elif any(k in body_content for k in ("xerox", "centreware", "workcentre", "versalink", "altalink", "fuji", "fujifilm", "apeos", "docucentre", "docuprint")):
                                m = re.search(r'(?:docucentre|versalink|altalink|workcentre|phaser|apeosport|apeos|docuprint)\s*[-_]?\s*[a-z0-9-]+', body_content, re.IGNORECASE)
                                model_name = f"XEROX {m.group(0).upper()}" if m else "XEROX Printer"
                            elif any(k in body_content for k in ("canon", "imagerunner", "imageclass", "pixma", "i-sensys", "ir-adv", "lbp")):
                                m = re.search(r'(?:canon\s+)?(?:imageRUNNER|imageCLASS|i-SENSYS|PIXMA|LBP|MFP|iR-ADV|iR)\s*[a-z0-9\s-]*[0-9]{3,4}[a-z]*', body_content, re.IGNORECASE)
                                model_name = f"Canon {m.group(0)}" if m else "Canon Printer"
                            elif any(k in body_content for k in ("hp", "laserjet", "officejet", "pagewide", "deskjet", "envy", "smarttank")):
                                m = re.search(r'(?:hp\s+)?(?:color\s+)?(?:pagewide|officejet|laserjet|deskjet|envy|smarttank)\s*(?:pro\s*)?[a-z0-9\s-]*[0-9]{3,4}[a-z]*(?:\s+printer)?', body_content, re.IGNORECASE)
                                model_name = f"HP {m.group(0)}" if m else "HP LaserJet Printer"
                            elif any(k in body_content for k in ("fiery", "konica", "minolta", "bizhub", "wt2parser")):
                                m = re.search(r'(?:konica\s+minolta\s+)?(?:bizhub\s+)?(?:press\s+|pro\s+|accuriopress\s+|accurioprint\s*)?[a-z0-9-_]+[-_]?fiery(?:\s+printer)?|(?:bizhub\s+)?(?:press\s+|pro\s+|accuriopress\s+)?[c|p][0-9]{3,4}[a-z]*', body_content, re.IGNORECASE)
                                model_name = m.group(0).strip() if m else "Konica Minolta / Fiery Printer"
                except Exception: pass

        # SNMP OID Probe (UDP Port 161) fallback if model_name is generic
        if not model_name or any(kw in model_name.lower() for kw in ("printer", "copier", "ricoh mp", "toshiba e-studio", "xerox", "canon")):
            try:
                pkt = b'\x30\x29\x02\x01\x00\x04\x06public\xa0\x1c\x02\x04\x12\x34\x56\x78\x02\x01\x00\x02\x01\x00\x30\x0e\x30\x0c\x06\x08\x2b\x06\x01\x02\x01\x01\x01\x00\x05\x00'
                s_snmp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s_snmp.settimeout(0.5)
                s_snmp.sendto(pkt, (ip, 161))
                data, _ = s_snmp.recvfrom(2048)
                s_snmp.close()
                raw_snmp = data.decode('latin-1', errors='ignore')
                m = re.search(r'(?:aficio\s+)?(?:mp|im|sp|cw|pro)\s*[a-z]?\s*[0-9]{3,4}[a-z]*|e-studio\s*[0-9]{3,4}[a-z]*|docucentre\s*[-_]?\s*[a-z0-9-]+|(?:imageRUNNER|iR)\s*[a-z0-9\s-]*[0-9]{3,4}[a-z]*|(?:hp\s+)?(?:pagewide|officejet|laserjet)\s*(?:pro\s*)?[a-z0-9\s-]*[0-9]{3,4}[a-z]*(?:\s+printer)?|[a-z0-9-_]+[-_]?fiery(?:\s+printer)?', raw_snmp, re.IGNORECASE)
                if m:
                    model_name = m.group(0).strip()
            except Exception: pass

        # LOGIC (2): Kiểm tra post-processing tự chèn TOSHIBA / RICOH / KONICA / HP vào đầu tên nếu chưa có
        if model_name:
            if re.search(r'e[-_]?studio', model_name, re.IGNORECASE) and not model_name.upper().startswith("TOSHIBA"):
                model_name = f"TOSHIBA {model_name}"
            elif re.search(r'\b(MP|IM|Aficio)\b', model_name) and not model_name.upper().startswith("RICOH"):
                model_name = f"RICOH {model_name}"
            elif re.search(r'\b(fiery|c1070|bizhub)\b', model_name, re.IGNORECASE) and not model_name.upper().startswith("KONICA"):
                model_name = f"Konica {model_name}"
            elif re.search(r'\b(pagewide|officejet|laserjet|deskjet|envy|smarttank)\b', model_name, re.IGNORECASE) and not model_name.upper().startswith("HP"):
                model_name = f"HP {model_name}"

        # LOGIC (3): Nhận diện thương hiệu & gán tên fallback mặc định từ Job #632288
        mac = arp_map.get(ip, "")
        brand = detect_brand(model_name, mac, body_content)

        if not model_name or model_name.lower() in ("web image monitor", "topaccess", "printer"):
            if brand == "ricoh": model_name = f"RICOH MP ({ip})"
            elif brand == "toshiba": model_name = f"TOSHIBA e-STUDIO ({ip})"
            elif brand == "xerox": model_name = f"XEROX / Fujifilm ({ip})"
            elif brand == "hp": model_name = f"HP LaserJet ({ip})"
            elif brand == "canon": model_name = f"Canon imageRUNNER ({ip})"
            elif brand == "epson": model_name = f"EPSON Printer ({ip})"
            elif brand == "brother": model_name = f"Brother Printer ({ip})"
            elif brand == "konica": model_name = f"Konica Minolta / Fiery ({ip})"
            else: model_name = f"Máy in ({ip})"

        # ĐIỀU KIỆN LỌC BỎ THIẾT BỊ KHÔNG PHẢI MÁY IN WIM / WEB UI HỢP LỆ:
        if not port_9100_open:
            if not model_name or any(kw in model_name.lower() for kw in ("máy in (", "printer (", "máy in photocopy")):
                print(f"[-] IP {ip}: Cổng 9100 đóng và không truy cập được WIM/Web UI máy in hợp lệ -> Bỏ qua.")
                return

        model_name = html.unescape(model_name).strip()

        printer_obj = {
            "name": model_name, "printer_name": model_name, "ip": ip, "mac_address": mac,
            "printer_type": brand, "is_online": True, "status": "online", "probed": True,
            "port_9100_open": port_9100_open, "port_80_open": port_80_open,
            "user": "admin", "password": "", "auth_user": "admin", "auth_password": "",
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        with lock:
            discovered_printers.append(printer_obj)
        print(f"[✓] [Bước 3 Thành Công] IP {ip} -> Tên máy in: '{model_name}' ({brand.upper()}) | MAC: {mac or 'N/A'}")

    print(f"[*] Đang quét đồng thời 254 IP ({subnet_prefix}.1 -> 254)...")
    with ThreadPoolExecutor(max_workers=30) as executor:
        executor.map(process_single_ip, target_ips)

    _DEVICE_NAME_BLACKLIST = ("file pro", "print server", "printserver", "f6600", "f66", "h3601", "h36", "router", "modem", "gateway", "zte", "mesh", "hg6", "gpon", "ont", "tenda", "tp-link", "totolink")
    printers_list = [
        p for p in discovered_printers
        if not any(kw in html.unescape(str(p.get('name') or '')).lower() for kw in _DEVICE_NAME_BLACKLIST)
    ]

    print(f"==================================================")
    print(f"[✓] HOÀN TẤT QUÉT 254 IP. TÌM THẤY {len(printers_list)} MÁY IN HỢP LỆ!")
    print(f"==================================================")

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
    print("[✓] Successfully updated UtiCommand force_subnet_scan with Konica prepending logic!")
else:
    print("[-] Command force_subnet_scan not found in UtiCommand table!")
