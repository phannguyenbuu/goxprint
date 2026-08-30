import React, { useState, useEffect } from 'react';
import { fetchPrintersFromAgent, installDriverApi, testPrinterLoginApi, trackCommandProgressPromise, recordJobToVpsApi } from '../services/api';
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
           return !n.includes('unknown') && !n.includes('hb test') && !n.includes('[debug]') && p.type !== 'error';
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
         stepId: `driver_${p.id}`,
         text: `Cài đặt Driver cho ${p.name}`,
         status: 'pending',
         subText: 'Đang chờ khởi tạo...'
       });
    });
    setProcessSteps(steps);

    for (let i = 0; i < targets.length; i++) {
      const p = targets[i];
      const stepId = `driver_${p.id}`;

      setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'running', subText: 'Đang gửi lệnh đến PrintAgent...' } : s));
      
      const driverInfo = selectedDrivers[p.id];
      if (!driverInfo) {
         setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'failed', subText: 'Chưa chọn Driver phù hợp' } : s));
         continue;
      }

      try {
        const res = await installDriverApi(p.id, driverInfo.brand, driverInfo.model, driverInfo.name, driverInfo.url, localAgent?.agent_uid, p.ip, p.mac);
        let finalStatus = 'failed';
        let finalOutput = '';

        if (res.ok && res.command_id) {
           setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, subText: 'Đang tải gói cài đặt và đăng ký Driver Windows...' } : s));
           const result = await trackCommandProgressPromise(res.command_id, (txt: string) => {
              setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, subText: txt } : s));
           });
           if (result.ok || result.success) {
              finalStatus = 'success';
              finalOutput = result.message || 'Cài đặt Driver hoàn tất!';
              setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'success', subText: finalOutput } : s));
           } else {
              finalStatus = 'failed';
              finalOutput = result.error || result.message || 'Thất bại khi cài đặt';
              setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'failed', subText: finalOutput } : s));
           }
        } else {
           finalStatus = 'failed';
           finalOutput = res.error || 'Lỗi gửi lệnh cài driver';
           setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'failed', subText: finalOutput } : s));
        }

        // Record Job & Log to VPS database
        recordJobToVpsApi({
          agentUid: localAgent?.agent_uid,
          printerName: p.name,
          ip: p.ip,
          commandType: 'install_driver',
          commandParams: {
            action: 'install_driver',
            brand: driverInfo.brand,
            model: driverInfo.model,
            driver_name: driverInfo.name,
            driver_url: driverInfo.url,
            printer_ip: p.ip
          },
          status: finalStatus,
          output: finalOutput,
          errorMessage: finalStatus === 'success' ? '' : finalOutput
        });
      } catch (err: any) {
        setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, status: 'failed', subText: err.message || 'Lỗi không xác định' } : s));
      }
    }

    setIsProcessing(false);
    setIsFinished(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">Cài đặt Driver tự động</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {!isProcessing && !isFinished ? (
            <>
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label className="form-label" style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>1. Tài khoản WIM máy in (Để Test Đăng nhập)</label>
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

              <p>
                <strong>2. Chọn máy photocopy cần cài Driver</strong><br />
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Hệ thống tự động khớp Driver phù hợp với model máy in.</span>
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
                    let options: any[] = [];
                    if (p._suggested && p._suggested.length > 0) {
                      p._suggested.forEach((sd: any) => {
                        const brand = sd.brand || '';
                        const model = sd.model || '';
                        sd.drivers.forEach((drv: any) => {
                           options.push({
                             brand, model, name: drv.name, url: drv.url, label: `[${brand.toUpperCase()}] ${model} (${drv.name})`
                           });
                        });
                      });
                    }

                    return (
                      <label key={p.id} className={`printer-checkbox-item ${isChecked ? 'selected' : ''}`}>
                        <input type="checkbox" className="printer-checkbox-input" checked={isChecked} onChange={() => handleTogglePrinter(p.id)} />
                        <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ flex: 1.5 }}>
                            <div style={{ fontWeight: 600, fontSize: '14px', wordBreak: 'break-word' }}>{p.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>IP: {p.ip} {p.mac ? `• MAC: ${p.mac}` : ''}</div>
                          </div>
                          {options.length > 0 && (
                            <div style={{ flex: 2 }} onClick={e => e.stopPropagation()}>
                              <select 
                                className="form-input" 
                                style={{ padding: '4px', fontSize: '13px', width: '100%', textOverflow: 'ellipsis' }}
                                value={selectedDrivers[p.id]?.name || ''}
                                onChange={e => handleDriverChange(p.id, e)}
                              >
                                {options.map((opt, i) => (
                                  <option key={i} value={opt.name} data-url={opt.url} data-brand={opt.brand} data-model={opt.model}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
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
            <button className="btn-submit-install install-driver" disabled={selectedPrinterIds.length === 0 || loadingPrinters} onClick={handleStartProcess}>
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
