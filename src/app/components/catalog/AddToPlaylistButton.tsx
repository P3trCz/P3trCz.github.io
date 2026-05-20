import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

type Props = {
  movieId: string;
};

export function AddToPlaylistButton({ movieId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentUser = useAppStore(state => state.currentUser);
  const playlistsState = useAppStore(state => state.playlists);
  const watchlistsState = useAppStore(state => state.watchlists);

  const playlists = currentUser ? (playlistsState[currentUser.id] || []) : [];
  const watchlist = currentUser ? (watchlistsState[currentUser.id] || []) : [];

  const createPlaylist = useAppStore(state => state.createPlaylist);
  const addToPlaylist = useAppStore(state => state.addToPlaylist);
  const removeFromPlaylist = useAppStore(state => state.removeFromPlaylist);
  const toggleWatchlist = useAppStore(state => state.toggleWatchlist);

  useOnClickOutside(popoverRef, () => setIsOpen(false), isOpen);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
    }
  };

  const handleTogglePlaylist = (playlistId: string, hasMovie: boolean) => {
    if (hasMovie) {
      removeFromPlaylist(playlistId, movieId);
    } else {
      addToPlaylist(playlistId, movieId);
    }
  };

  const isInWatchlist = watchlist.includes(movieId);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-8 h-8 rounded-full bg-[#111116] border border-[#27272a] flex items-center justify-center text-gray-300 hover:text-white hover:border-[#dc2626] transition-colors"
      >
        <Plus size={16} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-[#111116] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden left-0 top-full" onClick={e => e.stopPropagation()}>
          <div className="p-3 border-b border-[#27272a] flex justify-between items-center">
            <h3 className="font-medium text-sm text-white">Přidat do seznamu</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="p-2 max-h-48 overflow-y-auto">
            <button
              onClick={() => toggleWatchlist(movieId)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1c1c24] text-sm text-left transition-colors"
            >
              <div className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${isInWatchlist ? 'bg-[#dc2626] border-[#dc2626]' : 'border-gray-500'}`}>
                {isInWatchlist && <Check size={12} className="text-white" />}
              </div>
              <span>Přehrát později</span>
            </button>

            {playlists.map(pl => {
              const hasMovie = pl.movieIds.includes(movieId);
              return (
                <button
                  key={pl.id}
                  onClick={() => handleTogglePlaylist(pl.id, hasMovie)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1c1c24] text-sm text-left transition-colors"
                >
                  <div className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${hasMovie ? 'bg-[#dc2626] border-[#dc2626]' : 'border-gray-500'}`}>
                    {hasMovie && <Check size={12} className="text-white" />}
                  </div>
                  <span className="truncate">{pl.name}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-[#27272a] bg-[#0a0a0f]">
            <form onSubmit={handleCreatePlaylist} className="flex gap-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                placeholder="Nový seznam..."
                className="flex-1 bg-[#111116] border border-[#27272a] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#dc2626]"
              />
              <button
                type="submit"
                disabled={!newPlaylistName.trim()}
                className="bg-[#27272a] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[#3f3f46] disabled:opacity-50"
              >
                Přidat
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
