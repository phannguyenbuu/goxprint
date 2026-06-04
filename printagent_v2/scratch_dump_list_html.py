import sys
import os
import requests

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from agent.services.api_client import Printer
from agent.modules.ricoh.service import RicohService

def main():
    ip = "192.168.1.226"
    user = "admin"
    pw = ""
    
    printer = Printer(id=1, name="TestPrinter", ip=ip, user=user, password=pw)
    service = RicohService(api_client=None)
    
    session = service.create_http_client(printer, authenticated=True)
    list_url = f"http://{ip}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    print(f"Fetching: GET {list_url}")
    resp = session.get(list_url, timeout=10)
    print(f"Status Code: {resp.status_code}")
    print(f"Response Length: {len(resp.text)} chars")
    
    html = resp.text
    print("Contains 'SESSIONFULL':", "SESSIONFULL" in html)
    print("Contains 'exceeds the maximum allowable limit':", "exceeds the maximum allowable limit" in html)
    
    with open("temp_adrsList.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Wrote HTML to temp_adrsList.html")
    
    # Let's also check if we can log out
    service._reset_web_session(session, printer)
    session.close()
    print("Session reset and closed.")

if __name__ == "__main__":
    main()
