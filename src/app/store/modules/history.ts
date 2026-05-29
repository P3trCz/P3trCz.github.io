import { StateCreator } from 'zustand';
import { AppState, HistoryState, WatchHistoryItem } from '../types';
import { INITIAL_WATCH_HISTORY } from '../initialData';

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
        return {
          watchHistory: {
            ...state.watchHistory,
            [userId]: currentHistory.filter(h => h.titleId !== titleId)
          }
        };
      } else {
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
        const newHistory = [...currentHistory];
        const [existingItem] = newHistory.splice(existingIndex, 1);

        const updatedItem: WatchHistoryItem = {
          ...existingItem,
          watchedAt: watchedAt ?? existingItem.watchedAt,
          service: service,
          durationMinutes: durationMinutes,
          episodesWatched: episodesWatched !== undefined ? episodesWatched : existingItem.episodesWatched
        };

        newHistory.push(updatedItem);
        return { watchHistory: { ...state.watchHistory, [userId]: newHistory } };
      }

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
          [userId]: [...currentHistory, newHistoryItem]
        }
      };
    });
  }
});
