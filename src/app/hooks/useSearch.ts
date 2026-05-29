import { useMemo } from 'react';

/**
 * Generický hook pro vyhledávání (filtrování) v poli.
 * @param items Pole položek k prohledání
 * @param query Vyhledávací dotaz
 * @param getSearchableText Funkce, která z položky vytáhne text, ve kterém se má hledat
 * @returns Vyfiltrované pole položek
 */
export function useSearch<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string
): T[] {
  return useMemo(() => {
    if (!query || !query.trim()) return items;
    
    const lowerQuery = query.toLowerCase().trim();
    
    return items.filter(item => {
      const text = getSearchableText(item);
      return text.toLowerCase().includes(lowerQuery);
    });
  }, [items, query, getSearchableText]);
}
