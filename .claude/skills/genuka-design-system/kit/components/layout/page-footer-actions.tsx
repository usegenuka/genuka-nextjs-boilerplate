import * as React from "react";

import { cn } from "@/lib/cn";

// The dashboard's PageFooterActions: the form's buttons pinned at the bottom, within thumb reach on a phone.
// Put it last inside AppShell's <main>: Cancel (secondary) first, the primary action last. Its negative margins
// cancel exactly AppShell's padding (px-2, px-6 from md): change both together.
function PageFooterActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 -mx-2 -mb-6 mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-2 py-3 sm:flex-row sm:justify-end md:-mx-6 md:px-6 [&>*]:w-full sm:[&>*]:w-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { PageFooterActions };
