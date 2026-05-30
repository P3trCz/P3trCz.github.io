/**
 * friends.ts – Zustand modul pro správu přátel, oznámení a zpráv
 *
 * Přátelství jsou obousměrná: při přijetí žádosti se přidá každý do seznamu přátel toho druhého.
 * Oznámení slouží jako inbox – žádosti o přátelství, sdílené playlisty, doporučení titulů.
 * Zprávy jsou kopírovány do historie obou účastníků – každý tak vidí celou konverzaci.
 *
 * Klíčová logika sendFriendRequest:
 * - Pokud nám druhý uživatel už poslal žádost, automaticky ji přijmeme.
 * - Pokud jsme žádost už odeslali my, vrátíme ALREADY_SENT.
 * - Jinak vytvoříme notifikaci v inboxu cílového uživatele.
 */
import { StateCreator } from 'zustand';
import { AppState, FriendsState, Notification, ChatMessage, Playlist } from '../types';
import { INITIAL_FRIENDS, INITIAL_NOTIFICATIONS, INITIAL_MESSAGE_HISTORY } from '../../data/initialData';

/**
 * Porovná titleIds dvou playlistů a fromUserId.
 * Zabraňuje ukládání duplicitních sdílených seznamů.
 */
const isDuplicatePlaylist = (userPlaylists: Playlist[], playlistToCheck: Playlist, fromUserIdToCheck?: string) => {
  const sortedNewIds = JSON.stringify([...playlistToCheck.titleIds].sort());
  return userPlaylists.some(p =>
    JSON.stringify([...p.titleIds].sort()) === sortedNewIds &&
    p.fromUserId === fromUserIdToCheck
  );
};

export const createFriendsModule: StateCreator<AppState, [], [], FriendsState> = (set, get) => ({
  friends: INITIAL_FRIENDS,
  notifications: INITIAL_NOTIFICATIONS,
  messageHistory: INITIAL_MESSAGE_HISTORY,

  sendFriendRequest: (toUser) => {
    const currentUser = get().currentUser;
    if (!currentUser) return 'SUCCESS';

    const myFriends = get().friends[currentUser.id] || [];
    if (myFriends.includes(toUser.id)) return 'ALREADY_FRIENDS';

    const myNotifs = get().notifications[currentUser.id] || [];
    const existingReq = myNotifs.find(n => n.type === 'FRIEND_REQUEST' && n.fromUserId === toUser.id);
    if (existingReq) {
      get().acceptFriendRequest(existingReq.id);
      return 'SUCCESS';
    }

    const toUserNotifs = get().notifications[toUser.id] || [];
    if (toUserNotifs.some(n => n.type === 'FRIEND_REQUEST' && n.fromUserId === currentUser.id)) {
      return 'ALREADY_SENT';
    }

    set(state => {
      const newNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'FRIEND_REQUEST',
        fromUserId: currentUser.id,
        timestamp: Date.now()
      };

      return {
        notifications: {
          ...state.notifications,
          [toUser.id]: [newNotif, ...toUserNotifs]
        }
      };
    });

    return 'SUCCESS';
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
          // Odeber notifikaci z inboxu přijímatele
          [currentUser.id]: currentNotifs.filter(n => n.id !== notificationId),
          // Odeber také případnou žádost od nás
          [friendId]: (state.notifications[friendId] || []).filter(n =>
            !(n.type === 'FRIEND_REQUEST' && n.fromUserId === currentUser.id)
          )
        },
        friends: {
          ...state.friends,
          // Set zabrání duplicitním záznamům při opakovaném přijetí
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
        timestamp: Date.now(),
        message,
        playlist
      };

      // Zpráva je identická s notifikací, ale ukládá se zvlášť do messageHistory
      const newMessage: ChatMessage = {
        id: newNotif.id,
        fromUserId: currentUser.id,
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
          // Zpráva se uloží do historie obou uživatelů
          [currentUser.id]: [newMessage, ...currentUserHistory],
          [friendId]: [newMessage, ...friendHistory]
        }
      };
    });
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
        timestamp: Date.now(),
        message,
        titleId
      };

      // Stejný princip jako sharePlaylist
      const newMessage: ChatMessage = {
        id: newNotif.id,
        fromUserId: currentUser.id,
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
      // Pokud je odesilatel sám uživatel, neukládáme fromUserId
      const finalFromUserId = notif.fromUserId === currentUser.id ? undefined : notif.fromUserId;

      if (isDuplicatePlaylist(userPlaylists, notif.playlist, finalFromUserId)) {
        // Odstraníme notifikaci z inboxu
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
        fromUserId: finalFromUserId
      };

      return {
        playlists: {
          ...state.playlists,
          [currentUser.id]: [...userPlaylists, newPlaylist]
        },
        // Po uložení playlist odstraníme notifikaci z inboxu
        notifications: {
          ...state.notifications,
          [currentUser.id]: currentNotifs.filter(n => n.id !== notificationId)
        }
      };
    });
  }
});
