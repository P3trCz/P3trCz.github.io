import React from 'react';
import { Download } from 'lucide-react';
import { Playlist } from '../../../store/useAppStore';
import { catalog, Movie } from '../../../data/catalog';
import { Modal } from '../../common/Modal';

type PreviewPlaylistModalProps = {
  playlist: Playlist;
  fromUsername: string;
  onClose: () => void;
  onViewMovie: (movie: Movie) => void;
  onSave: () => void;
};

export function PreviewPlaylistModal({ playlist, fromUsername, onClose, onViewMovie, onSave }: PreviewPlaylistModalProps) {
  const movieIds = playlist.movieIds;
  const movies = movieIds.map(id => catalog.find(m => m.id.toString() === id.toString())).filter(Boolean) as Movie[];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={playlist.name}
      maxWidth="max-w-2xl"
      zIndex="z-[80]"
      noPadding={true}
    >
      <div className="flex flex-col h-full">
        <div className="px-6 py-2 border-b border-[#27272a] bg-[#111116] flex items-center gap-2">
          <span className="text-xs text-gray-500">{movies.length} {movies.length === 1 ? 'položka' : movies.length >= 2 && movies.length <= 4 ? 'položky' : 'položek'}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-[#dc2626] font-medium">Od uživatele: {fromUsername}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0a0a0f]">
          {movies.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Tento seznam je prázdný.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {movies.map(movie => (
                <div
                  key={movie.id}
                  onClick={() => onViewMovie(movie)}
                  className="flex items-center gap-3 bg-[#1c1c24] p-3 rounded-xl border border-transparent hover:border-[#dc2626] cursor-pointer transition-all"
                >
                  <img src={movie.poster_url} alt={movie.title} className="w-12 h-18 object-cover rounded shadow-md" />
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{movie.title}</div>
                    <div className="text-xs text-gray-500">{movie.release_year} • {movie.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#27272a] flex justify-between gap-4 bg-[#111116]">
          <button onClick={onClose} className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Zavřít náhled
          </button>
          <button onClick={onSave} className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Download size={18} /> Uložit seznam
          </button>
        </div>
      </div>
    </Modal>
  );
}
