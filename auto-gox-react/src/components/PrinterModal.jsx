import React, { useState, useEffect } from 'react';
import { fetchPrintersFromAgent, installDriverApi, installScanApi, testPrinterLoginApi, addLanEmailApi, trackCommandProgressPromise, LOCAL_AGENT_PORT } from '../services/api';
import { loadDriverCatalogs, matchPrinterDrivers } from '../utils/drivers';

export default function PrinterModal({ activeMode, localAgent, preloadedPrinters, onClose, showToast }) {
  const [printers, setPrinters] = useState([]);
  const [loadingPrinters, setLoadingPrinters] = useState(true);
  const [selectedPrinterIds, setSelectedPrinterIds] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({});
  
  const [scanName, setScanName] = useState(() => `Scangox_${Math.floor(Date.now() / 1000)}`);
  const [scanEmail, setScanEmail] = useState('');
  const [printerUser, setPrinterUser] = useState('admin');
  const [printerPass, setPrinterPass] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSteps, setProcessSteps] = useState([]); 
  const [isFinished, setIsFinished] = useState(false);
  const [testingAuth, setTestingAuth] = useState(false);
  const [testAuthStatus, setTestAuthStatus] = useState('idle'); // 'idle', 'success', 'error'
  const [testAuthErrorMsg, setTestAuthErrorMsg] = useState('');
  const [debugScript, setDebugScript] = useState(null);

  useEffect(() => {
    const handleShowDebug = (e) => {
      setDebugScript(prev => prev ? prev + "\n\n=================================\n\n" + e.detail : e.detail);
    };
    window.addEventListener('show-debug-script', handleShowDebug);
    return () => window.removeEventListener('show-debug-script', handleShowDebug);
  }, []);

  const handleTestAuth = async () => {
    if (selectedPrinterIds.length === 0) {
      if (showToast) showToast('Vui lòng tick chọn ít nhất 1 máy photocopy ở bên dưới để Test Password.', 'warning');
      return;
    }
    const targetId = selectedPrinterIds[0];
    const printer = printers.find(p => p.id === targetId);
    if (!printer) return;
    
    setTestingAuth(true);
    setTestAuthStatus('idle');
    setTestAuthErrorMsg('');
    setDebugScript(null); // Clear old script when re-testing
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
    } catch (e) {
      if (showToast) showToast(`Lỗi không xác định khi kết nối máy in`, 'error');
      setTestAuthStatus('error');
      setTestAuthErrorMsg(e.toString());
    } finally {
      setTestingAuth(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoadingPrinters(true);
      await loadDriverCatalogs();
      if (localAgent) {
        let data = preloadedPrinters;
        if (!data || data.length === 0) {
           data = await fetchPrintersFromAgent(localAgent.agent_uid);
        }
        
        const filtered = data.filter(p => {
           const n = (p.name || '').toLowerCase();
           return !n.includes('unknown') && !n.includes('hb test');
        });
        
        const defaultDrivers = {};
        filtered.forEach(p => {
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

  const handleTogglePrinter = (id) => {
    setSelectedPrinterIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleDriverChange = (printerId, e) => {
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

  const getTitle = () => {
    if (activeMode === 'driver') return "Cài đặt Driver tự động";
    if (activeMode === 'scan') return "Cấu hình Scan to Folder";
    return "Cài đặt thiết bị";
  };

  const getButtonClass = () => {
    if (activeMode === 'driver') return "btn-submit-install install-driver";
    if (activeMode === 'scan') return "btn-submit-install install-scan";
    return "btn-submit-install install-both";
  };

  const handleStartProcess = async () => {
    if (selectedPrinterIds.length === 0) return;
    
    setDebugScript(null);
    setIsProcessing(true);
    setIsFinished(false);

    if (scanEmail && !scanEmail.includes('@')) {
       alert("Email không hợp lệ");
       return;
    }
    if (!scanName) {
       alert("Vui lòng nhập tên thư mục scan");
       return;
    }

    if (scanEmail && localAgent) {
       await addLanEmailApi(scanEmail, localAgent.agent_uid);
    }

    const selectedPrinters = printers.filter(p => selectedPrinterIds.includes(p.id));
    const newSteps = [];
    
    selectedPrinters.forEach((printer, i) => {
      if (activeMode === 'driver' || activeMode === 'both') {
        const dInfo = selectedDrivers[printer.id];
        if (!dInfo) {
           alert(`Không có driver được chọn cho máy in ${printer.name}`);
           return;
        }
        newSteps.push({ 
          stepId: `driver-${printer.id}`, 
          type: 'driver',
          printer,
          driverInfo: dInfo,
          status: 'pending', 
          text: `[${printer.ip}] Cài Driver cho ${printer.name}`, 
          subText: 'Đang chờ...' 
        });
      }
      if (activeMode === 'scan' || activeMode === 'both') {
        newSteps.push({ 
          stepId: `scan-${printer.id}`, 
          type: 'scan',
          printer,
          status: 'pending', 
          text: `[${printer.ip}] Cấu hình Scan cho ${printer.name}`, 
          subText: 'Đang chờ...' 
        });
      }
    });

    if (newSteps.length === 0) return;

    setProcessSteps(newSteps);
    setIsProcessing(true);

    const updateStep = (stepId, updates) => {
      setProcessSteps(prev => prev.map(s => s.stepId === stepId ? { ...s, ...updates } : s));
    };

    for (const step of newSteps) {
      updateStep(step.stepId, { status: 'active', subText: 'Đang kết nối...' });
      
      try {
        if (step.type === 'driver') {
          const { brand, model, name: driverName, url: driverUrl } = step.driverInfo;
          const driverRes = await installDriverApi(step.printer.id, brand, model, driverName, driverUrl, localAgent?.agent_uid);
          
          if (driverRes.ok && driverRes.command_id) {
             const trackerRes = await trackCommandProgressPromise(driverRes.command_id, (msg) => {
               updateStep(step.stepId, { subText: msg });
             });
             if (trackerRes.ok) {
               updateStep(step.stepId, { status: 'success', subText: 'Cài đặt Driver thành công!' });
             } else {
               updateStep(step.stepId, { status: 'failed', subText: trackerRes.error || 'Thất bại' });
             }
          } else {
             updateStep(step.stepId, { status: 'failed', subText: driverRes.error || 'Lỗi tạo lệnh' });
          }
        } 
        else if (step.type === 'scan') {
          const scanRes = await installScanApi(step.printer.id, step.printer.type, scanName, localAgent?.agent_uid, printerUser, printerPass);
          if (scanRes.ok && scanRes.command_id) {
             const trackerRes = await trackCommandProgressPromise(scanRes.command_id, (msg) => {
               updateStep(step.stepId, { subText: msg });
             });
             if (trackerRes.ok) {
               updateStep(step.stepId, { status: 'success', subText: 'Cấu hình Scan thành công!' });
             } else {
               updateStep(step.stepId, { status: 'failed', subText: trackerRes.error || 'Thất bại' });
             }
          } else {
             updateStep(step.stepId, { status: 'failed', subText: scanRes.error || 'Lỗi tạo lệnh' });
          }
        }
      } catch (err) {
        updateStep(step.stepId, { status: 'failed', subText: err.message || 'Lỗi không xác định' });
      }
    }

    // Auto-open logic on success
    let finalHasErrors = false;
    setProcessSteps(prev => {
       const err = prev.some(s => s.status === 'failed');
       finalHasErrors = err;
       return prev;
    });

    if (!finalHasErrors) {
       if (activeMode === 'driver' || activeMode === 'both') {
          newSteps.filter(s => s.type === 'driver').forEach(s => {
             const ip = s.printer.ip;
             const script = `
import subprocess
ip = "${ip}"
try:
    ps_out = subprocess.check_output(['powershell', '-Command', f"(Get-Printer | Where-Object {{$_.PortName -match '{ip}'}} | Select-Object -First 1).Name"], text=True, creationflags=0x08000000).strip()
    if ps_out:
        subprocess.Popen(['rundll32', 'printui.dll,PrintUIEntry', '/o', '/n', ps_out])
        subprocess.Popen(['rundll32', 'printui.dll,PrintUIEntry', '/p', '/n', ps_out])
    else:
        subprocess.Popen(['control', 'printers'])
except:
    subprocess.Popen(['control', 'printers'])
`;
             fetch(`http://127.0.0.1:${LOCAL_AGENT_PORT}/api/local/exec`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ script }) });
          });
       }
       if (activeMode === 'scan' || activeMode === 'both') {
          const script = `import os\nfolder = os.path.join(os.environ.get('TEMP', 'C:\\\\'), 'GoPrinxAgent', 'ftp', '${scanName}')\nos.makedirs(folder, exist_ok=True)\nos.system(f'explorer "{folder}"')`;
          fetch(`http://127.0.0.1:${LOCAL_AGENT_PORT}/api/local/exec`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ script }) });
       }
    }

    setIsFinished(true);
  };

  const hasErrors = processSteps.some(s => s.status === 'failed');
  const showDriverOptions = activeMode === 'driver' || activeMode === 'both';
  const showScanOptions = activeMode === 'scan' || activeMode === 'both';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{getTitle()}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {!isProcessing ? (
            <>
              {showScanOptions && (
                <div style={{marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)'}}>
                  <p><strong>1. Cấu hình thư mục Scan</strong></p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{display: 'block', marginBottom: '4px', fontSize: '13px'}}>Tên thư mục lưu Scan:</label>
                      <input type="text" className="form-input" value={scanName} onChange={e => setScanName(e.target.value)} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{display: 'block', marginBottom: '4px', fontSize: '13px'}}>Email nhận báo cáo (Tùy chọn):</label>
                      <input type="email" className="form-input" value={scanEmail} onChange={e => setScanEmail(e.target.value)} placeholder="Nhập email nếu cần..." />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{display: 'block', marginBottom: '4px', fontSize: '13px'}}>Tài khoản Web máy in (mặc định 'admin'):</label>
                      <input type="text" className="form-input" value={printerUser} onChange={e => {setPrinterUser(e.target.value); setTestAuthStatus('idle');}} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{display: 'block', marginBottom: '4px', fontSize: '13px'}}>Mật khẩu Web máy in (nếu có):</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="password" className="form-input" style={{flex: 1}} value={printerPass} onChange={e => {setPrinterPass(e.target.value); setTestAuthStatus('idle');}} placeholder="Bỏ trống nếu không có mật khẩu" />
                        <button type="button" className="btn-test-auth" onClick={handleTestAuth} disabled={testingAuth} title="Tick chọn 1 máy bên dưới để Test" style={{whiteSpace: 'nowrap'}}>
                          {testingAuth ? 'Đang thử...' : (selectedPrinterIds.length > 0 ? `Test Pass (${printers.find(p => p.id === selectedPrinterIds[0])?.ip || ''})` : 'Test Pass')}
                        </button>
                        {testAuthStatus === 'success' && <span style={{color: 'green', fontSize: '18px', fontWeight: 'bold'}} title="Đăng nhập thành công">✅</span>}
                        {testAuthStatus === 'error' && <span style={{color: 'red', fontSize: '18px', fontWeight: 'bold'}} title={testAuthErrorMsg}>❌</span>}
                      </div>
                      {testAuthStatus === 'error' && testAuthErrorMsg && (
                        <div style={{color: '#ef4444', fontSize: '12px', marginTop: '4px', fontWeight: 'bold'}}>
                          Lỗi: {testAuthErrorMsg}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <p>
                <strong>{showScanOptions ? '2.' : '1.'} Chọn máy photocopy đích</strong><br />
                <span style={{color: 'var(--text-muted)', fontSize: '13px'}}>Hệ thống tự động phát hiện các máy in trong mạng LAN. Vui lòng tick chọn máy bạn muốn cài.</span>
              </p>
              
              <div className="modal-printers-grid">
                {loadingPrinters ? (
                  <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>Đang quét thiết bị...</div>
                ) : printers.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '20px'}}>
                    <div style={{fontSize: '32px', marginBottom: '10px'}}>🖨️</div>
                    <div style={{color: 'var(--text-muted)', fontSize: '13px'}}>Không tìm thấy máy photocopy hoạt động nào.</div>
                  </div>
                ) : (
                  printers.map((p) => {
                    const isChecked = selectedPrinterIds.includes(p.id);
                    let driverSelectHtml = null;
                    if (showDriverOptions) {
                      let options = [];
                      if (p._suggested && p._suggested.length > 0) {
                        p._suggested.forEach(sd => {
                          const brand = sd.brand || '';
                          const model = sd.model || '';
                          sd.drivers.forEach(drv => {
                             options.push({
                               brand, model, name: drv.name, url: drv.url, label: `${brand.toUpperCase()} - ${model} (${drv.name})`
                             });
                          });
                        });
                      }
                      if (options.length > 0) {
                        driverSelectHtml = (
                          <div style={{flex: 2}}>
                            <select 
                              className="form-input" 
                              style={{padding: '4px', fontSize: '13px', width: '100%', textOverflow: 'ellipsis'}}
                              value={selectedDrivers[p.id]?.name || ''}
                              onChange={(e) => handleDriverChange(p.id, e)}
                              onClick={e => e.stopPropagation()}
                            >
                              {options.map((opt, i) => (
                                <option key={i} value={opt.name} data-url={opt.url} data-brand={opt.brand} data-model={opt.model}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }
                    }

                    return (
                      <label key={p.id} className={`printer-checkbox-item ${isChecked ? 'selected' : ''}`}>
                        <input type="checkbox" className="printer-checkbox-input" checked={isChecked} onChange={() => handleTogglePrinter(p.id)} />
                        <div style={{flex: 1, display: 'flex', gap: '10px', alignItems: 'center'}}>
                          <div style={{flex: 1.5}}>
                            <div style={{fontWeight: 600, fontSize: '14px', wordBreak: 'break-word'}}>{p.name}</div>
                            <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>IP: {p.ip} {p.mac ? `• MAC: ${p.mac}` : ''}</div>
                          </div>
                          {driverSelectHtml}
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
                <div key={step.stepId} style={{marginBottom: '6px'}}>
                  <span style={{color: step.status === 'failed' ? '#ef4444' : (step.status === 'success' ? '#10b981' : '#38bdf8')}}>
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
          {!isProcessing ? (
             <button className={getButtonClass()} disabled={selectedPrinterIds.length === 0 || loadingPrinters} onClick={handleStartProcess}>
               {activeMode === 'driver' ? 'Tự động tải & Cài đặt' : (activeMode === 'scan' ? 'Cấu hình Scan' : 'Tự động cài đặt')}
             </button>
          ) : (
             isFinished && (
               <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
                 <button className="btn-submit-install" style={{ flex: 1 }} onClick={onClose}>
                   {hasErrors ? 'Đóng (Có lỗi)' : 'Hoàn tất'}
                 </button>
               </div>
             )
          )}
        </div>
      </div>
    </div>
  );
}
