import React, { useState } from 'react';
import { Movie, ServiceType, serviceLogos, serviceColors } from '../../data/catalog';
import { X, Star, Play, Share2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { usersDb } from '../../data/usersDb';

type Props = {
  movie: Movie;
  onClose: () => void;
};

export function MovieDetail({ movie, onClose }: Props) {
  const addToHistory = useAppStore(state => state.addToHistory);
  const currentUser = useAppStore(state => state.currentUser);
  const subscriptionsState = useAppStore(state => state.subscriptions);
  const userSubscriptions = currentUser ? (subscriptionsState[currentUser.id] || []) : [];

  const friends = useAppStore(state => state.friends);
  const recommendMovie = useAppStore(state => state.recommendMovie);

  const myFriendsIds = currentUser ? (friends[currentUser.id] || []) : [];
  const myFriends = myFriendsIds.map(id => usersDb.getUsers().find(u => u.id === id)).filter(Boolean);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareSelectedFriendId, setShareSelectedFriendId] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const handlePlay = (service: ServiceType) => {
    const duration = movie.type === 'Film' ? movie.runtime : 0;
    addToHistory(movie.id.toString(), service, duration);
    if (movie.watch_link) {
      window.open(movie.watch_link, '_blank');
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} h ${mins} min`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-4xl bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl flex flex-col lg:flex-row overflow-hidden max-h-[90vh] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Fixed Buttons in corner of the whole modal */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
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
            src={movie.backdrop_url}
            alt={movie.title}
            className="w-full h-full object-cover lg:hidden"
          />
          {/* Poster for desktop (vertical) */}
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover hidden lg:block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent opacity-80 lg:hidden"></div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-3/5 p-6 lg:p-8 flex flex-col overflow-y-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 pr-24">{movie.title}</h2>

          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400 mb-8">
            <span>{movie.type}</span>
            <span>•</span>
            <span>{movie.release_year}</span>
            <span>•</span>
            <span>{movie.genres.join(', ')}</span>
            {movie.type === 'Film' && movie.runtime > 0 && (
              <>
                <span>•</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </>
            )}
            <span>•</span>
            <div className="flex items-center gap-1 text-[#eab308]">
              <Star size={14} className="fill-[#eab308]" />
              <span className="font-medium">{movie.rating}/100</span>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Obsazení</h3>
                <p className="text-gray-300 leading-relaxed">{movie.cast.join(', ')}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Popis</h3>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#27272a]">
            <h3 className="text-xs font-semibold tracking-wider text-gray-500 mb-4 uppercase">Dostupnost</h3>
            <div className="flex flex-wrap gap-3">
              {movie.streaming_services.map(service => {
                const isOwned = userSubscriptions.includes(service);
                const color = serviceColors[service];
                return (
                  <button
                    key={service}
                    onClick={() => isOwned ? handlePlay(service) : null}
                    style={isOwned ? { backgroundColor: color } : {}}
                    className={`flex items-center justify-center gap-3 flex-1 min-w-[200px] px-5 py-4 rounded-xl font-semibold transition-all group ${isOwned
                      ? 'text-white hover:scale-[1.02] active:scale-100 shadow-lg'
                      : 'bg-[#1c1c24] text-gray-500 cursor-not-allowed border border-[#27272a]'
                      }`}
                  >
                    <Play size={18} className={isOwned ? "fill-white shrink-0 group-hover:translate-x-0.5 transition-transform" : "fill-gray-500 shrink-0"} />
                    <span className="text-sm">Přehrát na {service}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {shareModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShareModalOpen(false)}>
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
                  <select
                    value={shareSelectedFriendId}
                    onChange={e => setShareSelectedFriendId(e.target.value)}
                    className="w-full bg-[#1c1c24] border border-[#27272a] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#dc2626]"
                  >
                    <option value="" disabled>Zvolte přítele...</option>
                    {myFriends.map(f => f && (
                      <option key={f.id} value={f.id}>{f.username}</option>
                    ))}
                  </select>
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
                    if (shareSelectedFriendId) {
                      recommendMovie(shareSelectedFriendId, movie.id.toString(), shareMessage);
                      setShareModalOpen(false);
                      setShareMessage('');
                      setShareSelectedFriendId('');
                    }
                  }}
                  disabled={!shareSelectedFriendId}
                  className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors mt-2"
                >
                  <Share2 size={18} /> Odeslat doporučení
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
