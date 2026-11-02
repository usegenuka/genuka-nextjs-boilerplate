import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";
import { fieldControlClass } from "./input";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  /** First, empty choice ("Choisir…"). */
  placeholder?: string;
}

// A native select, as in the dashboard's forms: it opens the phone's own picker on Android and iOS.
function Select({ className, options, placeholder, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select className={cn(fieldControlClass, "appearance-none pr-9", className)} {...props}>
        {placeholder != null && <option value="">{placeholder}</option>}
        {options?.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 stroke-[1.3] text-slate-500"
      />
    </div>
  );
}

export { Select };
