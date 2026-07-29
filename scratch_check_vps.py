import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

def inspect_auth_backend():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect("agentapi.quanlymay.com", username="root", password="@baoLong0511", timeout=10)

    commands = [
        "cat /opt/printagent/auth_routes.py",
        "cat /opt/printagent/config.py"
    ]

    for cmd in commands:
        print(f"\n--- Command: {cmd} ---")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        out = stdout.read().decode('utf-8', errors='ignore')
        err = stderr.read().decode('utf-8', errors='ignore')
        if out:
            print("[STDOUT]\n" + out)
        if err:
            print("[STDERR]\n" + err)

    ssh.close()

if __name__ == "__main__":
    inspect_auth_backend()
