"use client";

import { Upload } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";

export interface FileDropProps {
  /** Called with the files chosen or dropped. */
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Translated texts: what to do, and what is accepted ("PNG ou JPG, 5 Mo au plus"). */
  labels: { idle: string; active: string; hint?: string };
  className?: string;
}

// The dashboard's media drop zone: a dashed slate-300 frame with an upload icon; it turns blue while a file is
// dragged over it. A click opens the file picker, so it works on phones too.
function FileDrop({ onFiles, accept, multiple = false, disabled = false, labels, className }: FileDropProps) {
  const input = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={() => input.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          input.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) onFiles(Array.from(event.dataTransfer.files));
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        dragging ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:bg-slate-50",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <Upload aria-hidden className="size-6 text-slate-400" />
      <span className={cn("text-sm", dragging ? "text-blue-600" : "text-slate-600")}>{dragging ? labels.active : labels.idle}</span>
      {labels.hint && <span className="text-xs text-slate-500">{labels.hint}</span>}
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
    </div>
  );
}

export { FileDrop };
