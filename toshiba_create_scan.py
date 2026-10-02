"""Tạo Scan-to-FTP template trên Toshiba TopAccess - cấu trúc XML copy chính xác từ template cuong1 đang hoạt động."""
import requests
import socket
import re
import sys
import json
import urllib3
from datetime import datetime
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IP = "__TARGET_IP__"
USER = "__TARGET_USER__"
PASSWORD = "__TARGET_PASS__"
NAME = "__TARGET_NAME__"

def get_local_ip(target_ip):
    bridge_obj = globals().get('bridge') or locals().get('bridge')
    if bridge_obj and hasattr(bridge_obj, '_resolve_local_ip'):
        try:
            b_ip = bridge_obj._resolve_local_ip()
            if b_ip and b_ip != '127.0.0.1':
                return b_ip
        except Exception:
            pass
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect((target_ip, 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

SECURE_PDF_BLOCK = """<SecurePDF><Enabled>false</Enabled><EncryptionLevel>40bitRC4</EncryptionLevel><DocumentOpenPassword/><Permissions><Enabled>false</Enabled><PermissionsPassword/><PrintAuthority>Disable</PrintAuthority><EditAuthority>Disable</EditAuthority><Accessibility>false</Accessibility><CopyAuthority>false</CopyAuthority></Permissions></SecurePDF>"""

def build_register_template_xml(scan_username, local_ip, ftp_port, ftp_user, ftp_password, template_slot, group_slot):
    sp = SECURE_PDF_BLOCK
    
    # Scan XML block
    scan_xml = (
        f"<ColorParameter><ColorMode>Monochrome</ColorMode></ColorParameter>"
        f"<ImageAdjustmentParameter>"
        f"<ImageMode>Text</ImageMode><ImageQuality>Middle</ImageQuality><ImageRotate>0</ImageRotate>"
        f"<Exposure><ExposureMode>Auto</ExposureMode><ExposureLevel>0</ExposureLevel></Exposure>"
        f"<BackgroundAdjustment>0</BackgroundAdjustment>"
        f"<Contrast>0</Contrast>"
        f"<Sharpness>0</Sharpness>"
        f"<Saturation>0</Saturation>"
        f"<RGBAdjustment><Red>0</Red><Green>0</Green><Blue>0</Blue></RGBAdjustment>"
        f"</ImageAdjustmentParameter>"
        f"<Scan Enabled='true'><ScanParameter>"
        f"<DuplexMode>Simplex</DuplexMode>"
        f"<Resolution>200</Resolution>"
        f"<OriginalSizeInformation><OriginalSize>Undefined</OriginalSize></OriginalSizeInformation>"
        f"<AutoOriginalDetectionMode>true</AutoOriginalDetectionMode>"
        f"<MixedOriginalSizes>false</MixedOriginalSizes>"
        f"<OmitBlankPage><Enabled>false</Enabled></OmitBlankPage>"
        f"<OutSideErase><Enabled>false</Enabled><DetectExposureLevel></DetectExposureLevel></OutSideErase>"
        f"<DropOutColor><Enabled>false</Enabled><RangeAdjustment>0</RangeAdjustment></DropOutColor>"
        f"<NoiseReduction>Disable</NoiseReduction>"
        f"<FoldingOriginal><Scan>false</Scan></FoldingOriginal>"
        f"</ScanParameter>"
        f"<Output>"
        f"<Preview Enabled='false'></Preview>"
        f"<FTPStore Index='1' Enabled='true'><FTPStoreParameter>"
        f"<FileFormatInformation><FileFormat>PDFMulti</FileFormat>{sp}</FileFormatInformation>"
        f"<ServerName>{local_ip}</ServerName>"
        f"<CommandPort>{ftp_port}</CommandPort>"
        f"<StorePath>{scan_username}</StorePath>"
        f"<UserName>{ftp_user}</UserName>"
        f"<Password>{ftp_password}</Password>"
        f"<SSL>false</SSL>"
        f"</FTPStoreParameter></FTPStore>"
        f"</Output></Scan>"
    )
    
    # SetValue part 1: JobTemplates
    set_value_1 = (
        f"<JobTemplates><View><New><Template>"
        f"<OriginalKey>Queues/Scan</OriginalKey>"
        f"<MetaData>"
        f"<caption1>Scan To</caption1>"
        f"<caption2>File</caption2>"
        f"<userName></userName>"
        f"<isPasswordProtected>false</isPasswordProtected>"
        f"<autoStart>false</autoStart>"
        f"<NotificationSettings>"
        f"<email Enabled='false'></email>"
        f"<onJobCompletion>false</onJobCompletion>"
        f"<onError>false</onError>"
        f"</NotificationSettings>"
        f"<type>Normal</type>"
        f"</MetaData>"
        f"<Params><saveFileName nameFormat='standard-date'>DOCMMDDYY</saveFileName></Params>"
        f"</Template></New></View></JobTemplates>"
    )
    
    # SetValue part 2: Queues
    set_value_2 = (
        f"<Queues><Scan><WorkflowExecutionParameter>"
        f"<WorkflowPolicy></WorkflowPolicy>"
        f"{scan_xml}"
        f"</WorkflowExecutionParameter></Scan></Queues>"
    )
    
    # Command: RegisterTemplate
    cmd = (
        f"<RegisterTemplate>"
        f"<commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode>"
        f"<Params>"
        f"<param name='selectedGroup'>{group_slot}</param>"
        f"<param name='selectedTemplate'>{template_slot}</param>"
        f"<param name='newMetadata'>JobTemplates/View/New/Template/MetaData</param>"
        f"<param name='originalKey'>Queues/Scan</param>"
        f"<param name='newParamsData'>JobTemplates/View/New/Template/Params</param>"
        f"<param name='newTemplatePassword'></param>"
        f"</Params>"
        f"</RegisterTemplate>"
    )
    
    return (
        f"<?xml version='1.0' encoding='UTF-8'?>"
        f"<DeviceInformationModel>"
        f"<SetValue>{set_value_1}</SetValue>"
        f"<SetValue>{set_value_2}</SetValue>"
        f"<Command>{cmd}</Command>"
        f"</DeviceInformationModel>"
    )

def ensure_local_ftp_and_shortcut(scan_name: str):
    """
    Tự động tạo thư mục con bên trong thư mục gốc FTP của Agent (theo settings.json/scan_dirs),
    tạo Shortcut (.lnk) ngoài Desktop trỏ vào thư mục con đó,
    và tự động mở thư mục trong File Explorer.
    """
    import os, sys, json, subprocess, pathlib
    print("[*] Đang khởi tạo thư mục FTP con, Shortcut Desktop và mở thư mục...")
    
    # 1. Xác định thư mục gốc FTP (Ưu tiên tuyệt đối Roaming AppData settings.json -> polling.scan_dirs)
    ftp_root = ""
    appdata = os.getenv("APPDATA", "")
    if not appdata:
        userprofile = os.getenv("USERPROFILE", "")
        if userprofile:
            appdata = os.path.join(userprofile, "AppData", "Roaming")
    
    # 1.1. Đọc trực tiếp từ %APPDATA%\GoxPrintAgent\settings.json
    if appdata:
        roaming_settings = os.path.join(appdata, "GoxPrintAgent", "settings.json")
        if os.path.exists(roaming_settings):
            try:
                with open(roaming_settings, "r", encoding="utf-8") as f:
                    s_data = json.load(f)
                val = (s_data.get("polling") or {}).get("scan_dirs") or s_data.get("scan_dirs") or s_data.get("ftp_path")
                if val and str(val).strip():
                    first_dir = str(val).replace("|", os.sep).replace("/", os.sep).split(";")[0].strip()
                    if first_dir:
                        ftp_root = os.path.normpath(os.path.expandvars(first_dir))
                        print(f"[*] Đã nhận thư mục scan từ Roaming settings.json: {ftp_root}")
            except Exception as e:
                print(f"[-] Cảnh báo đọc Roaming settings.json: {e}")

    # 1.2. Đọc từ bridge._config nếu có
    if not ftp_root:
        bridge_obj = globals().get('bridge') or locals().get('bridge')
        if bridge_obj and hasattr(bridge_obj, '_config'):
            try:
                cfg_val = (
                    bridge_obj._config.get_string("polling.scan_dirs", "") or 
                    bridge_obj._config.get_string("scan_dirs", "") or 
                    bridge_obj._config.get_string("ftp_path", "")
                )
                if cfg_val and str(cfg_val).strip():
                    first_dir = str(cfg_val).replace("|", os.sep).replace("/", os.sep).split(";")[0].strip()
                    if first_dir:
                        ftp_root = os.path.normpath(os.path.expandvars(first_dir))
                        print(f"[*] Đã nhận thư mục scan từ Agent Bridge: {ftp_root}")
            except Exception:
                pass

    # 1.3. Đọc từ settings.json cùng thư mục file thực thi
    if not ftp_root:
        local_candidates = [
            os.path.join(os.path.dirname(sys.executable), "settings.json") if getattr(sys, "frozen", False) else "",
            "settings.json",
            os.path.expandvars(r"%LOCALAPPDATA%\GoxPrintAgent\settings.json")
        ]
        for alt_p in local_candidates:
            if alt_p and os.path.exists(alt_p):
                try:
                    with open(alt_p, "r", encoding="utf-8") as f:
                        s_data = json.load(f)
                    val = (s_data.get("polling") or {}).get("scan_dirs") or s_data.get("scan_dirs")
                    if val and str(val).strip():
                        first_dir = str(val).replace("|", os.sep).replace("/", os.sep).split(";")[0].strip()
                        if first_dir:
                            ftp_root = os.path.normpath(os.path.expandvars(first_dir))
                            print(f"[*] Đã nhận thư mục scan từ {alt_p}: {ftp_root}")
                            break
                except Exception:
                    pass

    # 1.4. Fallback cuối cùng nếu chưa có bất kỳ cấu hình nào
    if not ftp_root:
        ftp_root = os.path.expandvars(r"%LOCALAPPDATA%\Temp\GoPrinxAgent\ftp")
        print(f"[*] Chưa cấu hình scan_dirs, fallback về: {ftp_root}")

    try:
        os.makedirs(ftp_root, exist_ok=True)
        print(f"[+] Thư mục FTP gốc: {ftp_root}")
    except Exception as e:
        print(f"[-] Lỗi tạo thư mục FTP gốc ({ftp_root}): {e}")

    # 2. Làm sạch tên thư mục scan (tránh placeholder dạng __XXX__ hoặc rỗng)
    raw_name = str(scan_name or "").strip()
    if (raw_name.startswith("__") and raw_name.endswith("__")) or raw_name.lower() in ("null", "none", "undefined"):
        raw_name = ""
    clean_name = raw_name
    for ch in r'\/:*?"<>|':
        clean_name = clean_name.replace(ch, '')
    clean_name = clean_name.strip()

    # 3. Tạo thư mục con trong FTP
    if clean_name:
        target_dir = os.path.join(ftp_root, clean_name)
        shortcut_filename = f"Scan - {clean_name}.lnk"
    else:
        target_dir = ftp_root
        shortcut_filename = "Thu muc Scan (GoPrinx).lnk"

    try:
        os.makedirs(target_dir, exist_ok=True)
        print(f"[+] Đã tạo thư mục FTP con: {target_dir}")
    except Exception as e:
        print(f"[-] Lỗi tạo thư mục FTP con: {e}")

    # 4. Xác định các đường dẫn Desktop thực tế của người dùng
    desktop_dirs = []
    try:
        flags = 0x08000000 if sys.platform == "win32" else 0
        cmd = ["powershell", "-NoProfile", "-NonInteractive", "-Command", "[Environment]::GetFolderPath('Desktop')"]
        res = subprocess.run(cmd, capture_output=True, text=True, errors="ignore", creationflags=flags)
        p = res.stdout.strip()
        if p and os.path.exists(p) and p not in desktop_dirs:
            desktop_dirs.append(p)
    except Exception:
        pass

    try:
        import winreg
        key_path = r"Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders"
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, key_path) as key:
            val, _ = winreg.QueryValueEx(key, "Desktop")
            expanded = os.path.expandvars(val)
            if os.path.exists(expanded) and expanded not in desktop_dirs:
                desktop_dirs.append(expanded)
    except Exception:
        pass

    user_prof = os.environ.get("USERPROFILE") or str(pathlib.Path.home())
    default_desktop = os.path.join(user_prof, "Desktop")
    if os.path.exists(default_desktop) and default_desktop not in desktop_dirs:
        desktop_dirs.append(default_desktop)
    onedrive_desktop = os.path.join(user_prof, "OneDrive", "Desktop")
    if os.path.exists(onedrive_desktop) and onedrive_desktop not in desktop_dirs:
        desktop_dirs.append(onedrive_desktop)

    # 5. Tạo Shortcut ngoài Desktop bằng WScript.Shell
    for desktop_dir in desktop_dirs:
        try:
            shortcut_path = os.path.join(desktop_dir, shortcut_filename)
            safe_shortcut = shortcut_path.replace("'", "''")
            safe_target = target_dir.replace("'", "''")
            ps_cmd = f"$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('{safe_shortcut}'); $s.TargetPath = '{safe_target}'; $s.WorkingDirectory = '{safe_target}'; $s.Description = 'Thu muc luu tru ban Scan'; $s.Save()"
            flags = 0x08000000 if sys.platform == "win32" else 0
            subprocess.run(["powershell", "-NoProfile", "-NonInteractive", "-Command", ps_cmd], capture_output=True, text=True, errors="ignore", creationflags=flags)
            if os.path.exists(shortcut_path):
                print(f"[+] Đã tạo Shortcut ngoài Desktop: {shortcut_path} -> {target_dir}")
            else:
                print(f"[-] Cảnh báo: Chưa tạo được Shortcut ngoài Desktop ({shortcut_path})")
        except Exception as sc_err:
            print(f"[-] Cảnh báo tạo Shortcut ngoài Desktop: {sc_err}")

    # 6. Mở thư mục vừa tạo trong File Explorer
    try:
        if sys.platform == "win32" and os.path.exists(target_dir):
            try:
                os.startfile(target_dir)
                print(f"[+] Đã mở thư mục scan trong File Explorer: {target_dir}")
            except Exception:
                flags = 0x08000000 if sys.platform == "win32" else 0
                subprocess.Popen(["explorer.exe", target_dir], creationflags=flags)
                print(f"[+] Đã gọi Explorer mở thư mục scan: {target_dir}")
    except Exception as open_err:
        print(f"[-] Cảnh báo không thể tự động mở thư mục: {open_err}")

    return target_dir, clean_name

def setup_toshiba_scan(printer_ip, admin_user, admin_password, scan_username, existing_group=None):
    print(f"[*] Tạo Scan-to-FTP cho Toshiba {printer_ip}, user: {scan_username}")
    
    # 0. Khởi tạo thư mục FTP con và Shortcut ngoài Desktop
    target_scan_dir, clean_scan_name = ensure_local_ftp_and_shortcut(scan_username)
    if clean_scan_name:
        scan_username = clean_scan_name
    
    local_ip = get_local_ip(printer_ip)
    ftp_port = "2130"
    ftp_user = "goxprint"
    ftp_password = "goxprint"
    print(f"[*] FTP Server: {local_ip}:{ftp_port}")
    
    # Bootstrap
    session = requests.Session()
    origin = f"http://{printer_ip}"
    landing = f"{origin}/?MAIN=TOPACCESS"
    cgi = f"{origin}/contentwebserver"
    session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; ToshibaTopAccessAgent/1.0)", "Accept": "*/*", "Cache-Control": "no-cache", "Pragma": "no-cache", "Referer": landing})
    session.cookies.set("pageTrack", "MAIN=TOPACCESS")
    
    try:
        session.get(landing, verify=False, timeout=10)
    except Exception as e:
        print(f"[-] Kết nối thất bại: {e}")
        return
    
    csrf = session.cookies.get("Session") or ""
    if not csrf:
        print("[-] Không lấy được Session cookie!")
        return
    headers = {"Content-Type": "text/plain; charset=utf-8", "csrfpId": csrf}

    # Login
    login_xml = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><SetValue><Authentication><UserCredential><userName>{admin_user}</userName><passwd>{admin_password}</passwd><ipaddress>{local_ip}</ipaddress><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue><Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login></Command></DeviceInformationModel>"""
    r = session.post(cgi, data=login_xml.encode("utf-8"), headers=headers, verify=False, timeout=8)
    if "STATUS_OK" not in r.text and "Success" not in r.text:
        print(f"[-] Login thất bại: {r.text[:200]}")
        return
    print("[+] Login OK")
    csrf = session.cookies.get("Session") or csrf
    headers["csrfpId"] = csrf

    # License
    try:
        session.post(cgi, data="""<DeviceInformationModel><SetValue overrideDelta="false"><Payload><path>TopAccess/SessionInfo/LICENSE_SETTINGS</path><value>,METASCAN:NO,PDF-A:YES,EWB:YES,IPSEC:NO,</value></Payload></SetValue></DeviceInformationModel>""".encode("utf-8"), headers=headers, verify=False, timeout=5)
    except:
        pass

    # Tạo Group hoặc dùng group có sẵn
    if existing_group:
        group_slot = existing_group
        print(f"[*] Dùng Group có sẵn: {group_slot}")
    else:
        print(f"[*] Tìm Group slot cho '{scan_username}'...")
        group_slot = None
        for g in range(2, 201):
            slot = f"{g:03d}"
            gxml = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><SetValue><JobTemplates><View><New><Group><MetaData><groupName>{scan_username}</groupName><userName></userName><notificationEmail></notificationEmail></MetaData></Group></New></View></JobTemplates></SetValue><Command><RegisterGroup><commandNode>JobTemplates/GroupList</commandNode><Params><param name='selectedGroup'>{slot}</param><param name='newGroupPassword'></param><param name='newMetadata'>JobTemplates/View/New/Group/MetaData</param></Params></RegisterGroup></Command></DeviceInformationModel>"""
            try:
                r = session.post(cgi, data=gxml.encode("utf-8"), headers=headers, verify=False, timeout=8)
                if "STATUS_OK" in r.text:
                    group_slot = slot
                    print(f"[+] Group '{scan_username}' = slot {slot}")
                    break
                elif "ALREADY_ASSIGNED" in r.text:
                    continue
                else:
                    m = re.search(r'<statusOfOperation>([^<]+)</statusOfOperation>', r.text)
                    print(f"[-] Slot {slot}: {m.group(1) if m else r.text[:200]}")
                    break
            except Exception as e:
                print(f"[-] Error: {e}")
                break
        
        if not group_slot:
            print("[-] Không tìm được Group slot!")
            return

    # Tạo Template
    print(f"[*] Tạo Template FTP scan...")
    success = False
    for i in range(1, 61):
        t_slot = f"{i:03d}"
        txml = build_register_template_xml(scan_username, local_ip, ftp_port, ftp_user, ftp_password, t_slot, group_slot)
        try:
            r = session.post(cgi, data=txml.encode("utf-8"), headers=headers, verify=False, timeout=12)
            with open("register_response.xml", "w", encoding="utf-8") as f:
                f.write(r.text)
            if "STATUS_OK" in r.text or "Success" in r.text:
                print(f"[+] THÀNH CÔNG! Group {group_slot} / Template {t_slot}")
                print(f"    Tên: Scan To {scan_username}")
                print(f"    FTP: {local_ip}:{ftp_port}/{scan_username}/")
                success = True
                break
            elif "ALREADY_ASSIGNED" in r.text:
                continue
            else:
                m = re.search(r'<statusOfOperation>([^<]+)</statusOfOperation>', r.text)
                print(f"[-] Template lỗi: {m.group(1) if m else 'Unknown'}")
                print(f"[DEBUG] {r.text[:500]}")
                break
        except Exception as e:
            print(f"[-] Error: {e}")
            break

    if not success:
        print("[-] Không tạo được Template!")

    # Logout
    try:
        session.post(cgi, data="""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><Command><Logout><commandNode>Authentication/UserCredential</commandNode></Logout></Command></DeviceInformationModel>""".encode("utf-8"), headers=headers, verify=False, timeout=3)
        print("[+] Logout OK")
    except:
        pass

    # Auto-fetch updated address book and populate context/bridge for auto-reload
    import time
    print("  -> Chờ 3 giây để máy photo Toshiba cập nhật hoàn tất bộ nhớ đệm...")
    time.sleep(3)
    try:
        from datetime import datetime
        import json
        import xml.etree.ElementTree as ET
        
        get_list_xml = """<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><GetValue><JobTemplates><View><GroupList/></View></JobTemplates></GetValue><Command><GetGroupList><commandNode>JobTemplates/GroupList</commandNode><Params><param name='viewXpath'>JobTemplates/View/GroupList</param><param name='currentPage'>1</param><param name='pageSize'>200</param><param name='definedGroups'>true</param><param name='inputGroupPassword'></param><param name='locale'>en_GB</param></Params></GetGroupList></Command></DeviceInformationModel>"""
        r_list = session.post(cgi, data=get_list_xml.encode("utf-8"), headers={"Content-Type": "text/plain; charset=utf-8"}, verify=False, timeout=10)
        if r_list.status_code == 200:
            root = ET.fromstring(r_list.text)
            entries = []
            for g_node in root.findall(".//Group"):
                id_node = g_node.find("groupID")
                g_id = id_node.text.strip() if id_node is not None and id_node.text else ""
                name_node = g_node.find(".//groupName")
                g_name = name_node.text.strip() if name_node is not None and name_node.text else ""
                if g_id and g_name and g_name != "Undefined":
                    entries.append({
                        "entry_id": g_id,
                        "name": g_name,
                        "registration_no": g_id,
                        "email_address": f"{g_name}@scan.local",
                        "folder_path": f"ftp://{local_ip}:{ftp_port}/{g_name}/",
                        "physical_path": f"ftp://{local_ip}:{ftp_port}/{g_name}/",
                        "protocol": "FTP",
                        "server_host": local_ip,
                        "folder_port_no": ftp_port,
                        "path_on_folder": f"/{g_name}/"
                    })
            
            addr_list = [{
                "name": "Summary", "registration_no": "-", "email_address": "", "folder_path": "",
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
                            if p_item_ip == printer_ip or (printer_ip and printer_ip in p_item_ip):
                                real_mac = str(p_item.get("mac_address") or p_item.get("mac_id") or "").strip().upper().replace("-", ":")
                                break
                    except Exception: pass

                    try:
                        from agent.models import Printer as AgentPrinter
                        p = AgentPrinter(ip=printer_ip, mac_address=real_mac, name="ToshibaPrinter", printer_type="toshiba")
                    except Exception:
                        from types import SimpleNamespace
                        p = SimpleNamespace(ip=printer_ip, mac_address=real_mac, name="ToshibaPrinter", printer_type="toshiba")

                    bridge_obj._post_address_book_sync_data(p, final_result)
                    print(f"  [✓] TỰ ĐỘNG ĐỒNG BỘ DANH BẠ MỚI NHẤT ({len(entries)} GROUPS) VỀ SERVER THANH CONG!")
                except Exception as sync_err:
                    print(f"  [!] Sync post warning: {sync_err}")

            res_str = json.dumps(final_result, ensure_ascii=False)
            if globals().get('context'):
                globals()['context']['result_payload'] = res_str
                globals()['context']['address_book_data'] = final_result
    except Exception as fetch_err:
        print(f"  [!] Tự động lấy danh bạ sau khi tạo thất bại: {fetch_err}")


if globals().get('context') and isinstance(globals()['context'], dict):
    ctx = globals()['context']
    if ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip'):
        IP = str(ctx.get('printer_ip') or ctx.get('ip') or ctx.get('target_ip')).strip()
    if ctx.get('auth_user') or ctx.get('user') or ctx.get('target_user'):
        USER = str(ctx.get('auth_user') or ctx.get('user') or ctx.get('target_user')).strip()
    if ctx.get('auth_password') or ctx.get('password') or ctx.get('target_pass'):
        PASSWORD = str(ctx.get('auth_password') or ctx.get('password') or ctx.get('target_pass')).strip()
    if ctx.get('name') or ctx.get('target_name') or ctx.get('email'):
        NAME = str(ctx.get('name') or ctx.get('target_name') or ctx.get('email')).strip()

try:
    setup_toshiba_scan(IP, USER, PASSWORD, NAME)
except Exception as err:
    print("")
    print(f"[-] LOI THUC THI: {err}")
    print("==================================================")
    sys.exit(1)
print("==================================================")
