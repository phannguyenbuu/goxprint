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
DEFAULT_APP_VERSION = "2.8.53"
# Build timestamp: 2026-05-22 17:30:00
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


def _get_core_zip_path() -> Path:
    temp_dir = os.environ.get("TEMP")
    if temp_dir:
        folder = Path(temp_dir) / "GoPrinxAgent"
    else:
        import tempfile
        folder = Path(tempfile.gettempdir()) / "GoPrinxAgent"
    try:
        folder.mkdir(parents=True, exist_ok=True)
        return folder / "agent_core.zip"
    except Exception:
        return Path("agent_core.zip")


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
        
        disk_ver = ""
        try:
            for notice_path in [
                UPDATE_NOTICE_FILE,
                Path(tempfile.gettempdir()) / "GoPrinxAgent" / "update_notice.json",
                Path("C:/ProgramData/GoPrinxAgent/update_notice.json"),
            ]:
                if notice_path.exists():
                    try:
                        n_data = json.loads(notice_path.read_text(encoding="utf-8"))
                        v = str(n_data.get("version") or "").strip()
                        if v:
                            disk_ver = v
                            break
                    except Exception:
                        pass
        except Exception:
            pass

        self.current_version = disk_ver or DEFAULT_APP_VERSION
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
        with self._lock:
            if self.state.running:
                return False
            last_check_at = self.state.last_check_at
        if not last_check_at:
            return True
        try:
            elapsed = datetime.now(timezone.utc) - datetime.fromisoformat(last_check_at)
            return elapsed.total_seconds() >= self.get_check_interval_seconds()
        except Exception:
            return True

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
        if not base_url or not token or not lead:
            return False, "Release check not configured", False

        with self._lock:
            self.state.last_check_at = _utc_now()

        current_binary = self._current_binary_path()
        current_sha = ""
        if current_binary is not None and current_binary.exists():
            try:
                current_sha = self._sha256_file(current_binary)
            except Exception as exc:  # noqa: BLE001
                LOGGER.warning("Failed to hash current agent binary: %s", exc)

        headers = {"Accept": "application/json", "X-Lead-Token": token}
        params = {
            "lead": lead,
            "agent_uid": agent_uid,
            "lan_uid": lan_uid,
            "hostname": hostname,
            "local_ip": local_ip,
            "current_version": self.state.current_version,
            "current_sha256": current_sha,
        }
        try:
            endpoint = "/api/agent/core-release"
            response = session.get(f"{base_url}{endpoint}", params=params, headers=headers, timeout=20)
            response.raise_for_status()
            payload = response.json()
        except Exception as exc:  # noqa: BLE001
            with self._lock:
                self.state.last_error = str(exc)
            return False, f"Release check failed: {exc}", False

        if not isinstance(payload, dict):
            return False, "Invalid release payload", False
        return self.apply_release_manifest(payload, base_url=base_url)

    def _download_and_apply_core_zip(self, download_url: str, target_version: str, expected_sha256: str) -> tuple[bool, str, bool]:
        core_zip_path = _get_core_zip_path()
        try:
            request_headers = {
                "Cache-Control": "no-cache, no-store, max-age=0",
                "Pragma": "no-cache",
            }
            if expected_sha256:
                joiner = "&" if "?" in download_url else "?"
                download_url = f"{download_url}{joiner}v={expected_sha256}"

            with requests.get(download_url, stream=True, timeout=(20, 300), headers=request_headers) as response:
                response.raise_for_status()
                with core_zip_path.open("wb") as handle:
                    for chunk in response.iter_content(chunk_size=1024 * 1024):
                        if chunk:
                            handle.write(chunk)

            # Copy downloaded core zip to all candidate locations to guarantee loader picks it up
            target_dirs = [
                Path(os.environ.get("TEMP", "")) / "GoPrinxAgent",
                Path(tempfile.gettempdir()) / "GoPrinxAgent",
                Path("C:/ProgramData/GoPrinxAgent"),
            ]
            local_app_dir = os.environ.get("LOCALAPPDATA")
            if local_app_dir:
                target_dirs.append(Path(local_app_dir) / "Temp" / "GoPrinxAgent")
                target_dirs.append(Path(local_app_dir) / "GoPrinxAgent")

            # First: purge stale zips + extracted dirs at ALL locations so loader can't pick old ones
            for t_dir in target_dirs:
                try:
                    stale_zip = t_dir / "agent_core.zip"
                    if stale_zip.exists() and stale_zip != core_zip_path:
                        stale_zip.unlink(missing_ok=True)
                    stale_extract = t_dir / "agent_core"
                    if stale_extract.is_dir():
                        import shutil as _shutil
                        _shutil.rmtree(stale_extract, ignore_errors=True)
                except Exception:
                    pass

            # Then: copy fresh zip to all locations
            for t_dir in target_dirs:
                try:
                    t_dir.mkdir(parents=True, exist_ok=True)
                    t_zip = t_dir / "agent_core.zip"
                    if t_zip != core_zip_path:
                        import shutil
                        shutil.copy2(core_zip_path, t_zip)
                except Exception:
                    pass

            LOGGER.info("[Updater] Updated agent_core.zip v%s at %s", target_version, core_zip_path)
            from_ver = self.state.current_version
            with self._lock:
                self.state.current_version = target_version or DEFAULT_APP_VERSION
                self.state.last_success_at = _utc_now()
                self.state.last_error = ""

            for notice_path in [
                UPDATE_NOTICE_FILE,
                Path(tempfile.gettempdir()) / "GoPrinxAgent" / "update_notice.json",
                Path("C:/ProgramData/GoPrinxAgent/update_notice.json"),
            ]:
                try:
                    self._write_update_notice(notice_path, target_version)
                except Exception:
                    pass

            self._report_update_to_vps(from_version=from_ver, to_version=target_version, status="success")

            # Re-check if an even newer version exists before restarting
            # This prevents cascading restarts (e.g. v22→v23 restart, v23→v24 restart)
            try:
                base_url = ""
                try:
                    from agent.config import AppConfig
                    cfg = AppConfig.load()
                    base_url = cfg.get_string("polling.url").strip().rstrip("/")
                except Exception:
                    pass
                if base_url:
                    recheck_resp = requests.get(
                        f"{base_url}/api/agent/core-release",
                        params={"current_version": target_version},
                        timeout=10,
                    )
                    if recheck_resp.ok:
                        recheck_data = recheck_resp.json()
                        newer_version = str(recheck_data.get("version") or "").strip()
                        if newer_version and self._is_newer_version(newer_version, target_version):
                            LOGGER.info("[Updater] Found even newer v%s (current download: v%s). Downloading latest before restart...", newer_version, target_version)
                            newer_url = self._resolve_url(base_url, str(recheck_data.get("download_url") or recheck_data.get("url") or "").strip())
                            newer_sha = str(recheck_data.get("sha256") or "").strip().lower()
                            if newer_url:
                                return self._download_and_apply_core_zip(newer_url, newer_version, newer_sha)
            except Exception as recheck_exc:
                LOGGER.debug("[Updater] Re-check for newer version failed (non-critical): %s", recheck_exc)

            relaunch_command = subprocess.list2cmdline([sys.executable, *self._current_args])
            current_pid = os.getpid()

            # Write a .bat helper that survives parent exit (same pattern as exe update)
            helper_script = Path(tempfile.gettempdir()) / "GoPrinxAgent" / "restart_agent.bat"
            helper_script.parent.mkdir(parents=True, exist_ok=True)
            helper_lines = [
                "@echo off",
                "setlocal enabledelayedexpansion",
                f"set OLD_PID={current_pid}",
                "set RETRIES=0",
                "",
                "rem ── Wait for old process to exit (max ~30s) ──",
                ":wait_old_exit",
                'tasklist /FI "PID eq %OLD_PID%" 2>nul | find /I "%OLD_PID%" >nul',
                "if errorlevel 1 goto do_kill",
                "set /a RETRIES=!RETRIES!+1",
                "if !RETRIES! GEQ 30 goto do_kill",
                "ping 127.0.0.1 -n 2 > nul",
                "goto wait_old_exit",
                "",
                ":do_kill",
                "rem Kill ALL remaining printagent processes",
                "taskkill /F /IM printagent.exe >nul 2>&1",
                "ping 127.0.0.1 -n 3 > nul",
                "",
                "rem ── Relaunch agent (hidden) ──",
                f'start "" {relaunch_command}',
                "",
                "rem Cleanup bat",
                "ping 127.0.0.1 -n 2 > nul",
                'del "%~f0"',
            ]
            helper_script.write_text("\r\n".join(helper_lines) + "\r\n", encoding="utf-8")
            LOGGER.info("[Updater] Wrote restart helper: %s (PID %d, relaunch: %s)", helper_script, current_pid, relaunch_command)

            helper_cmd = ["cmd.exe", "/c", str(helper_script)]
            si = subprocess.STARTUPINFO()
            si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            si.wShowWindow = 0  # SW_HIDE
            subprocess.Popen(
                helper_cmd,
                cwd=str(helper_script.parent),
                close_fds=True,
                creationflags=DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP | CREATE_NO_WINDOW,
                startupinfo=si,
                env=fresh_pyinstaller_env(),
            )
            time.sleep(0.5)
            os._exit(0)
            return True, "Updated agent_core.zip successfully", True
        except Exception as exc:
            LOGGER.warning("[Updater] Failed to update agent_core.zip: %s", exc)
            self._report_update_to_vps(from_version=self.state.current_version, to_version=target_version, status="failed", error_msg=str(exc))
            return False, str(exc), False

    def _report_update_to_vps(self, from_version: str, to_version: str, status: str = "success", error_msg: str = "") -> None:
        try:
            from agent.config import AppConfig
            cfg = AppConfig.load()
            base_url = cfg.get_string("polling.url").strip().rstrip("/")
            lead = cfg.get_string("polling.lead").strip()
            token = cfg.get_string("polling.token").strip()
            raw_agent_uid = cfg.get_string("polling.agent_uid", "").strip()
            import socket
            agent_uid = raw_agent_uid or socket.gethostname()

            if base_url:
                endpoint = f"{base_url}/api/agent/report-update-event"
                payload = {
                    "lead": lead,
                    "agent_uid": agent_uid,
                    "from_version": from_version,
                    "to_version": to_version,
                    "status": status,
                    "error_message": error_msg,
                }
                headers = {"Content-Type": "application/json"}
                if token:
                    headers["X-Lead-Token"] = token
                    headers["X-API-Token"] = token
                requests.post(endpoint, json=payload, headers=headers, timeout=5)
                LOGGER.info("[Updater] Reported update event to VPS: v%s -> v%s (%s)", from_version, to_version, status)
        except Exception as report_exc:
            LOGGER.warning("[Updater] Failed reporting update event to VPS: %s", report_exc)

    def apply_release_manifest(self, payload: dict[str, Any], base_url: str) -> tuple[bool, str, bool]:
        latest_version = str(payload.get("version") or "").strip()
        download_url = self._resolve_url(base_url, str(payload.get("download_url") or payload.get("url") or "").strip())
        expected_sha = str(payload.get("sha256") or "").strip().lower()
        update_available = bool(payload.get("update_available", False))

        with self._lock:
            self.state.last_available_version = latest_version
            self.state.last_download_url = download_url

        is_different = (latest_version != self.state.current_version)
        is_newer = self._is_newer_version(latest_version, self.state.current_version)
        is_mandatory = bool(payload.get("mandatory", True))

        # Also check if the local agent_core.zip SHA differs from manifest (allows hotfix without version bump)
        sha_mismatch = False
        if expected_sha and not is_newer and not is_different:
            local_zip = _get_core_zip_path()
            if local_zip.exists():
                try:
                    local_sha = self._sha256_file(local_zip).lower()
                    sha_mismatch = (local_sha != expected_sha)
                    if sha_mismatch:
                        LOGGER.info("[Updater] Same version v%s but SHA mismatch (local=%s, remote=%s). Forcing update.", self.state.current_version, local_sha[:12], expected_sha[:12])
                except Exception:
                    sha_mismatch = True  # Can't verify → update to be safe

        if not (is_newer or (is_different and is_mandatory) or sha_mismatch):
            LOGGER.debug("[Updater] Already on target version v%s (server v%s). No update required.", self.state.current_version, latest_version)
            return True, "Already on target version", False

        if not download_url:
            return False, "Release payload missing download_url", False

        clean_url = download_url.split("?")[0].lower()
        if clean_url.endswith(".zip"):
            return self._download_and_apply_core_zip(download_url=download_url, target_version=latest_version, expected_sha256=expected_sha)
        elif clean_url.endswith(".exe"):
            core_zip_url = self._resolve_url(base_url, "/static/releases/agent_core.zip")
            LOGGER.info("[Updater] Manifest returned .exe URL (%s). Redirecting to dynamic agent_core.zip update at %s", download_url, core_zip_url)
            return self._download_and_apply_core_zip(download_url=core_zip_url, target_version=latest_version, expected_sha256="")
        return self._download_and_restart(download_url=download_url, target_version=latest_version, expected_sha256=expected_sha)

    def _download_and_restart(self, download_url: str, target_version: str, expected_sha256: str) -> tuple[bool, str, bool]:
        current_binary = self._current_binary_path()
        if current_binary is None or not current_binary.exists():
            return False, "Current binary path not available", False

        with self._lock:
            if self.state.running:
                return False, "Update already running", False
            self.state.running = True
            self.state.pending_version = target_version
            self.state.last_attempt_at = _utc_now()
            self.state.last_command = download_url
            self.state.last_error = ""
            self.state.last_return_code = None

        release_dir = current_binary.parent
        staged_binary = release_dir / f"{current_binary.stem}.new.tmp"
        backup_binary = release_dir / f"{current_binary.stem}.bak{current_binary.suffix}"
        helper_script = release_dir / "storage" / "data" / "agent_update.bat"
        notice_file = UPDATE_NOTICE_FILE if UPDATE_NOTICE_FILE.is_absolute() else release_dir / UPDATE_NOTICE_FILE
        helper_script.parent.mkdir(parents=True, exist_ok=True)

        try:
            request_headers = {
                "Cache-Control": "no-cache, no-store, max-age=0",
                "Pragma": "no-cache",
            }
            cache_buster = ""
            if expected_sha256:
                cache_buster = f"v={expected_sha256}"
            if cache_buster:
                joiner = "&" if "?" in download_url else "?"
                download_url = f"{download_url}{joiner}{cache_buster}"
            with requests.get(download_url, stream=True, timeout=(20, 300), headers=request_headers) as response:
                response.raise_for_status()
                with staged_binary.open("wb") as handle:
                    for chunk in response.iter_content(chunk_size=1024 * 1024):
                        if chunk:
                            handle.write(chunk)

            downloaded_sha = self._sha256_file(staged_binary).lower()
            if expected_sha256 and downloaded_sha != expected_sha256:
                raise RuntimeError(f"Downloaded agent checksum mismatch: expected={expected_sha256} got={downloaded_sha}")

            if backup_binary.exists():
                backup_binary.unlink()

            relaunch_command = subprocess.list2cmdline([str(current_binary), *self._current_args])
            relaunch_ftp_command = subprocess.list2cmdline([str(current_binary), "--mode", ""])
            current_pid = os.getpid()
            helper_lines = [
                "@echo off",
                f"set OLD_PID={current_pid}",
                "set /a RETRIES=0",
                "set /a MAX_RETRIES=60",
                "",
                "rem ── Phase 1: Wait for old process (PID) to fully exit ──",
                ":wait_old_exit",
                'tasklist /FI "PID eq %OLD_PID%" 2>nul | find /I "%OLD_PID%" >nul',
                "if not errorlevel 1 (",
                "    set /a RETRIES+=1",
                "    if %RETRIES% GEQ %MAX_RETRIES% goto force_continue",
                "    ping 127.0.0.1 -n 2 > nul",
                "    goto wait_old_exit",
                ")",
                "",
                "rem Terminate any remaining printagent processes to release file locks",
                "taskkill /F /IM printagent.exe >nul 2>&1",
                "ping 127.0.0.1 -n 2 > nul",
                "",
                "rem Extra delay for Win 11 Defender/AV to release file lock",
                "ping 127.0.0.1 -n 4 > nul",
                "",
                "rem ── Phase 2: Delete old .bak if exists ──",
                f'if exist "{str(backup_binary)}" (',
                f'    del /f /q "{str(backup_binary)}" >nul 2>&1',
                ")",
                "",
                ":force_continue",
                "set /a RETRIES=0",
                "",
                "rem ── Phase 3: Rename current exe → .bak ──",
                ":retry_rename",
                f'if exist "{str(current_binary)}" (',
                f'    rename "{str(current_binary)}" "{backup_binary.name}"',
                "    if errorlevel 1 (",
                "        set /a RETRIES+=1",
                "        if %RETRIES% GEQ %MAX_RETRIES% goto rename_failed",
                "        ping 127.0.0.1 -n 2 > nul",
                "        goto retry_rename",
                "    )",
                ")",
                "",
                "rem ── Phase 4: Rename .new.tmp → current exe ──",
                ":retry_stage",
                f'if exist "{str(staged_binary)}" (',
                f'    rename "{str(staged_binary)}" "{current_binary.name}"',
                "    if errorlevel 1 (",
                "        set /a RETRIES+=1",
                "        if %RETRIES% GEQ %MAX_RETRIES% goto rename_failed",
                "        ping 127.0.0.1 -n 2 > nul",
                "        goto retry_stage",
                "    )",
                ")",
                "",
                "rem ── Phase 5: Launch new agent FIRST, then cleanup ──",
                f'start "" {relaunch_command}',
                f'start "" {relaunch_ftp_command}',
                "",
                "rem Try to delete .bak in background (non-blocking)",
                "ping 127.0.0.1 -n 3 > nul",
                f'del /f /q "{str(backup_binary)}" >nul 2>&1',
                'del "%~f0"',
                "goto :eof",
                "",
                ":rename_failed",
                "rem Rename failed after max retries - try to launch whatever is available",
                f'if exist "{str(current_binary)}" (',
                f'    start "" {relaunch_command}',
                f'    start "" {relaunch_ftp_command}',
                ") else (",
                f'    if exist "{str(staged_binary)}" (',
                f'        rename "{str(staged_binary)}" "{current_binary.name}"',
                f'        start "" {relaunch_command}',
                f'        start "" {relaunch_ftp_command}',
                "    )",
                ")",
                'del "%~f0"',
            ]
            helper_script.write_text("\r\n".join(helper_lines) + "\r\n", encoding="utf-8")
            helper_cmd = [
                "cmd.exe",
                "/c",
                str(helper_script),
            ]
            notice_version = str(target_version or self.state.last_available_version or "").strip()
            if notice_version:
                try:
                    self._write_update_notice(notice_file, notice_version)
                except Exception as exc:  # noqa: BLE001
                    LOGGER.warning("Failed to write update notice marker: %s", exc)
            subprocess.Popen(
                helper_cmd,
                cwd=str(release_dir),
                close_fds=True,
                creationflags=CREATE_NEW_PROCESS_GROUP | CREATE_NO_WINDOW,
                env=fresh_pyinstaller_env(),
            )
            with self._lock:
                self.state.last_success_at = _utc_now()
                self.state.last_return_code = 0
                self.state.last_error = ""
                if target_version:
                    self.state.current_version = target_version
                self.state.running = False
            return True, "Update staged; restarting agent", True
        except Exception as exc:  # noqa: BLE001
            with self._lock:
                self.state.last_error = str(exc)
                self.state.running = False
                self.state.last_return_code = 1
            try:
                if staged_binary.exists():
                    staged_binary.unlink()
            except Exception:
                pass
            try:
                if helper_script.exists():
                    helper_script.unlink()
            except Exception:
                pass
            try:
                if notice_file.exists():
                    notice_file.unlink()
            except Exception:
                pass
            return False, str(exc), False

    def handle_signal(self, version: str, command_text: str, source: str, raw_text: str = "") -> tuple[bool, str]:
        version = (version or "").strip()
        command_text = (command_text or "").strip()
        source = source.strip() or "unknown"
        now = _utc_now()

        with self._lock:
            self.state.last_source = source
            self.state.last_signal_text = raw_text[:1000]
            self.state.last_event_at = now
            if version:
                self.state.pending_version = version

        if version and version == self.state.current_version:
            return True, "Already on latest version"

        if not self.auto_apply:
            return True, "Update signal received (auto-apply disabled)"

        command = command_text or self.default_command
        if not self._is_allowed(command):
            with self._lock:
                self.state.last_error = f"Command is not allowed: {command}"
            return False, "Command is not allowed by UPDATE_ALLOWED_PREFIX"

        return self._start_command(command, version)

    def handle_text_message(self, message: str, source: str = "ws") -> tuple[bool, str]:
        text = (message or "").strip()
        if not text:
            return False, "Empty update message"

        version = ""
        command = ""
        try:
            parsed = json.loads(text)
            event = str(parsed.get("event", "")).strip().lower()
            payload = parsed.get("payload", {})
            if not isinstance(payload, dict):
                payload = {}
            if event in {"update", "update_available", "new_version"}:
                version = str(payload.get("version") or parsed.get("version") or "").strip()
                command = str(payload.get("command") or payload.get("text") or parsed.get("command") or "").strip()
                return self.handle_signal(version, command, source=source, raw_text=text)
            return False, f"Ignored non-update event: {event or 'unknown'}"
        except Exception:  # noqa: BLE001
            pass

        # Plain text format support:
        # "UPDATE 1.2.3|git pull --ff-only"
        # or "UPDATE 1.2.3"
        if text.upper().startswith("UPDATE "):
            body = text[7:].strip()
            if "|" in body:
                version, command = body.split("|", 1)
                return self.handle_signal(version.strip(), command.strip(), source=source, raw_text=text)
            return self.handle_signal(body, "", source=source, raw_text=text)

        return False, "Ignored message format"


