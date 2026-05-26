"""Fetch the wizard JS to understand AddUser() flow."""
import requests
import re
import base64
from urllib.parse import urljoin

ip = "192.168.1.226"
base_url = f"http://{ip}"
session = requests.Session()
session.headers.update({"User-Agent": "printer-agent/0.1"})
session.cookies.set("cookieOnOffChecker", "on")

# Login
try:
    session.get(urljoin(base_url, "/web/entry/en/websys/webArch/logout.cgi"), timeout=3)
except Exception:
    pass
session.cookies.set("cookieOnOffChecker", "on")

for path in ["/web/entry/en/websys/webArch/authForm.cgi"]:
    resp = session.get(urljoin(base_url, path), timeout=8)
    wim_token = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)', resp.text, re.I)
    wim_token = wim_token.group(1) if wim_token else ""
    referer = resp.url

data = {"userid": "admin", "username": "admin", "password": ""}
if wim_token:
    data["wimToken"] = wim_token
resp = session.post(urljoin(base_url, "/web/entry/en/websys/webArch/login.cgi"), data=data, headers={"Referer": referer}, timeout=8)

# Fetch the wizard JavaScript
print("Fetching adrsUserWizard.xjs...")
resp = session.get(f"{base_url}/web/entry/en/address/adrsUserWizard.xjs", timeout=10)
print(f"Status: {resp.status_code}, Length: {len(resp.text)}")
with open("debug_wizard_js.txt", "w", encoding="utf-8") as f:
    f.write(resp.text)
print("Saved to debug_wizard_js.txt")

# Also fetch adrsBase.xjs
print("\nFetching adrsBase.xjs...")
resp = session.get(f"{base_url}/web/entry/en/address/adrsBase.xjs", timeout=10)
print(f"Status: {resp.status_code}, Length: {len(resp.text)}")
with open("debug_base_js.txt", "w", encoding="utf-8") as f:
    f.write(resp.text)
print("Saved to debug_base_js.txt")

# Show key functions
print("\n--- Key functions in wizard JS ---")
text = open("debug_wizard_js.txt").read()
# Find AddUser function
match = re.search(r'function\s+AddUser\s*\([^)]*\)\s*\{[^}]+\}', text, re.S)
if match:
    print(f"AddUser(): {match.group(0)[:500]}")
else:
    # Try broader search
    idx = text.find("AddUser")
    if idx >= 0:
        print(f"AddUser context: {text[max(0,idx-50):idx+300]}")

# Find wizard submit/set URL
for pattern in ["adrsSetUser", "adrsGetUser", "wizardSubmit", "wizardPost", "ajaxPost"]:
    matches = [(m.start(), text[max(0,m.start()-30):m.start()+100]) for m in re.finditer(pattern, text, re.I)]
    if matches:
        print(f"\n'{pattern}' found {len(matches)} times:")
        for pos, ctx in matches[:3]:
            print(f"  ...{ctx.strip()}...")
