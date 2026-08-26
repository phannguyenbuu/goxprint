import requests
import urllib3

# Bỏ qua cảnh báo chứng chỉ SSL nếu máy in dùng HTTPS tự cấp
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# --- THAY ĐỔI CÁC THÔNG SỐ DƯỚI ĐÂY ---
# Đổi thành IP thực của Xerox hoặc localhost:8080 nếu dùng SSH Tunnel
PRINTER_URL = "http://localhost:8080"
# Endpoint thực tế nhận XML của Xerox (Thường là /dws/dws.cgi, /WSG, v.v. - Cần F12 Network để lấy)
ENDPOINT = f"{PRINTER_URL}/dws/dws.cgi" 

def get_address_book():
    print("[*] Đang gọi SOAP API lấy Address Book...")
    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        # Một số máy in có thể yêu cầu SOAPAction header
        # "SOAPAction": '"http://schemas.xmlsoap.org/wsdl/AddressBook#Get"' 
    }
    
    # Cần thay bằng chuỗi XML chính xác mà trình duyệt gửi đi
    xml_payload = """<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
   <soap:Body>
      <GetAddressBookRequest xmlns="http://www.xerox.com/api/addressbook">
         <!-- Các tham số (nếu có) -->
      </GetAddressBookRequest>
   </soap:Body>
</soap:Envelope>"""

    try:
        r = requests.post(ENDPOINT, data=xml_payload.encode("utf-8"), headers=headers, verify=False, timeout=10)
        print("STATUS:", r.status_code)
        print("TEXT:", r.text[:500]) # In 500 ký tự đầu của response XML
    except Exception as e:
        print(f"Lỗi: {e}")

def get_counter_status():
    print("\n[*] Đang gọi SOAP API lấy Counter/Status...")
    headers = {
        "Content-Type": "text/xml; charset=utf-8",
    }
    
    xml_payload = """<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
   <soap:Body>
      <GetCountersRequest xmlns="http://www.xerox.com/api/counters">
      </GetCountersRequest>
   </soap:Body>
</soap:Envelope>"""

    try:
        r = requests.post(ENDPOINT, data=xml_payload.encode("utf-8"), headers=headers, verify=False, timeout=10)
        print("STATUS:", r.status_code)
        print("TEXT:", r.text[:500])
    except Exception as e:
        print(f"Lỗi: {e}")

if __name__ == "__main__":
    get_address_book()
    get_counter_status()
