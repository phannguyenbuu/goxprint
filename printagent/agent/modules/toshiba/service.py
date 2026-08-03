from __future__ import annotations

import logging
import time
import subprocess
import socket
import re
from typing import Any

import requests

from agent.modules.toshiba.common import (
    COUNTER_DATA_KEY,
    COUNTER_PAYLOADS,
    DEFAULT_TIMEOUT,
    STATUS_DATA_KEY,
    STATUS_PAYLOAD,
    bootstrap_session,
    compact_snippet,
    find_text,
    normalize_urls,
    parse_device_information_model,
    post_contentwebserver,
    post_contentwebserver_with_fallback,
)
from agent.modules.toshiba.counter import summarize_counter
from agent.modules.toshiba.status import summarize_status
from agent.services.api_client import APIClient, Printer


LOGGER = logging.getLogger(__name__)


class ToshibaSSLAdapter(requests.adapters.HTTPAdapter):
    """Custom SSL Adapter to bypass certificate check on Toshiba TopAccess."""
    def init_poolmanager(self, *args, **kwargs):
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        ctx.set_ciphers('DEFAULT:@SECLEVEL=1')
        kwargs['ssl_context'] = ctx
        return super().init_poolmanager(*args, **kwargs)



class ToshibaService:
    def __init__(self, api_client: APIClient, timeout: int = DEFAULT_TIMEOUT) -> None:
        self.api_client = api_client
        self.timeout = int(timeout or DEFAULT_TIMEOUT)

    def _timestamp(self) -> str:
        return time.strftime("%Y-%m-%d %H:%M:%S")

    @staticmethod
    def _landing_url(printer: Printer) -> str:
        return f"http://{printer.ip}/?MAIN=TOPACCESS"

    def _build_session(self, printer: Printer) -> tuple[requests.Session, str, str, str]:
        landing_url, origin = normalize_urls(self._landing_url(printer))
        content_url = f"{origin}/contentwebserver"
        session = requests.Session()
        session.headers.update(
            {
                "User-Agent": "Mozilla/5.0 (compatible; ToshibaTopAccessAgent/1.0)",
                "Accept": "*/*",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
                "Referer": landing_url,
            }
        )
        session.cookies.set("pageTrack", "MAIN=TOPACCESS")
        bootstrap_session(
            session=session,
            landing_url=landing_url,
            origin=origin,
            timeout=self.timeout,
        )
        csrf_token = str(session.cookies.get("Session") or "").strip()
        if not csrf_token:
            raise RuntimeError("No Toshiba TopAccess Session cookie found after bootstrap")
        return session, landing_url, content_url, csrf_token

    def _fetch_status_root(self, printer: Printer) -> tuple[Any, str, str]:
        session: requests.Session | None = None
        try:
            session, _landing_url, content_url, csrf_token = self._build_session(printer)
            raw_text, meta = post_contentwebserver(
                session=session,
                content_url=content_url,
                payload=STATUS_PAYLOAD,
                csrf_token=csrf_token,
                timeout=self.timeout,
                label="status",
            )
            root = parse_device_information_model(
                raw_text,
                source_label="status",
                response_meta=meta,
            )
            return root, raw_text, str(meta.get("final_url") or content_url)
        finally:
            if session is not None:
                session.close()

    def _fetch_counter_root(self, printer: Printer) -> tuple[Any, str, str]:
        session: requests.Session | None = None
        try:
            session, _landing_url, content_url, csrf_token = self._build_session(printer)
            raw_text, meta = post_contentwebserver_with_fallback(
                session=session,
                content_url=content_url,
                payloads=list(COUNTER_PAYLOADS),
                csrf_token=csrf_token,
                timeout=self.timeout,
                label="counter",
            )
            root = parse_device_information_model(
                raw_text,
                source_label="counter",
                response_meta=meta,
            )
            return root, raw_text, str(meta.get("final_url") or content_url)
        finally:
            if session is not None:
                session.close()

    def process_status(self, printer: Printer, should_post: bool) -> dict[str, Any]:
        root, raw_text, source_url = self._fetch_status_root(printer)
        data = summarize_status(root)
        payload = {
            "printer_name": printer.name,
            "ip": printer.ip,
            STATUS_DATA_KEY: data,
            "status_source": source_url,
            "html": raw_text,
            "status_debug": {
                "source": source_url,
                "html_len": len(raw_text or ""),
                "empty": not bool(data),
                "preview": compact_snippet(raw_text, 220),
            },
            "timestamp": self._timestamp(),
        }
        if should_post:
            self.api_client.post_data(payload)
        return payload

    def process_counter(self, printer: Printer, should_post: bool) -> dict[str, Any]:
        root, raw_text, source_url = self._fetch_counter_root(printer)
        data = summarize_counter(root)
        payload = {
            "printer_name": printer.name,
            "ip": printer.ip,
            COUNTER_DATA_KEY: data,
            "counter_source": source_url,
            "html": raw_text,
            "counter_debug": {
                "source": source_url,
                "html_len": len(raw_text or ""),
                "empty": not bool(data),
                "preview": compact_snippet(raw_text, 220),
            },
            "timestamp": self._timestamp(),
        }
        if should_post:
            self.api_client.post_data(payload)
        return payload

    def process_device_info(self, printer: Printer, should_post: bool) -> dict[str, Any]:
        root, raw_text, source_url = self._fetch_status_root(printer)
        data = {
            "Model Name": str(find_text(root, ".//MFP/ModelName") or "").strip(),
            "Machine Name": str(find_text(root, ".//MFP/ModelName") or "").strip(),
            "model_name": str(find_text(root, ".//MFP/ModelName") or "").strip(),
            "Host Name": str(find_text(root, ".//Network/Protocols/TCP-IP/hostName") or "").strip(),
            "Device State": str(find_text(root, ".//MFP/DeviceState") or "").strip(),
            "Printer State": str(find_text(root, ".//MFP/Printer/DeviceState") or "").strip(),
            "Main Memory": str(find_text(root, ".//MFP/System/MainMemory") or "").strip(),
            "Page Memory": str(find_text(root, ".//MFP/System/PageMemory") or "").strip(),
            "HDD": str(find_text(root, ".//MFP/System/HDD") or "").strip(),
        }
        data = {key: value for key, value in data.items() if value}
        payload = {
            "printer_name": printer.name,
            "ip": printer.ip,
            "device_info": data,
            "device_info_source": source_url,
            "html": raw_text,
            "timestamp": self._timestamp(),
        }
        if should_post:
            self.api_client.post_data(payload)
        return payload

    def setup_scan_destination(
        self,
        printer: Printer,
        username: str,
        email: str = "",
    ) -> dict[str, Any]:
        """Creates local SMB share folder and registers scan destination template on Toshiba TopAccess."""
        username_str = str(username or "").strip()
        safe_username = re.sub(r"[^A-Za-z0-9_-]", "", username_str.replace(" ", "_"))[:48] or "scan"
        share_name = f"Scan_{safe_username}"

        # 1. Resolve local path inside Temp
        from agent.services.runtime import user_temp_root, no_window_subprocess_kwargs
        goxprint_base = user_temp_root() / "smb"
        subfolder_path = goxprint_base / safe_username
        try:
            subfolder_path.mkdir(parents=True, exist_ok=True)
        except Exception:
            pass

        # 2. Configure Windows SMB users and services
        win_user = "scanner"
        win_pass = "Abc@123"

        LOGGER.info("[ToshibaService] Initializing Windows SMB configuration for user=%s path=%s", win_user, subfolder_path)
        try:
            # Enable SMB2
            subprocess.run('powershell -Command "Set-SmbServerConfiguration -EnableSMB2Protocol $true -Force"', shell=True, **no_window_subprocess_kwargs())
            # Start lanmanserver and lanmanworkstation services
            subprocess.run('sc config lanmanserver start= auto', shell=True, **no_window_subprocess_kwargs())
            subprocess.run('net start lanmanserver', shell=True, **no_window_subprocess_kwargs())
            subprocess.run('sc config lanmanworkstation start= auto', shell=True, **no_window_subprocess_kwargs())
            subprocess.run('net start lanmanworkstation', shell=True, **no_window_subprocess_kwargs())
            # Open Firewall
            subprocess.run('netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=Yes', shell=True, **no_window_subprocess_kwargs())

            # Check if user 'scanner' exists, create or update password
            check_user = subprocess.run(f'net user {win_user}', shell=True, capture_output=True, **no_window_subprocess_kwargs())
            if check_user.returncode != 0:
                subprocess.run(f'net user {win_user} {win_pass} /add', shell=True, **no_window_subprocess_kwargs())
            else:
                subprocess.run(f'net user {win_user} {win_pass}', shell=True, **no_window_subprocess_kwargs())

            # Configure Password Never Expires and hide from welcome screen
            subprocess.run(f'wmic UserAccount where Name="{win_user}" set PasswordExpires=False', shell=True, **no_window_subprocess_kwargs())
            reg_cmd = f'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\\SpecialAccounts\\UserList" /v {win_user} /t REG_DWORD /d 0 /f'
            subprocess.run(reg_cmd, shell=True, **no_window_subprocess_kwargs())
        except Exception as e:
            LOGGER.warning("[ToshibaService] Non-critical Windows user setup exception: %s", e)

        # 3. Create SMB Share using ShareManager
        from agent.utils.shares import ShareManager
        smb_manager = ShareManager()
        share_res = smb_manager.create_smb_share(
            share_name=share_name,
            local_path=subfolder_path,
            user=win_user,
            access="Full"
        )
        if not share_res.get("ok"):
            return {
                "ok": False,
                "error": f"Failed to create local SMB share: {share_res.get('error')}"
            }

        # 4. Resolve local IP and PC Hostname
        pc_name = socket.gethostname()
        local_ip = "127.0.0.1"
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect((printer.ip, 10443))
            local_ip = s.getsockname()[0]
            s.close()
        except Exception:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s.connect(("8.8.8.8", 80))
                local_ip = s.getsockname()[0]
                s.close()
            except Exception:
                pass

        # 5. Connect and register destination template on Toshiba Copier
        session = requests.Session()
        session.mount("https://", ToshibaSSLAdapter())
        base_urls = [
            f"https://{printer.ip}:10443",
            f"https://{printer.ip}",
            f"http://{printer.ip}",
        ]
        headers = {'Content-Type': 'text/plain; charset=UTF-8', 'Accept': '*/*'}

        # Resolve admin credentials
        pws = []
        if printer.password:
            pws.append(printer.password)
        if getattr(printer, "auth_password", ""):
            pws.append(getattr(printer, "auth_password"))
        for p in ["123456", "1234", "12345", "admin", ""]:
            if p not in pws:
                pws.append(p)
        user_name = printer.user or getattr(printer, "auth_user", "") or "admin"

        login_success = False
        active_pw = ""
        base_url = base_urls[0]

        LOGGER.info("[ToshibaService] Attempting TopAccess Login for printer %s...", printer.ip)
        for target_url in base_urls:
            if login_success:
                break
            for pw in pws:
                login_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<SetValue>
    <Authentication>
        <UserCredential>
            <userName>{user_name}</userName>
            <passwd>{pw}</passwd>
            <ipaddress>{local_ip}</ipaddress>
            <applicationType>TOP_ACCESS</applicationType>
        </UserCredential>
    </Authentication>
