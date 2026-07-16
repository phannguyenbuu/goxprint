import os
import sys
import gc
import time
import uuid
import queue
import logging
import hashlib
import threading
import subprocess
import platform
import winreg
from datetime import datetime, timezone
import tkinter as tk
from tkinter import ttk, messagebox
from tkinter.scrolledtext import ScrolledText
from pathlib import Path
import requests
import fitz  # PyMuPDF
from PIL import Image, ImageCms, ImageDraw
import pystray
import psutil

VERSION = "1.5.2"
DEFAULT_SERVER_URL = "https://render.toolxprint.com"

# Configure directories and paths in %TEMP%/Toolx
temp_root = os.environ.get("TEMP") or os.environ.get("TMP") or "C:\\Temp"
TOOLX_TEMP_DIR = Path(temp_root) / "Toolx"
TOOLX_TEMP_DIR.mkdir(parents=True, exist_ok=True)

LOGS_DIR = TOOLX_TEMP_DIR / "logs"
LOGS_DIR.mkdir(parents=True, exist_ok=True)

STOUT_FILE = LOGS_DIR / "stout.txt"
STERROR_FILE = LOGS_DIR / "sterror.txt"
SETTINGS_FILE = TOOLX_TEMP_DIR / "settings.json"

# Logging setup with filtering
class MaxLevelFilter(logging.Filter):
    def __init__(self, max_level):
        super().__init__()
        self.max_level = max_level
    def filter(self, record):
        return record.levelno < self.max_level

root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)
formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")

# stout handler (stout.txt) - filters out error/critical logs
try:
    stdout_handler = logging.FileHandler(STOUT_FILE, encoding="utf-8")
    stdout_handler.setLevel(logging.INFO)
    stdout_handler.addFilter(MaxLevelFilter(logging.ERROR))
    stdout_handler.setFormatter(formatter)
    root_logger.addHandler(stdout_handler)
except Exception as e:
    print(f"Warning: Failed to initialize stout handler: {e}", file=sys.stderr)

# stderr handler (sterror.txt) - only error/critical logs
try:
    stderr_handler = logging.FileHandler(STERROR_FILE, encoding="utf-8")
    stderr_handler.setLevel(logging.ERROR)
    stderr_handler.setFormatter(formatter)
    root_logger.addHandler(stderr_handler)
except Exception as e:
    print(f"Warning: Failed to initialize sterror handler: {e}", file=sys.stderr)

# console stream handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)
root_logger.addHandler(console_handler)

logger = logging.getLogger("ToolxAgent")

def load_settings():
    default_settings = {
        "server_url": DEFAULT_SERVER_URL,
        "ram_limit_gb": 96.0
    }
    if not SETTINGS_FILE.exists():
        try:
            with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
                import json
                json.dump(default_settings, f, indent=2)
        except Exception as e:
            logger.error(f"Cannot write default settings to {SETTINGS_FILE}: {e}")
        return default_settings
    
    try:
        with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
            import json
            data = json.load(f)
            if isinstance(data, dict):
                # merge with default settings
                for k, v in default_settings.items():
                    if k not in data:
                        data[k] = v
                return data
    except Exception as e:
        logger.error(f"Cannot read settings from {SETTINGS_FILE}: {e}")
    return default_settings

def save_settings(server_url, ram_limit_gb):
    try:
        import json
        data = {
            "server_url": str(server_url).strip(),
            "ram_limit_gb": float(ram_limit_gb)
        }
        with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        logger.info(f"Saved settings to {SETTINGS_FILE}")
    except Exception as e:
        logger.error(f"Cannot save settings to {SETTINGS_FILE}: {e}")

REG_PATH = r"Software\Microsoft\Windows\CurrentVersion\Run"

def get_autostart_state():
    if sys.platform != "win32":
        return False
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, REG_PATH, 0, winreg.KEY_READ) as key:
            winreg.QueryValueEx(key, "ToolxAgent")
            return True
    except FileNotFoundError:
        return False
    except Exception:
        return False

def toggle_autostart(enabled):
    if sys.platform != "win32":
        return
    try:
        current_exe = sys.executable
        exe_path = str(Path(current_exe).resolve())
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, REG_PATH, 0, winreg.KEY_SET_VALUE) as key:
            if enabled:
                winreg.SetValueEx(key, "ToolxAgent", 0, winreg.REG_SZ, exe_path)
                logger.info(f"Registry startup entry set to: {exe_path}")
            else:
                try:
                    winreg.DeleteValue(key, "ToolxAgent")
                    logger.info("Registry startup entry removed.")
                except FileNotFoundError:
                    pass
    except Exception as e:
        logger.error(f"Cannot update registry autostart: {e}")



def find_icc_profile_path(profile_name, default_name):
    if profile_name == 'None':
        return None
    if not profile_name:
        profile_name = default_name
        
    candidates = [
        Path(get_asset_path(profile_name)),
        Path(r"C:\Windows\System32\spool\drivers\color") / profile_name,
        Path(r"C:\Program Files (x86)\Common Files\Adobe\Color\Profiles\Recommended") / profile_name,
        Path(r"C:\Program Files (x86)\Common Files\Adobe\Color\Profiles") / profile_name,
    ]
    
    if not Path(profile_name).suffix:
        for ext in [".icc", ".icm"]:
            name_with_ext = f"{profile_name}{ext}"
            candidates.extend([
                Path(get_asset_path(name_with_ext)),
                Path(r"C:\Windows\System32\spool\drivers\color") / name_with_ext,
                Path(r"C:\Program Files (x86)\Common Files\Adobe\Color\Profiles\Recommended") / name_with_ext,
                Path(r"C:\Program Files (x86)\Common Files\Adobe\Color\Profiles") / name_with_ext,
            ])
            
    for cand in candidates:
        if cand.exists():
            return cand
            
    fallback = Path(get_asset_path(default_name))
    if fallback.exists():
        return fallback
        
    return None

