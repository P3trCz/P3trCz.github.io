import React, { useState } from 'react';
import { Clock, Check, ListVideo, Plus } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { catalog } from '../../../data/catalog';
import { Modal } from '../Modal';

type AddTitleToPlaylistModalProps = {
  titleId: string;
  onClose: () => void;
};

export function AddTitleToPlaylistModal({ titleId, onClose }: AddTitleToPlaylistModalProps) {
  const currentUser = useAppStore(state => state.currentUser);
  const playlists = useAppStore(state => state.playlists);
  const addToPlaylist = useAppStore(state => state.addToPlaylist);
  const removeFromPlaylist = useAppStore(state => state.removeFromPlaylist);
  const createPlaylist = useAppStore(state => state.createPlaylist);
  const watchlists = useAppStore(state => state.watchlists);
  const toggleWatchlist = useAppStore(state => state.toggleWatchlist);

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const userPlaylists = currentUser ? (playlists[currentUser.id] || []) : [];
  const userWatchlist = currentUser ? (watchlists[currentUser.id] || []) : [];
  const title = catalog.find(m => m.id.toString() === titleId);

  const handleCreateAndAdd = () => {
    if (!newPlaylistName.trim()) return;
    createPlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Přidat do seznamu"
      maxWidth="max-w-sm"
      zIndex="z-[110]"
    >
      <div className="flex flex-col">
        {title && (
          <div className="flex items-center gap-3 bg-[#1c1c24] p-3 rounded-xl mb-6">
            <img src={title.poster_url} alt={title.title} className="w-10 h-14 object-cover rounded" />
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">{title.title}</div>
              <div className="text-xs text-gray-500">{title.release_year}</div>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar mb-6">
          {(() => {
            const isAddedToWatchlist = userWatchlist.includes(titleId);
            return (
              <button
                onClick={() => {
                  toggleWatchlist(titleId);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isAddedToWatchlist
                  ? 'bg-[#dc2626]/10 border-[#dc2626] text-white'
                  : 'bg-[#1c1c24] border-[#27272a] text-gray-400 hover:border-[#3f3f46] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Clock size={16} />
                  <span className="text-sm font-medium truncate">Přehrát později</span>
                </div>
                {isAddedToWatchlist && <Check size={16} className="text-[#dc2626]" />}
              </button>
            );
          })()}

          {userPlaylists.map(pl => {
            const isAdded = pl.titleIds.includes(titleId);
            return (
              <button
                key={pl.id}
                onClick={() => {
                  if (!isAdded) addToPlaylist(pl.id, titleId);
                  else removeFromPlaylist(pl.id, titleId);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isAdded
                  ? 'bg-[#dc2626]/10 border-[#dc2626] text-white'
                  : 'bg-[#1c1c24] border-[#27272a] text-gray-400 hover:border-[#3f3f46] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <ListVideo size={16} className="shrink-0" />
                  <span className="text-sm font-medium truncate">{pl.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {pl.fromUsername && (
                    <span className="text-[10px] bg-[#dc2626]/20 text-[#dc2626] px-1.5 py-0.5 rounded uppercase tracking-wider truncate max-w-[100px]" title={`Od: ${pl.fromUsername}`}>
                      Od: {pl.fromUsername}
                    </span>
                  )}
                  {isAdded && <Check size={16} className="text-[#dc2626]" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[#27272a]">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nový seznam..."
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              className="flex-1 bg-[#1c1c24] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#dc2626]"
            />
            <button
              onClick={handleCreateAndAdd}
              disabled={!newPlaylistName.trim()}
              className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}


