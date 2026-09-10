/**
 * Helper to parse raw progress logs into concise, user-friendly single-step info.
 * Hides complex technical solutions/commands and extracts clean step titles.
 */
export function parseStepInfo(rawText, defaultTotal = 6, printerName = '') {
  if (!rawText) {
    return {
      currentStep: 1,
      totalSteps: defaultTotal,
      title: 'Đang khởi tạo tiến trình...',
      percent: 10,
      isFinished: false,
      isSuccess: false
    };
  }

  const text = String(rawText);

  // Check for success
  if (text.includes('thành công') || text.includes('✓') || text.includes('SUCCESS') || text.includes('completed')) {
    return {
      currentStep: defaultTotal,
      totalSteps: defaultTotal,
      title: 'Cài đặt hoàn tất thành công!',
      percent: 100,
      isFinished: true,
      isSuccess: true
    };
  }

  // Check for failure
  if (text.includes('[-] Lỗi') || text.includes('Thất bại') || text.includes('FAILED') || text.includes('Error:')) {
    let matchErr = text.match(/(?:Lỗi|Error|Thất bại)[^\r\n*]*/i);
    let errMsg = matchErr ? matchErr[0].replace(/^[-\[\]*\s]*/, '').trim() : 'Quá trình cài đặt thất bại';
    if (errMsg.length > 80) errMsg = errMsg.substring(0, 80) + '...';
    return {
      currentStep: defaultTotal,
      totalSteps: defaultTotal,
      title: errMsg,
      percent: 100,
      isFinished: true,
      isSuccess: false
    };
  }

  // Match 'X/Y. Description' pattern e.g. '1/6. Dọn dẹp hàng đợi in'
  const stepRegex = /(\d+)\s*\/\s*(\d+)[\.\:]?\s*([^\n\r*]+)/g;
  let match;
  let lastStep = null;
  while ((match = stepRegex.exec(text)) !== null) {
    lastStep = match;
  }

  if (lastStep) {
    const cur = parseInt(lastStep[1], 10);
    const tot = parseInt(lastStep[2], 10);
    let desc = (lastStep[3] || '').trim();

    // Rút gọn nội dung hiển thị ngắn gọn, không ghi rõ giải pháp kỹ thuật
    if (desc.includes('Dọn dẹp') || desc.includes('hàng đợi') || desc.includes('khóa file')) {
      desc = 'Dọn dẹp hàng đợi in';
    } else if (desc.includes('tải') || desc.includes('gói driver') || desc.includes('download')) {
      desc = 'Đang tải gói driver...';
    } else if (desc.includes('giải nén') || desc.includes('zip')) {
      desc = 'Đang giải nén tập tin driver...';
    } else if (desc.includes('Nạp driver') || desc.includes('Driver Store') || desc.includes('pnputil') || desc.includes('INF')) {
      desc = 'Đang đăng ký driver vào Windows...';
    } else if (desc.includes('Spooler') || desc.includes('Đăng ký driver')) {
      desc = 'Đang cấu hình dịch vụ in ấn...';
    } else if (desc.includes('Port') || desc.includes('hàng đợi máy in') || desc.includes('Cấu hình Port')) {
      desc = 'Đang thiết lập cổng mạng và máy in...';
    } else if (desc.includes('hộp thoại') || desc.includes('Properties')) {
      desc = 'Đang mở hộp thoại thuộc tính máy in...';
    } else if (desc.includes('FTP')) {
      desc = 'Đang tạo thư mục lưu bản Scan...';
    } else if (desc.includes('TopAccess') || desc.includes('máy photocopy') || desc.includes('template') || desc.includes('Cấu hình Scan')) {
      desc = 'Đang thiết lập Scan trên máy photocopy...';
    } else if (desc.includes('Shortcut') || desc.includes('Desktop')) {
      desc = 'Đang tạo Shortcut Scan ra Desktop...';
    } else {
      desc = desc.split(/[,\.\;]/)[0].trim();
    }

    const pct = Math.min(95, Math.max(15, Math.round((cur / tot) * 90)));
    return {
      currentStep: cur,
      totalSteps: tot,
      title: desc,
      percent: pct,
      isFinished: false,
      isSuccess: false
    };
  }

  // Fallback for custom keywords
  if (text.includes('thư mục FTP') || text.includes('Shortcut')) {
    return {
      currentStep: 1,
      totalSteps: 3,
      title: 'Đang tạo thư mục và Shortcut Scan...',
      percent: 40,
      isFinished: false,
      isSuccess: false
    };
  }

  if (text.includes('Đang gửi lệnh') || text.includes('chờ khởi tạo')) {
    return {
      currentStep: 1,
      totalSteps: defaultTotal,
      title: 'Đang gửi lệnh đến máy tính...',
      percent: 15,
      isFinished: false,
      isSuccess: false
    };
  }

  return {
    currentStep: 1,
    totalSteps: defaultTotal,
    title: 'Đang xử lý...',
    percent: 25,
    isFinished: false,
    isSuccess: false
  };
}
