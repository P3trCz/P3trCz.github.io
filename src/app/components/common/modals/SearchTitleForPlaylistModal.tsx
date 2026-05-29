import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { searchTitles } from '../../../utils/searchUtils';
import { Modal } from '../Modal';

type SearchTitleForPlaylistModalProps = {
  playlistName: string;
  currentTitleIds: string[];
  onClose: () => void;
  onToggleTitle: (titleId: string) => void;
};

export function SearchTitleForPlaylistModal({ playlistName, currentTitleIds, onClose, onToggleTitle }: SearchTitleForPlaylistModalProps) {
  const [search, setSearch] = useState('');

  const filteredMovies = searchTitles(search).slice(0, 10);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Přidat titul do ${playlistName}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Hledat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1c1c24] border border-[#27272a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#dc2626] transition-colors"
            autoFocus
          />
        </div>

        {search.length > 0 && search.length < 3 && (
          <div className="text-sm text-gray-500 text-center py-2">Zadejte alespoň 3 znaky.</div>
        )}

        {filteredMovies.length > 0 ? (
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredMovies.map(title => {
              const isSelected = currentTitleIds.includes(title.id.toString());
              return (
                <div
                  key={`${title.type}-${title.id}`}
                  onClick={() => onToggleTitle(title.id.toString())}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${
                    isSelected ? 'bg-[#dc2626]/10 border-[#dc2626] text-white' : 'border-transparent hover:bg-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <img src={title.poster_url || undefined} alt={title.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate">{title.title}</div>
                    <div className="text-xs text-gray-400">{title.release_year} • {title.type}</div>
                  </div>
                  {isSelected && (
                    <div className="pr-2">
                      <Check size={18} className="text-[#dc2626]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          search.trim().length >= 3 && (
            <div className="text-sm text-gray-500 text-center py-6 break-words">
              Žádný film ani seriál odpovídající „<span className="text-white font-medium break-all">{search}</span>“ nebyl nalezen.
            </div>
          )
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Hotovo
          </button>
        </div>
      </div>
    </Modal>
  );
}
