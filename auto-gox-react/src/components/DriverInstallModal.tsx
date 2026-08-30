import React, { useState, useEffect } from 'react';
import { fetchPrintersFromAgent, installDriverApi, testPrinterLoginApi, trackCommandProgressPromise } from '../services/api';
import { loadDriverCatalogs, matchPrinterDrivers } from '../utils/drivers';

interface DriverInstallModalProps {
  localAgent: any;
  preloadedPrinters: any[];
  onClose: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function DriverInstallModal({ localAgent, preloadedPrinters, onClose, showToast }: DriverInstallModalProps) {
  const [printers, setPrinters] = useState<any[]>([]);
  const [loadingPrinters, setLoadingPrinters] = useState(true);
  const [selectedPrinterIds, setSelectedPrinterIds] = useState<string[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, any>>({});
  
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
      await loadDriverCatalogs();
      if (localAgent) {
        let data = preloadedPrinters;
        if (!data || data.length === 0) {
           data = await fetchPrintersFromAgent(localAgent.agent_uid);
        }
        
        const filtered = (data || []).filter((p: any) => {
           const n = (p.name || '').toLowerCase();
           return !n.includes('unknown') && !n.includes('hb test');
        });
        
        const defaultDrivers: Record<string, any> = {};
        filtered.forEach((p: any) => {
           const matches = matchPrinterDrivers(p.name);
           if (matches.length > 0 && matches[0].drivers.length > 0) {
              const bestMatch = matches[0];
              defaultDrivers[p.id] = {
                 name: bestMatch.drivers[0].name,
                 url: bestMatch.drivers[0].url,
                 brand: bestMatch.brand,
                 model: bestMatch.model
              };
           }
           p._suggested = matches;
        });
        setSelectedDrivers(defaultDrivers);
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

  const handleDriverChange = (printerId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    setSelectedDrivers(prev => ({
       ...prev,
       [printerId]: {
         name: selectedOption.value,
         url: selectedOption.getAttribute('data-url'),
         brand: selectedOption.getAttribute('data-brand'),
         model: selectedOption.getAttribute('data-model')
       }
    }));
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
    
    setDebugScript(null);
    setIsProcessing(true);
    setIsFinished(false);

    const steps: any[] = [];
    const targets = printers.filter(p => selectedPrinterIds.includes(p.id));

    targets.forEach(p => {
       steps.push({
         id: `driver_${p.id}`,
         title: `Cài đặt Driver cho ${p.name}`,
         status: 'pending',
         detail: 'Đang chờ khởi tạo...'
       });
    });
    setProcessSteps(steps);

    for (let i = 0; i < targets.length; i++) {
      const p = targets[i];
      const stepId = `driver_${p.id}`;

      setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'running', detail: 'Đang gửi lệnh đến PrintAgent...' } : s));
      
      const driverInfo = selectedDrivers[p.id];
      if (!driverInfo) {
         setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'error', detail: 'Chưa chọn Driver phù hợp' } : s));
         continue;
      }

      try {
        const res = await installDriverApi(p.id, driverInfo.brand, driverInfo.model, driverInfo.name, driverInfo.url, localAgent?.agent_uid);
        if (res.ok && res.command_id) {
           setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, detail: 'Đang tải gói cài đặt và đăng ký Driver Windows...' } : s));
           const result = await trackCommandProgressPromise(res.command_id);
           if (result.success) {
              setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'success', detail: result.message || 'Cài đặt Driver hoàn tất!' } : s));
           } else {
              setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'error', detail: result.message || 'Thất bại khi cài đặt' } : s));
           }
        } else {
           setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'error', detail: res.error || 'Lỗi gửi lệnh cài driver' } : s));
        }
      } catch (err: any) {
        setProcessSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'error', detail: err.message || 'Lỗi không xác định' } : s));
      }
    }

    setIsProcessing(false);
    setIsFinished(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Cài đặt Driver tự động</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {!isProcessing && !isFinished ? (
            <>
              <div className="printer-selection-section">
                <label className="section-label">1. Chọn máy photocopy cần cài Driver</label>
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
                        <div className="driver-select-container" onClick={e => e.stopPropagation()}>
                          <select 
                            className="driver-dropdown"
                            value={selectedDrivers[p.id]?.name || ''}
                            onChange={e => handleDriverChange(p.id, e)}
                          >
                            {p._suggested && p._suggested.map((s: any) => 
                              s.drivers.map((d: any) => (
                                <option key={d.name} value={d.name} data-url={d.url} data-brand={s.brand} data-model={s.model}>
                                  [{s.brand}] {d.name}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="auth-section" style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <label className="section-label" style={{ marginBottom: '8px', display: 'block' }}>2. Tài khoản quản trị WIM máy in (Để Test Đăng nhập)</label>
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
              <h3 style={{ marginBottom: '16px' }}>Tiến trình Cài đặt Driver</h3>
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
            <button className="btn-submit-install install-driver" onClick={handleStartProcess} disabled={selectedPrinterIds.length === 0}>
              Thực hiện cài đặt Driver ngay
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
