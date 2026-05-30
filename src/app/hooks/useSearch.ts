import { useMemo } from 'react';

/**
 * Odstraní diakritiku a převede text na malá písmena pro spolehlivé vyhledávání.
 */
export const normalizeText = (text: string) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Generický hook pro vyhledávání (filtrování) v poli.
 * @param items Pole položek k prohledání
 * @param query Vyhledávací dotaz
 * @param getSearchableTexts Funkce, která z položky vytáhne texty, ve kterých se má hledat (např. title, title_en)
 * @param options Volitelné nastavení (např. minQueryLength pro minimální počet znaků k zahájení hledání)
 * @returns Vyfiltrované pole položek
 */
export function useSearch<T>(
  items: T[],
  query: string,
  getSearchableTexts: (item: T) => (string | undefined)[],
  options?: { minQueryLength?: number; returnEmptyIfBelowMinLength?: boolean }
): T[] {
  return useMemo(() => {
    const trimmedQuery = query.trim();

    // Pokud je zadaný limit na počet znaků a dotaz je kratší
    if (options?.minQueryLength && trimmedQuery.length > 0 && trimmedQuery.length < options.minQueryLength) {
      return options.returnEmptyIfBelowMinLength ? [] : items;
    }

    // Pokud není zadán žádný dotaz, chování závisí na nastavení
    if (!trimmedQuery) {
      return (options?.minQueryLength && options.returnEmptyIfBelowMinLength) ? [] : items;
    }

    const normalizedQuery = normalizeText(trimmedQuery);

    return items.filter(item => {
      const texts = getSearchableTexts(item);
      return texts.some(text => text && normalizeText(text).includes(normalizedQuery));
    });
  }, [items, query, getSearchableTexts, options]);
}
