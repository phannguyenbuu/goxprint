from __future__ import annotations

import argparse
import logging
from datetime import date
from logging import FileHandler, Filter
import os
import signal
import sys
import threading
import time
from pathlib import Path

from agent.config import AppConfig
from agent.modules.ricoh.service import RicohService
from agent.modules.toshiba.service import ToshibaService
from agent.services.api_client import APIClient, Printer
from agent.services.polling_bridge import PollingBridge
from agent.services.runtime import acquire_single_instance, default_log_path, ensure_startup_registration, startup_command_for_current_exe
from agent.services.tray import TrayController
from agent.services.updater import AutoUpdater
from agent.webs.web import create_app, run_web_server, shutdown_app_resources


LOGGER = logging.getLogger(__name__)

DEFAULT_WEB_PORT = 9173
BACKGROUND_HEARTBEAT_SECONDS = 300


class _MaxLevelFilter(Filter):
    def __init__(self, max_level: int) -> None:
        super().__init__()
        self.max_level = max_level

    def filter(self, record: logging.LogRecord) -> bool:
        return record.levelno < self.max_level


class LimitedFileHandler(FileHandler):
    def __init__(self, base_path: Path, max_lines: int = 1000, encoding: str = "utf-8") -> None:
        self.base_path = base_path
        self.max_lines = max_lines
        super().__init__(base_path, encoding=encoding)
        self._trim_log_file()

    def emit(self, record: logging.LogRecord) -> None:
        super().emit(record)
        self._trim_log_file()

    def _trim_log_file(self) -> None:
        try:
            if self.base_path.exists():
                with open(self.base_path, "r", encoding="utf-8", errors="replace") as f:
                    lines = f.readlines()
                if len(lines) > self.max_lines + 50:
                    keep_lines = lines[-(self.max_lines - 100):]
                    self.close()
                    with open(self.base_path, "w", encoding="utf-8") as f:
                        f.writelines(keep_lines)
                    self.stream = self._open()
        except Exception:
            pass


def cleanup_old_rotated_logs(log_dir: Path) -> None:
    import re
    try:
        if log_dir.exists():
            for item in log_dir.iterdir():
                if item.is_file() and item.suffix == ".txt":
                    if re.search(r'stout_\d{4}-\d{2}-\d{2}\.txt', item.name) or re.search(r'sterror_\d{4}-\d{2}-\d{2}\.txt', item.name):
                        try:
                            item.unlink()
                        except Exception:
                            pass
                    elif re.search(r'ftp_stout_\d{4}-\d{2}-\d{2}\.txt', item.name) or re.search(r'ftp_sterror_\d{4}-\d{2}-\d{2}\.txt', item.name):
                        try:
                            item.unlink()
                        except Exception:
                            pass
    except Exception:
        pass


def _resolve_log_path(preferred: str, runtime_root: Path, fallback_name: str) -> Path:
    candidate = Path(preferred)
    try:
        candidate.parent.mkdir(parents=True, exist_ok=True)
        return candidate
    except Exception:
        fallback = runtime_root / fallback_name
        fallback.parent.mkdir(parents=True, exist_ok=True)
        return fallback


def setup_logging(runtime_root: Path) -> tuple[Path, Path]:
    root = logging.getLogger()
    root.handlers.clear()
    root.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")

    stdout_name = "stout.txt"
    stderr_name = "sterror.txt"

    stdout_path = _resolve_log_path(str(default_log_path(stdout_name)), runtime_root, stdout_name)
    stderr_path = _resolve_log_path(str(default_log_path(stderr_name)), runtime_root, stderr_name)

    # Clean up old daily-rotated logs
    cleanup_old_rotated_logs(stdout_path.parent)

    try:
        stdout_handler = LimitedFileHandler(stdout_path, max_lines=1000, encoding="utf-8")
        stdout_handler.setLevel(logging.INFO)
        stdout_handler.addFilter(_MaxLevelFilter(logging.ERROR))
        stdout_handler.setFormatter(formatter)
        root.addHandler(stdout_handler)
    except Exception as exc:
        print(f"Warning: Failed to initialize stdout file handler: {exc}", file=sys.stderr)

    try:
        stderr_handler = LimitedFileHandler(stderr_path, max_lines=1000, encoding="utf-8")
        stderr_handler.setLevel(logging.ERROR)
        stderr_handler.setFormatter(formatter)
        root.addHandler(stderr_handler)
    except Exception as exc:
        print(f"Warning: Failed to initialize stderr file handler: {exc}", file=sys.stderr)

    stdout_stream = logging.StreamHandler(sys.stdout)
    stdout_stream.setLevel(logging.INFO)
    stdout_stream.addFilter(_MaxLevelFilter(logging.ERROR))
    stdout_stream.setFormatter(formatter)

    stderr_stream = logging.StreamHandler(sys.stderr)
    stderr_stream.setLevel(logging.ERROR)
    stderr_stream.setFormatter(formatter)

    root.addHandler(stdout_stream)
    root.addHandler(stderr_stream)
    return stdout_path, stderr_path


