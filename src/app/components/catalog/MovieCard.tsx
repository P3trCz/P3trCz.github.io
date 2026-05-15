import React from 'react';
import { Movie, ServiceType } from '../../data/catalog';
import { Star } from 'lucide-react';
import { AddToPlaylistButton } from './AddToPlaylistButton';

type Props = {
  movie: Movie;
  onClick: (movie: Movie) => void;
};

const serviceColors: Record<ServiceType, string> = {
  'Netflix': 'bg-red-600',
  'HBO Max': 'bg-purple-600',
  'Disney+': 'bg-blue-600',
  'Prime': 'bg-cyan-600',
  'Apple TV+': 'bg-gray-700',
  'SkyShowtime': 'bg-indigo-600',
  'Oneplay': 'bg-pink-600'
};

export function MovieCard({ movie, onClick }: Props) {
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
      className="grid grid-cols-[3fr_1fr_2fr_1fr_2fr] gap-4 items-center py-3 border-b border-[#27272a] hover:bg-[#111116] transition-colors cursor-pointer px-4"
      onClick={() => onClick(movie)}
    >
      <div className="flex items-center gap-3 min-w-0">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-12 h-16 object-cover rounded shadow shrink-0"
        />
        <div className="font-medium text-white truncate">{movie.title}</div>
        <div className="shrink-0" onClick={e => e.stopPropagation()}>
          <AddToPlaylistButton movieId={movie.id} />
        </div>
      </div>
      
      <div className="text-gray-400 text-sm">
        {movie.year}
      </div>
      
      <div className="text-gray-400 text-sm truncate pr-4">
        {movie.genres.join(', ')}
      </div>
      
      <div>
        {renderStars(movie.rating)}
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {movie.availableOn.map(service => (
          <span 
            key={service} 
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${serviceColors[service]} text-white`}
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}
