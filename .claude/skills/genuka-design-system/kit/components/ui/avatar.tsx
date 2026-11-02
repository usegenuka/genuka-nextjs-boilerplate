/* eslint-disable @next/next/no-img-element -- photos come from Genuka's CDN, any size */
import * as React from "react";

import { cn } from "@/lib/cn";

export interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  /** Second line under the name (phone, email, role). */
  tagline?: React.ReactNode;
  /** Only the round picture, without the name. */
  hideName?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-base" };

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase() || "?";
}

// The dashboard's avatar: round picture, green initials when there is no photo, name and tagline on the right.
function Avatar({ name, photoUrl, tagline, hideName, size = "md", className }: AvatarProps) {
  const picture = photoUrl ? (
    <img src={photoUrl} alt="" className={cn("shrink-0 rounded-full bg-slate-50 object-cover", SIZES[size])} />
  ) : (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-emerald-100 font-medium text-emerald-800",
        SIZES[size],
      )}
    >
      {initialsOf(name)}
    </span>
  );
  if (hideName) {
    return (
      <span className={cn("inline-flex", className)} title={name}>
        {picture}
        <span className="sr-only">{name}</span>
      </span>
    );
  }

  return (
    <span className={cn("flex min-w-0 items-center gap-3", className)}>
      {picture}
      <span className="min-w-0">
        <span className="line-clamp-1 text-sm font-medium text-slate-700">{name}</span>
        {tagline && <span className="line-clamp-1 text-xs text-slate-500">{tagline}</span>}
      </span>
    </span>
  );
}

export { Avatar };
