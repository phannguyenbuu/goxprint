"""
Ricoh Web Interface - Standalone CLI helper wrapper.
Delegates all core operations directly to the unified agent service (/agent)
to maintain backward compatibility while eliminating code duplication.

Can be used as a library:
    from ricoh_web import login_ricoh, add_address_entry, delete_address_entry

Or run standalone:
    python ricoh_web.py login 192.168.1.226 admin ""
    python ricoh_web.py add 192.168.1.226 user@email.com 2122 admin ""
    python ricoh_web.py delete 192.168.1.226 00002 admin ""
"""
from __future__ import annotations

import re
import socket
import time
from typing import Any
import requests

from agent.services.api_client import Printer
from agent.modules.ricoh.service import RicohService


# ─── Logging ────────────────────────────────────────────────────────────────

def _log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}")


def get_best_local_ip(printer_ip: str) -> str:
    """Returns the local IP on the same subnet as the printer."""
    service = RicohService(api_client=None)
    res = service.resolve_ftp_host_ip(printer_ip)
    return res.get("ip") or "127.0.0.1"


# ─── Login ──────────────────────────────────────────────────────────────────

def login_ricoh(ip: str, user: str, password: str, *, verbose: bool = False) -> tuple[requests.Session | None, str]:
    """
    Login to Ricoh copier.
    Returns (session, wim_token) on success, (None, "") on failure.
    """
    if verbose:
        _log(f"Logging in to copier {ip} via Agent Core...")
    service = RicohService(api_client=None)
    printer = Printer(id=1, name="CLI-Printer", ip=ip, user=user, password=password)
    try:
        session = service.create_http_client(printer, authenticated=True)
        wim_token, _ = service._fetch_wim_token(session, printer)
        return session, wim_token
    except Exception as e:
        if verbose:
            _log(f"Login failed: {e}")
        return None, ""


def create_local_ftp(name: str, port: int, verbose: bool = False) -> dict[str, Any]:
    """Create local FTP site via ShareManager."""
    try:
        from agent.utils.shares import ShareManager
        from agent.services.runtime import default_ftp_root
        
        manager = ShareManager()
        safe_name = re.sub(r"[^A-Za-z0-9_-]", "", name.strip().replace(" ", "_"))[:48] or "scan"
        ftp_name = f"ftp_{safe_name}"
        ftp_root_path = default_ftp_root(ftp_name)
        
        if verbose:
            _log(f"Creating local FTP site '{ftp_name}' on port {port}...")
        
        res = manager.create_ftp_site(
            site_name=ftp_name,
            local_path=ftp_root_path,
            port=port,
        )
        return res
    except Exception as e:
        if verbose:
            _log(f"Failed to create FTP site: {e}")
        return {"ok": False, "error": str(e)}


# ─── Add Address Entry ───────────────────────────────────────────────────────

def add_address_entry(
    session: requests.Session,
    ip: str,
    wim_token: str,
    name: str,
    email: str,
    ftp_host: str,
    ftp_port: int | None = None,
    ftp_path: str = "/",
    *,
    verbose: bool = False,
) -> dict[str, Any]:
    """
    Add an address book entry with email + FTP folder.
    Returns dict with ok, created_registration_no, etc.
    """
    # Detect port if not provided
    if ftp_port is None:
        port = 2121
        while True:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.bind(('0.0.0.0', port))
                    ftp_port = port
                    break
            except OSError:
                port += 1
        if verbose:
            _log(f"Auto-detected free local TCP port: {ftp_port}")

    # Spin up local FTP site
    ftp_res = create_local_ftp(name, ftp_port, verbose=verbose)
    if not ftp_res.get("ok"):
        if verbose:
            _log(f"WARNING: FTP site creation returned: {ftp_res.get('error')}")

    service = RicohService(api_client=None)
    # Parse cookies from the existing session to reuse them
    user = ""
    password = ""
    printer = Printer(id=1, name="CLI-Printer", ip=ip, user=user, password=password)
    
    # Configure the FTP folder URL
    folder_url = f"ftp://{ftp_host}:{ftp_port}{ftp_path}"
    
    if verbose:
        _log(f"Calling create_address_user_wizard on Agent Core...")
        
    res = service.create_address_user_wizard(
        printer=printer,
        name=name,
        email=email,
        folder=folder_url,
        desired_registration_no=None,
        allow_auto_update=True
    )
    
    return {
        "ok": True,
        "created_registration_no": res.get("created_registration_no"),
        "entry_name": name,
        "email": email,
        "ftp_host": ftp_host,
        "ftp_port": ftp_port,
        "ftp_path": ftp_path,
        "ip": ip,
    }


