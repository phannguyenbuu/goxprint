import requests
import re
import base64
import json
import sys
import time

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"
TARGET_NAME = "__TARGET_SCAN_USER__"
BASE_URL = f"http://{IP}"

print("==================================================")
print(f"  [RICOH EXEC] TẠO ĐIỂM SCAN PHOTOCOPY - IP: {IP}")
print("==================================================")

# Lấy cấu hình FTP tự động từ GoxAgent bridge
ftp_server = "192.168.1.111"
ftp_port = 2130
ftp_user = "goxprint"
ftp_pass = "goxprint"

if "bridge" in globals():
    try:
        ftp_server = bridge._resolve_local_ip() or ftp_server
        ftp_port = bridge._config.get_int("ftp_port", 2130)
        ftp_user = bridge._config.get_string("ftp_user", "goxprint")
        ftp_pass = bridge._config.get_string("ftp_pass", "goxprint")
        print(f"[*] Đã nhận cấu hình từ Agent Bridge: FTP={ftp_server}:{ftp_port}")
    except Exception as e:
        print("[*] Lỗi đọc cấu hình từ bridge, sử dụng mặc định:", e)

ftp_path = f"/{TARGET_NAME}" if TARGET_NAME else "/scan"

# __RICOH_LOGIN__
# __RICOH_LIST__

def ensure_local_ftp_and_shortcut(scan_name: str):
    """
    Tự động tạo thư mục con bên trong thư mục gốc FTP của Agent
    và tạo Shortcut (.lnk) ngoài Desktop trỏ vào thư mục con đó.
    """
    import os, sys, subprocess, pathlib
    print("[*] Đang khởi tạo thư mục FTP con và Shortcut Desktop...")
    
    # 1. Xác định thư mục gốc FTP
    ftp_root = ""
    bridge_obj = globals().get('bridge') or locals().get('bridge')
    if bridge_obj:
        try:
            cfg_root = bridge_obj._config.get_string("ftp_root")
            if cfg_root and os.path.exists(cfg_root):
                ftp_root = cfg_root
        except Exception:
            pass
    if not ftp_root:
        ftp_root = os.path.expandvars(r"%LOCALAPPDATA%\Temp\GoPrinxAgent\ftp")
    
    try:
        os.makedirs(ftp_root, exist_ok=True)
    except Exception as e:
        print(f"[-] Lỗi tạo thư mục FTP gốc ({ftp_root}): {e}")

    # 2. Làm sạch tên thư mục scan
    raw_name = str(scan_name or "").strip()
    if raw_name in ["__TARGET_SCAN_USER__", "__TARGET_NAME__", "__SCAN_USERNAME__", "null", "None", "undefined"]:
        raw_name = ""
    clean_name = raw_name
    for ch in r'\/:*?"<>|':
        clean_name = clean_name.replace(ch, '')
    clean_name = clean_name.strip()

    # 3. Tạo thư mục con trong FTP
    if clean_name:
        target_dir = os.path.join(ftp_root, clean_name)
        shortcut_filename = f"Scan - {clean_name}.lnk"
    else:
        target_dir = ftp_root
        shortcut_filename = "Thu muc Scan (GoPrinx).lnk"

    try:
        os.makedirs(target_dir, exist_ok=True)
        print(f"[+] Đã tạo thư mục FTP con: {target_dir}")
    except Exception as e:
        print(f"[-] Lỗi tạo thư mục FTP con: {e}")

    # 4. Xác định Desktop thực tế của người dùng
    def _get_desktop() -> str:
        try:
            import winreg
            key_path = r"Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders"
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, key_path) as key:
                val, _ = winreg.QueryValueEx(key, "Desktop")
                expanded = os.path.expandvars(val)
                if os.path.exists(expanded):
                    return expanded
        except Exception:
            pass

        try:
            flags = 0x08000000 if sys.platform == "win32" else 0
            cmd = ["powershell", "-NoProfile", "-NonInteractive", "-Command", "[Environment]::GetFolderPath('Desktop')"]
            res = subprocess.run(cmd, capture_output=True, text=True, errors="ignore", creationflags=flags)
            p = res.stdout.strip()
            if p and os.path.exists(p):
                return p
        except Exception:
            pass

        user_prof = os.environ.get("USERPROFILE") or str(pathlib.Path.home())
        onedrive_desktop = os.path.join(user_prof, "OneDrive", "Desktop")
        if os.path.exists(onedrive_desktop):
            return onedrive_desktop

        default_desktop = os.path.join(user_prof, "Desktop")
        os.makedirs(default_desktop, exist_ok=True)
        return default_desktop

    # 5. Tạo Shortcut ngoài Desktop bằng WScript.Shell
    try:
        desktop_dir = _get_desktop()
        shortcut_path = os.path.join(desktop_dir, shortcut_filename)
        safe_shortcut = shortcut_path.replace("'", "''")
        safe_target = target_dir.replace("'", "''")
        ps_cmd = f"$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('{safe_shortcut}'); $s.TargetPath = '{safe_target}'; $s.WorkingDirectory = '{safe_target}'; $s.Description = 'Thu muc luu tru ban Scan'; $s.Save()"
        flags = 0x08000000 if sys.platform == "win32" else 0
        subprocess.run(["powershell", "-NoProfile", "-NonInteractive", "-Command", ps_cmd], capture_output=True, text=True, errors="ignore", creationflags=flags)
        if os.path.exists(shortcut_path):
            print(f"[+] Đã tạo Shortcut ngoài Desktop: {shortcut_path} -> {target_dir}")
        else:
            print(f"[-] Cảnh báo: Chưa tạo được Shortcut ngoài Desktop ({shortcut_path})")
    except Exception as sc_err:
        print(f"[-] Cảnh báo tạo Shortcut ngoài Desktop: {sc_err}")

    return target_dir, clean_name

