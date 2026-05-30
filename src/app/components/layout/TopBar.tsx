import React, { useState, useRef } from 'react';
import { Search, User, LogOut, Menu, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

type Props = {
  onToggleSidebar: () => void;
};

export function TopBar({ onToggleSidebar }: Props) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(state => state.logout);
  const searchQuery = useAppStore(state => state.searchQuery);
  const setSearchQuery = useAppStore(state => state.setSearchQuery);
  const language = useAppStore(state => state.language);
  const setLanguage = useAppStore(state => state.setLanguage);

  const navigate = useNavigate();
  const location = useLocation();

  useOnClickOutside(popoverRef, () => setIsProfileOpen(false), isProfileOpen);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Pokud uživatel začne psát a není na hlavní stránce, přesměrujeme ho do katalogu
    if (value.length >= 3 && location.pathname !== '/') {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="h-14 flex items-center justify-between px-8 bg-[#0a0a0f] shrink-0 border-b border-[#27272a] lg:border-none">
      {/* Vlevo pouze pro mobilní verzi */}
      <div className="flex items-center lg:w-10">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 rounded-xl bg-[#111116] border border-[#27272a] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#dc2626] transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Uprostřed vyhledávací pole */}
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Hledat..."
            className="w-full bg-[#111116] border border-[#27272a] text-white rounded-full py-2 pl-12 pr-10 focus:outline-none focus:border-[#dc2626] transition-colors"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Vpravo změna jazyka názvů titulů a profil */}
      <div className="flex items-center justify-end lg:w-auto gap-3 relative" ref={popoverRef}>
        <button
          onClick={() => setLanguage(language === 'cs' ? 'en' : 'cs')}
          className="px-3 h-10 rounded-xl bg-[#111116] border border-[#27272a] flex items-center justify-center text-sm font-bold text-gray-300 hover:text-white hover:border-[#3f3f46] transition-colors"
          title={language === 'cs' ? 'Změnit jazyk názvů titulů do angličtiny' : 'Změnit jazyk názvů titulů do češtiny'}
        >
          {language === 'cs' ? 'CS' : 'EN'}
        </button>
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
