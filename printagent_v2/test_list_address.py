#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Standalone test script to list address book entries from a Ricoh copier.
Inherits the official parsing and fetch logic directly from the modern Agent Core modules.
Usage: python test_list_address.py [IP] [USER] [PASSWORD]
"""
import sys
import os

# Append project root to sys.path to ensure absolute imports work correctly
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from agent.services.api_client import Printer
from agent.modules.ricoh.service import RicohService


def _log(msg: str) -> None:
    print(f"[*] {msg}")


def main():
    ip = sys.argv[1] if len(sys.argv) > 1 else "192.168.1.226"
    user = sys.argv[2] if len(sys.argv) > 2 else "admin"
    pw = sys.argv[3] if len(sys.argv) > 3 else ""

    print("=" * 80)
    print("        RICOH ADDRESS BOOK SCANNER (INHERITED TEST)        ")
    print("=" * 80)

    _log("Initializing official RicohService...")
    service = RicohService(api_client=None)

    _log(f"Configuring Printer object for IP: {ip} (User: {user})...")
    printer = Printer(
        id=1,
        name="TestPrinter",
        ip=ip,
        user=user,
        password=pw
    )

    _log("Executing official address list fetch flow...")
    try:
        # process_address_list coordinates login, dynamic AJAX and HTML table fetching, 
        # merging, and automatically cleans up/closes the session afterward!
        payload = service.process_address_list(printer)
        entries = payload.get("address_list", [])

        # Display results
        print("-" * 80)
        if not entries:
            print("[!] No address book entries found or unable to parse.")
        else:
            print(f"Address Book Entries ({len(entries)} found):")
            print("-" * 80)
            header = f"{'Reg No':<8} | {'Entry ID':<8} | {'Name':<20} | {'Type':<6} | {'Email':<22} | {'Folder Destination'}"
            print(header)
            print("-" * 80)
            
            for item in entries:
                reg = item.get("registration_no", "-")
                entry_id = item.get("entry_id", "-")
                name = item.get("name", "-")
                etype = item.get("type", "-")
                email = item.get("email_address", "-")
                folder = item.get("folder", "-")
                
                # Truncate to fit neatly
                name = str(name)[:20]
                email = str(email)[:22]
                folder = str(folder)[:30]
                
                print(f"{reg:<8} | {entry_id:<8} | {name:<20} | {etype:<6} | {email:<22} | {folder}")
                
        print("-" * 80)
        _log("Test completed successfully.")
        print("=" * 80)

    except Exception as e:
        print(f"[x] Error during address list process: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
