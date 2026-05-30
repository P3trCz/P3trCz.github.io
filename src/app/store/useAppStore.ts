/**
 * useAppStore.ts
 *
 * Hlavní Zustand store aplikace. Je rozdělen do samostatných modulů,
 * každý modul spravuje jednu oblast dat (auth, seznamy, historie, přátelé atd.).
 * Všechny moduly jsou sloučeny do jediného sdíleného stavu pomocí spread operátoru.
 *
 * Stav je persistován do localStorage (klíč "streamhub-storage").
 * Do localStorage se neukládají dočasné hodnoty jako searchQuery nebo promptWatchedTitleId,
 * protože jejich ztráta při obnově stránky nevadí.
 */
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
    // Každý modul dostane přístup k celému stavu
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
      // Vyloučí přechodné hodnoty z persistence – ty se do localStorage neukládají
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { searchQuery: _s, setSearchQuery: _sq, promptWatchedTitleId: _p, setPromptWatchedTitleId: _sp, ...rest } = state;
        return rest;
      },
    }
  )
);
