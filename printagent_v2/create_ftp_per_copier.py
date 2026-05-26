"""
Create FTP site per copier.

Queries the local agent for discovered copiers, then creates an FTP site
for each one via the local agent API (POST /api/ftp/create) and registers
a scan destination on the copier's address book.

Usage:
    python create_ftp_per_copier.py [--agent-url http://127.0.0.1:9173] [--dry-run]

Options:
    --agent-url   Local agent base URL (default: http://127.0.0.1:9173)
    --dry-run     Show what would be created without actually creating
    --port-start  Starting FTP port (default: 2121, auto-increments per copier)
"""

import argparse
import json
import sys
import time

import requests

DEFAULT_AGENT_URL = "http://127.0.0.1:9173"
DEFAULT_PORT_START = 2121


def normalize_mac(mac: str) -> str:
    raw = "".join(c for c in (mac or "").upper() if c in "0123456789ABCDEF")
    if len(raw) != 12:
        return ""
    return ":".join(raw[i:i+2] for i in range(0, 12, 2))


def list_copiers(agent_url: str) -> list[dict]:
    """Get all discovered copiers from local agent."""
    url = f"{agent_url}/api/devices?refresh=1"
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    devices = data.get("devices", [])
    # Filter only copiers with valid MAC (real network devices)
    copiers = []
    for d in devices:
        mac = normalize_mac(d.get("mac_id") or d.get("mac") or "")
        ip = (d.get("ip") or "").strip()
        if mac and ip:
            copiers.append({
                "name": d.get("name") or d.get("printer_name") or "Unknown",
                "ip": ip,
                "mac_id": mac,
                "type": d.get("type") or "unknown",
                "status": d.get("status") or "unknown",
            })
    return copiers


def list_existing_ftp_sites(agent_url: str) -> list[dict]:
    """Get existing FTP sites from local agent."""
    url = f"{agent_url}/api/ftp/sites"
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    return data.get("sites", [])


def create_ftp_for_copier(agent_url: str, copier: dict, port: int) -> dict:
    """Create FTP site for a single copier via local agent API."""
    mac_clean = copier["mac_id"].replace(":", "").lower()
    ftp_name = f"scan_{mac_clean[-6:]}"  # Last 6 hex chars of MAC

    payload = {
        "computer_id": "local",
        "ftp_name": ftp_name,
        "port": port,
    }
    url = f"{agent_url}/api/ftp/create"
    resp = requests.post(url, json=payload, timeout=30)
    resp.raise_for_status()
    result = resp.json()
    return result


def setup_scan_on_copier(agent_url: str, copier: dict, ftp_name: str, ftp_port: int) -> dict:
    """Register scan destination on the copier's address book."""
    payload = {
        "ip": copier["ip"],
        "action": "setup_scan",
        "ftp_site_name": ftp_name,
        "ftp_port": ftp_port,
    }
    url = f"{agent_url}/api/devices/action"
    resp = requests.post(url, json=payload, timeout=60)
    resp.raise_for_status()
    return resp.json()


def main():
    parser = argparse.ArgumentParser(description="Create FTP per copier")
    parser.add_argument("--agent-url", default=DEFAULT_AGENT_URL, help="Local agent URL")
    parser.add_argument("--dry-run", action="store_true", help="Show plan without executing")
    parser.add_argument("--port-start", type=int, default=DEFAULT_PORT_START, help="Starting FTP port")
    parser.add_argument("--skip-existing", action="store_true", default=True, help="Skip copiers that already have FTP")
    args = parser.parse_args()

    print(f"Agent URL: {args.agent_url}")
    print(f"Starting port: {args.port_start}")
    print()

    # 1. List copiers
    print("Discovering copiers...")
    try:
        copiers = list_copiers(args.agent_url)
    except Exception as e:
        print(f"ERROR: Could not connect to agent: {e}")
        sys.exit(1)

    if not copiers:
        print("No copiers found. Make sure the agent is running and has discovered devices.")
        sys.exit(0)

    print(f"Found {len(copiers)} copier(s):")
    print("-" * 70)
    for i, c in enumerate(copiers, 1):
        print(f"  [{i}] {c['name']:<25} IP: {c['ip']:<15} MAC: {c['mac_id']}")
    print()

    # 2. Check existing FTP sites
    existing_sites = []
    try:
        existing_sites = list_existing_ftp_sites(args.agent_url)
    except Exception:
        pass

    existing_ports = {int(s.get("port", 0) or 0) for s in existing_sites}
    existing_names = {s.get("name", "") for s in existing_sites}
    print(f"Existing FTP sites: {len(existing_sites)}")
    for s in existing_sites:
        print(f"  - {s.get('name', '?')} (port {s.get('port', '?')})")
    print()

    # 3. Plan FTP creation
    next_port = args.port_start
    plan = []
    for copier in copiers:
        mac_clean = copier["mac_id"].replace(":", "").lower()
        ftp_name = f"scan_{mac_clean[-6:]}"

        # Skip if already exists
        if args.skip_existing and ftp_name in existing_names:
            print(f"  SKIP: {ftp_name} already exists for {copier['name']}")
            continue

        # Find next available port
        while next_port in existing_ports:
            next_port += 1

        plan.append({
            "copier": copier,
            "ftp_name": ftp_name,
            "port": next_port,
        })
        existing_ports.add(next_port)
        next_port += 1

    if not plan:
        print("Nothing to create. All copiers already have FTP sites.")
        sys.exit(0)

    print(f"Plan: create {len(plan)} FTP site(s):")
    print("-" * 70)
    for item in plan:
        c = item["copier"]
        print(f"  {item['ftp_name']} -> port {item['port']} -> {c['name']} ({c['ip']})")
    print()

    if args.dry_run:
        print("[DRY RUN] No changes made.")
        sys.exit(0)

    # 4. Execute
    results = []
    for item in plan:
        copier = item["copier"]
        ftp_name = item["ftp_name"]
        port = item["port"]
        print(f"Creating FTP '{ftp_name}' on port {port} for {copier['name']} ({copier['ip']})...")

        try:
            result = create_ftp_for_copier(args.agent_url, copier, port)
            ok = result.get("ok", False)
            if ok:
                print(f"  OK: FTP created at {result.get('ftp_url', '?')}")
                # Try to setup scan destination on copier
                try:
                    scan_result = setup_scan_on_copier(args.agent_url, copier, ftp_name, port)
                    if scan_result.get("ok"):
                        print(f"  OK: Scan destination registered on {copier['name']}")
                    else:
                        print(f"  WARN: Scan setup failed: {scan_result.get('error', 'unknown')}")
                except Exception as scan_err:
                    print(f"  WARN: Could not setup scan on copier: {scan_err}")
            else:
                print(f"  FAIL: {result.get('error', 'unknown error')}")
            results.append({"copier": copier, "ftp_name": ftp_name, "port": port, "result": result})
        except Exception as e:
            print(f"  ERROR: {e}")
            results.append({"copier": copier, "ftp_name": ftp_name, "port": port, "error": str(e)})

        time.sleep(0.5)  # Small delay between creations

    # 5. Summary
    print()
    print("=" * 70)
    success = sum(1 for r in results if r.get("result", {}).get("ok"))
    failed = len(results) - success
    print(f"Done. Created: {success}, Failed: {failed}, Total copiers: {len(copiers)}")


if __name__ == "__main__":
    main()
