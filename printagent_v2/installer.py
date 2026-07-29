import os
import sys
import shutil
import time
from pathlib import Path
import urllib.request
import ctypes

def log_install(msg: str) -> None:
    try:
        temp_dir = os.environ.get("TEMP")
        if temp_dir:
            log_file = Path(temp_dir) / "printagent_installer.log"
            with open(log_file, "a", encoding="utf-8") as f:
                f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")
                f.flush()
    except Exception:
        pass

def msg_box(title, text, is_error=False):
    log_install(f"{'[ERROR] ' if is_error else '[INFO] '}{title}: {text}")
    style = 0x10 if is_error else 0x40
    try:
        ctypes.windll.user32.MessageBoxW(0, text, title, style)
    except Exception:
        pass

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

# --- CONFIGURATION ---
INSTALL_DIR = Path(os.environ.get("APPDATA", "")) / "GoxPrintAgent"

WATCHDOG_BAT_CONTENT = (
    '@echo off\n'
    'setlocal\n'
    'cd /d "%~dp0"\n'
    'echo ====================================================\n'
    'echo PrintAgent Watchdog (Update ^& Emergency)\n'
    'echo ====================================================\n'
    '\n'
    ':loop\n'
    'rem --- 1. KIỂM TRA UPDATE ---\n'
    'if exist "printagent.update.exe" (\n'
    '    echo [Watchdog] Found update file. Applying...\n'
    '    taskkill /F /IM printagent.exe >nul 2>&1\n'
    '    taskkill /F /IM agent_loader.exe >nul 2>&1\n'
    '    timeout /T 3 /nobreak >nul\n'
    '    del /f /q "printagent.bak.exe" >nul 2>&1\n'
    '    if exist "printagent.exe" (\n'
    '        rename "printagent.exe" "printagent.bak.exe" >nul 2>&1\n'
    '    )\n'
    '    move /Y "printagent.update.exe" "printagent.exe" >nul 2>&1\n'
    '    start /B "" "printagent.exe"\n'
    '    echo [Watchdog] Update applied successfully.\n'
    ')\n'
    '\n'
    'rem --- 2. KIỂM TRA PROCESS DANG CHAY ---\n'
    'tasklist /FI "IMAGENAME eq printagent.exe" 2>NUL | find /I /N "printagent.exe">NUL\n'
    'if "%ERRORLEVEL%"=="1" (\n'
    '    echo [Watchdog] Agent process not running. Starting printagent.exe...\n'
    '    start /B "" "printagent.exe"\n'
    ')\n'
    '\n'
    'rem --- 3. KIỂM TRA RESTART KHẢN CẤP (API) ---\n'
    'powershell -NoProfile -Command "try { $s=Get-Content \'settings.json\' -ErrorAction Stop | ConvertFrom-Json; $url=$s.api_url; if(!$url){$url=$s.polling.url}; if(!$url){$url=\'https://agentapi.quanlymay.com\'}; $url=$url.TrimEnd(\'/\'); $url=$url -replace \'/api$\', \'\'; $hostName=$env:COMPUTERNAME; $res=Invoke-RestMethod -Uri \\"$url/api/agent/watchdog-check?hostname=$hostName\\" -TimeoutSec 10 -ErrorAction Stop; if($res -match \'RESTART\') { Write-Host \\"$(Get-Date -Format \'yyyy-MM-dd HH:mm:ss\') RESTART SIGNAL RECEIVED!\\"; Stop-Process -Name \'printagent\' -Force -ErrorAction SilentlyContinue; Stop-Process -Name \'agent_loader\' -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 3; if(Test-Path \'printagent.exe\') { Start-Process -FilePath \'printagent.exe\' -WindowStyle Hidden; Write-Host \'Agent restarted.\' } } } catch { }"\n'
    '\n'
    'goto loop\n'
)

