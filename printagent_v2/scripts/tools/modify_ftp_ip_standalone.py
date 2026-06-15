#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Standalone script to modify the FTP destination for cuongnhat24@gmail.com on the Ricoh copier.
Changes FTP IP from 192.168.1.111 to 192.168.1.99.

Usage:
  python printagent_v2/scripts/tools/modify_ftp_ip_standalone.py [COPIER_IP] [NEW_FTP_IP]
"""
import sys
import os
import time
import logging

# Configure basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# Ensure printagent_v2 is in sys.path
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from agent.services.api_client import Printer
from agent.modules.ricoh.service import RicohService

def log(msg: str) -> None:
    print(f"[*] {msg}")

def main():
    copier_ip = sys.argv[1] if len(sys.argv) > 1 else "192.168.1.222"
    new_ftp_ip = sys.argv[2] if len(sys.argv) > 2 else "192.168.1.99"
    
    # We are modifying cuongnhat24@gmail.com entry
    target_reg_no = "2"
    target_name = "cuongnhat24@gmail.co"
    new_folder = f"ftp://{new_ftp_ip}:2130/cuongnhat24@gmail.com/"
    
    print("=" * 80)
    print("           STANDALONE RICOH FTP DESTINATION IP UPDATER          ")
    print("=" * 80)
    log(f"Target Copier IP : {copier_ip}")
    log(f"Target Reg No    : {target_reg_no}")
    log(f"Target Name      : {target_name}")
    log(f"New Destination  : {new_folder}")
    print("=" * 80)
    
    # Initialize service
    service = RicohService(api_client=None)
    printer = Printer(
        id=1,
        name="TargetRicoh",
        ip=copier_ip,
        user="admin",
        password=""
    )
    
    # Force release any session
    log("Checking and releasing stale session locks on copier...")
    try:
        service.reset_web_session(printer)
    except Exception as e:
        log(f"Notice: Session reset failed (may be already clean): {e}")
    time.sleep(1)
    
    # 1. Fetch current address book
    log("Fetching current address book to verify entry details...")
    session = service.create_http_client(printer, authenticated=True)
    try:
        payload = service.process_address_list(printer, session=session)
        entries = payload.get("address_list", [])
        
        target_entry = None
        for entry in entries:
            reg_val = str(entry.get("registration_no", "")).strip().zfill(5)[-5:]
            if reg_val == target_reg_no.zfill(5):
                target_entry = entry
                break
                
        if not target_entry:
            log(f"ERROR: Entry with Registration No {target_reg_no} not found in copier address book!")
            # Print address book for reference
            print("-" * 80)
            for entry in entries:
                print(f"Reg: {entry.get('registration_no')} | Name: {entry.get('name')} | Folder: {entry.get('folder')}")
            print("-" * 80)
            sys.exit(1)
            
        log(f"Found target entry:")
        log(f"  Name      : {target_entry.get('name')}")
        log(f"  Current FTP: {target_entry.get('folder')}")
        
        # 2. Modify entry using the CHANGEUSER wizard
        log("Initiating CHANGEUSER modification step...")
        fields = {
            "folderAuthUserNameIn": "goxprint",
            "folderAuthUserName": "goxprint",
            "folderPasswordIn": "goxprint",
            "wk_folderPasswordIn": "goxprint",
            "folderPasswordConfirmIn": "goxprint",
            "wk_folderPasswordConfirmIn": "goxprint",
        }
        
        res = service.modify_address_user_wizard(
            printer=printer,
            registration_no=target_reg_no,
            name=target_name,
            email="",
            folder=new_folder,
            fields=fields,
            session=session
        )
        
        if res.get("ok"):
            log("SUCCESS: Copier accepted modification commands.")
        else:
            log(f"ERROR: Modification failed. Result: {res}")
            sys.exit(1)
            
        # 3. Verify modification
        log("Verifying modification by fetching the updated address book...")
        time.sleep(2)
        
        payload_new = service.process_address_list(printer, session=session)
        entries_new = payload_new.get("address_list", [])
        
        verified_entry = None
        for entry in entries_new:
            reg_val = str(entry.get("registration_no", "")).strip().zfill(5)[-5:]
            if reg_val == target_reg_no.zfill(5):
                verified_entry = entry
                break
                
        if verified_entry:
            log(f"Verified target entry after update:")
            log(f"  Name      : {verified_entry.get('name')}")
            log(f"  Folder FTP: {verified_entry.get('folder')}")
            
            actual_folder = str(verified_entry.get('folder', '')).strip().lower()
            expected_host = new_ftp_ip.lower()
            expected_path = "/cuongnhat24@gmail.com/".lower()
            
            if expected_host in actual_folder and expected_path in actual_folder:
                print("=" * 80)
                print("   SUCCESS: FTP DESTINATION IP SUCCESSFULLY CHANGED AND VERIFIED!")
                print("=" * 80)
            else:
                log("WARNING: Folder path does not match the expected path!")
        else:
            log("WARNING: Entry not found in address book list after update verification!")
            
    finally:
        log("Closing copier connection session...")
        try:
            service._reset_web_session(session, printer)
            session.close()
        except Exception:
            pass

if __name__ == "__main__":
    main()
