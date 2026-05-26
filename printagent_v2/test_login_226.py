"""
Standalone Ricoh form-based login test with timing & Address Book extraction.
Usage: python test_login_226.py [IP] [USER] [PASSWORD]
"""
import sys
import re
import time
import requests
import base64
from urllib.parse import urljoin


def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}")


def extract_wim_token(html):
    match = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)["\']?', html, re.IGNORECASE)
    if match:
        return match.group(1)
    match = re.search(r'name\s*=\s*["\']?wimToken["\']?\s+value\s*=\s*["\']?([^"\'\s>]+)["\']?', html, re.IGNORECASE)
    if match:
        return match.group(1)
    match = re.search(r'value\s*=\s*["\']?([^"\'\s>]+)["\']?\s+name\s*=\s*["\']?wimToken["\']?', html, re.IGNORECASE)
    return match.group(1) if match else ""


def extract_hidden_inputs(html):
    fields = {}
    for match in re.finditer(r'<input\s+[^>]*?type\s*=\s*["\']?hidden["\']?[^>]*?>', html, re.IGNORECASE | re.DOTALL):
        tag = match.group(0)
        name_m = re.search(r'name\s*=\s*["\']?([^"\'\s>]+)["\']?', tag, re.IGNORECASE)
        value_m = re.search(r'value\s*=\s*["\']?([^"\'\s>]*)["\']?', tag, re.IGNORECASE)
        if name_m:
            fields[name_m.group(1)] = value_m.group(1) if value_m else ""
    return fields


def verify_session(session, ip):
    test_url = urljoin(f"http://{ip}", "/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL")
    try:
        resp = session.get(test_url, timeout=10)
        text_lower = resp.text.lower()
        bad = ["authform.cgi", "login.cgi", "login user name",
               "message.cgi", "cookieoff", "session timed out", "privilege"]
        is_login_page = any(ind in text_lower for ind in bad)
        if resp.status_code == 200 and not is_login_page:
            return True
    except Exception as e:
        log(f"  Verify failed: {e}")
    return False


# ----------------- PARSING & LISTING LOGIC (LIST_ALL) -----------------

def parse_javascript_array_fields(data: str) -> list[str]:
    """Helper to parse a raw JS array row, preserving quotes."""
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
    """Parses AJAX response data into structured dicts."""
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
        type_map = {"1": "User", "2": "Group"}
        entry = {
            "type": type_map.get(fields[1], f"Type_{fields[1]}"),
            "reg_no": fields[2].strip("'\""),
            "name": fields[3].strip("'\""),
            "user_code": fields[4].strip("'\""),
            "email": fields[6].strip("'\""),
            "folder": fields[7].strip("'\"")
        }
        entries.append(entry)
    return entries


def parse_html_address_list(html: str) -> list[dict]:
    """Fallback parser using regex to extract values from raw HTML Table."""
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
            "type": strip_html(cells[1]),
            "reg_no": strip_html(cells[2]),
            "name": strip_html(cells[3]),
            "user_code": strip_html(cells[4]),
            "email": strip_html(cells[6]),
            "folder": strip_html(cells[7])
        }
        if entry["name"] and entry["name"] != "-" and entry["reg_no"]:
            entries.append(entry)
    return entries


def list_all(session: requests.Session, ip: str, wim_token: str) -> list[dict]:
    """
    Attempts to fetch all Address Book entries from the Ricoh Copier.
    Tries the optimized AJAX endpoint first, falls back to raw HTML scraping.
    """
    log("4. Fetching Address Book entries from copier...")
    base_url = f"http://{ip}"
    
    # Thử gọi API AJAX tối ưu
    ajax_urls = [
        f"/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}",
        "/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1",
        f"/web/guest/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={wim_token}",
    ]
    
    entries = []
    for path in ajax_urls:
        url = urljoin(base_url, path)
        try:
            resp = session.get(url, timeout=10)
            if resp.status_code == 200 and "[" in resp.text and "]" in resp.text and "login.cgi" not in resp.text:
                entries = parse_ajax_address_list(resp.text)
                if entries:
                    log(f"  [Success] Retrieved {len(entries)} entries via AJAX ({path})!")
                    break
        except Exception:
            continue
            
    # Dự phòng: Cào dữ liệu từ bảng HTML nếu AJAX không hoạt động
    if not entries:
        log("  [Fallback] AJAX failed or returned empty. Fetching HTML Address Book table...")
        html_urls = [
            "/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL",
            "/web/guest/en/address/adrsList.cgi?modeIn=LIST_ALL",
        ]
        for path in html_urls:
            url = urljoin(base_url, path)
            try:
                resp = session.get(url, timeout=10)
                if resp.status_code == 200:
                    entries = parse_html_address_list(resp.text)
                    if entries:
                        log(f"  [Success] Retrieved {len(entries)} entries via HTML Table parsing!")
                        break
            except Exception:
                continue
                
    # In danh sách danh bạ ra màn hình console an toàn dạng bảng
    if not entries:
        print("\nAddress Book is EMPTY or could not be parsed.")
    else:
        print("\n" + "=" * 100)
        print(f"{'REG NO':<8} | {'NAME':<20} | {'USER CODE':<10} | {'TYPE':<8} | {'EMAIL ADDRESS':<30} | {'FTP FOLDER PATH'}")
        print("-" * 100)
        for e in entries:
            print(f"{e['reg_no']:<8} | {e['name']:<20} | {e['user_code']:<10} | {e['type']:<8} | {e['email']:<30} | {e['folder']}")
        print("=" * 100 + "\n")
        
    return entries


