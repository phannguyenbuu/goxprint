from __future__ import annotations

import logging
import re
import time
from typing import Any
from urllib.parse import urlparse

import requests

from agent.modules.ricoh.base import RicohServiceBase
from agent.services.api_client import Printer

LOGGER = logging.getLogger(__name__)


class RicohAddressWizardMixin(RicohServiceBase):
    _WIZARD_GET = "/web/entry/en/address/adrsGetUserWizard.cgi"
    _WIZARD_SET = "/web/entry/en/address/adrsSetUserWizard.cgi"

    @staticmethod
    def _clean_text(value: str) -> str:
        return re.sub(r"\s+", " ", str(value or "").strip())

    @staticmethod
    def _normalize_registration_no(value: str) -> str:
        digits = re.sub(r"\D", "", str(value or ""))
        if not digits:
            return ""
        return digits[-5:].zfill(5)

    @staticmethod
    def _field_text(fields: dict[str, Any], *keys: str, default: str = "") -> str:
        for key in keys:
            if key not in fields:
                continue
            value = str(fields.get(key, "") or "").strip()
            if value:
                return value
        return default

    @staticmethod
    def _multipart(items: list[tuple[str, str]]) -> list[tuple[str, tuple[None, str]]]:
        return [(key, (None, str(value))) for key, value in items]

    def _post_wizard_step(
        self,
        session: requests.Session,
        printer: Printer,
        items: list[tuple[str, str]],
        referer: str = "",
    ) -> str:
        url = f"http://{printer.ip}{self._WIZARD_SET}"
        headers = {
            "Referer": referer or f"http://{printer.ip}{self._WIZARD_GET}",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
        }
        logged_items = [(k, "[FILTERED]" if "Password" in k or "pw" in k.lower() else v) for k, v in items]
        LOGGER.info("[RicohWizard] Posting step to wizard (URL-encoded): URL=%s, items=%s", url, logged_items)
        try:
            resp = session.post(url, data=items, headers=headers, timeout=20)
            resp.raise_for_status()
            LOGGER.info("[RicohWizard] Step post success. HTTP Status: %d, response length: %d", resp.status_code, len(resp.text or ""))
            
            if self._is_session_full(resp.text):
                raise RuntimeError("The copier session limit has been exceeded. Please try again later. (SESSIONFULL)")
            if self._is_copier_busy(resp.text):
                raise RuntimeError("The copier is currently busy or in use by other functions. Please try again later.")
            
            # Save step response HTML for debugging
            try:
                import os
                step_name = "unknown"
                for k, v in items:
                    if k == "step":
                        step_name = v
                        break
                debug_dir = os.path.join("storage", "logs")
                os.makedirs(debug_dir, exist_ok=True)
                with open(os.path.join(debug_dir, f"last_step_{step_name}.html"), "w", encoding="utf-8") as f:
                    f.write(resp.text)
            except Exception:
                pass
                
            return resp.text
        except Exception as exc:
            LOGGER.error("[RicohWizard] Step post failed for %s: %s", printer.ip, exc)
            raise

    def _open_wizard(self, session: requests.Session, printer: Printer, wim_token: str = "") -> str:
        LOGGER.info("[RicohWizard] Starting _open_wizard for IP: %s (wimToken: %s)", printer.ip, wim_token)
        url = f"http://{printer.ip}{self._WIZARD_GET}"
        
        # Save wimsesid cookie before request
        saved_wimsesid = session.cookies.get("wimsesid", "")
        
        post_data = {
            "mode": "ADDUSER",
            "outputSpecifyModeIn": "DEFAULT",
        }
        if wim_token:
            post_data["wimToken"] = wim_token

        last_error: Exception | None = None
        attempts = [
            (
                "POST_URLENCODED",
                post_data
            ),
            (
                "POST",
                self._multipart(list(post_data.items())),
            ),
            ("GET", None),
        ]
        for method, payload in attempts:
            LOGGER.info("[RicohWizard] Attempting wizard open with method: %s, URL: %s", method, url)
            try:
                if method == "GET":
                    resp = session.get(
                        url,
                        headers={"Referer": f"http://{printer.ip}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"},
                        timeout=20,
                    )
                elif method == "POST":
                    resp = session.post(
                        url,
                        files=payload,
                        headers={"Referer": f"http://{printer.ip}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"},
                        timeout=20,
                    )
                else: # POST_URLENCODED
                    resp = session.post(
                        url,
                        data=payload,
                        headers={
                            "Referer": f"http://{printer.ip}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL",
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        timeout=20,
                    )
                resp.raise_for_status()
                if self._is_session_full(resp.text):
                    raise RuntimeError("The copier session limit has been exceeded. Please try again later. (SESSIONFULL)")
                if self._is_copier_busy(resp.text):
                    raise RuntimeError("The copier is currently busy or in use by other functions. Please try again later.")
                
                # Restore wimsesid if reset to "--" or empty
                current = session.cookies.get("wimsesid", "")
                if (not current or current == "--") and saved_wimsesid and saved_wimsesid != "--":
                    session.cookies.set("wimsesid", saved_wimsesid)
                    LOGGER.info("[RicohWizard] Restored wimsesid cookie to preserve session")
                    
                text_len = len(resp.text or "")
                LOGGER.info("[RicohWizard] Wizard open response received. Length: %d, HTTP Status: %d", text_len, resp.status_code)
                if resp.text.strip():
                    try:
                        import os
                        debug_dir = os.path.join("storage", "logs")
                        os.makedirs(debug_dir, exist_ok=True)
                        with open(os.path.join(debug_dir, "last_step_OPEN.html"), "w", encoding="utf-8") as f:
                            f.write(resp.text)
                    except Exception:
                        pass
                    return resp.text
            except (requests.exceptions.ConnectionError, requests.exceptions.Timeout, RuntimeError) as stop_exc:
                LOGGER.error("[RicohWizard] Wizard open stopped immediately for %s: %s", printer.ip, stop_exc)
                raise
            except Exception as exc:  # noqa: BLE001
                LOGGER.warning("[RicohWizard] Wizard open attempt (%s) failed for %s: %s", method, printer.ip, exc)
                last_error = exc
                continue
        if last_error is not None:
            LOGGER.error("[RicohWizard] All _open_wizard attempts failed for %s", printer.ip)
            raise last_error
        return ""

    def _fetch_wim_token(self, session: requests.Session, printer: Printer) -> tuple[str, str]:
        LOGGER.info("[RicohWizard] Fetching WIM token for IP: %s", printer.ip)
        
        # 1. Fetch address list page first to retrieve initial wimToken
        wim_token = ""
        try:
            list_html = self.read_address_list_with_client(session, printer)
            if list_html.strip():
                wim_token = self._extract_wim_token(list_html) or self._extract_hidden_inputs(list_html).get("wimToken", "")
                LOGGER.info("[RicohWizard] Initial wimToken from address list page: %s", bool(wim_token))
        except Exception as exc:
            LOGGER.warning("[RicohWizard] Failed to get initial token from address list: %s", exc)

        # 2. Try to open the wizard using the fetched token
        candidates: list[tuple[str, str]] = []
        try:
            initial_html = self._open_wizard(session, printer, wim_token=wim_token)
            if initial_html.strip():
                candidates.append(("wizard", initial_html))
        except Exception as exc:  # noqa: BLE001
            LOGGER.warning("[RicohWizard] _open_wizard exception in _fetch_wim_token for %s: %s", printer.ip, exc)
            raise

        LOGGER.info("[RicohWizard] Found %d candidate HTMLs for token extraction", len(candidates))
        for source, html in candidates:
            token = self._extract_wim_token(html) or self._extract_hidden_inputs(html).get("wimToken", "")
            LOGGER.info("[RicohWizard] Extraction from source '%s': token found='%s'", source, bool(token))
            if token:
                return token, source

        if wim_token:
            LOGGER.info("[RicohWizard] Falling back to initial wimToken from address list page")
            return wim_token, "address_list"

        LOGGER.warning("[RicohWizard] No token could be extracted from candidates for %s", printer.ip)
        return "", ""

    def _parse_folder_destination(self, folder: str) -> tuple[str, int, str]:
        raw = str(folder or "").strip()
        if not raw:
            return "", 21, "/"
        parsed = urlparse(raw if "://" in raw else f"ftp://{raw}")
        host = parsed.hostname or parsed.netloc or ""
        port = int(parsed.port or 21)
        
        path = parsed.path or "/"
        try:
            if hasattr(self, "api_client") and self.api_client is not None and hasattr(self.api_client, "config"):
                path_override = self.api_client.config.get_string("path").strip()
                if path_override:
                    path = path_override
        except Exception as exc:
            LOGGER.warning("[RicohWizard] Failed to read path override from config: %s", exc)

        if not path.startswith("/"):
            path = f"/{path}"
        return host, port, path

    def _next_registration_no(self, session: requests.Session, printer: Printer) -> str:
        LOGGER.info("[RicohWizard] Calculating next vacant registration number...")
        occupied = set()
        
        # 1. Try to fetch existing entries to find occupied numbers
        try:
            # We fetch the list page to get a wimToken first
            list_url = "/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
            list_html = self.authenticate_and_get(session, printer, list_url)
            wim_token = self._extract_wim_token(list_html) or self._extract_hidden_inputs(list_html).get("wimToken", "")
            
            # Parse entries from the HTML table
            for entry in self.parse_address_list(list_html):
                reg = re.sub(r"\D", "", entry.registration_no)
                if reg:
                    occupied.add(int(reg))
                    
            # Parse entries from AJAX for completeness
            if wim_token:
                ajax_raw = self.get_address_list_ajax_with_client(session, printer, wim_token=wim_token)
                if ajax_raw:
                    for entry in self.parse_ajax_address_list(ajax_raw):
                        reg = re.sub(r"\D", "", entry.registration_no)
                        if reg:
                            occupied.add(int(reg))
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout, RuntimeError) as stop_exc:
            LOGGER.error("[RicohWizard] Failed to fetch existing registration numbers due to critical error: %s", stop_exc)
            raise
        except Exception as e:
            LOGGER.warning("[RicohWizard] Failed to fetch existing registration numbers: %s", e)

        # 2. Find the first vacant number starting from 1
        vacant = 1
        if occupied:
            while vacant in occupied:
                vacant += 1
        else:
            # Fallback if fetching failed: select a random vacant number between 1 and 999
            import random
            vacant = random.randint(1, 999)
            
        LOGGER.info("[RicohWizard] Found next vacant registration number: %05d", vacant)
        return f"{vacant:05d}"
    @staticmethod
    def _extract_created_registration_no(html: str) -> str:
        """Extract the registration number that Ricoh assigned to the newly created entry.

        Ricoh firmwares return the confirmed entry index in various HTML formats:
        - As a <span> with id='span_entryIndexIn'
        - As a hidden/display <input name='entryIndexIn'>
        - Inline text inside a <td> labelled with entryIndexIn
        - As part of a JS variable assignment
        We try all known patterns before giving up.
        """
        patterns = [
            # Explicit span with id
            r'id=["\']?span_entryIndexIn["\']?[^>]*>\s*(\d{1,10})\s*<',
            r'span_entryIndexIn["\']?\s*>\s*(\d{1,10})\s*<',
            # Hidden / display input field (exact name match)
            r'<input[^>]+name=["\']entryIndexIn["\'][^>]+value=["\']([\d]{1,10})["\']',
            r'<input[^>]+value=["\']([\d]{1,10})["\'][^>]+name=["\']entryIndexIn["\']',
            # JS variable or inline text assignment
            r'entryIndexIn["\']?\s*[=:,]\s*["\']?(\d{1,10})["\']?',
            # Generic: any element whose text content is a 1-5 digit number near entryIndexIn
            r'entryIndexIn[^<>]*?>\s*(\d{1,10})\s*<',
            # Value attribute anywhere near the text entryIndex
            r'entryIndex[^>]*value=["\']([\d]{1,10})["\']',
            # Broader fallback – any td/span/div right after the label row
            r'<td[^>]*>\s*(\d{1,5})\s*</td>\s*</tr>\s*<tr[^>]*>\s*<td[^>]*>[^<]*(?:Address|Entry|Number)',
            # Original patterns kept as final fallback
            r'name="entryIndexIn"\s+value="(\d{1,10})"',
            r'entryIndexIn[">= ]\s*(\d{1,10})',
        ]
        for pattern in patterns:
            match = re.search(pattern, html, re.I | re.S)
            if match:
                val = re.sub(r'\D', '', match.group(1))
                if val:
                    return val.zfill(5)[-5:]
        
        # Log failure if nothing found for debugging
        try:
            import os
            debug_dir = os.path.join("storage", "logs")
            os.makedirs(debug_dir, exist_ok=True)
            with open(os.path.join(debug_dir, "last_confirm_html.html"), "w", encoding="utf-8") as f:
                f.write(html)
        except Exception:
            pass
            
        return ""

    def _verify_address_entry(
        self,
        session: requests.Session,
        printer: Printer,
        registration_no: str,
        name: str,
        folder: str,
    ) -> str | None:
        candidates: list[Any] = []
        success = False
        last_exc: Exception | None = None
        try:
            raw = self.get_address_list_ajax_with_client(session, printer)
            candidates.extend(self.parse_ajax_address_list(raw))
            success = True
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout, RuntimeError) as stop_exc:
            LOGGER.error("[RicohWizard] get_address_list_ajax failed during verification due to critical error: %s", stop_exc)
            raise
        except Exception as e:  # noqa: BLE001
            LOGGER.warning("[RicohWizard] get_address_list_ajax failed during verification: %s", e)
            last_exc = e
        try:
            raw = self.read_address_list_with_client(session, printer)
            candidates.extend(self.parse_address_list(raw))
            success = True
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout, RuntimeError) as stop_exc:
            LOGGER.error("[RicohWizard] read_address_list failed during verification due to critical error: %s", stop_exc)
            raise
        except Exception as e:  # noqa: BLE001
            LOGGER.warning("[RicohWizard] read_address_list failed during verification: %s", e)
            last_exc = e

        if not success and last_exc is not None:
            raise last_exc

        seen_ids: set[tuple[str, str, str]] = set()
        normalized_name = self._clean_text(name).lower()
        normalized_folder = self._clean_text(folder).lower()
        target_reg = self._normalize_registration_no(registration_no)
        
        # Helper to extract host from folder for robust comparison
        def extract_host(folder_str: str) -> str:
            cleaned = str(folder_str or "").replace("\\", "/").strip().lower()
            for proto in ["ftp://", "smb://", "http://", "https://"]:
                if cleaned.startswith(proto):
                    cleaned = cleaned[len(proto):]
            cleaned = cleaned.lstrip("/")
            parts = re.split(r"[/: ]", cleaned)
            return parts[0] if parts else ""

        # Helper to match names robustly (supporting email/username fallbacks)
        def names_match(actual: str, expected: str) -> bool:
            act = str(actual or "").strip().lower()
            exp = str(expected or "").strip().lower()
            if not act or not exp:
                return False
            if act == exp:
                return True
            # Ricoh display name limits to 16 or 20 characters, so long emails will be truncated
            # We allow prefix matching if the actual name has at least 8 characters
            if len(act) >= 8 and exp.startswith(act):
                return True
            if "@" in exp:
                username = exp.split("@")[0]
                if act == username or (len(act) >= 5 and username.startswith(act)):
                    return True
            if "@" in act:
                username = act.split("@")[0]
                if exp == username or (len(exp) >= 5 and username.startswith(exp)):
                    return True
            return False

        expected_host = extract_host(normalized_folder)
        
        verified_reg: str | None = None
        for entry in candidates:
            reg = self._normalize_registration_no(entry.registration_no)
            key = (reg, self._clean_text(entry.name).lower(), self._clean_text(entry.folder).lower())
            if key in seen_ids:
                continue
            seen_ids.add(key)
            if target_reg and reg == target_reg:
                if normalized_name:
                    actual_name = self._clean_text(entry.name).lower()
                    if names_match(actual_name, normalized_name):
                        verified_reg = reg
                        break
                    else:
                        LOGGER.warning("[RicohWizard] Reg no matches %s, but name '%s' does not match expected '%s'", reg, entry.name, name)
                else:
                    verified_reg = reg
                    break
            if normalized_name:
                actual_name = self._clean_text(entry.name).lower()
                if names_match(actual_name, normalized_name):
                    actual_folder = self._clean_text(entry.folder).lower()
                    actual_host = extract_host(actual_folder)
                    if (not normalized_folder or 
                        normalized_folder == actual_folder or 
                        (expected_host and expected_host == actual_host)):
                        verified_reg = reg
                        break

        if not verified_reg:
            # Write detailed debug log of verification failure to Dropbox for easy sync
            try:
                import os
                debug_dir = os.path.join("storage", "logs")
                os.makedirs(debug_dir, exist_ok=True)
                with open(os.path.join(debug_dir, "last_verification_failure.log"), "w", encoding="utf-8") as f:
                    f.write(f"Verification Failure Details\n")
                    f.write(f"============================\n")
                    f.write(f"Target Registration No: {target_reg} (original: {registration_no})\n")
                    f.write(f"Target Name: {name} (normalized: {normalized_name})\n")
                    f.write(f"Target Folder: {folder} (normalized: {normalized_folder})\n\n")
                    f.write(f"Candidate Address Book Entries Found ({len(candidates)}):\n")
                    for i, entry in enumerate(candidates):
                        f.write(f"  Entry #{i+1}:\n")
                        f.write(f"    Type: {entry.type}\n")
                        f.write(f"    Reg No: {entry.registration_no}\n")
                        f.write(f"    Name: {entry.name}\n")
                        f.write(f"    Email: {entry.email_address}\n")
                        f.write(f"    Folder: {entry.folder}\n")
                        f.write(f"    Entry ID: {entry.entry_id}\n\n")
            except Exception as log_exc:
                LOGGER.warning("[RicohWizard] Failed to write verification failure log: %s", log_exc)
                
        self._last_verification_candidates = candidates
        return verified_reg

    def create_address_user_wizard(
        self,
        printer: Printer,
        name: str,
        email: str = "",
        folder: str = "",
        user_code: str = "",
        fields: dict[str, Any] | None = None,
        desired_registration_no: str | None = None,
        allow_auto_update: bool = True,
        session: requests.Session | None = None,
    ) -> dict[str, Any]:
        close_session_at_end = False
        if session is None:
            session = self.create_http_client_auth_form_only(printer)
            close_session_at_end = True
        try:
            return self._create_address_user_wizard_internal(
                session, printer, name, email, folder, user_code, fields, desired_registration_no, allow_auto_update
            )
        finally:
            if close_session_at_end:
                try:
                    self._reset_web_session(session, printer)
                    session.close()
                    LOGGER.info("[RicohWizard] Request session logged out and closed successfully.")
                except Exception as close_exc:
                    LOGGER.debug("[RicohWizard] Failed to close session: %s", close_exc)

    def _create_address_user_wizard_internal(
        self,
        session: requests.Session,
        printer: Printer,
        name: str,
        email: str = "",
        folder: str = "",
        user_code: str = "",
        fields: dict[str, Any] | None = None,
        desired_registration_no: str | None = None,
        allow_auto_update: bool = True,
    ) -> dict[str, Any]:
        LOGGER.info(
            "[RicohWizard] === START create_address_user_wizard: printer=%s (IP=%s), name=%s, email=%s, folder=%s, desired_registration_no=%s ===",
            printer.name, printer.ip, name, email, folder, desired_registration_no
        )
        fields = dict(fields or {})

        registration_no = self._normalize_registration_no(desired_registration_no or "")
        if not registration_no:
            LOGGER.info("[RicohWizard] Registration no not provided, calculating next registration no...")
            registration_no = self._next_registration_no(session, printer)
        LOGGER.info("[RicohWizard] Using registration number: %s", registration_no)

        wim_token, wim_source = self._fetch_wim_token(session, printer)
        if not wim_token:
            LOGGER.error("[RicohWizard] Token not found for IP: %s", printer.ip)
            raise RuntimeError("Ricoh wizard token not found")
        LOGGER.info("[RicohWizard] Ricoh wizard token source: ip=%s source=%s, token=%s...", printer.ip, wim_source or "unknown", wim_token[:8])

        entry_display_name = self._clean_text(
            self._field_text(fields, "entryDisplayNameIn", "entryDisplayName", default=name)
        ) or self._clean_text(name)

        tag_value = self._field_text(fields, "entryTagInfoIn", default="1") or "1"
        tag_values = [tag_value] * 4

        base_items: list[tuple[str, str]] = [
            ("mode", "ADDUSER"),
            ("step", "BASE"),
            ("wimToken", wim_token),
            ("entryIndexIn", registration_no),
            ("entryNameIn", self._clean_text(name)[:20]),
            ("entryDisplayNameIn", entry_display_name[:16]),
        ]
        for value in tag_values[:4]:
            base_items.append(("entryTagInfoIn", value))
        if str(fields.get("entryTypeIn", "") or "").strip():
            base_items.append(("entryTypeIn", str(fields.get("entryTypeIn", "")).strip()))

        LOGGER.info("[RicohWizard] Submitting BASE step...")
        base_html = self._post_wizard_step(session, printer, base_items, referer="")
        wim_token = self._extract_wim_token(base_html) or wim_token
        steps_submitted = ["BASE"]

        email_clean = self._clean_text(email)
        if email_clean:
            mail_items: list[tuple[str, str]] = [
                ("mode", "ADDUSER"),
                ("step", "MAIL"),
                ("wimToken", wim_token),
                ("mailAddressIn", email_clean),
            ]
            LOGGER.info("[RicohWizard] Submitting MAIL step...")
            mail_html = self._post_wizard_step(session, printer, mail_items)
            wim_token = self._extract_wim_token(mail_html) or wim_token
            steps_submitted.append("MAIL")

        folder_clean = self._clean_text(folder)
        if folder_clean:
            folder_server_name, folder_port, folder_path = self._parse_folder_destination(folder_clean)
            folder_auth_user = self._field_text(fields, "folderAuthUserNameIn", "folderAuthUserName", default="")
            folder_password = self._field_text(
                fields,
                "folderPasswordIn",
                "wk_folderPasswordIn",
                "folderPassword",
                default="",
            )
            if not folder_password:
                folder_password = self._field_text(
                    fields,
                    "wk_folderPasswordConfirmIn",
                    "folderPasswordConfirmIn",
                    "folderPasswordConfirm",
                    default="",
                )
            if not folder_password:
                folder_auth_user = ""

            import base64
            encoded_password = base64.b64encode(folder_password.encode("utf-8")).decode("utf-8") if folder_password else ""

            folder_items: list[tuple[str, str]] = [
                ("mode", "ADDUSER"),
                ("step", "FOLDER"),
                ("wimToken", wim_token),
                ("folderProtocolIn", "FTP_O"),
                ("folderPortNoIn", str(folder_port or 21)),
                ("folderServerNameIn", folder_server_name),
                ("folderPathNameIn", folder_path),
                ("folderAuthUserNameIn", folder_auth_user),
                ("wk_folderPasswordIn", ""),
                ("folderPasswordIn", encoded_password),
                ("wk_folderPasswordConfirmIn", ""),
                ("folderPasswordConfirmIn", encoded_password),
            ]
            LOGGER.info("[RicohWizard] Submitting FOLDER step...")
            folder_html = self._post_wizard_step(session, printer, folder_items)
            wim_token = self._extract_wim_token(folder_html) or wim_token
            steps_submitted.append("FOLDER")

        confirm_items: list[tuple[str, str]] = [
            ("wimToken", wim_token),
        ]
        for step in steps_submitted:
            confirm_items.append(("stepListIn", step))
        confirm_items.extend([
            ("mode", "ADDUSER"),
            ("step", "CONFIRM"),
        ])
        LOGGER.info("[RicohWizard] Submitting CONFIRM step...")
        confirm_html = self._post_wizard_step(session, printer, confirm_items)
        extracted_no = self._extract_created_registration_no(confirm_html)
        if extracted_no:
            created_registration_no = extracted_no
            LOGGER.info("[RicohWizard] CONFIRM step complete. Extracted registration_no=%s from HTML.", created_registration_no)
        else:
            created_registration_no = registration_no
            LOGGER.warning(
                "[RicohWizard] CONFIRM step complete but could NOT extract registration_no from HTML. "
                "Falling back to pre-calculated no=%s. HTML snippet: %s",
                created_registration_no,
                (confirm_html or "")[:500].replace("\n", " "),
            )
            # Save full CONFIRM HTML for offline debugging on this PC
            try:
                import os as _os
                _debug_dir = _os.path.join("storage", "logs")
                _os.makedirs(_debug_dir, exist_ok=True)
                _debug_path = _os.path.join(_debug_dir, f"last_step_CONFIRM_debug_{printer.ip.replace('.', '_')}.html")
                with open(_debug_path, "w", encoding="utf-8") as _f:
                    _f.write(confirm_html or "")
                LOGGER.info("[RicohWizard] Saved CONFIRM HTML to %s for debugging.", _debug_path)
            except Exception as _save_exc:
                LOGGER.debug("[RicohWizard] Failed to save CONFIRM HTML debug file: %s", _save_exc)

        # Simulate clicking "To Address List" / "Back" to cleanly commit the wizard session and return to the main list
        try:
            list_url = f"http://{printer.ip}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
            LOGGER.info("[RicohWizard] Simulating click to 'To Address List' / 'Back': GET %s", list_url)
            session.get(list_url, timeout=10)
        except Exception as list_exc:
            LOGGER.debug("[RicohWizard] Failed to load address list after wizard CONFIRM: %s", list_exc)

        # Reset and re-login to commit transaction on copier before verification
        try:
            LOGGER.info("[RicohWizard] Resetting session and logging in again to commit transaction...")
            self._reset_web_session(session, printer)
            self._login(session, printer)
        except Exception as reset_exc:
            LOGGER.warning("[RicohWizard] Failed to reset/re-login session before verification: %s", reset_exc)

        # Give copier extra time to commit new entry to address book flash storage
        LOGGER.info("[RicohWizard] Waiting 3s for copier to commit entry before verification...")
        time.sleep(3.0)

        verified_reg_no = None
        for attempt in range(4):
            if attempt > 0:
                LOGGER.info("[RicohWizard] Waiting 3s before retry verify attempt %d/4...", attempt + 1)
                time.sleep(3.0)
            LOGGER.info("[RicohWizard] Verifying created entry on printer (attempt %d/4)...", attempt + 1)
            verified_reg_no = self._verify_address_entry(session, printer, created_registration_no, name, folder)
            if verified_reg_no:
                break
        if not verified_reg_no:
            LOGGER.error("[RicohWizard] Verification failed after creation for registration_no=%s, name=%s", created_registration_no, name)
            candidates = getattr(self, "_last_verification_candidates", [])
            candidates_str = ", ".join([f"(reg={c.registration_no}, name={c.name}, folder={c.folder})" for c in candidates])
            raise RuntimeError(
                f"Ricoh address entry not verified after create: registration_no={created_registration_no} name={name}. Found candidates: [{candidates_str}]"
            )
        created_registration_no = verified_reg_no
        LOGGER.info("[RicohWizard] Verification successful for registration_no=%s", created_registration_no)

        if created_registration_no.isdigit():
            self._address_index_hint_by_ip[printer.ip] = max(
                int(self._address_index_hint_by_ip.get(printer.ip, 0) or 0),
                int(created_registration_no),
            )

        LOGGER.info("[RicohWizard] === FINISH create_address_user_wizard: Success ===")
        return {
            "printer_name": printer.name,
            "ip": printer.ip,
            "ok": True,
            "endpoint": self._WIZARD_SET,
            "created_registration_no": created_registration_no,
            "entry_name": self._clean_text(name),
            "entry_display_name": entry_display_name,
            "email": self._clean_text(email),
            "folder": folder,
            "folder_server_name": folder_server_name,
            "folder_port": folder_port,
            "folder_path": folder_path,
            "http_status": 200,
            "verified": True,
            "timestamp": self._timestamp(),
        }

    def modify_address_user_wizard(
        self,
        printer: Printer,
        registration_no: str,
        name: str = "",
        email: str = "",
        folder: str = "",
        user_code: str = "",
        fields: dict[str, Any] | None = None,
        entry_id: str | None = None,
        session: requests.Session | None = None,
    ) -> dict[str, Any]:
        self.delete_address_entries(printer, [registration_no], entry_ids=[entry_id] if entry_id else None, verify=False, session=session)
        return self.create_address_user_wizard(
            printer,
            name=name,
            email=email,
            folder=folder,
            user_code=user_code,
            fields=fields,
            desired_registration_no=registration_no,
            allow_auto_update=False,
            session=session,
        )
