/**
 * history.ts – Zustand modul pro historii sledování
 *
 * Spravuje zhlédnuté tituly uživatele. Záznamy jsou ukládány jako WatchHistoryItem
 * a jsou vždy seřazeny tak, že nejstarší tituly jsou první a nejnovější poslední.
 *
 * toggleWatchedTitle: přidá nebo odebere titul z historie. Přidání otevírá MarkAsWatchedModal.
 * markAsWatched: přidá nový záznam nebo aktualizuje existující.
 */
import { StateCreator } from 'zustand';
import { AppState, HistoryState, WatchHistoryItem } from '../types';
import { INITIAL_WATCH_HISTORY } from '../../data/initialData';

export const createHistoryModule: StateCreator<AppState, [], [], HistoryState> = (set, get) => ({
  watchHistory: INITIAL_WATCH_HISTORY,
  promptWatchedTitleId: null,

  setPromptWatchedTitleId: (titleId) => set({ promptWatchedTitleId: titleId }),

  toggleWatchedTitle: (titleId) => {
    const userId = get().currentUser?.id;
    if (!userId) return;

    set((state) => {
      const currentHistory = state.watchHistory[userId] || [];
      const exists = currentHistory.some(h => h.titleId === titleId);

      if (exists) {
        // Titul už je v historii - odebere se.
        return {
          watchHistory: {
            ...state.watchHistory,
            [userId]: currentHistory.filter(h => h.titleId !== titleId)
          }
        };
      } else {
        // Titul ještě není v historii - otevře se modal pro zadání detailů.
        // setTimeout(0) zajistí, že se set() dokončí dřív než se spustí markAsWatched.
        setTimeout(() => get().markAsWatched(titleId, 'Unknown'), 0);
        return state;
      }
    });
  },

  markAsWatched: (titleId, service = 'Unknown', durationMinutes = 0, watchedAt?: number, episodesWatched?: number) => {
    const userId = get().currentUser?.id;
    if (!userId) return;

    set((state) => {
      const currentHistory = state.watchHistory[userId] || [];
      const existingIndex = currentHistory.findIndex(h => h.titleId === titleId);

      if (existingIndex >= 0) {
        // Aktualizace existujícího záznamu
        const newHistory = [...currentHistory];
        const [existingItem] = newHistory.splice(existingIndex, 1);

        const updatedItem: WatchHistoryItem = {
          ...existingItem,
          // watchedAt se změní pokud uživatel zadal datum
          watchedAt: watchedAt ?? existingItem.watchedAt,
          service: service,
          durationMinutes: durationMinutes,
          // episodesWatched se změní pokud je explicitně předáno
          episodesWatched: episodesWatched !== undefined ? episodesWatched : existingItem.episodesWatched
        };

        newHistory.push(updatedItem);
        // Seřadit vzestupně dle data zhlédnutí
        return { watchHistory: { ...state.watchHistory, [userId]: newHistory.sort((a, b) => a.watchedAt - b.watchedAt) } };
      }

      // Nový záznam – přidat na konec a seřadit
      const newHistoryItem: WatchHistoryItem = {
        titleId,
        watchedAt: watchedAt ?? Date.now(),
        service,
        durationMinutes,
        episodesWatched
      };

      return {
        watchHistory: {
          ...state.watchHistory,
          [userId]: [...currentHistory, newHistoryItem].sort((a, b) => a.watchedAt - b.watchedAt)
        }
      };
    });
  }
});
