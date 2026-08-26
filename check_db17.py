import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT command_content FROM uti_commands WHERE command='force_subnet_scan'")
row = c.fetchone()
print(len(row[0]) if row and row[0] else "NOT FOUND")
