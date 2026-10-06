'use client';

import { buildContactEmail, buildContactMailtoHref } from '@/app/lib/contactEmail';
import { useIsClient } from '@/app/hooks/useIsClient';

interface ObfuscatedEmailProps {
  className?: string;
  subject?: string;
}

/** Renders the address only on the client so it never appears in the SSR HTML. */
export default function ObfuscatedEmail({ className, subject }: ObfuscatedEmailProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <span className={className} aria-busy="true">
        …
      </span>
    );
  }

  return (
    <a href={buildContactMailtoHref(subject)} className={className}>
      {buildContactEmail()}
    </a>
  );
}
