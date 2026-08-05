import requests
import urllib3
import re
urllib3.disable_warnings()

def test_xml_tunnel(base_url):
    session = requests.Session()
    
    # Send GetTemplateList XML
    xml_data = """<DeviceInformationModel><GetValue><JobTemplates><View><TemplateList/></View></JobTemplates></GetValue><Command><GetTemplateList><commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode><Params><param name='selectedGroup'>001</param><param name='viewXpath'>JobTemplates/View/TemplateList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedTemplates'>false</param><param name='inputGroupPassword'></param><param name='locale'>en_GB</param></Params></GetTemplateList></Command></DeviceInformationModel>"""
    
    headers = {
        "Content-Type": "text/xml",
        "User-Agent": "Mozilla/5.0",
        "Referer": f"{base_url}/Registration/Template/TempGroupList.html",
        "Cookie": "SESSID=dummy"
    }
    
    cgi_url = f"{base_url}/cgi/WebUIStore"
    print(f"POSTing to {cgi_url}")
    
    try:
        r = session.post(cgi_url, data=xml_data, headers=headers, verify=False, timeout=5)
        print("Status Code:", r.status_code)
        print("Response Headers:", r.headers)
        
        snippet = r.text[:500]
        print("Response snippet:", snippet)
        print("-" * 40)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_xml_tunnel("https://wim17858236038101.app.goxprint.com")
