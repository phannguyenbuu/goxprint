import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT tablename FROM pg_tables WHERE schemaname='public'")
for row in c.fetchall():
    if 'control' in row[0]:
        print(row[0])
