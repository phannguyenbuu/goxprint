import urllib.request, urllib.error, ssl

ip = "192.168.1.224"
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for proto in ["http", "https"]:
    try:
        print(f"=== Trying {proto}://{ip}/ ===")
        req = urllib.request.Request(f"{proto}://{ip}/", headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=3) as r:
                body = r.read().decode('utf-8', errors='ignore')
                print(f"[{r.status}] Body length: {len(body)}")
                print(body[:500])
        except urllib.error.HTTPError as e:
            body = e.read().decode('utf-8', errors='ignore')
            print(f"[HTTPError {e.code}] Body length: {len(body)}")
            print(body[:500])
    except Exception as e:
        print(f"Exception: {e}")
