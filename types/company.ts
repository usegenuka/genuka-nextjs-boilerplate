/**
 * Company type matching the Prisma schema.
 * Defined manually to avoid dependency on generated Prisma client at import time.
 */
export interface Company {
  id: string;
  handle: string | null;
  name: string;
  description: string | null;
  logoUrl: string | null;
  authorizationCode: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CompanyCreate = Omit<Company, "createdAt" | "updatedAt">;
