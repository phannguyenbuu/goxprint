import psycopg2
import json

conn = psycopg2.connect(dbname='goxprint', user='postgres', password='xxx', host='127.0.0.1')
cur = conn.cursor()
cur.execute("SELECT command_type, command_params, lead, agent_uid FROM \"PrinterControlCommand\" WHERE id = 311060")
row = cur.fetchone()
if row:
    print(f"COMMAND_TYPE: {row[0]}")
    print(f"COMMAND_PARAMS: {row[1]}")
    print(f"LEAD: {row[2]}")
    print(f"AGENT_UID: {row[3]}")
else:
    print("Not found")
