import { env } from '@/config/env';

export const generateHmac = async (
  params: {
    code: string;
    company_id: string;
    redirect_to: string;
    timestamp: string;
  }
): Promise<string> => {
  // Sort parameters alphabetically by key (like PHP's ksort)
  const sortedKeys = Object.keys(params).sort();

  // Build query string (like PHP's http_build_query)
  const queryString = sortedKeys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key as keyof typeof params])}`)
    .join('&');

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(env.genuka.clientSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(queryString));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const verifyHmac = async (
  params: {
    code: string;
    company_id: string;
    redirect_to: string;
    timestamp: string;
  },
  receivedHmac: string
): Promise<boolean> => {
  const expectedHmac = await generateHmac(params);
  return expectedHmac === receivedHmac;
};
