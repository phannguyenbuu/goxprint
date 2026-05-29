"""
Standalone Ricoh Address Book User Creation script.
Creates a user with an email and FTP destination.

Usage:
  python test_add_user.py [IP] [EMAIL] [FTP_PORT] [ADMIN_USER] [ADMIN_PASS]

Example:
  python test_add_user.py 192.168.1.126 nbuu@gmail.com 2122 admin ""
"""
import sys
import re
import time
import socket
import base64
import requests
from urllib.parse import urljoin, urlparse

def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}")

def get_local_ip_candidates():
    """Detects local IP addresses of this machine."""
    candidates = []
    
    # 1. Standard hostname lookup
    try:
        hostname = socket.gethostname()
        host_info = socket.gethostbyname_ex(hostname)
        for ip in host_info[2]:
            if ip and ip != "127.0.0.1" and ip not in candidates:
                candidates.append(ip)
    except Exception:
        pass

    # 2. UDP socket connection probe (highly reliable)
    for probe_ip in ("8.8.8.8", "1.1.1.1", "192.168.1.1"):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
                sock.connect((probe_ip, 80))
                ip = sock.getsockname()[0]
                if ip and ip != "127.0.0.1" and ip not in candidates:
                    candidates.append(ip)
        except Exception:
            continue

    return candidates

def get_best_local_ip(printer_ip):
    """Finds the best local IP, preferably on the same subnet as the printer."""
    candidates = get_local_ip_candidates()
    if not candidates:
        return "127.0.0.1"
        
    # Try to find one in the same subnet (first 3 octets)
    printer_prefix = ".".join(printer_ip.split(".")[:3])
    for ip in candidates:
        if ".".join(ip.split(".")[:3]) == printer_prefix:
            return ip
            
    # Fallback to first candidate
    return candidates[0]