</SetValue>
<Command>
    <Login>
        <commandNode>Authentication/UserCredential</commandNode>
        <Params><appName>TOPACCESS</appName></Params>
    </Login>
</Command>
</DeviceInformationModel>"""
                try:
                    r = session.post(f"{target_url}/contentwebserver", data=login_xml, headers=headers, verify=False, timeout=6)
                    if r.status_code == 200 and "<LoginResult>Success</LoginResult>" in r.text:
                        login_success = True
                        active_pw = pw
                        base_url = target_url
                        break
                except Exception as e:
                    LOGGER.debug("[ToshibaService] Login attempt failed at %s with password '%s': %s", target_url, pw, e)

        if not login_success:
            LOGGER.warning("[ToshibaService] TopAccess Login failed across all URLs for printer %s, attempting template registration without login...", printer.ip)

        LOGGER.info("[ToshibaService] TopAccess active base_url: %s (password: '%s')", base_url, active_pw)

        # Register SCAN Group (Group 002) if not exists
        group_xml = """<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<SetValue>
    <JobTemplates>
        <View>
            <New>
                <Group>
                    <MetaData>
                        <groupName>SCAN</groupName>
                        <userName></userName>
                        <notificationEmail></notificationEmail>
                    </MetaData>
                </Group>
            </New>
        </View>
    </JobTemplates>
