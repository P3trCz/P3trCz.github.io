import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../data/usersDb';
import type { ServiceType } from '../data/catalog';
import {
  INITIAL_SUBSCRIPTIONS,
  INITIAL_FRIENDS,
  INITIAL_WATCH_HISTORY,
  INITIAL_PLAYLISTS,
  INITIAL_WATCHLISTS,
  INITIAL_MESSAGE_HISTORY,
  INITIAL_NOTIFICATIONS
} from './initialData';

export type Playlist = {
  id: string;
  name: string;
  titleIds: string[];
  fromUsername?: string; // Informace o tom, od koho seznam je
};

export type WatchHistoryItem = {
  titleId: string;
  watchedAt: number; // timestamp
  service: ServiceType | 'Unknown';
  durationMinutes: number;
};

export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_REQUEST_REJECTED'
  | 'SHARED_PLAYLIST'
  | 'RECOMMENDED_TITLE';

export type Notification = {
  id: string;
  type: NotificationType;
  fromUserId: string;
  fromUsername: string;
  timestamp: number;
  message?: string;
  playlist?: Playlist;
  titleId?: string;
};

export type ChatMessage = {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  timestamp: number;
  type: 'SHARED_PLAYLIST' | 'RECOMMENDED_TITLE';
  message?: string;
  playlist?: Playlist;
  titleId?: string;
};

