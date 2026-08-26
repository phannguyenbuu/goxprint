import psycopg2
import json
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT lan_uid, printers FROM lan_sites")
rows = c.fetchall()
for r in rows:
    print(f"Lan UID: {r[0]}")
    printers = r[1]
    if isinstance(printers, str):
        try:
            printers = json.loads(printers)
        except:
            pass
    if isinstance(printers, list):
        print(f"  Count: {len(printers)}")
        # Print IPs to see duplicates
        ips = [p.get('ip') for p in printers]
        print(f"  IPs: {ips}")
print("done")
