import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../data/usersDb';
import type { ServiceType } from '../data/catalog';

export type Playlist = {
  id: string;
  name: string;
  movieIds: string[];
};

export type WatchHistoryItem = {
  movieId: string;
  watchedAt: number; // timestamp
  service: ServiceType;
  durationMinutes: number;
};

type AppState = {
  currentUser: User | null;
  
  // Data per uživatel, klíčem je userId
  watchlists: Record<string, string[]>; // Pole movieIds
  playlists: Record<string, Playlist[]>;
  subscriptions: Record<string, ServiceType[]>;
  watchHistory: Record<string, WatchHistoryItem[]>;
  
  // Auth akce
  login: (user: User) => void;
  logout: () => void;
  
  // Akce seznamů
  createPlaylist: (name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  renamePlaylist: (playlistId: string, newName: string) => void;
  addToPlaylist: (playlistId: string, movieId: string) => void;
  removeFromPlaylist: (playlistId: string, movieId: string) => void;
  
  // Watchlist akce
  toggleWatchlist: (movieId: string) => void;
  
  // Subscriptions akce
  toggleSubscription: (service: ServiceType) => void;
  
  // History akce
  addToHistory: (movieId: string, service: ServiceType, durationMinutes: number) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      watchlists: {},
      playlists: {},
      subscriptions: {},
      watchHistory: {},
      
      login: (user) => set({ currentUser: user }),
      
      logout: () => set({ currentUser: null }),
      
      createPlaylist: (name) => {
        const userId = get().currentUser?.id;
        if (!userId) return;
        
        set((state) => {
          const userPlaylists = state.playlists[userId] || [];
          return {
            playlists: {
              ...state.playlists,
              [userId]: [
                ...userPlaylists,
                { id: Math.random().toString(36).substr(2, 9), name, movieIds: [] }
              ]
            }
          };
        });
      },

      deletePlaylist: (playlistId) => {
        const userId = get().currentUser?.id;
        if (!userId) return;

        set((state) => {
          const userPlaylists = state.playlists[userId] || [];
          return {
            playlists: {
              ...state.playlists,
              [userId]: userPlaylists.filter(pl => pl.id !== playlistId)
            }
          };
        });
      },

      renamePlaylist: (playlistId, newName) => {
        const userId = get().currentUser?.id;
        if (!userId) return;

        set((state) => {
          const userPlaylists = state.playlists[userId] || [];
          return {
            playlists: {
              ...state.playlists,
              [userId]: userPlaylists.map(pl => pl.id === playlistId ? { ...pl, name: newName } : pl)
            }
          };
        });
      },
      
      addToPlaylist: (playlistId, movieId) => {
        const userId = get().currentUser?.id;
        if (!userId) return;
        
        set((state) => {
          const userPlaylists = state.playlists[userId] || [];
          const updatedPlaylists = userPlaylists.map(pl => {
            if (pl.id === playlistId && !pl.movieIds.includes(movieId)) {
              return { ...pl, movieIds: [...pl.movieIds, movieId] };
            }
            return pl;
          });
          
          return {
            playlists: {
              ...state.playlists,
              [userId]: updatedPlaylists
            }
          };
        });
      },
      
      removeFromPlaylist: (playlistId, movieId) => {
        const userId = get().currentUser?.id;
        if (!userId) return;
        
        set((state) => {
          const userPlaylists = state.playlists[userId] || [];
          const updatedPlaylists = userPlaylists.map(pl => {
            if (pl.id === playlistId) {
              return { ...pl, movieIds: pl.movieIds.filter(id => id !== movieId) };
            }
            return pl;
          });
          
          return {
            playlists: {
              ...state.playlists,
              [userId]: updatedPlaylists
            }
          };
        });
      },
      
      toggleWatchlist: (movieId) => {
        const userId = get().currentUser?.id;
        if (!userId) return;
        
        set((state) => {
          const currentList = state.watchlists[userId] || [];
          const exists = currentList.includes(movieId);
          
          return {
            watchlists: {
              ...state.watchlists,
              [userId]: exists 
                ? currentList.filter(id => id !== movieId)
                : [...currentList, movieId]
            }
          };
        });
      },
      
      toggleSubscription: (service) => {
        const userId = get().currentUser?.id;
        if (!userId) return;
        
        set((state) => {
          const currentSubs = state.subscriptions[userId] || [];
          const exists = currentSubs.includes(service);
          
          return {
            subscriptions: {
              ...state.subscriptions,
              [userId]: exists
                ? currentSubs.filter(s => s !== service)
                : [...currentSubs, service]
            }
          };
        });
      },
      
      addToHistory: (movieId, service, durationMinutes) => {
        const userId = get().currentUser?.id;
        if (!userId) return;
        
        set((state) => {
          const currentHistory = state.watchHistory[userId] || [];
          return {
            watchHistory: {
              ...state.watchHistory,
              [userId]: [
                ...currentHistory,
                { movieId, watchedAt: Date.now(), service, durationMinutes }
              ]
            }
          };
        });
      }
    }),
    {
      name: 'streamhub-storage', // klíč v localStorage
    }
  )
);
