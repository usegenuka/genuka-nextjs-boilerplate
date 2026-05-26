import { requireAuth } from "@/lib/auth";
import { genukaAdminFetch } from "@/lib/genuka";
import type { GenukaOrder, Paginated } from "@/types/order";
import { NextRequest, NextResponse } from "next/server";

/**
 * List admin orders, one page at a time, preserving Laravel pagination `meta`
 * so the client can drive a progress bar during the initial offline sync.
 *
 * Query params: `page` (default 1), `per_page` (default 100).
 */
export async function GET(request: NextRequest) {
  try {
    const company = await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("per_page") || "100", 10);

    const query = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
      include: "customer,products,order_products",
    });

    const result = await genukaAdminFetch<Paginated<GenukaOrder>>(
      company.id,
      `/orders?${query.toString()}`
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Orders fetch error:", error);
    const status =
      error instanceof Error && error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status }
    );
  }
}
