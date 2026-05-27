import { Title, catalog } from '../data/catalog';

export const normalizeText = (text: string) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Univerzální funkce pro vyhledávání titulů
 * @param query Hledaný výraz (pokud má méně než 3 znaky, vrací prázdné pole)
 * @param titles Pole titulů, ve kterém se má hledat (defaultně celý katalog)
 * @returns Vyfiltrované pole titulů, které odpovídají hledanému výrazu
 */
export const searchTitles = (query: string, titles: Title[] = catalog): Title[] => {
  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length < 3) {
    return [];
  }

  const normalizedQuery = normalizeText(trimmedQuery);

  return titles.filter(title => {
    return normalizeText(title.title).includes(normalizedQuery) ||
           (title.title_en && normalizeText(title.title_en).includes(normalizedQuery));
  });
};
