import React, { useState } from 'react';
import { Film, ArrowLeft } from 'lucide-react';
import { catalog } from '../../../data/catalog';
import { Modal } from '../Modal';
import { useTitleName } from '../../../hooks/useTitleName';
import { useSearch } from '../../../hooks/useSearch';
import { SearchInput } from '../SearchInput';

type RecommendMovieModalProps = {
  friendName: string;
  onClose: () => void;
  onRecommend: (titleId: string, message: string) => void;
};

export function RecommendMovieModal({ friendName, onClose, onRecommend }: RecommendMovieModalProps) {
  const getTitleName = useTitleName();
  const [search, setSearch] = useState('');
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const searchedMovies = useSearch(catalog, search, title => [title.title, title.title_en], { minQueryLength: 3, returnEmptyIfBelowMinLength: true });
  const filteredMovies = searchedMovies.slice(0, 10);

  const selectedTitle = selectedTitleId ? catalog.find(m => m.id.toString() === selectedTitleId.toString()) : null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Doporučit titul pro ${friendName}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {!selectedTitle ? (
          <div>
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
                {filteredMovies.map(title => (
                  <div
                    key={`${title.type}-${title.id}`}
                    onClick={() => setSelectedTitleId(title.id.toString())}
                    className="flex items-center gap-3 p-2 hover:bg-[#27272a] rounded-lg cursor-pointer transition-colors border border-transparent hover:border-[#3f3f46]"
                  >
                    <img src={title.poster_url} alt={getTitleName(title)} className="w-10 h-14 object-cover rounded" />
                    <div>
                      <div className="font-bold text-white text-sm">{getTitleName(title)}</div>
                      <div className="text-xs text-gray-400">{title.release_year} • {title.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              search.trim().length >= 3 && (
                <div className="text-sm text-gray-500 text-center py-6 break-words">
                  Žádný film ani seriál odpovídající „<span className="text-white font-medium break-all">{search}</span>“ nebyl nalezen.
                </div>
              )
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 bg-[#1c1c24] border border-[#27272a] p-3 rounded-xl mb-4">
              <img src={selectedTitle.poster_url} alt={selectedTitle.title} className="w-16 h-24 object-cover rounded shadow-md" />
              <div className="flex-1">
                <div className="font-bold text-white text-lg">{selectedTitle.title}</div>
                <div className="text-sm text-gray-400">{selectedTitle.release_year} • {selectedTitle.type}</div>
                <button onClick={() => setSelectedTitleId(null)} className="text-xs text-[#dc2626] hover:text-white mt-2 transition-colors flex items-center gap-1">
                  <ArrowLeft size={12} /> Zpět k vyhledávání
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Zpráva (nepovinné)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Koukni na to, je to pecka!"
                className="w-full form-input-dark h-24 resize-none"
              ></textarea>
            </div>

            <button
              onClick={() => onRecommend(selectedTitle.id.toString(), message)}
              className="w-full flex items-center justify-center gap-2 btn-action-primary mt-4"
            >
              <Film size={18} /> Odeslat doporučení
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

