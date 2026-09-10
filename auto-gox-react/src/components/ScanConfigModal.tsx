import React, { useState, useEffect } from 'react';
import { fetchPrintersFromAgent, installScanApi, addLanEmailApi, trackCommandProgressPromise, recordJobToVpsApi, fetchCopierCredentialsApi } from '../services/api';
import { parseStepInfo } from '../utils/stepParser';

interface ScanConfigModalProps {
  localAgent: any;
  preloadedPrinters: any[];
  onClose: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function ScanConfigModal({ localAgent, preloadedPrinters, onClose, showToast }: ScanConfigModalProps) {
  const [printers, setPrinters] = useState<any[]>(() => {
    if (!preloadedPrinters || preloadedPrinters.length === 0) return [];
    return preloadedPrinters.filter((p: any) => {
      const n = (p.name || '').toLowerCase();
      return !n.includes('unknown') && !n.includes('hb test') && !n.includes('[debug]') && p.type !== 'error';
    });
  });
  const [loadingPrinters, setLoadingPrinters] = useState<boolean>(false);
  const [selectedPrinterIds, setSelectedPrinterIds] = useState<string[]>([]);
  const [copierCredentials, setCopierCredentials] = useState<Record<string, any>>({});
  
  const [scanName, setScanName] = useState(() => `Scangox_${Math.floor(Date.now() / 1000)}`);
  const [scanEmail, setScanEmail] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Step-by-step progress state (shows 1 clean step at a time)
  const [activePrinterName, setActivePrinterName] = useState('');
  const [scanCount, setScanCount] = useState<number | null>(null);
  const [currentStepInfo, setCurrentStepInfo] = useState({
    currentStep: 1,
    totalSteps: 3,
    title: 'Đang chuẩn bị khởi tạo Scan...',
    percent: 15,
    isFinished: false,
    isSuccess: false
  });

  useEffect(() => {
    const initData = async () => {
      // Load copier auth credentials from VPS DB (PrinterAuthCredential)
      const credsMap = await fetchCopierCredentialsApi();
      if (credsMap) {
        setCopierCredentials(credsMap);
      }

      if (localAgent) {
        let data = preloadedPrinters;
        if (!data || data.length === 0) {
           setLoadingPrinters(true);
           data = await fetchPrintersFromAgent(localAgent.agent_uid);
           setLoadingPrinters(false);
        }
        
        const filtered = (data || []).filter((p: any) => {
           const n = (p.name || '').toLowerCase();
           return !n.includes('unknown') && !n.includes('hb test') && !n.includes('[debug]') && p.type !== 'error';
        });
        setPrinters(filtered);
        
        if (filtered.length > 0) {
           setSelectedPrinterIds([filtered[0].id]);
        }
      }
    };
    initData();
  }, [localAgent]);

  const handleTogglePrinter = (id: string) => {
    setSelectedPrinterIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleStartProcess = async () => {
    if (selectedPrinterIds.length === 0) return;
    
    if (scanEmail && !scanEmail.includes('@')) {
       alert("Email không hợp lệ");
       return;
    }
    if (!scanName) {
       alert("Vui lòng nhập tên thư mục scan");
       return;
    }

    setIsProcessing(true);
    setIsFinished(false);
    setScanCount(null);

    const targets = printers.filter(p => selectedPrinterIds.includes(p.id));

    for (let i = 0; i < targets.length; i++) {
      const p = targets[i];
      const targetPrefix = targets.length > 1 ? `[Máy ${i + 1}/${targets.length}] ` : '';
      setActivePrinterName(`${p.name} (${p.ip})`);
      setCurrentStepInfo({
        currentStep: 1,
        totalSteps: 3,
        title: `${targetPrefix}Khởi tạo tiến trình cấu hình Scan...`,
        percent: 20,
        isFinished: false,
        isSuccess: false
      });

      // Resolve copier auth user/pass automatically from VPS credentials map by MAC or IP
      const rawMac = String(p.mac || p.mac_address || p.mac_id || '').toUpperCase();
      const colMac = rawMac.replace(/-/g, ':');
      const normMac = colMac.replace(/:/g, '');
      const cred = copierCredentials[colMac] || copierCredentials[normMac] || copierCredentials[p.ip] || {};
      const printerUser = cred.user || cred.auth_user || 'admin';
      const printerPass = cred.password || cred.auth_password || '';

      try {
        const res = await installScanApi(p.ip, p.type, scanName, localAgent?.agent_uid, printerUser, printerPass);
        let finalStatus = 'failed';
        let finalOutput = '';

        // Check for WIM tunnel HTML non-JSON response safely
        if (res && res.error && (res.error.includes('Unexpected token') || res.error.includes('Tunnel Pro'))) {
           const safeMsg = '⚠️ Không thể gửi lệnh qua đường hầm WIM máy in. Vui lòng thực hiện trên máy có Agent local :9173.';
           setCurrentStepInfo({
             currentStep: 3,
             totalSteps: 3,
             title: safeMsg,
             percent: 100,
             isFinished: true,
             isSuccess: false
           });
           if (showToast) showToast(safeMsg, 'warning');
           
           recordJobToVpsApi({
             agentUid: localAgent?.agent_uid,
             printerName: p.name,
             ip: p.ip,
             commandType: 'trigger_utility',
             commandParams: {
               action: 'exec_utility',
               command: p.type?.toLowerCase() === 'toshiba' ? 'toshiba_create_scan' : 'ricoh_create_scan',
               printer_ip: p.ip,
               auth_user: printerUser,
               auth_password: printerPass,
               target_name: scanName
             },
             status: 'failed',
             output: safeMsg,
             errorMessage: safeMsg
           });
           continue;
        }

        if (res.ok && res.command_id) {
           setCurrentStepInfo({
             currentStep: 1,
             totalSteps: 3,
             title: `${targetPrefix}Đang tạo thư mục Scan và gửi lệnh đến thiết bị...`,
             percent: 35,
             isFinished: false,
             isSuccess: false
           });
           const result = await trackCommandProgressPromise(res.command_id, (txt: string) => {
              const step = parseStepInfo(txt, 3, p.name);
              setCurrentStepInfo({
                ...step,
                title: targetPrefix + step.title
              });
           });
           if (result.ok || result.success) {
              finalStatus = 'success';

              // Trích xuất số lượng scan từ address_book hoặc logs
              let detectedScanCount: number | null = null;
              const addrBook = result.address_book || result.address_book_sync || result.stData?.address_book || result.stData?.address_book_sync;
              if (addrBook) {
                 if (typeof addrBook.count === 'number') detectedScanCount = addrBook.count;
                 else if (addrBook.count && !isNaN(Number(addrBook.count))) detectedScanCount = Number(addrBook.count);
                 else if (Array.isArray(addrBook.address_list)) detectedScanCount = addrBook.address_list.length;
              }
              if (detectedScanCount === null && typeof result.message === 'string') {
                 const jsonMatch = result.message.match(/__ADDRESS_BOOK_JSON_START__([\s\S]*?)__ADDRESS_BOOK_JSON_END__/);
                 if (jsonMatch) {
                    try {
                       const parsed = JSON.parse(jsonMatch[1].trim());
                       if (parsed.count !== undefined && !isNaN(Number(parsed.count))) detectedScanCount = Number(parsed.count);
                       else if (Array.isArray(parsed.address_list)) detectedScanCount = parsed.address_list.length;
                    } catch (e) {}
                 }
                 if (detectedScanCount === null) {
                    const match = result.message.match(/TỔNG CỘNG LẤY ĐƯỢC:\s*(\d+)\s*MỤC/i)
                               || result.message.match(/(\d+)\s*mục/i)
                               || result.message.match(/"count":\s*(\d+)/);
                    if (match) {
                       detectedScanCount = parseInt(match[1], 10);
                    }
                 }
              }

              finalOutput = detectedScanCount !== null ? `Số lượng scan: ${detectedScanCount}` : 'Cấu hình hoàn tất!';
              setScanCount(detectedScanCount);
              setCurrentStepInfo({
                currentStep: 3,
                totalSteps: 3,
                title: `${targetPrefix}Cấu hình Scan to Folder thành công!`,
                percent: 100,
                isFinished: true,
                isSuccess: true
              });
           } else {
              finalStatus = 'failed';
              let errText = result.error || result.message || 'Thất bại khi tạo điểm Scan';
              if (typeof errText === 'string' && errText.includes('LỖI THỰC THI:')) {
                 const m = errText.match(/LỖI THỰC THI:\s*([^\n\r]+)/);
                 if (m) errText = `Lỗi: ${m[1].trim()}`;
              } else if (typeof errText === 'string' && errText.length > 150) {
                 errText = 'Không thể tạo điểm scan (Vui lòng kiểm tra lại quyền Admin hoặc IP máy in)';
              }
              finalOutput = errText;
              setCurrentStepInfo({
                currentStep: 3,
                totalSteps: 3,
                title: `${targetPrefix}${finalOutput}`,
                percent: 100,
                isFinished: true,
                isSuccess: false
              });
           }
        } else {
           finalStatus = 'failed';
           finalOutput = res.error || res.logs || 'Lỗi cấu hình Scan';
           setCurrentStepInfo({
             currentStep: 3,
             totalSteps: 3,
             title: `${targetPrefix}${finalOutput}`,
             percent: 100,
             isFinished: true,
             isSuccess: false
           });
        }

        // Record Job & Log to VPS database
        if (!res?.is_vps) {
          recordJobToVpsApi({
            agentUid: localAgent?.agent_uid,
            printerName: p.name,
            ip: p.ip,
            commandType: 'trigger_utility',
            commandParams: {
              action: 'exec_utility',
              command: p.type?.toLowerCase() === 'toshiba' ? 'toshiba_create_scan' : 'ricoh_create_scan',
              printer_ip: p.ip,
              auth_user: printerUser,
              auth_password: printerPass,
              target_name: scanName
            },
            status: finalStatus,
            output: finalOutput,
            errorMessage: finalStatus === 'success' ? '' : finalOutput
          });
        }
      } catch (err: any) {
        setCurrentStepInfo({
          currentStep: 3,
          totalSteps: 3,
          title: `${targetPrefix}${err.message || 'Lỗi không xác định'}`,
          percent: 100,
          isFinished: true,
          isSuccess: false
        });
      }

      if (scanEmail) {
         try {
           await addLanEmailApi(scanEmail, scanName, localAgent?.agent_uid);
         } catch (err) {
           // silent fail
         }
      }
    }

    setIsProcessing(false);
    setIsFinished(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">Cấu hình Scan to Folder</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {!isProcessing && !isFinished ? (
            <>
              <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: 600 }}>Tên thư mục Scan</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="VD: Scan_Ketoan" 
                    value={scanName} 
                    onChange={e => setScanName(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: 600 }}>Email nhận thông báo (Không bắt buộc)</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="nhanvien@gox.vn" 
                    value={scanEmail} 
                    onChange={e => setScanEmail(e.target.value)} 
                  />
                </div>
              </div>

              <p>
                <strong>Chọn máy photocopy cần tạo điểm Scan</strong><br />
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Tài khoản Web máy in được tự động tải từ VPS (theo MAC/IP). Hệ thống tự động khởi tạo cổng FTP local và chèn danh bạ.</span>
              </p>

              <div className="modal-printers-grid">
                {loadingPrinters ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Đang quét thiết bị...</div>
                ) : printers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 20px' }}>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>🖨️</div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>
                      {!localAgent ? 'Chưa kết nối PrintAgent cục bộ' : 'Không tìm thấy máy photocopy trong mạng LAN'}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {!localAgent 
                        ? 'Vui lòng tải và khởi chạy ứng dụng PrintAgent trên máy tính này để quét danh sách máy in.' 
                        : 'Hãy kiểm tra lại máy in đã bật nguồn và cùng lớp mạng LAN với máy tính.'}
                    </div>
                  </div>
                ) : (
                  printers.map(p => {
                    const isChecked = selectedPrinterIds.includes(p.id);

                    return (
                      <label key={p.id} className={`printer-checkbox-item ${isChecked ? 'selected' : ''}`}>
                        <input type="checkbox" className="printer-checkbox-input" checked={isChecked} onChange={() => handleTogglePrinter(p.id)} />
                        <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ flex: 1.5 }}>
                            <div style={{ fontWeight: 600, fontSize: '14px', wordBreak: 'break-word' }}>{p.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>IP: {p.ip} {p.mac ? `• MAC: ${p.mac}` : ''}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div style={{ padding: '36px 20px', textAlign: 'center' }}>
              {isProcessing && (
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', marginBottom: '16px' }}>
                  <span className="spinner" style={{ width: '28px', height: '28px', border: '3px solid #bfdbfe', borderTopColor: '#3b82f6' }}></span>
                </div>
              )}
              {isFinished && currentStepInfo.isSuccess && (
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
                  ✓
                </div>
              )}
              {isFinished && !currentStepInfo.isSuccess && (
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
                  ✕
                </div>
              )}

              <div style={{ marginBottom: '12px' }}>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '4px 16px', 
                  borderRadius: '9999px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  background: isFinished ? (currentStepInfo.isSuccess ? '#dcfce7' : '#fee2e2') : '#e0f2fe',
                  color: isFinished ? (currentStepInfo.isSuccess ? '#15803d' : '#991b1b') : '#0369a1'
                }}>
                  {isFinished ? (currentStepInfo.isSuccess ? 'Hoàn thành' : 'Thất bại') : `Bước ${currentStepInfo.currentStep}/${currentStepInfo.totalSteps}`}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                {currentStepInfo.title}
              </h3>

              {activePrinterName && (
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: scanCount !== null ? '12px' : '24px' }}>
                  Thiết bị: <strong>{activePrinterName}</strong> • Thư mục: <strong>{scanName}</strong>
                </p>
              )}

