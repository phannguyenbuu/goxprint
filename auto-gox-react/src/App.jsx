import React, { useState, useEffect } from 'react';
import { probeLocalAgent, syncUtiCommands, fetchPrintersFromAgent } from './services/api';
import PrinterModal from './components/PrinterModal';
import ToastContainer from './components/ToastContainer';
import './index.css';

export default function App() {
  const [localAgent, setLocalAgent] = useState(null);
  const [isAgentMissing, setIsAgentMissing] = useState(false);
  const [publicIp, setPublicIp] = useState('');
  const [activeMode, setActiveMode] = useState(null); // 'driver', 'scan', 'both'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // App initialization states
  const [isAppReady, setIsAppReady] = useState(false);
  const [initStatusText, setInitStatusText] = useState('Đang khởi tạo hệ thống...');
  const [preloadedPrinters, setPreloadedPrinters] = useState([]);

  // Form states
  const [supportTitle, setSupportTitle] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportAddress, setSupportAddress] = useState('');
  const [supportDesc, setSupportDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle states
  const [openFile, setOpenFile] = useState(true);
  const [openFolder, setOpenFolder] = useState(false);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Giữ thông báo lỗi lâu hơn (10 giây) để người dùng kịp đọc, thông báo thường 3 giây
    const duration = type === 'error' ? 10000 : 3000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const connectAgent = async () => {
    try {
      const agent = await probeLocalAgent();
      if (agent) {
        setLocalAgent(agent);
        setIsAgentMissing(false);
        return agent;
      }
    } catch (err) {
      // ignore
    }
    return null;
  };

  useEffect(() => {
    let pollInterval;
    
    const initApp = async () => {
      // 1. Tải UtiCommands
      setInitStatusText('Đang đồng bộ dữ liệu lệnh (UtiCommands)...');
      await syncUtiCommands();

      // 2. Kết nối Agent
      setInitStatusText('Đang kết nối PrintAgent cục bộ...');
      let agent = await connectAgent();
      
      if (!agent) {
        setInitStatusText('Đang chờ kết nối PrintAgent...');
        // Poll every 3 seconds for Agent
        pollInterval = setInterval(async () => {
          const successAgent = await connectAgent();
          if (successAgent) {
            clearInterval(pollInterval);
            showToast('Đã kết nối thành công với PrintAgent cục bộ.', 'success');
            proceedWithScan(successAgent);
          }
        }, 3000);

        // Show modal after 10 seconds of failing
        setTimeout(() => {
          setLocalAgent(prev => {
            if (!prev) setIsAgentMissing(true);
            return prev;
          });
          setIsAppReady(true);
          setInitStatusText('');
        }, 10000);
      } else {
        proceedWithScan(agent);
      }
    };
    
    const proceedWithScan = async (agentObj) => {
       setInitStatusText('Đang quét thiết bị mạng LAN (Deep Scan)...');
       const printers = await fetchPrintersFromAgent(agentObj.agent_uid);
       setPreloadedPrinters(printers);
       setInitStatusText('');
       setIsAppReady(true);
    };
    
    initApp();
    
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setPublicIp(data.ip))
      .catch(err => console.error("Could not fetch public IP", err));
      
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  const openModal = (mode) => {
    if (!isAppReady) return;
    setActiveMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveMode(null);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Đã copy: ' + text, 'success');
    } catch(err) {
      showToast('Không thể copy', 'warning');
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportDesc.trim()) {
      showToast('Vui lòng nhập mô tả chi tiết lỗi', 'warning');
      return;
    }
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      showToast('Đã gửi yêu cầu hỗ trợ thành công', 'success');
      setSupportTitle('');
      setSupportPhone('');
      setSupportAddress('');
      setSupportDesc('');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleToggleFile = (e) => {
    setOpenFile(e.target.checked);
    showToast('Đã lưu cấu hình tự động mở file', 'success');
  };

  const handleToggleFolder = (e) => {
    setOpenFolder(e.target.checked);
    showToast('Đã lưu cấu hình tự động mở thư mục', 'success');
  };

  const handleScrollToSupport = () => {
    document.querySelector('.support-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* SVG Gradient Definitions */}
      <svg style={{width: 0, height: 0, position: 'absolute'}} width="0" height="0">
        <defs>
          <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
      </svg>

      <header>
        <div className="container header-wrapper">
          <div className="logo">
            <img src="/printagx.com.png" alt="GoxPrint Logo" style={{height: '40px', width: 'auto', display: 'block'}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap'}}>
            <button
              className="btn-header-download"
              title="Tải về PrintAgent Cục Bộ (Windows)"
              onClick={() => setIsAgentMissing(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
              </svg>
              <span>Tải PrintAgent 📥</span>
            </button>
            <button className="btn-header-support" title="Gửi yêu cầu hỗ trợ bảo hành" onClick={handleScrollToSupport}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
              <span>Yêu cầu Hỗ trợ & Bảo hành</span>
            </button>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>Hệ thống trực tuyến</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {/* 1. Computer Information */}
        <section className="sys-info-section" aria-labelledby="sys-info-title">
          <h2 id="sys-info-title" className="section-title">
            Thông tin máy tính
            <span className="badge">Live</span>
          </h2>
          <div className="sys-info-grid">
            {/* Public IP Card */}
            <div className="info-card public">
              <div className="info-card-left">
                <span className="info-card-label">IP PUBLIC (Mạng ngoài)</span>
                <span className="info-card-value">
                  {publicIp || (!isAppReady ? 'Đang tải...' : 'Không khả dụng')}
                </span>
              </div>
              <div className="info-card-right">
                <button className="btn-copy" title="Sao chép IP Public" onClick={() => handleCopy(publicIp || '')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* LAN IP Card */}
            <div className="info-card lan">
              <div className="info-card-left">
                <span className="info-card-label">IP LAN (Mạng nội bộ)</span>
                <span className="info-card-value">
                  {localAgent ? localAgent.pc_ip : '127.0.0.1'}
                </span>
              </div>
              <div className="info-card-right">
                <button className="btn-copy" title="Sao chép IP LAN" onClick={() => handleCopy(localAgent?.pc_ip || '127.0.0.1')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main Actions Grid */}
        <section className="actions-section">
          <div className="actions-header" style={{ marginTop: '30px', marginBottom: '24px', textAlign: 'center' }}>
            <p className="main-subheading" style={{ fontSize: '1.1rem', color: '#4b5563', margin: 0 }}>Giải pháp cài đặt máy in và thiết lập Scan to Folder một chạm</p>
            {!isAppReady && initStatusText && (
               <p style={{ marginTop: '12px', color: '#3b82f6', fontWeight: 500 }}>
                 <span className="spinner" style={{ display: 'inline-block', marginRight: '8px', width: '14px', height: '14px', border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                 {initStatusText}
               </p>
            )}
          </div>
          
          <div className="action-grid" style={{ opacity: isAppReady ? 1 : 0.5, pointerEvents: isAppReady ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
            {/* Install Driver */}
            <div id="btn-action-driver" className="action-btn-card" role="button" tabIndex="0" onClick={() => openModal('driver')} style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'center' }}>
                <div className="action-icon-wrapper" style={{ width: '48px', height: '48px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <path d="M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"></path>
                  </svg>
                </div>
                <span className="action-title" style={{ fontSize: '18px' }}>Cài Driver</span>
              </div>
              <span className="action-desc" style={{ whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>Cấu hình driver in ấn tự động cho máy tính của bạn</span>
            </div>

            {/* Config Scan */}
            <div id="btn-action-scan" className="action-btn-card" role="button" tabIndex="0" onClick={() => openModal('scan')} style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'center' }}>
                <div className="action-icon-wrapper" style={{ width: '48px', height: '48px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M12 12v9"></path>
                    <path d="m8 17 4 4 4-4"></path>
                  </svg>
                </div>
                <span className="action-title" style={{ fontSize: '18px' }}>Cấu hình Scan</span>
              </div>
              <span className="action-desc" style={{ whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>Tự động cấu hình thư mục chia sẻ để nhận bản scan</span>
            </div>

            {/* Install All */}
            <div id="btn-action-both" className="action-btn-card" role="button" tabIndex="0" onClick={() => openModal('both')} style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'center' }}>
                <div className="action-icon-wrapper" style={{ width: '48px', height: '48px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <span className="action-title" style={{ fontSize: '18px' }}>Cài Driver + Scan</span>
              </div>
              <span className="action-desc" style={{ whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>Thiết lập trọn gói in ấn và quét tài liệu nhanh chóng</span>
            </div>
          </div>
        </section>

        {/* 3. Configuration Scan Options */}
        <section className="config-section" aria-labelledby="config-title">
          <h2 id="config-title" className="section-title">Cấu hình máy file scan</h2>
          <div className="toggle-group">
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-title">Tự động mở file khi có bản scan mới</span>
                <span className="toggle-desc">Tài liệu định dạng PDF/Image sẽ lập tức hiển thị sau khi quét hoàn tất</span>
              </div>
              <label className="switch">
                <input type="checkbox" checked={openFile} onChange={handleToggleFile} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-title">Tự động mở thư mục khi có bản scan mới</span>
                <span className="toggle-desc">Mở nhanh Windows Explorer định vị thư mục chứa tập tin scan vừa tải về</span>
              </div>
              <label className="switch">
                <input type="checkbox" checked={openFolder} onChange={handleToggleFolder} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* 4. Support Form */}
        <section className="support-section" aria-labelledby="support-title">
          <h2 id="support-title" className="section-title">Gửi yêu cầu hỗ trợ kỹ thuật & Bảo hành</h2>
          
          <form onSubmit={handleSupportSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Tiêu đề yêu cầu</label>
                <input type="text" className="form-input" placeholder="VD: Máy in Apeos C350 báo kẹt giấy..." required value={supportTitle} onChange={e => setSupportTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Số điện thoại liên hệ</label>
                <input type="tel" className="form-input" placeholder="VD: 0912345678" required value={supportPhone} onChange={e => setSupportPhone(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ đặt máy</label>
              <input type="text" className="form-input" placeholder="VD: Tầng 4, Tòa nhà Gox, Hà Nội" required value={supportAddress} onChange={e => setSupportAddress(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả chi tiết lỗi</label>
              <textarea className="form-textarea" rows="4" placeholder="Vui lòng mô tả chi tiết biểu hiện lỗi kỹ thuật..." required value={supportDesc} onChange={e => setSupportDesc(e.target.value)}></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Mức độ ưu tiên xử lý</label>
              <div className="priority-selector">
                <div className="priority-option">
                  <input type="radio" id="prio-low" name="priority" value="low" checked={priority==='low'} onChange={e => setPriority(e.target.value)} />
                  <label className="priority-label" htmlFor="prio-low">Thấp</label>
                </div>
                <div className="priority-option">
                  <input type="radio" id="prio-medium" name="priority" value="medium" checked={priority==='medium'} onChange={e => setPriority(e.target.value)} />
                  <label className="priority-label" htmlFor="prio-medium">Vừa</label>
                </div>
                <div className="priority-option">
                  <input type="radio" id="prio-high" name="priority" value="high" checked={priority==='high'} onChange={e => setPriority(e.target.value)} />
                  <label className="priority-label" htmlFor="prio-high">Cao</label>
                </div>
                <div className="priority-option">
                  <input type="radio" id="prio-urgent" name="priority" value="urgent" checked={priority==='urgent'} onChange={e => setPriority(e.target.value)} />
                  <label className="priority-label" htmlFor="prio-urgent">Khẩn cấp</label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-submit-install install-both" disabled={isSubmitting}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
              <span>{isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu bảo hành'}</span>
            </button>
          </form>
        </section>

      </main>

      <footer>
        <div className="container">
          <p>&copy; 2026 Auto-Gox Support Portal. Thiết kế giao diện hiện đại & chuyên nghiệp.</p>
        </div>
      </footer>

      {isAgentMissing && (
        <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', zIndex: 99999, alignItems: 'center', justifyContent: 'center', padding: '20px', display: 'flex'}}>
          <div style={{background: '#ffffff', borderRadius: '20px', maxWidth: '620px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', position: 'relative'}}>
            <button onClick={() => setIsAgentMissing(false)} style={{position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'}}>✕</button>
            <div style={{background: '#f8fafc', padding: '16px', textAlign: 'center', borderBottom: '1px solid #e2e8f0'}}>
              <img src="/warning.jpg" alt="Hướng dẫn cài đặt PrintAgent" style={{maxWidth: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: '12px'}} />
            </div>
            <div style={{padding: '24px', textAlign: 'center'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px'}}>Cần cài đặt & kích hoạt PrintAgent</h3>
              <p style={{fontSize: '14px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px'}}>Vui lòng tải xuống và khởi chạy ứng dụng PrintAgent trên máy tính này để tự động kết nối máy photocopy và quét tài liệu Scan.</p>
              <a href="https://download.printagentx.com/printagentinstall.exe" style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#3b82f6', color: 'white', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '16px', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)', transition: 'all 0.2s'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg>
                <span>Tải xuống PrintAgent (Windows)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <PrinterModal activeMode={activeMode} localAgent={localAgent} preloadedPrinters={preloadedPrinters} onClose={closeModal} showToast={showToast} />}
      <ToastContainer toasts={toasts} />
    </>
  );
}
