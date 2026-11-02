"use client";

// Example: app/(app)/error.tsx, shown when a page throws. Say what happened in plain words and offer to retry.
import { CircleAlert } from "lucide-react";

import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export default function PageError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatusPage
      icon={<CircleAlert />}
      title="Un problème est survenu"
      description="La page n'a pas pu s'afficher. Réessayez ; si le problème continue, contactez le support."
      actions={<Button onClick={reset}>Réessayer</Button>}
    />
  );
}
