/** Assembled at runtime so the full address never appears as a single literal in the bundle. */
export function buildContactEmail(): string {
  const parts = ['marco_simone', 'retr0hub', 'dev'];
  return `${parts[0]}@${parts[1]}.${parts[2]}`;
}

export function buildContactMailtoHref(subject?: string): string {
  const email = buildContactEmail();
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}
