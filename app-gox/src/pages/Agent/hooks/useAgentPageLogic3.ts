// @ts-nocheck
import { addEmailDestination, addPrivateLanEmail, deleteEmailDestination, deleteLanEmail, deleteScanPoint, getAgentSettings, getAgentUtilityCommands, getCommandStatus, getJobs, getLanSites, getScansFiles, installDriverOnAgent, modifyDeviceAddress, saveCopierCredentials, triggerAgentUtility, triggerAgentUtilityExec, triggerEmergencyRestart, triggerFetchAddressBook, updateAgentSettings } from '../../../api/mockAgentApi';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AgentApi } from '../../../api/AgentApi';
const BASE_URL = import.meta.env.VITE_API_URL || 'https://agentapi.quanlymay.com';


// Helpers for Destination Status
function getDestinationStatusHtml(entry: any, emails: any[], agents: any[]) {
  const emailVal = entry.email_address || entry.email || '';
  const folderVal = entry.physical_path || entry.folder || entry.folder_path || '';
  const addressValue = (emailVal || folderVal || '').trim();
  
  if (!addressValue) {
    return { label: 'UNKNOWN', type: 'error', title: '' };
  }
  
  const isEmail = entry.type === 'Email' || emailVal.includes('@');
  if (isEmail) {
    return { label: '✔ ACTIVE', type: 'success', title: '' };
  }

  const matchedEmail = (emails || []).find((e: any) => (e.email || '').toLowerCase().trim() === addressValue.toLowerCase().trim());
  const portNumber = matchedEmail ? matchedEmail.email_number : Number(entry.registration_no);

  if (!portNumber || isNaN(portNumber)) {
    return { label: '✔ ACTIVE', type: 'success', title: '' };
  }

  const masterAgent = (agents || []).find((a: any) => a.is_master && a.is_agent_active) || (agents || []).find((a: any) => a.is_agent_active) || (agents || [])[0];
  if (masterAgent) {
    const site = (masterAgent.ftp_sites || []).find((s: any) => Number(s.port) === Number(portNumber));
    if (site) {
      const expectedPath = ('C:/Scangox/' + addressValue).toLowerCase().replace(/\\/g, '/');
      const actualPath = (site.path || '').toLowerCase().replace(/\\/g, '/');
      const isCorrectPath = actualPath === expectedPath;

      if (site.running && isCorrectPath) {
        return { label: '✔ OK', type: 'success', title: '' };
      } else if (site.running && !isCorrectPath) {
        return { label: '⚠ CONFLICT', type: 'warning', title: `FTP site uses folder: ${site.path} instead of expected: C:/Scangox/${addressValue}` };
      } else if (site.error && (site.error.toLowerCase().includes('in use') || site.error.toLowerCase().includes('busy') || site.error.toLowerCase().includes('already bound') || site.error.toLowerCase().includes('already in use'))) {
        return { label: '❌ PORT BUSY', type: 'error', title: site.error };
      } else {
        return { label: '❌ FAILED', type: 'error', title: site.error || 'FTP site failed to start' };
      }
    } else {
      return { label: 'PENDING SETUP', type: 'warning', title: '' };
    }
  } else {
    return { label: 'OFFLINE', type: 'neutral', title: '' };
  }
}

function safePathToken(value: string): string {
  const text = (value || '').trim();
  if (!text) return 'unknown';
  const ascii = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._@-]/g, '-').replace(/^[\s\-_.]+|[\s\-_.]+$\//g, '');
  return ascii || 'unknown';
}

