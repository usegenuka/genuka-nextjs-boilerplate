import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";

export interface FormSectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// One block of a form, as in the dashboard: a bordered card with a small title,
// fields in one column on phones and two from sm.
function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={cn("rounded-lg border border-slate-200 bg-white p-4", className)}>
      <h2 className="text-sm font-medium text-slate-700">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

// "Options avancées": rare settings stay folded until asked for. Native <details>, no JavaScript needed.
function AdvancedOptions({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <details className={cn("group col-span-full", className)}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-700 [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-3 grid grid-cols-1 gap-4 rounded-md border border-slate-100 bg-slate-50 p-3 sm:grid-cols-2">
        {children}
      </div>
    </details>
  );
}

export { AdvancedOptions, FormSection };
