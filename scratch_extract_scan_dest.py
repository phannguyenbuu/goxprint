import os

def create_scan_destinations():
    filepath = 'app-gox/src/pages/AgentPage.tsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_idx = 3558  # 0-indexed, so 3559 in 1-indexed
    end_idx = 3748    # 0-indexed, so 3749 in 1-indexed

    extracted_jsx = lines[start_idx:end_idx]
    
    component_code = """import React from 'react';
import { styles } from '../AgentStyles';

export interface ScanDestinationsProps {
  hasAddressList: boolean;
  sync: any;
  p: any;
  commandStatus: Record<string, any>;
  getDestinationStatus: (entry: any) => any;
  selectedLan: any;
  handleOpenStorageFiles: (lanUid: string, destVal: string) => void;
  showToast: (msg: string, type: 'info' | 'success' | 'error' | 'pending', dur?: number) => void;
  handleEditIP: (pId: string, entry: any) => void;
  handleDeleteDest: (pId: string, entry: any) => void;
}

export function ScanDestinations({
  hasAddressList,
  sync,
  p,
  commandStatus,
  getDestinationStatus,
  selectedLan,
  handleOpenStorageFiles,
  showToast,
  handleEditIP,
  handleDeleteDest
}: ScanDestinationsProps) {
  return (
"""
    for line in extracted_jsx:
        component_code += "  " + line
        
    component_code += """  );
}
"""

    os.makedirs('app-gox/src/pages/Agent/components', exist_ok=True)
    with open('app-gox/src/pages/Agent/components/ScanDestinations.tsx', 'w', encoding='utf-8') as f:
        f.write(component_code)
        
    print("Created ScanDestinations.tsx")
    
    replacement = """                                <ScanDestinations
                                  hasAddressList={hasAddressList}
                                  sync={sync}
                                  p={p}
                                  commandStatus={commandStatus}
                                  getDestinationStatus={getDestinationStatus}
                                  selectedLan={selectedLan}
                                  handleOpenStorageFiles={handleOpenStorageFiles}
                                  showToast={showToast}
                                  handleEditIP={handleEditIP}
                                  handleDeleteDest={handleDeleteDest}
                                />\n"""
                                
    del lines[start_idx:end_idx]
    lines.insert(start_idx, replacement)
    
    import_stmt = "import { ScanDestinations } from './Agent/components/ScanDestinations';\n"
    for i, line in enumerate(lines):
        if "import { LoadingSpinner }" in line:
            lines.insert(i + 1, import_stmt)
            break

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)
        
    print("Updated AgentPage.tsx")

if __name__ == '__main__':
    create_scan_destinations()
