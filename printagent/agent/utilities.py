import os
import subprocess
import urllib.request
import sys

def open_devices_and_printers():
    """
    Mở Printers & Scanners dùng explorer shell:PrintersFolder.
    Hoạt động đúng trên mọi phiên bản Windows (Win 10, Win 11, ...).
    """
    subprocess.Popen(["explorer.exe", "shell:PrintersFolder"])


def open_scan_folder():
    """
    2. Mở thư mục scan gốc (mặc định Windows Fax and Scan)
    """
    scan_dir = os.path.join(os.path.expanduser('~'), 'Documents', 'Scanned Documents')
    
    if not os.path.exists(scan_dir):
        os.makedirs(scan_dir, exist_ok=True)
        
    try:
        os.startfile(scan_dir)
    except Exception:
        subprocess.Popen(f'explorer "{scan_dir}"', shell=True)

def open_dxdiag():
    """
    5. Mở "dxdiag" để xem nhanh thông số máy
    """
    try:
        subprocess.Popen('dxdiag.exe', shell=True)
    except Exception:
        subprocess.Popen('dxdiag', shell=True)

def get_public_ip():
    """
    Lấy địa chỉ Public IP hiện tại của mạng (có cơ chế dự phòng)
    """
    urls = [
        "https://api.ipify.org",
        "https://icanhazip.com",
        "https://ident.me",
        "https://v4.ident.me"
    ]
    
    for url in urls:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                ip = response.read().decode('utf-8').strip()
                if ip:
                    return ip
        except Exception:
            continue
            
    return None

if __name__ == '__main__':
    if len(sys.argv) > 1:
        action = sys.argv[1]
        if action == "printers":
            open_devices_and_printers()
        elif action == "scan":
            open_scan_folder()
        elif action == "dxdiag":
            open_dxdiag()
        elif action == "ip":
            ip = get_public_ip()
            if ip:
                print(f"Public IP: {ip}")
            else:
                print("Error: Could not retrieve public IP.")
        else:
            print("Unknown action. Use: printers, scan, dxdiag, ip")
    else:
        print("Usage: python utilities.py [printers|scan|dxdiag|ip]")
