import requests
import urllib3
urllib3.disable_warnings()

r = requests.get("https://wim17858236038101.app.goxprint.com/?MAIN=LOGIN", verify=False)
with open("scratch/login_page.html", "w", encoding="utf-8") as f:
    f.write(r.text)
