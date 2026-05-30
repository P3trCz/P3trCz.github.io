/**
 * Formátování minut na "X h Y min".
 * Používáno v Stats.tsx (celkový čas), TitleDetail.tsx (délka filmu).
 */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} h ${m} min`;
}

/**
 * Česká pluralizace pro počet položek v seznamu.
 * 1 → "položka", 2-4 → "položky", 5+ → "položek"
 */
export function pluralizeItems(count: number): string {
  if (count === 1) return 'položka';
  if (count >= 2 && count <= 4) return 'položky';
  return 'položek';
}
