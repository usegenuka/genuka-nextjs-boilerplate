import { requireAuth } from "@/lib/auth";
import { initializeAuthenticatedGenuka } from "@/lib/genuka";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const company = await requireAuth();
    const genuka = await initializeAuthenticatedGenuka(company.id);

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const customers = await genuka.customers.list({ page, limit });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Customers fetch error:", error);
    const status = error instanceof Error && error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: "Failed to fetch customers" }, { status });
  }
}
