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
 * Base URL of the Genuka Admin API.
 * The SDK targets `https://api.genuka.com/<version>/admin` by default, so raw
 * admin fetches must hit the same host to stay consistent with SDK reads.
 */
export const GENUKA_ADMIN_API_BASE =
  process.env.GENUKA_ADMIN_API_BASE || 'https://api.genuka.com/2023-11/admin';

/**
 * Initialize a basic Genuka SDK instance (no auth token).
 * Use for public API calls only.
 */
export async function initializeGenuka(companyId: string) {
  return await Genuka.initialize({ id: companyId });
}

/**
 * Return the company with a guaranteed-fresh access token, refreshing and
 * persisting a new token if the stored one has expired.
 * Shared by the SDK initializer and the raw admin fetch helper.
 */
export async function getCompanyWithValidToken(companyId: string) {
  const companyService = new CompanyDBService();
  const company = await companyService.findByCompanyId(companyId);

  if (!company || !company.accessToken) {
    throw new Error('Company not found or no access token available');
  }

  const isExpired =
    company.tokenExpiresAt && new Date(company.tokenExpiresAt) < new Date();

  if (!isExpired) {
    return company;
  }

  if (!company.refreshToken) {
    throw new Error('Access token expired and no refresh token available');
  }

  const tokenResponse = await refreshAccessToken(company.refreshToken);
  const tokenExpiresAt = new Date(
    Date.now() + tokenResponse.expires_in_minutes * 60 * 1000
  );

  return companyService.updateById(companyId, {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    tokenExpiresAt,
  });
}

/**
 * Initialize an authenticated Genuka SDK instance using the company's stored access token.
 * Automatically refreshes expired tokens.
 * Use for admin API calls (products, orders, customers, etc.)
 */
export async function initializeAuthenticatedGenuka(companyId: string) {
  const company = await getCompanyWithValidToken(companyId);

  return await Genuka.initialize({
    id: companyId,
    token: company.accessToken!,
    adminMode: true,
  });
}

/**
 * Perform a raw authenticated request against the Genuka Admin API.
 * Used where the SDK is insufficient (e.g. paginated list with `meta`, or
 * updating an order — the SDK exposes no `orders.update`).
 *
 * @param companyId  Company whose token/scope is used.
 * @param path       Path relative to the admin base, e.g. `/orders?page=1`.
 * @param init       Standard fetch init (method, body, ...).
 */
export async function genukaAdminFetch<T = unknown>(
  companyId: string,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const company = await getCompanyWithValidToken(companyId);

  const response = await fetch(`${GENUKA_ADMIN_API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${company.accessToken}`,
      'X-Company': companyId,
      ...init.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Genuka admin request failed: ${response.status} ${init.method || 'GET'} ${path} ${errorText}`
    );
  }

  // 204 / empty body
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
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
