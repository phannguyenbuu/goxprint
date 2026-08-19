import requests
from agent.services.api_client import Printer
from agent.modules.ricoh.service import RicohService

svc = RicohService(None)

def test_printer(ip, u, p):
    printer = Printer(name="Test", ip=ip, user=u, password=p, printer_type="ricoh")
    sess = requests.Session()
    try:
        used_u, used_p = svc._login(sess, printer, credential_candidates=[(u, p)])
        if used_u == u and used_p == p:
            print(f"[{ip}] SUCCESS: login accepted {u}:{p}")
        else:
            print(f"[{ip}] FAILED: Used fallback {used_u}:{used_p} instead of {u}:{p}")
    except Exception as e:
        print(f"[{ip}] EXCEPTION: {e}")

print("Testing 228 with admin777 (from user screenshot):")
test_printer("192.168.1.228", "admin", "admin777")

print("\nTesting 226 with 777 (from user msg):")
test_printer("192.168.1.226", "admin", "777")
