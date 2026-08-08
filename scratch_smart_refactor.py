import os
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

def run_tsc():
    result = subprocess.run('npx tsc --noEmit', shell=True, capture_output=True, text=True, cwd='app-gox')
    return result.stdout + result.stderr

def fix_errors_for(filepath, name):
    comp_path = f'app-gox/src/pages/Agent/components/{name}.tsx'
    
    all_missing_vars = set()
    
    for pass_num in range(10):
        tsc_out = run_tsc()
        
        # Get missing vars
        missing_vars = set(re.findall(f"{name}\\.tsx.*?Cannot find name '([^']+)'.", tsc_out))
        missing_vars.update(re.findall(f"{name}\\.tsx.*?Cannot find name `([^`]+)`.", tsc_out))
        
        if not missing_vars:
            print(f"No missing variables for {name} on pass {pass_num}!")
            break
            
        print(f"Pass {pass_num}: Missing variables found for {name}: {missing_vars}")
        new_vars = missing_vars - all_missing_vars
        if not new_vars:
            print(f"No NEW missing variables for {name}, we are stuck!")
            break
            
        all_missing_vars.update(missing_vars)
        
        # Overwrite destructuring block completely
        with open(comp_path, 'r', encoding='utf-8') as f:
            comp_content = f.read()
            
        # Replace the entire const { ... } = propsToDestructure; block
        # We can find it with regex
        props_str = "  const {\\n" + ",\\n".join([f"    {v}" for v in all_missing_vars]) + "\\n  } = propsToDestructure;\\n"
        
        comp_content = re.sub(
            r'  const (?:propsToDestructure = props;|\{.*?\} = propsToDestructure;)',
            props_str.replace('\\n', '\n'),
            comp_content,
            flags=re.DOTALL
        )
        
        with open(comp_path, 'w', encoding='utf-8') as f:
            f.write(comp_content)
            
        # Rewrite AgentPage to pass these
        with open(filepath, 'r', encoding='utf-8') as f:
            page_content = f.read()
            
        # Append to propsToPass: any = { ... };
        # Find the block and rewrite it
        all_props = "\\n".join([f"    {v}: {v}," for v in all_missing_vars])
        new_props_block = "  const propsToPass: any = {\\n" + all_props + "\\n  };"
        
        page_content = re.sub(
            r'  const propsToPass: any = \{.*?\};',
            new_props_block.replace('\\n', '\n'),
            page_content,
            flags=re.DOTALL
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(page_content)

if __name__ == '__main__':
    fix_errors_for('app-gox/src/pages/AgentPage.tsx', 'AgentsTab')
    fix_errors_for('app-gox/src/pages/AgentPage.tsx', 'CamerasTab')
    fix_errors_for('app-gox/src/pages/AgentPage.tsx', 'AgentModals')
