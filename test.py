import sys, json
sys.path.append('/opt/printagent')
from db import session_factory
from models import PrinterControlCommand
session = session_factory()
cmd = session.query(PrinterControlCommand).filter(PrinterControlCommand.command_type=='trigger_utility').order_by(PrinterControlCommand.id.desc()).first()
print(cmd.command_params if cmd else 'None')