def get_next_id(session: requests.Session, wim_token: str) -> str:
    print("[*] Đang tính toán mã ĐK tiếp theo...")
    ajax_url = f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}"
    resp = session.get(ajax_url, timeout=10)
    max_id = 0
    raw_entries = re.findall(r"\[([^\]]+)\]", resp.text)
    for raw in raw_entries:
        # Split by comma but ignore commas in quotes (simple workaround)
        fields = re.split(r",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", raw.replace("'", '"'))
        if len(fields) >= 8:
            reg = fields[2].strip().strip('"')
            if reg.isdigit():
                max_id = max(max_id, int(reg))
    next_id = str(max_id + 1).zfill(5)
    print(f"[*] Mã ĐK tiếp theo sẽ là: {next_id}")
    return next_id

def create_folder_scan(session: requests.Session, name: str, ftp_server: str, ftp_port: int, ftp_path: str, ftp_user: str, ftp_pass: str):
    print(f"[*] Đang chuẩn bị tạo điểm scan FOLDER (FTP)...")
    list_url = f"{BASE_URL}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    resp = session.get(list_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    next_id = get_next_id(session, wim_token)
    
    get_wizard_url = f"{BASE_URL}/web/entry/en/address/adrsGetUserWizard.cgi"
    set_wizard_url = f"{BASE_URL}/web/entry/en/address/adrsSetUserWizard.cgi"
    
    # BƯỚC 0: INIT WIZARD (Khởi tạo phiên tạo User trên máy in)
    print(f"[*] Đang khởi tạo phiên giao dịch Wizard...")
    init_data = {
        "mode": "ADDUSER",
        "outputSpecifyModeIn": "DEFAULT",
        "entryIndexIn": next_id,
        "wimToken": wim_token
    }
    resp_init = session.post(get_wizard_url, data=init_data, headers={"Referer": list_url}, timeout=10)
    wim_token = extract_wim_token(resp_init.text) or wim_token

    # BƯỚC 1: BASE (Tên hiển thị)
    print(f"[*] Đang gửi yêu cầu Bước 1 (BASE) với ID {next_id}...")
    base_data = [
        ("wimToken", wim_token),
        ("mode", "ADDUSER"),
        ("step", "BASE"),
        ("entryIndexIn", next_id),
        ("entryNameIn", name[:20]),
        ("entryDisplayNameIn", name[:16]),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1")
    ]
    resp_base = session.post(set_wizard_url, data=base_data, headers={"Referer": list_url}, timeout=10)
    wim_token = extract_wim_token(resp_base.text) or wim_token

    # BƯỚC 2: FOLDER (FTP)
    print(f"[*] Đang gửi yêu cầu Bước 2 (FOLDER - FTP)...")
    encoded_password = base64.b64encode(ftp_pass.encode("utf-8")).decode("utf-8") if ftp_pass else ""
    folder_data = [
        ("mode", "ADDUSER"),
        ("step", "FOLDER"),
        ("wimToken", wim_token),
        ("folderProtocolIn", "FTP_O"),
        ("folderPortNoIn", str(ftp_port)),
        ("folderServerNameIn", ftp_server),
        ("folderPathNameIn", ftp_path),
        ("folderAuthUserNameIn", ftp_user),
        ("wk_folderPasswordIn", ""),
        ("folderPasswordIn", encoded_password),
        ("wk_folderPasswordConfirmIn", ""),
        ("folderPasswordConfirmIn", encoded_password)
    ]
    resp_folder = session.post(set_wizard_url, data=folder_data, headers={"Referer": list_url}, timeout=10)
    wim_token = extract_wim_token(resp_folder.text) or wim_token

    # BƯỚC 3: CONFIRM (Lưu)
    print(f"[*] Đang gửi yêu cầu Bước 3 (CONFIRM)...")
    confirm_items = [
        ("wimToken", wim_token),
        ("mode", "ADDUSER"),
        ("step", "CONFIRM"),
        ("stepListIn", "BASE"),
        ("stepListIn", "FOLDER")
    ]
    resp_confirm = session.post(set_wizard_url, data=confirm_items, headers={"Referer": list_url}, timeout=10)
    
    print("[*] Đang đóng quá trình để lưu (Simulate Back)...")
    session.get(list_url, timeout=10)

    if resp_confirm.status_code == 200:
        print("[+] Yêu cầu Đã được lưu (CONFIRM) thành công! Hãy kiểm tra lại máy in.")

