import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { saveLocalScanConfig } from '../services/api';

export default function UtilityToggles({ localAgent, showToast }) {
  const [openFile, setOpenFile] = useState(false);
  const [openFolder, setOpenFolder] = useState(true);

  const handleToggleFile = async (e) => {
    const checked = e.target.checked;
    setOpenFile(checked);
    if (localAgent) {
      const res = await saveLocalScanConfig({ scan_auto_open_file: checked });
      if (res.ok) showToast('Đã lưu cấu hình tự động mở file', 'success');
    }
  };

  const handleToggleFolder = async (e) => {
    const checked = e.target.checked;
    setOpenFolder(checked);
    if (localAgent) {
      const res = await saveLocalScanConfig({ scan_auto_open_dir: checked });
      if (res.ok) showToast('Đã lưu cấu hình tự động mở thư mục', 'success');
    }
  };

  return (
    <div className="utilities-card">
      <div className="card-header">
        <Settings size={20} color="#94a3b8" />
        <h3>Tiện ích mở rộng</h3>
      </div>
      <div className="toggle-list">
        <label className="toggle-item">
          <div className="toggle-info">
            <span className="toggle-title">Tự động mở file khi có bản Scan mới</span>
          </div>
          <label className="switch">
            <input type="checkbox" checked={openFile} onChange={handleToggleFile} />
            <span className="slider"></span>
          </label>
        </label>
        <label className="toggle-item">
          <div className="toggle-info">
            <span className="toggle-title">Tự động mở thư mục khi có bản Scan mới</span>
          </div>
          <label className="switch">
            <input type="checkbox" checked={openFolder} onChange={handleToggleFolder} />
            <span className="slider"></span>
          </label>
        </label>
      </div>
    </div>
  );
}
