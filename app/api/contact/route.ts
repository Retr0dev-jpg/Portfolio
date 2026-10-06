import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/app/lib/contact/schema';
import { renderContactEmail } from '@/app/lib/contact/emailTemplate';
import { getClientIp, isRateLimited } from '@/app/lib/contact/rateLimit';
import { verifyTurnstile } from '@/app/lib/contact/turnstile';

const errorResponse = (message: string, status: number, extra?: Record<string, unknown>) =>
  NextResponse.json({ error: message, ...extra }, { status });

export async function POST(req: Request) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return errorResponse('Troppi messaggi inviati. Riprova tra qualche minuto.', 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse('Dati non validi.', 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse('Dati non validi.', 400, { details: parsed.error.flatten().fieldErrors });
  }

  const { turnstileToken, ...message } = parsed.data;

  try {
    if (!(await verifyTurnstile(turnstileToken, ip))) {
      return errorResponse('Verifica Turnstile fallita. Riprova.', 403);
    }

    const from = process.env.RESEND_FROM;
    const to = process.env.CONTACT_EMAIL_TO;
    if (!from || !to || !process.env.RESEND_API_KEY) {
      throw new Error('Configurazione email incompleta (RESEND_API_KEY, RESEND_FROM, CONTACT_EMAIL_TO).');
    }

    // The SDK reports API failures in the result instead of throwing.
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from,
      to,
      replyTo: message.email,
      subject: `[Portfolio] ${message.subject}`,
      html: renderContactEmail(message),
    });
    if (error) throw new Error(`Resend: ${error.message}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore invio email:', error);
    return errorResponse("Errore durante l'invio dell'email.", 500);
  }
}
