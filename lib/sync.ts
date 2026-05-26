"use client";

import { db, upsertTicketsFromOrders, setSetting } from "@/lib/db";
import type { GenukaOrder, Paginated } from "@/types/order";

const PER_PAGE = 100;

export interface PullProgress {
  page: number;
  lastPage: number;
  fetched: number;
  total: number;
}

/**
 * Pull every order from Genuka into IndexedDB, page by page.
 * Reports progress so the UI can show a sync bar.
 */
export async function pullAllOrders(
  onProgress?: (p: PullProgress) => void
): Promise<{ total: number }> {
  let page = 1;
  let lastPage = 1;
  let total = 0;
  let fetched = 0;

  do {
    const res = await fetch(
      `/api/genuka/orders?page=${page}&per_page=${PER_PAGE}`,
      { credentials: "include" }
    );
    if (!res.ok) {
      throw new Error(`Sync failed (HTTP ${res.status})`);
    }

    const payload = (await res.json()) as Paginated<GenukaOrder>;
    const orders = payload.data ?? [];
    await upsertTicketsFromOrders(orders);

    fetched += orders.length;
    lastPage = payload.meta?.last_page ?? page;
    total = payload.meta?.total ?? fetched;

    onProgress?.({ page, lastPage, fetched, total });

    // Stop early if the API returned fewer than a full page (no meta case).
    if (!payload.meta && orders.length < PER_PAGE) break;
    page += 1;
  } while (page <= lastPage);

  await setSetting("lastSyncAt", new Date().toISOString());
  return { total };
}

let pushing = false;

/**
 * Push all locally-modified tickets (notes + scan state) back to Genuka.
 * Safe to call repeatedly; runs at most once concurrently and skips silently
 * when offline.
 */
export async function pushDirtyTickets(): Promise<{
  pushed: number;
  failed: number;
}> {
  if (pushing) return { pushed: 0, failed: 0 };
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { pushed: 0, failed: 0 };
  }

  pushing = true;
  let pushed = 0;
  let failed = 0;

  try {
    // Booleans aren't indexable in IndexedDB, so filter in memory.
    const pending = await db.tickets.filter((t) => t.dirty).toArray();

    for (const ticket of pending) {
      try {
        const res = await fetch(`/api/genuka/orders/${ticket.id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metadata: {
              note: ticket.note || null,
              scanned_at: ticket.scannedAt,
              scanned_by: ticket.scannedBy,
            },
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // Re-read to avoid overwriting edits made during the request.
        const fresh = await db.tickets.get(ticket.id);
        if (
          fresh &&
          fresh.note === ticket.note &&
          fresh.scannedAt === ticket.scannedAt &&
          fresh.scanned === ticket.scanned
        ) {
          await db.tickets.update(ticket.id, {
            dirty: false,
            syncStatus: "synced",
            syncError: null,
          });
        }
        pushed += 1;
      } catch (err) {
        failed += 1;
        await db.tickets.update(ticket.id, {
          syncStatus: "error",
          syncError: err instanceof Error ? err.message : "Sync error",
        });
      }
    }
  } finally {
    pushing = false;
  }

  return { pushed, failed };
}
