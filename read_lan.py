import json
with open('D:\\Dropbox\\_Documents\\Goxprint\\lan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
for row in data.get('rows', []):
    print(f"Lan: {row.get('lan_uid')}")
    printers = row.get('printers', [])
    for p in printers:
        print(f"  {p.get('printer_name')} - {p.get('ip')} - {p.get('mac_address')}")
