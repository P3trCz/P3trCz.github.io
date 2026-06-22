/**
 * types.ts
 * 
 * Datové typy (Playlist, WatchHistoryItem, Notification, ChatMessage) popisují strukturu dat.
 * State typy popisují jak data, tak akce (metody) pro každý modul.
 * AppState je průnik všech modulů – výsledný typ celého storu.
 */
import type { User } from '../data/usersDb';
import type { ServiceType } from '../data/catalog';

export type Playlist = {
  id: string;
  name: string;
  titleIds: string[];
  fromUserId?: string; // Pokud je seznam sdílený od přítele
};

export type WatchHistoryItem = {
  titleId: string;
  watchedAt: number; // Timestamp v milisekundách
  service: string;
  durationMinutes: number;
  episodesWatched?: number; // Počet zhlédnutých epizod
};

/** Typy oznámení */
export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_REQUEST_REJECTED'
  | 'SHARED_PLAYLIST'
  | 'RECOMMENDED_TITLE';

export type Notification = {
  id: string;
  type: NotificationType;
  fromUserId: string;
  timestamp: number;
  message?: string;
  playlist?: Playlist;
  titleId?: string;
};

/** Zpráva v historii konverzace mezi dvěma uživateli */
export type ChatMessage = {
  id: string;
  fromUserId: string;
  toUserId: string;
  timestamp: number;
  type: 'SHARED_PLAYLIST' | 'RECOMMENDED_TITLE';
  message?: string;
  playlist?: Playlist;
  titleId?: string;
};

// Store state typy

export type AuthState = {
  currentUser: User | null;
  language: 'cs' | 'en';
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (lang: 'cs' | 'en') => void;
  updateUsername: (newUsername: string) => void;
};

export type SearchState = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export type PlaylistsState = {
  playlists: Record<string, Playlist[]>;
  createPlaylist: (name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  renamePlaylist: (playlistId: string, newName: string) => void;
  addToPlaylist: (playlistId: string, titleId: string) => void;
  removeFromPlaylist: (playlistId: string, titleId: string) => void;
  importPlaylist: (playlist: Playlist, fromUserId?: string) => boolean; // Uloží cizí playlist do vlastních; vrátí false při detekci duplikátu
};

export type WatchlistState = {
  watchlists: Record<string, string[]>; // Tituly označené "Přehrát později"
  toggleWatchlist: (titleId: string) => void;
};

export type HistoryState = {
  watchHistory: Record<string, WatchHistoryItem[]>;
  promptWatchedTitleId: string | null;
  setPromptWatchedTitleId: (titleId: string | null) => void;
  toggleWatchedTitle: (titleId: string) => void;
  markAsWatched: (titleId: string, service?: ServiceType | 'Unknown', durationMinutes?: number, watchedAt?: number, episodesWatched?: number) => void;
};

export type SubscriptionsState = {
  subscriptions: Record<string, ServiceType[]>; // Aktivní streamovací služby
  toggleSubscription: (service: ServiceType) => void;
};

export type FriendsState = {
  friends: Record<string, string[]>;
  notifications: Record<string, Notification[]>;
  messageHistory: Record<string, ChatMessage[]>;
  sendFriendRequest: (toUser: User) => 'SUCCESS' | 'ALREADY_SENT' | 'ALREADY_FRIENDS';
  acceptFriendRequest: (notificationId: string) => void;
  rejectFriendRequest: (notificationId: string) => void;
  removeFriend: (friendId: string) => void;
  sharePlaylist: (friendId: string, playlist: Playlist, message?: string) => void;
  recommendTitle: (friendId: string, titleId: string, message?: string) => void;
  dismissNotification: (notificationId: string) => void;
  saveSharedPlaylist: (notificationId: string) => void;
};

export type ServiceCredentialsData = {
  username?: string;
  password?: string;
};

export type ServicesCredentialsState = {
  servicesCredentials: Record<string, Partial<Record<ServiceType, ServiceCredentialsData>>>;
  setServiceCredentials: (service: ServiceType, credentials: ServiceCredentialsData) => void;
};

/** Výsledný typ celého storu */
export type AppState = AuthState &
  SearchState &
  PlaylistsState &
  WatchlistState &
  HistoryState &
  SubscriptionsState &
  FriendsState &
  ServicesCredentialsState;
