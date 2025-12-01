import { createSession, verifyRefreshToken } from "@/lib/auth";
import { refreshAccessToken } from "@/lib/genuka";
import { CompanyDBService } from "@/services/database/company.service";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Verify the refresh token from HTTP-only cookie
    const companyId = await verifyRefreshToken();

    if (!companyId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message:
            "Invalid or expired refresh token. Please reinstall the app.",
        },
        { status: 401 },
      );
    }

    // Check if company exists in database with a Genuka refresh token
    const companyService = new CompanyDBService();
    const company = await companyService.findByCompanyId(companyId);

    if (!company || !company.refreshToken) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message:
            "Company not found or no refresh token available. Please reinstall the app.",
        },
        { status: 401 },
      );
    }

    // Use Genuka refresh_token to get new tokens from Genuka API
    const tokenResponse = await refreshAccessToken(company.refreshToken);

    // Calculate new expiration date
    const tokenExpiresAt = new Date(
      Date.now() + tokenResponse.expires_in_minutes * 60 * 1000,
    );

    // Update Genuka tokens in database
    await companyService.updateById(companyId, {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      tokenExpiresAt: tokenExpiresAt,
    });

    // Create new session + refresh cookies
    await createSession(companyId);

    return NextResponse.json({
      success: true,
      message: "Session refreshed successfully",
      company: {
        id: company.id,
        handle: company.handle,
        name: company.name,
      },
    });
  } catch (error) {
    console.error("Session refresh error:", error);

    // If refresh token is invalid/revoked, user needs to reinstall
    const message =
      error instanceof Error ? error.message : "Failed to refresh session";
    const isTokenError =
      message.includes("revoked") || message.includes("invalid");

    return NextResponse.json(
      {
        error: isTokenError ? "Unauthorized" : "Server Error",
        message: isTokenError
          ? "Refresh token is invalid or revoked. Please reinstall the app."
          : "Failed to refresh session",
      },
      { status: isTokenError ? 401 : 500 },
    );
  }
}
