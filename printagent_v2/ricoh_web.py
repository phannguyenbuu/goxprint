"""
Ricoh Web Interface - Standalone helper module.
Handles login, address book add, and address book delete for Ricoh copiers.

Can be used as a library:
    from ricoh_web import login_ricoh, add_address_entry, delete_address_entry

Or run standalone:
    python ricoh_web.py login 192.168.1.226 admin ""
    python ricoh_web.py add 192.168.1.226 user@email.com 2122 admin ""
    python ricoh_web.py delete 192.168.1.226 00002 admin ""
"""
from __future__ import annotations

import base64
import re
import socket
import time
from typing import Any

import requests
from urllib.parse import urljoin


# ─── Logging ────────────────────────────────────────────────────────────────

def _log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}")


# ─── Helpers ────────────────────────────────────────────────────────────────

def extract_wim_token(html: str) -> str:
    match = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)["\']?', html, re.I)
    if match:
        return match.group(1)
    match = re.search(r'name\s*=\s*["\']?wimToken["\']?\s+value\s*=\s*["\']?([^"\'\s>]+)["\']?', html, re.I)
    return match.group(1) if match else ""


def extract_hidden_inputs(html: str) -> dict[str, str]:
    fields: dict[str, str] = {}
    for match in re.finditer(r'<input\s+[^>]*?type\s*=\s*["\']?hidden["\']?[^>]*?>', html, re.I | re.S):
        tag = match.group(0)
        name_m = re.search(r'name\s*=\s*["\']?([^"\'\s>]+)["\']?', tag, re.I)
        value_m = re.search(r'value\s*=\s*["\']?([^"\'\s>]*)["\']?', tag, re.I)
        if name_m:
            fields[name_m.group(1)] = value_m.group(1) if value_m else ""
    return fields


def get_best_local_ip(printer_ip: str) -> str:
    """Returns the local IP on the same subnet as the printer."""
    candidates: list[str] = []
    try:
        hostname = socket.gethostname()
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if ip and ip != "127.0.0.1":
                candidates.append(ip)
    except Exception:
        pass
    for probe in ("8.8.8.8", "1.1.1.1"):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
                s.connect((probe, 80))
                ip = s.getsockname()[0]
                if ip and ip != "127.0.0.1" and ip not in candidates:
                    candidates.append(ip)
        except Exception:
            continue
    prefix = ".".join(printer_ip.split(".")[:3])
    for ip in candidates:
        if ".".join(ip.split(".")[:3]) == prefix:
            return ip
    return candidates[0] if candidates else "127.0.0.1"


# ─── Login ──────────────────────────────────────────────────────────────────

def login_ricoh(ip: str, user: str, password: str, *, verbose: bool = False) -> tuple[requests.Session | None, str]:
    """
    Login to Ricoh copier.
    Returns (session, wim_token) on success, (None, "") on failure.
    """
    base_url = f"http://{ip}"
    session = requests.Session()
    session.headers.update({"User-Agent": "printer-agent/0.1"})
    session.cookies.set("cookieOnOffChecker", "on")

    if verbose:
        _log(f"Resetting stale sessions on {ip}...")
    for path in ["/web/entry/en/websys/webArch/logout.cgi", "/web/guest/en/websys/webArch/logout.cgi"]:
        try:
            session.get(urljoin(base_url, path), timeout=3)
        except Exception:
            pass
    session.cookies.clear()
    session.cookies.set("cookieOnOffChecker", "on")

    # GET auth form
    if verbose:
        _log("GET authForm.cgi...")
    try:
        resp = session.get(urljoin(base_url, "/web/entry/en/websys/webArch/authForm.cgi"), timeout=8)
        html = resp.text
        # Handle JS redirect
        if "document.form1.submit()" in html or 'name="form1"' in html:
            if verbose:
                _log("  JS redirect detected, following...")
            hidden = extract_hidden_inputs(html)
            action_m = re.search(r'action\s*=\s*["\']([^"\']+)["\']', html, re.I)
            if action_m:
                resp = session.post(urljoin(resp.url, action_m.group(1)), data=hidden, timeout=5)
                html = resp.text
        wim_token = extract_wim_token(html)
        referer = resp.url
        if verbose:
            _log(f"  wimToken: {wim_token or 'NOT FOUND'}")
    except Exception as e:
        if verbose:
            _log(f"  Failed: {e}")
        return None, ""

    if not wim_token:
        return None, ""

    # POST login - try 3 strategies
    enc_user = base64.b64encode(user.encode()).decode()
    enc_pass = base64.b64encode(password.encode()).decode()
    strategies = [
        ("Plain (entry)", "/web/entry/en/websys/webArch/login.cgi",
         {"userid": user, "username": user, "password": password, "wimToken": wim_token}),
        ("Plain (guest)", "/web/guest/en/websys/webArch/login.cgi",
         {"userid": user, "username": user, "password": password, "wimToken": wim_token, "open": "websys/webArch/authForm.cgi"}),
        ("Base64 (guest)", "/web/guest/en/websys/webArch/login.cgi",
         {"userid": enc_user, "username": enc_user, "password": enc_pass, "wimToken": wim_token, "open": "websys/webArch/authForm.cgi"}),
    ]
    for name, path, data in strategies:
        if verbose:
            _log(f"  Trying {name}...")
        try:
            resp = session.post(urljoin(base_url, path), data=data, headers={"Referer": referer}, timeout=8)
            wimsesid = session.cookies.get("wimsesid", "")
            if wimsesid and wimsesid != "--" and "Login User Name" not in resp.text:
                if verbose:
                    _log(f"  Login OK via {name}")
                return session, wim_token
        except Exception:
            continue

    return None, ""


# ─── Add Address Entry ───────────────────────────────────────────────────────

def add_address_entry(
    session: requests.Session,
    ip: str,
    wim_token: str,
    name: str,
    email: str,
    ftp_host: str,
    ftp_port: int,
    ftp_path: str = "/",
    *,
    verbose: bool = False,
) -> dict[str, Any]:
    """
    Add an address book entry with email + FTP folder.
    Returns dict with ok, created_registration_no, etc.
    """
    base_url = f"http://{ip}"
    list_url = f"{base_url}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    wizard_set_url = f"{base_url}/web/entry/en/address/adrsSetUserWizard.cgi"
    wizard_get_url = f"{base_url}/web/entry/en/address/adrsGetUserWizard.cgi"

    def _post_step(data_str: str) -> str:
        resp = session.post(wizard_set_url, data=data_str, headers={
            "Referer": wizard_get_url,
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
        }, timeout=10)
        return resp.text

    # Load address list (context + wimToken)
    if verbose:
        _log("Loading address list...")
    resp = session.get(list_url, timeout=10)
    page_token = extract_wim_token(resp.text)
    if page_token:
        wim_token = page_token

    # Find next registration number
    reg_numbers = re.findall(r'<nobr>(\d{5})</nobr>', resp.text)
    highest = max((int(r) for r in reg_numbers), default=0)
    reg_no = f"{highest + 1:05d}"
    if verbose:
        _log(f"Next registration no: {reg_no}")

    # Open wizard (preserve wimsesid - copier resets it to "--")
    if verbose:
        _log("Opening wizard...")
    saved_wimsesid = session.cookies.get("wimsesid", "")
    try:
        resp = session.post(wizard_get_url,
                            data=f"mode=ADDUSER&outputSpecifyModeIn=DEFAULT&wimToken={wim_token}",
                            headers={"Content-Type": "application/x-www-form-urlencoded", "Referer": list_url},
                            timeout=10)
        new_token = extract_wim_token(resp.text)
        if new_token:
            wim_token = new_token
    except Exception as e:
        if verbose:
            _log(f"  Wizard open failed: {e}")
    # Restore wimsesid if reset
    current = session.cookies.get("wimsesid", "")
    if (not current or current == "--") and saved_wimsesid and saved_wimsesid != "--":
        session.cookies.set("wimsesid", saved_wimsesid)

    # Wizard steps
    if verbose:
        _log(f"BASE: name={name}, reg={reg_no}")
    html = _post_step(f"mode=ADDUSER&step=BASE&wimToken={wim_token}&entryIndexIn={reg_no}&entryNameIn={name}&entryDisplayNameIn={name}&entryTagInfoIn=1&entryTagInfoIn=1&entryTagInfoIn=1&entryTagInfoIn=1&entryTypeIn=1")
    wim_token = extract_wim_token(html) or wim_token

    if verbose:
        _log(f"MAIL: email={email}")
    html = _post_step(f"mode=ADDUSER&step=MAIL&wimToken={wim_token}&mailAddressIn={email}")
    wim_token = extract_wim_token(html) or wim_token

    if verbose:
        _log(f"FOLDER: ftp://{ftp_host}:{ftp_port}{ftp_path}")
    html = _post_step(f"mode=ADDUSER&step=FOLDER&wimToken={wim_token}&folderProtocolIn=FTP_O&folderPortNoIn={ftp_port}&folderServerNameIn={ftp_host}&folderPathNameIn={ftp_path}&folderAuthUserNameIn=&folderPasswordIn=&wk_folderPasswordIn=&folderPasswordConfirmIn=&wk_folderPasswordConfirmIn=")
    wim_token = extract_wim_token(html) or wim_token

    if verbose:
        _log("CONFIRM...")
    html = _post_step(f"mode=ADDUSER&step=CONFIRM&wimToken={wim_token}&stepListIn=BASE&stepListIn=MAIL&stepListIn=FOLDER")

    if "Session timed out" in html:
        raise RuntimeError("Session timed out during wizard CONFIRM")

    return {
        "ok": True,
        "created_registration_no": reg_no,
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
    Delete an address book entry by registration number (e.g. "00002") or entry_id.
    Returns dict with ok, deleted, etc.
    """
    base_url = f"http://{ip}"
    list_url = f"{base_url}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    delete_url = f"{base_url}/web/entry/en/address/adrsDeleteEntries.cgi"

    # Load address list
    if verbose:
        _log("Loading address list...")
    resp = session.get(list_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    if not wim_token:
        raise RuntimeError("No wimToken from address list")

    # Resolve entry_id from registration number
    entry_id = entry_ref
    if len(entry_ref) == 5 and entry_ref.isdigit():
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', resp.text, re.S)
        for row in rows:
            if f'<nobr>{entry_ref}</nobr>' in row:
                id_match = re.search(r'value="(\d+)"\s+name="entryIndex"', row)
                if id_match:
                    entry_id = id_match.group(1)
                    if verbose:
                        _log(f"Resolved entry_id={entry_id} for reg no {entry_ref}")
                    break

    if verbose:
        _log(f"Deleting entry_id={entry_id}...")

    form_data = {
        "wimToken": wim_token,
        "entryIndex": f"{entry_id},",
        "entryIndexIn": f"{entry_id},",
        "regiNoListIn": entry_id,
        "selectedRegiNoIn": entry_id,
        "deleteListIn": entry_id,
    }
    resp = session.post(delete_url, data=form_data, headers={
        "Referer": list_url,
        "Content-Type": "application/x-www-form-urlencoded",
    }, timeout=15)
    resp.raise_for_status()

    # Verify
    time.sleep(0.5)
    resp = session.get(list_url, timeout=10)
    still_exists = (f'<nobr>{entry_ref}</nobr>' in resp.text
                    if len(entry_ref) == 5 else f'value="{entry_id}"' in resp.text)

    if still_exists:
        raise RuntimeError(f"Entry {entry_ref} still exists after delete")

    return {"ok": True, "deleted": entry_ref, "entry_id": entry_id, "ip": ip}


# ─── CLI ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    def usage():
        print("Usage:")
        print("  python ricoh_web.py login  <IP> <USER> <PASS>")
        print("  python ricoh_web.py add    <IP> <EMAIL> <FTP_PORT> <USER> <PASS>")
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
            session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
        else:
            print(f"LOGIN FAILED ({elapsed:.1f}s)")

    elif cmd == "add":
        ip = sys.argv[2] if len(sys.argv) > 2 else "192.168.1.226"
        email = sys.argv[3] if len(sys.argv) > 3 else "test@example.com"
        ftp_port = int(sys.argv[4]) if len(sys.argv) > 4 else 2121
        user = sys.argv[5] if len(sys.argv) > 5 else "admin"
        pw = sys.argv[6] if len(sys.argv) > 6 else ""
        ftp_host = get_best_local_ip(ip)
        print("=" * 60)
        _log(f"ADD: {email} -> {ip} (FTP {ftp_host}:{ftp_port})")
        print("=" * 60)
        t0 = time.perf_counter()
        session, token = login_ricoh(ip, user, pw, verbose=True)
        if not session:
            print("LOGIN FAILED")
            sys.exit(1)
        try:
            name = email.split("@")[0]
            result = add_address_entry(session, ip, token, name, email, ftp_host, ftp_port, verbose=True)
            elapsed = time.perf_counter() - t0
            print("=" * 60)
            print(f"SUCCESS ({elapsed:.1f}s) - reg #{result['created_registration_no']}")
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
