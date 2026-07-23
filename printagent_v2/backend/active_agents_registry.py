from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict

LOGGER = logging.getLogger(__name__)

# In-memory registry of active PC Agents and their reported device telemetry.
# Zero PostgreSQL database writes for device/agent_node entries.
ACTIVE_AGENTS: Dict[str, Dict[str, Any]] = {}


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
) -> None:
    now = datetime.now(timezone.utc)
    key = agent_uid or "legacy-agent"

    if key not in ACTIVE_AGENTS:
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

    agent_entry = ACTIVE_AGENTS[key]
    devices_dict = agent_entry.setdefault("devices", {})

    if mac_id:
        norm_mac = mac_id.upper().replace("-", ":")
        dev = devices_dict.setdefault(norm_mac, {})
        dev["mac_id"] = norm_mac
        dev["printer_name"] = printer_name or dev.get("printer_name", "Unknown Printer")
        dev["ip"] = ip or dev.get("ip", "")
        if isinstance(counter_data, dict) and counter_data:
            dev["counter"] = counter_data
        if isinstance(status_data, dict) and status_data:
            dev["status"] = status_data
        dev["updated_at"] = now.isoformat()


def prune_offline_agents(timeout_seconds: int = 30) -> None:
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
    prune_offline_agents(timeout_seconds=30)
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
    return None


def get_all_devices_in_memory() -> list[dict[str, Any]]:
    prune_offline_agents(timeout_seconds=30)
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

