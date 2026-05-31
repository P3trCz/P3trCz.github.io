// Modál zobrazující historii zpráv mezi dvěma uživateli s možností otevřít seznam přímo z chatu.
import { History, ListVideo, Bookmark } from 'lucide-react';
import { ChatMessage, Playlist, useAppStore } from '../../../store/useAppStore';
import { catalog, Title } from '../../../data/catalog';
import { Modal } from '../Modal';
import { User } from '../../../data/usersDb';
import { getUsername } from '../../../utils/userUtils';
import { TitleTile } from '../TitleTile';

type MessageHistoryModalProps = {
  friend: User;
  history: ChatMessage[];
  onClose: () => void;
  onViewMovie: (title: Title) => void;
  onViewPlaylist: (playlist: Playlist, fromUserId?: string) => void;
  onAddMovieToPlaylist: (titleId: string) => void;
};

export function MessageHistoryModal({
  friend,
  history,
  onClose,
  onViewMovie,
  onViewPlaylist,
  onAddMovieToPlaylist
}: MessageHistoryModalProps) {
  const currentUser = useAppStore(state => state.currentUser);
  const playlistsState = useAppStore(state => state.playlists);
  const watchlistsState = useAppStore(state => state.watchlists);
  const userPlaylists = currentUser ? (playlistsState[currentUser.id] || []) : [];
  const userWatchlist = currentUser ? (watchlistsState[currentUser.id] || []) : [];

  const filteredHistory = history.filter(m =>
    (m.fromUserId === friend.id) || (m.toUserId === friend.id)
  ).sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('cs-CZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Historie s ${friend.username}`}
      maxWidth="max-w-2xl"
      zIndex="z-40"
    >
      <div className="flex flex-col space-y-6">

        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <History size={48} className="mb-4 opacity-10" />
            <p>Zatím zde nejsou žádné společné zprávy</p>
          </div>
        ) : (
          filteredHistory.map(msg => {
            const isMe = msg.fromUserId !== friend.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${isMe ? 'bg-[#dc2626]/10 border border-[#dc2626]/20' : 'bg-[#1c1c24] border border-[#27272a]'}`}>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest break-all min-w-0 flex-1">{isMe ? 'Vy' : getUsername(msg.fromUserId)}</span>
                    <span className="text-[10px] text-gray-500 shrink-0 mt-0.5">{formatDate(msg.timestamp)}</span>
                  </div>

                  {msg.message && (
                    <p className="text-sm mt-1 text-gray-200 break-all whitespace-pre-wrap">{msg.message}</p>
                  )}

                  {msg.type === 'RECOMMENDED_TITLE' && (
                    <div className="mt-2">
                      {(() => {
                        const title = catalog.find(m => m.id.toString() === msg.titleId);
                        if (!title) return <span className="text-xs text-red-500">Titul nenalezen</span>;

                        const isInWatchlist = userWatchlist.includes(title.id.toString());
                        const isInAnyPlaylist = userPlaylists.some(p => p.titleIds.includes(title.id.toString()));
                        const isSaved = isInWatchlist || isInAnyPlaylist;

                        return (
                          <TitleTile
                            title={title}
                            size="sm"
                            onClick={() => onViewMovie(title)}
                            action={
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddMovieToPlaylist(title.id.toString());
                                }}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isSaved ? 'bg-red-500/10 border-[#dc2626] text-[#dc2626]' : 'bg-[#111116] border-[#27272a] text-gray-400 hover:text-white hover:border-[#dc2626]'}`}
                                title="Výběr seznamů"
                              >
                                <Bookmark size={16} className={isSaved ? 'fill-[#dc2626]' : ''} />
                              </button>
                            }
                          />
                        );
                      })()}
                    </div>
                  )}

                  {msg.type === 'SHARED_PLAYLIST' && (
                    <div className="bg-[#1c1c24] border border-[#27272a] rounded-xl p-3 flex items-center gap-3">
                      <div className="p-2 bg-[#dc2626] rounded-lg text-white">
                        <ListVideo size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{msg.playlist?.name}</div>
                        <button
                          onClick={() => onViewPlaylist(msg.playlist!, msg.fromUserId)}
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
    </Modal>
  );
}