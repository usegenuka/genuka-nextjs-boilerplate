import * as React from "react";

import { cn } from "@/lib/cn";

// Frame of every authenticated page: the AppNav on top, then the page on the white canvas. Genuka zeroes the
// padding of its <main> around the iframe, so the app puts back the dashboard's own: px-2 py-6, px-6 from md.
// Pages add no outer padding or max width of their own (only forms center a max-w-3xl column).
function AppShell({ nav, children, className }: { nav: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {nav}
      <main className={cn("flex flex-1 flex-col px-2 py-6 md:px-6", className)}>{children}</main>
    </div>
  );
}

export { AppShell };
