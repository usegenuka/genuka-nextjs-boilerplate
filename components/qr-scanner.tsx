"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";

interface QrScannerProps {
  /** Called with the raw QR text. Same text within `cooldownMs` is ignored. */
  onResult: (text: string) => void;
  active: boolean;
  cooldownMs?: number;
}

/**
 * Continuous camera QR scanner (rear camera preferred). Re-emits a given code
 * at most once per `cooldownMs` to avoid spamming the result handler.
 */
export function QrScanner({ onResult, active, cooldownMs = 2500 }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastRef = useRef<{ text: string; at: number }>({ text: "", at: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const reader = new BrowserQRCodeReader();

    (async () => {
      try {
        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: "environment" } } },
          videoRef.current!,
          (result) => {
            if (!result) return;
            const text = result.getText();
            const now = Date.now();
            if (
              text === lastRef.current.text &&
              now - lastRef.current.at < cooldownMs
            ) {
              return;
            }
            lastRef.current = { text, at: now };
            onResult(text);
          }
        );
        if (cancelled) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible d'accéder à la caméra"
        );
      }
    })();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [active, onResult, cooldownMs]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        playsInline
      />
      {/* Reticle */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-2/3 w-2/3 rounded-2xl border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
      </div>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
