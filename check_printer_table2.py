import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT id, printer_name, ip, mac_address, agent_uid FROM \"Printer\" ORDER BY created_at DESC LIMIT 30")
for r in c.fetchall():
    print(r)
print("--- Check duplicate MACs ---")
c.execute("SELECT mac_address, agent_uid, COUNT(*) FROM \"Printer\" GROUP BY mac_address, agent_uid HAVING COUNT(*) > 1")
for r in c.fetchall():
    print(r)
