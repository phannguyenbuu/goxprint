from __future__ import annotations

import os
import json
import logging
from pathlib import Path
from typing import Any
from flask import Flask, jsonify, request, send_from_directory, render_template

from agent.config import AppConfig
from agent.services.camera_manager import CameraManager

LOGGER = logging.getLogger(__name__)

CONFIG_PATH = Path("storage/camera_configs.json")

def _load_local_configs() -> list[dict]:
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    if CONFIG_PATH.exists():
        try:
            with CONFIG_PATH.open("r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def _save_local_configs(configs: list[dict]):
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with CONFIG_PATH.open("w", encoding="utf-8") as f:
        json.dump(configs, f, indent=2, ensure_ascii=False)


def register_camera_routes(app: Flask):
    config: AppConfig = app.config["APP_CONFIG"]
    cm = CameraManager()

    @app.get("/camera")
    def camera_page() -> Any:
        return render_template("camera.html", active_tab="camera", page_title="Camera Manager")

    @app.get("/api/camera")
    def get_cameras() -> Any:
        configs = _load_local_configs()
        # Add live status to each config
        results = []
        for c in configs:
            name = c.get("camera_name", "")
            status = cm.get_status(name)
            results.append({
                **c,
                "is_recording": status.get("running", False),
                "status": status
            })
        return jsonify({"ok": True, "cameras": results})

    @app.post("/api/camera")
    def save_camera() -> Any:
        body = request.get_json(silent=True) or {}
        camera_name = str(body.get("camera_name", "Camera")).strip()
        rtsp_url = str(body.get("rtsp_url", "")).strip()
        segment_duration = int(body.get("segment_duration", 60))
        prefix = str(body.get("prefix", "rec")).strip()
        video_codec = str(body.get("video_codec", "copy")).strip()
        audio_codec = str(body.get("audio_codec", "copy")).strip()
        no_audio = bool(body.get("no_audio", True))

        if not camera_name or not rtsp_url:
            return jsonify({"ok": False, "error": "Missing camera_name or rtsp_url"}), 400

        configs = _load_local_configs()
        # Check if exists
        updated = False
        for c in configs:
            if c.get("camera_name") == camera_name:
                c.update({
                    "rtsp_url": rtsp_url,
                    "segment_duration": segment_duration,
                    "prefix": prefix,
                    "video_codec": video_codec,
                    "audio_codec": audio_codec,
                    "no_audio": no_audio
                })
                updated = True
                break

        if not updated:
            configs.append({
                "camera_name": camera_name,
                "rtsp_url": rtsp_url,
                "segment_duration": segment_duration,
                "prefix": prefix,
                "video_codec": video_codec,
                "audio_codec": audio_codec,
                "no_audio": no_audio
            })

        _save_local_configs(configs)
        return jsonify({"ok": True})

    @app.post("/api/camera/<name>/delete")
    def delete_camera(name: str) -> Any:
        # Stop recording first
        cm.stop_recording(name)
        configs = _load_local_configs()
        configs = [c for c in configs if c.get("camera_name") != name]
        _save_local_configs(configs)
        return jsonify({"ok": True})

    @app.post("/api/camera/test")
    def test_camera_connection() -> Any:
        body = request.get_json(silent=True) or {}
        rtsp_url = str(body.get("rtsp_url", "")).strip()
        ok, msg = cm.test_rtsp_connection(rtsp_url)
        return jsonify({"ok": True, "result": {"ok": ok, "msg": msg}})

    @app.post("/api/camera/<name>/start")
    def start_camera_recording(name: str) -> Any:
        configs = _load_local_configs()
        cfg = next((c for c in configs if c.get("camera_name") == name), None)
        if not cfg:
            return jsonify({"ok": False, "error": "Camera not configured"}), 404

        output_dir = config.get_string("camera.output_dir", "E:\\app\\camera\\recordings")
        success = cm.start_recording(
            camera_name=name,
            rtsp_url=cfg["rtsp_url"],
            output_dir=output_dir,
            segment_duration=cfg.get("segment_duration", 60),
            video_codec=cfg.get("video_codec", "copy"),
            audio_codec=cfg.get("audio_codec", "copy"),
            no_audio=cfg.get("no_audio", True),
            prefix=cfg.get("prefix", "rec")
        )
        if success:
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": "Failed to start recording"}), 500

    @app.post("/api/camera/<name>/stop")
    def stop_camera_recording(name: str) -> Any:
        cm.stop_recording(name)
        return jsonify({"ok": True})

    @app.get("/api/camera/<name>/status")
    def get_camera_status(name: str) -> Any:
        status = cm.get_status(name)
        status["logs"] = cm.get_logs(name)
        return jsonify({"ok": True, "status": status})

    @app.get("/api/camera/<name>/files")
    def get_camera_files(name: str) -> Any:
        output_dir = config.get_string("camera.output_dir", "E:\\app\\camera\\recordings")
        files = cm.list_recordings(name, output_dir)
        return jsonify({"ok": True, "files": files})

    @app.delete("/api/camera/<name>/files/<filename>")
    def delete_camera_file(name: str, filename: str) -> Any:
        output_dir = config.get_string("camera.output_dir", "E:\\app\\camera\\recordings")
        success = cm.delete_recording(output_dir, filename)
        if success:
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": "Failed to delete file"}), 500

    @app.get("/camera/play/<name>/<filename>")
    def serve_recording_file(name: str, filename: str) -> Any:
        output_dir = config.get_string("camera.output_dir", "E:\\app\\camera\\recordings")
        return send_from_directory(output_dir, filename)
