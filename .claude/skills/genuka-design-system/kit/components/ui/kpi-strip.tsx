import { Info, TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";
import { Link } from "@/lib/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

// The dashboard's KPI strip: one white strip, cells split by thin dividers, an icon in a tinted circle,
// a small label and a medium value. It scrolls sideways on small screens instead of wrapping.
const THEMES = {
  orange: "bg-primary-50 text-primary-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
  blue: "bg-blue-50 text-blue-600",
  red: "bg-red-50 text-red-600",
  slate: "bg-slate-100 text-slate-600",
} as const;

export interface Kpi {
  key: string;
  label: React.ReactNode;
  value: React.ReactNode;
  /** An element: `<Users />`. */
  icon: React.ReactNode;
  theme?: keyof typeof THEMES;
  /** Line under the value ("sur 30 jours", "12 en attente"). */
  secondary?: React.ReactNode;
  /** Change against the previous period, in percent; hidden when it is 0. */
  delta?: number;
  /** Explanation shown in a white panel on the (i) next to the label. Needs a TooltipProvider (root layout). */
  hint?: string;
  /** Makes the cell a link (to the filtered list). */
  href?: string;
}

function KpiStrip({ kpis, loading = false, className }: { kpis: Kpi[]; loading?: boolean; className?: string }) {
  return (
    <div className={cn("hide-scrollbar overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm", className)}>
      <div className="flex min-w-max divide-x divide-slate-100">
        {kpis.map((kpi) => {
          const cell = <KpiCell kpi={kpi} loading={loading} />;
          return kpi.href ? (
            <Link key={kpi.key} href={kpi.href} className="flex-1 transition-colors hover:bg-slate-50">
              {cell}
            </Link>
          ) : (
            <div key={kpi.key} className="flex-1">
              {cell}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KpiCell({ kpi, loading }: { kpi: Kpi; loading: boolean }) {
  const { label, value, icon, theme = "slate", secondary, delta, hint } = kpi;
  return (
    <div className="flex min-w-[180px] items-center gap-3 px-4 py-3 md:px-5 md:py-4">
      <span
        aria-hidden
        className={cn("flex size-10 shrink-0 items-center justify-center rounded-full [&_svg]:size-4", THEMES[theme])}
      >
        {icon}
      </span>
      <dl className="min-w-0">
        <dt className="flex items-center gap-1 text-xs text-slate-500">
          <span className="truncate">{label}</span>
          {hint && (
            <Tooltip>
              <TooltipTrigger className="text-slate-400 hover:text-slate-600">
                <Info className="size-3" aria-hidden />
                <span className="sr-only">{hint}</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[260px] border border-slate-200 bg-white p-3 leading-relaxed text-slate-600 shadow-lg">
                {hint}
              </TooltipContent>
            </Tooltip>
          )}
        </dt>
        <dd className="flex items-center gap-2 whitespace-nowrap text-sm font-medium tabular-nums text-slate-700 md:text-base">
          {loading ? <span className="inline-block h-5 w-16 animate-pulse rounded bg-slate-100" /> : value}
          {!loading && delta != null && delta !== 0 && <Delta value={delta} />}
        </dd>
        {secondary && <dd className="truncate text-xs text-slate-400">{secondary}</dd>}
      </dl>
    </div>
  );
}

function Delta({ value }: { value: number }) {
  const up = value > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
        up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600",
      )}
    >
      <Icon className="size-3" aria-hidden />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export { KpiStrip };
