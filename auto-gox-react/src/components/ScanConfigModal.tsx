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

      setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'running', subText: 'Đang gửi lệnh tạo điểm Scan...' } : s));

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
           const result = await trackCommandProgressPromise(res.command_id);
           if (result.success) {
              finalStatus = 'success';
              finalOutput = result.message || 'Cấu hình điểm Scan hoàn tất!';
              setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'success', subText: finalOutput } : s));
           } else {
              finalStatus = 'failed';
              finalOutput = result.message || 'Thất bại khi tạo điểm Scan';
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
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label className="form-label" style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>1. Tài khoản WIM máy in (Để Đăng ký Danh bạ)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ flex: 1 }} 
                    placeholder="Tên đăng nhập (VD: admin)" 
                    value={printerUser} 
                    onChange={e => setPrinterUser(e.target.value)} 
                  />
                  <input 
                    type="password" 
                    className="form-input" 
                    style={{ flex: 1 }} 
                    placeholder="Mật khẩu" 
                    value={printerPass} 
                    onChange={e => setPrinterPass(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    className="btn-test-auth" 
                    onClick={handleTestAuth} 
                    disabled={testingAuth}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {testingAuth ? 'Đang test...' : 'Test Pass'}
                  </button>
                  {testAuthStatus === 'success' && <span style={{ color: 'green', fontSize: '18px', fontWeight: 'bold' }}>✅</span>}
                  {testAuthStatus === 'error' && <span style={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>❌</span>}
                </div>
                {testAuthStatus === 'error' && testAuthErrorMsg && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', fontWeight: 'bold' }}>
                    Lỗi: {testAuthErrorMsg}
                  </div>
                )}
              </div>

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
                <strong>2. Chọn máy photocopy cần tạo điểm Scan</strong><br />
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Hệ thống tự động khởi tạo cổng FTP local và chèn vị trí danh bạ máy photo.</span>
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
            <div className="progress-status-box">
              {processSteps.map(step => (
                <div key={step.stepId} style={{ marginBottom: '6px' }}>
                  <span style={{ color: step.status === 'failed' ? '#ef4444' : (step.status === 'success' ? '#10b981' : '#38bdf8') }}>
                    [{step.status.toUpperCase()}]
                  </span> {step.text} - {step.subText}
                </div>
              ))}
            </div>
          )}

          {debugScript && (
            <div style={{ marginTop: '15px', background: '#1e1e1e', borderRadius: '6px', padding: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#00ff00', fontSize: '13px', fontWeight: 'bold' }}>Debug Script</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { navigator.clipboard.writeText(debugScript); if(showToast) showToast('Đã copy code!', 'success'); }} style={{ background: '#007bff', color: 'white', border: 'none', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px' }}>Copy</button>
                  <button onClick={() => setDebugScript(null)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px' }}>Đóng</button>
                </div>
              </div>
              <textarea
                readOnly
                value={debugScript}
                style={{
                  width: '100%', height: '120px', background: '#000', color: '#00ff00',
                  fontFamily: 'monospace', fontSize: '11px', padding: '8px',
                  border: '1px solid #333', borderRadius: '4px', resize: 'vertical'
                }}
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!isProcessing && !isFinished ? (
            <button className="btn-submit-install install-scan" disabled={selectedPrinterIds.length === 0 || loadingPrinters} onClick={handleStartProcess}>
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
