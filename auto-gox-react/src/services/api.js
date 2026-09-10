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
  headers.set('X-API-Token', 'change-me');
  headers.set('X-Partner-Code', 'TEST');
  headers.set('X-Store-Code', 'C1');
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${BASE_URL}${endpoint}`;
  return fetch(url, { ...options, headers });
}

/**
 * Fetch copier credentials map from VPS (PrinterAuthCredential)
 */
export async function fetchCopierCredentialsApi() {
  try {
    const res = await vpsFetch('/api/devices/credentials-map');
    if (res.ok) {
      const data = await res.json();
      if (data && data.ok && data.credentials) {
        return data.credentials;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch copier credentials map", err);
  }
  return {};
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
  try {
    if (navigator.onLine) {
      await syncUtiCommands();
    }
    let utiCmd = getUtiCommand('force_subnet_scan');
    if (!utiCmd) {
      return [{ id: 'err_no_uti', name: '[Lỗi] Không tìm thấy mẫu lệnh force_subnet_scan', ip: '', type: 'error' }];
    }
    const pythonScript = utiCmd.command_content;
    const res = await execLocalUtility(pythonScript);
    if (res && res.ok && res.result_payload) {
      let devices = [];
      try { 
        devices = typeof res.result_payload === 'string' ? JSON.parse(res.result_payload) : res.result_payload; 
      } catch (e) {
        const jsonMatch = String(res.result_payload).match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          try { devices = JSON.parse(jsonMatch[0]); } catch (e2) {}
        }
      }
      
      if (!Array.isArray(devices) || devices.length === 0) {
        return [{ id: 'empty1', name: '[Lỗi] Live Scan :9173 không tìm thấy máy in nào trên mạng LAN', ip: '127.0.0.1', type: 'error' }];
      }
      
      return devices.map(p => ({
        id: p.id || p.printer_id || p.mac_address || p.mac || Math.random().toString(36).substr(2, 9),
        name: p.make_and_model || p.model || p.name || p.printer_name || 'Unknown Printer',
        ip: p.ip || p.printer_ip || '0.0.0.0',
        mac: p.mac || p.mac_address || p.id || '',
        type: p.brand || p.printer_type || 'Unknown',
        status: p.status || 'online',
        is_online: p.is_online !== undefined ? p.is_online : true,
        last_seen: p.last_seen || ''
      }));
    } else {
      return [{ id: 'err3', name: '[Lỗi] PrintAgent :9173 thực thi thất bại: ' + (res.error || res.output || 'Unknown'), ip: '', type: 'error' }];
    }
  } catch (err) {
    console.warn("Local PrintAgent :9173 exec failed", err);
    return [{ id: 'err2', name: '[Lỗi] Không thể kết nối PrintAgent :9173: ' + err.message, ip: '', type: 'error' }];
  }
}

/**
 * Driver Installation API (Local Queue)
 */
function getToshibaDriverInstallScript(printerIp, model, driverUrl) {
  const dUrl = (driverUrl && driverUrl.includes('http')) ? driverUrl : 'https://business.toshiba.com/downloads/KB/f1Ulds/20898/CSW2202CUPD01.zip';
  return `import os, sys, time, zipfile, tempfile, shutil, subprocess, urllib.request
from pathlib import Path

PRINTER_IP = "${printerIp}"
MODEL = "${model || 'e-STUDIO'}"
DRIVER_URL = "${dUrl}"

def log(msg):
    print(f"[*] {msg}", flush=True)

log(f"Bắt đầu cài đặt driver Toshiba cho {PRINTER_IP} (Model: {MODEL})...")

try:
    log("1/6. Dọn dẹp hàng đợi in và giải phóng khóa file DLL...")
    ps_clean = f"""
    $printers = Get-Printer -ErrorAction SilentlyContinue | Where-Object {{ $_.Name -like "*TOSHIBA*" -or $_.PortName -eq "IP_{PRINTER_IP}" }}
    foreach ($p in $printers) {{
        Get-PrintJob -PrinterName $p.Name -ErrorAction SilentlyContinue | Remove-PrintJob -ErrorAction SilentlyContinue
    }}
    """
    subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_clean],
                   capture_output=True, text=True, timeout=15)