# ─── Delete Address Entry ────────────────────────────────────────────────────

def delete_address_entry(
    session: requests.Session,
    ip: str,
    entry_ref: str,
    *,
    verbose: bool = False,
) -> dict[str, Any]:
    """
    Delete an address book entry by registration number or entry_id.
    Returns dict with ok, deleted, etc.
    """
    service = RicohService(api_client=None)
    printer = Printer(id=1, name="CLI-Printer", ip=ip, user="", password="")
    
    if verbose:
        _log(f"Deleting entry_ref={entry_ref} via Agent Core...")
        
    service.delete_address_entries(printer, [entry_ref], verify=False)
    return {"ok": True, "deleted": entry_ref, "entry_id": entry_ref, "ip": ip}


# ─── CLI ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    def usage():
        print("Usage:")
        print("  python ricoh_web.py login  <IP> <USER> <PASS>")
        print("  python ricoh_web.py add    <IP> <EMAIL> [<USER> [<PASS>]]")
        print("  python ricoh_web.py add    <IP> <EMAIL> <FTP_PORT> <USER> <PASS> (legacy)")
        print("  python ricoh_web.py delete <IP> <REG_NO_OR_ID> <USER> <PASS>")
        sys.exit(1)

    if len(sys.argv) < 2:
        usage()

    cmd = sys.argv[1].lower()

    if cmd == "login":
        ip = sys.argv[2] if len(sys.argv) > 2 else "192.168.1.226"
        user = sys.argv[3] if len(sys.argv) > 3 else "admin"
        pw = sys.argv[4] if len(sys.argv) > 4 else ""
        print("=" * 60)
        t0 = time.perf_counter()
        session, token = login_ricoh(ip, user, pw, verbose=True)
        elapsed = time.perf_counter() - t0
        print("=" * 60)
        if session:
            print(f"LOGIN SUCCESS ({elapsed:.1f}s) - wimToken: {token}")
            try:
                session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
            except Exception:
                pass
        else:
            print(f"LOGIN FAILED ({elapsed:.1f}s)")

    elif cmd == "add":
        ip = sys.argv[2] if len(sys.argv) > 2 else "192.168.1.226"
        email = sys.argv[3] if len(sys.argv) > 3 else "test@example.com"
        
        ftp_port = None
        user = "admin"
        pw = ""
        if len(sys.argv) > 4:
            if sys.argv[4].isdigit():
                ftp_port = int(sys.argv[4])
                user = sys.argv[5] if len(sys.argv) > 5 else "admin"
                pw = sys.argv[6] if len(sys.argv) > 6 else ""
            else:
                user = sys.argv[4]
                pw = sys.argv[5] if len(sys.argv) > 5 else ""
                
        ftp_host = get_best_local_ip(ip)
        print("=" * 60)
        port_desc = f"port {ftp_port}" if ftp_port is not None else "auto-port"
        _log(f"ADD: {email} -> {ip} (FTP {ftp_host}:{port_desc})")
        print("=" * 60)
        t0 = time.perf_counter()
        session, token = login_ricoh(ip, user, pw, verbose=True)
        if not session:
            print("LOGIN FAILED")
            sys.exit(1)
        try:
            name = email
            result = add_address_entry(session, ip, token, name, "", ftp_host, ftp_port, verbose=True)
            elapsed = time.perf_counter() - t0
            print("=" * 60)
            print(f"SUCCESS ({elapsed:.1f}s) - reg #{result['created_registration_no']} on FTP Port: {result['ftp_port']}")
        except Exception as e:
            print(f"FAILED: {e}")
        finally:
            try:
                session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
            except Exception:
                pass

    elif cmd == "delete":
        ip = sys.argv[2] if len(sys.argv) > 2 else "192.168.1.226"
        entry_ref = sys.argv[3] if len(sys.argv) > 3 else "00002"
        user = sys.argv[4] if len(sys.argv) > 4 else "admin"
        pw = sys.argv[5] if len(sys.argv) > 5 else ""
        print("=" * 60)
        _log(f"DELETE: {entry_ref} from {ip}")
        print("=" * 60)
        t0 = time.perf_counter()
        session, token = login_ricoh(ip, user, pw, verbose=True)
        if not session:
            print("LOGIN FAILED")
            sys.exit(1)
        try:
            result = delete_address_entry(session, ip, entry_ref, verbose=True)
            elapsed = time.perf_counter() - t0
            print("=" * 60)
            print(f"SUCCESS ({elapsed:.1f}s) - deleted {result['deleted']}")
        except Exception as e:
            print(f"FAILED: {e}")
        finally:
            try:
                session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
            except Exception:
                pass
    else:
        usage()
