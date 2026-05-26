"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, setNote, unscan } from "@/lib/db";
import { pushDirtyTickets } from "@/lib/sync";
import type { GenukaOrder } from "@/types/order";

interface TicketSheetProps {
  /** Ticket id to display, or null to hide the sheet. */
  ticketId: string | null;
  /** When the lookup failed, the scanned id (shows a "not found" state). */
  notFoundId: string | null;
  /** True when this scan hit an already-scanned ticket (duplicate entry). */
  alreadyScanned: boolean;
  onClose: () => void;
}

function formatMoney(amount: number | null, currency: string | null) {
  if (amount == null) return "—";
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency || "XAF",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency ?? ""}`.trim();
  }
}

function formatTime(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function lineItems(order: GenukaOrder) {
  const products = new Map(
    (order.products ?? []).map((p) => [p.id, p.title ?? null])
  );
  return (order.order_products ?? []).map((op) => ({
    id: String(op.id),
    label:
      op.title ||
      (op.product_id ? products.get(op.product_id) : null) ||
      "Article",
    quantity: op.quantity,
    price: op.price,
  }));
}

export function TicketSheet({
  ticketId,
  notFoundId,
  alreadyScanned,
  onClose,
}: TicketSheetProps) {
  const ticket = useLiveQuery(
    () => (ticketId ? db.tickets.get(ticketId) : undefined),
    [ticketId]
  );

  const [noteDraft, setNoteDraft] = useState("");
  const [loadedId, setLoadedId] = useState<string | null>(null);

  // Initialise the note draft when a new ticket opens (render-time reset —
  // React's sanctioned pattern for deriving state from changing props).
  if (ticket && loadedId !== ticket.id) {
    setLoadedId(ticket.id);
    setNoteDraft(ticket.note);
  }

  // Debounced autosave of the note.
  useEffect(() => {
    if (!ticket || noteDraft === ticket.note) return;
    const t = setTimeout(async () => {
      await setNote(ticket.id, noteDraft);
      pushDirtyTickets();
    }, 600);
    return () => clearTimeout(t);
  }, [noteDraft, ticket]);

  if (!ticketId && !notFoundId) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Fermer"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="relative max-h-[85vh] overflow-y-auto rounded-t-3xl bg-zinc-900 p-5 pb-8 text-zinc-100 shadow-2xl ring-1 ring-white/10">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-zinc-700" />

        {/* Not found */}
        {notFoundId && !ticketId && (
          <div className="space-y-3 text-center">
            <div className="text-5xl">❓</div>
            <h2 className="text-xl font-semibold text-red-400">
              Billet introuvable
            </h2>
            <p className="text-sm text-zinc-400">
              Aucune commande locale ne correspond à&nbsp;
              <code className="break-all text-zinc-300">{notFoundId}</code>.
              Essayez de resynchroniser.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-zinc-700 py-3 font-medium"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Found */}
        {ticket && (
          <div className="space-y-4">
            {/* Status banner */}
            {alreadyScanned ? (
              <div className="rounded-xl bg-red-500/15 p-4 ring-1 ring-red-500/40">
                <div className="text-lg font-bold text-red-400">
                  ⚠️ Déjà scanné
                </div>
                <div className="text-sm text-red-200/80">
                  Première entrée le {formatTime(ticket.scannedAt)}
                  {ticket.scannedBy ? ` par ${ticket.scannedBy}` : ""}
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-500/15 p-4 ring-1 ring-emerald-500/40">
                <div className="text-lg font-bold text-emerald-400">
                  ✓ Entrée validée
                </div>
                <div className="text-sm text-emerald-200/80">
                  {formatTime(ticket.scannedAt)}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                {ticket.reference || ticket.id}
              </div>
              <h2 className="text-2xl font-semibold">
                {ticket.customerName || "Client anonyme"}
              </h2>
              {ticket.customerPhone && (
                <a
                  href={`tel:${ticket.customerPhone}`}
                  className="text-sm text-sky-400"
                >
                  {ticket.customerPhone}
                </a>
              )}
            </div>

            {/* Line items */}
            <div className="rounded-xl bg-zinc-800/60 p-3">
              <ul className="space-y-1.5 text-sm">
                {lineItems(ticket.order).map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <span className="text-zinc-300">
                      {item.quantity}× {item.label}
                    </span>
                    <span className="text-zinc-400">
                      {formatMoney(item.price, ticket.currency)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-semibold">
                <span>Total</span>
                <span>{formatMoney(ticket.amount, ticket.currency)}</span>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-400">
                Note
              </label>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={3}
                placeholder="Ajouter une note (ex: VIP, retard, table 4...)"
                className="w-full resize-none rounded-xl bg-zinc-800 p-3 text-sm outline-none ring-1 ring-white/10 focus:ring-sky-500"
              />
              <div className="mt-1 text-right text-xs text-zinc-500">
                {ticket.syncStatus === "synced" && "Synchronisé ✓"}
                {ticket.syncStatus === "pending" && "En attente de synchro…"}
                {ticket.syncStatus === "error" &&
                  `Erreur de synchro: ${ticket.syncError ?? ""}`}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await unscan(ticket.id);
                  pushDirtyTickets();
                }}
                className="flex-1 rounded-xl bg-zinc-700 py-3 text-sm font-medium"
              >
                Annuler l&apos;entrée
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-sky-600 py-3 text-sm font-semibold"
              >
                Terminer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
