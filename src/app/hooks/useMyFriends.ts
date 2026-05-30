import { useAppStore } from '../store/useAppStore';
import { usersDb } from '../data/usersDb';

/**
 * Hook vracející seznam přátel aktuálně přihlášeného uživatele.
 * Nahrazuje opakující se pattern v Friends.tsx, Playlists.tsx a TitleDetail.tsx.
 */
export function useMyFriends() {
  const currentUser = useAppStore(state => state.currentUser);
  const friends = useAppStore(state => state.friends);

  const myFriendsIds = currentUser ? (friends[currentUser.id] || []) : [];
  const myFriends = myFriendsIds
    .map(id => usersDb.getUsers().find(u => u.id === id))
    .filter((u): u is { id: string; username: string; email: string; avatarUrl?: string } => Boolean(u));

  return myFriends;
}