def _ensure_runtime_root() -> Path:
    if getattr(sys, "frozen", False):
        exe_dir = Path(sys.executable).resolve().parent
        os.chdir(exe_dir)
        return exe_dir
    return Path.cwd()


def load_test_printer(config: AppConfig) -> Printer:
    return Printer(
        name="Test Printer",
        ip=config.get_string("test.ip"),
        user=config.get_string("test.user"),
        password=config.get_string("test.password"),
        printer_type="ricoh",
    )


def run_test_mode(config: AppConfig, service: RicohService) -> None:
    printer = load_test_printer(config)
    if not printer.ip:
        raise ValueError("Missing test.ip configuration")

    post_server = config.get_bool("test.post_server", True)
    while True:
        print("\n=== MENU TEST ===")
        print("1. Lay Status")
        print("2. Lay Device Info")
        print("3. Lay Counter")
        print("4. Bat may")
        print("5. Khoa may")
        print("6. Lay Address List")
        print("7. Log Counter (moi phut)")
        print("8. Log Status (moi 30s)")
        print("0. Thoat")
        choice = input("Chon chuc nang (0-8): ").strip()

        try:
            if choice == "1":
                payload = service.process_status(printer, post_server)
                print(payload["status_data"])
            elif choice == "2":
                payload = service.process_device_info(printer, post_server)
                print(payload["device_info"])
            elif choice == "3":
                payload = service.process_counter(printer, post_server)
                print(payload["counter_data"])
            elif choice == "4":
                service.enable_machine(printer)
                print("Da bat may thanh cong")
            elif choice == "5":
                service.lock_machine(printer)
                print("Da khoa may thanh cong")
            elif choice == "6":
                payload = service.process_address_list(printer)
                print(f"Tong so entry: {max(len(payload['address_list']) - 1, 0)}")
            elif choice == "7":
                print("Nhan Ctrl+C de dung")
                service.start_counter_logging(printer)
            elif choice == "8":
                print("Nhan Ctrl+C de dung")
                service.start_status_logging(printer)
            elif choice == "0":
                return
            else:
                print("Lua chon khong hop le")
        except KeyboardInterrupt:
            print("\nDa dung")
        except Exception as exc:  # noqa: BLE001
            print(f"Loi: {exc}")


def run_normal_mode(
    service: RicohService,
    toshiba_service: ToshibaService | None,
    config: AppConfig,
    updater: AutoUpdater,
) -> None:
    import socket

    # Resolve LAN UID for display
    hostname = socket.gethostname()
    local_ip = PollingBridge._resolve_local_ip()
    restart_event = threading.Event()
    bridge = PollingBridge(
        config,
        service.api_client,
        service,
        toshiba_service=toshiba_service,
        updater=updater,
        run_mode="service",
        web_port=0,
        restart_callback=restart_event.set,
    )
    lan_uid, _ = bridge._resolve_lan_info(hostname, local_ip)

    print(f"\n{'='*60}")
    print(f" PRINT AGENT STARTING...")
    print(f" MODE: SERVICE")
    print(f" LAN UID: {lan_uid}")
    print(f" LEAD   : {config.get_string('polling.lead')}")
    print(f"{'='*60}\n")
    
    stop = False

    def handle_signal(_sig: int, _frame: object) -> None:
        nonlocal stop
        stop = True

    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)
    ok, message = bridge.start()
    if not ok and "already running" not in message.lower():
        raise RuntimeError(message)
    try:
        while not stop and not restart_event.wait(0.2):
            time.sleep(0.2)
    finally:
        bridge.stop()
        service.stop()


