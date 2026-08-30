import React from 'react';
import DriverInstallModal from './DriverInstallModal';
import ScanConfigModal from './ScanConfigModal';

export default function PrinterModal({ activeMode, localAgent, preloadedPrinters, onClose, showToast }) {
  if (activeMode === 'driver') {
    return <DriverInstallModal localAgent={localAgent} preloadedPrinters={preloadedPrinters} onClose={onClose} showToast={showToast} />;
  }
  
  if (activeMode === 'scan') {
    return <ScanConfigModal localAgent={localAgent} preloadedPrinters={preloadedPrinters} onClose={onClose} showToast={showToast} />;
  }

  // Fallback if 'both' is selected
  return <ScanConfigModal localAgent={localAgent} preloadedPrinters={preloadedPrinters} onClose={onClose} showToast={showToast} />;
}
