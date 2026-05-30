import { StateCreator } from 'zustand';
import { AppState, WatchlistState } from '../types';
import { INITIAL_WATCHLISTS } from '../../data/initialData';
import { updateUserRecord, toggleItemInArray } from '../../utils/storeUtils';

export const createWatchlistsModule: StateCreator<AppState, [], [], WatchlistState> = (set, get) => ({
  watchlists: INITIAL_WATCHLISTS,
  toggleWatchlist: (titleId) => {
    const userId = get().currentUser?.id;
    if (!userId) return;

    set((state) => ({
      watchlists: updateUserRecord(state.watchlists, userId, (arr) => toggleItemInArray(arr, titleId))
    }));
  },
});
