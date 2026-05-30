import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

type SnackbarProps = {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
};

let globalSnackbarZIndex = 999;

export function Snackbar({ message, type = 'success', onClose, duration = 3000 }: SnackbarProps) {
  const [zIndex, setZIndex] = useState(globalSnackbarZIndex);

  useEffect(() => {
    if (message) {
      globalSnackbarZIndex += 1;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setZIndex(globalSnackbarZIndex);
      
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      key={message}
      className={`fixed bottom-6 left-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 ${type === 'success' ? 'bg-[#052e16] border border-green-500/30 text-green-400' : 'bg-[#450a0a] border border-red-500/30 text-red-400'}`}
      style={{ zIndex }}
    >
      {type === 'success' ? <Check size={20} /> : <X size={20} />}
      <span className="font-medium break-words max-w-sm">{message}</span>
    </div>
  );
}