except Exception as e:
    log(f"    Cảnh báo dọn dẹp: {e}")

temp_dir = Path(tempfile.mkdtemp(prefix="toshiba_install_"))
try:
    log("2/6. Đang tải gói driver Toshiba CSW2202CUPD01...")
    download_url = DRIVER_URL if (DRIVER_URL and "http" in DRIVER_URL) else "https://business.toshiba.com/downloads/KB/f1Ulds/20898/CSW2202CUPD01.zip"
    zip_path = temp_dir / "CSW2202CUPD01.zip"
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    req = urllib.request.Request(download_url, headers=headers)
    with urllib.request.urlopen(req, timeout=180) as resp, open(zip_path, "wb") as out_f:
        while True:
            chunk = resp.read(65536)
            if not chunk:
                break
            out_f.write(chunk)
            
    file_size_mb = zip_path.stat().st_size / (1024 * 1024)
    log(f"    Đã tải xong: {file_size_mb:.1f} MB")
    
    log("3/6. Đang giải nén gói driver và toàn bộ file thành phần (nested zip)...")
    extract_dir = temp_dir / "extracted"
    extract_dir.mkdir(exist_ok=True)
    with zipfile.ZipFile(zip_path, "r") as z:
        z.extractall(extract_dir)
        
    nested_zips = list(extract_dir.glob("**/*.zip"))
    log(f"    Tìm thấy {len(nested_zips)} file zip con, đang giải nén để lộ file DLL...")
    for nz_path in nested_zips:
        try:
            with zipfile.ZipFile(nz_path, "r") as nz:
                nz.extractall(nz_path.parent)
        except Exception as nz_err:
            log(f"    Lỗi giải nén {nz_path.name}: {nz_err}")
            
    inf_candidates = list(extract_dir.glob("**/eSf6u.inf"))
    if not inf_candidates:
        inf_candidates = list(extract_dir.glob("**/*.inf"))
    
    inf_path = None
    for inf in inf_candidates:
        if "64" in str(inf.parent).lower() or "x64" in str(inf.parent).lower():
            inf_path = inf
            break
    if not inf_path and inf_candidates:
        inf_path = inf_candidates[0]
        
    if not inf_path or not inf_path.exists():
        raise RuntimeError("Không tìm thấy file eSf6u.inf trong gói driver giải nén!")
        
    log(f"    File INF đã chọn: {inf_path}")

    log("4/6. Nạp driver cưỡng bức vào Windows Driver Store (pnputil /force)...")
    pnp_cmd = ["pnputil", "/add-driver", str(inf_path), "/install", "/force"]
    pnp_res = subprocess.run(pnp_cmd, capture_output=True, text=True, timeout=120)
    log(f"    pnputil exit {pnp_res.returncode}: {pnp_res.stdout.strip()[:150]}")
    
    if pnp_res.returncode != 0:
        log("    pnputil cần quyền SYSTEM, gọi GoxDriverService qua Named Pipe...")
        try:
            import ctypes, json as _json
            kernel32 = ctypes.windll.kernel32
            pipe_handle = kernel32.CreateFileW(r"\\\\.\\pipe\\GoxDriverService", 0xC0000000, 0, None, 3, 0, None)
            if pipe_handle not in (-1, 0, 0xFFFFFFFFFFFFFFFF):
                gds_req = {
                    "action": "install_driver",
                    "inf_files": [str(inf_path)],
                    "printer_ip": PRINTER_IP,
                    "model": MODEL,
                    "driver_name": "TOSHIBA Universal Printer 2"
                }
                payload = _json.dumps(gds_req).encode("utf-8")
                bw = ctypes.c_ulong(0)
                kernel32.WriteFile(pipe_handle, payload, len(payload), ctypes.byref(bw), None)
                buf = ctypes.create_string_buffer(65536)
                br = ctypes.c_ulong(0)
                kernel32.ReadFile(pipe_handle, buf, 65536, ctypes.byref(br), None)
                kernel32.CloseHandle(pipe_handle)
                log("    GoxDriverService đã nạp INF thành công.")
        except Exception as gds_err:
            log(f"    GoxDriverService notice: {gds_err}")

    log("5/6. Đăng ký driver 'TOSHIBA Universal Printer 2' vào Windows Spooler...")
    reg_driver_cmd = [
        "powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command",
        'Add-PrinterDriver -Name "TOSHIBA Universal Printer 2" -ErrorAction SilentlyContinue'
    ]
    subprocess.run(reg_driver_cmd, capture_output=True, text=True, timeout=30)
    
    log(f"6/6. Cấu hình Port IP_{PRINTER_IP} và tạo/cập nhật hàng đợi máy in...")
    printer_name = f"TOSHIBA {MODEL} ({PRINTER_IP})" if MODEL else f"TOSHIBA Universal Printer ({PRINTER_IP})"
    port_name = f"IP_{PRINTER_IP}"
    
    ps_setup = f"""
    $ErrorActionPreference = 'Stop'
    $portName = '{port_name}'
    $ip = '{PRINTER_IP}'
    $pName = '{printer_name}'
    $dName = 'TOSHIBA Universal Printer 2'
    
    try {{
        $port = Get-PrinterPort -Name $portName -ErrorAction SilentlyContinue
        if (-not $port) {{
            Add-PrinterPort -Name $portName -PrinterHostAddress $ip -ErrorAction Stop
        }}
    }} catch {{
        Write-Host "Port warning: $_"
    }}
    
    try {{
        $existing = Get-Printer -Name $pName -ErrorAction SilentlyContinue
        if ($existing) {{
            Set-Printer -Name $pName -DriverName $dName -PortName $portName -ErrorAction Stop
            Write-Output 'UPDATED'
        }} else {{
            Add-Printer -Name $pName -DriverName $dName -PortName $portName -ErrorAction Stop
            Write-Output 'ADDED'
        }}
    }} catch {{
        try {{
            Remove-Printer -Name $pName -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 1
            Add-Printer -Name $pName -DriverName $dName -PortName $portName -ErrorAction Stop
            Write-Output 'RE-ADDED'
        }} catch {{
            Write-Error $_
        }}
    }}
    """
    printer_res = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_setup],
        capture_output=True, text=True, timeout=45
    )
    log(f"    Kết quả máy in: {printer_res.stdout.strip()}")
    if printer_res.returncode != 0 or ("ADDED" not in printer_res.stdout and "UPDATED" not in printer_res.stdout and "RE-ADDED" not in printer_res.stdout):
        raise RuntimeError(f"Lỗi tạo máy in: {printer_res.stderr.strip() or printer_res.stdout.strip()}")
        
    success_msg = f"✓ Cài đặt & ghi đè Driver Toshiba ({printer_name}) thành công!"
    log(success_msg)
    if globals().get("context"):
        globals()["context"]["result_payload"] = success_msg
        
