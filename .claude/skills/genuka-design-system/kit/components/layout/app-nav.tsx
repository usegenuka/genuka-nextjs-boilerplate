"use client";

import * as React from "react";

import { cn } from "@/lib/cn";
import { Link, usePathname } from "@/lib/navigation";

export interface AppNavItem {
  href: string;
  label: string;
  /** An element, not a component: `<Users />` (the layout is a server component). */
  icon?: React.ReactNode;
  /** Active on the exact path only (the home page), not on its sub-pages. */
  exact?: boolean;
  /** Other path prefixes that keep this tab active: the pages grouped under it ("/rooms", "/coaches"). */
  match?: string[];
}

export interface AppNavProps {
  items: AppNavItem[];
  /** App logo and name, shown only when the app is opened outside Genuka ("Ouvrir en plein écran"). */
  brand?: React.ReactNode;
  /** One discreet link (help) on the right, from md only: on phones the bar holds nothing but the tabs. */
  actions?: React.ReactNode;
  label: string;
}

const subscribe = () => () => {};
const isStandalone = () => window.self === window.top;
// On the server we cannot know: render as embedded, the common case.
const embeddedOnServer = () => false;

const startsWith = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

function isActive(pathname: string, item: AppNavItem) {
  if (item.exact) return pathname === item.href;
  return [item.href, ...(item.match ?? [])].some((prefix) => startsWith(pathname, prefix));
}

// The app's own navigation. Genuka already draws its sidebar on the left and the app's name and Menu above
// the iframe: the app adds only this bar of underline tabs, never a second sidebar. The bottom line is an inset
// shadow because the scrolling row would clip a border overlapping it.
function AppNav({ items, brand, actions, label }: AppNavProps) {
  const pathname = usePathname();
  const standalone = React.useSyncExternalStore(subscribe, isStandalone, embeddedOnServer);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-[inset_0_-1px_0_var(--color-slate-200)]">
      {standalone && brand && (
        <div className="flex h-14 items-center gap-3 border-b border-slate-100 px-2 md:px-6">{brand}</div>
      )}
      <div className="flex items-center gap-2 md:px-4">
        <nav aria-label={label} className="hide-scrollbar flex min-w-0 flex-1 overflow-x-auto">
          {items.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors [&_svg]:size-4 [&_svg]:shrink-0",
                  active
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-slate-500 hover:bg-primary/5 hover:text-slate-800",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        {actions && <div className="hidden shrink-0 items-center gap-1 md:flex">{actions}</div>}
      </div>
    </header>
  );
}

export { AppNav };
