import json
import os
import re
import socket
import subprocess
import sys
import time

try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

print("=" * 64)
print("🖨️  LỆNH IN TRANG IN THỬ TRỰC TIẾP TỪ AGENT (PRINT TEST PAGE)")
print("=" * 64)

timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
hostname = socket.gethostname()
print(f"⏱️  Thời gian     : {timestamp}")
print(f"💻 Agent Hostname: {hostname}")

# 1. Tìm IP Local của Agent
agent_ip = "127.0.0.1"
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    agent_ip = s.getsockname()[0]
    s.close()
except Exception:
    pass
print(f"🌐 Agent Local IP: {agent_ip}")

# 2. Nhận diện tham số mục tiêu (nếu có truyền từ server/UI)
target_ip = ""
raw_target_ip = "__TARGET_IP__".strip()
if raw_target_ip and raw_target_ip != "__TARGET_IP__":
    target_ip = raw_target_ip

target_printer_req = ""
if "context" in globals() and isinstance(globals()["context"], dict):
    ctx = globals()["context"]
    if not target_ip:
        target_ip = str(ctx.get("printer_ip") or ctx.get("target_ip") or ctx.get("ip") or "").strip()
    target_printer_req = str(ctx.get("printer_name") or ctx.get("printer") or "").strip()

if target_ip:
    print(f"🎯 Mục tiêu IP chỉ định     : {target_ip}")
if target_printer_req:
    print(f"🎯 Mục tiêu Máy in chỉ định : {target_printer_req}")
if not target_ip and not target_printer_req:
    print("🎯 Chế độ                   : Tự động chọn máy in mặc định / phù hợp nhất")

_NO_WIN = 0x08000000 if sys.platform == 'win32' else 0

if sys.platform != 'win32':
    print("\n⚠️ Hệ điều hành hiện tại không phải là Windows (Linux/Unix).")
    try:
        proc = subprocess.run(["lpstat", "-p", "-d"], capture_output=True, text=True, timeout=10)
        print("Danh sách máy in CUPS:")
        print(proc.stdout or proc.stderr or "Không tìm thấy máy in CUPS.")
    except Exception as e:
        print(f"Lỗi kiểm tra máy in CUPS: {e}")
    print("\n" + "=" * 64)
    print("🏁 HOÀN TẤT KIỂM TRA")
    print("=" * 64)
    sys.exit(0)

print("\n🔍 Đang truy vấn danh sách máy in trên Windows...")

# 3. Lấy danh sách máy in trên Windows bằng PowerShell
ps_get_printers = """
$ErrorActionPreference = 'SilentlyContinue'
$printers = Get-CimInstance Win32_Printer | Select-Object Name, PortName, DriverName, Default, PrinterStatus, WorkOffline
if (-not $printers) {
    $printers = Get-WmiObject Win32_Printer | Select-Object Name, PortName, DriverName, Default, PrinterStatus, WorkOffline
}
if ($printers) {
    $printers | ConvertTo-Json -Depth 2
} else {
    Write-Output "[]"
}
"""

try:
    proc_list = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_get_printers],
        capture_output=True,
        text=True,
        timeout=25,
        creationflags=_NO_WIN
    )
    raw_json = proc_list.stdout.strip()
except Exception as e:
    print(f"[-] LỖI THỰC THI: Không thể gọi PowerShell để lấy danh sách máy in: {e}")
    sys.exit(1)

printers = []
if raw_json:
    try:
        data = json.loads(raw_json)
        if isinstance(data, dict):
            printers = [data]
        elif isinstance(data, list):
            printers = data
    except Exception:
        pass

if not printers:
    print("[-] LỖI THỰC THI: Không tìm thấy máy in nào được cài đặt trên máy Agent Windows này.")
    print("\n" + "=" * 64)
    print("🏁 KẾT THÚC")
    print("=" * 64)
    sys.exit(1)

print(f"✅ Đã tìm thấy {len(printers)} máy in trên hệ thống Windows:")

virtual_ports = ["portprompt:", "file:", "nul:"]
virtual_names = ["pdf", "xps", "onenote", "fax"]

