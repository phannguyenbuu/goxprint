import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'Printer'")
print([r[0] for r in c.fetchall()])
c.execute("SELECT id, name, ip, mac_address, agent_id, lan_site_id FROM \"Printer\" LIMIT 20")
for r in c.fetchall():
    print(r)
