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
    print(f"[*] Đang khởi tạo phiên làm việc với Ricoh WIM IP: {IP}...")
    
    # Bước 1: Thử truy cập danh bạ trực tiếp (Dành cho máy Ricoh tắt xác thực hoặc Mật khẩu rỗng/Guest)
    try:
        direct_list_url = f"{BASE_URL}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
        r_direct = session.get(direct_list_url, timeout=5)
        direct_html = r_direct.text or ""
        token_direct = extract_wim_token(direct_html)
        if token_direct and "authForm.cgi" not in direct_html and "modeIn=login" not in direct_html:
            print("  [✓] Đăng nhập thành công qua chế độ Khách (Guest / Unauthenticated WIM Mode)!")
            return session
    except Exception:
        pass

    # Bước 2: Đăng nhập Administrator WIM chuẩn bằng POST credentials
    print(f"[*] Đang lấy form đăng nhập Admin từ {IP}...")
    form_url = f"{BASE_URL}/web/guest/en/websys/webArch/authForm.cgi"
    resp = session.get(form_url, timeout=10)
    wim_token = extract_wim_token(resp.text)
    
    login_url = f"{BASE_URL}/web/guest/en/websys/webArch/login.cgi"
    encoded_user = base64.b64encode(USER.encode()).decode() if USER else ""
    encoded_pass = base64.b64encode(PASSWORD.encode()).decode() if PASSWORD else ""
    
    data = {
        "userid": encoded_user,
        "username": encoded_user,
        "password": encoded_pass,
        "wimToken": wim_token,
        "open": "websys/webArch/authForm.cgi"
    }
    print("[*] Đang gửi thông tin đăng nhập Administrator...")
    r_login = session.post(login_url, data=data, headers={"Referer": form_url}, timeout=10)
    
    r_text = r_login.text or ""
    fail_keywords = ["Authentication has failed", "not correct", "loginFailed", "Authentication failed", "Login failed"]
    if any(kw.lower() in r_text.lower() for kw in fail_keywords):
        print(f"  [!] WIM Login HTTP Status: {r_login.status_code}")
        print(f"  [!] WIM Login Response Snippet: {r_text[:300].strip()}")
        raise RuntimeError(f"Authentication failed: Đăng nhập Ricoh WIM thất bại (IP={IP}, User={USER}). Sai tài khoản hoặc mật khẩu!")
    
    verify_url = f"{BASE_URL}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"
    verify_resp = session.get(verify_url, timeout=10)
    v_text = verify_resp.text or ""
    wim_tok_verify = extract_wim_token(v_text)
    
    if wim_tok_verify and "modeIn=login" not in v_text and ("authForm.cgi" not in v_text or "modeIn=LIST_ALL" in v_text):
        print("  [✓] Đăng nhập Administrator WIM thành công!")
        return session

    raise RuntimeError(f"Authentication failed: Đăng nhập Ricoh WIM thất bại (IP={IP}, User={USER}). Sai tài khoản hoặc mật khẩu!")