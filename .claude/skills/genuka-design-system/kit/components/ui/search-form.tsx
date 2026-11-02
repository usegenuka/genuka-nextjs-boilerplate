import * as React from "react";

import { Search } from "./search";

/** The URL params a GET form must carry along (current filters, sort): see keptParams in lib/url.ts. */
function HiddenFields({ params }: { params: [string, string][] }) {
  return (
    <>
      {params.map(([name, value], index) => (
        <input key={`${name}-${index}`} type="hidden" name={name} value={value} />
      ))}
    </>
  );
}

export interface SearchFormProps {
  /** Accessible name; the field has no visible label, as in the dashboard's toolbars. */
  label: string;
  placeholder?: string;
  name?: string;
  defaultValue?: string;
  /** Params to keep (filters, sort), from keptParams(searchParams, [name]). */
  keep?: [string, string][];
  /** Under the field: the total ("1 248 au total"). */
  total?: React.ReactNode;
}

// The search of a list's toolbar: a GET form, so `?q=` lands in the URL with the other params kept,
// and it works without JavaScript. Enter submits.
function SearchForm({ label, placeholder, name = "q", defaultValue, keep = [], total }: SearchFormProps) {
  return (
    <form role="search" method="get" className="flex flex-col gap-1.5">
      <HiddenFields params={keep} />
      <Search name={name} defaultValue={defaultValue} placeholder={placeholder} aria-label={label} />
      {total != null && (
        <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-100 px-1.5 text-xs font-medium text-slate-600">
          {total}
        </span>
      )}
    </form>
  );
}

export { HiddenFields, SearchForm };
