import requests
import re
import base64
import urllib.parse
import time

# 1. Cấu hình thông tin máy photocopy Ricoh (WIM)
IP = "192.168.1.222"
USER = "admin"
PASSWORD = "admin"  # Mật khẩu quản trị đúng

# 2. Cấu hình điểm scan cần sửa đổi (đối với wizard MODUSER bắt buộc dùng Mã ĐK 5 chữ số)
TARGET_REG_NO = "00002"  # Mã danh bạ hiển thị (Registration Number)
TARGET_NAME = "ns1"      # Tên hiển thị

# 3. Đường dẫn thư mục FTP đích mới
TARGET_SERVER = "192.168.1.43"
TARGET_PORT = 2130       # Cổng FTP (2130)
TARGET_PATH = "/ns1"     # Đường dẫn FTP (đầy đủ dấu gạch chéo)

# Tài khoản đăng nhập FTP đích
FTP_USER = "goxprint"
FTP_PASS = "goxprint"

BASE_URL = f"http://{IP}"

print("==================================================")
print(f"  [RICOH STANDALONE] SỬA ĐIỂM SCAN - IP: {IP}")
print("==================================================")

def extract_wim_token(html: str) -> str:
    """Sử dụng chính xác regex từ ricoh_create.py để trích xuất wimToken"""
    if not html: return ""
    m = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'name\s*=\s*["\']?wimToken["\']?[^>]*?value\s*=\s*["\']?([^"\'\s>]+)["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'value\s*=\s*["\']?([^"\'\s>]+)["\'].*?name\s*=\s*["\']?wimToken["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    return ""

def logout(session: requests.Session):
    """Giải phóng phiên cũ giống ricoh_create.py"""
    try:
        session.get(f"{BASE_URL}/web/entry/en/websys/webArch/logout.cgi", timeout=5)
        session.get(f"{BASE_URL}/web/guest/en/websys/webArch/logout.cgi", timeout=5)
        session.cookies.clear()
    except: pass

def check_html_errors(html: str, step_name: str):
    """Kiểm tra xem HTML phản hồi có chứa thông báo lỗi nào không"""
    if not html:
        return
    error_patterns = [
        (r'class=["\']errormsg["\'][^>]*>(.*?)<', "Lỗi giao diện"),
        (r'class=["\']error["\'][^>]*>(.*?)<', "Lỗi class error"),
        (r'id=["\']errorMsg[^"\']*["\'][^>]*>(.*?)<', "Lỗi id errorMsg"),
        (r'class=["\']adrsErrText["\'][^>]*>(.*?)<', "Lỗi adrsErrText"),
    ]
    for pattern, label in error_patterns:
        matches = re.findall(pattern, html, re.IGNORECASE | re.DOTALL)
        for m in matches:
            clean_err = re.sub(r'<[^>]+>', '', m).strip()
            if clean_err:
                print(f"  [!] PHÁT HIỆN LỖI tại bước {step_name} ({label}): {clean_err}")
                
    if "unexpected error has occurred" in html.lower():
        print(f"  [!] PHÁT HIỆN LỖI tại bước {step_name}: An unexpected error has occurred (Lỗi không xác định).")
    if "session timed out" in html.lower():
        print(f"  [!] PHÁT HIỆN LỖI tại bước {step_name}: Session timed out (Hết phiên làm việc).")

def send_wizard_step(session, url, data, referer):
    """Gửi bước thiết lập bằng giao thức URL-encoded chuẩn của WIM"""
    headers = {
        "Referer": referer,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
    }
    resp = session.post(url, data=data, headers=headers, timeout=15)
    resp.raise_for_status()
    return resp.text

# 1. Khởi tạo session & giải phóng phiên cũ
session = requests.Session()
logout(session)
time.sleep(1.0)

# 2. Đăng nhập theo cơ chế giống hệt ricoh_create.py
print(f"Đang đăng nhập máy in Ricoh {IP}...")
form_url = f"{BASE_URL}/web/guest/en/websys/webArch/authForm.cgi"
resp = session.get(form_url, timeout=10)
wim_token = extract_wim_token(resp.text)
print(f"  Token đăng nhập thu được: {wim_token}")

login_url = f"{BASE_URL}/web/guest/en/websys/webArch/login.cgi"
encoded_user = base64.b64encode(USER.encode()).decode()
encoded_pass = base64.b64encode(PASSWORD.encode()).decode()
data = {
    "userid": encoded_user,
    "username": encoded_user,
    "password": encoded_pass,
    "wimToken": wim_token,
    "open": "websys/webArch/authForm.cgi"
}
session.post(login_url, data=data, headers={"Referer": form_url}, timeout=10)
print("  [✓] Đăng nhập OK.")

# Thực hiện kịch bản chỉnh sửa scan point sau khi đăng nhập
try:
    # 2. Truy cập Address List để nhận wimToken mới
    print("Đang tải danh sách danh bạ để nhận token phiên...")
    list_url = f"{BASE_URL}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    resp = session.get(list_url, timeout=10)
    wim_token = extract_wim_token(resp.text)

    # 3. Kích hoạt wizard MODUSER bằng Mã Đăng Ký (ví dụ: 00002)
    print(f"Đang mở trình chỉnh sửa Wizard MODUSER cho Mã ĐK: {TARGET_REG_NO}...")
    wizard_url = f"{BASE_URL}/web/entry/en/address/adrsGetUserWizard.cgi"
    wizard_open_data = {
        "mode": "MODUSER",
        "outputSpecifyModeIn": "PROGRAMMED",
        "entryIndexIn": TARGET_REG_NO,
        "wimToken": wim_token
    }
    
    html_resp = send_wizard_step(session, wizard_url, wizard_open_data, list_url)
    wim_token = extract_wim_token(html_resp) or wim_token
    print(f"  Wizard đã mở thành công. Token phiên: {wim_token}")
    check_html_errors(html_resp, "OPEN_WIZARD")

    # 4. Gửi bước BASE (Tên hiển thị)
    print("  [-] Gửi bước BASE...")
    wizard_set_url = f"{BASE_URL}/web/entry/en/address/adrsSetUserWizard.cgi"
    base_data = [
        ("mode", "MODUSER"),
        ("step", "BASE"),
        ("wimToken", wim_token),
        ("entryIndexIn", TARGET_REG_NO),
        ("entryNameIn", TARGET_NAME[:20]),
        ("entryDisplayNameIn", TARGET_NAME[:16]),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1")
    ]
    html_resp = send_wizard_step(session, wizard_set_url, base_data, wizard_url)
    wim_token = extract_wim_token(html_resp) or wim_token
    print(f"  BASE hoàn thành. Token mới: {wim_token}")
    check_html_errors(html_resp, "BASE")

    # 5. Gửi bước FOLDER (Định cấu hình FTP máy đích)
    print("  [-] Gửi bước FOLDER...")
    encoded_ftp_pass = base64.b64encode(FTP_PASS.encode("utf-8")).decode("utf-8")
    folder_data = [
        ("mode", "MODUSER"),
        ("step", "FOLDER"),
        ("wimToken", wim_token),
        ("folderProtocolIn", "FTP_O"),
        ("folderPortNoIn", str(TARGET_PORT)),
        ("folderServerNameIn", TARGET_SERVER),
        ("folderPathNameIn", TARGET_PATH),
        ("folderAuthUserNameIn", FTP_USER),
        ("folderPasswordUpdateIn", "ACCOUNTPWD_ON_RB"),
        ("wk_folderPasswordIn", ""),
        ("folderPasswordIn", encoded_ftp_pass),
        ("wk_folderPasswordConfirmIn", ""),
        ("folderPasswordConfirmIn", encoded_ftp_pass)
    ]
    html_resp = send_wizard_step(session, wizard_set_url, folder_data, wizard_url)
    wim_token = extract_wim_token(html_resp) or wim_token
    print(f"  FOLDER hoàn thành. Token mới: {wim_token}")
    check_html_errors(html_resp, "FOLDER")

    # 6. Gửi bước CONFIRM để lưu thay đổi vĩnh viễn
    print("Đang gửi lệnh CONFIRM để lưu thay đổi...")
    confirm_data = [
        ("wimToken", wim_token),
        ("stepListIn", "BASE"),
        ("stepListIn", "FOLDER"),
        ("mode", "MODUSER"),
        ("step", "CONFIRM")
    ]
    html_resp = send_wizard_step(session, wizard_set_url, confirm_data, wizard_url)
    check_html_errors(html_resp, "CONFIRM")
    
    # 7. TRUY CẬP LẠI TRANG DANH SÁCH ĐỂ COMMIT THỰC SỰ VÀO PHOTOCOPY (BẮT BUỘC)
    print("  [-] Đang tải trang danh sách để thực sự commit thay đổi vào bộ nhớ máy in...")
    try:
        session.get(list_url, timeout=10)
    except: pass
    
    print("  [-] Đợi 3 giây để máy in hoàn tất lưu trữ...")
    time.sleep(3.0)
    print("  [✓] Đã cập nhật điểm scan thành công trên máy in Ricoh!")

except Exception as err:
    print(f"\n[-] LỖI THỰC THI WIZARD: {err}")

finally:
    print("Đang đăng xuất khỏi thiết bị...")
    logout(session)
    print("Hoàn thành!")
print("==================================================")
