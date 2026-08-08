import os
import re

def fix_copier_item():
    filepath = 'app-gox/src/pages/Agent/components/CopierItem.tsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Fix import path for GlowCard
    content = content.replace("../../components/ui/GlowCard", "../../../components/ui/GlowCard")
    
    # Add missing props to interface
    props_to_add = """
  handleRefetchAddressBook: (pId: string) => void;
  expandedDrivers: Record<string, boolean>;
  setExpandedDrivers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  expandedDriverMenus: Record<string, boolean>;
  setExpandedDriverMenus: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleRemoteInstallDriver: (pId: string, osType: string, bit: string) => void;
  setPublicFtpData: React.Dispatch<React.SetStateAction<any>>;
"""
    content = content.replace("export interface CopierItemProps {", "export interface CopierItemProps {" + props_to_add)
    
    # Add missing props to destructuring
    destruct_to_add = """
  handleRefetchAddressBook,
  expandedDrivers,
  setExpandedDrivers,
  expandedDriverMenus,
  setExpandedDriverMenus,
  handleRemoteInstallDriver,
  setPublicFtpData,
"""
    content = content.replace("}: CopierItemProps) {", destruct_to_add + "}: CopierItemProps) {")

    # Add missing variables inside CopierItem
    vars_to_add = """
  const hasDrivers = p.drivers && Object.keys(p.drivers).length > 0;
  const driversExpanded = expandedDrivers[p.id];
  const syncCount = sync.address_list ? sync.address_list.length : 0;
  const syncTime = sync.timestamp ? new Date(sync.timestamp).toLocaleTimeString('vi-VN') : '';
  const isPending = commandStatus[p.id]?.isPending || false;
  const statusMsg = commandStatus[p.id]?.message || '';
"""
    content = content.replace("  return (\n", vars_to_add + "  return (\n")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed CopierItem.tsx")
    
def fix_agent_page():
    filepath = 'app-gox/src/pages/AgentPage.tsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove unused ScanDestinations import
    content = re.sub(r"import { ScanDestinations } from './Agent/components/ScanDestinations';\n", "", content)

    # Pass the new props to CopierItem
    props_to_pass = """                          handleRefetchAddressBook={handleRefetchAddressBook}
                          expandedDrivers={expandedDrivers}
                          setExpandedDrivers={setExpandedDrivers}
                          expandedDriverMenus={expandedDriverMenus}
                          setExpandedDriverMenus={setExpandedDriverMenus}
                          handleRemoteInstallDriver={handleRemoteInstallDriver}
                          setPublicFtpData={setPublicFtpData}
"""
    content = content.replace("                          handleDeleteDest={handleDeleteDest}\n                        />", "                          handleDeleteDest={handleDeleteDest}\n" + props_to_pass + "                        />")

    # Remove the variables from AgentPage that we just moved to CopierItem
    patterns_to_remove = [
        r'\s*const driversExpanded = expandedDrivers\[p\.id\];',
        r'\s*const hasDrivers = p\.drivers && Object\.keys\(p\.drivers\)\.length > 0;',
        r'\s*const syncCount = sync\.address_list \? sync\.address_list\.length : 0;',
        r'\s*const syncTime = sync\.timestamp \? new Date\(sync\.timestamp\)\.toLocaleTimeString\(\'vi-VN\'\) : \'\';',
        r'\s*const isPending = commandStatus\[p\.id\]\?\.isPending \|\| false;',
        r'\s*const statusMsg = commandStatus\[p\.id\]\?\.message \|\| \'\';',
        r'\s*const isExpanded = expandedPrinters\[p\.id\];',
    ]
    
    for pattern in patterns_to_remove:
        content = re.sub(pattern, '', content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed AgentPage.tsx")

if __name__ == '__main__':
    fix_copier_item()
    fix_agent_page()
