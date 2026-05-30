/**
 * storeUtils.ts
 * 
 * Pomocné funkce pro práci s poli a s uživatelsky indexovanými záznamy (Record<userId, T[]>).
 */

/** Přepne přítomnost položky v poli (přidá pokud chybí, odebere pokud je přítomna) */
export const toggleItemInArray = <T>(array: T[], item: T): T[] => {
  return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
};

/** Odebere položku z pole */
export const removeItemFromArray = <T>(array: T[], item: T): T[] => {
  return array.filter(i => i !== item);
};

/** Přidá položku do pole, pouze pokud tam ještě není */
export const addItemToArray = <T>(array: T[], item: T): T[] => {
  if (array.includes(item)) return array;
  return [...array, item];
};

/**
 * Zjednodušuje aktualizaci stavu pro konkrétního uživatele v Record<string, T[]> (např. friends, watchlists).
 * Načte aktuální pole daného uživatele, zavolá updateFn a vrátí nový Record.
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
