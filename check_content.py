import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('157.66.80.125', username='root', password='@baoLong0511')
_, out, _ = ssh.exec_command('''/opt/printagent/venv/bin/python3 -c "
import sys
sys.path.insert(0, '/opt/printagent')
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import UtiCommand
engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
Session = sessionmaker(bind=engine)
session = Session()
cmd = session.query(UtiCommand).filter_by(command='force_subnet_scan').first()
if cmd:
    print(repr(cmd.command_content))
"''')
print(out.read().decode('utf-8'))
