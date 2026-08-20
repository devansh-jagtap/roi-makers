import crypto from 'crypto';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) throw new Error('UNSUBSCRIBE_SECRET is not configured');
  return secret;
}

export function createUnsubscribeToken(email: string): string {
  const secret = getSecret();
  const expiry = Date.now() + THIRTY_DAYS_MS;
  const normalizedEmail = email.trim().toLowerCase();
  
  const payload = `${normalizedEmail}|${expiry}`;
  const payloadBase64 = Buffer.from(payload).toString('base64url');
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payloadBase64);
  const signature = hmac.digest('hex');
  
  return `${payloadBase64}.${signature}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const secret = getSecret();
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    
    const [payloadBase64, signature] = parts;
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payloadBase64);
    const expectedSignature = hmac.digest('hex');
    
    if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    
    // Decode payload
    const payload = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payloadParts = payload.split('|');
    if (payloadParts.length !== 2) return null;
    
    const [email, expiryStr] = payloadParts;
    const expiry = parseInt(expiryStr, 10);
    
    // Check expiry
    if (isNaN(expiry) || Date.now() > expiry) return null;
    
    return email;
  } catch {
    return null;
  }
}
