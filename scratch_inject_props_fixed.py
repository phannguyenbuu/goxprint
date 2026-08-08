import re

with open('app-gox/src/pages/AgentPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The code before return( is state setup
lines = content.split('\n')
main_return_idx = 0
for i, l in enumerate(lines):
    if '  return (' in l and i > 2800:
        main_return_idx = i
        break

state_code = "\n".join(lines[:main_return_idx])

# Find all 'const [var, setVar]'
state_vars = re.findall(r'const \[\s*([a-zA-Z0-9_]+)\s*,', state_code)
state_setters = re.findall(r'const \[\s*[a-zA-Z0-9_]+\s*,\s*([a-zA-Z0-9_]+)\s*\]', state_code)

# Find all 'const funcName = ' or 'function funcName'
funcs = re.findall(r'const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>', state_code)
funcs2 = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', state_code)

# Combine and remove duplicates
all_vars = sorted(list(set(state_vars + state_setters + funcs + funcs2 + ['styles', 'lanSites', 'safePathToken', 'activeTab'])))

# Remove React keywords
all_vars = [v for v in all_vars if v not in ['useEffect', 'useState', 'useRef', 'useQuery', 'useMutation']]

print(f"Found {len(all_vars)} variables!")

destructure_block = "  const {\n" + ",\n".join([f"    {v}" for v in all_vars]) + "\n  } = propsToDestructure;\n"

# Inject into components
for comp in ['AgentsTab', 'CamerasTab', 'AgentModals']:
    path = f'app-gox/src/pages/Agent/components/{comp}.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        comp_content = f.read()
    
    comp_content = re.sub(r'  const (?:propsToDestructure = props;|\{.*?\} = propsToDestructure;)', destructure_block, comp_content, flags=re.DOTALL)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(comp_content)

props_block = "  const propsToPass: any = {\n" + ",\n".join([f"    {v}: typeof {v} !== 'undefined' ? {v} : undefined" for v in all_vars]) + "\n  };"

# Inject into AgentPage
content = re.sub(r'  const propsToPass: any = \{.*?\};', props_block, content, flags=re.DOTALL)

with open('app-gox/src/pages/AgentPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Injected into props!")