RUN_WATCHDOG_VBS_CONTENT = (
    'Set WshShell = CreateObject("WScript.Shell")\n'
    'Set fso = CreateObject("Scripting.FileSystemObject")\n'
    'currentFolder = fso.GetParentFolderName(WScript.ScriptFullName)\n'
    'WshShell.CurrentDirectory = currentFolder\n'
    'WshShell.Run chr(34) & "watchdog.bat" & Chr(34), 0\n'
    'Set WshShell = Nothing\n'
)

def create_startup_shortcut(target_vbs: Path):
    print("Thiết lập tự động khởi chạy cùng Windows...")
    startup_dir = Path(os.environ.get("APPDATA", "")) / "Microsoft" / "Windows" / "Start Menu" / "Programs" / "Startup"
    startup_dir.mkdir(parents=True, exist_ok=True)
    
    shortcut_path = startup_dir / "GoxPrintAgent Watchdog.lnk"
    
    try:
        import win32com.client
        shell = win32com.client.Dispatch("WScript.Shell")
        shortcut = shell.CreateShortCut(str(shortcut_path))
        shortcut.Targetpath = "wscript.exe"
        shortcut.Arguments = f'"{str(target_vbs)}"'
        shortcut.WorkingDirectory = str(target_vbs.parent)
        shortcut.IconLocation = str(target_vbs.parent / "printagent.exe")
        shortcut.save()
        print(f" Đã tạo shortcut tại {shortcut_path}")
    except ImportError:
        fallback_bat = startup_dir / "GoxPrintAgent_Watchdog_Startup.bat"
        with open(fallback_bat, "w", encoding="utf-8") as f:
            f.write("@echo off\n")
            f.write(f'cd /d "{target_vbs.parent}"\n')
            f.write(f'wscript.exe "{target_vbs}"\n')
        print(f" Đã tạo fallback startup bat tại {fallback_bat}")
    except Exception as e:
        print(f" Lỗi tạo shortcut: {e}")

def kill_existing_processes():
    print("Đóng các tiến trình PrintAgent đang chạy (nếu có)...")
    import subprocess
    current_pid = os.getpid()
    try:
        # Aggressively kill any lingering printagent and agent_loader processes
        subprocess.run(["taskkill", "/F", "/T", "/IM", "printagent.exe"], capture_output=True, creationflags=0x08000000)
        subprocess.run(["taskkill", "/F", "/T", "/IM", "agent_loader.exe"], capture_output=True, creationflags=0x08000000)
    except Exception:
        pass
    time.sleep(1.5)
    
    # Try to rename existing exe to avoid "file in use" error
    try:
        old_exe = INSTALL_DIR / "printagent.exe"
        bak_exe = INSTALL_DIR / "printagent.old.exe"
        if old_exe.exists():
            if bak_exe.exists():
                bak_exe.unlink()
            old_exe.rename(bak_exe)
    except Exception:
        pass
        
    # Clean up old registry startup entry
    try:
        import winreg
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_ALL_ACCESS) as key:
            winreg.DeleteValue(key, "GoPrinxAgent")
            print(" Đã xóa registry khởi động của bản cũ.")
    except FileNotFoundError:
        pass
    except Exception as e:
        print(f" Không thể xóa registry cũ: {e}")

def get_api_url_from_settings():
    dirs_to_check = []
    try:
        exe_dir = Path(sys.executable).parent
        dirs_to_check.append(exe_dir)
    except Exception:
        pass
    dirs_to_check.append(Path("."))
    dirs_to_check.append(INSTALL_DIR)
    
    for d in dirs_to_check:
        settings_path = d / "settings.json"
        if settings_path.exists():
            try:
                import json
                with settings_path.open("r", encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, dict):
                    api_url = data.get("api_url") or data.get("polling", {}).get("url")
                    if api_url:
                        print(f" Đã đọc cấu hình từ: {settings_path}")
                        return api_url.strip()
            except Exception:
                pass
    return "https://agentapi.quanlymay.com"

