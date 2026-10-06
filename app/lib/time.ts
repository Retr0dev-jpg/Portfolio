const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Italian relative time label ("3 giorni fa"). Returns '' for missing/invalid dates. */
export function formatRelativeTime(isoDate: string, now: number): string {
  const timestamp = new Date(isoDate).getTime();
  if (!isoDate || Number.isNaN(timestamp)) return '';

  const diff = now - timestamp;
  const mins = Math.floor(diff / MINUTE);
  const hours = Math.floor(diff / HOUR);
  const days = Math.floor(diff / DAY);

  if (mins < 1) return 'appena ora';
  if (mins < 60) return `${mins} min fa`;
  if (hours < 24) return `${hours}h fa`;
  if (days === 1) return 'ieri';
  if (days < 30) return `${days} giorni fa`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mes${months === 1 ? 'e' : 'i'} fa`;

  const years = Math.floor(months / 12);
  return `${years} ann${years === 1 ? 'o' : 'i'} fa`;
}
