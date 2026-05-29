import React, { useState } from 'react';
import { Title } from '../../../data/catalog';
import { Modal } from '../Modal';
import { TitleTile } from '../../Pages/Catalog/TitleTile';

type Props = {
  titles: Title[];
  rangeText: string;
  onClose: () => void;
  onViewMovie: (title: Title) => void;
};

export function StatsWatchedTitlesModal({ titles, rangeText, onClose, onViewMovie }: Props) {
  const [displayedCount, setDisplayedCount] = useState(24);
  const [filter, setFilter] = useState<'Vše' | 'Filmy' | 'Seriály'>('Filmy');

  const filteredTitles = titles.filter(t => {
    if (filter === 'Vše') return true;
    if (filter === 'Filmy') return t.type === 'Film';
    if (filter === 'Seriály') return t.type === 'Seriál';
    return true;
  });

  const displayedTitles = filteredTitles.slice(0, displayedCount);
  const hasMore = displayedCount < filteredTitles.length;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Zhlédnuté tituly za ${rangeText}`}
      maxWidth="max-w-4xl"
      zIndex="z-[80]"
      noPadding={true}
    >
      <div className="flex flex-col h-[80vh]">
        <div className="px-6 py-3 border-b border-[#27272a] bg-[#111116] flex items-center justify-between">
          <div className="flex gap-2">
            {['Vše', 'Filmy', 'Seriály'].map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f as any); setDisplayedCount(24); }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === f ? 'bg-[#dc2626] text-white' : 'bg-[#1c1c24] border border-[#27272a] text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {filteredTitles.length} {filteredTitles.length === 1 ? 'titul' : filteredTitles.length >= 2 && filteredTitles.length <= 4 ? 'tituly' : 'titulů'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0a0a0f]">
          {filteredTitles.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Za toto období jste nezhlédli žádný titul.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedTitles.map(title => (
                  <TitleTile key={title.id} title={title} onClick={onViewMovie} />
                ))}
              </div>
              
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setDisplayedCount(prev => prev + 24)}
                    className="px-6 py-2 rounded-full border border-[#27272a] text-gray-400 hover:text-white hover:border-[#3f3f46] transition-colors"
                  >
                    Zobrazit dalších 24 titulů
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t border-[#27272a] flex justify-end bg-[#111116]">
          <button onClick={onClose} className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-6 py-2 rounded-xl font-medium transition-colors">
            Zavřít
          </button>
        </div>
      </div>
    </Modal>
  );
}
