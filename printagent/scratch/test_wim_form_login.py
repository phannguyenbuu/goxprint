import requests

url = "https://wim17858304268101.app.goxprint.com/login.cgi"
data = {
    "Login_ID": "admin",
    "Password": "123456",
    "login": "Login"
}
s = requests.Session()
# First get the page to get the session cookie
s.get("https://wim17858304268101.app.goxprint.com/?MAIN=TOPACCESS", verify=False)

r = s.post(url, data=data, verify=False, allow_redirects=False)
print("Form login status:", r.status_code)
print("Form login headers:", r.headers)
print("Form login cookies:", s.cookies.get_dict())
