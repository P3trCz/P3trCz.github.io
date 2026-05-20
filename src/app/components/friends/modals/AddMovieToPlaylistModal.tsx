import React, { useState } from 'react';
import { Clock, Check, ListVideo, Plus } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { catalog } from '../../../data/catalog';
import { Modal } from '../../common/Modal';

type AddMovieToPlaylistModalProps = {
  movieId: string;
  onClose: () => void;
};

export function AddMovieToPlaylistModal({ movieId, onClose }: AddMovieToPlaylistModalProps) {
  const currentUser = useAppStore(state => state.currentUser);
  const playlists = useAppStore(state => state.playlists);
  const addToPlaylist = useAppStore(state => state.addToPlaylist);
  const createPlaylist = useAppStore(state => state.createPlaylist);
  const watchlists = useAppStore(state => state.watchlists);
  const toggleWatchlist = useAppStore(state => state.toggleWatchlist);

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const userPlaylists = currentUser ? (playlists[currentUser.id] || []) : [];
  const userWatchlist = currentUser ? (watchlists[currentUser.id] || []) : [];
  const movie = catalog.find(m => m.id.toString() === movieId);

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
        {movie && (
          <div className="flex items-center gap-3 bg-[#1c1c24] p-3 rounded-xl mb-6">
            <img src={movie.poster_url} alt={movie.title} className="w-10 h-14 object-cover rounded" />
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">{movie.title}</div>
              <div className="text-xs text-gray-500">{movie.release_year}</div>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar mb-6">
          {(() => {
            const isAddedToWatchlist = userWatchlist.includes(movieId);
            return (
              <button
                onClick={() => {
                  toggleWatchlist(movieId);
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
            const isAdded = pl.movieIds.includes(movieId);
            return (
              <button
                key={pl.id}
                onClick={() => {
                  if (!isAdded) addToPlaylist(pl.id, movieId);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isAdded
                  ? 'bg-[#dc2626]/10 border-[#dc2626] text-white'
                  : 'bg-[#1c1c24] border-[#27272a] text-gray-400 hover:border-[#3f3f46] hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <ListVideo size={16} />
                  <span className="text-sm font-medium truncate">{pl.name}</span>
                </div>
                {isAdded && <Check size={16} className="text-[#dc2626]" />}
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
