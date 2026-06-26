import os
import sys
import shutil
import time
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

# --- CONFIGURATION ---
INSTALL_DIR = Path(os.environ.get("APPDATA", "")) / "GoxPrintAgent"
FILES_TO_EXTRACT = [
    "printagent.exe",
    "watchdog.bat",
    "run_watchdog.vbs"
]

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

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
    try:
        import psutil
        for proc in psutil.process_iter(['name']):
            try:
                name = proc.info['name']
                if name and name.lower() in ('printagent.exe', 'agent_loader.exe', 'printagent.bak.exe'):
                    proc.kill()
            except Exception:
                pass
    except Exception:
        os.system("taskkill /F /IM printagent.exe >nul 2>&1")
        os.system("taskkill /F /IM agent_loader.exe >nul 2>&1")
    time.sleep(2)
    
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

def main():
    print("==============================================")
    print("      TRÌNH CÀI ĐẶT GOX PRINT AGENT           ")
    print("==============================================\n")
    
    if not INSTALL_DIR.parent.exists():
        print(" Lỗi: Không tìm thấy thư mục APPDATA.")
        input("Nhấn Enter để thoát...")
        sys.exit(1)
        
    print(f"Thư mục cài đặt: {INSTALL_DIR}")
    
    kill_existing_processes()
    
    INSTALL_DIR.mkdir(parents=True, exist_ok=True)
    
    print("\nĐang giải nén các tệp tin...")
    success_count = 0
    for filename in FILES_TO_EXTRACT:
        src_path = resource_path(filename)
        dest_path = INSTALL_DIR / filename
        
        if os.path.exists(src_path):
            try:
                shutil.copy2(src_path, dest_path)
                print(f" Đã bung file: {filename}")
                success_count += 1
            except Exception as e:
                print(f" Lỗi khi giải nén {filename}: {e}")
        else:
            print(f" Lỗi: Không tìm thấy file gốc {filename} trong bộ cài.")
            
    if success_count < len(FILES_TO_EXTRACT):
        print("\n Lỗi: Không thể giải nén đầy đủ các thành phần.")
        input("Nhấn Enter để thoát...")
        sys.exit(1)
        
    print("\nCài đặt file thành công!")
    
    # Configure startup
    target_vbs = INSTALL_DIR / "run_watchdog.vbs"
    create_startup_shortcut(target_vbs)
    
    print("\nKhởi động PrintAgent Watchdog...")
    try:
        os.startfile(str(target_vbs))
        os.startfile(str(INSTALL_DIR / 'printagent.exe'))
        print(" Đã khởi chạy Watchdog và Agent.")
    except Exception as e:
        print(f" Lỗi khởi chạy: {e}")
        
    print("\n==============================================")
    print(" CÀI ĐẶT HOÀN TẤT!")
    print(" PrintAgent sẽ luôn chạy ngầm và tự động")
    print(" cập nhật phiên bản mới thông qua Watchdog.")
    print("==============================================\n")
    
    # Auto close after 3 seconds
    time.sleep(3)

if __name__ == "__main__":
    main()
