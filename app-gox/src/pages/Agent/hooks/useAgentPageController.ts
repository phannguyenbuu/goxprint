// @ts-nocheck
import { useAgentCoreLogic } from './useAgentCoreLogic';
import { useAgentCameraVnc } from './useAgentCameraVnc';
import { useAgentScanActions } from './useAgentScanActions';

export function useAgentPageController() {
  const core = useAgentCoreLogic({});
  const media = useAgentCameraVnc(core);
  const scanActions = useAgentScanActions({ ...core, ...media });
  
  const propsToPass = { ...core, ...media, ...scanActions };
  return propsToPass;
}
