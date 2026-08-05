import sys
import logging
from agent.modules.toshiba.service import ToshibaWIM
from agent.models.printer import Printer
import urllib3
urllib3.disable_warnings()

logging.basicConfig(level=logging.INFO)

def test_agent():
    printer = Printer(name="Toshiba-Test", ip="wim17858236038101.app.goxprint.com", user="admin", password="123")
    service = ToshibaWIM(api_client=None)
    
    print("Testing Toshiba setup_scan_destination_v2...")
    try:
        # We don't really want it to change SMB stuff, but let's run it. 
        # Actually it creates SMB share locally. We can just test the _wim_request part by calling it manually?
        # No, setup_scan_destination_v2 does it all.
        res = service.setup_scan_destination_v2(printer, username="test_scan")
        print("RESULT:")
        print(res)
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    test_agent()
