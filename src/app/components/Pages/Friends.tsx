import React, { useState } from 'react';
import { useAppStore, Playlist } from '../../store/useAppStore';
import { usersDb } from '../../data/usersDb';
import { catalog, Title } from '../../data/catalog';
import { getUsername } from '../../utils/userUtils';
import { Search, UserPlus, Check, X, Share2, Film, Trash2, Play, Download, Eye, MessageSquare } from 'lucide-react';
import { TitleDetail } from './Catalog/TitleDetail';
import { SharePlaylistModal } from '../Common/modals/SharePlaylistModal';
import { RecommendMovieModal } from '../Common/modals/RecommendMovieModal';
import { MessageHistoryModal } from '../Common/modals/MessageHistoryModal';
import { PreviewPlaylistModal } from '../Common/modals/PreviewPlaylistModal';
import { AddTitleToPlaylistModal } from '../Common/modals/AddTitleToPlaylistModal';
import { RemoveFriendModal } from '../Common/modals/RemoveFriendModal';
import { Snackbar } from '../Common/Snackbar';
import { useTitleName } from '../../hooks/useTitleName';
import { useSearch } from '../../hooks/useSearch';

export function Friends() {
  const getTitleName = useTitleName();
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
  const recommendTitle = useAppStore(state => state.recommendTitle);
  const messageHistory = useAppStore(state => state.messageHistory);

  const [addUsername, setAddUsername] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [friendSearch, setFriendSearch] = useState('');

  // Modals state
  const [sharePlaylistFriendId, setSharePlaylistFriendId] = useState<string | null>(null);
  const [recommendTitleFriendId, setRecommendMovieFriendId] = useState<string | null>(null);
  const [historyFriendId, setHistoryFriendId] = useState<string | null>(null);
  const [previewPlaylist, setPreviewPlaylist] = useState<Playlist | null>(null);
  const [previewFromUserId, setPreviewFromUserId] = useState<string>('');
  const [addingtitleId, setAddingtitleId] = useState<string | null>(null);
  const [selectedTitleForDetail, setSelectedTitleForDetail] = useState<Title | null>(null);
  const [friendToRemove, setFriendToRemove] = useState<{ id: string, name: string } | null>(null);

  const myFriendsIds = currentUser ? (friends[currentUser.id] || []) : [];
  const myFriends = myFriendsIds.map(id => usersDb.getUsers().find(u => u.id === id)).filter(Boolean);
  const myNotifications = currentUser ? (notifications[currentUser.id] || []) : [];
  const myPlaylists = currentUser ? (playlists[currentUser.id] || []) : [];

  const getLatestMessageTime = (friendId: string) => {
    if (!currentUser) return 0;
    const history = messageHistory[currentUser.id] || [];
    const messagesWithFriend = history.filter(m => m.fromUserId === friendId || m.toUserId === friendId);
    return messagesWithFriend.length > 0 ? Math.max(...messagesWithFriend.map(m => m.timestamp)) : 0;
  };

  const pendingOutgoingRequests: { userId: string, timestamp: number }[] = [];
  if (currentUser) {
    Object.entries(notifications).forEach(([userId, userNotifs]) => {
      const pendingReq = userNotifs.find(n => n.type === 'FRIEND_REQUEST' && n.fromUserId === currentUser.id);
      if (pendingReq) {
        pendingOutgoingRequests.push({ userId, timestamp: pendingReq.timestamp });
      }
    });
  }

  const displayFriends = myFriends.map(friend => ({
    type: 'FRIEND' as const,
    user: friend!,
    latestMessageTime: getLatestMessageTime(friend!.id)
  }));

  const displayPending = pendingOutgoingRequests.map(req => ({
    type: 'PENDING_OUTGOING' as const,
    user: usersDb.getUsers().find(u => u.id === req.userId)!,
    timestamp: req.timestamp
  })).filter(item => item.user);

  const filteredFriends = useSearch(displayFriends, friendSearch, item => [item.user.username]);
  const filteredPending = useSearch(displayPending, friendSearch, item => [item.user.username]);

  const sortedFriends = [...filteredFriends].sort((a, b) => b.latestMessageTime - a.latestMessageTime);
  const sortedPending = [...filteredPending].sort((a, b) => b.timestamp - a.timestamp);
  const allDisplayItems = [...sortedFriends, ...sortedPending];

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    const trimmedUsername = addUsername.trim();
    if (!trimmedUsername) {
      setAddError('Zadejte uživatelské jméno!');
      return;
    }

    if (!currentUser) return;
    if (trimmedUsername.toLowerCase() === currentUser.username.toLowerCase()) {
      setAddError('Nemůžete přidat sami sebe!');
      return;
    }

    const user = usersDb.findUserByUsername(trimmedUsername);
    if (!user) {
      setAddError('Uživatel nebyl nalezen!');
      return;
    }

    if (myFriendsIds.includes(user.id)) {
      setAddError('Tento uživatel už je mezi vašimi přáteli!');
      return;
    }

    const status = sendFriendRequest(user);
    if (status === 'ALREADY_FRIENDS') {
      setAddError('Tento uživatel už je mezi vašimi přáteli!');
    } else if (status === 'ALREADY_SENT') {
      setAddError('Žádost už byla kdysi odeslána!');
    } else {
      setAddSuccess('Žádost o přátelství byla odeslána!');
    }
    setAddUsername('');
    setTimeout(() => setAddSuccess(''), 3000);
  };

  const handleRemoveFriend = (friendId: string, username: string) => {
    setFriendToRemove({ id: friendId, name: username });
  };

  const confirmRemoveFriend = () => {
    if (friendToRemove) {
      removeFriend(friendToRemove.id);
      setAddSuccess('Přítel byl odebrán!');
      setFriendToRemove(null);
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
          <div className="panel-container-dark">
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
              <button
                type="submit"
                disabled={!addUsername.trim()}
                className="w-full flex items-center justify-center gap-2 btn-action-primary"
              >
                <UserPlus size={18} />
                Odeslat žádost
              </button>
            </form>
          </div>

          {/* Notifikace */}
          <div className="panel-container-dark">
            <h2 className="text-xl font-bold text-white mb-4">Oznámení</h2>
            {myNotifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Nemáte žádná nová oznámení.</p>
            ) : (
              <div className="space-y-4">
                {myNotifications.map(notif => (
                  <div key={notif.id} className="bg-[#1c1c24] border border-[#27272a] rounded-lg p-4">

                    {notif.type === 'FRIEND_REQUEST' && (
                      <div>
                        <p className="text-sm text-gray-300 mb-3 break-words min-w-0">
                          <strong className="text-white break-all">{getUsername(notif.fromUserId)}</strong> si vás chce přidat do přátel.
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
                          <strong className="text-white">{getUsername(notif.fromUserId)}</strong> zamítl/a vaši žádost o přátelství.
                        </p>
                        <button onClick={() => dismissNotification(notif.id)} className="text-gray-500 hover:text-white">
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    {notif.type === 'SHARED_PLAYLIST' && (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-gray-300 min-w-0 flex-1 break-words">
                            <strong className="text-white break-all">{getUsername(notif.fromUserId)}</strong> s vámi sdílí seznam: <strong className="text-white break-all">{notif.playlist?.name}</strong>
                          </p>
                          <button onClick={() => dismissNotification(notif.id)} className="text-gray-500 hover:text-white shrink-0 ml-4 relative -top-1">
                            <X size={16} />
                          </button>
                        </div>
                        {notif.message && (
                          <div className="bg-[#0a0a0f] p-3 rounded-lg text-sm text-gray-400 italic mb-3 break-words whitespace-pre-wrap">
                            "{notif.message}"
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setPreviewPlaylist(notif.playlist || null);
                            setPreviewFromUserId(notif.fromUserId || '');
                          }} className="flex-1 flex items-center justify-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded-lg text-sm font-medium transition-colors">
                            <Eye size={16} /> Otevřít seznam
                          </button>
                        </div>
                      </div>
                    )}

                    {notif.type === 'RECOMMENDED_TITLE' && (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-gray-300 min-w-0 flex-1 break-words">
                            <strong className="text-white break-all">{getUsername(notif.fromUserId)}</strong> vám doporučuje:
                          </p>
                          <button onClick={() => dismissNotification(notif.id)} className="text-gray-500 hover:text-white shrink-0 ml-4 relative -top-1">
                            <X size={16} />
                          </button>
                        </div>

                        {(() => {
                          const title = getMovieById(notif.titleId || '');
                          if (!title) return <p className="text-red-500 text-xs">Titul nebyl nalezen.</p>;

                          return (
                            <div className="flex flex-col gap-3 mt-2">
                              <div className="flex items-center gap-3 bg-[#0a0a0f] p-2 rounded-lg">
                                <img src={title.poster_url} alt={getTitleName(title)} className="w-12 h-16 object-cover rounded" />
                                <div>
                                  <div className="text-sm font-bold text-white">{getTitleName(title)}</div>
                                  <div className="text-xs text-gray-500">{title.release_year} • {title.type}</div>
                                </div>
                              </div>
                              {notif.message && (
                                <div className="bg-[#0a0a0f] p-3 rounded-lg text-sm text-gray-400 italic break-words whitespace-pre-wrap">
                                  "{notif.message}"
                                </div>
                              )}
                              <button onClick={() => setSelectedTitleForDetail(title)} className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2 rounded-lg text-xs font-medium transition-colors">
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
          <div className="panel-container-dark min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">Moji přátelé</h2>
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Vyhledat přítele..."
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#111116] border border-[#27272a] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#dc2626] transition-colors"
                />
              </div>
            </div>

            {allDisplayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <UserPlus size={48} className="mb-4 opacity-20" />
                <p>{friendSearch ? 'Žádný přítel neodpovídá vyhledávání.' : 'Zatím nemáte žádné přátele.'}</p>
                {!friendSearch && <p className="text-sm">Vyhledejte uživatele podle jména a pošlete mu žádost.</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allDisplayItems.map(item => {
                  const friend = item.user;
                  if (item.type === 'PENDING_OUTGOING') {
                    return (
                      <div key={`pending-${friend.id}`} className="bg-[#1c1c24] border border-[#27272a] border-dashed rounded-xl p-5 flex flex-col justify-between opacity-60">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold text-lg">
                            {friend.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white break-all">{friend.username}</div>
                            <div className="text-xs text-gray-400 mt-1">Žádost odeslána</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="w-full text-center py-2 text-sm text-gray-500">Čeká se na přijetí</div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={`friend-${friend.id}`} className="bg-[#1c1c24] border border-[#27272a] rounded-xl p-5 flex flex-col justify-between">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-[#dc2626] to-[#7c3aed] rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {friend.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-white break-all">{friend.username}</div>
                          {item.latestMessageTime > 0 && (
                            <div className="text-xs text-gray-500 mt-1">Aktivní: {new Date(item.latestMessageTime).toLocaleDateString('cs-CZ')}</div>
                          )}
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
                          <MessageSquare size={16} /> Historie doporučení
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
            if (list) {
              sharePlaylist(sharePlaylistFriendId, list, message);
              setAddSuccess('Seznam byl úspěšně sdílen!');
            }
            setSharePlaylistFriendId(null);
          }}
        />
      )}

      {/* MODAL: Doporučit Film */}
      {recommendTitleFriendId && (
        <RecommendMovieModal
          friendName={myFriends.find(f => f?.id === recommendTitleFriendId)?.username || ''}
          onClose={() => setRecommendMovieFriendId(null)}
          onRecommend={(titleId, message) => {
            recommendTitle(recommendTitleFriendId, titleId, message);
            setRecommendMovieFriendId(null);
            setAddSuccess('Titul byl úspěšně doporučen!');
          }}
        />
      )}

      {/* MODAL: Historie doporučení */}
      {historyFriendId && (
        <MessageHistoryModal
          friend={myFriends.find(f => f?.id === historyFriendId)!}
          history={messageHistory[currentUser?.id || ''] || []}
          onClose={() => setHistoryFriendId(null)}
          onViewMovie={(title) => setSelectedTitleForDetail(title)}
          onAddMovieToPlaylist={(titleId) => setAddingtitleId(titleId)}
          onViewPlaylist={(playlist, fromUserId) => {
            setPreviewPlaylist(playlist);
            setPreviewFromUserId(fromUserId || '');
          }}
        />
      )}

      {/* MODAL: Náhled seznamu */}
      {previewPlaylist && (
        <PreviewPlaylistModal
          playlist={previewPlaylist}
          onClose={() => {
            setPreviewPlaylist(null);
            setPreviewFromUserId('');
          }}
          onViewMovie={(title) => setSelectedTitleForDetail(title)}
          onSave={() => {
            const success = importPlaylist(previewPlaylist, previewFromUserId);
            if (success) {
              setPreviewPlaylist(null);
              setPreviewFromUserId('');
              setAddSuccess('Seznam byl uložen do vašich seznamů!');
            } else {
              setAddError('Tento seznam už ve svých seznamech máte!');
            }
          }}
        />
      )}

      {/* MODAL: Přidat film do seznamu */}
      {addingtitleId && (
        <AddTitleToPlaylistModal
          titleId={addingtitleId}
          onClose={() => setAddingtitleId(null)}
        />
      )}

      {/* MODAL: Zobrazit detail filmu (pokud na něj kliknu z notifikace) */}
      {selectedTitleForDetail && (
        <TitleDetail title={selectedTitleForDetail} onClose={() => setSelectedTitleForDetail(null)} />
      )}

      {/* SNACKBARS */}
      <RemoveFriendModal
        friendToRemove={friendToRemove}
        onClose={() => setFriendToRemove(null)}
        onConfirm={confirmRemoveFriend}
      />

      <Snackbar message={addSuccess} type="success" onClose={() => setAddSuccess('')} />
      <Snackbar message={addError} type="error" onClose={() => setAddError('')} />
    </div>
  );
}

