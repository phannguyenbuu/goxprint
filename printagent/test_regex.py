import re

raw_resp_text = """<DeviceInformationModel><GetValue><JobTemplates><View><TemplateList><Template gid="002" tid="001" valid="true"><MetaData><caption1>Scan To</caption1><caption2>File</caption2><userName/><isPasswordProtected>false</isPasswordProtected><autoStart>false</autoStart><StorePath>\\\\192.168.1.50\\scan</StorePath></MetaData></Template></TemplateList></View></JobTemplates></GetValue></DeviceInformationModel>"""

pattern = re.compile(r'<(?:\w+:)?Template(?:(\s[^>]*)|)>(.*?)</(?:\w+:)?Template>', re.DOTALL)
for match in pattern.finditer(raw_resp_text):
    attrs = match.group(1) or ""
    block = match.group(2)
    print("Attrs:", attrs)
    print("Block:", block)
    
    tid_match = re.search(r'tid=["\'](\d+)["\']', attrs)
    num_match = re.search(r'<(?:\w+:)?name>(\d+)</(?:\w+:)?name>', block)
    reg_no = tid_match.group(1) if tid_match else (num_match.group(1) if num_match else "001")
    
    cap1_match = re.search(r'<(?:\w+:)?caption1>([^<]*)</(?:\w+:)?caption1>', block)
    cap2_match = re.search(r'<(?:\w+:)?caption2>([^<]*)</(?:\w+:)?caption2>', block)

    c1 = cap1_match.group(1).strip() if cap1_match else ""
    c2 = cap2_match.group(1).strip() if cap2_match else ""
    disp_name = c2 or c1
    print("RegNo:", reg_no)
    print("DispName:", disp_name)
    
