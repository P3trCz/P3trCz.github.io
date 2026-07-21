/**
 * TitleGrid.tsx – hlavní stránka katalogu titulů
 *
 * Zobrazuje katalog všech titulů s filtrováním, vyhledáváním a stránkováním.
 * Stránkování se automaticky resetuje při změně filtrů/vyhledávání. 
 * Logika řazení:
 * - První kliknutí nastaví sloupec a výchozí směr (název=asc, ostatní=desc)
 * - Druhé kliknutí přepne směr
 * - Třetí kliknutí vrátí na žádné řazení (null)
 */
import { useState, useMemo } from 'react';
import { catalog, Title, ServiceType } from '../../../data/catalog';
import { TITLE_TYPES } from '../../../constants';
import { TitleCard } from './TitleCard';
import { TitleDetail } from '../../shared/TitleDetail';
import { Pagination } from '../../shared/Pagination';
import { Filter, RefreshCw, Search, X } from 'lucide-react';
import { FilterDropdown, AdvancedFilterState } from './FilterDropdown';
import { YearRangeFilterDropdown, YearRangeState } from './YearRangeFilterDropdown';
import { useAppStore } from '../../../store/useAppStore';
import { useSearch } from '../../../hooks/useSearch';
import { SortField, SortOrder, sortTitles } from '../../../utils/sortUtils';
import { SortableHeader } from '../../shared/SortableHeader';

