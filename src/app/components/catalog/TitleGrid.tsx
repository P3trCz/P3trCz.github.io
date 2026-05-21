import React, { useState, useMemo, useEffect } from 'react';
import { catalog, Title, ServiceType } from '../../data/catalog';
import { TitleCard } from './TitleCard';
import { TitleDetail } from './TitleDetail';
import { Filter, RefreshCw, Search, X } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { useAppStore } from '../../store/useAppStore';

export function TitleGrid() {
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWatched, setSelectedWatched] = useState<string[]>([]);
  const [displayedCount, setDisplayedCount] = useState(25);

  const currentUser = useAppStore(state => state.currentUser);
  const subscriptionsState = useAppStore(state => state.subscriptions);
  const EMPTY_ARRAY: string[] = [];
  const userSubscriptions = currentUser ? (subscriptionsState[currentUser.id] || EMPTY_ARRAY) : EMPTY_ARRAY;
  const watchedTitles = useAppStore(state => state.watchedTitles);
  const userWatchedTitles = currentUser ? (watchedTitles[currentUser.id] || EMPTY_ARRAY) : EMPTY_ARRAY;
  const searchQuery = useAppStore(state => state.searchQuery);
  const setSearchQuery = useAppStore(state => state.setSearchQuery);

  const isSearchActive = searchQuery.length >= 3;

  // Reset pagination when filters or search change
  useEffect(() => {
    const timer = setTimeout(() => setDisplayedCount(25), 0);
    return () => clearTimeout(timer);
  }, [selectedServices, selectedGenres, selectedTypes, selectedWatched, userSubscriptions, searchQuery]);

  // Filmy dostupné na uživatelových službách
  const availableTitles = useMemo(() => {
    return catalog.filter(title => title.streaming_services.some(s => userSubscriptions.includes(s)));
  }, [userSubscriptions]);

  // Filtry nabízejí pouze vlastněné služby a žánry z dostupných filmů
  const allServices = useMemo(() => {
    const validServices = new Set(availableTitles.flatMap(m => m.streaming_services));
    return userSubscriptions.filter(s => validServices.has(s as ServiceType)).sort();
  }, [availableTitles, userSubscriptions]);

  const allGenres = useMemo(() => Array.from(new Set(availableTitles.flatMap(m => m.genres))).sort(), [availableTitles]);
  const allTypes = ['Film', 'Seriál'];

  const filteredCatalog = useMemo(() => {
    return catalog.filter(title => {
      // 1. Základní filtr - film musí být dostupný na některé ze služeb, které uživatel vlastní
      const hasSubscribedService = title.streaming_services.some(service => userSubscriptions.includes(service));
      if (!hasSubscribedService) return false;

      // 2. Fulltextové vyhledávání v názvu (od 3 znaků)
      if (isSearchActive) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = title.title.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // 3. Filtr podle služeb (OR logiky)
      if (selectedServices.length > 0) {
        const matchesService = title.streaming_services.some(service => selectedServices.includes(service));
        if (!matchesService) return false;
      }

      // 4. Filtr podle žánrů (AND logika)
      if (selectedGenres.length > 0) {
        const matchesGenres = selectedGenres.every(genre => title.genres.includes(genre));
        if (!matchesGenres) return false;
      }

      // 5. Filtr podle typu (Film / Seriál)
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(title.type)) return false;
      }

      // 6. Filtr podle zhlédnutí
      if (selectedWatched.length > 0 && selectedWatched.length < 2) {
        const isWatched = userWatchedTitles.includes(title.id.toString());
        if (selectedWatched.includes('Zhlédnuté') && !isWatched) return false;
        if (selectedWatched.includes('Nezhlédnuté') && isWatched) return false;
      }

      return true;
    });
  }, [selectedServices, selectedGenres, selectedTypes, selectedWatched, userSubscriptions, searchQuery, isSearchActive, userWatchedTitles]);

  const displayedCatalog = filteredCatalog.slice(0, displayedCount);
  const hasMore = displayedCount < filteredCatalog.length;

  const hasAnyFilter = selectedServices.length > 0 || selectedGenres.length > 0 || selectedTypes.length > 0 || selectedWatched.length > 0;

  const clearFilters = () => {
    setSelectedServices([]);
    setSelectedGenres([]);
    setSelectedTypes([]);
    setSelectedWatched([]);
  };

  const handleLoadMore = () => {
    setDisplayedCount(prev => Math.min(prev + 25, filteredCatalog.length));
  };

  return (
    <div className="p-8 pt-2 pb-24">
      {/* Search results header */}
      {isSearchActive && (
        <div className="flex items-center justify-between mb-6 bg-[#111116] border border-[#27272a] rounded-xl px-5 py-3">
          <div className="flex items-center gap-3 text-gray-300">
            <Search size={18} className="text-gray-500" />
            <span>
              Výsledky pro „<span className="text-white font-medium">{searchQuery}</span>"
              <span className="text-gray-500 ml-2">({filteredCatalog.length} {filteredCatalog.length === 1 ? 'výsledek' : filteredCatalog.length >= 2 && filteredCatalog.length <= 4 ? 'výsledky' : 'výsledků'})</span>
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            <X size={14} />
            Zrušit hledání
          </button>
        </div>
      )}

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
            label="Zhlédnuto"
            options={['Zhlédnuté', 'Nezhlédnuté']}
            selected={selectedWatched}
            onChange={setSelectedWatched}
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

      <div className="bg-[#0a0a0f] border border-[#27272a] rounded-xl shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[3fr_2fr] lg:grid-cols-[3fr_1fr_2fr_1fr_2fr] gap-4 items-center py-4 px-4 border-b border-[#27272a] text-xs font-semibold text-gray-400 tracking-wider bg-[#0a0a0f] rounded-t-xl">
          <div>TITULY</div>
          <div className="hidden lg:block">TYP</div>
          <div className="hidden lg:block">ŽÁNR</div>
          <div className="hidden lg:block">HODNOCENÍ</div>
          <div>DOSTUPNOST</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {displayedCatalog.length > 0 ? (
            displayedCatalog.map((title, index) => (
              <TitleCard
                key={`${title.type}-${title.id}`}
                title={title}
                onClick={(m) => setSelectedTitle(m)}
                className={index === displayedCatalog.length - 1 ? "rounded-b-xl border-b-0" : ""}
              />
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              {isSearchActive
                ? `Žádný film ani seriál odpovídající „${searchQuery}" nebyl nalezen.`
                : 'Nenalezeny žádné filmy odpovídající zadaným kritériím nebo nemáte aktivní předplatné.'
              }
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

      {selectedTitle && (
        <TitleDetail
          title={selectedTitle}
          onClose={() => setSelectedTitle(null)}
        />
      )}
    </div>
  );
}
