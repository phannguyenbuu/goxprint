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

def extract_wim_token(html: str) -> str:
    if not html: return ""
    m = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'name\s*=\s*["\']?wimToken["\']?[^>]*?value\s*=\s*["\']?([^"\'\s>]+)["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'value\s*=\s*["\']?([^"\'\s>]+)["\'].*?name\s*=\s*["\']?wimToken["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    return ""

def logout(session: requests.Session):
    print("[*] Đang đăng xuất để giải phóng phiên (Tránh lỗi đầy Session)...")
    try:
        base_url = f"http://{IP}"
        session.get(f"{base_url}/web/entry/en/websys/webArch/logout.cgi", timeout=5)
        session.get(f"{base_url}/web/guest/en/websys/webArch/logout.cgi", timeout=5)
        session.cookies.clear()
    except Exception:
        pass

def login() -> requests.Session:
    session = requests.Session()
    base_url = f"http://{IP}"
    print(f"[*] Đang khởi tạo phiên làm việc với Ricoh WIM IP: {IP}...")
    
    # Bước 1: Thử truy cập danh bạ trực tiếp (Dành cho máy Ricoh tắt xác thực hoặc Mật khẩu rỗng/Guest)
    try:
        direct_list_url = f"{base_url}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
        r_direct = session.get(direct_list_url, timeout=5)
        direct_html = r_direct.text or ""
        if "modeIn=LIST_ALL" in direct_html and "authForm.cgi" not in direct_html and "modeIn=login" not in direct_html:
            print("  [✓] Đăng nhập thành công qua chế độ Khách (Guest / Unauthenticated WIM Mode)!")
            return session
    except Exception:
        pass

    # Bước 2: Đăng nhập Administrator WIM chuẩn bằng POST credentials
    print(f"[*] Đang lấy form đăng nhập Admin từ {IP}...")
    form_url = f"{base_url}/web/guest/en/websys/webArch/authForm.cgi"
    resp = session.get(form_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    
    login_url = f"{base_url}/web/guest/en/websys/webArch/login.cgi"
    encoded_user = base64.b64encode(USER.encode()).decode() if USER else ""
    encoded_pass = base64.b64encode(PASSWORD.encode()).decode() if PASSWORD else ""
    
    data = {
        "userid": encoded_user,
        "username": encoded_user,
        "password": encoded_pass,
        "wimToken": wim_token,
        "open": "websys/webArch/authForm.cgi"
    }
    print("[*] Đang gửi thông tin đăng nhập Administrator...")
    r_login = session.post(login_url, data=data, headers={"Referer": form_url}, timeout=10)
    r_text = r_login.text or ""
    fail_keywords = ["Authentication has failed", "not correct", "loginFailed", "Authentication failed", "Login failed"]
    if any(kw.lower() in r_text.lower() for kw in fail_keywords):
        print(f"  [!] WIM Login HTTP Status: {r_login.status_code}")
        print(f"  [!] WIM Login Response Snippet: {r_text[:300].strip()}")
        raise RuntimeError(f"Authentication failed: Đăng nhập Ricoh WIM thất bại (IP={IP}, User={USER}). Sai tài khoản hoặc mật khẩu!")
    return session

def format_ricoh_folder(val: str) -> str:
    if not val:
        return ""
    val = val.strip()
    bs = chr(92)
    if ":/" in val and not val.lower().startswith("ftp") and bs not in val:
        parts = val.split(":/", 1)
        host = parts[0].strip()
        path = parts[1].strip()
        if not path.startswith("/"):
            path = "/" + path
        return f"ftp://{host}:2130{path}"
    return val

def strip_html(text: str) -> str:
    if not text: return ""
    result = []
    in_tag = False
    for char in text:
        if char == '<':
            in_tag = True
        elif char == '>':
            in_tag = False
        elif not in_tag:
            result.append(char)
    clean = "".join(result)
    return clean.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').strip()

def parse_javascript_array_fields(data: str) -> list:
    fields = []
    current = []
    in_quotes = False
    quote_char = ""
    escaped = False
    bs = chr(92)
    for char in data:
        if escaped:
            current.append(char)
            escaped = False
            continue
        if char == bs:
            current.append(char)
            escaped = True
            continue
        if char in {"'", '"'}:
            if not in_quotes:
                in_quotes = True
                quote_char = char
            elif char == quote_char:
                in_quotes = False
            else:
                current.append(char)
            continue
        if char == "," and not in_quotes:
            fields.append("".join(current).strip())
            current = []
        else:
            current.append(char)
    fields.append("".join(current).strip())
    return fields

def parse_ajax_address_list(data: str) -> list:
    entries = []
    raw = str(data or "").strip()
    if not raw: return entries
    first = raw.find("[[")
    last = raw.rfind("]]")
    if first < 0 or last <= first:
        first = raw.find("[")
        last = raw.rfind("]")
        if first < 0 or last <= first: return entries
        inner = raw[first+1 : last]
    else:
        inner = raw[first+2 : last]
    
    rows = inner.split("],[")
    for raw_row in rows:
        raw_row = raw_row.strip("[]")
        fields = parse_javascript_array_fields(raw_row)
        if len(fields) < 4:
            continue
        raw_entry_id = fields[0].strip().strip("'\"")
        reg_no = fields[2].strip("'\"") if len(fields) > 2 else ""
        name = fields[3].strip("'\"") if len(fields) > 3 else ""
        email = fields[6].strip("'\"") if len(fields) > 6 else ""
        folder = fields[7].strip("'\"") if len(fields) > 7 else ""
        if name or reg_no:
            entries.append({
                "entry_id": raw_entry_id,
                "registration_no": reg_no,
                "name": name,
                "email_address": email,
                "folder": folder
            })
    return entries

def parse_html_address_list(html: str) -> list:
    entries = []
    start_tbody = html.find('<tbody id="ReportListArea_TableBody">')
    if start_tbody < 0:
        return entries
    end_tbody = html.find('</tbody>', start_tbody)
    if end_tbody < 0:
        return entries
    tbody = html[start_tbody : end_tbody]
    
    bs = chr(92)
    rows = tbody.split('<tr')
    for row in rows:
        if 'reportListDummyRow' in row or 'reportListHeader' in row:
            continue
        entry_id = ""
        idx = row.find('entryIndex')
        if idx >= 0:
            val_idx = row.find('value=', idx)
            if val_idx >= 0:
                q = row[val_idx+6]
                if q in ('"', "'"):
                    end_q = row.find(q, val_idx+7)
                    if end_q >= 0:
                        entry_id = row[val_idx+7 : end_q]
        
        cells = []
        td_idx = 0
        while True:
            td_start = row.find('<td', td_idx)
            if td_start < 0:
                break
            content_start = row.find('>', td_start) + 1
            td_end = row.find('</td>', content_start)
            if td_end < 0:
                break
            cells.append(strip_html(row[content_start : td_end]))
            td_idx = td_end + 5
            
        if len(cells) < 2:
            continue
            
        reg_no = ""
        p_name = ""
        email = ""
        folder = ""
        for c in cells:
            if not reg_no and (c.isdigit() or (len(c) <= 4 and c != "-")):
                reg_no = c
            elif "@" in c and not email:
                email = c
            elif ("/" in c or bs in c) and not folder:
                folder = c
            elif c and c != "-" and not p_name and c not in ("User", "Group", "Summary"):
                p_name = c
        if p_name or reg_no:
            entries.append({
                "entry_id": entry_id,
                "registration_no": reg_no or "001",
                "name": p_name or "ScanUser",
                "email_address": email,
                "folder": folder
            })
    return entries

def auto_sync_address_book(session: requests.Session):
    try:
        base_url = f"http://{IP}"
        print("[*] Đang tự động quét lại danh bạ máy in...")
        list_url = f"{base_url}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
        resp = session.get(list_url, timeout=10)
        html_text = resp.text
        wim_token = extract_wim_token(html_text)
        
        if not wim_token or "authForm.cgi" in html_text:
            print("  [i] Phiên làm việc hết hạn, thử đăng nhập lại để quét...")
            session = login()
            resp = session.get(list_url, timeout=10)
            html_text = resp.text
            wim_token = extract_wim_token(html_text)

        entries = []
        if wim_token:
            ajax_url = f"{base_url}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}"
            ajax_resp = session.get(ajax_url, timeout=10)
            if ajax_resp.status_code == 200 and "[" in ajax_resp.text:
                entries = parse_ajax_address_list(ajax_resp.text)

        if not entries and html_text:
            entries = parse_html_address_list(html_text)

        for entry in entries:
            if "folder" in entry:
                entry["folder"] = format_ricoh_folder(entry["folder"])

        print(f"[*] TỔNG CỘNG LẤY ĐƯỢC: {len(entries)} MỤC TRÊN MÁY PHOTOCOPY RICOH:")
        print("--------------------------------------------------")
        for idx, item in enumerate(entries, 1):
            print(f"  #{idx:02d} | Mã ĐK: {item['registration_no']} | Tên: {item['name']} | ID: {item['entry_id']}")
        print("--------------------------------------------------")

        output_payload = {
            "status": "success",
            "count": len(entries),
            "address_list": entries
        }
        print(f"__ADDRESS_BOOK_JSON_START__\n{json.dumps(output_payload, ensure_ascii=False)}\n__ADDRESS_BOOK_JSON_END__")

        bridge_obj = globals().get('bridge')
        if bridge_obj and hasattr(bridge_obj, '_post_address_book_sync_data'):
            try:
                real_mac = ""
                try:
                    local_printers = bridge_obj._load_local_printers_json() or []
                    for p_item in local_printers:
                        p_item_ip = str(p_item.get("ip") or "").strip()
                        if p_item_ip == IP or (IP and IP in p_item_ip):
                            real_mac = str(p_item.get("mac_address") or p_item.get("mac_id") or "").strip().upper().replace("-", ":")
                            break
                except Exception: pass
                from types import SimpleNamespace
                p = SimpleNamespace(ip=IP, mac_address=real_mac, name="RicohPrinter", printer_type="ricoh")
                bridge_obj._post_address_book_sync_data(p, output_payload)
                print(f"  [✓] TỰ ĐỘNG ĐỒNG BỘ DANH BẠ VỀ SERVER THÀNH CÔNG!")
            except Exception as sync_err:
                print(f"  [!] Sync post warning: {sync_err}")
    except Exception as list_err:
        print(f"[-] Lỗi quét danh bạ tự động: {list_err}")

def ensure_local_ftp_and_shortcut(scan_name: str):
    """
    Tự động tạo thư mục con bên trong thư mục gốc FTP của Agent (theo settings.json/scan_dirs),
    tạo Shortcut (.lnk) ngoài Desktop trỏ vào thư mục con đó,
    và tự động mở thư mục trong File Explorer.
    """
    import os, sys, json, subprocess, pathlib
    print("[*] Đang khởi tạo thư mục FTP con, Shortcut Desktop và mở thư mục...")
    
    # 1. Xác định thư mục gốc FTP (Ưu tiên tuyệt đối Roaming AppData settings.json -> polling.scan_dirs)
    ftp_root = ""
    appdata = os.getenv("APPDATA", "")
    if not appdata:
        userprofile = os.getenv("USERPROFILE", "")
        if userprofile:
            appdata = os.path.join(userprofile, "AppData", "Roaming")
    
    # 1.1. Đọc trực tiếp từ %APPDATA%\GoxPrintAgent\settings.json
    if appdata:
        roaming_settings = os.path.join(appdata, "GoxPrintAgent", "settings.json")
        if os.path.exists(roaming_settings):
            try:
                with open(roaming_settings, "r", encoding="utf-8") as f:
                    s_data = json.load(f)
                val = (s_data.get("polling") or {}).get("scan_dirs") or s_data.get("scan_dirs") or s_data.get("ftp_path")
                if val and str(val).strip():
                    first_dir = str(val).replace("|", os.sep).replace("/", os.sep).split(";")[0].strip()
                    if first_dir:
                        ftp_root = os.path.normpath(os.path.expandvars(first_dir))
                        print(f"[*] Đã nhận thư mục scan từ Roaming settings.json: {ftp_root}")
            except Exception as e:
                print(f"[-] Cảnh báo đọc Roaming settings.json: {e}")

    # 1.2. Đọc từ bridge._config nếu có
    if not ftp_root:
        bridge_obj = globals().get('bridge') or locals().get('bridge')
        if bridge_obj and hasattr(bridge_obj, '_config'):
            try:
                cfg_val = (
                    bridge_obj._config.get_string("polling.scan_dirs", "") or 
                    bridge_obj._config.get_string("scan_dirs", "") or 
                    bridge_obj._config.get_string("ftp_path", "")
                )
                if cfg_val and str(cfg_val).strip():
                    first_dir = str(cfg_val).replace("|", os.sep).replace("/", os.sep).split(";")[0].strip()
                    if first_dir:
                        ftp_root = os.path.normpath(os.path.expandvars(first_dir))
                        print(f"[*] Đã nhận thư mục scan từ Agent Bridge: {ftp_root}")
            except Exception:
                pass

    # 1.3. Đọc từ settings.json cùng thư mục file thực thi
    if not ftp_root:
        local_candidates = [
            os.path.join(os.path.dirname(sys.executable), "settings.json") if getattr(sys, "frozen", False) else "",
            "settings.json",
            os.path.expandvars(r"%LOCALAPPDATA%\GoxPrintAgent\settings.json")
        ]
        for alt_p in local_candidates:
            if alt_p and os.path.exists(alt_p):
                try:
                    with open(alt_p, "r", encoding="utf-8") as f:
                        s_data = json.load(f)
                    val = (s_data.get("polling") or {}).get("scan_dirs") or s_data.get("scan_dirs")
                    if val and str(val).strip():
                        first_dir = str(val).replace("|", os.sep).replace("/", os.sep).split(";")[0].strip()
                        if first_dir:
                            ftp_root = os.path.normpath(os.path.expandvars(first_dir))
                            print(f"[*] Đã nhận thư mục scan từ {alt_p}: {ftp_root}")
                            break
                except Exception:
                    pass

    # 1.4. Fallback cuối cùng nếu chưa có bất kỳ cấu hình nào
    if not ftp_root:
        ftp_root = os.path.expandvars(r"%LOCALAPPDATA%\Temp\GoPrinxAgent\ftp")
        print(f"[*] Chưa cấu hình scan_dirs, fallback về: {ftp_root}")

    try:
        os.makedirs(ftp_root, exist_ok=True)
        print(f"[+] Thư mục FTP gốc: {ftp_root}")
    except Exception as e:
        print(f"[-] Lỗi tạo thư mục FTP gốc ({ftp_root}): {e}")

    # 2. Làm sạch tên thư mục scan (tránh placeholder dạng __XXX__ hoặc rỗng)
    raw_name = str(scan_name or "").strip()
    if (raw_name.startswith("__") and raw_name.endswith("__")) or raw_name.lower() in ("null", "none", "undefined"):
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

    # 4. Xác định các đường dẫn Desktop thực tế của người dùng
    desktop_dirs = []
    try:
        flags = 0x08000000 if sys.platform == "win32" else 0
        cmd = ["powershell", "-NoProfile", "-NonInteractive", "-Command", "[Environment]::GetFolderPath('Desktop')"]
        res = subprocess.run(cmd, capture_output=True, text=True, errors="ignore", creationflags=flags)
        p = res.stdout.strip()
        if p and os.path.exists(p) and p not in desktop_dirs:
            desktop_dirs.append(p)
    except Exception:
        pass

    try:
        import winreg
        key_path = r"Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders"
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, key_path) as key:
            val, _ = winreg.QueryValueEx(key, "Desktop")
            expanded = os.path.expandvars(val)
            if os.path.exists(expanded) and expanded not in desktop_dirs:
                desktop_dirs.append(expanded)
    except Exception:
        pass

    user_prof = os.environ.get("USERPROFILE") or str(pathlib.Path.home())
    default_desktop = os.path.join(user_prof, "Desktop")
    if os.path.exists(default_desktop) and default_desktop not in desktop_dirs:
        desktop_dirs.append(default_desktop)
    onedrive_desktop = os.path.join(user_prof, "OneDrive", "Desktop")
    if os.path.exists(onedrive_desktop) and onedrive_desktop not in desktop_dirs:
        desktop_dirs.append(onedrive_desktop)

    # 5. Tạo Shortcut ngoài Desktop bằng WScript.Shell
    for desktop_dir in desktop_dirs:
        try:
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

    # 6. Mở thư mục vừa tạo trong File Explorer
    try:
        if sys.platform == "win32" and os.path.exists(target_dir):
            try:
                os.startfile(target_dir)
                print(f"[+] Đã mở thư mục scan trong File Explorer: {target_dir}")
            except Exception:
                flags = 0x08000000 if sys.platform == "win32" else 0
                subprocess.Popen(["explorer.exe", target_dir], creationflags=flags)
                print(f"[+] Đã gọi Explorer mở thư mục scan: {target_dir}")
    except Exception as open_err:
        print(f"[-] Cảnh báo không thể tự động mở thư mục: {open_err}")

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
