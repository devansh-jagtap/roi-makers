/**
 * Small request helpers shared by the API routes.
 */

export class BodyTooLargeError extends Error {
  constructor() {
    super('Request body too large');
    this.name = 'BodyTooLargeError';
  }
}

/**
 * Parse a JSON body with a hard size cap.
 *
 * Route handlers have no default body limit, so a single request could carry
 * tens of megabytes straight into `JSON.parse`. The declared length is checked
 * first (cheap), then the actual bytes read (in case the header lies).
 */
export async function readJson<T = unknown>(request: Request, maxBytes: number): Promise<T> {
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > maxBytes) throw new BodyTooLargeError();

  const raw = await request.text();
  if (raw.length > maxBytes) throw new BodyTooLargeError();

  return JSON.parse(raw) as T;
}

/** True when the request body (by declared length) exceeds `maxBytes`. */
export function bodyExceeds(request: Request, maxBytes: number): boolean {
  return Number(request.headers.get('content-length') ?? 0) > maxBytes;
}

/**
 * Is a browser request coming from our own origin?
 *
 * Browsers always attach `Origin` to cross-site POSTs (and `Sec-Fetch-Site`),
 * so a mismatch is a reliable CSRF signal. Requests with neither header
 * (curl, server-to-server) are allowed through — they carry no cookies anyway.
 */
export function isSameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') return false;

  const origin = request.headers.get('origin');
  if (!origin) return true;

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
