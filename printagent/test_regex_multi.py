import re

raw_resp_text = """<DeviceInformationModel><GetValue><JobTemplates><View><TemplateList>
<Template gid="002" tid="001" valid="true"><MetaData><caption1>A</caption1></MetaData></Template>
<Template gid="002" tid="002" valid="true"><MetaData><caption1>B</caption1></MetaData></Template>
</TemplateList></View></JobTemplates></GetValue></DeviceInformationModel>"""

pattern = re.compile(r'<(?:\w+:)?Template(?:(\s[^>]*)|)>(.*?)</(?:\w+:)?Template>', re.DOTALL)
for match in pattern.finditer(raw_resp_text):
    attrs = match.group(1) or ""
    block = match.group(2)
    print("Attrs:", attrs.strip())
    
    tid_match = re.search(r'tid=["\'](\d+)["\']', attrs)
    reg_no = tid_match.group(1) if tid_match else "001"
    
    cap1_match = re.search(r'<(?:\w+:)?caption1>([^<]*)</(?:\w+:)?caption1>', block)
    c1 = cap1_match.group(1).strip() if cap1_match else ""
    print("RegNo:", reg_no)
    print("DispName:", c1)
