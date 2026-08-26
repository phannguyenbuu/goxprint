import psycopg2
conn = psycopg2.connect('dbname=GoPrinx user=postgres password=myPass host=127.0.0.1')
c = conn.cursor()
c.execute("SELECT command_content FROM printer_control_command WHERE command='force_subnet_scan' ORDER BY id DESC LIMIT 1")
content = c.fetchone()[0]
with open('output_control.py', 'w', encoding='utf-8') as f:
    f.write(content)
