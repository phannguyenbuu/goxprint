import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

filepath = 'app-gox/src/pages/AgentPage.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def get_block(start_str):
    start = -1
    for i, l in enumerate(lines):
        if start_str in l:
            start = i
            break
    if start == -1: return -1, -1, []
    
    depth = 0
    end = -1
    for i in range(start, len(lines)):
        depth += lines[i].count('{')
        depth -= lines[i].count('}')
        if depth == 0 and i > start:
            end = i + 1
            break
    return start, end, lines[start:end]

a_s, a_e, a_lines = get_block("{activeTab === 'agents' && (")
c_s, c_e, c_lines = get_block("{activeTab === 'cameras' && (")

# Modals are everything from {/* Modal Header */} to <ToastContainer
m_s = -1
for i, l in enumerate(lines):
    if "{/* Modal Header */}" in l:
        m_s = i
        break
m_e = 7228

m_lines = lines[m_s:m_e] if m_s != -1 and m_e != -1 else []

if not (a_lines and c_lines and m_lines):
    print("Failed to find bounds")
    print(f"a_s: {a_s}, c_s: {c_s}, m_s: {m_s}, m_e: {m_e}")
    sys.exit(1)

os.makedirs('app-gox/src/pages/Agent/components', exist_ok=True)

def write_comp(name, code_lines, inner_only):
    if inner_only:
        code_lines = code_lines[1:-1]
        
    out = "import React from 'react';\n"
    out += "import { motion, AnimatePresence } from 'framer-motion';\n"
    out += "import { styles } from '../AgentStyles';\n"
    out += "import { GlowCard } from '../../components/ui/GlowCard';\n"
    out += "import { AnimatedList } from '../../components/ui/AnimatedList';\n\n"
    out += f"export function {name}(props: any) {{\n"
    out += "  const propsToDestructure = props;\n\n"
    out += "  return (\n    <>\n"
    out += "".join("  " + l for l in code_lines)
    out += "    </>\n  );\n}\n"
    
    with open(f'app-gox/src/pages/Agent/components/{name}.tsx', 'w', encoding='utf-8') as f:
        f.write(out)

write_comp("AgentsTab", a_lines, True)
write_comp("CamerasTab", c_lines, True)
write_comp("AgentModals", m_lines, False)

# Delete bottom up
del lines[m_s:m_e]
lines.insert(m_s, "            <AgentModals {...propsToPass} />\n")

del lines[c_s:c_e]
lines.insert(c_s, "            {activeTab === 'cameras' && <CamerasTab {...propsToPass} />}\n")

del lines[a_s:a_e]
lines.insert(a_s, "            {activeTab === 'agents' && <AgentsTab {...propsToPass} />}\n")

imports = [
    "import { AgentsTab } from './Agent/components/AgentsTab';\n",
    "import { CamerasTab } from './Agent/components/CamerasTab';\n",
    "import { AgentModals } from './Agent/components/AgentModals';\n"
]

for i, line in enumerate(lines):
    if line.startswith('import ') and '{' not in line:
        for imp in reversed(imports):
            lines.insert(i, imp)
        break

for i, line in enumerate(lines):
    if "export default function AgentPage" in line:
        lines.insert(i + 1, "  const propsToPass: any = {};\n")
        break

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("SUCCESS")
