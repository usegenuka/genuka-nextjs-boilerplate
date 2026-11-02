// Example: app/not-found.tsx (and app/(app)/not-found.tsx), the "page not found" page.
import { SearchX } from "lucide-react";

import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

export default function NotFound() {
  return (
    <StatusPage
      icon={<SearchX />}
      title="Page introuvable"
      description="Cette page n'existe pas ou a été déplacée."
      actions={
        <Button asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      }
    />
  );
}
