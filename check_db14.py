import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT command_content FROM uti_commands WHERE command='force_subnet_scan'")
row = c.fetchone()
with open('output_control.py', 'w', encoding='utf-8') as f:
    f.write(row[0])
