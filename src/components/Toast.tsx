import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const bgStyles = {
    success: 'bg-emerald-950/90 border-emerald-800 text-emerald-100',
    error: 'bg-rose-950/90 border-rose-800 text-rose-100',
    info: 'bg-slate-900/90 border-slate-700 text-slate-100',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-up ${bgStyles[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