</SetValue>
<Command>
    <RegisterGroup>
        <commandNode>JobTemplates/GroupList</commandNode>
        <Params>
            <param name='selectedGroup'>002</param>
            <param name='newGroupPassword'></param>
            <param name='newMetadata'>JobTemplates/View/New/Group/MetaData</param>
        </Params>
    </RegisterGroup>
</Command>
</DeviceInformationModel>"""
        try:
            session.post(f"{base_url}/contentwebserver", data=group_xml, headers=headers, verify=False, timeout=8)
        except Exception as e:
            LOGGER.debug("[ToshibaService] Group 002 creation ignored (might already exist): %s", e)

        # Retrieve template list in Group 002 to find occupied slots
        get_templates_xml = """<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<GetValue>
    <JobTemplates>
        <View>
            <TemplateList/>
        </View>
    </JobTemplates>
</GetValue>
<Command>
    <GetTemplateList>
        <commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode>
        <Params>
            <param name='selectedGroup'>002</param>
            <param name='locale'>en_GB</param>
        </Params>
    </GetTemplateList>
</Command>
</DeviceInformationModel>"""
        occupied_slots = set()
        try:
            r = session.post(f"{base_url}/contentwebserver", data=get_templates_xml, headers=headers, verify=False, timeout=8)
            if r.status_code == 200:
                for m in re.finditer(r'<name>(\d{3})</name>', r.text):
                    occupied_slots.add(int(m.group(1)))
        except Exception as e:
            LOGGER.warning("[ToshibaService] Failed to retrieve template list: %s", e)

        # Find first free template slot (001 - 060)
        free_slot = None
        for i in range(1, 61):
            if i not in occupied_slots:
                free_slot = f"{i:03d}"
                break

        if not free_slot:
            return {
                "ok": False,
                "error": "No free template slots found in Group 002 (SCAN) on the copier."
            }

        # Register scan template at free slot
        store_path = f"\\\\{pc_name}\\{share_name}"
        template_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
  <SetValue>
    <JobTemplates>
      <View>
        <New>
          <Template>
            <OriginalKey>Queues/Scan</OriginalKey>
            <MetaData>
              <caption1>Scan To</caption1>
              <caption2></caption2>
              <userName></userName>
              <isPasswordProtected>false</isPasswordProtected>
              <autoStart>false</autoStart>
              <NotificationSettings>
                <email Enabled="false"></email>
                <onJobCompletion>false</onJobCompletion>
                <onError>false</onError>
              </NotificationSettings>
              <type>Normal</type>
            </MetaData>
            <Params>
              <saveFileName nameFormat="standard-date"></saveFileName>
            </Params>
          </Template>
        </New>
      </View>
    </JobTemplates>
  </SetValue>
  <SetValue>
    <Queues>
      <Scan>
        <WorkflowExecutionParameter>
          <ColorParameter>
            <ColorMode>FullColor</ColorMode>
          </ColorParameter>
          <ImageAdjustmentParameter>
            <ImageMode>Text</ImageMode>
            <ImageQuality>Middle</ImageQuality>
            <ImageRotate>0</ImageRotate>
            <Exposure>
              <ExposureMode>Manual</ExposureMode>
              <ExposureLevel>0</ExposureLevel>
            </Exposure>
            <BackgroundAdjustment>0</BackgroundAdjustment>
            <Contrast>0</Contrast>
            <Sharpness>0</Sharpness>
            <Saturation>0</Saturation>
            <RGBAdjustment>
              <Red>0</Red>
              <Green>0</Green>
              <Blue>0</Blue>
            </RGBAdjustment>
          </ImageAdjustmentParameter>
          <Scan>
            <Output>
              <LocalStore Enabled="false"></LocalStore>
              <SMBStore Enabled="true">
                <SMBStoreParameter>
                  <FileFormatInformation>
                    <FileFormat>PDFMulti</FileFormat>
                    <SecurePDF>
                      <Enabled>false</Enabled>
                    </SecurePDF>
                  </FileFormatInformation>
                  <StorePath>{store_path}</StorePath>
                  <UserName>{win_user}</UserName>
                  <Password>{win_pass}</Password>
                </SMBStoreParameter>
              </SMBStore>
              <FTPStore Enabled="false"></FTPStore>
              <NetwareStore Enabled="false"></NetwareStore>
            </Output>
          </Scan>
          <EmbeddedOCR>
            <Language>
              <primary></primary>
              <secondary></secondary>
            </Language>
            <autoRotation></autoRotation>
          </EmbeddedOCR>
        </WorkflowExecutionParameter>
      </Scan>
    </Queues>
  </SetValue>
  <Command>
    <RegisterTemplate>
      <commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode>
      <Params>
        <param name="selectedTemplate">{free_slot}</param>
        <param name="selectedGroup">002</param>
        <param name="newTemplatePassword"></param>
        <param name="newMetadata">JobTemplates/View/New/Template/MetaData</param>
        <param name="newParamsData">JobTemplates/View/New/Template/Params</param>
        <param name="originalKey">Queues/Scan</param>
      </Params>
    </RegisterTemplate>
  </Command>
</DeviceInformationModel>"""

        try:
            r = session.post(f"{base_url}/contentwebserver", data=template_xml, headers=headers, verify=False, timeout=12)
            
            # Clean logout
            logout_xml = """<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<Command>
    <Logout>
        <commandNode>Authentication/UserCredential</commandNode>
    </Logout>
</Command>
</DeviceInformationModel>"""
            try:
                session.post(f"{base_url}/contentwebserver", data=logout_xml, headers=headers, verify=False, timeout=3)
            except Exception:
                pass

            if r.status_code == 200 and "<RegisterTemplateResult>Success</RegisterTemplateResult>" in r.text:
                LOGGER.info("[ToshibaService] Copier registered template Scan To at slot %s!", free_slot)
                return {
                    "ok": True,
                    "printer_setup_ok": True,
                    "printer": {
                        "created_registration_no": free_slot,
                        "entry_name": f"Scan To ({free_slot})",
                    },
                    "ftp_host_ip": local_ip,
                    "ftp": {
                        "port": 445,
                    },
                    "ftp_url": f"smb://{local_ip}/{share_name}",
                    "ftp_upload_url": f"smb://{local_ip}/{share_name}",
                    "ftp_upload_path": share_name,
                }
            else:
                reason = "Unknown error"
                if r.status_code == 200:
                    m = re.search(r'<ErrorReason>([^<]+)</ErrorReason>', r.text)
                    if m:
                        reason = m.group(1)
                else:
                    reason = f"HTTP {r.status_code}"
                return {
                    "ok": True,
                    "printer_setup_ok": False,
                    "printer_error": f"Failed to register template on copier: {reason}",
                    "ftp_host_ip": local_ip,
                    "ftp": {
                        "port": 445,
                    },
                    "ftp_url": f"smb://{local_ip}/{share_name}",
                    "ftp_upload_url": f"smb://{local_ip}/{share_name}",
                    "ftp_upload_path": share_name,
                }
        except Exception as e:
            return {
                "ok": True,
                "printer_setup_ok": False,
                "printer_error": f"Connection/registration failed: {e}",
                "ftp_host_ip": local_ip,
                "ftp": {
                    "port": 445,
                },
                "ftp_url": f"smb://{local_ip}/{share_name}",
                "ftp_upload_url": f"smb://{local_ip}/{share_name}",
                "ftp_upload_path": share_name,
            }

    def delete_address_entries(self, printer, regs=None, entry_ids=None, **kwargs) -> bool:
        """Delete a registered template/address book entry from Toshiba TopAccess."""
        import requests, time, re
        from agent.modules.toshiba.utils import ToshibaSSLAdapter
        
        targets = regs or entry_ids or kwargs.get('registration_numbers') or []
        if not targets:
            return True

        import socket
        try:
            local_ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            local_ip = "0.0.0.0"

        session = requests.Session()
        try:
            session.mount("https://", ToshibaSSLAdapter())
        except Exception:
            pass

        headers = {'Content-Type': 'text/plain; charset=UTF-8', 'Accept': '*/*'}
        base_urls = [
            f"https://{printer.ip}:10443",
            f"https://{printer.ip}",
            f"http://{printer.ip}",
        ]
        pws = []
        if printer.password:
            pws.append(printer.password)
        if getattr(printer, "auth_password", ""):
            pws.append(getattr(printer, "auth_password"))
        for p in ["123456", "1234", "12345", "admin", ""]:
            if p not in pws:
                pws.append(p)
        user_name = printer.user or getattr(printer, "auth_user", "") or "admin"

        login_success = False
        base_url = base_urls[0]

        import logging
        LOGGER = logging.getLogger(__name__)
        LOGGER.info("[ToshibaService] Attempting TopAccess Login to delete %d entries on %s...", len(targets), printer.ip)

        for target_url in base_urls:
            if login_success:
                break
            for pw in pws:
                login_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<SetValue>
    <Authentication>
        <UserCredential>
            <userName>{user_name}</userName>
            <passwd>{pw}</passwd>
            <ipaddress>{local_ip}</ipaddress>
            <applicationType>TOP_ACCESS</applicationType>
        </UserCredential>
    </Authentication>
