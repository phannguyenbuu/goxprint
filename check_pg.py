from sqlalchemy import create_engine
from sqlalchemy.sql import text
engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
with engine.connect() as conn:
    result = conn.execute(text('SELECT id, command_type, agent_uid, requested_at, command_params FROM "PrinterControlCommand" WHERE id IN (311060, 310949, 310263, 310157) ORDER BY id'))
    for row in result:
        print(row)
