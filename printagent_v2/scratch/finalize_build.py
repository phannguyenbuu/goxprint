import shutil
import json
import hashlib
from pathlib import Path
import datetime

def main():
    root = Path(__file__).resolve().parent.parent
    exe_src = root / "dist" / "printagent.exe"
    exe_dest = root / "backend" / "static" / "releases" / "printagent.exe"
    
    if not exe_src.exists():
        print(f"Error: Source file {exe_src} does not exist.")
        return

    exe_dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(exe_src, exe_dest)
    print(f"Copied printagent.exe to {exe_dest}")
    
    def sha256_file(path: Path) -> str:
        digest = hashlib.sha256()
        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
        return digest.hexdigest()
        
    exe_sha = sha256_file(exe_dest)
    exe_size = exe_dest.stat().st_size
    
    now_str = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).isoformat()
    manifest_path = root / "backend" / "storage" / "releases" / "agent_release.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    
    manifest = {}
    if manifest_path.exists():
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except Exception:
            pass
            
    manifest.update({
        "version": "1.4.11",
        "sha256": exe_sha,
        "size": exe_size,
        "published_at": now_str,
        "mandatory": True,
        "download_url": "/static/releases/printagent.exe",
        "notes": "Build 1.4.11: Fix handling of non-existent/deleted address book entries to prevent unexpected copier error page retries.",
        "channel": "stable"
    })
    
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Successfully updated agent_release.json manifest: version 1.4.11")

if __name__ == "__main__":
    main()
