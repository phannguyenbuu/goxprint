import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT id, command_type, updated_at FROM \"PrinterControlCommand\" ORDER BY id DESC LIMIT 10")
for row in c.fetchall():
    print(row)
