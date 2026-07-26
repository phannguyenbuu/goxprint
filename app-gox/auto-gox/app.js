document.addEventListener('DOMContentLoaded', () => {
  // Configs
  const LOCAL_AGENT_PORT = 9173;
  const BASE_URL = 'https://agentapi.quanlymay.com';
  
  let localAgent = null; // Stores { lan_uid, agent_uid, pc_name, pc_ip }
  let activePrinters = [];
  let activeMode = null; // 'driver', 'scan', or 'both'
  let totalStepsCount = 0;
  let completedStepsCount = 0;
  
  // Elements
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-indicator span');
  const publicIpEl = document.getElementById('ip-public-val');
  const lanIpEl = document.getElementById('ip-lan-val');
  
  const btnDriver = document.getElementById('btn-action-driver');
  const btnScan = document.getElementById('btn-action-scan');
  const btnBoth = document.getElementById('btn-action-both');
  
  // Modal Elements
  const modal = document.getElementById('install-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('btn-modal-close');
  const modalPrintersList = document.getElementById('modal-printers-list');
  const modalDynamicFields = document.getElementById('modal-dynamic-fields');
  const btnModalSubmit = document.getElementById('btn-modal-submit');
  
  const progressContainer = document.getElementById('modal-progress-container');
  const progressStatusBox = document.getElementById('modal-progress-status');
  
  const formSupport = document.getElementById('form-support');
  const btnSubmitSupport = document.getElementById('btn-submit-support');
  
  const toggleOpenFile = document.getElementById('toggle-open-file');
  const toggleOpenFolder = document.getElementById('toggle-open-folder');

  // Start initialization
  init();

  async function init() {
    initCopyButtons();
    initActionCards();
    initModalEvents();
    initToggleSwitches();
    initSupportForm();
    initFormSubmissions();
    
    // Download Agent Card Button & Modal Handler
    const btnDownloadCard = document.getElementById('btn-download-agent-card');
    const btnCopyLan = document.getElementById('btn-copy-lan');
    const warningModal = document.getElementById('download-warning-modal');
    const btnCloseWarning = document.getElementById('btn-close-warning-modal');

    if (btnDownloadCard && warningModal) {
      btnDownloadCard.addEventListener('click', () => {
        warningModal.style.display = 'flex';
      });
    }

    if (btnCloseWarning && warningModal) {
      btnCloseWarning.addEventListener('click', () => {
        warningModal.style.display = 'none';
      });
      warningModal.addEventListener('click', (e) => {
        if (e.target === warningModal) {
          warningModal.style.display = 'none';
        }
      });
    }

    // Probe local/VPS agent silently on init
    localAgent = await probeLocalAgent();
    
    if (localAgent) {
      await onAgentConnected();
    } else {
      statusDot.style.backgroundColor = '#ef4444';
      statusText.textContent = 'Chưa bật PrintAgent';
      lanIpEl.textContent = 'Chưa bật PrintAgent';
      if (btnCopyLan) btnCopyLan.style.display = 'none';
      if (btnDownloadCard) btnDownloadCard.style.display = 'inline-flex';
      startBackgroundProbing();
    }
    
    // Load public IP
    fetchPublicIP();
  }

  /**
   * Action trigger when agent successfully connects
   */
  async function onAgentConnected() {
    statusDot.style.backgroundColor = '#22c55e';
    statusText.textContent = 'Đã kết nối PrintAgent';
    lanIpEl.textContent = localAgent.pc_ip || '127.0.0.1';
    
    const btnCopyLan = document.getElementById('btn-copy-lan');
    const btnDownloadCard = document.getElementById('btn-download-agent-card');
    if (btnCopyLan) btnCopyLan.style.display = 'inline-flex';
    if (btnDownloadCard) btnDownloadCard.style.display = 'none';

    showToast('Đã kết nối thành công với PrintAgent cục bộ.', 'success');
    
    // Dismiss overlay if present
    const overlay = document.getElementById('agent-missing-overlay');
    if (overlay) {
      overlay.remove();
    }
    
    // Load agent settings (toggles)
    await loadAgentSettings();
  }

  /**
   * Keep probing in background every 3 seconds if missing at load
   */
  function startBackgroundProbing() {
    const interval = setInterval(async () => {
      if (localAgent) {
        clearInterval(interval);
        return;
      }
      const agent = await probeLocalAgent();
      if (agent) {
        localAgent = agent;
        clearInterval(interval);
        await onAgentConnected();
      }
    }, 3000);
  }

  /**
   * Helper function for VPS API requests with authentication
   */
  function vpsFetch(path, options = {}) {
    const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Token': 'change-me',
      ...(options.headers || {})
    };
    return fetch(url, {
      ...options,
      headers
    });
  }

  /**
   * Probe local PrintAgent configuration on port 9173
   */
  async function probeLocalAgent() {
    const urls = [
      `http://127.0.0.1:${LOCAL_AGENT_PORT}/api/ui/config`,
      `http://localhost:${LOCAL_AGENT_PORT}/api/ui/config`
    ];

    const promises = urls.map(async (url) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && data.lan_uid) {
            return {
              lan_uid: data.lan_uid,
              agent_uid: data.agent_uid || 'administrator',
              pc_name: data.pc_name || 'Administrator',
              pc_ip: data.pc_ip || '127.0.0.1'
            };
          }
        }
      } catch (e) {
        // ignore
      }
      throw new Error('failed');
    });

    try {
      return await Promise.any(promises);
    } catch (e) {
      return null;
    }
  }

  /**
   * Show a beautiful fullscreen overlay if PrintAgent is missing
   */
  function showLocalAgentMissingOverlay() {
    if (document.getElementById('agent-missing-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'agent-missing-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(15, 23, 42, 0.95)';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.color = '#f8fafc';
    overlay.style.fontFamily = 'Inter, sans-serif';
    overlay.style.padding = '24px';
    
    overlay.innerHTML = `
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
        <span style="font-size: 4rem; display: block; margin-bottom: 20px;">⚠️</span>
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 12px; font-family: Outfit, sans-serif;">Không tìm thấy dịch vụ PrintAgent</h2>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
          Để sử dụng dịch vụ cài đặt tự động máy in và quét scan, bạn cần cài đặt và khởi chạy ứng dụng PrintAgent trên máy tính này.
        </p>
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
          <div style="font-size: 12px; color: #64748b; margin-bottom: 4px; animation: pulse 2s infinite;">🔄 Đang quét tự động trong nền...</div>
          <button id="btn-overlay-reconnect" style="background: #3b82f6; border: none; color: #f8fafc; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 15px; cursor: pointer; width: 100%; max-width: 320px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(59,130,246,0.3);">
            🔄 Thử kết nối lại
          </button>
          <a href="https://download.goxprint.com/printagentinstall.exe" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: transparent; border: 1px solid #334155; color: #94a3b8; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; width: 100%; max-width: 320px; transition: all 0.2s;">
            📥 Tải xuống PrintAgent (Windows)
          </a>
          <button onclick="window.location.reload();" style="background: transparent; border: 1px solid #475569; color: #f8fafc; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 15px; cursor: pointer; width: 100%; max-width: 320px; transition: all 0.2s;">
            🔄 Tải lại trang
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const btnReconnect = overlay.querySelector('#btn-overlay-reconnect');
    if (btnReconnect) {
      btnReconnect.addEventListener('click', async () => {
        showToast('Đang thử kết nối lại...', 'info');
        const agent = await probeLocalAgent();
        if (agent) {
          localAgent = agent;
          await onAgentConnected();
        } else {
          showToast('Vẫn chưa kết nối được với PrintAgent. Hãy chắc chắn ứng dụng đang chạy.', 'error');
        }
      });
    }
  }

  /**
   * Action Cards click -> Lazy Load and Open Modal
   */
  function initActionCards() {
    const handleActionClick = async (mode) => {
      if (!localAgent) {
        showToast('Đang kết nối lại với PrintAgent...', 'info');
        localAgent = await probeLocalAgent();
        if (localAgent) {
          await onAgentConnected();
        }
      }
      if (!localAgent) {
        showToast('Không tìm thấy ứng dụng PrintAgent. Vui lòng bật ứng dụng lên!', 'warning');
        showLocalAgentMissingOverlay();
        return;
      }
      activeMode = mode;
      openInstallModal();
    };

    btnDriver.addEventListener('click', () => handleActionClick('driver'));
    btnScan.addEventListener('click', () => handleActionClick('scan'));
    btnBoth.addEventListener('click', () => handleActionClick('both'));
  }

  /**
   * Modal event handlers
   */
  function initModalEvents() {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Close when clicking overlay (outside the modal card)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    const btnHeaderReload = document.getElementById('btn-modal-reload-printers');
    if (btnHeaderReload) {
      btnHeaderReload.addEventListener('click', reloadPrintersList);
    }
  }

  /**
   * Dynamic loading of printers and layout rendering inside Modal
   */
  async function openInstallModal() {
    // Show Modal immediately in loading state
    modal.style.display = 'flex';
    progressContainer.style.display = 'none';
    progressStatusBox.innerHTML = '';
    btnModalSubmit.disabled = false;
    btnModalSubmit.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
      </svg>
      <span>Bắt đầu cài đặt</span>
    `;

    modalPrintersList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); font-style: italic; padding: 20px; width: 100%;">
        <span class="spinner" style="border-top-color:#3b82f6; width:20px; height:20px; margin-right:8px; vertical-align:middle;"></span> 
        Đang quét tìm thiết bị trong mạng LAN...
      </div>
    `;
    modalDynamicFields.innerHTML = '';

    const modalHeaderHint = document.getElementById('modal-header-hint');

    // Set modal title based on mode
    if (activeMode === 'driver') {
      modalTitle.textContent = 'Cài đặt Driver máy photocopy';
      if (modalHeaderHint) modalHeaderHint.style.display = 'none';
    } else if (activeMode === 'scan') {
      modalTitle.textContent = 'Cấu hình quét tài liệu Scan';
      if (modalHeaderHint) modalHeaderHint.style.display = 'block';
    } else {
      modalTitle.textContent = 'Cài đặt trọn gói Driver & Scan';
      if (modalHeaderHint) modalHeaderHint.style.display = 'block';
    }

    // Lazy load printers if not loaded yet
    if (activePrinters.length === 0) {
      await fetchPrintersFromVps();
    }
    
    renderPrintersInModal();
    renderDynamicFormFields();
  }

  /**
   * Fetch LAN printers list from VPS
   */
  async function fetchPrintersFromVps() {
    try {
      const res = await vpsFetch('/api/lan-sites?lead=default');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      
      const rows = data.rows || [];
      const site = rows.find(r => r.lan_uid === localAgent.lan_uid);
      const rawPrinters = site ? (site.printers || []) : [];
      
      // Deduplicate by IP to show a single unique photocopier list in LAN
      const uniquePrinters = [];
      const seenIps = new Set();
      for (const p of rawPrinters) {
        if (!p.ip) continue;
        if (!seenIps.has(p.ip)) {
          seenIps.add(p.ip);
          uniquePrinters.push(p);
        }
      }
      activePrinters = uniquePrinters;
    } catch (err) {
      console.error(err);
      showToast('Không thể kết nối máy chủ để tải danh sách thiết bị!', 'danger');
    }
  }

  async function reloadPrintersList() {
    modalPrintersList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); font-style: italic; padding: 24px; width: 100%;">
        <span class="spinner" style="border-top-color:#3b82f6; width:20px; height:20px; margin-right:8px; vertical-align:middle;"></span> 
        Đang quét và tải lại danh sách thiết bị...
      </div>
    `;
    btnModalSubmit.disabled = true;
    activePrinters = [];
    await fetchPrintersFromVps();
    renderPrintersInModal();
  }

  /**
   * Render checkboxes list of printers inside modal (filter out unknown/hb test, render drivers horizontally)
   */
  function renderPrintersInModal() {
    modalPrintersList.innerHTML = '';
    
    // Filter out unknown and hb test printers, and only include online copiers
    const filteredPrinters = activePrinters.filter(p => {
      const name = (p.printer_name || '').toLowerCase();
      const isOnline = p.is_online === true || p.is_online === 'true';
      return !name.includes('unknown') && !name.includes('hb test') && isOnline;
    });

    if (filteredPrinters.length === 0) {
      modalPrintersList.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 30px 20px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 14px;">
          <span style="font-size: 2.5rem; line-height: 1;">🖨️</span>
          <div style="font-size: 14px; font-weight: 500; color: #94a3b8;">Không tìm thấy máy photocopy hoạt động nào trong mạng LAN của bạn.</div>
          <button id="btn-reload-printers-empty" type="button" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(59,130,246,0.3); transition: all 0.2s;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M23 4v6h-6M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>Tải lại danh sách thiết bị</span>
          </button>
        </div>
      `;
      btnModalSubmit.disabled = true;
      const btnEmptyReload = document.getElementById('btn-reload-printers-empty');
      if (btnEmptyReload) {
        btnEmptyReload.addEventListener('click', reloadPrintersList);
      }
      return;
    }

    const showDriver = (activeMode === 'driver' || activeMode === 'both');

    filteredPrinters.forEach((p, idx) => {
      const isChecked = idx === 0; // check the first printer by default
      
      const row = document.createElement('label');
      row.className = `printer-checkbox-item ${isChecked ? 'selected' : ''}`;
      row.setAttribute('data-id', p.id);
      
      // Driver select box on the right of the row
      let driverContainerHtml = '';
      if (showDriver) {
        const suggested = p.suggested_drivers || [];
        let optionsHtml = '';
        let driverCount = 0;

        suggested.forEach((sd) => {
          const brand = sd.brand || '';
          const modelName = sd.model || '';
          const driversList = sd.drivers || [];
          
          driversList.forEach((drv) => {
            driverCount++;
            optionsHtml += `
              <option value="${escapeHtml(drv.name)}" data-url="${escapeHtml(drv.url || '')}" data-brand="${escapeHtml(brand)}" data-model="${escapeHtml(modelName)}">
                ${escapeHtml(brand.toUpperCase())} - ${escapeHtml(modelName)} (${escapeHtml(drv.name)})
              </option>
            `;
          });
        });

        if (driverCount === 0) {
          driverContainerHtml = `
            <div class="printer-driver-container" style="flex: 2; min-width: 300px; max-width: 600px; color: var(--text-muted); font-size: 13px; font-style: italic; text-align: right;">
              Không tìm thấy driver gợi ý
            </div>
          `;
        } else {
          driverContainerHtml = `
            <div class="printer-driver-container" style="flex: 2; min-width: 300px; max-width: 600px;">
              <select class="form-select printer-driver-select" style="padding: 6px 10px; font-size: 13px; background-color: #ffffff; border-color: var(--border-color); height: auto; width: 100%;">
                ${optionsHtml}
              </select>
            </div>
          `;
        }
      }

      row.innerHTML = `
        <input type="checkbox" class="printer-checkbox-input" ${isChecked ? 'checked' : ''} style="margin-right: 12px; cursor: pointer;">
        <div class="printer-details-wrapper" style="flex: 1; display: flex; align-items: center; justify-content: space-between; gap: 16px; min-width: 0;">
          <div class="printer-info" style="min-width: 140px; flex: 1;">
            <span class="printer-model" style="font-weight: 600; font-size: 14px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(p.printer_name)}">${escapeHtml(p.printer_name)}</span>
            <span class="printer-meta" style="font-size: 12px; color: var(--text-muted); font-family: monospace; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">IP: ${escapeHtml(p.ip)} | MAC: ${escapeHtml(p.mac_id || '—')}</span>
          </div>
          ${driverContainerHtml}
        </div>
      `;

      // Prevent click propagation from driver dropdown to checkbox toggle
      if (showDriver && row.querySelector('.printer-driver-select')) {
        const select = row.querySelector('.printer-driver-select');
        select.addEventListener('click', (e) => {
          e.stopPropagation();
        });
        select.addEventListener('change', (e) => {
          e.stopPropagation();
        });
      }

      // Handle checkbox changed style
      const checkbox = row.querySelector('.printer-checkbox-input');
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          row.classList.add('selected');
        } else {
          row.classList.remove('selected');
        }
      });

      modalPrintersList.appendChild(row);
    });
  }

  /**
   * Render inputs dynamically inside modal
   */
  function renderDynamicFormFields() {
    modalDynamicFields.innerHTML = '';

    if (activeMode === 'scan') {
      modalDynamicFields.innerHTML = `
        <div class="form-group" style="margin-top: 16px;">
          <label class="form-label" for="scan-folder-name">Bước 2: Tên thư mục chứa tệp quét Scan</label>
          <input type="text" id="scan-folder-name" class="form-input" placeholder="Ví dụ: Scan_NhanVien, Scan_PhongKeToan" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="scan-email">Bước 3: Email truy cập Cloud (Scan-to-Cloud) <span style="font-weight: normal; color: #6b7280;">(Không bắt buộc)</span></label>
          <input type="email" id="scan-email" class="form-input" placeholder="nhanvien@doanhnghiep.com">
          <div class="form-hint" style="font-size: 12px; color: #6b7280; margin-top: 4px; line-height: 1.4;">Nếu không nhập email thì bạn đã bỏ qua quyền lợi lưu trữ file scan trực tuyến. Tính năng sẽ sớm ra mắt vào thời gian tới đây.</div>
        </div>
      `;
    } else if (activeMode === 'both') {
      modalDynamicFields.innerHTML = `
        <div class="form-group" style="margin-top: 16px;">
          <label class="form-label" for="scan-folder-name">Bước 2: Tên thư mục chứa tệp quét Scan</label>
          <input type="text" id="scan-folder-name" class="form-input" placeholder="Ví dụ: Scan_PhongBan" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="scan-email">Bước 3: Email nhận tệp quét Scan (Scan-to-Cloud) <span style="font-weight: normal; color: #6b7280;">(Không bắt buộc)</span></label>
          <input type="email" id="scan-email" class="form-input" placeholder="nhanvien@doanhnghiep.com">
          <div class="form-hint" style="font-size: 12px; color: #6b7280; margin-top: 4px; line-height: 1.4;">Nếu không nhập email thì bạn đã bỏ qua quyền lợi lưu trữ file scan trực tuyến. Tính năng sẽ sớm ra mắt vào thời gian tới đây.</div>
        </div>
      `;
    }
  }

  /**
   * Handle modal form submit with multi-printer queue execution
   */
  function initProgressModal(checkedPrinters, activeMode, scanEmail) {
    const progressModal = document.getElementById('progress-modal');
    const titleEl = document.getElementById('progress-modal-title');
    const subtitleEl = document.getElementById('progress-modal-subtitle');
    const progressBar = document.getElementById('progress-modal-bar');
    const stepsContainer = document.getElementById('progress-modal-steps');
    const footerEl = document.getElementById('progress-modal-footer');
    
    // Reset modal state
    titleEl.textContent = 'Đang tiến hành cài đặt';
    subtitleEl.textContent = 'Đang chuẩn bị...';
    progressBar.style.width = '0%';
    stepsContainer.innerHTML = '';
    footerEl.style.display = 'none';
    
    const loaderWrapper = progressModal.querySelector('.loader-circle-wrapper');
    loaderWrapper.innerHTML = `
      <svg class="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round">
        <circle cx="12" cy="12" r="10" stroke="rgba(59, 130, 246, 0.1)" stroke-width="3"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#3b82f6"></path>
      </svg>
    `;
    loaderWrapper.style.background = 'rgba(59, 130, 246, 0.1)';
    
    progressModal.style.display = 'flex';
    
    if (activeMode === 'scan' || activeMode === 'both') {
      addProgressStepRow('register-email', `Đăng ký email scan: ${scanEmail}`);
    }
    
    checkedPrinters.forEach((item, idx) => {
      const printer = item.printer;
      const displayIndex = idx + 1;
      
      if (activeMode === 'driver' || activeMode === 'both') {
        if (item.driverName) {
          addProgressStepRow(`driver-${printer.id}`, `[Máy ${displayIndex}] Cài Driver cho ${printer.printer_name}`);
        }
      }
      
      if (activeMode === 'scan' || activeMode === 'both') {
        addProgressStepRow(`scan-${printer.id}`, `[Máy ${displayIndex}] Cấu hình Scan cho ${printer.printer_name}`);
      }
    });
  }

  function addProgressStepRow(id, label) {
    const stepsContainer = document.getElementById('progress-modal-steps');
    const row = document.createElement('div');
    row.id = `step-row-${id}`;
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.justifyContent = 'space-between';
    row.style.padding = '12px 16px';
    row.style.background = 'rgba(255, 255, 255, 0.02)';
    row.style.border = '1px solid rgba(255, 255, 255, 0.05)';
    row.style.borderRadius = '12px';
    row.style.transition = 'all 0.3s ease';
    
    row.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px; flex: 1;">
        <span style="font-size: 14px; font-weight: 600; color: #94a3b8;" class="step-label">${escapeHtml(label)}</span>
        <span style="font-size: 12px; color: #64748b;" class="step-subtext">Đang chờ...</span>
      </div>
      <div class="step-status-icon" style="flex-shrink: 0; margin-left: 12px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #475569;"></div>
      </div>
    `;
    stepsContainer.appendChild(row);
  }

  function setStepStatus(id, status, subtext = '') {
    const row = document.getElementById(`step-row-${id}`);
    if (!row) return;
    
    const label = row.querySelector('.step-label');
    const subtextEl = row.querySelector('.step-subtext');
    const statusIcon = row.querySelector('.step-status-icon');
    
    if (subtext) {
      subtextEl.textContent = subtext;
    }
    
    if (status === 'active') {
      label.style.color = '#3b82f6';
      subtextEl.style.color = '#60a5fa';
      row.style.background = 'rgba(59, 130, 246, 0.05)';
      row.style.borderColor = 'rgba(59, 130, 246, 0.2)';
      statusIcon.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="3">
          <circle cx="12" cy="12" r="10" stroke="rgba(59, 130, 246, 0.1)" stroke-width="3"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#3b82f6"></path>
        </svg>
      `;
    } else if (status === 'success') {
      label.style.color = '#f8fafc';
      subtextEl.style.color = '#22c55e';
      row.style.background = 'rgba(34, 197, 94, 0.05)';
      row.style.borderColor = 'rgba(34, 197, 94, 0.15)';
      statusIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else if (status === 'failed') {
      label.style.color = '#ef4444';
      subtextEl.style.color = '#f87171';
      row.style.background = 'rgba(239, 68, 68, 0.05)';
      row.style.borderColor = 'rgba(239, 68, 68, 0.2)';
      statusIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else if (status === 'warning') {
      label.style.color = '#fbbf24';
      subtextEl.style.color = '#fbbf24';
      row.style.background = 'rgba(251, 191, 36, 0.05)';
      row.style.borderColor = 'rgba(251, 191, 36, 0.15)';
      statusIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `;
    }
  }

  function updateSubStepProgress(id, msg) {
    let subtext = msg;
    let subStepWeight = 0;
    
    const match = msg.match(/\[(\d+)\/(\d+)\]/);
    if (match) {
      const current = parseInt(match[1]);
      const total = parseInt(match[2]);
      subStepWeight = current / total;
      subtext = msg.replace(/\[\d+\/\d+\]\s*/, '');
    }
    
    setStepStatus(id, 'active', subtext);
    
    const progressBar = document.getElementById('progress-modal-bar');
    const baseCompleted = completedStepsCount;
    const currentProgress = baseCompleted + (subStepWeight * 0.9);
    if (totalStepsCount > 0) {
      const percentage = Math.min(99, Math.round((currentProgress / totalStepsCount) * 100));
      progressBar.style.width = `${percentage}%`;
    }
  }

  function updateOverallProgressBar() {
    const progressBar = document.getElementById('progress-modal-bar');
    if (totalStepsCount > 0) {
      const percentage = Math.min(100, Math.round((completedStepsCount / totalStepsCount) * 100));
      progressBar.style.width = `${percentage}%`;
    }
  }

  function initFormSubmissions() {
    // Setup progress modal close listener
    const btnProgressClose = document.getElementById('btn-progress-close');
    if (btnProgressClose) {
      btnProgressClose.addEventListener('click', () => {
        document.getElementById('progress-modal').style.display = 'none';
        modal.style.display = 'none';
        btnModalSubmit.disabled = false;
        btnModalSubmit.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
          </svg>
          <span>Tiến hành cài đặt lại</span>
        `;
      });
    }

    btnModalSubmit.addEventListener('click', async () => {
      // 1. Gather checked printers & their selected drivers
      const checkedPrinters = [];
      modalPrintersList.querySelectorAll('.printer-checkbox-item.selected').forEach(row => {
        const pId = row.getAttribute('data-id');
        const printer = activePrinters.find(p => String(p.id) === String(pId));
        if (printer) {
          let chosenDriver = { driverName: '', driverUrl: '', brand: '', modelName: '' };
          
          if (activeMode === 'driver' || activeMode === 'both') {
            const selectEl = row.querySelector('.printer-driver-select');
            if (selectEl && selectEl.selectedIndex >= 0) {
              const opt = selectEl.options[selectEl.selectedIndex];
              if (opt) {
                chosenDriver.driverName = opt.value || '';
                chosenDriver.driverUrl = opt.getAttribute('data-url') || '';
                chosenDriver.brand = opt.getAttribute('data-brand') || '';
                chosenDriver.modelName = opt.getAttribute('data-model') || '';
              }
            }
          }
          
          checkedPrinters.push({ printer, ...chosenDriver });
        }
      });

      if (checkedPrinters.length === 0) {
        showToast('Vui lòng tick chọn ít nhất một máy photocopy!', 'warning');
        return;
      }

      // 2. Gather values for scan mode
      let folderName = '';
      let scanEmail = '';

      if (activeMode === 'scan' || activeMode === 'both') {
        folderName = document.getElementById('scan-folder-name').value.trim();
        scanEmail = document.getElementById('scan-email').value.trim();

        if (!folderName) {
          showToast('Vui lòng nhập tên thư mục scan!', 'warning');
          document.getElementById('scan-folder-name').focus();
          return;
        }
        if (scanEmail && !validateEmail(scanEmail)) {
          showToast('Email nhập vào không hợp lệ!', 'warning');
          document.getElementById('scan-email').focus();
          return;
        }
      }

      // 3. Initialize Progress Modal (On-Top)
      totalStepsCount = 0;
      completedStepsCount = 0;
      
      if (activeMode === 'scan' || activeMode === 'both') {
        totalStepsCount++;
      }
      checkedPrinters.forEach(item => {
        const printer = item.printer;
        if (activeMode === 'driver' || activeMode === 'both') {
          if (item.driverName) totalStepsCount++;
        }
        if (activeMode === 'scan' || activeMode === 'both') {
          totalStepsCount++;
        }
      });

      initProgressModal(checkedPrinters, activeMode, scanEmail);
      btnModalSubmit.disabled = true;
      setButtonLoading(btnModalSubmit, true, 'Đang tiến hành cài đặt...');

      try {
        // If scan is involved, register email to LAN agent settings once
        if (activeMode === 'scan' || activeMode === 'both') {
          setStepStatus('register-email', 'active', 'Đang thêm email scan cho máy tính này...');
          try {
            await addLanEmailApi(scanEmail);
            setStepStatus('register-email', 'success', 'Thêm email scan thành công!');
          } catch (err) {
            setStepStatus('register-email', 'warning', `Có cảnh báo khi đăng ký email: ${err.message || err}`);
          }
          completedStepsCount++;
          updateOverallProgressBar();
        }

        // Loop through each checked printer
        for (let i = 0; i < checkedPrinters.length; i++) {
          const item = checkedPrinters[i];
          const printer = item.printer;
          const displayIndex = i + 1;
          
          if (activeMode === 'driver' || activeMode === 'both') {
            if (item.driverName) {
              const stepId = `driver-${printer.id}`;
              setStepStatus(stepId, 'active', 'Đang kết nối để khởi tạo lệnh cài đặt...');
              try {
                const driverRes = await installDriverApi(printer.id, item.brand, item.modelName, item.driverName, item.driverUrl);
                if (driverRes.ok && driverRes.command_id) {
                  const trackerRes = await trackCommandProgressPromise(driverRes.command_id, (msg) => {
                    updateSubStepProgress(stepId, msg);
                  });
                  if (trackerRes.ok) {
                    setStepStatus(stepId, 'success', 'Cài đặt Driver thành công!');
                  } else {
                    const failReason = trackerRes.error || 'Cài đặt Driver thất bại!';
                    setStepStatus(stepId, 'failed', failReason.startsWith('Lỗi:') ? failReason : `Lỗi: ${failReason}`);
                  }
                } else {
                  setStepStatus(stepId, 'failed', 'Không thể tạo lệnh cài đặt Driver.');
                }
              } catch (err) {
                setStepStatus(stepId, 'failed', `Lỗi cài driver: ${err.message || err}`);
              }
              completedStepsCount++;
              updateOverallProgressBar();
            }
          }

          if (activeMode === 'scan' || activeMode === 'both') {
            const stepId = `scan-${printer.id}`;
            setStepStatus(stepId, 'active', `Đang thêm nút Scan "${folderName}"...`);
            try {
              const scanRes = await addEmailDestApi(printer.id, folderName, scanEmail);
              if (scanRes.ok && scanRes.command_id) {
                const trackerRes = await trackCommandProgressPromise(scanRes.command_id, (msg) => {
                  updateSubStepProgress(stepId, msg);
                });
                if (trackerRes.ok) {
                  setStepStatus(stepId, 'success', 'Cấu hình Scan thành công!');
                } else {
                  const failReason = trackerRes.error || 'Cấu hình Scan thất bại!';
                  setStepStatus(stepId, 'failed', failReason.startsWith('Lỗi:') ? failReason : `Lỗi: ${failReason}`);
                }
              } else {
                setStepStatus(stepId, 'failed', 'Không thể tạo lệnh cấu hình Scan.');
              }
            } catch (err) {
              setStepStatus(stepId, 'failed', `Lỗi cấu hình scan: ${err.message || err}`);
            }
            completedStepsCount++;
            updateOverallProgressBar();
          }
        }

        // Show completed status
        const progressModal = document.getElementById('progress-modal');
        const titleEl = document.getElementById('progress-modal-title');
        const subtitleEl = document.getElementById('progress-modal-subtitle');
        const loaderWrapper = progressModal.querySelector('.loader-circle-wrapper');
        const footerEl = document.getElementById('progress-modal-footer');
        const stepsContainer = document.getElementById('progress-modal-steps');
        
        const failedCount = stepsContainer.querySelectorAll('svg[stroke="#ef4444"]').length;
        if (failedCount > 0) {
          titleEl.textContent = 'Cài đặt hoàn tất với lỗi';
          subtitleEl.textContent = `Đã hoàn thành với ${failedCount} lỗi. Vui lòng kiểm tra danh sách chi tiết.`;
          loaderWrapper.innerHTML = `
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          `;
          loaderWrapper.style.background = 'rgba(251, 191, 36, 0.1)';
        } else {
          titleEl.textContent = 'Hoàn tất cài đặt!';
          subtitleEl.textContent = 'Tất cả các tác vụ cài đặt đã hoàn thành thành công.';
          loaderWrapper.innerHTML = `
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          loaderWrapper.style.background = 'rgba(34, 197, 94, 0.1)';
        }
        
        const progressBar = document.getElementById('progress-modal-bar');
        progressBar.style.width = '100%';
        footerEl.style.display = 'flex';
        
        showToast('Hoàn tất tiến trình cài đặt!', 'success');
        await fetchPrintersFromVps();
      } catch (err) {
        showToast(`Lỗi hệ thống: ${err}`, 'danger');
      }
    });
  }

  /**
   * Promisified command tracker for sequential execution
   */
  function trackCommandProgressPromise(commandId, onUpdate) {
    return new Promise((resolve) => {
      const start = Date.now();
      let lastText = '';
      
      const timer = setInterval(async () => {
        try {
          const elapsed = Date.now() - start;
          if (elapsed > 120000) { // 2 mins timeout
            clearInterval(timer);
            const timeoutErr = 'Hết thời gian chờ phản hồi từ Agent (120s)';
            onUpdate(timeoutErr);
            resolve({ ok: false, error: timeoutErr });
            return;
          }

          const res = await vpsFetch(`/api/commands/${commandId}/status`);
          if (!res.ok) return;
          const data = await res.json();
          
          if (data.status === 'success') {
            clearInterval(timer);
            onUpdate('Hoàn thành xử lý.');
            resolve({ ok: true, error: '' });
          } else if (data.status === 'failed') {
            clearInterval(timer);
            const errDetail = data.error_message || data.error || data.result || 'Thất bại không rõ nguyên nhân';
            onUpdate(`Lỗi: ${errDetail}`);
            resolve({ ok: false, error: errDetail });
          } else {
            const text = data.progress_text || data.message || 'Đang chờ máy Agent phản hồi...';
            if (text !== lastText) {
              onUpdate(text);
              lastText = text;
            }
          }
        } catch (e) {
          // ignore network glitches during install
        }
      }, 1200);
    });
  }

  // APIs Client Helper
  function installDriverApi(printerId, brand, model, driverName, driverUrl) {
    const agentUid = localAgent ? localAgent.agent_uid : '';
    return vpsFetch(`/api/devices/${printerId}/install-driver`, {
      method: 'POST',
      body: JSON.stringify({ brand, model, driver_name: driverName, driver_url: driverUrl, agent_uid: agentUid })
    }).then(res => res.json());
  }

  function addLanEmailApi(email) {
    if (!localAgent) return Promise.resolve();
    return vpsFetch('/api/lan-emails', {
      method: 'POST',
      body: JSON.stringify({
        lead: 'default',
        lan_uid: localAgent.lan_uid,
        email: email,
        email_type: 'private',
        pc_name: localAgent.pc_name
      })
    });
  }

  function addEmailDestApi(printerId, name, email) {
    const agentParam = localAgent ? `?agent_uid=${localAgent.agent_uid}` : '';
    return vpsFetch(`/api/devices/${printerId}/add-email-dest${agentParam}`, {
      method: 'POST',
      body: JSON.stringify({ name, email })
    }).then(res => res.json());
  }

  /**
   * Fetch Public IP
   */
  async function fetchPublicIP() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      publicIpEl.textContent = data.ip;
    } catch (e) {
      publicIpEl.textContent = '14.226.112.58';
    }
  }

  /**
   * Load Agent settings toggles
   */
  async function loadAgentSettings() {
    try {
      const res = await vpsFetch(`/api/agents/${localAgent.agent_uid}/settings?lead=default`);
      if (res.ok) {
        const settings = await res.json();
        toggleOpenFile.checked = !!settings.scan_auto_open_file;
        toggleOpenFolder.checked = !!settings.scan_auto_open_dir;
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Copy IP Helper
   */
  function initCopyButtons() {
    const setupCopy = (btnId, textElId, typeName) => {
      const button = document.getElementById(btnId);
      button.addEventListener('click', () => {
        const text = document.getElementById(textElId).textContent;
        if (text && text !== 'Đang tải...') {
          navigator.clipboard.writeText(text).then(() => {
            showToast(`Đã sao chép ${typeName} IP: ${text}`, 'success');
            const originalHTML = button.innerHTML;
            button.innerHTML = `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            `;
            setTimeout(() => { button.innerHTML = originalHTML; }, 1500);
          }).catch(() => {
            showToast('Không thể sao chép!', 'danger');
          });
        }
      });
    };
    setupCopy('btn-copy-public', 'ip-public-val', 'Public');
    setupCopy('btn-copy-lan', 'ip-lan-val', 'LAN');
  }

  /**
   * Auto file/folder open toggles settings change
   */
  function initToggleSwitches() {
    const saveSettings = async () => {
      if (!localAgent) return;
      try {
        await vpsFetch(`/api/agents/${localAgent.agent_uid}/settings?lead=default`, {
          method: 'POST',
          body: JSON.stringify({
            scan_auto_open_file: toggleOpenFile.checked,
            scan_auto_open_dir: toggleOpenFolder.checked
          })
        });
        showToast('Đã lưu cấu hình tự động mở scan mới!', 'success');
      } catch (err) {
        showToast('Lỗi lưu cấu hình mở scan!', 'danger');
      }
    };
    toggleOpenFile.addEventListener('change', saveSettings);
    toggleOpenFolder.addEventListener('change', saveSettings);
  }

  /**
   * Support ticket submission
   */
  function initSupportForm() {
    formSupport.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('support-title-input').value.trim();
      const phone = document.getElementById('support-phone').value.trim();
      const address = document.getElementById('support-address').value.trim();
      const desc = document.getElementById('support-desc').value.trim();
      const priorityVal = document.querySelector('input[name="priority"]:checked').value;
      
      let deviceName = 'Chung';
      // Pick first printer if loaded
      if (activePrinters.length > 0) {
        deviceName = activePrinters[0].printer_name;
      }

      setButtonLoading(btnSubmitSupport, true, 'Đang gửi yêu cầu...');

      try {
        const res = await vpsFetch('/api/tasks', {
          method: 'POST',
          body: JSON.stringify({
            machine_name: deviceName,
            title: title.slice(0, 50),
            description: `SĐT: ${phone}\nĐịa chỉ máy: ${address}\n\nMô tả chi tiết:\n${desc}`,
            priority: priorityVal,
            lead: 'default',
            status: 'backlog',
            agent_uid: localAgent ? localAgent.agent_uid : 'auto-gox'
          })
        });

        if (res.ok) {
          showToast('Đã gửi yêu cầu bảo hành thành công!', 'success');
          formSupport.reset();
        } else {
          throw new Error('API fail');
        }
      } catch (err) {
        showToast('Lỗi gửi yêu cầu hỗ trợ bảo hành!', 'danger');
      } finally {
        setButtonLoading(btnSubmitSupport, false, `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
          </svg>
          <span>Gửi yêu cầu bảo hành</span>
        `);
      }
    });
  }

  function setButtonLoading(button, isLoading, content) {
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = `<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-radius:50%; border-top-color:#fff; animation:spin 0.8s linear infinite; margin-right:8px; vertical-align:middle;"></span> <span>${content}</span>`;
    } else {
      button.disabled = false;
      button.innerHTML = content;
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function smoothScrollTo(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Display Animated Toast Notification
   */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconHtml = '';
    if (type === 'success') {
      iconHtml = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'warning') {
      iconHtml = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else if (type === 'danger') {
      iconHtml = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconHtml = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-content" style="display:flex; align-items:center; gap:10px;">
        ${iconHtml}
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close" aria-label="Đóng thông báo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  }

  function initHeaderSupportButton() {
    const btnHeaderSupport = document.getElementById('btn-header-support');
    const supportSection = document.getElementById('support-title');
    const supportInput = document.getElementById('support-title-input');
    if (btnHeaderSupport) {
      btnHeaderSupport.addEventListener('click', () => {
        smoothScrollTo(supportSection);
        setTimeout(() => { supportInput.focus(); }, 600);
      });
    }
  }
});
