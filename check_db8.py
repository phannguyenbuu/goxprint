import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute('SELECT command_params, command_type FROM "PrinterControlCommand" ORDER BY id DESC LIMIT 5')
for row in c.fetchall():
    print("TYPE:", row[1])
    print("CONTENT:", row[0][:200])
    print("---")
