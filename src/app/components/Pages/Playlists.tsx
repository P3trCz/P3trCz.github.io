import React, { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { catalog, Title } from '../../data/catalog';
import { usersDb } from '../../data/usersDb';
import { Modal } from '../Common/Modal';
import { MoreHorizontal, ArrowLeft, Edit2, Trash2, Share2, Check, Plus } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { TitleCard } from './Catalog/TitleCard';
import { TitleDetail } from './Catalog/TitleDetail';
import { RenamePlaylistModal } from '../Common/modals/RenamePlaylistModal';
import { DeletePlaylistModal } from '../Common/modals/DeletePlaylistModal';
import { Snackbar } from '../Common/Snackbar';

export function Playlists() {
  const currentUser = useAppStore(state => state.currentUser);
  const playlistsState = useAppStore(state => state.playlists);
  const watchlistsState = useAppStore(state => state.watchlists);
  const renamePlaylist = useAppStore(state => state.renamePlaylist);
  const deletePlaylist = useAppStore(state => state.deletePlaylist);
  const sharePlaylistAction = useAppStore(state => state.sharePlaylist);
  const createPlaylist = useAppStore(state => state.createPlaylist);
  const friends = useAppStore(state => state.friends);

  const playlists = currentUser ? (playlistsState[currentUser.id] || []) : [];
  const watchlist = currentUser ? (watchlistsState[currentUser.id] || []) : [];
  const watchHistoryState = useAppStore(state => state.watchHistory);
  const watchHistory = currentUser ? (watchHistoryState[currentUser.id] || []) : [];
  // Unikátní movieIds pro historii, seřazené od nejnovějších
  const historyMovieIds = Array.from(new Set([...watchHistory].reverse().map(h => h.movieId)));

  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [displayedCount, setDisplayedCount] = useState(25);

  const handlePlaylistClick = (id: string | null) => {
    setActivePlaylistId(id);
    setDisplayedCount(25);
  };
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const myFriendsIds = currentUser ? (friends[currentUser.id] || []) : [];
  const myFriends = myFriendsIds.map(id => usersDb.getUsers().find(u => u.id === id)).filter(Boolean);

  const [shareModalPlaylistId, setShareModalPlaylistId] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState('');
  const [shareSelectedFriendId, setShareSelectedFriendId] = useState('');
  const [renameModalPlaylistId, setRenameModalPlaylistId] = useState<string | null>(null);
  const [deleteModalPlaylistId, setDeleteModalPlaylistId] = useState<string | null>(null);
  const [renamePlaylistName, setRenamePlaylistName] = useState('');
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setOpenMenuId(null), !!openMenuId);

  const getMovies = (movieIds: string[]) => {
    return movieIds.map(id => catalog.find(m => m.id.toString() === id.toString())).filter(Boolean) as typeof catalog;
  };

  const handleRename = (id: string, currentName: string) => {
    setRenamePlaylistName(currentName);
    setRenameModalPlaylistId(id);
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    setDeleteModalPlaylistId(id);
    setOpenMenuId(null);
  };



  const renderDetail = () => {
    const isWatchlist = activePlaylistId === '__watchlist__';
    const isHistory = activePlaylistId === '__history__';
    const playlist = (isWatchlist || isHistory) ? null : playlists.find(p => p.id === activePlaylistId);

    if (!isWatchlist && !isHistory && !playlist) {
      handlePlaylistClick(null);
      return null;
    }

    const title = isWatchlist ? 'Přehrát později' : isHistory ? 'Historie sledování' : playlist!.name;
    const allTitles = getMovies(isWatchlist ? watchlist : isHistory ? historyMovieIds : playlist!.movieIds);
    const displayedTitles = allTitles.slice(0, displayedCount);
    const hasMore = displayedCount < allTitles.length;

    const handleLoadMore = () => {
      setDisplayedCount(prev => Math.min(prev + 25, allTitles.length));
    };

    return (
      <div className="p-8 pb-24">
        <button
          onClick={() => handlePlaylistClick(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Zpět na seznamy</span>
        </button>

        <div className="flex justify-between items-start gap-4 flex-wrap mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
            {!isWatchlist && !isHistory && playlist?.fromUsername && (
              <span className="inline-block mt-2 text-[10px] bg-[#dc2626]/20 text-[#dc2626] px-1.5 py-0.5 rounded uppercase tracking-wider">
                Od: {playlist.fromUsername}
              </span>
            )}
          </div>
          {!isWatchlist && !isHistory && playlist && (
            <button
              onClick={() => playlist.movieIds.length > 0 ? setShareModalPlaylistId(playlist.id) : setSnackbarMsg('Prázdný seznam nelze sdílet!')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${playlist.movieIds.length > 0 ? 'bg-[#27272a] hover:bg-[#3f3f46] text-white' : 'bg-[#27272a]/50 text-gray-500 cursor-not-allowed'}`}
              title={playlist.movieIds.length === 0 ? "Prázdný seznam nelze sdílet" : ""}
            >
              <Share2 size={18} /> Sdílet
            </button>
          )}
        </div>

        <div className="bg-[#0a0a0f] border border-[#27272a] rounded-xl shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr_2fr_1fr_2fr] gap-4 items-center py-4 px-4 border-b border-[#27272a] text-xs font-semibold text-gray-400 tracking-wider bg-[#0a0a0f] rounded-t-xl">
            <div>TITULY</div>
            <div className="hidden lg:block">TYP</div>
            <div className="hidden lg:block">ŽÁNR</div>
            <div className="hidden lg:block">HODNOCENÍ</div>
            <div className="hidden lg:block">DOSTUPNOST</div>
          </div>

          <div className="flex flex-col">
            {displayedTitles.length > 0 ? (
              displayedTitles.map((title, index) => (
                <TitleCard
                  key={`${title.type}-${title.id}`}
                  title={title}
                  onClick={(m) => setSelectedTitle(m)}
                  className={index === displayedTitles.length - 1 ? "rounded-b-xl border-b-0" : ""}
                />
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                Tento seznam je prázdný.
              </div>
            )}
          </div>
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2.5 bg-[#1c1c24] hover:bg-[#dc2626] border border-[#27272a] hover:border-[#dc2626] rounded-xl text-white font-medium transition-colors"
            >
              Načíst dalších 25
            </button>
          </div>
        )}

        {selectedTitle && (
          <TitleDetail
            title={selectedTitle}
            onClose={() => setSelectedTitle(null)}
          />
        )}
      </div>
    );
  };

  const renderPreview = (movieIds: string[]) => {
    const previewTitles = getMovies(movieIds.slice(0, 4));

    if (previewTitles.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center border border-dashed border-[#27272a] rounded-lg py-8 mb-4 bg-[#0a0a0f]">
          <span className="text-sm text-gray-500 font-medium">Seznam je prázdný</span>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center mb-4 py-4 relative min-h-[140px]">
        <div className="relative h-28 w-full flex justify-center items-center">
          {previewTitles.map((m, idx) => (
            <img
              key={`${m.id}-${idx}`}
              src={m.poster_url}
              alt={m.title}
              className="absolute w-20 h-28 object-cover rounded shadow-2xl border border-[#27272a] transition-all duration-300 group-hover:scale-110"
              style={{
                left: `calc(50% - 40px + ${(idx - (previewTitles.length - 1) / 2) * 20}px)`,
                zIndex: previewTitles.length - idx,
                transform: `rotate(${(idx - (previewTitles.length - 1) / 2) * 8}deg)`,
                opacity: 1
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    return (
      <div className="p-8 pt-2">
        <h1 className="text-3xl font-bold text-white mb-8">Moje seznamy</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            className="bg-[#111116] border border-[#27272a] border-dashed rounded-xl p-6 hover:border-[#dc2626] transition-all flex flex-col items-center justify-center cursor-pointer min-h-[250px] shadow-sm hover:shadow-xl group"
            onClick={() => setIsCreating(true)}
          >
            {isCreating ? (
              <div className="w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-bold mb-3 text-center">Nový seznam</h3>
                <input
                  type="text"
                  autoFocus
                  placeholder="Název seznamu..."
                  maxLength={32}
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newPlaylistName.trim()) {
                      createPlaylist(newPlaylistName.trim());
                      setNewPlaylistName('');
                      setIsCreating(false);
                    } else if (e.key === 'Escape') {
                      setIsCreating(false);
                      setNewPlaylistName('');
                    }
                  }}
                  className="w-full bg-[#1c1c24] border border-[#27272a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#dc2626] mb-1 text-center"
                />
                <div className={`text-[10px] mb-3 text-center ${newPlaylistName.length >= 32 ? 'text-[#dc2626]' : 'text-gray-500'}`}>
                  {newPlaylistName.length} / 32 {newPlaylistName.length >= 32 ? '(Limit)' : ''}
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      if (newPlaylistName.trim()) {
                        createPlaylist(newPlaylistName.trim());
                        setNewPlaylistName('');
                        setIsCreating(false);
                      }
                    }}
                    disabled={!newPlaylistName.trim()}
                    className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Vytvořit
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewPlaylistName('');
                    }}
                    className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Zrušit
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#1c1c24] flex items-center justify-center text-gray-400 group-hover:text-[#dc2626] group-hover:bg-[#dc2626]/10 transition-all mb-4">
                  <Plus size={32} />
                </div>
                <h2 className="text-lg font-bold text-gray-400 group-hover:text-white transition-colors">Vytvořit seznam</h2>
              </>
            )}
          </div>

          <div
            onClick={() => handlePlaylistClick('__history__')}
            className="panel-container-dark hover:border-[#3f3f46] transition-all cursor-pointer group flex flex-col shadow-sm hover:shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white group-hover:text-[#dc2626] transition-colors">Historie sledování</h2>
            </div>

            {renderPreview(historyMovieIds)}

            <div className="text-sm text-gray-500 mt-auto pt-2 border-t border-[#27272a]/50">
              {historyMovieIds.length} {historyMovieIds.length === 1 ? 'položka' : historyMovieIds.length >= 2 && historyMovieIds.length <= 4 ? 'položky' : 'položek'}
            </div>
          </div>

          <div
            onClick={() => handlePlaylistClick('__watchlist__')}
            className="panel-container-dark hover:border-[#3f3f46] transition-all cursor-pointer group flex flex-col shadow-sm hover:shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white group-hover:text-[#dc2626] transition-colors">Přehrát později</h2>
            </div>

            {renderPreview(watchlist)}

            <div className="text-sm text-gray-500 mt-auto pt-2 border-t border-[#27272a]/50">
              {watchlist.length} {watchlist.length === 1 ? 'položka' : watchlist.length >= 2 && watchlist.length <= 4 ? 'položky' : 'položek'}
            </div>
          </div>

          {playlists.map(pl => (
            <div
              key={pl.id}
              onClick={() => handlePlaylistClick(pl.id)}
              className="panel-container-dark hover:border-[#3f3f46] transition-all cursor-pointer group flex flex-col relative shadow-sm hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white group-hover:text-[#dc2626] transition-colors truncate pr-8" title={pl.name}>{pl.name}</h2>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === pl.id ? null : pl.id);
                  }}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white z-10"
                >
                  <MoreHorizontal size={20} />
                </button>

                {openMenuId === pl.id && (
                  <div
                    ref={menuRef}
                    className="absolute top-12 right-6 w-48 bg-[#1c1c24] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-20"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRename(pl.id, pl.name); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-[#27272a] transition-colors"
                    >
                      <Edit2 size={16} /> Přejmenovat
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (pl.movieIds.length === 0) {
                          setSnackbarMsg('Prázdný seznam nelze sdílet!');
                        } else {
                          setShareModalPlaylistId(pl.id);
                        }
                        setOpenMenuId(null);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${pl.movieIds.length > 0 ? 'text-gray-300 hover:text-white hover:bg-[#27272a]' : 'text-gray-600 cursor-not-allowed'}`}
                      title={pl.movieIds.length === 0 ? "Prázdný seznam nelze sdílet" : ""}
                    >
                      <Share2 size={16} /> Sdílet
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(pl.id); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} /> Odstranit
                    </button>
                  </div>
                )}
              </div>

              {renderPreview(pl.movieIds)}

              <div className="text-sm text-gray-500 mt-auto pt-2 border-t border-[#27272a]/50 flex justify-between items-center gap-2">
                <span className="whitespace-nowrap shrink-0">{pl.movieIds.length} {pl.movieIds.length === 1 ? 'položka' : pl.movieIds.length >= 2 && pl.movieIds.length <= 4 ? 'položky' : 'položek'}</span>
                {pl.fromUsername && (
                  <span className="text-[10px] bg-[#dc2626]/20 text-[#dc2626] px-1.5 py-0.5 rounded uppercase tracking-wider truncate min-w-0" title={`Od: ${pl.fromUsername}`}>
                    Od: {pl.fromUsername}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {activePlaylistId ? renderDetail() : renderOverview()}

      {/* SDÍLET MODAL */}
      <Modal
        isOpen={!!shareModalPlaylistId}
        onClose={() => setShareModalPlaylistId(null)}
        title="Sdílet seznam"
      >
        {myFriends.length === 0 ? (
          <div className="text-center text-gray-500 py-6">Nemáte přidané žádné přátele.</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Vyberte přítele</label>
              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {myFriends.map(friend => {
                  if (!friend) return null;
                  const isSelected = shareSelectedFriendId === friend.id;
                  return (
                    <div
                      key={friend.id}
                      onClick={() => setShareSelectedFriendId(shareSelectedFriendId === friend.id ? '' : friend.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${isSelected
                        ? 'bg-[#dc2626]/10 border-[#dc2626] text-white'
                        : 'bg-[#1c1c24] border-[#27272a] text-gray-400 hover:border-[#3f3f46] hover:text-white'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isSelected
                        ? 'bg-[#dc2626] text-white'
                        : 'bg-[#0a0a0f] text-gray-400'
                        }`}>
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <div className="font-bold text-sm text-white break-all">{friend.username}</div>
                      </div>
                      {isSelected && <Check size={16} className="text-[#dc2626]" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Zpráva (nepovinné)</label>
              <textarea
                value={shareMessage}
                onChange={e => setShareMessage(e.target.value)}
                placeholder="Podívej se na tohle. Je to opravdu hustý!"
                className="w-full form-input-dark h-24 resize-none"
              ></textarea>
            </div>

            <button
              onClick={() => {
                const pl = playlists.find(p => p.id === shareModalPlaylistId);
                if (pl && shareSelectedFriendId) {
                  sharePlaylistAction(shareSelectedFriendId, pl, shareMessage);
                  setShareModalPlaylistId(null);
                  setShareMessage('');
                  setShareSelectedFriendId('');
                  setSnackbarMsg('Seznam byl úspěšně sdílen!');
                }
              }}
              disabled={!shareSelectedFriendId}
              className="w-full flex items-center justify-center gap-2 btn-action-primary mt-2"
            >
              <Share2 size={18} /> Sdílet s přítelem
            </button>
          </div>
        )}
      </Modal>

      {/* PŘEJMENOVAT MODAL */}
      {renameModalPlaylistId && (
        <RenamePlaylistModal
          playlistId={renameModalPlaylistId}
          currentName={renamePlaylistName}
          onClose={() => setRenameModalPlaylistId(null)}
          onRename={(id, name) => renamePlaylist(id, name)}
        />
      )}

      {/* SMAZAT MODAL */}
      {deleteModalPlaylistId && (
        <DeletePlaylistModal
          playlistName={playlists.find(p => p.id === deleteModalPlaylistId)?.name}
          onClose={() => setDeleteModalPlaylistId(null)}
          onConfirm={() => {
            deletePlaylist(deleteModalPlaylistId);
            setDeleteModalPlaylistId(null);
            if (activePlaylistId === deleteModalPlaylistId) {
              setActivePlaylistId(null);
            }
          }}
        />
      )}

      <Snackbar message={snackbarMsg} type={snackbarMsg.includes('Prázdný') ? 'error' : 'success'} onClose={() => setSnackbarMsg('')} />
    </>
  );
}

