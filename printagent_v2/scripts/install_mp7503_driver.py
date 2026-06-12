#!/usr/bin/env python3
"""
Standalone script: Cài đặt driver Ricoh MP 7503 SP (PCL 6)
Chạy: python install_mp7503_driver.py
"""

import os
import sys
import tempfile
import zipfile
import subprocess
import urllib.request
import shutil
from pathlib import Path

DRIVER_URL = "https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343268/V3200/z05906L16.exe"
DRIVER_NAME = "RICOH MP 7503 SP - PCL 6 Driver"


def main():
    print(f"{'='*60}")
    print(f"  Cài đặt driver: {DRIVER_NAME}")
    print(f"{'='*60}")
    print()

    temp_dir = Path(tempfile.mkdtemp(prefix="ricoh_driver_"))
    filename = DRIVER_URL.split("/")[-1].split("?")[0]
    download_path = temp_dir / filename

    try:
        # Step 1: Download
        print(f"⬇️  Đang tải {filename} ...")
        urllib.request.urlretrieve(DRIVER_URL, str(download_path))
        size_mb = download_path.stat().st_size / (1024 * 1024)
        print(f"✅ Tải xong: {filename} ({size_mb:.1f} MB)")
        print()

        # Step 2: Extract (SFX ZIP)
        extract_dir = temp_dir / "extracted"
        extract_dir.mkdir(exist_ok=True)

        try:
            with zipfile.ZipFile(download_path, "r") as zf:
                zf.extractall(extract_dir)
            exe_files = list(extract_dir.glob("**/*.exe"))
            print(f"📂 Giải nén xong — tìm thấy {len(exe_files)} file EXE:")
            for f in exe_files:
                print(f"   • {f.name} ({f.stat().st_size / (1024*1024):.1f} MB)")
        except zipfile.BadZipFile:
            # Not a ZIP, treat as standalone EXE
            exe_files = [download_path]
            print(f"📄 File EXE độc lập: {filename}")

        print()

        if not exe_files:
            print("❌ Không tìm thấy file EXE nào!")
            return 1

        # Step 3: Pick installer
        target_exe = exe_files[0]
        for exe in exe_files:
            if exe.name.lower() in ("setup.exe", "install.exe", "rv_setup.exe"):
                target_exe = exe
                break
        else:
            target_exe = max(exe_files, key=lambda f: f.stat().st_size)

        # Step 4: Launch
        print(f"🚀 Đang mở installer: {target_exe.name}")
        print(f"   Vui lòng thao tác trên cửa sổ cài đặt...")
        print()

        proc = subprocess.Popen(
            [str(target_exe)],
            cwd=str(target_exe.parent),
        )
        proc.wait()

        print()
        print(f"✅ Installer đã đóng (exit code: {proc.returncode})")
        print(f"   Kiểm tra Devices and Printers để xác nhận driver đã cài.")

    except KeyboardInterrupt:
        print("\n⚠️  Đã hủy.")
        return 1
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")
        return 1
    finally:
        # Cleanup
        try:
            shutil.rmtree(temp_dir)
        except Exception:
            pass

    return 0


if __name__ == "__main__":
    sys.exit(main())
