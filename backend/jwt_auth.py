from __future__ import annotations

import base64
import hashlib
import hmac
import json
import logging
import os
import time
from typing import Any, Optional

from sqlalchemy import select

from models import UserAccount, UserType
from utils import _to_text

LOGGER = logging.getLogger(__name__)

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "goxprint_super_secret_jwt_key_2026_agentapi_secure")
JWT_EXPIRATION_SECONDS = 30 * 24 * 60 * 60  # 30 days
COOKIE_NAME = "gox_token"


def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _base64url_decode(data_str: str) -> bytes:
    padding = "=" * (-len(data_str) % 4)
    return base64.urlsafe_b64decode(data_str + padding)


def jwt_encode(payload: dict[str, Any], secret: str = JWT_SECRET_KEY) -> str:
    """Encode payload to HS256 JWT string using pure Python standard library."""
    header = {"alg": "HS256", "typ": "JWT"}
    header_bytes = json.dumps(header, separators=(",", ":"), sort_keys=True).encode("utf-8")
    payload_bytes = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")

    header_b64 = _base64url_encode(header_bytes)
    payload_b64 = _base64url_encode(payload_bytes)

    signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
    signature = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    sig_b64 = _base64url_encode(signature)

    return f"{header_b64}.{payload_b64}.{sig_b64}"


def jwt_decode(token: str, secret: str = JWT_SECRET_KEY) -> Optional[dict[str, Any]]:
    """Decode and verify HS256 JWT string. Returns None if invalid or expired."""
    if not token or not isinstance(token, str):
        return None

    parts = token.strip().split(".")
    if len(parts) != 3:
        return None

    header_b64, payload_b64, sig_b64 = parts
    try:
        signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
        expected_sig = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
        actual_sig = _base64url_decode(sig_b64)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload_bytes = _base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode("utf-8"))
        if not isinstance(payload, dict):
            return None

        exp = payload.get("exp")
        if exp is not None and isinstance(exp, (int, float)):
            if time.time() > float(exp):
                return None  # Expired

        return payload
    except Exception as exc:
        LOGGER.debug("JWT decode error: %s", exc)
        return None


def create_auth_token(username: str, role: str = "admin", lead: str = "default", extra: Optional[dict[str, Any]] = None) -> str:
    """Create a standard JWT token valid for 30 days."""
    now = int(time.time())
    payload: dict[str, Any] = {
        "sub": username,
        "username": username,
        "role": role,
        "lead": lead,
        "iat": now,
        "exp": now + JWT_EXPIRATION_SECONDS,
    }
    if extra:
        payload.update(extra)
    return jwt_encode(payload, JWT_SECRET_KEY)


def verify_auth_token(token: str) -> Optional[dict[str, Any]]:
    """Verify an auth token string."""
    return jwt_decode(token, JWT_SECRET_KEY)


def authenticate_user(session_factory: Any, username_or_email: str, password: str) -> tuple[bool, Optional[dict[str, Any]]]:
    """
    Authenticate user credentials.
    Supports fixed user 'gox' / '012345' and accounts in UserAccount table.
    """
    username_or_email = _to_text(username_or_email).strip()
    password = _to_text(password).strip()

    if not username_or_email or not password:
        return False, None

    # 1. Hardcoded priority admin credential
    if username_or_email.lower() == "gox" and password == "DuaTGP206#!!879101":
        return True, {
            "username": "gox",
            "email": "gox@quanlymay.com",
            "full_name": "GoPrinx Admin",
            "role": "admin",
            "user_type": "admin",
            "lead": "default",
        }

    # 2. Database lookup
    try:
        with session_factory() as session:
            user = session.execute(
                select(UserAccount).where(
                    (UserAccount.username == username_or_email) | (UserAccount.email == username_or_email)
                )
            ).scalar_one_or_none()

            if user and user.is_active and user.password == password:
                return True, {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name or user.username,
                    "role": user.role or user.user_type or "admin",
                    "user_type": user.user_type or "admin",
                    "lead": user.lead or "default",
                }
    except Exception as exc:
        LOGGER.warning("Database authentication error: %s", exc)

    return False, None


def ensure_default_admin(session_factory: Any) -> None:
    """Ensure that default user 'gox' exists in UserAccount table."""
    try:
        with session_factory() as session:
            existing = session.execute(
                select(UserAccount).where(UserAccount.username == "gox")
            ).scalar_one_or_none()

            if not existing:
                admin_user = UserAccount(
                    lead="default",
                    username="gox",
                    password="DuaTGP206#!!879101",
                    full_name="GoPrinx Admin",
                    email="gox@quanlymay.com",
                    user_type=UserType.TECH.value,
                    role=UserType.TECH.value,
                    is_active=True,
                    notes="Default system admin account",
                )
                session.add(admin_user)
                session.commit()
                LOGGER.info("Created default admin user 'gox'")
            else:
                updated = False
                if existing.password != "DuaTGP206#!!879101":
                    existing.password = "DuaTGP206#!!879101"
                    updated = True
                if not existing.is_active:
                    existing.is_active = True
                    updated = True
                if updated:
                    session.commit()
                    LOGGER.info("Updated default admin user 'gox'")
    except Exception as exc:
        LOGGER.warning("ensure_default_admin failed (transient): %s", exc)
