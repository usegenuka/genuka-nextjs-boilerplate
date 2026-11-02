import * as React from "react";

import { cn } from "@/lib/cn";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Right side of the header: a "Voir tout" link, a small button. */
  action?: React.ReactNode;
  as?: "section" | "div" | "article" | "aside";
}

// The dashboard's panel (customer detail panels): white, slate-200 border, rounded-md,
// shadow-sm, p-4; the title is small and medium weight, never a big heading.
function Card({ title, description, action, as: Tag = "section", className, children, ...props }: CardProps) {
  const hasHeader = title != null || description != null || action != null;
  return (
    <Tag className={cn("rounded-md border border-slate-200 bg-white p-4 shadow-sm", className)} {...props}>
      {hasHeader && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title != null && <h3 className="text-sm font-medium text-slate-700">{title}</h3>}
            {description != null && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Tag>
  );
}

export { Card };
