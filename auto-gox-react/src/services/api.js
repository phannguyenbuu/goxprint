export const LOCAL_AGENT_PORT = 9173;
export const BASE_URL = 'https://agentapi.quanlymay.com';

/**
 * Record job & logs to VPS database (so it appears on app-gox job history)
 */
export async function recordJobToVpsApi({ agentUid, printerName, ip, commandType, commandParams, status, output, errorMessage }) {
  try {
    const res = await fetch(`${BASE_URL}/api/jobs/record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Token': 'change-me'
      },
      body: JSON.stringify({
        agent_uid: agentUid || 'administrator',
        printer_name: printerName || 'AgentNode',
        ip: ip || '0.0.0.0',
        command_type: commandType || 'trigger_utility',
        command_params: typeof commandParams === 'object' ? JSON.stringify(commandParams) : commandParams,
        status: status || 'success',
        output: output || '',
        error_message: errorMessage || ''
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Failed to record job to VPS API", err);
  }
  return null;
}

/**
 * vpsFetch with automatic header injection
 */
export async function vpsFetch(endpoint, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('X-Api-Key', '8A63B4895DA7E53B');
  headers.set('X-Partner-Code', 'TEST');
  headers.set('X-Store-Code', 'C1');
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${BASE_URL}${endpoint}`;
  return fetch(url, { ...options, headers });
}

/**
 * Offline Sync: uticommands Cache
 */
export async function syncUtiCommands() {
  if (!navigator.onLine) return;
  try {
    const res = await fetch('https://agentapi.quanlymay.com/api/uticommands');
    if (res.ok) {
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.commands)) {
        localStorage.setItem('uti_commands_cache', JSON.stringify(data.commands));
        console.log("Synced uticommands cache for offline usage.");
      }
    }
  } catch (err) {
    console.warn("Failed to sync uticommands:", err);
  }
}

export function getUtiCommand(commandName) {
  try {
    const cached = localStorage.getItem('uti_commands_cache');
    if (cached) {
      const commands = JSON.parse(cached);
      return commands.find(c => c.command === commandName);
    }
  } catch (err) {
    console.error("Error reading uti_commands_cache", err);
  }
  return null;
}

export function getLocalAgentBaseUrl() {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const tunnelUrl = params.get('tunnel_url') || params.get('agent_url') || params.get('proxy_url');
    if (tunnelUrl) {
      return tunnelUrl.replace(/\/$/, '');
    }
  }
  return `http://127.0.0.1:${LOCAL_AGENT_PORT}`;
}

export async function execLocalUtility(scriptContent) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('show-debug-script', { detail: scriptContent }));
  }
  const baseUrl = getLocalAgentBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/local/exec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script: scriptContent })
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Probe local PrintAgent configuration on port 9173
 */
