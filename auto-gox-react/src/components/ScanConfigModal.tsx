import React, { useState, useEffect } from 'react';
import { fetchPrintersFromAgent, installScanApi, addLanEmailApi, trackCommandProgressPromise, recordJobToVpsApi, fetchCopierCredentialsApi } from '../services/api';

interface ScanConfigModalProps {
  localAgent: any;
  preloadedPrinters: any[];
  onClose: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function ScanConfigModal({ localAgent, preloadedPrinters, onClose, showToast }: ScanConfigModalProps) {
  const [printers, setPrinters] = useState<any[]>([]);
  const [loadingPrinters, setLoadingPrinters] = useState(true);
  const [selectedPrinterIds, setSelectedPrinterIds] = useState<string[]>([]);
  const [copierCredentials, setCopierCredentials] = useState<Record<string, any>>({});
  
  const [scanName, setScanName] = useState(() => `Scangox_${Math.floor(Date.now() / 1000)}`);
  const [scanEmail, setScanEmail] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSteps, setProcessSteps] = useState<any[]>([]); 
  const [isFinished, setIsFinished] = useState(false);
  const [debugScript, setDebugScript] = useState<string | null>(null);

  useEffect(() => {
    const handleShowDebug = (e: any) => {
      setDebugScript(prev => prev ? prev + "\n\n=================================\n\n" + e.detail : e.detail);
    };
    window.addEventListener('show-debug-script', handleShowDebug);
    return () => window.removeEventListener('show-debug-script', handleShowDebug);
  }, []);

  useEffect(() => {
    const initData = async () => {
      setLoadingPrinters(true);
      
      // Load copier auth credentials from VPS DB (PrinterAuthCredential)
      const credsMap = await fetchCopierCredentialsApi();
      if (credsMap) {
        setCopierCredentials(credsMap);
      }

      if (localAgent) {
        let data = preloadedPrinters;
        if (!data || data.length === 0) {
           data = await fetchPrintersFromAgent(localAgent.agent_uid);
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
      setLoadingPrinters(false);
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

    setDebugScript(null);
    setIsProcessing(true);
    setIsFinished(false);

    const steps: any[] = [];
    const targets = printers.filter(p => selectedPrinterIds.includes(p.id));

    targets.forEach(p => {
       steps.push({
         stepId: `scan_${p.id}`,
         text: `Cấu hình Scan to Folder cho ${p.name}`,
         status: 'pending',
         subText: 'Đang chờ thực thi...'
       });
    });
    setProcessSteps(steps);

    for (let i = 0; i < targets.length; i++) {
      const p = targets[i];
      const stepId = `scan_${p.id}`;

      // Resolve copier auth user/pass automatically from VPS credentials map by MAC or IP
      const rawMac = String(p.mac || p.mac_address || p.mac_id || '').toUpperCase();
      const colMac = rawMac.replace(/-/g, ':');
      const normMac = colMac.replace(/:/g, '');
      const cred = copierCredentials[colMac] || copierCredentials[normMac] || copierCredentials[p.ip] || {};
      const printerUser = cred.user || cred.auth_user || 'admin';
      const printerPass = cred.password || cred.auth_password || '';

      setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'running', subText: `Đang gửi lệnh tạo điểm Scan (User: ${printerUser})...` } : s));

      try {
        const res = await installScanApi(p.ip, p.type, scanName, localAgent?.agent_uid, printerUser, printerPass);
        let finalStatus = 'failed';
        let finalOutput = '';

        // Check for WIM tunnel HTML non-JSON response safely
        if (res && res.error && (res.error.includes('Unexpected token') || res.error.includes('Tunnel Pro'))) {
           const safeMsg = '⚠️ Không thể gửi lệnh qua đường hầm WIM máy in. Vui lòng thực hiện trên máy có Agent local :9173.';
           setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'failed', subText: safeMsg } : s));
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
           setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, subText: 'Đang khởi tạo cổng FTP local & Đăng ký danh bạ máy in...' } : s));
           const result = await trackCommandProgressPromise(res.command_id, (txt: string) => {
              setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, subText: txt } : s));
           });
           if (result.ok || result.success) {
              finalStatus = 'success';
              finalOutput = result.message || 'Cấu hình điểm Scan hoàn tất!';
              setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'success', subText: finalOutput } : s));
           } else {
              finalStatus = 'failed';
              finalOutput = result.error || result.message || 'Thất bại khi tạo điểm Scan';
              setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'failed', subText: finalOutput } : s));
           }
        } else {
           finalStatus = 'failed';
           finalOutput = res.error || res.logs || 'Lỗi cấu hình Scan';
           setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'failed', subText: finalOutput } : s));
        }

        // Record Job & Log to VPS database
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
      } catch (err: any) {
        setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'failed', subText: err.message || 'Lỗi không xác định' } : s));
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
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>🖨️</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Không tìm thấy máy photocopy tương thích.</div>
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
            <div className="process-steps-list">
              {processSteps.map(s => (
                <div key={s.stepId} className={`process-step-card ${s.status}`}>
                  <div className="step-header">
                    <div className="step-title">{s.text}</div>
                    <div className={`step-badge ${s.status}`}>
                      {s.status === 'pending' && 'Đang chờ'}
                      {s.status === 'running' && 'Đang chạy...'}
                      {s.status === 'success' && 'Hoàn thành'}
                      {s.status === 'failed' && 'Thất bại'}
                    </div>
                  </div>
                  <div className="step-subtext">{s.subText}</div>
                </div>
              ))}

              {debugScript && (
                <div style={{ marginTop: '16px', background: '#1e293b', borderRadius: '8px', padding: '12px', color: '#f8fafc', fontSize: '11px', fontFamily: 'monospace' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#38bdf8' }}>Debug Script</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(debugScript);
                        if (showToast) showToast('Đã copy Debug Script!', 'success');
                      }}
                      style={{ padding: '2px 8px', fontSize: '11px', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto' }}>{debugScript}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!isProcessing && !isFinished ? (
            <button 
              className="btn-primary" 
              onClick={handleStartProcess}
              disabled={selectedPrinterIds.length === 0}
            >
              Thực hiện cài đặt ngay
            </button>
          ) : (
            <button 
              className="btn-secondary" 
              onClick={onClose}
              disabled={isProcessing}
            >
              {isProcessing ? 'Đang thực thi...' : 'Đóng cửa sổ'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
