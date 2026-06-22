import { useMemo } from 'react';
import { Title } from '../data/catalog';
import { normalizeText } from './useSearch';

/**
 * Hook pro pokročilé vyhledávání titulů.
 * Umožňuje zadat více termínů oddělených čárkou nebo středníkem (např. "Matrix, akční; sci-fi").
 */
export function useAdvancedSearch(
  items: Title[],
  query: string,
  options?: { minQueryLength?: number; returnEmptyIfBelowMinLength?: boolean }
): Title[] {
  return useMemo(() => {
    const trimmedQuery = query.trim();

    if (options?.minQueryLength && trimmedQuery.length > 0 && trimmedQuery.length < options.minQueryLength) {
      return options.returnEmptyIfBelowMinLength ? [] : items;
    }

    if (!trimmedQuery) {
      return (options?.minQueryLength && options.returnEmptyIfBelowMinLength) ? [] : items;
    }

    // Rozdělení dotazu podle čárky nebo středníku, odstranění mezer a diakritiky
    const terms = trimmedQuery
      .split(/[,;]+/)
      .map(t => normalizeText(t.trim()))
      .filter(Boolean);

    if (terms.length === 0) return items;

    return items.filter(title => {
      // Film musí vyhovovat každému zadanému termínu
      return terms.every(term => {
        const matchesTitle = [title.title, title.title_en]
          .some(t => t && normalizeText(t).includes(term));

        const matchesGenre = title.genres
          .some(g => normalizeText(g).includes(term));

        return matchesTitle || matchesGenre;
      });
    });
  }, [items, query, options]);
}
