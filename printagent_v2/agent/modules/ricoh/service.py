from __future__ import annotations

import logging
from pathlib import Path

LOGGER = logging.getLogger(__name__)

import threading
import time
from typing import Any

from agent.config import AppConfig
from agent.modules.ricoh.base import RicohServiceBase
from agent.modules.ricoh.collector import RicohCollectorMixin
from agent.modules.ricoh.control import RicohControlMixin

try:
    from agent.modules.ricoh.address_book import RicohAddressBookMixin
except ImportError as err:
    LOGGER.exception("Failed to import RicohAddressBookMixin from address_book.py:")
    class RicohAddressBookMixin:
        pass

try:
    from agent.modules.ricoh.wizard import RicohAddressWizardMixin
except ImportError as err:
    LOGGER.exception("Failed to import RicohAddressWizardMixin from wizard.py:")
    class RicohAddressWizardMixin:
        pass
from agent.services.api_client import APIClient, Printer
from agent.utils.shares import ShareManager


class RicohService(
    RicohCollectorMixin,
    RicohControlMixin,
    RicohAddressBookMixin,
    RicohAddressWizardMixin
):
    """
    Unified Ricoh printer service that coordinates polling, counters, 
    machine control, and address book management.
    """
    def __init__(self, api_client: APIClient, interval_seconds: int = 60, config: AppConfig | None = None) -> None:
        super().__init__(api_client, interval_seconds)
        self._config = config
        self.share_manager = ShareManager()
        self._sync_existing_ftp_scan_dirs()

    def _sync_existing_ftp_scan_dirs(self) -> None:
        if self._config is None:
            return
        try:
            config_port_str = self._config.get_string("ftp_port", "").strip()
            config_port = int(config_port_str) if (config_port_str and config_port_str.isdigit()) else None
            
            ftp_root_path = None
            sites = self.share_manager.list_ftp_sites()
            
            if config_port is not None:
                for site in sites:
                    if int(site.get("port") or 0) == config_port:
                        path_str = str(site.get("path", "") or "").strip()
                        if path_str:
                            ftp_root_path = Path(path_str)
                            break
            
            if ftp_root_path is None:
                for site in sites:
                    if site.get("name") == "goxprint":
                        path_str = str(site.get("path", "") or "").strip()
                        if path_str:
                            ftp_root_path = Path(path_str)
                            break

            new_items = []
            if ftp_root_path and ftp_root_path.is_dir():
                for sub in ftp_root_path.iterdir():
                    if sub.is_dir():
                        new_items.append(str(sub))
            
            self._config.set_value("polling.scan_dirs", ";".join(new_items))
            LOGGER.info("Cleared scan_dirs and synced with FTP subfolders for port %s: registered %d subfolders.", 
                        config_port or "default", len(new_items))
        except Exception as exc:  # noqa: BLE001
            LOGGER.warning("Failed to register existing FTP scan roots: %s", exc)

    def process_printers(self, printers: list[Printer], should_post: bool = True) -> list[dict[str, Any]]:
        results = []
        for printer in printers:
            try:
                # 1. Check/Persist Credentials if missing
                if not printer.user or not printer.password:
                    try:
                        session = self.create_http_client(printer, authenticated=True)
                        LOGGER.info("Discovered credentials for %s: %s", printer.ip, printer.user)
                    except Exception:
                        pass
                
                # 2. Collect Data
                status = self.process_status(printer, should_post)
                counter = self.process_counter(printer, should_post)
                results.append({"ip": printer.ip, "status": status, "counter": counter})
            except Exception as e:
                LOGGER.error("Error processing printer %s: %s", printer.ip, e)
        return results

    def start(self, printers: list[Printer]) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._run_loop, args=(printers,), daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=5)

    def _run_loop(self, printers: list[Printer]) -> None:
        while not self._stop_event.is_set():
            self.process_printers(printers)
            time.sleep(self.interval_seconds)
