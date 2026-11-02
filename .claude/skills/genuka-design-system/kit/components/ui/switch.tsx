"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: React.ReactNode;
}

// The dashboard's switch: h-5 w-9, orange when on, slate when off.
function Switch({ checked, onCheckedChange, label, className, disabled, ...props }: SwitchProps) {
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-slate-200",
        className,
      )}
      {...props}
    >
      <span
        className={cn("size-4 rounded-full bg-white shadow-sm transition-transform", checked && "translate-x-4")}
      />
    </button>
  );
  if (label == null) return control;

  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
      {control}
      {label}
    </label>
  );
}

export { Switch };
