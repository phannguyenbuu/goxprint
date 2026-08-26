import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('157.66.80.125', username='root', password='@baoLong0511')

cmd = "/opt/printagent/venv/bin/python3 -c \"import sys; sys.path.append('/opt/printagent'); from config import ServerConfig; from db import create_session_factory; from models import AllowedPublicIp; sf=create_session_factory(ServerConfig()); s=sf(); s.query(AllowedPublicIp).update({'enabled': True}); s.commit(); print([(r.id, r.ip_address, r.enabled) for r in s.query(AllowedPublicIp).all()])\""

stdin, stdout, stderr = ssh.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
ssh.close()
