import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { catalog, ServiceType } from '../../data/catalog';

const serviceColors: Record<string, string> = {
  'Netflix': '#e50914',
  'HBO Max': '#7c3aed',
  'Disney Plus': '#2563eb',
  'Amazon Prime Video': '#0891b2',
  'Apple TV': '#374151',
  'SkyShowtime': '#4f46e5',
  'Oneplay': '#db2777'
};

const timeRanges = ['Týden', 'Měsíc', '3 měsíce', '6 měsíců', 'Rok', 'Celá doba'];

export function StatsView() {
  const [range, setRange] = useState('Měsíc');
  const currentUser = useAppStore(state => state.currentUser);
  const watchHistoryState = useAppStore(state => state.watchHistory);
  const history = currentUser ? (watchHistoryState[currentUser.id] || []) : [];

  const formatTime = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h} h ${m} min`;
  };

  const normalizeService = (service: string) => {
    if (service === 'Disney+') return 'Disney Plus';
    if (service === 'Prime') return 'Amazon Prime Video';
    if (service === 'Apple TV+') return 'Apple TV';
    return service;
  };

  const processData = () => {
    const serviceTime: Record<string, number> = {};
    const genreCount: Record<string, number> = {};
    let totalMinutes = 0;

    history.forEach(item => {
      const normalizedSvc = normalizeService(item.service);
      serviceTime[normalizedSvc] = (serviceTime[normalizedSvc] || 0) + item.durationMinutes;
      totalMinutes += item.durationMinutes;

      const movie = catalog.find(m => m.id.toString() === item.movieId);
      if (movie) {
        movie.genres.forEach(g => {
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
      totalMovies: history.length,
      topService: topService ? topService[0] : 'N/A',
      topServiceMinutes: topService ? topService[1] : 0
    };
  };

  const stats = processData();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Vaše Statistiky Sledování</h1>

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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#111116] border border-[#27272a] rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-6">Podíl služeb na čase sledování za {range.toLowerCase()}</h2>

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
                      <Cell key={`cell-${index}`} fill={serviceColors[entry.name] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c1c24', borderColor: '#27272a', color: 'white', borderRadius: '8px' }}
                    itemStyle={{ color: 'white' }}
                    formatter={(value: any) => [formatTime(value), 'Čas']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {stats.pieData.map(entry => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: serviceColors[entry.name] }}></div>
                  <span className="text-sm text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="bg-[#111116] border border-[#27272a] rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Celkový čas sledování za {range.toLowerCase()}</h3>
              <div className="text-4xl font-bold text-white mb-2">{formatTime(stats.totalMinutes)}</div>
              <div className="text-sm text-gray-500">{stats.totalMovies} zhlédnutých filmů</div>
            </div>

            <div className="bg-[#111116] border border-[#27272a] rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Nejsledovanější žánr</h3>
              <div className="text-2xl font-bold text-white mb-4">{stats.topGenre}</div>

              <div className="w-full bg-[#27272a] rounded-full h-2">
                <div className="bg-[#2563eb] h-2 rounded-full" style={{ width: `${stats.totalMovies > 0 ? Math.round((stats.topGenreCount / stats.totalMovies) * 100) : 0}%` }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-2">{stats.totalMovies > 0 ? Math.round((stats.topGenreCount / stats.totalMovies) * 100) : 0} % ze všech zhlédnutých filmů</div>
            </div>

            <div className="bg-[#111116] border border-[#27272a] rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Nejpoužívanější služba</h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: serviceColors[stats.topService] || '#6b7280' }}
                >
                  {stats.topService.charAt(0)}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{stats.topService}</div>
                  <div className="text-sm text-gray-500">{formatTime(stats.topServiceMinutes)} sledování</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