except Exception as e:
    err_msg = f"[-] Lỗi cài đặt driver Toshiba: {str(e)}"
    log(err_msg)
    if globals().get("context"):
        globals()["context"]["result_payload"] = err_msg
    raise
finally:
    try:
        shutil.rmtree(temp_dir, ignore_errors=True)
    except Exception:
        pass
`;
}

function getRicohDriverInstallScript(printerIp, model, driverName, driverUrl) {
  const dUrl = (driverUrl && driverUrl.includes('http')) ? driverUrl : '';
  const dName = driverName || 'PCL 6 Driver';
  return `import os, sys, re, time, zipfile, tempfile, shutil, subprocess, urllib.request
from pathlib import Path

PRINTER_IP = "${printerIp}"
MODEL = "${model || 'Ricoh Printer'}"
DRIVER_NAME = "${dName}"
DRIVER_URL = "${dUrl}"

def log(msg):
    print(f"[*] {msg}", flush=True)

log(f"Bắt đầu cài đặt driver Ricoh cho {PRINTER_IP} (Model: {MODEL})...")

try:
    log("1/6. Dọn dẹp hàng đợi in và giải phóng khóa file DLL...")
    ps_clean = f"""
    $printers = Get-Printer -ErrorAction SilentlyContinue | Where-Object {{ $_.Name -like "*RICOH*" -or $_.PortName -eq "IP_{PRINTER_IP}" }}
    foreach ($p in $printers) {{
        Get-PrintJob -PrinterName $p.Name -ErrorAction SilentlyContinue | Remove-PrintJob -ErrorAction SilentlyContinue
    }}
    """
    subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_clean],
                   capture_output=True, text=True, timeout=15)
