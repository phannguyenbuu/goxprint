// @ts-nocheck
import { useState, useCallback } from 'react';
import { useAgentLanPrinters } from './useAgentLanPrinters';
import { useAgentUtilityCommands } from './useAgentUtilityCommands';
import { useAgentWebPreview } from './useAgentWebPreview';
import { useAgentStorageViewer } from './useAgentStorageViewer';

export const useAgentCoreLogic = (deps: any = {}) => {
  const [toasts, setToasts] = useState<any[]>([]);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const [commandStatus, setCommandStatus] = useState<Record<string, { message: string; isPending: boolean }>>({});
  const [viewOutputModal, setViewOutputModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    rawPayload: any;
  }>({
    isOpen: false,
    title: '',
    content: '',
    rawPayload: null
  });

  const [ipInputModal, setIpInputModal] = useState<{
    isOpen: boolean;
    title: string;
    hint: string;
    value: string;
    changeAllTo: string;
    scanStatus: string;
    error: string;
    onConfirm?: (targetIp: string, changeAllTo?: string) => void;
  }>({
    isOpen: false,
    title: '',
    hint: '',
    value: '',
    changeAllTo: '',
    scanStatus: '',
    error: ''
  });

  const utility = useAgentUtilityCommands({
    showToast,
    setViewOutputModal,
    setIpInputModal,
    setCommandStatus
  });

  const lanPrinters = useAgentLanPrinters({
    showToast,
    pollCommandStatus: utility.pollCommandStatus,
    utilityCommands: utility.utilityCommands
  });

  const webPreview = useAgentWebPreview({
    showToast,
    pollCommandStatus: utility.pollCommandStatus
  });

  const storageViewer = useAgentStorageViewer({
    showToast,
    pollCommandStatus: utility.pollCommandStatus,
    setViewOutputModal
  });

  return {
    toasts,
    showToast,
    commandStatus,
    setCommandStatus,
    viewOutputModal,
    setViewOutputModal,
    ipInputModal,
    setIpInputModal,

    ...lanPrinters,

    ...utility,

    ...webPreview,

    ...storageViewer
  };
};
