import sys
sys.path.append("/opt/printagent")
from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import sessionmaker
from models import CounterInfor, DeviceInfor, DeviceInforHistory, CounterBaseline, Printer

engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
Session = sessionmaker(bind=engine)
session = Session()

print("CounterInfor count:", session.scalar(select(func.count()).select_from(CounterInfor)))
print("DeviceInfor count:", session.scalar(select(func.count()).select_from(DeviceInfor)))
print("DeviceInforHistory count:", session.scalar(select(func.count()).select_from(DeviceInforHistory)))
print("CounterBaseline count:", session.scalar(select(func.count()).select_from(CounterBaseline)))
print("Printer count:", session.scalar(select(func.count()).select_from(Printer)))

session.close()
