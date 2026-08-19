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
