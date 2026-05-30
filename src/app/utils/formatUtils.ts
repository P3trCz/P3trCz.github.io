/**
 * Formátování minut na "X h Y min".
 */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} h ${m} min`;
}

/**
 * Pluralizace pro počet položek v seznamu.
 * 1 → "položka", 2-4 → "položky", 5+ → "položek"
 */
export function pluralizeItems(count: number): string {
  if (count === 1) return 'položka';
  if (count >= 2 && count <= 4) return 'položky';
  return 'položek';
}
