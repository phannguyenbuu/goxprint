import subprocess
import json
import re

def run_ip_change_test():
    active_interface = None
    current_ip = None
    gateway = None

    # Method 1: Use PowerShell Get-NetAdapter (Most reliable on Win 10/11)
    try:
        ps_code = '$a=Get-NetAdapter|Where-Object{$_.Status -eq "Up" -and $_.InterfaceDescription -notlike "*Virtual*" -notlike "*Tailscale*" -notlike "*VPN*" -notlike "*Loopback*"}|Select-Object -First 1;if($a){$ip=(Get-NetIPAddress -InterfaceIndex $a.InterfaceIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue|Select-Object -First 1).IPAddress;$gw=(Get-NetRoute -InterfaceIndex $a.InterfaceIndex -DestinationPrefix "0.0.0.0/0" -ErrorAction SilentlyContinue|Select-Object -First 1).NextHop;[PSCustomObject]@{Name=$a.Name;IP=$ip;Gateway=$gw}|ConvertTo-Json -Compress}'
        res_ps = subprocess.run(['powershell', '-NoProfile', '-Command', ps_code], capture_output=True, text=True, errors='ignore')
        ps_out = res_ps.stdout.strip()
        if ps_out:
            data = json.loads(ps_out)
            active_interface = data.get('Name')
            current_ip = data.get('IP')
            gateway = data.get('Gateway')
    except Exception as e:
        print("PS error:", e)

    print(f"RESULT: Interface='{active_interface}' | IP='{current_ip}' | Gateway='{gateway}'")

run_ip_change_test()