def is_virtual_printer(p_obj):
    name = str(p_obj.get("Name", "")).lower()
    port = str(p_obj.get("PortName", "")).lower()
    return any(vp in port for vp in virtual_ports) or any(vn in name for vn in virtual_names)

selected_printer = None
default_printer = None
ip_matched_printer = None
name_matched_printer = None
physical_printers = []

for idx, p in enumerate(printers, 1):
    p_name = p.get("Name", "Unknown")
    p_port = str(p.get("PortName", ""))
    p_driver = str(p.get("DriverName", ""))
    p_is_default = bool(p.get("Default", False))
    p_offline = bool(p.get("WorkOffline", False))
    p_virt = is_virtual_printer(p)
    
    if not p_virt:
        physical_printers.append(p)

    status_str = "Offline" if p_offline else "Sẵn sàng (Online)"
    tags = []
    if p_is_default:
        tags.append("⭐ MẶC ĐỊNH")
        default_printer = p
    if p_virt:
        tags.append("ẢO")
    
    tag_str = f" [{', '.join(tags)}]" if tags else ""
    print(f"  {idx}. {p_name}{tag_str}")
    print(f"     └─ Cổng (Port): {p_port} | Driver: {p_driver} | Trạng thái: {status_str}")

    if target_ip and (target_ip in p_port or target_ip in p_name):
        ip_matched_printer = p
    if target_printer_req and target_printer_req.lower() in p_name.lower():
        name_matched_printer = p

# 4. Quyết định máy in thực hiện lệnh in
selection_reason = ""
if target_printer_req and name_matched_printer:
    selected_printer = name_matched_printer
    selection_reason = f"Khớp theo Tên máy in yêu cầu ('{target_printer_req}')"
elif target_ip and ip_matched_printer:
    selected_printer = ip_matched_printer
    selection_reason = f"Khớp theo Địa chỉ IP chỉ định ('{target_ip}')"
elif default_printer and not is_virtual_printer(default_printer):
    selected_printer = default_printer
    selection_reason = "Máy in vật lý MẶC ĐỊNH của hệ thống Windows"
elif physical_printers:
    selected_printer = physical_printers[0]
    selection_reason = "Máy in vật lý / mạng đầu tiên tìm thấy (tránh máy in ảo PDF/XPS)"
elif default_printer:
    selected_printer = default_printer
    selection_reason = "Máy in mặc định của hệ thống Windows"
else:
    selected_printer = printers[0]
    selection_reason = "Máy in đầu tiên trong danh sách"

target_name = selected_printer.get("Name")
target_port = str(selected_printer.get("PortName", ""))
target_driver = str(selected_printer.get("DriverName", ""))

print("\n" + "=" * 64)
print(f"🎯 MÁY IN ĐƯỢC CHỌN ĐỂ THỰC HIỆN LỆNH IN:")
print(f"  • Tên máy in  : {target_name}")
print(f"  • Cổng kết nối: {target_port}")
print(f"  • Tên Driver  : {target_driver}")
print(f"  • Tiêu chí    : {selection_reason}")
print("=" * 64)

# 5. Nếu cổng là mạng (IP), kiểm tra kết nối TCP 9100 (RAW Socket)
dest_ip = None
ip_match = re.search(r"\b(\d{1,3}(?:\.\d{1,3}){3})\b", target_port)
if ip_match:
    dest_ip = ip_match.group(1)
elif target_ip:
    dest_ip = target_ip

if dest_ip:
    print(f"\n📡 Kiểm tra kết nối mạng tới thiết bị ({dest_ip}:9100)...")
    try:
        with socket.create_connection((dest_ip, 9100), timeout=2.5):
            print(f"  ✅ Cổng mạng RAW Port 9100 của {dest_ip} ĐANG MỞ (Máy in đang bật và kết nối tốt)!")
    except Exception as net_err:
        print(f"  ⚠️ Cảnh báo TCP 9100 ({dest_ip}): Không phản hồi ({net_err}).")
        print("     (Máy in có thể đang Sleep, tắt nguồn, dùng cổng LPR/WSD, hoặc khác VLAN/Subnet).")

