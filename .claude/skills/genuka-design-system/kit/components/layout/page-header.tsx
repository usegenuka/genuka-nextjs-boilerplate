import { ChevronLeft } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";
import { Link } from "@/lib/navigation";

export interface PageHeaderProps {
  title: React.ReactNode;
  /** One sentence under the title: what the page is for. */
  description?: React.ReactNode;
  /** Link back to the parent list, on detail and form pages. */
  back?: { href: string; label: string };
  /** Badges next to the title (status of the record). */
  badges?: React.ReactNode;
  /** The page's buttons: the primary one last. They stack full width on phones. */
  actions?: React.ReactNode;
  className?: string;
}

// The dashboard's page title: text-base, text-xl from md, semibold slate-800, the only h1 of the page.
function PageHeader({ title, description, back, badges, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="mb-2 inline-flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-primary"
          >
            <ChevronLeft className="size-4" aria-hidden />
            {back.label}
          </Link>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="min-w-0 break-words text-base font-semibold text-slate-800 md:text-xl">{title}</h1>
          {badges}
        </div>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center md:justify-end [&>*]:w-full sm:[&>*]:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}

export { PageHeader };
