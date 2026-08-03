from __future__ import annotations

import logging
import socket
import subprocess
import threading
from concurrent.futures import ThreadPoolExecutor
from typing import Any

import requests
import urllib3


urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

LOGGER = logging.getLogger(__name__)

class SubnetScanner:
    PRINTER_PORTS = [80, 443, 9100, 515, 631, 162, 161, 10161, 10162]
    WEB_TIMEOUT_SECONDS = 1.5

    def __init__(self, max_workers: int = 50) -> None:
        self.max_workers = max_workers

    def check_port(self, ip: str, port: int, timeout: float = 0.3) -> bool:
        """Checks if a specific port is open on the host."""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(timeout)
                return s.connect_ex((ip, port)) == 0
        except Exception:
            return False

    def has_printer_ports(self, ip: str, timeout: float = 0.3) -> bool:
        for port in self.PRINTER_PORTS:
            if self.check_port(ip, port, timeout=timeout):
                return True
        return False

    @staticmethod
    def get_local_ip() -> str:
        try:
            # Create a dummy socket to find local interface IP
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(0)
            # Doesn't need to be reachable
            s.connect(("8.8.8.8", 1))
            local_ip = s.getsockname()[0]
            s.close()
            return str(local_ip)
        except Exception:
            return "127.0.0.1"

    @classmethod
    def get_all_local_subnets(cls) -> list[str]:
        subnets: set[str] = set()
        local_ip = cls.get_local_ip()
        if local_ip and not local_ip.startswith("127."):
            subnets.add(".".join(local_ip.split(".")[:3]))

        try:
            hostname = socket.gethostname()
            _, _, ips = socket.gethostbyname_ex(hostname)
            for ip in ips:
                if ip and not ip.startswith("127.") and not ip.startswith("169.254."):
                    parts = ip.split(".")
                    if len(parts) == 4:
                        subnets.add(".".join(parts[:3]))
        except Exception:
            pass

        # Ensure standard local subnets are probed if present
        if any(s.startswith("192.168.") for s in subnets) or not subnets:
            subnets.add("192.168.1")
            subnets.add("192.168.0")

        return list(subnets)

    @staticmethod
    def get_subnet_prefix(ip: str) -> str:
        if not ip or ip == "127.0.0.1":
            return ""
        parts = ip.split(".")
        if len(parts) != 4:
            return ""
        return ".".join(parts[:3])



    RICOH_MAC_PREFIXES = [
        "00:00:74", "00:26:73", "00:E0:21", "00:1B:ED",
        "00:00:18", "00:06:78", "00:15:C5", "00:0B:A9"
    ]

    @classmethod
    def is_ricoh_mac(cls, mac: str) -> bool:
        if not mac:
            return False
        clean_mac = mac.replace("-", ":").upper()
        return any(clean_mac.startswith(prefix) for prefix in cls.RICOH_MAC_PREFIXES)

    def is_ricoh_web_ui(self, ip: str) -> bool:
        """Probes the Web UI of the IP to check for Ricoh-specific markers."""
        for schema in ["http", "https"]:
            try:
                url = f"{schema}://{ip}/"
                response = requests.get(url, timeout=self.WEB_TIMEOUT_SECONDS, verify=False)
                content = response.text.lower()
                if any(k in content for k in ["ricoh", "web image monitor", "aficio", "gestetner", "lanier", "savin"]):
                    return True
            except Exception:
                pass
        return False

    def is_toshiba_web_ui(self, ip: str) -> bool:
        """Probes Toshiba TopAccess markers."""
        targets = [
            f"http://{ip}/?MAIN=TOPACCESS",
            f"https://{ip}/?MAIN=TOPACCESS",
            f"https://{ip}:10443/",
            f"http://{ip}/",
            f"https://{ip}/",
        ]
        for url in targets:
            try:
                response = requests.get(
                    url,
                    timeout=self.WEB_TIMEOUT_SECONDS,
                    verify=False,
                    allow_redirects=True,
                )
                content = response.text.lower()
                if any(k in content for k in ["topaccess", "toshiba", "contentwebserver", "e-studio", "estudio"]):
                    return True
                if response.cookies.get("Session"):
                    return True
            except Exception:
                pass
        return False

    def is_ricoh_probe(self, ip: str, mac: str = "") -> bool:
        """Determines if the host is likely a Ricoh printer."""
        if mac and self.is_ricoh_mac(mac):
            return True
        if not self.has_printer_ports(ip):
            return False
        return self.is_ricoh_web_ui(ip)

    def detect_printer_type(self, ip: str, mac: str = "") -> tuple[str, bool]:
        if mac and self.is_ricoh_mac(mac):
            return "ricoh", True
        has_printer_ports = self.has_printer_ports(ip, timeout=0.4)
        if not has_printer_ports:
            return "", False
        if self.is_ricoh_web_ui(ip):
            return "ricoh", True
        if self.is_toshiba_web_ui(ip):
            return "toshiba", True
        # Default to ricoh candidate for active hosts with open printer ports
        return "ricoh", True

    def scan_subnet(self, prefix: str | None = None) -> list[dict[str, Any]]:
        prefixes: list[str] = []
        if prefix:
            prefixes.append(prefix)
        else:
            prefixes = self.get_all_local_subnets()
        
        if not prefixes:
            LOGGER.warning("Could not determine subnet prefix for scanning")
            return []

        discovered_devices: list[dict[str, Any]] = []
        lock = threading.Lock()

        for sub_prefix in prefixes:
            LOGGER.info("Starting printer subnet scan for %s.0/24", sub_prefix)
            ips = [f"{sub_prefix}.{i}" for i in range(1, 255)]

            def worker(ip: str) -> None:
                if self.has_printer_ports(ip, timeout=0.3):
                    printer_type, has_printer_ports = self.detect_printer_type(ip)
                    with lock:
                        discovered_devices.append({
                            "ip": ip,
                            "printer_type": printer_type,
                            "has_printer_ports": has_printer_ports,
                            "is_ricoh": printer_type == "ricoh",
                            "is_toshiba": printer_type == "toshiba",
                        })

            with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                executor.map(worker, ips)

        ricoh_count = sum(1 for d in discovered_devices if d.get("printer_type") == "ricoh")
        toshiba_count = sum(1 for d in discovered_devices if d.get("printer_type") == "toshiba")
        LOGGER.info(
            "Subnet scan finished across %d subnets (%s). Active hosts: %d, Ricoh: %d, Toshiba: %d",
            len(prefixes),
            ", ".join(prefixes),
            len(discovered_devices),
            ricoh_count,
            toshiba_count,
        )
        return discovered_devices
