"use client";

// Example: app/(app)/customers/[id]/customer-actions.tsx, the "Plus" menu of a detail page, whose dangerous item
// asks first in a ConfirmDialog. The page (a server component) renders <CustomerActions … /> in its PageHeader.
import { MoreHorizontal, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/lib/navigation";

export function CustomerActions({ customerId, phone }: { customerId: string; phone: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    setDeleting(true);
    // Call the app's API with customerId here; on failure: toast.error(...), setDeleting(false), keep the dialog.
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Client supprimé");
    router.push("/customers");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <MoreHorizontal aria-hidden />
            Plus
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <a href={`tel:${phone.replace(/\s/g, "")}`}>
              <Phone aria-hidden />
              Appeler
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* onSelect, not onClick: the menu closes first, then the dialog opens and takes the focus. */}
          <DropdownMenuItem destructive onSelect={() => setConfirming(true)}>
            <Trash2 aria-hidden />
            Supprimer le client
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Supprimer ce client ?"
        description={`Ses commandes restent dans Genuka, mais il disparaît de l'app (${customerId}).`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        tone="danger"
        loading={deleting}
        onConfirm={remove}
      />
    </>
  );
}
