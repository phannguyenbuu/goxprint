import sys, traceback
sys.path.append("/opt/printagent")
from app import create_app

app = create_app()
client = app.test_client()

try:
    res = client.delete("/api/infor/2")
    print("STATUS:", res.status)
    print("BODY:", res.data.decode("utf-8", "ignore"))
except Exception as e:
    print("EXCEPTION:", e)
    traceback.print_exc()
