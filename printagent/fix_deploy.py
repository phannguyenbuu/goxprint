from pathlib import Path
import re

file = Path(r'd:\Dropbox\_Documents\Goxprint\printagent\build_and_deploy.py')
content = file.read_text(encoding='utf-8')

# Add try-except for printagent.exe
content = content.replace(
    '        shutil.copy2(exe_src, exe_dest)\n        print(f"Copied printagent.exe to {exe_dest}")',
    '        try:\n            shutil.copy2(exe_src, exe_dest)\n            print(f"Copied printagent.exe to {exe_dest}")\n        except Exception as e:\n            print(f"Warning: could not copy exe locally: {e}")'
)

# Add try-except for gox_ftp_server.exe
content = content.replace(
    '        shutil.copy2(ftp_src, ftp_dest)\n        print(f"Copied gox_ftp_server.exe to {ftp_dest}")',
    '        try:\n            shutil.copy2(ftp_src, ftp_dest)\n            print(f"Copied gox_ftp_server.exe to {ftp_dest}")\n        except Exception as e:\n            print(f"Warning: could not copy ftp exe locally: {e}")'
)

# Fix upload source
content = content.replace(
    'try_upload(root / "backend" / "static" / "releases" / "printagent.exe", "/opt/printagent/static/releases/printagent.exe")',
    'try_upload(root / "dist" / "printagent.exe", "/opt/printagent/static/releases/printagent.exe")'
)
content = content.replace(
    'try_upload(root / "backend" / "static" / "releases" / "gox_ftp_server.exe", "/opt/printagent/static/releases/gox_ftp_server.exe")',
    'try_upload(root / "dist" / "gox_ftp_server.exe", "/opt/printagent/static/releases/gox_ftp_server.exe")'
)

file.write_text(content, encoding='utf-8')
print('Fixed build_and_deploy.py')
