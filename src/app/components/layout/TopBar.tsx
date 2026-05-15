import React, { useState, useRef, useEffect } from 'react';
import { Search, User, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function TopBar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(state => state.logout);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  return (
    <header className="h-14 flex items-center justify-between px-8 bg-[#0a0a0f] shrink-0">
      <div className="w-full max-w-xl mx-auto relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Hledat filmy nebo seriály..."
          className="w-full bg-[#111116] border border-[#27272a] text-white rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:border-[#dc2626] transition-colors"
        />
      </div>

      <div className="flex items-center gap-4 ml-4 relative" ref={popoverRef}>
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${isProfileOpen ? 'bg-[#1c1c24] border-[#dc2626] text-white' : 'bg-[#111116] border-[#27272a] text-gray-300 hover:text-white hover:border-[#3f3f46]'}`}
        >
          <User size={20} />
        </button>

        {isProfileOpen && currentUser && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-[#1c1c24] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="p-4 border-b border-[#27272a]">
              <div className="font-semibold text-white">{currentUser.username}</div>
              <div className="text-xs text-gray-400 truncate mt-0.5">{currentUser.email}</div>
            </div>
            <div className="p-2">
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut size={16} />
                Odhlásit se
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
