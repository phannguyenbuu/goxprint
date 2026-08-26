import sys, traceback
sys.path.append("/opt/printagent")
from app import create_app

app = create_app()
client = app.test_client()
try:
    res = client.get("/api/infor/list?lead=default&page=1&limit=50")
    print("STATUS:", res.status)
    if res.status_code != 200:
        print("BODY:", res.data.decode("utf-8", "ignore"))
    else:
        print("SUCCESS! Page size:", len(res.json.get("rows", [])))
except Exception as e:
    print("EXCEPTION:", e)
    traceback.print_exc()
