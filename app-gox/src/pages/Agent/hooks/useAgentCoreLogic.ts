// @ts-nocheck
import { addEmailDestination, addPrivateLanEmail, deleteEmailDestination, deleteLanEmail, getAgentSettings, getAgentUtilityCommands, getCommandStatus, getJobs, getLanSites, getScansFiles, installDriverOnAgent, modifyDeviceAddress, saveCopierCredentials, triggerAgentUtility, triggerAgentUtilityExec, triggerEmergencyRestart, triggerFetchAddressBook, updateAgentSettings } from '../../../api/mockAgentApi';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AgentApi } from '../../../api/AgentApi';
const BASE_URL = import.meta.env.VITE_API_URL || 'https://agentapi.quanlymay.com';

export const useAgentCoreLogic = (deps: any = {}) => {
  const { ...rest } = deps;
  const [lanSites, setLanSites] = useState<LanSiteInfo[]>([]);
  const [selectedLanUid, setSelectedLanUid] = useState<string>(() => {
    return localStorage.getItem('goxprint_selected_lan_uid') || '';
  });
  const [lanSitesLoading, setLanSitesLoading] = useState(false);
  const [selectedCameraAgentUid, setSelectedCameraAgentUid] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'agents' | 'copiers' | 'cameras'>(() => {
    const saved = localStorage.getItem('goxprint_active_tab');
    return (saved === 'agents' || saved === 'copiers' || saved === 'cameras') ? saved : 'agents';
  });

  // Polling / Command Status Map (key: printerId or entryRegNo, value: status message)
  const [commandStatus, setCommandStatus] = useState<Record<string, { message: string; isPending: boolean }>>({});
  
  // Collapsible lists
  const [expandedPrinters, setExpandedPrinters] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('goxprint_expanded_printers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [expandedDrivers, setExpandedDrivers] = useState<Record<string, boolean>>({});
  const [expandedDriverMenus, setExpandedDriverMenus] = useState<Record<string, boolean>>({});

  // Credentials input states (key: printerId)
  const [copierCredentials, setCopierCredentials] = useState<Record<string, { user: string; pass: string }>>({});
  const [saveAuthLoading, setSaveAuthLoading] = useState<Record<string, boolean>>({});

  // Target Agent Select state (key: printerId, value: agentUid)
  const [selectedTargetAgents, setSelectedTargetAgents] = useState<Record<string, string>>({});

  // Live (uncached) address books loaded from agents (key: printerId) - PERSISTED IN SESSIONSTORAGE & GLOBAL CACHE
  const [liveAddressBooks, setLiveAddressBooksState] = useState<Record<string, any>>(() => {
    try {
      const saved = sessionStorage.getItem('gox_live_address_books');
      return saved ? JSON.parse(saved) : (window as any)._liveAddressBooksCache || {};
    } catch {
      return (window as any)._liveAddressBooksCache || {};
    }
  });

  const setLiveAddressBooks = useCallback((updater: any) => {
    setLiveAddressBooksState((prev: any) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        (window as any)._liveAddressBooksCache = next;
        sessionStorage.setItem('gox_live_address_books', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Camera States
  const [cameras, setCameras] = useState<any[]>([]);
  const [camerasLoading, setCamerasLoading] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<any | null>(null);
  const [cameraForm, setCameraForm] = useState({
    id: null as number | null,
    camera_name: 'Camera mới',
    rtsp_url: '',
    segment_duration: 60,
    prefix: 'rec',
    video_codec: 'copy',
    audio_codec: 'copy',
    no_audio: true
  });
  const [cameraStatus, setCameraStatus] = useState<any>(null);
  const [cameraLogs, setCameraLogs] = useState<any[]>([]);
  const [cameraFiles, setCameraFiles] = useState<any[]>([]);
  const [cameraTestResult, setCameraTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [cameraTestLoading, setCameraTestLoading] = useState(false);

  const [queryTimestamp, setQueryTimestamp] = useState('');
  const [queryDuration, setQueryDuration] = useState(10);
  const [queriedVideoUrl, setQueriedVideoUrl] = useState('');
  const [queryVideoLoading, setQueryVideoLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeLoadingFile, setActiveLoadingFile] = useState<string | null>(null);
  const [isRecording30s, setIsRecording30s] = useState(false);
  const [recording30sCountdown, setRecording30sCountdown] = useState(30);
  const [customRecordDuration, setCustomRecordDuration] = useState(30);


  useEffect(() => {
    if (!queryVideoLoading) {
      setActiveLoadingFile(null);
    }
  }, [queryVideoLoading]);

  // Register parent window dummy functions for Ricoh iframe scripts
  useEffect(() => {
    (window as any).fnGetCookie = (_name?: string) => {
      return '';
    };
    (window as any).fnSetCookie = (_name?: string, _value?: string) => {
      // Dummy
    };
    (window as any).fnGetLocalestring = (_key?: string) => {
      return '';
    };
    (window as any).fnGetHelp = (_url?: string) => {
      // Dummy
    };
  }, []);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modals
  const [activeModal, setActiveModal] = useState<'storage' | 'public_ftp' | 'private_ftp' | 'info_detail' | 'ftp_detail' | 'utilities' | 'edit_ip' | 'remote_lock' | 'toshiba_vnc' | null>(null);
  const [selectedUtilityAgent, setSelectedUtilityAgent] = useState<any | null>(null);
  const [ftpDetailData, setFtpDetailData] = useState<{ port: string | number; path: string; error?: string } | null>(null);
  const [remoteLockPrinter, setRemoteLockPrinter] = useState<{ ip: string; name: string; id: string | number; agentUid: string } | null>(null);
  const [toshibaVncData, setToshibaVncData] = useState<{ ip: string; printerName: string; agentUid: string } | null>(null);
  const [allocatedVncAddr, setAllocatedVncAddr] = useState<string>('');
  const [vncTunnelLoading, setVncTunnelLoading] = useState<boolean>(false);
  const [webPreviewModal, setWebPreviewModal] = useState<{ isOpen: boolean; title: string; html: string; ip: string; path: string; agentUid: string; url?: string } | null>(null);
  const [webPreviewLoading, setWebPreviewLoading] = useState<boolean>(false);
  const [directLan, setDirectLan] = useState<boolean>(() => {
    return localStorage.getItem('goxprint_direct_lan') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('goxprint_direct_lan', String(directLan));
  }, [directLan]);

  const detectBrand = (name: string): 'ricoh' | 'toshiba' | 'other' => {
    const lower = (name || '').toLowerCase();
    if (
      lower.includes('ricoh') ||
      lower.includes('savin') ||
      lower.includes('aficio') ||
      lower.includes('gestetner') ||
      lower.includes('lanier') ||
      lower.includes('infotec') ||
      lower.includes('mp ') ||
      lower.startsWith('mp') ||
      lower.includes('im ') ||
      lower.startsWith('im') ||
      lower.includes('pro ') ||
      lower.startsWith('pro')
    ) {
      return 'ricoh';
    }
    if (lower.includes('toshiba')) {
      return 'toshiba';
    }
    return 'other';
  };

  const [webPreviewTab, setWebPreviewTab] = useState<'iframe' | 'html'>('iframe');
  const [showPreviewDetails, setShowPreviewDetails] = useState<boolean>(() => {
    return window.innerWidth >= 768;
  });
  const [webPreviewHistory, setWebPreviewHistory] = useState<string[]>([]);
  const [webPreviewHistoryIndex, setWebPreviewHistoryIndex] = useState<number>(-1);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string>('');
  const [scaleX, setScaleX] = useState<number>(0.95);
  const [scaleY, setScaleY] = useState<number>(0.95);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const modalContentRef = useRef<any>(null);
  const autoScanTriggers = useRef<Record<string, number>>({});


  const [editIpModalData, setEditIpModalData] = useState<{
    printerId: string;
    entry: any;
    currentIp: string;
    newIp: string;
  } | null>(null);
  
  // Custom Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [deleteScanPointModal, setDeleteScanPointModal] = useState<{
    isOpen: boolean;
    printerId: string;
    entry: any;
    agentUid: string;
  }>({
    isOpen: false,
    printerId: '',
    entry: null,
    agentUid: '',
  });

  const [installDriverModal, setInstallDriverModal] = useState<{
    isOpen: boolean;
    printerId: string;
    brand: string;
    model: string;
    driverName: string;
    driverUrl: string;
    selectedAgentUids: string[];
  }>({
    isOpen: false,
    printerId: '',
    brand: '',
    model: '',
    driverName: '',
    driverUrl: '',
    selectedAgentUids: [],
  });

  // IP Input Modal state
  const [ipInputModal, setIpInputModal] = useState<{
    isOpen: boolean;
    title: string;
    hint: string;
    value: string;
    changeAllTo?: string;
    scanStatus?: string;
    error: string;
    onConfirm: (ip: string, changeAllTo?: string) => void;
  }>({
    isOpen: false,
    title: '🌐 Đổi địa chỉ IP tĩnh',
    hint: 'Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.',
    value: '',
    changeAllTo: '',
    scanStatus: '',
    error: '',
    onConfirm: () => {},
  });


  // Storage Modal states
  const [storageModalData, setStorageModalData] = useState<{ lanUid: string; email: string }>({ lanUid: '', email: '' });
  const [storageFiles, setStorageFiles] = useState<any[]>([]);
  const [storageLoading, setStorageLoading] = useState(false);

  // Add Public FTP states
  const [publicFtpData, setPublicFtpData] = useState<{ printerId: string; name: string; email: string; agentUid: string }>({ printerId: '', name: '', email: '', agentUid: '' });
  const [publicFtpLoading, setPublicFtpLoading] = useState(false);

  // Add Private FTP states
  const [privateFtpData, setPrivateFtpData] = useState<{ lanUid: string; agentUid: string; email: string }>({ lanUid: '', agentUid: '', email: '' });
  const [privateFtpLoading, setPrivateFtpLoading] = useState(false);

  // Info Detail states
  const [infoDetailData] = useState<{ regNo: string; name: string; details: any; error?: string }>({ regNo: '', name: '', details: null });

  // 📋 Scan Points Viewer Modal State
  const [scanPointsViewerModal, setScanPointsViewerModal] = useState<{
    isOpen: boolean;
    copierName: string;
    macId: string;
    loading: boolean;
    jsonData: any;
  }>({
    isOpen: false,
    copierName: '',
    macId: '',
    loading: false,
    jsonData: null,
  });

  const handleViewScanPointsJson = async (target: any) => {
    const isAgent = Boolean(target.agent_uid && !target.mac_id && !target.mac_address);
    const macClean = (target.mac_id || target.mac_address || "").replace(/-/g, ":").toUpperCase();
    const agentUid = target.agent_uid || target.agentUid || "";
    setScanPointsViewerModal({
      isOpen: true,
      copierName: target.hostname ? `Máy tính: ${target.hostname}` : (target.printer_name || target.name || "Máy Photocopy"),
      macId: macClean || agentUid,
      loading: true,
      jsonData: null,
    });
    try {
      const url = isAgent
        ? `${BASE_URL}/api/lan-sites/scan-points?agent_uid=${encodeURIComponent(agentUid)}`
        : `${BASE_URL}/api/lan-sites/scan-points?mac_id=${encodeURIComponent(macClean)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok && data.scan_points) {
        setScanPointsViewerModal(prev => ({
          ...prev,
          loading: false,
          jsonData: isAgent
            ? data.scan_points
            : (data.scan_points[macClean] && Object.keys(data.scan_points[macClean]).length > 0
                ? data.scan_points[macClean]
                : (Object.keys(data.scan_points).length > 0
                    ? data.scan_points
                    : target.address_book_sync || {})),
        }));
      } else {
        setScanPointsViewerModal(prev => ({
          ...prev,
          loading: false,
          jsonData: target.address_book_sync || { message: "Không tìm thấy dữ liệu scan_points.json trên VPS" },
        }));
      }
    } catch (err) {
      setScanPointsViewerModal(prev => ({
        ...prev,
        loading: false,
        jsonData: target.address_book_sync || { error: "Lỗi kết nối VPS" },
      }));
    }
  };

  // Scroll and tracking references
  const [initialLastViewedId] = useState<string>(() => {
    return localStorage.getItem('goxprint_last_viewed_copier_id') || '';
  });

  // ── LOCAL STORAGE SYNC ──
  useEffect(() => {
    localStorage.setItem('goxprint_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('goxprint_expanded_printers', JSON.stringify(expandedPrinters));
  }, [expandedPrinters]);

  // ── TOAST HELPER ──
  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  // Replace a toast by fixed ID — removes old one first, then adds new
  const replaceToast = useCallback((fixedId: string, message: string, type: Toast['type'] = 'info') => {
    setToasts((prev) => [
      ...prev.filter((t) => t.id !== fixedId),
      { id: fixedId, message, type }
    ]);
  }, []);

  const resolveRelativePath = (relative: string, current: string) => {
    if (relative.startsWith('http://') || relative.startsWith('https://') || relative.startsWith('data:')) {
      try {
        const parsed = new URL(relative);
        return parsed.pathname + parsed.search;
      } catch {
        return relative;
      }
    }
    
    if (relative.startsWith('/')) {
      return relative;
    }
    
    const baseClean = current.split('?')[0];
    const parts = baseClean.split('/');
    parts.pop(); // remove filename
    const baseDir = parts.join('/');
    
    const resolved = baseDir + '/' + relative;
    try {
      const urlObj = new URL(resolved, 'http://localhost');
      return urlObj.pathname + urlObj.search;
    } catch {
      return resolved;
    }
  };

  const fetchRemotePage = async (
    printerIp: string,
    targetPath: string,
    _method: string = 'GET',
    _postData?: any,
    _isHistoryNav: boolean = false,
    agentUidParam?: string,
    printerPort: number = 80
  ) => {
    const activeAgentUid = agentUidParam || webPreviewModal?.agentUid;
    if (!activeAgentUid) {
      console.error('No agent UID available for remote page fetch');
      showToast('Không tìm thấy Target Agent UID', 'error');
      return;
    }

    if (directLan) {
      // Direct LAN mode: Open directly in a new tab immediately
      window.open(`http://${printerIp}:${printerPort}${targetPath || '/'}`, '_blank');
      return;
    }

    // Tunnel mode: Open both loading tabs immediately to bypass browser popup blocker
    const createLoaderHtml = (title: string, desc: string) => `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              background: #0f172a;
              color: #f8fafc;
              font-family: sans-serif;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .spinner {
              border: 4px solid rgba(255,255,255,0.1);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border-left-color: #3b82f6;
              animation: spin 1s linear infinite;
              margin-bottom: 16px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="spinner"></div>
          <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 8px;">${title}</div>
          <div style="color: #94a3b8; font-size: 0.9rem;">${desc}</div>
        </body>
      </html>
    `;

    const wildcardTab = window.open('about:blank', '_blank');
    if (wildcardTab) {
      wildcardTab.document.write(createLoaderHtml(
        'Đang kết nối tên miền...',
        `Đang kết nối đến máy in ${printerIp} qua tên miền *.app.goxprint.com...`
      ));
    }

    try {
      const response = await fetch(`${BASE_URL}/api/agents/${activeAgentUid}/tunnel/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printer_ip: printerIp, printer_port: printerPort })
      });
      const data = await response.json();
      if (data.ok) {
        if (wildcardTab && data.url) {
          wildcardTab.location.href = data.url;
        }
      } else {
        if (wildcardTab) wildcardTab.close();
        showToast('Kết nối lỗi: ' + (data.error || 'Không thể khởi động đường hầm SSH ngược trên Agent'), 'error');
      }
    } catch (err: any) {
      if (wildcardTab) wildcardTab.close();
      showToast('Lỗi hệ thống VPS: ' + (err.message || err), 'error');
    }
  };

  /* const fetchRemotePageOld = async (
    printerIp: string,
    targetPath: string,
    method: string = 'GET',
    postData?: any,
    isHistoryNav: boolean = false,
    agentUidParam?: string
  ) => {
    const activeAgentUid = agentUidParam || webPreviewModal?.agentUid;
    if (!activeAgentUid) {
      console.error('No agent UID available for remote page fetch');
      return;
    }
    
    setWebPreviewModal(prev => {
      const isFirstLoad = !prev || prev.html === 'LOADING';
      return {
        isOpen: true,
        title: prev?.title || ('Web Image Monitor - ' + printerIp),
        html: isFirstLoad ? 'LOADING' : prev.html,
        ip: printerIp,
        path: targetPath,
        agentUid: activeAgentUid
      };
    });
    if (directLan) {
      setWebPreviewModal(prev => {
        return {
          isOpen: true,
          title: prev?.title || ('Web Image Monitor (LAN) - ' + printerIp),
          html: 'DIRECT_LAN',
          ip: printerIp,
          path: targetPath,
          agentUid: activeAgentUid
        };
      });
      setWebPreviewLoading(false);
      return;
    }

    setWebPreviewLoading(true);

    try {
      const base64Data = postData ? btoa(JSON.stringify(postData)) : '';
      const script = `target_ip = '${printerIp}'\ntarget_path = '${targetPath}'\ntarget_method = '${method}'\ntarget_data = '${base64Data}'`;
      
      const res: any = await triggerAgentUtilityExec(activeAgentUid, 'open_web_setting', script);
      if (!res.ok || !res.command_id) {
        setWebPreviewModal(prev => prev ? { ...prev, html: `ERROR: ${res.error || 'Không thể tạo lệnh tiện ích'}` } : null);
        setWebPreviewLoading(false);
        return;
      }

      const commandId = res.command_id;
      const maxPollMs = 60000;
      const startTime = Date.now();
      
      const pollTimer = setInterval(async () => {
        try {
          const elapsed = Date.now() - startTime;
          if (elapsed > maxPollMs) {
            clearInterval(pollTimer);
            setWebPreviewModal(prev => prev ? { ...prev, html: 'ERROR: Yêu cầu quá thời gian chờ (60s)' } : null);
            return;
          }

          const statusRes = await getCommandStatus(commandId);
          if (statusRes.status === 'success') {
            clearInterval(pollTimer);
            let parsedRes: any = {};
            try {
              let raw = statusRes.result_payload || statusRes.error || '';
              if (typeof raw === 'string') {
                raw = raw.trim();
                if (raw.startsWith('"') && raw.endsWith('"')) {
                  try {
                    raw = JSON.parse(raw);
                  } catch {}
                }
                parsedRes = JSON.parse(raw);
              } else {
                parsedRes = raw;
              }
            } catch (parseErr) {
              parsedRes = { error: 'Lỗi parse JSON: ' + (statusRes.result_payload || statusRes.error) };
            }

            if (parsedRes.html) {
              let rawHtml = parsedRes.html;
              const returnedPath = parsedRes.path || targetPath;

              let preparedHtml = rawHtml;

              // 1. Strip render-blocking stylesheets and external scripts to prevent the browser from freezing on unreachable IP assets
              preparedHtml = preparedHtml.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '');
              preparedHtml = preparedHtml.replace(/<script[^>]*src=[^>]*><\/script>/gi, '');
              preparedHtml = preparedHtml.replace(/<script[^>]*src=[^>]*\s*\/>/gi, '');

              // 2. Insert base tag, CDN jQuery, and top-level fallbacks to prevent ReferenceErrors from executing inline scripts early
              const fallbacks = `
                <script>
                  // Toshiba fallbacks
                  window.fnGetLocaleString = window.fnGetLocaleString || function(id, defaultVal) { return defaultVal || id || ""; };
                  window.fnGetResolveLocaleForDisplay = window.fnGetResolveLocaleForDisplay || function(id, defaultVal) { return defaultVal || id || ""; };
                  window.fnGetResolveLocale = window.fnGetResolveLocale || function(id, defaultVal) { return defaultVal || id || ""; };
                  window.fnGetLocale = window.fnGetLocale || function(id, defaultVal) { return defaultVal || id || ""; };
                  window.InitiateServerRequest = window.InitiateServerRequest || function() {};

                  // Ricoh fallbacks
                  window.mouseOverTransfer = window.mouseOverTransfer || function() {};
                  window.mouseOutTransfer = window.mouseOutTransfer || function() {};
                  window.menuParent_Mouseover = window.menuParent_Mouseover || function() {};
                  window.menuParent_Mouseout = window.menuParent_Mouseout || function() {};
                  window.menuChild_Mouseover = window.menuChild_Mouseover || function() {};
                  window.menuChild_Mouseout = window.menuChild_Mouseout || function() {};

                  // Override navigation functions
                  window.wsMenu_jumpUrl = window.wsMenu_jumpurl = window.wsMenu_jumpURL = function(url) {
                    window.parent.postMessage({
                      type: 'iframe_navigate',
                      href: url,
                      currentPath: ${JSON.stringify(returnedPath)},
                      target: '_self'
                    }, '*');
                  };
                  window.jumpTo = function(url) {
                    window.parent.postMessage({
                      type: 'iframe_navigate',
                      href: url,
                      currentPath: ${JSON.stringify(returnedPath)},
                      target: '_self'
                    }, '*');
                  };
                </script>
              `;
              const jqueryCdn = `<script src="https://code.jquery.com/jquery-1.4.4.min.js"></script>`;
              const baseTag = `<base href="http://${printerIp}/">${jqueryCdn}${fallbacks}`;
              if (/<head[^>]*>/i.test(preparedHtml)) {
                preparedHtml = preparedHtml.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
              } else {
                preparedHtml = `${baseTag}${preparedHtml}`;
              }

              const customStyle = `
                <style>
                  body {
                    font-family: system-ui, -apple-system, sans-serif;
                    color: #1e293b;
                    background-color: #f8fafc;
                    margin: 20px;
                    line-height: 1.5;
                  }
                  a {
                    color: #2563eb;
                    text-decoration: none;
                    font-weight: 500;
                  }
                  a:hover {
                    text-decoration: underline;
                  }
                  ul {
                    padding-left: 20px;
                  }
                  li {
                    margin-bottom: 6px;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                  }
                  th, td {
                    padding: 10px 14px;
                    border: 1px solid #e2e8f0;
                    text-align: left;
                  }
                  th {
                    background-color: #f1f5f9;
                    font-weight: 600;
                  }
                  input[type="text"], input[type="password"], select, textarea {
                    padding: 8px 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    background: white;
                  }
                  input[type="submit"], input[type="button"], button {
                    background-color: #2563eb;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                  }
                  input[type="submit"]:hover, button:hover {
                    background-color: #1d4ed8;
                  }
                  #shortcutlink, #topwrap form, select[name="language"], input[name="switch"] {
                    display: inline-block;
                    margin-right: 10px;
                  }
                  #sideColumn ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                  }
                  #sideColumn > div > ul > li {
                    background: #e2e8f0;
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 8px;
                    font-weight: bold;
                  }
                  #sideColumn .submenu {
                    font-weight: normal;
                    margin-top: 6px;
                    padding-left: 10px;
                    background: #f1f5f9;
                    border-radius: 6px;
                    padding: 6px;
                  }
                  #sideColumn .submenu li {
                    margin: 4px 0;
                  }
                  .display-n {
                    display: block !important;
                  }
                </style>
              `;

              if (preparedHtml.includes('</head>')) {
                preparedHtml = preparedHtml.replace('</head>', `${customStyle}</head>`);
              } else {
                preparedHtml = customStyle + preparedHtml;
              }

              const injectScript = `
                <script>
                (function() {
                  // Register dummy fallback locale functions for Toshiba printers
                  window.fnGetLocaleString = window.fnGetLocaleString || function(id, defaultVal) {
                    return defaultVal || id || "";
                  };
                  window.fnGetResolveLocaleForDisplay = window.fnGetResolveLocaleForDisplay || function(id, defaultVal) {
                    return defaultVal || id || "";
                  };
                  window.fnGetResolveLocale = window.fnGetResolveLocale || function(id, defaultVal) {
                    return defaultVal || id || "";
                  };
                  window.fnGetLocale = window.fnGetLocale || function(id, defaultVal) {
                    return defaultVal || id || "";
                  };

                  // Register dummy fallback menu/hover functions for Ricoh printers
                  window.mouseOverTransfer = window.mouseOverTransfer || function() {};
                  window.mouseOutTransfer = window.mouseOutTransfer || function() {};
                  window.menuParent_Mouseover = window.menuParent_Mouseover || function() {};
                  window.menuParent_Mouseout = window.menuParent_Mouseout || function() {};
                  window.menuChild_Mouseover = window.menuChild_Mouseover || function() {};
                  window.menuChild_Mouseout = window.menuChild_Mouseout || function() {};

                  // Redefine Ricoh menu navigation functions
                  window.wsMenu_jumpUrl = window.wsMenu_jumpurl = window.wsMenu_jumpURL = function(url) {
                    window.parent.postMessage({
                      type: 'iframe_navigate',
                      href: url,
                      currentPath: ${JSON.stringify(returnedPath)},
                      target: '_self'
                    }, '*');
                  };
                  window.jumpTo = function(url) {
                    window.parent.postMessage({
                      type: 'iframe_navigate',
                      href: url,
                      currentPath: ${JSON.stringify(returnedPath)},
                      target: '_self'
                    }, '*');
                  };

                  // Intercept anchor clicks
                  document.addEventListener('click', function(e) {
                    var anchor = e.target.closest('a');
                    if (anchor) {
                      var href = anchor.getAttribute('href');
                      if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
                        if (href.startsWith('http') && !href.includes('${printerIp}')) {
                          return;
                        }
                        e.preventDefault();
                        window.parent.postMessage({
                          type: 'iframe_navigate',
                          href: href,
                          currentPath: ${JSON.stringify(returnedPath)},
                          target: anchor.getAttribute('target') || '_self'
                        }, '*');
                      }
                    }
                  }, true);

                  // Intercept standard form submit events
                  document.addEventListener('submit', function(e) {
                    var form = e.target;
                    var action = form.getAttribute('action') || '';
                    e.preventDefault();
                    
                    var formData = {};
                    var inputs = form.querySelectorAll('input, select, textarea');
                    inputs.forEach(function(input) {
                      if (input.name) {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                          if (input.checked) {
                            formData[input.name] = input.value;
                          }
                        } else {
                          formData[input.name] = input.value;
                        }
                      }
                    });

                    window.parent.postMessage({
                      type: 'iframe_submit',
                      action: action,
                      currentPath: ${JSON.stringify(returnedPath)},
                      formData: formData,
                      target: form.getAttribute('target') || '_self'
                    }, '*');
                  }, true);

                  // Intercept programmatic form.submit() calls
                  var originalSubmit = HTMLFormElement.prototype.submit;
                  HTMLFormElement.prototype.submit = function() {
                    var form = this;
                    var action = form.getAttribute('action') || '';
                    
                    var formData = {};
                    var inputs = form.querySelectorAll('input, select, textarea');
                    inputs.forEach(function(input) {
                      if (input.name) {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                          if (input.checked) {
                            formData[input.name] = input.value;
                          }
                        } else {
                          formData[input.name] = input.value;
                        }
                      }
                    });

                    window.parent.postMessage({
                      type: 'iframe_submit',
                      action: action,
                      currentPath: ${JSON.stringify(returnedPath)},
                      formData: formData,
                      target: form.getAttribute('target') || '_self'
                    }, '*');
                  };
                })();
                </script>
              `;

              if (preparedHtml.includes('</body>')) {
                preparedHtml = preparedHtml.replace('</body>', `${injectScript}</body>`);
              } else {
                preparedHtml += injectScript;
              }

              if (!isHistoryNav) {
                const newHistory = webPreviewHistory.slice(0, webPreviewHistoryIndex + 1);
                newHistory.push(returnedPath);
                setWebPreviewHistory(newHistory);
                setWebPreviewHistoryIndex(newHistory.length - 1);
              }

              setWebPreviewModal(prev => prev ? { ...prev, html: preparedHtml, path: returnedPath } : null);
              setWebPreviewLoading(false);
            } else {
              setWebPreviewModal(prev => prev ? { ...prev, html: `ERROR: ${parsedRes.error || 'Agent không trả về HTML'}` } : null);
              setWebPreviewLoading(false);
            }
          } else if (statusRes.status === 'failed' || !statusRes.ok) {
            clearInterval(pollTimer);
            setWebPreviewModal(prev => prev ? { ...prev, html: `ERROR: ${statusRes.error || 'Lệnh thất bại từ Agent'}` } : null);
            setWebPreviewLoading(false);
          }
        } catch (pollErr: any) {
          console.error('Poll error:', pollErr);
        }
      }, 1500);

    } catch (err: any) {
      setWebPreviewModal(prev => prev ? { ...prev, html: `ERROR: ${err.message}` } : null);
      setWebPreviewLoading(false);
    }
  }; */

  const handleHistoryBack = () => {
    if (webPreviewHistoryIndex > 0 && webPreviewModal) {
      const prevIdx = webPreviewHistoryIndex - 1;
      setWebPreviewHistoryIndex(prevIdx);
      fetchRemotePage(webPreviewModal.ip, webPreviewHistory[prevIdx], 'GET', undefined, true);
    }
  };

  const handleHistoryForward = () => {
    if (webPreviewHistoryIndex < webPreviewHistory.length - 1 && webPreviewModal) {
      const nextIdx = webPreviewHistoryIndex + 1;
      setWebPreviewHistoryIndex(nextIdx);
      fetchRemotePage(webPreviewModal.ip, webPreviewHistory[nextIdx], 'GET', undefined, true);
    }
  };

  const handleToggleDirectLan = (enabled: boolean) => {
    setDirectLan(enabled);
    if (webPreviewModal) {
      if (enabled) {
        setWebPreviewModal(prev => prev ? { ...prev, html: 'DIRECT_LAN' } : null);
        setWebPreviewLoading(false);
      } else {
        // Trigger a fresh remote page fetch via Agent
        fetchRemotePage(webPreviewModal.ip, webPreviewModal.path, 'GET', undefined, false, webPreviewModal.agentUid);
      }
    }
  };

  const handleCloseWebPreview = () => {
    if (webPreviewModal && webPreviewModal.agentUid) {
      fetch(`${BASE_URL}/api/agents/${webPreviewModal.agentUid}/tunnel/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printer_ip: webPreviewModal.ip })
      }).catch(console.error);
    }
    setWebPreviewModal(null);
    setWebPreviewLoading(false);
    setWebPreviewHistory([]);
    setWebPreviewHistoryIndex(-1);
  };

  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg || typeof msg !== 'object') return;
      if (!webPreviewModal || !webPreviewModal.ip) return;

      if (msg.type === 'iframe_navigate') {
        const resolved = resolveRelativePath(msg.href, msg.currentPath);
        fetchRemotePage(webPreviewModal.ip, resolved);
      } else if (msg.type === 'iframe_submit') {
        const resolved = resolveRelativePath(msg.action, msg.currentPath);
        fetchRemotePage(webPreviewModal.ip, resolved, 'POST', msg.formData);
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [webPreviewModal, webPreviewHistory, webPreviewHistoryIndex]);

  useEffect(() => {
    if (webPreviewModal?.html && webPreviewModal.html !== 'LOADING' && !webPreviewModal.html.startsWith('ERROR:')) {
      const blob = new Blob([webPreviewModal.html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      setPreviewBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewBlobUrl('');
    }
  }, [webPreviewModal?.html]);

  // Apply scaling to iframe content
  useEffect(() => {
    const applyScaling = () => {
      try {
        const iframe = previewIframeRef.current;
        if (!iframe) return;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc && doc.body) {
          // Reset html and body height constraints to let them grow dynamically to fit the full content height, avoiding cutoffs
          doc.documentElement.style.height = 'auto';
          doc.body.style.height = 'auto';
          doc.body.style.minHeight = '100%';

          doc.body.style.transform = `scale(${scaleX}, ${scaleY})`;
          doc.body.style.transformOrigin = 'top left';
          doc.body.style.width = `${100 / scaleX}%`;
          doc.body.style.boxSizing = 'border-box';
        }
      } catch (err) {
        console.error('Failed to apply scaling:', err);
      }
    };

    applyScaling();

    const iframe = previewIframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', applyScaling);
      return () => {
        iframe.removeEventListener('load', applyScaling);
      };
    }
  }, [previewBlobUrl, scaleX, scaleY]);

  const prevAgentIpsRef = useRef<Record<string, string>>({});

  // ── FETCH DATA ──
  const fetchLanSitesData = useCallback(async (showLoader = false) => {
    if (showLoader) setLanSitesLoading(true);
    try {
      const data = await getLanSites();
      setLanSites(data);

      // Check for Agent IP changes to show Toast & log to Jobs
      if (Array.isArray(data)) {
        data.forEach((site: any) => {
          const agents = site.agents || site.nodes || [];
          if (Array.isArray(agents)) {
            agents.forEach((ag: any) => {
              const uid = ag.agent_uid || ag.uid;
              const currentIp = ag.local_ip || ag.ip;
              if (uid && currentIp) {
                const prevIp = prevAgentIpsRef.current[uid];
                if (prevIp && prevIp !== currentIp) {
                  const toastMsg = `⚠️ Máy tính Agent (${uid}) vừa thay đổi địa chỉ IP từ ${prevIp} sang ${currentIp}!`;
                  showToast(toastMsg, 'warning');

                  const jobLogMsg = `[JOB LOG - IP CHANGE DETECTED] Vì địa chỉ IP máy PC (${uid}) đổi từ ${prevIp} sang ${currentIp}, tất cả điểm scan (address_list.folder chứa ${prevIp}) sẽ được tự động cập nhật sang ${currentIp} bằng lệnh ricoh_change_scan / toshiba_change_scan.`;
                  console.log('📌 ' + jobLogMsg);

                  try {
                    fetch(`${BASE_URL}/api/jobs/log`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        event: 'ip_changed',
                        agent_uid: uid,
                        old_ip: prevIp,
                        new_ip: currentIp,
                        log_text: jobLogMsg,
                      }),
                    }).catch(() => {});
                  } catch (e) {}

                  // Iterate over printers in this site to trigger change_ftp commands
                  const printers = site.printers || [];
                  const cleanHost = (val: string) => {
                    if (!val) return "";
                    let s = val.trim();
                    if (s.includes("://")) {
                      s = s.split("://")[1];
                    }
                    s = s.split("/")[0].split(":")[0].trim();
                    return s;
                  };

                  printers.forEach((printer: any) => {
                    const brand = detectBrand(printer.printer_name || printer.name || "");
                    if (brand !== 'ricoh' && brand !== 'toshiba') return;

                    let addressList: any[] = [];
                    if (printer.address_book_data && Array.isArray(printer.address_book_data.address_list)) {
                      addressList = printer.address_book_data.address_list;
                    }

                    const matchedEntries = addressList.filter((entry: any) => {
                      if (!entry) return false;
                      const folderVal = entry.folder || entry.server_host || entry.server || "";
                      const host = cleanHost(folderVal);
                      const proto = String(entry.protocol || "").toUpperCase();
                      if (proto === "EMAIL") return false;
                      return host === prevIp;
                    });

                    matchedEntries.forEach((entry: any) => {
                      const cmdName = brand === 'ricoh' ? 'ricoh_change_ftp' : 'toshiba_change_ftp';
                      const targetId = entry.registration_no || entry.id || "";
                      const targetName = entry.name || entry.username || entry.display_name || "";
                      const printerIp = printer.ip || printer.printer_ip || "";
                      const authUser = printer.auth_user || printer.username;
                      const authPass = printer.auth_password || printer.password || "";
                      if (!authUser) {
                        console.warn(`[AUTO TRIGGER] Skip auto trigger change_ftp for printer ${printerIp}: No auth user credentials configured.`);
                        return;
                      }

                      console.log(`🚀 [AUTO TRIGGER ${cmdName.toUpperCase()}] Printer: ${printerIp}, Target ID: ${targetId}, Name: ${targetName}, IP: ${prevIp} -> ${currentIp}`);
                      
                      triggerAgentUtilityExec(uid, cmdName, "", {
                        printer_ip: printerIp,
                        auth_user: authUser,
                        auth_password: authPass,
                        target_id: targetId,
                        target_name: targetName,
                        old_ip: prevIp,
                        new_ip: currentIp
                      }).then((res: any) => {
                        console.log(`✅ [AUTO TRIGGER ${cmdName.toUpperCase()} SUCCESS]:`, res);
                      }).catch((err: any) => {
                        console.error(`❌ [AUTO TRIGGER ${cmdName.toUpperCase()} ERROR]:`, err);
                      });
                    });
                  });
                }
                prevAgentIpsRef.current[uid] = currentIp;
              }
            });
          }
        });
      }
      // console.log("🌐 [LAN SITES DATA RECEIVED FROM VPS]:", data);
      if (data && data.length > 0) {
        // console.log("🖨️ [PRINTERS IN SELECTED LAN]:", data[0].printers);
      }
      
      // Auto select first LAN only if none selected or current selection becomes invalid
      if (data.length > 0) {
        setSelectedLanUid((prev) => {
          const isCurrentValid = prev && data.some(site => site.lan_uid === prev);
          if (isCurrentValid) return prev; // Don't overwrite user's current selection
          const savedLanUid = localStorage.getItem('goxprint_selected_lan_uid');
          const isValidSaved = savedLanUid && data.some(site => site.lan_uid === savedLanUid);
          if (isValidSaved) return savedLanUid;
          localStorage.setItem('goxprint_selected_lan_uid', data[0].lan_uid);
          return data[0].lan_uid;
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Không thể kết nối dữ liệu VPS', 'error');
    } finally {
      if (showLoader) setLanSitesLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchLanSitesData(true);
    const timer = setInterval(() => {
      fetchLanSitesData(false);
    }, 5000);
    return () => clearInterval(timer);
  }, [fetchLanSitesData]);

  // 2s Background Polling for Agent IP Changes
  useEffect(() => {
    const ipCheckTimer = setInterval(async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/agent-ips`, {
          headers: { 'X-API-Token': 'change-me' }
        });
        if (!res.ok) return;
        const resData = await res.json();
        if (resData && resData.ok && Array.isArray(resData.data)) {
          for (const item of resData.data) {
            const agentUid = item.agent_uid;
            const lanUid = item.lan_uid;
            const agentName = item.agent_name || agentUid;
            const referenceIp = item.reference_ip;
            const currentIp = item.current_ip;

            // Trigger exec to query local IP from agent every 2s
            if (agentUid) {
              fetch(`${BASE_URL}/api/agents/${agentUid}/utility/exec?lead=default`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'X-API-Token': 'change-me'
                },
                body: JSON.stringify({
                  command: 'get_agent_ip',
                  command_content: '',
                  is_auto: true
                })
              }).catch(() => {});
            }

            // Compare running IP with VPS database IPDatas table referenceIp
            if (referenceIp && currentIp && currentIp !== referenceIp) {
              showToast(`Cảnh báo: Agent [${agentName}] đã thay đổi IP từ [${referenceIp}] sang [${currentIp}]!`, 'warning');

              // Save the new IP back to VPS database (IPDatas table)
              fetch(`${BASE_URL}/api/agent-ips/save`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'X-API-Token': 'change-me'
                },
                body: JSON.stringify({
                  agent_uid: agentUid,
                  lan_uid: lanUid,
                  agent_name: agentName,
                  ip: currentIp
                })
              }).catch(() => {});
            }
          }
        }
      } catch (err) {
        console.error("Error in 2s IP polling: ", err);
      }
    }, 2000);

    return () => clearInterval(ipCheckTimer);
  }, [showToast]);

  const fetchCameras = useCallback(async (agentUid: string) => {
    if (!agentUid) return;
    setCamerasLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/agents/${agentUid}/cameras`);
      const data = await response.json();
      if (data.ok) {
        setCameras(data.cameras || []);
      } else {
        showToast('Không tải được danh sách camera: ' + data.error, 'error');
      }
    } catch (err: any) {
      showToast('Lỗi tải camera: ' + err.message, 'error');
    } finally {
      setCamerasLoading(false);
    }
  }, [showToast]);

  // Computed active LAN
  const selectedLan = useMemo(() => {
    return lanSites.find((site) => site.lan_uid === selectedLanUid);
  }, [lanSites, selectedLanUid]);

  const onlineAgents = useMemo(() => {
    return (selectedLan?.agents || []).filter((a: any) => a.is_agent_active);
  }, [selectedLan]);

  const activeAgentUid = useMemo(() => {
    if (selectedCameraAgentUid) {
      const exists = onlineAgents.some((a: any) => a.agent_uid === selectedCameraAgentUid);
      if (exists) return selectedCameraAgentUid;
    }
    return onlineAgents[0]?.agent_uid || '';
  }, [selectedCameraAgentUid, onlineAgents]);

  const getLiveQueryTimestamp = () => {
    const now = new Date();
    const targetTime = new Date(now.getTime() - 45 * 1000);
    const YYYY = targetTime.getFullYear();
    const MM = String(targetTime.getMonth() + 1).padStart(2, '0');
    const DD = String(targetTime.getDate()).padStart(2, '0');
    const hh = String(targetTime.getHours()).padStart(2, '0');
    const mm = String(targetTime.getMinutes()).padStart(2, '0');
    const ss = String(targetTime.getSeconds()).padStart(2, '0');
    return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
  };

  useEffect(() => {
    setSelectedCamera(null);
    setCameraForm({
      id: null,
      camera_name: '',
      rtsp_url: '',
      segment_duration: 60,
      prefix: 'rec',
      video_codec: 'copy',
      audio_codec: 'copy',
      no_audio: true,
    });
  }, [activeAgentUid]);

  // ── POLLING COMMAND STATUS ──
  const pollCommandStatus = useCallback((
    commandId: number,
    targetKey: string,
    onSuccess: (pollData: any) => void,
    onFailed: (errorMsg: string) => void,
    pendingLabel = 'Đang thực hiện lệnh...'
  ) => {
    setCommandStatus((prev) => ({ ...prev, [targetKey]: { message: pendingLabel, isPending: true } }));

    const maxPollMs = 180000;
    const pollInterval = 2000;
    const startTime = Date.now();
    let toastReceivedShown = false;

    const timer = setInterval(async () => {
      try {
        const elapsed = Date.now() - startTime;
        if (elapsed > maxPollMs) {
          clearInterval(timer);
          setCommandStatus((prev) => {
            const updated = { ...prev };
            delete updated[targetKey];
            return updated;
          });
          onFailed('Lệnh bị quá thời gian (Timeout 180s)');
          return;
        }

        const res = await getCommandStatus(commandId);
        const elapsedSec = Math.round(elapsed / 1000);

        if (res.status === 'success') {
          clearInterval(timer);
          setCommandStatus((prev) => {
            const updated = { ...prev };
            delete updated[targetKey];
            return updated;
          });
          onSuccess(res);
        } else if (res.status === 'failed' || !res.ok) {
          clearInterval(timer);
          setCommandStatus((prev) => {
            const updated = { ...prev };
            delete updated[targetKey];
            return updated;
          });
          onFailed(res.error || 'Lệnh thực hiện thất bại từ Agent');
        } else {
          if (res.received_at) {
            setCommandStatus((prev) => ({
              ...prev,
              [targetKey]: { message: `⚡ Agent đã nhận - đang thực thi... (${elapsedSec}s)`, isPending: true },
            }));
            if (!toastReceivedShown) {
              toastReceivedShown = true;
              showToast('Agent đã nhận lệnh và đang truy cập máy photocopy...', 'info', 3000);
            }
          } else {
            setCommandStatus((prev) => ({
              ...prev,
              [targetKey]: { message: `⌛ Đang gửi lệnh tới agent... (${elapsedSec}s)`, isPending: true },
            }));
          }
        }
      } catch (err: any) {
        clearInterval(timer);
        setCommandStatus((prev) => {
          const updated = { ...prev };
          delete updated[targetKey];
          return updated;
        });
        onFailed(err.message || 'Lệnh thực hiện thất bại từ Agent');
      }
    }, pollInterval);
  }, [showToast]);

  const triggerLanScan = useCallback((lanData: any) => {
    if (!lanData) return;
    const selectedLanUid = lanData.lan_uid;
    const now = Date.now();
    if (!autoScanTriggers.current[selectedLanUid] || now - autoScanTriggers.current[selectedLanUid] > 3 * 60 * 1000) {
      autoScanTriggers.current[selectedLanUid] = now;
      
      const activeAgentsList = (lanData.agents || []).filter((a: any) => a.is_agent_active);
      if (activeAgentsList.length > 0) {
        activeAgentsList.sort((a: any, b: any) => {
          const tA = new Date(a.last_seen || a.updated_at || a.last_ping || 0).getTime();
          const tB = new Date(b.last_seen || b.updated_at || b.last_ping || 0).getTime();
          return tB - tA;
        });

        const targetAgent = activeAgentsList[0];
        if (targetAgent) {
          showToast(`⏳ Agent (${targetAgent.agent_uid}) đang thực hiện quét ngầm mạng LAN...`, 'info', 6000);
          const a = targetAgent;
          const scriptContent = `def force_scan():
    import logging, threading, sys, os, json, socket, time, subprocess, re, tempfile
    from datetime import datetime
    LOGGER = logging.getLogger(__name__)
    
    bridge_obj = globals().get('bridge') or locals().get('bridge')
    
    if bridge_obj:
        print("[*] Đang thực thi 100% Clean Fresh Scan theo Native Built-in PrintAgent Service...")
        try:
            printers = bridge_obj._load_printers(force_live=True)
            try: bridge_obj.trigger_once()
            except Exception: pass
            
            printers_list = []
            for p in (printers or []):
                mac = str(getattr(p, "mac_address", "") or getattr(p, "mac_id", "") or "").strip().upper().replace("-", ":")
                ip = str(getattr(p, "ip", "") or "").strip()
                name = str(getattr(p, "name", "") or "").strip()
                p_type = str(getattr(p, "printer_type", "") or "unknown").strip().lower()
                
                if not mac: continue
                if p_type == "unknown" and (name.startswith("Copier (") or "printer" not in name.lower()): continue
                
                p_dict = {
                    "name": name, "printer_name": name, "ip": ip, "mac_address": mac,
                    "printer_type": p_type, "is_online": getattr(p, "is_online", True),
                    "status": "online" if getattr(p, "is_online", True) else "offline", "probed": True,
                    "user": getattr(p, "user", "") or getattr(p, "auth_user", ""),
                    "password": getattr(p, "password", "") or getattr(p, "auth_password", ""),
                    "auth_user": getattr(p, "auth_user", "") or getattr(p, "user", ""),
                    "auth_password": getattr(p, "auth_password", "") or getattr(p, "password", ""),
                    "updated_at": getattr(p, "updated_at", "") or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                printers_list.append(p_dict)
            
            count = len(printers_list)
            online_count = sum(1 for p in printers_list if p.get("is_online", True))
            msg = f"Đã quét xong mạng LAN (Clean Fresh Scan). Tìm thấy {count} máy in ({online_count} Online)."
            print(f"  [✓] CLEAN SCAN SUCCESS: {msg}")
            
            res_str = json.dumps(printers_list, ensure_ascii=False, indent=2)
            if globals().get('context'): globals()['context']['result_payload'] = res_str
            else: print(res_str)
        except Exception as e:
            err_msg = f"[-] LỖI THỰC THI NATIVE: {e}"
            print(err_msg); raise RuntimeError(err_msg)
    else:
        print("==================================================")
        print("  [CLEAN FRESH SCAN] DÒ QUÉT TẠO MỚI PRINTERS.JSON")
        print("==================================================")
        print("[1/5] Dò tìm IP Local & Bảng ARP Neighbor...")
        try:
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            subnet_prefix = '.'.join(local_ip.split('.')[:3])
            print(f"  -> Hostname : {hostname}")
            print(f"  -> Local IP : {local_ip} (Subnet: {subnet_prefix}.0/24)")
        except Exception as e:
            subnet_prefix = "192.168.1"
            print(f"  -> Subnet   : {subnet_prefix}.0/24 ({e})")

        arp_map = {}
        try:
            ps_cmd = 'Get-NetNeighbor -AddressFamily IPv4 -ErrorAction SilentlyContinue | Select-Object IPAddress,LinkLayerAddress | ConvertTo-Json -Compress'
            ps_res = subprocess.run(['powershell', '-NoProfile', '-Command', ps_cmd], capture_output=True, text=True, errors='ignore')
            if ps_res.stdout.strip():
                items = json.loads(ps_res.stdout.strip())
                if isinstance(items, dict): items = [items]
                for it in items:
                    ip_val = str(it.get('IPAddress') or '').strip()
                    mac_val = str(it.get('LinkLayerAddress') or '').strip().replace('-', ':').upper()
                    if ip_val and mac_val and mac_val != '00:00:00:00:00:00': arp_map[ip_val] = mac_val
        except Exception: pass

        try:
            arp_out = subprocess.run(['arp', '-a'], capture_output=True, text=True, errors='ignore').stdout
            for line in arp_out.splitlines():
                m = re.search(r'([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\s+([0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2}[:-][0-9a-fa-f]{2})', line)
                if m:
                    ip_k = m.group(1); mac_v = m.group(2).replace('-', ':').upper()
                    if ip_k not in arp_map and mac_v != '00:00:00:00:00:00': arp_map[ip_k] = mac_v
        except Exception: pass

        vps_auth_map = {}
        try:
            import urllib.request
            req = urllib.request.Request("http://192.168.1.154/api/devices/credentials-map", headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=2) as resp:
                auth_json = json.loads(resp.read().decode('utf-8'))
                if auth_json.get("ok"):
                    vps_auth_map = auth_json.get("credentials") or {}
                    print(f"  -> Nạp thành công {len(vps_auth_map)} tài khoản máy in từ VPS Database.")
        except Exception as e:
            print(f"  [!] Chưa kết nối VPS auth DB ({e}). Sẽ lưu thông tin rỗng.")

        temp_dir = tempfile.gettempdir()
        target_dir = os.path.join(temp_dir, 'GoPrinxAgent')
        os.makedirs(target_dir, exist_ok=True)
        json_file = os.path.join(target_dir, 'printers.json')

        print("")
        print(f"[2/5] Dò quét cổng máy in (80, 443, 9100, 515, 631, 161) dải {subnet_prefix}.1 -> 254...")
        discovered_printers = []
        lock = threading.Lock()
        PORTS_TO_CHECK = [80, 443, 9100, 515, 631, 161]

        def detect_brand(name_str, mac_str):
            s = name_str.lower(); clean_mac = mac_str.replace('-', ':').upper()
            if "toshiba" in s or "e-studio" in s or clean_mac.startswith("00:80:91"): return "toshiba"
            if any(k in s for k in ("ricoh", "aficio", "mp ", "sp ", "pro ")) or clean_mac.startswith(("00:26:73", "58:38:79", "00:00:74")): return "ricoh"
            if any(k in s for k in ("hp", "laserjet", "officejet", "pagewide", "deskjet", "envy")) or clean_mac.startswith(("00:1E:0B", "00:08:C7")): return "hp"
            if any(k in s for k in ("canon", "imagerunner", "ir-adv", "ir ", "imageclass", "pixma")) or clean_mac.startswith(("00:1B:A9", "00:00:85")): return "canon"
            if any(k in s for k in ("xerox", "versalink", "altalink", "workcentre")) or clean_mac.startswith(("00:10:A4", "00:00:AA")): return "xerox"
            if any(k in s for k in ("brother", "mfc-", "hl-", "dcp-")) or clean_mac.startswith("00:21:B7"): return "brother"
            if any(k in s for k in ("epson", "workforce", "ecotank")) or clean_mac.startswith("00:00:48"): return "epson"
            return "unknown"

        def probe_host(ip):
            has_open = False
            for port in PORTS_TO_CHECK:
                try:
                    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                        s.settimeout(0.5)
                        if s.connect_ex((ip, port)) == 0: has_open = True; break
                except Exception: pass
            if not has_open: return

            model_name = ""
            try:
                import urllib.request, ssl
                ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
                req = urllib.request.Request(f"http://{ip}/", headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, context=ctx, timeout=1.5) as r:
                    body = r.read().decode('utf-8', errors='ignore'); body_low = body.lower()
                    if "topaccess" in body_low or "toshiba" in body_low:
                        m = re.search(r'e-studio[a-z0-9]+', body, re.IGNORECASE)
                        model_name = f"TOSHIBA {m.group(0)}" if m else "TOSHIBA e-STUDIO"
                    elif "webarch" in body_low or "ricoh" in body_low or "wimtoken" in body_low:
                        m = re.search(r'(?:aficio\s+)?mp\s+[0-9a-z]+', body, re.IGNORECASE)
                        model_name = f"RICOH {m.group(0).upper()}" if m else "RICOH MP"
                    elif "epson" in body_low: model_name = "EPSON Printer"
                    elif "canon" in body_low: model_name = "Canon Printer"
                    elif "hp " in body_low or "laserjet" in body_low: model_name = "HP LaserJet Printer"
            except Exception: pass

            mac = arp_map.get(ip, "")
            if not mac: return
            if not model_name: model_name = f"Printer ({ip})"
            brand = detect_brand(model_name, mac)
            if brand == "unknown" and (model_name.startswith("Copier (") or "printer" not in model_name.lower()): return

            vps_cred = vps_auth_map.get(mac) or {}
            auth_u = vps_cred.get("auth_user", "")
            auth_p = vps_cred.get("auth_password", "")

            printer_obj = {
                "name": model_name, "printer_name": model_name, "ip": ip, "mac_address": mac,
                "printer_type": brand, "is_online": True, "status": "online", "probed": True,
                "user": auth_u, "password": auth_p, "auth_user": auth_u, "auth_password": auth_p,
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            with lock:
                discovered_printers.append(printer_obj)
                print(f"  [✓] ONLINE  | IP: {ip:<15} | MAC: {mac:<17} | Loại: {brand:<8} | Tên: {model_name}")

        threads = []
        for i in range(1, 255):
            t = threading.Thread(target=probe_host, args=(f"{subnet_prefix}.{i}",))
            threads.append(t); t.start()
            if len(threads) >= 40:
                for t in threads: t.join()
                threads = []
        for t in threads: t.join()

        print("")
        print(f"[3/5] Dò tìm thấy {len(discovered_printers)} máy in đang ONLINE.")

        _DEVICE_NAME_BLACKLIST = ("file pro", "print server", "printserver", "f6600", "f66", "h3601", "h36", "router", "modem")
        valid_final_printers = [
            p for p in discovered_printers
            if p.get('mac_address') and not any(kw in str(p.get('name') or '').lower() for kw in _DEVICE_NAME_BLACKLIST)
        ]

        print("")
        print("[4/5] Ghi tệp printers.json TẠO MỚI HOÀN TOÀN (100% Clean Fresh Scan)...")
        with open(json_file, 'w', encoding='utf-8') as f: json.dump(valid_final_printers, f, ensure_ascii=False, indent=2)

        print(f"  [✓] TẠO MỚI THÀNH CÔNG: Đã ghi {len(valid_final_printers)} máy in đang Online vào:")
        print(f"      {json_file}")
        print("==================================================")

try:
    force_scan()
except Exception as err:
    print(f"[-] LỖI THỰC THI: {err}")`;

          const payload = {
              command: 'force_subnet_scan',
              command_content: scriptContent,
              lead: lanData.lead
          };
          fetch(`${BASE_URL}/ui/agents/${a.agent_uid}/utility/exec`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          })
          .then(res => res.json())
          .then(data => {
              const cmdId = data?.command_id || data?.id;
              if (cmdId) {
                  pollCommandStatus(
                      Number(cmdId),
                      `scan_lan_${selectedLanUid}`,
                      async (pollData: any) => {
                          console.log('[DEBUG_LAN_SCAN] pollData received from LAN scan:', pollData);
                          let freshPrinters: any[] = [];
                          const rawRes = pollData?.result || pollData?.result_payload || pollData?.output || pollData?.error_message || pollData?.raw || '';
                          
                          if (Array.isArray(rawRes)) {
                              freshPrinters = rawRes;
                          } else if (typeof rawRes === 'string') {
                              if (rawRes.includes('[') && rawRes.includes(']')) {
                                  try {
                                      const jsonSubstr = rawRes.substring(rawRes.indexOf('['), rawRes.lastIndexOf(']') + 1);
                                      const parsed = JSON.parse(jsonSubstr);
                                      if (Array.isArray(parsed)) freshPrinters = parsed;
                                  } catch (e) {}
                              }
                          }
                          
                          if (freshPrinters.length > 0) {
                              showToast(`✓ Quét mạng LAN hoàn tất, tìm thấy ${freshPrinters.length} máy in!`, 'success', 4000);
                              setLanSites((prevSites: any[]) => {
                                  return prevSites.map((site: any) => {
                                      if (site.lan_uid === selectedLanUid) {
                                          return {
                                              ...site,
                                              printers: freshPrinters.map((p: any, idx: number) => ({
                                                  id: p.id || (90000 + idx),
                                                  ...p,
                                              })),
                                          };
                                      }
                                      return site;
                                  });
                              });
                          } else {
                              showToast('✓ Quét mạng LAN hoàn tất', 'success', 4000);
                          }
                      },
                      async (_err) => {
                          showToast('[-] Quét mạng LAN có lỗi', 'error', 4000);
                      },
                      '⏳ Đang chờ Agent hoàn tất quét ngầm mạng LAN...'
                  );
              }
          })
          .catch(e => {
              console.error(e);
          });
        }
      }
    }
  }, [showToast, pollCommandStatus]);

  const getTargetAgentUid = useCallback((printerId: string | number) => {
    const pId = Number(printerId);
    const printer = selectedLan?.printers?.find((p: any) => Number(p.id) === pId);
    if (!printer || !selectedLan) return '';
    const onlineAgents = (selectedLan.agents || []).filter((a: any) => a.is_agent_active);
    const selected = selectedTargetAgents[pId];
    if (selected) {
      const isSelOnline = onlineAgents.some((a: any) => a.agent_uid === selected);
      if (isSelOnline) return selected;
    }
    if (printer.agent_uid) {
      const isAssignedOnline = onlineAgents.some((a: any) => a.agent_uid === printer.agent_uid);
      if (isAssignedOnline) return printer.agent_uid;
    }
    if (onlineAgents.length > 0) {
      return onlineAgents[0].agent_uid;
    }
    return printer.agent_uid || '';
  }, [selectedLan, selectedTargetAgents]);

  // State to store scan file counts for each private email destination on VPS
  const [emailFileCounts, setEmailFileCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!selectedLan || !selectedLan.emails) {
      setEmailFileCounts({});
      return;
    }
    
    let isMounted = true;
    const fetchCounts = async () => {
      const counts: Record<string, number> = {};
      const privateEmails = selectedLan.emails.filter(e => e.email_type === 'private');
      
      await Promise.all(
        privateEmails.map(async (em) => {
          try {
            const res = await getScansFiles(selectedLan.lan_uid, em.email);
            if (isMounted) {
              if (res.ok && Array.isArray(res.rows)) {
                counts[em.email] = res.rows.length;
              } else {
                counts[em.email] = 0;
              }
            }
          } catch (err) {
            console.error(`Failed to fetch scan files count for ${em.email}`, err);
            if (isMounted) {
              counts[em.email] = 0;
            }
          }
        })
      );
      if (isMounted) {
        setEmailFileCounts(counts);
      }
    };
    
    fetchCounts();
    return () => {
      isMounted = false;
    };
  }, [selectedLan]);

  // Agent utilities states
  const [scanAutoOpenFile, setScanAutoOpenFile] = useState(true);
  const [scanAutoOpenDir, setScanAutoOpenDir] = useState(true);
  const [utilitySettingsLoading, setUtilitySettingsLoading] = useState(false);
  const [utilityActionPending, setUtilityActionPending] = useState<string | null>(null);
  const [utilityStatusMsg, setUtilityStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [utilityCommands, setUtilityCommands] = useState<any[]>([]);
  const [utilityCommandsLoading, setUtilityCommandsLoading] = useState(false);
  const [customRunCommand, setCustomRunCommand] = useState('');
  const [viewOutputModal, setViewOutputModal] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false, title: '', content: '',
  });

  const [editableSettingsText, setEditableSettingsText] = useState('');

  useEffect(() => {
    if (viewOutputModal.isOpen && modalContentRef.current) {
      modalContentRef.current.scrollTop = modalContentRef.current.scrollHeight;
    }
  }, [viewOutputModal.isOpen, viewOutputModal.content, editableSettingsText]);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaveStatus, setSettingsSaveStatus] = useState<string | null>(null);

  const handleSaveSettings = async () => {
    if (!selectedUtilityAgent) return;
    try {
      JSON.parse(editableSettingsText);
    } catch (e: any) {
      setSettingsSaveStatus(`❌ Lỗi định dạng JSON: ${e.message}`);
      return;
    }
    setIsSavingSettings(true);
    setSettingsSaveStatus('⌛ Đang gửi cấu hình mới tới Agent...');
    const base64Content = btoa(unescape(encodeURIComponent(editableSettingsText)));
    const pythonScript = `import os, sys, json, base64
new_content = base64.b64decode("${base64Content}").decode("utf-8")
try:
    parsed = json.loads(new_content)
    exe_dir = os.path.dirname(sys.executable) if getattr(sys, 'frozen', False) else os.getcwd()
    candidates = [
        os.path.join(exe_dir, 'settings.json'),
        os.path.join(os.getcwd(), 'settings.json'),
        'settings.json',
    ]
    found = None
    for p in candidates:
        if os.path.exists(p):
            found = p
            break
    if not found:
        found = candidates[0]

    with open(found + '.bak', 'w', encoding='utf-8') as f_bak:
        try:
            with open(found, 'r', encoding='utf-8') as f_orig:
                f_bak.write(f_orig.read())
        except:
            pass

    with open(found, 'w', encoding='utf-8') as f:
        json.dump(parsed, f, ensure_ascii=False, indent=2)

    try:
        if 'bridge' in globals():
            globals()['bridge']._config.reload()
    except Exception as e:
        pass

    msg = "Đã lưu cấu hình thành công!"
    if globals().get('context'):
        globals()['context']['result_payload'] = msg
    else:
        raise RuntimeError(msg)
except Exception as e:
    raise RuntimeError(str(e))
`;
    try {
      const res = await triggerAgentUtilityExec(selectedUtilityAgent.agent_uid, 'save_settings_json', pythonScript);
      if (!res.ok || !res.command_id) {
        throw new Error(res.error || 'Không thể tạo lệnh tiện ích');
      }
      const commandId = res.command_id;
      const maxPollMs = 60000;
      const startTime = Date.now();
      const timer = setInterval(async () => {
        try {
          const elapsed = Date.now() - startTime;
          if (elapsed > maxPollMs) {
            clearInterval(timer);
            setSettingsSaveStatus('❌ Lưu thất bại: Hết thời gian chờ (60s)');
            setIsSavingSettings(false);
            return;
          }
          const statusRes = await getCommandStatus(commandId);
          if (statusRes.status === 'success') {
            clearInterval(timer);
            setSettingsSaveStatus('✔️ Đã lưu cấu hình và tự động reload thành công!');
            setIsSavingSettings(false);
            setViewOutputModal(prev => ({ ...prev, content: editableSettingsText }));
            setTimeout(() => setSettingsSaveStatus(null), 3000);
          } else if (statusRes.status === 'failed' || !statusRes.ok) {
            clearInterval(timer);
            setSettingsSaveStatus(`❌ Lỗi từ máy trạm: ${statusRes.error || 'Lưu thất bại'}`);
            setIsSavingSettings(false);
          }
        } catch (pollErr: any) {
          console.error('Poll error:', pollErr);
        }
      }, 1000);
    } catch (err: any) {
      setSettingsSaveStatus(`❌ Lỗi kết nối: ${err.message}`);
      setIsSavingSettings(false);
    }
  };

  const formatJsonText = (raw: string): string => {
    try {
      let parsed = raw;
      while (typeof parsed === 'string') {
        const trimmed = parsed.trim();
        if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
          parsed = JSON.parse(parsed);
        } else {
          break;
        }
      }
      if (typeof parsed === 'object' && parsed !== null) {
        return JSON.stringify(parsed, null, 2);
      }
      if (typeof parsed === 'string') {
        parsed = parsed.replace(/\\n/g, '\n')
                       .replace(/\\t/g, '\t')
                       .replace(/\\"/g, '"')
                       .replace(/\\\\/g, '\\');
      }
      return String(parsed);
    } catch (e) {
      return raw;
    }
  };

  useEffect(() => {
    if (viewOutputModal.isOpen && viewOutputModal.title.includes('settings.json')) {
      setEditableSettingsText(formatJsonText(viewOutputModal.content));
      setSettingsSaveStatus(null);
    }
  }, [viewOutputModal.isOpen, viewOutputModal.title, viewOutputModal.content]);

  const isDuplicatePending = async (agentUid: string, commandType: string, paramsToCheck: any): Promise<boolean> => {
    try {
      const res = await getJobs(undefined, undefined, agentUid);
      if (res.ok && res.jobs) {
        const pendingJobs = res.jobs.filter((job: any) => job.status === 'pending');
        for (const job of pendingJobs) {
          if (job.command_type !== commandType) continue;
          try {
            const jobParams = JSON.parse(job.command_params);
            let match = true;
            for (const key of Object.keys(paramsToCheck)) {
              if (jobParams[key] !== paramsToCheck[key]) {
                match = false;
                break;
              }
            }
            if (match) return true;
          } catch {
            if (job.command_params === JSON.stringify(paramsToCheck)) return true;
          }
        }
      }
    } catch (e) {
      console.error("Failed to check duplicate pending jobs", e);
    }
    return false;
  };

  // Commands that return content via RuntimeError — show in view modal instead of error
  const VIEW_COMMANDS = new Set(['view_settings_json', 'view_stout', 'view_sterror', 'get_public_ip', 'check_watchdog', 'open_web_setting']);
  const VIEW_COMMAND_TITLES: Record<string, string> = {
    view_settings_json: '⚙️ settings.json',
    view_stout: '📄 stout.txt — 100 dòng gần nhất',
    view_sterror: '🔴 sterror.txt — 100 dòng gần nhất',
    get_public_ip: '🌍 IP Public',
    check_watchdog: '🩺 Check Watchdog',
    open_web_setting: '🌐 Web setting',
  };

  const loadUtilitySettings = useCallback(async (agent: any) => {
    if (!agent) return;
    setUtilitySettingsLoading(true);
    setUtilityStatusMsg(null);
    
    try {
      const data = await getAgentSettings(agent.agent_uid);
      if (data.ok) {
        setScanAutoOpenFile(!!data.scan_auto_open_file);
        setScanAutoOpenDir(!!data.scan_auto_open_dir);
      } else {
        throw new Error(data.error || 'Agent không tồn tại trên VPS');
      }
    } catch (err: any) {
      console.error('Failed to load agent settings:', err);
      const errorMsg = err.message?.includes('Agent not found') || err.message?.includes('404')
        ? `Agent này chưa được đăng ký trên VPS backend. Vui lòng đảm bảo agent đang chạy và đã kết nối.`
        : `Không thể tải cài đặt từ VPS: ${err.message}`;
      setUtilityStatusMsg({
        text: errorMsg,
        isError: true
      });
      // Set defaults on error
      setScanAutoOpenFile(true);
      setScanAutoOpenDir(true);
    } finally {
      setUtilitySettingsLoading(false);
    }
  }, []);

  const handleToggleSetting = useCallback(async (key: 'scan_auto_open_file' | 'scan_auto_open_dir', currentValue: boolean) => {
    if (!selectedUtilityAgent) return;
    const nextValue = !currentValue;
    
    // Optimistic update
    if (key === 'scan_auto_open_file') {
      setScanAutoOpenFile(nextValue);
    } else {
      setScanAutoOpenDir(nextValue);
    }

    try {
      const data = await updateAgentSettings(selectedUtilityAgent.agent_uid, {
        [key]: nextValue
      });
      if (!data.ok) {
        throw new Error(data.error || 'Failed to update setting');
      }
      setUtilityStatusMsg({
        text: 'Đã cập nhật cài đặt thành công.',
        isError: false
      });
    } catch (err: any) {
      console.error('Failed to update agent setting:', err);
      // Rollback
      if (key === 'scan_auto_open_file') {
        setScanAutoOpenFile(currentValue);
      } else {
        setScanAutoOpenDir(currentValue);
      }
      setUtilityStatusMsg({
        text: `Lỗi cập nhật cài đặt: ${err.message}`,
        isError: true
      });
    }
  }, [selectedUtilityAgent]);

  const handleTriggerUtility = useCallback(async (action: 'printers' | 'scan' | 'dxdiag' | 'change_ip' | 'run_command', payload?: any) => {
    if (!selectedUtilityAgent) return;

    const backendAction = action === 'printers' ? 'devices_and_printers' : (action === 'scan' ? 'open_scan_folder' : (action === 'change_ip' ? 'change_ip' : (action === 'run_command' ? 'run_command' : 'dxdiag')));
    const isDup = await isDuplicatePending(selectedUtilityAgent.agent_uid, 'trigger_utility', {
      action: backendAction,
      ...(payload || {})
    });
    if (isDup) {
      showToast('Lệnh tiện ích này đang chờ phản hồi từ Agent!', 'info');
      return;
    }

    setUtilityActionPending(action);
    setUtilityStatusMsg({ text: '⌛ Đang gửi lệnh tới Agent...', isError: false });
    
    try {
      const res = await triggerAgentUtility(selectedUtilityAgent.agent_uid, backendAction, payload);
      if (!res.ok || !res.command_id) {
        throw new Error(res.error || 'Không thể tạo lệnh tiện ích');
      }
      
      const commandId = res.command_id;
      const maxPollMs = 60000;
      const pollInterval = 1000;
      const startTime = Date.now();
      
      const timer = setInterval(async () => {
        try {
          const elapsed = Date.now() - startTime;
          if (elapsed > maxPollMs) {
            clearInterval(timer);
            setUtilityStatusMsg({ text: 'Yêu cầu quá thời gian chờ (60s)', isError: true });
            setUtilityActionPending(null);
            return;
          }
          
          const statusRes = await getCommandStatus(commandId);
          if (statusRes.status === 'success') {
            clearInterval(timer);
            setUtilityStatusMsg({ text: '⚡ Thực hiện lệnh tiện ích thành công!', isError: false });
            setUtilityActionPending(null);
          } else if (statusRes.status === 'failed' || !statusRes.ok) {
            clearInterval(timer);
            setUtilityStatusMsg({ text: `❌ Thất bại: ${statusRes.error || 'Lệnh thất bại từ Agent'}`, isError: true });
            setUtilityActionPending(null);
          } else {
            const elapsedSec = Math.round(elapsed / 1000);
            if (statusRes.received_at) {
              setUtilityStatusMsg({ text: `⚡ Agent đã nhận lệnh - đang mở tiện ích... (${elapsedSec}s)`, isError: false });
            } else {
              setUtilityStatusMsg({ text: `⌛ Đang chuyển lệnh tới Agent... (${elapsedSec}s)`, isError: false });
            }
          }
        } catch (pollErr: any) {
          console.error('Error polling utility status:', pollErr);
        }
      }, pollInterval);
      
    } catch (err: any) {
      console.error(`Failed to trigger ${action}:`, err);
      setUtilityStatusMsg({
        text: `Lỗi kết nối hoặc gửi lệnh: ${err.message}`,
        isError: true
      });
      setUtilityActionPending(null);
    }
  }, [selectedUtilityAgent]);

  const handleTriggerUtilityExec = useCallback(async (command: string, commandContent: string) => {
    if (!selectedUtilityAgent) return;

    const isDup = await isDuplicatePending(selectedUtilityAgent.agent_uid, 'trigger_utility', {
      action: 'exec_utility',
      command: command
    });
    if (isDup) {
      showToast('Yêu cầu chạy script/lệnh này đang chờ phản hồi từ Agent!', 'info');
      return;
    }
    
    // Find cmd in local state utilityCommands
    const cmdObj = utilityCommands.find(c => c.command === command);
    const isOutputModal = cmdObj?.output_modal || VIEW_COMMANDS.has(command);
    const displayTitle = cmdObj?.label || VIEW_COMMAND_TITLES[command] || command;

    let content = commandContent;
    if (command === 'change_agent_ip' || command === 'check_scan_ip_match') {
      const isChangeIp = command === 'change_agent_ip';
      const currentIp = selectedUtilityAgent?.local_ip || selectedUtilityAgent?.ip || selectedUtilityAgent?.agent_ip || selectedUtilityAgent?.localIp || '';
      
      // Open IP input modal immediately without blocking
      setIpInputModal({
        isOpen: true,
        title: isChangeIp ? '🌐 Đổi địa chỉ IP tĩnh' : '🔍 Kiểm tra IP khớp Copier',
        hint: isChangeIp
          ? 'Nhập địa chỉ IPv4 tĩnh muốn gán cho máy Agent.'
          : 'Nhập địa chỉ IP muốn kiểm tra xem copier nào có FTP Scan entry khớp.',
        value: currentIp,
        changeAllTo: '',
        scanStatus: isChangeIp ? '⏳ Loading... Đang quét điểm scan FTP trên máy photo...' : '',
        error: '',
        onConfirm: (targetIp: string, changeAllTo?: string) => {
          const finalContent = commandContent.replace('__TARGET_IP__', targetIp);
          setUtilityActionPending(command);
          setUtilityStatusMsg({ text: '⌛ Đang gửi lệnh tới Agent...', isError: false });
          triggerAgentUtilityExec(selectedUtilityAgent!.agent_uid, command, finalContent, {
            target_ip: targetIp,
            ip: targetIp,
            printer_ip: targetIp,
            change_all_to: changeAllTo || ''
          })
            .then((res: any) => {
              if (!res.ok || !res.command_id) throw new Error(res.error || 'Không thể tạo lệnh tiện ích');
              const commandId = res.command_id;
              const maxPollMs = 60000;
              const startTime = Date.now();
              const timer = setInterval(async () => {
                try {
                  const elapsed = Date.now() - startTime;
                  if (elapsed > maxPollMs) {
                    clearInterval(timer);
                    setUtilityStatusMsg({ text: 'Yêu cầu quá thời gian chờ (60s)', isError: true });
                    setUtilityActionPending(null);
                    return;
                  }
                  const statusRes = await getCommandStatus(commandId);
                  if (statusRes.status === 'success') {
                    clearInterval(timer);
                    if (isOutputModal) {
                      setViewOutputModal({
                        isOpen: true,
                        title: displayTitle,
                        content: (typeof statusRes.result_payload === 'object' && statusRes.result_payload) ? JSON.stringify(statusRes.result_payload, null, 2) : (statusRes.result_payload || statusRes.error || statusRes.result || '(không có nội dung)'),
                      });
                      setUtilityStatusMsg(null);
                    } else {
                      setUtilityStatusMsg({ text: '⚡ Thực hiện lệnh thành công!', isError: false });
                    }
                    setUtilityActionPending(null);
                  } else if (statusRes.status === 'failed' || !statusRes.ok) {
                    clearInterval(timer);
                    if (isOutputModal) {
                      setViewOutputModal({
                        isOpen: true,
                        title: displayTitle,
                        content: statusRes.error || ((typeof statusRes.result_payload === 'object' && statusRes.result_payload) ? JSON.stringify(statusRes.result_payload, null, 2) : (statusRes.result_payload || statusRes.result || '(không có nội dung)')),
                      });
                      setUtilityStatusMsg(null);
                    } else {
                      setUtilityStatusMsg({ text: `❌ Thất bại: ${statusRes.error || 'Lệnh thất bại từ Agent'}`, isError: true });
                    }
                    setUtilityActionPending(null);
                  } else {
                    const elapsedSec = Math.round(elapsed / 1000);
                    setUtilityStatusMsg({ text: `⌛ Đang xử lý... (${elapsedSec}s)`, isError: false });
                  }
                } catch (pollErr: any) {
                  console.error('Poll error:', pollErr);
                }
              }, 1000);
            })
            .catch((err: any) => {
              setUtilityStatusMsg({ text: `Lỗi: ${err.message}`, isError: true });
              setUtilityActionPending(null);
            });
        },
      });

      // Lazy load matching scan destinations in background (non-blocking)
      if (isChangeIp && currentIp) {
        const checkCmdObj = utilityCommands.find((c: any) => c.command === 'check_scan_ip_match');
        if (checkCmdObj && checkCmdObj.command_content) {
          const checkContent = checkCmdObj.command_content.replace('__TARGET_IP__', currentIp);
          triggerAgentUtilityExec(selectedUtilityAgent.agent_uid, 'check_scan_ip_match', checkContent, {
            target_ip: currentIp,
            ip: currentIp,
            printer_ip: currentIp
          })
            .then((res: any) => {
              if (res.ok && res.command_id) {
                const startTime = Date.now();
                const timer = setInterval(async () => {
                  const elapsed = Date.now() - startTime;
                  if (elapsed > 40000) { clearInterval(timer); return; }
                  try {
                    const statusRes = await getCommandStatus(res.command_id);
                    if (statusRes.status === 'success' || statusRes.status === 'failed') {
                      clearInterval(timer);
                      const resultText = statusRes.result_payload || statusRes.result || statusRes.error || '';
                      setIpInputModal(prev => ({
                        ...prev,
                        scanStatus: resultText ? `🔍 ${resultText}` : ''
                      }));
                    }
                  } catch (e) {}
                }, 1500);
              }
            })
            .catch(() => {});
        }
      }
      return;
    }

    // Auto-substitute parameters if sending from Utility Modal directly
    const firstCopier = selectedLan?.printers?.[0];
    if (content.includes('__TARGET_IP__')) {
      content = content.replace(/__TARGET_IP__/g, firstCopier?.ip || '192.168.1.155');
    }
    if (content.includes('__TARGET_USER__')) {
      content = content.replace(/__TARGET_USER__/g, firstCopier?.auth_user || firstCopier?.user || 'admin');
    }
    if (content.includes('__TARGET_PASS__')) {
      content = content.replace(/__TARGET_PASS__/g, firstCopier?.auth_password || firstCopier?.password || '');
    }
    if (content.includes('__TARGET_ID__')) {
      content = content.replace(/__TARGET_ID__/g, '001');
    }
    if (content.includes('__TARGET_SCAN_USER__')) {
      content = content.replace(/__TARGET_SCAN_USER__/g, 'scan');
    }

    setUtilityActionPending(command);
    setUtilityStatusMsg({ text: '⌛ Đang gửi lệnh tới Agent...', isError: false });
    try {
      const res = await triggerAgentUtilityExec(selectedUtilityAgent.agent_uid, command, content);
      if (!res.ok || !res.command_id) {
        throw new Error(res.error || 'Không thể tạo lệnh tiện ích');
      }
      const commandId = res.command_id;
      const maxPollMs = 60000;
      const startTime = Date.now();
      const timer = setInterval(async () => {
        try {
          const elapsed = Date.now() - startTime;
          if (elapsed > maxPollMs) {
            clearInterval(timer);
            setUtilityStatusMsg({ text: 'Yêu cầu quá thời gian chờ (60s)', isError: true });
            setUtilityActionPending(null);
            return;
          }
          const statusRes = await getCommandStatus(commandId);
          if (statusRes.status === 'success') {
            clearInterval(timer);
            if (isOutputModal) {
              setViewOutputModal({
                isOpen: true,
                title: displayTitle,
                content: (typeof statusRes.result_payload === 'object' && statusRes.result_payload) ? JSON.stringify(statusRes.result_payload, null, 2) : (statusRes.result_payload || statusRes.error || statusRes.result || '(không có nội dung)'),
              });
              setUtilityStatusMsg(null);
            } else {
              setUtilityStatusMsg({ text: '⚡ Thực hiện lệnh thành công!', isError: false });
            }
            setUtilityActionPending(null);
          } else if (statusRes.status === 'failed' || !statusRes.ok) {
            clearInterval(timer);
            if (isOutputModal) {
              setViewOutputModal({
                isOpen: true,
                title: displayTitle,
                content: statusRes.error || ((typeof statusRes.result_payload === 'object' && statusRes.result_payload) ? JSON.stringify(statusRes.result_payload, null, 2) : (statusRes.result_payload || statusRes.result || '(không có nội dung)')),
              });
              setUtilityStatusMsg(null);
            } else {
              setUtilityStatusMsg({ text: `❌ Thất bại: ${statusRes.error || 'Lệnh thất bại từ Agent'}`, isError: true });
            }
            setUtilityActionPending(null);
          } else {
            const elapsedSec = Math.round(elapsed / 1000);
            const progress = statusRes.progress_text || `Đang xử lý... (${elapsedSec}s)`;
            setUtilityStatusMsg({ text: `⌛ ${progress}`, isError: false });
          }
        } catch (pollErr: any) {
          // fetchApi may throw (not return) when HTTP status is error.
          // For view commands, the thrown Error.message IS the content we want to display.
          const errMsg: string = pollErr?.message || String(pollErr || '');
          if (isOutputModal && (errMsg.startsWith('[PATH]') || errMsg.includes('stout') || errMsg.includes('sterror') || errMsg.includes('settings.json'))) {
            clearInterval(timer);
            setViewOutputModal({
              isOpen: true,
              title: displayTitle,
              content: errMsg,
            });
            setUtilityStatusMsg(null);
            setUtilityActionPending(null);
          } else {
            console.error('Poll error:', pollErr);
          }
        }
      }, 1000);
    } catch (err: any) {
      setUtilityStatusMsg({ text: `Lỗi: ${err.message}`, isError: true });
      setUtilityActionPending(null);
    }
  }, [selectedUtilityAgent, utilityCommands]);

  const handleEmergencyRestart = useCallback(async () => {
    if (!selectedUtilityAgent) return;

    const isDup = await isDuplicatePending(selectedUtilityAgent.agent_uid, 'emergency_restart', {
      action: 'emergency_restart'
    });
    if (isDup) {
      showToast('Yêu cầu khởi động lại Agent đang chờ phản hồi từ Agent!', 'info');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: '🚨 Kích hoạt Khởi động khẩn cấp',
      message: 'Lệnh này sẽ đánh dấu yêu cầu thoát khẩn cấp cho Agent này trên server. File watchdog.bat (nếu có trên máy client) sẽ tự động phát hiện và ép đóng printagent.exe rồi mở lại. Việc này giúp thoát khỏi tình trạng treo update. Bạn có chắc chắn muốn thực hiện?',
      onConfirm: async () => {
        setUtilityActionPending('emergency_restart');
        setUtilityStatusMsg({ text: '⌛ Đang đăng ký cờ khởi động lại khẩn cấp...', isError: false });
        try {
          const res = await triggerEmergencyRestart(selectedUtilityAgent.agent_uid);
          if (!res.ok) throw new Error(res.error || 'Thất bại');
          setUtilityStatusMsg({ text: '⚡ Đã lưu cờ tắt khẩn cấp trên Server. Chờ Watchdog quét...', isError: false });
        } catch (err: any) {
          setUtilityStatusMsg({ text: `❌ Lỗi: ${err.message}`, isError: true });
        } finally {
          setUtilityActionPending(null);
        }
      }
    });
  }, [selectedUtilityAgent]);

  useEffect(() => {
    if (activeModal === 'utilities' && selectedUtilityAgent) {
      loadUtilitySettings(selectedUtilityAgent);
      // Fetch dynamic command list from backend JSON
      setUtilityCommandsLoading(true);
      getAgentUtilityCommands(selectedUtilityAgent.agent_uid)
        .then((res: any) => {
          if (res?.ok && Array.isArray(res.commands)) {
            setUtilityCommands(res.commands);
          }
        })
        .catch((err: any) => console.error('Failed to load utility commands:', err))
        .finally(() => setUtilityCommandsLoading(false));
    }
  }, [activeModal, selectedUtilityAgent, loadUtilitySettings]);

  // Filter out Unknown Printers, and sort the last viewed one to the top
  const filteredPrinters = useMemo(() => {
    if (!selectedLan) return [];
    const filtered = (selectedLan.printers || []).filter((p: any) => {
      // 1. Không show Unknown Printer
      const name = (p.printer_name || '').toLowerCase().trim();
      if (name.includes('unknown') || name === 'unknown printer') return false;

      // 2. Lọc generic printer như pdf, fax, brother, etc.
      if (
        name.includes('pdf') ||
        name.includes('fax') ||
        name.includes('brother') ||
        name.includes('canon lbp') ||
        name.includes('rustdesk')
      ) {
        return false;
      }

      // 3. Ẩn copier offline (chỉ ẩn sau khi đã probe xong)
      if (p.probed && !p.is_online) return false;

      return true;
    });

    // console.log("✨ [FILTERED PRINTERS RESULT FOR UI]:", filtered);

    if (initialLastViewedId) {
      return [...filtered].sort((a, b) => {
        const aMatch = String(a.id) === initialLastViewedId;
        const bMatch = String(b.id) === initialLastViewedId;
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    return filtered;
  }, [selectedLan, initialLastViewedId]);

  const handleCopierClick = (printerId: string) => {
    localStorage.setItem('goxprint_last_viewed_copier_id', printerId);
  };

  // Pre-fill target agent and credentials maps when selectedLan changes
  useEffect(() => {
    if (selectedLan) {
      const defaultTargets: Record<string, string> = {};

      selectedLan.printers.forEach((p) => {
        // Target agent default (first online agent or printer.agent_uid)
        const onlineAgents = (selectedLan.agents || []).filter((a) => a.is_agent_active);
        const matchedAgent = onlineAgents.find((a) => a.agent_uid === p.agent_uid) || onlineAgents[0];
        defaultTargets[p.id] = matchedAgent ? matchedAgent.agent_uid : (p.agent_uid || '');
      });

      setSelectedTargetAgents((prev) => ({ ...defaultTargets, ...prev }));

      setCopierCredentials((prev) => {
        const next = { ...prev };
        selectedLan.printers.forEach((p) => {
          // Direct auth values pushed from Agent's printers.json via RAM
          const agentPushUser = p.auth_user || p.user || '';
          const agentPushPass = p.auth_password || p.password || '';

          const savedLocal = (() => {
            try {
              const raw = localStorage.getItem(`copier_auth_${p.id}`) || (p.mac_id ? localStorage.getItem(`copier_auth_${p.mac_id}`) : null);
              return raw ? JSON.parse(raw) : null;
            } catch (e) {
              return null;
            }
          })();

          const existing = next[p.id];
          const user = (existing?.user !== undefined)
            ? existing.user
            : (agentPushUser !== '')
              ? agentPushUser
              : (savedLocal?.user !== undefined ? savedLocal.user : '');

          const pass = (existing?.pass !== undefined)
            ? existing.pass
            : (agentPushPass !== '')
              ? agentPushPass
              : (savedLocal?.pass !== undefined ? savedLocal.pass : '');

          next[p.id] = { user, pass };
        });
        return next;
      });
    }
  }, [selectedLan]);

  // ── SAVE AUTH (WEB CREDENTIALS) ──
  const handleSaveAuth = async (p: any) => {
    const printerId = String(typeof p === 'object' ? p.id : p);
    const macId = typeof p === 'object' ? (p.mac_id || p.mac_address || '') : printerId;
    const pType = typeof p === 'object' ? (p.printer_type || p.type || '') : '';
    const creds = copierCredentials[printerId] || { user: '', pass: '' };

    try {
      localStorage.setItem(`copier_auth_${printerId}`, JSON.stringify(creds));
      if (macId) localStorage.setItem(`copier_auth_${macId}`, JSON.stringify(creds));
    } catch (e) {}

    setSaveAuthLoading((prev) => ({ ...prev, [printerId]: true }));
    try {
      const res = await saveCopierCredentials(macId || printerId, creds.user, creds.pass, macId, pType);
      if (res.ok) {
        const cmdId = res.command_id || res.id;
        if (cmdId) {
          showToast('Đã tạo lệnh lưu Auth, đang đợi Agent thực thi và ghi vào đĩa...', 'info', 3000);
          pollCommandStatus(
            cmdId,
            printerId,
            (res) => {
              const extraMsg = res?.error ? ` (${res.error})` : (res?.result ? ` (${res.result})` : '');
              showToast(`Đã test đăng nhập thành công và lưu vào database!${extraMsg}`, 'success', 5000);
              setLanSites((prevSites) =>
                prevSites.map((site) => ({
                  ...site,
                  printers: site.printers.map((item) =>
                    String(item.id) === String(printerId) || (macId && item.mac_id === macId)
                      ? { ...item, auth_user: creds.user, auth_password: creds.pass }
                      : item
                  ),
                }))
              );
              setSaveAuthLoading((prev) => ({ ...prev, [printerId]: false }));
            },
            (errorMsg) => {
              showToast(`Lỗi Agent lưu Auth: ${errorMsg}`, 'error');
              setSaveAuthLoading((prev) => ({ ...prev, [printerId]: false }));
            },
            'Đang thực thi lưu tài khoản vào tệp printers.json...'
          );
        } else {
          showToast('Đã lưu tài khoản Web UI máy photocopy thành công', 'success');
          setLanSites((prevSites) =>
            prevSites.map((site) => ({
              ...site,
              printers: site.printers.map((item) =>
                String(item.id) === String(printerId) || (macId && item.mac_id === macId)
                  ? { ...item, auth_user: creds.user, auth_password: creds.pass }
                  : item
              ),
            }))
          );
          setSaveAuthLoading((prev) => ({ ...prev, [printerId]: false }));
        }
      } else {
        throw new Error(res.error || 'Lưu thất bại');
      }
    } catch (err: any) {
      showToast(`Lỗi lưu Auth: ${err.message}`, 'error');
      setSaveAuthLoading((prev) => ({ ...prev, [printerId]: false }));
    }
  };

  const saveScanPointToDb = async (macId: string, addressBookData: any, printerName?: string, ip?: string, agentUid?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/scan-points/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mac_id: macId,
          address_book_data: addressBookData,
          printer_name: printerName || 'Photocopy',
          ip: ip || '',
          agent_uid: agentUid || ''
        })
      });
      const data = await response.json();
      console.log('Saved scan point to DB:', data);
    } catch (err) {
      console.error('Failed to save scan point to DB:', err);
    }
  };

  // ── REFECTH / SYNC ADDRESS BOOK ──
  const handleRefetchAddressBook = async (pTarget: any) => {
    const allPrinters = (lanSites || []).flatMap((s: any) => s.printers || []);
    const pObj = (typeof pTarget === 'object' && pTarget !== null)
      ? pTarget
      : (allPrinters.find((item: any) => String(item.id) === String(pTarget) || item.mac_id === pTarget || item.mac_address === pTarget || item.ip === pTarget)
         || selectedLan?.printers?.find((item: any) => String(item.id) === String(pTarget) || item.mac_id === pTarget || item.mac_address === pTarget || item.ip === pTarget)
         || {});

    const printerId = String(pObj.id || (typeof pTarget === 'string' ? pTarget : ''));
    const printerIp = pObj.ip || pObj.printer_ip || (typeof pTarget === 'string' && pTarget.includes('.') ? pTarget : '');
    const macAddr = pObj.mac_address || pObj.mac_id || (typeof pTarget === 'string' && pTarget.includes(':') ? pTarget : printerId);

    if (!printerIp) {
      showToast('Thiếu thông tin IP máy in hợp lệ. Vui lòng chọn máy in cụ thể.', 'error');
      return;
    }

    const targetAgent = getTargetAgentUid(printerId) || getTargetAgentUid(printerIp) || getTargetAgentUid(macAddr);
    showToast('Bắt đầu gửi yêu cầu đồng bộ danh bạ máy in...', 'info', 3000);
    
    const normMac = macAddr ? String(macAddr).toUpperCase().replace(/-/g, ':') : '';
    if (normMac) {
      setLiveAddressBooks((prev) => ({ ...prev, [normMac]: { status: 'loading', address_list: [] } }));
    }
    try {
      const authUser = copierCredentials[printerId]?.user || copierCredentials[printerIp]?.user || pObj.auth_user || pObj.user;
      const authPass = copierCredentials[printerId]?.pass || copierCredentials[printerIp]?.pass || pObj.auth_password || pObj.password || '';
      if (!authUser) {
        showToast(`Chưa cấu hình tài khoản Web cho máy in ${pObj.printer_name || pObj.name || 'Photocopy'}!`, 'error');
        if (normMac) {
          setLiveAddressBooks((prev) => ({ ...prev, [normMac]: { status: 'error', address_list: [] } }));
        }
        return;
      }
      const extraPayload = {
        mac_address: macAddr,
        printer_ip: printerIp,
        ip: printerIp,
        auth_user: authUser,
        auth_password: authPass,
      };
      const printerRef = (printerIp && printerIp !== '0.0.0.0') ? printerIp : (macAddr || printerId);
      const res = await triggerFetchAddressBook(printerRef, targetAgent || undefined, extraPayload);
      if (!res.ok || !res.command_id) {
        throw new Error(res.error || 'Không thể tạo lệnh đồng bộ');
      }

      pollCommandStatus(
        res.command_id,
        printerId,
        async (pollData: any) => {
          const normMac = macAddr ? String(macAddr).toUpperCase().replace(/-/g, ':') : '';
          let syncObj = pollData?.address_book_sync || pollData?.address_book_data;
          if (!syncObj && (pollData?.result || pollData?.result_payload)) {
            const rawStr = String(pollData.result || pollData.result_payload || '');
            if (rawStr.includes('__ADDRESS_BOOK_JSON_START__')) {
              try {
                let jsonStr = rawStr.split('__ADDRESS_BOOK_JSON_START__')[1].split('__ADDRESS_BOOK_JSON_END__')[0].trim();
                jsonStr = jsonStr.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g, '').trim();
                syncObj = JSON.parse(jsonStr);
              } catch {}
            }
          }
          if (normMac && syncObj) {
            setLiveAddressBooks((prev) => ({ ...prev, [normMac]: syncObj }));
            saveScanPointToDb(normMac, syncObj, pObj.printer_name || pObj.name, pObj.ip || pObj.printer_ip, targetAgent);
          }
          await fetchLanSitesData();
          setExpandedPrinters((prev) => ({ ...prev, [printerId]: true }));
        },
        (errorMsg) => {
          showToast(`Đồng bộ thất bại: ${errorMsg}`, 'error');
        },
        '⌛ Đang đồng bộ danh bạ...'
      );
    } catch (err: any) {
      showToast(`Lỗi gửi lệnh đồng bộ: ${err.message}`, 'error');
    }
  };



  // ── ADD PUBLIC FTP ──
  const handleAddPublicFtp = async () => {
    const { printerId, name, email, agentUid } = publicFtpData;
    if (!name || !name.trim()) {
      showToast('Vui lòng nhập tên điểm scan', 'error');
      return;
    }
    if (email && !email.includes('@')) {
      showToast('Địa chỉ email không hợp lệ', 'error');
      return;
    }
    setPublicFtpLoading(true);
    showToast('Đang tạo yêu cầu thêm FTP/Email lên máy in...', 'info', 3000);

    try {
      const printerObj = selectedLan?.printers?.find((item: any) => String(item.id) === String(printerId) || item.mac_id === printerId);
      const authUser = copierCredentials[printerId]?.user || printerObj?.auth_user;
      const authPass = copierCredentials[printerId]?.pass || printerObj?.auth_password || '';
      if (!authUser) {
        setPublicFtpLoading(false);
        showToast(`Chưa cấu hình tài khoản Web cho máy in ${printerObj?.printer_name || printerObj?.name || 'Photocopy'}!`, 'error');
        return;
      }
      const extraPayload = {
        mac_address: printerObj?.mac_id || printerObj?.mac_address || printerId,
        printer_ip: printerObj?.ip || '',
        auth_user: authUser,
        auth_password: authPass,
      };
      const res = await addEmailDestination(printerId, name.trim(), email, agentUid || undefined, extraPayload);
      setPublicFtpLoading(false);
      setActiveModal(null);

      if (!res.ok || !res.command_id) {
        throw new Error(res.error || 'Lỗi gửi lệnh');
      }

      pollCommandStatus(
        res.command_id,
        printerId,
        async (pollData: any) => {
          showToast(`Đã tạo điểm scan "${name.trim()}" thành công!`, 'success');
          console.log('Finish add public FTP scan point, updating address book state directly');
          const macAddr = printerObj?.mac_address || printerObj?.mac_id || printerId;
          const normMac = macAddr ? String(macAddr).toUpperCase().replace(/-/g, ':') : '';
          let syncObj = pollData?.address_book_sync || pollData?.address_book_data;
          if (!syncObj && (pollData?.result || pollData?.result_payload)) {
            const rawStr = String(pollData.result || pollData.result_payload || '');
            if (rawStr.includes('__ADDRESS_BOOK_JSON_START__')) {
              try {
                let jsonStr = rawStr.split('__ADDRESS_BOOK_JSON_START__')[1].split('__ADDRESS_BOOK_JSON_END__')[0].trim();
                jsonStr = jsonStr.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g, '').trim();
                syncObj = JSON.parse(jsonStr);
              } catch {}
            }
          }
          if (normMac && syncObj) {
            setLiveAddressBooks((prev) => ({ ...prev, [normMac]: syncObj }));
          }
          handleRefetchAddressBook(printerId);
          await fetchLanSitesData();
        },
        (errorMsg) => {
          showToast(`Thêm điểm scan thất bại: ${errorMsg}`, 'error');
        },
        `⌛ Đang tạo điểm scan "${name.trim()}"...`
      );
    } catch (err: any) {
      setPublicFtpLoading(false);
      showToast(`Lỗi: ${err.message}`, 'error');
    }
  };

  // ── ADD PRIVATE FTP ──
  const handleAddPrivateFtp = async () => {
    const { lanUid, agentUid, email } = privateFtpData;
    if (!email || !email.includes('@')) {
      showToast('Địa chỉ email không hợp lệ', 'error');
      return;
    }
    setPrivateFtpLoading(true);
    try {
      const res = await addPrivateLanEmail('default', lanUid, agentUid, email);
      setPrivateFtpLoading(false);
      setActiveModal(null);

      if (res.ok) {
        showToast('Đã thêm Private FTP thành công', 'success');
        await fetchLanSitesData();
      } else {
        throw new Error(res.error || 'Lỗi server');
      }
    } catch (err: any) {
      setPrivateFtpLoading(false);
      showToast(`Lỗi thêm FTP riêng: ${err.message}`, 'error');
    }
  };

  // ── CAMERA HANDLERS ──
  const fetchCameraStatus = async (agentUid: string, cameraId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/agents/${agentUid}/cameras/${cameraId}/status`, { method: 'POST' });
      const data = await response.json();
      if (data.ok && data.status) {
        setCameraStatus(data.status);
        setCameraLogs(data.status.logs || []);
      } else {
        showToast('Không lấy được trạng thái camera: ' + (data.error || 'Lỗi kết nối'), 'error');
      }
    } catch (err: any) {
      showToast('Lỗi lấy trạng thái: ' + err.message, 'error');
    }
  };

  const fetchCameraFiles = async (agentUid: string, cameraId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/agents/${agentUid}/cameras/${cameraId}/files`, { method: 'POST' });
      const data = await response.json();
      if (data.ok) {
        setCameraFiles(data.files || []);
      }
    } catch (err) {
      // silent fail
    }
  };


  return { VIEW_COMMANDS, activeAgentUid, activeLoadingFile, activeModal, activeTab, allocatedVncAddr, autoScanTriggers, cameraFiles, cameraForm, cameraLogs, cameraStatus, cameraTestLoading, cameraTestResult, cameras, camerasLoading, commandStatus, confirmModal, copierCredentials, customRecordDuration, customRunCommand, deleteScanPointModal, detectBrand, directLan, editIpModalData, editableSettingsText, emailFileCounts, expandedDriverMenus, expandedDrivers, expandedPrinters, fetchCameraFiles, fetchCameraStatus, fetchCameras, fetchLanSitesData, fetchRemotePage, filteredPrinters, formatJsonText, ftpDetailData, getLiveQueryTimestamp, getTargetAgentUid, handleAddPrivateFtp, handleAddPublicFtp, handleCloseWebPreview, handleCopierClick, handleEmergencyRestart, handleHistoryBack, handleHistoryForward, handleRefetchAddressBook, handleSaveAuth, handleSaveSettings, handleToggleDirectLan, handleToggleSetting, handleTriggerUtility, handleTriggerUtilityExec, handleViewScanPointsJson, installDriverModal, ipInputModal, isDuplicatePending, isRecording30s, isSavingSettings, lanSites, lanSitesLoading, liveAddressBooks, loadUtilitySettings, lockAspect, modalContentRef, onlineAgents, pollCommandStatus, previewBlobUrl, previewIframeRef, privateFtpData, privateFtpLoading, publicFtpData, publicFtpLoading, queriedVideoUrl, queryDuration, queryTimestamp, queryVideoLoading, recording30sCountdown, remoteLockPrinter, replaceToast, resolveRelativePath, saveAuthLoading, saveScanPointToDb, scaleX, scaleY, scanAutoOpenDir, scanAutoOpenFile, scanPointsViewerModal, selectedCamera, selectedCameraAgentUid, selectedLan, selectedLanUid, selectedTargetAgents, selectedUtilityAgent, setActiveLoadingFile, setActiveModal, setActiveTab, setAllocatedVncAddr, setCameraFiles, setCameraForm, setCameraLogs, setCameraStatus, setCameraTestLoading, setCameraTestResult, setCameras, setCamerasLoading, setCommandStatus, setConfirmModal, setCopierCredentials, setCustomRecordDuration, setCustomRunCommand, setDeleteScanPointModal, setDirectLan, setEditIpModalData, setEditableSettingsText, setEmailFileCounts, setExpandedDriverMenus, setExpandedDrivers, setExpandedPrinters, setFtpDetailData, setInstallDriverModal, setIpInputModal, setIsRecording30s, setIsSavingSettings, setLanSites, setLanSitesLoading, setLiveAddressBooks, setLockAspect, setPreviewBlobUrl, setPrivateFtpData, setPrivateFtpLoading, setPublicFtpData, setPublicFtpLoading, setQueriedVideoUrl, setQueryDuration, setQueryTimestamp, setQueryVideoLoading, setRecording30sCountdown, setRemoteLockPrinter, setSaveAuthLoading, setScaleX, setScaleY, setScanAutoOpenDir, setScanAutoOpenFile, setScanPointsViewerModal, setSelectedCamera, setSelectedCameraAgentUid, setSelectedLanUid, setSelectedTargetAgents, setSelectedUtilityAgent, setSettingsSaveStatus, setShowPreviewDetails, setShowSettings, setStorageFiles, setStorageLoading, setStorageModalData, setToasts, setToshibaVncData, setUtilityActionPending, setUtilityCommands, setUtilityCommandsLoading, setUtilitySettingsLoading, setUtilityStatusMsg, setViewOutputModal, setVncTunnelLoading, setWebPreviewHistory, setWebPreviewHistoryIndex, setWebPreviewLoading, setWebPreviewModal, setWebPreviewTab, settingsSaveStatus, showPreviewDetails, showSettings, showToast, storageFiles, storageLoading, storageModalData, toasts, toshibaVncData, triggerLanScan, utilityActionPending, utilityCommands, utilityCommandsLoading, utilitySettingsLoading, utilityStatusMsg, viewOutputModal, vncTunnelLoading, webPreviewHistory, webPreviewHistoryIndex, webPreviewLoading, webPreviewModal, webPreviewTab };
}