import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT command FROM uti_commands")
rows = c.fetchall()
for r in rows:
    if 'canon' in r[0].lower():
        print(r)
print("done")
