import React from 'react';
import { Title, serviceColors } from '../../../data/catalog';
import { Star, Eye } from 'lucide-react';
import { AddToPlaylistButton } from './AddToPlaylistButton';
import { useAppStore } from '../../../store/useAppStore';

type Props = {
  title: Title;
  onClick: (title: Title) => void;
  className?: string;
};

export function TitleCard({ title, onClick, className = '' }: Props) {
  const currentUser = useAppStore(state => state.currentUser);
  const watchHistory = useAppStore(state => state.watchHistory);
  const toggleWatchedTitle = useAppStore(state => state.toggleWatchedTitle);
  
  const isWatched = currentUser && (watchHistory[currentUser.id] || []).some(h => h.titleId === title.id.toString());

  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 20); // 1-5
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < stars ? 'fill-[#eab308] text-[#eab308]' : 'text-gray-600'}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-[3fr_1fr_2fr_1fr_2fr] gap-4 items-center py-3 border-b border-[#27272a] hover:bg-[#111116] transition-colors cursor-pointer px-4 ${className}`}
      onClick={() => onClick(title)}
    >
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={title.poster_url}
          alt={title.title}
          className={`w-10 h-14 lg:w-12 lg:h-16 object-cover rounded shadow shrink-0 ${isWatched ? 'opacity-50 grayscale-[0.5]' : ''}`}
        />
        <div className={`font-medium truncate text-sm lg:text-base ${isWatched ? 'text-gray-500' : 'text-white'}`}>{title.title}</div>
        <div className="shrink-0 flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => {
              if (currentUser) toggleWatchedTitle(title.id.toString());
            }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
              isWatched
                ? 'bg-green-500/10 border-green-500 text-green-500'
                : 'bg-[#111116] border-[#27272a] text-gray-500 hover:text-white hover:border-[#dc2626]'
            }`}
            title={isWatched ? 'Označeno jako zhlédnuté' : 'Označit jako zhlédnuté'}
          >
            <Eye size={16} />
          </button>
          <AddToPlaylistButton titleId={title.id.toString()} />
        </div>
      </div>

      <div className={`hidden lg:block text-sm ${isWatched ? 'text-gray-600' : 'text-gray-400'}`}>
        {title.type}
      </div>

      <div className={`hidden lg:block text-sm truncate pr-4 ${isWatched ? 'text-gray-600' : 'text-gray-400'}`}>
        {title.genres.join(', ')}
      </div>

      <div className={`hidden lg:block ${isWatched ? 'opacity-50 grayscale' : ''}`}>
        {renderStars(title.rating)}
      </div>

      <div className={`hidden lg:flex flex-wrap gap-1.5 ${isWatched ? 'opacity-50 grayscale' : ''}`}>
        {!title.streaming_services ? (
          <span className="text-xs shrink-0 whitespace-nowrap font-bold px-2 py-0.5 rounded text-gray-400 bg-[#27272a]">
            Nedostupné
          </span>
        ) : (
          title.streaming_services.map(service => (
            <span
              key={service}
              className="text-xs shrink-0 whitespace-nowrap font-bold px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: serviceColors[service] }}
            >
              {service}
            </span>
          ))
        )}
      </div>
    </div>
  );
}


