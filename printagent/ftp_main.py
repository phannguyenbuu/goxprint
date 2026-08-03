from __future__ import annotations

import logging
import sys
import os
import traceback

from agent.config import AppConfig
from agent.main import _ensure_runtime_root, clean_stuck_bak_processes
from agent.main import _resolve_log_path, default_log_path, cleanup_old_rotated_logs, LimitedFileHandler, _MaxLevelFilter
def setup_ftp_logging(runtime_root: Path) -> tuple[Path, Path]:
    root = logging.getLogger()
    root.handlers.clear()
    root.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")

    stdout_name = "ftp_stout.txt"
    stderr_name = "ftp_sterror.txt"

    stdout_path = _resolve_log_path(str(default_log_path(stdout_name)), runtime_root, stdout_name)
    stderr_path = _resolve_log_path(str(default_log_path(stderr_name)), runtime_root, stderr_name)

    cleanup_old_rotated_logs(stdout_path.parent)

    try:
        stdout_handler = LimitedFileHandler(stdout_path, max_lines=1000, encoding="utf-8")
        stdout_handler.setLevel(logging.INFO)
        stdout_handler.addFilter(_MaxLevelFilter(logging.ERROR))
        stdout_handler.setFormatter(formatter)
        root.addHandler(stdout_handler)
    except Exception as exc:
        pass

    try:
        stderr_handler = LimitedFileHandler(stderr_path, max_lines=1000, encoding="utf-8")
        stderr_handler.setLevel(logging.ERROR)
        stderr_handler.setFormatter(formatter)
        root.addHandler(stderr_handler)
    except Exception as exc:
        pass
    
    return stdout_path, stderr_path

from agent.services.ftp_worker import FtpWorker
from agent.services.runtime import acquire_single_instance

LOGGER = logging.getLogger(__name__)

def run_ftp_worker_mode(config: AppConfig) -> None:
    if not config.get_bool("modules.ftp.enabled", True):
        logging.info("FTP worker is disabled by configuration modules.ftp.enabled=false; exiting")
        return
    worker = FtpWorker()
    worker.run_forever()

def main() -> int:
    # Cleanup any stuck bak files for the ftp worker
    clean_stuck_bak_processes()
    
    instance_lock = None
    try:
        runtime_root = _ensure_runtime_root()
        stdout_path, stderr_path = setup_ftp_logging(runtime_root)
        
        logging.info(f"ftp_main() started: root={runtime_root}, logs={stdout_path}")
        
        config = AppConfig.load()
        
        instance_name = "Global\\GoPrinxAgentFtpWorker"
        instance_lock, is_primary = acquire_single_instance(instance_name)
        
        if not is_primary:
            logging.debug("Another GoPrinxAgentFtpWorker process is already running. Exiting.")
            return 0
            
        logging.info("Running in FTP worker mode...")
        run_ftp_worker_mode(config)
        
        logging.info("FTP worker mode finished.")
        return 0
        
    except BaseException as err:
        logging.exception("Unhandled error in ftp_main: %s", err)
        print(f"CRITICAL ERROR: {err}", file=sys.stderr)
        traceback.print_exc()
        return 1
    finally:
        try:
            if instance_lock is not None:
                instance_lock.release()
        except Exception:
            pass
        os._exit(0)

if __name__ == "__main__":
    sys.exit(main())
