import psycopg2
conn = psycopg2.connect(dbname="GoPrinx", user="postgres", password="myPass", host="127.0.0.1")
cur = conn.cursor()
cur.execute("SELECT command_content FROM uti_commands WHERE command = 'force_subnet_scan'")
row = cur.fetchone()
if row:
    print(row[0])
