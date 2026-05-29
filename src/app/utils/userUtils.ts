import { usersDb } from '../data/usersDb';

export const getUsername = (userId: string | undefined): string => {
  if (userId) {
    const user = usersDb.getUsers().find(u => u.id === userId);
    if (user) return user.username;
  }
  return 'Neznámý uživatel';
};