def load_dynamic_scripts() -> None:
    import sys
    import os
    from pathlib import Path
    
    temp_dir = os.environ.get("TEMP")
    if temp_dir:
        folder = Path(temp_dir) / "GoPrinxAgent" / "scripts"
    else:
        import tempfile
        folder = Path(tempfile.gettempdir()) / "GoPrinxAgent" / "scripts"
        
    try:
        folder.mkdir(parents=True, exist_ok=True)
    except Exception as exc:
        logging.warning("Failed to create scripts directory %s: %s", folder, exc)
        return

    # Clean up any legacy scripts once and for all at startup before loading
    legacy_files = ["scan_ricoh.py", "ricoh_wizard.py", "ricoh_address_book.py", "ricoh_web_scan.py"]
    for name in legacy_files:
        fpath = folder / name
        if fpath.exists():
            try:
                fpath.unlink()
                logging.info("Cleaned up legacy script remnant: %s", name)
            except Exception as e:
                logging.warning("Failed to clean legacy script remnant %s at startup: %s", name, e)

    folder_str = str(folder.resolve())
    if folder_str not in sys.path:
        sys.path.insert(0, folder_str)
        
    py_files = sorted(folder.glob("*.py"))
    for file_path in py_files:
        try:
            logging.debug("Compiling and executing dynamic script: %s", file_path)
            code_bytes = file_path.read_bytes()
            if not code_bytes.strip():
                logging.debug("Skipping empty dynamic script: %s", file_path.name)
                continue
            code = compile(code_bytes, str(file_path), "exec")
            script_globals = {**globals(), "__name__": file_path.stem, "__file__": str(file_path)}
            exec(code, script_globals)
            globals().update({k: v for k, v in script_globals.items() if k not in ("__name__", "__file__", "__builtins__")})
            logging.debug("Successfully executed dynamic script: %s", file_path.name)
        except Exception as exc:
            logging.exception("Failed to compile/execute dynamic script %s: %s", file_path.name, exc)


def log_debug(msg: str) -> None:
    try:
        import os
        from pathlib import Path
        temp_dir = os.environ.get("TEMP")
        if temp_dir:
            with open(Path(temp_dir) / "agent_loader_debug.txt", "a", encoding="utf-8") as f:
                f.write(msg + "\n")
                f.flush()
    except Exception:
        pass

