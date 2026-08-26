import requests
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

PRINTER_URL = "http://localhost:8080"

def get_billing_counter():
    print("[*] Đang gọi API lấy Counter...")
    
    # URL này có thể cần thêm prefix (ví dụ /wui/api/ hoặc /home/). 
    # Nếu chạy bị lỗi 404, bạn hãy nhìn vào tab Headers -> mục "Request URL" để copy đường dẫn chính xác nhất nhé.
    endpoint = f"{PRINTER_URL}/billing-counter?methodName=GET"
    
    # Xerox thường yêu cầu một số Header cơ bản, có thể thêm "X-Requested-With": "XMLHttpRequest" nếu cần
    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
    }

    try:
        # Gửi GET request (vì tham số là methodName=GET)
        r = requests.get(endpoint, headers=headers, verify=False, timeout=10)
        
        if r.status_code == 200:
            data = r.json()
            print("--- KẾT QUẢ BỘ ĐẾM ---")
            
            counters = data.get("UsageCounters", [])
            for c in counters:
                name = c.get("DomesticName")
                count = c.get("Count")
                
                # Format tên cho dễ nhìn
                if name == "PRINT_TOTAL_IMPRESSION":
                    print(f"Tổng in (Print Total): {count}")
                elif name == "COPY_TOTAL_IMPRESSION":
                    print(f"Tổng copy (Copy Total): {count}")
                elif name == "SCAN_TOTAL_IMPRESSION":
                    print(f"Tổng scan (Scan Total): {count}")
                elif name == "SCAN_TOTAL_COLOR_IMPRESSION":
                    print(f"Scan màu (Scan Color): {count}")
                elif name == "SCAN_TOTAL_BW_IMPRESSION":
                    print(f"Scan trắng đen (Scan B/W): {count}")
                else:
                    print(f"{name}: {count}")
            
            print("----------------------")
        else:
            print(f"[!] Lỗi HTTP {r.status_code}: {r.text}")
            
    except json.JSONDecodeError:
        print("[!] Không thể đọc được JSON. Máy in trả về:", r.text[:200])
    except Exception as e:
        print(f"[!] Lỗi khi kết nối: {e}")

if __name__ == "__main__":
    get_billing_counter()
