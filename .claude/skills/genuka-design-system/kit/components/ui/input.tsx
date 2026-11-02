import * as React from "react";

import { cn } from "@/lib/cn";

// Recipe of the dashboard's text field: no border, a light inset ring that turns orange
// on focus, rounded-md, text-sm, dark value text, 36px high on phones and 40px from sm. Shared by Input,
// Textarea and Select. A field the user cannot change is shown with FieldValue, not as a greyed input.
export const fieldControlClass =
  "block w-full rounded-md border-0 bg-white px-2 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 aria-invalid:ring-red-500 sm:leading-6";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Shown inside the field on the left (an icon, a country code). */
  leading?: React.ReactNode;
  /** Shown inside the field on the right (a currency symbol, a unit). */
  trailing?: React.ReactNode;
}

function Input({ className, leading, trailing, type = "text", ...props }: InputProps) {
  const input = (
    <input
      type={type}
      className={cn(fieldControlClass, leading != null && "pl-10", trailing != null && "pr-16", className)}
      {...props}
    />
  );
  if (leading == null && trailing == null) return input;

  return (
    <div className="relative">
      {leading != null && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-500 [&_svg]:size-4 [&_svg]:stroke-[1.3]">
          {leading}
        </span>
      )}
      {input}
      {trailing != null && (
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-slate-500">
          {trailing}
        </span>
      )}
    </div>
  );
}

export { Input };