def extract_wim_token(html):
    """Extracts CSRF wimToken from raw HTML."""
    match = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)["\']?', html, re.IGNORECASE)
    if match:
        return match.group(1)
    match = re.search(r'name\s*=\s*["\']?wimToken["\']?\s+value\s*=\s*["\']?([^"\'\s>]+)["\']?', html, re.IGNORECASE)
    if match:
        return match.group(1)
    match = re.search(r'value\s*=\s*["\']?([^"\'\s>]+)["\']?\s+name\s*=\s*["\']?wimToken["\']?', html, re.IGNORECASE)
    return match.group(1) if match else ""

def extract_hidden_inputs(html):
    """Extracts all hidden inputs from raw HTML."""
    fields = {}
    for match in re.finditer(r'<input\s+[^>]*?type\s*=\s*["\']?hidden["\']?[^>]*?>', html, re.IGNORECASE | re.DOTALL):
        tag = match.group(0)
        name_m = re.search(r'name\s*=\s*["\']?([^"\'\s>]+)["\']?', tag, re.IGNORECASE)
        value_m = re.search(r'value\s*=\s*["\']?([^"\'\s>]*)["\']?', tag, re.IGNORECASE)
        if name_m:
            fields[name_m.group(1)] = value_m.group(1) if value_m else ""
    return fields

def verify_session(session, ip):
    """Verifies if the current session is logged in."""
    test_url = f"http://{ip}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    try:
        resp = session.get(test_url, timeout=5)
        text_lower = resp.text.lower()
        bad = ["authform.cgi", "login.cgi", "login user name", "session timed out"]
        if resp.status_code == 200 and not any(ind in text_lower for ind in bad):
            return True
    except Exception:
        pass
    return False

def parse_javascript_array_fields(data: str) -> list[str]:
    fields = []
    current = []
    in_quotes = False
    quote_char = ""
    escaped = False
    for char in data:
        if escaped:
            current.append(char)
            escaped = False
            continue
        if char == "\\":
            current.append(char)
            escaped = True
            continue
        if char in {"'", '"'}:
            if not in_quotes:
                in_quotes = True
                quote_char = char
            elif char == quote_char:
                in_quotes = False
            else:
                current.append(char)
            continue
        if char == "," and not in_quotes:
            fields.append("".join(current).strip())
            current = []
        else:
            current.append(char)
    if current:
        fields.append("".join(current).strip())
    return fields

def parse_ajax_address_list(data: str) -> list[dict]:
    entries = []
    raw = data.strip()
    if not raw:
        return entries
    first = raw.find("[")
    last = raw.rfind("]")
    if first < 0 or last <= first:
        return entries
    raw_data = raw[first : last + 1]
    raw_entries = re.findall(r"\[([^\]]+)\]", raw_data)
    for row in raw_entries:
        fields = parse_javascript_array_fields(row)
        if len(fields) < 8:
            continue
        entries.append({
            "reg_no": fields[2].strip("'\""),
            "name": fields[3].strip("'\""),
            "folder": fields[7].strip("'\"")
        })
    return entries

def parse_html_address_list(html: str) -> list[dict]:
    entries = []
    tbody_match = re.search(r'<tbody id="ReportListArea_TableBody">(.*?)</tbody>', html, re.S)
    if not tbody_match:
        return entries
    
    def strip_html(val: str) -> str:
        text = re.sub(r"<[^>]*>", "", val)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    rows = re.findall(r"<tr(?:\s+[^>]*)?>(?:\s*<td[^>]*>.*?</td>\s*){7,}</tr>", tbody_match.group(1), re.S)
    for row in rows:
        if "reportListDummyRow" in row:
            continue
        cells = re.findall(r"<td[^>]*>(.*?)</td>", row, re.S)
        if len(cells) < 8:
            continue
        entry = {
            "reg_no": strip_html(cells[2]),
            "name": strip_html(cells[3]),
            "folder": strip_html(cells[7])
        }
        if entry["name"] and entry["name"] != "-" and entry["reg_no"]:
            entries.append(entry)
    return entries

def get_next_registration_no(session, ip, wim_token):
    """Calculates the next available registration number."""
    log("Checking existing Address Book to find next registration number...")
    highest = 0
    
    # 1. Try AJAX
    ajax_url = f"http://{ip}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}"
    try:
        resp = session.get(ajax_url, timeout=5)
        if resp.status_code == 200 and "[" in resp.text:
            entries = parse_ajax_address_list(resp.text)
            for e in entries:
                reg_digits = re.sub(r"\D", "", e["reg_no"])
                highest = max(highest, int(reg_digits) if reg_digits else 0)
    except Exception:
        pass
        
    # 2. Try HTML Fallback
    if highest == 0:
        html_url = f"http://{ip}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
        try:
            resp = session.get(html_url, timeout=5)
            if resp.status_code == 200:
                entries = parse_html_address_list(resp.text)
                for e in entries:
                    reg_digits = re.sub(r"\D", "", e["reg_no"])
                    highest = max(highest, int(reg_digits) if reg_digits else 0)
        except Exception:
            pass

    next_no = highest + 1
    log(f"  Highest registration number found: {highest}. Next will be: {next_no:05d}")
    return f"{next_no:05d}"

def login_ricoh(ip, user, password):
    """Logs into the Ricoh copier and returns the session and wimToken."""
    base_url = f"http://{ip}"
    session = requests.Session()
    session.headers.update({"User-Agent": "printer-agent/0.1"})
    session.cookies.set("cookieOnOffChecker", "on")

    log(f"Resetting potential stale web sessions on copier...")
    for path in ["/web/entry/en/websys/webArch/logout.cgi", "/web/guest/en/websys/webArch/logout.cgi"]:
        try:
            session.get(urljoin(base_url, path), timeout=3)
        except Exception:
            pass
    session.cookies.clear()

    # 1. GET authForm.cgi
    form_path = "/web/entry/en/websys/webArch/authForm.cgi"
    log(f"GET {form_path}")
    try:
        url = urljoin(base_url, form_path)
        resp = session.get(url, timeout=5)
        html = resp.text
        
        # JS redirect detection
        if "document.form1.submit()" in html or "name='form1'" in html or 'name="form1"' in html:
            log("  JS Redirect form detected. Following post redirect...")
            hidden = extract_hidden_inputs(html)
            action_m = re.search(r'action\s*=\s*["\']([^"\']+)["\']', html, re.IGNORECASE)
            if action_m:
                redirect_url = urljoin(resp.url, action_m.group(1))
                resp = session.post(redirect_url, data=hidden, timeout=5)
                html = resp.text

        wim_token = extract_wim_token(html)
        referer_url = resp.url
        log(f"  wimToken extracted: {wim_token or 'NONE'}")
    except Exception as e:
        log(f"  Failed to load login form: {e}")
        return None, ""

    if not wim_token:
        log("ERROR: wimToken not found.")
        return None, ""

    # 2. Sequential POST Login Strategies
    encoded_user = base64.b64encode(user.encode()).decode()
    encoded_pass = base64.b64encode(password.encode()).decode()

    strategies = [
        {
            "name": "Plain Text (entry)",
            "path": "/web/entry/en/websys/webArch/login.cgi",
            "data": {"userid": user, "username": user, "password": password, "wimToken": wim_token}
        },
        {
            "name": "Plain Text (guest)",
            "path": "/web/guest/en/websys/webArch/login.cgi",
            "data": {"userid": user, "username": user, "password": password, "wimToken": wim_token, "open": "websys/webArch/authForm.cgi"}
        },
        {
            "name": "Base64 (guest)",
            "path": "/web/guest/en/websys/webArch/login.cgi",
            "data": {"userid": encoded_user, "username": encoded_user, "password": encoded_pass, "wimToken": wim_token, "open": "websys/webArch/authForm.cgi"}
        }
    ]

    for strategy in strategies:
        log(f"Attempting login strategy: {strategy['name']}")
        try:
            post_url = urljoin(base_url, strategy["path"])
            resp = session.post(post_url, data=strategy["data"], headers={"Referer": referer_url}, timeout=5)
            
            wim_session = session.cookies.get("wimsesid", "")
            real_session = bool(wim_session) and wim_session != "--"
            
            is_login_failed = "Login User Name" in resp.text or "Login Password" in resp.text
            
            if resp.status_code == 200 and not is_login_failed and real_session:
                log("  Verifying session...")
                if verify_session(session, ip):
                    log("  [SUCCESS] Logged in successfully!")
                    return session, wim_token
        except Exception as e:
            log(f"  Strategy failed: {e}")
            continue

    log("ERROR: All login strategies failed.")
    return None, ""

def post_wizard_step(session, ip, items, referer=""):
    """Submits a single step to the wizard."""
    url = f"http://{ip}/web/entry/en/address/adrsSetUserWizard.cgi"
    headers = {
        "Referer": referer or f"http://{ip}/web/entry/en/address/adrsGetUserWizard.cgi"
    }
    multipart = [(key, (None, str(value))) for key, value in items]
    resp = session.post(url, files=multipart, headers=headers, timeout=10)
    resp.raise_for_status()
    return resp.text

def add_user_wizard(session, ip, wim_token, email, ftp_port):
    """Drives the multi-step user creation wizard."""
    username = email.split("@")[0] # Extract "nbuu" from "nbuu@gmail.com"
    local_ip = get_best_local_ip(ip)
    
    log(f"FTP destination will be: ftp://{local_ip}:{ftp_port}/")

    # Step 0: Open Wizard & Get initial Token
    log("Opening user wizard...")
    open_url = f"http://{ip}/web/entry/en/address/adrsGetUserWizard.cgi"
    open_payload = [
        ("mode", "ADDUSER"),
        ("outputSpecifyModeIn", "DEFAULT"),
    ]
    multipart_open = [(k, (None, str(v))) for k, v in open_payload]
    resp = session.post(
        open_url, 
        files=multipart_open, 
        headers={"Referer": f"http://{ip}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"},
        timeout=10
    )
    resp.raise_for_status()
    wim_token = extract_wim_token(resp.text) or wim_token
    log(f"  Wizard opened. Current wimToken: {wim_token[:8]}...")

    # Calculate next registration number
    reg_no = get_next_registration_no(session, ip, wim_token)

    # Step 1: BASE Step (Name & Display Name)
    log(f"Step 1: Submitting BASE step for User '{username}' (Reg No: {reg_no})...")
    base_items = [
        ("mode", "ADDUSER"),
        ("step", "BASE"),
        ("wimToken", wim_token),
        ("entryIndexIn", reg_no),
        ("entryNameIn", username),
        ("entryDisplayNameIn", username),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1"),
        ("entryTagInfoIn", "1"),
        ("entryTypeIn", "1"),  # 1 = User
    ]
    html = post_wizard_step(session, ip, base_items)
    wim_token = extract_wim_token(html) or wim_token
    log(f"  BASE step complete. Current wimToken: {wim_token[:8]}...")

    # Step 2: MAIL Step (Email Address)
    log(f"Step 2: Submitting MAIL step for Email '{email}'...")
    mail_items = [
        ("mode", "ADDUSER"),
        ("step", "MAIL"),
        ("wimToken", wim_token),
        ("mailAddressIn", email),
    ]
    html = post_wizard_step(session, ip, mail_items)
    wim_token = extract_wim_token(html) or wim_token
    log(f"  MAIL step complete. Current wimToken: {wim_token[:8]}...")

    # Step 3: FOLDER Step (FTP Cài đặt)
    log(f"Step 3: Submitting FOLDER step with FTP Protocol -> host={local_ip}, port={ftp_port}...")
    folder_items = [
        ("mode", "ADDUSER"),
        ("step", "FOLDER"),
        ("wimToken", wim_token),
        ("folderProtocolIn", "FTP_O"),
        ("folderPortNoIn", str(ftp_port)),
        ("folderServerNameIn", local_ip),
        ("folderPathNameIn", "/"),
        ("folderAuthUserNameIn", ""),
        ("wk_folderPasswordIn", ""),
        ("folderPasswordIn", ""),
        ("wk_folderPasswordConfirmIn", ""),
        ("folderPasswordConfirmIn", ""),
    ]
    html = post_wizard_step(session, ip, folder_items)
    wim_token = extract_wim_token(html) or wim_token
    log(f"  FOLDER step complete. Current wimToken: {wim_token[:8]}...")

    # Step 4: CONFIRM Step (Xác nhận lưu lại)
    log("Step 4: Submitting CONFIRM step to save user...")
    confirm_items = [
        ("wimToken", wim_token),
        ("stepListIn", "BASE"),
        ("stepListIn", "MAIL"),
        ("stepListIn", "FOLDER"),
        ("mode", "ADDUSER"),
        ("step", "CONFIRM"),
    ]
    html = post_wizard_step(session, ip, confirm_items)
    log("  CONFIRM step submitted.")

    # Step 5: Verification
    time.sleep(0.5)
    log("Step 5: Verifying if user was created successfully in Address Book...")
    ajax_url = f"http://{ip}/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}"
    verified = False
    try:
        resp = session.get(ajax_url, timeout=5)
        if resp.status_code == 200 and "[" in resp.text:
            entries = parse_ajax_address_list(resp.text)
            for e in entries:
                if e["reg_no"] == reg_no or e["name"] == username:
                    verified = True
                    log(f"  [SUCCESS] Verified! Entry found in Address Book: Reg No {e['reg_no']}, Name: {e['name']}, Folder: {e['folder']}")
                    break
    except Exception:
        pass

    if not verified:
        # Try HTML parsing verify
        try:
            html_url = f"http://{ip}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
            resp = session.get(html_url, timeout=5)
            entries = parse_html_address_list(resp.text)
            for e in entries:
                if e["reg_no"] == reg_no or e["name"] == username:
                    verified = True
                    log(f"  [SUCCESS] Verified via HTML! Entry found in Address Book: Reg No {e['reg_no']}, Name: {e['name']}, Folder: {e['folder']}")
                    break
        except Exception:
            pass

    if verified:
        log("🎉 USER CREATION WIZARD COMPLETED SUCCESSFULLY!")
        return True
    else:
        log("⚠️ WARNING: User might have been created, but verification failed.")
        return False

if __name__ == "__main__":
    printer_ip = sys.argv[1] if len(sys.argv) > 1 else "192.168.1.126"
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

    # 1. Login
    session, wim_token = login_ricoh(printer_ip, admin_user, admin_pass)
    
    if session and wim_token:
        try:
            # 2. Run Wizard
            add_user_wizard(session, printer_ip, wim_token, email, ftp_port)
        except Exception as e:
            log(f"ERROR executing wizard: {e}")
        finally:
            # Clean up session
            try:
                session.get(f"http://{printer_ip}/web/entry/en/websys/webArch/logout.cgi", timeout=2)
                log("Session closed.")
            except Exception:
                pass
    else:
        log("ERROR: Could not log in. Aborting wizard execution.")
        
    print("=" * 70)
