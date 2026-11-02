import * as React from "react";

import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  /** An element: `<Users />`. */
  icon: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** What to do next: create the first item, clear the filters. */
  action?: React.ReactNode;
  className?: string;
}

// The dashboard's empty list (DataTable): a grey circle with a thin icon, a medium title, a short hint, one action.
function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 px-4 py-16 text-center md:py-20", className)}>
      <span aria-hidden className="flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 [&_svg]:size-7 [&_svg]:stroke-[1.3]">
        {icon}
      </span>
      <div className="max-w-sm">
        <p className="text-base font-medium text-slate-600">{title}</p>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export { EmptyState };