def clean_stuck_bak_processes() -> None:
    if sys.platform == "win32":
        try:
            import psutil
            for proc in psutil.process_iter(['name']):
                try:
                    name = proc.info.get('name', '').lower()
                    if name and 'printagent' in name and '.bak' in name:
                        proc.kill()
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
        except Exception:
            pass
            
        # Fallback to taskkill for known names just in case
        try:
            import subprocess
            subprocess.run(["taskkill", "/F", "/IM", "printagent.bak.exe"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, creationflags=0x08000000)
            subprocess.run(["taskkill", "/F", "/IM", "printagent.bak"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, creationflags=0x08000000)
        except Exception:
            pass

def main() -> int:
    clean_stuck_bak_processes()
    instance_lock = None
    try:
        runtime_root = _ensure_runtime_root()
        
        # Pre-parse mode to determine log file names and avoid Windows file lock sharing violations
        is_gui_mode = False
        for i, arg in enumerate(sys.argv):
            if arg == "--mode" and i + 1 < len(sys.argv):
                val = sys.argv[i + 1]
                if val in ("", '""', "''"):
                    pass # Legacy ftp worker mode
            elif arg == '--mode=""' or arg == "--mode=''":
                pass # Legacy ftp worker mode

        stdout_path, stderr_path = setup_logging(runtime_root)
        log_debug(f"main() started: root={runtime_root}, logs={stdout_path}")
        
        if not is_gui_mode:
            try:
                load_dynamic_scripts()
            except Exception as exc:
                log_debug(f"Dynamic scripts failed: {exc}")
                logging.error("Failed loading dynamic scripts: %s", exc)

        config = AppConfig.load()
        log_debug(f"Config loaded: {config.get_string('polling.url', '')}")


        log_debug("Parsing arguments...")
        # Sanitize legacy --mode "" / --mode '' invocations: replace with default 'web'
        sanitized_argv = list(sys.argv)
        for i in range(len(sanitized_argv) - 1):
            if sanitized_argv[i] == "--mode" and sanitized_argv[i + 1].strip().strip("'\"") == "":
                sanitized_argv[i + 1] = "web"
                log_debug("Sanitized empty --mode to 'web'")
                break

        parser = argparse.ArgumentParser()
        parser.add_argument(
            "--mode",
            choices=["web", "service", "test", "gui"],
            default="web",
            help="Run mode: web (Flask UI), service (scheduler), test (interactive menu)",
        )

        parser.add_argument(
            "--host",
            default=os.getenv("FLASK_HOST", "0.0.0.0"),
            help="Flask host in web mode (env: FLASK_HOST)",
        )
        parser.add_argument(
            "--port",
            default=int(os.getenv("FLASK_PORT", str(DEFAULT_WEB_PORT))),
            type=int,
            help="Flask port in web mode (env: FLASK_PORT)",
        )
        parser.add_argument(
            "--debug",
            action="store_true",
            default=os.getenv("FLASK_DEBUG", "false").strip().lower() in {"1", "true", "yes", "on"},
            help="Enable Flask debug mode (env: FLASK_DEBUG=true/false)",
        )
        parser.add_argument(
            "--get-video",
            action="store_true",
            help="Slice and render a video clip from camera recordings for a specific timestamp",
        )
        parser.add_argument(
            "--name",
            default="",
            help="Camera name for video query",
        )
        parser.add_argument(
            "--time",
            default="",
            help="Timestamp for video query",
        )
        parser.add_argument(
            "--duration",
            default=10,
            type=int,
            help="Duration of the sliced clip in seconds",
        )
        parser.add_argument(
            "--parent-pid",
            default=0,
            type=int,
            help="Parent process ID for watchdog self-termination",
        )
        args = parser.parse_args(sanitized_argv[1:])
        log_debug(f"Args: mode={args.mode}, host={args.host}, port={args.port}, parent_pid={args.parent_pid}")

        if getattr(args, "get_video", False):
            from agent.services.camera_manager import CameraManager
            cm = CameraManager()
            import tempfile
            default_out = str(Path(tempfile.gettempdir()) / "GoPrinxAgent" / "video")
            output_dir = config.get_string("camera.output_dir", default_out)
            clip_path = cm.render_video_clip(
                camera_name=args.name,
                output_dir=output_dir,
                timestamp_str=args.time,
                duration_seconds=args.duration
            )
            if clip_path and os.path.exists(clip_path):
                print(f"SUCCESS: {clip_path}")
                sys.exit(0)
            else:
                print("FAILED")
                sys.exit(1)

        # Check config overrides for run modes
        if args.mode == "web" and not config.get_bool("modules.web.enabled", True):
            log_debug("Web module disabled by configuration; switching to service mode")
            logging.info("Web module disabled by configuration modules.web.enabled=false; switching to service mode")
            args.mode = "service"

        if args.mode == "gui":
            instance_name = "Global\\GoPrinxAgentGui"
        else:
            instance_name = "Global\\GoPrinxAgentMain"

        instance_lock, is_primary = acquire_single_instance(instance_name)
        log_debug(f"Instance lock: {instance_name}, primary={is_primary}")
        if not is_primary:
            log_debug(f"Another process running for mode={args.mode}. Exiting.")
            logging.debug("Another GoPrinxAgent process is already running for mode=%s; skipping startup", args.mode)
            return 0

        startup_ok = False
        startup_note = "skipped"
        if args.mode != "gui":
            try:
                main_cmd = startup_command_for_current_exe(args.mode, args.host, args.port) if args.mode else startup_command_for_current_exe(args.mode)
                startup_ok, startup_note = ensure_startup_registration(
                    app_name="GoPrinxAgent",
                    command=main_cmd,
                )
            except Exception as e:
                log_debug(f"Startup registration error: {e}")
                logging.error("Startup registration failed: %s", e)
            log_debug(f"Startup reg: {startup_ok} ({startup_note})")
            logging.info("Startup registration: %s (%s)", startup_ok, startup_note)


        logging.info("Log files: stdout=%s stderr=%s", stdout_path.as_posix(), stderr_path.as_posix())
     
        try:
            log_debug("Initializing AutoUpdater...")
            updater_args: list[str]
            if args.mode == "web":
                updater_args = ["--mode", "web", "--host", args.host, "--port", str(args.port)]
            elif args.mode == "service":
                updater_args = ["--mode", "service"]
            else:
                updater_args = ["--mode", "test"]
            updater = AutoUpdater(project_root=Path(__file__).resolve().parents[1], current_args=updater_args)
            log_debug("AutoUpdater initialized successfully.")
     
            if args.mode == "web":
                log_debug("Running in WEB mode...")
                os.environ["APP_RUN_MODE"] = "web"
                os.environ["APP_WEB_PORT"] = str(args.port)
                current_args = ["--mode", "web", "--host", args.host, "--port", str(args.port)]
                stop_event = threading.Event()
                log_debug("Creating app (create_app)...")
                app = create_app(current_args=current_args, shutdown_event=stop_event)
                log_debug("App created successfully. Starting web server...")
                server, server_thread = run_web_server(app, args.host, args.port)
                log_debug("Web server started successfully. Launching Tray Controller...")
                
                def force_update_cb():
                    LOGGER.info("Force update callback triggered from Tray")
                    app_updater = app.config.get("UPDATER")
                    if app_updater is not None:
                        app_updater.state.last_check_at = ""
                    else:
                        updater.state.last_check_at = ""
                    app_bridge = app.config.get("POLLING_BRIDGE")
                    if app_bridge is not None:
                        app_bridge.trigger_once()
                    else:
                        LOGGER.error("PollingBridge not found in app config during force update callback")
    
                tray = TrayController(
                    f"http://127.0.0.1:{args.port}",
                    stop_event=stop_event,
                    app_version=updater.current_version,
                    force_update_callback=force_update_cb,
                )
                tray_thread = threading.Thread(target=tray.run, daemon=True, name="agent-tray")
                tray_thread.start()
                log_debug("Tray thread started. Entering stop_event wait loop...")
                try:
                    while not stop_event.wait(0.5):
                        if not tray_thread.is_alive():
                            log_debug("Tray thread died! Restarting...")
                            LOGGER.warning("Tray thread exited unexpectedly; keeping web server alive")
                            tray_thread = threading.Thread(target=tray.run, daemon=True, name="agent-tray-restart")
                            tray_thread.start()
                finally:
                    log_debug("Exiting stop_event loop, shutting down...")
                    stop_event.set()
                    shutdown_app_resources(app)
                    try:
                        # shutdown() blocks until serve_forever() exits.
                        # Run in a daemon thread to avoid deadlocking the main thread.
                        shutdown_thread = threading.Thread(target=server.shutdown, daemon=True, name="server-shutdown")
                        shutdown_thread.start()
                        shutdown_thread.join(timeout=2.0)
                    except Exception:
                        pass
                    try:
                        server.server_close()
                    except Exception:
                        pass
                    if server_thread.is_alive():
                        server_thread.join(timeout=3)
                return 0
     
            if args.mode == "gui":
                log_debug("GUI mode has been removed.")
                return 0
     
            log_debug("Running in API client / Services mode...")
            api_client = APIClient(config)
            service = RicohService(api_client, config=config)
            toshiba_service = ToshibaService(api_client)
            if args.mode == "test":
                log_debug("Running test mode...")
                run_test_mode(config, service)
            else:
                log_debug("Running normal service mode...")
                os.environ["APP_RUN_MODE"] = "service"
                os.environ["APP_WEB_PORT"] = "0"
                run_normal_mode(service, toshiba_service, config, updater)
            log_debug("Normal mode finished.")
            return 0
        except BaseException as err:
            import traceback
            log_debug(f"Exception caught inside main running loop: {err}\n{traceback.format_exc()}")
            logging.exception("Unhandled error in main: %s", err)
            print(f"CRITICAL ERROR: {err}", file=sys.stderr)
            traceback.print_exc()
            return 1
    except BaseException as outer_err:
        import traceback
        log_debug(f"Exception caught in main outer block: {outer_err}\n{traceback.format_exc()}")
        return 1
    finally:
        log_debug("Entering main finally block...")
        try:
            if instance_lock is not None:
                instance_lock.release()
                log_debug("Released instance lock successfully.")
        except Exception as lock_err:
            log_debug(f"Failed to release instance lock: {lock_err}")
        log_debug("Exiting process via os._exit(0)")
        os._exit(0)


if __name__ == "__main__":
    sys.exit(main())
