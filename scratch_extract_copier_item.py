import os
import re

def extract_copier_item():
    filepath = 'app-gox/src/pages/AgentPage.tsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_idx = -1
    end_idx = -1
    
    # We want to extract the whole `<div key={p.id}...>` down to the closing `</div>` inside the `filteredPrinters.map`
    for i, line in enumerate(lines):
        if "id={`copier-card-${p.id}`}" in line:
            start_idx = i - 2 # including <div key={p.id}
            break
            
    if start_idx != -1:
        depth = 0
        for i in range(start_idx, len(lines)):
            if "<div" in lines[i]: depth += 1
            if "</div" in lines[i]: 
                depth -= 1
                if depth == 0:
                    end_idx = i + 1
                    break
                    
    if start_idx == -1 or end_idx == -1:
        print("Bounds not found")
        return
        
    extracted_jsx = lines[start_idx:end_idx]
    
    component_code = """import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styles } from '../AgentStyles';
import { GlowCard } from '../../components/ui/GlowCard';
import { ScanDestinations } from './ScanDestinations';

export interface CopierItemProps {
  p: any;
  selectedLan: any;
  activeAgentUid: string;
  selectedAgentUid: string;
  copierCredentials: Record<string, any>;
  setCopierCredentials: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  saveAuthLoading: Record<string, boolean>;
  handleSaveAuth: (p: any) => void;
  isExpanded: boolean;
  handleCopierClick: (id: string) => void;
  onlineAgents: any[];
  detectBrand: (name: string) => string;
  showToast: (msg: string, type: 'info' | 'success' | 'error' | 'pending', dur?: number) => void;
  fetchRemotePage: (ip: string, path: string, method: string, body: any, force: boolean, agentUid: string, port: number) => void;
  setRemoteLockPrinter: React.Dispatch<React.SetStateAction<any>>;
  setActiveModal: React.Dispatch<React.SetStateAction<any>>;
  hasAddressList: boolean;
  sync: any;
  commandStatus: Record<string, any>;
  getDestinationStatus: (entry: any) => any;
  handleOpenStorageFiles: (lanUid: string, destVal: string) => void;
  handleEditIP: (pId: string, entry: any) => void;
  handleDeleteDest: (pId: string, entry: any) => void;
}

export function CopierItem({
  p,
  selectedLan,
  activeAgentUid,
  selectedAgentUid,
  copierCredentials,
  setCopierCredentials,
  saveAuthLoading,
  handleSaveAuth,
  isExpanded,
  handleCopierClick,
  onlineAgents,
  detectBrand,
  showToast,
  fetchRemotePage,
  setRemoteLockPrinter,
  setActiveModal,
  hasAddressList,
  sync,
  commandStatus,
  getDestinationStatus,
  handleOpenStorageFiles,
  handleEditIP,
  handleDeleteDest
}: CopierItemProps) {
  return (
"""
    for line in extracted_jsx:
        component_code += "  " + line
        
    component_code += """  );
}
"""

    os.makedirs('app-gox/src/pages/Agent/components', exist_ok=True)
    with open('app-gox/src/pages/Agent/components/CopierItem.tsx', 'w', encoding='utf-8') as f:
        f.write(component_code)
        
    print("Created CopierItem.tsx")
    
    replacement = """                        <CopierItem
                          p={p}
                          selectedLan={selectedLan}
                          activeAgentUid={activeAgentUid}
                          selectedAgentUid={selectedAgentUid}
                          copierCredentials={copierCredentials}
                          setCopierCredentials={setCopierCredentials}
                          saveAuthLoading={saveAuthLoading}
                          handleSaveAuth={handleSaveAuth}
                          isExpanded={expandedPrinters[p.id]}
                          handleCopierClick={handleCopierClick}
                          onlineAgents={onlineAgents}
                          detectBrand={detectBrand}
                          showToast={showToast}
                          fetchRemotePage={fetchRemotePage}
                          setRemoteLockPrinter={setRemoteLockPrinter}
                          setActiveModal={setActiveModal}
                          hasAddressList={hasAddressList}
                          sync={sync}
                          commandStatus={commandStatus}
                          getDestinationStatus={getDestinationStatus}
                          handleOpenStorageFiles={handleOpenStorageFiles}
                          handleEditIP={handleEditIP}
                          handleDeleteDest={handleDeleteDest}
                        />\n"""
                                
    del lines[start_idx:end_idx]
    lines.insert(start_idx, replacement)
    
    import_stmt = "import { CopierItem } from './Agent/components/CopierItem';\n"
    for i, line in enumerate(lines):
        if "import { ScanDestinations }" in line:
            lines.insert(i + 1, import_stmt)
            break

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)
        
    print("Updated AgentPage.tsx")

if __name__ == '__main__':
    extract_copier_item()
