import React from 'react';
import { DownloadCloud, FolderSync, Zap } from 'lucide-react';

export default function ActionCards({ onAction }) {
  return (
    <div className="action-grid">
      <div className="action-card" onClick={() => onAction('driver')}>
        <div className="card-icon blue">
          <DownloadCloud size={24} color="#3b82f6" />
        </div>
        <h3>Cài đặt Driver</h3>
        <p>Tự động tìm và tải driver phù hợp cho máy in của bạn</p>
      </div>

      <div className="action-card" onClick={() => onAction('scan')}>
        <div className="card-icon purple">
          <FolderSync size={24} color="#a855f7" />
        </div>
        <h3>Cấu hình Scan</h3>
        <p>Thiết lập thư mục chia sẻ để nhận file scan trực tiếp</p>
      </div>

      <div className="action-card highlight" onClick={() => onAction('both')}>
        <div className="card-icon amber">
          <Zap size={24} color="#f59e0b" />
        </div>
        <h3>Cài đặt tất cả</h3>
        <p>Thực hiện cài đặt Driver và cấu hình Scan trong 1 click</p>
      </div>
    </div>
  );
}
