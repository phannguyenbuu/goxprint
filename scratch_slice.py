import sys
sys.stdout.reconfigure(encoding='utf-8')

def wrap(name, lines):
    # Remove the enclosing {activeTab === 'xxx' && ( and )}
    code = "".join(lines)
    if code.strip().startswith("{activeTab"):
        code = code[code.find('(')+1 : code.rfind(')')]
        
    return f"""import React from 'react';
import {{ motion, AnimatePresence }} from 'framer-motion';
import {{ styles }} from '../AgentStyles';
import {{ GlowCard }} from '../../components/ui/GlowCard';
import {{ AnimatedList }} from '../../components/ui/AnimatedList';
import {{ safePathToken }} from '../../utils/stringUtils';

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

with open('app-gox/src/pages/AgentPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

agents_lines = lines[2923:3171]
cameras_lines = lines[3779:3988]
modals_lines = lines[3989:7227]

import os
os.makedirs('app-gox/src/pages/Agent/components', exist_ok=True)
with open('app-gox/src/pages/Agent/components/AgentsTab.tsx', 'w', encoding='utf-8') as f:
    f.write(wrap('AgentsTab', agents_lines))
with open('app-gox/src/pages/Agent/components/CamerasTab.tsx', 'w', encoding='utf-8') as f:
    f.write(wrap('CamerasTab', cameras_lines))
with open('app-gox/src/pages/Agent/components/AgentModals.tsx', 'w', encoding='utf-8') as f:
    f.write(wrap('AgentModals', modals_lines))

# Now replace in AgentPage
new_lines = lines[:2923] + \
    ["            {activeTab === 'agents' && <AgentsTab {...propsToPass} />}\n"] + \
    lines[3171:3779] + \
    ["            {activeTab === 'cameras' && <CamerasTab {...propsToPass} />}\n"] + \
    ["            <AgentModals {...propsToPass} />\n"] + \
    lines[7227:]

new_text = "".join(new_lines)
imports = """import { AgentsTab } from './Agent/components/AgentsTab';
import { CamerasTab } from './Agent/components/CamerasTab';
import { AgentModals } from './Agent/components/AgentModals';
"""
new_text = imports + new_text
new_text = new_text.replace('export default function AgentPage(props: Props) {', 
    'export default function AgentPage(props: Props) {\n  const propsToPass: any = {};')

with open('app-gox/src/pages/AgentPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Sliced properly!")
