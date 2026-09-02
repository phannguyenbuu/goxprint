import requests
import re
import base64
import json
import sys
import time

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"
BASE_URL = f"http://{IP}"

print("==================================================")
print(f"  [RICOH EXEC] QUÉT DANH BẠ SCAN PHOTOCOPY - IP: {IP}")
print("==================================================")
print(f"[1/4] Khởi tạo cấu hình: IP={IP}, USER={USER}")

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


# __RICOH_LOGIN__
# __RICOH_LIST__

def fetch_list():
    sess = login()
    try:
        print(f"[3/4] Truy cập danh mục 'To Address List' từ Ricoh {IP}...")
        list_url = f"{BASE_URL}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
        resp = sess.get(list_url, timeout=10)
        html_text = resp.text
        wim_token = extract_wim_token(html_text)
        
        if not wim_token or "authForm.cgi" in html_text:
            print("  [i] Thử lại đăng nhập...")
            sess = login()
            resp = sess.get(list_url, timeout=10)
            html_text = resp.text
            wim_token = extract_wim_token(html_text)

        if not wim_token or "authForm.cgi" in html_text:
            raise RuntimeError(f"Phiên đăng nhập Ricoh WIM hết hạn hoặc không có quyền xem danh bạ (IP={IP})!")

        entries = []
        if wim_token:
            ajax_url = f"{BASE_URL}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}"
            ajax_resp = sess.get(ajax_url, timeout=10)
            if ajax_resp.status_code == 200 and "[" in ajax_resp.text:
                entries = parse_ajax_address_list(ajax_resp.text)

        if not entries and html_text:
            print("  [i] Parse danh bạ từ HTML table...")
            entries = parse_html_address_list(html_text)
            
        for entry in entries:
            if "folder" in entry:
                entry["folder"] = format_ricoh_folder(entry["folder"])

        print(f"[4/4] TỔNG CỘNG LẤY ĐƯỢC: {len(entries)} MỤC TRÊN MÁY PHOTOCOPY RICOH:")
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

    finally:
        logout(sess)
        print("  [✓] Đã hoàn tất và đăng xuất.")


try:
    fetch_list()
except Exception as err:
    print("")
    print(f"[-] LỖI THỰC THI QUÉT DANH BẠ: {err}")
    output_payload = {
        "status": "error",
        "error": str(err),
        "count": 0,
        "address_list": []
    }
    print(f"__ADDRESS_BOOK_JSON_START__\n{json.dumps(output_payload, ensure_ascii=False)}\n__ADDRESS_BOOK_JSON_END__")
    sys.exit(1)
print("==================================================")