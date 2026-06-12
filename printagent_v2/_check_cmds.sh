#!/bin/bash
cd /opt/printagent
python3 -c "
from db import session_factory
from models import PrinterControlCommand
s = session_factory()
cmds = s.query(PrinterControlCommand).filter(PrinterControlCommand.command_type=='install_driver').order_by(PrinterControlCommand.id.desc()).limit(5).all()
for c in cmds:
    err = (c.error_message or '')[:100]
    print(f'id={c.id} status={c.status} agent={c.agent_uid} ip={c.ip} created={c.created_at} received={c.received_at} err={err}')
s.close()
"
