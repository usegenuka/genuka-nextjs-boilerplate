"use client";

import Dexie, { type Table } from "dexie";
import type { GenukaOrder, LocalTicket } from "@/types/order";

/** Local-only key/value settings (agent name, last sync time, ...). */
export interface Setting {
  key: string;
  value: string;
}

class MboaTicketsDB extends Dexie {
  tickets!: Table<LocalTicket, string>;
  settings!: Table<Setting, string>;

  constructor() {
    super("mboatickets");
    this.version(1).stores({
      // Only valid IndexedDB key types are indexed (booleans cannot be keys);
      // scanned/dirty are filtered in memory.
      tickets: "id, reference, updatedAt",
      settings: "key",
    });
  }
}

export const db = new MboaTicketsDB();

function fullName(c: GenukaOrder["customer"]): string | null {
  if (!c) return null;
  const name = [c.first_name, c.last_name].filter(Boolean).join(" ").trim();
  return name || c.email || c.phone || null;
}

/**
 * Insert/refresh tickets from a Genuka sync, **without** discarding local scan
 * state. Server metadata (note/scanned_*) is treated as the source of truth on
 * first import, but a locally dirty ticket keeps its un-pushed changes.
 */
export async function upsertTicketsFromOrders(orders: GenukaOrder[]) {
  await db.transaction("rw", db.tickets, async () => {
    for (const order of orders) {
      const existing = await db.tickets.get(order.id);
      const meta = order.metadata ?? {};

      if (existing?.dirty) {
        // Preserve local edits; only refresh the immutable order snapshot.
        await db.tickets.update(order.id, {
          order,
          reference: order.reference ?? existing.reference,
          customerName: fullName(order.customer) ?? existing.customerName,
          customerPhone: order.customer?.phone ?? existing.customerPhone,
          amount: order.amount ?? existing.amount,
          currency: order.currency ?? existing.currency,
        });
        continue;
      }

      const ticket: LocalTicket = {
        id: order.id,
        reference: order.reference ?? null,
        order,
        customerName: fullName(order.customer),
        customerPhone: order.customer?.phone ?? null,
        amount: order.amount ?? null,
        currency: order.currency ?? null,
        scanned: Boolean(meta.scanned_at),
        scannedAt: meta.scanned_at ?? null,
        scannedBy: meta.scanned_by ?? null,
        note: (meta.note as string) ?? "",
        dirty: false,
        syncStatus: "synced",
        syncError: null,
        updatedAt: meta.scanned_at ? Date.parse(meta.scanned_at) : 0,
      };
      await db.tickets.put(ticket);
    }
  });
}

/** Mark a ticket as scanned now (idempotent — keeps the first scan time). */
export async function markScanned(id: string, agent: string | null) {
  const ticket = await db.tickets.get(id);
  if (!ticket) return null;
  if (ticket.scanned) return ticket; // already scanned, no state change

  await db.tickets.update(id, {
    scanned: true,
    scannedAt: new Date().toISOString(),
    scannedBy: agent,
    dirty: true,
    syncStatus: "pending",
    syncError: null,
    updatedAt: Date.now(),
  });
  return db.tickets.get(id);
}

/** Update the free-text note for a ticket. */
export async function setNote(id: string, note: string) {
  await db.tickets.update(id, {
    note,
    dirty: true,
    syncStatus: "pending",
    syncError: null,
    updatedAt: Date.now(),
  });
}

/** Undo a scan locally (e.g. scanned by mistake). */
export async function unscan(id: string) {
  await db.tickets.update(id, {
    scanned: false,
    scannedAt: null,
    scannedBy: null,
    dirty: true,
    syncStatus: "pending",
    syncError: null,
    updatedAt: Date.now(),
  });
}

export async function getSetting(key: string): Promise<string | null> {
  const row = await db.settings.get(key);
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  await db.settings.put({ key, value });
}

export async function clearLocalData() {
  await db.transaction("rw", db.tickets, db.settings, async () => {
    await db.tickets.clear();
    await db.settings.where("key").notEqual("agent").delete();
  });
}
