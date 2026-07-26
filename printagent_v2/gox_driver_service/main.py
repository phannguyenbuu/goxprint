"""
GoxDriverService - Windows Service chạy với quyền SYSTEM
Nhận lệnh cài driver qua Named Pipe từ printagent.exe
Không cần UAC vì service chạy với quyền LocalSystem.

Cài service: python gox_driver_service.py install
Chạy service: python gox_driver_service.py start
Gỡ service : python gox_driver_service.py remove
"""

from __future__ import annotations

import json
import logging
import os
import subprocess
import sys
import threading
import time
import zipfile
import tempfile
import shutil
import hashlib
from pathlib import Path

import win32event
import win32file
import win32pipe
import win32security
import win32service
import win32serviceutil
import pywintypes
import servicemanager

# ─────────────────────────── Constants ───────────────────────────
PIPE_NAME       = r"\\.\pipe\GoxDriverService"
SERVICE_NAME    = "GoxDriverService"
SERVICE_DISPLAY = "Gox Driver Service"
SERVICE_DESC    = "GoPrinx driver installation helper (runs as SYSTEM, no UAC)"
LOG_DIR         = Path(os.environ.get("ProgramData", "C:/ProgramData")) / "GoxDriverService"
LOG_FILE        = LOG_DIR / "gox_driver_service.log"
PIPE_TIMEOUT_MS = 30_000   # 30 s per connection
MAX_MSG_BYTES   = 2 * 1024 * 1024  # 2 MB

# ─────────────────────────── Logging ─────────────────────────────
LOG_DIR.mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(str(LOG_FILE), encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
LOGGER = logging.getLogger("GoxDriverService")


# ─────────────────────── Driver Install Logic ─────────────────────────
def _run_driver_install(data: dict) -> dict:
    """
    data keys:
      - inf_files: list[str]   – absolute paths to extracted INF files
      - printer_ip: str
      - model: str
      - driver_name: str       – exact/suggested driver name
    """
    inf_files   = [Path(p) for p in (data.get("inf_files") or [])]
    printer_ip  = data.get("printer_ip", "")
    model       = data.get("model", "Unknown")
    driver_name = data.get("driver_name", "")
    log_lines: list[str] = []

    def log(msg: str):
        LOGGER.info(msg)
        log_lines.append(msg)

    # Step 1: pnputil /add-driver for each INF
    log(f"[1] Adding {len(inf_files)} INF files to driver store (SYSTEM)")
    for inf in inf_files:
        try:
            proc = subprocess.run(
                ["pnputil", "/add-driver", str(inf), "/install"],
                capture_output=True, text=True,
            )
            log(f"    pnputil {inf.name} → exit {proc.returncode}: {proc.stdout.strip()[:200]}")
        except Exception as e:
            log(f"    pnputil error on {inf.name}: {e}")

    # Step 2: Find installed driver name
    model_tokens = [t for t in model.upper().split() if len(t) > 2]
    log(f"[2] Searching installed driver matching {model_tokens}")
    exact = driver_name

    try:
        ps_find = subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command",
             "Get-PrinterDriver | Select-Object -ExpandProperty Name | ConvertTo-Json"],
            capture_output=True, text=True,
        )
        installed_drivers: list[str] = []
        if ps_find.returncode == 0 and ps_find.stdout.strip():
            raw = json.loads(ps_find.stdout.strip())
            installed_drivers = [raw] if isinstance(raw, str) else list(raw)

        for name in installed_drivers:
            upper = name.upper()
            if any(t in upper for t in model_tokens):
                exact = name
                log(f"    Matched driver: {exact}")
                break
    except Exception as e:
        log(f"    Driver search error: {e}")

    if not exact:
        exact = driver_name or f"{model} PCL 6"
        log(f"    Falling back to: {exact}")

    # Step 3: Add-PrinterDriver (ensure in driver list)
    log(f"[3] Add-PrinterDriver: {exact}")
    ps_add_drv = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command",
         f'Add-PrinterDriver -Name "{exact}" -ErrorAction SilentlyContinue'],
        capture_output=True, text=True,
    )
    log(f"    exit {ps_add_drv.returncode}")

    # Step 4: Port + Printer
    if printer_ip:
        port_name    = f"IP_{printer_ip}"
        printer_name = f"{model} ({printer_ip})"
        log(f"[4] Setting up port {port_name} and printer {printer_name}")
        ps_script = f"""
$ErrorActionPreference = 'SilentlyContinue'
$port = Get-PrinterPort -Name '{port_name}'
if (-not $port) {{
    Add-PrinterPort -Name '{port_name}' -PrinterHostAddress '{printer_ip}'
}}
$printer = Get-Printer -Name '{printer_name}'
if ($printer) {{
    Set-Printer -Name '{printer_name}' -DriverName '{exact}' -PortName '{port_name}'
    Write-Output 'UPDATED'
}} else {{
    Add-Printer -Name '{printer_name}' -DriverName '{exact}' -PortName '{port_name}'
    Write-Output 'ADDED'
}}
"""
        ps_printer = subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_script],
            capture_output=True, text=True,
        )
        log(f"    Printer result: {ps_printer.stdout.strip()} (exit {ps_printer.returncode})")
        if ps_printer.stderr:
            log(f"    Printer stderr: {ps_printer.stderr.strip()[:200]}")

    log("DONE")
    return {"success": True, "output": "\n".join(log_lines), "driver_name": exact}


