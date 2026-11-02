import * as React from "react";

import { cn } from "@/lib/cn";
import { Link } from "@/lib/navigation";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  /** A link tab (sub-pages); without it the tab is a button calling onChange. */
  href?: string;
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  /** Accessible name of the tab bar. */
  label: string;
}

// The dashboard's underline tabs (customer detail, reports): a slate-200 bottom line, the active tab
// in orange with a 2px underline. The bar scrolls sideways on small screens instead of wrapping; the line is an
// inset shadow because a scrolling row would clip a border overlapping it.
// Link tabs (sub-pages) are a <nav>; button tabs (state in the page) are a tablist. Use button tabs from a client
// component only: they call onChange.
function Tabs({ items, value, onChange, className, label }: TabsProps) {
  const links = items.some((item) => item.href);
  const Bar = links ? "nav" : "div";
  return (
    <Bar
      aria-label={label}
      role={links ? undefined : "tablist"}
      className={cn("hide-scrollbar flex overflow-x-auto shadow-[inset_0_-1px_0_var(--color-slate-200)]", className)}
    >
      {items.map((item) => {
        const active = item.value === value;
        const classes = cn(
          "inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "border-primary text-primary"
            : "border-transparent text-slate-500 hover:bg-primary/5 hover:text-slate-700",
        );
        const content = (
          <>
            {item.label}
            {item.count != null && (
              <span className="rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-600">{item.count}</span>
            )}
          </>
        );
        return item.href ? (
          <Link key={item.value} href={item.href} aria-current={active ? "page" : undefined} className={classes}>
            {content}
          </Link>
        ) : (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(item.value)}
            className={classes}
          >
            {content}
          </button>
        );
      })}
    </Bar>
  );
}

export { Tabs };
