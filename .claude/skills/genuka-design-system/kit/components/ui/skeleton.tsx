import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";

// The dashboard's placeholders: a slate-100 block that pulses where the content will appear.
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn("animate-pulse rounded bg-slate-100", className)} {...props} />;
}

/** Small spinner for a button or a line that is loading; prefer a Skeleton for a whole area. */
function Spinner({ className, label }: { className?: string; label: string }) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 text-sm text-slate-500", className)}>
      <Loader2 className="size-4 animate-spin" aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { Skeleton, Spinner };
