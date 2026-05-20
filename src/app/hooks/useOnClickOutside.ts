import { useEffect, RefObject } from 'react';

/**
 * Hook pro detekci kliknutí mimo zadaný element.
 * Ideální pro zavírání modálů, popoverů, a rozbalovacích menu.
 * 
 * @param ref Reference na element, mimo který chceme detekovat kliknutí.
 * @param handler Funkce, která se zavolá, když uživatel klikne mimo element.
 * @param isActive Volitelně, zapíná/vypíná listenery (optimalizace).
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      // Pokud jsme neklikli nikam, nebo jsme klikli přímo dovnitř prvku, nedělej nic.
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, isActive]);
}