def download_printagent(dest_path: Path, api_url: str) -> bool:
    print("Đang kết nối tới máy chủ để tải bản PrintAgent mới nhất...")
    base_url = api_url.strip().rstrip("/")
    if base_url.endswith("/api"):
        base_url = base_url[:-4]
    
    download_url = f"{base_url}/static/releases/printagent.exe"
    # Anti-cache query parameter using current microsecond timestamp
    cache_buster = f"t={int(time.time() * 1000)}"
    download_url = f"{download_url}?{cache_buster}"
    
    print(f"URL tải xuống: {download_url}")
    
    import ssl
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
    
    candidate_urls = [
        download_url,
        f"https://agentapi.quanlymay.com/static/releases/printagent.exe?{cache_buster}",
        f"http://agentapi.quanlymay.com/static/releases/printagent.exe?{cache_buster}",
    ]
    
    last_err = None
    for target_url in candidate_urls:
        req = urllib.request.Request(
            target_url,
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0",
                "User-Agent": "GoxPrintAgentInstaller/2.0"
            }
        )
        try:
            tmp_path = dest_path.with_suffix('.tmp')
            with urllib.request.urlopen(req, timeout=45, context=ssl_ctx) as response:
                total_size = int(response.headers.get('content-length', 0))
                block_size = 1024 * 64
                downloaded = 0
                
                with open(tmp_path, 'wb') as f:
                    while True:
                        buffer = response.read(block_size)
                        if not buffer:
                            break
                        downloaded += len(buffer)
                        f.write(buffer)
                        
                        if total_size > 0:
                            percent = (downloaded / total_size) * 100
                            mb_downloaded = downloaded / (1024 * 1024)
                            mb_total = total_size / (1024 * 1024)
                            if sys.stdout:
                                try:
                                    sys.stdout.write(f"\r Đang tải: {percent:.1f}% ({mb_downloaded:.2f} MB / {mb_total:.2f} MB)...")
                                    sys.stdout.flush()
                                except Exception:
                                    pass
                        else:
                            mb_downloaded = downloaded / (1024 * 1024)
                            if sys.stdout:
                                try:
                                    sys.stdout.write(f"\r Đang tải: {mb_downloaded:.2f} MB...")
                                    sys.stdout.flush()
                                except Exception:
                                    pass
                if sys.stdout:
                    try:
                        print("\n Tải xuống hoàn tất thành công!")
                    except Exception:
                        pass
                
                # Replace destination file safely
                if dest_path.exists():
                    try:
                        old_path = dest_path.with_suffix('.old')
                        if old_path.exists():
                            try: old_path.unlink()
                            except Exception: pass
                        dest_path.rename(old_path)
                    except Exception:
                        try: dest_path.unlink()
                        except Exception: pass
                tmp_path.replace(dest_path)
                return True
        except Exception as e:
            last_err = e
            print(f"\n Thử URL {target_url} thất bại: {e}")
    
    log_install(f"All download URLs failed. Last error: {last_err}")
    return False

