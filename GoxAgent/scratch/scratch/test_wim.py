import requests
import xml.etree.ElementTree as ET
import urllib3
urllib3.disable_warnings()

url = "https://wim17858304268101.app.goxprint.com/?MAIN=TOPACCESS"
s = requests.Session()
r = s.get(url, verify=False)
print("Initial get:", r.status_code)
csrfpId = s.cookies.get("Session", "")
print("Session cookie:", csrfpId)

# Try login
login_xml = """<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><param name="DeviceAdmin">123456</param></Params></Login></Command></DeviceInformationModel>"""

cgi_url = "https://wim17858304268101.app.goxprint.com/contentwebserver"
headers = {
    "Content-Type": "text/xml",
    "csrfpId": csrfpId
}

r = s.post(cgi_url, data=login_xml, headers=headers, verify=False)
print("Login status:", r.status_code)
print("Login response text:", r.text[:200])

csrfpId = s.cookies.get("Session", "")
print("New Session cookie:", csrfpId)
headers["csrfpId"] = csrfpId

# Try GetTemplates group 001
xml_data = """<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><Command><GetTemplates><commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode><Params><param name="selectedGroup">001</param></Params></GetTemplates></Command></DeviceInformationModel>"""

r = s.post(cgi_url, data=xml_data, headers=headers, verify=False)
print("GetTemplates status:", r.status_code)
print("GetTemplates length:", len(r.text))
print("GetTemplates text snippet:", r.text[:500])
