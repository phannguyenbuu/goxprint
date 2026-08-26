def detect_brand(name_str, mac_str):
    s = name_str.lower(); clean_mac = mac_str.replace('-', ':').upper()
    if "toshiba" in s or "e-studio" in s or clean_mac.startswith("00:80:91"): return "toshiba"
    if any(k in s for k in ("ricoh", "aficio", "mp ", "sp ", "pro ")) or clean_mac.startswith(("00:26:73", "58:38:79", "00:00:74")): return "ricoh"
    if any(k in s for k in ("hp", "laserjet", "officejet", "pagewide", "deskjet", "envy")) or clean_mac.startswith(("00:1E:0B", "00:08:C7", "E4:E7:49", "18:60:24", "48:BA:4E")): return "hp"
    if any(k in s for k in ("canon", "imagerunner", "ir-adv", "ir ", "imageclass", "pixma")) or clean_mac.startswith(("00:1B:A9", "00:00:85")): return "canon"
    if any(k in s for k in ("xerox", "versalink", "altalink", "workcentre", "fuji", "apeos")) or clean_mac.startswith(("00:10:A4", "00:00:AA", "9C:93:4E", "E8:4D:EC", "C0:FB:F9", "1C:7D:22", "00:00:01", "00:00:02", "00:00:03", "00:00:04", "00:00:05", "00:00:06", "00:00:07", "00:00:08", "00:00:09", "08:00:37", "00:00:87")): return "xerox"
    if any(k in s for k in ("brother", "mfc-", "hl-", "dcp-")) or clean_mac.startswith("00:21:B7"): return "brother"
    if any(k in s for k in ("epson", "workforce", "ecotank")) or clean_mac.startswith("00:00:48"): return "epson"
    return "unknown"

print(detect_brand("Printer (192.168.1.224)", "E4:E7:49:24:8B:26"))
