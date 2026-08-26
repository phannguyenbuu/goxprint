import urllib.request, json
url = 'https://agentapi.quanlymay.com/api/jobs?limit=5&page=1&status=failed&q=279545'
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())
    out = repr(data['jobs'][0]['command_params'])
    # limit to first 200 chars to avoid cp1252 error and see the escaping
    with open('output.txt', 'w', encoding='utf-8') as f:
        f.write(out[:500])
