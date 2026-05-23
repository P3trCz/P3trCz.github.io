import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { catalog, ServiceType, serviceLogos, serviceColors } from '../../data/catalog';

const timeRanges = ['10 minut', 'Týden', 'Měsíc', '3 měsíce', '6 měsíců', 'Rok', 'Celá doba'];

export function Stats() {
  const [range, setRange] = useState('Měsíc');
  const currentUser = useAppStore(state => state.currentUser);
  const watchHistoryState = useAppStore(state => state.watchHistory);
  const history = currentUser ? (watchHistoryState[currentUser.id] || []) : [];

  const formatTime = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h} h ${m} min`;
  };

  const formatRangeForSentence = (r: string) => {
    switch (r) {
      case '10 minut': return 'posledních 10 minut';
      case 'Týden': return 'poslední týden';
      case 'Měsíc': return 'poslední měsíc';
      case '3 měsíce': return 'poslední 3 měsíce';
      case '6 měsíců': return 'posledních 6 měsíců';
      case 'Rok': return 'poslední rok';
      case 'Celá doba': return 'celou dobu';
      default: return r.toLowerCase();
    }
  };

  const processData = () => {
    const serviceTime: Record<string, number> = {};
    const genreCount: Record<string, number> = {};
    let totalMinutes = 0;
    let totalFilms = 0;

    // Filtrování historie na základě vybraného časového období
    const filteredHistory = history.filter(item => {
      if (range === 'Celá doba') return true;
      const now = Date.now();
      const diff = now - item.watchedAt;
      
      switch (range) {
        case '10 minut':
          return diff <= 10 * 60 * 1000;
        case 'Týden':
          return diff <= 7 * 24 * 60 * 60 * 1000;
        case 'Měsíc':
          return diff <= 30 * 24 * 60 * 60 * 1000;
        case '3 měsíce':
          return diff <= 90 * 24 * 60 * 60 * 1000;
        case '6 měsíců':
          return diff <= 180 * 24 * 60 * 60 * 1000;
        case 'Rok':
          return diff <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    filteredHistory.forEach(item => {
      if (item.service === 'Unknown') return; // Ignorovat u všeho
      
      const title = catalog.find(m => m.id.toString() === item.movieId);

      if (title) {
        if (title.type === 'Film') {
          const svc = item.service as string;
          serviceTime[svc] = (serviceTime[svc] || 0) + item.durationMinutes;
          totalMinutes += item.durationMinutes;
          totalFilms++;
        }

        title.genres.forEach(g => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        });
      }
    });

    const pieData = Object.entries(serviceTime).map(([name, value]) => ({
      name,
      value
    }));

    const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0];
    const topService = Object.entries(serviceTime).sort((a, b) => b[1] - a[1])[0];

    return {
      pieData,
      totalMinutes,
      topGenre: topGenre ? topGenre[0] : 'N/A',
      topGenreCount: topGenre ? topGenre[1] : 0,
      totalMovies: filteredHistory.length,
      totalFilms,
      topService: topService ? topService[0] : 'N/A',
      topServiceMinutes: topService ? topService[1] : 0
    };
  };

  const stats = processData();

  return (
    <div className="p-8 pt-2">
      <h1 className="text-3xl font-bold text-white mb-8">Vaše statistiky sledování</h1>

      <div className="flex flex-wrap gap-2 mb-8 bg-[#111116] border border-[#27272a] rounded-xl p-1 w-fit">
        {timeRanges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
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
            Graf nemůže být vygenerován, protože jste zatím nezhlédli žádný film. Přejděte do katalogu a spusťte přehrávání — statistiky se začnou automaticky zaznamenávat.
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
            Za zvolené období ({formatRangeForSentence(range)}) nemáte zaznamenaná žádná data sledování. Zkuste zvolit delší časové období nebo zhlédnout nějaký film.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 panel-container-dark">
            <h2 className="text-lg font-medium text-white mb-6">Podíl služeb na čase sledování filmů za {formatRangeForSentence(range)}</h2>

            <div className="h-80 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={serviceColors[entry.name as ServiceType] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c1c24', borderColor: '#27272a', color: 'white', borderRadius: '8px' }}
                    itemStyle={{ color: 'white' }}
                    formatter={(value: unknown) => [formatTime(Number(value)), 'Čas']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {stats.pieData.map(entry => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: serviceColors[entry.name as ServiceType] }}></div>
                  <span className="text-sm text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="panel-container-dark">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Celkový čas sledování filmů za {formatRangeForSentence(range)}</h3>
              <div className="text-4xl font-bold text-white mb-2">{formatTime(stats.totalMinutes)}</div>
              <div className="text-sm text-gray-500">
                {stats.totalFilms} {stats.totalFilms === 1 ? 'zhlédnutý film' : stats.totalFilms >= 2 && stats.totalFilms <= 4 ? 'zhlédnuté filmy' : 'zhlédnutých filmů'}
              </div>
            </div>

            <div className="panel-container-dark">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Nejsledovanější žánr</h3>
              <div className="text-2xl font-bold text-white mb-4">{stats.topGenre}</div>

              <div className="w-full bg-[#27272a] rounded-full h-2">
                <div className="bg-[#2563eb] h-2 rounded-full" style={{ width: `${stats.totalMovies > 0 ? Math.round((stats.topGenreCount / stats.totalMovies) * 100) : 0}%` }}></div>
              </div>
              <div className="text-sm text-gray-500 mt-3">{stats.totalMovies > 0 ? Math.round((stats.topGenreCount / stats.totalMovies) * 100) : 0} % ze všech zhlédnutých filmů a seriálů</div>
            </div>

            <div className="panel-container-dark">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Nejpoužívanější služba (podle filmů)</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#1c1c24] border border-[#27272a] p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={serviceLogos[stats.topService as ServiceType]}
                    alt={stats.topService}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{stats.topService}</div>
                  <div className="text-sm text-gray-500">{formatTime(stats.topServiceMinutes)} sledování filmů</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
