"""
Standalone Ricoh Address Book - Add User with FTP destination.
Uses proven wizard flow: wimsesid preservation + URL-encoded POST.

Usage:
  python test_add_user.py [IP] [EMAIL] [FTP_PORT] [ADMIN_USER] [ADMIN_PASS]

Example:
  python test_add_user.py 192.168.1.226 nbuu@gmail.com 2122 admin ""
"""
import sys
import re
import time
import socket
import base64
import requests
from urllib.parse import urljoin


def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}")


def get_best_local_ip(printer_ip):
    candidates = []
    try:
        for ip in socket.gethostbyname_ex(socket.gethostname())[2]:
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


def extract_wim_token(html):
    match = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)["\']?', html, re.I)
    if match:
        return match.group(1)
    match = re.search(r'name\s*=\s*["\']?wimToken["\']?\s+value\s*=\s*["\']?([^"\'\s>]+)["\']?', html, re.I)
    return match.group(1) if match else ""


def extract_hidden_inputs(html):
    fields = {}
    for m in re.finditer(r'<input\s+[^>]*?type\s*=\s*["\']?hidden["\']?[^>]*?>', html, re.I | re.S):
        tag = m.group(0)
        name_m = re.search(r'name\s*=\s*["\']?([^"\'\s>]+)["\']?', tag, re.I)
        value_m = re.search(r'value\s*=\s*["\']?([^"\'\s>]*)["\']?', tag, re.I)
        if name_m:
            fields[name_m.group(1)] = value_m.group(1) if value_m else ""
    return fields


def login_ricoh(ip, user, password):
    """Login to Ricoh copier. Returns (session, wim_token) or (None, '')."""
    base_url = f"http://{ip}"
    session = requests.Session()
    session.headers.update({"User-Agent": "printer-agent/0.1"})
    session.cookies.set("cookieOnOffChecker", "on")

    log("Resetting stale sessions...")
    for path in ["/web/entry/en/websys/webArch/logout.cgi", "/web/guest/en/websys/webArch/logout.cgi"]:
        try:
            session.get(urljoin(base_url, path), timeout=3)
        except Exception:
            pass
    session.cookies.clear()
    session.cookies.set("cookieOnOffChecker", "on")

    log("GET authForm.cgi...")
    try:
        resp = session.get(urljoin(base_url, "/web/entry/en/websys/webArch/authForm.cgi"), timeout=8)
        html = resp.text
        if "document.form1.submit()" in html or 'name="form1"' in html:
            log("  JS redirect detected, following...")
            hidden = extract_hidden_inputs(html)
            action_m = re.search(r'action\s*=\s*["\']([^"\']+)["\']', html, re.I)
            if action_m:
                resp = session.post(urljoin(resp.url, action_m.group(1)), data=hidden, timeout=5)
                html = resp.text
        wim_token = extract_wim_token(html)
        referer = resp.url
        log(f"  wimToken: {wim_token or 'NOT FOUND'}")
    except Exception as e:
        log(f"  Failed: {e}")
        return None, ""

    if not wim_token:
        return None, ""

    enc_user = base64.b64encode(user.encode()).decode()
    enc_pass = base64.b64encode(password.encode()).decode()
    strategies = [
        ("Base64 (guest)", "/web/guest/en/websys/webArch/login.cgi",
         {"userid": enc_user, "username": enc_user, "password": enc_pass, "wimToken": wim_token, "open": "websys/webArch/authForm.cgi"}),
        ("Plain (entry)", "/web/entry/en/websys/webArch/login.cgi",
         {"userid": user, "username": user, "password": password, "wimToken": wim_token}),
        ("Plain (guest)", "/web/guest/en/websys/webArch/login.cgi",
         {"userid": user, "username": user, "password": password, "wimToken": wim_token, "open": "websys/webArch/authForm.cgi"}),
    ]
    for name, path, data in strategies:
        log(f"  Trying {name}...")
        try:
            resp = session.post(urljoin(base_url, path), data=data, headers={"Referer": referer}, timeout=8)
            wimsesid = session.cookies.get("wimsesid", "")
            if wimsesid and wimsesid != "--" and "Login User Name" not in resp.text:
                log(f"  Login OK via {name}")
                return session, wim_token
        except Exception:
            continue
    log("ERROR: All login strategies failed.")
    return None, ""


def parse_existing_entries(html):
    """Helper to parse existing (reg_no, name) from the address book list HTML."""
    entries = []
    tbody_match = re.search(r'<tbody id="ReportListArea_TableBody">(.*?)</tbody>', html, re.S)
    tbody_html = tbody_match.group(1) if tbody_match else html
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', tbody_html, re.S)
    for row in rows:
        if "reportListDummyRow" in row:
            continue
        cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.S)
        if len(cells) >= 8:
            def strip_html(val):
                val = re.sub(r'<[^>]*>', '', val)
                val = re.sub(r'\s+', ' ', val)
                return val.strip()
            reg_no = strip_html(cells[2])
            name = strip_html(cells[3])
            if reg_no.isdigit():
                entries.append((reg_no, name))
    return entries


