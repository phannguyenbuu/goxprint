from __future__ import annotations

import logging
import os
import threading
import sys
import socket
import re
from concurrent.futures import ThreadPoolExecutor
import tkinter as tk
from tkinter import ttk, messagebox, filedialog, simpledialog
from pathlib import Path
from typing import Any

from agent.config import AppConfig
from agent.utils.shares import ShareManager
from agent.services.api_client import APIClient, Printer


LOGGER = logging.getLogger(__name__)

class TextHandler(logging.Handler):
    def __init__(self, callback):
        super().__init__()
        self.callback = callback
    def emit(self, record):
        try:
            msg = self.format(record)
            self.callback(msg)
        except Exception:
            pass

_gui_lock = threading.Lock()
_gui_root: tk.Tk | None = None


def center_window(win: tk.Toplevel | tk.Tk, width: int, height: int) -> None:
    win.update_idletasks()
    screen_width = win.winfo_screenwidth()
    screen_height = win.winfo_screenheight()
    x = (screen_width // 2) - (width // 2)
    y = (screen_height // 2) - (height // 2)
    win.geometry(f"{width}x{height}+{x}+{y}")


class FtpDialog(tk.Toplevel):
    def __init__(self, parent: tk.Tk, title: str = "Add FTP Site", site_data: dict[str, Any] | None = None) -> None:
        super().__init__(parent)
        self.title(title)
        self.transient(parent)
        self.grab_set()
        
        self.result: dict[str, Any] | None = None
        self.site_data = site_data or {}
        
        # Configure layout
        self.resizable(False, False)
        
        frame = ttk.Frame(self, padding="15 15 15 15")
        frame.pack(fill=tk.BOTH, expand=True)
        
        # Site Name
        ttk.Label(frame, text="Site Name (Tên FTP):").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.name_var = tk.StringVar(value=self.site_data.get("name", ""))
        self.name_entry = ttk.Entry(frame, textvariable=self.name_var, width=30)
        self.name_entry.grid(row=0, column=1, columnspan=2, sticky=tk.W, pady=5)
        if self.site_data.get("name"):
            # If editing, name should not be changed easily as it is the key in shares
            self.name_entry.config(state="disabled")
            
        # Port
        ttk.Label(frame, text="Port (Cổng):").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.port_var = tk.StringVar(value=str(self.site_data.get("port", "2121")))
        self.port_entry = ttk.Entry(frame, textvariable=self.port_var, width=10)
        self.port_entry.grid(row=1, column=1, columnspan=2, sticky=tk.W, pady=5)
        
        # Path
        ttk.Label(frame, text="Local Path (Đường dẫn):").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.path_var = tk.StringVar(value=self.site_data.get("path", ""))
        self.path_entry = ttk.Entry(frame, textvariable=self.path_var, width=30)
        self.path_entry.grid(row=2, column=1, sticky=tk.W, pady=5)
        
        self.browse_btn = ttk.Button(frame, text="Browse...", command=self.browse_folder, width=10)
        self.browse_btn.grid(row=2, column=2, padx=5, sticky=tk.W, pady=5)
        
        # FTP User
        ttk.Label(frame, text="FTP User (Tài khoản):").grid(row=3, column=0, sticky=tk.W, pady=5)
        self.user_var = tk.StringVar(value=self.site_data.get("ftp_user", ""))
        self.user_entry = ttk.Entry(frame, textvariable=self.user_var, width=30)
        self.user_entry.grid(row=3, column=1, columnspan=2, sticky=tk.W, pady=5)
        
        # FTP Password
        ttk.Label(frame, text="FTP Password (Mật khẩu):").grid(row=4, column=0, sticky=tk.W, pady=5)
        self.pass_var = tk.StringVar(value=self.site_data.get("ftp_password", ""))
        self.pass_entry = ttk.Entry(frame, textvariable=self.pass_var, show="*", width=30)
        self.pass_entry.grid(row=4, column=1, columnspan=2, sticky=tk.W, pady=5)
        
        # Buttons
        btn_frame = ttk.Frame(frame)
        btn_frame.grid(row=5, column=0, columnspan=3, pady=15, sticky=tk.E)
        
        cancel_btn = ttk.Button(btn_frame, text="Cancel (Hủy)", command=self.destroy, width=12)
        cancel_btn.pack(side=tk.LEFT, padx=5)
        
        save_btn = ttk.Button(btn_frame, text="OK (Lưu)", command=self.save, width=12)
        save_btn.pack(side=tk.LEFT, padx=5)
        
        center_window(self, 420, 260)
        
    def browse_folder(self) -> None:
        initial = self.path_var.get()
        if not initial or not os.path.exists(initial):
            initial = os.path.expanduser("~")
        selected = filedialog.askdirectory(parent=self, title="Select FTP Directory", initialdir=initial)
        if selected:
            self.path_var.set(os.path.normpath(selected))
            
    def save(self) -> None:
        name = self.name_var.get().strip()
        port_raw = self.port_var.get().strip()
        path = self.path_var.get().strip()
        user = self.user_var.get().strip()
        password = self.pass_var.get().strip()
        
        if not name:
            messagebox.showerror("Error", "Site Name is required!", parent=self)
            return
            
        try:
            port = int(port_raw)
            if port <= 0 or port > 65535:
                raise ValueError
        except ValueError:
            messagebox.showerror("Error", "Port must be a valid integer between 1 and 65535!", parent=self)
            return
            
        if not path:
            messagebox.showerror("Error", "Local Path is required!", parent=self)
            return
            
        self.result = {
            "name": name,
            "port": port,
            "path": path,
            "ftp_user": user,
            "ftp_password": password
        }
        self.destroy()


class CameraDialog(tk.Toplevel):
    def __init__(self, parent: tk.Tk, title: str = "Add Camera Stream", cam_data: dict[str, Any] | None = None) -> None:
        super().__init__(parent)
        self.title(title)
        self.transient(parent)
        self.grab_set()
        
        self.result: dict[str, Any] | None = None
        self.cam_data = cam_data or {}
        
        self.resizable(False, False)
        
        frame = ttk.Frame(self, padding="15 15 15 15")
        frame.pack(fill=tk.BOTH, expand=True)
        
        # Camera Name
        ttk.Label(frame, text="Camera Name (Tên):").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.name_var = tk.StringVar(value=self.cam_data.get("camera_name", ""))
        self.name_entry = ttk.Entry(frame, textvariable=self.name_var, width=30)
        self.name_entry.grid(row=0, column=1, sticky=tk.W, pady=5)
        if self.cam_data.get("camera_name"):
            self.name_entry.config(state="disabled")
            
        # RTSP URL
        ttk.Label(frame, text="RTSP Stream URL:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.rtsp_var = tk.StringVar(value=self.cam_data.get("rtsp_url", ""))
        self.rtsp_entry = ttk.Entry(frame, textvariable=self.rtsp_var, width=30)
        self.rtsp_entry.grid(row=1, column=1, sticky=tk.W, pady=5)
        
        # Segment Duration
        ttk.Label(frame, text="Segment Duration (s):").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.duration_var = tk.StringVar(value=str(self.cam_data.get("segment_duration", "60")))
        self.duration_entry = ttk.Entry(frame, textvariable=self.duration_var, width=10)
        self.duration_entry.grid(row=2, column=1, sticky=tk.W, pady=5)
        
        # Prefix
        ttk.Label(frame, text="File Prefix (Tiền tố):").grid(row=3, column=0, sticky=tk.W, pady=5)
        self.prefix_var = tk.StringVar(value=self.cam_data.get("prefix", "rec"))
        self.prefix_entry = ttk.Entry(frame, textvariable=self.prefix_var, width=15)
        self.prefix_entry.grid(row=3, column=1, sticky=tk.W, pady=5)
        
        # Disable Audio
        self.no_audio_var = tk.BooleanVar(value=self.cam_data.get("no_audio", True))
        self.no_audio_cb = ttk.Checkbutton(frame, text="Tắt âm thanh (No Audio)", variable=self.no_audio_var)
        self.no_audio_cb.grid(row=4, column=0, columnspan=2, sticky=tk.W, pady=5)
        
        # Buttons
        btn_frame = ttk.Frame(frame)
        btn_frame.grid(row=5, column=0, columnspan=2, pady=15, sticky=tk.E)
        
        cancel_btn = ttk.Button(btn_frame, text="Cancel (Hủy)", command=self.destroy, width=12)
        cancel_btn.pack(side=tk.LEFT, padx=5)
        
        save_btn = ttk.Button(btn_frame, text="OK (Lưu)", command=self.save, width=12)
        save_btn.pack(side=tk.LEFT, padx=5)
        
        center_window(self, 400, 240)
        
    def save(self) -> None:
        name = self.name_var.get().strip()
        rtsp = self.rtsp_var.get().strip()
        duration_raw = self.duration_var.get().strip()
        prefix = self.prefix_var.get().strip() or "rec"
        no_audio = self.no_audio_var.get()
        
        if not name:
            messagebox.showerror("Error", "Camera Name is required!", parent=self)
            return
            
        if not rtsp:
            messagebox.showerror("Error", "RTSP URL is required!", parent=self)
            return
            
        try:
            duration = int(duration_raw)
            if duration <= 0:
                raise ValueError
        except ValueError:
            messagebox.showerror("Error", "Duration must be a positive integer!", parent=self)
            return
            
        self.result = {
            "camera_name": name,
            "rtsp_url": rtsp,
            "segment_duration": duration,
            "prefix": prefix,
            "no_audio": no_audio,
            "video_codec": "copy",
            "audio_codec": "copy"
        }
        self.destroy()


class PrinterDestinationDialog(tk.Toplevel):
    def __init__(self, parent: tk.Tk, title: str = "Add Scan Destination", dest_data: dict[str, Any] | None = None) -> None:
        super().__init__(parent)
        self.title(title)
        self.transient(parent)
        self.grab_set()
        
        self.result: dict[str, Any] | None = None
        self.dest_data = dest_data or {}
        
        self.resizable(False, False)
        frame = ttk.Frame(self, padding="15 15 15 15")
        frame.pack(fill=tk.BOTH, expand=True)
        
        # Name
        ttk.Label(frame, text="Name (Tên hiển thị):").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.name_var = tk.StringVar(value=self.dest_data.get("name", ""))
        self.name_entry = ttk.Entry(frame, textvariable=self.name_var, width=35)
        self.name_entry.grid(row=0, column=1, sticky=tk.W, pady=5)
        
        # Type
        ttk.Label(frame, text="Type (Loại):").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.type_var = tk.StringVar(value=self.dest_data.get("type", "FTP"))
        self.type_combo = ttk.Combobox(frame, textvariable=self.type_var, values=["FTP", "Email"], state="readonly", width=15)
        self.type_combo.grid(row=1, column=1, sticky=tk.W, pady=5)
        self.type_combo.bind("<<ComboboxSelected>>", self.on_type_change)
        
        # Email
        ttk.Label(frame, text="Email Address:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.email_var = tk.StringVar(value=self.dest_data.get("email", ""))
        self.email_entry = ttk.Entry(frame, textvariable=self.email_var, width=35)
        self.email_entry.grid(row=2, column=1, sticky=tk.W, pady=5)
        
        # Parse host, port, path from dest_data
        folder_str = self.dest_data.get("folder", "")
        server = self.dest_data.get("folder_server", "")
        port = self.dest_data.get("folder_port", "")
        path = self.dest_data.get("folder_path", "")
        
        if not server and folder_str:
            if folder_str.startswith("ftp://"):
                match = re.match(r'ftp://([^:/]+)(?::(\d+))?(.*)', folder_str)
                if match:
                    server = match.group(1)
                    port = match.group(2) or "21"
                    path = match.group(3)
            elif folder_str.startswith("\\\\"):
                match = re.match(r'\\\\([^\\]+)\\(.*)', folder_str)
                if match:
                    server = match.group(1)
                    path = "\\" + match.group(2)
                    port = "445"
            else:
                server = folder_str
                port = "21"
                path = "/"
                
        if not port:
            port = "2121"
        if not path:
            path = "/"
            
        # Host/IP
        ttk.Label(frame, text="Host / IP (Máy chủ/IP):").grid(row=3, column=0, sticky=tk.W, pady=5)
        self.host_var = tk.StringVar(value=server)
        self.host_entry = ttk.Entry(frame, textvariable=self.host_var, width=35)
        self.host_entry.grid(row=3, column=1, sticky=tk.W, pady=5)
        
        # Port
        ttk.Label(frame, text="Port (Cổng):").grid(row=4, column=0, sticky=tk.W, pady=5)
        self.port_var = tk.StringVar(value=str(port))
        self.port_entry = ttk.Entry(frame, textvariable=self.port_var, width=35)
        self.port_entry.grid(row=4, column=1, sticky=tk.W, pady=5)
        
        # Path
        ttk.Label(frame, text="Path (Đường dẫn):").grid(row=5, column=0, sticky=tk.W, pady=5)
        self.path_var = tk.StringVar(value=path)
        self.path_entry = ttk.Entry(frame, textvariable=self.path_var, width=35)
        self.path_entry.grid(row=5, column=1, sticky=tk.W, pady=5)
        
        # FTP User
        ttk.Label(frame, text="FTP User (Tài khoản):").grid(row=6, column=0, sticky=tk.W, pady=5)
        self.user_var = tk.StringVar(value=self.dest_data.get("ftp_user", ""))
        self.user_entry = ttk.Entry(frame, textvariable=self.user_var, width=35)
        self.user_entry.grid(row=6, column=1, sticky=tk.W, pady=5)
        
        # FTP Password
        ttk.Label(frame, text="FTP Pass (Mật khẩu):").grid(row=7, column=0, sticky=tk.W, pady=5)
        self.pass_var = tk.StringVar(value=self.dest_data.get("ftp_password", ""))
        self.pass_entry = ttk.Entry(frame, textvariable=self.pass_var, show="*", width=35)
        self.pass_entry.grid(row=7, column=1, sticky=tk.W, pady=5)
        
        self.on_type_change()
        
        # Buttons
        btn_frame = ttk.Frame(frame)
        btn_frame.grid(row=8, column=0, columnspan=2, pady=15, sticky=tk.E)
        
        ttk.Button(btn_frame, text="Cancel (Hủy)", command=self.destroy, width=12).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="OK (Lưu)", command=self.save, width=12).pack(side=tk.LEFT, padx=5)
        
        center_window(self, 450, 390)
        
    def on_type_change(self, event=None) -> None:
        dtype = self.type_var.get()
        if dtype == "Email":
            self.email_entry.config(state="normal")
            self.host_entry.config(state="disabled")
            self.port_entry.config(state="disabled")
            self.path_entry.config(state="disabled")
            self.user_entry.config(state="disabled")
            self.pass_entry.config(state="disabled")
        else:
            self.email_entry.config(state="disabled")
            self.host_entry.config(state="normal")
            self.port_entry.config(state="normal")
            self.path_entry.config(state="normal")
            self.user_entry.config(state="normal")
            self.pass_entry.config(state="normal")
            
    def save(self) -> None:
        name = self.name_var.get().strip()
        dtype = self.type_var.get()
        email = self.email_var.get().strip()
        host = self.host_var.get().strip()
        port_str = self.port_var.get().strip()
        path = self.path_var.get().strip()
        ftp_user = self.user_var.get().strip()
        ftp_password = self.pass_var.get().strip()
        
        if not name:
            messagebox.showerror("Error", "Name is required!", parent=self)
            return
            
        if dtype == "Email":
            if not email:
                messagebox.showerror("Error", "Email Address is required!", parent=self)
                return
            ftp_url = ""
            ftp_user = ""
            ftp_password = ""
        else:
            if not host:
                messagebox.showerror("Error", "Host/IP is required!", parent=self)
                return
            try:
                port = int(port_str) if port_str else 21
            except ValueError:
                messagebox.showerror("Error", "Port must be an integer!", parent=self)
                return
                
            if not path.startswith("/"):
                path = "/" + path
            ftp_url = f"ftp://{host}:{port}{path}"
            email = ""
            
        self.result = {
            "name": name,
            "type": dtype,
            "email": email,
            "folder": ftp_url,
            "ftp_user": ftp_user,
            "ftp_password": ftp_password,
        }
        self.destroy()


class ProgressDialog(tk.Toplevel):
    def __init__(self, parent: tk.Tk, title: str, message: str) -> None:
        super().__init__(parent)
        self.title(title)
        self.transient(parent)
        self.grab_set()
        self.resizable(False, False)
        
        label = ttk.Label(self, text=message, padding="20 20 20 20", font=("Segoe UI", 10))
        label.pack()
        
        center_window(self, 350, 100)
        self.update()


class PrintAgentGui:
    def __init__(self, root: tk.Tk, app_version: str) -> None:
        self.root = root
        self.app_version = app_version
        self.config = AppConfig.load()
        self.share_manager = ShareManager()
        self.printers_by_ip: dict[str, Printer] = {}
        
        self.root.title(f"GoPrinx PrintAgent - v{app_version}")
        self.root.minsize(850, 550)
        
        # Style configurations
        style = ttk.Style(self.root)
        if sys.platform == "win32":
            style.theme_use("vista")
            
        style.configure("Treeview", rowheight=25, font=("Segoe UI", 9))
        style.configure("Treeview.Heading", font=("Segoe UI", 9, "bold"))
        
        # Top Header Area
        header_frame = ttk.Frame(self.root, padding="15 10 15 10")
        header_frame.pack(fill=tk.X)
        
        title_label = ttk.Label(header_frame, text="PrintAgent Management System", font=("Segoe UI", 14, "bold"))
        title_label.pack(side=tk.LEFT)
        
        ver_label = ttk.Label(header_frame, text=f"Version: {app_version}", font=("Segoe UI", 9, "italic"))
        ver_label.pack(side=tk.RIGHT, pady=5)
        
        # Divider Line
        divider = ttk.Separator(self.root, orient=tk.HORIZONTAL)
        divider.pack(fill=tk.X, padx=15)
        
        # Main Tab Container (Notebook)
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=15, pady=10)
        
        # Status Bar at the bottom
        self.status_bar = ttk.Label(self.root, text="Hệ thống sẵn sàng (Ready)", relief=tk.SUNKEN, anchor=tk.W, padding=(10, 5))
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
        # Create tabs
        self.create_printers_tab()
        self.create_ftp_tab()
        self.create_scan_tab()
        self.create_camera_tab()
        
        # Load initial data
        self.refresh_ftp_list()
        self.refresh_scan_dirs()
        self.refresh_printers()
        self.refresh_cameras()
        
    def create_ftp_tab(self) -> None:
        self.ftp_tab = ttk.Frame(self.notebook, padding="10 10 10 10")
        self.notebook.add(self.ftp_tab, text=" FTP Servers (FTP mạng) ")
        
        # Inner Frame
        main_frame = ttk.Frame(self.ftp_tab)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Action Buttons frame packed first on the right so it gets sizing priority
        btn_frame = ttk.Frame(main_frame, padding="10 0 0 0")
        btn_frame.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Treeview frame packed second to fill remaining left area
        tree_frame = ttk.Frame(main_frame)
        tree_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        cols = ("Name", "Port", "User", "Password", "Path", "Status")
        self.ftp_tree = ttk.Treeview(tree_frame, columns=cols, show="headings")
        
        self.ftp_tree.heading("Name", text="Tên Site")
        self.ftp_tree.heading("Port", text="Cổng")
        self.ftp_tree.heading("User", text="Tài khoản")
        self.ftp_tree.heading("Password", text="Mật khẩu")
        self.ftp_tree.heading("Path", text="Thư mục Vật lý")
        self.ftp_tree.heading("Status", text="Trạng thái")
        
        self.ftp_tree.column("Name", width=120, anchor=tk.W)
        self.ftp_tree.column("Port", width=60, anchor=tk.CENTER)
        self.ftp_tree.column("User", width=100, anchor=tk.W)
        self.ftp_tree.column("Password", width=100, anchor=tk.W)
        self.ftp_tree.column("Path", width=250, anchor=tk.W)
        self.ftp_tree.column("Status", width=80, anchor=tk.CENTER)
        
        # Add Scrollbars
        vsb = ttk.Scrollbar(tree_frame, orient="vertical", command=self.ftp_tree.yview)
        hsb = ttk.Scrollbar(tree_frame, orient="horizontal", command=self.ftp_tree.xview)
        self.ftp_tree.configure(yscrollcommand=vsb.set, xscrollcommand=hsb.set)
        
        self.ftp_tree.grid(row=0, column=0, sticky="nsew")
        vsb.grid(row=0, column=1, sticky="ns")
        hsb.grid(row=1, column=0, sticky="ew")
        
        tree_frame.rowconfigure(0, weight=1)
        tree_frame.columnconfigure(0, weight=1)
        
        # Buttons are packed into the pre-created btn_frame
        
        ttk.Button(btn_frame, text="Add FTP (Thêm)", command=self.add_ftp_site, width=18).pack(pady=5)
        ttk.Button(btn_frame, text="Edit FTP (Sửa)", command=self.edit_ftp_site, width=18).pack(pady=5)
        ttk.Button(btn_frame, text="Delete FTP (Xóa)", command=self.delete_ftp_site, width=18).pack(pady=5)
        
        ttk.Separator(btn_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        ttk.Button(btn_frame, text="Refresh (Tải lại)", command=self.refresh_ftp_list, width=18).pack(pady=5)
        
    def create_scan_tab(self) -> None:
        self.scan_tab = ttk.Frame(self.notebook, padding="10 10 10 10")
        self.notebook.add(self.scan_tab, text=" Scan Sync (Thư mục Sync) ")
        
        # Cấu hình thư mục giám sát (Top Area)
        config_frame = ttk.LabelFrame(self.scan_tab, text=" Cấu hình thư mục giám sát (Monitored Directory) ", padding="10 10 10 10")
        config_frame.pack(side=tk.TOP, fill=tk.X, pady=(0, 10))
        
        ttk.Label(config_frame, text="Đường dẫn:").pack(side=tk.LEFT, padx=(0, 5))
        
        self.scan_path_var = tk.StringVar()
        self.scan_path_entry = ttk.Entry(config_frame, textvariable=self.scan_path_var, width=50)
        self.scan_path_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
        
        ttk.Button(config_frame, text="Chọn thư mục...", command=self.browse_scan_dir, width=15).pack(side=tk.LEFT, padx=5)
        ttk.Button(config_frame, text="Lưu", command=self.save_scan_dir, width=8).pack(side=tk.LEFT, padx=5)
        
        main_frame = ttk.Frame(self.scan_tab)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Action Buttons frame packed first on the right so it gets sizing priority
        btn_frame = ttk.Frame(main_frame, padding="10 0 0 0")
        btn_frame.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Treeview list of paths
        tree_frame = ttk.Frame(main_frame)
        tree_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        cols = ("Filename", "Size", "Mtime", "Status", "Url")
        self.scan_tree = ttk.Treeview(tree_frame, columns=cols, show="headings")
        self.scan_tree.heading("Filename", text="Tên tệp (File Name)")
        self.scan_tree.heading("Size", text="Dung lượng")
        self.scan_tree.heading("Mtime", text="Ngày sửa")
        self.scan_tree.heading("Status", text="Trạng thái VPS")
        self.scan_tree.heading("Url", text="URL Tải (Download URL)")
        
        self.scan_tree.column("Filename", width=180, anchor=tk.W)
        self.scan_tree.column("Size", width=90, anchor=tk.E)
        self.scan_tree.column("Mtime", width=130, anchor=tk.CENTER)
        self.scan_tree.column("Status", width=110, anchor=tk.CENTER)
        self.scan_tree.column("Url", width=260, anchor=tk.W)
        
        vsb = ttk.Scrollbar(tree_frame, orient="vertical", command=self.scan_tree.yview)
        hsb = ttk.Scrollbar(tree_frame, orient="horizontal", command=self.scan_tree.xview)
        self.scan_tree.configure(yscrollcommand=vsb.set, xscrollcommand=hsb.set)
        
        self.scan_tree.grid(row=0, column=0, sticky="nsew")
        vsb.grid(row=0, column=1, sticky="ns")
        hsb.grid(row=1, column=0, sticky="ew")
        
        tree_frame.rowconfigure(0, weight=1)
        tree_frame.columnconfigure(0, weight=1)
        
        # Buttons are packed into the pre-created btn_frame
        ttk.Button(btn_frame, text="Mở thư mục", command=self.open_local_scan_dir, width=18).pack(pady=5)
        ttk.Separator(btn_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        ttk.Button(btn_frame, text="Refresh (Tải lại)", command=self.refresh_scan_dirs, width=18).pack(pady=5)
        
    def create_printers_tab(self) -> None:
        self.printers_tab = ttk.Frame(self.notebook, padding="10 10 10 10")
        self.notebook.add(self.printers_tab, text=" Printers (Máy in / Thiết bị) ")
        
        main_frame = ttk.Frame(self.printers_tab)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Action Buttons frame packed first on the right so it gets sizing priority
        btn_frame = ttk.Frame(main_frame, padding="10 0 0 0")
        btn_frame.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Treeview
        tree_frame = ttk.Frame(main_frame)
        tree_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        cols = ("IP", "MAC", "Type", "Status", "DevStatus")
        self.printer_tree = ttk.Treeview(tree_frame, columns=cols, show="tree headings")
        
        self.printer_tree.heading("#0", text="Chọn | Tên Thiết Bị / Địa chỉ nhận")
        self.printer_tree.heading("IP", text="Địa chỉ IP / Email")
        self.printer_tree.heading("MAC", text="Địa chỉ MAC / FTP / SMB")
        self.printer_tree.heading("Type", text="Hãng/Loại")
        self.printer_tree.heading("Status", text="Kết nối")
        self.printer_tree.heading("DevStatus", text="Trạng thái")
        
        self.printer_tree.column("#0", width=250, anchor=tk.W)
        self.printer_tree.column("IP", width=140, anchor=tk.W)
        self.printer_tree.column("MAC", width=220, anchor=tk.W)
        self.printer_tree.column("Type", width=70, anchor=tk.CENTER)
        self.printer_tree.column("Status", width=60, anchor=tk.CENTER)
        self.printer_tree.column("DevStatus", width=100, anchor=tk.CENTER)
        
        vsb = ttk.Scrollbar(tree_frame, orient="vertical", command=self.printer_tree.yview)
        hsb = ttk.Scrollbar(tree_frame, orient="horizontal", command=self.printer_tree.xview)
        self.printer_tree.configure(yscrollcommand=vsb.set, xscrollcommand=hsb.set)
        
        self.printer_tree.grid(row=0, column=0, sticky="nsew")
        self.printer_tree.bind("<Button-3>", self.show_printer_context_menu)
        self.printer_tree.bind("<Double-1>", self.on_printer_tree_double_click)
        self.printer_tree.bind("<Button-1>", self.on_printer_tree_click)
        vsb.grid(row=0, column=1, sticky="ns")
        hsb.grid(row=1, column=0, sticky="ew")
        
        tree_frame.rowconfigure(0, weight=1)
        tree_frame.columnconfigure(0, weight=1)
        
        # Buttons are packed into the pre-created btn_frame
        ttk.Button(btn_frame, text="Cài Driver", command=self.gui_install_driver, width=18).pack(pady=5)
        ttk.Button(btn_frame, text="Cài Scan", command=self.gui_install_scan, width=18).pack(pady=5)
        ttk.Button(btn_frame, text="Cài Driver + Scan", command=self.gui_install_both, width=18).pack(pady=5)
        
        ttk.Separator(btn_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        
        ttk.Button(btn_frame, text="Add Dest (Thêm nhận)", command=self.add_printer_destination, width=18).pack(pady=5)
        ttk.Button(btn_frame, text="Edit Dest (Sửa nhận)", command=self.edit_printer_destination, width=18).pack(pady=5)
        ttk.Button(btn_frame, text="Delete Dest (Xóa nhận)", command=self.delete_printer_destination, width=18).pack(pady=5)
        
        ttk.Separator(btn_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        ttk.Button(btn_frame, text="Refresh (Tải lại)", command=self.refresh_printers, width=18).pack(pady=5)
        
    def _get_selected_printer(self) -> dict | None:
        selected = self.printer_tree.focus()
        if not selected:
            return None
        if selected.startswith("dest_"):
            selected = self.printer_tree.parent(selected)
            if not selected:
                return None
        vals = self.printer_tree.item(selected, "values")
        if not vals or len(vals) < 1:
            return None
        ip_addr = vals[0].strip().lower()
        p = self.printers_by_ip.get(ip_addr)
        if p:
            return {
                "id": p.id,
                "ip": p.ip,
                "printer_type": p.printer_type,
                "name": p.name,
                "mac_address": p.mac_address,
                "status": p.status,
                "physical_status": p.physical_status,
                "user": p.user,
                "password": p.password
            }
        return None

    def _get_checked_printers(self) -> list[dict]:
        checked = []
        for item in self.printer_tree.get_children():
            text = self.printer_tree.item(item, "text")
            if text.startswith("☑ "):
                vals = self.printer_tree.item(item, "values")
                if vals and len(vals) >= 1:
                     ip_addr = vals[0].strip().lower()
                     p = self.printers_by_ip.get(ip_addr)
                     if p:
                         checked.append({
                             "id": p.id,
                             "ip": p.ip,
                             "printer_type": p.printer_type,
                             "name": p.name,
                             "mac_address": p.mac_address,
                             "status": p.status,
                             "physical_status": p.physical_status,
                             "user": p.user,
                             "password": p.password
                         })
        return checked

    def on_printer_tree_click(self, event) -> None:
        region = self.printer_tree.identify_region(event.x, event.y)
        column = self.printer_tree.identify_column(event.x)
        if column == "#0" and (region == "tree" or region == "cell"):
            item_id = self.printer_tree.identify_row(event.y)
            if item_id and not item_id.startswith("dest_"):
                current_text = self.printer_tree.item(item_id, "text")
                if current_text.startswith("☑ "):
                    new_text = "☐ " + current_text[2:]
                    self.printer_tree.item(item_id, text=new_text)
                elif current_text.startswith("☐ "):
                    new_text = "☑ " + current_text[2:]
                    self.printer_tree.item(item_id, text=new_text)

    def gui_install_driver(self) -> None:
        printers = self._get_checked_printers()
        if not printers:
            messagebox.showwarning("Warning", "Vui lòng check chọn ít nhất một máy in để cài driver.")
            return
        
        import threading
        def run_drivers():
            for printer in printers:
                self._legacy_install_driver(printer)
        threading.Thread(target=run_drivers, daemon=True).start()
        messagebox.showinfo("Đang cài đặt", f"Đang tiến hành cài đặt ngầm driver cho {len(printers)} máy in...")

    def gui_install_scan(self) -> None:
        printers = self._get_checked_printers()
        if not printers:
            messagebox.showwarning("Warning", "Vui lòng check chọn ít nhất một máy in để cài scan.")
            return
            
        import tkinter.simpledialog as simpledialog
        name = simpledialog.askstring("Input", "Nhập tên Username hiển thị trên máy in:")
        if not name:
            return
        email = simpledialog.askstring("Input", "Nhập Email (nếu cần):") or ""
        
        import threading
        def run_scans():
            for printer in printers:
                self._legacy_install_scan(printer, name, email)
        threading.Thread(target=run_scans, daemon=True).start()
        messagebox.showinfo("Đang cài đặt", f"Đang cấu hình scan ngầm cho {len(printers)} máy in...")

    def gui_install_both(self) -> None:
        printers = self._get_checked_printers()
        if not printers:
            messagebox.showwarning("Warning", "Vui lòng check chọn ít nhất một máy in để cài đặt.")
            return
            
        import tkinter.simpledialog as simpledialog
        name = simpledialog.askstring("Input", "Nhập tên Username hiển thị trên máy in:")
        if not name:
            return
        email = simpledialog.askstring("Input", "Nhập Email (nếu cần):") or ""
        
        import threading
        def run_both():
            for printer in printers:
                self._legacy_install_driver(printer)
                self._legacy_install_scan(printer, name, email)
        threading.Thread(target=run_both, daemon=True).start()
        messagebox.showinfo("Đang cài đặt", f"Đang cấu hình driver và scan ngầm cho {len(printers)} máy in...")

    def _legacy_install_driver(self, matched_printer: dict) -> None:
        local_port = self.config.get_int("web.port", 9173)
        try:
            import requests
            resp = requests.post(f"http://127.0.0.1:{local_port}/api/local/install-driver", json=matched_printer, timeout=5)
            if resp.status_code != 200 or not resp.json().get("ok"):
                error_msg = resp.json().get("error", "Unknown error")
                messagebox.showerror("Error", f"Không kích hoạt được cài đặt driver: {error_msg}")
        except Exception as e:
            messagebox.showerror("Error", f"Không kết nối được với dịch vụ nền PrintAgent: {e}")

    def _legacy_install_scan(self, printer_data: dict, name: str, email: str) -> None:
        local_port = self.config.get_int("web.port", 9173)
        payload = {
            "printer": printer_data,
            "name": name,
            "email": email
        }
        try:
            import requests
            resp = requests.post(f"http://127.0.0.1:{local_port}/api/local/install-scan", json=payload, timeout=5)
            if resp.status_code != 200 or not resp.json().get("ok"):
                error_msg = resp.json().get("error", "Unknown error")
                messagebox.showerror("Error", f"Không kích hoạt được cài đặt scan: {error_msg}")
        except Exception as e:
            messagebox.showerror("Error", f"Không kết nối được với dịch vụ nền PrintAgent: {e}")
        
    # --- FTP LOGIC ---
    def refresh_ftp_list(self) -> None:
        # Clear existing
        for item in self.ftp_tree.get_children():
            self.ftp_tree.delete(item)
            
        self.ftp_tree.insert("", tk.END, values=("Loading FTP sites...", "", "", "", "", ""))
        
        def run() -> None:
            try:
                sites = self.share_manager.list_ftp_sites()
                self.root.after(0, lambda: self.update_ftp_list_ui(sites))
            except Exception as exc:
                LOGGER.exception("Failed to load FTP sites in GUI")
                self.root.after(0, lambda exc=exc: messagebox.showerror("Error", f"Failed to list FTP sites: {exc}"))
                self.root.after(0, lambda: self.update_ftp_list_ui([]))
                
        threading.Thread(target=run, daemon=True, name="gui-ftp-refresh").start()
        
    def update_ftp_list_ui(self, sites: list[dict[str, Any]]) -> None:
        for item in self.ftp_tree.get_children():
            self.ftp_tree.delete(item)
            
        for site in sites:
            name = site.get("name", "")
            port = site.get("port", 2121)
            user = site.get("ftp_user", "")
            pwd = site.get("ftp_password", "")
            path = site.get("path", "")
            
            status = "Running" if site.get("running") else "Stopped"
            if site.get("queued"):
                status = "Queued"
                
            self.ftp_tree.insert("", tk.END, values=(name, port, user, pwd, path, status))
            
        if not self.ftp_tree.get_children():
            self.ftp_tree.insert("", tk.END, values=("No FTP sites found", "", "", "", "", ""))
            
    def add_ftp_site(self) -> None:
        dlg = FtpDialog(self.root, "Add New FTP Site")
        self.root.wait_window(dlg)
        
        if dlg.result:
            try:
                res = self.share_manager.create_ftp_site(
                    site_name=dlg.result["name"],
                    local_path=dlg.result["path"],
                    port=dlg.result["port"],
                    ftp_user=dlg.result["ftp_user"],
                    ftp_password=dlg.result["ftp_password"]
                )
                if res.get("ok"):
                    messagebox.showinfo("Success", f"FTP site '{dlg.result['name']}' created successfully!")
                    
                    # Auto register this folder into Scan Sync as well!
                    self.config = AppConfig.load()
                    added, _ = self.config.ensure_scan_dir(dlg.result["path"])
                    if added:
                        self.refresh_scan_dirs()
                else:
                    messagebox.showerror("Error", f"Failed to create FTP site: {res.get('error', 'Unknown error')}")
            except Exception as exc:
                messagebox.showerror("Error", str(exc))
            finally:
                self.refresh_ftp_list()
                
    def edit_ftp_site(self) -> None:
        selected = self.ftp_tree.focus()
        if not selected:
            messagebox.showwarning("Warning", "Please select an FTP site to edit.")
            return
            
        values = self.ftp_tree.item(selected, "values")
        site_name = values[0]
        
        # Load live details
        config_data = self.share_manager.get_ftp_site(site_name)
        if not config_data:
            messagebox.showerror("Error", f"Could not find configuration for site '{site_name}'.")
            return
            
        dlg = FtpDialog(self.root, f"Edit FTP Site: {site_name}", config_data)
        self.root.wait_window(dlg)
        
        if dlg.result:
            try:
                res = self.share_manager.update_ftp_site(
                    site_name=site_name,
                    local_path=dlg.result["path"],
                    port=dlg.result["port"],
                    ftp_user=dlg.result["ftp_user"],
                    ftp_password=dlg.result["ftp_password"]
                )
                if res.get("ok"):
                    messagebox.showinfo("Success", f"FTP site '{site_name}' updated successfully!")
                else:
                    messagebox.showerror("Error", f"Failed to update FTP site: {res.get('error', 'Unknown error')}")
            except Exception as exc:
                messagebox.showerror("Error", str(exc))
            finally:
                self.refresh_ftp_list()
                
    def delete_ftp_site(self) -> None:
        selected_items = self.ftp_tree.selection()
        if not selected_items:
            messagebox.showwarning("Warning", "Please select one or more FTP sites to delete.")
            return
            
        site_names = [self.ftp_tree.item(item, "values")[0] for item in selected_items]
        
        if len(site_names) == 1:
            confirm_msg = f"Are you sure you want to delete FTP site '{site_names[0]}'?\nThis will stop the FTP service on this port."
        else:
            confirm_msg = f"Are you sure you want to delete {len(site_names)} FTP sites?\n{', '.join(site_names)}\nThis will stop the FTP services on their ports."
            
        confirm = messagebox.askyesno(
            "Confirm Delete",
            confirm_msg,
            default=messagebox.NO
        )
        if confirm:
            success_count = 0
            errors = []
            for site_name in site_names:
                try:
                    res = self.share_manager.delete_ftp_site(site_name)
                    if res.get("ok"):
                        success_count += 1
                    else:
                        errors.append(f"{site_name}: {res.get('error', 'Unknown error')}")
                except Exception as exc:
                    errors.append(f"{site_name}: {exc}")
            
            if not errors:
                if len(site_names) == 1:
                    messagebox.showinfo("Success", f"FTP site '{site_names[0]}' deleted successfully!")
                else:
                    messagebox.showinfo("Success", f"Successfully deleted {success_count} FTP sites!")
            else:
                err_msg = "\n".join(errors)
                messagebox.showerror("Error", f"Failed to delete some FTP sites:\n{err_msg}")
                
            self.refresh_ftp_list()
 
    # --- SCAN SYNC LOGIC ---
    def browse_scan_dir(self) -> None:
        selected = filedialog.askdirectory(parent=self.root, title="Chọn thư mục giám sát để đồng bộ scan")
        if selected:
            path = os.path.normpath(selected)
            self.scan_path_var.set(path)

    def save_scan_dir(self) -> None:
        path = self.scan_path_var.get().strip()
        if not path:
            messagebox.showwarning("Cảnh báo", "Vui lòng nhập hoặc chọn thư mục giám sát trước khi lưu.")
            return
        if not os.path.exists(path):
            if messagebox.askyesno("Thư mục không tồn tại", "Thư mục đã nhập không tồn tại. Bạn có muốn tạo nó không?"):
                try:
                    os.makedirs(path, exist_ok=True)
                except Exception as exc:
                    messagebox.showerror("Lỗi", f"Không thể tạo thư mục: {exc}")
                    return
            else:
                return
        try:
            self.config = AppConfig.load()
            self.config.set_value("polling.scan_dirs", path)
            messagebox.showinfo("Thành công", f"Đã lưu thư mục giám sát: {path}")
        except Exception as exc:
            messagebox.showerror("Lỗi", f"Không thể lưu thư mục: {exc}")
        finally:
            self.refresh_scan_dirs()

    def open_local_scan_dir(self) -> None:
        path = self.scan_path_var.get().strip()
        if not path or not os.path.exists(path):
            messagebox.showwarning("Cảnh báo", "Thư mục giám sát không tồn tại hoặc chưa được cấu hình.")
            return
        try:
            if sys.platform == "win32":
                os.startfile(path)
            elif sys.platform == "darwin":
                import subprocess
                subprocess.Popen(["open", path])
            else:
                import subprocess
                subprocess.Popen(["xdg-open", path])
        except Exception as exc:
            messagebox.showerror("Lỗi", f"Không thể mở thư mục: {exc}")

    def refresh_scan_dirs(self) -> None:
        for item in self.scan_tree.get_children():
            self.scan_tree.delete(item)
            
        self.scan_tree.insert("", tk.END, values=("Loading files...", "", "", "", ""))
        
        def run() -> None:
            try:
                self.config = AppConfig.load()
                raw = self.config.get_string("polling.scan_dirs", "").strip()
                dirs = [d.strip() for d in raw.split(";") if d.strip()]
                
                monitored_dir = dirs[0] if dirs else ""
                self.root.after(0, lambda: self.scan_path_var.set(monitored_dir))
                
                if not monitored_dir:
                    self.root.after(0, lambda: self.update_scan_files_ui([], "", "", "", ""))
                    return
                
                # Resolve network info to get lan_uid, agent_uid, lead
                from agent.services.polling_bridge import PollingBridge
                
                lead = self.config.get_string("polling.lead", "default").strip()
                agent_uid = self.config.get_string("polling.agent_uid", "").strip()
                if not agent_uid:
                    try:
                        agent_uid = socket.gethostname().strip().lower() or "legacy-agent"
                    except Exception:
                        agent_uid = "legacy-agent"
                
                gateway_ip = ""
                gateway_mac = ""
                try:
                    gateway_ip = PollingBridge._resolve_default_gateway()
                    gateway_mac = PollingBridge._resolve_gateway_mac(gateway_ip) if gateway_ip else ""
                except Exception:
                    pass
                
                lan_uid = PollingBridge._compose_lan_uid(lead, gateway_mac, gateway_ip)
                if not lan_uid:
                    lan_uid = self.config.get_string("polling.lan_uid", "").strip() or "legacy-lan"
                
                # Load the upload state
                uploaded_fingerprints = {}
                state_file = Path("storage/data/scan_upload_state.json")
                if state_file.exists():
                    try:
                        import json
                        payload = json.loads(state_file.read_text(encoding="utf-8"))
                        uploaded_fingerprints = payload.get("uploaded_fingerprints", {}) or {}
                    except Exception:
                        pass
                
                # Read all files in the monitored folder
                files_list = []
                folder_path = Path(monitored_dir)
                if folder_path.exists() and folder_path.is_dir():
                    for entry in folder_path.iterdir():
                        if entry.is_file() and not entry.name.endswith(".meta.json"):
                            try:
                                st = entry.stat()
                                size = st.st_size
                                mtime = st.st_mtime
                                mtime_ns = st.st_mtime_ns
                                fingerprint = f"{entry.resolve()}|{size}|{mtime_ns}"
                                is_uploaded = fingerprint in uploaded_fingerprints
                                
                                files_list.append({
                                    "name": entry.name,
                                    "size": size,
                                    "mtime": mtime,
                                    "is_uploaded": is_uploaded
                                })
                            except Exception:
                                pass
                
                # Sort files by mtime descending
                files_list.sort(key=lambda x: x["mtime"], reverse=True)
                
                self.root.after(0, lambda: self.update_scan_files_ui(files_list, lead, lan_uid, agent_uid, monitored_dir))
            except Exception as exc:
                LOGGER.exception("Failed to load scan files in GUI")
                self.root.after(0, lambda exc=exc: messagebox.showerror("Error", f"Failed to list scan files: {exc}"))
                self.root.after(0, lambda: self.update_scan_files_ui([], "", "", "", ""))
                
        threading.Thread(target=run, daemon=True, name="gui-scan-refresh").start()
        
    def update_scan_files_ui(self, files: list[dict], lead: str, lan_uid: str, agent_uid: str, monitored_dir: str) -> None:
        for item in self.scan_tree.get_children():
            self.scan_tree.delete(item)
            
        def safe_token(val: str) -> str:
            t = re.sub(r"[^A-Za-z0-9._@-]+", "-", val).strip(" -_.")
            return t or "default"
            
        def format_size(size_bytes: int) -> str:
            if size_bytes < 1024:
                return f"{size_bytes} B"
            elif size_bytes < 1024 * 1024:
                return f"{size_bytes / 1024:.1f} KB"
            else:
                return f"{size_bytes / (1024 * 1024):.1f} MB"
                
        from datetime import datetime
        
        original_folder_name = "default"
        if monitored_dir:
            original_folder_name = Path(monitored_dir).name or "default"
            
        lead_token = safe_token(lead)
        lan_token = safe_token(lan_uid)
        agent_token = safe_token(agent_uid)
        label_token = safe_token(original_folder_name)
        
        vps_url = self.config.get_string("polling.url").strip()
        if not vps_url:
            vps_url = "https://agentapi.quanlymay.com"
        else:
            from urllib.parse import urlparse
            try:
                parsed = urlparse(vps_url)
                if parsed.scheme and parsed.netloc:
                    vps_url = f"{parsed.scheme}://{parsed.netloc}"
            except Exception:
                pass
                
        for f in files:
            size_str = format_size(f["size"])
            dt = datetime.fromtimestamp(f["mtime"])
            mtime_str = dt.strftime("%Y-%m-%d %H:%M:%S")
            
            status_str = "Đã online" if f["is_uploaded"] else "Chưa online"
            download_url = f"{vps_url}/static/scans/{lan_token}/{label_token}/{f['name']}"
            
            self.scan_tree.insert("", tk.END, values=(f["name"], size_str, mtime_str, status_str, download_url))
            
        if not self.scan_tree.get_children():
            self.scan_tree.insert("", tk.END, values=("Không tìm thấy tệp tin nào trong thư mục giám sát", "", "", "", ""))
 
    # --- PRINTERS LOGIC (Asynchronous load) ---
    def refresh_printers(self) -> None:
        for item in self.printer_tree.get_children():
            self.printer_tree.delete(item)
            
        self.printer_tree.insert("", tk.END, text="Loading printers...", values=("", "", "", "", "", ""))
        
        def run() -> None:
            try:
                # 1. Fetch printers from cache, API, and local
                status_file = Path("storage/data/printers_status.json")
                printer_objs = []
                
                # Cache first
                if status_file.exists():
                    try:
                        import json
                        with status_file.open("r", encoding="utf-8") as f:
                            data = json.load(f)
                        if isinstance(data, list):
                            for item in data:
                                ip = str(item.get("ip", "")).strip()
                                if ip:
                                    p = Printer(
                                        name=item.get("name", ""),
                                        ip=ip,
                                        mac_address=item.get("mac_address", ""),
                                        printer_type=item.get("printer_type", ""),
                                        status=item.get("status", "offline"),
                                        physical_status=item.get("physical_status", "Unknown"),
                                    )
                                    printer_objs.append(p)
                    except Exception as err:
                        LOGGER.warning("Failed to load printers_status.json: %s", err)
                        
                # API and local next (deduplicated by IP)
                api_client = APIClient(self.config)
                try:
                    api_printers = api_client.get_printers()
                    for p in api_printers:
                        if p.ip:
                            printer_objs.append(p)
                except Exception:
                    pass
                    
                if sys.platform == "win32":
                    try:
                        from agent.web_discovery import _load_local_windows_printers
                        raw_locals = _load_local_windows_printers()
                        for lp in raw_locals:
                            ip = lp.get("ip", "")
                            if ip:
                                p = Printer(
                                    name=lp.get("name", ""),
                                    ip=ip,
                                    mac_address=lp.get("mac_id", ""),
                                    printer_type=lp.get("type", "local"),
                                    status=lp.get("status", "unknown"),
                                )
                                printer_objs.append(p)
                    except Exception:
                        pass
                        
                # Filter printers: only those with IP, and deduplicate
                seen_ips = set()
                unique_printers = []
                for p in printer_objs:
                    normalized_ip = p.ip.strip()
                    if normalized_ip and normalized_ip.lower() not in seen_ips:
                        seen_ips.add(normalized_ip.lower())
                        unique_printers.append(p)
                        
                # Update UI on main thread to clear loading row and show printer parents
                self.root.after(0, lambda: self.populate_printer_parents(unique_printers))
                
                if not unique_printers:
                    return
                    
                # 2. Query address book for each printer in parallel
                from agent.modules.ricoh.service import RicohService
                ricoh_service = RicohService(api_client, config=self.config)
                
                # Fetch address list function
                self.root.after(0, lambda: self.start_address_book_fetching(unique_printers, ricoh_service))
                
            except Exception as exc:
                LOGGER.exception("Failed to load printers in GUI")
                self.root.after(0, lambda exc=exc: messagebox.showerror("Error", f"Failed to list printers: {exc}"))
                self.root.after(0, lambda: self.clear_printers_tree())
                
        threading.Thread(target=run, daemon=True, name="gui-printers-refresh").start()
        
    def populate_printer_parents(self, unique_printers: list[Printer]) -> None:
        for item in self.printer_tree.get_children():
            self.printer_tree.delete(item)
            
        self.printer_node_ids = {} # Map IP to treeview node ID
        self.printers_by_ip = {p.ip.lower(): p for p in unique_printers}
        for p in unique_printers:
            node_id = self.printer_tree.insert(
                "",
                tk.END,
                text="☑ " + p.name,
                values=(p.ip, p.mac_address, p.printer_type.upper(), p.status.capitalize(), p.physical_status)
            )
            self.printer_node_ids[p.ip.lower()] = node_id
            # Insert a "Connecting/Loading..." child row
            if p.printer_type.lower() == "ricoh":
                self.printer_tree.insert(node_id, tk.END, text="Loading address list...", values=("", "", "", "", ""))
            else:
                self.printer_tree.insert(node_id, tk.END, text="(Scan destinations unsupported for this brand)", values=("", "", "", "", ""))
                
        if not unique_printers:
            self.printer_tree.insert("", tk.END, text="No printers with IP found", values=("", "", "", "", ""))
            
    def start_address_book_fetching(self, unique_printers: list[Printer], ricoh_service: Any) -> None:
        def run_executor():
            with ThreadPoolExecutor(max_workers=min(8, len(unique_printers) + 1)) as executor:
                for p in unique_printers:
                    if p.printer_type.lower() == "ricoh":
                        node_id = self.printer_node_ids.get(p.ip.lower())
                        if node_id:
                            executor.submit(self.fetch_single_address_book, node_id, p, ricoh_service)
                            
        threading.Thread(target=run_executor, daemon=True, name="gui-address-book-executor").start()
        
    def fetch_single_address_book(self, node_id: str, printer: Printer, ricoh_service: Any) -> None:
        try:
            res = ricoh_service.process_address_list(printer)
            addr_list = res.get("address_list", []) if isinstance(res, dict) else []
            self.root.after(0, lambda: self.update_printer_destinations(node_id, addr_list))
        except Exception as exc:
            LOGGER.warning("Failed to fetch address book for %s: %s", printer.ip, exc)
            self.root.after(0, lambda exc=exc: self.update_printer_destinations_error(node_id, str(exc)))
            
    def update_printer_destinations(self, node_id: str, addr_list: list[dict[str, Any]]) -> None:
        if not self.printer_tree.exists(node_id):
            return
            
        for child in self.printer_tree.get_children(node_id):
            self.printer_tree.delete(child)
            
        has_valid_dest = False
        for addr in addr_list:
            if addr.get("type") == "Summary":
                continue
            name = addr.get("name", "")
            email = str(addr.get("email_address" if "email_address" in addr else "email", "") or "").strip()
            folder = str(addr.get("folder", "") or "").strip()
            reg_no = addr.get("registration_no", "")
            
            dest_type = ""
            dest_val = ""
            if folder and folder not in ("-", "—", ""):
                if folder.startswith("ftp://"):
                    dest_type = "FTP"
                elif folder.startswith("\\\\"):
                    dest_type = "SMB"
                else:
                    dest_type = "Folder"
                dest_val = folder
            elif email and email not in ("-", "—", ""):
                dest_type = "Email"
                dest_val = email
            else:
                dest_type = "—"
                dest_val = "—"
                
            has_valid_dest = True
            parent_values = self.printer_tree.item(node_id, "values")
            printer_ip = parent_values[0] if parent_values else ""
            entry_id = addr.get("entry_id", "")
            item_iid = f"dest_{printer_ip.lower()}_{reg_no}_{entry_id}"
            
            if dest_type == "Email":
                self.printer_tree.insert(
                    node_id,
                    tk.END,
                    iid=item_iid,
                    text=f"[{dest_type}] {name}",
                    values=(dest_val, "", "", "", "")
                )
            elif dest_type in ("FTP", "SMB", "Folder"):
                self.printer_tree.insert(
                    node_id,
                    tk.END,
                    iid=item_iid,
                    text=f"[{dest_type}] {name}",
                    values=("", dest_val, "", "", "")
                )
            else:
                self.printer_tree.insert(
                    node_id,
                    tk.END,
                    iid=item_iid,
                    text=f"[{dest_type}] {name}",
                    values=("—", "—", "", "", "")
                )
                    
        if not has_valid_dest:
            self.printer_tree.insert(
                node_id,
                tk.END,
                text="(No scan/ftp/folder destinations)",
                values=("", "", "", "", "")
            )
            
    def update_printer_destinations_error(self, node_id: str, error_msg: str) -> None:
        if not self.printer_tree.exists(node_id):
            return
        for child in self.printer_tree.get_children(node_id):
            self.printer_tree.delete(child)
        self.printer_tree.insert(
            node_id,
            tk.END,
            text=f"(Error: {error_msg})",
            values=("", "", "", "", "")
        )
        
    def add_printer_destination(self, selected: str = None) -> None:
        if not selected:
            selected = self.printer_tree.focus()
        if not selected:
            messagebox.showwarning("Warning", "Please select a printer to add a destination.")
            return
            
        parent_id = self.printer_tree.parent(selected)
        printer_node_id = parent_id if parent_id else selected
        
        values = self.printer_tree.item(printer_node_id, "values")
        if not values:
            messagebox.showwarning("Warning", "Could not find selected printer details.")
            return
            
        printer_ip = values[0]
        printer = self.printers_by_ip.get(printer_ip.lower())
        if not printer:
            messagebox.showerror("Error", f"Printer with IP {printer_ip} is not loaded.")
            return
            
        if printer.printer_type.lower() != "ricoh":
            messagebox.showwarning("Unsupported", "Scan address management is only supported for Ricoh copiers.")
            return
            
        dlg = PrinterDestinationDialog(self.root, f"Add Dest: {printer.name}")
        self.root.wait_window(dlg)
        
        if dlg.result:
            progress = ProgressDialog(self.root, "Connecting to Copier", "Adding destination on Ricoh printer...")
            
            def task():
                res = None
                err_msg = None
                try:
                    from agent.modules.ricoh.service import RicohService
                    api_client = APIClient(self.config)
                    ricoh_service = RicohService(api_client, config=self.config)
                    res = ricoh_service.create_address_user_wizard(
                        printer=printer,
                        name=dlg.result["name"],
                        email=dlg.result["email"],
                        folder=dlg.result["folder"],
                        fields={
                            "folderAuthUserNameIn": dlg.result["ftp_user"],
                            "folderAuthUserName": dlg.result["ftp_user"],
                            "folderPasswordIn": dlg.result["ftp_password"],
                            "wk_folderPasswordIn": dlg.result["ftp_password"],
                            "folderPasswordConfirmIn": dlg.result["ftp_password"],
                            "wk_folderPasswordConfirmIn": dlg.result["ftp_password"]
                        }
                    )
                except Exception as exc:
                    LOGGER.exception("Failed to add scan destination in thread")
                    err_msg = str(exc)
                finally:
                    self.root.after(0, progress.destroy)
                    def refresh_single():
                        try:
                            from agent.modules.ricoh.service import RicohService
                            api_client = APIClient(self.config)
                            ricoh_service = RicohService(api_client, config=self.config)
                            self.fetch_single_address_book(printer_node_id, printer, ricoh_service)
                        except Exception:
                            pass
                    threading.Thread(target=refresh_single, daemon=True).start()
                    if err_msg:
                        self.root.after(50, lambda: messagebox.showerror("Error", err_msg))
                    elif res and res.get("ok"):
                        self.root.after(50, lambda: messagebox.showinfo("Success", f"Successfully created destination '{dlg.result['name']}'!"))
                    else:
                        error_detail = res.get('error', 'Unknown error') if res else 'Could not connect'
                        self.root.after(50, lambda: messagebox.showerror("Error", f"Failed to create destination: {error_detail}"))
                    
            threading.Thread(target=task, daemon=True).start()
            
    def edit_printer_destination(self) -> None:
        selected = self.printer_tree.focus()
        if not selected or not selected.startswith("dest_"):
            messagebox.showwarning("Warning", "Please select a destination child node to edit.")
            return
            
        parts = selected.split("_", 3)
        printer_ip = parts[1]
        reg_no = parts[2]
        entry_id = parts[3] if len(parts) > 3 else ""
        
        printer = self.printers_by_ip.get(printer_ip.lower())
        if not printer:
            messagebox.showerror("Error", f"Printer with IP {printer_ip} is not loaded.")
            return
            
        parent_id = self.printer_tree.parent(selected)
        
        item_text = self.printer_tree.item(selected, "text")
        if "] " in item_text:
            dtype, name = item_text.split("] ", 1)
            dtype = dtype.lstrip("[")
        else:
            dtype = "FTP"
            name = item_text
            
        dest_values = self.printer_tree.item(selected, "values")
        email = dest_values[0] if dtype == "Email" else ""
        folder = dest_values[1] if dtype != "Email" else ""
        
        progress = ProgressDialog(self.root, "Connecting to Copier", "Fetching destination details from Ricoh printer...")
        
        def fetch_task():
            details = None
            err_msg = None
            session = None
            try:
                from agent.modules.ricoh.service import RicohService
                api_client = APIClient(self.config)
                ricoh_service = RicohService(api_client, config=self.config)
                
                session = ricoh_service.create_http_client(printer, authenticated=True)
                
                if entry_id:
                    details = ricoh_service.get_address_entry_details(printer, entry_id, session=session)
            except Exception as exc:
                LOGGER.warning("Failed to fetch entry details from copier: %s", exc)
                err_msg = str(exc)
            finally:
                if session is not None:
                    try:
                        ricoh_service._reset_web_session(session, printer)
                        session.close()
                    except Exception:
                        pass
                
                self.root.after(0, progress.destroy)
                
                def open_dialog():
                    nonlocal folder, email
                    ftp_user = ""
                    folder_server = ""
                    folder_port = ""
                    folder_path = ""
                    
                    if details:
                        proto = details.get("folder_protocol", "")
                        folder_server = details.get("folder_server", "")
                        folder_port = str(details.get("folder_port", 21))
                        folder_path = details.get("folder_path", "")
                        ftp_user = details.get("folder_auth_user", "")
                        
                        if folder_server:
                            if proto in ("FTP_O", "FTP"):
                                folder = f"ftp://{folder_server}:{folder_port}{folder_path}"
                            elif proto in ("SMB", "SMB_O"):
                                norm_path = folder_path.replace("/", "\\")
                                if not norm_path.startswith("\\") and norm_path:
                                    norm_path = f"\\{norm_path}"
                                folder = f"\\\\{folder_server}{norm_path}"
                            else:
                                folder = folder_server
                    else:
                        if folder.startswith("ftp://"):
                            match = re.match(r'ftp://([^:/]+)(?::(\d+))?(.*)', folder)
                            if match:
                                folder_server = match.group(1)
                                folder_port = match.group(2) or "21"
                                folder_path = match.group(3)
                        elif folder.startswith("\\\\"):
                            match = re.match(r'\\\\([^\\]+)\\(.*)', folder)
                            if match:
                                folder_server = match.group(1)
                                folder_path = "\\" + match.group(2)
                                folder_port = "445"
                        else:
                            folder_server = folder
                            folder_port = "21"
                            folder_path = "/"
                                
                    dest_data = {
                        "name": name,
                        "type": dtype,
                        "email": email,
                        "folder": folder,
                        "folder_server": folder_server,
                        "folder_port": folder_port,
                        "folder_path": folder_path,
                        "ftp_user": ftp_user,
                        "ftp_password": ""
                    }
                    
                    dlg = PrinterDestinationDialog(self.root, f"Edit Dest: {name}", dest_data)
                    self.root.wait_window(dlg)
                    
                    if dlg.result:
                        progress_update = ProgressDialog(self.root, "Connecting to Copier", "Updating destination on Ricoh printer...")
                        
                        def update_task():
                            res = None
                            update_err = None
                            update_session = None
                            try:
                                from agent.modules.ricoh.service import RicohService
                                api_client = APIClient(self.config)
                                ricoh_service = RicohService(api_client, config=self.config)
                                
                                update_session = ricoh_service.create_http_client(printer, authenticated=True)
                                
                                res = ricoh_service.modify_address_user_wizard(
                                    printer=printer,
                                    registration_no=reg_no,
                                    name=dlg.result["name"],
                                    email=dlg.result["email"],
                                    folder=dlg.result["folder"],
                                    entry_id=entry_id,
                                    fields={
                                        "folderAuthUserNameIn": dlg.result["ftp_user"],
                                        "folderAuthUserName": dlg.result["ftp_user"],
                                        "folderPasswordIn": dlg.result["ftp_password"],
                                        "wk_folderPasswordIn": dlg.result["ftp_password"],
                                        "folderPasswordConfirmIn": dlg.result["ftp_password"],
                                        "wk_folderPasswordConfirmIn": dlg.result["ftp_password"]
                                    },
                                    session=update_session
                                )
                            except Exception as exc:
                                LOGGER.exception("Failed to modify scan destination in thread")
                                update_err = str(exc)
                            finally:
                                if update_session is not None:
                                    try:
                                        ricoh_service._reset_web_session(update_session, printer)
                                        update_session.close()
                                    except Exception:
                                        pass
                                self.root.after(0, progress_update.destroy)
                                def refresh_single():
                                    try:
                                        from agent.modules.ricoh.service import RicohService
                                        api_client = APIClient(self.config)
                                        ricoh_service = RicohService(api_client, config=self.config)
                                        self.fetch_single_address_book(parent_id, printer, ricoh_service)
                                    except Exception:
                                        pass
                                threading.Thread(target=refresh_single, daemon=True).start()
                                if update_err:
                                    self.root.after(50, lambda: messagebox.showerror("Error", update_err))
                                elif res and res.get("ok"):
                                    self.root.after(50, lambda: messagebox.showinfo("Success", f"Successfully updated destination to '{dlg.result['name']}'!"))
                                else:
                                    error_detail = res.get('error', 'Unknown error') if res else 'Could not connect'
                                    self.root.after(50, lambda: messagebox.showerror("Error", f"Failed to update destination: {error_detail}"))
                        
                        threading.Thread(target=update_task, daemon=True).start()
                
                self.root.after(50, open_dialog)
                
        threading.Thread(target=fetch_task, daemon=True).start()
            
    def on_printer_tree_double_click(self, event) -> None:
        selected = self.printer_tree.focus()
        if not selected or not selected.startswith("dest_"):
            return
            
        parts = selected.split("_", 3)
        printer_ip = parts[1]
        reg_no = parts[2]
        entry_id = parts[3] if len(parts) > 3 else ""
        
        printer = self.printers_by_ip.get(printer_ip.lower())
        if not printer:
            return
            
        progress = ProgressDialog(self.root, "Connecting to Copier", "Fetching destination details from Ricoh printer...")
        
        def fetch_task():
            details = None
            session = None
            try:
                from agent.modules.ricoh.service import RicohService
                api_client = APIClient(self.config)
                ricoh_service = RicohService(api_client, config=self.config)
                session = ricoh_service.create_http_client(printer, authenticated=True)
                if entry_id:
                    details = ricoh_service.get_address_entry_details(printer, entry_id, session=session)
            except Exception as exc:
                LOGGER.warning("Failed to fetch entry details: %s", exc)
            finally:
                if session is not None:
                    try:
                        ricoh_service._reset_web_session(session, printer)
                        session.close()
                    except Exception:
                        pass
                
                self.root.after(0, progress.destroy)
                
                def show_details():
                    if not details:
                        messagebox.showerror("Error", "Could not fetch details for this destination from the printer.")
                        return
                        
                    proto = details.get("folder_protocol", "")
                    srv = details.get("folder_server", "")
                    port = details.get("folder_port", 21)
                    path = details.get("folder_path", "")
                    
                    proto_display = "SMB" if proto in ("SMB", "SMB_O") else ("FTP" if proto in ("FTP", "FTP_O") else proto)
                    
                    # Extract server name from path if it is a UNC path and srv is empty
                    if proto_display == "SMB" and not srv:
                        if path.startswith("\\\\"):
                            parts_unc = path.lstrip("\\").split("\\")
                            if parts_unc:
                                srv = parts_unc[0]
                                path = "\\".join(parts_unc[1:])

                    # For SMB, port is not used
                    port_display = "—" if proto_display == "SMB" else port

                    # Build full path for display
                    if proto_display == "SMB":
                        clean_srv = srv.strip().strip("\\").strip("/")
                        clean_path = path.strip().strip("\\").strip("/")
                        if clean_srv:
                            path_display = f"\\\\{clean_srv}\\{clean_path}"
                        else:
                            path_display = path
                    else:
                        path_display = path

                    physical_path = ""
                    
                    if proto_display == "FTP":
                        try:
                            from agent.services.ftp_store import load_config
                            config_data = load_config()
                            for site in config_data.get("sites", []):
                                if int(site.get("port", 0)) == int(port):
                                    physical_path = site.get("physical_path", "")
                                    break
                        except Exception:
                            pass
                    elif proto_display == "SMB":
                        import socket
                        local_host = socket.gethostname().strip().lower()
                        is_local = False
                        if srv.lower() in {"127.0.0.1", "localhost", local_host}:
                            is_local = True
                        else:
                            try:
                                local_ips = socket.gethostbyname_ex(local_host)[2]
                                if srv in local_ips:
                                    is_local = True
                            except Exception:
                                pass
                                
                        if is_local:
                            share_name = path.replace("\\", "/").strip("/")
                            if "/" in share_name:
                                share_name = share_name.split("/")[0]
                            if share_name:
                                try:
                                    import subprocess
                                    import re
                                    res = subprocess.run(["net", "share", share_name], capture_output=True, text=True, timeout=3, shell=True)
                                    if res.returncode == 0:
                                        for line in res.stdout.splitlines():
                                            if line.strip().lower().startswith("path"):
                                                parts_line = re.split(r'\s+', line.strip(), 1)
                                                if len(parts_line) > 1:
                                                    physical_path = parts_line[1].strip()
                                                    break
                                except Exception:
                                    pass
                                    
                    if not physical_path:
                        physical_path = f"Remote / Not found on this PC ({srv or 'Unknown'})"
                        
                    info_msg = (
                        f"Name (Tên hiển thị): {self.printer_tree.item(selected, 'text')}\r\n"
                        f"Protocol (Giao thức): {proto_display}\r\n"
                        f"Folder Port No. (Cổng): {port_display}\r\n"
                        f"Path on Copier (Đường dẫn WIM): {path_display}\r\n"
                        f"Path to Source Folder (Thư mục vật lý trên PC): {physical_path}"
                    )
                    messagebox.showinfo("Destination Information", info_msg)
                    
                self.root.after(50, show_details)
                
        threading.Thread(target=fetch_task, daemon=True).start()

            
    def delete_printer_destination(self, selected: str = None) -> None:
        if not selected:
            selected = self.printer_tree.focus()
        if not selected or not selected.startswith("dest_"):
            messagebox.showwarning("Warning", "Please select a destination child node to delete.")
            return
            
        parts = selected.split("_", 3)
        printer_ip = parts[1]
        reg_no = parts[2]
        entry_id = parts[3] if len(parts) > 3 else ""
        parent_id = self.printer_tree.parent(selected)
        
        printer = self.printers_by_ip.get(printer_ip.lower())
        if not printer:
            messagebox.showerror("Error", f"Printer with IP {printer_ip} is not loaded.")
            return
            
        item_text = self.printer_tree.item(selected, "text")
        
        confirm = messagebox.askyesno(
            "Confirm Delete",
            f"Are you sure you want to delete destination '{item_text}' from printer '{printer.name}'?\nThis will remove it from the address book.",
            default=messagebox.NO
        )
        if confirm:
            progress = ProgressDialog(self.root, "Connecting to Copier", "Deleting destination from Ricoh printer...")
            
            def task():
                res = None
                err_msg = None
                try:
                    from agent.modules.ricoh.service import RicohService
                    api_client = APIClient(self.config)
                    ricoh_service = RicohService(api_client, config=self.config)
                    res = ricoh_service.delete_address_entries(
                        printer, 
                        [reg_no], 
                        entry_ids=[entry_id] if entry_id else None
                    )
                except Exception as exc:
                    LOGGER.exception("Failed to delete scan destination in thread")
                    err_msg = str(exc)
                finally:
                    self.root.after(0, progress.destroy)
                    def refresh_single():
                        try:
                            from agent.modules.ricoh.service import RicohService
                            api_client = APIClient(self.config)
                            ricoh_service = RicohService(api_client, config=self.config)
                            self.fetch_single_address_book(parent_id, printer, ricoh_service)
                        except Exception:
                            pass
                    threading.Thread(target=refresh_single, daemon=True).start()
                    if err_msg:
                        self.root.after(50, lambda: messagebox.showerror("Error", err_msg))
                    elif res and res.get("ok"):
                        self.root.after(50, lambda: messagebox.showinfo("Success", f"Successfully deleted destination '{item_text}'!"))
                    else:
                        error_detail = res.get('error', 'Unknown error') if res else 'Could not connect'
                        self.root.after(50, lambda: messagebox.showerror("Error", f"Failed to delete destination: {error_detail}"))
                    
            threading.Thread(target=task, daemon=True).start()
            
    def clear_printers_tree(self) -> None:
        for item in self.printer_tree.get_children():
            self.printer_tree.delete(item)

    def show_printer_context_menu(self, event) -> None:
        iid = self.printer_tree.identify_row(event.y)
        if not iid:
            return
            
        self.printer_tree.selection_set(iid)
        self.printer_tree.focus(iid)
        
        parent_id = self.printer_tree.parent(iid)
        menu = tk.Menu(self.root, tearoff=0)
        
        if parent_id != "":
            # Child item (folder / SMB / Email destination)
            item_text = self.printer_tree.item(iid, "text")
            # Only show Delete if it is a valid destination node
            if iid.startswith("dest_") or any(item_text.startswith(prefix) for prefix in ["[Folder]", "[SMB]", "[FTP]", "[Email]"]):
                menu.add_command(label="Delete (Xóa nhận)", command=lambda: self.delete_printer_destination(iid))
        else:
            # Parent printer node
            values = self.printer_tree.item(iid, "values")
            if values:
                printer_ip = values[0]
                printer = self.printers_by_ip.get(printer_ip.lower())
                if printer and printer.printer_type.lower() == "ricoh":
                    menu.add_command(label="Add Email Dest (Thêm nhận Email)", command=lambda: self.add_email_destination_shortcut(iid))
                    
        try:
            menu.tk_popup(event.x_root, event.y_root)
        finally:
            menu.grab_release()
            
    def add_email_destination_shortcut(self, selected: str = None) -> None:
        if not selected:
            selected = self.printer_tree.focus()
        if not selected or self.printer_tree.parent(selected) != "":
            return
            
        values = self.printer_tree.item(selected, "values")
        if not values:
            return
            
        printer_ip = values[0]
        printer = self.printers_by_ip.get(printer_ip.lower())
        if not printer:
            return
            
        email = simpledialog.askstring("Add Email Destination", f"Enter Email for {printer.name}:", parent=self.root)
        if not email:
            return
            
        email = email.strip()
        if not email or "@" not in email:
            messagebox.showerror("Error", "Invalid email address!", parent=self.root)
            return
            
        username = email.split("@")[0]
        
        progress = ProgressDialog(self.root, "Connecting to Copier", "Adding email destination on Ricoh printer...")
        
        def task():
            res = None
            err_msg = None
            session = None
            try:
                from agent.modules.ricoh.service import RicohService
                api_client = APIClient(self.config)
                ricoh_service = RicohService(api_client, config=self.config)
                
                # Pre-authenticate a single requests session to reuse
                session = ricoh_service.create_http_client(printer, authenticated=True)
                
                setup_res = ricoh_service.setup_scan_destination(
                    printer=None,
                    username=email,
                    session=session,
                    email=email,
                )
                
                ftp_upload_url = ""
                ftp_user = ""
                ftp_password = ""
                if setup_res.get("ok"):
                    ftp_upload_url = setup_res.get("ftp_upload_url", "")
                    ftp_info = setup_res.get("ftp", {})
                    ftp_user = ftp_info.get("ftp_user", "")
                    ftp_password = ftp_info.get("ftp_password", "")
                
                fields = {}
                if ftp_user:
                    fields["folderAuthUserNameIn"] = ftp_user
                    fields["folderAuthUserName"] = ftp_user
                if ftp_password:
                    fields["folderPasswordIn"] = ftp_password
                    fields["wk_folderPasswordIn"] = ftp_password
                    fields["folderPasswordConfirmIn"] = ftp_password
                    fields["wk_folderPasswordConfirmIn"] = ftp_password

                res = ricoh_service.create_address_user_wizard(
                    printer=printer,
                    name=email,
                    email="", # Pass empty string for email to skip MAIL wizard step
                    folder=ftp_upload_url,
                    fields=fields,
                    session=session
                )
            except Exception as exc:
                LOGGER.exception("Failed to add scan email destination in thread")
                err_msg = str(exc)
            finally:
                if session is not None:
                    try:
                        ricoh_service._reset_web_session(session, printer)
                        session.close()
                    except Exception:
                        pass
                self.root.after(0, progress.destroy)
                def refresh_single():
                    try:
                        from agent.modules.ricoh.service import RicohService
                        api_client = APIClient(self.config)
                        ricoh_service = RicohService(api_client, config=self.config)
                        self.fetch_single_address_book(selected, printer, ricoh_service)
                    except Exception:
                        pass
                threading.Thread(target=refresh_single, daemon=True).start()
                if err_msg:
                    self.root.after(50, lambda: messagebox.showerror("Error", err_msg))
                elif res and res.get("ok"):
                    self.root.after(50, lambda: messagebox.showinfo("Success", f"Successfully created email destination for '{email}'!"))
                else:
                    error_detail = res.get('error', 'Unknown error') if res else 'Could not connect'
                    self.root.after(50, lambda: messagebox.showerror("Error", f"Failed to create email destination: {error_detail}"))
                
        threading.Thread(target=task, daemon=True).start()

    def create_camera_tab(self) -> None:
        self.camera_tab = ttk.Frame(self.notebook, padding="10 10 10 10")
        self.notebook.add(self.camera_tab, text=" Cameras (Camera ghi hình) ")
        
        main_frame = ttk.Frame(self.camera_tab)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Action Buttons frame packed first on the right
        btn_frame = ttk.Frame(main_frame, padding="10 0 0 0")
        btn_frame.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Treeview frame
        tree_frame = ttk.Frame(main_frame)
        tree_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        cols = ("IP", "MAC", "Manufacturer", "Model", "RTSP", "Status", "Recording")
        self.camera_tree = ttk.Treeview(tree_frame, columns=cols, show="tree headings")
        
        self.camera_tree.heading("#0", text="Tên Camera / Thiết Bị")
        self.camera_tree.heading("IP", text="Địa chỉ IP")
        self.camera_tree.heading("MAC", text="Địa chỉ MAC")
        self.camera_tree.heading("Manufacturer", text="Hãng")
        self.camera_tree.heading("Model", text="Dòng máy")
        self.camera_tree.heading("RTSP", text="Địa chỉ RTSP")
        self.camera_tree.heading("Status", text="Kết nối")
        self.camera_tree.heading("Recording", text="Trạng thái")
        
        self.camera_tree.column("#0", width=180, anchor=tk.W)
        self.camera_tree.column("IP", width=110, anchor=tk.W)
        self.camera_tree.column("MAC", width=120, anchor=tk.W)
        self.camera_tree.column("Manufacturer", width=100, anchor=tk.W)
        self.camera_tree.column("Model", width=100, anchor=tk.W)
        self.camera_tree.column("RTSP", width=220, anchor=tk.W)
        self.camera_tree.column("Status", width=80, anchor=tk.CENTER)
        self.camera_tree.column("Recording", width=90, anchor=tk.CENTER)
        
        vsb = ttk.Scrollbar(tree_frame, orient="vertical", command=self.camera_tree.yview)
        hsb = ttk.Scrollbar(tree_frame, orient="horizontal", command=self.camera_tree.xview)
        self.camera_tree.configure(yscrollcommand=vsb.set, xscrollcommand=hsb.set)
        
        self.camera_tree.grid(row=0, column=0, sticky="nsew")
        vsb.grid(row=0, column=1, sticky="ns")
        hsb.grid(row=1, column=0, sticky="ew")
        
        tree_frame.rowconfigure(0, weight=1)
        tree_frame.columnconfigure(0, weight=1)
        
        # Action Buttons
        ttk.Button(btn_frame, text="Start Rec (Bắt đầu)", command=self.gui_start_camera_rec, width=18).pack(pady=4)
        ttk.Button(btn_frame, text="Stop Rec (Dừng ghi)", command=self.gui_stop_camera_rec, width=18).pack(pady=4)
        ttk.Button(btn_frame, text="Test Cam (Kiểm tra)", command=self.gui_test_camera_conn, width=18).pack(pady=4)
        
        ttk.Separator(btn_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=8)
        
        ttk.Button(btn_frame, text="Cấu hình (Edit)", command=self.gui_edit_camera, width=18).pack(pady=4)
        ttk.Button(btn_frame, text="Xoá cấu hình (Delete)", command=self.gui_delete_camera, width=18).pack(pady=4)
        
        ttk.Separator(btn_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=8)
        ttk.Button(btn_frame, text="Cài đặt FFMPEG", command=self.gui_install_ffmpeg, width=18).pack(pady=4)
        ttk.Button(btn_frame, text="Refresh (Tải lại)", command=self.refresh_cameras, width=18).pack(pady=4)

    def gui_install_ffmpeg(self) -> None:
        import threading
        from agent.services.camera_manager import CameraManager
        
        def callback(success: bool, msg: str) -> None:
            if success:
                self.root.after(0, lambda: messagebox.showinfo("FFmpeg Setup", msg))
            else:
                self.root.after(0, lambda: messagebox.showerror("FFmpeg Setup", msg))
                
        cm = CameraManager()
        threading.Thread(target=cm._ensure_binaries_bg, args=(callback,), daemon=True, name="ffmpeg-downloader").start()
        messagebox.showinfo("Đang cài đặt", "Đang tiến hành tải và cài đặt FFmpeg ngầm. Bạn sẽ nhận được thông báo khi hoàn tất.")

    def refresh_cameras(self) -> None:
        for item in self.camera_tree.get_children():
            self.camera_tree.delete(item)
            
        self.camera_tree.insert("", tk.END, text="Scanning network for cameras...", values=("", "", "", "", "", "", ""))
        
        def run() -> None:
            try:
                import json
                import socket
                import urllib.request
                import re
                import subprocess
                from pathlib import Path
                from agent.services.camera_manager import CameraManager
                cm = CameraManager()
                
                # 1. Discover local subnet
                subnets = []
                try:
                    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                    s.connect(("8.8.8.8", 80))
                    ip = s.getsockname()[0]
                    s.close()
                    parts = ip.split(".")
                    if len(parts) == 4:
                        subnets.append(f"{parts[0]}.{parts[1]}.{parts[2]}")
                except Exception:
                    pass
                if not subnets:
                    subnets.append("192.168.1")
                    subnets.append("192.168.0")
                
                # Helper for SOAP ONVIF request
                def get_onvif_info(ip_addr: str) -> dict[str, str]:
                    endpoints = [
                        f"http://{ip_addr}/onvif/device_service",
                        f"http://{ip_addr}:80/onvif/device_service",
                        f"http://{ip_addr}:888/onvif/device_service",
                        f"http://{ip_addr}:8080/onvif/device_service",
                    ]
                    soap_msg = (
                        '<?xml version="1.0" encoding="utf-8"?>'
                        '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" '
                        'xmlns:tds="http://www.onvif.org/ver10/device/wsdl">'
                        '<soap:Body>'
                        '<tds:GetDeviceInformation/>'
                        '</soap:Body>'
                        '</soap:Envelope>'
                    )
                    headers = {
                        'Content-Type': 'application/soap+xml; charset=utf-8',
                        'Content-Length': str(len(soap_msg))
                    }
                    
                    last_error = "ONVIF tắt/Không kết nối"
                    for url in endpoints:
                        try:
                            req = urllib.request.Request(url, data=soap_msg.encode('utf-8'), headers=headers, method='POST')
                            with urllib.request.urlopen(req, timeout=0.8) as response:
                                html = response.read().decode('utf-8', errors='ignore')
                                manufacturer = "Generic"
                                model = "Camera IP"
                                m_match = re.search(r'<[^:>]*Manufacturer[^>]*>([^<]+)</[^>]*Manufacturer[^>]*>', html)
                                if m_match:
                                    manufacturer = m_match.group(1).strip()
                                mo_match = re.search(r'<[^:>]*Model[^>]*>([^<]+)</[^>]*Model[^>]*>', html)
                                if mo_match:
                                    model = mo_match.group(1).strip()
                                return {"manufacturer": manufacturer, "model": model}
                        except urllib.error.HTTPError as he:
                            if he.code == 401:
                                last_error = "Yêu cầu mật khẩu (401)"
                            else:
                                last_error = f"Lỗi HTTP {he.code}"
                        except urllib.error.URLError as ue:
                            import socket
                            if isinstance(ue.reason, socket.timeout):
                                last_error = "ONVIF Timeout (Hết hạn)"
                            elif isinstance(ue.reason, ConnectionRefusedError):
                                last_error = "Từ chối kết nối (Cổng đóng)"
                            else:
                                last_error = "Sai cổng/Cổng đóng"
                        except socket.timeout:
                            last_error = "ONVIF Timeout (Hết hạn)"
                        except Exception as e:
                            last_error = f"Lỗi kết nối: {type(e).__name__}"
                            
                    return {"manufacturer": "Generic", "model": last_error}

                # Helper to scan port 554
                def scan_ip_port(ip_addr: str) -> bool:
                    try:
                        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                        s.settimeout(0.6)
                        res = s.connect_ex((ip_addr, 554))
                        s.close()
                        return res == 0
                    except Exception:
                        return False

                # Helper to get MAC from ARP table
                def get_mac_address(ip_addr: str) -> str:
                    try:
                        output = subprocess.check_output(f"arp -a {ip_addr}", shell=True, timeout=0.8).decode('utf-8', errors='ignore')
                        mac_match = re.search(r'([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}', output)
                        if mac_match:
                            return mac_match.group(0).upper().replace("-", ":")
                    except Exception:
                        pass
                    return "Unknown"

                # 2. Run ONVIF multicast WS-Discovery
                discovered_ips = []
                MCAST_GRP = '239.255.255.250'
                MCAST_PORT = 3702
                probe_msg = (
                    '<?xml version="1.0" encoding="utf-8"?>'
                    '<Envelope xmlns:tds="http://www.onvif.org/ver10/device/wsdl" '
                    'xmlns:dn="http://www.onvif.org/ver10/network/wsdl" '
                    'xmlns="http://www.w3.org/2003/05/soap-envelope">'
                    '<Header>'
                    '<MessageID xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">'
                    'uuid:a801e0c8-1111-a8a8-b8b8-0123456789ab'
                    '</MessageID>'
                    '<To xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">urn:schemas-xmlsoap-org:ws:2004:08:d_d</To>'
                    '<Action xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</Action>'
                    '</Header>'
                    '<Body>'
                    '<Probe xmlns="http://schemas.xmlsoap.org/ws/2005/04/discovery">'
                    '<Types>tds:Device</Types>'
                    '</Probe>'
                    '</Body>'
                    '</Envelope>'
                )
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
                    sock.settimeout(1.0)
                    sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 2)
                    sock.sendto(probe_msg.encode('utf-8'), (MCAST_GRP, MCAST_PORT))
                    while True:
                        try:
                            data, addr = sock.recvfrom(65535)
                            response = data.decode('utf-8', errors='ignore')
                            ipv4_pattern = re.compile(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')
                            urls = re.findall(r'https?://[^\s<>"]+', response)
                            for url in urls:
                                ip_match = re.search(r'https?://([^:/]+)', url)
                                if ip_match:
                                    ip_found = ip_match.group(1)
                                    if ipv4_pattern.match(ip_found) and ip_found not in discovered_ips and not ip_found.startswith("127."):
                                        discovered_ips.append(ip_found)
                        except socket.timeout:
                            break
                    sock.close()
                except Exception:
                    pass

                # 3. Scan subnet port 554 for RTSP cameras
                for subnet_prefix in subnets:
                    ips_to_scan = [f"{subnet_prefix}.{i}" for i in range(1, 255) if f"{subnet_prefix}.{i}" not in discovered_ips]
                    with ThreadPoolExecutor(max_workers=50) as executor:
                        futures = {executor.submit(scan_ip_port, ip_addr): ip_addr for ip_addr in ips_to_scan}
                        for future in futures:
                            ip_addr = futures[future]
                            try:
                                if future.result():
                                    discovered_ips.append(ip_addr)
                            except Exception:
                                pass
                                
                # 4. Load configured cameras
                cfg_path = Path("storage/camera_configs.json")
                configs = []
                if cfg_path.exists():
                    try:
                        with cfg_path.open("r", encoding="utf-8") as f:
                            configs = json.load(f)
                    except Exception:
                        configs = []
                
                # Add any configured camera IP not in discovered_ips
                for c in configs:
                    rtsp_url = c.get("rtsp_url", "")
                    ip_match = re.search(r'rtsp://([^:/]+)', rtsp_url)
                    if ip_match:
                        ip_addr = ip_match.group(1)
                        if ip_addr not in discovered_ips:
                            discovered_ips.append(ip_addr)

                # 5. Retrieve device info and status
                results = []
                for ip_addr in discovered_ips:
                    info = get_onvif_info(ip_addr)
                    mac_addr = get_mac_address(ip_addr)
                    
                    matched_cfg = None
                    for c in configs:
                        rtsp_url = c.get("rtsp_url", "")
                        if ip_addr in rtsp_url:
                            matched_cfg = c
                            break
                            
                    if matched_cfg:
                        camera_name = matched_cfg.get("camera_name", "Camera")
                        rtsp_display = matched_cfg.get("rtsp_url", "")
                        status_rec = cm.get_status(camera_name)
                        is_rec = status_rec.get("running", False)
                        rec_str = "Đang ghi" if is_rec else "Chờ"
                        status_conn = "Online" if cm.test_rtsp_connection(rtsp_display)[0] else "Offline"
                    else:
                        camera_name = f"Camera {ip_addr}"
                        rtsp_display = f"rtsp://{ip_addr}:554/cam/realmonitor?channel=1&subtype=0"
                        rec_str = "Chờ (Chưa cấu hình)"
                        status_conn = "Online"
                        
                    results.append((
                        camera_name,
                        ip_addr,
                        mac_addr,
                        info.get("manufacturer", "Generic"),
                        info.get("model", "Camera IP"),
                        rtsp_display,
                        status_conn,
                        rec_str
                    ))
                    
                def update_ui(items) -> None:
                    for item in self.camera_tree.get_children():
                        self.camera_tree.delete(item)
                    for item in items:
                        self.camera_tree.insert(
                            "",
                            tk.END,
                            text=item[0],
                            values=(item[1], item[2], item[3], item[4], item[5], item[6], item[7])
                        )
                    if not self.camera_tree.get_children():
                        self.camera_tree.insert("", tk.END, text="Không tìm thấy camera nào", values=("", "", "", "", "", "", ""))
                        
                self.root.after(0, lambda: update_ui(results))
            except Exception as exc:
                LOGGER.exception("Failed to scan and refresh cameras")
                self.root.after(0, lambda: update_ui([]))
                
        threading.Thread(target=run, daemon=True, name="gui-camera-refresh").start()

    def gui_start_camera_rec(self) -> None:
        selected = self.camera_tree.focus()
        if not selected:
            messagebox.showwarning("Warning", "Please select a camera to start recording.")
            return
        camera_name = self.camera_tree.item(selected, "text")
        values = self.camera_tree.item(selected, "values")
        if not camera_name or "Loading" in camera_name or "Không tìm thấy" in camera_name:
            return
            
        ip_addr = values[0]
        rtsp_url = values[4]
        
        import json
        from pathlib import Path
        cfg_path = Path("storage/camera_configs.json")
        configs = []
        if cfg_path.exists():
            try:
                with cfg_path.open("r", encoding="utf-8") as f:
                    configs = json.load(f)
            except Exception:
                configs = []
                
        cfg = next((c for c in configs if ip_addr in c.get("rtsp_url", "")), None)
        if not cfg:
            prefill = {
                "camera_name": camera_name,
                "rtsp_url": rtsp_url,
                "segment_duration": 60,
                "prefix": "rec",
                "no_audio": True
            }
            dlg = CameraDialog(self.root, f"Cấu hình ghi hình: {camera_name}", prefill)
            self.root.wait_window(dlg)
            if not dlg.result:
                return
            cfg = dlg.result
            configs.append(cfg)
            try:
                with cfg_path.open("w", encoding="utf-8") as f:
                    json.dump(configs, f, indent=2, ensure_ascii=False)
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save configuration: {e}")
                return
                
        def run() -> None:
            try:
                from agent.services.camera_manager import CameraManager
                cm = CameraManager()
                import tempfile
                from pathlib import Path
                default_out = str(Path(tempfile.gettempdir()) / "GoPrinxAgent" / "video")
                output_dir = self.config.get_string("camera.output_dir", default_out)
                success = cm.start_recording(
                    camera_name=cfg["camera_name"],
                    rtsp_url=cfg["rtsp_url"],
                    output_dir=output_dir,
                    segment_duration=cfg.get("segment_duration", 60),
                    video_codec=cfg.get("video_codec", "copy"),
                    audio_codec=cfg.get("audio_codec", "copy"),
                    no_audio=cfg.get("no_audio", True),
                    prefix=cfg.get("prefix", "rec")
                )
                if success:
                    self.root.after(0, lambda: messagebox.showinfo("Success", f"Started recording camera '{cfg['camera_name']}'!"))
                else:
                    self.root.after(0, lambda: messagebox.showerror("Error", f"Failed to start recording camera '{cfg['camera_name']}'."))
            except Exception as exc:
                self.root.after(0, lambda exc=exc: messagebox.showerror("Error", str(exc)))
            finally:
                self.refresh_cameras()
                
        threading.Thread(target=run, daemon=True).start()

    def gui_stop_camera_rec(self) -> None:
        selected = self.camera_tree.focus()
        if not selected:
            messagebox.showwarning("Warning", "Please select a camera to stop recording.")
            return
        camera_name = self.camera_tree.item(selected, "text")
        values = self.camera_tree.item(selected, "values")
        if not camera_name or "Loading" in camera_name or "Không tìm thấy" in camera_name:
            return
            
        ip_addr = values[0]
        
        import json
        from pathlib import Path
        from agent.services.camera_manager import CameraManager
        cm = CameraManager()
        
        cfg_path = Path("storage/camera_configs.json")
        configs = []
        if cfg_path.exists():
            try:
                with cfg_path.open("r", encoding="utf-8") as f:
                    configs = json.load(f)
            except Exception:
                configs = []
                
        cfg = next((c for c in configs if ip_addr in c.get("rtsp_url", "")), None)
        if not cfg:
            return
            
        try:
            cm.stop_recording(cfg["camera_name"])
            messagebox.showinfo("Success", f"Stopped recording camera '{cfg['camera_name']}'.")
        except Exception as exc:
            messagebox.showerror("Error", str(exc))
        finally:
            self.refresh_cameras()

    def gui_test_camera_conn(self) -> None:
        selected = self.camera_tree.focus()
        if not selected:
            messagebox.showwarning("Warning", "Please select a camera to test connection.")
            return
        camera_name = self.camera_tree.item(selected, "text")
        values = self.camera_tree.item(selected, "values")
        if not camera_name or "Loading" in camera_name or "Không tìm thấy" in camera_name:
            return
            
        rtsp_url = values[4]
        if not rtsp_url:
            return
            
        def run() -> None:
            try:
                from agent.services.camera_manager import CameraManager
                cm = CameraManager()
                ok, msg = cm.test_rtsp_connection(rtsp_url)
                if ok:
                    self.root.after(0, lambda: messagebox.showinfo("Connection Test Success", f"✅ Kết nối thành công tới camera '{camera_name}'!\n\n{msg}"))
                else:
                    self.root.after(0, lambda: messagebox.showerror("Connection Test Failed", f"❌ Kết nối thất bại tới camera '{camera_name}':\n\n{msg}"))
            except Exception as exc:
                self.root.after(0, lambda exc=exc: messagebox.showerror("Error", str(exc)))
                
        threading.Thread(target=run, daemon=True).start()

    def gui_edit_camera(self) -> None:
        selected = self.camera_tree.focus()
        if not selected:
            messagebox.showwarning("Warning", "Please select a camera to edit configuration.")
            return
        camera_name = self.camera_tree.item(selected, "text")
        values = self.camera_tree.item(selected, "values")
        if not camera_name or "Loading" in camera_name or "Không tìm thấy" in camera_name:
            return
            
        ip_addr = values[0]
        rtsp_url = values[4]
        
        import json
        from pathlib import Path
        cfg_path = Path("storage/camera_configs.json")
        configs = []
        if cfg_path.exists():
            try:
                with cfg_path.open("r", encoding="utf-8") as f:
                    configs = json.load(f)
            except Exception:
                configs = []
                
        cfg = next((c for c in configs if ip_addr in c.get("rtsp_url", "")), None)
        is_new = False
        if not cfg:
            is_new = True
            cfg = {
                "camera_name": camera_name,
                "rtsp_url": rtsp_url,
                "segment_duration": 60,
                "prefix": "rec",
                "no_audio": True,
                "video_codec": "copy",
                "audio_codec": "copy"
            }
            
        dlg = CameraDialog(self.root, f"Cấu hình Camera: {cfg['camera_name']}", cfg)
        self.root.wait_window(dlg)
        
        if dlg.result:
            if is_new:
                configs.append(dlg.result)
            else:
                for c in configs:
                    if ip_addr in c.get("rtsp_url", ""):
                        c.update(dlg.result)
                        break
            try:
                with cfg_path.open("w", encoding="utf-8") as f:
                    json.dump(configs, f, indent=2, ensure_ascii=False)
                messagebox.showinfo("Success", f"Cấu hình camera '{cfg['camera_name']}' thành công!")
            except Exception as exc:
                messagebox.showerror("Error", str(exc))
            finally:
                self.refresh_cameras()

    def gui_delete_camera(self) -> None:
        selected = self.camera_tree.focus()
        if not selected:
            messagebox.showwarning("Warning", "Please select a camera to delete configuration.")
            return
        camera_name = self.camera_tree.item(selected, "text")
        values = self.camera_tree.item(selected, "values")
        if not camera_name or "Loading" in camera_name or "Không tìm thấy" in camera_name:
            return
            
        ip_addr = values[0]
        
        import json
        from pathlib import Path
        from agent.services.camera_manager import CameraManager
        cm = CameraManager()
        
        cfg_path = Path("storage/camera_configs.json")
        configs = []
        if cfg_path.exists():
            try:
                with cfg_path.open("r", encoding="utf-8") as f:
                    configs = json.load(f)
            except Exception:
                configs = []
                
        cfg = next((c for c in configs if ip_addr in c.get("rtsp_url", "")), None)
        if not cfg:
            messagebox.showwarning("Warning", "Camera này chưa được cấu hình ghi hình.")
            return
            
        if not messagebox.askyesno("Confirm Delete", f"Bạn có chắc muốn xoá cấu hình và dừng ghi hình cho camera '{cfg['camera_name']}'?"):
            return
            
        try:
            cm.stop_recording(cfg["camera_name"])
            configs = [c for c in configs if ip_addr not in c.get("rtsp_url", "")]
            with cfg_path.open("w", encoding="utf-8") as f:
                json.dump(configs, f, indent=2, ensure_ascii=False)
            messagebox.showinfo("Success", f"Đã xoá cấu hình camera '{cfg['camera_name']}'.")
        except Exception as exc:
            messagebox.showerror("Error", str(exc))
        finally:
            self.refresh_cameras()

    def update_status_bar(self, message: str) -> None:
        if hasattr(self, "status_bar"):
            self.status_bar.config(text=message)


def show_gui_window(app_version: str) -> None:
    try:
        import subprocess
        import sys
        from pathlib import Path
        from agent.services.runtime import fresh_pyinstaller_env
        
        # Write show signal to GUI
        try:
            signal_file = Path("storage/data/show_gui.signal")
            signal_file.parent.mkdir(parents=True, exist_ok=True)
            signal_file.write_text("show", encoding="utf-8")
        except Exception:
            pass
            
        if getattr(sys, "frozen", False):
            exe_path = sys.executable
            cmd = [exe_path, "--mode", "gui"]
        else:
            main_script = Path(__file__).resolve().parents[1] / "main.py"
            cmd = [sys.executable, str(main_script), "--mode", "gui"]
            
        LOGGER.info("Spawning standalone GUI process: %s", cmd)
        subprocess.Popen(
            cmd,
            env=fresh_pyinstaller_env(),
            creationflags=0x08000000 if sys.platform == "win32" else 0
        )
    except Exception as exc:
        LOGGER.exception("Failed to spawn standalone GUI process: %s", exc)



def run_gui_standalone(app_version: str) -> None:
    try:
        root = tk.Tk()
        
        # Make root.after thread-safe when called from background threads
        import queue
        gui_thread_id = threading.get_ident()
        gui_queue = queue.Queue()
        original_after = root.after

        def thread_safe_after(ms, func=None, *args):
            current_thread = threading.get_ident()
            if current_thread == gui_thread_id:
                return original_after(ms, func, *args)
            else:
                if func is not None:
                    gui_queue.put((ms, lambda: func(*args)))
                return None

        root.after = thread_safe_after

        def process_gui_queue():
            while True:
                try:
                    ms, cb = gui_queue.get_nowait()
                    original_after(ms, cb)
                except queue.Empty:
                    break
            original_after(100, process_gui_queue)

        original_after(100, process_gui_queue)
        
        # Try setting icon if exists
        icon_path = Path("agent/icon.ico")
        if icon_path.exists():
            try:
                root.iconbitmap(str(icon_path))
            except Exception:
                pass
        elif Path("../agent/icon.ico").exists():
            try:
                root.iconbitmap(str(Path("../agent/icon.ico")))
            except Exception:
                pass
        
        gui = PrintAgentGui(root, app_version)
        
        # Override WM_DELETE_WINDOW to hide instead of exit
        def on_close():
            root.withdraw()
        root.protocol("WM_DELETE_WINDOW", on_close)

        # Check for signal file to show/exit GUI
        def check_signal():
            try:
                signal_file = Path("storage/data/show_gui.signal")
                if signal_file.exists():
                    cmd = signal_file.read_text(encoding="utf-8").strip()
                    if cmd == "show":
                        signal_file.unlink()
                        root.deiconify()
                        root.lift()
                        root.focus_force()
                    elif cmd == "exit":
                        signal_file.unlink()
                        root.destroy()
                        return
                        
                # Check for status message signal
                status_file = Path("storage/data/status_message.txt")
                if status_file.exists():
                    msg = status_file.read_text(encoding="utf-8").strip()
                    if msg:
                        status_file.unlink()
                        gui.update_status_bar(msg)
            except Exception:
                pass
            original_after(200, check_signal)

        original_after(200, check_signal)
        
        # Center window on load with width at 90vw (90% of screen width)
        try:
            root.update_idletasks()
            screen_width = root.winfo_screenwidth()
            width_90vw = max(850, int(screen_width * 0.9))
        except Exception:
            width_90vw = 1200
        
        center_window(root, width_90vw, 550)
        root.mainloop()
    except Exception as exc:
        LOGGER.exception("Error in standalone GUI: %s", exc)



def _create_quick_setup_toplevel(parent: tk.Tk, app_version: str) -> None:
    top = tk.Toplevel(parent)
    top.transient(parent)
    top.grab_set()

    icon_path = Path("agent/icon.ico")
    if icon_path.exists():
        try:
            top.iconbitmap(str(icon_path))
        except Exception:
            pass

    QuickSetupUI(top, app_version, is_toplevel=True)
    center_window(top, 480, 435)

