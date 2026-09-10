import React, { useState, useEffect } from 'react';
import { fetchPrintersFromAgent, installDriverApi, testPrinterLoginApi, trackCommandProgressPromise, recordJobToVpsApi } from '../services/api';
import { loadDriverCatalogs, matchPrinterDrivers } from '../utils/drivers';
import { parseStepInfo } from '../utils/stepParser';

interface DriverInstallModalProps {
  localAgent: any;
  preloadedPrinters: any[];
  onClose: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function DriverInstallModal({ localAgent, preloadedPrinters, onClose, showToast }: DriverInstallModalProps) {
  const [printers, setPrinters] = useState<any[]>(() => {
    if (!preloadedPrinters || preloadedPrinters.length === 0) return [];
    return preloadedPrinters.filter((p: any) => {
      const n = (p.name || '').toLowerCase();
      return !n.includes('unknown') && !n.includes('hb test') && !n.includes('[debug]') && p.type !== 'error';
    });
  });
  const [loadingPrinters, setLoadingPrinters] = useState<boolean>(false);
  const [selectedPrinterIds, setSelectedPrinterIds] = useState<string[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, any>>({});
  
  const [printerUser, setPrinterUser] = useState('admin');
  const [printerPass, setPrinterPass] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [testingAuth, setTestingAuth] = useState(false);
  const [testAuthStatus, setTestAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testAuthErrorMsg, setTestAuthErrorMsg] = useState('');

  // Step-by-step progress state (shows 1 clean step at a time)
  const [activePrinterName, setActivePrinterName] = useState('');
  const [currentStepInfo, setCurrentStepInfo] = useState({
    currentStep: 1,
    totalSteps: 6,
    title: 'Đang chuẩn bị tiến trình cài đặt...',
    percent: 10,
    isFinished: false,
    isSuccess: false
  });

  useEffect(() => {
    const initData = async () => {
      await loadDriverCatalogs();
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
    
    setIsProcessing(true);
    setIsFinished(false);

    const targets = printers.filter(p => selectedPrinterIds.includes(p.id));

    for (let i = 0; i < targets.length; i++) {
      const p = targets[i];
      const targetPrefix = targets.length > 1 ? `[Máy ${i + 1}/${targets.length}] ` : '';
      setActivePrinterName(`${p.name} (${p.ip})`);
      setCurrentStepInfo({
        currentStep: 1,
        totalSteps: 6,
        title: `${targetPrefix}Khởi tạo tiến trình cài đặt driver...`,
        percent: 15,
        isFinished: false,
        isSuccess: false
      });
      
      const driverInfo = selectedDrivers[p.id];
      if (!driverInfo) {
        setCurrentStepInfo({
          currentStep: 6,
          totalSteps: 6,
          title: `${targetPrefix}Chưa chọn driver phù hợp cho máy in`,
          percent: 100,
          isFinished: true,
          isSuccess: false
        });
        continue;
      }

      try {
        const res = await installDriverApi(p.id, driverInfo.brand, driverInfo.model, driverInfo.name, driverInfo.url, localAgent?.agent_uid, p.ip, p.mac);
        let finalStatus = 'failed';
        let finalOutput = '';

        if (res.ok && res.command_id) {
           setCurrentStepInfo({
             currentStep: 2,
             totalSteps: 6,
             title: `${targetPrefix}Đang nạp gói cài đặt driver...`,
             percent: 25,
             isFinished: false,
             isSuccess: false
           });
           const result = await trackCommandProgressPromise(res.command_id, (txt: string) => {
              const step = parseStepInfo(txt, 6, p.name);
              setCurrentStepInfo({
                ...step,
                title: targetPrefix + step.title
              });
           });
           if (result.ok || result.success) {
              finalStatus = 'success';
              finalOutput = `Cài đặt Driver cho ${p.name} thành công!`;
              setCurrentStepInfo({
                currentStep: 6,
                totalSteps: 6,
                title: `${targetPrefix}Cài đặt Driver hoàn tất thành công!`,
                percent: 100,
                isFinished: true,
                isSuccess: true
              });
           } else {
              finalStatus = 'failed';
              finalOutput = result.error || result.message || 'Thất bại khi cài đặt';
              setCurrentStepInfo({
                currentStep: 6,
                totalSteps: 6,
                title: `${targetPrefix}${finalOutput}`,
                percent: 100,
                isFinished: true,
                isSuccess: false
              });
           }
        } else {
           finalStatus = 'failed';
           finalOutput = res.error || 'Lỗi gửi lệnh cài driver';
           setCurrentStepInfo({
             currentStep: 6,
             totalSteps: 6,
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
        }
      } catch (err: any) {
        setCurrentStepInfo({
          currentStep: 6,
          totalSteps: 6,
          title: `${targetPrefix}${err.message || 'Lỗi không xác định'}`,
          percent: 100,
          isFinished: true,
          isSuccess: false
        });
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
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                  Máy in: <strong>{activePrinterName}</strong>
                </p>
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
