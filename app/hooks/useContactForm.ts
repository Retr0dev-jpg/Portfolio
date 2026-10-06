'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

export type ContactFormStatus = 'idle' | 'sending' | 'success' | 'error';

const STATUS_RESET_MS = 5000;

export const CONTACT_FIELD = {
  name: 'from_name',
  email: 'from_email',
  subject: 'subject',
  message: 'message',
} as const;

export function useContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [status, setStatus] = useState<ContactFormStatus>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const settle = useCallback((result: 'success' | 'error') => {
    setStatus(result);
    setTurnstileToken(null);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus('idle'), STATUS_RESET_MS);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = formRef.current;
      if (!form || status === 'sending' || !turnstileToken) return;

      const data = new FormData(form);
      setStatus('sending');

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.get(CONTACT_FIELD.name),
            email: data.get(CONTACT_FIELD.email),
            subject: data.get(CONTACT_FIELD.subject),
            message: data.get(CONTACT_FIELD.message),
            turnstileToken,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        form.reset();
        settle('success');
      } catch {
        turnstileRef.current?.reset();
        settle('error');
      }
    },
    [settle, status, turnstileToken],
  );

  return {
    formRef,
    turnstileRef,
    status,
    canSubmit: status !== 'sending' && Boolean(turnstileToken),
    handleSubmit,
    setTurnstileToken,
  };
}
