import React, { useState, useEffect } from 'react';
import { fetchPrintersFromAgent, installScanApi, testPrinterLoginApi, addLanEmailApi, trackCommandProgressPromise, recordJobToVpsApi } from '../services/api';

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
  
  const [scanName, setScanName] = useState(() => `Scangox_${Math.floor(Date.now() / 1000)}`);
  const [scanEmail, setScanEmail] = useState('');
  const [printerUser, setPrinterUser] = useState('admin');
  const [printerPass, setPrinterPass] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSteps, setProcessSteps] = useState<any[]>([]); 
  const [isFinished, setIsFinished] = useState(false);
  const [testingAuth, setTestingAuth] = useState(false);
  const [testAuthStatus, setTestAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testAuthErrorMsg, setTestAuthErrorMsg] = useState('');
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
      if (localAgent) {
        let data = preloadedPrinters;
        if (!data || data.length === 0) {
           data = await fetchPrintersFromAgent(localAgent.agent_uid);
        }
        
        const filtered = (data || []).filter((p: any) => {
           const n = (p.name || '').toLowerCase();
           return !n.includes('unknown') && !n.includes('hb test');
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

  const handleTestAuth = async () => {
    if (selectedPrinterIds.length === 0) {
      if (showToast) showToast('Vui lòng chọn ít nhất 1 máy photocopy để Test Password.', 'warning');
      return;
    }
    const targetId = selectedPrinterIds[0];
    const printer = printers.find(p => p.id === targetId);
    if (!printer) return;
    
    setTestingAuth(true);
    setTestAuthStatus('idle');
    setTestAuthErrorMsg('');
    setDebugScript(null);
    if (showToast) showToast(`Đang kiểm tra đăng nhập trên ${printer.name}...`, 'info');
    try {
      const res = await testPrinterLoginApi(printer.ip, printer.type, printerUser, printerPass);
      if (res.ok) {
        if (showToast) showToast(`Đã test đăng nhập thành công trên ${printer.name}!`, 'success');
        setTestAuthStatus('success');
      } else {
        if (showToast) showToast(`Lỗi đăng nhập: ${res.error || 'Sai thông tin'}`, 'error');
        setTestAuthStatus('error');
        setTestAuthErrorMsg(res.error || 'Sai thông tin');
      }
    } catch (e: any) {
      if (showToast) showToast(`Lỗi không xác định khi kết nối máy in`, 'error');
      setTestAuthStatus('error');
      setTestAuthErrorMsg(e.toString());
    } finally {
      setTestingAuth(false);
    }
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
         id: `scan_${p.id}`,
         title: `Cấu hình Scan to Folder cho ${p.name}`,
         status: 'pending',
         detail: 'Đang chờ thực thi...'
       });
    });
    setProcessSteps(steps);

    for (let i = 0; i < targets.length; i++) {
      const p = targets[i];
      const stepId = `scan_${p.id}`;

      setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'running', detail: 'Đang gửi lệnh tạo điểm Scan...' } : s));

      try {
        const res = await installScanApi(p.ip, p.type, scanName, localAgent?.agent_uid, printerUser, printerPass);
        let finalStatus = 'failed';
        let finalOutput = '';

        // Check for WIM tunnel HTML non-JSON response safely
        if (res && res.error && (res.error.includes('Unexpected token') || res.error.includes('Tunnel Pro'))) {
           const safeMsg = '⚠️ Không thể gửi lệnh qua đường hầm WIM máy in. Vui lòng thực hiện trên máy có Agent local :9173.';
           setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'error', detail: safeMsg } : s));
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
           setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, detail: 'Đang khởi tạo cổng FTP local & Đăng ký danh bạ máy in...' } : s));
           const result = await trackCommandProgressPromise(res.command_id);
           if (result.success) {
              finalStatus = 'success';
              finalOutput = result.message || 'Cấu hình điểm Scan hoàn tất!';
              setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'success', detail: finalOutput } : s));
           } else {
              finalStatus = 'failed';
              finalOutput = result.message || 'Thất bại khi tạo điểm Scan';
              setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'error', detail: finalOutput } : s));
           }
        } else {
           finalStatus = 'failed';
           finalOutput = res.error || res.logs || 'Lỗi cấu hình Scan';
           setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'error', detail: finalOutput } : s));
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
        setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'error', detail: err.message || 'Lỗi không xác định' } : s));
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
      <div className="modal-container">
        <div className="modal-header">
          <h2>Cấu hình Scan to Folder</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {!isProcessing && !isFinished ? (
            <>
              <div className="printer-selection-section">
                <label className="section-label">1. Chọn máy photocopy cần tạo điểm Scan</label>
                {loadingPrinters ? (
                  <div className="loading-state">Đang dò tìm danh sách máy in trong mạng LAN...</div>
                ) : printers.length === 0 ? (
                  <div className="empty-state">Không tìm thấy máy in tương thích.</div>
                ) : (
                  <div className="printer-list">
                    {printers.map(p => (
                      <div key={p.id} className={`printer-card ${selectedPrinterIds.includes(p.id) ? 'selected' : ''}`} onClick={() => handleTogglePrinter(p.id)}>
                        <div className="printer-checkbox">
                          <input type="checkbox" checked={selectedPrinterIds.includes(p.id)} onChange={() => {}} />
                        </div>
                        <div className="printer-info">
                          <span className="printer-name">{p.name}</span>
                          <span className="printer-ip">IP: {p.ip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="scan-config-form" style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

              <div className="auth-section" style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <label className="section-label" style={{ marginBottom: '8px', display: 'block' }}>2. Tài khoản WIM máy in (Để Đăng ký Danh bạ)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Tên đăng nhập (VD: admin)" 
                    value={printerUser} 
                    onChange={e => setPrinterUser(e.target.value)} 
                  />
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Mật khẩu" 
                    value={printerPass} 
                    onChange={e => setPrinterPass(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    className="btn-test-auth" 
                    onClick={handleTestAuth} 
                    disabled={testingAuth}
                    style={{ background: '#475569', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', height: '40px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {testingAuth ? 'Đang test...' : 'Test Pass'}
                  </button>
                </div>
                {testAuthStatus === 'success' && <div style={{ color: '#16a34a', fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>✅ Đăng nhập máy in thành công!</div>}
                {testAuthStatus === 'error' && <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>❌ {testAuthErrorMsg}</div>}
              </div>
            </>
          ) : (
            <div className="progress-section">
              <h3 style={{ marginBottom: '16px' }}>Tiến trình Cấu hình Scan</h3>
              <div className="steps-list">
                {processSteps.map(step => (
                  <div key={step.id} className={`step-item ${step.status}`}>
                    <div className="step-icon">
                      {step.status === 'running' && '⏳'}
                      {step.status === 'success' && '✅'}
                      {step.status === 'error' && '❌'}
                      {step.status === 'pending' && '⚪'}
                    </div>
                    <div className="step-content">
                      <span className="step-title">{step.title}</span>
                      <span className="step-detail">{step.detail}</span>
                    </div>
                  </div>
                ))}
              </div>

              {debugScript && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Log thực thi Python:</label>
                  <pre style={{ background: '#0f172a', color: '#38bdf8', padding: '12px', borderRadius: '8px', fontSize: '11px', maxHeight: '180px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                    {debugScript}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!isProcessing && !isFinished ? (
            <button className="btn-submit-install install-scan" onClick={handleStartProcess} disabled={selectedPrinterIds.length === 0}>
              Tạo điểm Scan ngay
            </button>
          ) : (
            <button className="btn-submit-install" onClick={onClose} style={{ background: '#64748b' }}>
              Đóng cửa sổ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
