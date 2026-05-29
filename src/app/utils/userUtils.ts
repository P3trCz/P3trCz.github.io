import { usersDb } from '../data/usersDb';

export const getDynamicUsername = (userId: string | undefined, fallbackUsername: string | undefined): string => {
  if (userId) {
    const user = usersDb.getUsers().find(u => u.id === userId);
    if (user) return user.username;
  }
  return fallbackUsername || '';
};
