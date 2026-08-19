from db import create_session_factory
from config import load_config
from models import Printer

cfg = load_config()
session_factory = create_session_factory(cfg)

with session_factory() as session:
    p = session.query(Printer).filter(Printer.ip == '192.168.1.226').first()
    if p:
        print(f"IP: {p.ip}")
        print(f"Auth User: {p.auth_user}")
        print(f"Auth Password: {p.auth_password}")
        print(f"User: {p.user}")
        print(f"Password: {p.password}")
    else:
        print("Not found")
