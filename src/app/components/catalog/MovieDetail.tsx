import React from 'react';
import { Movie, ServiceType } from '../../data/catalog';
import { X, Star, Play } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

type Props = {
  movie: Movie;
  onClose: () => void;
};

const serviceColors: Record<ServiceType, string> = {
  'Netflix': 'bg-red-600 hover:bg-red-700',
  'HBO Max': 'bg-purple-600 hover:bg-purple-700',
  'Disney Plus': 'bg-blue-600 hover:bg-blue-700',
  'Amazon Prime Video': 'bg-cyan-600 hover:bg-cyan-700',
  'Apple TV': 'bg-gray-700 hover:bg-gray-800',
  'SkyShowtime': 'bg-indigo-600 hover:bg-indigo-700',
  'Oneplay': 'bg-pink-600 hover:bg-pink-700'
};

export function MovieDetail({ movie, onClose }: Props) {
  const addToHistory = useAppStore(state => state.addToHistory);
  const currentUser = useAppStore(state => state.currentUser);
  const subscriptionsState = useAppStore(state => state.subscriptions);
  const userSubscriptions = currentUser ? (subscriptionsState[currentUser.id] || []) : [];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-4xl bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl flex overflow-hidden max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Poster */}
        <div className="w-2/5 shrink-0 relative">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent opacity-80 lg:hidden"></div>
        </div>

        {/* Content */}
        <div className="w-3/5 p-8 flex flex-col relative overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c24] text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <h2 className="text-3xl font-bold text-white mb-2 pr-10">{movie.title}</h2>

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
                return (
                  <button
                    key={service}
                    onClick={() => isOwned ? handlePlay(service) : null}
                    className={`flex items-center justify-center gap-2 flex-1 min-w-[160px] px-4 py-3 rounded-xl font-medium transition-colors ${isOwned
                      ? `${serviceColors[service]} text-white`
                      : 'bg-[#1c1c24] text-gray-500 cursor-not-allowed border border-[#27272a]'
                      }`}
                  >
                    <Play size={18} className={isOwned ? "fill-white shrink-0" : "fill-gray-500 shrink-0"} />
                    Přehrát na {service}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
