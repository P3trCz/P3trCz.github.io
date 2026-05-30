/**
 * playlists.ts – Zustand modul pro správu seznamů
 *
 * Každý uživatel má vlastní kolekci playlistů uloženou v Record<userId, Playlist[]>.
 */
import { StateCreator } from 'zustand';
import { AppState, PlaylistsState, Playlist } from '../types';
import { INITIAL_PLAYLISTS } from '../../data/initialData';

/**
 * Porovná sady titleIds dvou playlistů (bez ohledu na pořadí) a zkontroluje shodu fromUserId.
 */
const isDuplicatePlaylist = (userPlaylists: Playlist[], playlistToCheck: Playlist, fromUserIdToCheck?: string) => {
  const sortedNewIds = JSON.stringify([...playlistToCheck.titleIds].sort());
  const hasIdenticalContent = userPlaylists.some(p =>
    JSON.stringify([...p.titleIds].sort()) === sortedNewIds &&
    p.fromUserId === fromUserIdToCheck
  );

  return hasIdenticalContent;
};

export const createPlaylistsModule: StateCreator<AppState, [], [], PlaylistsState> = (set, get) => ({
  playlists: INITIAL_PLAYLISTS,

  createPlaylist: (name) => {
    const userId = get().currentUser?.id;
    if (!userId) return;

    set((state) => {
      const userPlaylists = state.playlists[userId] || [];
      return {
        playlists: {
          ...state.playlists,
          // Nové ID je generováno jako náhodný base-36 řetězec
          [userId]: [
            ...userPlaylists,
            { id: Math.random().toString(36).substr(2, 9), name, titleIds: [] }
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

  addToPlaylist: (playlistId, titleId) => {
    const userId = get().currentUser?.id;
    if (!userId) return;

    set((state) => {
      const userPlaylists = state.playlists[userId] || [];
      const updatedPlaylists = userPlaylists.map(pl => {
        // Přidá titleId pouze pokud ještě v playlistu není
        if (pl.id === playlistId && !pl.titleIds.includes(titleId)) {
          return { ...pl, titleIds: [...pl.titleIds, titleId] };
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

  removeFromPlaylist: (playlistId, titleId) => {
    const userId = get().currentUser?.id;
    if (!userId) return;

    set((state) => {
      const userPlaylists = state.playlists[userId] || [];
      const updatedPlaylists = userPlaylists.map(pl => {
        if (pl.id === playlistId) {
          return { ...pl, titleIds: pl.titleIds.filter(id => id !== titleId) };
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

  importPlaylist: (playlist, fromUserId) => {
    const currentUser = get().currentUser;
    if (!currentUser) return false;

    const userPlaylists = get().playlists[currentUser.id] || [];
    // Pokud je autor playlistu sám uživatel, fromUserId se nezaznamenává
    const finalFromUserId = fromUserId === currentUser.id ? undefined : fromUserId;
    if (isDuplicatePlaylist(userPlaylists, playlist, finalFromUserId)) return false;

    set(state => {
      const newUserPlaylists = state.playlists[currentUser.id] || [];
      const newPlaylist: Playlist = {
        ...playlist,
        id: Math.random().toString(36).substr(2, 9),
        fromUserId: finalFromUserId
      };
      return {
        playlists: {
          ...state.playlists,
          [currentUser.id]: [...newUserPlaylists, newPlaylist]
        }
      };
    });
    return true;
  }
});
