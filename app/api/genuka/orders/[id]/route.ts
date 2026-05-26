import { requireAuth } from "@/lib/auth";
import { genukaAdminFetch } from "@/lib/genuka";
import type { GenukaOrder, GenukaOrderMetadata } from "@/types/order";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/** Unwrap a Laravel single-resource response (`{ data: {...} }`). */
function unwrap(payload: unknown): GenukaOrder {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: GenukaOrder }).data;
  }
  return payload as GenukaOrder;
}

/** Retrieve a single order. */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const company = await requireAuth();
    const { id } = await params;

    const result = await genukaAdminFetch(
      company.id,
      `/orders/${id}?include=customer,products,order_products`
    );

    return NextResponse.json(unwrap(result));
  } catch (error) {
    console.error("Order retrieve error:", error);
    const status =
      error instanceof Error && error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: "Failed to retrieve order" },
      { status }
    );
  }
}

/**
 * Update an order's metadata (note + scan state).
 *
 * Genuka exposes only a full `PUT`, so we re-read the order first and echo
 * back its key financial/status fields untouched, mutating only `metadata`.
 * This avoids clobbering unrelated data.
 *
 * Body: `{ metadata: { note?, scanned_at?, scanned_by? } }`
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const company = await requireAuth();
    const { id } = await params;

    const body = (await request.json()) as {
      metadata?: GenukaOrderMetadata;
    };
    const incoming = body.metadata ?? {};

    // Re-read current order to merge metadata and preserve required fields.
    const current = unwrap(
      await genukaAdminFetch(company.id, `/orders/${id}`)
    );

    const mergedMetadata: GenukaOrderMetadata = {
      ...(current.metadata ?? {}),
      ...incoming,
    };

    const payload = {
      amount: current.amount,
      amount_due: current.amount_due,
      status: current.status,
      metadata: mergedMetadata,
    };

    const updated = await genukaAdminFetch(company.id, `/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return NextResponse.json(unwrap(updated));
  } catch (error) {
    console.error("Order update error:", error);
    const status =
      error instanceof Error && error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { error: "Failed to update order" },
      { status }
    );
  }
}