if globals().get('context') and isinstance(globals()['context'], dict):
    ctx = globals()['context']
    if ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip'):
        IP = str(ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip')).strip()
        BASE_URL = f"http://{IP}"
    if ctx.get('auth_user') or ctx.get('user') or ctx.get('target_user'):
        USER = str(ctx.get('auth_user') or ctx.get('user') or ctx.get('target_user')).strip()
    if ctx.get('auth_password') or ctx.get('password') or ctx.get('target_pass'):
        PASSWORD = str(ctx.get('auth_password') or ctx.get('password') or ctx.get('target_pass')).strip()
    if ctx.get('name') or ctx.get('target_name') or ctx.get('scan_username'):
        TARGET_NAME = str(ctx.get('name') or ctx.get('target_name') or ctx.get('scan_username')).strip()

# 0. Khởi tạo thư mục FTP con và Shortcut ngoài Desktop
target_scan_dir, clean_scan_name = ensure_local_ftp_and_shortcut(TARGET_NAME)
if clean_scan_name:
    TARGET_NAME = clean_scan_name
    ftp_path = f"/{clean_scan_name}"
else:
    ftp_path = "/scan"

sess = None
try:
    sess = login()
    create_folder_scan(
        sess,
        name=TARGET_NAME,
        ftp_server=ftp_server,
        ftp_port=ftp_port,
        ftp_path=ftp_path,
        ftp_user=ftp_user,
        ftp_pass=ftp_pass
    )
except Exception as err:
    print("")
    print(f"[-] LỖI THỰC THI: {err}")
finally:
    if sess:
        try:
            print("[*] Chờ 3 giây để máy photo cập nhật bộ nhớ đệm trước khi đồng bộ...")
            time.sleep(3.0)
            auto_sync_address_book(sess)
        except Exception: pass
        logout(sess)
print("==================================================")
