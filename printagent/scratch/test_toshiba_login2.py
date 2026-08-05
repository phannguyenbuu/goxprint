import requests
import urllib3
urllib3.disable_warnings()

r = requests.get("https://wim17858236038101.app.goxprint.com/TopAccessLogin.html", verify=False)
with open("scratch/TopAccessLogin.html", "w", encoding="utf-8") as f:
    f.write(r.text)
