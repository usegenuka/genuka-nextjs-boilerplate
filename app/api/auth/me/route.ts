import { getAuthenticatedCompany } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const company = await getAuthenticatedCompany();

    if (!company) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Not authenticated",
        },
        { status: 401 },
      );
    }

    // Return company info without sensitive data
    return NextResponse.json({
      id: company.id,
      handle: company.handle,
      name: company.name,
      description: company.description,
      logoUrl: company.logoUrl,
      phone: company.phone,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Failed to get user info" },
      { status: 500 },
    );
  }
}
