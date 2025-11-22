/**
 * Application constants
 * Centralized configuration values used throughout the application
 */

export const APP_NAME = 'Genuka Next.js Boilerplate';
export const APP_DESCRIPTION = 'A professional Next.js boilerplate for Genuka applications';

// API Routes
export const API_ROUTES = {
  AUTH_CALLBACK: '/api/auth/callback',
  AUTH_WEBHOOK: '/api/auth/webhook',
} as const;

// External URLs
export const EXTERNAL_URLS = {
  GENUKA_WEBSITE: 'https://genuka.com',
  GENUKA_DOCS: 'https://docs.genuka.com',
} as const;

// Database
export const DB_DEFAULTS = {
  CONNECTION_LIMIT: 5,
  TIMEOUT: 10000,
} as const;

// OAuth
export const OAUTH_CONFIG = {
  GRANT_TYPE: 'authorization_code',
  TOKEN_ENDPOINT: '/oauth/token',
} as const;
