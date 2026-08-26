import psycopg2
conn = psycopg2.connect(dbname="GoPrinx", user="postgres", password="myPass", host="127.0.0.1")
cur = conn.cursor()
cur.execute('SELECT command FROM "uti_commands"')
rows = cur.fetchall()
print([r[0] for r in rows])
