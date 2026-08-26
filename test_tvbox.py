import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    print("Connecting to TVBox...")
    client.connect('100.73.10.37', username='root', password='H@2026', timeout=30)
    
    print("\n--- ARP Table ---")
    stdin, stdout, stderr = client.exec_command('ip neigh')
    print(stdout.read().decode())
    
    print("\n--- Scanning port 80 ---")
    script_80 = """
import socket
import concurrent.futures

def check_port(ip):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        if s.connect_ex((ip, 80)) == 0:
            return ip
    except:
        pass
    finally:
        s.close()
    return None

ips = [f'192.168.1.{i}' for i in range(1, 255)]
with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
    results = executor.map(check_port, ips)
print([r for r in results if r])
"""
    stdin, stdout, stderr = client.exec_command(f'python3 -c "{script_80.replace(chr(10), chr(10))}"')
    print(stdout.read().decode())
    print(stderr.read().decode())

    print("\n--- Scanning port 9100 ---")
    script_9100 = script_80.replace('80', '9100')
    stdin, stdout, stderr = client.exec_command(f'python3 -c "{script_9100.replace(chr(10), chr(10))}"')
    print(stdout.read().decode())

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
