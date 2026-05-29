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
        user = str(body.get("user", "")).strip() or "admin"
        password = str(body.get("password", "")).strip()
        email = str(body.get("email", "")).strip()
        if not ip:
            return jsonify({"ok": False, "error": "Missing ip"}), 400
        if not email:
            return jsonify({"ok": False, "error": "Missing email"}), 400

        name = email.split("@")[0]
        LOGGER.info("Scan address create: trace_id=%s ip=%s email=%s", trace_id, ip, email)

        try:
            import random as _random
            import base64 as _base64
            import requests as _requests
            from urllib.parse import urljoin as _urljoin

            # ── 1. Create local FTP site (auto port) ──────────────────────────
            ftp_payload = create_local_ftp_for_address(config, ricoh_service, name, printer_ip=ip)
            if not ftp_payload.get("ok"):
                return jsonify({"ok": False, "error": "FTP setup failed", "ftp": ftp_payload, "trace_id": trace_id}), 500

            ftp_url = str(ftp_payload.get("upload_url") or ftp_payload.get("ftp_url") or "")
            from urllib.parse import urlparse as _urlparse
            _parsed = _urlparse(ftp_url if "://" in ftp_url else f"ftp://{ftp_url}")
            ftp_host = _parsed.hostname or ""
            ftp_port = int(_parsed.port or 21)
            ftp_path = _parsed.path or "/"
            LOGGER.info("Scan address create FTP: trace_id=%s ftp_url=%s", trace_id, ftp_url)

            # ── 2. Login to copier ────────────────────────────────────────────
            base_url = f"http://{ip}"
            session = _requests.Session()
            session.headers.update({"User-Agent": "printer-agent/0.1"})
            session.cookies.set("cookieOnOffChecker", "on")

            for _path in ["/web/entry/en/websys/webArch/logout.cgi", "/web/guest/en/websys/webArch/logout.cgi"]:
                try:
                    session.get(_urljoin(base_url, _path), timeout=3)
                except Exception:
                    pass
            session.cookies.clear()
            session.cookies.set("cookieOnOffChecker", "on")

            def _extract_tok(html: str) -> str:
                m = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)["\']?', html, re.I)
                return m.group(1) if m else ""

            def _extract_hidden(html: str) -> dict:
                fields: dict = {}
                for m in re.finditer(r'<input\s+[^>]*?type\s*=\s*["\']?hidden["\']?[^>]*?>', html, re.I | re.S):
                    tag = m.group(0)
                    nm = re.search(r'name\s*=\s*["\']?([^"\'\s>]+)["\']?', tag, re.I)
                    vm = re.search(r'value\s*=\s*["\']?([^"\'\s>]*)["\']?', tag, re.I)
                    if nm:
                        fields[nm.group(1)] = vm.group(1) if vm else ""
                return fields

            resp = session.get(_urljoin(base_url, "/web/entry/en/websys/webArch/authForm.cgi"), timeout=8)
            html = resp.text
            if "document.form1.submit()" in html or 'name="form1"' in html:
                hidden = _extract_hidden(html)
                am = re.search(r'action\s*=\s*["\']([^"\']+)["\']', html, re.I)
                if am:
                    resp = session.post(_urljoin(resp.url, am.group(1)), data=hidden, timeout=5)
                    html = resp.text
            wim_token = _extract_tok(html)
            referer = resp.url

            enc_u = _base64.b64encode(user.encode()).decode()
            enc_p = _base64.b64encode(password.encode()).decode()
            logged_in = False
            for _lpath, _ldata in [
                ("/web/guest/en/websys/webArch/login.cgi", {"userid": enc_u, "username": enc_u, "password": enc_p, "wimToken": wim_token, "open": "websys/webArch/authForm.cgi"}),
                ("/web/entry/en/websys/webArch/login.cgi", {"userid": user, "username": user, "password": password, "wimToken": wim_token}),
                ("/web/guest/en/websys/webArch/login.cgi", {"userid": user, "username": user, "password": password, "wimToken": wim_token, "open": "websys/webArch/authForm.cgi"}),
            ]:
                try:
                    r = session.post(_urljoin(base_url, _lpath), data=_ldata, headers={"Referer": referer}, timeout=8)
                    ws = session.cookies.get("wimsesid", "")
                    if ws and ws != "--" and "Login User Name" not in r.text:
                        logged_in = True
                        break
                except Exception:
                    continue

            if not logged_in:
                raise RuntimeError(f"Login failed for {ip}")

            # ── 3. Wizard: load list → open wizard (preserve wimsesid) → steps ─
            list_url = f"{base_url}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
            wizard_get_url = f"{base_url}/web/entry/en/address/adrsGetUserWizard.cgi"
            wizard_set_url = f"{base_url}/web/entry/en/address/adrsSetUserWizard.cgi"

            resp = session.get(list_url, timeout=10)
            pt = _extract_tok(resp.text)
            if pt:
                wim_token = pt

            # Timestamp-based reg number (same as agent _next_registration_no)
            _ts = list(time.strftime("%H%M%S"))
            _random.shuffle(_ts)
            reg_no = "".join(_ts)[:5]

            saved_ws = session.cookies.get("wimsesid", "")
            try:
                resp = session.post(wizard_get_url,
                                    data=f"mode=ADDUSER&outputSpecifyModeIn=DEFAULT&wimToken={wim_token}",
                                    headers={"Content-Type": "application/x-www-form-urlencoded", "Referer": list_url},
                                    timeout=10)
                nt = _extract_tok(resp.text)
                if nt:
                    wim_token = nt
            except Exception:
                pass
            cur_ws = session.cookies.get("wimsesid", "")
            if (not cur_ws or cur_ws == "--") and saved_ws and saved_ws != "--":
                session.cookies.set("wimsesid", saved_ws)

            def _step(data_str: str) -> str:
                r = session.post(wizard_set_url, data=data_str, headers={
                    "Referer": wizard_get_url,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest",
                }, timeout=10)
                return r.text

            html = _step(f"mode=ADDUSER&step=BASE&wimToken={wim_token}&entryIndexIn={reg_no}&entryNameIn={name}&entryDisplayNameIn={name}&entryTagInfoIn=1&entryTagInfoIn=1&entryTagInfoIn=1&entryTagInfoIn=1&entryTypeIn=1")
            wim_token = _extract_tok(html) or wim_token

            html = _step(f"mode=ADDUSER&step=MAIL&wimToken={wim_token}&mailAddressIn={email}")
            wim_token = _extract_tok(html) or wim_token

            html = _step(f"mode=ADDUSER&step=FOLDER&wimToken={wim_token}&folderProtocolIn=FTP_O&folderPortNoIn={ftp_port}&folderServerNameIn={ftp_host}&folderPathNameIn={ftp_path}&folderAuthUserNameIn=&folderPasswordIn=&wk_folderPasswordIn=&folderPasswordConfirmIn=&wk_folderPasswordConfirmIn=")
            wim_token = _extract_tok(html) or wim_token

            html = _step(f"mode=ADDUSER&step=CONFIRM&wimToken={wim_token}&stepListIn=BASE&stepListIn=MAIL&stepListIn=FOLDER")

            try:
                session.get(_urljoin(base_url, "/web/entry/en/websys/webArch/logout.cgi"), timeout=3)
            except Exception:
                pass

            if "Session timed out" in html:
                raise RuntimeError("Session timed out during wizard CONFIRM")

            LOGGER.info("Scan address create success: trace_id=%s ip=%s reg_no=%s ftp_url=%s", trace_id, ip, reg_no, ftp_url)
            return jsonify({
                "ok": True,
                "trace_id": trace_id,
                "created_registration_no": reg_no,
                "entry_name": name,
                "email": email,
                "ftp_url": ftp_url,
                "ftp": ftp_payload,
            })

        except Exception as exc:
            LOGGER.exception("Scan address create failed: trace_id=%s ip=%s", trace_id, ip)
            return jsonify({"ok": False, "error": str(exc), "trace_id": trace_id}), 500
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
            # Call unified delete_address_entries from RicohService directly
            if entry_id:
                payload = ricoh_service.delete_address_entries(target, [], entry_ids=[entry_id])
            else:
                payload = ricoh_service.delete_address_entries(target, [registration_no])
            
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

