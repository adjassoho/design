/**
 * Parses ISO date string or French / English text date string into a Date object
 */
export function parseCeremonyDate(dateStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // 1. Direct standard ISO parse
  const directDate = new Date(trimmed);
  if (!isNaN(directDate.getTime())) {
    return directDate;
  }

  // 2. Parse French text date formats (e.g. "Vendredi 28 Août 2026 à 10h00", "28 Août 2026", etc.)
  const frenchMonths: Record<string, number> = {
    janvier: 0,
    fevrier: 1,
    février: 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    aout: 7,
    août: 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    decembre: 11,
    décembre: 11,
  };

  const clean = trimmed.toLowerCase();
  
  // Extract day, month name, year, and optional hour:min
  // Example matches: "28 août 2026 à 10h00", "14 février 2025 à 10:00"
  const regex = /(\d{1,2})\s+([a-zéèêëû]+)\s+(\d{4})(?:\s*(?:à|at)?\s*(\d{1,2})(?:h|:)?(\d{2})?)?/i;
  const match = clean.match(regex);

  if (match) {
    const day = parseInt(match[1], 10);
    const monthKey = match[2].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const monthIndex = frenchMonths[match[2]] ?? frenchMonths[monthKey];
    const year = parseInt(match[3], 10);
    const hours = match[4] ? parseInt(match[4], 10) : 10;
    const minutes = match[5] ? parseInt(match[5], 10) : 0;

    if (monthIndex !== undefined && !isNaN(day) && !isNaN(year)) {
      const parsed = new Date(year, monthIndex, day, hours, minutes, 0);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }

  return null;
}
