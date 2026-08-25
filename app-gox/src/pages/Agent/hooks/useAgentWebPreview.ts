// @ts-nocheck
import { useState, useCallback, useRef } from 'react';
import { installDriverOnAgent } from '../../../api/mockAgentApi';

export const useAgentWebPreview = (deps: any = {}) => {
  const { showToast, pollCommandStatus } = deps;

  const [webPreviewModal, setWebPreviewModal] = useState<{
    isOpen: boolean;
    copier: any;
    url: string;
    tunnelUrl: string;
    directUrl: string;
    auth: { user: string; pass: string };
  }>({
    isOpen: false,
    copier: null,
    url: '',
    tunnelUrl: '',
    directUrl: '',
    auth: { user: '', pass: '' }
  });

  const [webPreviewTab, setWebPreviewTab] = useState<'tunnel' | 'direct'>('tunnel');
  const [webPreviewLoading, setWebPreviewLoading] = useState(false);
  const [webPreviewHistory, setWebPreviewHistory] = useState<string[]>([]);
  const [webPreviewHistoryIndex, setWebPreviewHistoryIndex] = useState(-1);
  const [showPreviewDetails, setShowPreviewDetails] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  const [installDriverModal, setInstallDriverModal] = useState<{
    isOpen: boolean;
    printerId: string;
    copier: any;
    targetAgentUid: string;
    status: string;
    error: string;
  }>({
    isOpen: false,
    printerId: '',
    copier: null,
    targetAgentUid: '',
    status: '',
    error: ''
  });

  const handleCloseWebPreview = useCallback(() => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
    setWebPreviewModal((p) => ({ ...p, isOpen: false }));
  }, [previewBlobUrl]);

  const fetchRemotePage = useCallback(async (agentUid: string, printerIp: string, targetPath = '/') => {
    setWebPreviewLoading(true);
    try {
      const resp = await fetch(`/api/agents/${agentUid}/web-proxy?ip=${encodeURIComponent(printerIp)}&path=${encodeURIComponent(targetPath)}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();

      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
      const blob = new Blob([text], { type: 'text/html' });
      const newBlobUrl = URL.createObjectURL(blob);
      setPreviewBlobUrl(newBlobUrl);

      setWebPreviewHistory((prev) => {
        const next = [...prev.slice(0, webPreviewHistoryIndex + 1), targetPath];
        setWebPreviewHistoryIndex(next.length - 1);
        return next;
      });
    } catch (e: any) {
      console.error('Failed to proxy web preview:', e);
      if (showToast) showToast(`Không thể tải trang Web Setting: ${e.message}`, 'error');
    } finally {
      setWebPreviewLoading(false);
    }
  }, [webPreviewHistoryIndex, previewBlobUrl, showToast]);

  const handleHistoryBack = useCallback(() => {
    if (webPreviewHistoryIndex > 0) {
      const prevPath = webPreviewHistory[webPreviewHistoryIndex - 1];
      setWebPreviewHistoryIndex(webPreviewHistoryIndex - 1);
      if (webPreviewModal.copier) {
        fetchRemotePage(webPreviewModal.copier.agent_uid, webPreviewModal.copier.ip, prevPath);
      }
    }
  }, [webPreviewHistoryIndex, webPreviewHistory, webPreviewModal, fetchRemotePage]);

  const handleHistoryForward = useCallback(() => {
    if (webPreviewHistoryIndex < webPreviewHistory.length - 1) {
      const nextPath = webPreviewHistory[webPreviewHistoryIndex + 1];
      setWebPreviewHistoryIndex(webPreviewHistoryIndex + 1);
      if (webPreviewModal.copier) {
        fetchRemotePage(webPreviewModal.copier.agent_uid, webPreviewModal.copier.ip, nextPath);
      }
    }
  }, [webPreviewHistoryIndex, webPreviewHistory, webPreviewModal, fetchRemotePage]);

  const handleRemoteInstallDriver = (printerId: string, copier: any, defaultTargetAgentUid: string) => {
    setInstallDriverModal({
      isOpen: true,
      printerId: String(printerId),
      copier,
      targetAgentUid: defaultTargetAgentUid,
      status: '',
      error: ''
    });
  };

  const executeRemoteInstallDriver = async () => {
    if (!installDriverModal.copier || !installDriverModal.targetAgentUid) return;
    const { printerId, copier, targetAgentUid } = installDriverModal;
    setInstallDriverModal((p) => ({ ...p, status: '⌛ Đang gửi lệnh cài đặt Driver tới Agent...', error: '' }));
    if (showToast) showToast('Đang tạo lệnh tải và cài đặt Driver máy in tự động...', 'info', 3000);

    try {
      const res = await installDriverOnAgent(targetAgentUid, copier.ip, copier.printer_name || copier.name || 'Printer', copier.printer_type || copier.brand || '');
      if (!res.ok || !res.command_id) throw new Error(res.error || 'Không thể tạo lệnh cài driver');

      setInstallDriverModal((p) => ({ ...p, status: '⌛ Agent đang tải gói Driver và tiến hành Silent Install...' }));
      if (pollCommandStatus) {
        pollCommandStatus(
          res.command_id,
          `install_driver_${printerId}`,
          (_pollData: any) => {
            if (showToast) showToast('✓ Đã cài đặt Driver máy in thành công lên máy Agent!', 'success', 5000);
            setInstallDriverModal((p) => ({ ...p, isOpen: false, status: '', error: '' }));
          },
          (errorMsg: any) => {
            if (showToast) showToast(`[-] Lỗi cài đặt Driver: ${errorMsg}`, 'error');
            setInstallDriverModal((p) => ({ ...p, status: '', error: errorMsg }));
          },
          '⏳ Agent đang cài đặt Driver vào hệ thống Windows...'
        );
      }
    } catch (err: any) {
      setInstallDriverModal((p) => ({ ...p, status: '', error: err.message || 'Lỗi không xác định' }));
      if (showToast) showToast(`Lỗi cài đặt Driver: ${err.message}`, 'error');
    }
  };

  return {
    webPreviewModal, setWebPreviewModal,
    webPreviewTab, setWebPreviewTab,
    webPreviewLoading, setWebPreviewLoading,
    webPreviewHistory, setWebPreviewHistory,
    webPreviewHistoryIndex, setWebPreviewHistoryIndex,
    showPreviewDetails, setShowPreviewDetails,
    previewBlobUrl, setPreviewBlobUrl,
    previewIframeRef, handleCloseWebPreview,
    fetchRemotePage, handleHistoryBack, handleHistoryForward,
    installDriverModal, setInstallDriverModal,
    handleRemoteInstallDriver, executeRemoteInstallDriver
  };
};
