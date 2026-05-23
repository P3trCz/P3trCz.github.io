import React from 'react';
import { X } from 'lucide-react';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Tailwind maxWidth class, např. 'max-w-md', 'max-w-2xl' atd. Výchozí je 'max-w-md'. */
  maxWidth?: string;
  /** Volitelný Z-index, např. 'z-[80]' nebo 'z-50'. Výchozí je 'z-50'. */
  zIndex?: string;
  /** Pokud je true, nezobrazí výchozí padding uvnitř těla modálu. */
  noPadding?: boolean;
};

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-md', 
  zIndex = 'z-50',
  noPadding = false 
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm`} 
      onClick={onClose}
    >
      <div 
        className={`w-full ${maxWidth} bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl flex flex-col max-h-[80vh] relative`} 
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c24] text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={18} />
        </button>

        {title && (
          <div className="px-6 py-5 border-b border-[#27272a]">
            <h2 className="text-xl font-bold text-white pr-8 break-words break-all">{title}</h2>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto custom-scrollbar ${noPadding ? '' : 'p-6'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
