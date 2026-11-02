import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges conditional class names and drops the Tailwind utilities that a later one overrides. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
