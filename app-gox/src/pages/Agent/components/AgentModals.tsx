// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styles } from '../AgentPageStyles';
import { GlowCard } from '../../../components/ui/GlowCard';
import { AnimatedList } from '../../../components/ui/AnimatedList';
import { safePathToken } from '../utils/agentUtils';
import { CopierItem } from './CopierItem';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export function AgentModals(props: any) {
  const {
    AgentPage,
    activeLoadingFile,
    activeModal,
    activeTab,
    allocatedVncAddr,
    cameraFiles,
    cameraForm,
    cameraLogs,
    cameraStatus,
    cameraTestLoading,
    cameraTestResult,
    cameras,
    camerasLoading,
    commandStatus,
    confirmModal = { isOpen: false },
    copierCredentials,
    customRecordDuration,
    customRunCommand,
    deleteScanPointModal = { isOpen: false },
    directLan,
    editIpModalData = { isOpen: false },
    editableSettingsText,
    emailFileCounts,
    executeRemoteInstallDriver,
    expandedDriverMenus,
    expandedDrivers,
    expandedPrinters,
    fetchCameraFiles,
    fetchCameraStatus,
    fetchRemotePage,
    fetchRemotePageOld,
    formatBytes,
    formatJsonText,
    ftpDetailData,
    getDestinationStatus = () => ({ label: '✔ ACTIVE', type: 'success', title: '' }),
    getDestinationStatusHtml = () => ({ label: '✔ ACTIVE', type: 'success', title: '' }),
    getLiveQueryTimestamp,
    handleAddPrivateFtp,
    handleAddPublicFtp,
    handleCloseWebPreview,
    handleConfirmDeleteScanPoint,
    handleCopierClick,
    handleDeleteCamera,
    handleDeleteCameraFile,
    handleDeleteDest,
    handleEditIP,
    handleEmergencyRestart,
    handleFetchEntryDetail,
    handleHistoryBack,
    handleHistoryForward,
    handleOpenStorageFiles,
    handlePlaySegmentFile,
    handleQueryVideo,
    handleRecord30s,
    handleRefetchAddressBook,
    handleRemoteInstallDriver,
    handleSaveAuth,
    handleSaveCameraConfig,
    handleSaveEditIP,
    handleSaveSettings,
    handleStartToshibaVnc,
    handleTestCameraConnection,
    handleToggleDirectLan,
    handleToggleSetting,
    handleTriggerUtility,
    handleTriggerUtilityExec,
    handleViewScanPointsJson,
    installDriverModal = { isOpen: false },
    ipInputModal = { isOpen: false },
    isRecording30s,
    isSavingSettings,
    lanSites,
    lanSitesLoading,
    liveAddressBooks,
    lockAspect,
    modalContentRef,
    pollCommandStatus,
    previewBlobUrl,
    previewIframeRef,
    privateFtpData,
    privateFtpLoading,
    publicFtpData,
    publicFtpLoading,
    queriedVideoUrl,
    queryDuration,
    queryTimestamp,
    queryVideoLoading,
    recording30sCountdown,
    remoteLockPrinter,
    resolveRelativePath,
    saveAuthLoading,
    savedLocal,
    scaleX,
    scaleY,
    scanAutoOpenDir,
    scanAutoOpenFile,
    scanPointsViewerModal = { isOpen: false },
    selectedCamera,
    selectedCameraAgentUid,
    selectedLan,
    selectedLanUid,
    selectedTargetAgents,
    selectedUtilityAgent,
    setActiveLoadingFile,
    setActiveModal,
    setActiveTab,
    setAllocatedVncAddr,
    setCameraFiles,
    setCameraForm,
    setCameraLogs,
    setCameraStatus,
    setCameraTestLoading,
    setCameraTestResult,
    setCameras,
    setCamerasLoading,
    setCommandStatus,
    setConfirmModal,
    setCopierCredentials,
    setCustomRecordDuration,
    setCustomRunCommand,
    setDeleteScanPointModal,
    setDirectLan,
    setEditIpModalData,
    setEditableSettingsText,
    setEmailFileCounts,
    setExpandedDriverMenus,
    setExpandedDrivers,
    setExpandedPrinters,
    setFtpDetailData,
    setInstallDriverModal,
    setIpInputModal,
    setIsRecording30s,
    setIsSavingSettings,
    setLanSites,
    setLanSitesLoading,
    setLiveAddressBooks,
    setLockAspect,
    setPreviewBlobUrl,
    setPrivateFtpData,
    setPrivateFtpLoading,
    setPublicFtpData,
    setPublicFtpLoading,
    setQueriedVideoUrl,
    setQueryDuration,
    setQueryTimestamp,
    setQueryVideoLoading,
    setRecording30sCountdown,
    setRemoteLockPrinter,
    setSaveAuthLoading,
    setScaleX,
    setScaleY,
    setScanAutoOpenDir,
    setScanAutoOpenFile,
    setScanPointsViewerModal,
    setSelectedCamera,
    setSelectedCameraAgentUid,
    setSelectedLanUid,
    setSelectedTargetAgents,
    setSelectedUtilityAgent,
    setSettingsSaveStatus,
    setShowPreviewDetails,
    setShowSettings,
    setStorageFiles,
    setStorageLoading,
    setStorageModalData,
    setToasts,
    setToshibaVncData,
    setUtilityActionPending,
    setUtilityCommands,
    setUtilityCommandsLoading,
    setUtilitySettingsLoading,
    setUtilityStatusMsg,
    setViewOutputModal,
    setVncTunnelLoading,
    setWebPreviewHistory,
    setWebPreviewHistoryIndex,
    setWebPreviewLoading,
    setWebPreviewModal,
    setWebPreviewTab,
    settingsSaveStatus,
    showPreviewDetails,
    showSettings,
    showToast,
    storageFiles,
    storageLoading,
    storageModalData = { isOpen: false },
    toasts,
    toshibaVncData,
    utilityActionPending,
    utilityCommands,
    utilityCommandsLoading,
    utilitySettingsLoading,
    utilityStatusMsg,
    viewOutputModal = { isOpen: false },
    vncTunnelLoading,
    webPreviewHistory,
    webPreviewHistoryIndex,
    webPreviewLoading,
    webPreviewModal = { isOpen: false },
    webPreviewTab
  } = props;

  return (
    <>
      {/* AgentModals */}
      {/* ── MODALS IMPLEMENTATIONS ── */}
      <AnimatePresence>
        {activeModal && (
          <div style={styles.modalOverlay} onClick={() => setActiveModal(null)}>
            <motion.div
              style={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* 1. Storage files view modal */}
              {activeModal === 'storage' && (
                <>
                  <div style={styles.modalHeader}>
                    <div>
                      <h3 style={styles.modalTitle}>📁 Kho tệp tin đã scan</h3>
                      <div style={styles.modalSubtitle}>{storageModalData.email}</div>
                    </div>
                    <button style={styles.modalCloseBtn} onClick={() => setActiveModal(null)}>
                      &times;
                    </button>
                  </div>

                  <div style={styles.modalBody}>
                    {storageLoading ? (
                      <div style={styles.modalLoading}>
                        <LoadingSpinner size="md" />
                        <span style={{ marginTop: '8px', fontSize: '0.82rem' }}>Đang tải danh sách tệp tin từ VPS...</span>
                      </div>
                    ) : storageFiles.length === 0 ? (
                      <div style={styles.emptySubText}>Không tìm thấy tệp tin đã scan nào trong thư mục này.</div>
                    ) : (
                      <div style={styles.filesList}>
                        {storageFiles.map((f, idx) => (
                          <div key={idx} style={styles.fileItemRow}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <a
                                href={`${BASE_URL}${f.url}`}
                                target="_blank"
                                rel="noreferrer"
                                style={styles.fileLinkName}
                              >
                                {f.name}
                              </a>
                              <div style={styles.fileMetaDetails}>
                                Dung lượng: {formatBytes(f.size)} · Mtime: {new Date(f.mtime).toLocaleString('vi-VN')}
                              </div>
                              {f.upload_completed_at && (
                                <div style={styles.fileUploadMeta}>
                                  Tải lên VPS: {new Date(f.upload_completed_at).toLocaleTimeString('vi-VN')}
                                  {f.upload_duration != null ? ` (${f.upload_duration}s)` : ''}
                                </div>
                              )}
                            </div>
                            <a
                              href={`${BASE_URL}${f.url}`}
                              download
                              target="_blank"
                              rel="noreferrer"
                              style={styles.fileDownloadBtn}
                            >
                              Tải về
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.modalFooter}>
                    <button
                      style={{ ...styles.smallBtn, padding: '10px 16px', fontSize: '0.85rem' }}
                      onClick={() => handleOpenStorageFiles(storageModalData.lanUid, storageModalData.email)}
                    >
                      Làm mới danh sách
                    </button>
                    <button
                      style={{ ...styles.smallBtn, padding: '10px 16px', fontSize: '0.85rem', borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}
                      onClick={() => setActiveModal(null)}
                    >
                      Đóng
                    </button>
                  </div>
                </>
              )}

              {/* 2. Add Public FTP Modal */}
              {activeModal === 'public_ftp' && (
                <>
                  <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>➕ Tạo điểm scan</h3>
                    <button style={styles.modalCloseBtn} onClick={() => setActiveModal(null)}>
                      &times;
                    </button>
                  </div>

                  <div style={styles.modalBody}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Tên điểm scan *</label>
                      <input
                        type="text"
                        style={styles.modalInput}
                        placeholder="VD: scan, scan-tang1, van-phong..."
                        value={publicFtpData.name}
                        onChange={(e) => setPublicFtpData((p) => ({ ...p, name: e.target.value }))}
                      />
                      <span style={styles.formHelpText}>Tên hiển thị trên máy photocopy và tên thư mục lưu trữ FTP.</span>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Địa chỉ Email</label>
                      <input
                        type="email"
                        style={styles.modalInput}
                        placeholder="VD: goxprint@gmail.com"
                        value={publicFtpData.email}
                        onChange={(e) => setPublicFtpData((p) => ({ ...p, email: e.target.value }))}
                      />
                      <span style={styles.formHelpText}>Email dùng để lưu thông tin tham chiếu trong hệ thống (không bắt buộc).</span>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Relay Agent *</label>
                      <select
                        style={styles.modalInput}
                        value={publicFtpData.agentUid}
                        onChange={(e) => setPublicFtpData((p) => ({ ...p, agentUid: e.target.value }))}
                      >
                        {((selectedLan && selectedLan.agents) || [])
                          .filter((a) => a.is_agent_active)
                          .map((a) => (
                            <option key={a.agent_uid} value={a.agent_uid}>
                              {a.hostname} ({a.local_ip})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div style={styles.modalFooter}>
                    <button
                      style={{ ...styles.smallBtn, padding: '10px 16px', fontSize: '0.85rem' }}
                      onClick={handleAddPublicFtp}
                      disabled={publicFtpLoading}
                    >
                      {publicFtpLoading ? 'Đang tạo...' : 'Tạo điểm scan'}
                    </button>
                    <button
                      style={{ ...styles.smallBtn, padding: '10px 16px', fontSize: '0.85rem', borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}
                      onClick={() => setActiveModal(null)}
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </>
              )}

              {/* 3. Add Private FTP Modal */}
              {activeModal === 'private_ftp' && (
                <>
                  <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>➕ Thêm Private FTP</h3>
                    <button style={styles.modalCloseBtn} onClick={() => setActiveModal(null)}>
                      &times;
                    </button>
                  </div>

                  <div style={styles.modalBody}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Địa chỉ Email riêng *</label>
                      <input
                        type="email"
                        style={styles.modalInput}
                        placeholder="VD: user.pc1@gmail.com"
                        value={privateFtpData.email}
                        onChange={(e) => setPrivateFtpData((p) => ({ ...p, email: e.target.value }))}
                      />
                      <span style={styles.formHelpText}>Cấu hình FTP riêng cho máy tính {privateFtpData.agentUid}</span>
                    </div>
                  </div>

                  <div style={styles.modalFooter}>
                    <button
                      style={{ ...styles.smallBtn, padding: '10px 16px', fontSize: '0.85rem' }}
                      onClick={handleAddPrivateFtp}
                      disabled={privateFtpLoading}
                    >
                      {privateFtpLoading ? 'Đang tạo...' : 'Tạo FTP riêng'}
                    </button>
                    <button
                      style={{ ...styles.smallBtn, padding: '10px 16px', fontSize: '0.85rem', borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}
                      onClick={() => setActiveModal(null)}
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </>
              )}

              {/* 4. Info Detail modal */}
              {activeModal === 'info_detail' && (
                <>
                  <div style={styles.modalHeader}>
                    <div>
                      <h3 style={styles.modalTitle}>ℹ Chi tiết đăng ký điểm scan</h3>
                      <div style={styles.modalSubtitle}>Đăng ký: #{infoDetailData.regNo} · {infoDetailData.name}</div>
                    </div>
                    <button style={styles.modalCloseBtn} onClick={() => setActiveModal(null)}>
                      &times;
                    </button>
                  </div>

                  <div style={styles.modalBody}>
                    {infoDetailData.error ? (
                      <div style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{infoDetailData.error}</div>
                    ) : (
                      <div style={styles.modalDetailsList}>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Giao thức:</span>
                          <span style={{ ...styles.detailValue, fontWeight: 700, color: 'var(--color-primary)' }}>
                            {infoDetailData.details?.proto}
                          </span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Server Host:</span>
                          <span style={styles.detailValue}>{infoDetailData.details?.server}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Cổng Port:</span>
                          <span style={styles.detailValue}>{infoDetailData.details?.port}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Đường dẫn tệp:</span>
                          <span style={{ ...styles.detailValue, fontFamily: 'monospace' }}>{infoDetailData.details?.path}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.modalFooter}>
                    <button
                      style={{ ...styles.smallBtn, padding: '10px 16px', fontSize: '0.85rem' }}
                      onClick={() => setActiveModal(null)}
                    >
                      Đóng cửa sổ
                    </button>
                  </div>
                </>
              )}

              {/* 4.5. FTP Detail Modal */}
              {activeModal === 'ftp_detail' && ftpDetailData && (
                <>
                  <div style={styles.modalHeader}>
                    <div>
                      <h3 style={styles.modalTitle}>📂 Chi tiết dịch vụ FTP</h3>
                      <div style={styles.modalSubtitle}>Cổng Port: {ftpDetailData.port}</div>
                    </div>
                    <button
                      style={styles.modalCloseBtn}
                      onClick={() => {
                        setActiveModal(null);
                        setFtpDetailData(null);
                      }}
                    >
                      &times;
                    </button>
                  </div>

                  <div style={styles.modalBody}>
                    <div style={styles.modalDetailsList}>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Cổng Port:</span>
                        <span style={{ ...styles.detailValue, fontWeight: 700, color: 'var(--color-primary)' }}>
                          {ftpDetailData.port}
                        </span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Trạng thái:</span>
                        <span
                          style={{
                            ...styles.detailValue,
                            fontWeight: 700,
                            color: !ftpDetailData.error ? 'var(--color-success)' : 'var(--color-error)'
                          }}
                        >
                          {!ftpDetailData.error ? 'Đang hoạt động (RUNNING)' : 'Lỗi khởi chạy (ERROR)'}
                        </span>
                      </div>
                      {ftpDetailData.error && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Chi tiết lỗi:</span>
                          <span style={{ ...styles.detailValue, color: 'var(--color-error)' }}>
                            {ftpDetailData.error}
                          </span>
                        </div>
                      )}
                      <div style={{ marginTop: '12px' }}>
                        <span style={{ ...styles.detailLabel, display: 'block', marginBottom: '4px' }}>Thư mục lưu trữ:</span>
                        <div
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.72rem',
                            color: 'var(--color-text)',
                            background: 'var(--color-inset-bg)',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid var(--color-surface-light)',
                            wordBreak: 'break-all',
                            lineHeight: 1.4
                          }}
                        >
                          {ftpDetailData.path}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.modalFooter}>
                    <button
                      style={{ ...styles.smallBtn, padding: '10px 16px', fontSize: '0.85rem' }}
                      onClick={() => {
                        setActiveModal(null);
                        setFtpDetailData(null);
                      }}
                    >
                      Đóng cửa sổ
                    </button>
                  </div>
                </>
              )}

              {/* 4.6. Utilities Modal */}
              {activeModal === 'utilities' && selectedUtilityAgent && (
                <>
                  <div style={styles.modalHeader}>
                    <div>
                      <h3 style={styles.modalTitle}>🛠️ Công cụ & Tiện ích Agent</h3>
                      <div style={styles.modalSubtitle}>
                        Máy: {selectedUtilityAgent.hostname} · IP: {selectedUtilityAgent.local_ip}:{selectedUtilityAgent.web_port || 9173}
                      </div>
                    </div>
                    <button
                      style={styles.modalCloseBtn}
                      onClick={() => {
                        setActiveModal(null);
                        setSelectedUtilityAgent(null);
                        setUtilityStatusMsg(null);
                      }}
                    >
                      &times;
                    </button>
                  </div>

                  <div style={{ ...styles.modalBody, gap: '16px', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Status Alert block */}
                    {utilityStatusMsg && (
                      <div
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          lineHeight: 1.4,
                          background: utilityStatusMsg.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: utilityStatusMsg.isError ? '#ef4444' : '#10b981',
                          border: `1px solid ${utilityStatusMsg.isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                        }}
                      >
                        {utilityStatusMsg.text}
                      </div>
                    )}

                    {/* Section 1: Cấu hình tự động mở scan */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        ⚙️ Cài đặt tự động mở tệp scan
                      </h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--color-inset-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-light)' }}>
                        {utilitySettingsLoading ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            <LoadingSpinner size="sm" /> Đang tải cấu hình cài đặt...
                          </div>
                        ) : (
                          <>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--color-text)' }}>
                              <input
                                type="checkbox"
                                checked={scanAutoOpenFile}
                                onChange={() => handleToggleSetting('scan_auto_open_file', scanAutoOpenFile)}
                                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                              />
                              <div>
                                <div style={{ fontWeight: 500 }}>Tự động mở file khi có scan mới</div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>Mở trực tiếp file vừa scan bằng ứng dụng mặc định</div>
                              </div>
                            </label>

                            <hr style={{ border: 0, borderTop: '1px solid var(--color-surface-light)', margin: '4px 0' }} />

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--color-text)' }}>
                              <input
                                type="checkbox"
                                checked={scanAutoOpenDir}
                                onChange={() => handleToggleSetting('scan_auto_open_dir', scanAutoOpenDir)}
                                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                              />
                              <div>
                                <div style={{ fontWeight: 500 }}>Tự động mở thư mục scan mới</div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>Mở thư mục chứa file scan trong Windows Explorer (mặc định ON)</div>
                              </div>
                            </label>

                            <hr style={{ border: 0, borderTop: '1px solid var(--color-surface-light)', margin: '4px 0' }} />

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                              <div>
                                <div style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--color-text)' }}>Lối tắt ngoài Desktop (%TEMP%/GoPrinxAgent/ftp)</div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>Tạo Shortcut thư mục Scan ra màn hình Desktop cho nhân viên dễ mở</div>
                              </div>
                              <button
                                onClick={() => {
                                  const createCmd = utilityCommands.find((c: any) => c.command === 'create_scan_shortcut');
                                  handleTriggerUtilityExec('create_scan_shortcut', createCmd?.command_content || '');
                                }}
                                disabled={utilityActionPending !== null}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.75rem',
                                  borderRadius: '8px',
                                  background: 'var(--color-surface-light)',
                                  border: '1px solid var(--color-primary)',
                                  color: 'var(--color-primary)',
                                  cursor: utilityActionPending !== null ? 'not-allowed' : 'pointer',
                                  whiteSpace: 'nowrap',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}
                              >
                                🔗 Tạo Shortcut Desktop
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>


                    {/* Section 2: Công cụ hệ thống Windows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🖥️ Công cụ hệ thống Windows
                      </h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {/* Dynamic commands from JSON — thêm lệnh mới vào utility_commands.json trên VPS là xong */}
                        {utilityCommandsLoading ? (
                          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', padding: '8px 0', justifyContent: 'center' }}>
                            <LoadingSpinner size="sm" /> Đang tải danh sách lệnh...
                          </div>
                        ) : (
                          <>
                            {utilityCommands.length > 0 ? (
                              (() => {
                                const filtered = utilityCommands.filter((cmd: any) => cmd.command !== 'dxdiag' && cmd.command !== 'open_web_setting');
                                const syncIdx = filtered.findIndex((cmd: any) => cmd.command === 'sync_all_scanpoints');
                                if (syncIdx > -1) {
                                  const [syncCmd] = filtered.splice(syncIdx, 1);
                                  filtered.unshift(syncCmd);
                                }
                                return filtered.map((cmd: any) => {
                                  const isEmergency = cmd.command === 'emergency_restart';
                                  return (
                                    <button
                                      key={cmd.command}
                                      onClick={() => handleTriggerUtilityExec(cmd.command, cmd.command_content)}
                                      disabled={utilityActionPending !== null}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        background: 'var(--color-surface-light)',
                                        border: isEmergency ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--color-surface-light)',
                                        borderRadius: '12px',
                                        padding: '16px 8px',
                                        cursor: utilityActionPending !== null ? 'not-allowed' : 'pointer',
                                        textAlign: 'center',
                                        width: '100%',
                                        transition: 'all 0.2s',
                                        opacity: utilityActionPending !== null ? 0.6 : 1,
                                        minHeight: '108px',
                                        boxSizing: 'border-box',
                                      }}
                                      onMouseEnter={(e) => {
                                        if (utilityActionPending === null) {
                                          e.currentTarget.style.borderColor = isEmergency ? '#ef4444' : 'var(--color-primary)';
                                          e.currentTarget.style.background = isEmergency ? 'rgba(239, 68, 68, 0.05)' : 'rgba(59, 130, 246, 0.05)';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = isEmergency ? 'rgba(239, 68, 68, 0.25)' : 'var(--color-surface-light)';
                                        e.currentTarget.style.background = 'var(--color-surface-light)';
                                      }}
                                    >
                                      <div style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {utilityActionPending === cmd.command ? <LoadingSpinner size="sm" /> : (cmd.icon || '🔧')}
                                      </div>
                                      <div style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        color: isEmergency ? '#ef4444' : 'var(--color-text)',
                                        lineHeight: '1.2',
                                        wordBreak: 'break-word',
                                      }}>
                                        {cmd.label}
                                      </div>
                                    </button>
                                  );
                                })})()
                            ) : (
                              // Fallback: nếu chưa có JSON, dùng 2 lệnh mặc định
                              <>
                                <button
                                  onClick={() => handleTriggerUtility('printers')}
                                  disabled={utilityActionPending !== null}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    background: 'var(--color-surface-light)',
                                    border: '1px solid var(--color-surface-light)',
                                    borderRadius: '12px',
                                    padding: '16px 8px',
                                    cursor: utilityActionPending !== null ? 'not-allowed' : 'pointer',
                                    textAlign: 'center',
                                    width: '100%',
                                    transition: 'all 0.2s',
                                    opacity: utilityActionPending !== null ? 0.6 : 1,
                                    minHeight: '108px',
                                    boxSizing: 'border-box',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (utilityActionPending === null) {
                                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-surface-light)';
                                    e.currentTarget.style.background = 'var(--color-surface-light)';
                                  }}
                                >
                                  <div style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {utilityActionPending === 'printers' ? <LoadingSpinner size="sm" /> : '🖨️'}
                                  </div>
                                  <div style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text)',
                                    lineHeight: '1.2',
                                    wordBreak: 'break-word',
                                  }}>
                                    Danh sách Máy in
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleTriggerUtility('scan')}
                                  disabled={utilityActionPending !== null}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    background: 'var(--color-surface-light)',
                                    border: '1px solid var(--color-surface-light)',
                                    borderRadius: '12px',
                                    padding: '16px 8px',
                                    cursor: utilityActionPending !== null ? 'not-allowed' : 'pointer',
                                    textAlign: 'center',
                                    width: '100%',
                                    transition: 'all 0.2s',
                                    opacity: utilityActionPending !== null ? 0.6 : 1,
                                    minHeight: '108px',
                                    boxSizing: 'border-box',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (utilityActionPending === null) {
                                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-surface-light)';
                                    e.currentTarget.style.background = 'var(--color-surface-light)';
                                  }}
                                >
                                  <div style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {utilityActionPending === 'scan' ? <LoadingSpinner size="sm" /> : '📂'}
                                  </div>
                                  <div style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text)',
                                    lineHeight: '1.2',
                                    wordBreak: 'break-word',
                                  }}>
                                    Thư mục Scan
                                  </div>
                                </button>
                              </>
                            )}

                            {/* Static buttons: Check watchdog and Emergency Kill */}
                            {/* Check Watchdog */}
                            <button
                              onClick={() => {
                                if (!selectedUtilityAgent) return;
                                setUtilityActionPending('check_watchdog');
                                setUtilityStatusMsg({ text: '⌛ Đang kiểm tra watchdog...', isError: false });
                                const checkCmdObj = utilityCommands.find((c: any) => c.command === 'check_watchdog');
                                triggerAgentUtilityExec(selectedUtilityAgent.agent_uid, 'check_watchdog', checkCmdObj?.command_content || '')
                                  .then((res: any) => {
                                    if (res.ok && res.command_id) {
                                      const maxPollMs = 30000;
                                      const startTime = Date.now();
                                      const timer = setInterval(async () => {
                                        if (Date.now() - startTime > maxPollMs) {
                                          clearInterval(timer);
                                          setUtilityStatusMsg({ text: '⏱️ Timeout chờ kết quả (30s)', isError: true });
                                          setUtilityActionPending(null);
                                          return;
                                        }
                                        try {
                                          const statusRes = await getCommandStatus(res.command_id);
                                          if (statusRes.status === 'success') {
                                            clearInterval(timer);
                                            const msg = statusRes.result_payload || statusRes.result || statusRes.error || 'Hoàn thành';
                                            setViewOutputModal({
                                              isOpen: true,
                                              title: '🩺 Check Watchdog',
                                              content: msg,
                                            });
                                            setUtilityStatusMsg(null);
                                            setUtilityActionPending(null);
                                          } else if (statusRes.status === 'failed') {
                                            clearInterval(timer);
                                            const errMsg = statusRes.error || statusRes.result_payload || statusRes.result || 'Failed';
                                            setViewOutputModal({
                                              isOpen: true,
                                              title: '🩺 Check Watchdog',
                                              content: errMsg,
                                            });
                                            setUtilityStatusMsg(null);
                                            setUtilityActionPending(null);
                                          }
                                        } catch {}
                                      }, 2000);
                                    } else {
                                      setUtilityStatusMsg({ text: '❌ ' + (res.error || 'Không thể gửi lệnh'), isError: true });
                                      setUtilityActionPending(null);
                                    }
                                  })
                                  .catch((err: any) => {
                                    setUtilityStatusMsg({ text: '❌ ' + err.message, isError: true });
                                    setUtilityActionPending(null);
                                  });
                              }}
                              disabled={utilityActionPending !== null}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: 'var(--color-surface-light)',
                                border: '1px solid var(--color-surface-light)',
                                borderRadius: '12px',
                                padding: '16px 8px',
                                cursor: utilityActionPending !== null ? 'not-allowed' : 'pointer',
                                textAlign: 'center',
                                width: '100%',
                                transition: 'all 0.2s',
                                opacity: utilityActionPending !== null ? 0.6 : 1,
                                minHeight: '108px',
                                boxSizing: 'border-box',
                              }}
                              onMouseEnter={(e) => {
                                if (utilityActionPending === null) {
                                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-surface-light)';
                                e.currentTarget.style.background = 'var(--color-surface-light)';
                              }}
                            >
                              <div style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {utilityActionPending === 'check_watchdog' ? <LoadingSpinner size="sm" /> : '🩺'}
                              </div>
                              <div style={{
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                color: 'var(--color-text)',
                                lineHeight: '1.2',
                                wordBreak: 'break-word',
                              }}>
                                Check watchdog
                              </div>
                            </button>

                            {/* Emergency Kill */}
                            <button
                              onClick={handleEmergencyRestart}
                              disabled={utilityActionPending !== null}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: 'var(--color-surface-light)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                borderRadius: '12px',
                                padding: '16px 8px',
                                cursor: utilityActionPending !== null ? 'not-allowed' : 'pointer',
                                textAlign: 'center',
                                width: '100%',
                                transition: 'all 0.2s',
                                opacity: utilityActionPending !== null ? 0.6 : 1,
                                minHeight: '108px',
                                boxSizing: 'border-box',
                              }}
                              onMouseEnter={(e) => {
                                if (utilityActionPending === null) {
                                  e.currentTarget.style.borderColor = '#ef4444';
                                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                                e.currentTarget.style.background = 'var(--color-surface-light)';
                              }}
                            >
                              <div style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {utilityActionPending === 'emergency_restart' ? <LoadingSpinner size="sm" /> : '🔌'}
                              </div>
                              <div style={{
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                color: '#ef4444',
                                lineHeight: '1.2',
                                wordBreak: 'break-word',
                              }}>
                                Emergency Kill
                              </div>
                            </button>
                          </>
                        )}

                        {/* Run command input — luôn hiển thị ở dưới cùng */}
                        <div style={{ background: 'var(--color-surface-light)', border: '1px solid var(--color-surface-light)', borderRadius: '8px', padding: '10px 12px', gridColumn: '1 / -1' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ fontSize: '1.4rem' }}>💻</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>Thực hiện lệnh Run</div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                            <input
                              type="text"
                              value={customRunCommand}
                              onChange={(e) => setCustomRunCommand(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && customRunCommand.trim()) {
                                  handleTriggerUtility('run_command', { command_line: customRunCommand.trim() });
                                }
                              }}
                              placeholder="Nhập lệnh cần chạy..."
                              disabled={utilityActionPending !== null}
                              style={{
                                flex: 1,
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-surface)',
                                color: 'var(--color-text)',
                                fontSize: '0.78rem',
                                outline: 'none',
                                fontFamily: 'monospace',
                              }}
                            />
                            <button
                              onClick={() => {
                                if (customRunCommand.trim()) {
                                  handleTriggerUtility('run_command', { command_line: customRunCommand.trim() });
                                }
                              }}
                              disabled={utilityActionPending !== null || !customRunCommand.trim()}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                border: 'none',
                                background: customRunCommand.trim() ? 'var(--color-primary)' : 'var(--color-surface)',
                                color: customRunCommand.trim() ? '#fff' : 'var(--color-text-secondary)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: customRunCommand.trim() && utilityActionPending === null ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              {utilityActionPending === 'run_command' ? <LoadingSpinner size="sm" /> : '▶ Run'}
                            </button>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {[
                              { label: 'dxdiag', cmd: 'dxdiag', desc: 'Cấu hình phần cứng' },
                              { label: 'msconfig', cmd: 'msconfig', desc: 'Cấu hình hệ thống' },
                              { label: 'ping', cmd: 'ping google.com', desc: 'Kiểm tra mạng' },
                            ].map((item) => (
                              <button
                                key={item.cmd}
                                onClick={() => setCustomRunCommand(item.cmd)}
                                disabled={utilityActionPending !== null}
                                title={item.desc}
                                style={{
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                  border: '1px solid var(--color-border)',
                                  background: customRunCommand === item.cmd ? 'rgba(59, 130, 246, 0.15)' : 'var(--color-surface)',
                                  color: customRunCommand === item.cmd ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                  fontSize: '0.68rem',
                                  cursor: utilityActionPending !== null ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.2s',
                                  fontFamily: 'monospace',
                                }}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div style={styles.modalFooter}>
                    <button
                      style={{ ...styles.smallBtn, padding: '10px 16px', fontSize: '0.85rem' }}
                      onClick={() => {
                        setActiveModal(null);
                        setSelectedUtilityAgent(null);
                        setUtilityStatusMsg(null);
                      }}
                    >
                      Đóng cửa sổ
                    </button>
                  </div>
                </>
              )}

              {/* 7. Edit IP Modal */}
              {activeModal === 'edit_ip' && editIpModalData && (
                <>
                  <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}> Thay đổi IP / Cấu hình FTP</h3>
                    <button style={styles.modalCloseBtn} onClick={() => setActiveModal(null)}>
                      &times;
                    </button>
                  </div>
                  <div style={styles.modalBody}>
                    {/* Row with Agent select and Port input */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                          Chọn nhanh IP từ danh sách Agent:
                        </label>
                        <select
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                          value=""
                          onChange={(e) => {
                            const selectedVal = e.target.value;
                            if (!selectedVal) return;
                            setEditIpModalData((prev: any) => {
                              if (!prev) return null;
                              const port = prev.newPort || '2130';
                              return {
                                ...prev,
                                newIp: `${selectedVal}:${port}`,
                                newPort: port
                              };
                            });
                          }}
                        >
                          <option value="">-- Chọn Agent --</option>
                          {(selectedLan?.agents || []).map((agent: any, idx: number) => {
                            const ip = agent.local_ip || agent.ip || '';
                            const name = agent.hostname || agent.uid || `Agent ${idx + 1}`;
                            return (
                              <option key={idx} value={ip}>
                                {name} ({ip})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div style={{ width: '100px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                          Cổng FTP:
                        </label>
                        <input
                          type="text"
                          value={editIpModalData.newPort || ''}
                          onChange={(e) => {
                            const portVal = e.target.value;
                            setEditIpModalData((prev: any) => {
                              if (!prev) return null;
                              let host = prev.newIp || '';
                              if (host.includes(':')) {
                                host = host.split(':')[0];
                              }
                              return {
                                ...prev,
                                newPort: portVal,
                                newIp: portVal ? `${host}:${portVal}` : host
                              };
                            });
                          }}
                          placeholder="2130"
                          style={styles.modalInput}
                        />
                      </div>
                    </div>

                    {/* FTP IP Input */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                        Địa chỉ FTP (IP:PORT):
                      </label>
                      <input
                        type="text"
                        value={editIpModalData.newIp}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditIpModalData((prev: any) => {
                            if (!prev) return null;
                            let port = prev.newPort || '2130';
                            if (val.includes(':')) {
                              port = val.split(':')[1].trim() || port;
                            }
                            return {
                              ...prev,
                              newIp: val,
                              newPort: port
                            };
                          });
                        }}
                        placeholder="Ví dụ: 192.168.1.100:2130"
                        style={styles.modalInput}
                      />
                    </div>

                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>
                      Đường dẫn hiện tại trên máy in: {editIpModalData.entry.folder || editIpModalData.entry.physical_path || editIpModalData.entry.folder_path}
                    </div>
                  </div>
                  <div style={styles.modalFooter}>
                    <button
                      style={{ ...styles.smallBtn, background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', padding: '8px 16px' }}
                      onClick={() => setActiveModal(null)}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      style={{ ...styles.smallBtn, background: 'var(--color-primary)', border: 'none', color: '#fff', padding: '8px 16px', fontWeight: 'bold' }}
                      onClick={() => {
                        const finalIp = (editIpModalData.newIp || '').trim();
                        if (!finalIp.includes(':')) {
                          showToast('Yêu cầu nhập thủ công phải đi kèm cổng FTP (Ví dụ: 192.168.1.100:2130)', 'error');
                          return;
                        }
                        handleSaveEditIP();
                      }}
                      disabled={!editIpModalData.newIp.trim()}
                    >
                      Lưu lại
                    </button>
                  </div>
                </>
              )}

              {activeModal === 'remote_lock' && remoteLockPrinter && (
                <>
                  <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>🔒 Khóa / Mở khóa máy từ xa</h3>
                    <button style={styles.modalCloseBtn} onClick={() => setActiveModal(null)}>
                      &times;
                    </button>
                  </div>
                  <div style={styles.modalBody}>
                    <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: 'var(--color-text)' }}>
                      Máy: <strong>{remoteLockPrinter.name}</strong> ({remoteLockPrinter.ip})
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Nút Khóa máy */}
                      <button
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px',
                          padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                        }}
                        onClick={() => {
                          setActiveModal(null);
                          showToast(`Đang gửi lệnh khóa máy ${remoteLockPrinter.name}...`, 'info', 3000);
                          modifyDeviceAddressss({
                            ip: remoteLockPrinter.ip,
                            action: 'lock_machine',
                            agent_uid: remoteLockPrinter.agentUid,
                          })
                            .then((res: any) => {
                              if (res.ok) {
                                showToast(`Đã gửi lệnh khóa máy ${remoteLockPrinter.name} thành công!`, 'success');
                              } else {
                                showToast('Lỗi: ' + (res.error || 'Failed'), 'error');
                              }
                            })
                            .catch((err: any) => {
                              showToast('Lỗi: ' + err.message, 'error');
                            });
                        }}
                      >
                        <div style={{ fontSize: '1.4rem' }}>🔒</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626' }}>Khóa máy</div>
                          <div style={{ fontSize: '0.7rem', color: '#7f1d1d' }}>Bật xác thực User Code, ngăn người dùng trái phép sử dụng máy</div>
                        </div>
                      </button>
                      {/* Nút Mở khóa máy */}
                      <button
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          background: '#dcfce7', border: '1px solid #22c55e', borderRadius: '8px',
                          padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                        }}
                        onClick={() => {
                          setActiveModal(null);
                          showToast(`Đang gửi lệnh mở khóa máy ${remoteLockPrinter.name}...`, 'info', 3000);
                          modifyDeviceAddressss({
                            ip: remoteLockPrinter.ip,
                            action: 'enable_machine',
                            agent_uid: remoteLockPrinter.agentUid,
                          })
                            .then((res: any) => {
                              if (res.ok) {
                                showToast(`Đã gửi lệnh mở khóa máy ${remoteLockPrinter.name} thành công!`, 'success');
                              } else {
                                showToast('Lỗi: ' + (res.error || 'Failed'), 'error');
                              }
                            })
                            .catch((err: any) => {
                              showToast('Lỗi: ' + err.message, 'error');
                            });
                        }}
                      >
                        <div style={{ fontSize: '1.4rem' }}>🔓</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a' }}>Mở khóa máy</div>
                          <div style={{ fontSize: '0.7rem', color: '#14532d' }}>Tắt xác thực User Code, cho phép sử dụng máy tự do</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'toshiba_vnc' && toshibaVncData && (
                <>
                  <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>📺 Kết nối VNC - {toshibaVncData.printerName}</h3>
                    <button style={styles.modalCloseBtn} onClick={() => setActiveModal(null)}>
                      &times;
                    </button>
                  </div>
                  <div style={styles.modalBody}>
                    {vncTunnelLoading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: '16px' }}>
                        <div style={{
                          border: '4px solid rgba(255,255,255,0.1)',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          borderLeftColor: '#10b981',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                          Đang khởi tạo đường hầm VNC bảo mật qua Agent...
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* 1. Live Web VNC Viewport (Main Screen) */}
                        <div style={{ border: '1px solid var(--color-surface-light)', borderRadius: '8px', padding: '14px', background: 'rgba(0,0,0,0.2)' }}>
                          {directLan ? (
                            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                              <p style={{ color: '#34d399', fontWeight: 600, fontSize: '0.85rem', marginBottom: '14px' }}>
                                🟢 Đang bật Direct LAN (kết nối nội mạng). Vui lòng click nút dưới đây để mở giao diện Web VNC nội bộ:
                              </p>
                              <button
                                onClick={() => {
                                  setActiveModal(null);
                                  window.open(`http://${toshibaVncData.ip}:49106/top.html?p=55105&wp=55106&w=1024&h=600&pa=0&op=0&c=0&osid=null`, '_blank');
                                }}
                                style={{
                                  background: '#3b82f6',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '10px 20px',
                                  color: 'white',
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                }}
                              >
                                🌐 Mở Web VNC Nội Mạng
                              </button>
                            </div>
                          ) : allocatedVncAddr ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                              <div 
                                style={{ 
                                  position: 'relative', 
                                  border: '1px solid var(--color-surface-light)', 
                                  borderRadius: '6px', 
                                  overflow: 'hidden',
                                  width: '100%',
                                  maxWidth: '800px',
                                  background: '#000',
                                  cursor: 'crosshair',
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                                }}
                              >
                                <img
                                  id="vnc-live-viewport"
                                  src={`${BASE_URL}/api/vnc/stream?agent_uid=${toshibaVncData.agentUid}&ip=${toshibaVncData.ip}&port=49105&t=${Date.now()}`}
                                  alt="Màn hình Live VNC"
                                  onClick={async (e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const clickX = e.clientX - rect.left;
                                    const clickY = e.clientY - rect.top;
                                    const x_percent = clickX / rect.width;
                                    const y_percent = clickY / rect.height;
                                    
                                    const vncX = Math.round(x_percent * 1024);
                                    const vncY = Math.round(y_percent * 600);
                                    
                                    try {
                                      await fetch(`${BASE_URL}/api/vnc/click`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          agent_uid: toshibaVncData.agentUid,
                                          ip: toshibaVncData.ip,
                                          port: 49105,
                                          x: vncX,
                                          y: vncY
                                        })
                                      });
                                    } catch (err) {
                                      console.error("VNC Click error:", err);
                                    }
                                  }}
                                  style={{
                                    display: 'block',
                                    width: '100%',
                                    height: 'auto',
                                    pointerEvents: 'auto'
                                  }}
                                />
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 500 }}>
                                ⚡ Click chuột trực tiếp lên màn hình để tương tác (giống UltraViewer)
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '10px' }}>
                              Đang kết nối luồng hình ảnh...
                            </div>
                          )}
                        </div>

                        {/* 2. Fallbacks & Connection details */}
                        {!directLan && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                                Địa chỉ VPS: <strong style={{ color: 'white', fontFamily: 'monospace' }}>{allocatedVncAddr}</strong> (Pass: <strong style={{ color: 'white', fontFamily: 'monospace' }}>d9kvgn</strong>)
                              </span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(allocatedVncAddr);
                                    showToast('Đã sao chép địa chỉ VNC', 'success');
                                  }}
                                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: 'white', fontSize: '0.7rem', cursor: 'pointer' }}
                                >
                                  Sao chép IP
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText('d9kvgn');
                                    showToast('Đã sao chép mật khẩu', 'success');
                                  }}
                                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: 'white', fontSize: '0.7rem', cursor: 'pointer' }}
                                >
                                  Sao chép Pass
                                </button>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                              <a
                                href={`vnc://${allocatedVncAddr}`}
                                style={{
                                  flex: 1,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  textDecoration: 'none',
                                  background: 'rgba(16, 185, 129, 0.1)',
                                  border: '1px solid #10b981',
                                  borderRadius: '6px',
                                  padding: '8px 12px',
                                  color: '#10b981',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                🚀 Mở bằng VNC App ngoài
                              </a>

                              <button
                                onClick={() => {
                                  setActiveModal(null);
                                  fetchRemotePage(toshibaVncData.ip, '', 'GET', null, false, toshibaVncData.agentUid, 49106);
                                }}
                                style={{
                                  flex: 1,
                                  background: 'rgba(59, 130, 246, 0.1)',
                                  border: '1px solid #3b82f6',
                                  borderRadius: '6px',
                                  padding: '8px 12px',
                                  color: '#3b82f6',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                🌐 Thử mở Web noVNC
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. CUSTOM CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div style={styles.confirmOverlay} onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}>
            <motion.div
              style={styles.confirmModalCard}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>⚠️ {confirmModal.title}</h3>
                <button
                  style={styles.modalCloseBtn}
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                >
                  &times;
                </button>
              </div>

              <div style={styles.modalBody}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text)', lineHeight: 1.4, margin: 0, whiteSpace: 'pre-line' }}>
                  {confirmModal.message}
                </p>
              </div>

              <div style={styles.modalFooter}>
                <button
                  style={{
                    ...styles.smallBtn,
                    padding: '10px 16px',
                    fontSize: '0.82rem',
                    background: 'var(--color-error)',
                    borderColor: 'var(--color-error)',
                    color: 'white',
                  }}
                  onClick={() => {
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                    confirmModal.onConfirm?.();
                  }}
                >
                  Đồng ý
                </button>
                <button
                  style={{
                    ...styles.smallBtn,
                    padding: '10px 16px',
                    fontSize: '0.82rem',
                    borderColor: 'var(--color-secondary)',
                    color: 'var(--color-secondary)',
                  }}
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                >
                  Hủy bỏ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE SCAN POINT MODAL WITH TARGET AGENT DROPDOWN */}
      <AnimatePresence>
        {deleteScanPointModal.isOpen && (
          <div style={styles.confirmOverlay} onClick={() => setDeleteScanPointModal((prev) => ({ ...prev, isOpen: false }))}>
            <motion.div
              style={{ ...styles.confirmModalCard, maxWidth: '440px', width: '90%' }}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>⚠️ Xác nhận xóa điểm scan</h3>
                <button
                  style={styles.modalCloseBtn}
                  onClick={() => setDeleteScanPointModal((prev) => ({ ...prev, isOpen: false }))}
                >
                  &times;
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={{ marginBottom: '14px', color: 'var(--color-text)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Tên điểm scan: <strong>"{deleteScanPointModal.entry?.name || deleteScanPointModal.entry?.name_1 || deleteScanPointModal.entry?.email_address || deleteScanPointModal.entry?.folder || deleteScanPointModal.entry?.registration_no || 'không tên'}"</strong>
                  {deleteScanPointModal.entry?.registration_no && (
                    <span style={{ display: 'block', color: 'var(--color-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                      Mã đăng ký: #{deleteScanPointModal.entry?.registration_no}
                    </span>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Relay Agent thực thi *</label>
                  <select
                    style={styles.modalInput}
                    value={deleteScanPointModal.agentUid}
                    onChange={(e) => setDeleteScanPointModal((p) => ({ ...p, agentUid: e.target.value }))}
                  >
                    {((selectedLan && selectedLan.agents) || [])
                      .filter((a) => a.is_agent_active)
                      .map((a) => (
                        <option key={a.agent_uid} value={a.agent_uid}>
                          {a.hostname} ({a.local_ip})
                        </option>
                      ))}
                  </select>
                  <span style={styles.formHelpText}>Chọn máy Agent trong mạng LAN sẽ gửi lệnh xóa tới máy photocopy.</span>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  style={{
                    ...styles.smallBtn,
                    padding: '10px 16px',
                    fontSize: '0.82rem',
                    background: 'var(--color-error)',
                    borderColor: 'var(--color-error)',
                    color: 'white',
                  }}
                  onClick={handleConfirmDeleteScanPoint}
                >
                  Xác nhận xóa
                </button>
                <button
                  style={{
                    ...styles.smallBtn,
                    padding: '10px 16px',
                    fontSize: '0.82rem',
                    borderColor: 'var(--color-secondary)',
                    color: 'var(--color-secondary)',
                  }}
                  onClick={() => setDeleteScanPointModal((prev) => ({ ...prev, isOpen: false }))}
                >
                  Hủy bỏ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5b. INSTALL DRIVER MODAL WITH TARGET AGENT SELECTION */}
      <AnimatePresence>
        {installDriverModal.isOpen && (
          <div style={styles.confirmOverlay} onClick={() => setInstallDriverModal((prev) => ({ ...prev, isOpen: false }))}>
            <motion.div
              style={styles.confirmModalCard}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>📦 Cài đặt Driver từ xa</h3>
                <button
                  style={styles.modalCloseBtn}
                  onClick={() => setInstallDriverModal((prev) => ({ ...prev, isOpen: false }))}
                >
                  &times;
                </button>
              </div>

              <div style={styles.modalBody}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text)', lineHeight: 1.4, margin: '0 0 12px 0' }}>
                  Bạn chuẩn bị cài đặt driver <strong>"{installDriverModal.driverName}"</strong> từ xa.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    Chọn Máy đại diện (Agent) để thực hiện cài đặt:
                  </label>
                  {(!selectedLan?.agents || selectedLan.agents.filter((a: any) => a.is_agent_active).length === 0) ? (
                    <div style={{ padding: '10px', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                      Không có Agent online trong LAN này
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                      {selectedLan.agents
                        .filter((a: any) => a.is_agent_active)
                        .map((a: any) => {
                          const isChecked = installDriverModal.selectedAgentUids.includes(a.agent_uid);
                          return (
                            <label key={a.agent_uid} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-text)' }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  setInstallDriverModal((prev) => {
                                    const uids = prev.selectedAgentUids;
                                    if (e.target.checked) {
                                      return { ...prev, selectedAgentUids: [...uids, a.agent_uid] };
                                    } else {
                                      return { ...prev, selectedAgentUids: uids.filter((id: string) => id !== a.agent_uid) };
                                    }
                                  });
                                }}
                                style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                              />
                              <span>{a.hostname} ({a.local_ip})</span>
                            </label>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  style={{
                    ...styles.smallBtn,
                    padding: '10px 16px',
                    fontSize: '0.82rem',
                    background: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    color: 'white',
                  }}
                  disabled={installDriverModal.selectedAgentUids.length === 0}
                  onClick={() => {
                    setInstallDriverModal((prev) => ({ ...prev, isOpen: false }));
                    installDriverModal.selectedAgentUids.forEach((agentUid: string) => {
                      executeRemoteInstallDriver(
                        installDriverModal.printerId,
                        installDriverModal.brand,
                        installDriverModal.model,
                        installDriverModal.driverName,
                        installDriverModal.driverUrl,
                        agentUid
                      );
                    });
                  }}
                >
                  Bắt đầu cài đặt
                </button>
                <button
                  style={{
                    ...styles.smallBtn,
                    padding: '10px 16px',
                    fontSize: '0.82rem',
                    borderColor: 'var(--color-secondary)',
                    color: 'var(--color-secondary)',
                  }}
                  onClick={() => setInstallDriverModal((prev) => ({ ...prev, isOpen: false }))}
                >
                  Hủy bỏ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. IP INPUT MODAL */}
      <AnimatePresence>
        {ipInputModal.isOpen && (
          <div
            style={{ ...styles.confirmOverlay, zIndex: 170 }}
            onClick={() => setIpInputModal((prev) => ({ ...prev, isOpen: false, error: '' }))}
          >
            <motion.div
              style={styles.confirmModalCard}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>{ipInputModal.title}</h3>
                <button
                  style={styles.modalCloseBtn}
                  onClick={() => setIpInputModal((prev) => ({ ...prev, isOpen: false, error: '' }))}
                >
                  &times;
                </button>
              </div>

              <div style={styles.modalBody}>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                  {ipInputModal.hint} Ví dụ: <code style={{ background: 'var(--color-surface-light)', padding: '1px 5px', borderRadius: 4 }}>192.168.1.15</code>
                </p>
                <input
                  autoFocus
                  type="text"
                  value={ipInputModal.value}
                  onChange={(e) => setIpInputModal((prev) => ({ ...prev, value: e.target.value, error: '' }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
                      if (!ipPattern.test(ipInputModal.value.trim())) {
                        setIpInputModal((prev) => ({ ...prev, error: 'IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x' }));
                        return;
                      }
                      const changeAllVal = (ipInputModal.changeAllTo || '').trim();
                      if (changeAllVal && !ipPattern.test(changeAllVal)) {
                        setIpInputModal((prev) => ({ ...prev, error: 'IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống.' }));
                        return;
                      }
                      const cb = ipInputModal.onConfirm;
                      setIpInputModal((prev) => ({ ...prev, isOpen: false, error: '' }));
                      cb(ipInputModal.value.trim(), changeAllVal);
                    }
                    if (e.key === 'Escape') {
                      setIpInputModal((prev) => ({ ...prev, isOpen: false, error: '' }));
                    }
                  }}
                  placeholder="192.168.1.x"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: ipInputModal.error
                      ? '1.5px solid var(--color-error)'
                      : '1.5px solid var(--color-surface-light)',
                    background: 'var(--color-background)',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => {
                    if (!ipInputModal.error) e.target.style.borderColor = 'var(--color-primary)';
                  }}
                  onBlur={(e) => {
                    if (!ipInputModal.error) e.target.style.borderColor = 'var(--color-surface-light)';
                  }}
                />

                {ipInputModal.title.includes('Kiểm tra') && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '0 0 6px 0', lineHeight: 1.5 }}>
                      Thay đổi tất cả FTP Scan trùng IP trên thành IP mới (Tùy chọn):
                    </p>
                    <input
                      type="text"
                      value={ipInputModal.changeAllTo || ''}
                      onChange={(e) => setIpInputModal((prev) => ({ ...prev, changeAllTo: e.target.value, error: '' }))}
                      placeholder="Ví dụ: 192.168.1.43"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--color-surface-light)',
                        background: 'var(--color-background)',
                        color: 'var(--color-text)',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-surface-light)';
                      }}
                    />
                  </div>
                )}

                {ipInputModal.error && (
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.72rem', color: 'var(--color-error)' }}>
                    ⚠️ {ipInputModal.error}
                  </p>
                )}
                {ipInputModal.scanStatus && (
                  <div style={{
                    marginTop: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'var(--color-surface-light)',
                    fontSize: '0.74rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    border: '1px solid var(--color-surface-border)'
                  }}>
                    {ipInputModal.scanStatus}
                  </div>
                )}
              </div>


              <div style={styles.modalFooter}>
                <button
                  style={{
                    ...styles.smallBtn,
                    padding: '10px 16px',
                    fontSize: '0.82rem',
                    background: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    color: 'white',
                  }}
                  onClick={() => {
                    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
                    if (!ipPattern.test(ipInputModal.value.trim())) {
                      setIpInputModal((prev) => ({ ...prev, error: 'IP không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x' }));
                      return;
                    }
                    const changeAllVal = (ipInputModal.changeAllTo || '').trim();
                    if (changeAllVal && !ipPattern.test(changeAllVal)) {
                      setIpInputModal((prev) => ({ ...prev, error: 'IP mới không hợp lệ! Vui lòng nhập đúng dạng x.x.x.x hoặc để trống.' }));
                      return;
                    }
                    const cb = ipInputModal.onConfirm;
                    setIpInputModal((prev) => ({ ...prev, isOpen: false, error: '' }));
                    cb(ipInputModal.value.trim(), changeAllVal);
                  }}
                >
                  ✅ Xác nhận
                </button>
                <button
                  style={{
                    ...styles.smallBtn,
                    padding: '10px 16px',
                    fontSize: '0.82rem',
                    borderColor: 'var(--color-secondary)',
                    color: 'var(--color-secondary)',
                  }}
                  onClick={() => setIpInputModal((prev) => ({ ...prev, isOpen: false, error: '' }))}
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. VIEW OUTPUT MODAL — hiển thị nội dung file log/config từ agent */}
      <AnimatePresence>
        {viewOutputModal.isOpen && (
          <div
            style={{ ...styles.confirmOverlay, zIndex: 180, alignItems: 'flex-start', paddingTop: '5vh' }}
            onClick={() => setViewOutputModal((prev) => ({ ...prev, isOpen: false }))}
          >
            <motion.div
              style={{
                ...styles.confirmModalCard,
                maxWidth: '680px',
                width: '95%',
                maxHeight: '88vh',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div style={styles.modalHeader}>
                <h3 style={{ ...styles.modalTitle, fontSize: '0.85rem' }}>{viewOutputModal.title}</h3>
                <button
                  style={styles.modalCloseBtn}
                  onClick={() => setViewOutputModal((prev) => ({ ...prev, isOpen: false }))}
                >
                  &times;
                </button>
              </div>

              {viewOutputModal.title.includes('settings.json') ? (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                  <textarea
                    ref={modalContentRef}
                    value={editableSettingsText}
                    onChange={(e) => setEditableSettingsText(e.target.value)}
                    style={{
                      flex: 1,
                      overflow: 'auto',
                      margin: 0,
                      padding: '12px',
                      background: 'var(--color-background)',
                      border: '1px solid var(--color-surface-light)',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      lineHeight: 1.55,
                      fontFamily: "'Consolas', 'Monaco', monospace",
                      color: 'var(--color-text)',
                      minHeight: '380px',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                  {settingsSaveStatus && (
                    <div style={{
                      marginTop: 8, fontSize: 11,
                      padding: '6px 10px', borderRadius: 6,
                      background: settingsSaveStatus.startsWith('❌') ? 'rgba(239,68,68,0.1)' : (settingsSaveStatus.startsWith('✔️') ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)'),
                      color: settingsSaveStatus.startsWith('❌') ? '#f87171' : (settingsSaveStatus.startsWith('✔️') ? '#4ade80' : 'var(--color-warning)'),
                      border: `1px solid ${settingsSaveStatus.startsWith('❌') ? 'rgba(239,68,68,0.15)' : (settingsSaveStatus.startsWith('✔️') ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)')}`
                    }}>
                      {settingsSaveStatus}
                    </div>
                  )}
                </div>
              ) : (
                <pre
                  ref={modalContentRef}
                  style={{
                    flex: 1,
                    overflow: 'auto',
                    margin: 0,
                    padding: '12px',
                    background: 'var(--color-background)',
                    border: '1px solid var(--color-surface-light)',
                    borderRadius: '8px',
                    fontSize: '0.68rem',
                    lineHeight: 1.55,
                    fontFamily: "'Consolas', 'Monaco', monospace",
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    color: 'var(--color-text)',
                    minHeight: 0,
                  }}
                >
                  {formatJsonText(viewOutputModal.content)}
                </pre>
              )}

              <div style={{ ...styles.modalFooter, marginTop: '10px' }}>
                {viewOutputModal.title.includes('settings.json') && (
                  <button
                    disabled={isSavingSettings}
                    style={{
                      ...styles.smallBtn,
                      padding: '8px 14px',
                      fontSize: '0.78rem',
                      background: isSavingSettings ? 'rgba(99,102,241,0.6)' : 'var(--color-primary)',
                      borderColor: 'var(--color-primary)',
                      color: '#fff',
                      cursor: isSavingSettings ? 'not-allowed' : 'pointer'
                    }}
                    onClick={handleSaveSettings}
                  >
                    {isSavingSettings ? '⌛ Đang lưu...' : '💾 Lưu cấu hình'}
                  </button>
                )}
                <button
                  style={{
                    ...styles.smallBtn,
                    padding: '8px 14px',
                    fontSize: '0.78rem',
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(viewOutputModal.title.includes('settings.json') ? editableSettingsText : formatJsonText(viewOutputModal.content)).catch(() => {});
                  }}
                >
                  📋 Copy
                </button>
                <button
                  style={{
                    ...styles.smallBtn,
                    padding: '8px 14px',
                    fontSize: '0.78rem',
                    borderColor: 'var(--color-secondary)',
                    color: 'var(--color-secondary)',
                  }}
                  onClick={() => setViewOutputModal((prev) => ({ ...prev, isOpen: false }))}
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. WEB PREVIEW MODAL — Xem trực tiếp Web Setting */}
      <AnimatePresence>
        {webPreviewModal && webPreviewModal.isOpen && (
          <div
            className="web-preview-modal-overlay"
            style={{ ...styles.confirmOverlay, zIndex: 190, alignItems: 'flex-start', paddingTop: '5vh' }}
            onClick={handleCloseWebPreview}
          >
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
              @media (max-width: 767px) {
                .web-preview-modal-overlay {
                  padding-top: 0px !important;
                  align-items: center !important;
                  justify-content: center !important;
                }
                .web-preview-modal-card {
                  width: 100% !important;
                  height: 100vh !important;
                  max-height: 100vh !important;
                  border-radius: 0px !important;
                  padding: 12px !important;
                  margin: 0 !important;
                }
              }
            `}</style>
            {(() => {
              let pageTitle = 'Trang cấu hình máy in';
              if (webPreviewModal.html && webPreviewModal.html !== 'LOADING' && !webPreviewModal.html.startsWith('ERROR:')) {
                if (webPreviewModal.html === 'DIRECT_LAN') {
                  pageTitle = 'Kết nối trực tiếp LAN';
                } else {
                  const titleMatch = webPreviewModal.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
                  if (titleMatch && titleMatch[1]) {
                    pageTitle = titleMatch[1].trim();
                  }
                }
              }
              
              return (
                <motion.div
                  className="web-preview-modal-card"
                  style={{
                    ...styles.confirmModalCard,
                    maxWidth: '1200px',
                    width: '95%',
                    height: '85vh',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <div style={styles.modalHeader}>
                    <h3 style={{ ...styles.modalTitle, fontSize: '0.85rem' }}>{webPreviewModal.title}</h3>
                    <button
                      style={styles.modalCloseBtn}
                      onClick={handleCloseWebPreview}
                    >
                      &times;
                    </button>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '15px', minHeight: 0 }}>
                    {webPreviewModal.html === 'LOADING' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px', padding: '20px' }}>
                        <svg
                          style={{
                            width: '36px',
                            height: '36px',
                            color: 'var(--color-primary)',
                            animation: 'spin 1s linear infinite'
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                          Đang đợi phản hồi từ Agent...
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: '320px' }}>
                          Agent đang kết nối trực tiếp đến máy in và nạp cấu hình...
                        </span>
                      </div>
                    ) : webPreviewModal.html.startsWith('ERROR:') ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px', padding: '20px', color: 'var(--color-error)' }}>
                        <span style={{ fontSize: '2.2rem' }}>⚠️</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                          Lỗi lấy trang Web Setting từ Agent
                        </span>
                        <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0, padding: '12px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.15)', width: '100%', boxSizing: 'border-box', fontFamily: 'monospace' }}>
                          {webPreviewModal.html.replace('ERROR:', '').trim()}
                        </pre>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, minHeight: 0 }}>
                        {/* Compact Connection Mode Status Row */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--color-surface-light)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '0.74rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)' }}>
                            <span>🔌 Kết nối: <strong>{directLan ? '⚡ Trực tiếp LAN' : '🌐 Qua Agent'}</strong></span>
                          </div>
                          <button
                            onClick={() => setShowPreviewDetails(!showPreviewDetails)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.72rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {showPreviewDetails ? 'Thu gọn ▲' : 'Cài đặt & Chi tiết ▼'}
                          </button>
                        </div>

                        {showPreviewDetails && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Success Status & Control Actions */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '12px',
                              background: 'rgba(16, 185, 129, 0.04)',
                              border: '1px solid rgba(16, 185, 129, 0.15)',
                              borderRadius: '8px',
                              padding: '10px 14px',
                            }}>
                              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
                                <span style={{ color: '#10b981', fontWeight: 700 }}>🟢 Kết nối Live:</span> {pageTitle} (<span style={{ fontFamily: 'monospace' }}>{webPreviewModal.ip}</span>)
                              </div>
                              
                              <button
                                onClick={() => window.open(`http://${webPreviewModal.ip}/`, '_blank')}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  background: '#10b981',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: 'white',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                                }}
                              >
                                🌐 Mở trực tiếp LAN
                              </button>
                            </div>

                            {/* Chế độ kết nối Switcher */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                              background: 'var(--color-surface)',
                              border: '1px solid var(--color-surface-light)',
                              borderRadius: '8px',
                              padding: '8px 12px',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-text)' }}>
                                🔗 Chế độ kết nối:
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => handleToggleDirectLan(false)}
                                  style={{
                                    padding: '4px 10px',
                                    fontSize: '0.70rem',
                                    fontWeight: 600,
                                    background: !directLan ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                    color: !directLan ? 'white' : 'var(--color-text-secondary)',
                                    border: !directLan ? '1px solid var(--color-primary)' : '1px solid var(--color-surface-light)',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  🔌 Qua Agent (Từ xa)
                                </button>
                                <button
                                  onClick={() => handleToggleDirectLan(true)}
                                  style={{
                                    padding: '4px 10px',
                                    fontSize: '0.70rem',
                                    fontWeight: 600,
                                    background: directLan ? '#10b981' : 'rgba(255,255,255,0.05)',
                                    color: directLan ? 'white' : 'var(--color-text-secondary)',
                                    border: directLan ? '1px solid #10b981' : '1px solid var(--color-surface-light)',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  ⚡ Trực tiếp LAN (Cùng Wifi)
                                </button>
                              </div>
                            </div>

                            {directLan && window.location.protocol === 'https:' && (
                              <div style={{
                                color: '#fbbf24',
                                background: 'rgba(251, 191, 36, 0.08)',
                                border: '1px solid rgba(251, 191, 36, 0.25)',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                fontSize: '0.72rem',
                                lineHeight: 1.4
                              }}>
                                ⚠️ <strong>Mixed Content Block:</strong> Trình duyệt di động/máy tính sẽ chặn kết nối HTTP trực tiếp đến IP máy in từ trang web bảo mật HTTPS. Để kết nối trực tiếp thành công, hãy mở trang web quản trị qua <strong>HTTP</strong> hoặc click nút <strong>🌐 Mở trực tiếp LAN</strong> phía trên để truy cập trong tab mới.
                              </div>
                            )}

                            {directLan && (
                              <div style={{
                                color: '#60a5fa',
                                background: 'rgba(96, 165, 250, 0.08)',
                                border: '1px solid rgba(96, 165, 250, 0.25)',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                fontSize: '0.72rem',
                                lineHeight: 1.4
                              }}>
                                💡 <strong>Chế độ trực tiếp LAN:</strong> Thiết bị kết nối trực tiếp đến IP máy in qua mạng Wifi nội bộ.
                                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                                  <li>Thanh địa chỉ và Lịch sử duyệt sẽ không tự động cập nhật.</li>
                                  <li>Chức năng thu phóng (Ngang/Dọc) trong iframe không áp dụng (vui lòng zoom bằng thao tác vuốt).</li>
                                </ul>
                              </div>
                            )}
                            
                            {!directLan && (
                              <div style={{
                                color: 'var(--color-text-secondary)',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid var(--color-surface-light)',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                fontSize: '0.72rem',
                                lineHeight: 1.4
                              }}>
                                <strong style={{ color: 'var(--color-primary)' }}>🛠️ Nhật ký & Thông số kết nối ngược (SSH Reverse Tunnel):</strong>
                                <div style={{ marginTop: '6px', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div>• <strong>Máy khách (Agent Uid):</strong> {webPreviewModal.agentUid}</div>
                                  <div>• <strong>Địa chỉ IP Máy in:</strong> {webPreviewModal.ip}</div>
                                  <div>• <strong>Cổng dịch vụ máy in:</strong> 80</div>
                                  <div>• <strong>Máy chủ VPS:</strong> 31.97.76.62</div>
                                  <div>• <strong>Cổng kết nối trên VPS (Assigned Port):</strong> {webPreviewModal.url ? webPreviewModal.url.split(':').pop() : 'Đang cấp phát...'}</div>
                                  <div>• <strong>Phương thức xác thực:</strong> SSH Key pair (Root User)</div>
                                  <div>• <strong>Đường dẫn kết nối:</strong> <span style={{ color: 'var(--color-text)' }}>{webPreviewModal.url || 'N/A'}</span></div>
                                  {webPreviewModal.url && (
                                    <div style={{ color: '#fbbf24', marginTop: '4px' }}>
                                      ⚠️ Nếu Iframe hiển thị màn hình trắng / lỗi kết nối, có thể do trình duyệt chặn nội dung Mixed Content (HTTP trên trang HTTPS). Hãy click nút <strong>🔗 Mở tab mới ↗</strong> ở thanh điều khiển phía dưới để xem trực tiếp.
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Browser Chrome Controls (Address Bar & Nav Buttons) */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-surface-light)',
                          borderRadius: '6px',
                          padding: '6px 12px'
                        }}>
                          <button
                            onClick={handleHistoryBack}
                            disabled={webPreviewHistoryIndex <= 0}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: webPreviewHistoryIndex <= 0 ? 'rgba(255,255,255,0.15)' : 'var(--color-text)',
                              cursor: webPreviewHistoryIndex <= 0 ? 'not-allowed' : 'pointer',
                              padding: '4px',
                              fontSize: '0.8rem'
                            }}
                            title="Back"
                          >
                            ◀
                          </button>
                          <button
                            onClick={handleHistoryForward}
                            disabled={webPreviewHistoryIndex >= webPreviewHistory.length - 1}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: webPreviewHistoryIndex >= webPreviewHistory.length - 1 ? 'rgba(255,255,255,0.15)' : 'var(--color-text)',
                              cursor: webPreviewHistoryIndex >= webPreviewHistory.length - 1 ? 'not-allowed' : 'pointer',
                              padding: '4px',
                              fontSize: '0.8rem'
                            }}
                            title="Forward"
                          >
                            ▶
                          </button>
                          <button
                            onClick={() => fetchRemotePage(webPreviewModal.ip, webPreviewModal.path)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-text)',
                              cursor: 'pointer',
                              padding: '4px',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Refresh"
                          >
                            🔄
                          </button>
                          <div style={{
                            flex: 1,
                            background: 'var(--color-background)',
                            border: '1px solid var(--color-surface-light)',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            fontSize: '0.72rem',
                            fontFamily: 'monospace',
                            color: 'var(--color-text-secondary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            http://{webPreviewModal.ip}{webPreviewModal.path || '/'}
                          </div>
                          {webPreviewModal.url && (
                            <a
                              href={webPreviewModal.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 10px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                marginLeft: '8px'
                              }}
                              title="Mở trang quản trị Web Image Monitor trong tab mới"
                            >
                              🔗 Mở tab mới ↗
                            </a>
                          )}
                        </div>

                        {/* Tab Selector for Preview Mode */}
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-surface-light)', gap: '15px', paddingBottom: '4px' }}>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '8px 12px',
                              fontSize: '0.78rem',
                              fontWeight: webPreviewTab === 'iframe' ? 600 : 500,
                              color: webPreviewTab === 'iframe' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                              borderBottom: webPreviewTab === 'iframe' ? '2px solid var(--color-primary)' : '2px solid transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onClick={() => setWebPreviewTab('iframe')}
                          >
                            🌐 Giao diện máy in
                          </button>
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '8px 12px',
                              fontSize: '0.78rem',
                              fontWeight: webPreviewTab === 'html' ? 600 : 500,
                              color: webPreviewTab === 'html' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                              borderBottom: webPreviewTab === 'html' ? '2px solid var(--color-primary)' : '2px solid transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onClick={() => setWebPreviewTab('html')}
                          >
                            📄 Xem mã HTML (Text)
                          </button>
                        </div>

                        {webPreviewTab === 'html' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minHeight: 0 }}>
                            {directLan ? (
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1,
                                gap: '10px',
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.76rem',
                                padding: '20px',
                                textAlign: 'center'
                              }}>
                                <span>📄 Chế độ trực tiếp LAN không tải mã nguồn về server.</span>
                                <span style={{ fontSize: '0.70rem', color: 'rgba(255,255,255,0.4)' }}>
                                  Hãy chuyển sang chế độ <strong>Qua Agent (Từ xa)</strong> để phân tích và xem mã nguồn HTML của máy in.
                                </span>
                              </div>
                            ) : (
                              <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                                    Mã nguồn HTML gốc từ máy in:
                                  </span>
                                  <button
                                    style={{
                                      border: 'none',
                                      background: 'rgba(59, 130, 246, 0.1)',
                                      color: '#3b82f6',
                                      padding: '4px 10px',
                                      borderRadius: '6px',
                                      fontSize: '0.72rem',
                                      cursor: 'pointer',
                                      fontWeight: 600,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    onClick={() => {
                                      navigator.clipboard.writeText(webPreviewModal.html);
                                      showToast('Đã copy mã HTML vào clipboard', 'success');
                                    }}
                                  >
                                    📋 Copy HTML
                                  </button>
                                </div>
                                <pre style={{
                                  flex: 1,
                                  overflow: 'auto',
                                  margin: 0,
                                  padding: '12px',
                                  background: 'var(--color-background)',
                                  border: '1px solid var(--color-surface-light)',
                                  borderRadius: '8px',
                                  fontSize: '0.68rem',
                                  lineHeight: 1.5,
                                  fontFamily: "'Consolas', 'Monaco', monospace",
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-all',
                                  color: 'var(--color-text)',
                                }}>
                                  {webPreviewModal.html}
                                </pre>
                              </>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minHeight: 0 }}>
                            {/* Toolbar Zoom & Scale */}
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                              background: 'var(--color-surface)',
                              border: '1px solid var(--color-surface-light)',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontSize: '0.74rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                {/* Horizontal scale */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>↔️ Ngang:</span>
                                  <button
                                    onClick={() => {
                                      const newVal = Math.max(0.3, parseFloat((scaleX - 0.05).toFixed(2)));
                                      setScaleX(newVal);
                                      if (lockAspect) setScaleY(newVal);
                                    }}
                                    style={{
                                      background: 'var(--color-background)',
                                      border: '1px solid var(--color-surface-light)',
                                      color: 'var(--color-text)',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                  >-</button>
                                  <input
                                    type="range"
                                    min="0.3"
                                    max="2.0"
                                    step="0.05"
                                    value={scaleX}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      setScaleX(val);
                                      if (lockAspect) setScaleY(val);
                                    }}
                                    style={{ width: '80px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                                  />
                                  <button
                                    onClick={() => {
                                      const newVal = Math.min(2.0, parseFloat((scaleX + 0.05).toFixed(2)));
                                      setScaleX(newVal);
                                      if (lockAspect) setScaleY(newVal);
                                    }}
                                    style={{
                                      background: 'var(--color-background)',
                                      border: '1px solid var(--color-surface-light)',
                                      color: 'var(--color-text)',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                  >+</button>
                                  <span style={{ minWidth: '35px', textAlign: 'right', fontWeight: 600, color: 'var(--color-text)' }}>
                                    {Math.round(scaleX * 100)}%
                                  </span>
                                </div>

                                {/* Vertical scale */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>↕️ Dọc:</span>
                                  <button
                                    onClick={() => {
                                      const newVal = Math.max(0.3, parseFloat((scaleY - 0.05).toFixed(2)));
                                      setScaleY(newVal);
                                      if (lockAspect) setScaleX(newVal);
                                    }}
                                    style={{
                                      background: 'var(--color-background)',
                                      border: '1px solid var(--color-surface-light)',
                                      color: 'var(--color-text)',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                    disabled={lockAspect}
                                  >-</button>
                                  <input
                                    type="range"
                                    min="0.3"
                                    max="2.0"
                                    step="0.05"
                                    value={scaleY}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      setScaleY(val);
                                      if (lockAspect) setScaleX(val);
                                    }}
                                    style={{ width: '80px', cursor: 'pointer', accentColor: 'var(--color-primary)', opacity: lockAspect ? 0.5 : 1 }}
                                    disabled={lockAspect}
                                  />
                                  <button
                                    onClick={() => {
                                      const newVal = Math.min(2.0, parseFloat((scaleY + 0.05).toFixed(2)));
                                      setScaleY(newVal);
                                      if (lockAspect) setScaleX(newVal);
                                    }}
                                    style={{
                                      background: 'var(--color-background)',
                                      border: '1px solid var(--color-surface-light)',
                                      color: 'var(--color-text)',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                    disabled={lockAspect}
                                  >+</button>
                                  <span style={{ minWidth: '35px', textAlign: 'right', fontWeight: 600, color: lockAspect ? 'var(--color-text-secondary)' : 'var(--color-text)' }}>
                                    {Math.round(scaleY * 100)}%
                                  </span>
                                </div>

                                {/* Lock Aspect Ratio Toggle */}
                                <button
                                  onClick={() => {
                                    setLockAspect(!lockAspect);
                                    if (!lockAspect) {
                                      // Sync Y to X when locking
                                      setScaleY(scaleX);
                                    }
                                  }}
                                  style={{
                                    background: lockAspect ? 'rgba(124, 106, 247, 0.15)' : 'var(--color-background)',
                                    border: lockAspect ? '1px solid var(--color-accent, #7c6af7)' : '1px solid var(--color-surface-light)',
                                    color: lockAspect ? 'var(--color-accent, #7c6af7)' : 'var(--color-text-secondary)',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.2s ease'
                                  }}
                                  title={lockAspect ? "Bỏ liên kết tỷ lệ" : "Liên kết tỷ lệ Ngang & Dọc"}
                                >
                                  {lockAspect ? '🔗 Đồng bộ' : '🔓 Tự do'}
                                </button>
                              </div>

                              {/* Presets and Auto-Fit */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  onClick={() => {
                                    setScaleX(0.95);
                                    setScaleY(0.95);
                                  }}
                                  style={{
                                    background: 'var(--color-background)',
                                    border: '1px solid var(--color-surface-light)',
                                    color: 'var(--color-text)',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                  }}
                                >
                                  Mặc định
                                </button>
                                <button
                                  onClick={() => {
                                    setScaleX(1.0);
                                    setScaleY(1.0);
                                  }}
                                  style={{
                                    background: 'var(--color-background)',
                                    border: '1px solid var(--color-surface-light)',
                                    color: 'var(--color-text)',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                  }}
                                >
                                  100%
                                </button>
                                <button
                                  onClick={() => {
                                    try {
                                      const iframe = previewIframeRef.current;
                                      if (!iframe) return;
                                      const doc = iframe.contentDocument || iframe.contentWindow?.document;
                                      if (doc && doc.body) {
                                        // temporary reset width for measurement
                                        const origWidth = doc.body.style.width;
                                        const origTransform = doc.body.style.transform;
                                        doc.body.style.transform = 'none';
                                        doc.body.style.width = 'auto';
                                        
                                        // Let browser reflow and measure scrollWidth
                                        const contentWidth = doc.body.scrollWidth || doc.documentElement.scrollWidth || 1024;
                                        const containerWidth = iframe.clientWidth || 800;
                                        
                                        // Restore
                                        doc.body.style.width = origWidth;
                                        doc.body.style.transform = origTransform;

                                        if (contentWidth > 0 && containerWidth > 0) {
                                          let fitScale = containerWidth / contentWidth;
                                          fitScale = Math.max(0.3, Math.min(1.5, fitScale));
                                          // Round to nearest 0.05 step
                                          fitScale = Math.round(fitScale * 20) / 20;
                                          setScaleX(fitScale);
                                          if (lockAspect) {
                                            setScaleY(fitScale);
                                          }
                                        }
                                      }
                                    } catch (e) {
                                      console.error(e);
                                    }
                                  }}
                                  style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    color: '#10b981',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                  }}
                                >
                                  📐 Vừa khung
                                </button>
                              </div>
                            </div>

                            <div style={{ flex: 1, minHeight: 0, background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-surface-light)', position: 'relative' }}>
                              <iframe
                                ref={previewIframeRef}
                                src={webPreviewModal.url ? webPreviewModal.url : (directLan ? `http://${webPreviewModal.ip}${webPreviewModal.path || '/'}` : previewBlobUrl)}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  border: 'none',
                                  background: 'white'
                                }}
                              />
                              {webPreviewLoading && (
                                <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: 'rgba(15, 23, 42, 0.65)',
                                  backdropFilter: 'blur(3px)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '12px',
                                  zIndex: 10
                                }}>
                                  <svg
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      color: 'var(--color-primary)',
                                      animation: 'spin 1s linear infinite'
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
                                    Đang đợi phản hồi từ Agent...
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ ...styles.modalFooter, marginTop: '15px', flexShrink: 0, borderTop: '1px solid var(--color-surface-light)', paddingTop: '12px' }}>
                    {webPreviewModal.html !== 'LOADING' && !webPreviewModal.html.startsWith('ERROR:') && (
                      <button
                        style={{
                          ...styles.smallBtn,
                          padding: '8px 14px',
                          fontSize: '0.78rem',
                          background: 'var(--color-primary)',
                          borderColor: 'var(--color-primary)',
                          color: 'white',
                        }}
                        onClick={() => {
                          const blob = new Blob([webPreviewModal!.html], { type: 'text/html;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          window.open(url, '_blank');
                        }}
                      >
                        ↗️ Xem mã HTML gốc
                      </button>
                    )}
                    <button
                      style={{
                        ...styles.smallBtn,
                        padding: '8px 14px',
                        fontSize: '0.78rem',
                        borderColor: 'var(--color-secondary)',
                        color: 'var(--color-secondary)',
                        marginLeft: '8px'
                      }}
                      onClick={() => setWebPreviewModal((prev) => prev ? { ...prev, isOpen: false } : null)}
                    >
                      Đóng
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>

      {/* 📋 SCAN POINTS JSON VIEWER MODAL */}
      <AnimatePresence>
        {scanPointsViewerModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setScanPointsViewerModal(prev => ({ ...prev, isOpen: false }))}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#121826',
                border: '1px solid rgba(0, 204, 255, 0.3)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '680px',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                overflow: 'hidden',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 204, 255, 0.05)',
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#00ccff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📋 Tệp dữ liệu scan_points.json
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {scanPointsViewerModal.copierName} · MAC: {scanPointsViewerModal.macId || 'N/A'}
                  </div>
                </div>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => setScanPointsViewerModal(prev => ({ ...prev, isOpen: false }))}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
                {scanPointsViewerModal.loading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#00ccff' }}>
                    ⏳ Đang tải nội dung tệp scan_points.json...
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                        Local Agent path: <code style={{ color: '#00ccff' }}>.../GoPrinxAgent/scan_points.json</code>
                      </span>
                      <button
                        style={{
                          background: 'rgba(0, 255, 136, 0.15)',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          color: '#00ff88',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(scanPointsViewerModal.jsonData, null, 2));
                          showToast('Đã sao chép nội dung scan_points.json!', 'success');
                        }}
                      >
                        📋 Copy JSON
                      </button>
                    </div>

                    <pre
                      style={{
                        background: '#0a0d14',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        padding: '14px',
                        color: '#a0aec0',
                        fontSize: '0.8rem',
                        fontFamily: 'Consolas, Monaco, monospace',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        margin: 0,
                        maxHeight: '450px',
                      }}
                    >
                      {JSON.stringify(scanPointsViewerModal.jsonData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '12px 20px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  background: 'rgba(0,0,0,0.2)',
                }}
              >
                <button
                  style={{
                    background: 'var(--color-surface-light)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => setScanPointsViewerModal(prev => ({ ...prev, isOpen: false }))}
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

          </AnimatePresence>
    </>
  );
}
