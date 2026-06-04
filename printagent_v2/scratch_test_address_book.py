import sys
import logging
from agent.config import AppConfig
from agent.services.api_client import APIClient, Printer
from agent.modules.ricoh.service import RicohService

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

def main():
    config = AppConfig.load()
    # Override for test printer
    printer = Printer(
        name="Test Ricoh Copier",
        ip="192.168.1.226",
        user="admin",
        password="",
        printer_type="ricoh",
    )
    print(f"Testing address details fetch from printer IP: {printer.ip}")
    api_client = APIClient(config)
    service = RicohService(api_client, config=config)
    try:
        # Fetch address book list first
        payload = service.process_address_list(printer)
        print("\n=== Address Book Entries ===")
        for idx, entry in enumerate(payload.get('address_list', [])):
            print(f"[{idx}] RegNo: {entry.get('registration_no')} | EntryID: {entry.get('entry_id')} | Name: {entry.get('name')}")
            
        print("\n=== Fetching Details for Entry ID 25 ===")
        details_25 = service.get_address_entry_details(printer, "25")
        print(f"Details for 25: {details_25}")
        
        print("\n=== Fetching Details for Entry ID 54 ===")
        details_54 = service.get_address_entry_details(printer, "54")
        print(f"Details for 54: {details_54}")
        
    except Exception as e:
        print(f"\n=== FAILED ===")
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
