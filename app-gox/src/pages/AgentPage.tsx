// @ts-nocheck
import { CopiersTab } from './Agent/components/CopiersTab';
import { AgentsTab } from './Agent/components/AgentsTab';

import { styles } from './Agent/AgentPageStyles';
import { AgentModals } from './Agent/components/AgentModals';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAgentPageController } from './Agent/hooks/useAgentPageController';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowCard } from '../components/ui/GlowCard';
import { AnimatedList } from '../components/ui/AnimatedList';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  getLanSites,
  saveCopierCredentials,
  triggerFetchAddressBook,
  getCommandStatus,
  addEmailDestination,
  addPrivateLanEmail,
  deleteScanPoint,
  deleteLanEmail,
  modifyDeviceAddress,
  getScansFiles,
  installDriverOnAgent,
  getAgentSettings,
  updateAgentSettings,
  triggerAgentUtility,
  getAgentUtilityCommands,
  triggerAgentUtilityExec,
  triggerEmergencyRestart,
  getJobs,
} from '../api/mockAgentApi';
import type { LanSiteInfo } from '../api/mockAgentApi';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://agentapi.quanlymay.com';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'pending';
}

function getDestinationStatusHtml(entry: any, emails: any[], agents: any[]) {
  const emailVal = entry.email_address || entry.email || '';
  const folderVal = entry.physical_path || entry.folder || entry.folder_path || '';
  const addressValue = (emailVal || folderVal || '').trim();
  
  if (!addressValue) {
    return { label: 'UNKNOWN', type: 'error', title: '' };
  }
  
  const isEmail = entry.type === 'Email' || emailVal.includes('@');
  if (isEmail) {
    return { label: '✔ ACTIVE', type: 'success', title: '' };
  }

  const matchedEmail = emails.find(e => e.email.toLowerCase().trim() === addressValue.toLowerCase().trim());
  const portNumber = matchedEmail ? matchedEmail.email_number : Number(entry.registration_no);

  if (!portNumber || isNaN(portNumber)) {
    return { label: '✔ ACTIVE', type: 'success', title: '' };
  }

  const masterAgent = (agents || []).find(a => a.is_master && a.is_agent_active) || (agents || []).find(a => a.is_agent_active) || (agents || [])[0];
  if (masterAgent) {
    const site = (masterAgent.ftp_sites || []).find((s: any) => Number(s.port) === Number(portNumber));
    if (site) {
      const expectedPath = ('C:/Scangox/' + addressValue).toLowerCase().replace(/\\/g, '/');
      const actualPath = (site.path || '').toLowerCase().replace(/\\/g, '/');
      const isCorrectPath = actualPath === expectedPath;

      if (site.running && isCorrectPath) {
        return { label: '✔ OK', type: 'success', title: '' };
      } else if (site.running && !isCorrectPath) {
        return { label: '⚠ CONFLICT', type: 'warning', title: `FTP site uses folder: ${site.path} instead of expected: C:/Scangox/${addressValue}` };
      } else if (site.error && (site.error.toLowerCase().includes('in use') || site.error.toLowerCase().includes('busy') || site.error.toLowerCase().includes('already bound') || site.error.toLowerCase().includes('already in use'))) {
        return { label: '❌ PORT BUSY', type: 'error', title: site.error };
      } else {
        return { label: '❌ FAILED', type: 'error', title: site.error || 'FTP site failed to start' };
      }
    } else {
      return { label: 'PENDING SETUP', type: 'warning', title: '' };
    }
  } else {
    return { label: 'OFFLINE', type: 'neutral', title: '' };
  }
}

// Mirrors backend _safe_path_token: strips accents, replaces non-alphanumeric with '-'
function safePathToken(value: string): string {
  const text = (value || '').trim();
  if (!text) return 'unknown';
  const ascii = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._@-]/g, '-').replace(/^[\s\-_.]+|[\s\-_.]+$/g, '');
  return ascii || 'unknown';
}

  export function AgentPage() {
  const propsToPass = useAgentPageController();
  const {
    toasts = [],
    lanSitesLoading,
    lanSites = [],
    selectedLanUid,
    setSelectedLanUid,
    activeTab,
    setActiveTab,
    selectedLan,
    triggerLanScan,
    filteredPrinters,
    cameras,
    fetchLanSitesData
  } = propsToPass as any;

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toast Notification Container */}
      <div style={styles.toastContainer}>
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              style={{
                ...styles.toast,
                borderLeft: `4px solid ${
                  t.type === 'success'
                    ? 'var(--color-success)'
                    : t.type === 'error'
                    ? 'var(--color-error)'
                    : 'var(--color-primary)'
                }`,
              }}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
            >
              <span style={styles.toastIcon}>
                {t.type === 'success' ? '✔️' : t.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <div style={{ flex: 1, fontSize: '0.8rem' }}>{t.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FIXED HEADER BLOCK */}
      <div style={styles.fixedHeader}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛠️ Quản lý Mạng LAN</h1>
          <button
            style={{ ...styles.smallBtn, borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}
            onClick={() => fetchLanSitesData(true)}
          >
            🔄 Làm mới
          </button>
        </div>

        {/* LAN Select filter */}
        <div style={styles.filterBar}>
          <label style={styles.filterLabel}>Mạng LAN hiện tại:</label>
          {lanSitesLoading && lanSites.length === 0 ? (
            <LoadingSpinner size="sm" />
          ) : (
            <select
              value={selectedLanUid}
              onChange={(e) => { setSelectedLanUid(e.target.value); localStorage.setItem('goxprint_selected_lan_uid', e.target.value); }}
              style={styles.lanSelect}
            >
              {lanSites.map((site) => (
                <option key={site.lan_uid} value={site.lan_uid}>
                  {site.lan_name || site.lan_uid} ({site.active_agents} Agent - {site.printers?.filter((p: any) => p.is_online).length ?? 0} máy Photo)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Tab bar switch */}
        <div style={styles.tabBar}>
          <button
            style={{
              ...styles.tabBtn,
              color: activeTab === 'agents' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'agents' ? '2px solid var(--color-primary)' : '2px solid transparent',
            }}
            onClick={() => setActiveTab('agents')}
          >
            💻 Máy tính ({selectedLan?.agents?.filter((a: any) => a.is_agent_active).length ?? 0})
          </button>
          <button
            style={{
              ...styles.tabBtn,
              color: activeTab === 'copiers' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'copiers' ? '2px solid var(--color-primary)' : '2px solid transparent',
            }}
            onClick={() => {
              setActiveTab('copiers');
              triggerLanScan(selectedLan);
            }}
          >
            🖨️ Photocopy ({filteredPrinters.length})
          </button>
        </div>
      </div>

      {/* Content Area with Top Margin to avoid overlapping the fixed header */}
      <div style={styles.scrollableContent}>
        {lanSitesLoading && (
          <div style={styles.loadingWrapper}>
            <LoadingSpinner size="md" />
          </div>
        )}

          {!lanSitesLoading && selectedLan && (
            <AnimatePresence mode="wait">
              {activeTab === 'agents' && <AgentsTab {...propsToPass} />}
              {activeTab === 'copiers' && <CopiersTab {...propsToPass} />}
            </AnimatePresence>
          )}
        </div>

            <AgentModals {...propsToPass} />
    </motion.div>
  );
}


export default AgentPage;