export const useAgentPageLogic3 = (deps: any = {}) => {
  const { activeAgentUid, cameras, deleteScanPointModal, editIpModalData, fetchLanSitesData, getTargetAgentUid, isDuplicatePending, pollCommandStatus, queryDuration, queryTimestamp, replaceToast, selectedCamera, selectedLan, setActiveModal, setDeleteScanPointModal, setEditIpModalData, setInstallDriverModal, setLiveAddressBooks, setQueriedVideoUrl, setQueryDuration, setQueryTimestamp, setQueryVideoLoading, setStorageFiles, setStorageLoading, setStorageModalData, showToast } = deps;
  const handleQueryVideo = async (agentUid: string, cameraId: number, customTimestamp?: string, customDuration?: number) => {
    const ts = customTimestamp || queryTimestamp;
    const dur = customDuration || queryDuration;
    if (!ts) return;

    const cameraName = cameras.find((c: any) => c.id === cameraId)?.name || '';
    const isDup = await isDuplicatePending(agentUid, 'trigger_utility', {
      action: 'query_camera_video',
      camera_name: cameraName,
      timestamp: ts,
      duration: dur
    });
    if (isDup) {
      showToast('Yêu cầu truy xuất đoạn video này đang chờ phản hồi từ Agent!', 'info');
      return;
    }

    setQueryVideoLoading(true);
    setQueriedVideoUrl('');
    try {
      const response = await fetch(`${BASE_URL}/api/agents/${agentUid}/cameras/${cameraId}/query-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: ts, duration: dur })
      });
      const data = await response.json();
      if (data.ok) {
        const cleanTs = ts.replace(/[- :]/g, '');
        const formattedTs = cleanTs.substring(0, 8) + '_' + cleanTs.substring(8, 14);
        setQueriedVideoUrl(`clip_${selectedCamera.camera_name}_${formattedTs}.mp4`);
      } else {
        showToast('Không truy xuất được video: ' + data.error, 'error');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối render: ' + err.message, 'error');
    } finally {
      setQueryVideoLoading(false);
    }
  };

  const handlePlaySegmentFile = (filename: string) => {
    const match = filename.match(/_(\d{8}_\d{6})\.mp4$/);
    if (match) {
      const rawTs = match[1]; // e.g. 20260704_043000
      const formattedTs = `${rawTs.substring(0, 4)}-${rawTs.substring(4, 6)}-${rawTs.substring(6, 8)} ${rawTs.substring(9, 11)}:${rawTs.substring(11, 13)}:${rawTs.substring(13, 15)}`;
      
      setQueryTimestamp(formattedTs);
      setQueryDuration(60);
      
      handleQueryVideo(activeAgentUid, selectedCamera.id, formattedTs, 60);
      
      setTimeout(() => {
        document.getElementById('video-playback-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      showToast('Không parse được thời gian từ tên tệp', 'error');
    }
  };

  // ── DELETE DESTINATION ──
  const handleDeleteDest = (printerId: string, entry: any) => {
    const targetAgent = getTargetAgentUid(printerId) || (selectedLan?.agents?.find((a) => a.is_agent_active)?.agent_uid || '');
    setDeleteScanPointModal({
      isOpen: true,
      printerId,
      entry,
      agentUid: targetAgent,
    });
  };

  const handleConfirmDeleteScanPoint = async () => {
    const { printerId, entry, agentUid } = deleteScanPointModal;
    if (!printerId || !entry) return;

    setDeleteScanPointModal((p) => ({ ...p, isOpen: false }));

    const emailVal = entry.email_address || entry.email || '';
    const folderVal = entry.physical_path || entry.folder || entry.folder_path || '';
    const destVal = (emailVal || folderVal || '').trim();
    const regNo = String(entry.registration_no || '').trim();

    // Checking if it is a private LAN email
    const emailsList = selectedLan?.emails || [];
    const matchedEmail = emailsList.find((e) => e.email.toLowerCase().trim() === destVal.toLowerCase().trim());
    
    if (matchedEmail && matchedEmail.id) {
      // Direct deletion from LAN Emails
      showToast('Đang xóa điểm scan private khỏi LAN...', 'info', 3000);
      try {
        const res = await deleteLanEmail(matchedEmail.id);
        if (res.ok) {
          showToast('Đã xóa thành công!', 'success');
          await fetchLanSitesData();
        } else {
          throw new Error(res.error || 'Không thể xóa');
        }
      } catch (err: any) {
        showToast(`Lỗi xóa: ${err.message}`, 'error');
      }
      return;
    }

    // Copier Address Book entry deletion (requires command status polling)
    showToast('Gửi lệnh xóa điểm scan trên máy photocopy...', 'info', 3000);

    try {
      const res = await deleteScanPoint(printerId, regNo, entry.entry_id || '', agentUid || undefined);
      if (!res.ok || !res.command_id) {
        throw new Error(res.error || 'Không thể tạo lệnh xóa');
      }

      pollCommandStatus(
        res.command_id,
        printerId,
        async (pollData: any) => {
          showToast(`Đã xóa đăng ký #${regNo} thành công!`, 'success');
          await fetchLanSitesData();
          if (pollData && pollData.address_book_sync) {
            setLiveAddressBooks((prev) => ({ ...prev, [printerId]: pollData.address_book_sync }));
          }
        },
        (errorMsg) => {
          showToast(`Lỗi xóa điểm scan: ${errorMsg}`, 'error');
        },
        `⌛ Đang xóa điểm scan #${regNo}...`
      );
    } catch (err: any) {
      showToast(`Lỗi gửi lệnh xóa: ${err.message}`, 'error');
    }
  };

  const handleEditIP = (printerId: string, entry: any) => {
    const currentFolder = entry.folder || entry.physical_path || entry.folder_path || '';
    let currentIp = '';
    const ftpMatch = currentFolder.match(/ftp:\/\/([^:/]+)/);
    const smbMatch = currentFolder.match(/^\\\\([^\\]+)/);
    if (ftpMatch) {
      currentIp = ftpMatch[1];
    } else if (smbMatch) {
      currentIp = smbMatch[1];
    }

    setEditIpModalData({
      printerId,
      entry,
      currentIp,
      newIp: currentIp || '192.168.1.100'
    });
    setActiveModal('edit_ip');
  };

  const handleSaveEditIP = async () => {
    if (!editIpModalData) return;
    const { printerId, entry, newIp } = editIpModalData;
    const currentFolder = entry.folder || entry.physical_path || entry.folder_path || '';
    const ftpMatch = currentFolder.match(/ftp:\/\/([^:/]+)/);
    const smbMatch = currentFolder.match(/^\\\\([^\\]+)/);

    let newFolder = currentFolder;
    if (ftpMatch) {
      newFolder = currentFolder.replace(/ftp:\/\/([^:/]+)/, `ftp://${newIp}`);
    } else if (smbMatch) {
      newFolder = currentFolder.replace(/^\\\\([^\\]+)/, `\\\\${newIp}`);
    }

    const targetAgent = getTargetAgentUid(printerId);
    const regNo = entry.registration_no;

    setActiveModal(null);
    showToast('Gửi yêu cầu thay đổi IP của điểm scan...', 'info', 3000);

    try {
      const printer = selectedLan?.printers?.find((pr: any) => pr.id === Number(printerId));
      const copierIp = printer?.ip || '';

      const res = await modifyDeviceAddress({
        id: Number(printerId), // Pass printer ID to ensure correct database record selection
        ip: copierIp,
        action: 'address_modify',
        registration_no: regNo,
        name: entry.name,
        email: entry.email_address || entry.email || '',
        folder: newFolder,
        user_code: entry.user_code || '-',
        agent_uid: targetAgent || undefined,
        fields: {}
      });

      if (!res.ok || !res.command_id) {
        throw new Error(res.error || 'Không thể tạo lệnh thay đổi IP');
      }

      pollCommandStatus(
        res.command_id,
        printerId,
        async (pollData: any) => {
          showToast(`Đã thay đổi IP điểm scan #${regNo} thành công!`, 'success');
          await fetchLanSitesData();
          if (pollData && pollData.address_book_sync) {
            setLiveAddressBooks((prev) => ({ ...prev, [printerId]: pollData.address_book_sync }));
          }
        },
        (errorMsg) => {
          showToast(`Lỗi thay đổi IP: ${errorMsg}`, 'error');
        },
        `⌛ Đang cập nhật IP điểm scan #${regNo}...`
      );
    } catch (err: any) {
      showToast(`Lỗi gửi lệnh thay đổi IP: ${err.message}`, 'error');
    }
  };

  /*
  // ── DETAILED INFO ENTRY (INFOR) ──
  const handleFetchEntryDetail = async (printerId: string, entry: any) => {
    const regNo = String(entry.registration_no || '').trim();
    const targetAgent = getTargetAgentUid(printerId);
    
    // Key to show command status on the specific entry row
    const entryRowKey = `${printerId}-${regNo}`;
    showToast(`Đang truy vấn thông số chi tiết của điểm scan #${regNo}...`, 'info', 3000);

    try {
      const res = await triggerFetchAddressBook(printerId, targetAgent || undefined);
      if (!res.ok || !res.command_id) {
        throw new Error(res.error || 'Không thể gửi yêu cầu');
      }

      pollCommandStatus(
        res.command_id,
        entryRowKey,
        async (pollData) => {
          showToast('Đã tải thông số chi tiết!', 'success');
          await fetchLanSitesData();

          const syncData = pollData.address_book_sync || {};
          const matchedEntry = (syncData.address_list || []).find(
            (e: any) => String(e.registration_no).trim() === regNo
          );

          if (matchedEntry) {
            const folderStr = matchedEntry.folder_path || matchedEntry.folder || '';
            let details = null;

            if (folderStr) {
              let proto = '';
              let server = '';
              let port = '';
              let path = '';

              if (folderStr.startsWith('ftp://')) {
                proto = 'FTP';
                const match = folderStr.match(/ftp:\/\/([^:\/]+)(?::(\d+))?(.*)/);
                if (match) {
                  server = match[1];
                  port = match[2] || '21';
                  path = match[3] || '/';
                }
              } else if (folderStr.startsWith('\\\\')) {
                proto = 'SMB';
                const match = folderStr.match(/\\\\([^\\]+)\\(.*)/);
                if (match) {
                  server = match[1];
                  path = '\\' + match[2];
                  port = '445';
                } else {
                  server = folderStr.substring(2);
                  path = '\\';
                  port = '445';
                }
              } else {
                server = folderStr;
              }

              details = { proto, server, port, path };
            }

            setInfoDetailData({
              regNo,
              name: matchedEntry.name,
              details,
              error: details ? undefined : 'Không tìm thấy cấu hình thư mục scan.',
            });
          } else {
            setInfoDetailData({
              regNo,
              name: entry.name,
              details: null,
              error: 'Không tìm thấy chi tiết đăng ký trong danh bạ đồng bộ.',
            });
          }
          setActiveModal('info_detail');
        },
        (errorMsg) => {
          showToast(`Truy vấn thất bại: ${errorMsg}`, 'error');
        },
        '⌛ Đang lấy dữ liệu...'
      );
    } catch (err: any) {
      showToast(`Lỗi: ${err.message}`, 'error');
    }
  };
  */

  // ── STORAGE SCANS FILES LIST ──
  const handleOpenStorageFiles = async (lanUid: string, email: string) => {
    setStorageModalData({ lanUid, email });
    setStorageLoading(true);
    setStorageFiles([]);
    setActiveModal('storage');

    try {
      const res = await getScansFiles(lanUid, email);
      if (res.ok) {
        setStorageFiles(res.rows || []);
      } else {
        throw new Error(res.error || 'Lỗi server');
      }
    } catch (err: any) {
      showToast(`Không thể lấy tệp đã scan: ${err.message}`, 'error');
    } finally {
      setStorageLoading(false);
    }
  };

  // ── INSTALL DRIVER ON CLIENT PC ──
  const handleRemoteInstallDriver = (printerId: string, brand: string, model: string, drName: string, drUrl: string) => {
    const defaultAgent = getTargetAgentUid(printerId);
    setInstallDriverModal({
      isOpen: true,
      printerId,
      brand,
      model,
      driverName: drName,
      driverUrl: drUrl,
      selectedAgentUid: defaultAgent,
    });
  };

  const executeRemoteInstallDriver = async (printerId: string, brand: string, model: string, drName: string, drUrl: string, agentUid: string) => {
    const TOAST_ID = 'driver-install-progress';
    replaceToast(TOAST_ID, '⏳ Đang gửi lệnh cài đặt driver tới Agent...', 'info');
    try {
      const res = await installDriverOnAgent(printerId, brand, model, drName, drUrl, agentUid);
      if (!res.ok) throw new Error(res.error || 'Server trả về lỗi');

      const commandId = res.command_id;
      if (!commandId) {
        replaceToast(TOAST_ID, '✅ Đã gửi lệnh cài đặt driver.', 'success');
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
            replaceToast(TOAST_ID, '⏰ Quá thời gian chờ (5 phút). Kiểm tra trên PC đại diện.', 'info');
            return;
          }

          const statusRes = await getCommandStatus(commandId);
          if (statusRes.status === 'success') {
            clearInterval(timer);
            replaceToast(TOAST_ID, '✅ Cài đặt driver thành công!', 'success');
          } else if (statusRes.status === 'failed' || !statusRes.ok) {
            clearInterval(timer);
            replaceToast(TOAST_ID, `❌ Cài driver thất bại: ${statusRes.error || 'Lỗi không xác định'}`, 'error');
          } else {
            const progressText = statusRes.progress_text || '';
            if (progressText && progressText !== lastProgressText) {
              lastProgressText = progressText;
              replaceToast(TOAST_ID, progressText, 'info');
            } else if (!progressText) {
              const elapsedSec = Math.round(elapsed / 1000);
              if (statusRes.received_at) {
                replaceToast(TOAST_ID, `⚡ Agent đã nhận lệnh - đang cài đặt driver... (${elapsedSec}s)`, 'info');
              } else {
                replaceToast(TOAST_ID, `⌛ Đang chuyển lệnh tới Agent... (${elapsedSec}s)`, 'info');
              }
            }
          }
        } catch (pollErr) {
          // Silently continue polling on network errors
        }
      }, pollInterval);
    } catch (err: any) {
      replaceToast(TOAST_ID, `❌ Không thể cài driver: ${err.message}`, 'error');
    }
  };

  // Helpers
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getDestinationStatus = (entry: any) => {
    return getDestinationStatusHtml(
      entry,
      selectedLan?.emails || [],
      selectedLan?.agents || []
    );
  };


  return { activeAgentUid, cameras, deleteScanPointModal, editIpModalData, executeRemoteInstallDriver, fetchLanSitesData, formatBytes, getDestinationStatus, getTargetAgentUid, handleConfirmDeleteScanPoint, handleDeleteDest, handleEditIP, handleOpenStorageFiles, handlePlaySegmentFile, handleQueryVideo, handleRemoteInstallDriver, handleSaveEditIP, isDuplicatePending, pollCommandStatus, queryDuration, queryTimestamp, replaceToast, selectedCamera, selectedLan, setActiveModal, setDeleteScanPointModal, setEditIpModalData, setInstallDriverModal, setLiveAddressBooks, setQueriedVideoUrl, setQueryDuration, setQueryTimestamp, setQueryVideoLoading, setStorageFiles, setStorageLoading, setStorageModalData, showToast };
}