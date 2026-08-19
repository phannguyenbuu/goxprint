import React from 'react';
import { Download, RefreshCw } from 'lucide-react';

export default function MissingAgentOverlay({ onRetry }) {
  return (
    <div id="agent-missing-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#f8fafc', fontFamily: 'Inter, sans-serif', padding: '24px'
    }}>
      <div style={{
        background: '#1e293b', border: '1px solid #334155', borderRadius: '20px', 
        padding: '40px', maxWidth: '500px', textAlign: 'center', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>⚠️</span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
          Không tìm thấy dịch vụ PrintAgent
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '30px' }}>
          Để sử dụng dịch vụ cài đặt tự động máy in và quét scan, bạn cần cài đặt và khởi chạy ứng dụng PrintAgent trên máy tính này.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', animation: 'pulse 2s infinite' }}>
            🔄 Đang quét tự động trong nền...
          </div>
          <button onClick={onRetry} style={{
            background: '#3b82f6', border: 'none', color: '#f8fafc', padding: '12px 24px', 
            borderRadius: '10px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', 
            width: '100%', maxWidth: '320px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
          }}>
            <RefreshCw size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Thử kết nối lại
          </button>
          <a href="https://download.goxprint.com/printagentinstall.exe" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
            background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '12px 24px', 
            borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '15px', 
            width: '100%', maxWidth: '320px', transition: 'all 0.2s'
          }}>
            <Download size={16} />
            Tải xuống PrintAgent (Windows)
          </a>
          <button onClick={() => window.location.reload()} style={{
            background: 'transparent', border: '1px solid #475569', color: '#f8fafc', padding: '12px 24px', 
            borderRadius: '10px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', width: '100%', maxWidth: '320px', transition: 'all 0.2s'
          }}>
            Tải lại trang
          </button>
        </div>
      </div>
    </div>
  );
}
