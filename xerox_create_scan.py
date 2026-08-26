import requests
import urllib3
import re
import sys
import json
from datetime import datetime

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

def create_xerox_scan(printer_ip, display_name):
    print(f"[*] Bat dau tao danh ba cho '{display_name}' tren Xerox {printer_ip}...")
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

    ENDPOINT = f"http://{printer_ip}/ssm/Management/Anonymous/Contact"
    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": '"http://www.fujifilm.com/fb/2021/04/ssm/management/contact#AddContact"'
    }
    
    xml_request = f"""<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <msg:MessageInformation xmlns:msg="http://www.fujifilm.com/fb/2021/04/ssm/management/message">
      <msg:MessageExchangeType>RequestResponse</msg:MessageExchangeType>
      <msg:MessageType>Request</msg:MessageType>
      <msg:Action>http://www.fujifilm.com/fb/2021/04/ssm/management/contact#AddContact</msg:Action>
      <msg:From>
        <msg:Address>http://www.fujifilm.com/fb/2021/04/ssm/management/soap/epr/client</msg:Address>
        <msg:ReferenceParameters/>
      </msg:From>
    </msg:MessageInformation>
  </soap:Header>
  <soap:Body>
    <ct:AddContact xmlns:ct="http://www.fujifilm.com/fb/2021/04/ssm/management/contact">
      <ct:DataSource>Local</ct:DataSource>
      <ct:Contacts>
        <ct:Contact>
          <ct:Type>Destination</ct:Type>
          <ct:Favorite>false</ct:Favorite>
          <ct:DisplayName xml:space="preserve">{display_name}</ct:DisplayName>
          <ct:SurName xml:space="preserve"></ct:SurName>
          <ct:GivenName xml:space="preserve"></ct:GivenName>
          <ct:CompanyName xml:space="preserve"></ct:CompanyName>
          <ct:Key xml:space="preserve"></ct:Key>
          <ct:Destination>
            <ct:Type>Server</ct:Type>
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
    </ct:AddContact>
  </soap:Body>
</soap:Envelope>"""

    success = False
    try:
        r = requests.post(ENDPOINT, headers=headers, data=xml_request.encode('utf-8'), verify=False, timeout=15)
        if r.status_code == 200:
            match_id = re.search(r'<Identifier[^>]*>(\d+)</Identifier>', r.text)
            if match_id:
                new_id = match_id.group(1)
                print(f"[+] Tao thanh cong! ID cua '{display_name}' la: {new_id}")
                success = True
            else:
                print("[-] Tao danh ba thanh cong nhung khong lay duoc ID.")
        else:
            print(f"[!] Loi HTTP {r.status_code}")
            print("Chi tiet:", r.text[:300])
    except Exception as e:
        print(f"[!] Loi khi ket noi: {e}")

    if success:
        # Auto-trigger list sync
        try:
            import xerox_list_scan
            xerox_list_scan.setup_xerox_list(printer_ip)
        except Exception as e:
            print(f"  [!] Khong the tu dong load lai danh sach (auto-sync): {e}")

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
        create_xerox_scan(IP, NAME)
    else:
        print("[-] Thieu thong tin IP hoac Name tu context!")
except Exception as err:
    print(f"\n[-] LOI THUC THI: {err}")
    sys.exit(1)
