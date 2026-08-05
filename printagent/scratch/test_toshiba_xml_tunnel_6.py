import requests
import urllib3
urllib3.disable_warnings()

def test_xml_tunnel(base_url):
    session = requests.Session()
    
    # 1. Get Session
    r1 = session.get(f"{base_url}/?MAIN=TOPACCESS", verify=False)
    session_cookie = session.cookies.get("Session")
    print("GET /?MAIN=TOPACCESS ->", r1.status_code)
    print("Session Cookie:", session_cookie)
    
    login_xml = f"""<DeviceInformationModel>
    <SetValue><Authentication><UserCredential><userName>admin</userName><passwd>123456</passwd><ipaddress>127.0.0.1</ipaddress><DepartmentManagement isEnable='false'><requireDepartment></requireDepartment></DepartmentManagement><domainName></domainName><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue>
    <Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login></Command>
    <SaveSessionInformation><SessionInfo><Information><type>LoginPassword</type><data>123456</data></Information><Information><type>LoginUser</type><data>admin</data></Information></SessionInfo></SaveSessionInformation>
    </DeviceInformationModel>"""
    
    headers = {
        "Content-Type": "text/plain; charset=utf-8",
        "csrfpId": session_cookie,
        "Referer": f"{base_url}/TopAccessLogin.html"
    }
    
    cgi_url = f"{base_url}/contentwebserver"
    print(f"POSTing Login to {cgi_url}")
    
    try:
        r2 = session.post(cgi_url, data=login_xml, headers=headers, verify=False, timeout=5)
        print("POST Status Code:", r2.status_code)
        
        if r2.status_code == 200:
            # 3. GET TEMPLATES!
            print("Now getting templates...")
            xml_data = """<DeviceInformationModel><GetValue><JobTemplates><View><TemplateList/></View></JobTemplates></GetValue><Command><GetTemplateList><commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode><Params><param name='selectedGroup'>001</param><param name='viewXpath'>JobTemplates/View/TemplateList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedTemplates'>false</param><param name='inputGroupPassword'></param><param name='locale'>en_GB</param></Params></GetTemplateList></Command></DeviceInformationModel>"""
            
            # Update csrfpId to the NEW session cookie!
            headers["csrfpId"] = session.cookies.get("Session")
            headers["Referer"] = f"{base_url}/Registration/Template/TempGroupList.html"
            r3 = session.post(cgi_url, data=xml_data, headers=headers, verify=False, timeout=5)
            print("Templates Status Code:", r3.status_code)
            print("Templates snippet:", r3.text[:2000])
            
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_xml_tunnel("https://wim17858236038101.app.goxprint.com")
