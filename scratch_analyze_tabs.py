import os
import re

def extract_tab(tab_name, start_marker, end_marker, comp_name):
    filepath = 'app-gox/src/pages/AgentPage.tsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_idx = -1
    end_idx = -1
    
    for i, line in enumerate(lines):
        if start_marker in line:
            start_idx = i
            break
            
    if start_idx != -1:
        depth = 0
        for i in range(start_idx, len(lines)):
            if "{" in lines[i]: depth += lines[i].count("{")
            if "}" in lines[i]: depth -= lines[i].count("}")
            if depth == 0 and i > start_idx:
                end_idx = i + 1
                break
                
    if start_idx == -1 or end_idx == -1:
        print(f"Bounds not found for {comp_name}")
        return None
        
    extracted_jsx = lines[start_idx:end_idx]
    
    # We will let tsc tell us what props are missing.
    # For now, just pass `props: any` to make it compile loosely, or we can parse it.
    
    return start_idx, end_idx, extracted_jsx

if __name__ == '__main__':
    res = extract_tab('agents', "{activeTab === 'agents' && (", ")}", "AgentsTab")
    if res: print(f"Found agents tab: {res[0]} to {res[1]}")
    
    res = extract_tab('copiers', "{activeTab === 'copiers' && (", ")}", "CopiersTab")
    if res: print(f"Found copiers tab: {res[0]} to {res[1]}")
    
    res = extract_tab('cameras', "{activeTab === 'cameras' && (", ")}", "CamerasTab")
    if res: print(f"Found cameras tab: {res[0]} to {res[1]}")
