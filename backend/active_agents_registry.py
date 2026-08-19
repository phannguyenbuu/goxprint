from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict

LOGGER = logging.getLogger(__name__)

# In-memory registry of active PC Agents and their reported device telemetry.
# Zero PostgreSQL database writes for device/agent_node entries.
ACTIVE_AGENTS: Dict[str, Dict[str, Any]] = {}


import json
from pathlib import Path

def _load_cached_printers_for_agent(agent_uid: str) -> list[dict[str, Any]]:
    try:
        cache_file = Path("storage/data") / f"printers_{agent_uid}.json"
        if cache_file.exists():
            with open(cache_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
    except Exception:
        pass
    return []

def _save_cached_printers_for_agent(agent_uid: str, devices_list: list[dict[str, Any]]) -> None:
    try:
        cache_dir = Path("storage/data")
        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_file = cache_dir / f"printers_{agent_uid}.json"
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(devices_list, f, indent=2, ensure_ascii=False)
    except Exception:
        pass

def update_agent_in_memory(
    *,
    lead: str,
    lan_uid: str,
    agent_uid: str,
    hostname: str = "",
    local_ip: str = "",
    local_mac: str = "",
    app_version: str = "",
    run_mode: str = "web",
    web_port: int = 9173,
    printer_name: str = "",
    ip: str = "",
    mac_id: str = "",
    counter_data: dict[str, Any] | None = None,
    status_data: dict[str, Any] | None = None,
    devices_list: list[dict[str, Any]] | None = None,
) -> None:
    now = datetime.now(timezone.utc)
    key = agent_uid or "legacy-agent"

    if key not in ACTIVE_AGENTS:
        cached_printers = devices_list or _load_cached_printers_for_agent(key)
        ACTIVE_AGENTS[key] = {
            "lead": lead,
            "lan_uid": lan_uid,
            "agent_uid": key,
            "hostname": hostname,
            "local_ip": local_ip,
            "local_mac": local_mac,
            "app_version": app_version,
            "run_mode": run_mode,
            "web_port": web_port,
            "last_seen_at": now,
            "devices": {},
            "printers_json": cached_printers,
        }
    else:
        agent_entry = ACTIVE_AGENTS[key]
        agent_entry["lead"] = lead or agent_entry["lead"]
        agent_entry["lan_uid"] = lan_uid or agent_entry["lan_uid"]
        agent_entry["hostname"] = hostname or agent_entry["hostname"]
        agent_entry["local_ip"] = local_ip or agent_entry["local_ip"]
        agent_entry["local_mac"] = local_mac or agent_entry["local_mac"]
        agent_entry["app_version"] = app_version or agent_entry["app_version"]
        agent_entry["last_seen_at"] = now
        if not agent_entry.get("printers_json"):
            cached = _load_cached_printers_for_agent(key)
            if cached:
                agent_entry["printers_json"] = cached

    agent_entry = ACTIVE_AGENTS[key]
    if isinstance(devices_list, list) and len(devices_list) > 0:
        agent_entry["printers_json"] = devices_list
        _save_cached_printers_for_agent(key, devices_list)

    devices_dict = agent_entry.setdefault("devices", {})

    if mac_id:
        norm_mac = mac_id.upper().replace("-", ":")
        dev = devices_dict.setdefault(norm_mac, {})
        if printer_name and "unknown" not in printer_name.lower():
            dev["printer_name"] = printer_name
        elif "printer_name" not in dev or "unknown" in str(dev.get("printer_name", "")).lower():
            dev["printer_name"] = printer_name or "Unknown Printer"
        if ip:
            dev["ip"] = ip
        if isinstance(counter_data, dict) and counter_data:
            dev["counter"] = counter_data
        if isinstance(status_data, dict) and status_data:
            dev["status"] = status_data
            # Derive is_online from status
            s = str(status_data.get("status", "")).lower()
            dev["is_online"] = (s != "offline") if s else dev.get("is_online", True)
        dev["updated_at"] = now.isoformat()

    # Also sync is_online and probed from printers_json devices_list into devices dict
    if isinstance(devices_list, list):
        for d in devices_list:
            if not isinstance(d, dict):
                continue
            d_mac = str(d.get("mac_address") or d.get("mac_id") or "").strip().upper().replace("-", ":")
            if d_mac and d_mac in devices_dict:
                devices_dict[d_mac]["is_online"] = bool(d.get("is_online", True))
                devices_dict[d_mac]["probed"] = bool(d.get("probed", False))
                if d.get("ip"):
                    devices_dict[d_mac]["ip"] = str(d["ip"]).strip()


def prune_offline_agents(timeout_seconds: int = 120) -> None:
    """Purge agents from in-memory registry that haven't sent a heartbeat/poll within timeout_seconds."""
    now = datetime.now(timezone.utc)
    expired_keys = []
    for agent_uid, agent_info in ACTIVE_AGENTS.items():
        last_seen = agent_info.get("last_seen_at")
        if not last_seen or (now - last_seen).total_seconds() > timeout_seconds:
            expired_keys.append(agent_uid)
    for key in expired_keys:
        LOGGER.info("[ACTIVE_AGENTS] Pruning offline agent '%s' (last_seen > %ds)", key, timeout_seconds)
        ACTIVE_AGENTS.pop(key, None)


def get_device_by_mac_in_memory(mac_id: str) -> dict[str, Any] | None:
    prune_offline_agents(timeout_seconds=180)
    norm_mac = mac_id.upper().replace("-", ":")
    for agent_uid, agent_info in ACTIVE_AGENTS.items():
        devices = agent_info.get("devices", {})
        if norm_mac in devices:
            dev = devices[norm_mac]
            return {
                "ok": True,
                "mac_id": norm_mac,
                "lead": agent_info.get("lead", "default"),
                "lan_uid": agent_info.get("lan_uid", "default"),
                "agent_uid": agent_uid,
                "printer_name": dev.get("printer_name", ""),
                "ip": dev.get("ip", ""),
                "counter": dev.get("counter") or {},
                "status": dev.get("status") or {},
                "last_seen_at": dev.get("updated_at", ""),
            }

        # Also search in-memory printers_json payload from active agents
        printers_list = agent_info.get("printers_json") or []
        for dev in printers_list:
            if not isinstance(dev, dict):
                continue
            dev_mac = str(dev.get("mac_address") or dev.get("mac_id") or "").upper().replace("-", ":")
            if dev_mac == norm_mac:
                return {
                    "ok": True,
                    "mac_id": norm_mac,
                    "lead": agent_info.get("lead", "default"),
                    "lan_uid": agent_info.get("lan_uid", "default"),
                    "agent_uid": agent_uid,
                    "printer_name": dev.get("printer_name") or dev.get("name") or "Photocopy",
                    "ip": dev.get("ip", ""),
                    "auth_user": dev.get("auth_user") or dev.get("user") or "",
                    "auth_password": dev.get("auth_password") or dev.get("password") or "",
                    "counter": {},
                    "status": {},
                    "last_seen_at": agent_info.get("last_seen_at").isoformat() if agent_info.get("last_seen_at") else "",
                }
    return None


def get_all_devices_in_memory() -> list[dict[str, Any]]:
    prune_offline_agents(timeout_seconds=120)
    output = []
    for agent_uid, agent_info in ACTIVE_AGENTS.items():
        devices = agent_info.get("devices", {})
        for mac_id, dev in devices.items():
            output.append({
                "mac_id": mac_id,
                "lead": agent_info.get("lead", "default"),
                "lan_uid": agent_info.get("lan_uid", "default"),
                "agent_uid": agent_uid,
                "printer_name": dev.get("printer_name", ""),
                "ip": dev.get("ip", ""),
                "counter": dev.get("counter") or {},
                "status": dev.get("status") or {},
                "last_seen_at": dev.get("updated_at", ""),
            })
    return output



def get_all_active_agents_in_memory(timeout_seconds: int = 30) -> list[dict[str, Any]]:
    prune_offline_agents(timeout_seconds=timeout_seconds)
    output = []
    for agent_uid, agent_info in ACTIVE_AGENTS.items():
        output.append({
            "lead": agent_info.get("lead", "default"),
            "lan_uid": agent_info.get("lan_uid", "default"),
            "agent_uid": agent_uid,
            "hostname": agent_info.get("hostname", ""),
            "local_ip": agent_info.get("local_ip", ""),
            "local_mac": agent_info.get("local_mac", ""),
            "app_version": agent_info.get("app_version", ""),
            "run_mode": agent_info.get("run_mode", "web"),
            "web_port": agent_info.get("web_port", 9173),
            "last_seen_at": agent_info.get("last_seen_at").isoformat() if agent_info.get("last_seen_at") else "",
            "device_count": len(agent_info.get("devices", {})),
        })
    return output

