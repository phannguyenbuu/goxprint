#!/usr/bin/env python3
"""
Standalone script: Cài đặt driver + tạo máy in Ricoh MP 7503 SP
Chạy (cần Admin): python install_mp7503_driver.py

Flow:
  1. Download driver EXE từ Ricoh
  2. Giải nén SFX → chạy RV_SETUP.exe (user click wizard)
  3. Quét LAN tìm máy in Ricoh MP 7503
  4. Tạo Port + Printer Queue cho mỗi máy tìm thấy
"""

import os
import sys
import socket
import tempfile
import zipfile
import subprocess
import urllib.request
import shutil
import concurrent.futures
import re
from pathlib import Path

DRIVER_URL = "https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343268/V3200/z05906L16.exe"
DRIVER_NAME = "RICOH MP 7503 PCL 6"
PRINTER_MODEL = "MP 7503"
SCAN_TIMEOUT = 2  # seconds per host


def get_local_subnet():
    """Detect local IP and return subnet as x.x.x"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        parts = local_ip.split(".")
        subnet = ".".join(parts[:3])
        print(f"   Mạng LAN: {subnet}.0/24 (IP máy này: {local_ip})")
        return subnet
    except Exception as e:
        print(f"   ❌ Không xác định được mạng LAN: {e}")
        return None


def check_ricoh_printer(ip, model_keyword):
    """Check if IP is a Ricoh printer matching model_keyword"""
    try:
        url = f"http://{ip}/web/guest/en/websys/status/getUnificationCounter.cgi"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=SCAN_TIMEOUT) as resp:
            html = resp.read().decode("utf-8", errors="ignore").lower()
            if "ricoh" in html or "counter" in html:
                # Try to get printer name
                name = extract_printer_name(ip)
                return ip, name
    except Exception:
        pass
    return None, None


def extract_printer_name(ip):
    """Try to get printer model name from Ricoh web interface"""
    try:
        url = f"http://{ip}/web/guest/en/websys/webArch/getStatus.cgi"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=SCAN_TIMEOUT) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            # Look for model name in title or body
            match = re.search(r'<title[^>]*>([^<]*)</title>', html, re.IGNORECASE)
            if match:
                return match.group(1).strip()
            # Look for common Ricoh patterns
            match = re.search(r'((?:MP|IM|SP)\s*\w+\s*\w*)', html)
            if match:
                return match.group(1).strip()
    except Exception:
        pass
    return "Ricoh Printer"


def scan_subnet_for_printers(subnet, model_keyword):
    """Scan subnet for Ricoh printers matching model"""
    print(f"   Đang quét {subnet}.1 - {subnet}.254 ...")
    found = []

    ips = [f"{subnet}.{i}" for i in range(1, 255)]

    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        futures = {executor.submit(check_ricoh_printer, ip, model_keyword): ip for ip in ips}
        for future in concurrent.futures.as_completed(futures):
            ip, name = future.result()
            if ip:
                found.append((ip, name or "Ricoh"))

    found.sort(key=lambda x: [int(p) for p in x[0].split(".")])
    return found


def create_printer(ip, driver_name, printer_name=None):
    """Create TCP/IP port and add printer using PowerShell"""
    port_name = f"IP_{ip}"
    if not printer_name:
        printer_name = f"RICOH {PRINTER_MODEL} ({ip})"

    # Check if port already exists
    check_port = subprocess.run(
        ["powershell", "-Command", f"Get-PrinterPort -Name '{port_name}' -ErrorAction SilentlyContinue"],
        capture_output=True, text=True
    )

    if port_name not in check_port.stdout:
        print(f"   📌 Tạo port: {port_name} → {ip}")
        result = subprocess.run(
            ["powershell", "-Command",
             f"Add-PrinterPort -Name '{port_name}' -PrinterHostAddress '{ip}'"],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            print(f"   ❌ Lỗi tạo port: {result.stderr.strip()}")
            return False
    else:
        print(f"   ✅ Port {port_name} đã tồn tại")

    # Check if printer already exists
    check_printer = subprocess.run(
        ["powershell", "-Command", f"Get-Printer -Name '{printer_name}' -ErrorAction SilentlyContinue"],
        capture_output=True, text=True
    )

    if printer_name not in check_printer.stdout:
        print(f"   🖨️  Tạo máy in: {printer_name}")
        result = subprocess.run(
            ["powershell", "-Command",
             f"Add-Printer -Name '{printer_name}' -DriverName '{driver_name}' -PortName '{port_name}'"],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            stderr = result.stderr.strip()
            if "already exists" in stderr.lower():
                print(f"   ✅ Máy in đã tồn tại")
            else:
                print(f"   ❌ Lỗi tạo máy in: {stderr}")
                return False
        else:
            print(f"   ✅ Đã thêm máy in thành công!")
    else:
        print(f"   ✅ Máy in {printer_name} đã tồn tại")

    return True


def main():
    print(f"{'='*60}")
    print(f"  Cài đặt driver + tạo máy in: RICOH {PRINTER_MODEL}")
    print(f"{'='*60}")
    print()

    temp_dir = Path(tempfile.mkdtemp(prefix="ricoh_driver_"))
    filename = DRIVER_URL.split("/")[-1].split("?")[0]
    download_path = temp_dir / filename

    try:
        # ── Step 1: Download ──
        print("📥 BƯỚC 1: Tải driver")
        print(f"   URL: {DRIVER_URL}")
        urllib.request.urlretrieve(DRIVER_URL, str(download_path))
        size_mb = download_path.stat().st_size / (1024 * 1024)
        print(f"   ✅ Tải xong: {filename} ({size_mb:.1f} MB)")
        print()

        # ── Step 2: Extract & Install ──
        print("📦 BƯỚC 2: Giải nén & cài đặt driver")
        extract_dir = temp_dir / "extracted"
        extract_dir.mkdir(exist_ok=True)

        try:
            with zipfile.ZipFile(download_path, "r") as zf:
                zf.extractall(extract_dir)
            exe_files = list(extract_dir.glob("**/*.exe"))
            for f in exe_files:
                print(f"   • {f.name} ({f.stat().st_size / (1024*1024):.1f} MB)")
        except zipfile.BadZipFile:
            exe_files = [download_path]

        if not exe_files:
            print("   ❌ Không tìm thấy file EXE!")
            return 1

        # Pick best installer
        target_exe = exe_files[0]
        for exe in exe_files:
            if exe.name.lower() in ("setup.exe", "install.exe", "rv_setup.exe", "setup64.exe"):
                target_exe = exe
                break
        else:
            target_exe = max(exe_files, key=lambda f: f.stat().st_size)

        print(f"   🚀 Mở installer: {target_exe.name}")
        print(f"   ⏳ Vui lòng hoàn tất cài đặt trên cửa sổ wizard...")
        print()

        proc = subprocess.Popen([str(target_exe)], cwd=str(target_exe.parent))
        proc.wait()
        print(f"   ✅ Installer đã đóng (exit code: {proc.returncode})")
        print()

        # ── Step 3: Scan LAN ──
        print("🔍 BƯỚC 3: Quét mạng LAN tìm máy in Ricoh")
        subnet = get_local_subnet()
        if not subnet:
            ip = input("   Nhập IP máy in thủ công (VD: 192.168.1.226): ").strip()
            if ip:
                printers = [(ip, f"RICOH {PRINTER_MODEL}")]
            else:
                print("   ❌ Không có IP, bỏ qua tạo máy in.")
                return 0
        else:
            printers = scan_subnet_for_printers(subnet, PRINTER_MODEL.lower())

        if not printers:
            print("   ⚠️  Không tìm thấy máy in Ricoh nào trên mạng.")
            ip = input("   Nhập IP thủ công (hoặc Enter để bỏ qua): ").strip()
            if ip:
                printers = [(ip, f"RICOH {PRINTER_MODEL}")]
            else:
                return 0

        print(f"   ✅ Tìm thấy {len(printers)} máy in Ricoh:")
        for ip, name in printers:
            print(f"      • {ip} — {name}")
        print()

        # ── Step 4: Create Printer Queue ──
        print("🖨️  BƯỚC 4: Tạo máy in trong Windows")

        # List available driver names matching our model
        print(f"   Tìm driver '{DRIVER_NAME}' trong Driver Store...")
        check_driver = subprocess.run(
            ["powershell", "-Command",
             f"Get-PrinterDriver | Where-Object {{ $_.Name -like '*7503*' }} | Select-Object -ExpandProperty Name"],
            capture_output=True, text=True
        )
        available_drivers = [d.strip() for d in check_driver.stdout.strip().splitlines() if d.strip()]

        if available_drivers:
            driver_to_use = available_drivers[0]
            print(f"   ✅ Driver tìm thấy: {driver_to_use}")
        else:
            driver_to_use = DRIVER_NAME
            print(f"   ⚠️  Không tìm thấy driver chính xác, thử dùng: {driver_to_use}")

        print()
        success_count = 0
        for ip, name in printers:
            printer_name = f"RICOH {PRINTER_MODEL} ({ip})"
            print(f"   ── {printer_name} ──")
            if create_printer(ip, driver_to_use, printer_name):
                success_count += 1
            print()

        print(f"{'='*60}")
        print(f"  ✅ Hoàn tất! Đã tạo {success_count}/{len(printers)} máy in.")
        print(f"  Mở Settings → Printers & Scanners để kiểm tra.")
        print(f"{'='*60}")

    except KeyboardInterrupt:
        print("\n⚠️  Đã hủy.")
        return 1
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")
        import traceback
        traceback.print_exc()
        return 1
    finally:
        try:
            shutil.rmtree(temp_dir)
        except Exception:
            pass

    return 0


if __name__ == "__main__":
    sys.exit(main())
