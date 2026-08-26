import requests
import urllib3
import re
import sys

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def get_local_ip(printer_ip):
    bridge_obj = globals().get('bridge') or locals().get('bridge')
    if bridge_obj and hasattr(bridge_obj, 'get_ftp_server_ip'):
        return bridge_obj.get_ftp_server_ip(printer_ip)
    
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect((printer_ip if printer_ip else "8.8.8.8", 80))
        ip = s.getsockname()[0]
    except:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

def update_xerox_scan(printer_ip, display_name):
    print(f"[*] Bat dau cap nhat danh ba '{display_name}' tren Xerox {printer_ip}...")
    local_ip = get_local_ip(printer_ip)
    
    bridge_obj = globals().get('bridge') or locals().get('bridge')
    ftp_port = "2130"
    ftp_user = "goxprint"
    ftp_password = "goxprint"
    if bridge_obj:
        if hasattr(bridge_obj, 'ftp_port'):
            ftp_port = str(bridge_obj.ftp_port)
        if hasattr(bridge_obj, 'ftp_user'):
            ftp_user = bridge_obj.ftp_user
        if hasattr(bridge_obj, 'ftp_password'):
            ftp_password = bridge_obj.ftp_password

    # 1. Fetch address book to find contact_id and dest_id
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
    dest_id = None
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
                    if name.lower() == display_name.lower():
                        contact_id = c.get("Identifier", {}).get("content", "")
                        dest_list = c.get("Destination", [])
                        for d in dest_list:
                            if d.get("Type") == "Server":
                                dest_id = d.get("Identifier", {}).get("content", "")
                                break
                        break
    except Exception as e:
        print(f"[!] Loi khi lay danh ba de cap nhat: {e}")
        return

    if not contact_id:
        print(f"[-] Khong tim thay danh ba nao co ten '{display_name}' de cap nhat.")
        return
    if not dest_id:
        print(f"[-] Danh ba '{display_name}' chua co Destination (Server FTP) nao de cap nhat.")
        # We could try to create one, but usually it should exist if they want to update it.
        return
        
    print(f"[*] Da tim thay '{display_name}' voi ID: {contact_id}, Dest ID: {dest_id}. Tien hanh cap nhat FTP...")

    ENDPOINT_UPD = f"http://{printer_ip}/ssm/Management/Anonymous/Contact"
    headers_upd = {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": '"http://www.fujifilm.com/fb/2021/04/ssm/management/contact#SetContact"'
    }
    
    xml_request_upd = f"""<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <msg:MessageInformation xmlns:msg="http://www.fujifilm.com/fb/2021/04/ssm/management/message">
      <msg:MessageExchangeType>RequestResponse</msg:MessageExchangeType>
      <msg:MessageType>Request</msg:MessageType>
      <msg:Action>http://www.fujifilm.com/fb/2021/04/ssm/management/contact#SetContact</msg:Action>
      <msg:From>
        <msg:Address>http://www.fujifilm.com/fb/2021/04/ssm/management/soap/epr/client</msg:Address>
        <msg:ReferenceParameters/>
      </msg:From>
    </msg:MessageInformation>
  </soap:Header>
  <soap:Body>
    <ct:SetContact xmlns:ct="http://www.fujifilm.com/fb/2021/04/ssm/management/contact">
      <ct:DataSource>Local</ct:DataSource>
      <ct:Contacts>
        <ct:Contact>
          <ct:Identifier>{contact_id}</ct:Identifier>
          <ct:Key xml:space="preserve"></ct:Key>
          <ct:Destination>
            <ct:Identifier>{dest_id}</ct:Identifier>
            <ct:Favorite>false</ct:Favorite>
            <ct:Server>
              <ct:Type>FTP</ct:Type>
              <ct:Address xml:space="preserve">{local_ip}</ct:Address>
              <ct:Port>{ftp_port}</ct:Port>
              <ct:UserName xml:space="preserve">{ftp_user}</ct:UserName>
              <ct:Password xml:space="preserve">{ftp_password}</ct:Password>
              <ct:Path xml:space="preserve">{display_name}</ct:Path>
            </ct:Server>
          </ct:Destination>
        </ct:Contact>
      </ct:Contacts>
      <ct:Responds>
        <cmn:Respond xmlns:cmn="http://www.fujifilm.com/fb/2021/04/ssm/management/common">#DESCENDANT</cmn:Respond>
      </ct:Responds>
    </ct:SetContact>
  </soap:Body>
</soap:Envelope>"""

    success = False
    try:
        r2 = requests.post(ENDPOINT_UPD, headers=headers_upd, data=xml_request_upd.encode('utf-8'), verify=False, timeout=15)
        if r2.status_code == 200:
            print(f"[+] Cap nhat thanh cong '{display_name}' (ID {contact_id})!")
            success = True
        else:
            print(f"[!] Loi HTTP khi cap nhat {r2.status_code}")
    except Exception as e:
        print(f"[!] Loi khi thuc hien lenh cap nhat: {e}")

    if success:
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
        update_xerox_scan(IP, NAME)
    else:
        print("[-] Thieu thong tin IP hoac Name tu context de cap nhat!")
except Exception as err:
    print(f"\n[-] LOI THUC THI: {err}")
    sys.exit(1)
