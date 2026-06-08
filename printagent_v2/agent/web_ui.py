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

    @app.get("/api/ui/config")
    def api_ui_config() -> Any:
        bridge: PollingBridge = app.config["POLLING_BRIDGE"]
        hostname = socket.gethostname()
        local_ip = bridge._resolve_local_ip()
        lan_uid, fingerprint = bridge._resolve_lan_info(hostname, local_ip)
        return jsonify(
            {
                "lan_uid": lan_uid,
                "fingerprint": fingerprint,
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
            return jsonify({
                "ok": True,
                "message": "Cài đặt tự động mở file/thư mục đã được cập nhật.",
                "scan_auto_open_file": config.get_bool("polling.scan_auto_open_file", True),
                "scan_auto_open_dir": config.get_bool("polling.scan_auto_open_dir", True),
            })
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500
