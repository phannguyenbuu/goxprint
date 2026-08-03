from __future__ import annotations
import logging
import json
import time

LOGGER = logging.getLogger(__name__)

class PollingIpChangeMixin:

    def polling_when_ip_change(self) -> None:
        if not self._ip_change_lock.acquire(blocking=False):
            LOGGER.debug("[polling_when_ip_change] Already running, skipping concurrent run.")
            return
        try:
            current_ip = self._resolve_local_ip()
            if not current_ip:
                LOGGER.warning("[polling_when_ip_change] Cannot resolve local IP.")
                return

            stored_ip = self._config.get_string("pc_ip", "").strip()
            if not stored_ip:
                LOGGER.info("[polling_when_ip_change] pc_ip in settings.json is empty. Initializing with %s", current_ip)
                self._config.set_value("pc_ip", current_ip)
                return

            if current_ip == stored_ip:
                LOGGER.debug("[polling_when_ip_change] IP is unchanged (%s). Skipping.", current_ip)
                return

            LOGGER.info("[polling_when_ip_change] IP change detected: old=%s, new=%s", stored_ip, current_ip)
            self._config.set_value("pc_ip", current_ip)

            # Retrieve copiers
            printers = self._load_printers()
            if not printers:
                LOGGER.info("[polling_when_ip_change] No printers/copiers found.")
                return

            ftp_user = self._config.get_string("ftp_user", "goxprint")
            ftp_pass = self._config.get_string("ftp_pass", "goxprint")
            fields = {
                "folderAuthUserNameIn": ftp_user,
                "folderAuthUserName": ftp_user,
                "folderPasswordIn": ftp_pass,
                "wk_folderPasswordIn": ftp_pass,
                "folderPasswordConfirmIn": ftp_pass,
                "wk_folderPasswordConfirmIn": ftp_pass,
            }

            for printer in printers:
                if self._printer_type(printer.printer_type) != "ricoh":
                    continue

                LOGGER.info("[polling_when_ip_change] Checking address book on copier %s (IP=%s)...", printer.name, printer.ip)
                session = None
                try:
                    try:
                        session = self._ricoh_service.create_http_client(printer, authenticated=True)
                    except Exception as auth_exc:
                        LOGGER.debug("[polling_when_ip_change] Admin login failed for %s (%s), trying unauthenticated session: %s", printer.name, printer.ip, auth_exc)
                        session = self._ricoh_service.create_http_client(printer, authenticated=False)

                    payload = self._ricoh_service.process_address_list(printer, session=session)
                    entries = payload.get("address_list", [])

                    for entry in entries:
                        folder = str(entry.get("folder", "") or "").strip()
                        if folder and ("ftp://" in folder or folder.startswith("ftp:")) and stored_ip in folder:
                            new_folder = folder.replace(stored_ip, current_ip)
                            reg_no = str(entry.get("registration_no", "")).strip()
                            name = str(entry.get("name", "") or "").strip()
                            email = str(entry.get("email_address", "") or "").strip()

                            LOGGER.info("[polling_when_ip_change] Modifying FTP destination for %s (IP=%s) entry %s: name='%s' path=%s -> %s",
                                        printer.name, printer.ip, reg_no, name, folder, new_folder)

                            res = self._ricoh_service.modify_address_user_wizard(
                                printer=printer,
                                registration_no=reg_no,
                                name=name,
                                email=email,
                                folder=new_folder,
                                fields=fields,
                                session=session
                            )
                            if res.get("ok"):
                                LOGGER.info("[polling_when_ip_change] Success updating copier %s entry %s to folder %s",
                                            printer.ip, reg_no, new_folder)
                            else:
                                LOGGER.warning("[polling_when_ip_change] Failed updating copier %s entry %s: %s",
                                               printer.ip, reg_no, res)
                except Exception as e:
                    LOGGER.warning("[polling_when_ip_change] Skipping copier %s (IP=%s): %s",
                                   printer.name, printer.ip, e)
                finally:
                    if session:
                        try:
                            self._ricoh_service._reset_web_session(session, printer)
                            session.close()
                        except Exception:
                            pass
        except Exception as global_exc:
            LOGGER.error("[polling_when_ip_change] Global error: %s", global_exc, exc_info=True)
        finally:
            self._ip_change_lock.release()

    def _ip_change_polling_loop(self) -> None:
        LOGGER.info("IP change polling worker loop started")
        # Run immediately on start
        try:
            self.polling_when_ip_change()
        except Exception as exc:
            LOGGER.warning("Initial polling_when_ip_change call failed: %s", exc)

        while not self._stop_event.is_set():
            # Wait 1 hour (3600 seconds) checking stop event every second
            for _ in range(3600):
                if self._stop_event.is_set():
                    break
                time.sleep(1.0)
            
            if self._stop_event.is_set():
                break
                
            try:
                self.polling_when_ip_change()
            except Exception as exc:
                LOGGER.warning("Periodic polling_when_ip_change call failed: %s", exc)
