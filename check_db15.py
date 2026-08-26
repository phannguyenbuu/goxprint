import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT id, command_params FROM \"PrinterControlCommand\" WHERE id=384032")
row = c.fetchone()
with open('output_control_recent.py', 'w', encoding='utf-8') as f:
    f.write(row[1])