</SetValue>
<Command>
    <Login>
        <commandNode>Authentication/UserCredential</commandNode>
        <Params><appName>TOPACCESS</appName></Params>
    </Login>
</Command>
</DeviceInformationModel>"""
                try:
                    r = session.post(f"{target_url}/contentwebserver", data=login_xml, headers=headers, verify=False, timeout=6)
                    if r.status_code == 200 and "<LoginResult>Success</LoginResult>" in r.text:
                        login_success = True
                        base_url = target_url
                        break
                except Exception:
                    pass

        if not login_success:
            LOGGER.warning("[ToshibaService] TopAccess Login failed, attempting delete without login...")

        success_all = True
        for target in targets:
            for group in ["002", "001"]:
                del_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<Command>
    <DeleteTemplate>
        <commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode>
        <Params>
            <param name="selectedGroup">{group}</param>
            <param name="selectedTemplate">{target}</param>
            <param name="deleteTemplate">{target}</param>
        </Params>
    </DeleteTemplate>
</Command>
</DeviceInformationModel>"""
                try:
                    r = session.post(f"{base_url}/contentwebserver", data=del_xml, headers=headers, verify=False, timeout=6)
                    if r.status_code == 200 and "Success" in r.text:
                        LOGGER.info("[ToshibaService] Deleted entry %s from group %s", target, group)
                        break
                except Exception as e:
                    LOGGER.debug("Delete error for %s in group %s: %s", target, group, e)

        logout_xml = """<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<Command>
    <Logout>
        <commandNode>Authentication/UserCredential</commandNode>
    </Logout>
</Command>
</DeviceInformationModel>"""
        try:
            session.post(f"{base_url}/contentwebserver", data=logout_xml, headers=headers, verify=False, timeout=3)
        except Exception:
            pass

        return success_all

    def process_address_list(self, printer: Printer) -> dict[str, Any]:
        """Fetch registered template/address book entries from Toshiba TopAccess.

        Flow (matching reference repo photo_scan_setup_toshiba):
        1. Detect working base URL (HTTP/HTTPS)
        2. Login via XML SetValue/Command Login
        3. Set LICENSE_SETTINGS session payload
        4. GetTemplateList for each group
        5. Parse <Template> entries
        6. Logout
        """
        LOGGER.info("[ToshibaService] === START process_address_list for printer %s (IP: %s) ===", printer.name, printer.ip)
        start_time = time.time()

        import socket
        try:
            local_ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            local_ip = "0.0.0.0"

        session = requests.Session()
        try:
            session.mount("https://", ToshibaSSLAdapter())
        except Exception:
            pass

        xml_headers = {
            "Content-Type": "text/plain; charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Accept": "*/*",
        }
        plain_headers = {
            "Content-Type": "text/plain; charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Accept": "*/*",
        }

        # --- Step 1: Detect working base URL ---
        base_urls = [
            f"https://{printer.ip}:10443",
            f"https://{printer.ip}",
            f"http://{printer.ip}",
        ]
        cgi_endpoints = [
            "/contentwebserver",
            "/eBridge/cgi/TopAccess.cgi",
            "/cgi/TopAccess.cgi",
            "/TopAccess/cgi/TopAccess.cgi",
        ]

        # --- Step 2: Login ---
        pws = []
        if printer.password:
            pws.append(printer.password)
        if getattr(printer, "auth_password", ""):
            pws.append(getattr(printer, "auth_password"))
        for p in ["123456", "1234", "12345", "admin", ""]:
            if p not in pws:
                pws.append(p)
        user_name = printer.user or getattr(printer, "auth_user", "") or "admin"

        login_success = False
        base_url = base_urls[0]
        active_cgi = "/contentwebserver"

        LOGGER.info("[ToshibaService] Attempting TopAccess Login for address list on %s (user=%s, pw_count=%d)...", printer.ip, user_name, len(pws))
        for target_url in base_urls:
            # 1. Fetch Session Cookie for CSRF
            try:
                session.get(f"{target_url}/", verify=False, timeout=5)
                session_cookie = session.cookies.get("Session") or ""
                if session_cookie:
                    xml_headers["csrfpId"] = session_cookie
                    plain_headers["csrfpId"] = session_cookie
            except Exception:
                pass

            if login_success:
                break
            for pw in pws:
                login_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<GetValue>
    <Authentication>
        <UserCredential/>
    </Authentication>
