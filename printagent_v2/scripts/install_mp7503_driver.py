#!/usr/bin/env python3
"""
Standalone script: Cài đặt driver + tạo máy in Ricoh MP 7503 SP
Chạy (cần Admin): python install_mp7503_driver.py

Flow (KHÔNG wizard):
  1. Download driver EXE từ Ricoh
  2. Giải nén SFX → tìm file .inf → pnputil cài vào Driver Store
  3. Quét tất cả LAN tìm máy in Ricoh
  4. Add-PrinterPort + Add-Printer cho mỗi máy tìm thấy
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
PRINTER_MODEL = "MP 7503"
SCAN_TIMEOUT = 2  # seconds per host


def get_all_subnets():
    """Detect ALL local subnets from all network interfaces"""
    subnets = set()
    try:
        result = subprocess.run(
            ["ipconfig"], capture_output=True, text=True, encoding="cp437", errors="ignore"
        )
        for line in result.stdout.splitlines():
            match = re.search(r'IPv4.*?:\s*(\d+\.\d+\.\d+\.\d+)', line)
            if match:
                ip = match.group(1)
                if ip.startswith("127."):
                    continue
                subnets.add(".".join(ip.split(".")[:3]))
    except Exception:
        pass

    if not subnets:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            subnets.add(".".join(local_ip.split(".")[:3]))
        except Exception:
            pass

    return sorted(subnets)


def check_ricoh_printer(ip):
    """Check if IP is a Ricoh printer, return (ip, name) or (None, None)"""
    try:
        url = f"http://{ip}/web/guest/en/websys/status/getUnificationCounter.cgi"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=SCAN_TIMEOUT) as resp:
            html = resp.read().decode("utf-8", errors="ignore").lower()
            if "ricoh" in html or "counter" in html:
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
            match = re.search(r'<title[^>]*>([^<]*)</title>', html, re.IGNORECASE)
            if match:
                return match.group(1).strip()
            match = re.search(r'((?:MP|IM|SP)\s*\w+\s*\w*)', html)
            if match:
                return match.group(1).strip()
    except Exception:
        pass
    return "Ricoh Printer"


def scan_subnet_for_printers(subnet):
    """Scan entire subnet for Ricoh printers"""
    print(f"   Đang quét {subnet}.1 → {subnet}.254 ...")
    found = []
    ips = [f"{subnet}.{i}" for i in range(1, 255)]

    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        futures = {executor.submit(check_ricoh_printer, ip): ip for ip in ips}
        for future in concurrent.futures.as_completed(futures):
            ip, name = future.result()
            if ip:
                found.append((ip, name or "Ricoh"))
                print(f"      ✓ {ip} — {name}")

    found.sort(key=lambda x: [int(p) for p in x[0].split(".")])
    return found


def install_inf_driver(extract_dir):
    """Find .inf files and install via pnputil. Return driver name."""
    inf_files = list(extract_dir.glob("**/*.inf"))
    if not inf_files:
        print("   ❌ Không tìm thấy file .inf trong package!")
        return None

    print(f"   Tìm thấy {len(inf_files)} file .inf:")
    for inf in inf_files:
        print(f"      • {inf.relative_to(extract_dir)}")

    # Install all inf files via pnputil
    installed_driver = None
    for inf in inf_files:
        print(f"   📌 pnputil /add-driver \"{inf.name}\" /install ...")
        result = subprocess.run(
            ["pnputil", "/add-driver", str(inf), "/install"],
            capture_output=True, text=True
        )
        output = result.stdout + result.stderr
        print(f"      Exit code: {result.returncode}")
        if result.stdout.strip():
            for line in result.stdout.strip().splitlines():
                print(f"      {line}")

    # Now find the installed driver name via PowerShell
    print()
    print("   🔍 Tìm driver vừa cài trong Driver Store...")
    check = subprocess.run(
        ["powershell", "-Command",
         "Get-PrinterDriver | Select-Object -ExpandProperty Name"],
        capture_output=True, text=True
    )
    all_drivers = [d.strip() for d in check.stdout.strip().splitlines() if d.strip()]

    # Find drivers matching our model
    matching = [d for d in all_drivers if "7503" in d]
    if matching:
        installed_driver = matching[0]
        print(f"   ✅ Driver: {installed_driver}")
    else:
        # Try broader match
        matching = [d for d in all_drivers if "ricoh" in d.lower() and "pcl" in d.lower()]
        if matching:
            installed_driver = matching[-1]  # newest
            print(f"   ✅ Driver (broad match): {installed_driver}")
        else:
            print(f"   ⚠️  Tất cả driver có sẵn:")
            for d in all_drivers:
                if "ricoh" in d.lower():
                    print(f"      • {d}")

    return installed_driver


def create_printer(ip, driver_name, printer_name):
    """Create TCP/IP port and add printer"""
    port_name = f"IP_{ip}"

    # Create port
    check_port = subprocess.run(
        ["powershell", "-Command",
         f"Get-PrinterPort -Name '{port_name}' -ErrorAction SilentlyContinue"],
        capture_output=True, text=True
    )
    if port_name not in check_port.stdout:
        print(f"      📌 Tạo port: {port_name}")
        result = subprocess.run(
            ["powershell", "-Command",
             f"Add-PrinterPort -Name '{port_name}' -PrinterHostAddress '{ip}'"],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            print(f"      ❌ Lỗi tạo port: {result.stderr.strip()}")
            return False
    else:
        print(f"      ✅ Port đã tồn tại")

    # Create printer
    check_printer = subprocess.run(
        ["powershell", "-Command",
         f"Get-Printer -Name '{printer_name}' -ErrorAction SilentlyContinue"],
        capture_output=True, text=True
    )
    if printer_name not in check_printer.stdout:
        print(f"      🖨️  Tạo máy in: {printer_name}")
        result = subprocess.run(
            ["powershell", "-Command",
             f"Add-Printer -Name '{printer_name}' -DriverName '{driver_name}' -PortName '{port_name}'"],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            stderr = result.stderr.strip()
            if "already exists" in stderr.lower():
                print(f"      ✅ Máy in đã tồn tại")
            else:
                print(f"      ❌ Lỗi: {stderr}")
                return False
        else:
            print(f"      ✅ OK!")
    else:
        print(f"      ✅ Máy in đã tồn tại")

    return True


def main():
    print(f"{'='*60}")
    print(f"  Cài driver + tạo máy in RICOH {PRINTER_MODEL} (no wizard)")
    print(f"{'='*60}")
    print()

    temp_dir = Path(tempfile.mkdtemp(prefix="ricoh_driver_"))
    filename = DRIVER_URL.split("/")[-1].split("?")[0]
    download_path = temp_dir / filename

    try:
        # ── Step 1: Download ──
        print("📥 BƯỚC 1: Tải driver package")
        print(f"   URL: {DRIVER_URL}")
        urllib.request.urlretrieve(DRIVER_URL, str(download_path))
        size_mb = download_path.stat().st_size / (1024 * 1024)
        print(f"   ✅ Tải xong: {filename} ({size_mb:.1f} MB)")
        print()

        # ── Step 2: Extract + pnputil ──
        print("📦 BƯỚC 2: Giải nén + cài driver vào Driver Store")
        extract_dir = temp_dir / "extracted"
        extract_dir.mkdir(exist_ok=True)

        try:
            with zipfile.ZipFile(download_path, "r") as zf:
                zf.extractall(extract_dir)
            print(f"   ✅ Giải nén SFX xong")
        except zipfile.BadZipFile:
            # Not a ZIP — extract via 7z or just use as-is
            print(f"   📄 Không phải ZIP, thử chạy SFX extract...")
            subprocess.run(
                [str(download_path), "/extract", f"/dir={extract_dir}"],
                capture_output=True, timeout=60
            )

        driver_name = install_inf_driver(extract_dir)
        if not driver_name:
            print("   ❌ Không cài được driver. Dừng lại.")
            return 1
        print()

        # ── Step 3: Scan ALL LANs ──
        print("🔍 BƯỚC 3: Quét tất cả mạng LAN tìm máy in Ricoh")
        subnets = get_all_subnets()
        printers = []

        if not subnets:
            print("   ⚠️  Không xác định được mạng LAN.")
            ip = input("   Nhập IP thủ công (VD: 192.168.1.226): ").strip()
            if ip:
                printers = [(ip, f"RICOH {PRINTER_MODEL}")]
            else:
                return 0
        else:
            print(f"   Mạng: {', '.join(s + '.0/24' for s in subnets)}")
            print()
            for subnet in subnets:
                found = scan_subnet_for_printers(subnet)
                printers.extend(found)

        if not printers:
            print()
            print("   ⚠️  Không tìm thấy máy in Ricoh nào.")
            ip = input("   Nhập IP thủ công (Enter = bỏ qua): ").strip()
            if ip:
                printers = [(ip, f"RICOH {PRINTER_MODEL}")]
            else:
                return 0

        print()
        print(f"   ✅ Tổng cộng {len(printers)} máy in Ricoh")
        print()

        # ── Step 4: Create Printer Queue ──
        print(f"🖨️  BƯỚC 4: Tạo máy in (driver: {driver_name})")
        print()

        success_count = 0
        for ip, name in printers:
            printer_name = f"{name} ({ip})" if name != "Ricoh Printer" else f"RICOH {PRINTER_MODEL} ({ip})"
            print(f"   ── {printer_name} ──")
            if create_printer(ip, driver_name, printer_name):
                success_count += 1
            print()

        print(f"{'='*60}")
        print(f"  ✅ Hoàn tất! {success_count}/{len(printers)} máy in đã tạo.")
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
