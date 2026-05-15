import React, { useState, useMemo, useEffect } from 'react';
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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [displayedCount, setDisplayedCount] = useState(25);

  const currentUser = useAppStore(state => state.currentUser);
  const subscriptionsState = useAppStore(state => state.subscriptions);
  const userSubscriptions = currentUser ? (subscriptionsState[currentUser.id] || []) : [];

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayedCount(25);
  }, [selectedServices, selectedGenres, selectedTypes, userSubscriptions]);

  // Filmy dostupné na uživatelových službách
  const availableMovies = useMemo(() => {
    return catalog.filter(movie => movie.streaming_services.some(s => userSubscriptions.includes(s)));
  }, [userSubscriptions]);

  // Filtry nabízejí pouze vlastněné služby a žánry z dostupných filmů
  const allServices = useMemo(() => {
    const validServices = new Set(availableMovies.flatMap(m => m.streaming_services));
    return userSubscriptions.filter(s => validServices.has(s as ServiceType)).sort();
  }, [availableMovies, userSubscriptions]);
  
  const allGenres = useMemo(() => Array.from(new Set(availableMovies.flatMap(m => m.genres))).sort(), [availableMovies]);
  const allTypes = ['Film', 'Seriál'];

  const filteredCatalog = useMemo(() => {
    return catalog.filter(movie => {
      // 1. Základní filtr - film musí být dostupný na některé ze služeb, které uživatel vlastní
      const hasSubscribedService = movie.streaming_services.some(service => userSubscriptions.includes(service));
      if (!hasSubscribedService) return false;

      // 2. Filtr podle služeb (OR logiky)
      if (selectedServices.length > 0) {
        const matchesService = movie.streaming_services.some(service => selectedServices.includes(service));
        if (!matchesService) return false;
      }

      // 3. Filtr podle žánrů (AND logika)
      if (selectedGenres.length > 0) {
        const matchesGenres = selectedGenres.every(genre => movie.genres.includes(genre));
        if (!matchesGenres) return false;
      }

      // 4. Filtr podle typu (Film / Seriál)
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(movie.type)) return false;
      }

      return true;
    });
  }, [selectedServices, selectedGenres, selectedTypes, userSubscriptions]);

  const displayedCatalog = filteredCatalog.slice(0, displayedCount);
  const hasMore = displayedCount < filteredCatalog.length;

  const hasAnyFilter = selectedServices.length > 0 || selectedGenres.length > 0 || selectedTypes.length > 0;

  const clearFilters = () => {
    setSelectedServices([]);
    setSelectedGenres([]);
    setSelectedTypes([]);
  };

  const handleLoadMore = () => {
    setDisplayedCount(prev => Math.min(prev + 25, filteredCatalog.length));
  };

  return (
    <div className="p-8 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <span>Filtrovat:</span>
          </div>
          <Dropdown
            label="Typ"
            options={allTypes}
            selected={selectedTypes}
            onChange={setSelectedTypes}
          />
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
          <div>TYP</div>
          <div>ŽÁNR</div>
          <div>HODNOCENÍ</div>
          <div>DOSTUPNOST</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {displayedCatalog.length > 0 ? (
            displayedCatalog.map(movie => (
              <MovieCard 
                key={`${movie.type}-${movie.id}`} 
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
}
