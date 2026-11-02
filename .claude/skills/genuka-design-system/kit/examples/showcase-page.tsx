"use client";

// Example: app/(app)/design-system/page.tsx, every component of the kit on one page, to compare with the
// dashboard after a change. Keep it out of the app's navigation.
import { Filter, Inbox, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { FileDrop } from "@/components/ui/file-drop";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup } from "@/components/ui/radio-group";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton, Spinner } from "@/components/ui/skeleton";
import { Steps } from "@/components/ui/steps";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ShowcasePage() {
  const [period, setPeriod] = useState("30");
  const [view, setView] = useState("list");
  const [confirming, setConfirming] = useState(false);
  const [categories, setCategories] = useState<string[]>(["pilates"]);

  return (
    <>
      <PageHeader title="Design system" description="Les composants du kit, tels que les verra le marchand." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Boutons">
          <div className="flex flex-wrap gap-2">
            <Button>
              <Plus aria-hidden />
              Principal
            </Button>
            <Button variant="outline">Contour</Button>
            <Button variant="secondary">Secondaire</Button>
            <Button variant="ghost">Discret</Button>
            <Button variant="danger">Supprimer</Button>
            <Button variant="ghostPrimary">Discret orange</Button>
            <Button disabled>Désactivé</Button>
            <Button variant="link">Lien</Button>
            <Button loading>Envoi</Button>
            <Button size="sm">Petit</Button>
          </div>
        </Card>

        <Card title="Pastilles de statut">
          <div className="flex flex-wrap gap-2">
            <Badge>Brouillon</Badge>
            <Badge tone="brand">Nouveau</Badge>
            <Badge tone="success">Payée</Badge>
            <Badge tone="warning">En attente</Badge>
            <Badge tone="danger">Annulée</Badge>
            <Badge tone="info">Expédiée</Badge>
          </div>
        </Card>

        <Card title="Sélecteurs">
          <div className="flex flex-col items-start gap-4">
            <SegmentedControl
              label="Période"
              variant="pills"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "7", label: "7 jours" },
                { value: "30", label: "30 jours" },
                { value: "90", label: "90 jours" },
              ]}
            />
            <SegmentedControl
              label="Affichage"
              value={view}
              onChange={setView}
              options={[
                { value: "list", label: "Liste" },
                { value: "grid", label: "Grille" },
              ]}
            />
          </div>
        </Card>

        <Card title="Retours et superpositions">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => toast.success("Client enregistré")}>
              Toast
            </Button>
            <Button variant="danger" onClick={() => setConfirming(true)}>
              <Trash2 aria-hidden />
              Confirmer
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">
                  <Filter aria-hidden />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                  <SheetDescription>Affinez la liste des clients.</SheetDescription>
                </SheetHeader>
                <Field label="Ville">
                  <Input />
                </Field>
                <SheetFooter>
                  <Button>Appliquer</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">Infobulle</Button>
              </TooltipTrigger>
              <TooltipContent>Un détail en plus, jamais la seule explication.</TooltipContent>
            </Tooltip>
          </div>
        </Card>

        <Card title="Bandeaux">
          <div className="flex flex-col gap-3">
            <Banner variant="info" title="Synchronisation en cours">Les commandes de Genuka arrivent.</Banner>
            <Banner variant="warning" action={<Button size="sm" variant="secondary">Configurer</Button>}>
              Aucun moyen de paiement en ligne n&apos;est activé.
            </Banner>
          </div>
        </Card>

        <Card title="Choix">
          <div className="flex flex-col gap-4">
            <RadioGroup
              name="mode"
              label="Mode de livraison"
              defaultValue="pickup"
              variant="cards"
              options={[
                { value: "pickup", label: "Retrait en boutique", description: "Gratuit" },
                { value: "delivery", label: "Livraison", description: "Sous 48 h" },
              ]}
            />
            <Field label="Catégories">
              <MultiSelect
                options={[
                  { value: "karate", label: "Karaté" },
                  { value: "pilates", label: "Pilates" },
                  { value: "hiphop", label: "Hip-hop" },
                ]}
                value={categories}
                onValueChange={setCategories}
                labels={{ placeholder: "Choisir", search: "Rechercher", empty: "Aucun résultat", remove: (label) => `Retirer ${label}` }}
              />
            </Field>
            <FileDrop
              accept="image/*"
              onFiles={(files) => toast.info(`${files.length} fichier(s)`)}
              labels={{ idle: "Glissez une image ou cliquez pour choisir", active: "Déposez l'image", hint: "PNG ou JPG, 5 Mo au plus" }}
            />
          </div>
        </Card>

        <Card title="Étapes">
          <Steps
            label="Configuration"
            current={1}
            steps={[
              { key: "shop", label: "Boutique" },
              { key: "rooms", label: "Salles" },
              { key: "offers", label: "Offres" },
            ]}
          />
        </Card>

        <Card title="Chargement">
          <div className="flex flex-col gap-3">
            <Spinner label="Chargement" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>

        <Card title="État vide">
          <EmptyState
            className="py-8 md:py-8"
            icon={<Inbox />}
            title="Aucune commande"
            description="Les commandes de vos clients apparaîtront ici."
            action={<Button>Créer une commande</Button>}
          />
        </Card>
      </div>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Supprimer ce client ?"
        description="Ses commandes restent dans Genuka, mais il ne pourra plus réserver depuis l'app."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        tone="danger"
        onConfirm={() => setConfirming(false)}
      />
    </>
  );
}
