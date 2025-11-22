import { CompanyDBService } from "@/services/database/company.service";
import { exchangeCodeForToken, getCompanyInfo } from "@/lib/genuka";
import { verifyHmac } from "@/lib/hmac";
import type { CompanyCreate } from "@/types/company";

export class OAuthService {
  private companyDBService: CompanyDBService;

  constructor() {
    this.companyDBService = new CompanyDBService();
  }

  async handleCallback(params: {
    code: string;
    companyId: string;
    timestamp: string;
    hmac: string;
    redirectTo: string;
  }) {
    const isValidHmac = await verifyHmac(
      {
        code: params.code,
        company_id: params.companyId,
        redirect_to: params.redirectTo,
        timestamp: params.timestamp,
      },
      params.hmac
    );

    if (!isValidHmac) {
      throw new Error('Invalid HMAC signature');
    }

    const timestampAge = Date.now() - parseInt(params.timestamp) * 1000;
    if (timestampAge > 5 * 60 * 1000) {
      throw new Error('Request expired');
    }

    const accessToken = await exchangeCodeForToken(params.code);

    const companyInfo = await getCompanyInfo(params.companyId);

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
    await this.companyDBService.upsertCompany(companyData);

    return { success: true, companyId: params.companyId };
  }

  validateCallbackParams(params: {
    code?: string | null;
    companyId?: string | null;
    timestamp?: string | null;
    hmac?: string | null;
  }): boolean {
    return !!(
      params.code &&
      params.companyId &&
      params.timestamp &&
      params.hmac
    );
  }
}