</GetValue>
<SetValue>
    <Authentication>
        <UserCredential>
            <userName>{user_name}</userName>
            <passwd>{pw}</passwd>
            <ipaddress>{local_ip}</ipaddress>
            <applicationType>TOP_ACCESS</applicationType>
        </UserCredential>
    </Authentication>
</SetValue>
<Command>
    <Login>
        <commandNode>Authentication/UserCredential</commandNode>
        <Params><appName>TOPACCESS</appName></Params>
    </Login>
</Command>
</DeviceInformationModel>"""
                for cgi in cgi_endpoints:
                    try:
                        r = session.post(f"{target_url}{cgi}", data=login_xml, headers=plain_headers, verify=False, timeout=8)
                        LOGGER.info("[ToshibaService] Login POST %s%s pw='%s' => status=%d len=%d hasSuccess=%s",
                                    target_url, cgi, pw[:3] + "***", r.status_code, len(r.text),
                                    "<LoginResult>Success" in r.text)
                        if r.status_code == 200 and "<LoginResult>Success</LoginResult>" in r.text:
                            login_success = True
                            base_url = target_url
                            active_cgi = cgi
                            LOGGER.info("[ToshibaService] LOGIN OK via %s%s (user=%s)", target_url, cgi, user_name)
                            break
                    except Exception as e:
                        LOGGER.debug("[ToshibaService] Login attempt %s%s failed: %s", target_url, cgi, e)
                if login_success:
                    break
            if login_success:
                break

        if not login_success:
            LOGGER.warning("[ToshibaService] Login FAILED for %s. Trying unauthenticated template query...", printer.ip)

        cgi_url = f"{base_url}{active_cgi}"

        # --- Step 3: Set LICENSE_SETTINGS (required by some Toshiba firmware) ---
        try:
            license_xml = """<DeviceInformationModel><SetValue overrideDelta="false"><Payload><path>TopAccess/SessionInfo/LICENSE_SETTINGS</path><value>,METASCAN:NO,PDF-A:YES,EWB:YES,IPSEC:NO,</value></Payload></SetValue></DeviceInformationModel>"""
            session.post(cgi_url, data=license_xml, headers=plain_headers, verify=False, timeout=5)
        except Exception:
            pass

        # --- Step 4: GetTemplateList for each group ---
        groups = ["001", "002", "003", "000"]
        entries: list[dict[str, Any]] = []
        seen_ids: set[str] = set()

        for group in groups:
            get_templates_xml = f"""<DeviceInformationModel><GetValue><JobTemplates><View><TemplateList/></View></JobTemplates></GetValue><Command><GetTemplateList><commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode><Params><param name='selectedGroup'>{group}</param><param name='viewXpath'>JobTemplates/View/TemplateList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedTemplates'>false</param><param name='inputGroupPassword'></param><param name='locale'>en_GB</param></Params></GetTemplateList></Command></DeviceInformationModel>"""

            raw_resp_text = ""
            # Try active CGI first, then fallback to all CGI paths
            try_urls = [cgi_url]
            for bu in base_urls:
                for cgi in cgi_endpoints:
                    full = f"{bu}{cgi}"
                    if full not in try_urls:
                        try_urls.append(full)

            for url in try_urls:
                try:
                    r = session.post(url, data=get_templates_xml, headers=xml_headers, verify=False, timeout=10)
                    has_template = "<Template" in r.text
                    has_job = "<JobTemplates" in r.text
                    has_success = "<GetTemplateListResult>Success" in r.text
                    snippet = r.text[:200].replace('\n', ' ').replace('\r', '')
                    LOGGER.info("[ToshibaService] GetTemplates POST %s group=%s => status=%d len=%d hasTemplate=%s hasSuccess=%s snippet=%s",
                                url, group, r.status_code, len(r.text), has_template, has_success, snippet)
                    if r.status_code == 200 and (has_template or has_job or has_success):
                        raw_resp_text = r.text
                        break
                except Exception as e:
                    LOGGER.debug("[ToshibaService] GetTemplates %s group=%s => ERROR: %s", url, group, e)

            if raw_resp_text:
                try:
                    pattern = re.compile(r'<(?:\w+:)?Template[^>]*>(.*?)</(?:\w+:)?Template>', re.DOTALL)
                    for match in pattern.finditer(raw_resp_text):
                        block = match.group(1)
                        num_match = re.search(r'<(?:\w+:)?name>(\d+)</(?:\w+:)?name>', block)
                        cap1_match = re.search(r'<(?:\w+:)?caption1>([^<]*)</(?:\w+:)?caption1>', block)
                        cap2_match = re.search(r'<(?:\w+:)?caption2>([^<]*)</(?:\w+:)?caption2>', block)

                        # Extract SMB store info if available
                        smb_path_match = re.search(r'<(?:\w+:)?StorePath>([^<]*)</(?:\w+:)?StorePath>', block)
                        smb_user_match = re.search(r'<(?:\w+:)?UserName>([^<]*)</(?:\w+:)?UserName>', block)

                        reg_no = num_match.group(1) if num_match else "001"
                        if reg_no in seen_ids:
                            continue
                        seen_ids.add(reg_no)
                        c1 = cap1_match.group(1).strip() if cap1_match else ""
                        c2 = cap2_match.group(1).strip() if cap2_match else ""
                        disp_name = c2 or c1 or f"Template {reg_no}"
                        smb_path = smb_path_match.group(1).strip() if smb_path_match else ""
                        smb_user = smb_user_match.group(1).strip() if smb_user_match else ""
                        folder = smb_path or f"\\\\{printer.ip}\\scan"

                        entries.append({
                            "registration_no": reg_no.zfill(3),
                            "name": disp_name,
                            "key_display": disp_name,
                            "title_1": c1,
                            "title_2": c2,
                            "title_3": "",
                            "auth_user": smb_user,
                            "folder": folder,
                            "email": "",
                            "entry_id": reg_no,
                            "protocol": "SMB" if smb_path else "",
                            "is_agent_local": True,
                        })
                except Exception as e:
                    LOGGER.warning("[ToshibaService] Error parsing TopAccess XML template response: %s", e)

        # --- Step 6: Logout ---
        try:
            logout_xml = """<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><Command><Logout><commandNode>Authentication/UserCredential</commandNode></Logout></Command></DeviceInformationModel>"""
            session.post(cgi_url, data=logout_xml, headers=plain_headers, verify=False, timeout=5)
            LOGGER.info("[ToshibaService] Logged out from %s", printer.ip)
        except Exception:
            pass
        finally:
            session.close()

        elapsed = time.time() - start_time
        LOGGER.info("[ToshibaService] === DONE process_address_list for %s: %d entries in %.1fs ===", printer.ip, len(entries), elapsed)
        return {
            "printer_name": printer.name,
            "ip": printer.ip,
            "address_list": entries,
            "elapsed_seconds": round(elapsed, 2),
        }
