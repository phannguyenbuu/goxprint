import re

with open('app-gox/src/pages/AgentPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The code before return( is state setup
return_idx = content.find('  return (')
state_code = content[:return_idx]

# Find all 'const [var, setVar]'
state_vars = re.findall(r'const \[\s*([a-zA-Z0-9_]+)\s*,', state_code)

# Find all 'const funcName = ' or 'function funcName'
funcs = re.findall(r'const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>', state_code)
funcs2 = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', state_code)

# Add hardcoded variables we know are in scope or passed in
extras = ['styles', 'activeTab', 'lanSites', 'lanSitesLoading', 'safePathToken']

# Combine and remove duplicates
all_vars = sorted(list(set(state_vars + funcs + funcs2 + extras)))

# Remove React keywords
all_vars = [v for v in all_vars if v not in ['useEffect', 'useState', 'useRef', 'useQuery', 'useMutation']]

# Create destructuring block
destructure_block = "  const {\n" + ",\n".join([f"    {v}" for v in all_vars]) + "\n  } = propsToDestructure;\n"

# Inject into components
for comp in ['AgentsTab', 'CamerasTab', 'AgentModals']:
    path = f'app-gox/src/pages/Agent/components/{comp}.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        comp_content = f.read()
    
    comp_content = comp_content.replace('  const propsToDestructure = props;', destructure_block)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(comp_content)

# Create propsToPass block
props_block = "  const propsToPass: any = {\n" + ",\n".join([f"    {v}: typeof {v} !== 'undefined' ? {v} : undefined" for v in all_vars]) + "\n  };"

# Inject into AgentPage
content = content.replace('  const propsToPass: any = {};', props_block)

with open('app-gox/src/pages/AgentPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Injected {len(all_vars)} variables into props!")
