// Example: app/unauthorized/page.tsx, where the boilerplate's proxy sends a visitor without a session.
// The app is opened from the Genuka dashboard, so the way back is there.
import { Lock } from "lucide-react";

import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <StatusPage
      icon={<Lock />}
      title="Session expirée"
      description="Ouvrez de nouveau l'application depuis votre tableau de bord Genuka, dans Applications installées."
      actions={
        <Button asChild>
          <a href="https://genuka.com" target="_top">
            Aller sur Genuka
          </a>
        </Button>
      }
    />
  );
}
