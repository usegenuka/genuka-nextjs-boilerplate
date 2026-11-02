// Formats as the Genuka dashboard shows them.
import currencies from "./currencies.json";

// { "XAF": ["FCFA", 0], … }: symbol and decimals of the 155 currencies the dashboard knows.
const CURRENCIES = currencies as unknown as Record<string, [symbol: string, precision: number]>;

/** 1234567.5 → "1 234 567.5": a plain space between thousands, in every language, as in the dashboard. */
function withSpaces(value: string) {
  const [integer, decimals] = value.split(".");
  return [integer.replace(/\B(?=(\d{3})+(?!\d))/g, " "), decimals].filter(Boolean).join(".");
}

/**
 * 15000, "XAF" → "15 000 FCFA": the amount, then the currency's symbol from the dashboard's table (never its code),
 * with the currency's decimals (none for XAF). `short` gives "1.25M FCFA" from 100 000 up, for KPIs.
 */
export function formatMoney(amount: number, currency: string, { short = false } = {}) {
  const [symbol, precision] = CURRENCIES[currency.toUpperCase()] ?? [currency.toUpperCase(), 2];
  const abs = Math.abs(amount);
  let number: string;
  if (short && abs >= 1e9) number = `${(amount / 1e9).toFixed(2)}B`;
  else if (short && abs >= 1e6) number = `${(amount / 1e6).toFixed(2)}M`;
  else if (short && abs >= 1e5) number = `${(amount / 1e3).toFixed(2)}K`;
  else number = amount.toFixed(precision);
  return `${withSpaces(number)} ${symbol}`;
}

/** "XAF" → "FCFA": the symbol to show after an amount or inside a price field (`trailing`). */
export function currencySymbol(currency: string) {
  return CURRENCIES[currency.toUpperCase()]?.[0] ?? currency.toUpperCase();
}

/** 3410 → "3 410". */
export function formatNumber(value: number, decimals = 0) {
  return withSpaces(value.toFixed(decimals));
}

/** "2 nov. 2026" in French, "Nov 2, 2026" in English. */
export function formatDate(date: Date | string, locale = "fr", timeZone?: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone }).format(new Date(date));
}

const AT: Record<string, string> = { fr: "à", en: "at", es: "a las" };

/**
 * "Aujourd'hui à 14:30", "Hier à 09:05", otherwise "2 nov. 2026 à 14:30", as the dashboard's formatDateTime.
 * Without `timeZone` the server's zone is used: pass the shop's zone, or format on the client.
 */
export function formatDateTime(date: Date | string, locale = "fr", timeZone?: string, now = new Date()) {
  const value = new Date(date);
  const day = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone, dateStyle: "short" }).format(d);
  const time = new Intl.DateTimeFormat(locale, { timeStyle: "short", timeZone }).format(value);
  const at = AT[locale.slice(0, 2)] ?? "·";
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
  if (day(value) === day(now)) return `${capitalize(relative.format(0, "day"))} ${at} ${time}`;
  if (day(value) === day(yesterday)) return `${capitalize(relative.format(-1, "day"))} ${at} ${time}`;
  return `${formatDate(value, locale, timeZone)} ${at} ${time}`;
}
