import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";

export interface StepsProps {
  steps: { key: string; label: React.ReactNode }[];
  /** Index of the current step, from 0. */
  current: number;
  label: string;
  className?: string;
}

// The dashboard's stepper, for a wizard (setup, import): small numbered circles, orange for the current
// and finished steps, a tick on finished ones, thin lines between them. Labels hide on phones except the current one.
function Steps({ steps, current, label, className }: StepsProps) {
  return (
    <ol aria-label={label} className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.key} aria-current={active ? "step" : undefined} className="flex min-w-0 flex-1 items-center gap-2 last:flex-none">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                done || active ? "bg-primary text-white" : "bg-slate-100 text-slate-500",
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                "truncate text-sm",
                active ? "font-medium text-slate-700" : "hidden text-slate-500 sm:inline",
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && <span aria-hidden className={cn("h-px min-w-4 flex-1", done ? "bg-primary" : "bg-slate-200")} />}
          </li>
        );
      })}
    </ol>
  );
}

export { Steps };
