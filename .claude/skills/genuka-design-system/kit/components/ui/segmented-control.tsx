"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export interface SegmentedControlProps<Value extends string> {
  options: { value: Value; label: React.ReactNode }[];
  value: Value;
  onChange: (value: Value) => void;
  /** "segmented": a framed switch (views, modes). "pills": rounded pills (periods: 7 j / 30 j / 90 j). */
  variant?: "segmented" | "pills";
  label: string;
  className?: string;
}

// Both shapes come from the dashboard: segmented (apps browser) and pills (period picker).
function SegmentedControl<Value extends string>({
  options,
  value,
  onChange,
  variant = "segmented",
  label,
  className,
}: SegmentedControlProps<Value>) {
  const pills = variant === "pills";
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        pills
          ? "hide-scrollbar flex items-center gap-2 overflow-x-auto"
          : "inline-flex rounded-lg border border-slate-200 bg-white p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "whitespace-nowrap font-medium transition-colors",
              pills ? "rounded-full px-3 py-1.5 text-sm" : "rounded-md px-3 py-1 text-xs",
              active && "bg-primary text-white",
              !active && (pills ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "text-slate-500 hover:text-slate-700"),
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export { SegmentedControl };
