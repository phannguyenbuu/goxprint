import requests
import json
from agent.services.api_client import Printer
from agent.modules.ricoh.service import RicohService

svc = RicohService(None)
printer_ip = "192.168.1.226"
username = "admin"
password = "777"

printer = Printer(name="Test", ip=printer_ip, user=username, password=password, printer_type="ricoh")

try:
    session = requests.Session()
    
    # Sử dụng đúng hàm native _login của GoxAgent (có fallback)
    used_u, used_p = svc._login(session, printer, credential_candidates=[(username, password)])
    
    # Bắt chước logic native: Kiểm tra chéo xem pass login thành công có khớp với pass nhập vào không
    if used_u == username and used_p == password:
        print("[SUCCESS] Đăng nhập Ricoh thành công")
    elif not username and not password:
         print("[SUCCESS] Đăng nhập Ricoh thành công (Quyền mặc định)")
    else:
        print(f"[-] LỖI: Tài khoản không đúng. (Máy photocopy đang dùng tài khoản: {used_u}/****)")
        
    try:
        svc._logout(session, printer)
    except:
        pass
        
except Exception as e:
    trace = getattr(printer, "_last_verify_trace", "")
    error_reason = str(e)
    if trace and trace not in error_reason:
        error_reason += f" | Debug: {trace}"
    print(f"[-] LỖI: Xác thực đăng nhập thất bại: {error_reason}")
