"""
Test add address book entry. Usage: python test_add_address_226.py [IP] [EMAIL] [FTP_PORT] [USER] [PASSWORD]
"""
import sys
import time
from ricoh_web import login_ricoh, add_address_entry, get_best_local_ip, _log

ip = sys.argv[1] if len(sys.argv) > 1 else "192.168.1.226"
email = sys.argv[2] if len(sys.argv) > 2 else "buunphan@gmail.com"
ftp_port = int(sys.argv[3]) if len(sys.argv) > 3 else 2122
user = sys.argv[4] if len(sys.argv) > 4 else "admin"
pw = sys.argv[5] if len(sys.argv) > 5 else ""

ftp_host = get_best_local_ip(ip)
# name = email.split("@")[0]
name = email

print("=" * 60)
_log(f"ADD: {email} -> {ip} (FTP {ftp_host}:{ftp_port})")
print("=" * 60)

t0 = time.perf_counter()
session, token = login_ricoh(ip, user, pw, verbose=True)
if not session:
    print("LOGIN FAILED")
    sys.exit(1)

try:
    result = add_address_entry(session, ip, token, name, "", ftp_host, ftp_port, verbose=True)
    elapsed = time.perf_counter() - t0
    print("=" * 60)
    print(f"SUCCESS ({elapsed:.1f}s) - reg #{result['created_registration_no']}")
except Exception as e:
    print(f"FAILED: {e}")
finally:
    try:
        session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
    except Exception:
        pass
