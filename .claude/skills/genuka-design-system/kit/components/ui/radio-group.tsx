import * as React from "react";

import { cn } from "@/lib/cn";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  /** Accessible name of the group: usually the same text as the question above it. */
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** "list": one per line. "cards": framed options, the chosen one in orange (as in the dashboard). */
  variant?: "list" | "cards";
  className?: string;
}

// Native radios (keyboard and forms work as usual) drawn like the kit's Checkbox: a round box, orange when chosen.
function RadioGroup({ name, options, label, value, defaultValue, onValueChange, variant = "list", className }: RadioGroupProps) {
  const cards = variant === "cards";
  return (
    <div role="radiogroup" aria-label={label} className={cn(cards ? "grid gap-3 sm:grid-cols-2" : "flex flex-col gap-3", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-start gap-2 text-sm text-slate-600",
            cards &&
              "rounded-md border border-slate-200 p-3 transition-colors hover:bg-slate-50 has-[:checked]:border-primary has-[:checked]:bg-primary/5",
            option.disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <span className="flex h-5 items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              disabled={option.disabled}
              checked={value === undefined ? undefined : value === option.value}
              defaultChecked={defaultValue === undefined ? undefined : defaultValue === option.value}
              onChange={onValueChange ? () => onValueChange(option.value) : undefined}
              className="size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-slate-300 bg-white transition-colors checked:border-[5px] checked:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1"
            />
          </span>
          <span>
            <span className="text-slate-700">{option.label}</span>
            {option.description && <span className="block text-xs text-slate-500">{option.description}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

export { RadioGroup };
