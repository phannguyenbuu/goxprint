import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT command_params, updated_at FROM \"PrinterControlCommand\" WHERE command_params LIKE '%force_subnet_scan%' ORDER BY id DESC LIMIT 1")
row = c.fetchone()
content = row[0]
with open('output_control.py', 'w', encoding='utf-8') as f:
    f.write(f"Updated at: {row[1]}\n{content}")
