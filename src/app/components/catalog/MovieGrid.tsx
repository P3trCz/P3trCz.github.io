import React, { useState, useMemo } from 'react';
import { catalog, Movie, ServiceType } from '../../data/catalog';
import { MovieCard } from './MovieCard';
import { MovieDetail } from './MovieDetail';
import { Filter, RefreshCw } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { useAppStore } from '../../store/useAppStore';

export function MovieGrid() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const currentUser = useAppStore(state => state.currentUser);
  const subscriptionsState = useAppStore(state => state.subscriptions);
  const userSubscriptions = currentUser ? (subscriptionsState[currentUser.id] || []) : [];

  // Filmy dostupné na uživatelových službách
  const availableMovies = useMemo(() => {
    return catalog.filter(movie => movie.availableOn.some(s => userSubscriptions.includes(s)));
  }, [userSubscriptions]);

  // Filtry nabízejí pouze vlastněné služby a žánry z dostupných filmů
  const allServices = useMemo(() => userSubscriptions.slice().sort(), [userSubscriptions]);
  const allGenres = useMemo(() => Array.from(new Set(availableMovies.flatMap(m => m.genres))).sort(), [availableMovies]);

  const filteredCatalog = useMemo(() => {
    return catalog.filter(movie => {
      // 1. Základní filtr - film musí být dostupný na některé ze služeb, které uživatel vlastní
      const hasSubscribedService = movie.availableOn.some(service => userSubscriptions.includes(service));
      if (!hasSubscribedService) return false;

      // 2. Filtr podle služeb (OR logiky - stačí shoda v jedné z vybraných)
      if (selectedServices.length > 0) {
        const matchesService = movie.availableOn.some(service => selectedServices.includes(service));
        if (!matchesService) return false;
      }

      // 3. Filtr podle žánrů (AND logika - musí mít všechny vybrané žánry)
      if (selectedGenres.length > 0) {
        const matchesGenres = selectedGenres.every(genre => movie.genres.includes(genre));
        if (!matchesGenres) return false;
      }

      return true;
    });
  }, [selectedServices, selectedGenres, userSubscriptions]);

  const hasAnyFilter = selectedServices.length > 0 || selectedGenres.length > 0;

  const clearFilters = () => {
    setSelectedServices([]);
    setSelectedGenres([]);
  };

  return (
    <div className="p-8 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <Filter size={16} />
          <span>Filtrovat:</span>
          <Dropdown
            label="Služby"
            options={allServices}
            selected={selectedServices}
            onChange={setSelectedServices}
          />
          <Dropdown
            label="Žánry"
            options={allGenres}
            selected={selectedGenres}
            onChange={setSelectedGenres}
          />
        </div>

        {hasAnyFilter && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            <RefreshCw size={14} />
            Zrušit filtry
          </button>
        )}
      </div>

      <div className="bg-[#0a0a0f] border border-[#27272a] rounded-xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[3fr_1fr_2fr_1fr_2fr] gap-4 items-center py-4 px-4 border-b border-[#27272a] text-xs font-semibold text-gray-400 tracking-wider">
          <div>TITULY</div>
          <div>ROK</div>
          <div>ŽÁNR</div>
          <div>HODNOCENÍ</div>
          <div>DOSTUPNOST</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {filteredCatalog.length > 0 ? (
            filteredCatalog.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onClick={(m) => setSelectedMovie(m)} 
              />
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              Nenalezeny žádné filmy odpovídající zadaným kritériím nebo nemáte aktivní předplatné.
            </div>
          )}
        </div>
      </div>

      {selectedMovie && (
        <MovieDetail 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}
