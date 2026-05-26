"use client";

import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

type Filter = "all" | "scanned" | "pending";

interface TicketsListProps {
  onOpen: (ticketId: string) => void;
}

export function TicketsList({ onOpen }: TicketsListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const tickets = useLiveQuery(
    () => db.tickets.orderBy("updatedAt").reverse().toArray(),
    []
  );

  const filtered = useMemo(() => {
    if (!tickets) return [];
    const q = query.trim().toLowerCase();
    return tickets.filter((t) => {
      if (filter === "scanned" && !t.scanned) return false;
      if (filter === "pending" && t.scanned) return false;
      if (!q) return true;
      return (
        (t.reference ?? "").toLowerCase().includes(q) ||
        (t.customerName ?? "").toLowerCase().includes(q) ||
        (t.customerPhone ?? "").toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    });
  }, [tickets, query, filter]);

  return (
    <div className="flex flex-col gap-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher (nom, référence, téléphone…)"
        className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-sky-500"
      />

      <div className="flex gap-2 text-sm">
        {(
          [
            ["all", "Tous"],
            ["pending", "Non scannés"],
            ["scanned", "Scannés"],
          ] as [Filter, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-full px-3 py-1.5 ring-1 transition ${
              filter === value
                ? "bg-sky-600 text-white ring-sky-500"
                : "bg-zinc-800 text-zinc-400 ring-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-white/5 overflow-hidden rounded-xl ring-1 ring-white/10">
        {filtered.length === 0 && (
          <li className="p-6 text-center text-sm text-zinc-500">
            Aucun billet.
          </li>
        )}
        {filtered.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => onOpen(t.id)}
              className="flex w-full items-center gap-3 bg-zinc-900 p-3 text-left active:bg-zinc-800"
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  t.scanned ? "bg-emerald-500" : "bg-zinc-600"
                }`}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-100">
                  {t.customerName || "Client anonyme"}
                </span>
                <span className="block truncate text-xs text-zinc-500">
                  {t.reference || t.id}
                  {t.note ? ` · 📝 ${t.note}` : ""}
                </span>
              </span>
              {t.dirty && (
                <span className="shrink-0 text-xs text-amber-400">●</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
