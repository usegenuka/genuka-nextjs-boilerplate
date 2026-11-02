import * as React from "react";

import { cn } from "@/lib/cn";

export interface StatusPageProps {
  /** An element: `<SearchX />`, `<Lock />`, `<CircleAlert />`. */
  icon: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** One or two buttons; the primary one last. */
  actions?: React.ReactNode;
  className?: string;
}

// The dashboard's 404 and error pages: centered on white, a semibold text-xl
// title, a light explanation, buttons side by side from md. Used by not-found, error and unauthorized.
function StatusPage({ icon, title, description, actions, className }: StatusPageProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-center bg-white px-4 py-16", className)}>
      <div className="flex w-full max-w-lg flex-col items-center gap-6 p-6 text-center md:p-10">
        <span aria-hidden className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:size-7">
          {icon}
        </span>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:justify-center">{actions}</div>}
      </div>
    </div>
  );
}

export { StatusPage };
