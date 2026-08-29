// @ts-nocheck
import { useCallback } from 'react';
import { installDriverOnAgent, getCommandStatus } from '../../../api/mockAgentApi';

export function useAgentDriverInstall({ showToast, replaceToast }: any = {}) {
  const notifyToast = useCallback((msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    if (typeof replaceToast === 'function') {
      try {
        replaceToast('driver-install-progress', msg, type);
        return;
      } catch (e) {}
    }
    if (typeof showToast === 'function') {
      showToast(msg, type, 5000);
    }
  }, [showToast, replaceToast]);

  const executeRemoteInstallDriver = useCallback(async (
    printerId: string,
    brand: string,
    model: string,
    drName: string,
    drUrl: string,
    agentUid: string
  ) => {
    notifyToast(`⏳ [${agentUid}] Đang gửi lệnh cài đặt driver (${drName || model})...`, 'info');
    try {
      const res = await installDriverOnAgent(printerId, brand, model, drName, drUrl, agentUid);
      if (!res.ok) throw new Error(res.error || 'Server trả về lỗi');

      const commandId = res.command_id;
      if (!commandId) {
        notifyToast(`✅ [${agentUid}] Đã gửi lệnh cài đặt driver thành công.`, 'success');
        return;
      }

      // Poll for progress — driver install can take up to 5 minutes
      const maxPollMs = 300000;
      const pollInterval = 2000;
      const startTime = Date.now();
      let lastProgressText = '';

      const timer = setInterval(async () => {
        try {
          const elapsed = Date.now() - startTime;
          if (elapsed > maxPollMs) {
            clearInterval(timer);
            notifyToast(`⏰ [${agentUid}] Quá thời gian chờ (5 phút).`, 'info');
            return;
          }

          const statusRes = await getCommandStatus(commandId);
          if (statusRes.status === 'success') {
            clearInterval(timer);
            notifyToast(`✅ [${agentUid}] Cài đặt driver thành công!`, 'success');
          } else if (statusRes.status === 'failed' || !statusRes.ok) {
            clearInterval(timer);
            notifyToast(`❌ [${agentUid}] Cài driver thất bại: ${statusRes.error || 'Lỗi không xác định'}`, 'error');
          } else {
            const progressText = statusRes.progress_text || '';
            if (progressText && progressText !== lastProgressText) {
              lastProgressText = progressText;
              notifyToast(`⏳ [${agentUid}] ${progressText}`, 'info');
            } else if (!progressText) {
              const elapsedSec = Math.round(elapsed / 1000);
              notifyToast(`⚡ [${agentUid}] Đang tiến hành cài đặt... (${elapsedSec}s)`, 'info');
            }
          }
        } catch (pollErr) {
          // Silently continue polling on network errors
        }
      }, pollInterval);
    } catch (err: any) {
      notifyToast(`❌ Lỗi cài đặt driver: ${err.message || err}`, 'error');
    }
  }, [notifyToast]);

  return { executeRemoteInstallDriver };
}
