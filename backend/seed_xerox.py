import os
import sys

# Them duong dan backend vao sys.path de import
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import create_app
from models import UtiCommand
from database import session_factory

app = create_app()

def read_script(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return f.read()

commands_to_seed = [
    {
        "command": "xerox_list_scan",
        "label": "Xerox - List Address Book",
        "description": "Fetch and parse Address Book from Xerox/Fujifilm",
        "script_file": "xerox_list_scan.py"
    },
    {
        "command": "xerox_create_scan",
        "label": "Xerox - Create Scan Contact",
        "description": "Add a new FTP contact to Xerox/Fujifilm",
        "script_file": "xerox_create_scan.py"
    },
    {
        "command": "xerox_update_scan",
        "label": "Xerox - Update Scan Contact",
        "description": "Update an existing FTP contact on Xerox/Fujifilm",
        "script_file": "xerox_update_scan.py"
    },
    {
        "command": "xerox_delete_scan",
        "label": "Xerox - Delete Scan Contact",
        "description": "Delete a contact on Xerox/Fujifilm",
        "script_file": "xerox_delete_scan.py"
    }
]

with session_factory() as session:
    for cmd_info in commands_to_seed:
        cmd_name = cmd_info["command"]
        script_content = read_script(os.path.join(os.path.dirname(__file__), cmd_info["script_file"]))
        
        # Check if exists
        existing = session.query(UtiCommand).filter(UtiCommand.command == cmd_name).first()
        if existing:
            print(f"[*] Updating existing UtiCommand: {cmd_name}")
            existing.command_content = script_content
            existing.label = cmd_info["label"]
            existing.description = cmd_info["description"]
        else:
            print(f"[+] Inserting new UtiCommand: {cmd_name}")
            new_cmd = UtiCommand(
                command=cmd_name,
                label=cmd_info["label"],
                description=cmd_info["description"],
                command_content=script_content,
                output_modal="modal-lg"
            )
            session.add(new_cmd)
    
    session.commit()
    print("[+] Da seed 4 script Xerox vao CSDL UtiCommand thanh cong!")
