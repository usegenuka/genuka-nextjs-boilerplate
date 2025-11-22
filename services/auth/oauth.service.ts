/**
 * OAuth Authentication Service
 * Handles OAuth flow, token exchange, and company data synchronization
 */

import { CompanyDBService } from "@/services/database/company.service";
import { exchangeCodeForToken, getCompanyInfo } from "@/lib/genuka";
import type { CompanyCreate } from "@/types/company";

export class OAuthService {
  private companyDBService: CompanyDBService;

  constructor() {
    this.companyDBService = new CompanyDBService();
  }

  /**
   * Handle OAuth callback - exchange code for token and sync company data
   */
  async handleCallback(params: {
    code: string;
    companyId: string;
    timestamp: string;
    hmac: string;
  }) {
    // Exchange authorization code for access token
    const accessToken = await exchangeCodeForToken(params.code);

    // Retrieve company information from Genuka
    const companyInfo = await getCompanyInfo(params.companyId);

    // Prepare company data for database
    const companyData: CompanyCreate = {
      id: params.companyId,
      handle: companyInfo.handle || null,
      name: companyInfo.name,
      description: companyInfo.description || null,
      authorizationCode: params.code || null,
      accessToken: accessToken || null,
      logoUrl: companyInfo.logoUrl || null,
      phone: companyInfo.metadata?.contact || null,
    };

    // Upsert company in database
    await this.companyDBService.upsertCompany(companyData);

    return { success: true, companyId: params.companyId };
  }

  /**
   * Validate OAuth callback parameters
   */
  validateCallbackParams(params: {
    code?: string | null;
    companyId?: string | null;
    timestamp?: string | null;
    hmac?: string | null;
  }): boolean {
    return !!(params.code && params.companyId && params.timestamp && params.hmac);
  }
}
