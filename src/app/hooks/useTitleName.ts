import { useAppStore } from '../store/useAppStore';
import { Title } from '../data/catalog';

/**
 * Vybere název titulu podle jazyka.
 */
export const useTitleName = () => {
  const language = useAppStore(state => state.language);
  return (title: Title) => {
    return language === 'en' && title.title_en ? title.title_en : title.title;
  };
};
