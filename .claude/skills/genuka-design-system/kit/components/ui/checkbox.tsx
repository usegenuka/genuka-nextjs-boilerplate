import * as React from "react";

import { cn } from "@/lib/cn";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

// The dashboard's checkbox (with @tailwindcss/forms): a 16px box, slate border, rounded,
// orange with a white tick when checked, its label on the right in slate-600.
function Checkbox({ label, description, className, id, ...props }: CheckboxProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const box = (
    <span className={cn("relative inline-flex size-4 shrink-0", className)}>
      <input
        id={inputId}
        type="checkbox"
        className="peer size-4 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-slate-100"
        {...props}
      />
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute inset-0 hidden size-4 fill-white peer-checked:block"
      >
        <path d="M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z" />
      </svg>
    </span>
  );
  if (label == null) return box;

  return (
    <label htmlFor={inputId} className="flex cursor-pointer items-start gap-2 text-sm text-slate-600">
      <span className="flex h-5 items-center">{box}</span>
      <span>
        {label}
        {description && <span className="block text-xs text-slate-500">{description}</span>}
      </span>
    </label>
  );
}

export { Checkbox };
