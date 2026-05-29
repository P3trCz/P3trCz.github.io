export const toggleItemInArray = <T>(array: T[], item: T): T[] => {
  return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
};

export const removeItemFromArray = <T>(array: T[], item: T): T[] => {
  return array.filter(i => i !== item);
};

export const addItemToArray = <T>(array: T[], item: T): T[] => {
  if (array.includes(item)) return array;
  return [...array, item];
};

/**
 * Zjednodušuje aktualizaci stavu pro konkrétního uživatele v Record<string, T[]> (např. friends, watchlists).
 */
export const updateUserRecord = <T>(
  record: Record<string, T[]>,
  userId: string,
  updateFn: (arr: T[]) => T[]
): Record<string, T[]> => {
  return {
    ...record,
    [userId]: updateFn(record[userId] || [])
  };
};
