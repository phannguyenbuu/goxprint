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
        base_url = f"https://{printer.ip}:10443"
        headers = {'Content-Type': 'text/plain; charset=UTF-8', 'Accept': '*/*'}

        # Resolve admin credentials
        pws = []
        if printer.password:
            pws.append(printer.password)
        for p in ["123456", "1234", "12345", "admin", ""]:
            if p not in pws:
                pws.append(p)
        user_name = printer.user or "admin"

        login_success = False
        active_pw = ""

        LOGGER.info("[ToshibaService] Attempting TopAccess Login on %s...", base_url)
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
                r = session.post(f"{base_url}/contentwebserver", data=login_xml, headers=headers, verify=False, timeout=8)
                if r.status_code == 200 and "<LoginResult>Success</LoginResult>" in r.text:
                    login_success = True
                    active_pw = pw
                    break
            except Exception as e:
                LOGGER.debug("[ToshibaService] Login attempt failed with password '%s': %s", pw, e)

        if not login_success:
            return {
                "ok": False,
                "error": "Failed to login to Toshiba TopAccess. Please verify administrative credentials."
            }

        LOGGER.info("[ToshibaService] TopAccess logged in successfully using password '%s'", active_pw)

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

    def process_address_list(self, printer: Printer) -> dict[str, Any]:
        """Fetches address book / template scan destinations from Toshiba copier."""
        try:
            session = requests.Session()
            session.mount("https://", ToshibaSSLAdapter())
            base_url = f"https://{printer.ip}:10443"
            headers = {'Content-Type': 'text/plain; charset=UTF-8', 'Accept': '*/*'}

            get_templates_xml = """<?xml version="1.0" encoding="UTF-8"?>
<DeviceInformationModel>
<GetValue>
    <JobTemplates>
        <GroupList>
            <Group>
                <TemplateList/>
            </Group>
        </GroupList>
    </JobTemplates>
</GetValue>
<Command>
    <GetTemplateList>
        <commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode>
        <Params><appName>TOPACCESS</appName></Params>
    </GetTemplateList>
</Command>
</DeviceInformationModel>"""
            r = session.post(f"{base_url}/contentwebserver", data=get_templates_xml, headers=headers, verify=False, timeout=8)
            entries = []
            if r.status_code == 200:
                for match in re.finditer(r'<Template\s+id="([^"]+)">.*?<Name>([^<]*)</Name>', r.text, re.DOTALL):
                    t_id = match.group(1)
                    t_name = match.group(2)
                    entries.append({
                        "registration_no": t_id,
                        "name": t_name or f"Template {t_id}",
                        "email": "",
                        "folder": f"smb://{printer.ip}/Scan_{t_name}",
                    })
            return {"ok": True, "address_list": entries}
        except Exception as exc:
            LOGGER.warning("[ToshibaService] Failed to fetch template address list for %s: %s", printer.ip, exc)
            return {"ok": True, "address_list": []}