# ----------------- MAIN LOGIN FUNCTION (RICOH LOGIN) -----------------

def login_ricoh(ip, user, password):
    total_start = time.perf_counter()
    base_url = f"http://{ip}"
    session = requests.Session()
    session.headers.update({"User-Agent": "printer-agent/0.1"})
    session.cookies.set("cookieOnOffChecker", "on")

    log(f"Target: {ip}, user={user}, pass={'***' if password else '<empty>'}")

    # 1. GET login form and handle intermediate JS redirect
    form_path = "/web/entry/en/websys/webArch/authForm.cgi"
    wim_token = ""
    referer_url = ""

    log(f"GET {form_path}")
    t0 = time.perf_counter()
    try:
        url = urljoin(base_url, form_path)
        resp = session.get(url, timeout=8)
        elapsed = time.perf_counter() - t0
        log(f"  -> {resp.status_code} ({elapsed:.2f}s)")
        
        html_content = resp.text
        # Handle JS intermediate redirect if present
        if "document.form1.submit()" in html_content or "name='form1'" in html_content or 'name="form1"' in html_content:
            log("[JS Redirect] Intermediate redirect form detected. Following POST redirect...")
            hidden = extract_hidden_inputs(html_content)
            action_match = re.search(r'action\s*=\s*["\']([^"\']+)["\']', html_content, re.IGNORECASE)
            if action_match:
                redirect_url = urljoin(resp.url, action_match.group(1))
                log(f"  POST Redirect {action_match.group(1)}")
                t_redir = time.perf_counter()
                resp = session.post(redirect_url, data=hidden, timeout=8)
                elapsed_redir = time.perf_counter() - t_redir
                log(f"    -> {resp.status_code} ({elapsed_redir:.2f}s)")
                html_content = resp.text
                
        wim_token = extract_wim_token(html_content)
        referer_url = resp.url
        log(f"  wimToken: {wim_token or 'NOT FOUND'}")
    except Exception as e:
        elapsed = time.perf_counter() - t0
        log(f"  Failed ({elapsed:.2f}s): {e}")

    if not referer_url or not wim_token:
        total = time.perf_counter() - total_start
        log(f"ERROR: Could not load login form. Total: {total:.2f}s")
        return session, False, ""

    # 2. POST login (Sequential strategies including Base64 support)
    encoded_user = base64.b64encode(user.encode()).decode()
    encoded_pass = base64.b64encode(password.encode()).decode()

    strategies = [
        # Strategy A: Plain Text to standard cgi (đối với các dòng máy Ricoh đời cũ)
        {
            "name": "Plain Text (entry)",
            "path": "/web/entry/en/websys/webArch/login.cgi",
            "data": {
                "userid": user,
                "username": user,
                "password": password,
                "wimToken": wim_token
            }
        },
        # Strategy B: Base64 to guest cgi (đối với dòng Ricoh đời mới bảo mật cao)
        {
            "name": "Base64 (guest)",
            "path": "/web/guest/en/websys/webArch/login.cgi",
            "data": {
                "userid": encoded_user,
                "username": encoded_user,
                "password": encoded_pass,
                "wimToken": wim_token,
                "open": "websys/webArch/authForm.cgi"
            }
        }
    ]

    for strategy in strategies:
        post_url = urljoin(base_url, strategy["path"])
        log(f"POST {strategy['path']} using {strategy['name']} Strategy")
        
        t0 = time.perf_counter()
        try:
            resp = session.post(post_url, data=strategy["data"], headers={"Referer": referer_url}, timeout=8)
            elapsed = time.perf_counter() - t0
            log(f"  -> {resp.status_code} ({elapsed:.2f}s)")
        except Exception as e:
            elapsed = time.perf_counter() - t0
            log(f"  Failed ({elapsed:.2f}s): {e}")
            continue

        wim_session = session.cookies.get("wimsesid", "")
        real_session = bool(wim_session) and wim_session != "--"
        log(f"  wimsesid: {wim_session or 'NONE'}, valid: {real_session}")

        is_login = "Login User Name" in resp.text or "Login Password" in resp.text
        is_form = "authForm.cgi" in resp.text and ('name="userid"' in resp.text or 'name="username"' in resp.text)

        if resp.status_code == 200 and not is_login and not is_form and real_session:
            log("VERIFY session...")
            t0 = time.perf_counter()
            ok = verify_session(session, ip)
            elapsed = time.perf_counter() - t0
            log(f"  -> {'OK' if ok else 'FAILED'} ({elapsed:.2f}s)")
            if ok:
                total = time.perf_counter() - total_start
                log(f"LOGIN SUCCESSFUL! Total: {total:.2f}s")
                return session, True, wim_token
        else:
            log(f"  Rejected: is_login={is_login}, is_form={is_form}, real_session={real_session}")

    total = time.perf_counter() - total_start
    log(f"LOGIN FAILED. Total: {total:.2f}s")
    return session, False, ""


if __name__ == "__main__":
    ip = sys.argv[1] if len(sys.argv) > 1 else "192.168.1.226"
    user = sys.argv[2] if len(sys.argv) > 2 else "admin"
    pw = sys.argv[3] if len(sys.argv) > 3 else ""

    print("=" * 60)
    session, ok, wim_token = login_ricoh(ip, user, pw)
    
    if ok:
        try:
            list_all(session, ip, wim_token)
        except Exception as e:
            log(f"Failed to fetch Address Book: {e}")
            
    print("=" * 60)
    status = "SUCCESS (OK)" if ok else "FAILED (ERROR)"
    print(f"RESULT: {status}")
