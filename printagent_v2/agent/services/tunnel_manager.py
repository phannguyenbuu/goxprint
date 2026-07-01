import subprocess
import os
import sys
import logging
import threading
import time
from pathlib import Path
from typing import Any
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

LOGGER = logging.getLogger(__name__)

class TunnelManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
            return cls._instance

    def __init__(self, config=None) -> None:
        if hasattr(self, "_initialized") and self._initialized:
            return
        self.config = config
        self.active_tunnels: dict[str, subprocess.Popen] = {}
        self.tunnels_lock = threading.Lock()
        
        # Paths for keys
        self.ssh_dir = Path(os.path.expanduser("~")) / ".ssh"
        self.private_key_path = self.ssh_dir / "goxprint_id_rsa"
        self.public_key_path = self.ssh_dir / "goxprint_id_rsa.pub"
        
        self._ensure_ssh_keys()
        self._initialized = True

    def _ensure_ssh_keys(self) -> None:
        try:
            if not self.private_key_path.exists():
                LOGGER.info("SSH keys not found. Generating new SSH keypair...")
                key = rsa.generate_private_key(
                    public_exponent=65537,
                    key_size=2048
                )
                private_pem = key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.OpenSSH,
                    encryption_algorithm=serialization.NoEncryption()
                )
                public_ssh = key.public_key().public_bytes(
                    encoding=serialization.Encoding.OpenSSH,
                    format=serialization.PublicFormat.OpenSSH
                )
                self.ssh_dir.mkdir(parents=True, exist_ok=True)
                
                # Write private key
                self.private_key_path.write_bytes(private_pem)
                try:
                    self.private_key_path.chmod(0o600)
                except Exception:
                    pass
                    
                # Write public key
                self.public_key_path.write_bytes(public_ssh)
                LOGGER.info("SSH keypair generated successfully at: %s", self.private_key_path)
        except Exception as exc:
            LOGGER.exception("Failed to ensure SSH keys: %s", exc)

    def get_public_key_content(self) -> str:
        try:
            if self.public_key_path.exists():
                return self.public_key_path.read_text(encoding="utf-8").strip()
        except Exception as exc:
            LOGGER.error("Failed to read SSH public key: %s", exc)
        return ""

    def start_tunnel(self, target_ip: str, target_port: int, vps_ip: str, remote_port: int, vps_user: str = "ubuntu") -> bool:
        with self.tunnels_lock:
            # Stop existing tunnel for this IP first
            self._stop_tunnel_unlocked(target_ip)
            
            null_device = "NUL" if sys.platform == "win32" else "/dev/null"
            ssh_cmd = [
                "ssh", "-N",
                "-o", "StrictHostKeyChecking=no",
                "-o", f"UserKnownHostsFile={null_device}",
                "-o", "ExitOnForwardFailure=yes",
                "-o", "ServerAliveInterval=60",
                "-o", "ServerAliveCountMax=3",
                "-i", str(self.private_key_path),
                "-R", f"0.0.0.0:{remote_port}:{target_ip}:{target_port}",
                f"{vps_user}@{vps_ip}"
            ]
            
            LOGGER.info("[TunnelManager] Starting reverse SSH tunnel: %s", " ".join(ssh_cmd))
            try:
                kwargs: dict[str, Any] = {}
                if sys.platform == "win32":
                    kwargs["creationflags"] = 0x08000000 # CREATE_NO_WINDOW
                    
                proc = subprocess.Popen(
                    ssh_cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    **kwargs
                )
                
                time.sleep(1.5)
                if proc.poll() is not None:
                    _, stderr = proc.communicate()
                    LOGGER.error("[TunnelManager] SSH tunnel failed to start immediately. Error: %s", stderr.strip())
                    return False
                    
                self.active_tunnels[target_ip] = proc
                LOGGER.info("[TunnelManager] SSH tunnel established for printer %s forwarding to VPS port %d", target_ip, remote_port)
                
                threading.Thread(target=self._monitor_tunnel, args=(target_ip, proc), daemon=True).start()
                return True
            except Exception as exc:
                LOGGER.exception("[TunnelManager] Error starting SSH tunnel: %s", exc)
                return False

    def stop_tunnel(self, target_ip: str) -> None:
        with self.tunnels_lock:
            self._stop_tunnel_unlocked(target_ip)

    def _stop_tunnel_unlocked(self, target_ip: str) -> None:
        proc = self.active_tunnels.pop(target_ip, None)
        if proc:
            LOGGER.info("[TunnelManager] Stopping SSH tunnel for printer %s", target_ip)
            try:
                proc.terminate()
                proc.wait(timeout=2.0)
            except Exception:
                try:
                    proc.kill()
                except Exception:
                    pass
            LOGGER.info("[TunnelManager] SSH tunnel process terminated for %s", target_ip)

    def _monitor_tunnel(self, target_ip: str, proc: subprocess.Popen) -> None:
        proc.wait()
        with self.tunnels_lock:
            if self.active_tunnels.get(target_ip) == proc:
                LOGGER.warning("[TunnelManager] SSH tunnel for %s exited unexpectedly with code %s", target_ip, proc.returncode)
                self.active_tunnels.pop(target_ip, None)
