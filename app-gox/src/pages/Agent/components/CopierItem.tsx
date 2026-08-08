// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styles } from '../AgentStyles';
import { GlowCard } from '../../../components/ui/GlowCard';
import { ScanDestinations } from './ScanDestinations';

export interface CopierItemProps {
  handleRefetchAddressBook: (pId: string) => void;
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
  const hasDrivers = p.drivers && Object.keys(p.drivers).length > 0;
  const driversExpanded = expandedDrivers[p.id];
  const syncCount = sync.address_list ? sync.address_list.length : 0;
  const syncTime = sync.timestamp ? new Date(sync.timestamp).toLocaleTimeString('vi-VN') : '';
  const isPending = commandStatus[p.id]?.isPending || false;
  const statusMsg = commandStatus[p.id]?.message || '';

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
                                <div style={styles.copierSubtitle}>IP: {p.ip} · MAC: {p.mac_id || '—'}</div>
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
                                  <div style={styles.syncStatusText}>
                                    {isPending ? (
                                      <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>{statusMsg}</span>
                                    ) : hasAddressList ? (
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
                                </div>

                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    style={{ ...styles.smallBtn, padding: '6px 10px', fontSize: '0.75rem', height: 'auto' }}
                                    onClick={() => handleRefetchAddressBook(p.id)}
                                    disabled={isPending || onlineAgents.length === 0}
                                  >
                                    🔄 {sync.status === 'success' ? 'Cập nhật' : 'Đồng bộ'}
                                  </button>
                                </div>
                              </div>

                              {/* Embedded Scan Destinations list */}
                              {hasAddressList && (
                                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
                                  <ScanDestinations
                                    hasAddressList={hasAddressList}
                                    sync={sync}
                                    p={p}
                                    commandStatus={commandStatus}
                                    getDestinationStatus={getDestinationStatus}
                                    selectedLan={selectedLan}
                                    handleOpenStorageFiles={handleOpenStorageFiles}
                                    handleEditIP={handleEditIP}
                                    handleDeleteDest={handleDeleteDest}
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
                                                          <a
                                                            href={drv.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            style={styles.driverDownloadBtn}
                                                          >
                                                            Tải về
                                                          </a>
                                                          <button
                                                            style={{ ...styles.smallBtn, padding: '4px 8px', fontSize: '0.7rem' }}
                                                            onClick={() =>
                                                              handleRemoteInstallDriver(
                                                                p.id,
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
                                  fetchRemotePage(p.ip, '', 'GET', null, false, targetAgent, 80);
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
