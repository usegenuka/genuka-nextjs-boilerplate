import Genuka from 'genuka-api';
import { env } from '@/config/env';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in_minutes: number;
}

export async function initializeGenuka(companyId: string) {
  return await Genuka.initialize({ id: companyId });
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
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

  return (await tokenResponse.json()) as TokenResponse;
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const response = await fetch(`${env.genuka.url}/oauth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
      client_id: env.genuka.clientId,
      client_secret: env.genuka.clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as TokenResponse;
}

export async function getCompanyInfo(companyId: string) {
  const genuka = await initializeGenuka(companyId);
  return await genuka.company.retrieve();
}
