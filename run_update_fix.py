import paramiko

VPS_PYTHON_SCRIPT = r"""
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import UtiCommand

engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
Session = sessionmaker(bind=engine)
session = Session()

cmd = session.query(UtiCommand).filter_by(command='force_subnet_scan').first()
if cmd:
    cmd.command_content = r'''import socket
import threading
import subprocess
import re
import sys
import urllib.request
import urllib.error
import ssl

def ping_sweep():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
    except Exception:
        local_ip = "192.168.1.100"
    finally:
        s.close()
    
    prefix = ".".join(local_ip.split(".")[:3])
    
    active_ips = []
    lock = threading.Lock()
    
    def check_ip(ip):
        CREATE_NO_WINDOW = 0x08000000
        res = subprocess.run(["ping", "-n", "1", "-w", "500", ip], capture_output=True, text=True, creationflags=CREATE_NO_WINDOW)
        if "TTL=" in res.stdout:
            with lock:
                active_ips.append(ip)
    
    threads = []
    for i in range(1, 255):
        ip = f"{prefix}.{i}"
        t = threading.Thread(target=check_ip, args=(ip,))
        threads.append(t)
        t.start()
        if len(threads) >= 40:
            for t in threads: t.join()
            threads = []
    for t in threads: t.join()
    
    arp_map = {}
    arp_out = subprocess.run(['arp', '-a'], capture_output=True, text=True, errors='ignore').stdout
    for line in arp_out.splitlines():
        m = re.search(r'([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\s+([0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2})', line)
        if m:
            arp_map[m.group(1)] = m.group(2).replace('-', ':').upper()
            
    active_ips.sort(key=lambda x: int(x.split(".")[3]))
    
    device_titles = {}
    title_lock = threading.Lock()
    
    def check_web(ip):
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        title = ""
        for proto in ["http", "https"]:
            try:
                req = urllib.request.Request(f"{proto}://{ip}/", headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=1.5, context=ctx) as response:
                    html = response.read().decode('utf-8', errors='ignore')
                    m = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
                    if m:
                        title = m.group(1).strip()
                        title = re.sub(r'\s+', ' ', title)
                        break
            except Exception:
                pass
        with title_lock:
            device_titles[ip] = title
            
    title_threads = []
    for ip in active_ips:
        t = threading.Thread(target=check_web, args=(ip,))
        title_threads.append(t)
        t.start()
        
    for t in title_threads:
        t.join()
    
    output = [f"Tìm thấy {len(active_ips)} thiết bị đang phản hồi Ping trong mạng {prefix}.0/24:"]
    output.append("-" * 90)
    output.append(f"{'IP ADDRESS':<15} | {'MAC ADDRESS':<17} | {'DEVICE WEB TITLE / INFO':<40}")
    output.append("-" * 90)
    for ip in active_ips:
        mac = arp_map.get(ip, "Unknown")
        title = device_titles.get(ip, "")
        if not title:
            title = "N/A"
        
        if len(title) > 38:
            title = title[:35] + "..."
            
        output.append(f"{ip:<15} | {mac:<17} | {title:<40}")
        
    final_text = "\n".join(output)
    if globals().get('context'):
        globals()['context']['result_payload'] = final_text
    else:
        print(final_text)

try:
    ping_sweep()
except Exception as e:
    if globals().get('context'): globals()['context']['result_payload'] = f"Lỗi: {e}"
    else: print(e)'''
    session.commit()
    print("Fixed syntax error in command_content")
else:
    print("Command not found!")
"""

with open('backend/update_cmd_fix.py', 'w', encoding='utf-8') as f:
    f.write(VPS_PYTHON_SCRIPT)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('157.66.80.125', username='root', password='@baoLong0511')
sftp = ssh.open_sftp()
sftp.put('backend/update_cmd_fix.py', '/opt/printagent/update_cmd_fix.py')
sftp.close()

_, out, err = ssh.exec_command('/opt/printagent/venv/bin/python3 /opt/printagent/update_cmd_fix.py')
print(out.read().decode('utf-8'))
print(err.read().decode('utf-8'))
ssh.close()
