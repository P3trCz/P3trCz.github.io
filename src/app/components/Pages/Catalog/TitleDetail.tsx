import React, { useState } from 'react';
import { Title, ServiceType, serviceColors } from '../../../data/catalog';
import { X, Star, Play, Share2, Check, Eye } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { Snackbar } from '../../Common/Snackbar';
import { useTitleName } from '../../../hooks/useTitleName';
import { useSearch } from '../../../hooks/useSearch';
import { useMyFriends } from '../../../hooks/useMyFriends';
import { formatMinutes } from '../../../utils/formatUtils';
import { SearchInput } from '../../Common/SearchInput';

type Props = {
  title: Title;
  onClose: () => void;
};

export function TitleDetail({ title, onClose }: Props) {
  const getTitleName = useTitleName();
  const markAsWatched = useAppStore(state => state.markAsWatched);
  const currentUser = useAppStore(state => state.currentUser);
  const setPromptWatchedTitleId = useAppStore(state => state.setPromptWatchedTitleId);
  const subscriptionsState = useAppStore(state => state.subscriptions);
  const userSubscriptions = currentUser ? (subscriptionsState[currentUser.id] || []) : [];
  const watchHistory = useAppStore(state => state.watchHistory);
  const currentHistory = currentUser ? (watchHistory[currentUser.id] || []) : [];
  const existingItem = currentHistory.find(h => h.titleId === title.id.toString());
  const isWatched = !!existingItem;

  const myFriends = useMyFriends();
  const recommendTitle = useAppStore(state => state.recommendTitle);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareSelectedFriendId, setShareSelectedFriendId] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [shareSearchQuery, setShareSearchQuery] = useState('');
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const filteredMyFriends = useSearch(myFriends, shareSearchQuery, f => [f.username]);

  const handlePlay = (service: ServiceType) => {
    // Simulace zhlédnutí pro statistiky
    const duration = title.type === 'Film' ? title.runtime : 45;
    let eps: number | undefined = undefined;
    
    if (title.type === 'Seriál') {
      eps = existingItem && existingItem.episodesWatched !== undefined ? existingItem.episodesWatched + 1 : 1;
      if (title.episodes && eps > title.episodes) eps = title.episodes;
    }

    // eslint-disable-next-line react-hooks/purity
    markAsWatched(title.id.toString(), service, duration, Date.now(), eps);
    
    // Zde by normálně bylo spuštění přehrávače
    if (title.watch_link) {
      window.open(title.watch_link, '_blank');
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <div
        className="w-full max-w-4xl bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl flex flex-col lg:flex-row overflow-hidden max-h-[90vh] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Fixed Buttons in corner of the whole modal */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
          <button
            onClick={() => {
              if (currentUser) setPromptWatchedTitleId(title.id.toString());
            }}
            className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-colors ${isWatched
              ? 'bg-red-500/20 text-[#dc2626] border border-[#dc2626]/50'
              : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
              }`}
            title={isWatched ? "Odznačit jako zhlédnuté" : "Označit jako zhlédnuté"}
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => setShareModalOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-gray-400 hover:text-white border border-white/10 transition-colors"
            title="Sdílet"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-gray-400 hover:text-white border border-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media (Poster/Backdrop) */}
        <div className="w-full lg:w-2/5 shrink-0 relative h-64 lg:h-auto">
          {/* Backdrop for mobile (wide) */}
          <img
            src={title.backdrop_url}
            alt={getTitleName(title)}
            className="w-full h-full object-cover lg:hidden"
          />
          {/* Poster for desktop (vertical) */}
          <img
            src={title.poster_url}
            alt={getTitleName(title)}
            className="w-full h-full object-cover hidden lg:block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent opacity-80 lg:hidden"></div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-3/5 p-6 lg:p-8 flex flex-col overflow-y-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 pr-40">{getTitleName(title)}</h2>

          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400 mb-8">
            <span>{title.type}</span>
            <span>•</span>
            <span>{title.release_year}</span>
            <span>•</span>
            <span>{title.genres.join(', ')}</span>
            {title.type === 'Film' && title.runtime > 0 && (
              <>
                <span>•</span>
                <span>{formatMinutes(title.runtime)}</span>
              </>
            )}
            <span>•</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5" title={`${title.rating}%`}>
                {[0, 1, 2, 3, 4].map((i) => {
                  const starValue = (title.rating / 20) - i;
                  let fillFraction = 0;
                  if (starValue >= 1) fillFraction = 1;
                  else if (starValue > 0) fillFraction = Math.round(starValue * 4) / 4;
                  return (
                    <div key={i} className="relative w-[14px] h-[14px]">
                      <Star size={14} className="absolute top-0 left-0 text-gray-600" />
                      {fillFraction > 0 && (
                        <div
                          className="absolute top-0 left-0 h-full overflow-hidden"
                          style={{ width: `${fillFraction * 100}%` }}
                        >
                          <Star size={14} className="fill-[#eab308] text-[#eab308] min-w-[14px]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="font-medium text-[#eab308]">{title.rating}%</span>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            {title.cast && title.cast.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Obsazení</h3>
                <p className="text-gray-300 leading-relaxed">{title.cast.join(', ')}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Popis</h3>
              <p className="text-gray-300 leading-relaxed">{title.overview}</p>
            </div>

            {title.type === 'Seriál' && isWatched && existingItem?.episodesWatched !== undefined && (
              <div className="bg-[#1c1c24] border border-[#27272a] rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Zhlédnuté epizody</span>
                <span className="text-sm font-bold text-white">
                  {existingItem.episodesWatched} {title.episodes ? `z ${title.episodes}` : ''}
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#27272a]">
            <h3 className="text-xs font-semibold tracking-wider text-gray-500 mb-4 uppercase">Dostupnost</h3>
            <div className="flex flex-wrap gap-3">
              {!title.streaming_services ? (
                <button
                  disabled
                  title="Tento titul není aktuálně dostupný na žádné streamovací službě"
                  className="flex items-center justify-center gap-3 flex-1 min-w-[200px] px-5 py-4 rounded-xl font-semibold bg-[#1c1c24] text-gray-500 cursor-not-allowed border border-[#27272a]"
                >
                  <span className="text-sm">Nedostupné</span>
                </button>
              ) : (
                title.streaming_services.map(service => {
                  const isOwned = userSubscriptions.includes(service);
                  const color = serviceColors[service];
                  return (
                    <button
                      key={service}
                      onClick={() => isOwned ? handlePlay(service) : null}
                      title={!isOwned ? "Tuto službu nemáte aktivní" : undefined}
                      style={isOwned ? { backgroundColor: color } : {}}
                      className={`flex items-center justify-center gap-3 flex-1 min-w-[200px] px-5 py-4 rounded-xl font-semibold transition-all group ${isOwned
                        ? 'text-white hover:scale-[1.02] active:scale-100 shadow-lg'
                        : 'bg-[#1c1c24] text-gray-500 cursor-not-allowed border border-[#27272a]'
                        }`}
                    >
                      <Play size={18} className={isOwned ? "fill-white group-hover:translate-x-0.5 transition-transform" : "fill-gray-500"} />
                      <span className="text-sm shrink-0 whitespace-nowrap">Přehrát na {service}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {shareModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setShareModalOpen(false); }}>
          <div className="w-full max-w-md bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Sdílet titul</h2>
              <button onClick={() => setShareModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            {myFriends.length === 0 ? (
              <div className="text-center text-gray-500 py-6">Nemáte přidané žádné přátele.</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Vyberte přítele</label>
                  
                  <SearchInput
                    value={shareSearchQuery}
                    onChange={setShareSearchQuery}
                    placeholder="Hledat přítele..."
                  />

                  <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredMyFriends.length === 0 ? (
                      <div className="text-center text-gray-500 py-4 text-sm">Žádný přítel nenalezen.</div>
                    ) : (
                      filteredMyFriends.map(friend => {
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
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm truncate text-white">{friend.username}</div>
                          </div>
                          {isSelected && <Check size={16} className="text-[#dc2626]" />}
                        </div>
                      );
                    }))}
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
                    if (shareSelectedFriendId) {
                      recommendTitle(shareSelectedFriendId, title.id.toString(), shareMessage);
                      setSnackbarMsg('Titul byl úspěšně doporučen!');
                      setShareModalOpen(false);
                      setShareMessage('');
                      setShareSelectedFriendId('');
                    }
                  }}
                  disabled={!shareSelectedFriendId}
                  className="w-full flex items-center justify-center gap-2 btn-action-primary mt-2"
                >
                  <Share2 size={18} /> Odeslat doporučení
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Snackbar message={snackbarMsg} type="success" onClose={() => setSnackbarMsg('')} />
    </div>
  );
}

