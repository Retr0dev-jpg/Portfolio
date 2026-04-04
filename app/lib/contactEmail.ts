/**
 * Assembly runtime dell'indirizzo (nessuna stringa mailto completa nel bundle come literal unica).
 * Usato da ObfuscatedEmail e da handler client (es. mailto da pulsante).
 */
export function buildContactEmail(): string {
  const parts = ['marco_simone', 'retr0hub', 'dev'];
  return `${parts[0]}@${parts[1]}.${parts[2]}`;
}

export function buildContactMailtoHref(subject?: string): string {
  const email = buildContactEmail();
  return subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;
}
