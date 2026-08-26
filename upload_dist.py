import paramiko
import os

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('157.66.80.125', username='root', password='@baoLong0511')

sftp = ssh.open_sftp()
local_zip = "dist.zip"
remote_zip = "/tmp/dist.zip"
print("Uploading...")
sftp.put(local_zip, remote_zip)
sftp.close()

print("Unzipping on VPS...")
cmd = "cd /opt/printagent/static && unzip -o /tmp/dist.zip && rm /tmp/dist.zip"
_, out, err = ssh.exec_command(cmd)
print("OUT:", out.read().decode())
print("ERR:", err.read().decode())
ssh.close()
print("Done!")
