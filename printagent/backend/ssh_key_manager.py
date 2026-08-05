import os
import logging
from pathlib import Path

LOGGER = logging.getLogger(__name__)

def register_public_ssh_key(public_key: str) -> bool:
    public_key = public_key.strip()
    if not public_key or not (public_key.startswith("ssh-rsa") or public_key.startswith("ssh-ed25519") or public_key.startswith("ecdsa-sha2-nistp256")):
        LOGGER.error("Invalid SSH key format: %s", public_key[:30])
        return False
        
    ssh_dir = Path(os.path.expanduser("~")) / ".ssh"
    authorized_keys_path = ssh_dir / "authorized_keys"
    
    try:
        ssh_dir.mkdir(parents=True, exist_ok=True)
        
        existing_lines = []
        if authorized_keys_path.exists():
            existing_lines = authorized_keys_path.read_text(encoding="utf-8").splitlines()
            
        key_part = public_key.split()
        if len(key_part) < 2:
            return False
        key_body = key_part[1]
        
        already_exists = False
        for line in existing_lines:
            if key_body in line:
                already_exists = True
                break
                
        if not already_exists:
            options = 'no-pty,no-X11-forwarding,no-agent-forwarding,command="sleep infinity"'
            formatted_line = f"{options} {public_key}"
            
            with open(authorized_keys_path, "a", encoding="utf-8") as f:
                f.write(formatted_line + "\n")
                
            try:
                authorized_keys_path.chmod(0o600)
            except Exception:
                pass
            LOGGER.info("Successfully registered public SSH key to %s", authorized_keys_path)
        else:
            LOGGER.info("Public SSH key already registered in %s", authorized_keys_path)
        return True
    except Exception as exc:
        LOGGER.exception("Failed to register public SSH key: %s", exc)
        return False
