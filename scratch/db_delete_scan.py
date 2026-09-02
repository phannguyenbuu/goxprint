import requests
import re
import base64
import json
import sys
import time

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"
TARGET_ID = "__TARGET_ID__"
TARGET_NAME = "__TARGET_SCAN_USER__"
BASE_URL = f"http://{IP}"

print("==================================================")
print(f"  [RICOH EXEC] XÓA ĐIỂM SCAN PHOTOCOPY - IP: {IP}")
print("==================================================")
print("[1/5] Cấu hình tham số:")
print(f"  - IP Máy in   : {IP}")
print(f"  - Đăng nhập   : {USER}")
print(f"  - Target ID   : {TARGET_ID}")
print(f"  - Target Name : {TARGET_NAME}")
print(f"  - Base URL    : {BASE_URL}")

def extract_wim_token(html: str) -> str:
    if not html: return ""
    m = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'name\s*=\s*["\']?wimToken["\']?[^>]*?value\s*=\s*["\']?([^"\'\s>]+)["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'value\s*=\s*["\']?([^"\'\s>]+)["\']?[^>]*?name\s*=\s*["\']?wimToken["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    return ""

def logout(session: requests.Session):
    print("[*] Đang đăng xuất để giải phóng phiên làm việc...")
    try:
        session.get(f"{BASE_URL}/web/entry/en/websys/webArch/logout.cgi", timeout=5)
        session.get(f"{BASE_URL}/web/guest/en/websys/webArch/logout.cgi", timeout=5)
        session.cookies.clear()
        time.sleep(1)
        print("  [✓] Giải phóng phiên OK.")
    except Exception as e:
        print(f"  [!] Logout warning: {e}")

def login() -> requests.Session:
    session = requests.Session()
    logout(session)
    time.sleep(1.0)
    
    print("")
    print(f"[2/5] Tiến hành đăng nhập WIM ({IP})...")
    form_url = f"{BASE_URL}/web/guest/en/websys/webArch/authForm.cgi"
    print(f"  -> Lấy form từ: {form_url}")
    resp = session.get(form_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    print(f"  -> Extracted wimToken: '{wim_token}'")
    
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
    print(f"  -> Đang gửi POST login tới {login_url}...")
    resp = session.post(login_url, data=data, headers={"Referer": form_url}, timeout=10)
    
    if "Authentication has failed" in resp.text or "not correct" in resp.text:
        raise RuntimeError("Sai tài khoản hoặc mật khẩu đăng nhập máy in Ricoh!")
    elif "SESSIONFULL" in resp.text or "session limit" in resp.text.lower():
        raise RuntimeError("Đầy phiên đăng nhập (Session Full). Vui lòng đợi 1 phút hoặc reset máy in!")
    else:
        print("  [✓] Đăng nhập thành công vào máy in Ricoh!")
        
    return session

def parse_ajax_address_list(ajax_text: str):
    entries = []
    if not ajax_text: return entries
    raw_entries = re.findall(r"\[([^\]]+)\]", ajax_text)
    for raw in raw_entries:
        fields = [f.strip("'\"") for f in raw.split(",")]
        if len(fields) < 8: continue
        raw_entry_id = fields[0].strip().lstrip("[").strip("'\"")
        reg_no = fields[2].strip("'\"")
        name = fields[3].strip("'\"")
        email = fields[6].strip("'\"")
        folder = fields[7].strip("'\"")
        if name or reg_no:
            entries.append({
                "entry_id": raw_entry_id,
                "registration_no": reg_no,
                "name": name,
                "email_address": email,
                "folder": folder
            })
    return entries

def parse_html_address_list(html_text: str):
    entries = []
    if not html_text: return entries
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html_text, re.DOTALL | re.IGNORECASE)
    for r in rows:
        cols = [re.sub(r'<[^>]+>', '', c).strip() for c in re.findall(r'<td[^>]*>(.*?)</td>', r, re.DOTALL | re.IGNORECASE)]
        if len(cols) < 3: continue
        entry_id = ""
        reg_no = ""
        p_name = ""
        email = ""
        folder = ""
        m_id = re.search(r'entryIndexIn=([0-9]+)', r)
        if m_id: entry_id = m_id.group(1)
        for c in cols:
            if re.match(r'^[0-9]{4,5}$', c): reg_no = c
            elif "@" in c: email = c
            elif "\\" in c or "/" in c: folder = c
            elif c and c != "-" and not p_name and c not in ("User", "Group", "Summary"): p_name = c
        if p_name or reg_no:
            entries.append({
                "entry_id": entry_id,
                "registration_no": reg_no or "001",
                "name": p_name or "ScanUser",
                "email_address": email,
                "folder": folder
            })
    return entries

def delete_scan_by_id_or_name(session: requests.Session, target_id: str, target_name: str):
    print("")
    print("[3/5] Tải danh sách điểm scan từ máy in...")
    list_url = f"{BASE_URL}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    resp = session.get(list_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    
    if not wim_token or "authForm.cgi" in resp.text or "login.cgi" in resp.text:
        print("  [i] Phiên làm việc cần làm mới, tiến hành re-login...")
        session = login()
        resp = session.get(list_url, timeout=10)
        wim_token = extract_wim_token(resp.text)

    if not wim_token:
        raise RuntimeError(f"Không lấy được wimToken từ trang danh sách (HTTP {resp.status_code}, length={len(resp.text)}). Vui lòng kiểm tra lại trạng thái đăng nhập máy in.")

    ajax_url = f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}"
    print(f"  -> Gọi AJAX lấy danh bạ: {ajax_url}")
    ajax_resp = session.get(ajax_url, timeout=10)
    
    print("")
    print(f"[4/5] Tìm kiếm điểm scan khớp (ID: '{target_id}', Tên: '{target_name}')...")
    reg_to_delete = None
    entry_id_to_delete = None
    raw_entries = parse_ajax_address_list(ajax_resp.text)
    if not raw_entries:
        raw_entries = parse_html_address_list(resp.text)
    print(f"  -> Tổng số điểm scan tìm thấy trên máy in: {len(raw_entries)}")
    
    for idx, item in enumerate(raw_entries, 1):
        eid = item["entry_id"]
        reg = item["registration_no"]
        name = item["name"]
        if eid == target_id or reg == target_id or reg.lstrip('0') == target_id.lstrip('0') or (target_name and name.lower() == target_name.lower()):
            reg_to_delete = reg
            entry_id_to_delete = eid
            print(f"  [✓] MATCH! Tìm thấy mục trùng khớp tại dòng #{idx}: Entry ID={eid}, Mã ĐK={reg}, Tên='{name}'")
            break

    if not reg_to_delete and target_id and target_id != "null":
        reg_to_delete = target_id.zfill(5)
        entry_id_to_delete = target_id
        print(f"  [i] Sử dụng Mã ĐK định dạng chuẩn: {reg_to_delete}")

    if not reg_to_delete:
        raise RuntimeError(f"KHÔNG tìm thấy điểm scan nào phù hợp (ID: '{target_id}', Tên: '{target_name}') trên máy in để xóa!")

    print("  -> Lấy wimToken MỚI từ adrsList.cgi...")
    fresh_resp = session.get(list_url, timeout=10)
    fresh_token = extract_wim_token(fresh_resp.text)
    if fresh_token:
        wim_token = fresh_token

    print("")
    print(f"[5/5] Đang gửi POST xóa Mã ĐK '{reg_to_delete}' (Entry ID: {entry_id_to_delete})...")
    delete_url = f"{BASE_URL}/web/entry/en/address/adrsDeleteEntries.cgi"
    
    del_val = str(entry_id_to_delete or reg_to_delete)
    
    form = {
        "wimToken": wim_token,
        "entryIndex": del_val,
        "entryIndexIn": del_val,
        "regiNoListIn": del_val,
        "selectedRegiNoIn": del_val,
        "deleteListIn": del_val,
    }
    
    multipart_form = {k: (None, str(v)) for k, v in form.items()}
    r_del = session.post(delete_url, files=multipart_form, headers={"Referer": list_url}, timeout=15)
    print(f"  -> Đã gửi POST xóa tới {delete_url} (HTTP {r_del.status_code})")
    
    time.sleep(2.5)
    
    # Verification Step
    print("  -> Đang xác minh lại danh bạ máy in sau khi xóa...")
    v_list_resp = session.get(list_url, timeout=10)
    v_token = extract_wim_token(v_list_resp.text) or wim_token
    v_ajax_url = f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={v_token}"
    v_ajax = session.get(v_ajax_url, timeout=10)
    
    still_exists = False
    v_raw_entries = parse_ajax_address_list(v_ajax.text) or parse_html_address_list(v_list_resp.text)
    for item in v_raw_entries:
        v_eid = item["entry_id"]
        v_reg = item["registration_no"]
        v_name = item["name"]
        if v_eid == entry_id_to_delete or v_reg == reg_to_delete or v_reg.lstrip('0') == reg_to_delete.lstrip('0') or (target_name and v_name.lower() == target_name.lower()):
            still_exists = True
            break

    if still_exists:
        raise RuntimeError(f"KHÔNG THỂ XÓA: Đã gửi yêu cầu xóa nhưng Mã ĐK '{reg_to_delete}' (Tên: '{target_name}') vẫn còn trên máy in Ricoh!")

    print(f"  [✓] XÁC MINH THÀNH CÔNG: Đã xóa hoàn toàn điểm scan Mã ĐK '{reg_to_delete}' khỏi máy in Ricoh {IP}!")

sess = None
try:
    sess = login()
    delete_scan_by_id_or_name(sess, TARGET_ID, TARGET_NAME)
except Exception as err:
    print("")
    print(f"[-] LỖI THỰC THI: {err}")
finally:
    if sess:
        logout(sess)
print("==================================================")
