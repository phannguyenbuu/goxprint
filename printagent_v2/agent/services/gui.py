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
        
        # Create tabs
        self.create_ftp_tab()
        self.create_scan_tab()
        self.create_printers_tab()
        
        # Load initial data
        self.refresh_ftp_list()
        self.refresh_scan_dirs()
        self.refresh_printers()
        
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
        
        main_frame = ttk.Frame(self.scan_tab)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Action Buttons frame packed first on the right so it gets sizing priority
        btn_frame = ttk.Frame(main_frame, padding="10 0 0 0")
        btn_frame.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Treeview list of paths
        tree_frame = ttk.Frame(main_frame)
        tree_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        cols = ("Path", "Exists", "VPS_Path", "GDrive_Path")
        self.scan_tree = ttk.Treeview(tree_frame, columns=cols, show="headings")
        self.scan_tree.heading("Path", text="Thư mục giám sát (Monitored)")
        self.scan_tree.heading("Exists", text="Tồn tại")
        self.scan_tree.heading("VPS_Path", text="Thư mục VPS (VPS Path)")
        self.scan_tree.heading("GDrive_Path", text="Thư mục GDrive")
        
        self.scan_tree.column("Path", width=220, anchor=tk.W)
        self.scan_tree.column("Exists", width=70, anchor=tk.CENTER)
        self.scan_tree.column("VPS_Path", width=230, anchor=tk.W)
        self.scan_tree.column("GDrive_Path", width=230, anchor=tk.W)
        
        vsb = ttk.Scrollbar(tree_frame, orient="vertical", command=self.scan_tree.yview)
        hsb = ttk.Scrollbar(tree_frame, orient="horizontal", command=self.scan_tree.xview)
        self.scan_tree.configure(yscrollcommand=vsb.set, xscrollcommand=hsb.set)
        
        self.scan_tree.grid(row=0, column=0, sticky="nsew")
        vsb.grid(row=0, column=1, sticky="ns")
        hsb.grid(row=1, column=0, sticky="ew")
        
        tree_frame.rowconfigure(0, weight=1)
        tree_frame.columnconfigure(0, weight=1)
        
        # Buttons are packed into the pre-created btn_frame
        
        ttk.Button(btn_frame, text="Add Folder (Thêm)", command=self.add_scan_dir, width=18).pack(pady=5)
        ttk.Button(btn_frame, text="Remove Folder (Xóa)", command=self.remove_scan_dir, width=18).pack(pady=5)
        
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
        
        self.printer_tree.heading("#0", text="Tên Thiết Bị / Địa chỉ nhận")
        self.printer_tree.heading("IP", text="Địa chỉ IP / Email")
        self.printer_tree.heading("MAC", text="Địa chỉ MAC / FTP / SMB")
        self.printer_tree.heading("Type", text="Hãng/Loại")
        self.printer_tree.heading("Status", text="Kết nối")
        self.printer_tree.heading("DevStatus", text="Trạng thái")
        
        self.printer_tree.column("#0", width=230, anchor=tk.W)
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
        vsb.grid(row=0, column=1, sticky="ns")
        hsb.grid(row=1, column=0, sticky="ew")
        
        tree_frame.rowconfigure(0, weight=1)
        tree_frame.columnconfigure(0, weight=1)
        
        # Buttons are packed into the pre-created btn_frame
        
        ttk.Button(btn_frame, text="Add Dest (Thêm nhận)", command=self.add_printer_destination, width=18).pack(pady=5)
        ttk.Button(btn_frame, text="Edit Dest (Sửa nhận)", command=self.edit_printer_destination, width=18).pack(pady=5)
        ttk.Button(btn_frame, text="Delete Dest (Xóa nhận)", command=self.delete_printer_destination, width=18).pack(pady=5)
        
        ttk.Separator(btn_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        ttk.Button(btn_frame, text="Refresh (Tải lại)", command=self.refresh_printers, width=18).pack(pady=5)
        
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
                self.root.after(0, lambda: messagebox.showerror("Error", f"Failed to list FTP sites: {exc}"))
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
    def refresh_scan_dirs(self) -> None:
        for item in self.scan_tree.get_children():
            self.scan_tree.delete(item)
            
        self.scan_tree.insert("", tk.END, values=("Loading sync folders...", "", "", ""))
        
        def run() -> None:
            try:
                self.config = AppConfig.load()
                raw = self.config.get_string("polling.scan_dirs", "").strip()
                dirs = [d.strip() for d in raw.split(";") if d.strip()]
                
                # Resolve network info to get lan_uid
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
                    
                self.root.after(0, lambda: self.update_scan_dirs_ui(dirs, lead, lan_uid, agent_uid))
            except Exception as exc:
                LOGGER.exception("Failed to load scan directories in GUI")
                self.root.after(0, lambda: messagebox.showerror("Error", f"Failed to list scan folders: {exc}"))
                self.root.after(0, lambda: self.update_scan_dirs_ui([], "", "", ""))
                
        threading.Thread(target=run, daemon=True, name="gui-scan-refresh").start()
        
    def update_scan_dirs_ui(self, dirs: list[str], lead: str, lan_uid: str, agent_uid: str) -> None:
        for item in self.scan_tree.get_children():
            self.scan_tree.delete(item)
            
        def safe_token(val: str) -> str:
            t = re.sub(r"[^A-Za-z0-9._-]+", "-", val).strip(" -_.")
            return t or "default"
            
        for d in dirs:
            exists = "Yes (Có)" if os.path.exists(d) else "No (Không)"
            
            # Compute VPS path and GDrive path
            original_folder_name = "default"
            if d:
                d_clean = str(d).replace("\\", "/")
                original_folder_name = Path(d_clean).name or "default"
                
            lead_token = safe_token(lead)
            lan_token = safe_token(lan_uid)
            agent_token = safe_token(agent_uid)
            label_token = safe_token(original_folder_name)
            
            vps_path = f"static/scans/{lan_token}/{label_token}"
            gdrive_path = f"{lead_token}/{lan_token}/{agent_token}/{label_token}"
            
            self.scan_tree.insert("", tk.END, values=(d, exists, vps_path, gdrive_path))
            
        if not self.scan_tree.get_children():
            self.scan_tree.insert("", tk.END, values=("No monitored scan folders found", "", "", ""))
            
    def add_scan_dir(self) -> None:
        selected = filedialog.askdirectory(parent=self.root, title="Select Monitored Directory for Scan Sync")
        if selected:
            path = os.path.normpath(selected)
            try:
                self.config = AppConfig.load()
                added, _ = self.config.ensure_scan_dir(path)
                if added:
                    messagebox.showinfo("Success", f"Added directory to monitor: {path}")
                else:
                    messagebox.showinfo("Info", "Directory is already being monitored.")
            except Exception as exc:
                messagebox.showerror("Error", f"Failed to save scan folder: {exc}")
            finally:
                self.refresh_scan_dirs()
                
    def remove_scan_dir(self) -> None:
        selected_items = self.scan_tree.selection()
        if not selected_items:
            messagebox.showwarning("Warning", "Please select one or more scan directories to remove.")
            return
            
        paths = [self.scan_tree.item(item, "values")[0] for item in selected_items]
        
        if len(paths) == 1:
            confirm_msg = f"Are you sure you want to stop monitoring this folder for scan synchronization?\n{paths[0]}"
        else:
            confirm_msg = f"Are you sure you want to stop monitoring these {len(paths)} folders for scan synchronization?\n" + "\n".join(paths)
            
        confirm = messagebox.askyesno(
            "Confirm Remove",
            confirm_msg,
            default=messagebox.NO
        )
        if confirm:
            try:
                self.config = AppConfig.load()
                raw = self.config.get_string("polling.scan_dirs", "").strip()
                dirs = [d.strip() for d in raw.split(";") if d.strip()]
                
                # Filter out the selected ones
                paths_norm = [os.path.normcase(os.path.normpath(p)) for p in paths]
                filtered = [d for d in dirs if os.path.normcase(os.path.normpath(d)) not in paths_norm]
                
                self.config.set_value("polling.scan_dirs", ";".join(filtered))
                if len(paths) == 1:
                    messagebox.showinfo("Success", "Scan directory removed successfully!")
                else:
                    messagebox.showinfo("Success", f"Successfully removed {len(paths)} scan directories!")
            except Exception as exc:
                messagebox.showerror("Error", f"Failed to update scan folders: {exc}")
            finally:
                self.refresh_scan_dirs()
 
    # --- PRINTERS LOGIC (Asynchronous load) ---
    def refresh_printers(self) -> None:
        for item in self.printer_tree.get_children():
            self.printer_tree.delete(item)
            
        self.printer_tree.insert("", tk.END, text="Loading printers...", values=("", "", "", "", ""))
        
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
                self.root.after(0, lambda: messagebox.showerror("Error", f"Failed to list printers: {exc}"))
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
                text=p.name,
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
            self.root.after(0, lambda: self.update_printer_destinations_error(node_id, str(exc)))
            
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
            email = addr.get("email_address", "")
            folder = addr.get("folder", "")
            reg_no = addr.get("registration_no", "")
            
            dest_type = ""
            dest_val = ""
            if folder:
                if folder.startswith("ftp://"):
                    dest_type = "FTP"
                elif folder.startswith("\\\\"):
                    dest_type = "SMB"
                else:
                    dest_type = "Folder"
                dest_val = folder
            elif email:
                dest_type = "Email"
                dest_val = email
                
            if dest_type:
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
                else:
                    self.printer_tree.insert(
                        node_id,
                        tk.END,
                        iid=item_iid,
                        text=f"[{dest_type}] {name}",
                        values=("", dest_val, "", "", "")
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
                            if proto == "FTP_O":
                                folder = f"ftp://{folder_server}:{folder_port}{folder_path}"
                            elif proto == "SMB":
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
                    
                    physical_path = ""
                    
                    if proto == "FTP_O":
                        try:
                            from agent.services.ftp_store import load_config
                            config_data = load_config()
                            for site in config_data.get("sites", []):
                                if int(site.get("port", 0)) == int(port):
                                    physical_path = site.get("physical_path", "")
                                    break
                        except Exception:
                            pass
                    elif proto == "SMB":
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
                        physical_path = f"Remote / Not found on this PC ({srv})"
                        
                    info_msg = (
                        f"Name (Tên hiển thị): {self.printer_tree.item(selected, 'text')}\r\n"
                        f"Protocol (Giao thức): {'FTP' if proto == 'FTP_O' else proto}\r\n"
                        f"Folder Port No. (Cổng): {port}\r\n"
                        f"Path on Copier (Đường dẫn WIM): {path}\r\n"
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
        name = f"Scan to {username}"
        
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
                    username=username,
                    session=session
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
                    name=email, # Set name to the full email address
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


def show_gui_window(app_version: str) -> None:
    global _gui_root
    with _gui_lock:
        if _gui_root is not None:
            try:
                # If window is already open, deiconify, lift, and focus it
                _gui_root.deiconify()
                _gui_root.focus_force()
                _gui_root.lift()
                return
            except Exception:
                _gui_root = None
                
        def run_tk() -> None:
            global _gui_root
            try:
                root = tk.Tk()
                
                # Check for window close event to clean up properly
                def on_close() -> None:
                    global _gui_root
                    with _gui_lock:
                        _gui_root = None
                    root.destroy()
                    
                root.protocol("WM_DELETE_WINDOW", on_close)
                
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
                
                _gui_root = root
                PrintAgentGui(root, app_version)
                
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
                LOGGER.exception("Error in GUI window thread: %s", exc)
            finally:
                with _gui_lock:
                    _gui_root = None
                    
        # Start GUI in daemon thread
        t = threading.Thread(target=run_tk, daemon=True, name="agent-gui-window")
        t.start()

