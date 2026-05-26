/**
 * Extract a Genuka order id from a scanned QR payload.
 *
 * Expected format: `https://genuka.com/invoice/{order_id}` (any host/scheme,
 * optional trailing slash or query string). Falls back to treating the whole
 * payload as a raw id when it looks like one.
 */
export function parseOrderId(raw: string): string | null {
  if (!raw) return null;
  const text = raw.trim();

  // Match `/invoice/<id>` anywhere in the string.
  const match = text.match(/\/invoice\/([^/?#\s]+)/i);
  if (match?.[1]) {
    return decodeURIComponent(match[1]);
  }

  // Bare id fallback (Genuka uses ULID-like 26-char ids, but accept generic).
  if (/^[A-Za-z0-9_-]{6,}$/.test(text)) {
    return text;
  }

  return null;
}
