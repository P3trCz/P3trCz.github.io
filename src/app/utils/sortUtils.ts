import { Title } from '../data/catalog';

export type SortField = 'title' | 'rating' | 'genres' | 'services' | null;
export type SortOrder = 'asc' | 'desc';

export function sortTitles(titles: Title[], sortField: SortField, sortOrder: SortOrder, language: 'cs' | 'en' = 'cs'): Title[] {
  if (!sortField) return titles;

  return [...titles].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'title') {
      const aTitle = language === 'en' && a.title_en ? a.title_en : a.title;
      const bTitle = language === 'en' && b.title_en ? b.title_en : b.title;
      comparison = aTitle.localeCompare(bTitle, 'cs');
    } else if (sortField === 'rating') {
      comparison = (a.rating || 0) - (b.rating || 0);
    } else if (sortField === 'genres') {
      comparison = (a.genres?.length || 0) - (b.genres?.length || 0);
    } else if (sortField === 'services') {
      comparison = (a.streaming_services?.length || 0) - (b.streaming_services?.length || 0);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}
