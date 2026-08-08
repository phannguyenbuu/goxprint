import os

def extract_styles():
    filepath = 'app-gox/src/pages/AgentPage.tsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_idx = -1
    end_idx = -1
    
    for i, line in enumerate(lines):
        if line.startswith('const styles: Record<string, React.CSSProperties> = {'):
            start_idx = i
            break
            
    if start_idx != -1:
        for i in range(start_idx, len(lines)):
            if lines[i].startswith('};'):
                end_idx = i
                break
                
    if start_idx != -1 and end_idx != -1:
        extracted = lines[start_idx:end_idx+1]
        
        os.makedirs('app-gox/src/pages/Agent', exist_ok=True)
        with open('app-gox/src/pages/Agent/AgentStyles.ts', 'w', encoding='utf-8') as f:
            f.write("import React from 'react';\n\n")
            f.write("export ")
            for line in extracted:
                f.write(line)
                
        # Now remove them from AgentPage
        del lines[start_idx:end_idx+1]
        
        # Add import
        for i, line in enumerate(lines):
            if "import { motion," in line or "framer-motion" in line:
                lines.insert(i + 1, "import { styles } from './Agent/AgentStyles';\n")
                break
                
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)

if __name__ == '__main__':
    extract_styles()
