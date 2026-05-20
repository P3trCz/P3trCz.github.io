import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { catalog, Movie } from '../../data/catalog';
import { usersDb } from '../../data/usersDb';
import { Modal } from '../common/Modal';
import { MoreHorizontal, ArrowLeft, Edit2, Trash2, Share2, X, Check } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { MovieCard } from '../catalog/MovieCard';
import { MovieDetail } from '../catalog/MovieDetail';

export function PlaylistsView() {
  const currentUser = useAppStore(state => state.currentUser);
  const playlistsState = useAppStore(state => state.playlists);
  const watchlistsState = useAppStore(state => state.watchlists);
  const renamePlaylist = useAppStore(state => state.renamePlaylist);
  const deletePlaylist = useAppStore(state => state.deletePlaylist);
  const sharePlaylistAction = useAppStore(state => state.sharePlaylist);
  const friends = useAppStore(state => state.friends);

  const playlists = currentUser ? (playlistsState[currentUser.id] || []) : [];
  const watchlist = currentUser ? (watchlistsState[currentUser.id] || []) : [];
  const watchHistory = currentUser ? (useAppStore.getState().watchHistory[currentUser.id] || []) : [];
  // Unikátní movieIds pro historii, seřazené od nejnovějších
  const historyMovieIds = Array.from(new Set([...watchHistory].reverse().map(h => h.movieId)));

  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const myFriendsIds = currentUser ? (friends[currentUser.id] || []) : [];
  const myFriends = myFriendsIds.map(id => usersDb.getUsers().find(u => u.id === id)).filter(Boolean);

  const [shareModalPlaylistId, setShareModalPlaylistId] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState('');
  const [shareSelectedFriendId, setShareSelectedFriendId] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setOpenMenuId(null), !!openMenuId);

  const getMovies = (movieIds: string[]) => {
    return movieIds.map(id => catalog.find(m => m.id.toString() === id.toString())).filter(Boolean) as typeof catalog;
  };

  const handleRename = (id: string, currentName: string) => {
    const newName = window.prompt('Zadejte nový název seznamu:', currentName);
    if (newName && newName.trim() !== '') {
      renamePlaylist(id, newName.trim());
    }
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Opravdu chcete tento seznam smazat?')) {
      deletePlaylist(id);
    }
    setOpenMenuId(null);
  };

  const [displayedCount, setDisplayedCount] = useState(25);

  useEffect(() => {
    setDisplayedCount(25);
  }, [activePlaylistId]);

  const renderDetail = () => {
    const isWatchlist = activePlaylistId === '__watchlist__';
    const isHistory = activePlaylistId === '__history__';
    const playlist = (isWatchlist || isHistory) ? null : playlists.find(p => p.id === activePlaylistId);

    if (!isWatchlist && !isHistory && !playlist) {
      setActivePlaylistId(null);
      return null;
    }

    const title = isWatchlist ? 'Přehrát později' : isHistory ? 'Historie sledování' : playlist!.name;
    const allMovies = getMovies(isWatchlist ? watchlist : isHistory ? historyMovieIds : playlist!.movieIds);
    const displayedMovies = allMovies.slice(0, displayedCount);
    const hasMore = displayedCount < allMovies.length;

    const handleLoadMore = () => {
      setDisplayedCount(prev => Math.min(prev + 25, allMovies.length));
    };

    return (
      <div className="p-8 pb-24">
        <button
          onClick={() => setActivePlaylistId(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Zpět na seznamy</span>
        </button>

        <div className="flex justify-between items-start gap-4 flex-wrap mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
            {!isWatchlist && !isHistory && playlist?.fromUsername && (
              <p className="text-xs text-[#dc2626] font-medium uppercase tracking-widest">Sdíleno od uživatele: {playlist.fromUsername}</p>
            )}
          </div>
          {!isWatchlist && !isHistory && playlist && (
            <button
              onClick={() => setShareModalPlaylistId(playlist.id)}
              className="flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Share2 size={18} /> Sdílet
            </button>
          )}
        </div>

        <div className="bg-[#0a0a0f] border border-[#27272a] rounded-xl shadow-sm">
          <div className="grid grid-cols-[3fr_2fr] lg:grid-cols-[3fr_1fr_2fr_1fr_2fr] gap-4 items-center py-4 px-4 border-b border-[#27272a] text-xs font-semibold text-gray-400 tracking-wider bg-[#0a0a0f] rounded-t-xl">
            <div>TITULY</div>
            <div className="hidden lg:block">TYP</div>
            <div className="hidden lg:block">ŽÁNR</div>
            <div className="hidden lg:block">HODNOCENÍ</div>
            <div>DOSTUPNOST</div>
          </div>

          <div className="flex flex-col">
            {displayedMovies.length > 0 ? (
              displayedMovies.map((movie, index) => (
                <MovieCard
                  key={`${movie.type}-${movie.id}`}
                  movie={movie}
                  onClick={(m) => setSelectedMovie(m)}
                  className={index === displayedMovies.length - 1 ? "rounded-b-xl border-b-0" : ""}
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

        {selectedMovie && (
          <MovieDetail
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>
    );
  };

  const renderPreview = (movieIds: string[]) => {
    const previewMovies = getMovies(movieIds.slice(0, 4));

    if (previewMovies.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center border border-dashed border-[#27272a] rounded-lg py-8 mb-4 bg-[#0a0a0f]">
          <span className="text-sm text-gray-500 font-medium">Seznam je prázdný</span>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center mb-4 py-4 relative min-h-[140px]">
        <div className="relative h-28 w-full flex justify-center items-center">
          {previewMovies.map((m, idx) => (
            <img
              key={`${m.id}-${idx}`}
              src={m.poster_url}
              alt={m.title}
              className="absolute w-20 h-28 object-cover rounded shadow-2xl border border-[#27272a] transition-all duration-300 group-hover:scale-110"
              style={{
                left: `calc(50% - 40px + ${(idx - (previewMovies.length - 1) / 2) * 20}px)`,
                zIndex: previewMovies.length - idx,
                transform: `rotate(${(idx - (previewMovies.length - 1) / 2) * 8}deg)`,
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
            onClick={() => setActivePlaylistId('__history__')}
            className="bg-[#111116] border border-[#27272a] rounded-xl p-6 hover:border-[#3f3f46] transition-all cursor-pointer group flex flex-col shadow-sm hover:shadow-xl"
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
            onClick={() => setActivePlaylistId('__watchlist__')}
            className="bg-[#111116] border border-[#27272a] rounded-xl p-6 hover:border-[#3f3f46] transition-all cursor-pointer group flex flex-col shadow-sm hover:shadow-xl"
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
              onClick={() => setActivePlaylistId(pl.id)}
              className="bg-[#111116] border border-[#27272a] rounded-xl p-6 hover:border-[#3f3f46] transition-all cursor-pointer group flex flex-col relative shadow-sm hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white group-hover:text-[#dc2626] transition-colors truncate pr-8">{pl.name}</h2>

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
                      onClick={(e) => { e.stopPropagation(); setShareModalPlaylistId(pl.id); setOpenMenuId(null); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-[#27272a] transition-colors"
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

              <div className="text-sm text-gray-500 mt-auto pt-2 border-t border-[#27272a]/50 flex justify-between items-center">
                <span>{pl.movieIds.length} {pl.movieIds.length === 1 ? 'položka' : pl.movieIds.length >= 2 && pl.movieIds.length <= 4 ? 'položky' : 'položek'}</span>
                {pl.fromUsername && (
                  <span className="text-[10px] text-[#dc2626] font-bold uppercase tracking-wider">OD: {pl.fromUsername}</span>
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
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-[#dc2626]/10 border-[#dc2626] text-white'
                          : 'bg-[#1c1c24] border-[#27272a] text-gray-400 hover:border-[#3f3f46] hover:text-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelected 
                          ? 'bg-[#dc2626] text-white' 
                          : 'bg-[#0a0a0f] text-gray-400'
                      }`}>
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate text-white">{friend.username}</div>
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
                className="w-full bg-[#1c1c24] border border-[#27272a] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#dc2626] h-24 resize-none"
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
                }
              }}
              disabled={!shareSelectedFriendId}
              className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors mt-2"
            >
              <Share2 size={18} /> Sdílet s přítelem
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}