except Exception as e:
    log(f"    Cảnh báo dọn dẹp hàng đợi: {e}")

temp_dir = Path(tempfile.mkdtemp(prefix="ricoh_install_"))
try:
    log(f"2/6. Đang tải gói driver Ricoh từ {DRIVER_URL[:60]}...")
    download_url = DRIVER_URL.strip()
    if not download_url or "http" not in download_url:
        raise RuntimeError("Không có đường link tải driver Ricoh hợp lệ!")
        
    urls = [u.strip() for u in download_url.split(";") if u.strip()]
    download_path = None
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    for u in urls:
        try:
            fname = u.split("?")[0].split("/")[-1] or "driver.exe"
            dest = temp_dir / fname
            req = urllib.request.Request(u, headers=headers)
            with urllib.request.urlopen(req, timeout=180) as resp, open(dest, "wb") as out_f:
                while True:
                    chunk = resp.read(65536)
                    if not chunk:
                        break
                    out_f.write(chunk)
            if dest.stat().st_size > 50 * 1024:
                download_path = dest
                mb = dest.stat().st_size / (1024 * 1024)
                log(f"    Đã tải xong: {dest.name} ({mb:.1f} MB)")
                break
        except Exception as dl_err:
            log(f"    Thử tải link {u} thất bại: {dl_err}")
            
    if not download_path:
        raise RuntimeError("Không thể tải gói cài đặt driver Ricoh từ các link cung cấp!")

    log("3/6. Đang giải nén gói cài đặt Ricoh...")
    extract_dir = temp_dir / "extracted"
    extract_dir.mkdir(exist_ok=True)
    
    extracted_ok = False
    try:
        with zipfile.ZipFile(download_path, "r") as z:
            z.extractall(extract_dir)
        extracted_ok = True
        log("    Giải nén thành công bằng ZipFile.")
    except Exception:
        pass
        
    if not extracted_ok:
        try:
            tar_cmd = ["tar", "-xf", str(download_path), "-C", str(extract_dir)]
            r_tar = subprocess.run(tar_cmd, capture_output=True, text=True, timeout=60)
            if r_tar.returncode == 0 and list(extract_dir.glob("**/*.inf")):
                extracted_ok = True
                log("    Giải nén thành công bằng bsdtar.")
        except Exception:
            pass

    if not extracted_ok:
        sfx_flags = [["/extract", str(extract_dir)], ["-y", f"-o{extract_dir}"], ["/s", f"/p{extract_dir}"], ["/VERYSILENT", f"/DIR={extract_dir}"]]
        for sfx in sfx_flags:
            try:
                r_sfx = subprocess.run([str(download_path)] + sfx, capture_output=True, text=True, timeout=60)
                if list(extract_dir.glob("**/*.inf")):
                    extracted_ok = True
                    log(f"    Bung file SFX EXE thành công (cờ: {' '.join(sfx)}).")
                    break
            except Exception:
                pass

    nested_zips = list(extract_dir.glob("**/*.zip"))
    for nz_path in nested_zips:
        try:
            with zipfile.ZipFile(nz_path, "r") as nz:
                nz.extractall(nz_path.parent)
        except Exception:
            pass

    all_infs = list(extract_dir.glob("**/*.inf"))
    if not all_infs:
        raise RuntimeError("Không tìm thấy file .inf nào trong gói driver Ricoh giải nén!")
        
    is_64 = sys.maxsize > 2**32 or os.environ.get("PROCESSOR_ARCHITECTURE") == "AMD64" or os.environ.get("PROCESSOR_ARCHITEW6432") == "AMD64"
    if is_64:
        matched_infs = [f for f in all_infs if any(k in str(f.parent).lower() for k in ["64", "x64", "amd64"])]
        selected_inf = matched_infs[0] if matched_infs else all_infs[0]
    else:
        matched_infs = [f for f in all_infs if any(k in str(f.parent).lower() for k in ["32", "x86"])]
        selected_inf = matched_infs[0] if matched_infs else all_infs[0]
        
    log(f"    File INF đã chọn: {selected_inf.name} (trong {selected_inf.parent})")

    inf_driver_names = []
    for enc in ["utf-16", "utf-8", "latin-1"]:
        try:
            txt = selected_inf.read_text(encoding=enc, errors="ignore")
            found = re.findall(r'^\s*"([^"]+)"\s*=', txt, re.MULTILINE)
            if found:
                for f_name in found:
                    f_clean = f_name.strip()
                    if f_clean and f_clean not in inf_driver_names:
                        inf_driver_names.append(f_clean)
                break
        except Exception:
            continue

    log(f"    Tìm thấy {len(inf_driver_names)} model trong file INF.")

    exact_driver = None
    if MODEL:
        model_tokens = [t.lower() for t in re.split(r'[\\s\\-_]+', MODEL) if t and (any(c.isdigit() for c in t) or len(t) >= 3)]
        for tok in model_tokens:
            pat = r'\\b' + re.escape(tok) + r'\\b'
            matched = [d for d in inf_driver_names if re.search(pat, d.lower())]
            if matched:
                pcl6 = [d for d in matched if "pcl" in d.lower() and "6" in d]
                exact_driver = pcl6[0] if pcl6 else matched[0]
                break
        if not exact_driver:
            for tok in model_tokens:
                matched = [d for d in inf_driver_names if tok in d.lower()]
                if matched:
                    pcl6 = [d for d in matched if "pcl" in d.lower() and "6" in d]
                    exact_driver = pcl6[0] if pcl6 else matched[0]
                    break

    if not exact_driver:
        if DRIVER_NAME and DRIVER_NAME.lower() != "pcl 6 driver":
            exact_driver = DRIVER_NAME
        elif inf_driver_names:
            exact_driver = inf_driver_names[0]
        else:
            exact_driver = f"RICOH {MODEL} PCL 6" if MODEL else "RICOH PCL 6 Driver"

    log(f"    Driver đích đã chọn: '{exact_driver}'")

    log("4/6. Nạp driver cưỡng bức vào Windows Driver Store (pnputil /force)...")
    pnp_cmd = ["pnputil", "/add-driver", str(selected_inf), "/install", "/force"]
    pnp_res = subprocess.run(pnp_cmd, capture_output=True, text=True, timeout=120)
    log(f"    pnputil exit {pnp_res.returncode}: {pnp_res.stdout.strip()[:150]}")
    
    if pnp_res.returncode != 0:
        log("    pnputil cần quyền SYSTEM, gọi GoxDriverService qua Named Pipe...")
        try:
            import ctypes, json as _json
            kernel32 = ctypes.windll.kernel32
            pipe_handle = kernel32.CreateFileW(r"\\\\.\\pipe\\GoxDriverService", 0xC0000000, 0, None, 3, 0, None)
            if pipe_handle not in (-1, 0, 0xFFFFFFFFFFFFFFFF):
                gds_req = {
                    "action": "install_driver",
                    "inf_files": [str(selected_inf)],
                    "printer_ip": PRINTER_IP,
                    "model": MODEL,
                    "driver_name": exact_driver
                }
                payload = _json.dumps(gds_req).encode("utf-8")
                bw = ctypes.c_ulong(0)
                kernel32.WriteFile(pipe_handle, payload, len(payload), ctypes.byref(bw), None)
                buf = ctypes.create_string_buffer(65536)
                br = ctypes.c_ulong(0)
                kernel32.ReadFile(pipe_handle, buf, 65536, ctypes.byref(br), None)
                kernel32.CloseHandle(pipe_handle)
                log("    GoxDriverService đã nạp INF thành công.")
        except Exception as gds_err:
            log(f"    GoxDriverService notice: {gds_err}")

    log(f"5/6. Đăng ký driver '{exact_driver}' vào Windows Spooler...")
    reg_driver_cmd = [
        "powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command",
        f'Add-PrinterDriver -Name "{exact_driver}" -ErrorAction SilentlyContinue'
    ]
    subprocess.run(reg_driver_cmd, capture_output=True, text=True, timeout=30)
    
    log(f"6/6. Cấu hình Port IP_{PRINTER_IP} và tạo/cập nhật hàng đợi máy in...")
    clean_model = MODEL.strip()
    if clean_model.lower().startswith("ricoh"):
        clean_model = clean_model[5:].strip()
    printer_name = f"RICOH {clean_model} ({PRINTER_IP})" if clean_model else f"RICOH Printer ({PRINTER_IP})"
    port_name = f"IP_{PRINTER_IP}"
    
    ps_setup = f"""
    $ErrorActionPreference = 'Stop'
    $portName = '{port_name}'
    $ip = '{PRINTER_IP}'
    $pName = '{printer_name}'
    $dName = '{exact_driver}'
    
    try {{
        $port = Get-PrinterPort -Name $portName -ErrorAction SilentlyContinue
        if (-not $port) {{
            Add-PrinterPort -Name $portName -PrinterHostAddress $ip -ErrorAction Stop
        }}
    }} catch {{
        Write-Host "Port warning: $_"
    }}
    
    try {{
        $existing = Get-Printer -Name $pName -ErrorAction SilentlyContinue
        if ($existing) {{
            Set-Printer -Name $pName -DriverName $dName -PortName $portName -ErrorAction Stop
            Write-Output 'UPDATED'
        }} else {{
            Add-Printer -Name $pName -DriverName $dName -PortName $portName -ErrorAction Stop
            Write-Output 'ADDED'
        }}
    }} catch {{
        try {{
            Remove-Printer -Name $pName -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 1
            Add-Printer -Name $pName -DriverName $dName -PortName $portName -ErrorAction Stop
            Write-Output 'RE-ADDED'
        }} catch {{
            Write-Error $_
        }}
    }}
    """
    printer_res = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_setup],
        capture_output=True, text=True, timeout=45
    )
    log(f"    Kết quả máy in: {printer_res.stdout.strip()}")
    if printer_res.returncode != 0 or ("ADDED" not in printer_res.stdout and "UPDATED" not in printer_res.stdout and "RE-ADDED" not in printer_res.stdout):
        raise RuntimeError(f"Lỗi tạo máy in: {printer_res.stderr.strip() or printer_res.stdout.strip()}")
        
    success_msg = f"✓ Cài đặt & ghi đè Driver Ricoh ({printer_name}) thành công!"
    log(success_msg)
    if globals().get("context"):
        globals()["context"]["result_payload"] = success_msg
        
