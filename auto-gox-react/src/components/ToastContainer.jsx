import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="toast-container">
      {toasts.map(t => {
        let Icon = Info;
        let color = '#3b82f6';
        if (t.type === 'success') { Icon = CheckCircle; color = '#10b981'; }
        if (t.type === 'error') { Icon = AlertCircle; color = '#ef4444'; }
        if (t.type === 'warning') { Icon = AlertCircle; color = '#f59e0b'; }

        return (
          <div key={t.id} className={`toast ${t.type}`}>
            <Icon size={18} color={color} />
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
