from __future__ import annotations

import json
import logging
import os
import subprocess
import sys
import threading
import hashlib
import tempfile
import time
import urllib.parse
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests

from agent.services.runtime import fresh_pyinstaller_env, is_frozen, is_windows


LOGGER = logging.getLogger(__name__)
DEFAULT_APP_VERSION = "2.9.0905194600"
# Build timestamp: 2026-09-05 19:46:00
UPDATE_NOTICE_FILE = Path("storage/data/update_notice.json")
DETACHED_PROCESS = 0x00000008
CREATE_NEW_PROCESS_GROUP = 0x00000200
CREATE_NO_WINDOW = 0x08000000


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _env_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}



@dataclass
class UpdateState:
    current_version: str
    pending_version: str = ""
    last_check_at: str = ""
    last_available_version: str = ""
    last_download_url: str = ""
    last_source: str = ""
    last_signal_text: str = ""
    last_event_at: str = ""
    last_attempt_at: str = ""
    last_success_at: str = ""
    last_error: str = ""
    last_command: str = ""
    running: bool = False
    last_return_code: int | None = None


class AutoUpdater:
    def __init__(self, project_root: Path, current_args: list[str] | None = None) -> None:
        self.project_root = project_root
        
        self.current_version = DEFAULT_APP_VERSION
        self.auto_apply = _env_bool("UPDATE_AUTO_APPLY", default=False)
        self.default_command = os.getenv("UPDATE_DEFAULT_COMMAND", "git pull --ff-only").strip()
        prefix_raw = os.getenv("UPDATE_ALLOWED_PREFIX", "git pull --ff-only").strip()
        self.allowed_prefixes = [item.strip() for item in prefix_raw.split(",") if item.strip()]
        self.webhook_token = os.getenv("UPDATE_WEBHOOK_TOKEN", "").strip()
        self.state = UpdateState(current_version=self.current_version)
        self._lock = threading.Lock()
        self._current_args = list(current_args or ["--mode", "service"])
        self._release_check_interval_seconds = self.get_check_interval_seconds()

    def get_check_interval_seconds(self) -> int:
        try:
            from agent.config import AppConfig
            config = AppConfig.load()
            return max(30, config.get_int("modules.updater.check_interval_seconds", 60))
        except Exception:
            return max(30, int(os.getenv("UPDATE_CHECK_INTERVAL_SECONDS", "60") or "60"))

    def status(self) -> dict[str, Any]:
        with self._lock:
            payload = asdict(self.state)
        payload.update(
            {
                "auto_apply": self.auto_apply,
                "allowed_prefixes": self.allowed_prefixes,
                "default_command": self.default_command,
                "check_interval_seconds": self.get_check_interval_seconds(),
            }
        )
        return payload

    @property
    def check_interval_seconds(self) -> int:
        return self.get_check_interval_seconds()

    def _is_allowed(self, command: str) -> bool:
        if not command:
            return False
        if not self.allowed_prefixes:
            return True
        return any(command.startswith(prefix) for prefix in self.allowed_prefixes)

    def _start_command(self, command: str, target_version: str) -> tuple[bool, str]:
        with self._lock:
            if self.state.running:
                return False, "Update already running"
            self.state.running = True
            self.state.last_attempt_at = _utc_now()
            self.state.last_command = command
            self.state.last_error = ""
            self.state.last_return_code = None

        thread = threading.Thread(target=self._run_command, args=(command, target_version), daemon=True, name="auto-updater-thread")
        thread.start()
        return True, "Update started"

    def _run_command(self, command: str, target_version: str) -> None:
        try:
            process = subprocess.run(
                command,
                cwd=str(self.project_root),
                shell=True,
                capture_output=True,
                text=True,
                timeout=900,
            )
            with self._lock:
                self.state.last_return_code = int(process.returncode)
                if process.returncode == 0:
                    self.state.last_success_at = _utc_now()
                    if target_version:
                        self.state.current_version = target_version
                    self.state.pending_version = ""
                    self.state.last_error = ""
                else:
                    err = (process.stderr or process.stdout or "").strip()
                    self.state.last_error = err or f"Update failed with code {process.returncode}"
        except Exception as exc:  # noqa: BLE001
            with self._lock:
                self.state.last_error = str(exc)
        finally:
            with self._lock:
                self.state.running = False

    @staticmethod
    def _normalize_version(version: str) -> tuple[int, ...]:
        text = str(version or "").strip()
        if not text:
            return tuple()
        text = text.lstrip("vV")
        parts: list[int] = []
        for chunk in text.split("."):
            digits = "".join(ch for ch in chunk if ch.isdigit())
            if not digits:
                parts.append(0)
            else:
                parts.append(int(digits))
        return tuple(parts)

    @classmethod
    def _is_newer_version(cls, candidate: str, current: str) -> bool:
        c1 = cls._normalize_version(candidate)
        c2 = cls._normalize_version(current)
        if not c1:
            return False
        width = max(len(c1), len(c2))
        c1 = c1 + (0,) * (width - len(c1))
        c2 = c2 + (0,) * (width - len(c2))
        return c1 > c2

    @staticmethod
    def _sha256_file(path: Path) -> str:
        digest = hashlib.sha256()
        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
        return digest.hexdigest()

    @staticmethod
    def _resolve_url(base_url: str, value: str) -> str:
        text = str(value or "").strip()
        if not text:
            return ""
        return urllib.parse.urljoin(base_url.rstrip("/") + "/", text)

    def _current_binary_path(self) -> Path | None:
        if is_frozen():
            return Path(sys.executable).resolve()
        return None

    @staticmethod
    def _vbs_string(value: str) -> str:
        return str(value or "").replace('"', '""')

    @staticmethod
    def _write_update_notice(path: Path, version: str) -> None:
        payload = {
            "version": str(version or "").strip(),
            "updated_at": _utc_now(),
        }
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload, ensure_ascii=True), encoding="utf-8")

    def should_check(self) -> bool:
        # Autoupdate completely disabled
        return False

    def check_remote_release(
        self,
        session: requests.Session,
        base_url: str,
        token: str,
        lead: str,
        agent_uid: str,
        lan_uid: str,
        hostname: str,
        local_ip: str,
    ) -> tuple[bool, str, bool]:
        # Autoupdate completely disabled
        return False, "Auto-update disabled", False

    def apply_release_manifest(self, payload: dict, base_url: str = "") -> tuple[bool, str, bool]:
        # Autoupdate and watchdog completely disabled
        return False, "Auto-update disabled", False