def generate_and_start_watchdog():
    if sys.platform != "win32":
        return
    try:
        # Delete old watchdog files to completely remove them
        bat_path = TOOLX_TEMP_DIR / "toolx_watchdog.bat"
        vbs_path = TOOLX_TEMP_DIR / "run_watchdog.vbs"
        try:
            if bat_path.exists():
                bat_path.unlink()
            if vbs_path.exists():
                vbs_path.unlink()
        except Exception:
            pass

        # Kill any existing toolx watchdog processes to prevent cascading instances
        cleaned = False
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                cmdline = proc.info.get('cmdline') or []
                cmdline_str = " ".join(cmdline).lower()
                if "toolx_watchdog" in cmdline_str or "run_watchdog.vbs" in cmdline_str:
                    if proc.pid != os.getpid():
                        proc.kill()
                        cleaned = True
            except Exception:
                pass
        if cleaned:
            logger.info("Old watchdog processes cleaned up successfully.")
    except Exception as e:
        logger.error(f"Failed to clean up watchdog: {e}")

def get_asset_path(filename):
    if getattr(sys, 'frozen', False):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base_path, "assets", filename)

class TkLogHandler(logging.Handler):
    def __init__(self, log_queue):
        super().__init__()
        self.log_queue = log_queue
    
    def emit(self, record):
        log_entry = self.format(record) + "\n"
        self.log_queue.put(log_entry)