export function TitleGrid() {
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<AdvancedFilterState>({ included: [], excluded: [] });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWatched, setSelectedWatched] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<YearRangeState>({ min: null, max: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  /**
   * Řazení sloupců: žádné → výchozí směr → opačný směr → žádné.
   * Pro 'title' je výchozí směr A→Z, pro ostatní hodnota.
   */
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
  // EMPTY_ARRAY je konstantní reference – zabrání zbytečným re-renderům komponent
  const EMPTY_ARRAY: string[] = [];
  const userSubscriptions = currentUser ? (subscriptionsState[currentUser.id] || EMPTY_ARRAY) : EMPTY_ARRAY;
  const watchHistory = useAppStore(state => state.watchHistory);
  const userWatchedTitles = currentUser ? (watchHistory[currentUser.id] || []).map(h => h.titleId) : EMPTY_ARRAY;
  const language = useAppStore(state => state.language);
  const searchQuery = useAppStore(state => state.searchQuery);
  const setSearchQuery = useAppStore(state => state.setSearchQuery);

  const isSearchActive = searchQuery.length >= 3;

  // Resetování stránkování při změně filtrů nebo vyhledávání
  const currentFiltersSig = JSON.stringify({ selectedServices, selectedGenres, selectedTypes, selectedWatched, selectedCountries, selectedYears, userSubscriptions, searchQuery });
  const [prevFiltersSig, setPrevFiltersSig] = useState(currentFiltersSig);

  if (currentFiltersSig !== prevFiltersSig) {
    setPrevFiltersSig(currentFiltersSig);
    setCurrentPage(1);
  }

  // Filmy dostupné na uživatelových službách
  const availableTitles = useMemo(() => {
    return catalog.filter(title => title.streaming_services && title.streaming_services.some(s => userSubscriptions.includes(s)));
  }, [userSubscriptions]);

  // Filtry nabízejí pouze vlastněné služby a žánry z dostupných filmů
  const allServices = useMemo(() => {
    const validServices = new Set(availableTitles.flatMap(m => m.streaming_services || []));
    return userSubscriptions.filter(s => validServices.has(s as ServiceType)).sort();
  }, [availableTitles, userSubscriptions]);

  const allGenres = useMemo(() => Array.from(new Set(availableTitles.flatMap(m => m.genres))).sort((a, b) => a.localeCompare(b, 'cs')), [availableTitles]);
  const allCountries = useMemo(() => Array.from(new Set(availableTitles.flatMap(m => m.origin_countries || []))).sort((a, b) => a.localeCompare(b, 'cs')), [availableTitles]);

  const searchedCatalog = useSearch(catalog, searchQuery, title => [title.title, title.title_en], { minQueryLength: 3 });

  const filteredCatalog = useMemo(() => {
    return searchedCatalog.filter(title => {
      // Základní filtr - titul musí být dostupný na některé ze služeb, které uživatel vlastní
      if (searchQuery.length < 3) {
        const hasSubscribedService = title.streaming_services && title.streaming_services.some(service => userSubscriptions.includes(service));
        if (!hasSubscribedService) return false;
      }

      // Filtr podle služeb
      if (selectedServices.length > 0) {
        const matchesService = title.streaming_services && title.streaming_services.some(service => selectedServices.includes(service));
        if (!matchesService) return false;
      }

      // Filtr podle žánrů
      if (selectedGenres.included.length > 0) {
        const matchesGenres = selectedGenres.included.every(genre => title.genres.includes(genre));
        if (!matchesGenres) return false;
      }
      if (selectedGenres.excluded.length > 0) {
        const hasExcluded = selectedGenres.excluded.some(genre => title.genres.includes(genre));
        if (hasExcluded) return false;
      }

      // Filtr podle typu
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(title.type)) return false;
      }

      // Filtr podle zhlédnutí
      if (selectedWatched.length > 0 && selectedWatched.length < 2) {
        const isWatched = userWatchedTitles.includes(title.id.toString());
        if (selectedWatched.includes('Zhlédnuté') && !isWatched) return false;
        if (selectedWatched.includes('Nezhlédnuté') && isWatched) return false;
      }

      // Filtr podle země původu
      if (selectedCountries.length > 0) {
        const matchesCountry = title.origin_countries && title.origin_countries.some(c => selectedCountries.includes(c));
        if (!matchesCountry) return false;
      }

      // Filtr podle roku vydání
      if (selectedYears.min !== null || selectedYears.max !== null) {
        const releaseYear = Number(title.release_year);
        if (!isNaN(releaseYear)) {
          if (selectedYears.min !== null && releaseYear < selectedYears.min) return false;
          if (selectedYears.max !== null && releaseYear > selectedYears.max) return false;
        }
      }

      return true;
    });
  }, [selectedServices, selectedGenres, selectedTypes, selectedWatched, selectedCountries, selectedYears, userSubscriptions, searchQuery, userWatchedTitles, searchedCatalog]);

  const sortedCatalog = useMemo(() => {
    return sortTitles(filteredCatalog, sortField, sortOrder, language);
  }, [filteredCatalog, sortField, sortOrder, language]);

  const displayedCatalog = sortedCatalog.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const hasAnyFilter = selectedServices.length > 0 || selectedGenres.included.length > 0 || selectedGenres.excluded.length > 0 || selectedTypes.length > 0 || selectedWatched.length > 0 || selectedCountries.length > 0 || selectedYears.min !== null || selectedYears.max !== null;

  const clearFilters = () => {
    setSelectedServices([]);
    setSelectedGenres({ included: [], excluded: [] });
    setSelectedTypes([]);
    setSelectedWatched([]);
    setSelectedCountries([]);
    setSelectedYears({ min: null, max: null });
  };

  return (
    <div className="p-8 pt-2 pb-24">
      {/* Hlavička pro výsledky vyhledávání */}
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
            options={[...TITLE_TYPES]}
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
          <FilterDropdown
            label="Země původu"
            options={allCountries}
            selected={selectedCountries}
            onChange={setSelectedCountries}
          />
          <YearRangeFilterDropdown
            label="Rok vydání"
            selected={selectedYears}
            onChange={setSelectedYears}
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
        {/* Hlavička tabulky */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr_2fr_1fr_2fr] gap-4 items-center py-4 px-4 border-b border-[#27272a] text-xs font-semibold text-gray-400 tracking-wider bg-[#0a0a0f] rounded-t-xl group">
          <SortableHeader label="TITULY" field="title" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} />
          <div className="hidden lg:block">TYP</div>
          <SortableHeader label="ŽÁNR" field="genres" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} className="hidden lg:flex" />
          <SortableHeader label="HODNOCENÍ" field="rating" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} className="hidden lg:flex" />
          <SortableHeader label="DOSTUPNOST" field="services" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} className="hidden lg:flex" />
        </div>

        {/* Tělo tabulky */}
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

      <div className="text-center text-sm text-gray-500 mt-4 mb-8">
        Naposledy aktualizováno: 21.07.2026 v 12:16
      </div>

      {selectedTitle && (
        <TitleDetail
          title={selectedTitle}
          onClose={() => setSelectedTitle(null)}
        />
      )}
    </div>
  );
}