def _handle_download_and_install(data: dict) -> dict:
    """
    data keys:
      - driver_url: str
      - printer_ip: str
      - model: str
      - driver_name: str
    Handles full download + extract + install pipeline.
    """
    import requests as _requests

    driver_url  = data.get("driver_url", "")
    printer_ip  = data.get("printer_ip", "")
    model       = data.get("model", "")
    driver_name = data.get("driver_name", "")
    log_lines: list[str] = []

    def log(msg: str):
        LOGGER.info(msg)
        log_lines.append(msg)

    temp_dir = Path(tempfile.mkdtemp(prefix="gox_driver_"))
    try:
        # Download
        log(f"[DL] Downloading driver from {driver_url}")
        urls = [u.strip() for u in driver_url.split(";") if u.strip()]
        download_path = None
        for url in urls:
            try:
                fname = os.path.basename(url.split("?")[0]) or "driver.exe"
                dest = temp_dir / fname
                resp = _requests.get(
                    url,
                    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
                    timeout=180, stream=True, allow_redirects=True,
                )
                resp.raise_for_status()
                with open(dest, "wb") as f:
                    for chunk in resp.iter_content(65536):
                        if chunk:
                            f.write(chunk)
                if dest.stat().st_size > 50 * 1024:
                    download_path = dest
                    log(f"    Downloaded: {dest.stat().st_size:,} bytes")
                    break
            except Exception as e:
                log(f"    URL failed: {url} → {e}")

        if not download_path:
            return {"success": False, "output": "\n".join(log_lines), "error": "All download URLs failed"}

        # Extract
        extract_dir = temp_dir / "extracted"
        extract_dir.mkdir()
        try:
            with zipfile.ZipFile(download_path, "r") as z:
                z.extractall(extract_dir)
            log(f"    Extracted (ZIP)")
        except Exception as e:
            log(f"    Not plain ZIP: {e} - trying silent SFX extraction")
            for flags in [["-y", f"-o{extract_dir}"], ["/s", f"/p{extract_dir}"], ["/extract", str(extract_dir)], ["/s", "/v\"/qn\""], ["/s"], ["/S"], ["/VERYSILENT", "/NORESTART"]]:
                try:
                    r = subprocess.run([str(download_path)] + flags,
                                       capture_output=True, text=True, timeout=120)
                    if r.returncode == 0:
                        log(f"    EXE silent install/extract OK (flags {flags})")
                        break
                except Exception:
                    pass

        # Extract any nested zip files found inside extracted folder (common in Toshiba driver packages)
        for nested_zip in list(extract_dir.glob("**/*.zip")):
            try:
                with zipfile.ZipFile(nested_zip, "r") as nz:
                    nz.extractall(nested_zip.parent)
                log(f"    Extracted nested ZIP: {nested_zip.name}")
            except Exception as e:
                LOGGER.debug("Could not extract nested zip %s: %s", nested_zip, e)

        inf_files = [str(f) for f in extract_dir.glob("**/*.inf")]
        log(f"    Found {len(inf_files)} INF files")

        result = _run_driver_install({
            "inf_files": inf_files,
            "printer_ip": printer_ip,
            "model": model,
            "driver_name": driver_name,
        })
        result["output"] = "\n".join(log_lines) + "\n" + result.get("output", "")
        return result

    except Exception as e:
        return {"success": False, "output": "\n".join(log_lines), "error": str(e)}
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


