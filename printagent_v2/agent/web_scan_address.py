from __future__ import annotations

import logging
import re
import time
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlencode

from flask import jsonify, request

from agent.web_discovery import _normalize_ipv4
from agent.web_scan_helpers import create_local_ftp_for_address, resolve_target_printer
from agent.web_scan_support import (
    _detect_scan_protocol_from_html,
    _load_scan_protocol_prefs,
    _normalize_scan_protocol,
    _register_scan_root,
    _sanitize_ftp_name,
    _save_scan_protocol_prefs,
)

LOGGER = logging.getLogger(__name__)


def _extract_wim_token_quick(html: str) -> str:
    """Fast wimToken extraction."""
    match = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)["\']?', html, re.I)
    if match:
        return match.group(1)
    match = re.search(r'name\s*=\s*["\']?wimToken["\']?\s+value\s*=\s*["\']?([^"\'\s>]+)["\']?', html, re.I)
    return match.group(1) if match else ""


def _create_address_direct_wizard(session, ip: str, wim_token: str, name: str, email: str, folder_url: str) -> dict[str, Any]:
    """
    Create address book entry using the proven wizard flow.
    Key: preserves wimsesid cookie around adrsGetUserWizard.cgi call.
    """
    import requests as _requests
    base_url = f"http://{ip}"
    list_url = f"{base_url}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    wizard_set_url = f"{base_url}/web/entry/en/address/adrsSetUserWizard.cgi"

    def _post_step(data_str: str) -> str:
        headers = {
            "Referer": f"{base_url}/web/entry/en/address/adrsGetUserWizard.cgi",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
        }
        resp = session.post(wizard_set_url, data=data_str, headers=headers, timeout=10)
        return resp.text

    # 1. Load address list page (establishes server context)
    LOGGER.info("[DirectWizard] Loading address list page for %s", ip)
    resp = session.get(list_url, timeout=10)
    page_token = _extract_wim_token_quick(resp.text)
    if page_token:
        wim_token = page_token

    # 2. Open wizard (preserving wimsesid)
    LOGGER.info("[DirectWizard] Opening wizard for %s", ip)
    saved_wimsesid = session.cookies.get("wimsesid", "")
    try:
        open_url = f"{base_url}/web/entry/en/address/adrsGetUserWizard.cgi"
        resp = session.post(
            open_url,
            data=f"mode=ADDUSER&outputSpecifyModeIn=DEFAULT&wimToken={wim_token}",
            headers={"Content-Type": "application/x-www-form-urlencoded", "Referer": list_url},
            timeout=10,
        )
        new_token = _extract_wim_token_quick(resp.text)
        if new_token:
            wim_token = new_token
    except Exception as exc:
        LOGGER.warning("[DirectWizard] Wizard open failed: %s", exc)
    # Restore wimsesid if reset to "--"
    current = session.cookies.get("wimsesid", "")
    if (not current or current == "--") and saved_wimsesid and saved_wimsesid != "--":
        session.cookies.set("wimsesid", saved_wimsesid)

    # 3. Find next registration number
    reg_numbers = re.findall(r'<nobr>(\d{5})</nobr>', resp.text)
    # Also check from address list page
    if not reg_numbers:
        resp2 = session.get(list_url, timeout=8)
        reg_numbers = re.findall(r'<nobr>(\d{5})</nobr>', resp2.text)
    highest = max((int(r) for r in reg_numbers), default=0)
    reg_no = f"{highest + 1:05d}"
    LOGGER.info("[DirectWizard] Next registration no: %s", reg_no)

    # 4. Parse FTP folder URL
    from urllib.parse import urlparse
    parsed = urlparse(folder_url if "://" in folder_url else f"ftp://{folder_url}")
    ftp_host = parsed.hostname or ""
    ftp_port = str(parsed.port or 21)
    ftp_path = parsed.path or "/"

    # 5. Wizard steps (URL-encoded POST)
    LOGGER.info("[DirectWizard] BASE step: name=%s reg=%s", name, reg_no)
    html = _post_step(f"mode=ADDUSER&step=BASE&wimToken={wim_token}&entryIndexIn={reg_no}&entryNameIn={name}&entryDisplayNameIn={name}&entryTagInfoIn=1&entryTagInfoIn=1&entryTagInfoIn=1&entryTagInfoIn=1&entryTypeIn=1")
    wim_token = _extract_wim_token_quick(html) or wim_token

    LOGGER.info("[DirectWizard] MAIL step: email=%s", email)
    html = _post_step(f"mode=ADDUSER&step=MAIL&wimToken={wim_token}&mailAddressIn={email}")
    wim_token = _extract_wim_token_quick(html) or wim_token

    LOGGER.info("[DirectWizard] FOLDER step: ftp://%s:%s%s", ftp_host, ftp_port, ftp_path)
    html = _post_step(f"mode=ADDUSER&step=FOLDER&wimToken={wim_token}&folderProtocolIn=FTP_O&folderPortNoIn={ftp_port}&folderServerNameIn={ftp_host}&folderPathNameIn={ftp_path}&folderAuthUserNameIn=&folderPasswordIn=&wk_folderPasswordIn=&folderPasswordConfirmIn=&wk_folderPasswordConfirmIn=")
    wim_token = _extract_wim_token_quick(html) or wim_token

    LOGGER.info("[DirectWizard] CONFIRM step")
    html = _post_step(f"mode=ADDUSER&step=CONFIRM&wimToken={wim_token}&stepListIn=BASE&stepListIn=MAIL&stepListIn=FOLDER")

    # Check for errors
    if "Session timed out" in html:
        raise RuntimeError("Session timed out during wizard CONFIRM step")

    LOGGER.info("[DirectWizard] Wizard completed for %s on %s", name, ip)
    return {
        "ok": True,
        "created_registration_no": reg_no,
        "entry_name": name,
        "email": email,
        "folder": folder_url,
        "ip": ip,
    }


def register_scan_address_routes(app):
    config = app.config["APP_CONFIG"]
    api_client = app.config["API_CLIENT"]
    ricoh_service = app.config["RICOH_SERVICE"]

    @app.get("/api/scan/address-list")
    def api_scan_address_list() -> Any:
        ip = str(request.args.get("ip", "")).strip()
        user = str(request.args.get("user", "")).strip()
        password = str(request.args.get("password", "")).strip()
        mode = str(request.args.get("mode", "")).strip().lower()
        trace_id = f"scan-{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
        if not ip:
            LOGGER.warning("Scan address list rejected: trace_id=%s reason=missing_ip", trace_id)
            return jsonify({"ok": False, "error": "Missing ip"}), 400
        LOGGER.info(
            "Scan address list request: trace_id=%s ip=%s mode=%s user_provided=%s password_provided=%s remote_addr=%s",
            trace_id,
            ip,
            mode or "-",
            bool(user),
            bool(password),
            request.remote_addr or "-",
        )
        if mode == "adrslistall":
            try:
                import time as _time
                _adrs_start = _time.time()
                target = resolve_target_printer(config, api_client, ip=ip, user=user, password=password)
                session = ricoh_service.create_http_client_auth_form_only(target)
                
                # After login, session is verified against adrsList.cgi already.
                # Fetch address list directly (login already confirmed session works)
                html = ""
                for path in ["/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL", "/web/guest/en/address/adrsList.cgi?modeIn=LIST_ALL"]:
                    try:
                        html = ricoh_service.authenticate_and_get(session, target, path)
                        if html and ("Address List" in html or "adrsList" in html) and "login.cgi" not in html:
                            break
                    except Exception:
                        continue
                
                entries = ricoh_service.parse_address_list(html) if html else []
                
                # Extract wimToken and try AJAX for richer data
                wim_token = ricoh_service._extract_wim_token(html) if html else ""
                ajax_raw = ""
                ajax_entries = []
                try:
                    ajax_raw = ricoh_service.get_address_list_ajax_with_client(session, target, wim_token=wim_token)
                    ajax_entries = ricoh_service.parse_ajax_address_list(ajax_raw)
                    if ajax_entries:
                        summary = entries[0] if entries else None
                        merged_by_reg: dict[str, Any] = {}
                        merged_order: list[str] = []

                        def _score(item: Any) -> int:
                            score = 0
                            if str(getattr(item, "name", "") or "").strip() not in {"", "-", "---"}:
                                score += 1
                            if str(getattr(item, "email_address", "") or "").strip() not in {"", "-", "---"}:
                                score += 1
                            if str(getattr(item, "folder", "") or "").strip() not in {"", "-", "---"}:
                                score += 1
                            if str(getattr(item, "user_code", "") or "").strip() not in {"", "-", "---"}:
                                score += 1
                            return score

                        for source in [entries[1:] if len(entries) > 1 else [], ajax_entries]:
                            for item in source:
                                reg = str(getattr(item, "registration_no", "") or "").strip()
                                name_key = str(getattr(item, "name", "") or "").strip().lower()
                                if reg and reg != "-":
                                    # Some devices may return duplicated registration_no for newly-created rows.
                                    # Keep per (registration_no, name) so we do not collapse distinct entries.
                                    key = f"reg::{reg}::name::{name_key}"
                                else:
                                    key = f"name::{name_key}"
                                if key not in merged_by_reg:
                                    merged_by_reg[key] = item
                                    merged_order.append(key)
                                else:
                                    if _score(item) >= _score(merged_by_reg[key]):
                                        merged_by_reg[key] = item

                        merged_entries = [merged_by_reg[key] for key in merged_order]
                        entries = ([summary] if summary else []) + merged_entries
                except Exception:  # noqa: BLE001
                    ajax_raw = ""
                    ajax_entries = []
                # If LIST_ALL + AJAX still yields only summary, fallback to full parser flow.
                non_summary = max(0, len(entries) - 1)
                if non_summary == 0:
                    try:
                        fallback_payload = ricoh_service.process_address_list(target, trace_id=trace_id)
                        if isinstance(fallback_payload, dict):
                            fallback_payload.setdefault("debug", {})
                            if isinstance(fallback_payload["debug"], dict):
                                fallback_payload["debug"]["mode"] = "adrsListAll_fallback_process_address_list"
                                fallback_payload["debug"]["trace_id"] = trace_id
                        return jsonify({"ok": True, "payload": fallback_payload})
                    except Exception:  # noqa: BLE001
                        pass
                payload = {
                    "printer_name": target.name,
                    "ip": target.ip,
                    "address_list": [
                        {
                            "type": item.type,
                            "registration_no": item.registration_no,
                            "name": item.name,
                            "user_code": item.user_code,
                            "date_last_used": item.date_last_used,
                            "email_address": item.email_address,
                            "folder": item.folder,
                            "entry_id": getattr(item, "entry_id", "") or "",
                        }
                        for item in entries
                    ],
                    "debug": {
                        "trace_id": trace_id,
                        "mode": "adrsListAll",
                        "html_len": len(html),
                        "entries": len(entries),
                        "ajax_len": len(ajax_raw),
                        "ajax_entries": len(ajax_entries),
                    },
                    "elapsed_seconds": round(_time.time() - _adrs_start, 2),
                }
                return jsonify({"ok": True, "payload": payload})
            except Exception as exc:  # noqa: BLE001
                LOGGER.exception("Scan address list adrsListAll failed: trace_id=%s ip=%s", trace_id, ip)
                return jsonify({"ok": False, "error": str(exc), "trace_id": trace_id}), 500

        def _looks_like_login_endpoint_500(exc: Exception) -> bool:
            text = str(exc or "").lower()
            return (
                "500 server error" in text
                and "login.cgi" in text
                and "websys/webarch" in text
            )
        try:
            # Force login-first flow for address list: if caller does not provide credentials,
            # default to admin/admin before fetching address list.
            target = resolve_target_printer(config, api_client, ip=ip, user=user, password=password)
            LOGGER.info(
                "Scan address list single attempt: trace_id=%s ip=%s printer_name=%s effective_user=%s has_password=%s",
                trace_id,
                target.ip,
                target.name,
                bool(str(target.user or "").strip()),
                bool(str(target.password or "").strip()),
            )
            payload = ricoh_service.process_address_list(target, trace_id=trace_id)
            if isinstance(payload, dict):
                payload.setdefault("debug", {})
                if isinstance(payload["debug"], dict):
                    payload["debug"]["trace_id"] = trace_id
                    payload["debug"]["auth_mode"] = "single_attempt"
                    payload["debug"]["auth_round"] = 1
            return jsonify({"ok": True, "payload": payload})
        except Exception as exc:  # noqa: BLE001
            if _looks_like_login_endpoint_500(exc):
                LOGGER.warning(
                    "Scan address list login endpoint 500, fallback to no-auth: trace_id=%s ip=%s",
                    trace_id,
                    ip,
                )
                try:
                    target = resolve_target_printer(config, api_client, ip=ip, user="", password="")
                    target.user = ""
                    target.password = ""
                    payload = ricoh_service.process_address_list(target, trace_id=trace_id)
                    if isinstance(payload, dict):
                        payload.setdefault("debug", {})
                        if isinstance(payload["debug"], dict):
                            payload["debug"]["trace_id"] = trace_id
                            payload["debug"]["auth_mode"] = "fallback_no_auth_after_login_500"
                            payload["debug"]["auth_round"] = 2
                    return jsonify({"ok": True, "payload": payload})
                except Exception as fallback_exc:  # noqa: BLE001
                    LOGGER.exception(
                        "Scan address list fallback no-auth failed: trace_id=%s ip=%s",
                        trace_id,
                        ip,
                    )
                    return (
                        jsonify(
                            {
                                "ok": False,
                                "error": str(fallback_exc),
                                "trace_id": trace_id,
                                "primary_error": str(exc),
                            }
                        ),
                        500,
                    )
            LOGGER.exception("Scan address list failed: trace_id=%s ip=%s", trace_id, ip)
            return jsonify({"ok": False, "error": str(exc), "trace_id": trace_id}), 500

    @app.post("/api/scan/address-create")
    def api_scan_address_create() -> Any:
        body = request.get_json(silent=True) or {}
        trace_id = f"scan-create-{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
        ip = str(body.get("ip", "")).strip()
        user = str(body.get("user", "")).strip()
        password = str(body.get("password", "")).strip()
        name = str(body.get("name", "")).strip()
        email = str(body.get("email", "")).strip()
        folder = str(body.get("folder", "")).strip()
        user_code = str(body.get("user_code", "")).strip()
        fields = body.get("fields", {})
        if not ip:
            LOGGER.warning("Scan address create rejected: trace_id=%s reason=missing_ip", trace_id)
            return jsonify({"ok": False, "error": "Missing ip"}), 400
        if not name:
            LOGGER.warning("Scan address create rejected: trace_id=%s ip=%s reason=missing_name", trace_id, ip)
            return jsonify({"ok": False, "error": "Missing name"}), 400
        if fields is not None and not isinstance(fields, dict):
            LOGGER.warning("Scan address create rejected: trace_id=%s ip=%s reason=invalid_fields_type", trace_id, ip)
            return jsonify({"ok": False, "error": "fields must be object"}), 400
        try:
            # Address-create flow is FTP-first by design.
            selected_protocol = "FTP"
            LOGGER.info(
                "Scan address create request: trace_id=%s ip=%s name=%s email_set=%s folder_set=%s user_code_set=%s fields_count=%s auth_mode=%s",
                trace_id,
                ip,
                name,
                bool(email),
                bool(folder),
                bool(user_code),
                len(fields) if isinstance(fields, dict) else 0,
                "database_or_provided",
            )
            target = resolve_target_printer(config, api_client, ip=ip, user=user, password=password)
            ftp_payload: dict[str, Any] | None = None
            folder_final = folder
            if selected_protocol == "FTP":
                ftp_payload = create_local_ftp_for_address(config, ricoh_service, name, printer_ip=ip)
                LOGGER.info(
                    "Scan address create FTP step: trace_id=%s ip=%s ftp_name=%s ftp_url=%s ftp_ok=%s",
                    trace_id,
                    ip,
                    str(ftp_payload.get("ftp_name", "")).strip(),
                    str(ftp_payload.get("upload_url", "") or ftp_payload.get("ftp_url", "")).strip(),
                    bool(ftp_payload.get("ok", False)),
                )
                if not bool(ftp_payload.get("ok", False)):
                    LOGGER.warning(
                        "Scan address create FTP setup failed: trace_id=%s ip=%s name=%s error=%s",
                        trace_id,
                        ip,
                        name,
                        str((ftp_payload.get("result") or {}).get("error", "")).strip(),
                    )
                    return jsonify(
                        {
                            "ok": False,
                            "error": "FTP setup failed before address creation",
                            "trace_id": trace_id,
                            "protocol": selected_protocol,
                            "ftp": ftp_payload,
                        }
                    ), 500
                folder_final = str(ftp_payload.get("upload_url", "") or ftp_payload.get("ftp_url", "")).strip() or folder_final
                LOGGER.info(
                    "Scan address create folder overridden by FTP: trace_id=%s ip=%s folder=%s",
                    trace_id,
                    ip,
                    folder_final,
                )
                ftp_warning = str(ftp_payload.get("warning", "") or "").strip()
                if ftp_warning:
                    LOGGER.warning(
                        "Scan address create FTP warning: trace_id=%s ip=%s warning=%s",
                        trace_id,
                        ip,
                        ftp_warning,
                    )
            merged_fields: dict[str, Any] = {"entryTypeIn": "1"}
            if isinstance(fields, dict):
                merged_fields.update(fields)
            # Use the proven direct wizard flow (preserves wimsesid, URL-encoded POST)
            session = ricoh_service.create_http_client(target, authenticated=True)
            payload = _create_address_direct_wizard(
                session,
                ip=ip,
                wim_token="",  # Will be fetched from address list page
                name=name,
                email=email,
                folder_url=folder_final,
            )
            try:
                session.close()
            except Exception:
                pass
            LOGGER.info(
                "Scan address create success: trace_id=%s ip=%s http_status=%s verify_count=%s",
                trace_id,
                ip,
                payload.get("http_status") if isinstance(payload, dict) else "-",
                payload.get("verify_count") if isinstance(payload, dict) else "-",
            )
            return jsonify(
                {
                    "ok": True,
                    "payload": payload,
                    "trace_id": trace_id,
                    "protocol": selected_protocol,
                    "folder_used": folder_final,
                    "ftp": ftp_payload,
                }
            )
        except Exception as exc:  # noqa: BLE001
            LOGGER.exception("Scan address create failed: trace_id=%s ip=%s", trace_id, ip)
            return jsonify({"ok": False, "error": str(exc), "trace_id": trace_id}), 500

    @app.post("/api/scan/address-delete")
    def api_scan_address_delete() -> Any:
        body = request.get_json(silent=True) or {}
        trace_id = f"scan-delete-{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
        ip = str(body.get("ip", "")).strip()
        user = str(body.get("user", "")).strip()
        password = str(body.get("password", "")).strip()
        registration_no = str(body.get("registration_no", "")).strip()
        entry_id = str(body.get("entry_id", "")).strip()
        confirm = bool(body.get("confirm", False))
        if not ip:
            LOGGER.warning("Scan address delete rejected: trace_id=%s reason=missing_ip", trace_id)
            return jsonify({"ok": False, "error": "Missing ip"}), 400
        if not registration_no and not entry_id:
            LOGGER.warning("Scan address delete rejected: trace_id=%s ip=%s reason=missing_registration_no", trace_id, ip)
            return jsonify({"ok": False, "error": "Missing registration_no or entry_id"}), 400
        try:
            LOGGER.info(
                "Scan address delete request: trace_id=%s ip=%s registration_no=%s entry_id=%s auth_mode=%s",
                trace_id,
                ip,
                registration_no,
                entry_id,
                "database_or_provided",
            )
            target = resolve_target_printer(config, api_client, ip=ip, user=user, password=password)
            payload = ricoh_service.delete_address_entries(
                target,
                [registration_no],
                entry_ids=[entry_id] if entry_id else None,
                verify=not confirm,
            )
            LOGGER.info(
                "Scan address delete success: trace_id=%s ip=%s deleted_count=%s",
                trace_id,
                ip,
                payload.get("deleted_count") if isinstance(payload, dict) else "-",
            )
            return jsonify({"ok": True, "payload": payload, "trace_id": trace_id})
        except Exception as exc:  # noqa: BLE001
            LOGGER.exception("Scan address delete failed: trace_id=%s ip=%s registration_no=%s", trace_id, ip, registration_no)
            return jsonify({"ok": False, "error": str(exc), "trace_id": trace_id}), 500

    @app.post("/api/scan/address-modify")
    def api_scan_address_modify() -> Any:
        body = request.get_json(silent=True) or {}
        trace_id = f"scan-modify-{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
        ip = str(body.get("ip", "")).strip()
        user = str(body.get("user", "")).strip()
        password = str(body.get("password", "")).strip()
        registration_no = str(body.get("registration_no", "")).strip()
        entry_id = str(body.get("entry_id", "")).strip()
        name = str(body.get("name", "")).strip()
        email = str(body.get("email", "")).strip()
        folder = str(body.get("folder", "")).strip()
        user_code = str(body.get("user_code", "")).strip()
        fields = body.get("fields", {})
        if not ip:
            LOGGER.warning("Scan address modify rejected: trace_id=%s reason=missing_ip", trace_id)
            return jsonify({"ok": False, "error": "Missing ip"}), 400
        if not registration_no:
            LOGGER.warning("Scan address modify rejected: trace_id=%s ip=%s reason=missing_registration_no", trace_id, ip)
            return jsonify({"ok": False, "error": "Missing registration_no"}), 400
        if fields is not None and not isinstance(fields, dict):
            LOGGER.warning("Scan address modify rejected: trace_id=%s ip=%s reason=invalid_fields_type", trace_id, ip)
            return jsonify({"ok": False, "error": "fields must be object"}), 400
        try:
            LOGGER.info(
                "Scan address modify request: trace_id=%s ip=%s registration_no=%s name_set=%s email_set=%s folder_set=%s user_code_set=%s fields_count=%s auth_mode=%s",
                trace_id,
                ip,
                registration_no,
                bool(name),
                bool(email),
                bool(folder),
                bool(user_code),
                len(fields) if isinstance(fields, dict) else 0,
                "database_or_provided",
            )
            target = resolve_target_printer(config, api_client, ip=ip, user=user, password=password)
            LOGGER.info(
                "Scan address modify (recreate) request: trace_id=%s ip=%s registration_no=%s entry_id=%s",
                trace_id,
                ip,
                registration_no,
                entry_id,
            )
            if entry_id:
                ricoh_service.delete_address_entries(target, [registration_no], entry_ids=[entry_id], verify=False)
            else:
                ricoh_service.delete_address_entries(target, [registration_no], verify=False)
            create_payload = ricoh_service.create_address_user_wizard(
                target,
                name=name,
                email=email,
                folder=folder,
                user_code=user_code,
                fields=fields if isinstance(fields, dict) else None,
                desired_registration_no=registration_no,
                allow_auto_update=False,
            )
            return jsonify(
                {
                    "ok": True,
                    "payload": create_payload,
                    "trace_id": trace_id,
                    "recreated": True,
                    "message": "Entry recreated (requested to keep registration_no when possible).",
                }
            )
        except Exception as exc:  # noqa: BLE001
            LOGGER.exception("Scan address modify failed: trace_id=%s ip=%s registration_no=%s", trace_id, ip, registration_no)
            return jsonify({"ok": False, "error": str(exc), "trace_id": trace_id}), 500

