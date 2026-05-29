import React, { useState, useMemo, useEffect } from 'react';
import { catalog, Title, ServiceType } from '../../../data/catalog';
import { TitleCard } from './TitleCard';
import { TitleDetail } from './TitleDetail';
import { Pagination } from '../../Common/Pagination';
import { Filter, RefreshCw, Search, X } from 'lucide-react';
import { FilterDropdown, AdvancedFilterState } from './FilterDropdown';
import { useAppStore } from '../../../store/useAppStore';
import { searchTitles } from '../../../utils/searchUtils';
import { SortField, SortOrder, sortTitles } from '../../../utils/sortUtils';
import { SortableHeader } from '../../Common/SortableHeader';

export function TitleGrid() {
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<AdvancedFilterState>({ included: [], excluded: [] });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWatched, setSelectedWatched] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    setCurrentPage(1);
    if (sortField === field) {
      const isDefaultAsc = field === 'title';
      if (isDefaultAsc) {
        if (sortOrder === 'asc') setSortOrder('desc');
        else setSortField(null);
      } else {
        if (sortOrder === 'desc') setSortOrder('asc');
        else setSortField(null);
      }
    } else {
      setSortField(field);
      setSortOrder(field === 'title' ? 'asc' : 'desc');
    }
  };

  const currentUser = useAppStore(state => state.currentUser);
  const subscriptionsState = useAppStore(state => state.subscriptions);
  const EMPTY_ARRAY: string[] = [];
  const userSubscriptions = currentUser ? (subscriptionsState[currentUser.id] || EMPTY_ARRAY) : EMPTY_ARRAY;
  const watchHistory = useAppStore(state => state.watchHistory);
  const userWatchedTitles = currentUser ? (watchHistory[currentUser.id] || []).map(h => h.titleId) : EMPTY_ARRAY;
  const searchQuery = useAppStore(state => state.searchQuery);
  const setSearchQuery = useAppStore(state => state.setSearchQuery);

  const isSearchActive = searchQuery.length >= 3;

  // Reset pagination when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedServices, selectedGenres, selectedTypes, selectedWatched, userSubscriptions, searchQuery]);

  // Filmy dostupné na uživatelových službách
  const availableTitles = useMemo(() => {
    return catalog.filter(title => title.streaming_services && title.streaming_services.some(s => userSubscriptions.includes(s)));
  }, [userSubscriptions]);

  // Filtry nabízejí pouze vlastněné služby a žánry z dostupných filmů
  const allServices = useMemo(() => {
    const validServices = new Set(availableTitles.flatMap(m => m.streaming_services || []));
    return userSubscriptions.filter(s => validServices.has(s as ServiceType)).sort();
  }, [availableTitles, userSubscriptions]);

  const allGenres = useMemo(() => Array.from(new Set(availableTitles.flatMap(m => m.genres))).sort(), [availableTitles]);
  const allTypes = ['Film', 'Seriál'];

  const filteredCatalog = useMemo(() => {
    // 1. Získání základu (vyhledávání nebo celý katalog)
    const baseCatalog = isSearchActive ? searchTitles(searchQuery, catalog) : catalog;

    return baseCatalog.filter(title => {
      // 2. Základní filtr - film musí být dostupný na některé ze služeb, které uživatel vlastní
      if (!isSearchActive) {
        const hasSubscribedService = title.streaming_services && title.streaming_services.some(service => userSubscriptions.includes(service));
        if (!hasSubscribedService) return false;
      }

      // 3. Filtr podle služeb (OR logiky)
      if (selectedServices.length > 0) {
        const matchesService = title.streaming_services && title.streaming_services.some(service => selectedServices.includes(service));
        if (!matchesService) return false;
      }

      // 4. Filtr podle žánrů (AND logika pro zahrnuté, vyloučení)
      if (selectedGenres.included.length > 0) {
        const matchesGenres = selectedGenres.included.every(genre => title.genres.includes(genre));
        if (!matchesGenres) return false;
      }
      if (selectedGenres.excluded.length > 0) {
        const hasExcluded = selectedGenres.excluded.some(genre => title.genres.includes(genre));
        if (hasExcluded) return false;
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

  const sortedCatalog = useMemo(() => {
    return sortTitles(filteredCatalog, sortField, sortOrder);
  }, [filteredCatalog, sortField, sortOrder]);

  const displayedCatalog = sortedCatalog.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const hasAnyFilter = selectedServices.length > 0 || selectedGenres.included.length > 0 || selectedGenres.excluded.length > 0 || selectedTypes.length > 0 || selectedWatched.length > 0;

  const clearFilters = () => {
    setSelectedServices([]);
    setSelectedGenres({ included: [], excluded: [] });
    setSelectedTypes([]);
    setSelectedWatched([]);
  };

  return (
    <div className="p-8 pt-2 pb-24">
      {/* Search results header */}
      {isSearchActive && (
        <div className="flex items-center justify-between mb-6 bg-[#111116] border border-[#27272a] rounded-xl px-5 py-3">
          <div className="flex items-center gap-3 text-gray-300 break-words">
            <Search size={18} className="text-gray-500" />
            <span className="break-words">
              Výsledky pro „<span className="text-white font-medium break-all">{searchQuery}</span>"
              <span className="text-gray-500 ml-2">({filteredCatalog.length} {filteredCatalog.length === 1 ? 'výsledek' : filteredCatalog.length >= 2 && filteredCatalog.length <= 4 ? 'výsledky' : 'výsledků'})</span>
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium transition-colors shrink-0"
          >
            <X size={14} />
            Zrušit hledání
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <span>Filtrovat:</span>
          </div>
          <FilterDropdown
            label="Typ"
            options={allTypes}
            selected={selectedTypes}
            onChange={setSelectedTypes}
          />
          <FilterDropdown
            label="Zhlédnuto"
            options={['Zhlédnuté', 'Nezhlédnuté']}
            selected={selectedWatched}
            onChange={setSelectedWatched}
          />
          <FilterDropdown
            label="Služby"
            options={allServices}
            selected={selectedServices}
            onChange={setSelectedServices}
          />
          <FilterDropdown
            label="Žánr"
            options={allGenres}
            advancedState={selectedGenres}
            onAdvancedChange={setSelectedGenres}
          />
        </div>

        {hasAnyFilter && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium transition-colors self-start lg:self-auto"
          >
            <RefreshCw size={14} />
            Zrušit filtry
          </button>
        )}
      </div>

      <div className="bg-[#0a0a0f] border border-[#27272a] rounded-xl shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr_2fr_1fr_2fr] gap-4 items-center py-4 px-4 border-b border-[#27272a] text-xs font-semibold text-gray-400 tracking-wider bg-[#0a0a0f] rounded-t-xl group">
          <SortableHeader label="TITULY" field="title" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} />
          <div className="hidden lg:block">TYP</div>
          <SortableHeader label="ŽÁNR" field="genres" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} className="hidden lg:flex" />
          <SortableHeader label="HODNOCENÍ" field="rating" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} className="hidden lg:flex" />
          <SortableHeader label="DOSTUPNOST" field="services" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} className="hidden lg:flex" />
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {displayedCatalog.length > 0 ? (
            displayedCatalog.map((title, index) => (
              <TitleCard
                key={`${title.type}-${title.id}`}
                title={title}
                onClick={(m) => setSelectedTitle(m)}
                className={index === displayedCatalog.length - 1 ? "border-b-0" : ""}
              />
            ))
          ) : (
            <div className="py-12 text-center text-gray-500 px-4">
              {isSearchActive
                ? <span className="break-words">Žádný film ani seriál odpovídající „<span className="text-white font-medium break-all">{searchQuery}</span>“ nebyl nalezen.</span>
                : 'Nenalezeny žádné filmy odpovídající zadaným kritériím nebo nemáte aktivní předplatné.'
              }
            </div>
          )}
        </div>
      </div>

      {filteredCatalog.length > 0 && (
        <Pagination
          totalItems={filteredCatalog.length}
          itemsPerPage={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setPageSize}
        />
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

