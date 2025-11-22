import Genuka from 'genuka-api';
import { env } from '@/config/env';

/**
 * Initialize Genuka SDK with company ID
 */
export async function initializeGenuka(companyId: string) {
  return await Genuka.initialize({ id: companyId });
}

export async function exchangeCodeForToken(code: string) {
  const tokenResponse = await fetch(`${env.genuka.url}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: env.genuka.clientId,
      client_secret: env.genuka.clientSecret,
      redirect_uri: env.genuka.redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Token exchange failed: ${tokenResponse.status} ${errorText}`);
  }

  const data = await tokenResponse.json();
  return data.access_token as string;
}

export async function getCompanyInfo(companyId: string) {
  const genuka = await initializeGenuka(companyId);
  return await genuka.company.retrieve();
}
