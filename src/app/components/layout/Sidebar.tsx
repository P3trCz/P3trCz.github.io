import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ListVideo, BarChart2, Settings, Play, Info, X, Users } from 'lucide-react';
import tmdbLogo from '../../Logos/tmdb-logo.svg';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [showAbout, setShowAbout] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Katalog' },
    { to: '/lists', icon: ListVideo, label: 'Seznamy' },
    { to: '/stats', icon: BarChart2, label: 'Statistiky' },
    { to: '/friends', icon: Users, label: 'Přátelé' },
    { to: '/settings', icon: Settings, label: 'Nastavení' },
  ];

  return (
    <>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[#0a0a0f] border-r border-[#27272a] h-screen text-gray-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="border-2 border-red-600 rounded-lg p-1.5 flex items-center justify-center">
              <Play size={20} className="fill-red-600 text-red-600" />
            </div>
            <span className="text-xl font-bold tracking-tight">StreamHub</span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium',
                    isActive
                      ? 'bg-[#1c1c24] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#111116]'
                  )
                }
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 pb-6">
          <button
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-gray-400 hover:text-white hover:bg-[#111116] w-full"
          >
            <Info size={20} strokeWidth={2} />
            O aplikaci
          </button>
        </div>
      </aside>

      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowAbout(false)}>
          <div
            className="w-full max-w-md bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c24] text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="border-2 border-red-600 rounded-lg p-2 flex items-center justify-center">
                <Play size={24} className="fill-red-600 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-white">StreamHub</h2>
            </div>

            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                StreamHub je aplikace, která dává streamovací služby, které jsou dostupné v ČR, pod jednu střechu. Aplikace umožňuje uživatelům procházet katalog filmů dostupných na jejich předplacených platformách, spravovat vlastní seznamy a sledovat statistiky. Dále také může sdílet seznamy a doporučovat filmy přátelům.
              </p>
              <div className="border-t border-[#27272a] pt-4 space-y-2">
                <p className="text-white font-semibold">Petr Toman</p>
                <p className="text-gray-400">A25B0288P</p>
              </div>

              <div className="border-t border-[#27272a] pt-4 mt-2 flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-400 text-center sm:text-left">
                <img src={tmdbLogo} alt="TMDB" className="w-16 h-auto shrink-0 opacity-80" />
                <p>
                  This product uses the TMDB API but is not endorsed or certified by TMDB.<br />
                  Veškerá data a obrázky o filmech a seriálech pocházejí z databáze TMDB.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
