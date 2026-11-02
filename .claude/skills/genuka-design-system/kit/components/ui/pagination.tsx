import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";
import { Link } from "@/lib/navigation";

export interface PaginationProps {
  page: number;
  pageCount: number;
  /** URL of a page, usually the same list with `?page=`. */
  hrefFor: (page: number) => string;
  /** Translated texts: the dashboard writes them through t("…", "English fallback"). */
  labels: { nav: string; first: string; previous: string; next: string; last: string; page: (page: number) => string };
  /** Under the numbers, on the left: "10 / 25 / 50 / 100 par page" or a count ("Affichés : 10 sur 48"). */
  aside?: React.ReactNode;
}

const itemClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm text-slate-800 transition-colors hover:bg-slate-50";

/** The pages around the current one, with the first and last always shown: 1 … 4 5 6 … 12. */
function windowOf(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["gap" as const, p] : [p]));
}

// The dashboard's DataTable pagination: first / previous, page numbers with the current one framed,
// next / last. Plain links, so the page lives in the URL and it works without JavaScript.
function Pagination({ page, pageCount, hrefFor, labels, aside }: PaginationProps) {
  if (pageCount <= 1) return aside ? <div className="text-sm text-slate-500">{aside}</div> : null;

  const edge = (target: number, disabled: boolean, label: string, icon: React.ReactNode) =>
    disabled ? (
      <span aria-hidden className={cn(itemClass, "pointer-events-none text-slate-300")}>
        {icon}
      </span>
    ) : (
      <Link href={hrefFor(target)} className={itemClass}>
        {icon}
        <span className="sr-only">{label}</span>
      </Link>
    );

  return (
    <div className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
      <div className="text-sm text-slate-500">{aside}</div>
      <nav aria-label={labels.nav} className="flex items-center gap-1">
        {edge(1, page <= 1, labels.first, <ChevronsLeft className="size-4" aria-hidden />)}
        {edge(page - 1, page <= 1, labels.previous, <ChevronLeft className="size-4" aria-hidden />)}
        {windowOf(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={hrefFor(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={labels.page(p)}
              className={cn(itemClass, p === page && "bg-white font-medium shadow-sm ring-1 ring-slate-200")}
            >
              {p}
            </Link>
          ),
        )}
        {edge(page + 1, page >= pageCount, labels.next, <ChevronRight className="size-4" aria-hidden />)}
        {edge(pageCount, page >= pageCount, labels.last, <ChevronsRight className="size-4" aria-hidden />)}
      </nav>
    </div>
  );
}

export { Pagination };
