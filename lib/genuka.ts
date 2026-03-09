import Genuka from 'genuka-api';
import { env } from '@/config/env';
import { CompanyDBService } from '@/services/database/company.service';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in_minutes: number;
}

/**
 * Initialize a basic Genuka SDK instance (no auth token).
 * Use for public API calls only.
 */
export async function initializeGenuka(companyId: string) {
  return await Genuka.initialize({ id: companyId });
}

/**
 * Initialize an authenticated Genuka SDK instance using the company's stored access token.
 * Automatically refreshes expired tokens.
 * Use for admin API calls (products, orders, customers, etc.)
 */
export async function initializeAuthenticatedGenuka(companyId: string) {
  const companyService = new CompanyDBService();
  const company = await companyService.findByCompanyId(companyId);

  if (!company || !company.accessToken) {
    throw new Error('Company not found or no access token available');
  }

  // Check if token is expired and refresh if needed
  if (company.tokenExpiresAt && new Date(company.tokenExpiresAt) < new Date()) {
    if (!company.refreshToken) {
      throw new Error('Access token expired and no refresh token available');
    }

    const tokenResponse = await refreshAccessToken(company.refreshToken);
    const tokenExpiresAt = new Date(
      Date.now() + tokenResponse.expires_in_minutes * 60 * 1000
    );

    await companyService.updateById(companyId, {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      tokenExpiresAt,
    });

    return await Genuka.initialize({
      id: companyId,
      token: tokenResponse.access_token,
      adminMode: true,
    });
  }

  return await Genuka.initialize({
    id: companyId,
    token: company.accessToken,
    adminMode: true,
  });
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