export async function probeLocalAgent() {
  const baseUrl = getLocalAgentBaseUrl();
  const urls = [
    `${baseUrl}/api/ui/config`
  ];
  if (baseUrl.includes('127.0.0.1')) {
    urls.push(`http://localhost:${LOCAL_AGENT_PORT}/api/ui/config`);
  }

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
 * Register network mapping to VPS
 */
export async function registerNetwork(lanUid, pcName, pcIp) {
  try {
    const res = await fetch(`${BASE_URL}/api/network/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': '8A63B4895DA7E53B',
        'X-Partner-Code': 'TEST',
        'X-Store-Code': 'C1'
      },
      body: JSON.stringify({
        lan_uid: lanUid,
        pc_name: pcName,
        pc_ip: pcIp
      })
    });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, data };
    }
    return { ok: false };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * Fetch printers from Local Agent
 */
export async function fetchPrintersFromAgent(agentUid) {
  const isRemote = window.location.search.includes('tunnel_url') || (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
  
  if (isRemote || agentUid) {
    try {
      const vpsRes = await vpsFetch(`/api/new-lan-sites${agentUid ? '?agent_uid=' + agentUid : ''}`);
      if (vpsRes.ok) {
        const data = await vpsRes.json();
        const rows = data.rows || data.lan_sites || [];
        let printers = [];
        rows.forEach(site => {
          if (site.printers && site.printers.length > 0) {
            printers = printers.concat(site.printers);
          }
        });
        if (printers.length > 0) {
          return printers.map(p => ({
            id: p.id || p.printer_id || Math.random().toString(36).substr(2, 9),
            name: p.printer_name || p.name || p.make_and_model || 'Unknown Printer',
            ip: p.ip || p.printer_ip || '0.0.0.0',
            mac: p.mac_address || p.mac_id || p.mac || '',
            type: p.printer_type || p.brand || 'Unknown',
            status: 'online',
            is_online: true
          }));
        }
      }
    } catch (err) {
      console.warn("Fetch printers from VPS failed", err);
    }
  }

  try {
    if (navigator.onLine) {
      await syncUtiCommands();
    }
    let utiCmd = getUtiCommand('force_subnet_scan');
    if (!utiCmd) {
       return [{ id: 'err_no_uti', name: '[Debug] Không tìm thấy lệnh force_subnet_scan trong cache', ip: '', type: 'error' }];
    }
    const pythonScript = utiCmd.command_content;

    const baseUrl = getLocalAgentBaseUrl();
    const res = await fetch(`${baseUrl}/api/local/exec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script: pythonScript })
    });
    
    if (res.ok) {
      const execData = await res.json();
      if (execData && execData.ok && execData.result_payload) {
        let devices = [];
        try { devices = JSON.parse(execData.result_payload); } catch (e) {}
        
        if (devices.length === 0) {
           return [{ id: 'empty1', name: '[Debug] Deep Scan không tìm thấy máy in nào', ip: '127.0.0.1', type: 'error' }];
        }
        
        return devices.map(p => ({
           id: p.id || p.printer_id || Math.random().toString(36).substr(2, 9),
           name: p.make_and_model || p.model || p.name || p.printer_name || 'Unknown Printer',
           ip: p.ip || p.printer_ip || '0.0.0.0',
           mac: p.mac || p.mac_address || p.id || '',
           type: p.brand || p.printer_type || 'Unknown',
           status: p.status || 'online',
           is_online: p.is_online !== undefined ? p.is_online : true,
           last_seen: p.last_seen || ''
        }));
      } else {
        return [{ id: 'err3', name: '[Debug] Lỗi thực thi Python: ' + (execData.error || 'Unknown'), ip: '', type: 'error' }];
      }
    } else {
      return [{ id: 'err1', name: '[Debug] HTTP Error: ' + res.status, ip: '', type: 'error' }];
    }
  } catch (e) {
    console.warn("Local PrintAgent exec failed.", e);
    return [{ id: 'err2', name: '[Debug] Exception: ' + e.message, ip: '', type: 'error' }];
  }
}

/**
 * Driver Installation API (Local Queue)
 */
