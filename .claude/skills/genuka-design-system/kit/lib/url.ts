// List state lives in the URL (search, filters, sort, page): links must keep what is already there.

export type SearchParams = Record<string, string | string[] | undefined>;

/** The list's URL with some params changed; `undefined` or "" removes one. Changing a filter resets the page. */
export function hrefWith(pathname: string, current: SearchParams, changes: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    for (const item of Array.isArray(value) ? value : [value]) if (item) params.append(key, item);
  }
  if (!("page" in changes)) params.delete("page");
  for (const [key, value] of Object.entries(changes)) {
    params.delete(key);
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/** "?sort=-spent" → { key: "spent", direction: "desc" }. */
export function parseSort(value: string | string[] | undefined, fallback: string) {
  const raw = (Array.isArray(value) ? value[0] : value) || fallback;
  return raw.startsWith("-")
    ? { key: raw.slice(1), direction: "desc" as const }
    : { key: raw, direction: "asc" as const };
}

/** "?page=3" → 3, clamped to 1…pageCount. */
export function parsePage(value: string | string[] | undefined, pageCount: number) {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) ? Math.min(Math.max(page, 1), Math.max(pageCount, 1)) : 1;
}

/** The params to keep as hidden fields in a GET form (search, filters) besides the ones it edits. */
export function keptParams(current: SearchParams, edited: string[]): [string, string][] {
  return Object.entries(current).flatMap(([key, value]) =>
    edited.includes(key) || key === "page"
      ? []
      : (Array.isArray(value) ? value : [value]).filter((v): v is string => Boolean(v)).map((v): [string, string] => [key, v]),
  );
}
