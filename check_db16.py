import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT id, updated_at FROM \"PrinterControlCommand\" WHERE command_type='utility_exec' AND updated_at > '2026-08-24 07:31:00' ORDER BY id DESC LIMIT 10")
rows = c.fetchall()
if rows:
    for row in rows:
        print(row)
else:
    print("NO ROWS INSERTED AFTER 07:31")
