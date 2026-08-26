import requests
import json
import time

AGENT_UID = "desktop-2i313fv"
BASE_URL = "http://157.66.80.125"

script_content = r'''import socket
import threading
import subprocess
import re
import sys
import json
import os
import tempfile
from datetime import datetime

def force_scan():
    print("==================================================")
    print("  [CLEAN FRESH SCAN] DÒ QUÉT TẠO MỚI PRINTERS.JSON")
    print("==================================================")
    print("[1/5] Dò tìm IP Local & Bảng ARP Neighbor...")
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        subnet_prefix = '.'.join(local_ip.split('.')[:3])
        print(f"  -> Hostname : {hostname}")
        print(f"  -> Local IP : {local_ip} (Subnet: {subnet_prefix}.0/24)")
    except Exception as e:
        subnet_prefix = "192.168.1"
        print(f"  -> Subnet   : {subnet_prefix}.0/24 ({e})")

    print("  -> Fast Ping Sweep to populate ARP cache...")
    def _fast_ping(ip_addr):
        try: subprocess.run(["ping", "-n", "1", "-w", "500", ip_addr], capture_output=True, creationflags=0x08000000)
        except: pass
    try:
        pt_threads = []
        for i in range(1, 255):
            t = threading.Thread(target=_fast_ping, args=(f"{subnet_prefix}.{i}",))
            pt_threads.append(t)
            t.start()
            if len(pt_threads) >= 40:
                for t in pt_threads: t.join()
                pt_threads = []
        for t in pt_threads: t.join()
    except Exception: pass

    arp_map = {}
    try:
        ps_cmd = 'Get-NetNeighbor -AddressFamily IPv4 -ErrorAction SilentlyContinue | Select-Object IPAddress,LinkLayerAddress | ConvertTo-Json -Compress'
        ps_res = subprocess.run(['powershell', '-NoProfile', '-Command', ps_cmd], capture_output=True, text=True, errors='ignore')
        if ps_res.stdout.strip():
            items = json.loads(ps_res.stdout.strip())
            if isinstance(items, dict): items = [items]
            for it in items:
                ip_val = str(it.get('IPAddress') or '').strip()
                mac_val = str(it.get('LinkLayerAddress') or '').strip().replace('-', ':').upper()
                if ip_val and mac_val and mac_val != '00:00:00:00:00:00': arp_map[ip_val] = mac_val
    except Exception: pass

    try:
        arp_out = subprocess.run(['arp', '-a'], capture_output=True, text=True, errors='ignore').stdout
        for line in arp_out.splitlines():
            m = re.search(r'([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\s+([0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2})', line)
            if m:
                ip_k = m.group(1); mac_v = m.group(2).replace('-', ':').upper()
                if ip_k not in arp_map and mac_v != '00:00:00:00:00:00': arp_map[ip_k] = mac_v
    except Exception: pass

    vps_auth_map = {}
    
    discovered_printers = []
    lock = threading.Lock()
    PORTS_TO_CHECK = [80, 443, 9100, 515, 631, 161]

    def detect_brand(name_str, mac_str):
        s = name_str.lower(); clean_mac = mac_str.replace('-', ':').upper()
        if "toshiba" in s or "e-studio" in s or clean_mac.startswith("00:80:91"): return "toshiba"
        if any(k in s for k in ("ricoh", "aficio", "mp ", "sp ", "pro ")) or clean_mac.startswith(("00:26:73", "58:38:79", "00:00:74")): return "ricoh"
        if any(k in s for k in ("hp", "laserjet", "officejet", "pagewide", "deskjet", "envy")) or clean_mac.startswith(("00:1E:0B", "00:08:C7")): return "hp"
        if any(k in s for k in ("canon", "imagerunner", "ir-adv", "ir ", "imageclass", "pixma")) or clean_mac.startswith(("00:1B:A9", "00:00:85")): return "canon"
        if any(k in s for k in ("xerox", "versalink", "altalink", "workcentre", "fuji", "apeos")) or clean_mac.startswith(("00:10:A4", "00:00:AA", "9C:93:4E", "E8:4D:EC", "C0:FB:F9", "1C:7D:22", "00:00:01", "00:00:02", "00:00:03", "00:00:04", "00:00:05", "00:00:06", "00:00:07", "00:00:08", "00:00:09", "08:00:37", "00:00:87")): return "xerox"
        if any(k in s for k in ("brother", "mfc-", "hl-", "dcp-")) or clean_mac.startswith("00:21:B7"): return "brother"
        if any(k in s for k in ("epson", "workforce", "ecotank")) or clean_mac.startswith("00:00:48"): return "epson"
        return "unknown"

    def probe_host(ip):
        has_open = False
        for port in PORTS_TO_CHECK:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.settimeout(0.5)
                    if s.connect_ex((ip, port)) == 0: has_open = True; break
            except Exception: pass
        
        mac = arp_map.get(ip, "")
        if not has_open:
            if not mac: return
            if detect_brand("", mac) == "unknown": return

        model_name = ""
        if has_open:
            try:
                import urllib.request, ssl
                ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
                req = urllib.request.Request(f"http://{ip}/", headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, context=ctx, timeout=1.5) as r:
                    body = r.read().decode('utf-8', errors='ignore'); body_low = body.lower()
                    if "topaccess" in body_low or "toshiba" in body_low:
                        m = re.search(r'e-studio[a-z0-9]+', body, re.IGNORECASE)
                        model_name = f"TOSHIBA {m.group(0)}" if m else "TOSHIBA e-STUDIO"
                    elif "webarch" in body_low or "ricoh" in body_low or "wimtoken" in body_low:
                        m = re.search(r'(?:aficio\s+)?mp\s+[0-9a-z]+', body, re.IGNORECASE)
                        model_name = f"RICOH {m.group(0).upper()}" if m else "RICOH MP"
                    elif "epson" in body_low: model_name = "EPSON Printer"
                    elif "canon" in body_low: model_name = "Canon Printer"
                    elif "hp " in body_low or "laserjet" in body_low: model_name = "HP LaserJet Printer"
            except Exception: pass

        if not mac: return
        if not model_name: model_name = f"Printer ({ip})"
        brand = detect_brand(model_name, mac)
        if brand == "unknown" and (model_name.startswith("Copier (") or "printer" not in model_name.lower()): return

        printer_obj = {
            "name": model_name, "printer_name": model_name, "ip": ip, "mac_address": mac,
            "printer_type": brand, "is_online": True, "status": "online", "probed": True,
        }

        with lock:
            discovered_printers.append(printer_obj)
            print(f"  [✓] ONLINE  | IP: {ip:<15} | MAC: {mac:<17} | Loại: {brand:<8} | Tên: {model_name}")

    threads = []
    for i in range(1, 255):
        t = threading.Thread(target=probe_host, args=(f"{subnet_prefix}.{i}",))
        threads.append(t); t.start()
        if len(threads) >= 40:
            for t in threads: t.join()
            threads = []
    for t in threads: t.join()

    print("")
    print(f"[3/5] Dò tìm thấy {len(discovered_printers)} máy in đang ONLINE.")

    _DEVICE_NAME_BLACKLIST = ("file pro", "print server", "printserver", "f6600", "f66", "h3601", "h36", "router", "modem")
    valid_final_printers = [
        p for p in discovered_printers
        if p.get('mac_address') and not any(kw in str(p.get('name') or '').lower() for kw in _DEVICE_NAME_BLACKLIST)
    ]

    res_str = json.dumps(valid_final_printers, ensure_ascii=False, indent=2)
    if globals().get('context'): globals()['context']['result_payload'] = res_str
    else: print(res_str)

try:
    force_scan()
except Exception as err:
    if globals().get('context'): globals()['context']['result_payload'] = f"Lỗi: {err}"
    else: print(err)
'''

payload = {
    "command": "test_scan",
    "command_content": script_content
}

resp = requests.post(f"{BASE_URL}/ui/agents/{AGENT_UID}/utility/exec", json=payload)
if not resp.ok:
    print("Failed to trigger test scan:", resp.text)
    exit(1)

cmd_id = resp.json().get("command_id")
print("Triggered command:", cmd_id)

for i in range(30):
    time.sleep(2)
    status_resp = requests.get(f"{BASE_URL}/api/utility-commands/{cmd_id}/status")
    data = status_resp.json()
    if data.get("status") in ("success", "failed"):
        print("Status:", data.get("status"))
        print("Result:", data.get("result_payload"))
        break
    else:
        print("Waiting...")