# ─────────────────────── Named Pipe Server ─────────────────────────
def _handle_pipe_client(pipe_handle):
    """Handle one pipe connection in its own thread."""
    try:
        # Read request
        chunks = []
        while True:
            try:
                hr, data = win32file.ReadFile(pipe_handle, 65536)
                if not data:
                    break
                chunks.append(data)
                if len(data) < 65536:
                    break
            except pywintypes.error as e:
                if e.winerror == 109:  # ERROR_BROKEN_PIPE
                    break
                raise

        raw = b"".join(chunks)
        if not raw:
            return

        try:
            request = json.loads(raw.decode("utf-8"))
        except Exception as e:
            response = {"success": False, "error": f"Invalid JSON: {e}"}
            win32file.WriteFile(pipe_handle, json.dumps(response).encode("utf-8"))
            return

        action = request.get("action", "")
        LOGGER.info("Pipe request: action=%s", action)

        if action == "install_driver":
            result = _run_driver_install(request)
        elif action == "download_and_install":
            result = _handle_download_and_install(request)
        elif action == "ping":
            result = {"success": True, "output": "pong", "version": "1.0.0"}
        else:
            result = {"success": False, "error": f"Unknown action: {action}"}

        win32file.WriteFile(pipe_handle, json.dumps(result).encode("utf-8"))

    except Exception as e:
        LOGGER.exception("Pipe handler error: %s", e)
        try:
            win32file.WriteFile(pipe_handle,
                                json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        except Exception:
            pass
    finally:
        try:
            win32file.FlushFileBuffers(pipe_handle)
            win32file.DisconnectNamedPipe(pipe_handle)
            win32file.CloseHandle(pipe_handle)
        except Exception:
            pass


def run_pipe_server(stop_event: threading.Event):
    """Main loop: create pipe, accept connections, spawn thread per client."""
    LOGGER.info("Starting named pipe server: %s", PIPE_NAME)

    # Security: allow Everyone to connect (service runs as SYSTEM, clients are any user)
    sa = win32security.SECURITY_ATTRIBUTES()
    sd = win32security.SECURITY_DESCRIPTOR()
    sd.SetSecurityDescriptorDacl(True, None, False)  # NULL DACL = allow everyone
    sa.SECURITY_DESCRIPTOR = sd

    while not stop_event.is_set():
        try:
            pipe = win32pipe.CreateNamedPipe(
                PIPE_NAME,
                win32pipe.PIPE_ACCESS_DUPLEX,
                win32pipe.PIPE_TYPE_BYTE | win32pipe.PIPE_READMODE_BYTE | win32pipe.PIPE_WAIT,
                win32pipe.PIPE_UNLIMITED_INSTANCES,
                MAX_MSG_BYTES,
                MAX_MSG_BYTES,
                PIPE_TIMEOUT_MS,
                sa,
            )
            # Wait for client
            try:
                win32pipe.ConnectNamedPipe(pipe, None)
            except pywintypes.error as e:
                if e.winerror == 535:  # ERROR_PIPE_CONNECTED (already connected)
                    pass
                elif stop_event.is_set():
                    win32file.CloseHandle(pipe)
                    break
                else:
                    LOGGER.warning("ConnectNamedPipe error: %s", e)
                    win32file.CloseHandle(pipe)
                    continue

            t = threading.Thread(target=_handle_pipe_client, args=(pipe,), daemon=True)
            t.start()

        except pywintypes.error as e:
            if stop_event.is_set():
                break
            LOGGER.warning("Pipe server error: %s — retrying in 2s", e)
            time.sleep(2)
        except Exception as e:
            if stop_event.is_set():
                break
            LOGGER.exception("Pipe server unexpected error: %s", e)
            time.sleep(2)

    LOGGER.info("Pipe server stopped.")


# ─────────────────────── Windows Service Class ─────────────────────────
class GoxDriverWindowsService(win32serviceutil.ServiceFramework):
    _svc_name_         = SERVICE_NAME
    _svc_display_name_ = SERVICE_DISPLAY
    _svc_description_  = SERVICE_DESC

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self._stop_event = threading.Event()
        self._hWaitStop  = win32event.CreateEvent(None, 0, 0, None)

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        self._stop_event.set()
        win32event.SetEvent(self._hWaitStop)

    def SvcDoRun(self):
        servicemanager.LogMsg(
            servicemanager.EVENTLOG_INFORMATION_TYPE,
            servicemanager.PYS_SERVICE_STARTED,
            (self._svc_name_, ""),
        )
        LOGGER.info("%s started (running as SYSTEM)", SERVICE_NAME)
        server_thread = threading.Thread(
            target=run_pipe_server,
            args=(self._stop_event,),
            daemon=True,
            name="pipe-server",
        )
        server_thread.start()

        # Block until stop event
        win32event.WaitForSingleObject(self._hWaitStop, win32event.INFINITE)
        self._stop_event.set()
        server_thread.join(timeout=5)
        LOGGER.info("%s stopped.", SERVICE_NAME)


# ─────────────────────── Client Helper (used by printagent) ─────────────────────────
def call_service(request: dict, timeout_s: int = 300) -> dict:
    """
    Call GoxDriverService via named pipe.
    Used by printagent's _handle_install_driver.
    """
    import ctypes
    GENERIC_READ_WRITE = 0xC0000000
    OPEN_EXISTING      = 3
    FILE_FLAG_OVERLAPPED = 0x40000000

    # Wait for pipe to be available
    deadline = time.time() + timeout_s
    pipe_handle = None

    while time.time() < deadline:
        try:
            pipe_handle = win32file.CreateFile(
                PIPE_NAME,
                win32file.GENERIC_READ | win32file.GENERIC_WRITE,
                0, None,
                win32file.OPEN_EXISTING,
                0, None,
            )
            break
        except pywintypes.error as e:
            if e.winerror == 2:    # ERROR_FILE_NOT_FOUND - service not running
                raise RuntimeError(
                    f"GoxDriverService is not running. Install it first:\n"
                    f"  sc start {SERVICE_NAME}\n"
                    f"or run install_gox_driver_service.ps1 as Administrator."
                ) from e
            if e.winerror == 231:  # ERROR_PIPE_BUSY
                win32pipe.WaitNamedPipe(PIPE_NAME, 2000)
                continue
            raise

    if pipe_handle is None:
        raise TimeoutError("Could not connect to GoxDriverService pipe")

    try:
        payload = json.dumps(request).encode("utf-8")
        win32file.WriteFile(pipe_handle, payload)

        chunks = []
        while True:
            try:
                hr, data = win32file.ReadFile(pipe_handle, 65536)
                if not data:
                    break
                chunks.append(data)
                if len(data) < 65536:
                    break
            except pywintypes.error as e:
                if e.winerror == 109:
                    break
                raise

        return json.loads(b"".join(chunks).decode("utf-8"))
    finally:
        win32file.CloseHandle(pipe_handle)


# ─────────────────────── Entry Point ─────────────────────────
if __name__ == "__main__":
    if len(sys.argv) == 1:
        # Running as Windows service (invoked by SCM)
        servicemanager.Initialize()
        servicemanager.PrepareToHostSingle(GoxDriverWindowsService)
        servicemanager.StartServiceCtrlDispatcher()
    else:
        # install / remove / start / stop / debug
        win32serviceutil.HandleCommandLine(GoxDriverWindowsService)
