'use client';

import { useState, useEffect } from 'react';
import { buildContactEmail, buildContactMailtoHref } from '@/app/lib/contactEmail';

interface ObfuscatedEmailProps {
  className?: string;
  subject?: string;
}

export default function ObfuscatedEmail({ className, subject }: ObfuscatedEmailProps) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(buildContactEmail());
  }, []);

  if (!email) {
    return (
      <span className={className} aria-busy="true">
        …
      </span>
    );
  }

  const href = buildContactMailtoHref(subject);

  return (
    <a href={href} className={className}>
      {email}
    </a>
  );
}