export async function installDriverApi(printerId, brand, model, driverName, driverUrl, agentUid, printerIp, macAddress) {
  const isRemote = window.location.search.includes('tunnel_url') || (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
  const targetIp = printerIp || (typeof printerId === 'string' && printerId.includes('.') ? printerId : '');

  // When accessed remotely via WIM tunnel or printagentx.com, directly call VPS API (POST /api/devices/install-driver)
  if (isRemote || agentUid) {
    try {
      const vpsRes = await vpsFetch('/api/devices/install-driver', {
        method: 'POST',
        body: JSON.stringify({
          agent_uid: agentUid,
          printer_ip: targetIp,
          ip: targetIp,
          mac_address: macAddress || printerId,
          mac_id: macAddress || printerId,
          brand: brand,
          model: model,
          driver_name: driverName,
          driver_url: driverUrl
        })
      });
      const data = await vpsRes.json();
      if (vpsRes.ok && data.command_id) {
        return { ok: true, command_id: data.command_id, is_vps: true };
      }
      if (data && data.error) {
        return { ok: false, error: data.error };
      }
    } catch (e) {
      console.warn("VPS API driver install call failed", e);
    }
  }

  // Otherwise, attempt local agent execution
  try {
    const baseUrl = getLocalAgentBaseUrl();
    const res = await fetch(`${baseUrl}/api/local/install-driver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip: printerId, printer_type: brand, name: model })
    });
    if (res.ok) {
      return { ok: true, command_id: 'local_driver_' + Date.now() };
    }
  } catch (err) {
    // ignore
  }

  return { ok: false, error: "PrintAgent không phản hồi." };
}

/**
 * Scan Configuration API (Direct VPS API call when remote)
 */
export async function installScanApi(printerIp, brand, folderName, agentUid, authUser = 'admin', authPass = '') {
  const brandName = brand ? brand.toLowerCase() : 'ricoh';
  const cmdName = brandName === 'toshiba' ? 'toshiba_create_scan' : 'ricoh_create_scan';
  const isRemote = window.location.search.includes('tunnel_url') || (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

  // When accessed remotely via WIM tunnel or printagentx.com, directly call VPS API (POST /api/utility/trigger)
  if (isRemote || agentUid) {
     try {
       const endpoint = agentUid ? `/api/agents/${agentUid}/utility/exec` : '/api/utility/trigger';
       const vpsRes = await vpsFetch(endpoint, {
         method: 'POST',
         body: JSON.stringify({
           agent_uid: agentUid,
           command: cmdName,
           printer_ip: printerIp,
           auth_user: authUser || 'admin',
           auth_password: authPass || '',
           target_name: folderName || 'null'
         })
       });
       const data = await vpsRes.json();
       if (vpsRes.ok && data.command_id) {
          return { ok: true, command_id: data.command_id, is_vps: true };
       }
       if (data && data.error) {
          return { ok: false, error: data.error };
       }
     } catch (e) {
       console.warn("VPS API scan trigger call failed", e);
     }
  }

  // Otherwise, attempt local agent execution
  if (navigator.onLine) {
     await syncUtiCommands();
  }
  let utiCmd = getUtiCommand(cmdName);
  if (utiCmd) {
    let script = utiCmd.command_content;
    script = script.replace(/__TARGET_IP__/g, printerIp).replace(/__PRINTER_IP__/g, printerIp);
    script = script.replace(/__TARGET_USER__/g, authUser || 'admin').replace(/__AUTH_USER__/g, authUser || 'admin');
    script = script.replace(/__TARGET_PASS__/g, authPass || '').replace(/__AUTH_PASS__/g, authPass || '');
    script = script.replace(/__TARGET_SCAN_USER__/g, folderName || 'null').replace(/__TARGET_NAME__/g, folderName || 'null').replace(/__SCAN_USERNAME__/g, folderName || 'null');
    script = script.replace(/__TARGET_EMAIL__/g, '').replace(/__EMAIL__/g, '').replace(/__TARGET_ID__/g, '');

    try {
      const res = await execLocalUtility(script);
      if (res.ok) {
          const out = res.result_payload || res.output || '';
          if (out.includes('[-] LỖI') || out.includes('[-]')) {
             return { ok: false, error: "Cấu hình thất bại. Xem chi tiết: " + out.split('\n').filter(l => l.includes('[-]')).join(' ') };
          }
          return { ok: true, command_id: 'local_scan_' + Date.now(), logs: out };
      }
    } catch (err) {
      // ignore
    }
  }

  return { ok: false, error: "PrintAgent local :9173 không phản hồi và không thể kết nối VPS API." };
}

export async function testPrinterLoginApi(printerIp, brand, user, pass) {
  const brandName = brand ? brand.toLowerCase() : 'ricoh';
  
  let script = '';
  if (brandName === 'toshiba') {
    script = `
import requests
import socket
import urllib3
urllib3.disable_warnings()

def get_local_ip(target_ip):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect((target_ip, 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

try:
    session = requests.Session()
    ip = ${JSON.stringify(printerIp)}
    user = ${JSON.stringify(user)}
    password = ${JSON.stringify(pass)}
    local_ip = get_local_ip(ip)
    
    origin = f"http://{ip}"
    landing = f"{origin}/?MAIN=TOPACCESS"
    cgi = f"{origin}/contentwebserver"
    session.headers.update({"User-Agent": "Mozilla/5.0", "Accept": "*/*", "Cache-Control": "no-cache", "Pragma": "no-cache", "Referer": landing})
    
    session.get(landing, verify=False, timeout=5)
    csrf = session.cookies.get("Session") or ""
    headers = {"Content-Type": "text/plain; charset=utf-8", "csrfpId": csrf}
    
    login_xml = f"""<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><SetValue><Authentication><UserCredential><userName>{user}</userName><passwd>{password}</passwd><ipaddress>{local_ip}</ipaddress><applicationType>TOP_ACCESS</applicationType></UserCredential></Authentication></SetValue><Command><Login><commandNode>Authentication/UserCredential</commandNode><Params><appName>TOPACCESS</appName></Params></Login></Command></DeviceInformationModel>"""
    r = session.post(cgi, data=login_xml.encode("utf-8"), headers=headers, verify=False, timeout=8)
    
    import re
    has_success = "<LoginResult>Success</LoginResult>" in r.text
    has_error = "<LoginResult>Error</LoginResult>" in r.text or "error" in r.text.lower()
    
    token_match = re.search(r"<userTokenId>([^<]+)</userTokenId>", r.text)
    has_valid_token = bool(token_match and token_match.group(1).strip())
    
    if r.status_code == 200 and not has_error and (has_success or has_valid_token):
         print("[SUCCESS] Đăng nhập Toshiba thành công")
         # Logout
         logout_xml = """<?xml version="1.0" encoding="UTF-8"?><DeviceInformationModel><Command><Logout><commandNode>Authentication/UserCredential</commandNode></Logout></Command></DeviceInformationModel>"""
         session.post(cgi, data=logout_xml.encode("utf-8"), headers=headers, verify=False, timeout=5)
    else:
         print(f"[-] LỖI: Sai thông tin đăng nhập Toshiba: {r.text[:200]}")
         
except Exception as e:
    print(f"[-] LỖI: {e}")
`;
  } else {
    // Ricoh
    script = `
import requests
from agent.services.api_client import Printer

printer_ip = ${JSON.stringify(printerIp)}
username = ${JSON.stringify(user)}
password = ${JSON.stringify(pass)}

printer = Printer(name="Test", ip=printer_ip, user=username, password=password, printer_type="ricoh")
svc = bridge._ricoh_service

try:
    import requests
    from urllib.parse import urljoin
    import base64
    
    session = requests.Session()
    base_url = f"http://{printer_ip}"
    
    # 1. Clear session
    session.get(f"{base_url}/web/entry/en/websys/webArch/logout.cgi", timeout=3)
    session.cookies.clear()
    session.cookies.set("cookieOnOffChecker", "on")
    
    # 2. Get Form
    resp = session.get(f"{base_url}/web/entry/en/websys/webArch/authForm.cgi", timeout=5)
    wim_token = ""
    for line in resp.text.split("\\n"):
        if 'name="wimToken"' in line:
            import re
            m = re.search(r'value="([^"]+)"', line)
            if m: wim_token = m.group(1)
            
    print(f"[DEBUG] Form fetch: {resp.status_code}, wimToken={wim_token}")
    
    # 3. POST Login
    encoded_user = base64.b64encode(username.encode()).decode()
    encoded_pass = base64.b64encode(password.encode()).decode()
    
    strategies = [
        {
            "name": "Base64 (guest)",
            "path": "/web/guest/en/websys/webArch/login.cgi",
            "data": {"userid": encoded_user, "username": encoded_user, "password": encoded_pass, "open": "websys/webArch/authForm.cgi"}
        },
        {
            "name": "Plain (entry)",
            "path": "/web/entry/en/websys/webArch/login.cgi",
            "data": {"userid": username, "username": username, "password": password}
        },
        {
            "name": "Plain (guest)",
            "path": "/web/guest/en/websys/webArch/login.cgi",
            "data": {"userid": username, "username": username, "password": password}
        }
    ]
    
    success = False
    debug_logs = []
    
    for s in strategies:
        data = s["data"]
        data["wimToken"] = wim_token
        login_url = f"{base_url}{s['path']}"
        
        resp_post = session.post(login_url, data=data, headers={"Referer": resp.url}, timeout=10)
        wim_session = session.cookies.get("wimsesid", "")
        
        is_failed = "Authentication has failed" in resp_post.text or "not correct" in resp_post.text or ("authForm.cgi" in resp_post.text and "location" in resp_post.text.lower())
        
        if resp_post.status_code == 200 and not is_failed and wim_session and wim_session != "--":
            # Verify admin
            resp_v = session.get(f"{base_url}/web/entry/en/address/adrsList.cgi?modeIn=LIST_ALL", timeout=5)
            if resp_v.status_code == 200:
                print(f"[SUCCESS] Đăng nhập Ricoh thành công (bằng {s['name']})")
                success = True
                break
            else:
                debug_logs.append(f"{s['name']}: Đăng nhập được nhưng không có quyền Admin")
        else:
            debug_logs.append(f"{s['name']}: Sai pass hoặc bị từ chối")
            
    if not success:
        print(f"[-] LỖI: Mật khẩu '{password}' không chính xác! | Chi tiết: " + " | ".join(debug_logs))
`;
  }

  try {
    const res = await execLocalUtility(script);
    if (res.ok) {
        const out = res.result_payload || res.output || '';
        if (out.includes('[-] LỖI') || out.includes('[-]')) {
           return { ok: false, error: out.split('\\n').filter(l => l.includes('[-]')).join(' ') };
        }
        return { ok: true };
    }
    return { ok: false, error: res.error || "Lỗi khi thực thi Python nội bộ" };
  } catch (err) {
    return { ok: false, error: "PrintAgent không phản hồi." };
  }
}

/**
 */
export async function addLanEmailApi(email, agentUid) {
  if (!agentUid) return Promise.resolve();
  return vpsFetch('/api/lan-emails', {
    method: 'POST',
    body: JSON.stringify({ email, agent_uid: agentUid })
  });
}

/**
 * Support Ticket API
 */
export async function submitSupportTicket(description, agentUid) {
  return vpsFetch('/api/support/ticket', {
    method: 'POST',
    body: JSON.stringify({
      agent_uid: agentUid || '',
      description: description
    })
  }).then(r => r.json());
}

/**
 * Local Config API (Toggles)
 */
export async function saveLocalScanConfig(config) {
  return fetch(`http://127.0.0.1:${LOCAL_AGENT_PORT}/api/utilities/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  }).then(r => r.json());
}

/**
 * Track command progress locally or via VPS
 */
export async function trackCommandProgressPromise(commandId, onUpdate) {
  if (commandId && commandId.startsWith('local_')) {
    // Mock progress for local fire-and-forget tasks
    return new Promise(resolve => {
       let progress = 0;
       const interval = setInterval(() => {
          progress += 25;
          onUpdate(`Đang xử lý thiết lập cục bộ... ${progress}%`);
          if (progress >= 100) {
             clearInterval(interval);
             resolve({ ok: true });
          }
       }, 800);
    });
  }

  // VPS tracking logic
  return new Promise((resolve) => {
    let checkCount = 0;
    const maxChecks = 120; // 2 minutes max
    let lastText = "";

    const intervalId = setInterval(async () => {
      checkCount++;
      if (checkCount >= maxChecks) {
        clearInterval(intervalId);
        resolve({ ok: false, success: false, error: 'Quá thời gian cài đặt chờ phản hồi từ Agent (Timeout 120s)' });
        return;
      }

      try {
        const stRes = await vpsFetch(`/api/commands/${commandId}/status`);
        if (stRes.ok) {
          const stData = await stRes.json();
          const cmdObj = stData.command || stData;
          const status = (cmdObj.status || '').toLowerCase();
          
          if (status === 'completed' || status === 'success') {
            clearInterval(intervalId);
            if (onUpdate) onUpdate("Hoàn tất tiến trình.");
            resolve({ ok: true, success: true, message: stData.output || stData.result || stData.result_payload || 'Hoàn tất tiến trình thành công!' });
            return;
          } else if (status === 'failed' || status === 'error') {
            clearInterval(intervalId);
            resolve({ ok: false, success: false, error: stData.error || stData.error_message || 'Thực thi thất bại' });
            return;
          }

          const text = cmdObj.progress_text || cmdObj.output || status;
          if (text !== lastText && text !== 'pending' && text !== 'running' && text !== 'received') {
            if (onUpdate) onUpdate(text);
            lastText = text;
          }
        }
      } catch (e) {
        // ignore network glitches
      }
    }, 1200);
  });
}
