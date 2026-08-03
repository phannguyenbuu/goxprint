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

TUNNEL_REGISTRY: dict[tuple[str, str, int], int] = {}
TUNNEL_TOKENS: dict[str, int] = {}
TUNNEL_KEYS: dict[tuple[str, str, int], str] = {}

def is_port_free(port: int) -> bool:
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("0.0.0.0", port))
            return True
        except socket.error:
            return False



from agent_settings_routes import register_agent_settings_routes
from agent_utility_routes import register_agent_utility_routes
from agent_history_routes import register_agent_history_routes
from agent_camera_routes import register_agent_camera_routes

def register_agent_routes(app: Flask, session_factory: Any, lead_key_map: dict[str, str]) -> None:
    register_agent_settings_routes(app, session_factory, lead_key_map)
    register_agent_utility_routes(app, session_factory, lead_key_map)
    register_agent_history_routes(app, session_factory, lead_key_map)
    register_agent_camera_routes(app, session_factory, lead_key_map)