class ToolxAgentApp:
    def __init__(self, root):
        self.root = root
        self.root.title(f"Toolx Render Agent - v{VERSION}")
        self.root.geometry("800x600")
        self.root.minsize(700, 500)
        
        # Dark Theme Palette
        self.bg_color = "#0f172a"
        self.panel_color = "#1e293b"
        self.text_color = "#f8fafc"
        self.accent_color = "#6366f1"
        self.border_color = "#334155"
        
        self.root.configure(bg=self.bg_color)
        
        settings = load_settings()
        self.server_url = tk.StringVar(value=settings.get("server_url", DEFAULT_SERVER_URL))
        self.ram_limit_gb = tk.DoubleVar(value=settings.get("ram_limit_gb", 96.0))
        self.autostart_var = tk.BooleanVar(value=get_autostart_state())
        self.is_polling = False
        self.log_queue = queue.Queue()
        self.current_job_id = None
        self.tray_icon = None
        
        # Intercept window close to terminate immediately
        self.root.protocol("WM_DELETE_WINDOW", self.exit_app)
        
        # Setup logging redirection
        self.log_handler = TkLogHandler(self.log_queue)
        self.log_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s", "%H:%M:%S"))
        logger.addHandler(self.log_handler)
        
        self.setup_ui()
        self.check_log_queue()
        
        # Start System Tray in background thread
        threading.Thread(target=self.create_tray_icon, daemon=True).start()
        
        # Clean up old Watchdog leftovers on startup
        generate_and_start_watchdog()
        
        # Start Diagnostics thread
        threading.Thread(target=self.diagnostics_worker, daemon=True).start()
        
        # Auto-start polling on launch
        self.toggle_polling()
        
    def hide_window(self):
        self.root.withdraw()
        logger.info("Ứng dụng chạy ẩn dưới khay hệ thống.")

    def show_window(self):
        self.root.deiconify()
        self.root.lift()
        self.root.focus_force()

    def exit_app(self):
        self.is_polling = False
        if self.tray_icon:
            try:
                self.tray_icon.stop()
            except Exception:
                pass
        try:
            self.root.destroy()
        except Exception:
            pass
        os._exit(0)

    def create_tray_icon(self):
        def create_tray_image():
            img = Image.new("RGBA", (64, 64), color="#6366f1")
            draw = ImageDraw.Draw(img)
            draw.line([(16, 16), (48, 48)], fill="white", width=6)
            draw.line([(48, 16), (16, 48)], fill="white", width=6)
            return img

        try:
            menu = pystray.Menu(
                pystray.MenuItem("Hiện giao diện", self.show_window),
                pystray.MenuItem("Kiểm tra Cập nhật", self.check_updates_manual),
                pystray.MenuItem("Thoát", self.exit_app)
            )
            self.tray_icon = pystray.Icon("ToolxAgent", create_tray_image(), f"Toolx Render Agent v{VERSION}", menu)
            self.tray_icon.run()
        except Exception as e:
            logger.error(f"Cannot initialize system tray: {e}")

    def diagnostics_worker(self):
        time.sleep(5)
        while True:
            try:
                server = self.server_url.get().strip().rstrip("/")
                
                stout_logs = ""
                if STOUT_FILE.exists():
                    try:
                        with open(STOUT_FILE, "r", encoding="utf-8", errors="ignore") as f:
                            stout_logs = "".join(f.readlines()[-100:])
                    except Exception:
                        pass
                
                sterror_logs = ""
                if STERROR_FILE.exists():
                    try:
                        with open(STERROR_FILE, "r", encoding="utf-8", errors="ignore") as f:
                            sterror_logs = "".join(f.readlines()[-100:])
                    except Exception:
                        pass
                
                settings_json = ""
                if SETTINGS_FILE.exists():
                    try:
                        settings_json = SETTINGS_FILE.read_text(encoding="utf-8")
                    except Exception:
                        pass

                cpu_usage = psutil.cpu_percent()
                mem = psutil.virtual_memory()
                ram_used_gb = mem.used / (1024**3)
                ram_total_gb = mem.total / (1024**3)
                
                # Query disk spaces
                try:
                    d_disk = psutil.disk_usage('D:')
                    d_total_gb = d_disk.total / (1024**3)
                    d_free_gb = d_disk.free / (1024**3)
                except Exception:
                    d_total_gb = 0.0
                    d_free_gb = 0.0
                    
                try:
                    c_disk = psutil.disk_usage('C:')
                    c_total_gb = c_disk.total / (1024**3)
                    c_free_gb = c_disk.free / (1024**3)
                except Exception:
                    c_total_gb = 0.0
                    c_free_gb = 0.0
                
                # Query Pagefile Usage and Settings
                pf_allocated = 0
                pf_used = 0
                pf_initial = 0
                pf_max = 0
                try:
                    import subprocess
                    import json
                    creationflags = 0
                    if sys.platform == 'win32':
                        creationflags = subprocess.CREATE_NO_WINDOW
                    
                    # 1. PageFileUsage
                    res = subprocess.run(
                        ['powershell', '-Command', 'Get-CimInstance Win32_PageFileUsage | Select-Object CurrentUsage, AllocatedBaseSize | ConvertTo-Json'],
                        capture_output=True, text=True, creationflags=creationflags
                    )
                    if res.returncode == 0 and res.stdout.strip():
                        data_pf = json.loads(res.stdout)
                        if isinstance(data_pf, list) and len(data_pf) > 0:
                            data_pf = data_pf[0]
                        pf_allocated = data_pf.get('AllocatedBaseSize', 0)
                        pf_used = data_pf.get('CurrentUsage', 0)
                        
                    # 2. PageFileSetting
                    res = subprocess.run(
                        ['powershell', '-Command', 'Get-CimInstance Win32_PageFileSetting | Select-Object InitialSize, MaximumSize | ConvertTo-Json'],
                        capture_output=True, text=True, creationflags=creationflags
                    )
                    if res.returncode == 0 and res.stdout.strip():
                        data_set = json.loads(res.stdout)
                        if isinstance(data_set, list) and len(data_set) > 0:
                            data_set = data_set[0]
                        pf_initial = data_set.get('InitialSize', 0)
                        pf_max = data_set.get('MaximumSize', 0)
                except Exception:
                    pass
                
                payload = {
                    "hostname": platform.node(),
                    "agent_version": VERSION,
                    "core_version": os.environ.get("AGENT_CORE_VERSION", VERSION),
                    "cpu_usage": cpu_usage,
                    "ram_used_gb": round(ram_used_gb, 2),
                    "ram_total_gb": round(ram_total_gb, 2),
                    "stout_logs": stout_logs,
                    "sterror_logs": sterror_logs,
                    "settings_json": settings_json,
                    "system_info": {
                        "os": platform.system() + " " + platform.release(),
                        "processor": platform.processor(),
                        "python_version": platform.python_version(),
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "disk_c_total_gb": round(c_total_gb, 2),
                        "disk_c_free_gb": round(c_free_gb, 2),
                        "disk_d_total_gb": round(d_total_gb, 2),
                        "disk_d_free_gb": round(d_free_gb, 2),
                        "pagefile_allocated_mb": pf_allocated,
                        "pagefile_used_mb": pf_used,
                        "pagefile_initial_mb": pf_initial,
                        "pagefile_max_mb": pf_max
                    }
                }
                
                requests.post(f"{server}/api/agent/diagnose", json=payload, timeout=10)
            except Exception as e:
                logger.debug(f"Diagnostics upload failed: {e}")
                
            time.sleep(60)

    def setup_ui(self):
        # Configure style
        style = ttk.Style()
        style.theme_use("clam")
        style.configure(".", background=self.bg_color, foreground=self.text_color, bordercolor=self.border_color)
        style.configure("TLabel", background=self.bg_color, foreground=self.text_color)
        style.configure("TButton", background=self.panel_color, foreground=self.text_color, borderwidth=1, bordercolor=self.border_color)
        style.map("TButton", background=[("active", self.accent_color)])
        style.configure("TCombobox", fieldbackground=self.panel_color, background=self.bg_color, foreground=self.text_color)
        
        # Main notebook (Tab control)
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Tab 1: Vector Render
        self.render_tab = tk.Frame(self.notebook, bg=self.bg_color)
        self.notebook.add(self.render_tab, text="Vector Render")
        
        # Top Config Panel
        config_frame = tk.LabelFrame(self.render_tab, text=" Cấu hình kết nối & Tài nguyên ", bg=self.bg_color, fg=self.text_color, font=("Segoe UI", 10, "bold"), bd=1, relief=tk.SOLID)
        config_frame.pack(fill=tk.X, padx=15, pady=15)
        
        # Row 1: Server URL
        tk.Label(config_frame, text="Server URL:", bg=self.bg_color, fg=self.text_color).grid(row=0, column=0, sticky=tk.W, padx=10, pady=8)
        self.server_entry = tk.Entry(config_frame, textvariable=self.server_url, width=45, bg=self.panel_color, fg=self.text_color, insertbackground=self.text_color, bd=1, relief=tk.SOLID)
        self.server_entry.grid(row=0, column=1, sticky=tk.W, padx=10, pady=8)
        
        # Row 2: RAM Limit Selector
        tk.Label(config_frame, text="Giới hạn RAM dùng:", bg=self.bg_color, fg=self.text_color).grid(row=1, column=0, sticky=tk.W, padx=10, pady=8)
        ram_options = [8.0, 16.0, 32.0, 64.0, 96.0, 120.0]
        self.ram_combo = ttk.Combobox(config_frame, textvariable=self.ram_limit_gb, values=ram_options, state="readonly", width=12)
        self.ram_combo.grid(row=1, column=1, sticky=tk.W, padx=10, pady=8)
        tk.Label(config_frame, text="GB (Tối ưu hóa render tốc độ cao)", bg=self.bg_color, fg="#94a3b8").grid(row=1, column=2, sticky=tk.W, padx=2, pady=8)
        
        # Row 3: Autostart Checkbox
        self.autostart_chk = tk.Checkbutton(
            config_frame, 
            text="Khởi động cùng Windows", 
            variable=self.autostart_var, 
            command=lambda: toggle_autostart(self.autostart_var.get()), 
            bg=self.bg_color, 
            fg=self.text_color, 
            selectcolor=self.panel_color, 
            activebackground=self.bg_color, 
            activeforeground=self.text_color,
            cursor="hand2"
        )
        self.autostart_chk.grid(row=2, column=0, columnspan=2, sticky=tk.W, padx=10, pady=8)
        
        # Row 4: Action Buttons
        button_frame = tk.Frame(config_frame, bg=self.bg_color)
        button_frame.grid(row=3, column=0, columnspan=3, sticky=tk.W, padx=10, pady=12)
        
        self.poll_btn = tk.Button(button_frame, text="Bắt đầu Polling", command=self.toggle_polling, bg=self.accent_color, fg="white", font=("Segoe UI", 9, "bold"), bd=0, padx=15, pady=6, cursor="hand2")
        self.poll_btn.pack(side=tk.LEFT, padx=5)
        
        self.update_btn = tk.Button(button_frame, text="Kiểm tra Cập nhật", command=self.check_updates_manual, bg=self.panel_color, fg=self.text_color, font=("Segoe UI", 9), bd=1, relief=tk.SOLID, padx=15, pady=5, cursor="hand2")
        self.update_btn.pack(side=tk.LEFT, padx=5)

        self.restart_btn = tk.Button(button_frame, text="Khởi động lại", command=self.hot_restart, bg=self.panel_color, fg=self.text_color, font=("Segoe UI", 9), bd=1, relief=tk.SOLID, padx=15, pady=5, cursor="hand2")
        self.restart_btn.pack(side=tk.LEFT, padx=5)
        
        # Polling/Connection Status Label
        self.status_label = tk.Label(config_frame, text="Trạng thái: Đang dừng", bg=self.bg_color, fg="#ef4444", font=("Segoe UI", 9, "bold"))
        self.status_label.grid(row=0, column=2, sticky=tk.E, padx=20, pady=8)
        
        # Log Panel
        log_frame = tk.LabelFrame(self.render_tab, text=" Nhật ký hoạt động ", bg=self.bg_color, fg=self.text_color, font=("Segoe UI", 10, "bold"), bd=1, relief=tk.SOLID)
        log_frame.pack(fill=tk.BOTH, expand=True, padx=15, pady=10)
        
        self.log_text = ScrolledText(log_frame, bg="#020617", fg="#38bdf8", insertbackground=self.text_color, font=("Consolas", 10), bd=0)
        self.log_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
    def check_log_queue(self):
        while not self.log_queue.empty():
            try:
                log_entry = self.log_queue.get_nowait()
                self.log_text.insert(tk.END, log_entry)
                self.log_text.see(tk.END)
            except queue.Empty:
                break
        self.root.after(100, self.check_log_queue)
        
    def toggle_polling(self):
        save_settings(self.server_url.get(), self.ram_limit_gb.get())
        if self.is_polling:
            self.is_polling = False
            self.poll_btn.configure(text="Bắt đầu Polling", bg=self.accent_color)
            self.status_label.configure(text="Trạng thái: Đang dừng", fg="#ef4444")
            logger.info("Đã dừng hàng đợi polling.")
        else:
            self.is_polling = True
            self.poll_btn.configure(text="Dừng Polling", bg="#ef4444")
            self.status_label.configure(text="Trạng thái: Đang hoạt động", fg="#22c55e")
            logger.info("Bắt đầu hàng đợi polling từ server...")
            
            # Clear pending/rendering tasks on server when agent starts polling
            try:
                server = self.server_url.get().strip().rstrip("/")
                res = requests.post(f"{server}/api/agent/clear_pending", timeout=10)
                if res.status_code == 200:
                    count = res.json().get("count", 0)
                    if count > 0:
                        logger.info(f"Đã dọn dẹp {count} tác vụ cũ chưa hoàn thành từ hàng đợi.")
            except Exception as e:
                logger.warning(f"Không thể dọn dẹp hàng đợi cũ trên server: {e}")
                
            # Start background polling thread
            threading.Thread(target=self.polling_worker, daemon=True).start()
            
    def polling_worker(self):
        while self.is_polling:
            try:
                server = self.server_url.get().strip().rstrip("/")
                ram = self.ram_limit_gb.get()
                
                # Check for updates or poll for job
                res = requests.get(f"{server}/api/agent/poll", params={"ram_gb": ram}, timeout=10)
                if res.status_code == 200:
                    data = res.json()
                    command = data.get("command")
                    if command == "maximize_pagefile":
                        threading.Thread(target=self.execute_maximize_pagefile, daemon=True).start()
                    elif command == "restart_agent":
                        self.root.after(0, self.hot_restart)
                        
                    job = data.get("job")
                    if job:
                        self.process_job(job)
                else:
                    logger.warning(f"Không thể kết nối tới server. Mã lỗi: {res.status_code}")
            except Exception as e:
                logger.error(f"Lỗi khi polling: {e}")
                
            time.sleep(3) # Wait 3 seconds before next poll
            
    def hot_restart(self):
        try:
            import sys
            import os
            import subprocess
            logger.info("Đang khởi động lại Agent bằng tiến trình mới...")
            
            # Start new process
            if getattr(sys, 'frozen', False):
                subprocess.Popen([sys.executable] + sys.argv[1:])
            else:
                subprocess.Popen([sys.executable] + sys.argv)
                
            try:
                if self.tray_icon:
                    self.tray_icon.stop()
            except Exception:
                pass
                
            self.root.destroy()
            sys.exit(0)
        except Exception as e:
            logger.error(f"Lỗi khi thực hiện hot_restart: {e}")

    def execute_maximize_pagefile(self):
        logger.info("Đang bắt đầu thực thi tối đa hóa cấu hình Pagefile (Virtual Memory)...")
        import shutil
        import os
        import subprocess
        
        # 1. Select the drive with the most free space (prefer D: if available and has > 150GB free, else C:)
        drive = 'C:\\'
        if os.path.exists('D:\\'):
            try:
                total, used, free = shutil.disk_usage('D:\\')
                if free > 150 * (1024**3):
                    drive = 'D:\\'
            except Exception:
                pass
                
        logger.info(f"Đã chọn ổ đĩa {drive} để cấu hình Pagefile (dung lượng lớn).")
        
        # 2. Write a PowerShell script to set pagefile
        ps_file = TOOLX_TEMP_DIR / "set_pagefile.ps1"
        # We will request 64GB initial size (65536) and 128GB maximum size (131072)
        ps_code = f"""
$sys = Get-CimInstance Win32_ComputerSystem
if ($sys.AutomaticManagedPagefile) {{
    $sys.AutomaticManagedPagefile = $false
    Set-CimInstance -InputObject $sys
}}
Get-CimInstance Win32_PageFileSetting | Remove-CimInstance
New-CimInstance -ClassName Win32_PageFileSetting -Property @{{Name="{drive}pagefile.sys"; InitialSize=65536; MaximumSize=131072}}
"""
        try:
            ps_file.write_text(ps_code, encoding="utf-8")
            
            # Execute powershell script
            cmd = ["powershell", "-ExecutionPolicy", "Bypass", "-File", str(ps_file)]
            creationflags = 0
            if sys.platform == 'win32':
                creationflags = subprocess.CREATE_NO_WINDOW
                
            res = subprocess.run(cmd, capture_output=True, text=True, creationflags=creationflags)
            if res.returncode == 0:
                logger.info(f"[THÀNH CÔNG] Đã tăng cấu hình Pagefile lên 64GB - 128GB trên ổ {drive} thành công!")
                logger.info("Vui lòng KHỞI ĐỘNG LẠI (Restart) máy chủ để các thay đổi có hiệu lực.")
            else:
                err_output = res.stderr or res.stdout
                logger.error(f"[THẤT BẠI] Không thể thay đổi Pagefile: {err_output}")
                logger.error("Gợi ý: Cần quyền Administrator. Hãy chạy ToolxAgent bằng cách chuột phải chọn 'Run as Administrator'.")
        except Exception as e:
            logger.error(f"Lỗi khi thực thi script thay đổi Pagefile: {e}")
        finally:
            if ps_file.exists():
                try: os.remove(ps_file)
                except: pass
    def convert_cad_to_pdf(self, cad_path: Path, pdf_path: Path):
        import subprocess
        import os
        import glob
        
        accore_exe = None
        paths = [
            r"C:\Program Files\Autodesk\AutoCAD 2022\accoreconsole.exe",
            r"C:\Program Files\Autodesk\AutoCAD 2023\accoreconsole.exe",
            r"C:\Program Files\Autodesk\AutoCAD 2024\accoreconsole.exe",
            r"C:\Program Files\Autodesk\AutoCAD 2025\accoreconsole.exe",
        ]
        for p in paths:
            if os.path.exists(p):
                accore_exe = p
                break
        if not accore_exe:
            found = glob.glob(r"C:\Program Files\Autodesk\AutoCAD *\accoreconsole.exe")
            if found:
                accore_exe = found[0]
                
        if not accore_exe:
            raise FileNotFoundError("Không tìm thấy accoreconsole.exe của AutoCAD trên hệ thống! Vui lòng cài đặt AutoCAD.")
            
        logger.info(f"Sử dụng AutoCAD Core Console tại: {accore_exe}")
        
        # Command sequence matching AutoCAD's prompts
        commands = [
            "FILEDIA",
            "0",
            "-PLOT",
            "y",
            "Model",
            "DWG To PDF.pc3",
            "ISO full bleed A3 (420.00 x 297.00 MM)",
            "Millimeters",
            "Landscape",
            "No",
            "Extents",
            "Fit",
            "Center",
            "Yes",
            ".",  # Use '.' for no plot style (color)
            "Yes",
            "As",  # Shade plot: As displayed
            str(pdf_path),  # Output PDF path
            "No",  # Save changes to page setup?
            "Yes",  # Proceed with plot?
            "quit",
            "y"
        ]
        
        full_input = "\n".join(commands) + "\n"
        
        creationflags = 0
        if sys.platform == 'win32':
            creationflags = subprocess.CREATE_NO_WINDOW
            
        try:
            logger.info(f"Đang chạy lệnh AutoCAD -PLOT cho tệp: {cad_path.name} -> {pdf_path.name}")
            proc = subprocess.Popen(
                [accore_exe, "/i", str(cad_path)],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                creationflags=creationflags
            )
            stdout, stderr = proc.communicate(input=full_input, timeout=45)
            
            if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 0:
                logger.info(f"Chuyển đổi CAD sang PDF thành công: {pdf_path.name} ({os.path.getsize(pdf_path)} bytes)")
                return True
            else:
                logger.error(f"Lỗi AutoCAD output:\n{stdout}\n{stderr}")
                raise RuntimeError("AutoCAD không tạo ra tệp PDF kết quả. Có thể bản vẽ trống hoặc bị lỗi.")
        except subprocess.TimeoutExpired:
            logger.error("AutoCAD Core Console bị treo (Timeout).")
            raise RuntimeError("AutoCAD Core Console bị treo (Timeout) khi chuyển đổi tệp CAD.")
            
    def process_job(self, job):
        job_id = job.get("id")
        filename = job.get("filename")
        dpi = job.get("dpi")
        colorspace = job.get("colorspace", "cmyk")
        compression = job.get("compression", "lzw")
        profile = job.get("profile", "")
        max_pixels = job.get("max_pixels", 1000000000)
        download_url = job.get("download_url")
        convert_to_pdf = job.get("convert_to_pdf", False)
        
        logger.info(f"Phát hiện tác vụ mới: {filename} (ID: {job_id}) - Độ phân giải: {dpi} DPI, Hệ màu: {colorspace}, Nén: {compression}, Profile: {profile}")
        
        server = self.server_url.get().strip().rstrip("/")
        download_full_url = f"{server}{download_url}"
        
        # Temporary directories
        temp_dir = TOOLX_TEMP_DIR / "temp"
        temp_dir.mkdir(parents=True, exist_ok=True)
        
        pdf_path = temp_dir / f"{job_id}.pdf"
        tiff_path = temp_dir / f"{job_id}.tif"
        rendered_pdf_path = temp_dir / f"{job_id}_rendered.pdf"
        preview_path = temp_dir / f"{job_id}.jpg"
        
        try:
            # Step 1: Download the original file
            logger.info("Đang tải tệp tin gốc...")
            res = requests.get(download_full_url, timeout=60)
            res.raise_for_status()
            
            ext = Path(filename).suffix.lower()
            if ext in [".dxf", ".dwg"]:
                cad_input_path = temp_dir / f"{job_id}{ext}"
                cad_input_path.write_bytes(res.content)
                logger.info(f"Phát hiện định dạng CAD ({ext}). Đang chuyển đổi sang PDF bằng AutoCAD...")
                self.convert_cad_to_pdf(cad_input_path, pdf_path)
                
                # If they want PDF output, skip rasterization and preserve vector PDF
                if convert_to_pdf:
                    logger.info("Chế độ xuất PDF: Bỏ qua bước chuyển ảnh (rasterize), giữ nguyên vector PDF...")
                    rendered_pdf_path.write_bytes(pdf_path.read_bytes())
                    
                    # Generate a quick preview image for the UI
                    try:
                        logger.info("Tạo ảnh xem trước (JPEG preview) từ vector PDF...")
                        doc = fitz.open(str(pdf_path))
                        page = doc[0]
                        pix = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), colorspace=fitz.csRGB)
                        img = Image.frombuffer("RGB", [pix.width, pix.height], pix.samples_mv, "raw", "RGB", 0, 1)
                        img.thumbnail((800, 600))
                        img.save(str(preview_path), "JPEG", quality=80)
                        doc.close()
                    except Exception as pe:
                        logger.warning(f"Không thể tạo ảnh preview: {pe}")
                        
                    success = True
                else:
                    # They want TIFF output, proceed with standard rasterization
                    logger.info("Chế độ xuất TIFF: Bắt đầu xử lý Vector Render sang TIFF...")
                    success = self.render_pdf_to_tiff(
                        pdf_path=pdf_path,
                        tiff_path=tiff_path,
                        rendered_pdf_path=rendered_pdf_path,
                        preview_path=preview_path,
                        dpi=dpi,
                        colorspace=colorspace,
                        compression=compression,
                        profile=profile,
                        max_pixels=max_pixels,
                        convert_to_pdf=convert_to_pdf
                    )
            else:
                pdf_path.write_bytes(res.content)
                
                # Step 2: Standard PDF Render
                logger.info("Bắt đầu xử lý Vector Render...")
                success = self.render_pdf_to_tiff(
                    pdf_path=pdf_path,
                    tiff_path=tiff_path,
                    rendered_pdf_path=rendered_pdf_path,
                    preview_path=preview_path,
                    dpi=dpi,
                    colorspace=colorspace,
                    compression=compression,
                    profile=profile,
                    max_pixels=max_pixels,
                    convert_to_pdf=convert_to_pdf
                )
            
            if success:
                logger.info("Render hoàn thành. Đang tải kết quả lên server...")
                # Step 3: Upload files back
                upload_file_path = rendered_pdf_path if convert_to_pdf else tiff_path
                upload_filename = f"{job_id}.pdf" if convert_to_pdf else f"{job_id}.tif"
                upload_mimetype = "application/pdf" if convert_to_pdf else "image/tiff"
                
                with open(upload_file_path, "rb") as tiff_f:
                    files = {"tiff": (upload_filename, tiff_f, upload_mimetype)}
                    
                    # Optional preview upload
                    preview_f = None
                    if preview_path.exists():
                        preview_f = open(preview_path, "rb")
                        files["preview"] = (f"{job_id}.jpg", preview_f, "image/jpeg")
                        
                    try:
                        upload_res = requests.post(f"{server}/api/agent/upload/{job_id}", files=files, timeout=120)
                        upload_res.raise_for_status()
                        logger.info(f"Tác vụ {filename} đã xử lý xong và đồng bộ thành công!")
                    finally:
                        if preview_f:
                            preview_f.close()
            else:
                raise RuntimeError("Lỗi trong quá trình render PDF sang TIFF.")
                
        except Exception as e:
            logger.error(f"Lỗi khi xử lý tác vụ {job_id}: {e}")
            try:
                # Notify server of failure
                requests.post(f"{server}/api/agent/status/{job_id}", json={
                    "status": "failed",
                    "error_message": str(e)
                }, timeout=10)
            except Exception as se:
                logger.error(f"Không thể gửi thông báo lỗi tới server: {se}")
        finally:
            # Clean up local temporary files
            for p in [pdf_path, tiff_path, rendered_pdf_path, preview_path]:
                if p.exists():
                    try:
                        p.unlink()
                    except Exception:
                        pass
            # Also clean up any CAD files
            for ext in [".dxf", ".dwg"]:
                p = temp_dir / f"{job_id}{ext}"
                if p.exists():
                    try:
                        p.unlink()
                    except Exception:
                        pass
            gc.collect()

    def render_pdf_to_tiff(self, pdf_path, tiff_path, rendered_pdf_path, preview_path, dpi, colorspace, compression, profile, max_pixels, convert_to_pdf):
        t0 = time.time()
        
        # Configure Pillow for large images
        Image.MAX_IMAGE_PIXELS = None
        
        # Open PDF page first to determine page size and calculated pixels
        logger.info(f"Nạp tệp tin PDF: {pdf_path}")
        doc = fitz.open(str(pdf_path))
        page = doc[0]
        
        W_pt = page.rect.width
        H_pt = page.rect.height
        
        # Calculate target size using DPI
        # Points to inches conversion: 1 inch = 72 points
        W_calc = int((W_pt / 72.0) * dpi)
        H_calc = int((H_pt / 72.0) * dpi)
        total_pixels = W_calc * H_calc
        
        # Calculate perfect uniform scale
        scale = dpi / 72.0
        
        # Limit dimension to the safe maximum 65535 pixels per side
        MAX_DIMENSION = 65535
        if W_calc > MAX_DIMENSION or H_calc > MAX_DIMENSION:
            logger.warning(f"Kích thước yêu cầu ({W_calc}x{H_calc} px) vượt quá giới hạn tối đa ({MAX_DIMENSION} px/cạnh). Đang tự động giảm kích thước...")
            scale_w = MAX_DIMENSION / W_pt
            scale_h = MAX_DIMENSION / H_pt
            # Recalculate uniform scale based on safe height/width
            scale = min(scale_w, scale_h)
            
        W = int(W_pt * scale)
        H = int(H_pt * scale)
        
        logger.info(f"Kích thước render: {W} x {H} pixels (Tỷ lệ Scale đồng nhất: {scale:.6f})")
        
        # This guarantees scale_x == scale_y, forcing MuPDF to use the fast path and avoid Overly large image
        matrix = fitz.Matrix(scale, scale)
        
        # Step 1: Render page to RGB pixmap using MuPDF (in one single block to preserve global effects)
        logger.info("Bước 1/4: Đang render PDF sang RGB Pixmap (Khối duy nhất)...")
        pix = page.get_pixmap(matrix=matrix, colorspace=fitz.csRGB)
        doc.close()
        
        # Step 2: Wrap buffer in Pillow image without copy
        logger.info("Bước 2/4: Tạo tệp ảnh trong bộ nhớ (Pillow)...")
        img_rgb = Image.frombuffer("RGB", [pix.width, pix.height], pix.samples_mv, "raw", "RGB", 0, 1)
        
        # Step 2.5: Generate JPEG preview from RGB image (fast, lightweight)
        try:
            logger.info("Tạo ảnh xem trước (JPEG preview)...")
            preview_img = img_rgb.copy()
            preview_img.thumbnail((800, 600))
            preview_img.save(str(preview_path), "JPEG", quality=80)
            del preview_img
        except Exception as pe:
            logger.warning(f"Không thể tạo ảnh preview: {pe}")
            
        if colorspace == 'cmyk':
            # Step 3: RGB to CMYK transform using LittleCMS and profile
            logger.info("Bước 3/4: Đang chuyển đổi hệ màu sang CMYK bằng LittleCMS (Perceptual)...")
            cmyk_profile_path = find_icc_profile_path(profile, "JapanColor2001Coated.icc")
            srgb_profile_path = find_icc_profile_path("", "sRGB Color Space Profile.icm")
            
            if not cmyk_profile_path or not srgb_profile_path:
                raise FileNotFoundError("Không tìm thấy các tệp tin ICC color profiles bắt buộc!")
                
            logger.info(f"Sử dụng CMYK Profile: {cmyk_profile_path.name}")
            srgb_profile = ImageCms.ImageCmsProfile(str(srgb_profile_path))
            cmyk_profile = ImageCms.ImageCmsProfile(str(cmyk_profile_path))
            cmyk_profile_data = cmyk_profile_path.read_bytes()
                
            transform = ImageCms.buildTransform(
                srgb_profile,
                cmyk_profile,
                "RGB",
                "CMYK",
                renderingIntent=ImageCms.Intent.PERCEPTUAL
            )
            img_cmyk = ImageCms.applyTransform(img_rgb, transform)
            
            # Step 4: Save CMYK TIFF with embedded ICC Profile
            logger.info("Bước 4/4: Đang ghi tệp CMYK TIFF...")
            pillow_compression = 'tiff_lzw'
            if compression == 'deflate':
                pillow_compression = 'tiff_adobe_deflate'
            elif compression == 'none':
                pillow_compression = 'raw'
                
            img_cmyk.save(
                str(tiff_path),
                compression=pillow_compression,
                icc_profile=cmyk_profile_data
            )
            
            img_cmyk.close()
        else:
            # Save as RGB TIFF
            logger.info("Bước 3/4: Đang cấu hình hệ màu RGB...")
            srgb_profile_path = find_icc_profile_path(profile, "sRGB Color Space Profile.icm")
            
            srgb_profile_data = None
            if srgb_profile_path:
                logger.info(f"Sử dụng RGB Profile: {srgb_profile_path.name}")
                srgb_profile_data = srgb_profile_path.read_bytes()
            
            logger.info("Bước 4/4: Đang ghi tệp RGB TIFF...")
            pillow_compression = 'tiff_lzw'
            if compression == 'deflate':
                pillow_compression = 'tiff_adobe_deflate'
            elif compression == 'none':
                pillow_compression = 'raw'
                
            if srgb_profile_data:
                img_rgb.save(
                    str(tiff_path),
                    compression=pillow_compression,
                    icc_profile=srgb_profile_data
                )
            else:
                img_rgb.save(str(tiff_path), compression=pillow_compression)
                
        img_rgb.close()
        del pix
        gc.collect()
        
        # If convert_to_pdf is requested, package the generated TIFF into a PDF file
        if convert_to_pdf:
            logger.info("Đang chuyển đổi tệp TIFF sang PDF...")
            img_doc = fitz.open(str(tiff_path))
            pdf_bytes = img_doc.convert_to_pdf()
            rendered_pdf_path.write_bytes(pdf_bytes)
            img_doc.close()
        
        elapsed = time.time() - t0
        logger.info(f"Render hoàn tất trong {elapsed:.2f} giây! Kích thước file: {os.path.getsize(tiff_path) / (1024**2):.2f} MB")
        return True

    def check_updates_manual(self):
        logger.info("Đang kiểm tra cập nhật thủ công...")
        threading.Thread(target=self.updater_worker, daemon=True).start()
        
    def updater_worker(self):
        try:
            server = self.server_url.get().strip().rstrip("/")
            res = requests.get(f"{server}/api/agent/release", timeout=10)
            if res.status_code == 200:
                data = res.json()
                latest_version = data.get("version")
                update_available = data.get("update_available", False)
                
                if update_available and latest_version and latest_version != VERSION:
                    logger.info(f"Có bản cập nhật mới v{latest_version}!")
                    self.root.after(0, lambda: messagebox.showinfo(
                        "Cập nhật khả dụng",
                        f"Có phiên bản mới v{latest_version} khả dụng.\n\n"
                        "Bạn vui lòng truy cập trang web để tải xuống bản cập nhật mới nhất và thay thế thủ công."
                    ))
                else:
                    logger.info("Bạn đang sử dụng phiên bản mới nhất.")
                    self.root.after(0, lambda: messagebox.showinfo("Cập nhật", "Bạn đang sử dụng phiên bản mới nhất!"))
            else:
                logger.warning(f"Không thể kiểm tra cập nhật. Mã lỗi: {res.status_code}")
        except Exception as e:
            logger.error(f"Lỗi khi kiểm tra cập nhật: {e}")
            self.root.after(0, lambda: messagebox.showerror("Lỗi Cập nhật", f"Lỗi: {e}"))

def main():
    # Ensure Tkinter runs on main thread
    root = tk.Tk()
    app = ToolxAgentApp(root)
    root.mainloop()
    return 0

if __name__ == "__main__":
    main()
