import urllib.request, json
url = 'https://agentapi.quanlymay.com/api/devices'
req = urllib.request.Request(url)
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print(f"Total devices: {len(data.get('rows', []))}")
        for d in data.get('rows', []):
            print(f"{d.get('id')} - {d.get('printer_name')} - {d.get('ip')} - {d.get('lan_uid')} - {d.get('agent_uid')}")
except Exception as e:
    print('Error:', e)
