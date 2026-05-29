#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test CRUD operations for Ricoh Address Book using strictly the /agent Core.
Performs the following lifecycle:
1. Read/List existing address book entries.
2. Create a new address entry (Name, Email, local FTP destination via setup_scan_destination).
3. Read/List to verify the creation.
4. Update/Modify the created entry (Recreate with updated fields, preserving Registration No).
5. Read/List to verify the updates.
6. Delete the entry.
7. Read/List to verify deletion.

Usage:
  python test_crud_address.py [IP] [USER] [PASSWORD]
Example:
  python test_crud_address.py 192.168.1.226 admin ""
"""
import sys
import os
import time

# Append project root to sys.path to ensure absolute imports work correctly
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from agent.services.api_client import Printer
from agent.modules.ricoh.service import RicohService


def log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}")


def print_entries(entries: list) -> None:
    print("-" * 80)
    if not entries:
        print("[!] No entries found.")
        return
    header = f"{'Reg No':<8} | {'Entry ID':<8} | {'Name':<20} | {'Type':<6} | {'Email':<22} | {'Folder Destination'}"
    print(header)
    print("-" * 80)
    for item in entries:
        reg = item.get("registration_no", "-")
        entry_id = item.get("entry_id", "-")
        name = item.get("name", "-")
        etype = item.get("type", "-")
        email = item.get("email_address", "-") or item.get("email", "-")
        folder = item.get("folder", "-")
        
        # Truncate for neat print
        name = str(name)[:20]
        email = str(email)[:22]
        folder = str(folder)[:30]
        print(f"{reg:<8} | {entry_id:<8} | {name:<20} | {etype:<6} | {email:<22} | {folder}")
    print("-" * 80)


def main():
    ip = sys.argv[1] if len(sys.argv) > 1 else "192.168.1.226"
    user = sys.argv[2] if len(sys.argv) > 2 else "admin"
    pw = sys.argv[3] if len(sys.argv) > 3 else ""

    print("=" * 80)
    print("      RICOH ADDRESS BOOK CRUD TEST SYSTEM (AGENT CORE)      ")
    print("=" * 80)
    log(f"Target Printer IP  : {ip}")
    log(f"Login Credentials  : user={user}, pass={'***' if pw else '<empty>'}")
    print("=" * 80)

    # Initialize components
    service = RicohService(api_client=None)
    printer = Printer(id=1, name="TestPrinter", ip=ip, user=user, password=pw)

    # Force clear any stale session locks on the copier before running the test
    log("Force releasing any stale copier sessions...")
    service.reset_web_session(printer)
    time.sleep(2)

    # 1. READ (Initial List)
    log("Step 1: Reading initial address book list...")
    try:
        payload = service.process_address_list(printer)
        initial_entries = payload.get("address_list", [])
        log(f"Found {len(initial_entries)} initial entries:")
        print_entries(initial_entries)
    except Exception as e:
        log(f"Failed to read address list: {e}")
        sys.exit(1)
    finally:
        # Force release session lock from list page
        service.reset_web_session(printer)

    # 2. CREATE
    log("Step 2: Creating a new address entry (and local FTP site)...")
    test_username = "CRUD_Test_User"
    test_email = "crud_test@example.com"
    
    # A. Dynamically find vacant local FTP port
    ftp_port = 2121
    import socket
    from agent.services.ftp_store import load_config, find_site_by_port
    while True:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('0.0.0.0', ftp_port))
                config_data = load_config()
                if not find_site_by_port(config_data, ftp_port):
                    break
        except Exception:
            pass
        ftp_port += 1
    log(f"Auto-detected vacant local TCP port for test: {ftp_port}")

    # B. Set up local FTP site configuration using ShareManager so the local FTP is up and running
    log("Setting up local FTP site configuration...")
    from agent.utils.shares import ShareManager
    from agent.modules.ricoh.address_book import default_ftp_root
    share_manager = ShareManager()
    ftp_name = f"ftp_{test_username}"
    ftp_res = share_manager.create_ftp_site(
        site_name=ftp_name,
        local_path=default_ftp_root(ftp_name),
        port=ftp_port,
    )
    if not ftp_res.get("ok"):
        log(f"Failed to create local FTP site: {ftp_res.get('warning')}")
        sys.exit(1)
        
    ftp_port_used = ftp_res.get("port") or ftp_port
    
    # C. Perform WIM address creation by importing and calling test_add_user functions directly
    log("Running proven wizard flow by importing test_add_user...")
    from test_add_user import login_ricoh, add_user_wizard
    
    try:
        session, wim_token = login_ricoh(ip, user, pw)
        if not session or not wim_token:
            raise RuntimeError("Could not log in. Aborting wizard execution.")
            
        success, reg_no = add_user_wizard(session, ip, wim_token, test_email, ftp_port_used)
        if not success:
            raise RuntimeError("add_user_wizard failed to create or verify the entry.")
            
        log(f"[SUCCESS] Entry created with Reg No: {reg_no} on FTP Port: {ftp_port_used}")
    except Exception as e:
        log(f"Create entry failed: {e}")
        sys.exit(1)
    finally:
        try:
            session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=2)
            session.close()
        except Exception:
            pass

    time.sleep(1.5)

    # 3. READ (Verify Creation)
    log("Step 3: Verifying creation by reading the list again...")
    created_found = False
    try:
        payload = service.process_address_list(printer)
        entries = payload.get("address_list", [])
        print_entries(entries)
        for item in entries:
            reg_val = str(item.get("registration_no", "")).strip().zfill(5)[-5:]
            if reg_val == reg_no:
                created_found = True
                log(f"[VERIFIED] Found newly created entry in the list: {item}")
                break
        if not created_found:
            log("WARNING: Newly created entry was not found in the list!")
    except Exception as e:
        log(f"Failed to read address list: {e}")
    finally:
        service.reset_web_session(printer)

    # 4. UPDATE (Modify)
    # The official modify route in web_scan_address.py deletes and recreates the entry.
    # We split these into explicit, well-spaced steps with session resets in between.
    log(f"Step 4: Updating entry with Reg No {reg_no}...")
    updated_name = "Scan to CRUD_Test_Updated"
    updated_email = "crud_updated@example.com"
    # Resolve the FTP host candidate automatically
    ftp_host_info = service.resolve_ftp_host_ip(ip)
    ftp_host = ftp_host_info.get("ip") or "127.0.0.1"
    updated_folder = f"ftp://{ftp_host}:{ftp_port_used}/updated_path"

    try:
        # A. Delete the old entry
        log("Deleting old entry for modification...")
        service.delete_address_entries(printer, [reg_no], verify=False)
        
        # B. Crucial web session reset after deletion
        log("Releasing web session lock after deletion...")
        service.reset_web_session(printer)
        time.sleep(1.5)
        
        # C. Create the updated entry with original desired reg_no
        log("Creating updated entry with original Reg No...")
        modify_res = service.create_address_user_wizard(
            printer=printer,
            name=updated_name,
            email=updated_email,
            folder=updated_folder,
            desired_registration_no=reg_no,
            allow_auto_update=False
        )
        log(f"[SUCCESS] Entry updated: {modify_res}")
    except Exception as e:
        log(f"Update entry failed: {e}")
    finally:
        # Make sure session lock is released
        service.reset_web_session(printer)

    time.sleep(1.5)

    # 5. READ (Verify Update)
    log("Step 5: Verifying updates in the list...")
    updated_found = False
    try:
        payload = service.process_address_list(printer)
        entries = payload.get("address_list", [])
        print_entries(entries)
        for item in entries:
            reg_val = str(item.get("registration_no", "")).strip().zfill(5)[-5:]
            if reg_val == reg_no:
                if item.get("name") == updated_name:
                    updated_found = True
                    log(f"[VERIFIED] Found updated entry in the list: {item}")
                    break
        if not updated_found:
            log("WARNING: Updated entry was not found or name did not match!")
    except Exception as e:
        log(f"Failed to read address list: {e}")
    finally:
        service.reset_web_session(printer)

    # 6. DELETE
    log(f"Step 6: Deleting entry with Reg No {reg_no}...")
    try:
        delete_res = service.delete_address_entries(
            printer=printer,
            registration_numbers=[reg_no],
            verify=True
        )
        log(f"[SUCCESS] Entry deleted: {delete_res}")
    except Exception as e:
        log(f"Delete entry failed: {e}")
    finally:
        service.reset_web_session(printer)

    time.sleep(1.5)

    # 7. READ (Verify Deletion)
    log("Step 7: Verifying deletion in the list...")
    deleted_verified = True
    try:
        payload = service.process_address_list(printer)
        entries = payload.get("address_list", [])
        print_entries(entries)
        for item in entries:
            reg_val = str(item.get("registration_no", "")).strip().zfill(5)[-5:]
            if reg_val == reg_no:
                deleted_verified = False
                log("ERROR: Entry still exists in the address book!")
                break
        if deleted_verified:
            log("[VERIFIED] Entry has been successfully removed.")
    except Exception as e:
        log(f"Failed to read address list: {e}")
    finally:
        service.reset_web_session(printer)

    print("=" * 80)
    if created_found and updated_found and deleted_verified:
        log("🎉 ALL CRUD TESTS PASSED SUCCESSFULLY!")
    else:
        log("❌ SOME CRUD TEST STEPS FAILED!")
    print("=" * 80)


if __name__ == "__main__":
    main()
