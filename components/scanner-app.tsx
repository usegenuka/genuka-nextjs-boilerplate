"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  db,
  getSetting,
  setSetting,
  markScanned,
  clearLocalData,
} from "@/lib/db";
import { pullAllOrders, pushDirtyTickets, type PullProgress } from "@/lib/sync";
import { parseOrderId } from "@/lib/qr";
import { QrScanner } from "@/components/qr-scanner";
import { TicketSheet } from "@/components/ticket-sheet";
import { TicketsList } from "@/components/tickets-list";

type Tab = "scan" | "list" | "settings";

interface ScanResult {
  ticketId: string | null;
  notFoundId: string | null;
  alreadyScanned: boolean;
}

interface ScannerAppProps {
  companyName: string;
}

export function ScannerApp({ companyName }: ScannerAppProps) {
  const [tab, setTab] = useState<Tab>("scan");
  const [agent, setAgent] = useState<string>("");
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState<PullProgress | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const agentRef = useRef("");

  // Live stats
  const total = useLiveQuery(() => db.tickets.count(), []) ?? 0;
  const scanned =
    useLiveQuery(() => db.tickets.filter((t) => t.scanned).count(), []) ?? 0;
  const dirtyCount =
    useLiveQuery(() => db.tickets.filter((t) => t.dirty).count(), []) ?? 0;

  const runSync = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setSyncError("Hors ligne — synchronisation impossible.");
      return;
    }
    setSyncing(true);
    setSyncError(null);
    try {
      await pushDirtyTickets();
      await pullAllOrders((p) => setProgress(p));
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "Échec de la synchro");
    } finally {
      setSyncing(false);
      setProgress(null);
    }
  }, []);

  // Initial load: agent name + first sync.
  useEffect(() => {
    (async () => {
      const saved = (await getSetting("agent")) ?? "";
      setAgent(saved);
      agentRef.current = saved;
      const count = await db.tickets.count();
      if (count === 0 && navigator.onLine) {
        runSync();
      }
    })();
  }, [runSync]);

  // Online/offline tracking + push when back online.
  useEffect(() => {
    setOnline(navigator.onLine);
    const goOnline = () => {
      setOnline(true);
      pushDirtyTickets();
    };
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Periodically flush pending changes.
  useEffect(() => {
    const id = setInterval(() => pushDirtyTickets(), 20000);
    return () => clearInterval(id);
  }, []);

  const handleScan = useCallback(async (text: string) => {
    const id = parseOrderId(text);
    if (!id) return;

    const ticket = await db.tickets.get(id);
    if (!ticket) {
      navigator.vibrate?.(300);
      setResult({ ticketId: null, notFoundId: id, alreadyScanned: false });
      return;
    }

    if (ticket.scanned) {
      navigator.vibrate?.([120, 80, 120]);
      setResult({ ticketId: id, notFoundId: null, alreadyScanned: true });
      return;
    }

    await markScanned(id, agentRef.current || null);
    navigator.vibrate?.(60);
    pushDirtyTickets();
    setResult({ ticketId: id, notFoundId: null, alreadyScanned: false });
  }, []);

  const saveAgent = async (value: string) => {
    setAgent(value);
    agentRef.current = value;
    await setSetting("agent", value);
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-zinc-950 text-zinc-100">
      {/* Header / stats */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500">{companyName}</div>
            <div className="text-lg font-bold tracking-tight">MboaTickets</div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                online ? "bg-emerald-500" : "bg-zinc-600"
              }`}
            />
            <span className="text-zinc-400">
              {online ? "En ligne" : "Hors ligne"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 rounded-xl bg-zinc-900 px-3 py-2 ring-1 ring-white/10">
            <div className="text-2xl font-bold leading-none text-emerald-400">
              {scanned}
              <span className="text-base text-zinc-500"> / {total}</span>
            </div>
            <div className="text-xs text-zinc-500">Entrées validées</div>
          </div>
          <button
            onClick={runSync}
            disabled={syncing}
            className="rounded-xl bg-zinc-900 px-3 py-2 text-sm ring-1 ring-white/10 disabled:opacity-50"
          >
            {syncing ? "Synchro…" : "↻ Synchroniser"}
            {dirtyCount > 0 && (
              <span className="ml-1 text-amber-400">({dirtyCount})</span>
            )}
          </button>
        </div>

        {progress && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-sky-500 transition-all"
              style={{
                width: `${
                  progress.lastPage
                    ? (progress.page / progress.lastPage) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        )}
        {syncError && (
          <div className="mt-2 text-xs text-red-400">{syncError}</div>
        )}
      </header>

      {/* Body */}
      <main className="flex-1 p-4">
        {tab === "scan" && (
          <div className="space-y-4">
            <QrScanner active={tab === "scan"} onResult={handleScan} />
            <p className="text-center text-sm text-zinc-500">
              Visez le QR code du billet
              {!agent && (
                <>
                  {" · "}
                  <button
                    onClick={() => setTab("settings")}
                    className="text-sky-400 underline"
                  >
                    définir votre nom d&apos;agent
                  </button>
                </>
              )}
            </p>
          </div>
        )}

        {tab === "list" && (
          <TicketsList
            onOpen={(id) =>
              setResult({
                ticketId: id,
                notFoundId: null,
                alreadyScanned: false,
              })
            }
          />
        )}

        {tab === "settings" && (
          <Settings
            agent={agent}
            onSaveAgent={saveAgent}
            onResync={runSync}
            companyName={companyName}
          />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 z-20 grid grid-cols-3 border-t border-white/10 bg-zinc-950/95 backdrop-blur">
        {(
          [
            ["scan", "Scanner", "⌖"],
            ["list", "Billets", "≣"],
            ["settings", "Réglages", "⚙"],
          ] as [Tab, string, string][]
        ).map(([value, label, icon]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex flex-col items-center gap-0.5 py-3 text-xs ${
              tab === value ? "text-sky-400" : "text-zinc-500"
            }`}
          >
            <span className="text-lg leading-none">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      {/* Result sheet */}
      {result && (
        <TicketSheet
          ticketId={result.ticketId}
          notFoundId={result.notFoundId}
          alreadyScanned={result.alreadyScanned}
          onClose={() => setResult(null)}
        />
      )}
    </div>
  );
}

function Settings({
  agent,
  onSaveAgent,
  onResync,
  companyName,
}: {
  agent: string;
  onSaveAgent: (v: string) => void;
  onResync: () => void;
  companyName: string;
}) {
  const [value, setValue] = useState(agent);
  const [prevAgent, setPrevAgent] = useState(agent);
  // Sync local input when the saved agent changes (render-time reset).
  if (agent !== prevAgent) {
    setPrevAgent(agent);
    setValue(agent);
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-400">
          Nom de l&apos;agent / porte
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => onSaveAgent(value.trim())}
          placeholder="Ex: Entrée principale, Awa…"
          className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-sky-500"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Enregistré avec chaque validation (metadata.scanned_by).
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={onResync}
          className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold"
        >
          Forcer une synchronisation
        </button>
        <button
          onClick={async () => {
            if (confirm("Effacer toutes les données locales non synchronisées ?")) {
              await clearLocalData();
              onResync();
            }
          }}
          className="w-full rounded-xl bg-zinc-800 py-3 text-sm text-red-400 ring-1 ring-white/10"
        >
          Réinitialiser les données locales
        </button>
      </div>

      <div className="text-center text-xs text-zinc-600">
        {companyName} · MboaTickets
      </div>
    </div>
  );
}
