import requests
import urllib3
import re
import sys

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def delete_xerox_scan(printer_ip, display_name):
    print(f"[*] Bat dau xoa danh ba '{display_name}' tren Xerox {printer_ip}...")
    
    # 1. Fetch address book to find contact_id
    ENDPOINT_LIST = f"http://{printer_ip}/dws/dws.cgi"
    headers_list = {"Content-Type": "text/xml; charset=utf-8"}
    
    xml_request_list = """<?xml version="1.0" encoding="UTF-8" ?>
<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
    <env:Body xmlns:xsd="http://www.w3.org/2000/10/XMLSchema">
        <SearchContactByJSONRequest xmlns="http://www.fujifilm.com/fb/2021/04/ssm/management/contact/json">
        </SearchContactByJSONRequest>
    </env:Body>
</env:Envelope>"""

    contact_id = None
    try:
        r = requests.post(ENDPOINT_LIST, headers=headers_list, data=xml_request_list.encode('utf-8'), verify=False, timeout=15)
        if r.status_code == 200:
            match = re.search(r'<JSONData[^>]*>(.*?)</JSONData>', r.text, re.DOTALL)
            if match:
                import html, json
                data = json.loads(html.unescape(match.group(1).strip()))
                contacts = data.get("Contacts", {}).get("Contact", [])
                for c in contacts:
                    name = c.get("DisplayName", "").strip()
                    # So sanh khong phan biet hoa thuong
                    if name.lower() == display_name.lower():
                        contact_id = c.get("Identifier", {}).get("content", "")
                        break
    except Exception as e:
        print(f"[!] Loi khi lay danh ba de xoa: {e}")
        return

    if not contact_id:
        print(f"[-] Khong tim thay danh ba nao co ten '{display_name}' de xoa.")
        return
        
    print(f"[*] Da tim thay '{display_name}' voi ID: {contact_id}. Tien hanh xoa...")

    ENDPOINT_DEL = f"http://{printer_ip}/ssm/Management/Anonymous/Contact"
    headers_del = {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": '"http://www.fujifilm.com/fb/2021/04/ssm/management/contact#DeleteContact"'
    }
    
    xml_request_del = f"""<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <msg:MessageInformation xmlns:msg="http://www.fujifilm.com/fb/2021/04/ssm/management/message">
      <msg:MessageExchangeType>RequestResponse</msg:MessageExchangeType>
      <msg:MessageType>Request</msg:MessageType>
      <msg:Action>http://www.fujifilm.com/fb/2021/04/ssm/management/contact#DeleteContact</msg:Action>
      <msg:From>
        <msg:Address>http://www.fujifilm.com/fb/2021/04/ssm/management/soap/epr/client</msg:Address>
        <msg:ReferenceParameters/>
      </msg:From>
    </msg:MessageInformation>
  </soap:Header>
  <soap:Body>
    <ct:DeleteContact xmlns:ct="http://www.fujifilm.com/fb/2021/04/ssm/management/contact">
      <ct:DataSource>Local</ct:DataSource>
      <ct:Contacts>
        <ct:ContactIdentifier>
          <ct:Identifier>{contact_id}</ct:Identifier>
        </ct:ContactIdentifier>
      </ct:Contacts>
      <ct:Responds>
        <cmn:Respond xmlns:cmn="http://www.fujifilm.com/fb/2021/04/ssm/management/common">Identifier</cmn:Respond>
      </ct:Responds>
    </ct:DeleteContact>
  </soap:Body>
</soap:Envelope>"""

    success = False
    try:
        r2 = requests.post(ENDPOINT_DEL, headers=headers_del, data=xml_request_del.encode('utf-8'), verify=False, timeout=10)
        if r2.status_code == 200:
            print(f"[+] Xoa thanh cong '{display_name}' (ID {contact_id})!")
            success = True
        else:
            print(f"[!] Loi HTTP khi xoa {r2.status_code}")
    except Exception as e:
        print(f"[!] Loi khi thuc hien lenh xoa: {e}")

    if success:
        # Auto-trigger list sync
        try:
            import xerox_list_scan
            xerox_list_scan.setup_xerox_list(printer_ip)
        except Exception as e:
            pass

IP = ""
NAME = ""
if globals().get('context') and isinstance(globals()['context'], dict):
    ctx = globals()['context']
    if ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip'):
        IP = str(ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip')).strip()
    if ctx.get('name') or ctx.get('target_name') or ctx.get('scan_username'):
        NAME = str(ctx.get('name') or ctx.get('target_name') or ctx.get('scan_username')).strip()

try:
    if IP and NAME:
        delete_xerox_scan(IP, NAME)
    else:
        print("[-] Thieu thong tin IP hoac Name tu context de xoa!")
except Exception as err:
    print(f"\n[-] LOI THUC THI: {err}")
    sys.exit(1)
