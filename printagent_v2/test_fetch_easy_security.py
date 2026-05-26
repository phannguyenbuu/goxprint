"""Fetch the Easy Security page to understand the Add User form."""
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
print("Logging in...")
try:
    session.get(urljoin(base_url, "/web/entry/en/websys/webArch/logout.cgi"), timeout=3)
except Exception:
    pass
session.cookies.set("cookieOnOffChecker", "on")

for form_path in ["/web/entry/en/websys/webArch/authForm.cgi", "/web/guest/en/websys/webArch/authForm.cgi"]:
    try:
        resp = session.get(urljoin(base_url, form_path), timeout=8)
        if resp.status_code == 200:
            match = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)', resp.text, re.I)
            wim_token = match.group(1) if match else ""
            referer = resp.url
            break
    except Exception:
        continue

data = {"userid": "admin", "username": "admin", "password": ""}
if wim_token:
    data["wimToken"] = wim_token
for path in ["/web/entry/en/websys/webArch/login.cgi", "/web/guest/en/websys/webArch/login.cgi"]:
    try:
        resp = session.post(urljoin(base_url, path), data=data, headers={"Referer": referer}, timeout=8)
        wim_session = session.cookies.get("wimsesid", "")
        if wim_session and wim_session != "--" and "Login User Name" not in resp.text:
            print(f"Login OK via {path}")
            break
    except Exception:
        continue

# Fetch Easy Security page
print("\nFetching Easy Security page...")
urls_to_try = [
    "/web/entry/en/websys/easySecurity/getEasySecurity.cgi",
    "/web/entry/en/websys/easySecurity/setEasySecurity.cgi",
]
for url in urls_to_try:
    resp = session.get(urljoin(base_url, url), timeout=10)
    print(f"\n{'='*60}")
    print(f"GET {url} -> {resp.status_code} ({len(resp.text)} bytes)")
    with open(f"debug_easy_security_{url.split('/')[-1]}.html", "w", encoding="utf-8") as f:
        f.write(resp.text)
    print(f"Saved to debug_easy_security_{url.split('/')[-1]}.html")
    # Show forms and buttons
    forms = re.findall(r'<form[^>]*>(.*?)</form>', resp.text, re.S | re.I)
    print(f"Forms found: {len(forms)}")
    buttons = re.findall(r'(?:Add User|addUser|ADDUSER|add_user)[^"\'<>]*', resp.text, re.I)
    print(f"Add User references: {buttons[:5]}")
    # Show all action URLs
    actions = re.findall(r'action=["\']([^"\']+)["\']', resp.text, re.I)
    print(f"Form actions: {actions[:10]}")
    # Show links with "add" in them
    add_links = re.findall(r'href=["\']([^"\']*add[^"\']*)["\']', resp.text, re.I)
    print(f"Add links: {add_links[:10]}")

print("\n\nAlso trying address wizard directly...")
resp = session.get(urljoin(base_url, "/web/entry/en/address/adrsGetUserWizard.cgi"), timeout=10)
print(f"Wizard GET: {resp.status_code} ({len(resp.text)} bytes)")
with open("debug_wizard_get.html", "w", encoding="utf-8") as f:
    f.write(resp.text)
print("Saved to debug_wizard_get.html")
if "Session timed out" in resp.text:
    print(">>> SESSION TIMED OUT on wizard page!")
elif "error" in resp.text.lower():
    print(">>> Error detected in wizard page")
else:
    wt = re.search(r'wimToken\s*[:=]\s*["\']?([^"\'\s;>]+)', resp.text, re.I)
    print(f"Wizard wimToken: {wt.group(1) if wt else 'NOT FOUND'}")
