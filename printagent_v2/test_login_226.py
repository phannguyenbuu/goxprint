"""
Test Ricoh login. Usage: python test_login_226.py [IP] [USER] [PASSWORD]
"""
import sys
import time
from ricoh_web import login_ricoh, _log

ip = sys.argv[1] if len(sys.argv) > 1 else "192.168.1.226"
user = sys.argv[2] if len(sys.argv) > 2 else "admin"
pw = sys.argv[3] if len(sys.argv) > 3 else ""

print("=" * 60)
t0 = time.perf_counter()
session, token = login_ricoh(ip, user, pw, verbose=True)
elapsed = time.perf_counter() - t0
print("=" * 60)
if session:
    print(f"LOGIN SUCCESS ({elapsed:.1f}s)")
    try:
        session.get(f"http://{ip}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
    except Exception:
        pass
else:
    print(f"LOGIN FAILED ({elapsed:.1f}s)")
