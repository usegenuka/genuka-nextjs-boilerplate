"use client";

import { ChevronDown, SearchIcon, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";
import { Checkbox } from "./checkbox";
import { fieldControlClass } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  id?: string;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  /** Translated texts. */
  labels: { placeholder: string; search: string; empty: string; remove: (label: string) => string };
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  className?: string;
}

// Several choices in one field (the dashboard uses react-select isMulti): the field looks like an Input,
// the chosen values are removable chips, the list opens with a search and checkboxes. Goes inside a Field.
function MultiSelect({ id, options, value, onValueChange, labels, className, ...aria }: MultiSelectProps) {
  const [query, setQuery] = React.useState("");
  const chosen = options.filter((option) => value.includes(option.value));
  const visible = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));
  const toggle = (optionValue: string) =>
    onValueChange(value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]);

  return (
    <Popover>
      <div className={cn("relative", className)}>
        <PopoverTrigger
          id={id}
          {...aria}
          className={cn(fieldControlClass, "flex min-h-9 flex-wrap items-center gap-1 pr-9 text-left sm:min-h-10")}
        >
          {chosen.length === 0 && <span className="text-slate-400">{labels.placeholder}</span>}
          {chosen.map((option) => (
            <span key={option.value} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
              {option.label}
            </span>
          ))}
        </PopoverTrigger>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 stroke-[1.3] text-slate-500" />
      </div>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-64 p-2">
        <label className="flex items-center gap-2 border-b border-slate-100 px-2 pb-2">
          <SearchIcon aria-hidden className="size-4 stroke-[1.3] text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.search}
            aria-label={labels.search}
            className="w-full bg-transparent py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="mt-2 max-h-60 overflow-y-auto">
          {visible.length === 0 && <p className="px-2 py-3 text-center text-sm text-slate-400">{labels.empty}</p>}
          {visible.map((option) => (
            <div key={option.value} className="rounded-lg p-2 hover:bg-slate-100">
              <Checkbox checked={value.includes(option.value)} onChange={() => toggle(option.value)} label={option.label} />
            </div>
          ))}
        </div>
        {chosen.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 border-t border-slate-100 px-2 pt-2">
            {chosen.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggle(option.value)}
                aria-label={labels.remove(option.label)}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-200"
              >
                {option.label}
                <X className="size-3" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
