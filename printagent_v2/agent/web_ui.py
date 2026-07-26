from __future__ import annotations

import socket
from typing import Any

from flask import jsonify, redirect, render_template, request, url_for

from agent.config import AppConfig
from agent.services.polling_bridge import PollingBridge
from agent.web_ui_support import _env_snapshot


def register_ui_routes(app):
    config: AppConfig = app.config["APP_CONFIG"]
    updater = app.config["UPDATER"]

    @app.get("/")
    def index() -> Any:
        return redirect(url_for("devices"))

    @app.get("/devices")
    def devices() -> Any:
        bridge: PollingBridge = app.config["POLLING_BRIDGE"]
        hostname = socket.gethostname()
        local_ip = bridge._resolve_local_ip()
        lan_uid, _ = bridge._resolve_lan_info(hostname, local_ip)
        return render_template("devices.html", active_tab="devices", page_title=lan_uid or "Devices")

    @app.get("/scan")
    def scan() -> Any:
        return render_template("scan.html", active_tab="scan", page_title="Scan")

    @app.get("/ftp")
    def ftp_page() -> Any:
        return render_template("ftp.html", active_tab="ftp", page_title="FTP")





    @app.get("/settings")
    def settings() -> Any:
        return redirect(url_for("devices"))

    @app.route("/api/ui/config", methods=["GET", "OPTIONS"])
    def api_ui_config() -> Any:
        bridge: PollingBridge = app.config["POLLING_BRIDGE"]
        hostname = socket.gethostname()
        local_ip = bridge._resolve_local_ip()
        lan_uid, fingerprint = bridge._resolve_lan_info(hostname, local_ip)
        return jsonify(
            {
                "lan_uid": lan_uid,
                "agent_uid": bridge._agent_uid,
                "fingerprint": fingerprint,
                "pc_ip": local_ip,
                "pc_name": hostname,
                "env": _env_snapshot(config, updater),
                "device_filters": {"filter_mode": "valid_only"},
            }
        )

    @app.get("/api/update/status")
    def api_update_status() -> Any:
        return jsonify(updater.status())

    @app.post("/api/update/check")
    def api_update_check() -> Any:
        mode = config.get_string("webhook.mode", "listen").strip().lower() or "listen"
        if mode == "listen":
            return (
                jsonify(
                    {
                        "ok": False,
                        "message": "Webhook is in listen mode; use webhook endpoint to receive update signals",
                        "status": updater.status(),
                    }
                ),
                400,
            )
        body = request.get_json(silent=True) or {}
        version = str(body.get("version", "")).strip()
        command = str(body.get("command", "")).strip()
        source = str(body.get("source", "api")).strip()
        ok, message = updater.handle_signal(version=version, command_text=command, source=source, raw_text=str(body))
        return jsonify({"ok": ok, "message": message, "status": updater.status()})

    @app.post("/api/update/force-check")
    def api_update_force_check() -> Any:
        updater.state.last_check_at = ""
        polling_bridge = app.config["POLLING_BRIDGE"]
        polling_bridge.trigger_once()
        return jsonify({"ok": True, "message": "Force update check triggered successfully"})

    @app.post("/api/update/receive-text")
    def api_update_receive_text() -> Any:
        mode = config.get_string("webhook.mode", "listen").strip().lower() or "listen"
        if mode != "listen":
            return jsonify({"ok": False, "error": f"Webhook mode is '{mode}', not listen"}), 400

        token = request.headers.get("X-Update-Token", "").strip()
        expected = updater.webhook_token
        if expected and token != expected:
            return jsonify({"ok": False, "error": "Invalid update token"}), 403

        body = request.get_json(silent=True) or {}
        text = str(body.get("text", "")).strip()
        if not text:
            return jsonify({"ok": False, "error": "Missing text"}), 400
        ok, message = updater.handle_text_message(text, source="webhook")
        return jsonify({"ok": ok, "message": message, "status": updater.status()})

    @app.get("/utilities")
    def utilities_page() -> Any:
        return render_template("utilities.html", active_tab="utilities", page_title="Utilities")

    @app.post("/api/utilities/printers")
    def trigger_printers() -> Any:
        try:
            from agent.utilities import open_devices_and_printers
            open_devices_and_printers()
            return jsonify({"ok": True, "message": "Opened Devices and Printers Control Panel"})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500

    @app.post("/api/utilities/scan")
    def trigger_scan() -> Any:
        try:
            from agent.utilities import open_scan_folder
            open_scan_folder()
            return jsonify({"ok": True, "message": "Opened local Scanned Documents folder"})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500

    @app.post("/api/utilities/dxdiag")
    def trigger_dxdiag() -> Any:
        try:
            from agent.utilities import open_dxdiag
            open_dxdiag()
            return jsonify({"ok": True, "message": "Opened dxdiag DirectX Diagnostic Tool"})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500

    @app.get("/api/utilities/ip")
    def trigger_ip() -> Any:
        try:
            from agent.utilities import get_public_ip
            ip = get_public_ip()
            return jsonify({"ok": True, "ip": ip or "Failed to retrieve"})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500

    @app.get("/api/utilities/settings")
    def get_utilities_settings() -> Any:
        try:
            return jsonify({
                "ok": True,
                "scan_auto_open_file": config.get_bool("polling.scan_auto_open_file", True),
                "scan_auto_open_dir": config.get_bool("polling.scan_auto_open_dir", True),
            })
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500

    @app.post("/api/utilities/settings")
    def update_utilities_settings() -> Any:
        try:
            body = request.get_json(silent=True) or {}
            if "scan_auto_open_file" in body:
                config.set_value("polling.scan_auto_open_file", bool(body["scan_auto_open_file"]))
            if "scan_auto_open_dir" in body:
                config.set_value("polling.scan_auto_open_dir", bool(body["scan_auto_open_dir"]))
            return jsonify({"ok": True, "message": "Cài đặt tự động mở file/thư mục đã được cập nhật.", "scan_auto_open_file": config.get_bool("polling.scan_auto_open_file", True), "scan_auto_open_dir": config.get_bool("polling.scan_auto_open_dir", True)})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500

    @app.post("/api/local/install-driver")
    def local_install_driver() -> Any:
        try:
            body = request.get_json(silent=True) or {}
            ip = body.get("ip", "")
            brand = body.get("printer_type", "ricoh") or "ricoh"
            model = body.get("name", "")
            
            bridge = app.config.get("POLLING_BRIDGE")
            if not bridge:
                return jsonify({"ok": False, "error": "Không kết nối được với dịch vụ PollingBridge"}), 500
                
            import threading
            def run_task():
                import requests, re
                driver_name = model
                driver_url = ""
                
                try:
                    catalog_resp = requests.get(f"{config.api_url}/drivers/{brand}", timeout=10)
                    catalog_data = catalog_resp.json()
                    drivers_list = catalog_data.get("data") or []
                    
                    if drivers_list and model:
                        model_tokens = [t.lower() for t in re.findall(r'[a-zA-Z0-9]+', model) if len(t) >= 2]
                        best_match = None
                        best_score = 0
                        for drv_item in drivers_list:
                            drv_model = drv_item.get("model") or drv_item.get("name") or ""
                            drv_tokens = [t.lower() for t in re.findall(r'[a-zA-Z0-9]+', drv_model)]
                            score = len(set(model_tokens) & set(drv_tokens))
                            if score > best_score:
                                best_score = score
                                best_match = drv_item
                                
                        if best_match and best_score > 0:
                            # Read driver_preference list from settings.json
                            pref_str = config.get_string("polling.driver_preference", "pcl 6;pcl6;pcl;easysetup;universal;postscript;ps")
                            pref_list = [p.strip().lower() for p in pref_str.split(";") if p.strip()]

                            if brand == "ricoh":
                                # Ricoh: drivers is a dict {"Driver Name": "URL"}
                                sub_drivers = best_match.get("drivers") or {}
                                if sub_drivers:
                                    selected_key = None
                                    for pref in pref_list:
                                        for key in sub_drivers.keys():
                                            if pref in key.lower():
                                                selected_key = key
                                                break
                                        if selected_key:
                                            break
                                    if not selected_key:
                                        selected_key = list(sub_drivers.keys())[0]
                                    driver_name = selected_key
                                    driver_url = sub_drivers[selected_key]
                            elif brand == "toshiba":
                                # Toshiba: drivers is a list of dicts with download_url
                                sub_drivers = best_match.get("drivers") or []
                                if sub_drivers:
                                    selected_drv = None
                                    for pref in pref_list:
                                        for sd in sub_drivers:
                                            sd_name = sd.get("name") or sd.get("description") or ""
                                            if pref in sd_name.lower():
                                                selected_drv = sd
                                                break
                                        if selected_drv:
                                            break
                                    if not selected_drv:
                                        selected_drv = sub_drivers[0]
                                    driver_name = selected_drv.get("name") or model
                                    driver_url = selected_drv.get("download_url") or selected_drv.get("url")
                            elif brand == "fujifilm":
                                # Fujifilm: uses all_links list
                                all_links = best_match.get("all_links") or []
                                if all_links:
                                    selected_url = None
                                    for pref in pref_list:
                                        for link in all_links:
                                            if pref in link.lower():
                                                selected_url = link
                                                break
                                        if selected_url:
                                            break
                                    if not selected_url:
                                        selected_url = all_links[0]
                                    driver_name = model
                                    driver_url = selected_url
                except Exception as e:
                    import logging
                    logging.warning("Failed to resolve driver from catalog: %s", e)
                
                try:
                    if not driver_url:
                        pref_str = config.get_string("polling.driver_preference", "pcl 6;pcl6;pcl;easysetup;universal;postscript;ps")
                        matched_model = best_match.get("model") if (best_match and isinstance(best_match, dict)) else "None"
                        raise Exception(f"Thiếu link driver. Khớp model: {matched_model}. Ưu tiên: {pref_str}")

                    bridge._handle_install_driver(
                        command_id=0,
                        printer_ip=ip,
                        brand=brand,
                        model=model,
                        driver_name=driver_name,
                        driver_url=driver_url
                    )
                except Exception as e:
                    import logging
                    logging.error("Failed executing local install driver: %s", e)
                    try:
                        from pathlib import Path
                        status_file = Path("storage/data/status_message.txt")
                        status_file.parent.mkdir(parents=True, exist_ok=True)
                        status_file.write_text(f"❌ LỖI: {str(e)}", encoding="utf-8")
                    except Exception:
                        pass
                    
            threading.Thread(target=run_task, daemon=True).start()
            return jsonify({"ok": True})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500

    @app.post("/api/local/install-scan")
    def local_install_scan() -> Any:
        try:
            body = request.get_json(silent=True) or {}
            printer_data = body.get("printer", {})
            name = body.get("name", "")
            email = body.get("email", "")
            
            bridge = app.config.get("POLLING_BRIDGE")
            if not bridge:
                return jsonify({"ok": False, "error": "Không kết nối được với dịch vụ PollingBridge"}), 500
                
            import threading
            def run_task():
                from agent.modules.printer import Printer
                from agent.modules.ricoh.service import RicohService
                from agent.modules.base_api import APIClient
                
                try:
                    printer = Printer(
                        id=printer_data.get("id", 0),
                        name=printer_data.get("name", ""),
                        ip=printer_data.get("ip", ""),
                        user=printer_data.get("user", ""),
                        password=printer_data.get("password", ""),
                        printer_type=printer_data.get("printer_type", ""),
                        status="online",
                        mac_address=printer_data.get("mac_address", "")
                    )
                    
                    api_client = APIClient(config)
                    ricoh_service = RicohService(api_client, config=config)
                    
                    session = ricoh_service.create_http_client(printer, authenticated=True)
                    setup_res = ricoh_service.setup_scan_destination(
                        printer=None,
                        username=name,
                        session=session,
                        email=email,
                    )
                    
                    ftp_upload_url = ""
                    ftp_user = ""
                    ftp_password = ""
                    if setup_res and setup_res.get("ok"):
                        ftp_upload_url = setup_res.get("ftp_upload_url", "")
                        ftp_info = setup_res.get("ftp", {})
                        ftp_user = ftp_info.get("ftp_user", "")
                        ftp_password = ftp_info.get("ftp_password", "")
                    else:
                        return
                        
                    fields = {}
                    if ftp_user:
                        fields["folderAuthUserNameIn"] = ftp_user
                        fields["folderAuthUserName"] = ftp_user
                    if ftp_password:
                        fields["folderPasswordIn"] = ftp_password
                        fields["wk_folderPasswordIn"] = ftp_password
                        fields["folderPasswordConfirmIn"] = ftp_password
                        fields["wk_folderPasswordConfirmIn"] = ftp_password
                        
                    ricoh_service.create_address_user_wizard(
                        printer=printer,
                        name=name,
                        email="",
                        folder=ftp_upload_url,
                        fields=fields,
                        session=session
                    )
                    
                    try:
                        ricoh_service._reset_web_session(session, printer)
                        session.close()
                    except Exception:
                        pass
                except Exception as e:
                    import logging
                    logging.error("Failed executing local install scan: %s", e)
                    
            threading.Thread(target=run_task, daemon=True).start()
            return jsonify({"ok": True})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500
