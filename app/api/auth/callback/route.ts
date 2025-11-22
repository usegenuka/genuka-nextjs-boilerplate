import { NextRequest, NextResponse } from "next/server";
import { OAuthService } from "@/services/auth/oauth.service";
import { createSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const companyId = searchParams.get("company_id");
  const code = searchParams.get("code");
  const timestamp = searchParams.get("timestamp");
  const hmac = searchParams.get("hmac");
  const redirectToEncoded = searchParams.get("redirect_to") as string;
  const redirectToDecoded = decodeURIComponent(redirectToEncoded);

  const oauthService = new OAuthService();
  if (
    !oauthService.validateCallbackParams({ code, companyId, timestamp, hmac })
  ) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    await oauthService.handleCallback({
      code: code!,
      companyId: companyId!,
      timestamp: timestamp!,
      hmac: hmac!,
      redirectTo: redirectToEncoded,
    });

    await createSession(companyId!);

    return NextResponse.redirect(new URL(redirectToDecoded, request.url));
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
