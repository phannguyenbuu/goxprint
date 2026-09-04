import logging
import os
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Any
import requests
from sqlalchemy import select
from models import SystemSetting, utc_now

LOGGER = logging.getLogger(__name__)

_WEBHOOK_EXECUTOR = ThreadPoolExecutor(max_workers=10, thread_name_prefix="crm_webhook_worker")

# In-memory cache for webhook URL with 30-second TTL to avoid hitting DB on every dispatch
_CACHED_WEBHOOK_URL: str | None = None
_CACHED_AT: float = 0.0
_CACHE_TTL_SECONDS = 30.0


def get_crm_webhook_url(session_factory: Any = None) -> str:
    global _CACHED_WEBHOOK_URL, _CACHED_AT
    now = time.time()
    if _CACHED_WEBHOOK_URL is not None and (now - _CACHED_AT) < _CACHE_TTL_SECONDS:
        return _CACHED_WEBHOOK_URL

    url = os.environ.get("CRM_WEBHOOK_URL", "").strip()
    try:
        from utils import get_system_settings
        sys_settings = get_system_settings()
        if sys_settings.get("crm_webhook_url"):
            url = str(sys_settings["crm_webhook_url"]).strip()
    except Exception as exc:
        LOGGER.warning("[WebhookDispatcher] Error reading crm_webhook_url from settings.json: %s", exc)

    if not url and session_factory is not None:
        try:
            with session_factory() as session:
                setting = session.execute(
                    select(SystemSetting).where(SystemSetting.key == "crm_webhook_url")
                ).scalars().first()
                if setting and setting.value and setting.value.strip():
                    url = setting.value.strip()
        except Exception as exc:
            LOGGER.warning("[WebhookDispatcher] Error reading crm_webhook_url from DB: %s", exc)

    _CACHED_WEBHOOK_URL = url
    _CACHED_AT = now
    return url



def set_crm_webhook_url(session_factory: Any, url: str) -> None:
    global _CACHED_WEBHOOK_URL, _CACHED_AT
    clean_url = url.strip()
    with session_factory() as session:
        setting = session.execute(
            select(SystemSetting).where(SystemSetting.key == "crm_webhook_url")
        ).scalars().first()
        if not setting:
            setting = SystemSetting(
                key="crm_webhook_url",
                value=clean_url,
                description="CRM Webhook destination URL for device counter/status events",
                updated_at=utc_now(),
            )
            session.add(setting)
        else:
            setting.value = clean_url
            setting.updated_at = utc_now()
        session.commit()

    _CACHED_WEBHOOK_URL = clean_url
    _CACHED_AT = time.time()
    LOGGER.info("[WebhookDispatcher] Updated crm_webhook_url to: %s", clean_url or "(disabled)")


def _send_webhook_task(url: str, payload: dict[str, Any]) -> None:
    """Fire-and-forget delivery task. Drops data immediately on failure or timeout."""
    mac = payload.get("mac_id", "unknown")
    try:
        resp = requests.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json", "User-Agent": "Goxprint-Webhook/1.0"},
            timeout=2.0,
        )
        if resp.status_code >= 400:
            LOGGER.warning("[Webhook] CRM returned HTTP %s for device %s (Dropped)", resp.status_code, mac)
    except requests.exceptions.Timeout:
        LOGGER.warning("[Webhook] Timeout (2.0s) sending device %s to %s (Dropped)", mac, url)
    except Exception as exc:
        LOGGER.warning("[Webhook] Connection error sending device %s to %s: %s (Dropped)", mac, url, exc)


def dispatch_device_change(session_factory: Any, device_payload: dict[str, Any]) -> None:
    """Non-blocking fire-and-forget webhook dispatch when counter/status changes."""
    url = get_crm_webhook_url(session_factory)
    if not url:
        return  # No webhook configured

    # Submit task to thread pool without waiting
    _WEBHOOK_EXECUTOR.submit(_send_webhook_task, url, device_payload)
