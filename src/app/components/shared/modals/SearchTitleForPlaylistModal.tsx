// Modál pro vyhledání a přidání titulu do seznamu.
import { useState } from 'react';
import { Check } from 'lucide-react';
import { catalog } from '../../../data/catalog';
import { Modal } from '../Modal';
import { useAdvancedSearch } from '../../../hooks/useAdvancedSearch';
import { SearchInput } from '../SearchInput';
import { TitleTile } from '../TitleTile';

type SearchTitleForPlaylistModalProps = {
  playlistName: string;
  currentTitleIds: string[];
  onClose: () => void;
  onToggleTitle: (titleId: string) => void;
};

export function SearchTitleForPlaylistModal({ playlistName, currentTitleIds, onClose, onToggleTitle }: SearchTitleForPlaylistModalProps) {
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);


  const searchedMovies = useAdvancedSearch(catalog, search, { minQueryLength: 3, returnEmptyIfBelowMinLength: true });
  const filteredMovies = searchedMovies.slice(0, visibleCount);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(10);
  };

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
            onChange={handleSearchChange}
            placeholder="Hledat..."
            autoFocus
            iconSize={18}
          />
        </div>

        {search.length > 0 && search.length < 3 && (
          <div className="text-sm text-gray-500 text-center py-2">Zadejte alespoň 3 znaky.</div>
        )}

        {search.length === 0 && (
          <div className="text-xs text-gray-500 text-center px-4">
            Hledat můžete nejen podle názvu, ale i podle žánrů. Termíny oddělte čárkou nebo středníkem (např. <span className="text-gray-400">"Matrix, akční"</span> nebo <span className="text-gray-400">"komedie, romantický"</span>).
          </div>
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

            {searchedMovies.length > visibleCount && (
              <button
                onClick={() => setVisibleCount(v => v + 10)}
                className="w-full py-3 mt-2 text-sm font-medium text-gray-400 bg-[#27272a]/50 hover:bg-[#27272a] hover:text-white rounded-xl transition-colors"
              >
                Načíst dalších 10 titulů (zbývá {searchedMovies.length - visibleCount})
              </button>
            )}
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