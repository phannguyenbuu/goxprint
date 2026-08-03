from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from agent.services.runtime import default_ftp_root, user_temp_root

BASE_DIR = Path("storage") / "ftp_service"
CONFIG_FILE = BASE_DIR / "sites.json"
STATE_FILE = BASE_DIR / "runtime.json"

# Auto delete the legacy sites.json configuration file if it exists to clean up
try:
    if CONFIG_FILE.exists():
        CONFIG_FILE.unlink()
except Exception:
    pass


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def ensure_base_dir() -> Path:
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    return BASE_DIR


def get_config_port_root_and_credentials() -> tuple[int, Path, str, str]:
    import sys
    if getattr(sys, "frozen", False):
        path = Path(sys.executable).resolve().parent / "settings.json"
    else:
        path = Path("settings.json")
    
    port = 2130
    user = "goxprint"
    password = "goxprint"
    if path.exists():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            val = data.get("ftp_port")
            if val and str(val).isdigit():
                port = int(val)
            val_u = data.get("ftp_user")
            if val_u:
                user = str(val_u).strip()
            val_p = data.get("ftp_pass")
            if val_p:
                password = str(val_p).strip()
        except Exception:
            pass
    
    root = user_temp_root() / "ftp"
    return port, root, user, password


def get_config_port_and_root() -> tuple[int, Path]:
    port, root, _, _ = get_config_port_root_and_credentials()
    return port, root


def load_config() -> dict[str, Any]:
    port, root, user, password = get_config_port_root_and_credentials()
    return {
        "version": 1,
        "updated_at": now_iso(),
        "sites": [
            {
                "name": "goxprint",
                "path": str(root),
                "port": port,
                "ftp_user": user,
                "ftp_password": password,
                "enabled": True,
            }
        ],
    }


def save_config(sites: list[dict[str, Any]]) -> dict[str, Any]:
    port = 2130
    user = "goxprint"
    password = "goxprint"
    for s in sites:
        if s.get("name") == "goxprint":
            port = int(s.get("port") or 2130)
            user = str(s.get("ftp_user") or "goxprint")
            password = str(s.get("ftp_password") or "goxprint")
            break
    
    import sys
    if getattr(sys, "frozen", False):
        path = Path(sys.executable).resolve().parent / "settings.json"
    else:
        path = Path("settings.json")
    
    data = {}
    if path.exists():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            pass
    data["ftp_port"] = port
    data["ftp_user"] = user
    data["ftp_pass"] = password
    try:
        ensure_base_dir()
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    except Exception:
        pass
    
    return {
        "version": 1,
        "updated_at": now_iso(),
        "sites": sites,
    }


def load_state() -> dict[str, Any]:
    try:
        if STATE_FILE.exists():
            data = json.loads(STATE_FILE.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return data
    except Exception:
        pass
    return {
        "version": 1,
        "updated_at": now_iso(),
        "worker_pid": 0,
        "worker_heartbeat_at": "",
        "sites": [],
    }


def save_state(state: dict[str, Any]) -> dict[str, Any]:
    ensure_base_dir()
    try:
        STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")
    except Exception:
        pass
    return state


def normalize_site_name(value: str, default: str = "ftp_site") -> str:
    text = str(value or "").strip().replace(" ", "_")
    text = "".join(ch for ch in text if ch.isalnum() or ch in {"_", "-"})
    text = text[:48]
    return text or default


def normalize_ftp_user(value: str, site_name: str) -> str:
    return "goxprint"


def normalize_ftp_password(value: str) -> str:
    return "goxprint"


def normalize_port(value: int | str | None, default: int = 2121) -> int:
    try:
        port = int(value or 0)
    except Exception:
        port = 0
    if port <= 0 or port > 65535:
        return default
    return port


def normalize_path(value: str | Path | None, site_name: str) -> Path:
    _, root = get_config_port_and_root()
    return root


def site_spec(
    *,
    site_name: str,
    local_path: str | Path | None,
    port: int | str | None,
    ftp_user: str = "",
    ftp_password: str = "",
    enabled: bool = True,
) -> dict[str, Any]:
    port_val, root = get_config_port_and_root()
    return {
        "name": "goxprint",
        "path": str(root),
        "port": port_val,
        "ftp_user": "goxprint",
        "ftp_password": "goxprint",
        "enabled": True,
    }


def upsert_site(config: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    port = int(spec.get("port") or 2130)
    save_config([spec])
    return spec


def remove_site(config: dict[str, Any], site_name: str) -> dict[str, Any] | None:
    port, root = get_config_port_and_root()
    return {
        "name": "goxprint",
        "path": str(root),
        "port": port,
        "ftp_user": "goxprint",
        "ftp_password": "goxprint",
        "enabled": True,
    }


def find_site_by_name(config: dict[str, Any], site_name: str) -> dict[str, Any] | None:
    port, root = get_config_port_and_root()
    return {
        "name": "goxprint",
        "path": str(root),
        "port": port,
        "ftp_user": "goxprint",
        "ftp_password": "goxprint",
        "enabled": True,
    }


def find_site_by_port(config: dict[str, Any], port: int | str) -> dict[str, Any] | None:
    config_port, root = get_config_port_and_root()
    if int(port) == config_port:
        return {
            "name": "goxprint",
            "path": str(root),
            "port": config_port,
            "ftp_user": "goxprint",
            "ftp_password": "goxprint",
            "enabled": True,
        }
    return None


def merge_runtime_with_config(config: dict[str, Any], state: dict[str, Any]) -> list[dict[str, Any]]:
    port, root = get_config_port_and_root()
    
    live = {}
    for s in state.get("sites", []):
        if s.get("name") == "goxprint":
            live = s
            break
            
    return [
        {
            "name": "goxprint",
            "path": str(root),
            "port": port,
            "ftp_url": f"ftp://127.0.0.1:{port}/",
            "ftp_user": "goxprint",
            "ftp_password": "goxprint",
            "running": bool(live.get("running", False)),
            "state": str(live.get("state", "configured")),
            "error": str(live.get("error", "")),
            "pid": int(live.get("pid", 0)),
            "firewall": dict(live.get("firewall") or {}),
            "warnings": list(live.get("warnings") or []),
            "updated_at": now_iso(),
        }
    ]
