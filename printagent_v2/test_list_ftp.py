#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Standalone test script to list all active and configured FTP sites.
Usage: python test_list_ftp.py
"""
import sys
import os

# Append project root to sys.path to ensure absolute imports work correctly
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from agent.utils.shares import ShareManager


def _log(msg: str) -> None:
    print(f"[*] {msg}")


def main():
    print("=" * 70)
    print("        FTP SITES SCANNING PROCESS (STANDALONE TEST)        ")
    print("=" * 70)

    _log("Initializing ShareManager...")
    try:
        manager = ShareManager()
        
        # Check Admin rights
        is_admin = manager.is_admin()
        _log(f"Current Admin rights: {'YES (ADMIN)' if is_admin else 'NO (USER)'}")
        
        _log("Reading FTP sites configuration...")
        sites = manager.list_ftp_sites()
        
        print("-" * 70)
        if not sites:
            print("[!] No FTP sites found/configured in the system.")
            print("[!] Assign a Scan Folder via Dashboard or API to create one.")
            print("-" * 70)
            return

        print(f"Found {len(sites)} FTP site(s):")
        print("-" * 70)
        
        for idx, site in enumerate(sites, 1):
            name = site.get("name", "N/A")
            port = site.get("port", "N/A")
            path = site.get("path", "N/A")
            user = site.get("ftp_user", "N/A")
            running = site.get("running", False)
            state = site.get("state", "configured")
            
            status_label = "\033[92mRUNNING\033[0m" if running else "\033[91mSTOPPED\033[0m"
            # Fallback if terminal doesn't support colors
            if sys.platform == "win32":
                # Check if ANSI escape codes are supported, otherwise use plain text
                os.system("") # Enables ANSI on Windows 10+
            
            print(f" {idx}. Site Name:  {name}")
            print(f"    Port:       {port}")
            print(f"    Path:       {path}")
            print(f"    FTP User:   {user}")
            print(f"    Status:     {status_label} (State: {state})")
            
            # Check firewall warnings
            firewall = site.get("firewall", {})
            if isinstance(firewall, dict) and firewall.get("errors"):
                print(f"    Warning:    Firewall errors: {', '.join(firewall.get('errors'))}")
            print("-" * 70)

    except Exception as e:
        print(f"[x] Đã xảy ra lỗi khi liệt kê FTP sites: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
