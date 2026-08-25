// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styles } from '../AgentStyles';
import { GlowCard } from '../../../components/ui/GlowCard';
import { ScanDestinations } from './ScanDestinations';
import { fetchApi, triggerAgentUtilityExec } from '../../../api/mockAgentApi';

export interface CopierItemProps {
  handleRefetchAddressBook: (pTarget: any) => void;
  expandedDrivers: Record<string, boolean>;
  setExpandedDrivers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  expandedDriverMenus: Record<string, boolean>;
  setExpandedDriverMenus: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleRemoteInstallDriver: (printerId: string, brand: string, model: string, drName: string, drUrl: string) => void;
  setPublicFtpData: React.Dispatch<React.SetStateAction<any>>;

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
  handleDeleteDest,

  handleRefetchAddressBook,
  expandedDrivers,
  setExpandedDrivers,
  expandedDriverMenus,
  setExpandedDriverMenus,
  handleRemoteInstallDriver,
  setPublicFtpData,
}: CopierItemProps) {
  const [localSync, setLocalSync] = React.useState<any>(null);
  const wasPendingRef = React.useRef(false);

  const fetchFreshSync = React.useCallback(async () => {
    try {
      const res = await fetchApi(`/api/lan-sites?t=${Date.now()}`);
      if (res && res.ok && Array.isArray(res.rows)) {
        const pMac = (p.mac_id || p.mac_address || p.mac || '').toUpperCase().replace(/[^0-9A-F]/g, '');
        for (const site of res.rows) {
          for (const item of (site.printers || [])) {
            const itemMac = (item.mac_id || item.mac_address || item.mac || '').toUpperCase().replace(/[^0-9A-F]/g, '');
            if (pMac && itemMac && pMac.length >= 10 && pMac === itemMac) {
              if (item.address_book_sync) {
                setLocalSync(item.address_book_sync);
              }
            }
          }
        }
      }
    } catch (e) {
      // Ignore sync error
    }
  }, [p.mac_id, p.mac_address]);

  const isPending = commandStatus[p.id]?.isPending || false;
  const statusMsg = commandStatus[p.id]?.message || '';

  React.useEffect(() => {
    if (isPending) {
      setLocalSync(null);
    }
    if (wasPendingRef.current && !isPending) {
      fetchFreshSync();
      const t1 = setTimeout(fetchFreshSync, 1500);
      const t2 = setTimeout(fetchFreshSync, 3500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    wasPendingRef.current = isPending;
  }, [isPending, fetchFreshSync]);

  const macKey = p.mac_address || '';
  const ipKey = p.ip || '';
  const idKey = String(p.id !== undefined && p.id !== null ? p.id : '');

  const cmdStatusObj = 
    (macKey && commandStatus?.[macKey]) ||
    (ipKey && commandStatus?.[ipKey]) ||
    (idKey && commandStatus?.[idKey]);

  const hasItems = (obj: any) => obj && ((Array.isArray(obj.address_list) && obj.address_list.length > 0) || (obj.address_book_data && Array.isArray(obj.address_book_data.address_list) && obj.address_book_data.address_list.length > 0));

  const activeSyncObj = 
    (hasItems(localSync) ? localSync : null) ||
    (hasItems(cmdStatusObj?.address_book_sync) ? cmdStatusObj.address_book_sync : null) ||
    (hasItems(cmdStatusObj) ? cmdStatusObj : null) ||
    (hasItems(sync) ? sync : null) ||
    localSync || cmdStatusObj?.address_book_sync || cmdStatusObj || sync || {};
  const hasDrivers = p.suggested_drivers && p.suggested_drivers.length > 0;
  const driversExpanded = expandedDrivers[p.id];
  const rawAddressList = (() => {
    if (Array.isArray(activeSyncObj?.address_list) && activeSyncObj.address_list.length > 0) return activeSyncObj.address_list;
    if (activeSyncObj?.address_book_data && Array.isArray(activeSyncObj.address_book_data.address_list)) return activeSyncObj.address_book_data.address_list;

    const candidates = [
      activeSyncObj,
      activeSyncObj?.result,
      activeSyncObj?.result_payload,
      activeSyncObj?.raw,
      cmdStatusObj?.result,
      cmdStatusObj?.result_payload,
      cmdStatusObj?.address_list,
      cmdStatusObj?.address_book_sync?.address_list,
    ];

    for (const cand of candidates) {
      if (!cand) continue;
      if (Array.isArray(cand)) return cand;
      if (typeof cand === 'object' && Array.isArray(cand.address_list)) return cand.address_list;
      if (typeof cand === 'string') {
        let cleanCand = cand.trim();
        if (cleanCand.includes('__ADDRESS_BOOK_JSON_START__')) {
          try {
            cleanCand = cleanCand.split('__ADDRESS_BOOK_JSON_START__')[1].split('__ADDRESS_BOOK_JSON_END__')[0].trim();
            cleanCand = cleanCand.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g, '').trim();
          } catch {}
        }
        try {
          const parsed = JSON.parse(cleanCand);
          if (parsed && Array.isArray(parsed.address_list)) return parsed.address_list;
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
    }
    return Array.isArray(activeSyncObj?.address_list) ? activeSyncObj.address_list : [];
  })();

  const realAddressList = rawAddressList.filter((entry: any) => {
    if (!entry || typeof entry !== 'object') return false;
    if (entry.type === 'Summary') return false;
    const name = (entry.name || '').trim();
    if (name === 'Summary' || name === 'Total' || name.startsWith('Users:')) return false;
    return Boolean(name || entry.entry_id || (entry.registration_no && entry.registration_no !== '-') || entry.email_address || entry.email || entry.folder || entry.physical_path);
  });

  const effectiveSync = {
    ...activeSyncObj,
    address_list: rawAddressList,
    status: rawAddressList.length > 0 ? 'success' : (activeSyncObj?.status || 'none'),
    timestamp: commandStatus?.[p.id]?.timestamp || activeSyncObj?.timestamp || new Date().toISOString(),
  };

  const effectiveHasAddressList = realAddressList.length > 0 || hasAddressList;
  const syncCount = realAddressList.length;
  const syncTime = effectiveSync.timestamp ? new Date(effectiveSync.timestamp).toLocaleTimeString('vi-VN') : '';
  const handleChangeFtp = React.useCallback(async (printer: any, entry: any) => {
    const brand = detectBrand(printer.printer_name || printer.name || "");
    if (brand !== 'ricoh' && brand !== 'toshiba') {
      showToast('Thiết bị không hỗ trợ thay đổi FTP', 'error');
      return;
    }

    const cmdName = brand === 'ricoh' ? 'ricoh_change_ftp' : 'toshiba_change_ftp';
    const agent = selectedLan?.agents?.find((a: any) => a.is_agent_active) || selectedLan?.agents?.[0];
    const currentIp = agent?.local_ip || agent?.ip || "";
    if (!currentIp) {
      showToast('Không tìm thấy IP của Agent để cập nhật', 'error');
      return;
    }

    const currentFolder = entry.folder || entry.physical_path || entry.folder_path || '';
    const ftpMatch = currentFolder.match(/ftp:\/\/([^:/]+)/);
    const smbMatch = currentFolder.match(/^\\\\([^\\]+)/);
    const ricohMatch = currentFolder.match(/^([^:/]+):/);
    let prevIp = '';
    if (ftpMatch) {
      prevIp = ftpMatch[1];
    } else if (smbMatch) {
      prevIp = smbMatch[1];
    } else if (ricohMatch) {
      prevIp = ricohMatch[1];
    }

    if (!prevIp) {
      prevIp = currentIp;
    }

    const targetId = entry.registration_no || entry.id || "";
    const targetName = entry.name || entry.username || entry.display_name || "";
    const printerIp = printer.ip || printer.printer_ip || "";

    showToast(`Đang truy vấn tài khoản VPS cho ${entry.name}...`, 'info');

    let authUser = printer.auth_user || printer.username || "";
    let authPass = printer.auth_password || printer.password || "";

    try {
      const resCreds = await fetchApi(`/api/devices/credentials-map?t=${Date.now()}`);
      if (resCreds && resCreds.ok && resCreds.credentials) {
        const macKey = (printer.mac_id || printer.mac_address || '').toUpperCase().replace(/[^0-9A-F:]/g, '');
        const normMacKey = macKey.replace(/[:-]/g, '');
        const ipKey = printerIp;
        const matched = (macKey && resCreds.credentials[macKey]) || (normMacKey && resCreds.credentials[normMacKey]) || (ipKey && resCreds.credentials[ipKey]);
        if (matched) {
          authUser = matched.user || matched.auth_user || authUser;
          authPass = matched.password || matched.auth_password || authPass;
        }
      }
    } catch (e) {}

    if (!authUser) {
      showToast(`⚠️ Chưa có Tài khoản Web máy in (admin) trong bảng PrinterAuthCredential trên VPS!`, 'error');
      return;
    }

    try {
      const res = await triggerAgentUtilityExec(selectedAgentUid, cmdName, "", {
        printer_ip: printerIp,
        auth_user: authUser,
        auth_password: authPass,
        target_id: targetId,
        target_name: targetName,
        old_ip: prevIp,
        new_ip: currentIp
      });

      if (res && res.ok) {
        showToast(`Cập nhật FTP cho ${entry.name} thành công!`, 'success');
      } else {
        showToast(`Lỗi: ${res?.error || 'Không thể chạy lệnh'}`, 'error');
      }
    } catch (err: any) {
      showToast(`Lỗi gửi lệnh: ${err?.message || err}`, 'error');
    }
  }, [selectedAgentUid, selectedLan, detectBrand, showToast]);

  return (
                          <div
                            key={p.id}
                            id={`copier-card-${p.id}`}
                            onClick={() => handleCopierClick(String(p.id))}
                            style={{ width: '100%' }}
                          >
                            <GlowCard>
                            {/* Header details */}
                            <div style={styles.cardHeader}>
                              <div>
                                <span style={styles.copierTitle}>
                                  🖨️ {(() => {
                                    if (p.printer_name && p.printer_name.trim()) return p.printer_name.trim();
                                    const cleanMac = (p.mac_id || "").replace(/-/g, ":").toUpperCase();
                                    if (cleanMac.startsWith("58:38:79") || cleanMac.startsWith("00:26:73")) return "Thiết bị Ricoh (Đang thám dò...)";
                                    if (cleanMac.startsWith("00:80:91")) return "Thiết bị Toshiba (Đang thám dò...)";
                                    if (cleanMac.startsWith("00:11:22")) return "Thiết bị HP (Đang thám dò...)";
                                    return "Thiết bị Photocopy (Đang thám dò...)";
                                  })()}
                                </span>
                                <div style={styles.copierSubtitle}>
                                  IP: {p.ip} · MAC: {p.mac_id || '—'}
                                  {p.agent_uid && (
                                    <span style={{ marginLeft: '12px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 600 }}>
                                      📡 Agent: <strong>{p.agent_uid}</strong>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span
                                style={{
                                  ...styles.statusBadge,
                                  color: !p.probed ? '#ffa502' : (p.is_online ? 'var(--color-status-online)' : 'var(--color-status-offline)'),
                                  borderColor: !p.probed ? '#ffa502' : (p.is_online ? 'var(--color-status-online)' : 'var(--color-status-offline)'),
                                  background: !p.probed ? 'rgba(255, 165, 2, 0.08)' : (p.is_online ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 68, 102, 0.08)'),
                                }}
                              >
                                {!p.probed ? '⏳ ĐANG XÁC ĐỊNH...' : (p.is_online ? 'ONLINE' : 'OFFLINE')}
                              </span>
                            </div>
  
                            {/* Connection Credentials Form */}
                            <div style={styles.sectionBlock}>
                              <span style={styles.sectionBlockTitle}>🔐 Tài khoản Web máy in:</span>
                              <div style={styles.credsInputRow}>
                                <input
                                  type="text"
                                  style={styles.credsInput}
                                  placeholder="admin"
                                  autoComplete="new-password"
                                  name={`printer_user_${p.id}`}
                                  value={copierCredentials[p.id]?.user || ''}
                                  onChange={(e) =>
                                    setCopierCredentials((prev) => ({
                                      ...prev,
                                      [p.id]: { ...prev[p.id], user: e.target.value },
                                    }))
                                  }
                                />
                                <input
                                  type="password"
                                  style={styles.credsInput}
                                  placeholder="mật khẩu"
                                  autoComplete="new-password"
                                  name={`printer_pass_${p.id}`}
                                  value={copierCredentials[p.id]?.pass || ''}
                                  onChange={(e) =>
                                    setCopierCredentials((prev) => ({
                                      ...prev,
                                      [p.id]: { ...prev[p.id], pass: e.target.value },
                                    }))
                                  }
                                />
                                <button
                                  style={{ ...styles.smallBtn, padding: '8px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                  onClick={() => handleSaveAuth(p)}
                                  disabled={saveAuthLoading[p.id]}
                                >
                                  {saveAuthLoading[p.id] ? 'Lưu...' : 'Lưu Auth'}
                                </button>
                              </div>
                            </div>
  
                            {/* Relay Target Agent selector - Temporarily hidden per user request */}
                            {/*
                            <div style={styles.detailRow}>
                              <span style={styles.detailLabel}>Target Agent:</span>
                              <select
                                style={styles.relaySelect}
                                value={selectedAgentUid}
                                onChange={(e) =>
                                  setSelectedTargetAgents((prev) => ({ ...prev, [p.id]: e.target.value }))
                                }
                              >
                                {onlineAgents.length === 0 ? (
                                  <option value="">(Không có Agent online)</option>
                                ) : (
                                  onlineAgents.map((a) => (
                                    <option key={a.agent_uid} value={a.agent_uid}>
                                      {a.hostname} ({a.local_ip})
                                    </option>
                                  ))
                                )}
                              </select>
                            </div>
                            */}
  
                            {/* Sync Status Box */}
                                                        {/* Sync Status & Address Book Panel */}
                            <div
                              style={{
                                ...styles.syncStatusBox,
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                gap: '10px',
                                background:
                                  sync.status === 'success'
                                    ? 'rgba(0, 255, 136, 0.05)'
                                    : sync.status === 'error'
                                    ? 'rgba(255, 68, 102, 0.05)'
                                    : 'var(--color-inset-bg)',
                                borderColor:
                                  sync.status === 'success'
                                    ? 'rgba(0, 255, 136, 0.15)'
                                    : sync.status === 'error'
                                    ? 'rgba(255, 68, 102, 0.15)'
                                    : 'var(--color-surface-light)',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <span style={styles.syncStatusTitle}>Trạng thái đồng bộ danh bạ:</span>
                                     {isPending ? (
                                       <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>{statusMsg}</span>
                                     ) : effectiveHasAddressList ? (
                                       <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                                         ✔ Đồng bộ OK ({syncCount} mục) {syncTime ? ` • ${syncTime}` : ''}
                                       </span>
                                     ) : sync.status === 'error' ? (
                                       <span style={{ color: 'var(--color-error)' }}>
                                         ❌ Lỗi: {sync.error} {syncTime ? `(${syncTime})` : ''}
                                       </span>
                                     ) : (
                                       <span style={{ color: 'var(--color-text-secondary)' }}>Chưa có thông tin danh bạ</span>
                                     )}
                                   </div>

                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    style={{ ...styles.smallBtn, padding: '6px 10px', fontSize: '0.75rem', height: 'auto' }}
                                    onClick={async () => {
                                      handleRefetchAddressBook(p);
                                      setTimeout(fetchFreshSync, 2000);
                                      setTimeout(fetchFreshSync, 4500);
                                    }}
                                    disabled={isPending || onlineAgents.length === 0}
                                  >
                                    🔄 {effectiveSync.status === 'success' ? 'Cập nhật' : 'Đồng bộ'}
                                  </button>
                                </div>
                              </div>

                              {/* Embedded Scan Destinations list */}
                              {effectiveHasAddressList && (
                                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
                                  <ScanDestinations
                                    hasAddressList={effectiveHasAddressList}
                                    sync={effectiveSync}
                                    p={p}
                                    commandStatus={commandStatus}
                                    getDestinationStatus={getDestinationStatus}
                                    selectedLan={selectedLan}
                                    handleOpenStorageFiles={handleOpenStorageFiles}
                                    handleEditIP={handleEditIP}
                                    handleDeleteDest={handleDeleteDest}
                                    handleChangeFtp={handleChangeFtp}
                                  />
                                </div>
                              )}
                            </div>
  
                            {/* Suggested Drivers Block */}
                            {hasDrivers && (
                              <div style={{ marginTop: '8px' }}>
                                <button
                                  style={styles.expandSubBtn}
                                  onClick={() =>
                                    setExpandedDrivers((prev) => ({ ...prev, [p.id]: !driversExpanded }))
                                  }
                                >
                                  {driversExpanded ? '▲ Ẩn driver đề xuất' : '▼ Xem driver đề xuất từ catalog'}
                                </button>
  
                                <AnimatePresence>
                                  {driversExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      style={{ overflow: 'hidden', marginTop: '6px' }}
                                    >
                                      <div style={styles.suggestedDriverBlock}>
                                        {p.suggested_drivers.map((sd: any, idx: number) => {
                                          const brandColor =
                                            sd.brand === 'ricoh'
                                              ? 'var(--color-primary)'
                                              : sd.brand === 'toshiba'
                                              ? 'var(--color-error)'
                                              : 'var(--color-success)';
                                          const sdMenuKey = `${p.id}-${idx}`;
                                          const isMenuOpen = expandedDriverMenus[sdMenuKey] || false;
  return (
                                            <div key={idx} style={styles.driverSuggestionItem}>
                                              <div
                                                style={styles.driverModelHeader}
                                                onClick={() =>
                                                  setExpandedDriverMenus((prev) => ({
                                                    ...prev,
                                                    [sdMenuKey]: !isMenuOpen,
                                                  }))
                                                }
                                              >
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                                  <span
                                                    style={{
                                                      display: 'inline-block',
                                                      width: '6px',
                                                      height: '6px',
                                                      borderRadius: '50%',
                                                      backgroundColor: brandColor,
                                                      marginRight: '6px',
                                                    }}
                                                  />
                                                  {sd.brand.toUpperCase()} - {sd.model}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>
                                                  {isMenuOpen ? '▲' : '▼'}
                                                </span>
                                              </div>
  
                                              {isMenuOpen && (
                                                <div style={styles.driverOptionsList}>
                                                  {sd.drivers && sd.drivers.length > 0 ? (
                                                    sd.drivers.map((drv: any, dIdx: number) => (
                                                      <div key={dIdx} style={styles.driverFileRow}>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                          <div style={styles.driverFileName}>{drv.name}</div>
                                                          <div style={styles.driverFileUrl} title={drv.url}>
                                                            {drv.url.split('/').pop()}
                                                          </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '4px' }}>

                                                          <button
                                                            style={{ ...styles.smallBtn, padding: '4px 8px', fontSize: '0.7rem' }}
                                                            onClick={() =>
                                                              handleRemoteInstallDriver(
                                                                p.mac_id || p.mac_address || p.ip || p.id,
                                                                sd.brand,
                                                                sd.model,
                                                                drv.name,
                                                                drv.url
                                                              )
                                                            }
                                                            disabled={onlineAgents.length === 0}
                                                          >
                                                            Cài đặt
                                                          </button>
                                                        </div>
                                                      </div>
                                                    ))
                                                  ) : (
                                                    <div style={styles.emptySubText}>Không tìm thấy driver nào.</div>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
  
                            {/* Top Action buttons */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                              <button
                                style={{ ...styles.smallBtn, flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px', display: 'flex', alignItems: 'center' }}
                                onClick={() => {
                                  setPublicFtpData({ printerId: p.id, name: '', email: '', agentUid: selectedAgentUid });
                                  setActiveModal('public_ftp');
                                }}
                                disabled={onlineAgents.length === 0}
                              >
                                ➕ Tạo điểm scan
                              </button>
  
                              <button
                                style={{ ...styles.smallBtn, flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px', display: 'flex', alignItems: 'center', borderColor: '#3b82f6', color: '#3b82f6' }}
                                onClick={() => {
                                  const targetAgent = selectedAgentUid || p.agent_uid || activeAgentUid || (selectedLan?.agents?.[0]?.agent_uid) || '';
                                  if (!targetAgent) {
                                    showToast('Không tìm thấy Agent nào trong dải mạng LAN này', 'error');
                                    return;
                                  }
                                  fetchRemotePage(targetAgent, p.ip, '/');
                                }}
                                disabled={!selectedLan || !selectedLan.agents || selectedLan.agents.length === 0}
                                title="Xem trực tiếp trang quản trị Web Setting (Port 80)"
                              >
                                🌐 Web setting
                              </button>
  
                              <button
                                style={{ ...styles.smallBtn, flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px', display: 'flex', alignItems: 'center', borderColor: '#ef4444', color: '#ef4444' }}
                                onClick={() => {
                                  setRemoteLockPrinter({ ip: p.ip, name: p.name || p.printer_name || p.ip, id: p.id, agentUid: selectedAgentUid });
                                  setActiveModal('remote_lock');
                                }}
                                disabled={onlineAgents.length === 0}
                              >
                                🔒 Khóa máy từ xa
                              </button>
  
                              {detectBrand(p.name || p.printer_name || p.ip) === 'ricoh' && (p.name || p.printer_name || '').toLowerCase().includes('6503') && (
                                <button
                                  style={{ ...styles.smallBtn, flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px', display: 'flex', alignItems: 'center', borderColor: '#34d399', color: '#34d399', opacity: 0.5, cursor: 'not-allowed' }}
                                  onClick={() => showToast('Tính năng này đang được khóa', 'info')}
                                  disabled={true}
                                  title="Tính năng đang khóa"
                                >
                                  🔒 Remote Panel
                                </button>
                              )}
  
                              {detectBrand(p.name || p.printer_name || p.ip) === 'toshiba' && (
                                <button
                                  style={{ ...styles.smallBtn, flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px', display: 'flex', alignItems: 'center', borderColor: '#a78bfa', color: '#a78bfa', opacity: 0.5, cursor: 'not-allowed' }}
                                  onClick={() => showToast('Tính năng này đang được khóa', 'info')}
                                  disabled={true}
                                  title="Tính năng đang khóa"
                                >
                                  🔒 VNC Remote
                                </button>
                              )}
                            </div>
  
                          </GlowCard>
                        </div>
  );
}
