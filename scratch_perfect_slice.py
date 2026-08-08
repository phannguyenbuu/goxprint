import re
import os

with open('app-gox/src/pages/AgentPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def wrap(name, code_lines):
    code = "".join(code_lines)
    if code.strip().startswith("{activeTab"):
        code = code[code.find('(')+1 : code.rfind(')')]
        
    return f"""import React from 'react';
import {{ motion, AnimatePresence }} from 'framer-motion';
import {{ styles }} from '../AgentStyles';
import {{ GlowCard }} from '../../components/ui/GlowCard';
import {{ AnimatedList }} from '../../components/ui/AnimatedList';
import {{ safePathToken }} from '../../utils/stringUtils';
import {{ CopierItem }} from './CopierItem';

export function {name}(props: any) {{
  const propsToDestructure = props;
  return (
    <>
      {{/* {name} */}}
{code}
    </>
  );
}}
"""

agents_lines = lines[2923:3171] # 2923 to 3170
cameras_lines = lines[3779:4505] # 3779 to 4504
modals_lines = lines[4509:7227] # 4509 to 7226

os.makedirs('app-gox/src/pages/Agent/components', exist_ok=True)
with open('app-gox/src/pages/Agent/components/AgentsTab.tsx', 'w', encoding='utf-8') as f:
    f.write(wrap('AgentsTab', agents_lines))
with open('app-gox/src/pages/Agent/components/CamerasTab.tsx', 'w', encoding='utf-8') as f:
    f.write(wrap('CamerasTab', cameras_lines))
with open('app-gox/src/pages/Agent/components/AgentModals.tsx', 'w', encoding='utf-8') as f:
    f.write(wrap('AgentModals', modals_lines))

# Construct props injection
main_return_idx = 2810
state_code = "".join(lines[:main_return_idx])

state_vars = re.findall(r'const \[\s*([a-zA-Z0-9_]+)\s*,', state_code)
state_setters = re.findall(r'const \[\s*[a-zA-Z0-9_]+\s*,\s*([a-zA-Z0-9_]+)\s*\]', state_code)
funcs = re.findall(r'const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>', state_code)
funcs2 = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', state_code)

all_vars = sorted(list(set(state_vars + state_setters + funcs + funcs2 + ['styles', 'lanSites', 'safePathToken', 'activeTab'])))
all_vars = [v for v in all_vars if v not in ['useEffect', 'useState', 'useRef', 'useQuery', 'useMutation']]

destructure_block = "  const {\n" + ",\n".join([f"    {v}" for v in all_vars]) + "\n  } = propsToDestructure;\n"
props_block = "  const propsToPass: any = {\n" + ",\n".join([f"    {v}: typeof {v} !== 'undefined' ? {v} : undefined" for v in all_vars]) + "\n  };"

for comp in ['AgentsTab', 'CamerasTab', 'AgentModals']:
    path = f'app-gox/src/pages/Agent/components/{comp}.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        comp_content = f.read()
    comp_content = comp_content.replace('  const propsToDestructure = props;', destructure_block)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(comp_content)

new_lines = lines[:2923] + \
    ["            {activeTab === 'agents' && <AgentsTab {...propsToPass} />}\n"] + \
    lines[3171:3779] + \
    ["            {activeTab === 'cameras' && <CamerasTab {...propsToPass} />}\n"] + \
    lines[4505:4509] + \
    ["            <AgentModals {...propsToPass} />\n"] + \
    lines[7227:]

new_text = "".join(new_lines)
imports = """import { AgentsTab } from './Agent/components/AgentsTab';
import { CamerasTab } from './Agent/components/CamerasTab';
import { AgentModals } from './Agent/components/AgentModals';
"""
new_text = imports + new_text
new_text = new_text.replace('export function AgentPage() {', 
    'export function AgentPage() {\n' + props_block)

with open('app-gox/src/pages/AgentPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Sliced and injected successfully!")
