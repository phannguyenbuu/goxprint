import re
import os

filepath = r"D:\Dropbox\_Documents\Goxprint\backend\device_core_routes.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# For add_email_dest
old_toshiba = """            is_toshiba = (
                (printer and (getattr(printer, 'printer_type', '') == 'toshiba' or 'toshiba' in (printer.printer_name or '').lower() or 'e-studio' in (printer.printer_name or '').lower())) or
                'toshiba' in printer_name_val.lower() or
                'e-studio' in printer_name_val.lower() or
                str(body.get("printer_type", "")).lower() == "toshiba" or
                str(body.get("type", "")).lower() == "toshiba" or
                str(body.get("brand", "")).lower() == "toshiba"
            )"""

new_toshiba = """            req_type = str(body.get("printer_type") or body.get("type") or body.get("brand") or "").lower()
            is_toshiba = False
            if req_type:
                is_toshiba = req_type == "toshiba"
            else:
                is_toshiba = (
                    (printer and (getattr(printer, 'printer_type', '') == 'toshiba' or 'toshiba' in (printer.printer_name or '').lower() or 'e-studio' in (printer.printer_name or '').lower())) or
                    'toshiba' in printer_name_val.lower() or
                    'e-studio' in printer_name_val.lower()
                )"""

old_xerox = """            is_xerox = (
                (printer and (getattr(printer, 'printer_type', '') in ['fujifilm', 'xerox'] or 'fujifilm' in (printer.printer_name or '').lower() or 'xerox' in (printer.printer_name or '').lower())) or
                'fujifilm' in printer_name_val.lower() or 'xerox' in printer_name_val.lower() or
                str(body.get("printer_type", "")).lower() in ["fujifilm", "xerox"] or
                str(body.get("type", "")).lower() in ["fujifilm", "xerox"] or
                str(body.get("brand", "")).lower() in ["fujifilm", "xerox"]
            )"""

new_xerox = """            is_xerox = False
            if req_type:
                is_xerox = req_type in ["fujifilm", "xerox"]
            else:
                is_xerox = (
                    (printer and (getattr(printer, 'printer_type', '') in ['fujifilm', 'xerox'] or 'fujifilm' in (printer.printer_name or '').lower() or 'xerox' in (printer.printer_name or '').lower())) or
                    'fujifilm' in printer_name_val.lower() or 'xerox' in printer_name_val.lower()
                )"""

content = content.replace(old_toshiba, new_toshiba)
content = content.replace(old_xerox, new_xerox)


# For delete_scan
old_toshiba2 = """            is_toshiba = (
                (printer and (getattr(printer, 'printer_type', '') == 'toshiba' or 'toshiba' in (printer.printer_name or '').lower() or 'e-studio' in (printer.printer_name or '').lower())) or
                'toshiba' in (printer.printer_name if printer else '').lower() or
                "toshiba" in str(body.get("printer_type", "")).lower() or "e-studio" in str(body.get("printer_type", "")).lower() or
                "toshiba" in str(body.get("type", "")).lower() or "e-studio" in str(body.get("type", "")).lower() or
                "toshiba" in str(body.get("brand", "")).lower() or "e-studio" in str(body.get("brand", "")).lower()
            )"""

new_toshiba2 = """            req_type = str(body.get("printer_type") or body.get("type") or body.get("brand") or "").lower()
            is_toshiba = False
            if req_type:
                is_toshiba = req_type == "toshiba"
            else:
                is_toshiba = (
                    (printer and (getattr(printer, 'printer_type', '') == 'toshiba' or 'toshiba' in (printer.printer_name or '').lower() or 'e-studio' in (printer.printer_name or '').lower())) or
                    'toshiba' in (printer.printer_name if printer else '').lower()
                )"""

old_xerox2 = """            is_xerox = (
                (printer and (getattr(printer, 'printer_type', '') in ['fujifilm', 'xerox'] or 'fujifilm' in (printer.printer_name or '').lower() or 'xerox' in (printer.printer_name or '').lower())) or
                'fujifilm' in (printer.printer_name if printer else '').lower() or 'xerox' in (printer.printer_name if printer else '').lower() or
                "fujifilm" in str(body.get("printer_type", "")).lower() or "xerox" in str(body.get("printer_type", "")).lower() or
                "fujifilm" in str(body.get("type", "")).lower() or "xerox" in str(body.get("type", "")).lower() or
                "fujifilm" in str(body.get("brand", "")).lower() or "xerox" in str(body.get("brand", "")).lower()
            )"""

new_xerox2 = """            is_xerox = False
            if req_type:
                is_xerox = req_type in ["fujifilm", "xerox"]
            else:
                is_xerox = (
                    (printer and (getattr(printer, 'printer_type', '') in ['fujifilm', 'xerox'] or 'fujifilm' in (printer.printer_name or '').lower() or 'xerox' in (printer.printer_name or '').lower())) or
                    'fujifilm' in (printer.printer_name if printer else '').lower() or 'xerox' in (printer.printer_name if printer else '').lower()
                )"""

content = content.replace(old_toshiba2, new_toshiba2)
content = content.replace(old_xerox2, new_xerox2)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
