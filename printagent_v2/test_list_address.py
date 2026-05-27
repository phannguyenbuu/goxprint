#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Standalone test script to list address book entries from a Ricoh copier.
Usage: python test_list_address.py [IP] [USER] [PASSWORD]
"""
import sys
import os
import re
from urllib.parse import urljoin

# Append project root to sys.path to ensure absolute imports work correctly
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from ricoh_web import login_ricoh, _log


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
    raw = str(data or "").strip()
    if not raw:
        return entries

    first = raw.find("[")
    last = raw.rfind("]")
    if first < 0 or last <= first:
        return entries
    raw_inner = raw[first + 1: last]

    # Find inner arrays like ['00001','1', ...]
    raw_entries = re.findall(r"\[([^\]]+)\]", raw_inner)
    for row in raw_entries:
        fields = parse_javascript_array_fields(row)
        if len(fields) < 8:
            continue
        
        type_map = {"1": "User", "2": "Group"}
        raw_entry_id = fields[0].strip().lstrip("[").strip("'\"")
        
        entry = {
            "entry_id": raw_entry_id,
            "type": type_map.get(fields[1], f"Type_{fields[1]}"),
            "reg_no": fields[2].strip("'\""),
            "name": fields[3].strip("'\""),
            "user_code": fields[4].strip("'\""),
            "last_used": fields[5].strip("'\""),
            "email": fields[6].strip("'\""),
            "folder": fields[7].strip("'\""),
        }
        if entry["name"] or entry["reg_no"]:
            entries.append(entry)
    return entries


def clean_html_tags(text: str) -> str:
    cleaned = re.sub(r"<[^>]*>", "", text)
    return html_unescape(cleaned).strip()


def html_unescape(text: str) -> str:
    # Basic unescape for console display
    replacements = {
        "&nbsp;": " ",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'",
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text


def parse_html_address_list(html: str) -> list[dict]:
    entries = []
    tbody_match = re.search(r'<tbody id="ReportListArea_TableBody">(.*?)</tbody>', html, re.S)
    if not tbody_match:
        return entries

    rows = re.findall(r"<tr(?:\s+[^>]*)?>(?:\s*<td[^>]*>.*?</td>\s*){7,}</tr>", tbody_match.group(1), re.S)
    for row in rows:
        if "reportListDummyRow" in row:
            continue
        cells = re.findall(r"<td[^>]*>(.*?)</td>", row, re.S)
        if len(cells) < 8:
            continue
            
        entry_id = ""
        id_match = re.search(r'value="(\d+)"\s+name="entryIndex"', cells[0])
        if id_match:
            entry_id = id_match.group(1)
            
        entry = {
            "entry_id": entry_id,
            "type": clean_html_tags(cells[1]),
            "reg_no": clean_html_tags(cells[2]),
            "name": clean_html_tags(cells[3]),
            "user_code": clean_html_tags(cells[4]),
            "last_used": clean_html_tags(cells[5]),
            "email": clean_html_tags(cells[6]),
            "folder": clean_html_tags(cells[7]),
        }
        if entry["name"] and entry["name"] != "-" and entry["reg_no"]:
            entries.append(entry)
    return entries


def main():
    ip = sys.argv[1] if len(sys.argv) > 1 else "192.168.1.226"
    user = sys.argv[2] if len(sys.argv) > 2 else "admin"
    pw = sys.argv[3] if len(sys.argv) > 3 else ""

    print("=" * 80)
    print("        RICOH ADDRESS BOOK SCANNER (STANDALONE TEST)        ")
    print("=" * 80)

    _log(f"Attempting login to Copier at {ip} (User: {user})...")
    session, token = login_ricoh(ip, user, pw, verbose=True)
    if not session:
        print("[x] LOGIN FAILED!")
        sys.exit(1)

    _log(f"Login OK. wimToken: {token}")
    
    entries = []
    base_url = f"http://{ip}"
    
    # Strategy A: AJAX Endpoint (Fast & highly reliable on modern firmware)
    _log("Trying Strategy A: Fetching address book via AJAX...")
    ajax_urls = [
        f"/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={token}",
        f"/web/entry/en/address/adrsListLoadEntry.cgi?listCountIn=50&getCountIn=1&wimToken={token}",
        f"/web/guest/en/address/adrsListLoadEntry.cgi?listCountIn=200&getCountIn=1&wimToken={token}"
    ]
    for url in ajax_urls:
        try:
            resp = session.get(urljoin(base_url, url), timeout=8)
            if resp.status_code == 200 and "[" in resp.text and "]" in resp.text:
                entries = parse_ajax_address_list(resp.text)
                if entries:
                    _log(f"Successfully retrieved and parsed {len(entries)} entries via AJAX.")
                    break
        except Exception as e:
            _log(f"  AJAX fetch error for {url.split('?')[0]}: {e}")
            
    # Strategy B: Fallback to HTML table scraping
    if not entries:
        _log("Trying Strategy B: Scraping address list from HTML Table...")
        html_urls = [
            "/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL",
            "/web/guest/en/address/adrsList.cgi?modeIn=LIST_ALL"
        ]
        for url in html_urls:
            try:
                resp = session.get(urljoin(base_url, url), timeout=10)
                if resp.status_code == 200 and "ReportListArea_TableBody" in resp.text:
                    entries = parse_html_address_list(resp.text)
                    if entries:
                        _log(f"Successfully scraped {len(entries)} entries from HTML Table.")
                        break
            except Exception as e:
                _log(f"  HTML fetch error for {url}: {e}")

    # Display results
    print("-" * 80)
    if not entries:
        print("[!] No address book entries found or unable to parse.")
    else:
        print(f"Address Book Entries ({len(entries)} found):")
        print("-" * 80)
        # Format table header
        header = f"{'Reg No':<8} | {'Entry ID':<8} | {'Name':<20} | {'Type':<6} | {'Email':<22} | {'Folder Destination'}"
        print(header)
        print("-" * 80)
        
        for item in entries:
            reg = item.get("reg_no", "-")
            entry_id = item.get("entry_id", "-")
            name = item.get("name", "-")
            etype = item.get("type", "-")
            email = item.get("email", "-")
            folder = item.get("folder", "-")
            
            # Truncate values to fit neatly
            name = name[:20]
            email = email[:22]
            folder = folder[:30]
            
            print(f"{reg:<8} | {entry_id:<8} | {name:<20} | {etype:<6} | {email:<22} | {folder}")
            
    print("-" * 80)
    
    # Session release
    _log("Releasing copier session lock (logging out)...")
    try:
        session.get(urljoin(base_url, "/web/entry/en/websys/webArch/logout.cgi"), timeout=3)
        _log("Logout completed successfully.")
    except Exception:
        pass
    print("=" * 80)


if __name__ == "__main__":
    main()
