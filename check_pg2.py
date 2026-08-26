from sqlalchemy import create_engine
from sqlalchemy.sql import text
import json
engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
with engine.connect() as conn:
    result = conn.execute(text('SELECT command_params FROM "PrinterControlCommand" WHERE id = 311060'))
    row = result.fetchone()
    params = json.loads(row[0])
    params['command_content'] = '<truncated>'
    print(json.dumps(params, indent=2))
