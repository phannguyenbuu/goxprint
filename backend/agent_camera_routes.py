from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, render_template, request, send_from_directory
from sqlalchemy import select

from app_helpers import (
    ONLINE_STALE_SECONDS,
    _load_agent_release_manifest,
    _format_agents_datetime_ui,
    _serialize_audit_payload_agents,
    _request_api_token,
    _resolve_request_lead,
    _resolve_lan_uid_with_session,
    _is_agent_master_and_get_emails,
    _is_newer_version,
)
from utils import (
    _to_text,
    _to_int,
    _normalize_mac,
    _normalize_ipv4,
    _resolve_lan_uid_from_body,
)
from serializers import (
    _refresh_stale_agent_offline,
    _upsert_lan_and_agent,
)
from models import AgentNode, LanSite, Printer, AgentPresenceLog, PrinterControlCommand

LOGGER = logging.getLogger(__name__)



def register_agent_camera_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:

    def _get_clean_manufacturer(mac: str, mac_vendors: dict, rtsp_url: str = None) -> str:
        # 1. Try MAC OUI lookup first (highest confidence)
        if mac and mac_vendors:
            clean_mac = "".join(c for c in mac if c.isalnum()).upper()
            if len(clean_mac) >= 6:
                oui = f"{clean_mac[0:2]}:{clean_mac[2:4]}:{clean_mac[4:6]}"
                vendor_info = mac_vendors.get(oui)
                if vendor_info:
                    vendor_name = vendor_info.get("manufacturer") or ""
                    vendor_lower = vendor_name.lower()
                    if "dahua" in vendor_lower:
                        return "Dahua"
                    elif "hikvision" in vendor_lower:
                        return "Hikvision"
                    elif "ezviz" in vendor_lower:
                        return "Ezviz"
                    elif "imou" in vendor_lower or "huacheng" in vendor_lower:
                        return "Imou"
                    elif "sigmastar" in vendor_lower:
                        return "Sigmastar"
                    elif "sony" in vendor_lower:
                        return "Sony"
                    elif "panasonic" in vendor_lower:
                        return "Panasonic"
                    elif "tp-link" in vendor_lower:
                        return "TP-Link"
                    elif "brother" in vendor_lower:
                        return "Brother"
                    elif "canon" in vendor_lower:
                        return "Canon"
                    elif "epson" in vendor_lower:
                        return "Epson"
                    elif "toshiba" in vendor_lower or "tokyo electric" in vendor_lower:
                        return "Toshiba"
                    elif "ricoh" in vendor_lower:
                        return "Ricoh"
                    return vendor_name

        # 2. Fallback to RTSP URL pattern mapping if MAC OUI was not found or resolved
        if rtsp_url:
            url_lower = rtsp_url.lower()
            if "/cam/realmonitor" in url_lower:
                return "Imou"
            if "/streaming/channels" in url_lower or "/h264/ch" in url_lower or "/h265/ch" in url_lower:
                return "Hikvision"
            if "/onvif1" in url_lower or "/onvif2" in url_lower:
                return "Yoosee"

        return "Generic"


    def _update_live_camera_config_state(agent_uid: str, ip: str, config_dict: dict):
        import json
        from pathlib import Path
        live_file = Path(f"storage/live_cameras_{agent_uid}.json")
        try:
            payload_data = {"cameras": [], "configs": []}
            if live_file.exists():
                with open(live_file, "r", encoding="utf-8") as f:
                    payload_data = json.load(f)
                    if not isinstance(payload_data, dict):
                        payload_data = {"cameras": [], "configs": []}
            
            configs = payload_data.get("configs")
            if not isinstance(configs, list):
                configs = []
            
            updated = False
            for c in configs:
                c_rtsp = c.get("rtsp_url", "")
                import re
                c_ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', c_rtsp)
                c_ip = c_ip_match.group(1) if c_ip_match else c.get("ip")
                if c_ip == ip:
                    c.update(config_dict)
                    updated = True
                    break
            if not updated:
                configs.append(config_dict)
                
            payload_data["configs"] = configs
            with open(live_file, "w", encoding="utf-8") as f:
                json.dump(payload_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            LOGGER.error("Failed to update live camera config state: %s", e)


    def _delete_live_camera_config_state(agent_uid: str, ip: str):
        import json
        from pathlib import Path
        live_file = Path(f"storage/live_cameras_{agent_uid}.json")
        if live_file.exists():
            try:
                with open(live_file, "r", encoding="utf-8") as f:
                    payload_data = json.load(f)
                    if not isinstance(payload_data, dict):
                        payload_data = {"cameras": [], "configs": []}
                
                configs = payload_data.get("configs")
                if isinstance(configs, list):
                    import re
                    new_configs = []
                    for c in configs:
                        c_rtsp = c.get("rtsp_url", "")
                        c_ip_match = re.search(r'rtsp://([^:/]+)', c_rtsp)
                        c_ip = c_ip_match.group(1) if c_ip_match else c.get("ip")
                        if c_ip != ip:
                            new_configs.append(c)
                    payload_data["configs"] = new_configs
                    with open(live_file, "w", encoding="utf-8") as f:
                        json.dump(payload_data, f, indent=2, ensure_ascii=False)
            except Exception as e:
                LOGGER.error("Failed to delete live camera config state: %s", e)


    class MockCameraConfig:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)


    def _get_or_create_camera_config(session, agent_uid, camera_id):
        import ipaddress
        import json
        from pathlib import Path
        
        try:
            ip_str = str(ipaddress.IPv4Address(camera_id))
        except Exception:
            return None
            
        # Read from live JSON file
        live_file = Path(f"storage/live_cameras_{agent_uid}.json")
        config_data = {}
        if live_file.exists():
            try:
                with open(live_file, "r", encoding="utf-8") as f:
                    payload_data = json.load(f)
                    if isinstance(payload_data, dict):
                        configs = payload_data.get("configs") or []
                        cameras = payload_data.get("cameras") or []
                        
                        # Search in configs first
                        for c in configs:
                            rtsp = c.get("rtsp_url", "")
                            import re
                            c_ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', rtsp)
                            c_ip = c_ip_match.group(1) if c_ip_match else c.get("ip")
                            if c_ip == ip_str:
                                config_data = c
                                break
                                
                        # If not found in configs, search in scanned cameras
                        if not config_data:
                            for item in cameras:
                                if item.get("ip") == ip_str:
                                    config_data = {
                                        "camera_name": item.get("camera_name") or f"Camera {ip_str}",
                                        "rtsp_url": item.get("rtsp_url") or f"rtsp://{ip_str}:554/cam/realmonitor?channel=1&subtype=0",
                                        "segment_duration": 60,
                                        "prefix": "rec",
                                        "video_codec": "copy",
                                        "audio_codec": "copy",
                                        "no_audio": True,
                                        "ip": ip_str,
                                        "mac_address": item.get("mac_address") or item.get("mac") or ""
                                    }
                                    break
            except Exception:
                pass
                
        if not config_data:
            config_data = {
                "camera_name": f"Camera {ip_str}",
                "rtsp_url": f"rtsp://{ip_str}:554/cam/realmonitor?channel=1&subtype=0",
                "segment_duration": 60,
                "prefix": "rec",
                "video_codec": "copy",
                "audio_codec": "copy",
                "no_audio": True,
                "ip": ip_str,
                "mac_address": ""
            }
            
        return MockCameraConfig(
            id=camera_id,
            camera_name=config_data.get("camera_name"),
            rtsp_url=config_data.get("rtsp_url"),
            segment_duration=config_data.get("segment_duration", 60),
            prefix=config_data.get("prefix", "rec"),
            video_codec=config_data.get("video_codec", "copy"),
            audio_codec=config_data.get("audio_codec", "copy"),
            no_audio=config_data.get("no_audio", True),
            ip=config_data.get("ip", ip_str),
            mac_address=config_data.get("mac_address", ""),
            is_recording=config_data.get("is_recording", False)
        )


    def _queue_camera_utility_command(agent_uid: str, action: str, camera_name: str, params: dict, wait_seconds: float = 12.0) -> tuple[bool, str]:
        requested_at = datetime.now(timezone.utc)
        cmd_params = {
            "action": action,
            "camera_name": camera_name,
            **params
        }
        from models import AgentNode
        with session_factory() as session:
            agent = session.execute(
                select(AgentNode)
                .where(AgentNode.agent_uid == agent_uid)
                .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
                .limit(1)
            ).scalars().first()
            lead_val = agent.lead if agent else "default"
            lan_uid_val = agent.lan_uid if agent else ""
            
            command = PrinterControlCommand(
                printer_id=0,
                lead=lead_val,
                lan_uid=lan_uid_val,
                agent_uid=agent_uid,
                printer_name="",
                ip="",
                command_type="trigger_utility",
                command_params=json.dumps(cmd_params),
                status="pending",
                requested_at=requested_at,
            )
            session.add(command)
            session.commit()
            command_id = int(command.id)
            
        success = False
        error_msg = "Timeout waiting for Agent response"
        import time
        iterations = int(wait_seconds / 0.5)
        for _ in range(iterations):
            time.sleep(0.5)
            with session_factory() as session:
                cmd_status = session.execute(
                    select(PrinterControlCommand).where(PrinterControlCommand.id == command_id)
                ).scalars().first()
                if cmd_status:
                    if cmd_status.status == "success":
                        success = True
                        error_msg = cmd_status.error_message or ""
                        break
                    elif cmd_status.status == "failed":
                        success = False
                        error_msg = cmd_status.error_message or "Agent failed execution"
                        break
                        
        return success, error_msg


    def _update_live_camera_recording_state(agent_uid: str, ip: str, is_recording: bool):
        import json
        from pathlib import Path
        live_file = Path(f"storage/live_cameras_{agent_uid}.json")
        if live_file.exists():
            try:
                payload_data = {"cameras": [], "configs": []}
                with open(live_file, "r", encoding="utf-8") as f:
                    payload_data = json.load(f)
                    if not isinstance(payload_data, dict):
                        payload_data = {"cameras": [], "configs": []}
                
                cams = payload_data.get("cameras") or []
                updated = False
                for item in cams:
                    if item.get("ip") == ip:
                        item["is_recording"] = is_recording
                        updated = True
                        break
                        
                configs = payload_data.get("configs") or []
                for item in configs:
                    c_rtsp = item.get("rtsp_url", "")
                    import re
                    c_ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', c_rtsp)
                    c_ip = c_ip_match.group(1) if c_ip_match else item.get("ip")
                    if c_ip == ip:
                        item["is_recording"] = is_recording
                        updated = True
                        break
                        
                if updated:
                    payload_data["cameras"] = cams
                    payload_data["configs"] = configs
                    with open(live_file, "w", encoding="utf-8") as f:
                        json.dump(payload_data, f, indent=2, ensure_ascii=False)
            except Exception as e:
                LOGGER.error("Failed to update live cameras JSON state: %s", e)




    @app.get("/api/agents/<agent_uid>/cameras")
    @app.get("/api/public/camera/list")
    @app.get("/api/cameras/list")
    def get_agent_cameras(agent_uid: str = "") -> Any:
        from models import AgentNode
        import ipaddress
        import json
        from pathlib import Path
        
        lan_uid_param = (request.args.get("lan_uid") or request.args.get("lan") or "").strip()
        agent_uid_param = (agent_uid or request.args.get("agent_uid") or request.args.get("agent") or "").strip()

        with session_factory() as session:
            online_uids = []
            
            if lan_uid_param:
                online_agents = session.execute(
                    select(AgentNode).where(AgentNode.lan_uid == lan_uid_param, AgentNode.is_online == True)
                ).scalars().all()
                online_uids = [a.agent_uid for a in online_agents]
            elif agent_uid_param:
                agent = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == agent_uid_param)
                    .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
                ).scalars().first()
                
                if agent:
                    online_agents = session.execute(
                        select(AgentNode).where(AgentNode.lan_uid == agent.lan_uid, AgentNode.is_online == True)
                    ).scalars().all()
                    online_uids = [a.agent_uid for a in online_agents]
                else:
                    # Fallback: check if agent_uid_param is actually a lan_uid
                    online_agents = session.execute(
                        select(AgentNode).where(AgentNode.lan_uid == agent_uid_param, AgentNode.is_online == True)
                    ).scalars().all()
                    online_uids = [a.agent_uid for a in online_agents]
            else:
                # Retrieve all online agents if no filter passed
                online_agents = session.execute(
                    select(AgentNode).where(AgentNode.is_online == True)
                ).scalars().all()
                online_uids = [a.agent_uid for a in online_agents]

            if not online_uids and (agent_uid_param or lan_uid_param):
                return jsonify({"ok": True, "cameras": []})
            
            # Load offline MAC vendors database
            mac_vendors = {}
            mac_file = Path("storage/mac_vendors.json")
            if mac_file.exists():
                try:
                    with open(mac_file, "r", encoding="utf-8") as f:
                        mac_vendors = json.load(f)
                except Exception as e:
                    LOGGER.error("Failed to load mac_vendors.json: %s", e)

            live_cameras = []
            local_configs = []
            seen_ips = set()
            toshiba_ips = set()
            
            for uid in online_uids:
                live_file = Path(f"storage/live_cameras_{uid}.json")
                if live_file.exists():
                    try:
                        with open(live_file, "r", encoding="utf-8") as f:
                            payload_data = json.load(f)
                            cams_list = []
                            cfg_list = []
                            if isinstance(payload_data, dict):
                                cams_list = payload_data.get("cameras") or []
                                cfg_list = payload_data.get("configs") or []
                            elif isinstance(payload_data, list):
                                cams_list = payload_data
                                
                            if isinstance(cams_list, list):
                                for item in cams_list:
                                    ip = (item.get("ip") or "").strip()
                                    if not ip or ip.lower() in ("admin", "generic", "unknown", "camera ip"):
                                        continue
                                    if ip in seen_ips:
                                        continue
                                        
                                    mac = (item.get("mac_address") or item.get("mac") or "").strip()
                                    clean_mac = "".join(c for c in mac if c.isalnum()).upper()
                                    if len(clean_mac) != 12 or not all(c in "0123456789ABCDEF" for c in clean_mac):
                                        continue
                                        
                                    # Filter out Toshiba/Tokyo Electric devices by MAC OUI
                                    is_toshiba = False
                                    if mac_vendors:
                                        clean_mac = "".join(c for c in mac if c.isalnum()).upper()
                                        if len(clean_mac) >= 6:
                                            oui_hex = f"{clean_mac[0:2]}:{clean_mac[2:4]}:{clean_mac[4:6]}"
                                            vendor_info = mac_vendors.get(oui_hex)
                                            if vendor_info:
                                                vendor_name = vendor_info.get("manufacturer", "")
                                                vendor_lower = vendor_name.lower()
                                                if "toshiba" in vendor_lower or "tokyo electric" in vendor_lower:
                                                    is_toshiba = True
                                                    
                                    if is_toshiba:
                                        toshiba_ips.add(ip)
                                        continue
                                        
                                    seen_ips.add(ip)
                                    live_cameras.append(item)
                                    
                            if isinstance(cfg_list, list):
                                for cfg_item in cfg_list:
                                    local_configs.append(cfg_item)
                    except Exception as e:
                        LOGGER.error("Failed to read live cameras file for %s: %s", uid, e)
            
            # Group local configs by IP
            configs_by_ip = {}
            for c in local_configs:
                rtsp = c.get("rtsp_url", "")
                import re
                ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', rtsp)
                ip = ip_match.group(1) if ip_match else c.get("ip")
                if ip:
                    configs_by_ip[ip] = c

            # Group live cameras by MAC address for deduplication
            grouped_by_mac = {}
            for item in live_cameras:
                mac = (item.get("mac_address") or item.get("mac") or "").strip()
                clean_mac = "".join(c for c in mac if c.isalnum()).upper()
                if len(clean_mac) == 12 and all(c in "0123456789ABCDEF" for c in clean_mac):
                    if clean_mac not in grouped_by_mac:
                        grouped_by_mac[clean_mac] = []
                    grouped_by_mac[clean_mac].append(item)

            results = []
            seen_macs = set()

            for clean_mac, items in grouped_by_mac.items():
                seen_macs.add(clean_mac)
                # Primary item is the one recording or first in list
                primary_item = next((it for it in items if it.get("is_recording")), items[0])
                primary_ip = primary_item.get("ip")
                
                all_ips = [it.get("ip") for it in items if it.get("ip")]
                
                # Check if custom name/config exists for any of the IPs
                config = None
                for it_ip in all_ips:
                    if it_ip in configs_by_ip:
                        config = configs_by_ip[it_ip]
                        break
                        
                mac_formatted = f"{clean_mac[0:2]}:{clean_mac[2:4]}:{clean_mac[4:6]}:{clean_mac[6:8]}:{clean_mac[8:10]}:{clean_mac[10:12]}"
                
                try:
                    virtual_id = int(ipaddress.IPv4Address(primary_ip))
                except Exception:
                    virtual_id = 9999
                    
                rtsp_url = (config.get("rtsp_url") if config else None) or primary_item.get("rtsp_url")
                resolved_manufacturer = _get_clean_manufacturer(mac_formatted, mac_vendors, rtsp_url=rtsp_url)
                if resolved_manufacturer == "Toshiba":
                    continue
                
                final_manufacturer = resolved_manufacturer
                if final_manufacturer == "Generic":
                    reported_mfr = primary_item.get("manufacturer") or "Generic"
                    if reported_mfr != "Generic":
                        final_manufacturer = reported_mfr
                
                model_str = primary_item.get("model") or "Camera IP"
                model_lower = model_str.lower()
                if any(err_kw in model_lower for err_kw in ("timeout", "lỗi", "error", "404", "504", "conn")):
                    if final_manufacturer != "Generic":
                        model_str = "Camera IP"
                    else:
                        model_str = "Camera IP (Chưa rõ dòng)"

                # Build combined camera name if multiple IPs share the same MAC
                if config and config.get("camera_name"):
                    camera_name = config.get("camera_name")
                else:
                    if len(all_ips) > 1:
                        other_ips_str = ", ".join(f"Camera {ip}" for ip in all_ips[1:])
                        camera_name = f"Camera {all_ips[0]} ({other_ips_str})"
                    else:
                        camera_name = f"Camera {all_ips[0]}"

                is_any_recording = any(it.get("is_recording", False) for it in items)

                combined_ip_str = ", ".join(all_ips) if len(all_ips) > 1 else primary_ip

                results.append({
                    "id": virtual_id,
                    "agent_uid": agent_uid,
                    "camera_name": camera_name,
                    "rtsp_url": rtsp_url or f"rtsp://{primary_ip}:554/cam/realmonitor?channel=1&subtype=0",
                    "segment_duration": config.get("segment_duration", 60) if config else 60,
                    "prefix": config.get("prefix", "rec") if config else "rec",
                    "video_codec": config.get("video_codec", "copy") if config else "copy",
                    "audio_codec": config.get("audio_codec", "copy") if config else "copy",
                    "no_audio": config.get("no_audio", True) if config else True,
                    "is_recording": is_any_recording,
                    "ip": combined_ip_str,
                    "mac_address": mac_formatted,
                    "manufacturer": final_manufacturer,
                    "model": model_str,
                    "is_online": True,
                })

            # Add offline configured cameras
            for ip, config in configs_by_ip.items():
                if ip not in seen_ips and ip not in toshiba_ips:
                    mac = config.get("mac_address") or ""
                    clean_mac = "".join(c for c in mac if c.isalnum()).upper()
                    if len(clean_mac) != 12 or not all(c in "0123456789ABCDEF" for c in clean_mac):
                        continue
                    if clean_mac in seen_macs:
                        continue
                    seen_macs.add(clean_mac)

                    try:
                        virtual_id = int(ipaddress.IPv4Address(ip))
                    except Exception:
                        virtual_id = 9999
                    
                    rtsp = config.get("rtsp_url") or ""
                    resolved_manufacturer = _get_clean_manufacturer(config.get("mac_address"), mac_vendors, rtsp_url=rtsp)
                    
                    results.append({
                        "id": virtual_id,
                        "agent_uid": agent_uid,
                        "camera_name": config.get("camera_name") or f"Camera {ip}",
                        "rtsp_url": rtsp,
                        "segment_duration": config.get("segment_duration", 60),
                        "prefix": config.get("prefix", "rec"),
                        "video_codec": config.get("video_codec", "copy"),
                        "audio_codec": config.get("audio_codec", "copy"),
                        "no_audio": config.get("no_audio", True),
                        "is_recording": False,
                        "ip": ip,
                        "mac_address": config.get("mac_address") or "",
                        "manufacturer": resolved_manufacturer if resolved_manufacturer != "Generic" else (config.get("manufacturer") or "Generic"),
                        "model": "Camera IP",
                        "is_online": False,
                    })
                    
            return jsonify({"ok": True, "cameras": results})

    @app.post("/api/agents/<agent_uid>/cameras")
    def save_agent_camera(agent_uid: str) -> Any:
        body = request.get_json(silent=True) or {}
        camera_id = body.get("id")
        camera_name = str(body.get("camera_name", "Camera")).strip()
        rtsp_url = str(body.get("rtsp_url", "")).strip()
        segment_duration = int(body.get("segment_duration", 60))
        prefix = str(body.get("prefix", "rec")).strip()
        video_codec = str(body.get("video_codec", "copy")).strip()
        audio_codec = str(body.get("audio_codec", "copy")).strip()
        no_audio = bool(body.get("no_audio", True))
        
        if not rtsp_url:
            return jsonify({"ok": False, "error": "Missing rtsp_url"}), 400
            
        params = {
            "camera_name": camera_name,
            "rtsp_url": rtsp_url,
            "segment_duration": segment_duration,
            "prefix": prefix,
            "video_codec": video_codec,
            "audio_codec": audio_codec,
            "no_audio": no_audio
        }
        
        import ipaddress
        import re
        camera_ip = ""
        if camera_id:
            try:
                camera_ip = str(ipaddress.IPv4Address(camera_id))
            except Exception:
                pass
        
        if not camera_ip:
            ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', rtsp_url)
            if ip_match:
                camera_ip = ip_match.group(1)
                
        # Send save command to Agent (saves to agent's local JSON)
        success, err = _queue_camera_utility_command(agent_uid, "save_camera_config", camera_name, params)
        if success:
            try:
                virtual_id = int(ipaddress.IPv4Address(camera_ip))
            except Exception:
                virtual_id = 9999
                
            # Update Server's local JSON cache instantly
            _update_live_camera_config_state(agent_uid, camera_ip, {
                "camera_name": camera_name,
                "rtsp_url": rtsp_url,
                "segment_duration": segment_duration,
                "prefix": prefix,
                "video_codec": video_codec,
                "audio_codec": audio_codec,
                "no_audio": no_audio,
                "ip": camera_ip
            })
            return jsonify({"ok": True, "camera_id": virtual_id})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/delete")
    def delete_agent_camera(agent_uid: str, camera_id: int) -> Any:
        import ipaddress
        try:
            camera_ip = str(ipaddress.IPv4Address(camera_id))
        except Exception:
            return jsonify({"ok": False, "error": "Invalid camera ID"}), 400
            
        # Get camera name from live file config
        from pathlib import Path
        import json
        live_file = Path(f"storage/live_cameras_{agent_uid}.json")
        camera_name = f"Camera {camera_ip}"
        if live_file.exists():
            try:
                with open(live_file, "r", encoding="utf-8") as f:
                    payload_data = json.load(f)
                    if isinstance(payload_data, dict):
                        for c in (payload_data.get("configs") or []):
                            rtsp = c.get("rtsp_url", "")
                            import re
                            c_ip_match = re.search(r'rtsp://(?:[^@\n]+@)?([^:/#\n?]+)', rtsp)
                            c_ip = c_ip_match.group(1) if c_ip_match else c.get("ip")
                            if c_ip == camera_ip:
                                camera_name = c.get("camera_name")
                                break
            except Exception:
                pass

        # Stop recording first (just in case)
        _queue_camera_utility_command(agent_uid, "stop_camera_recorder", camera_name, {})
        
        # Send delete config command to Agent
        success, err = _queue_camera_utility_command(agent_uid, "delete_camera_config", camera_name, {})
        if success:
            # Delete config from server JSON cache instantly
            _delete_live_camera_config_state(agent_uid, camera_ip)
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/start")
    def start_agent_camera_recording(agent_uid: str, camera_id: int) -> Any:
        body = request.get_json(silent=True) or {}
        duration = body.get("duration")
        
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
                
            params = {
                "rtsp_url": cfg.rtsp_url,
                "segment_duration": cfg.segment_duration,
                "video_codec": cfg.video_codec,
                "audio_codec": cfg.audio_codec,
                "no_audio": cfg.no_audio,
                "prefix": cfg.prefix
            }
            if duration is not None:
                try:
                    params["duration_limit"] = int(duration) * 60
                except (ValueError, TypeError):
                    pass
            camera_name = cfg.camera_name
            camera_ip = cfg.ip
            
        success, err = _queue_camera_utility_command(agent_uid, "start_camera_recorder", camera_name, params)
        if success:
            _update_live_camera_recording_state(agent_uid, camera_ip, True)
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/stop")
    def stop_agent_camera_recording(agent_uid: str, camera_id: int) -> Any:
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name
            camera_ip = cfg.ip
            
        success, err = _queue_camera_utility_command(agent_uid, "stop_camera_recorder", camera_name, {})
        if success:
            _update_live_camera_recording_state(agent_uid, camera_ip, False)
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/status")
    def get_agent_camera_status(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name
            
        success, payload = _queue_camera_utility_command(agent_uid, "get_camera_status", camera_name, {})
        if success:
            try:
                status_dict = json.loads(payload)
                return jsonify({"ok": True, "status": status_dict, "result": status_dict})
            except Exception as e:
                return jsonify({"ok": False, "error": f"Failed parsing payload: {e}"}), 500
        return jsonify({"ok": False, "error": payload}), 200

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/test")
    def test_agent_camera_rtsp(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            rtsp_url = cfg.rtsp_url
            
        success, payload = _queue_camera_utility_command(agent_uid, "test_camera_rtsp", "", {"rtsp_url": rtsp_url})
        if success:
            try:
                test_dict = json.loads(payload)
                return jsonify({"ok": True, "result": test_dict})
            except Exception as e:
                return jsonify({"ok": False, "error": f"Failed parsing payload: {e}"}), 500
        return jsonify({"ok": False, "error": payload}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/files")
    def get_agent_camera_files(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name
            
        success, payload = _queue_camera_utility_command(agent_uid, "list_camera_files", camera_name, {}, wait_seconds=30.0)
        if success:
            try:
                files_dict = json.loads(payload)
                return jsonify({"ok": True, "files": files_dict.get("files", [])})
            except Exception as e:
                return jsonify({"ok": False, "error": f"Failed parsing payload: {e}"}), 500
        return jsonify({"ok": False, "error": payload}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/delete-file")
    def delete_agent_camera_file(agent_uid: str, camera_id: int) -> Any:
        body = request.get_json(silent=True) or {}
        filename = str(body.get("filename", "")).strip()
        if not filename:
            return jsonify({"ok": False, "error": "Missing filename"}), 400
            
        success, err = _queue_camera_utility_command(agent_uid, "delete_camera_file", "", {"filename": filename})
        if success:
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 504

    @app.post("/api/agents/<agent_uid>/cameras/<int:camera_id>/query-video")
    def query_agent_camera_video(agent_uid: str, camera_id: int) -> Any:
        from models import CameraConfig
        body = request.get_json(silent=True) or {}
        timestamp = str(body.get("timestamp", "")).strip()
        duration = int(body.get("duration", 10))
        
        if not timestamp:
            return jsonify({"ok": False, "error": "Missing timestamp"}), 400
            
        with session_factory() as session:
            cfg = _get_or_create_camera_config(session, agent_uid, camera_id)
            if not cfg:
                return jsonify({"ok": False, "error": "Camera config not found"}), 404
            camera_name = cfg.camera_name

        # Instantly return success if the video clip is already cached on the server
        target_ts = None
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S.%f"):
            try:
                from datetime import datetime
                target_ts = datetime.strptime(timestamp, fmt)
                break
            except ValueError:
                continue

        if target_ts:
            expected_filename = f"clip_{camera_name}_{target_ts.strftime('%Y%m%d_%H%M%S')}.mp4"
            dest_dir = Path(__file__).resolve().parent / "static" / "camera_clips" / agent_uid
            dest_path = dest_dir / expected_filename
            if dest_path.exists():
                return jsonify({"ok": True})
            
        success, err = _queue_camera_utility_command(
            agent_uid, "query_camera_video", camera_name,
            {"timestamp": timestamp, "duration": duration},
            wait_seconds=110.0
        )
        if success:
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": err}), 200

    @app.post("/api/agents/<agent_uid>/cameras/upload-video")
    def upload_agent_camera_video(agent_uid: str) -> Any:
        if "file" not in request.files:
            return jsonify({"ok": False, "error": "No file uploaded"}), 400
            
        uploaded_file = request.files["file"]
        if not uploaded_file.filename:
            return jsonify({"ok": False, "error": "Empty filename"}), 400
            
        dest_dir = Path(__file__).resolve().parent / "static" / "camera_clips" / agent_uid
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest_path = dest_dir / uploaded_file.filename
        
        uploaded_file.save(str(dest_path))
        return jsonify({"ok": True, "filename": uploaded_file.filename})

    @app.get("/api/agents/<agent_uid>/cameras/clips/<filename>")
    def get_agent_camera_clip(agent_uid: str, filename: str) -> Any:
        dest_dir = Path(__file__).resolve().parent / "static" / "camera_clips" / agent_uid
        return send_from_directory(str(dest_dir), filename)

    @app.post("/api/cameras/record-control")
    @app.post("/api/public/camera/control")
    @app.post("/api/public/camera/record")
    @app.post("/api/cameras/record")
    def control_camera_recording_by_mac() -> Any:
        from models import CameraConfig, AgentNode
        body = request.get_json(silent=True) or {}
        mac_id = str(body.get("mac_id") or body.get("mac") or body.get("camera_mac") or "").strip()
        agent_uid_req = str(body.get("agent_uid") or body.get("agent") or "").strip()
        action = str(body.get("action") or "start").strip().lower()
        if action in ("start_record", "recording"):
            action = "start"

        duration_raw = body.get("duration") if body.get("duration") is not None else (body.get("duration_limit") or body.get("duration_seconds"))
        try:
            duration = int(duration_raw) if duration_raw is not None else 30
        except (ValueError, TypeError):
            duration = 30

        if not mac_id:
            req_ip = str(body.get("ip") or "").strip()
            req_cam_id = body.get("camera_id") or body.get("id")
            if req_ip or req_cam_id:
                storage_dir = Path(app.config.get("STORAGE_DIR", "storage"))
                with session_factory() as session:
                    if req_cam_id:
                        try:
                            cid = int(req_cam_id)
                            cfg_db = session.execute(select(CameraConfig).where(CameraConfig.id == cid)).scalars().first()
                            if cfg_db and cfg_db.mac_address:
                                mac_id = cfg_db.mac_address
                        except Exception:
                            pass
                    if not mac_id and req_ip:
                        cfg_db = session.execute(select(CameraConfig).where(CameraConfig.ip == req_ip)).scalars().first()
                        if cfg_db and cfg_db.mac_address:
                            mac_id = cfg_db.mac_address

                    if not mac_id:
                        online_agents_list = session.execute(select(AgentNode).where(AgentNode.is_online == True)).scalars().all()
                        for ag in online_agents_list:
                            ag_file = storage_dir / f"live_cameras_{ag.agent_uid}.json"
                            if ag_file.exists():
                                try:
                                    with open(ag_file, "r", encoding="utf-8") as f:
                                        payload_data = json.load(f)
                                        cams_list = payload_data.get("cameras") if isinstance(payload_data, dict) else (payload_data if isinstance(payload_data, list) else [])
                                        for item in cams_list:
                                            item_ip = str(item.get("ip", "")).strip()
                                            item_mac = str(item.get("mac_address") or item.get("mac") or "").strip()
                                            if req_ip and item_ip == req_ip and item_mac:
                                                mac_id = item_mac
                                                break
                                except Exception:
                                    pass
                                if mac_id:
                                    break

        if not mac_id:
            return jsonify({"ok": False, "error": "Thiếu thông tin nhận diện camera (truyền mac_id, ip hoặc camera_id)"}), 400
        if action not in ("start", "stop", "record"):
            return jsonify({"ok": False, "error": "Hành động không hợp lệ (action phải là start, stop hoặc record)"}), 400

        # Normalize mac_id for robust matching
        norm_mac_id = mac_id.replace(":", "").replace("-", "").lower()

        with session_factory() as session:
            # Query all camera configs ordered by ID descending to prefer newer configurations
            cameras_list = session.execute(select(CameraConfig).order_by(CameraConfig.id.desc())).scalars().all()
            
            # Find candidates by MAC ID matching
            candidates = []
            for c in cameras_list:
                if c.mac_address:
                    c_norm = c.mac_address.replace(":", "").replace("-", "").lower()
                    if c_norm == norm_mac_id:
                        candidates.append(c)

            if not candidates:
                # Fallback to checking live_cameras JSON files in storage_dir on server
                storage_dir = Path(app.config.get("STORAGE_DIR", "storage"))
                live_cam_item = None
                live_agent_uid = agent_uid_req
                
                # Search across all online agents' live_cameras files
                online_agents_list = session.execute(select(AgentNode).where(AgentNode.is_online == True)).scalars().all()
                for ag in online_agents_list:
                    ag_file = storage_dir / f"live_cameras_{ag.agent_uid}.json"
                    if ag_file.exists():
                        try:
                            with open(ag_file, "r", encoding="utf-8") as f:
                                payload_data = json.load(f)
                                cams_list = payload_data.get("cameras") if isinstance(payload_data, dict) else (payload_data if isinstance(payload_data, list) else [])
                                for item in cams_list:
                                    item_mac = (item.get("mac_address") or item.get("mac") or "").strip()
                                    if item_mac and item_mac.replace(":", "").replace("-", "").lower() == norm_mac_id:
                                        live_cam_item = item
                                        live_agent_uid = ag.agent_uid
                                        break
                        except Exception:
                            pass
                    if live_cam_item:
                        break

                if live_cam_item:
                    # Construct a transient config object
                    cam_ip = live_cam_item.get("ip", "")
                    cfg = CameraConfig(
                        agent_uid=live_agent_uid,
                        camera_name=live_cam_item.get("camera_name") or f"Camera {cam_ip}",
                        rtsp_url=live_cam_item.get("rtsp_url") or f"rtsp://{cam_ip}:554/cam/realmonitor?channel=1&subtype=0",
                        segment_duration=60,
                        prefix="rec",
                        video_codec="copy",
                        audio_codec="copy",
                        no_audio=True,
                        ip=cam_ip,
                        mac_address=mac_id
                    )
                    candidates = [cfg]
                else:
                    return jsonify({"ok": False, "error": f"Không tìm thấy cấu hình camera với MAC ID: {mac_id}"}), 404

            # Candidate config to read parameters from
            cfg = candidates[0]

            # Determine the online agent to run the command on:
            online_agent = None
            
            # 1. If explicit agent_uid was requested, check if it's online
            if agent_uid_req:
                agent = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == agent_uid_req)
                    .order_by(AgentNode.is_online.desc(), AgentNode.last_seen_at.desc(), AgentNode.id.desc())
                ).scalars().first()
                if agent and agent.is_online:
                    online_agent = agent

            # 2. Fallback: Find candidate whose managing agent is online
            if not online_agent:
                for cand in candidates:
                    agent = session.execute(
                        select(AgentNode)
                        .where(AgentNode.agent_uid == cand.agent_uid)
                        .order_by(AgentNode.last_seen_at.desc())
                    ).scalars().first()
                    if agent and agent.is_online:
                        cfg = cand
                        online_agent = agent
                        break

            # 3. Fallback: Find any online agent in the same LAN as the camera config
            if not online_agent:
                for cand in candidates:
                    if cand.lan_uid and cand.lan_uid != "default":
                        agent = session.execute(
                            select(AgentNode)
                            .where(AgentNode.lan_uid == cand.lan_uid, AgentNode.is_online == True)
                            .order_by(AgentNode.last_seen_at.desc())
                        ).scalars().first()
                        if agent:
                            cfg = cand
                            online_agent = agent
                            break

            # 4. Fallback: First candidate's managing agent (offline)
            if not online_agent:
                online_agent = session.execute(
                    select(AgentNode)
                    .where(AgentNode.agent_uid == cfg.agent_uid)
                    .order_by(AgentNode.last_seen_at.desc())
                ).scalars().first()

            if not online_agent or not online_agent.is_online:
                return jsonify({"ok": False, "error": f"Không có Agent trực tuyến nào để thực hiện thao tác (Agent yêu cầu: {agent_uid_req or cfg.agent_uid} đang ngoại tuyến)"}), 400

            agent_uid = online_agent.agent_uid
            camera_name = cfg.camera_name
            params = {
                "rtsp_url": cfg.rtsp_url,
                "segment_duration": cfg.segment_duration,
                "video_codec": cfg.video_codec,
                "audio_codec": cfg.audio_codec,
                "no_audio": cfg.no_audio,
                "prefix": cfg.prefix,
                "mac_address": cfg.mac_address or mac_id
            }

        if action == "start":
            duration_sec = duration * 60 if duration < 60 else duration
            params["duration_limit"] = duration_sec
            success, err = _queue_camera_utility_command(agent_uid, "start_camera_recorder", camera_name, params)
            if success:
                _update_live_camera_recording_state(agent_uid, cfg.ip, True)
                msg_time = f"{duration_sec // 60} phút" if duration_sec >= 60 else f"{duration_sec} giây"
                return jsonify({"ok": True, "message": f"Đã bắt đầu ghi hình thành công với giới hạn {msg_time}"})
            return jsonify({"ok": False, "error": f"Không thể bắt đầu ghi hình: {err}"}), 504

        elif action == "stop":
            success, err = _queue_camera_utility_command(agent_uid, "stop_camera_recorder", camera_name, {})
            if success:
                _update_live_camera_recording_state(agent_uid, cfg.ip, False)
                return jsonify({"ok": True, "message": "Đã dừng ghi hình thành công"})
            return jsonify({"ok": False, "error": f"Không thể dừng ghi hình: {err}"}), 504

        elif action == "record":
            # Ensure the segment duration is long enough so FFmpeg does not split the recording
            record_params = dict(params)
            record_params["segment_duration"] = max(cfg.segment_duration, duration + 15)
            record_params["duration_limit"] = duration

            success, err = _queue_camera_utility_command(agent_uid, "start_camera_recorder", camera_name, record_params, wait_seconds=3.0)
            if not success and err != "Timeout waiting for Agent response":
                return jsonify({"ok": False, "error": f"Không thể bắt đầu ghi hình: {err}"}), 504

            _update_live_camera_recording_state(agent_uid, cfg.ip, True)
            return jsonify({"ok": True, "message": f"Đã gửi lệnh bắt đầu ghi hình {duration}s tới Agent!"})