def add_user_wizard(session, ip, wim_token, email, ftp_port):
    """Add address book entry using proven wizard flow."""
    username = email.split("@")[0]
    local_ip = get_best_local_ip(ip)
    base_url = f"http://{ip}"
    list_url = f"{base_url}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    wizard_get_url = f"http://{ip}/web/entry/en/address/adrsGetUserWizard.cgi"
    wizard_set_url = f"http://{ip}/web/entry/en/address/adrsSetUserWizard.cgi"

    def _post_step(data_str):
        resp = session.post(wizard_set_url, data=data_str, headers={
            "Referer": wizard_get_url,
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
        }, timeout=10)
        return resp.text

    log(f"FTP destination: ftp://{local_ip}:{ftp_port}/")

    # Load address list (establishes context + wimToken)
    log("Loading address list page...")
    resp = session.get(list_url, timeout=10)
    page_token = extract_wim_token(resp.text)
    if page_token:
        wim_token = page_token

    # 1. Parse existing entries to check for duplicate names and find vacant registration number
    existing_entries = parse_existing_entries(resp.text)
    
    # Check for duplicate name
    for reg, name in existing_entries:
        if name.lower() == username.lower():
            log("=" * 80)
            log(f"⚠️  [WARNING/DUPLICATE] The name '{username}' is ALREADY registered in the address book!")
            log(f"  Conflict details: Registration No: {reg}, Name: {name}")
            log("=" * 80)
            break

    # Find the first vacant registration number from 00001 to 99999
    registered_regs = {int(reg) for reg, _ in existing_entries}
    reg_no_int = 1
    while reg_no_int in registered_regs:
        reg_no_int += 1
    reg_no = str(reg_no_int).zfill(5)
    log(f"Auto-detected next vacant Registration No: {reg_no}")

    # Open wizard (preserve wimsesid - copier resets it to "--")
    log("Opening wizard...")
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
        log(f"  Wizard open failed: {e}")
    # Restore wimsesid if reset to "--"
    current = session.cookies.get("wimsesid", "")
    if (not current or current == "--") and saved_wimsesid and saved_wimsesid != "--":
        session.cookies.set("wimsesid", saved_wimsesid)
        log(f"  Restored wimsesid")

    # Wizard steps (URL-encoded POST)
    log(f"BASE: name={username}, reg={reg_no}")
    html = _post_step(f"mode=ADDUSER&step=BASE&wimToken={wim_token}&entryIndexIn={reg_no}&entryNameIn={username}&entryDisplayNameIn={username}&entryTagInfoIn=1&entryTagInfoIn=1&entryTagInfoIn=1&entryTagInfoIn=1&entryTypeIn=1")
    wim_token = extract_wim_token(html) or wim_token

    log(f"MAIL: email={email}")
    html = _post_step(f"mode=ADDUSER&step=MAIL&wimToken={wim_token}&mailAddressIn={email}")
    wim_token = extract_wim_token(html) or wim_token

    log(f"FOLDER: ftp://{local_ip}:{ftp_port}/")
    html = _post_step(f"mode=ADDUSER&step=FOLDER&wimToken={wim_token}&folderProtocolIn=FTP_O&folderPortNoIn={ftp_port}&folderServerNameIn={local_ip}&folderPathNameIn=/&folderAuthUserNameIn=&folderPasswordIn=&wk_folderPasswordIn=&folderPasswordConfirmIn=&wk_folderPasswordConfirmIn=")
    wim_token = extract_wim_token(html) or wim_token

    log("CONFIRM...")
    html = _post_step(f"mode=ADDUSER&step=CONFIRM&wimToken={wim_token}&stepListIn=BASE&stepListIn=MAIL&stepListIn=FOLDER")

    if "Session timed out" in html:
        log("FAILED: Session timed out during CONFIRM")
        return False, reg_no

    # Verify
    time.sleep(0.5)
    log("Verifying...")
    resp = session.get(list_url, timeout=10)
    found = username.lower() in resp.text.lower() or reg_no in resp.text
    if found:
        log(f"SUCCESS! '{username}' ({email}) added as #{reg_no}")
        return True, reg_no
    else:
        log(f"WARNING: Entry created (#{reg_no}) but could not verify")
        return False, reg_no


