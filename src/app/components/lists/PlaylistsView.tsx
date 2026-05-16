import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { catalog, Movie } from '../../data/catalog';
import { MoreHorizontal, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { MovieCard } from '../catalog/MovieCard';
import { MovieDetail } from '../catalog/MovieDetail';

export function PlaylistsView() {
  const currentUser = useAppStore(state => state.currentUser);
  const playlistsState = useAppStore(state => state.playlists);
  const watchlistsState = useAppStore(state => state.watchlists);
  const renamePlaylist = useAppStore(state => state.renamePlaylist);
  const deletePlaylist = useAppStore(state => state.deletePlaylist);

  const playlists = currentUser ? (playlistsState[currentUser.id] || []) : [];
  const watchlist = currentUser ? (watchlistsState[currentUser.id] || []) : [];

  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const getMovies = (movieIds: string[]) => {
    return movieIds.map(id => catalog.find(m => m.id.toString() === id.toString())).filter(Boolean) as typeof catalog;
  };

  const handleRename = (id: string, currentName: string) => {
    const newName = window.prompt('Zadejte nový název seznamu:', currentName);
    if (newName && newName.trim() !== '') {
      renamePlaylist(id, newName.trim());
    }
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Opravdu chcete tento seznam smazat?')) {
      deletePlaylist(id);
    }
    setOpenMenuId(null);
  };

  const [displayedCount, setDisplayedCount] = useState(25);

  useEffect(() => {
    setDisplayedCount(25);
  }, [activePlaylistId]);

  // --- DETAIL SEZNAMU ---
  if (activePlaylistId) {
    const isWatchlist = activePlaylistId === '__watchlist__';
    const playlist = isWatchlist ? null : playlists.find(p => p.id === activePlaylistId);
    
    if (!isWatchlist && !playlist) {
      setActivePlaylistId(null);
      return null;
    }

    const title = isWatchlist ? 'Přehrát později' : playlist!.name;
    const allMovies = getMovies(isWatchlist ? watchlist : playlist!.movieIds);
    const displayedMovies = allMovies.slice(0, displayedCount);
    const hasMore = displayedCount < allMovies.length;

    const handleLoadMore = () => {
      setDisplayedCount(prev => Math.min(prev + 25, allMovies.length));
    };

    return (
      <div className="p-8 pb-24">
        <button 
          onClick={() => setActivePlaylistId(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Zpět na seznamy</span>
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">{title}</h1>

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
            {displayedMovies.length > 0 ? (
              displayedMovies.map((movie, index) => (
                <MovieCard 
                  key={`${movie.type}-${movie.id}`} 
                  movie={movie} 
                  onClick={(m) => setSelectedMovie(m)} 
                  className={index === displayedMovies.length - 1 ? "rounded-b-xl border-b-0" : ""}
                />
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                Tento seznam je prázdný.
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

  // --- PŘEHLED SEZNAMŮ (KRABIČKY) ---
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Moje seznamy</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Watchlist box */}
        <div 
          onClick={() => setActivePlaylistId('__watchlist__')}
          className="bg-[#111116] border border-[#27272a] rounded-xl p-6 hover:border-[#3f3f46] transition-colors cursor-pointer group flex flex-col"
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-white group-hover:text-[#dc2626] transition-colors">Přehrát později</h2>
          </div>
          
          <div className="flex-1 flex items-center justify-center border border-dashed border-[#27272a] rounded-lg py-8 mb-4">
            <span className="text-sm text-gray-500 font-medium">
              {watchlist.length === 0 ? 'Prázdný' : `${watchlist.length} filmů k přehrání`}
            </span>
          </div>

          <div className="text-sm text-gray-500 mt-auto">
            {watchlist.length} filmů
          </div>
        </div>

        {/* Custom playlists */}
        {playlists.map(pl => (
          <div 
            key={pl.id}
            onClick={() => setActivePlaylistId(pl.id)}
            className="bg-[#111116] border border-[#27272a] rounded-xl p-6 hover:border-[#3f3f46] transition-colors cursor-pointer group flex flex-col relative"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-white group-hover:text-[#dc2626] transition-colors truncate pr-8">{pl.name}</h2>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === pl.id ? null : pl.id);
                }}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <MoreHorizontal size={20} />
              </button>

              {openMenuId === pl.id && (
                <div 
                  ref={menuRef}
                  className="absolute top-12 right-6 w-48 bg-[#1c1c24] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-20"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRename(pl.id, pl.name); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-[#27272a] transition-colors"
                  >
                    <Edit2 size={16} /> Přejmenovat
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(pl.id); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} /> Odstranit
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center border border-dashed border-[#27272a] rounded-lg py-8 mb-4">
              <span className="text-sm text-gray-500 font-medium">
                {pl.movieIds.length === 0 ? 'Prázdný' : `${pl.movieIds.length} položek`}
              </span>
            </div>

            <div className="text-sm text-gray-500 mt-auto">
              {pl.movieIds.length} filmů
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
