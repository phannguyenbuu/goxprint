// @ts-nocheck
import { useAgentPageLogic1 } from './useAgentPageLogic1';
import { useAgentPageLogic2 } from './useAgentPageLogic2';
import { useAgentPageLogic3 } from './useAgentPageLogic3';

export function useAgentPageController() {
  const logic1 = useAgentPageLogic1({});
  const logic2 = useAgentPageLogic2(logic1);
  const logic3 = useAgentPageLogic3({ ...logic1, ...logic2 });
  
  const propsToPass = { ...logic1, ...logic2, ...logic3 };
  return propsToPass;
}
