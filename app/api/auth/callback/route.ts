/**
 * OAuth Callback Route
 * Handles the OAuth authorization callback from Genuka
 */

import { NextRequest, NextResponse } from "next/server";
import { OAuthService } from "@/services/auth/oauth.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const companyId = searchParams.get("company_id");
  const code = searchParams.get("code");
  const timestamp = searchParams.get("timestamp");
  const hmac = searchParams.get("hmac");
  const redirectTo = decodeURIComponent(
    searchParams.get("redirect_to") || "https://genuka.com/"
  );

  const oauthService = new OAuthService();

  // Validate parameters
  if (!oauthService.validateCallbackParams({ code, companyId, timestamp, hmac })) {
    return NextResponse.json(
      { error: "Invalid parameters" },
      { status: 400 }
    );
  }

  try {
    // Handle OAuth callback
    await oauthService.handleCallback({
      code: code!,
      companyId: companyId!,
      timestamp: timestamp!,
      hmac: hmac!,
    });

    // Redirect to the specified URL
    return NextResponse.redirect(redirectTo);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
