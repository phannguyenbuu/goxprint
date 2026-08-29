// @ts-nocheck
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchApi, getLanSites, saveCopierCredentials, triggerAgentUtilityExec } from '../../../api/mockAgentApi';

export const useAgentLanPrinters = (deps: any = {}) => {
  const { showToast, pollCommandStatus, utilityCommands } = deps;

  const [lanSites, setLanSites] = useState<any[]>([]);
  const [selectedPublicIp, setSelectedPublicIp] = useState<string>(() => {
    return localStorage.getItem('goxprint_selected_public_ip') || localStorage.getItem('gox_connect_public_ip') || '';
  });
  const [selectedLanUid, setSelectedLanUid] = useState<string>(() => {
    return localStorage.getItem('goxprint_selected_lan_uid') || '';
  });
  const [lanSitesLoading, setLanSitesLoading] = useState(false);

  const [expandedPrinters, setExpandedPrinters] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('goxprint_expanded_printers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [copierCredentials, setCopierCredentials] = useState<Record<string, { user: string; pass: string }>>({});
  const [saveAuthLoading, setSaveAuthLoading] = useState<Record<string, boolean>>({});
  const [selectedTargetAgents, setSelectedTargetAgents] = useState<Record<string, string>>({});
  const [liveAddressBooks, setLiveAddressBooks] = useState<Record<string, any>>({});

  const [editIpModalData, setEditIpModalData] = useState<{
    isOpen: boolean;
    copier: any;
    oldIp: string;
    newIp: string;
    targetAgentUid: string;
    status: string;
    error: string;
  }>({
    isOpen: false,
    copier: null,
    oldIp: '',
    newIp: '',
    targetAgentUid: '',
    status: '',
    error: ''
  });

  const [accessDeniedState, setAccessDeniedState] = useState<{
    isOpen: boolean;
    ip: string;
  }>({
    isOpen: false,
    ip: ''
  });

  const autoScanTriggers = useRef<Record<string, number>>({});

  const initialLastViewedId = useMemo(() => {
    return localStorage.getItem('goxprint_last_viewed_copier_id');
  }, []);

  const fetchLanSitesData = useCallback(async (isUserRefresh = false) => {
    if (isUserRefresh) setLanSitesLoading(true);
    try {
      const data = await getLanSites();
      const rows = data?.rows || (Array.isArray(data) ? data : []);
      setLanSites(rows);

      // Auto-fill selectedPublicIp if empty
      const storedIp = localStorage.getItem('goxprint_selected_public_ip');
      if (!storedIp && rows.length > 0) {
        for (const site of rows) {
          const pubIp = (site.public_ip || site.wan_ip || (site.agents && site.agents[0]?.public_ip) || '').trim();
          if (pubIp && pubIp !== '127.0.0.1') {
            setSelectedPublicIp(pubIp);
            localStorage.setItem('goxprint_selected_public_ip', pubIp);
            break;
          }
        }
      }

      try {
        const clientIp = (data?.client_ip || '').trim();
        const isAllowed = Boolean(data?.is_allowed);
        const activePublicIps = data?.active_public_ips || [];
        const overrideConnectIp = (localStorage.getItem('gox_connect_public_ip') || '').trim();
        const effectiveIp = overrideConnectIp || clientIp;

        const matchedAgents: any[] = [];
        rows.forEach((site: any) => {
          (site.agents || []).forEach((ag: any) => {
            const agPub = (ag.public_ip || ag.wan_ip || ag.ip || '').trim();
            const agLoc = (ag.local_ip || '').trim();
            if (effectiveIp && ((agPub && agPub === effectiveIp) || (agLoc && agLoc === effectiveIp))) {
              matchedAgents.push(ag);
            }
          });
        });

        const isSameNetwork = matchedAgents.length > 0;
        const hasAccess = Boolean(overrideConnectIp) || isAllowed || isSameNetwork;

        console.log('==================================================');
        console.log('🌐 [PUBLIC IP ACCESS CONTROL CHECK]');
        console.log('📌 IP Public hiện tại của trình duyệt:', clientIp);
        if (overrideConnectIp) console.log('⚡ IP Public do người dùng chỉ định kết nối:', overrideConnectIp);
        console.log('🛡️ Danh sách Public IP đang Active trên Server:', activePublicIps);
        console.log('✅ Quyền truy cập toàn bộ LAN (Is Whitelisted/Allowed):', (isAllowed || overrideConnectIp) ? 'CÓ (FULL ACCESS)' : 'KHÔNG (LIMITED BY AGENT PUBLIC IP)');
        console.log('💻 Danh sách Agent có cùng Public IP:', matchedAgents.length > 0 ? matchedAgents : (hasAccess ? 'Đang mở Full LAN (Tất cả Agent)' : 'Không tìm thấy Agent cùng IP'));
        console.log('==================================================');

        if (!hasAccess && clientIp) {
          console.warn(`[ACCESS DENIED] Public IP ${clientIp} is not allowed and not in the same network.`);
          setAccessDeniedState({ isOpen: true, ip: clientIp });
          return;
        }

        console.log('[FRONTEND SCANPOINTS VPS] DANH SÁCH DANH BẠ TỪ SCANPOINTS VPS (< 3 NGÀY):');
        rows.forEach((site: any) => {
          (site.printers || []).forEach((p: any) => {
            const sync = p.address_book_sync || {};
            const list = Array.isArray(sync.address_list) ? sync.address_list : (sync.address_book_data?.address_list || []);
            const macStr = p.mac_address || p.mac_id || '—';
            if (list.length > 0) {
              console.log(`📌 Máy in [${p.printer_name || p.name}] - IP: ${p.ip} | MAC: ${macStr} (${list.length} điểm scan trong ScanPoints VPS):`, list);
            }
          });
        });
        console.log('==================================================');
      } catch (logErr) {
        console.error('Console log error:', logErr);
      }

      if (rows.length > 0) {
        setSelectedLanUid((prev) => {
          const activeIp = (selectedPublicIp || localStorage.getItem('goxprint_selected_public_ip') || localStorage.getItem('gox_connect_public_ip') || '').trim();
          if (activeIp) {
            const matchedSite = rows.find((s: any) => {
              const pubIp = (s.public_ip || s.wan_ip || '').trim();
              if (pubIp === activeIp) return true;
              return (s.agents || []).some((ag: any) => (ag.public_ip || ag.wan_ip || ag.ip || '').trim() === activeIp);
            });
            if (matchedSite) {
              localStorage.setItem('goxprint_selected_lan_uid', matchedSite.lan_uid);
              return matchedSite.lan_uid;
            }
          }
          if (prev) {
            const prevSite = rows.find((s: any) => s.lan_uid === prev);
            if (prevSite && ((prevSite.printers && prevSite.printers.length > 0) || (prevSite.agents && prevSite.agents.length > 0))) {
              return prev;
            }
          }

          const siteWithPrinters = rows.find((s: any) => (s.printers && s.printers.length > 0) || (s.agents && s.agents.length > 0));
          const bestUid = siteWithPrinters ? siteWithPrinters.lan_uid : rows[0].lan_uid;
          localStorage.setItem('goxprint_selected_lan_uid', bestUid);
          return bestUid;
        });
      }
      if (isUserRefresh) showToast('Đã cập nhật danh sách mạng LAN', 'success');
    } catch (err: any) {
      console.error('Failed to fetch LAN sites:', err);
      if (isUserRefresh) showToast(`Không thể tải dữ liệu LAN: ${err.message}`, 'error');
    } finally {
      setLanSitesLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchLanSitesData();
  }, [fetchLanSitesData]);

  const filteredLanSites = useMemo(() => {
    if (!lanSites || lanSites.length === 0) return [];
    const activePublicIp = (selectedPublicIp || localStorage.getItem('goxprint_selected_public_ip') || localStorage.getItem('gox_connect_public_ip') || '').trim();
    if (activePublicIp) {
      return lanSites.filter((site) => {
        const sitePub = (site.public_ip || site.wan_ip || '').trim();
        if (sitePub === activePublicIp) return true;
        return (site.agents || []).some((ag: any) => {
          const agPub = (ag.public_ip || ag.wan_ip || ag.ip || '').trim();
          return agPub === activePublicIp;
        });
      });
    }
    return lanSites;
  }, [lanSites, selectedPublicIp]);

  const selectedLan = useMemo(() => {
    if (!lanSites || lanSites.length === 0) return null;
    const activePublicIp = (selectedPublicIp || localStorage.getItem('goxprint_selected_public_ip') || localStorage.getItem('gox_connect_public_ip') || '').trim();
    if (activePublicIp) {
      const siteByPubIp = lanSites.find((site) => {
        const sitePub = (site.public_ip || site.wan_ip || '').trim();
        if (sitePub === activePublicIp) return true;
        return (site.agents || []).some((ag: any) => {
          const agPub = (ag.public_ip || ag.wan_ip || ag.ip || '').trim();
          return agPub === activePublicIp;
        });
      });
      if (siteByPubIp) return siteByPubIp;
    }
    if (selectedLanUid) {
      const siteByUid = lanSites.find((site) => site.lan_uid === selectedLanUid);
      if (siteByUid && ((siteByUid.printers && siteByUid.printers.length > 0) || (siteByUid.agents && siteByUid.agents.length > 0))) return siteByUid;
    }
    const siteWithPrinters = lanSites.find((site: any) => (site.printers && site.printers.length > 0) || (site.agents && site.agents.length > 0));
    return siteWithPrinters || lanSites[0];
  }, [lanSites, selectedLanUid, selectedPublicIp]);

  const triggerLanScan = useCallback((lanData: any, isManual = true) => {
    if (!lanData) return;
    const currentLanUid = lanData.lan_uid;
    const now = Date.now();

    if (isManual || !autoScanTriggers.current[currentLanUid] || now - autoScanTriggers.current[currentLanUid] > 30 * 1000) {
      autoScanTriggers.current[currentLanUid] = now;
      
      const activeAgentsList = (lanData.agents || []).filter((a: any) => a.is_agent_active);
      if (activeAgentsList.length > 0) {
        activeAgentsList.sort((a: any, b: any) => {
          const tA = new Date(a.last_seen || a.updated_at || a.last_ping || 0).getTime();
          const tB = new Date(b.last_seen || b.updated_at || b.last_ping || 0).getTime();
          return tB - tA;
        });

        const targetAgent = activeAgentsList[0];
        if (targetAgent && pollCommandStatus) {
          showToast(`⏳ Agent (${targetAgent.agent_uid}) đang thực hiện quét ngầm mạng LAN...`, 'info', 6000);
          deps.setCommandStatus?.((prev: any) => ({
            ...prev,
            [`scan_lan_${currentLanUid}`]: { message: '⏳ Agent đang quét ngầm mạng LAN...', isPending: true }
          }));
          const a = targetAgent;

          const payload = {
            command: 'force_subnet_scan',
            lead: lanData.lead
          };
          fetchApi(`/api/agents/${a.agent_uid}/utility/exec?lead=default`, {
            method: 'POST',
            body: JSON.stringify(payload)
          })
          .then(data => {
            const cmdId = data?.command_id || data?.id;
            if (cmdId) {
              pollCommandStatus(
                Number(cmdId),
                `scan_lan_${currentLanUid}`,
                async (pollData: any) => {
                  console.log("🔍 [PRINTAGENT RESULT] Kết quả force_subnet_scan:", pollData);
                  let freshPrinters: any[] = [];
                  const rawRes = pollData?.result || pollData?.result_payload || pollData?.output || pollData?.error_message || pollData?.raw || '';
                  
                  if (Array.isArray(rawRes)) {
                    freshPrinters = rawRes;
                  } else if (typeof rawRes === 'string' && rawRes.trim()) {
                    try {
                      const directParsed = JSON.parse(rawRes.trim());
                      if (Array.isArray(directParsed)) freshPrinters = directParsed;
                    } catch {}

                    if (freshPrinters.length === 0) {
                      try {
                        let jsonStr = '';
                        if (rawRes.includes('__PRINTERS_JSON_START__')) {
                          jsonStr = rawRes.split('__PRINTERS_JSON_START__')[1].split('__PRINTERS_JSON_END__')[0].trim();
                        } else {
                          const jsonArrayMatch = rawRes.match(/(\[\s*\{[\s\S]*\}\s*\])/);
                          if (jsonArrayMatch) {
                            jsonStr = jsonArrayMatch[1];
                          }
                        }
                        if (jsonStr) {
                          const parsed = JSON.parse(jsonStr);
                          if (Array.isArray(parsed)) freshPrinters = parsed;
                        }
                      } catch (e) {
                        console.error("🔍 [Frontend] Lỗi parse JSON máy in:", e);
                      }
                    }
                  }
                  
                  if (freshPrinters.length > 0) {
                    showToast(`✓ Quét mạng LAN hoàn tất, tìm thấy ${freshPrinters.length} máy in!`, 'success', 4000);
                    try {
                      await fetchApi('/api/new-devices', {
                        method: 'POST',
                        body: JSON.stringify({
                          lan_uid: currentLanUid || 'default',
                          devices: freshPrinters
                        })
                      });
                    } catch (err) {}
                    fetchLanSitesData();
                  } else {
                    showToast('✓ Quét mạng LAN hoàn tất', 'success', 4000);
                  }
                },
                async (_err: any) => {
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
  }, [showToast, pollCommandStatus, utilityCommands]);

  const filteredPrinters = useMemo(() => {
    if (!selectedLan) return [];
    const filtered = (selectedLan.printers || []).filter((p: any) => {
      const name = (p.printer_name || p.name || '').toLowerCase().trim();
      const ip = (p.ip || '').trim();
      const mac = (p.mac_address || p.mac_id || '').toUpperCase().replace(/-/g, ':');
      if (ip === '192.168.1.226' || mac === '58:38:79:79:A3:EB') return false;
      if (name.includes('unknown') || name === 'unknown printer') return false;
      if (
        name.includes('pdf') ||
        name.includes('fax') ||
        name.includes('brother') ||
        name.includes('canon lbp') ||
        name.includes('rustdesk')
      ) {
        return false;
      }
      return true;
    });

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

  const getTargetAgentUid = useCallback((printerId: string | number) => {
    const pId = Number(printerId);
    const printer = selectedLan?.printers?.find((p: any) => Number(p.id) === pId || p.id === printerId || p.mac_id === printerId || p.ip === printerId);
    if (!selectedLan) return '';
    const onlineAgents = (selectedLan.agents || []).filter((a: any) => a.is_agent_active);
    const selected = selectedTargetAgents[pId];
    if (selected) {
      const isSelOnline = onlineAgents.some((a: any) => a.agent_uid === selected);
      if (isSelOnline) return selected;
    }
    const lanPublicIp = selectedLan.public_ip || selectedLan.wan_ip;
    const sameIpAgent = onlineAgents.find((a: any) => (a.public_ip && a.public_ip === lanPublicIp) || (a.wan_ip && a.wan_ip === lanPublicIp));
    const matchedAgent = (printer?.agent_uid ? onlineAgents.find((a: any) => a.agent_uid === printer.agent_uid) : null) || sameIpAgent;
    return matchedAgent ? matchedAgent.agent_uid : (printer?.agent_uid || '');
  }, [selectedLan, selectedTargetAgents]);

  const handleCopierClick = (printerId: string) => {
    localStorage.setItem('goxprint_last_viewed_copier_id', printerId);
  };

  useEffect(() => {
    if (selectedLan) {
      const defaultTargets: Record<string, string> = {};

      selectedLan.printers.forEach((p: any) => {
        const onlineAgents = (selectedLan.agents || []).filter((a: any) => a.is_agent_active);
        const lanPublicIp = selectedLan.public_ip || selectedLan.wan_ip;
        const sameIpAgent = onlineAgents.find((a: any) => (a.public_ip && a.public_ip === lanPublicIp) || (a.wan_ip && a.wan_ip === lanPublicIp));
        const matchedAgent = (p.agent_uid ? onlineAgents.find((a: any) => a.agent_uid === p.agent_uid) : null) || sameIpAgent;
        defaultTargets[p.id] = matchedAgent ? matchedAgent.agent_uid : (p.agent_uid || '');
      });

      setSelectedTargetAgents((prev) => ({ ...defaultTargets, ...prev }));

      setCopierCredentials((prev) => {
        const next = { ...prev };
        selectedLan.printers.forEach((p: any) => {
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
        if (cmdId && pollCommandStatus) {
          showToast('Đã tạo lệnh lưu Auth, đang đợi Agent thực thi và ghi vào đĩa...', 'info', 3000);
          pollCommandStatus(
            cmdId,
            printerId,
            (resStatus: any) => {
              const extraMsg = resStatus?.error ? ` (${resStatus.error})` : (resStatus?.result ? ` (${resStatus.result})` : '');
              showToast(`Đã test đăng nhập thành công và lưu vào database!${extraMsg}`, 'success', 5000);
              setLanSites((prevSites) =>
                prevSites.map((site) => ({
                  ...site,
                  printers: site.printers.map((item: any) =>
                    String(item.id) === String(printerId) || (macId && item.mac_id === macId)
                      ? { ...item, auth_user: creds.user, auth_password: creds.pass }
                      : item
                  ),
                }))
              );
              setSaveAuthLoading((prev) => ({ ...prev, [printerId]: false }));
            },
            (errorMsg: any) => {
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
              printers: site.printers.map((item: any) =>
                String(item.id) === String(printerId) || (macId && item.mac_id === macId)
                  ? { ...item, auth_user: creds.user, auth_password: creds.pass }
                  : item
              ),
            }))
          );
          setSaveAuthLoading((prev) => ({ ...prev, [printerId]: false }));
        }
      } else {
        throw new Error(res.error || 'Lỗi lưu thông tin đăng nhập');
      }
    } catch (err: any) {
      showToast(`Lỗi lưu Auth: ${err.message}`, 'error');
      setSaveAuthLoading((prev) => ({ ...prev, [printerId]: false }));
    }
  };

  const handleEditIP = (copier: any) => {
    const defaultAgentUid = getTargetAgentUid(copier.id);
    setEditIpModalData({
      isOpen: true,
      copier,
      oldIp: copier.ip || '',
      newIp: copier.ip || '',
      targetAgentUid: defaultAgentUid,
      status: '',
      error: ''
    });
  };

  const handleSaveEditIP = async () => {
    if (!editIpModalData.copier || !editIpModalData.newIp) return;
    const copier = editIpModalData.copier;
    const oldIp = editIpModalData.oldIp;
    const newIp = editIpModalData.newIp.trim();
    const targetAgentUid = editIpModalData.targetAgentUid;

    if (!newIp) {
      setEditIpModalData((p) => ({ ...p, error: 'Vui lòng nhập địa chỉ IP mới!' }));
      return;
    }

    setEditIpModalData((p) => ({ ...p, status: '⌛ Đang gửi lệnh đổi IP tới Agent...', error: '' }));
    showToast(`Đang gửi lệnh đổi IP từ ${oldIp} ➔ ${newIp}...`, 'info', 3000);

    try {
      const isToshiba = (copier.printer_type || copier.printer_name || '').toLowerCase().includes('toshiba');
      const cmdName = isToshiba ? 'toshiba_change_ftp' : 'ricoh_change_ftp';

      const res = await triggerAgentUtilityExec(targetAgentUid, cmdName, '', {
        old_ip: oldIp,
        new_ip: newIp,
        printer_ip: oldIp,
        target_ip: oldIp
      });

      if (!res.ok || !res.command_id) {
        throw new Error(res.error || 'Không thể tạo lệnh đổi IP');
      }

      setEditIpModalData((p) => ({ ...p, status: '⌛ Agent đang kết nối máy in để thực hiện đổi IP...' }));
      if (pollCommandStatus) {
        pollCommandStatus(
          res.command_id,
          `edit_ip_${copier.id}`,
          (_pollData: any) => {
            showToast(`✓ Đã đổi IP thành công từ ${oldIp} ➔ ${newIp}!`, 'success', 5000);
            setLanSites((prevSites) =>
              prevSites.map((site) => ({
                ...site,
                printers: site.printers.map((item: any) =>
                  String(item.id) === String(copier.id) || item.mac_id === copier.mac_id
                    ? { ...item, ip: newIp }
                    : item
                ),
              }))
            );
            setEditIpModalData((p) => ({ ...p, isOpen: false, status: '', error: '' }));
          },
          (errorMsg: any) => {
            showToast(`[-] Lỗi đổi IP: ${errorMsg}`, 'error');
            setEditIpModalData((p) => ({ ...p, status: '', error: errorMsg }));
          },
          '⏳ Agent đang cập nhật địa chỉ IP trên máy photo...'
        );
      }
    } catch (err: any) {
      setEditIpModalData((p) => ({ ...p, status: '', error: err.message || 'Lỗi không xác định' }));
      showToast(`Lỗi gửi lệnh đổi IP: ${err.message}`, 'error');
    }
  };

  return {
    lanSites, setLanSites,
    selectedPublicIp, setSelectedPublicIp, filteredLanSites,
    selectedLanUid, setSelectedLanUid,
    selectedLan, lanSitesLoading, setLanSitesLoading,
    fetchLanSitesData, triggerLanScan, filteredPrinters,
    copierCredentials, setCopierCredentials,
    saveAuthLoading, setSaveAuthLoading, handleSaveAuth,
    editIpModalData, setEditIpModalData, handleEditIP, handleSaveEditIP,
    expandedPrinters, setExpandedPrinters,
    selectedTargetAgents, setSelectedTargetAgents, getTargetAgentUid, handleCopierClick,
    accessDeniedState, setAccessDeniedState,
    liveAddressBooks, setLiveAddressBooks
  };
};
