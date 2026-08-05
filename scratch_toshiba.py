import requests, urllib3, re
urllib3.disable_warnings()
try:
    session = requests.Session()
    r = session.get('https://wim17857249758110.app.goxprint.com/', verify=False, timeout=10)
    token = session.cookies.get('Session')
    print('Token:', token)

    groups = ['001', '002', '003', '000']
    cgis = ["/contentwebserver", "/cgi-bin/xml", "/cgi-bin/wim"]
    for cgi in cgis:
        print(f"\\n--- Testing CGI {cgi} ---")
        for group in groups:
            get_templates_xml = f"<DeviceInformationModel><GetValue><JobTemplates><View><TemplateList/></View></JobTemplates></GetValue><Command><GetTemplateList><commandNode>JobTemplates/GroupList/Group/TemplateList</commandNode><Params><param name='selectedGroup'>{group}</param><param name='viewXpath'>JobTemplates/View/TemplateList</param><param name='currentPage'>1</param><param name='pageSize'>60</param><param name='definedTemplates'>false</param><param name='inputGroupPassword'></param><param name='locale'>en_GB</param></Params></GetTemplateList></Command></DeviceInformationModel>"
            headers = {'Content-Type': 'text/xml; charset=utf-8', 'csrfpId': token or ''}
            r2 = session.post(f'https://wim17857249758110.app.goxprint.com{cgi}', data=get_templates_xml, headers=headers, verify=False, timeout=10)
            print(f'Group {group}: status {r2.status_code}, length {len(r2.text)}')
            if '<JobTemplates>' in r2.text or '<Template>' in r2.text:
                print('Found Templates!')
                print(r2.text[:200])
except Exception as e:
    print('Error:', e)
