import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from './types';
import { createAuthModule } from './modules/auth';
import { createSearchModule } from './modules/search';
import { createPlaylistsModule } from './modules/playlists';
import { createWatchlistsModule } from './modules/watchlists';
import { createHistoryModule } from './modules/history';
import { createSubscriptionsModule } from './modules/subscriptions';
import { createFriendsModule } from './modules/friends';

export * from './types';

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createAuthModule(...a),
      ...createSearchModule(...a),
      ...createPlaylistsModule(...a),
      ...createWatchlistsModule(...a),
      ...createHistoryModule(...a),
      ...createSubscriptionsModule(...a),
      ...createFriendsModule(...a),
    }),
    {
      name: 'streamhub-storage',
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { searchQuery: _s, setSearchQuery: _sq, promptWatchedTitleId: _p, setPromptWatchedTitleId: _sp, ...rest } = state;
        return rest;
      },
    }
  )
);
