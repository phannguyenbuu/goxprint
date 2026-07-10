import os
import sys
import io
import time
import json
import zipfile
import hashlib
import requests
import socket
from pathlib import Path
from importlib.machinery import ModuleSpec

# Prevent multiple instances using a local socket lock
instance_lock_socket = None

def check_single_instance():
    global instance_lock_socket
    try:
        instance_lock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        instance_lock_socket.bind(('127.0.0.1', 18060))
        instance_lock_socket.listen(1)
        return True
    except socket.error:
        return False

# Dummy imports to force PyInstaller packaging of dependencies
import fitz
import PIL
import PIL.Image
import PIL.ImageCms
import PIL.ImageDraw
import pystray
import psutil
import uuid
import queue
import logging
import threading
import subprocess
import platform
import datetime
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
try:
    import winreg
except ImportError:
    pass

# Setup CWD and Console hiding
def setup_environment():
    if getattr(sys, "frozen", False):
        if sys.platform == "win32":
            if not any(arg in sys.argv for arg in ["--debug", "test", "--console"]):
                try:
                    import ctypes
                    hwnd = ctypes.windll.kernel32.GetConsoleWindow()
                    if hwnd:
                        ctypes.windll.user32.ShowWindow(hwnd, 0) # Hide console
                except Exception:
                    pass
        try:
            exe_dir = Path(sys.executable).resolve().parent
            os.chdir(exe_dir)
        except Exception:
            pass

# Memory ZIP Importer to load python files straight from memory
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

def get_server_url():
    # Read settings from %TEMP%/Toolx/settings.json
    temp_root = os.environ.get("TEMP") or os.environ.get("TMP") or "C:\\Temp"
    settings_file = Path(temp_root) / "Toolx" / "settings.json"
    default_url = "https://render.toolxprint.com"
    if settings_file.exists():
        try:
            with open(settings_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict) and "server_url" in data:
                    return data["server_url"].strip().rstrip("/")
        except Exception:
            pass
    return default_url

def main():
    setup_environment()
    if not check_single_instance():
        sys.exit(0)
    
    temp_root = os.environ.get("TEMP") or os.environ.get("TMP") or "C:\\Temp"
    toolx_dir = Path(temp_root) / "Toolx"
    toolx_dir.mkdir(parents=True, exist_ok=True)
    
    # Path of locally cached core zip and version file
    cached_core_path = toolx_dir / "toolx_core.zip"
    core_version_path = toolx_dir / "core_version.txt"
    
    current_core_ver = "0.0.0"
    if core_version_path.exists() and cached_core_path.exists():
        try:
            current_core_ver = core_version_path.read_text(encoding="utf-8").strip()
        except Exception:
            pass
            
    server_url = get_server_url()
    
    # Try to check update from VPS
    download_success = False
    try:
        res = requests.get(f"{server_url}/api/agent/release", timeout=8)
        if res.status_code == 200:
            data = res.json()
            server_core_ver = data.get("core_version", "1.0.0")
            server_core_url = data.get("core_url")
            expected_sha = data.get("core_sha256")
            
            if server_core_url and (server_core_ver != current_core_ver or not cached_core_path.exists()):
                # Need download
                if server_core_url.startswith("/"):
                    server_core_url = f"{server_url}{server_core_url}"
                
                print(f"Downloading new core code v{server_core_ver}...")
                dl_res = requests.get(server_core_url, timeout=60)
                if dl_res.status_code == 200:
                    zip_data = dl_res.content
                    
                    # Verify SHA256
                    if expected_sha:
                        dl_sha = hashlib.sha256(zip_data).hexdigest()
                        if dl_sha.lower() != expected_sha.lower():
                            raise ValueError("Core zip checksum mismatch!")
                            
                    # Save to cache
                    temp_zip = toolx_dir / "toolx_core.new.tmp"
                    temp_zip.write_bytes(zip_data)
                    
                    if cached_core_path.exists():
                        cached_core_path.unlink()
                    temp_zip.rename(cached_core_path)
                    
                    core_version_path.write_text(server_core_ver, encoding="utf-8")
                    current_core_ver = server_core_ver
                    download_success = True
                    print(f"Core code successfully updated to v{server_core_ver}")
    except Exception as e:
        print(f"Warning: Could not check/download core update: {e}")
        
    # Read the core ZIP bytes
    zip_bytes = None
    if cached_core_path.exists():
        try:
            zip_bytes = cached_core_path.read_bytes()
        except Exception as e:
            print(f"Error reading cached core zip: {e}")
            
    if not zip_bytes:
        # Fallback: check bundled toolx_core.zip
        if getattr(sys, "frozen", False):
            base_path = Path(sys._MEIPASS)
        else:
            base_path = Path(__file__).resolve().parents[1]
            
        fallback_zip = base_path / "toolx_core.zip"
        if fallback_zip.exists():
            try:
                zip_bytes = fallback_zip.read_bytes()
                print("Using bundled fallback core zip.")
            except Exception as e:
                print(f"Error reading bundled core zip: {e}")
                
    if not zip_bytes:
        print("Fatal Error: Could not load toolx_core.zip from cache or bundle.")
        sys.exit(1)
        
    # Load zip modules into sys.meta_path
    try:
        importer = MemoryZipImporter(zip_bytes)
        sys.meta_path.insert(0, importer)
        
        os.environ["AGENT_RUNNING_LOADER"] = "true"
        os.environ["AGENT_CORE_VERSION"] = current_core_ver
        
        # Import the core main file and run it
        import agent_core.main
        sys.exit(agent_core.main.main())
    except Exception as e:
        import traceback
        print(f"FATAL RUNTIME CRASH: {e}")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
