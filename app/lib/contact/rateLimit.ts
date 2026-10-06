const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 3;

// Per-instance memory: on serverless each warm instance keeps its own window.
const requestLog = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  pruneExpired(now);

  const timestamps = requestLog.get(key) ?? [];
  if (timestamps.length >= MAX_REQUESTS) return true;

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}

function pruneExpired(now: number) {
  for (const [key, timestamps] of requestLog) {
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length) requestLog.set(key, recent);
    else requestLog.delete(key);
  }
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