type AppState = {
  currentUser: User | null;

  // Data per uživatel, klíčem je userId
  watchlists: Record<string, string[]>; // Pole titleIds
  // Zhlédnuté tituly a historie jsou nyní sjednocené pod watchHistory
  playlists: Record<string, Playlist[]>;
  subscriptions: Record<string, ServiceType[]>;
  watchHistory: Record<string, WatchHistoryItem[]>;
  friends: Record<string, string[]>; // Pole ID přátel
  notifications: Record<string, Notification[]>; // Notifikace pro uživatele
  messageHistory: Record<string, ChatMessage[]>; // Historie zpráv (pro oba uživatele)

  // Globální vyhledávání
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Auth akce
  login: (user: User) => void;
  logout: () => void;
  updateUsername: (newUsername: string) => void;

  // Akce seznamů
  createPlaylist: (name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  renamePlaylist: (playlistId: string, newName: string) => void;
  addToPlaylist: (playlistId: string, titleId: string) => void;
  removeFromPlaylist: (playlistId: string, titleId: string) => void;

  // Watchlist akce
  toggleWatchlist: (titleId: string) => void;
  toggleWatchedTitle: (titleId: string) => void;
  markAsWatched: (titleId: string, service?: ServiceType | 'Unknown', durationMinutes?: number) => void;

  // Subscriptions akce
  toggleSubscription: (service: ServiceType) => void;

  // History akce sjednocena s markAsWatched

  // Přátelé a Sdílení akce
  sendFriendRequest: (toUser: User) => void;
  acceptFriendRequest: (notificationId: string) => void;
  rejectFriendRequest: (notificationId: string) => void;
  removeFriend: (friendId: string) => void;
  sharePlaylist: (friendId: string, playlist: Playlist, message?: string) => void;
  recommendTitle: (friendId: string, titleId: string, message?: string) => void;
  importPlaylist: (playlist: Playlist, fromUsername: string) => boolean; // Vrací true při úspěchu
  dismissNotification: (notificationId: string) => void;
  saveSharedPlaylist: (notificationId: string) => void;
};

const isDuplicatePlaylist = (userPlaylists: Playlist[], playlistToCheck: Playlist, fromUsername?: string) => {
  const sortedNewIds = JSON.stringify([...playlistToCheck.titleIds].sort());
  const hasIdenticalContent = userPlaylists.some(p =>
    JSON.stringify([...p.titleIds].sort()) === sortedNewIds
  );

  const hasSameNameAndAuthor = userPlaylists.some(p =>
    p.name === playlistToCheck.name && p.fromUsername === fromUsername
  );

  return hasIdenticalContent || hasSameNameAndAuthor;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      watchlists: INITIAL_WATCHLISTS,
      playlists: INITIAL_PLAYLISTS,
      subscriptions: INITIAL_SUBSCRIPTIONS,
      watchHistory: INITIAL_WATCH_HISTORY,
      friends: INITIAL_FRIENDS,
      notifications: INITIAL_NOTIFICATIONS,
      messageHistory: INITIAL_MESSAGE_HISTORY,
      searchQuery: '',

      setSearchQuery: (query) => set({ searchQuery: query }),

      login: (user) => set({ currentUser: user }),

      logout: () => set({ currentUser: null, searchQuery: '' }),

      updateUsername: (newUsername) => set(state => ({
        currentUser: state.currentUser ? { ...state.currentUser, username: newUsername } : null
      })),

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

      toggleWatchlist: (titleId) => {
        const userId = get().currentUser?.id;
        if (!userId) return;

        set((state) => {
          const currentList = state.watchlists[userId] || [];
          const exists = currentList.includes(titleId);

          return {
            watchlists: {
              ...state.watchlists,
              [userId]: exists
                ? currentList.filter(id => id !== titleId)
                : [...currentList, titleId]
            }
          };
        });
      },

      toggleWatchedTitle: (titleId) => {
        const userId = get().currentUser?.id;
        if (!userId) return;

        set((state) => {
          const currentHistory = state.watchHistory[userId] || [];
          const exists = currentHistory.some(h => h.titleId === titleId);

          if (exists) {
            // Odebrat z historie
            return {
              watchHistory: {
                ...state.watchHistory,
                [userId]: currentHistory.filter(h => h.titleId !== titleId)
              }
            };
          } else {
            // Pokud neexistuje a zavoláme klasický toggle, znamená to, že to chce jen přidat
            // Toto by ideálně mělo jít přes markAsWatched, takže to zrovna zavoláme odsud:
            setTimeout(() => get().markAsWatched(titleId, 'Unknown'), 0);
            return state;
          }
        });
      },

      markAsWatched: (titleId, service = 'Unknown', durationMinutes = 0) => {
        const userId = get().currentUser?.id;
        if (!userId) return;

        set((state) => {
          const currentHistory = state.watchHistory[userId] || [];
          const existingIndex = currentHistory.findIndex(h => h.titleId === titleId);

          if (existingIndex >= 0) {
            // Pokud záznam už existuje
            if (service !== 'Unknown') {
              // Aktualizujeme službu (pokud to bylo Unknown a teď jsme klikli na přehrát)
              const newHistory = [...currentHistory];
              newHistory[existingIndex] = { ...newHistory[existingIndex], service, watchedAt: Date.now(), durationMinutes };
              return { watchHistory: { ...state.watchHistory, [userId]: newHistory } };
            }
            return state;
          }

          // Nový záznam
          return {
            watchHistory: {
              ...state.watchHistory,
              [userId]: [
                ...currentHistory,
                { titleId: titleId, watchedAt: service === 'Unknown' ? 0 : Date.now(), service, durationMinutes: service === 'Unknown' ? 0 : durationMinutes }
              ]
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
      sendFriendRequest: (toUser) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        set(state => {
          const toUserNotifs = state.notifications[toUser.id] || [];
          // Zjistíme, jestli už od nás nemá žádost
          if (toUserNotifs.some(n => n.type === 'FRIEND_REQUEST' && n.fromUserId === currentUser.id)) return state;

          const newNotif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'FRIEND_REQUEST',
            fromUserId: currentUser.id,
            fromUsername: currentUser.username,
            timestamp: Date.now()
          };

          return {
            notifications: {
              ...state.notifications,
              [toUser.id]: [newNotif, ...toUserNotifs]
            }
          };
        });
      },

      acceptFriendRequest: (notificationId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        set(state => {
          const currentNotifs = state.notifications[currentUser.id] || [];
          const notif = currentNotifs.find(n => n.id === notificationId);
          if (!notif || notif.type !== 'FRIEND_REQUEST') return state;

          const friendId = notif.fromUserId;
          const currentUserFriends = state.friends[currentUser.id] || [];
          const friendFriends = state.friends[friendId] || [];

          return {
            notifications: {
              ...state.notifications,
              [currentUser.id]: currentNotifs.filter(n => n.id !== notificationId)
            },
            friends: {
              ...state.friends,
              [currentUser.id]: [...new Set([...currentUserFriends, friendId])],
              [friendId]: [...new Set([...friendFriends, currentUser.id])]
            }
          };
        });
      },

      rejectFriendRequest: (notificationId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        set(state => {
          const currentNotifs = state.notifications[currentUser.id] || [];
          const notif = currentNotifs.find(n => n.id === notificationId);
          if (!notif || notif.type !== 'FRIEND_REQUEST') return state;

          const friendId = notif.fromUserId;
          const friendNotifs = state.notifications[friendId] || [];

          const rejectNotif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'FRIEND_REQUEST_REJECTED',
            fromUserId: currentUser.id,
            fromUsername: currentUser.username,
            timestamp: Date.now()
          };

          return {
            notifications: {
              ...state.notifications,
              [currentUser.id]: currentNotifs.filter(n => n.id !== notificationId),
              [friendId]: [rejectNotif, ...friendNotifs]
            }
          };
        });
      },

      removeFriend: (friendId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        set(state => {
          const currentUserFriends = state.friends[currentUser.id] || [];
          const friendFriends = state.friends[friendId] || [];

          return {
            friends: {
              ...state.friends,
              [currentUser.id]: currentUserFriends.filter(id => id !== friendId),
              [friendId]: friendFriends.filter(id => id !== currentUser.id)
            }
          };
        });
      },

      sharePlaylist: (friendId, playlist, message) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        set(state => {
          const friendNotifs = state.notifications[friendId] || [];
          const newNotif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'SHARED_PLAYLIST',
            fromUserId: currentUser.id,
            fromUsername: currentUser.username,
            timestamp: Date.now(),
            message,
            playlist
          };

          const newMessage: ChatMessage = {
            id: newNotif.id,
            fromUserId: currentUser.id,
            fromUsername: currentUser.username,
            toUserId: friendId,
            timestamp: newNotif.timestamp,
            type: 'SHARED_PLAYLIST',
            message,
            playlist
          };

          const currentUserHistory = state.messageHistory[currentUser.id] || [];
          const friendHistory = state.messageHistory[friendId] || [];

          return {
            notifications: {
              ...state.notifications,
              [friendId]: [newNotif, ...friendNotifs]
            },
            messageHistory: {
              ...state.messageHistory,
              [currentUser.id]: [newMessage, ...currentUserHistory],
              [friendId]: [newMessage, ...friendHistory]
            }
          };
        });
      },

      importPlaylist: (playlist, fromUsername) => {
        const currentUser = get().currentUser;
        if (!currentUser) return false;

        const userPlaylists = get().playlists[currentUser.id] || [];

        if (isDuplicatePlaylist(userPlaylists, playlist, fromUsername)) return false;

        set(state => {
          const newUserPlaylists = state.playlists[currentUser.id] || [];
          const newPlaylist: Playlist = {
            ...playlist,
            id: Math.random().toString(36).substr(2, 9),
            fromUsername // Uložíme autora
          };
          return {
            playlists: {
              ...state.playlists,
              [currentUser.id]: [...newUserPlaylists, newPlaylist]
            }
          };
        });
        return true;
      },

      recommendTitle: (friendId, titleId, message) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        set(state => {
          const friendNotifs = state.notifications[friendId] || [];
          const newNotif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'RECOMMENDED_TITLE',
            fromUserId: currentUser.id,
            fromUsername: currentUser.username,
            timestamp: Date.now(),
            message,
            titleId
          };

          const newMessage: ChatMessage = {
            id: newNotif.id,
            fromUserId: currentUser.id,
            fromUsername: currentUser.username,
            toUserId: friendId,
            timestamp: newNotif.timestamp,
            type: 'RECOMMENDED_TITLE',
            message,
            titleId
          };

          const currentUserHistory = state.messageHistory[currentUser.id] || [];
          const friendHistory = state.messageHistory[friendId] || [];

          return {
            notifications: {
              ...state.notifications,
              [friendId]: [newNotif, ...friendNotifs]
            },
            messageHistory: {
              ...state.messageHistory,
              [currentUser.id]: [newMessage, ...currentUserHistory],
              [friendId]: [newMessage, ...friendHistory]
            }
          };
        });
      },

      dismissNotification: (notificationId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        set(state => {
          const currentNotifs = state.notifications[currentUser.id] || [];
          return {
            notifications: {
              ...state.notifications,
              [currentUser.id]: currentNotifs.filter(n => n.id !== notificationId)
            }
          };
        });
      },

      saveSharedPlaylist: (notificationId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        set(state => {
          const currentNotifs = state.notifications[currentUser.id] || [];
          const notif = currentNotifs.find(n => n.id === notificationId);
          if (!notif || notif.type !== 'SHARED_PLAYLIST' || !notif.playlist) return state;

          const userPlaylists = state.playlists[currentUser.id] || [];

          if (isDuplicatePlaylist(userPlaylists, notif.playlist, notif.fromUsername)) {
            // Pokud je to duplicita, jen smažeme notifikaci
            return {
              notifications: {
                ...state.notifications,
                [currentUser.id]: currentNotifs.filter(n => n.id !== notificationId)
              }
            };
          }

          const newPlaylist: Playlist = {
            id: Math.random().toString(36).substr(2, 9),
            name: notif.playlist.name,
            titleIds: notif.playlist.titleIds,
            fromUsername: notif.fromUsername
          };

          return {
            playlists: {
              ...state.playlists,
              [currentUser.id]: [...userPlaylists, newPlaylist]
            },
            notifications: {
              ...state.notifications,
              [currentUser.id]: currentNotifs.filter(n => n.id !== notificationId)
            }
          };
        });
      }
    }),
    {
      name: 'streamhub-storage', // klíč v localStorage
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { searchQuery: _s, setSearchQuery: _sq, ...rest } = state;
        return rest;
      },
    }
  )
);


