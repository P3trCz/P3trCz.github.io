import React, { useState } from 'react';
import { useAppStore, Playlist, ChatMessage } from '../../store/useAppStore';
import { usersDb } from '../../data/usersDb';
import { catalog, Movie } from '../../data/catalog';
import { Search, UserPlus, Check, X, Share2, Film, Trash2, Play, Download, ListVideo, MessageSquare, Eye, History, Plus, Clock } from 'lucide-react';
import { MovieDetail } from '../catalog/MovieDetail';

export function FriendsView() {
  const currentUser = useAppStore(state => state.currentUser);
  const friends = useAppStore(state => state.friends);
  const notifications = useAppStore(state => state.notifications);
  const playlists = useAppStore(state => state.playlists);
  const sendFriendRequest = useAppStore(state => state.sendFriendRequest);
  const acceptFriendRequest = useAppStore(state => state.acceptFriendRequest);
  const rejectFriendRequest = useAppStore(state => state.rejectFriendRequest);
  const dismissNotification = useAppStore(state => state.dismissNotification);
  const saveSharedPlaylist = useAppStore(state => state.saveSharedPlaylist);
  const importPlaylist = useAppStore(state => state.importPlaylist);
  const removeFriend = useAppStore(state => state.removeFriend);
  const sharePlaylist = useAppStore(state => state.sharePlaylist);
  const recommendMovie = useAppStore(state => state.recommendMovie);
  const messageHistory = useAppStore(state => state.messageHistory);

  const [addUsername, setAddUsername] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Modals state
  const [sharePlaylistFriendId, setSharePlaylistFriendId] = useState<string | null>(null);
  const [recommendMovieFriendId, setRecommendMovieFriendId] = useState<string | null>(null);
  const [historyFriendId, setHistoryFriendId] = useState<string | null>(null);
  const [previewPlaylist, setPreviewPlaylist] = useState<Playlist | null>(null);
  const [previewFromUsername, setPreviewFromUsername] = useState<string>('');
  const [addingMovieId, setAddingMovieId] = useState<string | null>(null);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);

  const myFriendsIds = currentUser ? (friends[currentUser.id] || []) : [];
  const myFriends = myFriendsIds.map(id => usersDb.getUsers().find(u => u.id === id)).filter(Boolean);
  const myNotifications = currentUser ? (notifications[currentUser.id] || []) : [];
  const myPlaylists = currentUser ? (playlists[currentUser.id] || []) : [];

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    if (!currentUser) return;
    if (addUsername.toLowerCase() === currentUser.username.toLowerCase()) {
      setAddError('Nemůžete přidat sami sebe.');
      return;
    }

    const user = usersDb.findUserByUsername(addUsername);
    if (!user) {
      setAddError('Uživatel nebyl nalezen.');
      return;
    }

    if (myFriendsIds.includes(user.id)) {
      setAddError('Tento uživatel už je mezi vašimi přáteli.');
      return;
    }

    sendFriendRequest(user);
    setAddSuccess('Žádost o přátelství byla odeslána!');
    setAddUsername('');
    setTimeout(() => setAddSuccess(''), 3000);
  };

  const handleRemoveFriend = (friendId: string, username: string) => {
    if (window.confirm(`Opravdu si přejete odebrat uživatele ${username} z přátel?`)) {
      removeFriend(friendId);
      setAddSuccess('Přítel byl odebrán.');
      setTimeout(() => setAddSuccess(''), 3000);
    }
  };

  const getMovieById = (id: string) => catalog.find(m => m.id.toString() === id.toString());

  return (
    <div className="p-8 pt-2 pb-24">
      <h1 className="text-3xl font-bold text-white mb-8">Přátelé</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Levý sloupec: Přidat přítele & Notifikace */}
        <div className="lg:col-span-1 space-y-8">

          {/* Přidat přítele */}
          <div className="bg-[#111116] border border-[#27272a] rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Přidat přítele</h2>
            <form onSubmit={handleAddFriend} className="flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Uživatelské jméno"
                  value={addUsername}
                  onChange={(e) => setAddUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1c1c24] border border-[#27272a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#dc2626] transition-colors"
                />
              </div>
              {addError && <p className="text-red-500 text-sm">{addError}</p>}
              {addSuccess && <p className="text-green-500 text-sm">{addSuccess}</p>}
              <button
                type="submit"
                disabled={!addUsername.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors"
              >
                <UserPlus size={18} />
                Odeslat žádost
              </button>
            </form>
          </div>

          {/* Notifikace */}
          <div className="bg-[#111116] border border-[#27272a] rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Oznámení</h2>
            {myNotifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Nemáte žádná nová oznámení.</p>
            ) : (
              <div className="space-y-4">
                {myNotifications.map(notif => (
                  <div key={notif.id} className="bg-[#1c1c24] border border-[#27272a] rounded-lg p-4">

                    {notif.type === 'FRIEND_REQUEST' && (
                      <div>
                        <p className="text-sm text-gray-300 mb-3">
                          <strong className="text-white">{notif.fromUsername}</strong> si vás chce přidat do přátel.
                        </p>
                        <div className="flex gap-2">
                          <button onClick={() => acceptFriendRequest(notif.id)} className="flex-1 flex items-center justify-center gap-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2 rounded-lg text-xs font-medium transition-colors">
                            <Check size={14} /> Přijmout
                          </button>
                          <button onClick={() => rejectFriendRequest(notif.id)} className="flex-1 flex items-center justify-center gap-1 bg-transparent border border-[#27272a] hover:bg-[#27272a] text-gray-300 py-2 rounded-lg text-xs font-medium transition-colors">
                            <X size={14} /> Odmítnout
                          </button>
                        </div>
                      </div>
                    )}

                    {notif.type === 'FRIEND_REQUEST_REJECTED' && (
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-sm text-gray-300">
                          <strong className="text-white">{notif.fromUsername}</strong> zamítl/a vaši žádost o přátelství.
                        </p>
                        <button onClick={() => dismissNotification(notif.id)} className="text-gray-500 hover:text-white">
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    {notif.type === 'SHARED_PLAYLIST' && (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-gray-300">
                            <strong className="text-white">{notif.fromUsername}</strong> s vámi sdílí seznam: <strong className="text-white">{notif.playlist?.name}</strong>
                          </p>
                          <button onClick={() => dismissNotification(notif.id)} className="text-gray-500 hover:text-white">
                            <X size={16} />
                          </button>
                        </div>
                        {notif.message && (
                          <div className="bg-[#0a0a0f] p-3 rounded-lg text-sm text-gray-400 italic mb-3">
                            "{notif.message}"
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setPreviewPlaylist(notif.playlist || null);
                            setPreviewFromUsername(notif.fromUsername);
                          }} className="flex-1 flex items-center justify-center gap-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded-lg text-xs font-medium transition-colors">
                            <Eye size={14} /> Otevřít
                          </button>
                          <button onClick={() => saveSharedPlaylist(notif.id)} className="flex-1 flex items-center justify-center gap-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2 rounded-lg text-xs font-medium transition-colors">
                            <Download size={14} /> Uložit
                          </button>
                        </div>
                      </div>
                    )}

                    {notif.type === 'RECOMMENDED_MOVIE' && (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-gray-300">
                            <strong className="text-white">{notif.fromUsername}</strong> vám doporučuje:
                          </p>
                          <button onClick={() => dismissNotification(notif.id)} className="text-gray-500 hover:text-white">
                            <X size={16} />
                          </button>
                        </div>

                        {(() => {
                          const movie = getMovieById(notif.movieId || '');
                          if (!movie) return <p className="text-red-500 text-xs">Titul nebyl nalezen.</p>;

                          return (
                            <div className="flex flex-col gap-3 mt-2">
                              <div className="flex items-center gap-3 bg-[#0a0a0f] p-2 rounded-lg">
                                <img src={movie.poster_url} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                                <div>
                                  <div className="text-sm font-bold text-white">{movie.title}</div>
                                  <div className="text-xs text-gray-500">{movie.release_year} • {movie.type}</div>
                                </div>
                              </div>
                              {notif.message && (
                                <div className="bg-[#0a0a0f] p-3 rounded-lg text-sm text-gray-400 italic">
                                  "{notif.message}"
                                </div>
                              )}
                              <button onClick={() => setSelectedMovieForDetail(movie)} className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2 rounded-lg text-xs font-medium transition-colors">
                                <Play size={14} fill="currentColor" /> Zobrazit detail
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pravý sloupec: Seznam přátel */}
        <div className="lg:col-span-2">
          <div className="bg-[#111116] border border-[#27272a] rounded-xl p-6 min-h-[500px]">
            <h2 className="text-xl font-bold text-white mb-6">Moji přátelé</h2>

            {myFriends.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <UserPlus size={48} className="mb-4 opacity-20" />
                <p>Zatím nemáte žádné přátele.</p>
                <p className="text-sm">Vyhledejte uživatele podle jména a pošlete mu žádost.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myFriends.map(friend => {
                  if (!friend) return null;
                  return (
                    <div key={friend.id} className="bg-[#1c1c24] border border-[#27272a] rounded-xl p-5 flex flex-col justify-between">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#dc2626] to-[#7c3aed] rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {friend.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white">{friend.username}</div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button onClick={() => setSharePlaylistFriendId(friend.id)} className="w-full flex items-center justify-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded-lg text-sm font-medium transition-colors">
                          <Share2 size={16} /> Sdílet seznam
                        </button>
                        <button onClick={() => setRecommendMovieFriendId(friend.id)} className="w-full flex items-center justify-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded-lg text-sm font-medium transition-colors">
                          <Film size={16} /> Doporučit titul
                        </button>
                        <button onClick={() => setHistoryFriendId(friend.id)} className="w-full flex items-center justify-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded-lg text-sm font-medium transition-colors">
                          <MessageSquare size={16} /> Historie zpráv
                        </button>
                        <button onClick={() => handleRemoveFriend(friend.id, friend.username)} className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-red-500/10 text-red-500 py-2 rounded-lg text-sm font-medium transition-colors mt-2">
                          <Trash2 size={16} /> Odebrat z přátel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL: Sdílet Seznam */}
      {sharePlaylistFriendId && (
        <SharePlaylistModal
          friendName={myFriends.find(f => f?.id === sharePlaylistFriendId)?.username || ''}
          playlists={myPlaylists}
          onClose={() => setSharePlaylistFriendId(null)}
          onShare={(playlistId, message) => {
            const list = myPlaylists.find(p => p.id === playlistId);
            if (list) sharePlaylist(sharePlaylistFriendId, list, message);
            setSharePlaylistFriendId(null);
          }}
        />
      )}

      {/* MODAL: Doporučit Film */}
      {recommendMovieFriendId && (
        <RecommendMovieModal
          friendName={myFriends.find(f => f?.id === recommendMovieFriendId)?.username || ''}
          onClose={() => setRecommendMovieFriendId(null)}
          onRecommend={(movieId, message) => {
            recommendMovie(recommendMovieFriendId, movieId, message);
            setRecommendMovieFriendId(null);
          }}
        />
      )}

      {/* MODAL: Historie zpráv */}
      {historyFriendId && (
        <MessageHistoryModal
          friend={myFriends.find(f => f?.id === historyFriendId)!}
          history={messageHistory[currentUser?.id || ''] || []}
          onClose={() => setHistoryFriendId(null)}
          onViewMovie={(movie) => setSelectedMovieForDetail(movie)}
          onAddMovieToPlaylist={(movieId) => setAddingMovieId(movieId)}
          onViewPlaylist={(playlist, fromUsername) => {
            setPreviewPlaylist(playlist);
            setPreviewFromUsername(fromUsername);
          }}
        />
      )}

      {/* MODAL: Náhled seznamu */}
      {previewPlaylist && (
        <PreviewPlaylistModal
          playlist={previewPlaylist}
          fromUsername={previewFromUsername}
          onClose={() => {
            setPreviewPlaylist(null);
            setPreviewFromUsername('');
          }}
          onViewMovie={(movie) => setSelectedMovieForDetail(movie)}
          onSave={() => {
            const success = importPlaylist(previewPlaylist, previewFromUsername);
            if (success) {
              setPreviewPlaylist(null);
              setPreviewFromUsername('');
              setAddSuccess('Seznam byl uložen do vašich seznamů.');
              setTimeout(() => setAddSuccess(''), 3000);
            } else {
              alert('Tento seznam už ve svých seznamech máte.');
            }
          }}
        />
      )}

      {/* MODAL: Přidat film do seznamu */}
      {addingMovieId && (
        <AddMovieToPlaylistModal
          movieId={addingMovieId}
          onClose={() => setAddingMovieId(null)}
        />
      )}

      {/* MODAL: Zobrazit detail filmu (pokud na něj kliknu z notifikace) */}
      {selectedMovieForDetail && (
        <MovieDetail movie={selectedMovieForDetail} onClose={() => setSelectedMovieForDetail(null)} />
      )}
    </div>
  );
}

// --- POMOCNÉ MODALY (jen pro tuto obrazovku) ---

function SharePlaylistModal({ friendName, playlists, onClose, onShare }: { friendName: string, playlists: Playlist[], onClose: () => void, onShare: (playlistId: string, message: string) => void }) {
  const [selectedList, setSelectedList] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Sdílet seznam s {friendName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        {playlists.length === 0 ? (
          <div className="text-center text-gray-500 py-6">Nemáte žádné vlastní seznamy ke sdílení.</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Vyberte seznam</label>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {playlists.map(pl => (
                  <div
                    key={pl.id}
                    onClick={() => setSelectedList(selectedList === pl.id ? '' : pl.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${selectedList === pl.id
                      ? 'bg-[#dc2626]/10 border-[#dc2626] text-white'
                      : 'bg-[#1c1c24] border-[#27272a] text-gray-400 hover:border-[#3f3f46] hover:text-white'
                      }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedList === pl.id ? 'bg-[#dc2626] text-white' : 'bg-[#0a0a0f] text-gray-500'}`}>
                      <ListVideo size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{pl.name}</div>
                      <div className="text-xs opacity-60">
                        {pl.movieIds.length} {pl.movieIds.length === 1 ? 'položka' : pl.movieIds.length >= 2 && pl.movieIds.length <= 4 ? 'položky' : 'položek'}
                      </div>
                    </div>
                    {selectedList === pl.id && <Check size={18} className="text-[#dc2626]" />}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Zpráva (nepovinné)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Podívej se na tohle. Je to opravdu hustý!"
                className="w-full bg-[#1c1c24] border border-[#27272a] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#dc2626] h-24 resize-none transition-colors"
              ></textarea>
            </div>

            <button
              onClick={() => onShare(selectedList, message)}
              disabled={!selectedList}
              className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors mt-2 shadow-lg shadow-red-900/20"
            >
              <Share2 size={18} /> Odeslat seznam
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendMovieModal({ friendName, onClose, onRecommend }: { friendName: string, onClose: () => void, onRecommend: (movieId: string, message: string) => void }) {
  const [search, setSearch] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const filteredMovies = search.trim().length >= 3
    ? catalog.filter(m => m.title.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  const selectedMovie = selectedMovieId ? catalog.find(m => m.id.toString() === selectedMovieId.toString()) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Doporučit titul pro {friendName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          {!selectedMovie ? (
            <div>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Hledat film nebo seriál..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1c1c24] border border-[#27272a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#dc2626] transition-colors"
                  autoFocus
                />
              </div>

              {search.length > 0 && search.length < 3 && (
                <div className="text-sm text-gray-500 text-center py-2">Zadejte alespoň 3 znaky.</div>
              )}

              {filteredMovies.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
                  {filteredMovies.map(movie => (
                    <div
                      key={`${movie.type}-${movie.id}`}
                      onClick={() => setSelectedMovieId(movie.id.toString())}
                      className="flex items-center gap-3 p-2 hover:bg-[#27272a] rounded-lg cursor-pointer transition-colors border border-transparent hover:border-[#3f3f46]"
                    >
                      <img src={movie.poster_url} alt={movie.title} className="w-10 h-14 object-cover rounded" />
                      <div>
                        <div className="font-bold text-white text-sm">{movie.title}</div>
                        <div className="text-xs text-gray-400">{movie.release_year} • {movie.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                search.trim().length >= 3 && (
                  <div className="text-sm text-gray-500 text-center py-6">
                    Žádný film ani seriál odpovídající „<span className="text-white font-medium">{search}</span>“ nebyl nalezen.
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-4 bg-[#1c1c24] border border-[#27272a] p-3 rounded-xl mb-4">
                <img src={selectedMovie.poster_url} alt={selectedMovie.title} className="w-16 h-24 object-cover rounded shadow-md" />
                <div className="flex-1">
                  <div className="font-bold text-white text-lg">{selectedMovie.title}</div>
                  <div className="text-sm text-gray-400">{selectedMovie.release_year} • {selectedMovie.type}</div>
                  <button onClick={() => setSelectedMovieId(null)} className="text-xs text-[#dc2626] hover:text-white mt-2 transition-colors">Vybrat jiný titul</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Zpráva (nepovinné)</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Koukni na to, je to pecka!"
                  className="w-full bg-[#1c1c24] border border-[#27272a] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#dc2626] h-24 resize-none"
                ></textarea>
              </div>

              <button
                onClick={() => onRecommend(selectedMovie.id.toString(), message)}
                className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 rounded-xl font-semibold transition-colors mt-4"
              >
                <Film size={18} /> Odeslat doporučení
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- POMOCNÉ MODALY ---

function PreviewPlaylistModal({ playlist, fromUsername, onClose, onViewMovie, onSave }: { playlist: Playlist, fromUsername: string, onClose: () => void, onViewMovie: (movie: Movie) => void, onSave: () => void }) {
  const movieIds = playlist.movieIds;
  const movies = movieIds.map(id => catalog.find(m => m.id.toString() === id.toString())).filter(Boolean) as Movie[];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#27272a] flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{playlist.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{movies.length} {movies.length === 1 ? 'položka' : movies.length >= 2 && movies.length <= 4 ? 'položky' : 'položek'}</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-[#dc2626] font-medium">Od uživatele: {fromUsername}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {movies.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Tento seznam je prázdný.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {movies.map(movie => (
                <div
                  key={movie.id}
                  onClick={() => onViewMovie(movie)}
                  className="flex items-center gap-3 bg-[#1c1c24] p-3 rounded-xl border border-transparent hover:border-[#dc2626] cursor-pointer transition-all"
                >
                  <img src={movie.poster_url} alt={movie.title} className="w-12 h-18 object-cover rounded shadow-md" />
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{movie.title}</div>
                    <div className="text-xs text-gray-500">{movie.release_year} • {movie.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#27272a] flex justify-between gap-4">
          <button onClick={onClose} className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Zavřít náhled
          </button>
          <button onClick={onSave} className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Download size={18} /> Uložit seznam
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageHistoryModal({ friend, history, onClose, onViewMovie, onViewPlaylist, onAddMovieToPlaylist }: { friend: any, history: ChatMessage[], onClose: () => void, onViewMovie: (movie: Movie) => void, onViewPlaylist: (playlist: Playlist, fromUsername: string) => void, onAddMovieToPlaylist: (movieId: string) => void }) {
  const filteredHistory = history.filter(m =>
    (m.fromUserId === friend.id) || (m.toUserId === friend.id)
  ).sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('cs-CZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#27272a] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#dc2626] to-[#7c3aed] rounded-full flex items-center justify-center text-white font-bold">
              {friend.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Historie s {friend.username}</h2>
              <p className="text-xs text-gray-500">{filteredHistory.length} zpráv</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <History size={48} className="mb-4 opacity-10" />
              <p>Zatím zde nejsou žádné společné zprávy.</p>
            </div>
          ) : (
            filteredHistory.map(msg => {
              const isMe = msg.fromUserId !== friend.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 ${isMe ? 'bg-[#dc2626]/10 border border-[#dc2626]/20' : 'bg-[#1c1c24] border border-[#27272a]'}`}>
                    <div className="flex justify-between items-center gap-4 mb-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isMe ? 'Vy' : msg.fromUsername}</span>
                      <span className="text-[10px] text-gray-500">{formatDate(msg.timestamp)}</span>
                    </div>

                    {msg.message && <p className="text-sm text-gray-200 mb-3 italic">"{msg.message}"</p>}

                    {msg.type === 'RECOMMENDED_MOVIE' && (
                      <div className="bg-black/20 rounded-xl p-3 flex items-center gap-3">
                        {(() => {
                          const movie = catalog.find(m => m.id.toString() === msg.movieId);
                          if (!movie) return <span className="text-xs text-red-500">Titul nenalezen</span>;
                          return (
                            <>
                              <img src={movie.poster_url} alt={movie.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-bold text-white truncate">{movie.title}</div>
                                <button
                                  onClick={() => onViewMovie(movie)}
                                  className="text-[10px] text-[#dc2626] font-bold hover:underline mt-1 mr-3"
                                >
                                  ZOBRAZIT DETAIL
                                </button>
                                <button
                                  onClick={() => onAddMovieToPlaylist(movie.id.toString())}
                                  className="text-[10px] text-gray-400 font-bold hover:text-white mt-1 flex items-center gap-1 inline-flex"
                                >
                                  <Plus size={10} /> PŘIDAT DO SEZNAMU
                                </button>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {msg.type === 'SHARED_PLAYLIST' && (
                      <div className="bg-black/20 rounded-xl p-3 flex items-center gap-3">
                        <div className="p-2 bg-[#dc2626] rounded-lg text-white">
                          <ListVideo size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate">{msg.playlist?.name}</div>
                          <button
                            onClick={() => onViewPlaylist(msg.playlist!, msg.fromUsername)}
                            className="text-[10px] text-[#dc2626] font-bold hover:underline mt-1"
                          >
                            OTEVŘÍT SEZNAM
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function AddMovieToPlaylistModal({ movieId, onClose }: { movieId: string, onClose: () => void }) {
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
    // Po vytvoření se automaticky přidá do nejnovějšího (v akci createPlaylist je logika pro přidání aktuálně hledaného filmu, ale my tady musíme počkat na update)
    // Pro jednoduchost teď uživatele necháme kliknout na nový seznam.
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-sm bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Přidat do seznamu</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

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
    </div>
  );
}
