// Modál pro doporučení titulu příteli – umožňuje vyhledat titul a odeslat doporučení vybranému příteli.
import { useState } from 'react';
import { Film, ArrowLeft } from 'lucide-react';
import { catalog } from '../../../data/catalog';
import { Modal } from '../Modal';
import { useSearch } from '../../../hooks/useSearch';
import { SearchInput } from '../SearchInput';
import { TitleTile } from '../TitleTile';

type RecommendMovieModalProps = {
  friendName: string;
  onClose: () => void;
  onRecommend: (titleId: string, message: string) => void;
};

export function RecommendMovieModal({ friendName, onClose, onRecommend }: RecommendMovieModalProps) {
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
                  <TitleTile
                    key={`${title.type}-${title.id}`}
                    title={title}
                    size="sm"
                    onClick={() => setSelectedTitleId(title.id.toString())}
                  />
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
            <div className="mb-4">
              <TitleTile 
                title={selectedTitle}
                action={
                  <button 
                    onClick={() => setSelectedTitleId(null)} 
                    className="px-3 py-1.5 rounded-lg bg-[#dc2626]/10 border border-[#dc2626] text-[#dc2626] hover:bg-[#dc2626] hover:text-white flex items-center gap-2 text-xs font-bold transition-colors"
                    title="Zpět k vyhledávání"
                  >
                    <ArrowLeft size={14} /> Zpět
                  </button>
                }
              />
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

