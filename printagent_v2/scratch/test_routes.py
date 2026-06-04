import sys
import os
import requests
import re

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from agent.services.api_client import Printer
from agent.modules.ricoh.service import RicohService

def test_routes():
    ip = "192.168.1.226"
    user = "admin"
    pw = ""
    
    printer = Printer(id=1, name="TestPrinter", ip=ip, user=user, password=pw)
    service = RicohService(api_client=None)
    
    print("Logging into copier...")
    session = service.create_http_client(printer, authenticated=True)
    print("Logged in successfully.")
    
    # We will test entry 25 (which exists)
    entry_id = "25"
    reg_no = "00001"
    reg_no_clean = "1"
    
    entry_id_54 = "54"
    reg_no_54 = "00171"
    reg_no_54_clean = "171"
    
    # First, get list page to extract a valid wimToken
    list_url = f"http://{ip}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    print(f"Fetching list page: GET {list_url}")
    resp = session.get(list_url, timeout=10)
    wim_token = service._extract_wim_token(resp.text) or service._extract_hidden_inputs(resp.text).get("wimToken", "")
    print(f"Extracted wimToken: {wim_token}")
    
    # We will test various routes
    routes = [
        # 1. Wizard GET MODUSER with Registration Numbers (exact parameters from browser Edit() function)
        {
            "name": "Wizard GET MODUSER + wimToken (entryIndexIn=00001 / reg_no)",
            "method": "GET",
            "url": f"http://{ip}/web/entry/en/address/adrsGetUserWizard.cgi?mode=MODUSER&outputSpecifyModeIn=PROGRAMMED&entryIndexIn={reg_no}&wimToken={wim_token}",
            "data": None
        },
        {
            "name": "Wizard GET MODUSER + wimToken (entryIndexIn=1 / reg_no clean)",
            "method": "GET",
            "url": f"http://{ip}/web/entry/en/address/adrsGetUserWizard.cgi?mode=MODUSER&outputSpecifyModeIn=PROGRAMMED&entryIndexIn={reg_no_clean}&wimToken={wim_token}",
            "data": None
        },
        {
            "name": "Wizard GET MODUSER + wimToken (entryIndexIn=00171 / reg_no_54)",
            "method": "GET",
            "url": f"http://{ip}/web/entry/en/address/adrsGetUserWizard.cgi?mode=MODUSER&outputSpecifyModeIn=PROGRAMMED&entryIndexIn={reg_no_54}&wimToken={wim_token}",
            "data": None
        },
        {
            "name": "Wizard GET MODUSER + wimToken (entryIndexIn=171 / reg_no_54 clean)",
            "method": "GET",
            "url": f"http://{ip}/web/entry/en/address/adrsGetUserWizard.cgi?mode=MODUSER&outputSpecifyModeIn=PROGRAMMED&entryIndexIn={reg_no_54_clean}&wimToken={wim_token}",
            "data": None
        },
        # 2. Wizard POST MODUSER with Registration Numbers
        {
            "name": "Wizard POST MODUSER (entryIndexIn=00001 / reg_no)",
            "method": "POST",
            "url": f"http://{ip}/web/entry/en/address/adrsGetUserWizard.cgi",
            "data": {
                "mode": "MODUSER",
                "outputSpecifyModeIn": "PROGRAMMED",
                "entryIndexIn": reg_no,
                "wimToken": wim_token
            }
        },
        {
            "name": "Wizard POST MODUSER (entryIndexIn=00171 / reg_no_54)",
            "method": "POST",
            "url": f"http://{ip}/web/entry/en/address/adrsGetUserWizard.cgi",
            "data": {
                "mode": "MODUSER",
                "outputSpecifyModeIn": "PROGRAMMED",
                "entryIndexIn": reg_no_54,
                "wimToken": wim_token
            }
        },
        # 3. Non-wizard/Detail GET (adrsGetUser.cgi) with Registration Numbers
        {
            "name": "Detail GET SETTINGS (entryIndexIn=00001 / reg_no)",
            "method": "GET",
            "url": f"http://{ip}/web/entry/en/address/adrsGetUser.cgi?entryIndexIn={reg_no}&outputSpecifyModeIn=SETTINGS&wimToken={wim_token}",
            "data": None
        },
        {
            "name": "Detail GET SETTINGS (entryIndexIn=00171 / reg_no_54)",
            "method": "GET",
            "url": f"http://{ip}/web/entry/en/address/adrsGetUser.cgi?entryIndexIn={reg_no_54}&outputSpecifyModeIn=SETTINGS&wimToken={wim_token}",
            "data": None
        },
        # 4. Old Wizard GET with CHANGEUSER mode to verify failure
        {
            "name": "Wizard GET modeIn=CHANGEUSER (entryIndexIn=00001)",
            "method": "GET",
            "url": f"http://{ip}/web/entry/en/address/adrsGetUserWizard.cgi?entryIndexIn={reg_no}&modeIn=CHANGEUSER",
            "data": None
        }
    ]
    
    for r in routes:
        print("\n" + "="*50)
        print(f"Testing: {r['name']}")
        print(f"URL: {r['url']}")
        try:
            if r["method"] == "GET":
                res = session.get(r["url"], timeout=10)
            else:
                res = session.post(r["url"], data=r["data"], headers={"Referer": list_url}, timeout=10)
            
            print(f"HTTP Status: {res.status_code}")
            print(f"Response Length: {len(res.text or '')} chars")
            
            # Check for error indicator in HTML
            is_login = "authForm.cgi" in res.text or "login.cgi" in res.text or "Login User Name" in res.text
            is_err_page = "unexpected error has occurred" in res.text or "errorMessage" in res.text
            has_wizard_fields = any(x in res.text for x in ["folderProtocolIn", "folderServerNameIn", "folderPathNameIn", "folderPortNoIn"])
            
            print(f"Is Login Page: {is_login}")
            print(f"Is Copier Error Page: {is_err_page}")
            print(f"Has Folder/Port fields: {has_wizard_fields}")
            
            if has_wizard_fields:
                port_m = re.search(r'name=["\']folderPortNoIn["\'][^>]*value=["\'](\d+)["\']', res.text, re.I)
                if not port_m:
                    port_m = re.search(r'value=["\'](\d+)["\'][^>]*name=["\']folderPortNoIn["\']', res.text, re.I)
                port = int(port_m.group(1)) if port_m else None
                print(f"Extracted folder port: {port}")
                
                server_m = re.search(r'name=["\']folderServerNameIn["\'][^>]*value=["\']([^"\']*)["\']', res.text, re.I)
                server = server_m.group(1).strip() if server_m else None
                print(f"Extracted folder server: {server}")
                
        except Exception as e:
            print(f"Request failed: {e}")

if __name__ == "__main__":
    test_routes()
