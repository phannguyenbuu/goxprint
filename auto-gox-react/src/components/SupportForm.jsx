import React, { useState } from 'react';
import { submitSupportTicket } from '../services/api';

export default function SupportForm({ localAgent, showToast }) {
  const [desc, setDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc.trim()) {
      showToast('Vui lòng nhập mô tả lỗi', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await submitSupportTicket(desc.trim(), localAgent?.agent_uid);
      if (res.ok) {
        showToast('Đã gửi yêu cầu hỗ trợ thành công', 'success');
        setDesc('');
      } else {
        showToast('Gửi thất bại', 'error');
      }
    } catch (e) {
      showToast('Có lỗi xảy ra', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="support-card">
      <h3>Bạn gặp khó khăn?</h3>
      <p>Gửi yêu cầu hỗ trợ trực tiếp đến đội ngũ kỹ thuật của chúng tôi.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea 
            rows="3" 
            placeholder="Mô tả sự cố bạn đang gặp phải..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn-secondary" disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>
      </form>
    </div>
  );
}
