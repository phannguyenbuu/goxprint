# export_vray_datasmith.py
"""Export VRay data from clipboard to a Datasmith file.

This script is intended to be run inside Autodesk 3ds Max (2022) using the
Python API (MaxPlus / pymxs). It reads configuration paths from `d:/vps.md`
to locate the 3ds Max installation and other environment settings.

Usage inside 3ds Max:
    import sys
    sys.path.append(r"C:/Dropbox/_Documents/Goxprint/maxscript")
    import export_vray_datasmith as ed
    ed.export_clipboard_to_datasmith()

The script performs the following steps:
1. Parse `d:/vps.md` for the 3ds Max executable path.
2. Retrieve the current clipboard content (expects VRay scene description).
3. Write the clipboard data to a `.udatasmith` file in the same directory as
   the script. The filename is based on a timestamp, e.g.
   `vray_export_20230608_223705.udatasmith`.
4. Optionally, you can call the exported file within 3ds Max to import the
   Datasmith data.
"""

import os
import re
import datetime
import sys

# Try to import a clipboard library; fallback to tkinter if unavailable.
try:
    import pyperclip
    get_clipboard = pyperclip.paste
except Exception:
    try:
        import tkinter as tk
        def get_clipboard():
            r = tk.Tk()
            r.withdraw()
            try:
                return r.clipboard_get()
            finally:
                r.destroy()
    except Exception:
        def get_clipboard():
            raise RuntimeError("Clipboard access not available. Install 'pyperclip' or run inside 3ds Max where clipboard APIs are provided.")

def _read_vps_config(vps_path: str = r"d:/vps.md") -> dict:
    """Parse the simple key‑value sections of `vps.md`.

    Returns a dictionary with keys like 'max_path', 'cad_path', etc.
    """
    config = {}
    if not os.path.isfile(vps_path):
        return config
    with open(vps_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            # Look for lines that start with a path entry
            if line.lower().startswith("c:\\program files\\autodesk\\3ds max"):
                config["max_path"] = line
    return config

def export_clipboard_to_datasmith(output_dir: str = r"D:/Dropbox/3DLib/Indoor/3-European style 46/002/datasmith"):
    """Export the clipboard contents to a Datasmith ``.udatasmith`` file.

    Parameters
    ----------
    output_dir: str, optional
        Directory where the Datasmith file will be saved. Defaults to the
        user‑specified path: ``D:/Dropbox/3DLib/Indoor/3‑European style 46/002/datasmith``.
    """
    # Resolve output directory
    if not output_dir:
        output_dir = r"D:/Dropbox/3DLib/Indoor/3-European style 46/002/datasmith"
    os.makedirs(output_dir, exist_ok=True)

    # Retrieve clipboard content
    try:
        data = get_clipboard()
    except Exception as e:
        raise RuntimeError(f"Failed to read clipboard: {e}")
    # Log the clipboard content (or path) for debugging
    print("[export_vray_datasmith] Clipboard content captured:")
    print(data if len(data) < 200 else data[:200] + "...")

    if not data:
        raise ValueError("Clipboard is empty – nothing to export.")

    # Build filename with timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"vray_export_{timestamp}.udatasmith"
    file_path = os.path.join(output_dir, filename)

    # Write raw clipboard data – Datasmith files are UTF‑8 text.
    with open(file_path, "w", encoding="utf-8") as out:
        out.write(data)

    print(f"[export_vray_datasmith] Clipboard exported to {file_path}")
    return file_path

if __name__ == "__main__":
    # When run directly (e.g., from a command line), expose a simple CLI.
    cfg = _read_vps_config()
    print("Parsed VPS config:", cfg)
    out = export_clipboard_to_datasmith()
    print(f"Datasmith file created: {out}")
