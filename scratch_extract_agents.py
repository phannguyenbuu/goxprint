import os
import re

def extract_agents_tab():
    filepath = 'app-gox/src/pages/AgentPage.tsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_idx = 2902
    end_idx = 3150
        
    extracted_jsx = lines[start_idx+1:end_idx-1]
    
    component_code = """import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styles } from '../AgentStyles';
import { GlowCard } from '../../components/ui/GlowCard';

export function AgentsTab(props: any) {
  const {
    onlineAgents,
    handleAgentClick,
    handleDeleteAgent,
    formatUptime,
    activeAgentUid
  } = props;
  
  return (
    <>
"""
    for line in extracted_jsx:
        component_code += "  " + line
        
    component_code += """    </>
  );
}
"""

    os.makedirs('app-gox/src/pages/Agent/components', exist_ok=True)
    with open('app-gox/src/pages/Agent/components/AgentsTab.tsx', 'w', encoding='utf-8') as f:
        f.write(component_code)
        
    print("Created AgentsTab.tsx")
    
    replacement = """            {activeTab === 'agents' && (
              <AgentsTab
                onlineAgents={onlineAgents}
                handleAgentClick={handleAgentClick}
                handleDeleteAgent={handleDeleteAgent}
                formatUptime={formatUptime}
                activeAgentUid={activeAgentUid}
                {...propsToPass}
              />
            )}\n"""
                                
    del lines[start_idx:end_idx]
    lines.insert(start_idx, replacement)
    
    import_stmt = "import { AgentsTab } from './Agent/components/AgentsTab';\n"
    # Find safe place for import
    for i, line in enumerate(lines):
        if line.startswith('import ') and '{' not in line:
            lines.insert(i, import_stmt)
            break
    
    # Add propsToPass object to avoid TS errors in AgentPage
    props_to_pass_stmt = "  const propsToPass: any = {};\n"
    for i, line in enumerate(lines):
        if "export default function AgentPage" in line:
            lines.insert(i + 1, props_to_pass_stmt)
            break

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)
        
    print("Updated AgentPage.tsx")

if __name__ == '__main__':
    extract_agents_tab()
