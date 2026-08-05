import requests
import re
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IP = "192.168.1.156"
url = f"http://{IP}/TopAccess/DeviceInformation"

get_templates_xml = """<DeviceInformationModel><GetValue><JobTemplates><View><TemplateList/></View></JobTemplates></GetValue><Command><GetTemplateList><commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode><Params><param name='selectedGroup'>002</param><param name='viewXpath'>JobTemplates/View/TemplateList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedTemplates'>false</param><param name='inputGroupPassword'></param><param name='locale'>en_US</param></Params></GetTemplateList></Command></DeviceInformationModel>"""

headers = {
    "Content-Type": "text/xml",
    "User-Agent": "Mozilla/5.0"
}

print(f"Testing {IP} without login...")
try:
    r = requests.post(url, data=get_templates_xml, headers=headers, verify=False, timeout=5)
    print("STATUS:", r.status_code)
    print("RESPONSE (first 500 chars):", r.text[:500])
    
    # Try parsing
    pattern = re.compile(r'<(?:\w+:)?Template(?:(\s[^>]*)|)>(.*?)</(?:\w+:)?Template>', re.DOTALL)
    matches = list(pattern.finditer(r.text))
    print(f"Found {len(matches)} templates via regex!")
except Exception as e:
    print("Error:", e)
