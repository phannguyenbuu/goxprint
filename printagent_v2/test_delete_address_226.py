"""
Test delete address book entry. Usage: python test_delete_address_226.py [IP] [REG_NO] [USER] [PASSWORD]
"""
import sys
import time
from ricoh_web import login_ricoh, delete_address_entry, _log

ip = sys.argv[1] if len(sys.argv) > 1 else "192.168.1.226"
entry_ref = sys.argv[2] if len(sys.argv) > 2 else "00002"
user = sys.argv[3] if len(sys.argv) > 3 else "admin"
pw = sys.argv[4] if len(sys.argv) > 4 else ""

print("=" * 60)
_log(f"DELETE: {entry_ref} from {ip}")
print("=" * 60)

t0 = time.perf_counter()
session, token = login_ricoh(ip, user, pw, verbose=True)
if not session:
    print("LOGIN FAILED")
    sys.exit(1)

try:
    result = delete_address_entry(session, ip, entry_ref, verbose=True)
    elapsed = time.perf_counter() - t0
    print("=" * 60)
    print(f"SUCCESS ({elapsed:.1f}s) - deleted {result['deleted']}")
except Exception as e:
    print(f"FAILED: {e}")
finally:
    try:
        session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
    except Exception:
        pass
