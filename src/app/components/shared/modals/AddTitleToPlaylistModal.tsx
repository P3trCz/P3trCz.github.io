// Modál pro přidání titulu do existujícího nebo nového seznamu.
import { useState } from 'react';
import { Clock, Check, ListVideo, Plus } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { catalog } from '../../../data/catalog';
import { Modal } from '../Modal';
import { getUsername } from '../../../utils/userUtils';
import { TitleTile } from '../TitleTile';
import { SearchInput } from '../SearchInput';

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
  const [searchQuery, setSearchQuery] = useState('');

  const userPlaylists = currentUser ? (playlists[currentUser.id] || []) : [];
  const userWatchlist = currentUser ? (watchlists[currentUser.id] || []) : [];
  const title = catalog.find(m => m.id.toString() === titleId);

  const normalizedQuery = searchQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredPlaylists = userPlaylists.filter(pl => {
    const normalizedName = pl.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return normalizedName.includes(normalizedQuery);
  });
  const showWatchlist = 'prehrat pozdeji'.includes(normalizedQuery);

  const handleCreateAndAdd = () => {
    if (!newPlaylistName.trim()) return;
    createPlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Výběr seznamů"
      maxWidth="max-w-sm"
      zIndex="z-[110]"
    >
      <div className="flex flex-col">
        {title && (
          <div className="mb-6">
            <TitleTile title={title} size="sm" />
          </div>
        )}

        <div className="mb-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Hledat seznam..."
          />
        </div>

        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar mb-6">
          {showWatchlist && (
            <button
              onClick={() => {
                toggleWatchlist(titleId);
              }}
              className={`selectable-item ${userWatchlist.includes(titleId) ? 'selectable-item--active' : ''}`}
            >
              <div className="flex items-center gap-3 truncate">
                <Clock size={16} />
                <span className="text-sm font-medium truncate">Přehrát později</span>
              </div>
              {userWatchlist.includes(titleId) && <Check size={16} className="text-[#dc2626]" />}
            </button>
          )}

          {filteredPlaylists.map(pl => {
            const isAdded = pl.titleIds.includes(titleId);
            return (
              <button
                key={pl.id}
                onClick={() => {
                  if (!isAdded) addToPlaylist(pl.id, titleId);
                  else removeFromPlaylist(pl.id, titleId);
                }}
                className={`selectable-item ${isAdded ? 'selectable-item--active' : ''}`}
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <ListVideo size={16} />
                  <span className="text-sm font-medium truncate">{pl.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {pl.fromUserId && (
                    <span className="text-[10px] bg-[#dc2626]/20 text-[#dc2626] px-1.5 py-0.5 rounded uppercase tracking-wider truncate max-w-[100px]" title={`Od: ${getUsername(pl.fromUserId)}`}>
                      Od: {getUsername(pl.fromUserId)}
                    </span>
                  )}
                  {isAdded && <Check size={16} className="text-[#dc2626]" />}
                </div>
              </button>
            );
          })}

          {!showWatchlist && filteredPlaylists.length === 0 && (
            <div className="text-center text-gray-500 py-4 text-sm">
              Žádný seznam nenalezen
            </div>
          )}
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