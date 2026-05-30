import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { catalog } from '../../../data/catalog';
import { Modal } from '../Modal';
import { useTitleName } from '../../../hooks/useTitleName';
import { useSearch } from '../../../hooks/useSearch';

type SearchTitleForPlaylistModalProps = {
  playlistName: string;
  currentTitleIds: string[];
  onClose: () => void;
  onToggleTitle: (titleId: string) => void;
};

export function SearchTitleForPlaylistModal({ playlistName, currentTitleIds, onClose, onToggleTitle }: SearchTitleForPlaylistModalProps) {
  const getTitleName = useTitleName();
  const [search, setSearch] = useState('');

  const searchedMovies = useSearch(catalog, search, title => [title.title, title.title_en], { minQueryLength: 3, returnEmptyIfBelowMinLength: true });
  const filteredMovies = searchedMovies.slice(0, 10);

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
                  className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-colors border ${
                    isSelected ? 'bg-[#dc2626]/10 border-[#dc2626]/30 hover:bg-[#dc2626]/20' : 'bg-[#1c1c24] border-[#27272a] hover:bg-[#27272a]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={title.poster_url || undefined} alt={getTitleName(title)} className="w-10 h-14 object-cover rounded shadow-sm" />
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{getTitleName(title)}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{title.release_year} • {title.type}</div>
                    </div>
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
            className="w-full btn-sm-cancel"
          >
            Hotovo
          </button>
        </div>
      </div>
    </Modal>
  );
}
