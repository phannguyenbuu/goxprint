import zipfile
from pathlib import Path
import json
import hashlib

def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

def main():
    root = Path(__file__).resolve().parent
    agent_dir = root / "agent"
    zip_path = root / "agent_core.zip"
    
    print(f"Packaging agent folder into {zip_path}...")
    
    # Dynamically read version from agent/services/updater.py
    version = "2.2.1"
    updater_file = agent_dir / "services" / "updater.py"
    if updater_file.exists():
        import re
        match = re.search(r'DEFAULT_APP_VERSION\s*=\s*["\']([^"\']+)["\']', updater_file.read_text(encoding="utf-8"))
        if match:
            version = match.group(1)

    exclude_names = set()

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for file_path in agent_dir.rglob('*'):
            # Skip caches, local databases/data
            if "__pycache__" in file_path.parts:
                continue
            if ".git" in file_path.parts:
                continue
            if file_path.suffix in {".pyc", ".pyo", ".db", ".log"}:
                continue
            if file_path.name in exclude_names:
                continue

            if file_path.is_file():
                # Store relative to root, i.e., "agent/..."
                rel_path = file_path.relative_to(root)
                zip_file.write(file_path, rel_path)

    sha = sha256_file(zip_path)
    size = zip_path.stat().st_size

    print(f"Packaged successfully! Size: {size} bytes, SHA256: {sha}")

    # Update local release manifests on server
    releases_dir = root / "backend" / "storage" / "releases"
    releases_dir.mkdir(parents=True, exist_ok=True)

    import datetime
    now_str = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).isoformat()

    manifest_path = releases_dir / "agent_core_release.json"
    manifest = {
        "version": version,
        "download_url": "/static/releases/agent_core.zip",
        "sha256": sha,
        "size": size,
        "notes": f"Auto-packaged v{version} via pack_agent_core.py",
        "published_at": now_str
    }
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Updated agent_core_release.json version to {version} at {manifest_path}")

    agent_release_path = releases_dir / "agent_release.json"
    if agent_release_path.exists():
        try:
            rel_manifest = json.loads(agent_release_path.read_text(encoding="utf-8"))
            rel_manifest["version"] = version
            rel_manifest["published_at"] = now_str
            agent_release_path.write_text(json.dumps(rel_manifest, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"Updated agent_release.json version to {version} at {agent_release_path}")
        except Exception as exc:
            print(f"Failed updating agent_release.json: {exc}")
    
    # Copy agent_core.zip to backend/static/releases/ for local testing
    static_releases_dir = root / "backend" / "static" / "releases"
    static_releases_dir.mkdir(parents=True, exist_ok=True)
    import shutil
    shutil.copy2(zip_path, static_releases_dir / "agent_core.zip")
    print(f"Copied agent_core.zip to static releases path: {static_releases_dir / 'agent_core.zip'}")
    


if __name__ == "__main__":
    main()

