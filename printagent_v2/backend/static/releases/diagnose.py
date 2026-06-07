import os
import sys
import json
import socket
import requests
import subprocess
from pathlib import Path

def get_diagnostics():
    temp_dir = os.environ.get("TEMP") or "C:\\Users\\Temp"
    goprinx_dir = Path(temp_dir) / "GoPrinxAgent"
    logs_dir = goprinx_dir / "logs"
    
    exe_dir = Path(sys.executable).resolve().parent
    
    # List files in exe_dir
    exe_dir_files = []
    try:
        exe_dir_files = [item.name for item in exe_dir.iterdir() if item.is_file()]
    except Exception as e:
        exe_dir_files = [f"Error listing: {e}"]

    logs = {}
    log_files = {
        "stout": logs_dir / "stout.txt",
        "sterror": logs_dir / "sterror.txt",
        "ftp_stout": logs_dir / "ftp_stout.txt",
        "ftp_sterror": logs_dir / "ftp_sterror.txt",
        "fallback_ftp_stout": exe_dir / "ftp_stout.txt",
        "fallback_ftp_sterror": exe_dir / "ftp_sterror.txt",
        "loader": exe_dir / "storage" / "logs" / "loader.txt",
        "settings": exe_dir / "settings.json",
        "ftp_state": exe_dir / "storage" / "ftp_service" / "runtime.json",
    }
    
    for key, path in log_files.items():
        if path.exists():
            try:
                if key in ["settings", "ftp_state"]:
                    logs[key] = json.loads(path.read_text(encoding="utf-8"))
                else:
                    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
                    logs[key] = lines[-150:]
            except Exception as e:
                logs[key] = f"Error reading: {e}"
        else:
            logs[key] = "File does not exist"

    processes = []
    try:
        cmd = 'powershell -Command "Get-CimInstance Win32_Process -Filter \\\"name like \'%printagent%\'\\\" | Select-Object ProcessId, CommandLine | ConvertTo-Json"'
        out = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
        processes.append(out)
    except Exception as e:
        processes.append(f"powershell win32_process error: {e}")

    port_status = {}
    for port in [2130, 9173]:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(0.2)
            port_status[port] = sock.connect_ex(("127.0.0.1", port)) == 0

    return {
        "agent_uid": "kythuat02",
        "hostname": socket.gethostname(),
        "local_ip": socket.gethostbyname(socket.gethostname()) if hasattr(socket, "gethostbyname") else "unknown",
        "exe_dir_files": exe_dir_files,
        "logs": logs,
        "processes": processes,
        "port_status": port_status,
        "cwd": os.getcwd(),
        "sys_executable": sys.executable,
        "sys_argv": sys.argv,
    }

def main():
    # Kill any zombie printagent.exe processes to free the Global\GoPrinxAgentFtpWorker lock
    try:
        subprocess.run(["taskkill", "/F", "/IM", "printagent.exe"], shell=True, capture_output=True)
    except Exception:
        pass
        
    try:
        diag = get_diagnostics()
        requests.post("https://agentapi.quanlymay.com/api/public/agent-diagnostics", json=diag, timeout=15)
    except Exception as e:
        try:
            Path("diagnose_err.txt").write_text(str(e))
        except:
            pass

main()