def find_vacant_ftp_port(start: int = 2121) -> int:
    """Find next available TCP port for FTP."""
    port = start
    while True:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('0.0.0.0', port))
                return port
        except Exception:
            pass
        port += 1


def delete_address_entry(session, ip: str, entry_ref: str) -> dict:
    """Delete address book entry by registration number or entry_id."""
    base_url = f"http://{ip}"
    list_url = f"{base_url}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    delete_url = f"{base_url}/web/entry/en/address/adrsDeleteEntries.cgi"

    resp = session.get(list_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    if not wim_token:
        raise RuntimeError("No wimToken from address list")

    entry_id = entry_ref
    if len(entry_ref) == 5 and entry_ref.isdigit():
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', resp.text, re.S)
        for row in rows:
            if f'<nobr>{entry_ref}</nobr>' in row:
                id_match = re.search(r'value="(\d+)"\s+name="entryIndex"', row)
                if id_match:
                    entry_id = id_match.group(1)
                    break

    resp = session.post(delete_url, data={
        "wimToken": wim_token,
        "entryIndex": f"{entry_id},",
        "entryIndexIn": f"{entry_id},",
        "regiNoListIn": entry_id,
        "selectedRegiNoIn": entry_id,
        "deleteListIn": entry_id,
    }, headers={"Referer": list_url, "Content-Type": "application/x-www-form-urlencoded"}, timeout=15)
    resp.raise_for_status()

    time.sleep(0.5)
    session.get(list_url, timeout=8)
    return {"ok": True, "deleted": entry_ref, "entry_id": entry_id}


if __name__ == "__main__":
    printer_ip = sys.argv[1] if len(sys.argv) > 1 else "192.168.1.226"
    email = sys.argv[2] if len(sys.argv) > 2 else "nbuu@gmail.com"
    ftp_port = int(sys.argv[3]) if len(sys.argv) > 3 else 2122
    admin_user = sys.argv[4] if len(sys.argv) > 4 else "admin"
    admin_pass = sys.argv[5] if len(sys.argv) > 5 else ""

    print("=" * 70)
    log(f"Target Copier IP  : {printer_ip}")
    log(f"Target Email      : {email}")
    log(f"Target FTP Port   : {ftp_port}")
    log(f"Admin Credentials : user={admin_user}, pass={'***' if admin_pass else '<empty>'}")
    print("=" * 70)

    session, wim_token = login_ricoh(printer_ip, admin_user, admin_pass)
    if session and wim_token:
        try:
            add_user_wizard(session, printer_ip, wim_token, email, ftp_port)
        except Exception as e:
            log(f"ERROR: {e}")
        finally:
            try:
                session.get(f"http://{printer_ip}/web/entry/en/websys/webArch/logout.cgi", timeout=2)
                log("Session closed.")
            except Exception:
                pass
    else:
        log("ERROR: Could not log in.")

    print("=" * 70)
