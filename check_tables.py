import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
print(c.fetchall())
