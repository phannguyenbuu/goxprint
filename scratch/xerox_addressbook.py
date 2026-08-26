import requests
import json
import urllib3
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

PRINTER_URL = "http://localhost:8080"
# Thông thường endpoint cho SOAP của Xerox/Fujifilm là /dws/dws.cgi hoặc /WSG. 
# Bạn hãy kiểm tra lại Request URL trong tab Headers nhé.
ENDPOINT = f"{PRINTER_URL}/dws/dws.cgi" 

def get_address_book():
    print("[*] Đang lấy danh bạ (Address Book)...")
    
    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        # "SOAPAction": '""'  # Bỏ comment nếu máy in báo lỗi thiếu SOAPAction
    }
    
    # Dựa vào Response bạn gửi, tôi đoán Request gửi đi sẽ có dạng như sau.
    # Nếu máy in báo lỗi, bạn vào tab "Payload" (hoặc "Request Payload") ở F12 để copy nguyên văn đè vào đây nhé.
    xml_request = """<?xml version="1.0" encoding="UTF-8" ?>
<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
    <env:Body xmlns:xsd="http://www.w3.org/2000/10/XMLSchema">
        <SearchContactByJSONRequest xmlns="http://www.fujifilm.com/fb/2021/04/ssm/management/contact/json">
        </SearchContactByJSONRequest>
    </env:Body>
</env:Envelope>"""

    try:
        r = requests.post(ENDPOINT, headers=headers, data=xml_request.encode('utf-8'), verify=False, timeout=10)
        
        if r.status_code == 200:
            # 1. Bóc tách cục JSON nằm giữa thẻ <JSONData> và </JSONData>
            match = re.search(r'<JSONData[^>]*>(.*?)</JSONData>', r.text, re.DOTALL)
            
            if match:
                json_str = match.group(1)
                # Parse JSON
                data = json.loads(json_str)
                
                print("\n--- DANH BẠ ---")
                contacts = data.get("Contacts", {}).get("Contact", [])
                
                for c in contacts:
                    contact_id = c.get("Identifier", {}).get("content", "Unknown")
                    name = c.get("DisplayName", "Unknown")
                    dest_list = c.get("Destination", [])
                    
                    print(f"👤 [ID: {contact_id}] Tên: {name}")
                    for d in dest_list:
                        dest_id = d.get("Identifier", {}).get("content", "Unknown")
                        dest_type = d.get("Type")
                        
                        if dest_type == "Server":
                            server_info = d.get("Server", {})
                            addr = server_info.get("Address", "")
                            vol = server_info.get("Volume", "")
                            print(f"   [SMB/FTP] [DestID: {dest_id}] Dia chi: \\\\{addr}\\{vol}")
                            
                        elif dest_type == "Email":
                            # Giả định cấu trúc email (bạn có thể tự in ra d để xem nếu cần)
                            email = d.get("Email", {}).get("Address", "")
                            print(f"   [Email] {email}")
                            
                        else:
                            print(f"   [{dest_type}]")
                print("-----------------\n")
            else:
                print("[!] Không tìm thấy thẻ <JSONData> trong kết quả trả về!")
        else:
            print(f"[!] Lỗi HTTP {r.status_code}")
            
    except Exception as e:
        print(f"[!] Lỗi khi kết nối: {e}")

if __name__ == "__main__":
    get_address_book()
