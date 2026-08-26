import urllib.request, json, time
macs = [
    "3C:55:76:CC:D8:08",
    "06:28:2F:21:FA:D0",
    "FC:5F:49:F9:2A:54",
    "E0:BA:AD:34:74:0A",
    "14:BB:6E:38:CE:52",
    "06:DC:CA:42:C3:23",
    "38:8C:50:0F:AF:3B",
    "90:0E:B3:15:79:3B",
]
for mac in macs:
    try:
        url = f"https://api.macvendors.com/{mac}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            vendor = response.read().decode('utf-8')
            print(f"{mac} -> {vendor}")
    except Exception as e:
        print(f"{mac} -> Error: {e}")
    time.sleep(1.2)
