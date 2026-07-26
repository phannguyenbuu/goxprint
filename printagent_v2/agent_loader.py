import os
import sys
from pathlib import Path

def log_debug(msg):
    try:
        temp_dir = os.environ.get("TEMP")
        if temp_dir:
            with open(Path(temp_dir) / "agent_loader_debug.txt", "a", encoding="utf-8") as f:
                f.write(msg + "\n")
                f.flush()
    except Exception:
        pass

# Initialize debug log
try:
    temp_dir = os.environ.get("TEMP")
    if temp_dir:
        with open(Path(temp_dir) / "agent_loader_debug.txt", "w", encoding="utf-8") as f:
            f.write(f"Started agent_loader.py. Args: {sys.argv}\n")
            f.flush()
except Exception:
    pass

# Monkey patch subprocess to always hide console window on Windows
try:
    import subprocess
    if sys.platform == "win32":
        _orig_Popen_init = subprocess.Popen.__init__
        def _patched_Popen_init(self, *args, **kwargs):
            creationflags = kwargs.get("creationflags", 0)
            kwargs["creationflags"] = creationflags | 0x08000000
            _orig_Popen_init(self, *args, **kwargs)
        subprocess.Popen.__init__ = _patched_Popen_init
except Exception:
    pass

try:
    log_debug("Starting initial CWD and console setup...")
    # Change CWD to the executable parent directory when frozen to prevent write errors in default CWD (like system32)
    # Hide console window and redirect stdout/stderr when frozen to prevent crashes and capture logs
    if getattr(sys, "frozen", False):
        if sys.platform == "win32":
            if not any(arg in sys.argv for arg in ["--debug", "test", "--console"]):
                try:
                    import ctypes
                    hwnd = ctypes.windll.kernel32.GetConsoleWindow()
                    if hwnd:
                        ctypes.windll.user32.ShowWindow(hwnd, 0)  # 0 = SW_HIDE
                except Exception as e:
                    log_debug(f"Failed to hide console: {e}")
        try:
            exe_dir = Path(sys.executable).resolve().parent
            os.chdir(exe_dir)
            log_debug(f"Changed CWD to: {exe_dir}")
        except Exception as e:
            log_debug(f"Failed to change CWD: {e}")
        if not any(arg in sys.argv for arg in ["--debug", "test", "--console"]):
            try:
                log_dir = Path("storage/logs")
                log_dir.mkdir(parents=True, exist_ok=True)
                sys.stdout = open(log_dir / "loader.txt", "a", encoding="utf-8", buffering=1)
                sys.stderr = sys.stdout
                log_debug("Redirected stdout/stderr to loader.txt")
            except Exception as e:
                log_debug(f"Failed to redirect stdout: {e}")
                try:
                    import os
                    sys.stdout = open(os.devnull, "w", encoding="utf-8")
                except Exception:
                    class DummyWriter:
                        def write(self, *args, **kwargs): pass
                        def flush(self, *args, **kwargs): pass
                    sys.stdout = DummyWriter()
                sys.stderr = sys.stdout
except Exception as e:
    log_debug(f"Error during console/CWD setup: {e}")

try:
    log_debug("Importing standard libraries...")
    import json
    import sqlite3
    import hashlib
    import io
    import zipfile
    import requests
    import flask_cors
    log_debug("Standard libraries imported successfully.")

    log_debug("Importing bundled/dynamic dependencies...")
    import xml.etree.ElementTree
    import ipaddress
    import ftplib
    import winreg
    import ctypes
    import threading
    import time
    import uuid
    import csv
    import platform
    import re
    import shutil
    import traceback
    import urllib.request
    import urllib.parse
    import struct
    import select
    import pyftpdlib
    import pyftpdlib.authorizers
    import pyftpdlib.handlers
    import pyftpdlib.servers
    import unicodedata
    log_debug("Dependencies imported successfully.")

    from importlib.machinery import ModuleSpec
except Exception as e:
    import traceback
    log_debug(f"FATAL IMPORT ERROR: {e}\n{traceback.format_exc()}")
    sys.exit(1)

DEFAULT_VERSION = "0.0.0"
CORE_ZIP_NAME = "agent_core.zip"

class MemoryZipImporter:
    def __init__(self, zip_bytes):
        self.zip_file = zipfile.ZipFile(io.BytesIO(zip_bytes))
        self.toc = {}
        for name in self.zip_file.namelist():
            if name.endswith('.py'):
                parts = name[:-3].split('/')
                if parts[-1] == '__init__':
                    mod_name = '.'.join(parts[:-1])
                    is_pkg = True
                else:
                    mod_name = '.'.join(parts)
                    is_pkg = False
                self.toc[mod_name] = (name, is_pkg)

    def find_spec(self, fullname, path, target=None):
        if fullname in self.toc:
            spec = ModuleSpec(fullname, self, is_package=self.toc[fullname][1])
            spec.origin = self.toc[fullname][0]
            return spec
        return None

    def create_module(self, spec):
        return None

    def exec_module(self, module):
        filename, is_pkg = self.toc[module.__name__]
        code_bytes = self.zip_file.read(filename)
        code = compile(code_bytes, filename, 'exec')
        module.__file__ = filename
        if is_pkg:
            module.__path__ = []
        exec(code, module.__dict__)

