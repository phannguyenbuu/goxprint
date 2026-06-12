import os
import subprocess
import urllib.request
import sys

def open_devices_and_printers():
    """
    Mở trang quản lý máy in:
    - Win 11 (build >= 22000): Settings > Printers & scanners (ms-settings:printers)
    - Win 10 trở xuống: Control Panel > Devices and Printers (Classic UI)
    """
    import platform

    build = 0
    try:
        if platform.system() == 'Windows':
            parts = platform.version().split('.')
            build = int(parts[2]) if len(parts) >= 3 else 0
    except Exception:
        build = 0

    IS_WIN11 = build >= 22000

    if IS_WIN11:
        # Win 11: Classic Devices and Printers bị xóa → mở Settings > Printers & scanners
        subprocess.Popen(['explorer.exe', 'ms-settings:printers'], shell=False)
    else:
        # Win 10 trở xuống: Classic Control Panel
        GUID = "{A8A91A10-75D1-4155-929E-88F47E7D1df3}"
        try:
            subprocess.Popen('control.exe /name Microsoft.DevicesAndPrinters', shell=True)
        except Exception:
            subprocess.Popen(['explorer.exe', f'shell:::{GUID}'], shell=False)


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