def configure_settings_json():
    settings_path = INSTALL_DIR / "settings.json"
    import json
    
    data = {}
    if settings_path.exists():
        try:
            with open(settings_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            pass
            
    if not isinstance(data, dict):
        data = {}
        
    if "polling" not in data or not isinstance(data["polling"], dict):
        data["polling"] = {}
        
    data["polling"]["device_interval_seconds"] = 60
    data["polling"]["interval_seconds"] = 60
    
    try:
        with open(settings_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(" Đã cập nhật polling status và counter thành 60 giây trong settings.json.")
    except Exception as e:
        print(f" Không thể cập nhật settings.json: {e}")

def download_agent_core(api_url: str) -> None:
    temp_dir = os.environ.get("TEMP")
    if temp_dir:
        dest_zip = Path(temp_dir) / "GoPrinxAgent" / "agent_core.zip"
    else:
        import tempfile
        dest_zip = Path(tempfile.gettempdir()) / "GoPrinxAgent" / "agent_core.zip"
    
    base_url = api_url.strip().rstrip("/")
    if base_url.endswith("/api"):
        base_url = base_url[:-4]
    
    download_url = f"{base_url}/static/releases/agent_core.zip?t={int(time.time() * 1000)}"
    import ssl
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
    try:
        dest_zip.parent.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(
            download_url,
            headers={"User-Agent": "GoxPrintAgentInstaller/2.0", "Cache-Control": "no-cache"}
        )
        with urllib.request.urlopen(req, timeout=45, context=ssl_ctx) as response:
            dest_zip.write_bytes(response.read())
        print(" Đã tải trước gói agent_core.zip thành công.")
    except Exception as e:
        print(f" Cảnh báo: Không thể tải trước agent_core.zip: {e}")

def setup_gox_driver_service(api_url: str) -> None:
    """Download GoxDriverService.exe and register it as a Windows Service under LocalSystem."""
    try:
        install_dir = Path(os.environ.get("ProgramData", "C:/ProgramData")) / "GoxDriverService"
        install_dir.mkdir(parents=True, exist_ok=True)
        gds_exe = install_dir / "GoxDriverService.exe"
        
        base_url = api_url.strip().rstrip("/")
        if base_url.endswith("/api"):
            base_url = base_url[:-4]
            
        download_url = f"{base_url}/static/releases/GoxDriverService.exe?t={int(time.time() * 1000)}"
        print(f"Đang tải dịch vụ GoxDriverService từ {download_url}...")
        
        import ssl
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        
        req = urllib.request.Request(
            download_url,
            headers={"User-Agent": "GoxPrintAgentInstaller/2.0", "Cache-Control": "no-cache"}
        )
        with urllib.request.urlopen(req, timeout=45, context=ssl_ctx) as response:
            gds_exe.write_bytes(response.read())
        print(" Đã tải GoxDriverService.exe thành công.")
        
        import subprocess
        _NO_WIN = 0x08000000
        # Stop existing service if running
        subprocess.run(["sc.exe", "stop", "GoxDriverService"], capture_output=True, creationflags=_NO_WIN)
        time.sleep(1)
        
        # Try registering via pywin32 command 'install' first
        r_inst = subprocess.run([str(gds_exe), "install"], capture_output=True, creationflags=_NO_WIN)
        if r_inst.returncode != 0:
            # Fallback to sc.exe create under LocalSystem
            subprocess.run([
                "sc.exe", "create", "GoxDriverService",
                f'binPath="{gds_exe}"', "start=", "auto", "obj=", "LocalSystem",
                'DisplayName="Gox Driver Service"'
            ], capture_output=True, creationflags=_NO_WIN)
            
        # Configure auto restart & start service
        subprocess.run(["sc.exe", "failure", "GoxDriverService", "reset=", "86400", "actions=", "restart/5000/restart/10000/restart/30000"], capture_output=True, creationflags=_NO_WIN)
        subprocess.run(["sc.exe", "start", "GoxDriverService"], capture_output=True, creationflags=_NO_WIN)
        print(" Đã đăng ký và khởi chạy GoxDriverService (LocalSystem) thành công!")
    except Exception as e:
        print(f" Cảnh báo: Không thể tự động cài đặt GoxDriverService: {e}")

def main():
    print("==============================================")
    print("      TRÌNH CÀI ĐẶT GOX PRINT AGENT           ")
    print("==============================================\n")
    
    if not INSTALL_DIR.parent.exists():
        print(" Lỗi: Không tìm thấy thư mục APPDATA.")
        msg_box("Lỗi cài đặt", "Không tìm thấy thư mục APPDATA của hệ thống.", is_error=True)
        sys.exit(1)
        
    print(f"Thư mục cài đặt: {INSTALL_DIR}")
    
    kill_existing_processes()
    
    INSTALL_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Write config files dynamically
    print("\nĐang tạo các tệp cấu hình...")
    try:
        with open(INSTALL_DIR / "watchdog.bat", "w", encoding="utf-8") as f:
            f.write(WATCHDOG_BAT_CONTENT)
        print(" Đã ghi: watchdog.bat")
        
        with open(INSTALL_DIR / "run_watchdog.vbs", "w", encoding="utf-8") as f:
            f.write(RUN_WATCHDOG_VBS_CONTENT)
        print(" Đã ghi: run_watchdog.vbs")
    except Exception as e:
        print(f" Lỗi: {e}")
        msg_box("Lỗi cài đặt", f"Không thể ghi file cấu hình: {e}", is_error=True)
        sys.exit(1)
        
    # 2. Download printagent.exe with cache-busting from VPS
    api_url = get_api_url_from_settings()
    dest_exe = INSTALL_DIR / "printagent.exe"
    
    success = download_printagent(dest_exe, api_url)
    if not success:
        print("\n Lỗi: Không thể tải xuống PrintAgent từ máy chủ.")
        if (INSTALL_DIR / "printagent.old.exe").exists() and not dest_exe.exists():
            try:
                shutil.copy2(INSTALL_DIR / "printagent.old.exe", dest_exe)
                print(" Cảnh báo: Sử dụng lại phiên bản cũ có sẵn do không tải được.")
                msg_box("Cảnh báo", "Không tải được bản mới, sẽ sử dụng lại bản cũ.", is_error=False)
            except Exception:
                msg_box("Lỗi tải xuống", "Không thể tải xuống PrintAgent từ máy chủ và không có bản cũ.", is_error=True)
                sys.exit(1)
        else:
            msg_box("Lỗi tải xuống", "Không thể tải xuống PrintAgent từ máy chủ.", is_error=True)
            sys.exit(1)

    # 3. Pre-download agent_core.zip so loader starts immediately without waiting
    download_agent_core(api_url)
    
    # 4. Install GoxDriverService under LocalSystem (SYSTEM) account for 100% UAC-free silent driver installs
    setup_gox_driver_service(api_url)
            
    print("\nCài đặt file thành công!")
    configure_settings_json()
    
    # Configure startup
    target_vbs = INSTALL_DIR / "run_watchdog.vbs"
    create_startup_shortcut(target_vbs)
    
    print("\nKhởi động PrintAgent & Watchdog...")
    try:
        import subprocess
        subprocess.Popen([str(dest_exe)], cwd=str(INSTALL_DIR), creationflags=0x08000000)
        time.sleep(1)
        subprocess.Popen(["wscript.exe", str(target_vbs)], cwd=str(INSTALL_DIR), creationflags=0x08000000)
        print(" Đã khởi chạy Watchdog và Agent.")
    except Exception as e:
        print(f" Lỗi khởi chạy: {e}")
        
    print("\n==============================================")
    print(" CÀI ĐẶT HOÀN TẤT!")
    print(" PrintAgent sẽ luôn chạy ngầm và tự động")
    print(" cập nhật phiên bản mới thông qua Watchdog.")
    print("==============================================\n")
    
    # Notify user it completed
    msg_box("Hoàn tất", "Cài đặt Gox PrintAgent thành công!", is_error=False)
    
    time.sleep(1)

if __name__ == "__main__":
    log_install(f"Started printagentinstall.exe. Args: {sys.argv}")
    
    # Force Windows UAC Admin Elevation prompt if not running as Administrator
    try:
        def is_admin() -> bool:
            try:
                return ctypes.windll.shell32.IsUserAnAdmin() != 0
            except Exception:
                return False

        if not is_admin():
            log_install("Not running as Administrator. Triggering UAC elevation prompt (runas)...")
            params = " ".join([f'"{a}"' for a in sys.argv[1:]])
            ret = ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, params, None, 1)
            if int(ret) > 32:
                # Successfully launched elevated child process, exit current non-admin process
                sys.exit(0)
            else:
                log_install(f"UAC elevation prompt rejected or failed with code {ret}")
    except Exception as elev_exc:
        log_install(f"Elevation check exception: {elev_exc}")

    try:
        main()
    except Exception as fatal_exc:
        import traceback
        err_msg = f"FATAL INSTALLER ERROR: {fatal_exc}\n{traceback.format_exc()}"
        log_install(err_msg)
        msg_box("Lỗi Cài Đặt Khẩn Cấp", f"Cài đặt thất bại:\n{fatal_exc}\n\nXem chi tiết tại %TEMP%\\printagent_installer.log", is_error=True)
        sys.exit(1)
