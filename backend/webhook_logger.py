from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any, Optional

from models import WebhookLog, utc_now

LOGGER = logging.getLogger(__name__)


def _to_json_str(val: Any, max_len: int = 40000) -> str:
    if val is None:
        return ""
    if isinstance(val, str):
        s = val
    else:
        try:
            s = json.dumps(val, ensure_ascii=False, default=str)
        except Exception:
            s = str(val)
    if len(s) > max_len:
        return s[:max_len] + "... [truncated]"
    return s


def log_webhook_event(
    session_factory: Any,
    endpoint: str,
    method: str = "GET",
    ip_address: str = "",
    user_agent: str = "",
    query_params: Any = None,
    request_payload: Any = None,
    response_status: int = 200,
    response_payload: Any = None,
    mac_id: str = "",
    printer_name: str = "",
    duration_ms: int = 0,
    lead: str = "default",
) -> Optional[int]:
    """Safely log a webhook or API user interaction into the WebhookLog table."""
    if not session_factory:
        return None

    try:
        query_str = _to_json_str(query_params)
        req_str = _to_json_str(request_payload)
        resp_str = _to_json_str(response_payload)

        with session_factory() as session:
            log_entry = WebhookLog(
                lead=str(lead or "default")[:64],
                endpoint=str(endpoint or "")[:128],
                method=str(method or "GET").upper()[:16],
                ip_address=str(ip_address or "")[:64],
                user_agent=str(user_agent or "")[:255],
                query_params=query_str,
                request_payload=req_str,
                response_status=int(response_status or 200),
                response_payload=resp_str,
                mac_id=str(mac_id or "")[:64],
                printer_name=str(printer_name or "")[:255],
                duration_ms=int(duration_ms or 0),
                created_at=utc_now(),
            )
            session.add(log_entry)
            session.commit()
            return log_entry.id
    except Exception as exc:
        LOGGER.warning("[WebhookLogger] Failed to record webhook log: %s", exc)
        return None