              {scanCount !== null && (
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: '#ecfdf5', 
                    color: '#065f46', 
                    border: '1px solid #a7f3d0', 
                    padding: '6px 14px', 
                    borderRadius: '8px', 
                    fontWeight: 600, 
                    fontSize: '13.5px' 
                  }}>
                    <span>📊</span>
                    <span>Số lượng mục scan:</span>
                    <span style={{ background: '#059669', color: '#ffffff', fontWeight: 700, padding: '1px 8px', borderRadius: '5px', fontSize: '13px' }}>
                      {scanCount}
                    </span>
                  </span>
                </div>
              )}

              <div style={{ width: '100%', maxWidth: '380px', height: '8px', background: '#e2e8f0', borderRadius: '9999px', margin: '0 auto', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${currentStepInfo.percent}%`, 
                  height: '100%', 
                  background: isFinished ? (currentStepInfo.isSuccess ? '#10b981' : '#ef4444') : '#3b82f6', 
                  transition: 'width 0.4s ease' 
                }}></div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!isProcessing && !isFinished ? (
            <button 
              className="btn-submit-install install-scan" 
              onClick={handleStartProcess}
              disabled={selectedPrinterIds.length === 0}
            >
              Thực hiện cài đặt ngay
            </button>
          ) : (
            <button 
              className="btn-submit-install" 
              onClick={onClose}
              disabled={isProcessing}
              style={{ background: '#64748b' }}
            >
              {isProcessing ? 'Đang thực thi...' : 'Đóng cửa sổ'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
