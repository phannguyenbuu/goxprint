from __future__ import annotations
import logging
import json
import time

LOGGER = logging.getLogger(__name__)

class PollingIpChangeMixin:

    def polling_when_ip_change(self) -> None:
        if not self._ip_change_lock.acquire(blocking=False):
            LOGGER.debug("[polling_when_ip_change] Already running, skipping concurrent run.")
            return
        try:
            current_ip = self._resolve_local_ip()
            if not current_ip:
                LOGGER.warning("[polling_when_ip_change] Cannot resolve local IP.")
                return

            stored_ip = self._config.get_string("pc_ip", "").strip()
            if not stored_ip:
                LOGGER.info("[polling_when_ip_change] pc_ip in settings.json is empty. Initializing with %s", current_ip)
                self._config.set_value("pc_ip", current_ip)
                return

            if current_ip == stored_ip:
                LOGGER.debug("[polling_when_ip_change] IP is unchanged (%s). Skipping.", current_ip)
                return

            LOGGER.info("[polling_when_ip_change] IP change detected: old=%s, new=%s", stored_ip, current_ip)
            self._config.set_value("pc_ip", current_ip)

            # Report IP change event (old_ip and new_ip) to VPS API
            try:
                if hasattr(self, "_api_client") and self._api_client:
                    self._api_client.post_payload({
                        "event": "pc_ip_changed",
                        "agent_uid": getattr(self, "_agent_uid", ""),
                        "old_ip": stored_ip,
                        "new_ip": current_ip,
                        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                    })
                    LOGGER.info("[polling_when_ip_change] Reported IP change event to VPS: old_ip=%s, new_ip=%s", stored_ip, current_ip)
            except Exception as report_exc:
                LOGGER.warning("[polling_when_ip_change] Report IP change to VPS failed: %s", report_exc)

            # Retrieve copiers
            printers = self._load_printers()
            if not printers:
                LOGGER.info("[polling_when_ip_change] No printers/copiers found.")
                return

            ftp_user = self._config.get_string("ftp_user", "goxprint")
            ftp_pass = self._config.get_string("ftp_pass", "goxprint")
            fields = {
                "folderAuthUserNameIn": ftp_user,
                "folderAuthUserName": ftp_user,
                "folderPasswordIn": ftp_pass,
                "wk_folderPasswordIn": ftp_pass,
                "folderPasswordConfirmIn": ftp_pass,
                "wk_folderPasswordConfirmIn": ftp_pass,
            }

            for printer in printers:
                p_type = self._printer_type(printer.printer_type)
                if p_type == "ricoh":
                    LOGGER.info("[polling_when_ip_change] Checking address book on copier %s (IP=%s)...", printer.name, printer.ip)
                    session = None
                    try:
                        try:
                            session = self._ricoh_service.create_http_client(printer, authenticated=True)
                        except Exception as auth_exc:
                            LOGGER.debug("[polling_when_ip_change] Admin login failed for %s (%s), trying unauthenticated session: %s", printer.name, printer.ip, auth_exc)
                            session = self._ricoh_service.create_http_client(printer, authenticated=False)

                        payload = self._ricoh_service.process_address_list(printer, session=session)
                        entries = payload.get("address_list", [])

                        for entry in entries:
                            folder = str(entry.get("folder", "") or "").strip()
                            if folder and ("ftp://" in folder or folder.startswith("ftp:")) and stored_ip in folder:
                                new_folder = folder.replace(stored_ip, current_ip)
                                reg_no = str(entry.get("registration_no", "")).strip()
                                name = str(entry.get("name", "") or "").strip()
                                email = str(entry.get("email_address", "") or "").strip()

                                LOGGER.info("[polling_when_ip_change] Modifying FTP destination for %s (IP=%s) entry %s: name='%s' path=%s -> %s",
                                            printer.name, printer.ip, reg_no, name, folder, new_folder)

                                res = self._ricoh_service.modify_address_user_wizard(
                                    printer=printer,
                                    registration_no=reg_no,
                                    name=name,
                                    email=email,
                                    folder=new_folder,
                                    fields=fields,
                                    session=session
                                )
                                if res.get("ok"):
                                    LOGGER.info("[polling_when_ip_change] Success updating copier %s entry %s to folder %s",
                                                printer.ip, reg_no, new_folder)
                                else:
                                    LOGGER.warning("[polling_when_ip_change] Failed updating copier %s entry %s: %s",
                                                   printer.ip, reg_no, res)
                    except Exception as e:
                        LOGGER.warning("[polling_when_ip_change] Skipping copier %s (IP=%s): %s",
                                       printer.name, printer.ip, e)
                    finally:
                        if session:
                            try:
                                self._ricoh_service._reset_web_session(session, printer)
                                session.close()
                            except Exception:
                                pass
                elif p_type == "toshiba":
                    LOGGER.info("[polling_when_ip_change] Checking address book on Toshiba copier %s (IP=%s)...", printer.name, printer.ip)
                    try:
                        self._update_toshiba_ip_change(printer, stored_ip, current_ip)
                    except Exception as e:
                        LOGGER.warning("[polling_when_ip_change] Skipping Toshiba copier %s (IP=%s): %s",
                                       printer.name, printer.ip, e)
        except Exception as global_exc:
            LOGGER.error("[polling_when_ip_change] Global error: %s", global_exc, exc_info=True)
        finally:
            self._ip_change_lock.release()

    def _update_toshiba_ip_change(self, printer: Printer, old_ip: str, new_ip: str) -> None:
        import requests
        import re
        import urllib3
        import socket
        import xml.etree.ElementTree as ET
        from agent.modules.toshiba.utils import ToshibaSSLAdapter

        session = requests.Session()
        try:
            session.mount("https://", ToshibaSSLAdapter())
        except Exception:
            pass

        base_urls = [
            f"http://{printer.ip}",
            f"https://{printer.ip}",
        ]
        cgi_endpoints = [
            "/contentwebserver",
            "/eBridge/cgi/TopAccess.cgi",
        ]

        pws = []
        if printer.password:
            pws.append(printer.password)
        if getattr(printer, "auth_password", ""):
            pws.append(getattr(printer, "auth_password"))
        if not pws:
            pws.append(printer.password or "")
        user_name = printer.user or getattr(printer, "auth_user", "")

        login_success = False
        base_url = base_urls[0]
        active_cgi = "/contentwebserver"
        headers = {
            "Content-Type": "text/plain; charset=UTF-8",
            "User-Agent": "Mozilla/5.0",
            "Accept": "*/*",
        }

        try:
            local_client_ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            local_client_ip = "127.0.0.1"

        # Try logging in
        for target_url in base_urls:
            try:
                session.get(f"{target_url}/?MAIN=TOPACCESS", verify=False, timeout=5)
                csrf_token = session.cookies.get("Session") or ""
                if csrf_token:
                    headers["csrfpId"] = csrf_token
            except Exception:
                pass

            if login_success:
                break
            for pw in pws:
                login_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<SetValue><Authentication><UserCredential><userName>{user_name}</userName><passwd>{pw}</passwd><ipaddress>{local_client_ip}</ipaddress><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue>
<Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login></Command>
</DeviceInformationModel>"""
                for cgi in cgi_endpoints:
                    try:
                        r = session.post(f"{target_url}{cgi}", data=login_xml.encode("utf-8"), headers=headers, verify=False, timeout=8)
                        if r.status_code == 200 and ("<LoginResult>Success</LoginResult>" in r.text or "<userTokenId>" in r.text):
                            login_success = True
                            base_url = target_url
                            active_cgi = cgi
                            # Extract userTokenId
                            m_token = re.search(r'<userTokenId>([^<]+)</userTokenId>', r.text)
                            if m_token:
                                headers['userTokenId'] = m_token.group(1).strip()
                            break
                    except Exception:
                        pass
                if login_success:
                    break

        if not login_success:
            raise RuntimeError("Đăng nhập TopAccess thất bại")

        # Refresh CSRF
        new_csrf = session.cookies.get("Session") or headers.get("csrfpId") or ""
        if new_csrf:
            headers["csrfpId"] = new_csrf

        cgi_url = f"{base_url}{active_cgi}"
        auth_block = f"<SetValue><Authentication><UserCredential><userTokenId>{headers.get('userTokenId')}</userTokenId></UserCredential></Authentication></SetValue>" if 'userTokenId' in headers else ""

        # GetGroupList
        get_groups_xml = f"""<DeviceInformationModel>{auth_block}<GetValue><JobTemplates><View><GroupList/></View></JobTemplates></GetValue><Command><GetGroupList><commandNode>JobTemplates/GroupList</commandNode><Params><param name='viewXpath'>JobTemplates/View/GroupList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedGroups'>true</param><param name='locale'>en_GB</param></Params></GetGroupList></Command></DeviceInformationModel>"""

        r_grp = session.post(cgi_url, data=get_groups_xml.encode('utf-8'), headers=headers, verify=False, timeout=8)
        if r_grp.status_code != 200:
            raise RuntimeError("Không thể lấy danh sách Group")

        root = ET.fromstring(r_grp.text)
        groups_nodes = root.findall(".//Group")

        for g in groups_nodes:
            gid = g.get('gid')
            gname_node = g.find(".//groupName")
            gname = gname_node.text if gname_node is not None else None
            
            if not gname or not gname.strip() or gname.strip() in ('Undefined', 'Useful Template'):
                continue

            # Get templates details for this group
            get_templates_xml = f"""<DeviceInformationModel>{auth_block}<GetValue><JobTemplates><View><TemplateList/></View></JobTemplates></GetValue><Command><GetTemplateList><commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode><Params><param name='selectedGroup'>{gid}</param><param name='viewXpath'>JobTemplates/View/TemplateList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedTemplates'>true</param><param name='inputGroupPassword'></param><param name='locale'>en_GB</param></Params></GetTemplateList></Command></DeviceInformationModel>"""

            r_temp = session.post(cgi_url, data=get_templates_xml.encode('utf-8'), headers=headers, verify=False, timeout=8)
            if r_temp.status_code != 200:
                continue

            pattern = re.compile(r'<(?:\w+:)?Template[^>]*>(.*?)</(?:\w+:)?Template>', re.DOTALL)
            for match in pattern.finditer(r_temp.text):
                block = match.group(0)
                if 'valid="true"' not in block:
                    continue

                path_match = re.search(r'<(?:\w+:)?StorePath>([^<]*)</(?:\w+:)?StorePath>', block)
                raw_path = path_match.group(1).strip() if path_match else ""
                if not raw_path:
                    continue

                # Check if old_ip is in the path
                if old_ip in raw_path:
                    tid_match = re.search(r'tid=[\"\'](\d+)[\"\']', block)
                    tid = tid_match.group(1) if tid_match else "001"
                    
                    cap2_match = re.search(r'<(?:\w+:)?caption2>([^<]*)</(?:\w+:)?caption2>', block)
                    c2 = cap2_match.group(1).strip() if cap2_match else gname.strip()

                    # Parse username, port, pass etc from the path or use config
                    ftp_user = self._config.get_string("ftp_user", "goxprint")
                    ftp_pass = self._config.get_string("ftp_pass", "goxprint")
                    ftp_port = "2130"
                    
                    port_match = re.search(r'<(?:\w+:)?PortNumber>([^<]*)</(?:\w+:)?PortNumber>', block)
                    if port_match:
                        ftp_port = port_match.group(1).strip()

                    LOGGER.info("[_update_toshiba_ip_change] Updating Toshiba template %s-%s (%s): %s -> IP %s",
                                gid, tid, c2, raw_path, new_ip)

                    # Delete the old template
                    del_xml = f"""<?xml version='1.0' encoding='UTF-8'?><DeviceInformationModel>{auth_block}<Command><DeleteTemplate><commandNode>JobTemplates/GroupList/Group/TemplateList/Template</commandNode><Params><param name='selectedGroup'>{gid}</param><param name='selectedTemplate'>{tid}</param><param name='inputGroupPassword'></param></Params></DeleteTemplate></Command></DeviceInformationModel>"""
                    session.post(cgi_url, data=del_xml.encode('utf-8'), headers=headers, verify=False, timeout=8)

                    # Register with new IP
                    sp = """<SecurePDF><Enabled>false</Enabled><EncryptionLevel>40bitRC4</EncryptionLevel><DocumentOpenPassword/><Permissions><Enabled>false</PermissionsPassword/><PrintAuthority>Disable</PrintAuthority><EditAuthority>Disable</EditAuthority><Accessibility>false</Accessibility><CopyAuthority>false</CopyAuthority></Permissions></SecurePDF>"""
                    new_store_path = f"ftp://{new_ip}:{ftp_port}/{c2}/"

                    scan_xml = (
                        f"<ColorParameter><ColorMode>Monochrome</ColorMode></ColorParameter>"
                        f"<ImageAdjustmentParameter>"
                        f"<ImageMode>Text</ImageMode><ImageQuality>Middle</ImageQuality><ImageRotate>0</ImageRotate>"
                        f"<Exposure><ExposureMode>Auto</ExposureMode><ExposureLevel>0</ExposureLevel></Exposure>"
                        f"<BackgroundAdjustment>0</BackgroundAdjustment><Contrast>0</Contrast><Sharpness>0</Sharpness><Saturation>0</Saturation>"
                        f"<RGBAdjustment><Red>0</Red><Green>0</Green><Blue>0</Blue></RGBAdjustment>"
                        f"</ImageAdjustmentParameter>"
                        f"<Scan Enabled='true'><ScanParameter>"
                        f"<DuplexMode>Simplex</DuplexMode><Resolution>200</Resolution>"
                        f"<OriginalSizeInformation><OriginalSize>Undefined</OriginalSize></OriginalSizeInformation>"
                        f"<AutoOriginalDetectionMode>true</AutoOriginalDetectionMode><MixedOriginalSizes>false</MixedOriginalSizes>"
                        f"<OmitBlankPage><Enabled>false</Enabled></OmitBlankPage>"
                        f"<OutSideErase><Enabled>false</Enabled><DetectExposureLevel></DetectExposureLevel></OutSideErase>"
                        f"<DropOutColor><Enabled>false</Enabled><RangeAdjustment>0</RangeAdjustment></DropOutColor>"
                        f"<NoiseReduction>Disable</NoiseReduction><FoldingOriginal><Scan>false</Scan></FoldingOriginal>"
                        f"</ScanParameter>"
                        f"<Output>"
                        f"<Preview Enabled='false'></Preview>"
                        f"<FTPStore Index='1' Enabled='true'><FTPStoreParameter>"
                        f"<FileFormatInformation><FileFormat>PDFMulti</FileFormat>{sp}</FileFormatInformation>"
                        f"<HostName>{new_ip}</HostName><PortNumber>{ftp_port}</PortNumber>"
                        f"<StorePath>{new_store_path}</StorePath>"
                        f"<UserName>{ftp_user}</UserName><Password>{ftp_pass}</Password>"
                        f"<SSL>false</SSL>"
                        f"</FTPStoreParameter></FTPStore>"
                        f"<SMBStore Enabled='false'></SMBStore><NetwareStore Enabled='false'></NetwareStore>"
                        f"</Output></Scan>"
                    )
                    
                    set_value_1 = (
                        f"<JobTemplates><View><New><Template>"
                        f"<OriginalKey>Queues/Scan</OriginalKey>"
                        f"<MetaData>"
                        f"<caption1>Scan To</caption1><caption2>{c2}</caption2>"
                        f"<userName></userName><isPasswordProtected>false</isPasswordProtected><autoStart>false</autoStart>"
                        f"<NotificationSettings>"
                        f"<email Enabled='false'></email><onJobCompletion>false</onJobCompletion><onError>false</onError>"
                        f"</NotificationSettings>"
                        f"<type>Normal</type>"
                        f"</MetaData>"
                        f"<Params><saveFileName nameFormat='standard-date'>DOCMMDDYY</saveFileName></Params>"
                        f"</Template></New></View></JobTemplates>"
                    )
                    
                    set_value_2 = (
                        f"<Queues><Scan><WorkflowExecutionParameter><WorkflowPolicy></WorkflowPolicy>{scan_xml}</WorkflowExecutionParameter></Scan></Queues>"
                    )
                    
                    reg_xml = (
                        f"<?xml version='1.0' encoding='UTF-8'?><DeviceInformationModel>{auth_block}"
                        f"<SetValue>{set_value_1}</SetValue><SetValue>{set_value_2}</SetValue>"
                        f"<Command><RegisterTemplate><commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode>"
                        f"<Params><param name='selectedGroup'>{gid}</param><param name='selectedTemplate'>{tid}</param>"
                        f"<param name='newMetadata'>JobTemplates/View/New/Template/MetaData</param><param name='originalKey'>Queues/Scan</param>"
                        f"<param name='newParamsData'>JobTemplates/View/New/Template/Params</param><param name='newTemplatePassword'></param>"
                        f"</Params></RegisterTemplate></Command></DeviceInformationModel>"
                    )
                    
                    r_reg = session.post(cgi_url, data=reg_xml.encode('utf-8'), headers=headers, verify=False, timeout=15)
                    if "STATUS_OK" in r_reg.text or "Success" in r_reg.text:
                        LOGGER.info("[_update_toshiba_ip_change] Successfully updated Toshiba template %s-%s to IP %s", gid, tid, new_ip)
                    else:
                        LOGGER.warning("[_update_toshiba_ip_change] Failed registering updated template %s-%s: %s", gid, tid, r_reg.text[:200])

        # Logout
        try:
            logout_xml = """<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><Command><Logout><commandNode>Authentication/UserCredential</commandNode></Logout></Command></DeviceInformationModel>"""
            session.post(cgi_url, data=logout_xml.encode('utf-8'), headers=headers, verify=False, timeout=5)
        except:
            pass
        finally:
            session.close()

    def _ip_change_polling_loop(self) -> None:
        LOGGER.info("IP change polling worker loop started")
        # Run immediately on start
        try:
            self.polling_when_ip_change()
        except Exception as exc:
            LOGGER.warning("Initial polling_when_ip_change call failed: %s", exc)

        while not self._stop_event.is_set():
            # Wait 2 minutes (120 seconds) checking stop event every second
            for _ in range(120):
                if self._stop_event.is_set():
                    break
                time.sleep(1.0)
            
            if self._stop_event.is_set():
                break
                
            try:
                self.polling_when_ip_change()
            except Exception as exc:
                LOGGER.warning("Periodic polling_when_ip_change call failed: %s", exc)
