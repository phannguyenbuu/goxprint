from __future__ import annotations

import os
from pathlib import Path
from typing import Any


class AppConfig:
    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data
        self._last_mtime = 0.0

    @classmethod
    def load(cls) -> "AppConfig":
        raw = cls._default_data()
        cls._apply_json_overrides(raw)
        cls._apply_env_overrides(raw)
        config = cls(raw)
        try:
            path = cls._settings_file_path()
            if path.exists():
                config._last_mtime = path.stat().st_mtime
        except Exception:
            pass
        return config

    @classmethod
    def _settings_file_path(cls) -> Path:
        import sys
        if getattr(sys, "frozen", False):
            return Path(sys.executable).resolve().parent / "settings.json"
        return Path("settings.json")

    @classmethod
    def _apply_json_overrides(cls, raw: dict[str, Any]) -> None:
        settings_path = cls._settings_file_path()
        if not settings_path.exists():
            try:
                import json
                default_settings = {
                    "api_url": "https://agentapi.quanlymay.com/api",
                    "polling": {
                        "enabled": True,
                        "device_enabled": True,
                        "device_interval_seconds": 1,
                        "control_enabled": True,
                        "control_interval_seconds": 1,
                        "scan_enabled": True,
                        "scan_interval_seconds": 1,
                        "scan_dirs": "storage/scans/inbox",
                        "scan_recursive": True,
                    },
                    "modules": {
                        "ricoh": {
                            "enabled": True,
                        },
                        "toshiba": {
                            "enabled": True,
                        },
                        "ftp": {
                            "enabled": True,
                        },
                        "updater": {
                            "enabled": True,
                            "check_interval_seconds": 300,
                        },
                        "web": {
                            "enabled": True,
                        },
                    },
                }
                with settings_path.open("w", encoding="utf-8") as f:
                    json.dump(default_settings, f, indent=2, ensure_ascii=False)
            except Exception:
                pass

        if settings_path.exists():
            try:
                import json
                with settings_path.open("r", encoding="utf-8") as f:
                    file_data = json.load(f)
                if isinstance(file_data, dict):
                    cls._merge_dict(raw, file_data)
            except Exception:
                pass

    def reload(self) -> None:
        try:
            path = self._settings_file_path()
            mtime = path.stat().st_mtime if path.exists() else 0.0
            if mtime == self._last_mtime:
                return  # No change, avoid disk read
            self._last_mtime = mtime
        except Exception:
            pass

        raw = self._default_data()
        self._apply_json_overrides(raw)
        self._apply_env_overrides(raw)
        self._data.clear()
        self._data.update(raw)

    @classmethod
    def _merge_dict(cls, target: dict[str, Any], source: dict[str, Any]) -> None:
        for k, v in source.items():
            if isinstance(v, dict) and k in target and isinstance(target[k], dict):
                cls._merge_dict(target[k], v)
            else:
                target[k] = v

    @staticmethod
    def _default_data() -> dict[str, Any]:
        return {
            "database_url": "sqlite:///storage/data/agent_config.db",
            "api_url": "https://agentapi.quanlymay.com/api",
            "user_token": "",
            "webhook": {
                "mode": "listen",
                "listen_path": "/api/update/receive-text",
            },
            "test": {
                "ip": "",
                "user": "",
                "password": "",
                "post_server": False,
            },
            "polling": {
                "enabled": True,
                "device_enabled": True,
                "device_interval_seconds": "1",
                "control_enabled": True,
                "control_interval_seconds": "1",
                "url": "https://agentapi.quanlymay.com",
                "lead": "default",
                "token": "change-me",
                "interval_seconds": "1",
                "lan_uid": "",
                "agent_uid": "",
                "scan_enabled": True,
                "scan_interval_seconds": "1",
                "scan_dirs": "storage/scans/inbox",
                "scan_recursive": True,
            },
            "modules": {
                "ricoh": {
                    "enabled": True,
                },
                "toshiba": {
                    "enabled": True,
                },
                "ftp": {
                    "enabled": True,
                },
                "updater": {
                    "enabled": True,
                    "check_interval_seconds": 300,
                },
                "web": {
                    "enabled": True,
                },
            },
        }

    @staticmethod
    def _set_nested(data: dict[str, Any], key: str, value: Any) -> None:
        parts = key.split(".")
        current: dict[str, Any] = data
        for part in parts[:-1]:
            if part not in current or not isinstance(current[part], dict):
                current[part] = {}
            current = current[part]
        current[parts[-1]] = value

    @staticmethod
    def _get_nested(data: dict[str, Any], key: str, default: Any = None) -> Any:
        current: Any = data
        for part in key.split("."):
            if not isinstance(current, dict) or part not in current:
                return default
            current = current[part]
        return current

    @staticmethod
    def _env_bool(value: str) -> bool:
        return value.strip().lower() in {"1", "true", "yes", "on"}

    @classmethod
    def _apply_env_overrides(cls, raw: dict[str, Any]) -> None:
        env_map: list[tuple[str, str, str]] = [
            ("DATABASE_URL", "database_url", "str"),
            ("API_URL", "api_url", "str"),
            ("USER_TOKEN", "user_token", "str"),
            ("WEBHOOK_MODE", "webhook.mode", "str"),
            ("WEBHOOK_LISTEN_PATH", "webhook.listen_path", "str"),
            ("TEST_IP", "test.ip", "str"),
            ("TEST_USER", "test.user", "str"),
            ("TEST_PASSWORD", "test.password", "str"),
            ("TEST_POST_SERVER", "test.post_server", "bool"),
            ("POLLING_ENABLED", "polling.enabled", "bool"),
            ("POLLING_URL", "polling.url", "str"),
            ("POLLING_LEAD", "polling.lead", "str"),
            ("POLLING_TOKEN", "polling.token", "str"),
            ("POLLING_INTERVAL_SECONDS", "polling.interval_seconds", "str"),
            ("POLLING_AGENT_UID", "polling.agent_uid", "str"),
            ("POLLING_SCAN_ENABLED", "polling.scan_enabled", "bool"),
            ("POLLING_SCAN_INTERVAL_SECONDS", "polling.scan_interval_seconds", "str"),
            ("POLLING_SCAN_DIRS", "polling.scan_dirs", "str"),
            ("POLLING_SCAN_RECURSIVE", "polling.scan_recursive", "bool"),
        ]
        for env_name, key, value_type in env_map:
            env_value = os.getenv(env_name)
            if env_value is None:
                continue
            parsed: Any = env_value
            if value_type == "bool":
                parsed = cls._env_bool(env_value)
            cls._set_nested(raw, key, parsed)

    def _get(self, key: str, default: Any = None) -> Any:
        return self._get_nested(self._data, key, default)

    def get_string(self, key: str, default: str = "") -> str:
        value = self._get(key, default)
        if value is None:
            return default
        return str(value)

    def get_bool(self, key: str, default: bool = False) -> bool:
        value = self._get(key, default)
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.strip().lower() in {"1", "true", "yes", "on"}
        return bool(value)

    def _persist_value_to_json(self, key: str, value: Any) -> None:
        try:
            settings_path = self._settings_file_path()
            import json
            
            file_data = {}
            if settings_path.exists():
                try:
                    with settings_path.open("r", encoding="utf-8") as f:
                        file_data = json.load(f)
                except Exception:
                    pass
            
            if not isinstance(file_data, dict):
                file_data = {}
                
            self._set_nested(file_data, key, value)
            
            with settings_path.open("w", encoding="utf-8") as f:
                json.dump(file_data, f, indent=2, ensure_ascii=False)
                
            self._last_mtime = settings_path.stat().st_mtime
        except Exception:
            pass

    def set_value(self, key: str, value: Any) -> None:
        self._set_nested(self._data, key, value)
        self._persist_value_to_json(key, value)

    @staticmethod
    def _normalize_scan_dir(path: str | Path) -> str:
        try:
            return str(Path(path).expanduser().resolve())
        except Exception:
            return str(Path(path).expanduser())

    def ensure_scan_dir(self, path: str | Path) -> tuple[bool, list[str]]:
        target = self._normalize_scan_dir(path)
        current_raw = self.get_string("polling.scan_dirs", "storage/scans/inbox")
        current_items = [str(item).strip() for item in str(current_raw or "").replace("\n", ";").replace(",", ";").split(";")]
        seen: set[str] = set()
        ordered: list[str] = []
        for item in current_items:
            if not item:
                continue
            normalized = self._normalize_scan_dir(item)
            key = normalized.lower() if os.name == "nt" else normalized
            if key in seen:
                continue
            seen.add(key)
            ordered.append(normalized)
        target_key = target.lower() if os.name == "nt" else target
        added = target_key not in seen
        if added:
            ordered.append(target)
            self.set_value("polling.scan_dirs", ";".join(ordered))
        return added, ordered

    @property
    def api_url(self) -> str:
        return self.get_string("api_url", "").rstrip("/")

    @property
    def user_token(self) -> str:
        return self.get_string("user_token", "")
