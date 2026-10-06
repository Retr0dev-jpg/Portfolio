const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
// Cloudflare's documented "always passes" secret, only acceptable outside production.
const TEST_SECRET = '1x0000000000000000000000000000000AA';

export class TurnstileConfigError extends Error {}

function getSecret(): string {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (secret) return secret;
  if (process.env.NODE_ENV !== 'production') return TEST_SECRET;
  throw new TurnstileConfigError('TURNSTILE_SECRET_KEY non configurata.');
}

export async function verifyTurnstile(token: string, remoteIp: string): Promise<boolean> {
  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: getSecret(), response: token, remoteip: remoteIp }),
  });
  if (!res.ok) return false;

  const data: { success?: boolean } = await res.json();
  return data.success === true;
}
