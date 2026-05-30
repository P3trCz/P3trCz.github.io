import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { catalog, ServiceType } from '../../../data/catalog';
import { Modal } from '../Modal';
import { useTitleName } from '../../../hooks/useTitleName';

export function MarkAsWatchedModal() {
  const getTitleName = useTitleName();
  const promptWatchedTitleId = useAppStore(state => state.promptWatchedTitleId);
  const setPromptWatchedTitleId = useAppStore(state => state.setPromptWatchedTitleId);
  const markAsWatched = useAppStore(state => state.markAsWatched);
  const toggleWatchedTitle = useAppStore(state => state.toggleWatchedTitle);
  const currentUser = useAppStore(state => state.currentUser);
  const watchHistory = useAppStore(state => state.watchHistory);

  const [date, setDate] = useState<string>('');
  const [service, setService] = useState<string>('Unknown');
  const [episodesWatched, setEpisodesWatched] = useState<number | ''>('');

  const title = catalog.find(t => t.id.toString() === promptWatchedTitleId);

  const currentHistory = currentUser ? (watchHistory[currentUser.id] || []) : [];
  const existingItem = currentHistory.find(h => h.titleId === promptWatchedTitleId);

  useEffect(() => {
    if (promptWatchedTitleId) {
      if (existingItem) {
        // Formátujeme existující timestamp na YYYY-MM-DD
        const d = new Date(existingItem.watchedAt || Date.now());
        const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDate(dateString);
        setService(existingItem.service);
        if (title?.type === 'Seriál' && existingItem.episodesWatched !== undefined) {
          setEpisodesWatched(existingItem.episodesWatched);
        } else if (title?.type === 'Seriál' && title.episodes) {
          setEpisodesWatched(0);
        }
      } else {
        // Dnešní datum
        const d = new Date();
        const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        setDate(dateString);
        setService('Unknown');
        if (title?.type === 'Seriál' && title.episodes) {
          setEpisodesWatched(0);
        }
      }
    }
  }, [promptWatchedTitleId, existingItem, title]);

  if (!promptWatchedTitleId || !title) return null;

  const handleSave = () => {
    let timestamp = Date.now();
    if (date) {
      const d = new Date();
      const todayString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      if (existingItem) {
        const existingD = new Date(existingItem.watchedAt || Date.now());
        const existingDateString = `${existingD.getFullYear()}-${String(existingD.getMonth() + 1).padStart(2, '0')}-${String(existingD.getDate()).padStart(2, '0')}`;
        
        if (date === existingDateString) {
          timestamp = existingItem.watchedAt;
        } else if (date === todayString) {
          timestamp = Date.now();
        } else {
          timestamp = new Date(date).getTime();
        }
      } else {
        if (date === todayString) {
          timestamp = Date.now();
        } else {
          timestamp = new Date(date).getTime();
        }
      }
    }
    const duration = (title.type === 'Film' && service !== 'Unknown') ? title.runtime : 0;
    let eps: number | undefined = undefined;
    
    if (title.type === 'Seriál' && title.episodes !== null) {
      eps = episodesWatched === '' ? undefined : Number(episodesWatched);
      if (eps !== undefined && eps > title.episodes) eps = title.episodes;
      if (eps !== undefined && eps < 0) eps = 0;
    }
    
    markAsWatched(promptWatchedTitleId, service as "Unknown" | ServiceType, duration, timestamp, eps);
    setPromptWatchedTitleId(null);
  };

  const handleRemove = () => {
    toggleWatchedTitle(promptWatchedTitleId);
    setPromptWatchedTitleId(null);
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => setPromptWatchedTitleId(null)}
      title="Detail zhlédnutí"
      zIndex="z-[999]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-[#1c1c24] p-3 rounded-xl border border-[#27272a]">
          <img src={title.poster_url} alt={getTitleName(title)} className="w-12 h-18 object-cover rounded shadow-md" />
          <div className="min-w-0">
            <div className="font-bold text-white text-sm truncate">{getTitleName(title)}</div>
            <div className="text-xs text-gray-500">{title.release_year} • {title.type}</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Kdy jste titul viděli?
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#1c1c24] border border-[#27272a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#dc2626] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Na jaké platformě?
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full bg-[#1c1c24] border border-[#27272a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#dc2626] transition-colors appearance-none"
          >
            <option value="Unknown">Jiná</option>
            {(title.streaming_services || []).map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {title.type === 'Seriál' && title.episodes !== null && (
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Zhlédnuté epizody (z celkových {title.episodes})
            </label>
            <input
              type="number"
              min={0}
              max={title.episodes}
              value={episodesWatched}
              onChange={(e) => setEpisodesWatched(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-[#1c1c24] border border-[#27272a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#dc2626] transition-colors"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          <button
            onClick={() => setPromptWatchedTitleId(null)}
            className="btn-action-cancel"
          >
            Zrušit
          </button>
          {existingItem && (
            <button
              onClick={handleRemove}
              className="btn-sm-primary border border-[#dc2626]/50 bg-transparent hover:bg-[#dc2626]/10 text-[#dc2626]"
            >
              Odebrat z historie
            </button>
          )}
          <button
            onClick={handleSave}
            className="btn-action-primary"
          >
            Uložit
          </button>
        </div>
      </div>
    </Modal>
  );
}
