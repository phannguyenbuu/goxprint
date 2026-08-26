import paramiko

VPS_PYTHON_SCRIPT = """
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import UtiCommand

engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
Session = sessionmaker(bind=engine)
session = Session()

cmd = session.query(UtiCommand).filter_by(command='force_subnet_scan').first()
if cmd:
    cmd.output_modal = True
    session.commit()
    print("Set output_modal to True for force_subnet_scan")
else:
    print("Command not found!")
"""

with open('backend/update_cmd2.py', 'w', encoding='utf-8') as f:
    f.write(VPS_PYTHON_SCRIPT)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('157.66.80.125', username='root', password='@baoLong0511')
sftp = ssh.open_sftp()
sftp.put('backend/update_cmd2.py', '/opt/printagent/update_cmd2.py')
sftp.close()

_, out, err = ssh.exec_command('/opt/printagent/venv/bin/python3 /opt/printagent/update_cmd2.py')
print(out.read().decode('utf-8'))
ssh.close()
