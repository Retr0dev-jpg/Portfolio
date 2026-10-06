'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { CONTACT_LIMITS } from '@/app/lib/contact/limits';
import { TURNSTILE_SITE_KEY } from '@/app/config/site';
import { CONTACT_FIELD, useContactForm } from '@/app/hooks/useContactForm';
import { ArrowRightIcon, SpinnerIcon } from '../../ui/Icons';
import FormField from './FormField';

const FEEDBACK = {
  success: {
    className: 'bg-green-50 border-green-200 text-green-700',
    message: 'Messaggio inviato con successo! Ti risponderò il prima possibile.',
  },
  error: {
    className: 'bg-red-50 border-red-200 text-red-700',
    message: "Errore nell'invio. Riprova o contattami direttamente via email.",
  },
} as const;

export default function ContactForm() {
  const { formRef, turnstileRef, status, canSubmit, handleSubmit, setTurnstileToken } = useContactForm();
  const feedback = status === 'success' || status === 'error' ? FEEDBACK[status] : null;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField id="name" name={CONTACT_FIELD.name} label="Nome" type="text" required maxLength={CONTACT_LIMITS.name} placeholder="Il tuo nome" />
        <FormField id="email" name={CONTACT_FIELD.email} label="Email" type="email" required maxLength={CONTACT_LIMITS.email} placeholder="La tua email" />
      </div>
      <FormField id="subject" name={CONTACT_FIELD.subject} label="Oggetto" type="text" required maxLength={CONTACT_LIMITS.subject} placeholder="Di cosa vuoi parlare?" />
      <FormField
        multiline
        id="message"
        name={CONTACT_FIELD.message}
        label="Messaggio"
        required
        maxLength={CONTACT_LIMITS.message}
        rows={6}
        placeholder="Raccontami la tua idea o il tuo progetto..."
      />

      <Turnstile
        ref={turnstileRef}
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken(null)}
        onError={() => setTurnstileToken(null)}
        options={{ theme: 'light', refreshExpired: 'auto' }}
      />

      {feedback && (
        <div role="status" className={`px-4 py-3 rounded-lg border text-sm font-medium ${feedback.className}`}>
          {feedback.message}
        </div>
      )}

      {/* aria-disabled instead of disabled: browsers restore the native disabled state on reload,
          which breaks hydration; handleSubmit already ignores submits without a token. */}
      <button
        type="submit"
        aria-disabled={!canSubmit}
        className="w-full px-6 py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group aria-disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:hover:scale-100"
      >
        {status === 'sending' ? (
          <>
            <SpinnerIcon className="w-5 h-5 animate-spin" />
            Invio in corso...
          </>
        ) : (
          <>
            Invia Messaggio
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
