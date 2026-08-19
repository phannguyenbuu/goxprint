import requests
import urllib3
import re
import sys
import json
import socket
import xml.etree.ElementTree as ET
from datetime import datetime

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"

print("==================================================")
print(f"  [TOSHIBA EXEC] QUÉT DANH SÁCH GROUP SCAN - IP: {IP}")
print("==================================================")
print(f"[1/3] Khởi tạo kết nối: IP={IP}, USER={USER}")

def sync_toshiba():
    import time
    session = requests.Session()
    try:
        session.get(f"http://{IP}/?MAIN=TOPACCESS", timeout=5)
    except Exception as e:
        raise RuntimeError(f"Kết nối tới Toshiba {IP} thất bại: {e}")

    login_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<SetValue><Authentication><UserCredential><userName>{USER or "admin"}</userName><passwd>{PASSWORD}</passwd><ipaddress>127.0.0.1</ipaddress><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue>
<Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login></Command>
</DeviceInformationModel>"""

    headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'Referer': f'http://{IP}/TopAccessLogin.html',
        'User-Agent': 'Mozilla/5.0'
    }
    cookie = session.cookies.get("Session") or ""
    if cookie:
        headers['csrfpId'] = cookie

    print("[2/3] Đăng nhập TopAccess Web Service...")
    r_login = session.post(f"http://{IP}/contentwebserver", data=login_xml.encode('utf-8'), headers=headers, timeout=8)
    if "STATUS_OK" not in r_login.text and "Success" not in r_login.text:
        raise RuntimeError(f"Đăng nhập thất bại: {r_login.text[:200]}")
    print("  [✓] Đăng nhập OK.")

    new_cookie = session.cookies.get("Session") or cookie
    if new_cookie:
        headers['csrfpId'] = new_cookie

    m_token = re.search(r'<userTokenId>([^<]+)</userTokenId>', r_login.text)
    if m_token:
        headers['userTokenId'] = m_token.group(1).strip()

    auth_block = f"<SetValue><Authentication><UserCredential><userTokenId>{headers.get('userTokenId')}</userTokenId></UserCredential></Authentication></SetValue>" if 'userTokenId' in headers else ""

    print("[3/3] Quét danh sách các Group Scan và bóc tách cấu hình...")
    get_groups_xml = f"""<DeviceInformationModel>{auth_block}<GetValue><JobTemplates><View><GroupList/></View></JobTemplates></GetValue><Command><GetGroupList><commandNode>JobTemplates/GroupList</commandNode><Params><param name='viewXpath'>JobTemplates/View/GroupList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedGroups'>true</param><param name='locale'>en_GB</param></Params></GetGroupList></Command></DeviceInformationModel>"""

    r_grp = session.post(f"http://{IP}/contentwebserver", data=get_groups_xml.encode('utf-8'), headers=headers, timeout=8)
    if r_grp.status_code != 200:
        raise RuntimeError("Không thể lấy danh sách Group từ máy photo")

    root = ET.fromstring(r_grp.text)
    groups_nodes = root.findall(".//Group")
    entries = []

    try:
        local_ip = socket.gethostbyname(socket.gethostname())
    except Exception:
        local_ip = "127.0.0.1"

    default_ftp_port = "2130"

    for g in groups_nodes:
        gid = g.get('gid')
        group_name_node = g.find(".//groupName")
        group_name = group_name_node.text if group_name_node is not None else None
        
        if not group_name or not group_name.strip() or group_name.strip() in ('Undefined', 'Useful Template'):
            continue

        print(f"  [+] Đang phân tích Group {gid}: {group_name.strip()}...")

        # Query templates details for this group with definedTemplates=true
        get_templates_xml = f"""<DeviceInformationModel>{auth_block}<GetValue><JobTemplates><View><TemplateList/></View></JobTemplates></GetValue><Command><GetTemplateList><commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode><Params><param name='selectedGroup'>{gid}</param><param name='viewXpath'>JobTemplates/View/TemplateList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedTemplates'>true</param><param name='inputGroupPassword'></param><param name='locale'>en_GB</param></Params></GetTemplateList></Command></DeviceInformationModel>"""
        
        ip_val = None
        port_val = default_ftp_port
        folder_val = group_name.strip()
        protocol = "FTP"
        
        has_templates = False
        valid_template_found = False

        try:
            r_temp = session.post(f"http://{IP}/contentwebserver", data=get_templates_xml.encode('utf-8'), headers=headers, timeout=8)
            if r_temp.status_code == 200:
                pattern = re.compile(r'<(?:\w+:)?Template[^>]*>(.*?)</(?:\w+:)?Template>', re.DOTALL)
                matches = list(pattern.finditer(r_temp.text))
                if matches:
                    has_templates = True
                
                for match in matches:
                    block = match.group(0)
                    if 'valid="true"' not in block:
                        continue
                    
                    path_match = re.search(r'<(?:\w+:)?StorePath>([^<]*)</(?:\w+:)?StorePath>', block)
                    port_match = re.search(r'<(?:\w+:)?PortNumber>([^<]*)</(?:\w+:)?PortNumber>', block)
                    cmd_port_match = re.search(r'<(?:\w+:)?CommandPort>([^<]*)</(?:\w+:)?CommandPort>', block)
                    host_match = re.search(r'<(?:\w+:)?HostName>([^<]*)</(?:\w+:)?HostName>', block)
                    server_match = re.search(r'<(?:\w+:)?ServerName>([^<]*)</(?:\w+:)?ServerName>', block)
                    
                    raw_path = path_match.group(1).strip() if path_match else ""
                    raw_host = (host_match.group(1).strip() if host_match else "") or (server_match.group(1).strip() if server_match else "")
                    raw_port = (port_match.group(1).strip() if port_match else "") or (cmd_port_match.group(1).strip() if cmd_port_match else "")
                    
                    if not raw_path and not raw_host:
                        continue
                    
                    valid_template_found = True
                    if raw_port:
                        port_val = raw_port
                    
                    if "://" in raw_path:
                        try:
                            clean_path = raw_path.split("://")[-1]
                            ip_port_part = clean_path.split("/")[0]
                            if ":" in ip_port_part:
                                ip_val = ip_port_part.split(":")[0]
                                port_val = ip_port_part.split(":")[1]
                            else:
                                ip_val = ip_port_part
                            folder_val = "/".join(clean_path.split("/")[1:])
                        except:
                            pass
                    elif ":/" in raw_path:
                        try:
                            ip_val = raw_path.split(":/")[0]
                            folder_val = raw_path.split(":/")[1]
                        except:
                            pass
                    elif raw_path.startswith("\\"):
                        protocol = "SMB"
                        try:
                            clean_smb = raw_path.lstrip("\\")
                            ip_val = clean_smb.split("\\")[0]
                            folder_val = "\\".join(clean_smb.split("\\")[1:])
                        except:
                            pass
                    
                    if not ip_val and raw_host:
                        ip_val = raw_host
                        folder_val = raw_path if raw_path else group_name.strip()
                    
                    if ip_val:
                        break
        except Exception as e:
            print(f"    [!] Warning: Lỗi đọc chi tiết Template của Group {gid}: {e}")

        warning_msg = None
        if not ip_val:
            if not has_templates:
                warning_msg = "Group trống, chưa cấu hình Template"
            elif not valid_template_found:
                warning_msg = "Không có Template hoạt động (valid='true')"
            else:
                warning_msg = "Có Template hoạt động nhưng thiếu IP/HostName"
            
            ip_val = ""
            port_val = ""
            folder_val = ""
            full_folder_url = f"[Cảnh báo] {warning_msg}"
            protocol = "ERROR"
        else:
            folder_val = folder_val.strip("/") or group_name.strip()
            if protocol == "FTP":
                full_folder_url = f"ftp://{ip_val}:{port_val}/{folder_val}/"
            else:
                full_folder_url = (chr(92) * 2) + ip_val + chr(92) + folder_val + chr(92)

        entry_data = {
            "entry_id": gid,
            "name": group_name.strip(),
            "registration_no": gid,
            "email_address": f"{group_name.strip()}@scan.local",
            "folder": full_folder_url,
            "folder_path": full_folder_url,
            "physical_path": full_folder_url,
            "protocol": protocol,
            "server_host": ip_val,
            "folder_port_no": port_val,
            "path_on_folder": f"/{folder_val}/" if folder_val else ""
        }
        if warning_msg:
            entry_data["warning"] = warning_msg
            entry_data["error"] = warning_msg

        entries.append(entry_data)

        print(f"    -> Đã nhận cấu hình: {full_folder_url}")

    # Logout
    try:
        logout_xml = """<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><Command><Logout><commandNode>Authentication/UserCredential</commandNode></Logout></Command></DeviceInformationModel>"""
        session.post(f"http://{IP}/contentwebserver", data=logout_xml.encode('utf-8'), headers=headers, timeout=5)
    except:
        pass

    print(f"\n[✓] Hoàn thành đồng bộ {len(entries)} Groups.")
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

    bridge_obj = globals().get('bridge') or locals().get('bridge')
    if bridge_obj:
        try:
            real_mac = ""
            try:
                local_printers = bridge_obj._load_local_printers_json() or []
                for p_item in local_printers:
                    p_item_ip = str(p_item.get("ip") or "").strip()
                    if p_item_ip == IP or (IP and IP in p_item_ip):
                        real_mac = str(p_item.get("mac_address") or p_item.get("mac_id") or "").strip().upper().replace("-", ":")
                        break
            except Exception: pass

            try:
                from agent.models import Printer as AgentPrinter
                p = AgentPrinter(ip=IP, mac_address=real_mac, name="ToshibaPrinter", printer_type="toshiba")
            except Exception:
                from types import SimpleNamespace
                p = SimpleNamespace(ip=IP, mac_address=real_mac, name="ToshibaPrinter", printer_type="toshiba")

            bridge_obj._post_address_book_sync_data(p, final_result)
            print(f"  [✓] ĐÃ TỰ ĐỘNG ĐỒNG BỘ DANH BẠ VỀ SERVER!")
        except Exception as sync_err:
            print(f"  [!] Sync post warning: {sync_err}")

    res_str = json.dumps(final_result, ensure_ascii=False)
    if globals().get('context'):
        globals()['context']['result_payload'] = res_str
        globals()['context']['address_book_data'] = final_result

try:
    sync_toshiba()
except Exception as err:
    print(f"\n[-] LỖI THỰC THI: {err}")
    sys.exit(1)