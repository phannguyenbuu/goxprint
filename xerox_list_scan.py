import requests
import urllib3
import re
import json
import sys
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

def setup_xerox_list(printer_ip):
    print(f"[*] Bat dau lay Address Book cho Xerox {printer_ip}...")
    local_ip = get_local_ip(printer_ip)
    
    bridge_obj = globals().get('bridge') or locals().get('bridge')
    ftp_port = "2130"
    if bridge_obj and hasattr(bridge_obj, 'ftp_port'):
        ftp_port = str(bridge_obj.ftp_port)

    ENDPOINT = f"http://{printer_ip}/dws/dws.cgi"
    headers = {
        "Content-Type": "text/xml; charset=utf-8",
    }
    
    xml_request = """<?xml version="1.0" encoding="UTF-8" ?>
<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
    <env:Body xmlns:xsd="http://www.w3.org/2000/10/XMLSchema">
        <SearchContactByJSONRequest xmlns="http://www.fujifilm.com/fb/2021/04/ssm/management/contact/json">
        </SearchContactByJSONRequest>
    </env:Body>
</env:Envelope>"""

    entries = []
    try:
        r = requests.post(ENDPOINT, headers=headers, data=xml_request.encode('utf-8'), verify=False, timeout=15)
        if r.status_code == 200:
            match = re.search(r'<JSONData[^>]*>(.*?)</JSONData>', r.text, re.DOTALL)
            if match:
                json_str = match.group(1).strip()
                import html
                json_str = html.unescape(json_str)
                data = json.loads(json_str)
                
                contacts = data.get("Contacts", {}).get("Contact", [])
                
                for c in contacts:
                    contact_id = c.get("Identifier", {}).get("content", "")
                    name = c.get("DisplayName", "").strip()
                    dest_list = c.get("Destination", [])
                    
                    for d in dest_list:
                        dest_type = d.get("Type")
                        
                        if dest_type == "Server":
                            server_info = d.get("Server", {})
                            protocol = server_info.get("Type", "FTP")
                            addr = server_info.get("Address", "")
                            port = server_info.get("Port", "")
                            vol = server_info.get("Path", "") or server_info.get("Volume", "")
                            
                            if protocol == "FTP":
                                full_url = f"ftp://{addr}:{port}/{vol}/"
                            else:
                                full_url = (chr(92) * 2) + addr + chr(92) + vol + chr(92)

                            entries.append({
                                "entry_id": contact_id,
                                "name": name,
                                "registration_no": contact_id,
                                "email_address": f"{name}@scan.local",
                                "folder": full_url,
                                "folder_path": full_url,
                                "physical_path": full_url,
                                "protocol": protocol,
                                "server_host": addr,
                                "folder_port_no": port,
                                "path_on_folder": f"/{vol}/" if vol else ""
                            })
                            # Only parse the first server destination
                            break
                            
            else:
                print("[!] Khong tim thay <JSONData> trong ket qua.")
        else:
            print(f"[!] Loi HTTP {r.status_code}")
    except Exception as e:
        print(f"[!] Loi khi ket noi lay danh ba: {e}")

    print(f"\n[+] Hoan thanh dong bo {len(entries)} Contacts.")
    summary_name = f"Users: {len(entries)}, Groups: 0, User Codes: 0"
    addr_list = [{
        "type": "Summary", "registration_no": "-", "name": summary_name,
        "user_code": "-", "date_last_used": "-", "email_address": "-", "folder": "-",
        "entry_id": "", "physical_path": "", "protocol": "", "server_host": "",
        "folder_port_no": "", "path_on_folder": ""
    }] + entries

    final_result = {
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "address_list": addr_list
    }

    if bridge_obj:
        try:
            real_mac = ""
            try:
                local_printers = bridge_obj._load_local_printers_json() or []
                for p_item in local_printers:
                    p_item_ip = str(p_item.get("ip") or "").strip()
                    if p_item_ip == printer_ip or (printer_ip and printer_ip in p_item_ip):
                        real_mac = str(p_item.get("mac_address") or p_item.get("mac_id") or "").strip().upper().replace("-", ":")
                        break
            except Exception: pass

            try:
                from agent.models import Printer as AgentPrinter
                p = AgentPrinter(ip=printer_ip, mac_address=real_mac, name="XeroxPrinter", printer_type="fujifilm")
            except Exception:
                from types import SimpleNamespace
                p = SimpleNamespace(ip=printer_ip, mac_address=real_mac, name="XeroxPrinter", printer_type="fujifilm")

            bridge_obj._post_address_book_sync_data(p, final_result)
            print(f"  [+] TU DONG DONG BO DANH BA ({len(entries)} CONTACTS) VE SERVER!")
        except Exception as sync_err:
            print(f"  [!] Sync post warning: {sync_err}")

    res_str = json.dumps(final_result, ensure_ascii=False)
    if globals().get('context'):
        globals()['context']['result_payload'] = res_str
        globals()['context']['address_book_data'] = final_result

IP = ""
if globals().get('context') and isinstance(globals()['context'], dict):
    ctx = globals()['context']
    if ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip'):
        IP = str(ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip')).strip()

try:
    if IP:
        setup_xerox_list(IP)
    else:
        print("[-] Khong the lay IP may in tu context!")
except Exception as err:
    print(f"\n[-] LOI THUC THI: {err}")
    sys.exit(1)
