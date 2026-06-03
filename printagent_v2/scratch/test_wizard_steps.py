import sys
import os
import re
import time
import logging
import requests
from urllib.parse import urljoin, urlparse

# Configure logging to console at INFO level
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stdout
)

# Append project root to sys.path
project_root = r"d:\Dropbox\_Documents\Goxprint\printagent_v2"
sys.path.insert(0, project_root)

from agent.modules.ricoh.service import RicohService
from agent.services.api_client import Printer

def save_html(name, html):
    log_dir = os.path.join(project_root, "storage", "logs")
    os.makedirs(log_dir, exist_ok=True)
    path = os.path.join(log_dir, f"wizard_{name}.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Saved {name} response to {path} (length={len(html)})")

def test_wizard():
    ip = "192.168.1.226"
    username = "gp001"
    name = f"Scan to {username}"
    email = "gp001@example.com"
    folder = "ftp://192.168.1.2:2121/"
    
    print(f"Target IP: {ip}")
    print(f"Name: {name}")
    print(f"Email: {email}")
    print(f"Folder: {folder}")
    
    # Initialize RicohService
    service = RicohService(api_client=None)
    printer = Printer(id=1, name="TestPrinter", ip=ip, user="admin", password="")
    
    # Authenticate and get session
    print("Logging into printer...")
    try:
        session = service.create_http_client_auth_form_only(printer)
    except Exception as exc:
        print(f"Login failed exception: {exc}")
        return
    
    # 1. Fetch token
    print("Fetching WIM token...")
    wim_token, wim_source = service._fetch_wim_token(session, printer)
    print(f"WIM Token: {wim_token} (Source: {wim_source})")
    if not wim_token:
        print("Error: No wimToken found")
        return
        
    registration_no = service._next_registration_no(session, printer)
    print(f"Generated registration_no: {registration_no}")
    
    entry_display_name = name
    tag_values = ["1"] * 4
    
    # BASE
    base_items = [
        ("mode", "ADDUSER"),
        ("step", "BASE"),
        ("wimToken", wim_token),
        ("entryIndexIn", registration_no),
        ("entryNameIn", name),
        ("entryDisplayNameIn", entry_display_name),
    ]
    for value in tag_values[:4]:
        base_items.append(("entryTagInfoIn", value))
        
    print("Posting BASE step...")
    base_html = service._post_wizard_step(session, printer, base_items)
    save_html("1_base", base_html)
    wim_token = service._extract_wim_token(base_html) or wim_token
    print(f"Token after BASE: {wim_token}")
    
    # MAIL
    mail_items = [
        ("mode", "ADDUSER"),
        ("step", "MAIL"),
        ("wimToken", wim_token),
        ("mailAddressIn", email),
    ]
    print("Posting MAIL step...")
    mail_html = service._post_wizard_step(session, printer, mail_items)
    save_html("2_mail", mail_html)
    wim_token = service._extract_wim_token(mail_html) or wim_token
    print(f"Token after MAIL: {wim_token}")
    
    # FOLDER
    folder_server_name, folder_port, folder_path = service._parse_folder_destination(folder)
    folder_items = [
        ("mode", "ADDUSER"),
        ("step", "FOLDER"),
        ("wimToken", wim_token),
        ("folderProtocolIn", "FTP_O"),
        ("folderPortNoIn", str(folder_port or 21)),
        ("folderServerNameIn", folder_server_name),
        ("folderPathNameIn", folder_path),
        ("folderAuthUserNameIn", ""),
        ("wk_folderPasswordIn", ""),
        ("folderPasswordIn", ""),
        ("wk_folderPasswordConfirmIn", ""),
        ("folderPasswordConfirmIn", ""),
    ]
    print("Posting FOLDER step...")
    folder_html = service._post_wizard_step(session, printer, folder_items)
    save_html("3_folder", folder_html)
    wim_token = service._extract_wim_token(folder_html) or wim_token
    print(f"Token after FOLDER: {wim_token}")
    
    # CONFIRM
    confirm_items = [
        ("wimToken", wim_token),
        ("stepListIn", "BASE"),
        ("stepListIn", "MAIL"),
        ("stepListIn", "FOLDER"),
        ("mode", "ADDUSER"),
        ("step", "CONFIRM"),
    ]
    print("Posting CONFIRM step...")
    confirm_html = service._post_wizard_step(session, printer, confirm_items)
    save_html("4_confirm", confirm_html)
    
    created_no = service._extract_created_registration_no(confirm_html)
    print(f"Extracted created registration number: '{created_no}'")
    
    # Close session
    service._reset_web_session(session, printer)
    session.close()
    print("Done")

if __name__ == "__main__":
    test_wizard()