# 6. Gửi lệnh in trang in thử (Windows Test Page)
print(f"\n🚀 Đang phát lệnh in Windows Test Page tới '{target_name}'...")
escaped_target_name = target_name.replace("'", "''")

ps_print_cmd = f"""
$ErrorActionPreference = 'SilentlyContinue'
$p = Get-CimInstance Win32_Printer | Where-Object {{ $_.Name -eq '{escaped_target_name}' }}
if (-not $p) {{
    $p = Get-WmiObject Win32_Printer | Where-Object {{ $_.Name -eq '{escaped_target_name}' }}
}}
if (-not $p) {{
    Write-Output "ERROR_PRINTER_NOT_FOUND"
    exit 1
}}
$res = Invoke-CimMethod -InputObject $p -MethodName PrintTestPage
if ($res -and $res.ReturnValue -ne $null) {{
    Write-Output $res.ReturnValue
}} else {{
    Write-Output "0"
}}
"""

is_success = False
ret_val_str = ""

try:
    proc_print = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_print_cmd],
        capture_output=True,
        text=True,
        timeout=30,
        creationflags=_NO_WIN
    )
    ret_val_str = proc_print.stdout.strip()
    if ret_val_str == "0":
        is_success = True
except Exception as print_err:
    print(f"⚠️ Invoke-CimMethod PrintTestPage gặp lỗi: {print_err}")

if is_success:
    print(f"🎉 THÀNH CÔNG RỰC RỠ! (WMI ReturnValue = 0)")
    print(f"   Lệnh in trang in thử (Windows Test Page) đã được nạp vào Spooler của '{target_name}'.")
    print(f"   Máy in sẽ tiến hành kéo giấy và in bản in mẫu ngay bây giờ.")
else:
    print(f"⚠️ Invoke-CimMethod trả về '{ret_val_str}'. Đang kích hoạt phương thức in Windows printui.dll...")
    try:
        proc_rundll = subprocess.run(
            ["rundll32.exe", "printui.dll,PrintUIEntry", "/k", "/n", target_name],
            capture_output=True,
            text=True,
            timeout=15,
            creationflags=_NO_WIN
        )
        print(f"✅ Đã phát lệnh in dự phòng qua printui.dll thành công tới '{target_name}'.")
        is_success = True
    except Exception as rundll_err:
        print(f"[-] LỖI THỰC THI: Cả hai phương thức in đều thất bại: {rundll_err}")

# 7. Kiểm tra trạng thái hàng đợi in (Spooler Jobs)
try:
    ps_jobs = f"""
    $jobs = Get-PrintJob -PrinterName '{escaped_target_name}' -ErrorAction SilentlyContinue | Select-Object Id, DocumentName, JobStatus, TotalPages, SubmittedTime
    if ($jobs) {{ $jobs | ConvertTo-Json -Depth 2 }}
    """
    proc_jobs = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_jobs],
        capture_output=True,
        text=True,
        timeout=8,
        creationflags=_NO_WIN
    )
    jobs_out = proc_jobs.stdout.strip()
    if jobs_out and jobs_out != "null":
        print(f"\n📋 Trạng thái Spooler hàng đợi in của '{target_name}':")
        print(f"   {jobs_out}")
except Exception:
    pass

# 8. Cập nhật context payload nếu chạy trong dynamic_exec
if "context" in globals() and isinstance(globals()["context"], dict):
    globals()["context"]["result_payload"] = {
        "success": is_success,
        "target_printer": target_name,
        "port": target_port,
        "driver": target_driver,
        "selection_reason": selection_reason,
        "timestamp": timestamp,
        "total_printers": len(printers)
    }

print("\n" + "=" * 64)
if is_success:
    print("✅ HOÀN TẤT LỆNH IN: ĐÃ GỬI BẢN IN THỬ TỚI MÁY IN THÀNH CÔNG!")
else:
    print("[-] LỖI THỰC THI: Không thể gửi bản in thử tới máy in.")
print("=" * 64)