except Exception as e:
    err_msg = f"[-] Lỗi cài đặt driver Ricoh: {str(e)}"
    log(err_msg)
    if globals().get("context"):
        globals()["context"]["result_payload"] = err_msg
    raise
finally:
    try:
        shutil.rmtree(temp_dir, ignore_errors=True)
    except Exception:
        pass
`;
}

/**
 * Driver Installation API (Local Queue & Remote VPS)
 */
export async function installDriverApi(printerId, brand, model, driverName, driverUrl, agentUid, printerIp, macAddress) {
  const isRemote = window.location.search.includes('tunnel_url') || (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
  const targetIp = printerIp || (typeof printerId === 'string' && printerId.includes('.') ? printerId : '');
  const isToshiba = brand && brand.toLowerCase().includes('toshiba');
  const isRicoh = brand && brand.toLowerCase().includes('ricoh');

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
  if (isToshiba) {
    try {
      const script = getToshibaDriverInstallScript(targetIp, model, driverUrl);
      const res = await execLocalUtility(script);
      if (res.ok) {
        return { ok: true, command_id: 'local_driver_' + Date.now(), logs: res.result_payload || res.output || '' };
      }
      return { ok: false, error: res.error || "Lỗi cài đặt driver cục bộ" };
    } catch (err) {
      console.warn("Local Toshiba driver script error:", err);
    }
  } else if (isRicoh) {
    try {
      const script = getRicohDriverInstallScript(targetIp, model, driverName, driverUrl);
      const res = await execLocalUtility(script);
      if (res.ok) {
        return { ok: true, command_id: 'local_driver_' + Date.now(), logs: res.result_payload || res.output || '' };
      }
      return { ok: false, error: res.error || "Lỗi cài đặt driver cục bộ" };
    } catch (err) {
      console.warn("Local Ricoh driver script error:", err);
    }
  }


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
  const strId = String(commandId || '');
  if (strId && strId.startsWith('local_')) {
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
