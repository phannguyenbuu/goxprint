import os

def create_scan_destinations():
    filepath = 'app-gox/src/pages/AgentPage.tsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_idx = 3558  
    end_idx = 3748    

    # Verify bounds before proceeding
    if "destinationsBlock" not in lines[start_idx] or "</div>" not in lines[end_idx-1]:
        print(f"Bounds changed! Expected 'destinationsBlock' at 3558, got: {lines[start_idx].strip()}")
        print(f"Expected '</div>' at 3747, got: {lines[end_idx-1].strip()}")
        # Let's dynamically find them instead of hardcoding
        start_idx = -1
        end_idx = -1
        for i, line in enumerate(lines):
            if "div style={styles.destinationsBlock}" in line:
                start_idx = i
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
        print("Could not find bounds.")
        return

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
