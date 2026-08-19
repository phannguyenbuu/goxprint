import urllib.request
import json
from pathlib import Path

url = "https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/master/LISTS/master_oui.json"
out_dir = Path(r"D:\Dropbox\_Documents\Goxprint\printagent_v2\backend\storage")
out_dir.mkdir(parents=True, exist_ok=True)
out_path = out_dir / "mac_vendors.json"

print(f"Downloading OUI database from {url}...")
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        
    print(f"Loaded {len(data)} OUI entries from Ringmast4r database.")
    
    # Common keywords of companies we care about (cameras, printers, networks, and major clients)
    common_keywords = [
        # Cameras
        "dahua", "hikvision", "kbvision", "gwell", "xiongmai", "ezviz", "imou", "foscam", "vivotek", 
        "hanwha", "uniview", "reolink", "amcrest", "wanscam", "sricam", "netcam", "yoosee", "tuya", 
        "gwelltimes", "xmeye", "xm tech", "surveillance", "security camera", "carecam",
        # Printers
        "brother", "canon", "epson", "hp ", "hewlett", "lexmark", "ricoh", "xerox", "fujifilm", 
        "fujitsu", "kyocera", "konica", "minolta", "toshiba", "okidata", "sharp", "tokyo electric", 
        "tokyo electri", "pantum",
        # Networks
        "cisco", "huawei", "tp-link", "tplink", "netgear", "realtek", "d-link", "dlink", "asus", 
        "linksys", "ubiquiti", "ruijie", "totolink", "tenda", "mercusys", "draytek", "zyxel", 
        "belkin", "buffalo", "qnap", "synology", "mikrotik", "aruba", "juniper", "ruckus",
        # Computers/Chips
        "intel", "apple", "samsung", "xiaomi", "dell", "lenovo", "sony", "panasonic", "microsoft", 
        "google", "lg ", "acer", "avigilon", "axis", "bosch"
    ]
    
    manual_vendors = {
        # Xiongmai (Hangzhou Xiongmai Technology)
        "00:12:12": {"manufacturer": "Hangzhou Xiongmai Technology Co., Ltd."},
        "00:30:F2": {"manufacturer": "Hangzhou Xiongmai Technology Co., Ltd."},
        "B0:D5:9D": {"manufacturer": "Hangzhou Xiongmai Technology Co., Ltd."},
        "B8:F5:5A": {"manufacturer": "Hangzhou Xiongmai Technology Co., Ltd."},
        "F0:18:98": {"manufacturer": "Hangzhou Xiongmai Technology Co., Ltd."},
        
        # KBVision Group
        "B4:36:E3": {"manufacturer": "KBVISION GROUP"},
        
        # Yoosee / Gwelltimes
        "4C:B0:08": {"manufacturer": "Shenzhen Gwelltimes Technology Co., Ltd."},
        "D4:B2:D6": {"manufacturer": "Shenzhen Gwelltimes Technology Co., Ltd."},
        
        # Imou / Dahua (Hangzhou Huacheng)
        "3C:EF:8C": {"manufacturer": "Zhejiang Dahua Technology Co., Ltd. (Imou)"},
        "00:1A:07": {"manufacturer": "Zhejiang Dahua Technology Co., Ltd. (Imou)"},
        "14:A7:8B": {"manufacturer": "Zhejiang Dahua Technology Co., Ltd. (Imou)"},
        "A8:31:62": {"manufacturer": "Hangzhou Huacheng Network Technology Co., Ltd. (Imou)"},
        "90:6A:94": {"manufacturer": "Hangzhou Huacheng Network Technology Co., Ltd. (Imou)"},
        "1C:4D:89": {"manufacturer": "Hangzhou Huacheng Network Technology Co., Ltd. (Imou)"},
        "30:24:50": {"manufacturer": "Hangzhou Huacheng Network Technology Co., Ltd. (Imou)"},
        "AC:3D:FA": {"manufacturer": "Hangzhou Huacheng Network Technology Co., Ltd. (Imou)"},
        
        # Sigmastar (CCTV)
        "24:14:07": {"manufacturer": "Xiamen Sigmastar Technology Ltd. (CCTV)"},
        
        # Hikvision / Ezviz
        "00:40:3A": {"manufacturer": "Hangzhou Hikvision Digital Technology Co., Ltd."},
        "10:D0:7A": {"manufacturer": "Hangzhou Hikvision Digital Technology Co., Ltd."},
        "18:68:CB": {"manufacturer": "Hangzhou Hikvision Digital Technology Co., Ltd."},
        "28:57:BE": {"manufacturer": "Hangzhou Hikvision Digital Technology Co., Ltd."},
    }

    filtered_data = {}
    for oui, info in manual_vendors.items():
        filtered_data[oui.upper()] = info

    non_filtered_pool = []
    
    if isinstance(data, dict):
        for oui, info in data.items():
            manufacturer = ""
            if isinstance(info, dict):
                manufacturer = info.get("manufacturer") or info.get("vendor") or ""
            else:
                manufacturer = str(info)
                
            manufacturer_lower = manufacturer.lower()
            oui_upper = oui.upper()
            if any(kw in manufacturer_lower for kw in common_keywords):
                filtered_data[oui_upper] = {
                    "manufacturer": manufacturer,
                    "country": info.get("country") if isinstance(info, dict) else None
                }
            else:
                if oui_upper not in filtered_data:
                    non_filtered_pool.append((oui_upper, manufacturer, info.get("country") if isinstance(info, dict) else None))
                
    print(f"Found {len(filtered_data)} entries matching common keywords.")
    
    # Write the filtered core first
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(filtered_data, f, ensure_ascii=False, indent=2)
        
    current_size = out_path.stat().st_size
    print(f"Size of filtered core: {current_size / 1024:.2f} KB")
    
    # Fill up to ~750KB (approx 768,000 bytes) to have a highly comprehensive offline database
    target_size = 750 * 1024
    if current_size < target_size:
        added_count = 0
        for oui, manufacturer, country in non_filtered_pool:
            filtered_data[oui] = {
                "manufacturer": manufacturer,
                "country": country
            }
            added_count += 1
            if added_count % 100 == 0:
                with open(out_path, "w", encoding="utf-8") as f:
                    json.dump(filtered_data, f, ensure_ascii=False, indent=2)
                if out_path.stat().st_size >= target_size:
                    break
                    
    # Final save with pretty formatting
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(filtered_data, f, ensure_ascii=False, indent=2)
        
    print(f"Final offline database size: {out_path.stat().st_size / 1024:.2f} KB containing {len(filtered_data)} entries.")
    
except Exception as e:
    print(f"Error downloading or processing OUI database: {e}")
