import psycopg2

conn = psycopg2.connect("dbname=GoPrinx user=postgres password=myPass host=127.0.0.1")
c = conn.cursor()
c.execute('SELECT id, status, command_type FROM "PrinterControlCommand" WHERE status=\'processing\' ORDER BY id DESC')
rows = c.fetchall()
print(f"Total processing: {len(rows)}")
for r in rows:
    print(r)

