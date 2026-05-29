#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test CRUD operations for Ricoh Address Book.
Performs the following lifecycle:
1. Read/List existing address book entries.
2. Create a new address entry (Name, Email, local FTP destination).
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

from ricoh_web import login_ricoh, add_address_entry, delete_address_entry, get_best_local_ip
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
    print("           RICOH ADDRESS BOOK CRUD TEST SYSTEM            ")
    print("=" * 80)
    log(f"Target Printer IP  : {ip}")
    log(f"Login Credentials  : user={user}, pass={'***' if pw else '<empty>'}")
    print("=" * 80)

    # Initialize components
    service = RicohService(api_client=None)
    printer = Printer(id=1, name="TestPrinter", ip=ip, user=user, password=pw)
    ftp_host = get_best_local_ip(ip)

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

    # 2. CREATE
    log("Step 2: Creating a new address entry...")
    test_name = "CRUD_Test_User"
    test_email = "crud_test@example.com"
    reg_no = None
    ftp_port = None  # auto-detect and create local FTP

    # Login to get a session
    session, token = login_ricoh(ip, user, pw, verbose=True)
    if not session:
        log("ERROR: Login failed.")
        sys.exit(1)

    try:
        # Perform add entry
        result = add_address_entry(
            session=session,
            ip=ip,
            wim_token=token,
            name=test_name,
            email=test_email,
            ftp_host=ftp_host,
            ftp_port=ftp_port,
            ftp_path="/",
            verbose=True
        )
        reg_no = result.get("created_registration_no")
        ftp_port_used = result.get("ftp_port")
        log(f"[SUCCESS] Entry created with Reg No: {reg_no} on FTP Port: {ftp_port_used}")
    except Exception as e:
        log(f"Create entry failed: {e}")
        # Always logout
        try:
            session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
        except Exception:
            pass
        sys.exit(1)
    finally:
        # Logout session to release copier session lock
        try:
            session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
        except Exception:
            pass

    time.sleep(1.0)

    # 3. READ (Verify Creation)
    log("Step 3: Verifying creation by reading the list again...")
    created_found = False
    try:
        payload = service.process_address_list(printer)
        entries = payload.get("address_list", [])
        print_entries(entries)
        for item in entries:
            if item.get("registration_no") == reg_no:
                created_found = True
                log(f"[VERIFIED] Found newly created entry in the list: {item}")
                break
        if not created_found:
            log("WARNING: Newly created entry was not found in the list!")
    except Exception as e:
        log(f"Failed to read address list: {e}")

    # 4. UPDATE (Modify)
    # The official modify route in web_scan_address.py deletes and recreates the entry.
    # We will simulate this by updating fields for the same registration_no.
    log(f"Step 4: Updating entry with Reg No {reg_no}...")
    updated_name = "CRUD_Test_Updated"
    updated_email = "crud_updated@example.com"
    updated_folder = f"ftp://{ftp_host}:{ftp_port_used}/updated_path"

    try:
        # We can use the service's official modify function:
        # modify_address_user_wizard(printer, registration_no, name, email, folder, user_code, fields)
        # This will delete the entry first, and then call create_address_user_wizard with the desired reg_no.
        log("Calling modify_address_user_wizard on RicohService...")
        modify_res = service.modify_address_user_wizard(
            printer=printer,
            registration_no=reg_no,
            name=updated_name,
            email=updated_email,
            folder=updated_folder
        )
        log(f"[SUCCESS] Entry updated: {modify_res}")
    except Exception as e:
        log(f"Update entry failed: {e}")
        # Make sure session lock is released
        service.reset_web_session(printer)

    time.sleep(1.0)

    # 5. READ (Verify Update)
    log("Step 5: Verifying updates in the list...")
    updated_found = False
    try:
        payload = service.process_address_list(printer)
        entries = payload.get("address_list", [])
        print_entries(entries)
        for item in entries:
            if item.get("registration_no") == reg_no:
                if item.get("name") == updated_name:
                    updated_found = True
                    log(f"[VERIFIED] Found updated entry in the list: {item}")
                    break
        if not updated_found:
            log("WARNING: Updated entry was not found or name did not match!")
    except Exception as e:
        log(f"Failed to read address list: {e}")

    # 6. DELETE
    log(f"Step 6: Deleting entry with Reg No {reg_no}...")
    session, token = login_ricoh(ip, user, pw, verbose=True)
    if not session:
        log("ERROR: Login for delete failed.")
        sys.exit(1)

    try:
        delete_res = delete_address_entry(
            session=session,
            ip=ip,
            entry_ref=reg_no,
            verbose=True
        )
        log(f"[SUCCESS] Entry deleted: {delete_res}")
    except Exception as e:
        log(f"Delete entry failed: {e}")
    finally:
        # Always logout
        try:
            session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
        except Exception:
            pass

    time.sleep(1.0)

    # 7. READ (Verify Deletion)
    log("Step 7: Verifying deletion in the list...")
    deleted_verified = True
    try:
        payload = service.process_address_list(printer)
        entries = payload.get("address_list", [])
        print_entries(entries)
        for item in entries:
            if item.get("registration_no") == reg_no:
                deleted_verified = False
                log("ERROR: Entry still exists in the address book!")
                break
        if deleted_verified:
            log("[VERIFIED] Entry has been successfully removed.")
    except Exception as e:
        log(f"Failed to read address list: {e}")

    print("=" * 80)
    if created_found and updated_found and deleted_verified:
        log("🎉 ALL CRUD TESTS PASSED SUCCESSFULLY!")
    else:
        log("❌ SOME CRUD TEST STEPS FAILED!")
    print("=" * 80)


if __name__ == "__main__":
    main()
