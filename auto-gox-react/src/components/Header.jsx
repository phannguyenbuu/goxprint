import React from 'react';
import { Network, Monitor } from 'lucide-react';

export default function Header({ localAgent }) {
  const isConnected = !!localAgent;

  return (
    <div className="status-bar">
      <div className="status-indicator">
        <div className={`status-dot ${isConnected ? 'online' : 'offline'}`}></div>
        <span>{isConnected ? 'Sẵn sàng' : 'Mất kết nối'}</span>
      </div>
      <div className="network-info">
        <div className="info-item">
          <Network size={16} />
          <span>Public IP:</span>
          <strong id="ip-public-val">{localAgent ? localAgent.pc_ip : 'Đang lấy...'}</strong>
        </div>
        <div className="info-item">
          <Monitor size={16} />
          <span>LAN IP:</span>
          <strong id="ip-lan-val">127.0.0.1</strong>
        </div>
      </div>
    </div>
  );
}
