import React from 'react';
import { Download } from 'lucide-react';
import { Playlist } from '../../../store/useAppStore';
import { catalog, Title } from '../../../data/catalog';
import { Modal } from '../Modal';

type PreviewPlaylistModalProps = {
  playlist: Playlist;
  fromUsername: string;
  onClose: () => void;
  onViewMovie: (title: Title) => void;
  onSave: () => void;
};

export function PreviewPlaylistModal({ playlist, fromUsername, onClose, onViewMovie, onSave }: PreviewPlaylistModalProps) {
  const movieIds = playlist.movieIds;
  const titles = movieIds.map(id => catalog.find(m => m.id.toString() === id.toString())).filter(Boolean) as Title[];

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
          <span className="text-xs text-gray-500">{titles.length} {titles.length === 1 ? 'položka' : titles.length >= 2 && titles.length <= 4 ? 'položky' : 'položek'}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-[#dc2626] font-medium">Od uživatele: {fromUsername}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0a0a0f]">
          {titles.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Tento seznam je prázdný.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {titles.map(title => (
                <div
                  key={title.id}
                  onClick={() => onViewMovie(title)}
                  className="flex items-center gap-3 bg-[#1c1c24] p-3 rounded-xl border border-transparent hover:border-[#dc2626] cursor-pointer transition-all"
                >
                  <img src={title.poster_url} alt={title.title} className="w-12 h-18 object-cover rounded shadow-md" />
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{title.title}</div>
                    <div className="text-xs text-gray-500">{title.release_year} • {title.type}</div>
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
          <button onClick={onSave} className="flex-1 btn-action-primary flex items-center justify-center gap-2">
            <Download size={18} /> Uložit seznam
          </button>
        </div>
      </div>
    </Modal>
  );
}
