import sys
import os
import logging
from pathlib import Path

# Setup logging to console
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(name)s: %(message)s')

# Setup GoxAgent search path and agent package alias
parent_dir = str(Path(__file__).resolve().parent.parent)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

import printagent as agent
sys.modules["agent"] = agent

from agent.services.api_client import Printer
from agent.modules.ricoh.service import RicohService
from agent.config import AppConfig

# Dummy API client class
class DummyAPIClient:
    pass

def main():
    print("=== STANDALONE RICOH ADDRESS MODIFY SCRIPT ===")
    
    # 1. Initialize configuration & client
    config = AppConfig.load()
    api_client = DummyAPIClient()
    
    # 2. Setup Printer details
    printer = Printer()
    printer.ip = "192.168.1.222"
    printer.auth_user = "admin"
    printer.auth_password = ""
    printer.printer_type = "ricoh"
    
    # 3. Instantiate RicohService
    print(f"Connecting to Ricoh Service base for printer {printer.ip}...")
    service = RicohService(api_client=api_client, config=config)
    
    # 4. Modify address book entry
    print("Modifying registration number 00002 (ns1) destination folder path...")
    try:
        res = service.modify_address_user_wizard(
            printer=printer,
            registration_no="00002",
            name="ns1",
            folder="192.168.1.43:2130/ns1"
        )
        print("\n=== EXECUTION SUCCESS ===")
        print("Result payload:")
        print(res)
    except Exception as exc:
        print("\n=== EXECUTION FAILED ===")
        print("Error details:", exc)

if __name__ == "__main__":
    main()
