def extract_wim_token(html: str) -> str:
    if not html: return ""
    m = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'name\s*=\s*["\']?wimToken["\']?[^>]*?value\s*=\s*["\']?([^"\'\s>]+)["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    m = re.search(r'value\s*=\s*["\']?([^"\'\s>]+)["\'].*?name\s*=\s*["\']?wimToken["\']?', html, re.IGNORECASE)
    if m and m.group(1): return m.group(1)
    return ""

def logout(session: requests.Session):
    print("[*] Đang đăng xuất để giải phóng phiên (Tránh lỗi đầy Session)...")
    try:
        session.get(f"{BASE_URL}/web/entry/en/websys/webArch/logout.cgi", timeout=5)
        session.get(f"{BASE_URL}/web/guest/en/websys/webArch/logout.cgi", timeout=5)
        session.cookies.clear()
    except:
        pass

def login() -> requests.Session:
    session = requests.Session()
    print(f"[*] Đang lấy form đăng nhập từ {IP}...")
    form_url = f"{BASE_URL}/web/guest/en/websys/webArch/authForm.cgi"
    resp = session.get(form_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    
    login_url = f"{BASE_URL}/web/guest/en/websys/webArch/login.cgi"
    encoded_user = base64.b64encode(USER.encode()).decode()
    encoded_pass = base64.b64encode(PASSWORD.encode()).decode()
    
    data = {
        "userid": encoded_user,
        "username": encoded_user,
        "password": encoded_pass,
        "wimToken": wim_token,
        "open": "websys/webArch/authForm.cgi"
    }
    print("[*] Đang gửi thông tin đăng nhập...")
    r_login = session.post(login_url, data=data, headers={"Referer": form_url}, timeout=10)
    if "Authentication has failed" in r_login.text or "not correct" in r_login.text:
        print(f"  [!] WIM Login HTTP Status: {r_login.status_code}")
        print(f"  [!] WIM Login Response Snippet: {r_login.text[:400].strip()}")
        raise RuntimeError("Authentication failed: ng nhp Ricoh WIM tht bi (Sai ti khon hoc mt khu)!")
    return session