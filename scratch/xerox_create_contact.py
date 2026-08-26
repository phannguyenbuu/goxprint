import requests
import urllib3
import re
import sys

# Khắc phục lỗi in tiếng Việt trên console của Windows
sys.stdout.reconfigure(encoding='utf-8')

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

PRINTER_URL = "http://localhost:8080"
ENDPOINT = f"{PRINTER_URL}/ssm/Management/Anonymous/Contact"

def create_addressbook_contact(display_name, ftp_addr, ftp_port, ftp_user, ftp_pass, ftp_path):
    print(f"[*] Dang tao danh ba moi voi ten: {display_name}...")
    
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
              <ct:Address xml:space="preserve">{ftp_addr}</ct:Address>
              <ct:Port>{ftp_port}</ct:Port>
              <ct:UserName xml:space="preserve">{ftp_user}</ct:UserName>
              <ct:Password xml:space="preserve">{ftp_pass}</ct:Password>
              <ct:Path xml:space="preserve">{ftp_path}</ct:Path>
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

    try:
        r = requests.post(ENDPOINT, headers=headers, data=xml_request.encode('utf-8'), verify=False, timeout=10)
        
        if r.status_code == 200:
            print("[+] Yeu cau gui thanh cong!")
            match_id = re.search(r'<Identifier[^>]*>(\d+)</Identifier>', r.text)
            if match_id:
                print(f"[+] Tao thanh cong! ID cua '{display_name}' la: {match_id.group(1)}")
            else:
                print("[-] Tao danh ba thanh cong nhung khong parse duoc ID tra ve.")
        else:
            print(f"[!] Loi HTTP {r.status_code}")
            print("Chi tiet:", r.text[:300])
            
    except Exception as e:
        print(f"[!] Loi khi ket noi: {e}")

def delete_addressbook_contact(contact_id):
    print(f"\n[*] Dang xoa danh ba co ID: {contact_id}...")
    
    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": '"http://www.fujifilm.com/fb/2021/04/ssm/management/contact#DeleteContact"'
    }
    
    xml_request = f"""<?xml version="1.0" encoding="UTF-8"?>
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

    try:
        r = requests.post(ENDPOINT, headers=headers, data=xml_request.encode('utf-8'), verify=False, timeout=10)
        
        if r.status_code == 200:
            print(f"[+] Xoa thanh cong ID {contact_id}!")
        else:
            print(f"[!] Loi HTTP {r.status_code}")
            print("Chi tiet:", r.text[:300])
            
    except Exception as e:
        print(f"[!] Loi khi ket noi: {e}")

def update_addressbook_contact(contact_id, dest_id, new_ftp_addr):
    print(f"\n[*] Dang cap nhat dia chi FTP cho danh ba co ID: {contact_id}...")
    
    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": '"http://www.fujifilm.com/fb/2021/04/ssm/management/contact#SetContact"'
    }
    
    xml_request = f"""<?xml version="1.0" encoding="UTF-8"?>
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
              <ct:Address xml:space="preserve">{new_ftp_addr}</ct:Address>
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

    try:
        r = requests.post(ENDPOINT, headers=headers, data=xml_request.encode('utf-8'), verify=False, timeout=10)
        
        if r.status_code == 200:
            print(f"[+] Cap nhat thanh cong cho ID {contact_id}!")
        else:
            print(f"[!] Loi HTTP {r.status_code}")
            print("Chi tiet:", r.text[:300])
            
    except Exception as e:
        print(f"[!] Loi khi ket noi: {e}")

if __name__ == "__main__":
    # Test tao moi
    # create_addressbook_contact(...)
    
    # Test xoa
    # delete_addressbook_contact("5")
    
    # Test cap nhat
    # Thay contact_id và dest_id thanh ID cua tai khoan 'buu' neu no khac nhe
    update_addressbook_contact(contact_id="4", dest_id="024998", new_ftp_addr="192.168.1.15")
