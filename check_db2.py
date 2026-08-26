import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT command_content FROM uti_commands WHERE command='force_subnet_scan'")
content = c.fetchone()[0]
print("PJL in content:", "PJL" in content)
print("last_err in content:", "last_err" in content)
