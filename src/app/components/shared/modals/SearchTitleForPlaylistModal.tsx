import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { catalog } from '../../../data/catalog';
import { Modal } from '../Modal';
import { useTitleName } from '../../../hooks/useTitleName';
import { useSearch } from '../../../hooks/useSearch';
import { SearchInput } from '../SearchInput';
import { TitleTile } from '../TitleTile';

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
        <div className="mb-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Hledat..."
            autoFocus
            iconSize={18}
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
                <TitleTile
                  key={`${title.type}-${title.id}`}
                  title={title}
                  size="sm"
                  isSelected={isSelected}
                  onClick={() => onToggleTitle(title.id.toString())}
                  action={isSelected ? <div className="pr-2"><Check size={18} className="text-[#dc2626]" /></div> : null}
                />
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
