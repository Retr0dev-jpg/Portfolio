import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori.' },
        { status: 400 },
      );
    }

    const now = new Date().toLocaleString('it-IT', {
      timeZone: 'Europe/Rome',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const escapedName    = name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const escapedEmail   = email.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const escapedSubject = subject.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const escapedMessage = message
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.CONTACT_EMAIL_TO!,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nuovo messaggio dal Portfolio</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7C3AED 0%,#9d4edd 100%);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;font-weight:600;">Portfolio</p>
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Nuovo messaggio</h1>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.70);">${now}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 0;">

              <!-- Mittente info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5ff;border-radius:8px;padding:0;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:11px;color:#7C3AED;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Mittente</p>

                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:10px;">
                          <span style="display:inline-block;width:60px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Nome</span>
                          <span style="font-size:15px;color:#111827;font-weight:600;">${escapedName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="display:inline-block;width:60px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Email</span>
                          <a href="mailto:${escapedEmail}" style="font-size:15px;color:#7C3AED;font-weight:600;text-decoration:none;">${escapedEmail}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Oggetto -->
              <p style="margin:0 0 6px;font-size:11px;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Oggetto</p>
              <p style="margin:0 0 28px;font-size:18px;font-weight:700;color:#111827;">${escapedSubject}</p>

              <!-- Divisore -->
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 28px;" />

              <!-- Messaggio -->
              <p style="margin:0 0 12px;font-size:11px;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Messaggio</p>
              <div style="font-size:15px;line-height:1.75;color:#374151;background:#fafafa;border-left:3px solid #7C3AED;border-radius:0 6px 6px 0;padding:18px 20px;">
                ${escapedMessage}
              </div>

            </td>
          </tr>

          <!-- CTA rispondi -->
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <a href="mailto:${escapedEmail}?subject=Re:%20${encodeURIComponent(subject)}"
                 style="display:inline-block;background:#7C3AED;color:#ffffff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.3px;">
                Rispondi a ${escapedName}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f5ff;padding:20px 40px;text-align:center;border-top:1px solid #ede9fe;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">Messaggio inviato tramite il form del portfolio &mdash; <a href="https://retr0hub.dev" style="color:#7C3AED;text-decoration:none;">retr0hub.dev</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore invio email:', error);
    return NextResponse.json(
      { error: "Errore durante l'invio dell'email." },
      { status: 500 },
    );
  }
}
