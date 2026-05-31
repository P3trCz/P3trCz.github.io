/**
 * Stats.tsx – stránka statistik sledování
 *
 * Zobrazuje statistiky zhlédnutého obsahu aktuálního uživatele za vybrané časové období.
 * Klíčová logika:
 * - getRangeStartMs(): převede zvolený rozsah (např. 'Měsíc') na Unix timestamp začátku
 * - processData(): projde historii sledování, agreguje data po službách a žánrech
 * - Koláčový graf (ServicePieChart) zobrazuje podíl streamovacích služeb na celkovém čase
 */
import { useState, useRef } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { catalog, ServiceType, serviceLogos } from '../../../data/catalog';
import { CustomTimeRangeModal } from '../../shared/modals/CustomTimeRangeModal';
import { StatsWatchedTitlesModal } from '../../shared/modals/StatsWatchedTitlesModal';
import { TitleDetail } from '../../shared/TitleDetail';
import { Title } from '../../../data/catalog';
import { X } from 'lucide-react';
import { TIME_RANGES, TITLE_FILTER_OPTIONS } from '../../../constants';
import { formatMinutes } from '../../../utils/formatUtils';
import { ServicePieChart } from './ServicePieChart';


export function Stats() {
  const [range, setRange] = useState('Měsíc');
  const currentUser = useAppStore(state => state.currentUser);
  const watchHistoryState = useAppStore(state => state.watchHistory);
  const history = currentUser ? (watchHistoryState[currentUser.id] || []) : [];
  const seenServicesRef = useRef<string[]>([]);   // Sleduje viděné služby napříč rendery
  const [customRange, setCustomRange] = useState<{ from: number, to: number } | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isWatchedTitlesModalOpen, setIsWatchedTitlesModalOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [genreFilter, setGenreFilter] = useState<'Film' | 'Seriál' | 'Vše'>('Vše');

  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  /**
   * Vrátí timestamp začátku daného časového rozsahu.
   */
  const getRangeStartMs = (): number => {
    switch (range) {
      case '5 minut': return now - 5 * 60 * 1000;
      case '10 minut': return now - 10 * 60 * 1000;
      case '1 hodina': return now - 60 * 60 * 1000;
      case '1 den': return now - 24 * 60 * 60 * 1000;
      case 'Týden': return now - 7 * 24 * 60 * 60 * 1000;
      case 'Měsíc': return now - 30 * 24 * 60 * 60 * 1000;
      case '3 měsíce': return now - 90 * 24 * 60 * 60 * 1000;
      case '6 měsíců': return now - 180 * 24 * 60 * 60 * 1000;
      case 'Rok': return now - 365 * 24 * 60 * 60 * 1000;
      case 'Celá doba': {
        const validHistory = history.filter(h => h.watchedAt > 0);
        return validHistory.length > 0 ? Math.min(...validHistory.map(h => h.watchedAt)) : now;
      }
      default: return 0;
    }
  };


  const getRangeDates = () => {
    const to = new Date();
    let from: Date;

    if (range === 'Vlastní rozsah' && customRange) {
      from = new Date(customRange.from);
      to.setTime(customRange.to);
    } else {
      from = new Date(getRangeStartMs());
    }

    const formatDate = (d: Date) => {
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${day}.${month}.${d.getFullYear()}`;
    };

    return { from: formatDate(from), to: formatDate(to) };
  };

  const formatRangeForSentence = (r: string, includeDates = true, includePreposition = false) => {
    const dates = getRangeDates();
    const suffix = includeDates ? ` (od ${dates.from} do ${dates.to})` : '';

    let base = r.toLowerCase();
    switch (r) {
      case '5 minut': base = 'posledních 5 minut'; break;
      case '10 minut': base = 'posledních 10 minut'; break;
      case '1 hodina': base = 'poslední hodinu'; break;
      case '1 den': base = 'poslední den'; break;
      case 'Týden': base = 'poslední týden'; break;
      case 'Měsíc': base = 'poslední měsíc'; break;
      case '3 měsíce': base = 'poslední 3 měsíce'; break;
      case '6 měsíců': base = 'posledních 6 měsíců'; break;
      case 'Rok': base = 'poslední rok'; break;
      case 'Celá doba': base = 'celou dobu'; break;
      case 'Vlastní rozsah':
        if (includeDates) return `od ${dates.from} do ${dates.to}`;
        else return includePreposition ? 'za vlastní období' : 'vlastní období';
    }
    const result = base + suffix;
    return includePreposition ? `za ${result}` : result;
  };

  const processData = () => {
    const serviceTime: Record<string, number> = {};
    const genreCountMovie: Record<string, number> = {};
    const genreCountSeries: Record<string, number> = {};
    const genreCountAll: Record<string, number> = {};
    let totalMinutes = 0;
    let totalFilms = 0;
    let totalWatchedSeries = 0;
    const watchedTitleObjects: Title[] = [];
    const seenTitleIds = new Set<string>();

    const filteredHistory = history.filter(item => {
      if (range === 'Celá doba') return true;
      if (range === 'Vlastní rozsah' && customRange) {
        return item.watchedAt >= customRange.from && item.watchedAt <= customRange.to;
      }
      return item.watchedAt >= getRangeStartMs();
    });

    // Pro každý záznam najde titul v katalogu a agreguje data po službách/žánrech
    filteredHistory.forEach(item => {
      const title = catalog.find(m => m.id.toString() === item.titleId);

      if (title) {
        if (!seenTitleIds.has(title.id.toString())) {
          seenTitleIds.add(title.id.toString());
          watchedTitleObjects.push(title);
        }

        // Zastavíme zpracování pro statistiky, pokud je služba 'Jiná'.
        if (item.service === 'Unknown') return;

        if (title.type === 'Film') {
          const svc = item.service as string;
          serviceTime[svc] = (serviceTime[svc] || 0) + item.durationMinutes;
          totalMinutes += item.durationMinutes;
          totalFilms++;
          title.genres.forEach(g => genreCountMovie[g] = (genreCountMovie[g] || 0) + 1);
        } else if (title.type === 'Seriál') {
          totalWatchedSeries++;
          title.genres.forEach(g => genreCountSeries[g] = (genreCountSeries[g] || 0) + 1);
        }
        title.genres.forEach(g => genreCountAll[g] = (genreCountAll[g] || 0) + 1);
      }
    });

    // Přidá nově viděné služby do registru na konec
    Object.keys(serviceTime).forEach(svc => {
      if (!seenServicesRef.current.includes(svc)) {
        seenServicesRef.current.push(svc);
      }
    });

    // Připraví data pro koláčový graf z registru
    const pieData = seenServicesRef.current.map(name => ({
      name,
      value: serviceTime[name] || 0
    }));

    // Nejsledovanější žánr – seřadí záznamy sestupně a vezme první
    const topGenreMovie = Object.entries(genreCountMovie).sort((a, b) => b[1] - a[1])[0];
    const topGenreSeries = Object.entries(genreCountSeries).sort((a, b) => b[1] - a[1])[0];
    const topGenreAll = Object.entries(genreCountAll).sort((a, b) => b[1] - a[1])[0];
    const topService = Object.entries(serviceTime).sort((a, b) => b[1] - a[1])[0];

    return {
      pieData,
      totalMinutes,
      topGenreMovie: topGenreMovie ? topGenreMovie[0] : 'N/A',
      topGenreCountMovie: topGenreMovie ? topGenreMovie[1] : 0,
      totalWatchedSeries,
      topGenreSeries: topGenreSeries ? topGenreSeries[0] : 'N/A',
      topGenreCountSeries: topGenreSeries ? topGenreSeries[1] : 0,
      topGenreAll: topGenreAll ? topGenreAll[0] : 'N/A',
      topGenreCountAll: topGenreAll ? topGenreAll[1] : 0,
      totalMovies: filteredHistory.filter(h => h.service !== 'Unknown').length,
      totalFilms,
      watchedTitles: watchedTitleObjects,
      filteredHistory,
      topService: topService ? topService[0] : 'N/A',
      topServiceMinutes: topService ? topService[1] : 0
    };
  };

  const stats = processData();

  return (
    <div className="p-8 pt-2">
      <h1 className="text-3xl font-bold text-white mb-8">Vaše statistiky sledování</h1>

      <div className="flex flex-wrap gap-2 mb-8 bg-[#111116] border border-[#27272a] rounded-xl p-1 w-fit">
        {TIME_RANGES.map(r => (
          <button
            key={r}
            onClick={() => {
              if (r === 'Vlastní rozsah') {
                setIsCustomModalOpen(true);
              } else {
                setRange(r);
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${range === r
              ? 'bg-[#2563eb] text-white'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            {r}
          </button>
        ))}
      </div>

      {history.length === 0 ? (
        <div className="bg-[#111116] border border-[#27272a] rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#1c1c24] flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Zatím žádná data</h2>
          <p className="text-gray-400 max-w-md">
            Graf nemůže být vygenerován, protože jste zatím nezhlédli žádný titul. Přejděte do katalogu a zhlédněte jakýkoliv titul.
          </p>
        </div>
      ) : stats.totalMovies === 0 ? (
        <div className="bg-[#111116] border border-[#27272a] rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#1c1c24] flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Žádná data za vybrané období</h2>
          <p className="text-gray-400 max-w-md">
            Za zvolené období ({formatRangeForSentence(range, true)}) nemáte zaznamenaná žádná data sledování. Zkuste zvolit delší časové období nebo zhlédnout jakýkoliv titul.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ServicePieChart
            pieData={stats.pieData}
            rangeLabel={formatRangeForSentence(range, true, true)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="panel-container-dark">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Celkový čas sledování filmů {formatRangeForSentence(range, false, true)}</h3>
              <div className="text-4xl font-bold text-white mb-2">{formatMinutes(stats.totalMinutes)}</div>
              <div className="text-sm text-gray-500">
                {stats.totalFilms} {stats.totalFilms === 1 ? 'zhlédnutý film' : stats.totalFilms >= 2 && stats.totalFilms <= 4 ? 'zhlédnuté filmy' : 'zhlédnutých filmů'}
              </div>
            </div>

            <div className="panel-container-dark">
              <div className="flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center gap-3 mb-3">
                <h3 className="text-sm font-medium text-gray-400">Nejsledovanější žánr</h3>
                <div className="flex bg-[#1c1c24] rounded-full p-0.5 border border-[#27272a]">
                  {TITLE_FILTER_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setGenreFilter(opt.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${genreFilter === opt.value ? 'bg-[#dc2626] text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-2xl font-bold text-white mb-4">
                {genreFilter === 'Film' ? stats.topGenreMovie : genreFilter === 'Seriál' ? stats.topGenreSeries : stats.topGenreAll}
              </div>

              <div className="w-full bg-[#27272a] rounded-full h-2">
                <div className="bg-[#2563eb] h-2 rounded-full" style={{ width: `${genreFilter === 'Film' ? (stats.totalFilms > 0 ? Math.round((stats.topGenreCountMovie / stats.totalFilms) * 100) : 0) : genreFilter === 'Seriál' ? (stats.totalWatchedSeries > 0 ? Math.round((stats.topGenreCountSeries / stats.totalWatchedSeries) * 100) : 0) : (stats.totalFilms + stats.totalWatchedSeries > 0 ? Math.round((stats.topGenreCountAll / (stats.totalFilms + stats.totalWatchedSeries)) * 100) : 0)}%` }}></div>
              </div>
              <div className="text-sm text-gray-500 mt-3 mb-6">
                {genreFilter === 'Film' ? (stats.totalFilms > 0 ? Math.round((stats.topGenreCountMovie / stats.totalFilms) * 100) : 0) : genreFilter === 'Seriál' ? (stats.totalWatchedSeries > 0 ? Math.round((stats.topGenreCountSeries / stats.totalWatchedSeries) * 100) : 0) : (stats.totalFilms + stats.totalWatchedSeries > 0 ? Math.round((stats.topGenreCountAll / (stats.totalFilms + stats.totalWatchedSeries)) * 100) : 0)} % ze všech zhlédnutých {genreFilter === 'Film' ? 'filmů' : genreFilter === 'Seriál' ? 'seriálů' : 'titulů'}
              </div>
              <button
                onClick={() => setIsWatchedTitlesModalOpen(true)}
                className="w-full btn-sm-cancel rounded-xl mt-auto"
              >
                Zobrazit zhlédnuté tituly
              </button>
            </div>

            <div className="panel-container-dark">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Nejpoužívanější služba (podle filmů)</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#1c1c24] border border-[#27272a] p-2 flex items-center justify-center overflow-hidden">
                  {stats.totalFilms === 0 ? (
                    <X size={24} className="text-gray-500" />
                  ) : (
                    <img
                      src={serviceLogos[stats.topService as ServiceType]}
                      alt={stats.topService}
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{stats.topService}</div>
                  <div className="text-sm text-gray-500">{formatMinutes(stats.topServiceMinutes)} sledování filmů</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isCustomModalOpen && (
        <CustomTimeRangeModal
          onClose={() => setIsCustomModalOpen(false)}
          onSave={(from, to) => {
            setCustomRange({ from, to });
            setRange('Vlastní rozsah');
            setIsCustomModalOpen(false);
          }}
        />
      )}
      {isWatchedTitlesModalOpen && (
        <StatsWatchedTitlesModal
          titles={stats.watchedTitles}
          history={stats.filteredHistory}
          rangeText={formatRangeForSentence(range, false)}
          onClose={() => setIsWatchedTitlesModalOpen(false)}
          onViewMovie={(title) => setSelectedTitle(title)}
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

