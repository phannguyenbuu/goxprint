import requests
from urllib.parse import urljoin
import re

ip = "192.168.1.226"
base_url = f"http://{ip}"

def test_login(user, password):
    print(f"\nAttempting login with: user={user}, pass={password}")
    session = requests.Session()
    session.headers.update({"User-Agent": "printer-agent/0.1"})
    session.cookies.set("cookieOnOffChecker", "on")
    
    # 1. Get authForm to fetch wimToken
    try:
        resp = session.get(urljoin(base_url, "/web/entry/en/websys/webArch/authForm.cgi"), timeout=5)
        wim_token = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)', resp.text, re.I)
        wim_token = wim_token.group(1) if wim_token else ""
        referer = resp.url
    except Exception as e:
        print(f"Failed to load authForm: {e}")
        return False

    # 2. Post login
    data = {"userid": user, "username": user, "password": password}
    if wim_token:
        data["wimToken"] = wim_token
        
    try:
        resp = session.post(urljoin(base_url, "/web/entry/en/websys/webArch/login.cgi"), data=data, headers={"Referer": referer}, timeout=5)
        wim_session = session.cookies.get("wimsesid", "")
        real_session = bool(wim_session) and wim_session != "--"
        
        # Fetch a strictly admin-only page to confirm admin auth
        admin_url = urljoin(base_url, "/web/entry/en/websys/easySecurity/getEasySecurity.cgi")
        admin_resp = session.get(admin_url, timeout=5)
        is_admin = admin_resp.status_code == 200 and "Login" not in admin_resp.text and "authForm.cgi" not in admin_resp.text
        
        # Also check if Logout is present in adrsList
        list_resp = session.get(urljoin(base_url, "/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL"), timeout=5)
        has_logout = "logout.cgi" in list_resp.text.lower()
        
        print(f"WimSession: {wim_session} (Valid: {real_session})")
        print(f"Admin Page Status: {admin_resp.status_code} (Admin Confirmed: {is_admin})")
        print(f"Address List Has Logout: {has_logout}")
        
        return is_admin
    except Exception as e:
        print(f"Error during login: {e}")
        return False

# Try common default passwords
for pw in ["", "admin", "1234", "12345"]:
    if test_login("admin", pw):
        print(f"\n🎉 SUCCESS! The correct admin password is: '{pw}'")
        break
else:
    print("\n❌ All default passwords failed to authenticate as ADMIN.")