def get_config():
    config = {
        "url": "https://agentapi.quanlymay.com",
        "lead": "default",
        "token": "change-me"
    }
    
    settings_path = Path("settings.json")
    if settings_path.exists():
        try:
            with settings_path.open("r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, dict):
                api_url = data.get("api_url") or data.get("polling", {}).get("url")
                if api_url:
                    url = str(api_url).strip()
                    if url.endswith("/api"):
                        url = url[:-4]
                    config["url"] = url
                
                polling = data.get("polling")
                if isinstance(polling, dict):
                    lead = polling.get("lead")
                    if lead:
                        config["lead"] = str(lead).strip()
                    token = polling.get("token")
                    if token:
                        config["token"] = str(token).strip()
        except Exception:
            pass
            
    if os.getenv("POLLING_URL"):
        config["url"] = os.getenv("POLLING_URL").strip()
    if os.getenv("POLLING_LEAD"):
        config["lead"] = os.getenv("POLLING_LEAD").strip()
    if os.getenv("POLLING_TOKEN"):
        config["token"] = os.getenv("POLLING_TOKEN").strip()
        
    return config

def safe_input(prompt=""):
    try:
        if sys.stdin and sys.stdin.isatty():
            input(prompt)
        else:
            time.sleep(5)
    except Exception:
        pass

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

def main():
    try:
        log_debug("Entered main()")
        Path("storage/data").mkdir(parents=True, exist_ok=True)
        log_debug("Created storage/data directory.")
        
        log_debug("Loading configuration...")
        config = get_config()
        base_url = config["url"].rstrip("/")
        log_debug(f"Configuration loaded. URL: {base_url}")

        # Ensure dynamic scripts directory exists
        log_debug("Ensuring dynamic scripts directory exists...")
        temp_dir = os.environ.get("TEMP")
        if temp_dir:
            scripts_dir = Path(temp_dir) / "GoPrinxAgent" / "scripts"
        else:
            import tempfile
            scripts_dir = Path(tempfile.gettempdir()) / "GoPrinxAgent" / "scripts"
        try:
            scripts_dir.mkdir(parents=True, exist_ok=True)
            log_debug(f"Dynamic scripts directory set to: {scripts_dir}")
        except Exception as scripts_err:
            log_debug(f"Failed to create scripts directory: {scripts_err}")

        # 1. Try to load updated agent_core.zip from %TEMP%\GoPrinxAgent\agent_core.zip first
        if getattr(sys, "frozen", False):
            base_path = Path(getattr(sys, "_MEIPASS", os.getcwd()))
        else:
            base_path = Path(__file__).resolve().parent

        temp_dir = os.environ.get("TEMP")
        if temp_dir:
            updated_zip = Path(temp_dir) / "GoPrinxAgent" / "agent_core.zip"
        else:
            import tempfile
            updated_zip = Path(tempfile.gettempdir()) / "GoPrinxAgent" / "agent_core.zip"

        local_zip_path = base_path / "agent_core.zip"
        zip_bytes = None

        if updated_zip.exists():
            log_debug(f"Reading updated agent core from {updated_zip}...")
            try:
                zip_bytes = updated_zip.read_bytes()
                log_debug(f"Read {len(zip_bytes)} bytes from updated agent_core.zip.")
            except Exception as upd_err:
                log_debug(f"Failed to read updated agent core: {upd_err}")

        if not zip_bytes and local_zip_path.exists():
            log_debug(f"Reading bundled agent core from {local_zip_path}...")
            try:
                zip_bytes = local_zip_path.read_bytes()
                log_debug(f"Read {len(zip_bytes)} bytes from bundled agent_core.zip.")
            except Exception as read_err:
                log_debug(f"Failed to read bundled agent core: {read_err}")

        if not zip_bytes:
            log_debug("Error: Could not find or read bundled agent_core.zip. Cannot start agent.")
            safe_input("Press Enter to exit...")
            sys.exit(1)
            
        log_debug("Loading agent core in-memory...")
        try:
            importer = MemoryZipImporter(zip_bytes)
            sys.meta_path.insert(0, importer)
            log_debug("MemoryZipImporter inserted into sys.meta_path.")
            
            os.environ["AGENT_RUNNING_LOADER"] = "true"
            
            log_debug("Importing agent.main...")
            import agent.main
            log_debug("Imported agent.main successfully. Calling main()...")
            try:
                sys.exit(agent.main.main())
            except Exception as e:
                import traceback
                log_debug(f"CRASH in main(): {traceback.format_exc()}")
                sys.exit(1)
            except BaseException as run_exc:
                import traceback
                log_debug(f"Fatal error running agent core: {run_exc}\n{traceback.format_exc()}")
                sys.stdout.flush()
                safe_input("Press Enter to exit...")
                sys.exit(1)
        except SystemExit as sys_exit:
            log_debug(f"SystemExit raised with code: {sys_exit.code}")
            sys.stdout.flush()
            sys.exit(sys_exit.code)
        except BaseException as run_exc:
            import traceback
            log_debug(f"Fatal error running agent core: {run_exc}\n{traceback.format_exc()}")
            sys.stdout.flush()
            safe_input("Press Enter to exit...")
            sys.exit(1)
    except BaseException as main_exc:
        import traceback
        log_debug(f"Fatal error in main: {main_exc}\n{traceback.format_exc()}")
        sys.exit(1)

if __name__ == "__main__":
    main()
