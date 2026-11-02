"use client";

// Example: app/(app)/customers/new/page.tsx, a form page (one centered column with its title, sections,
// "Options avancées" folded, buttons pinned at the bottom, a toast after saving).
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";

import { PageFooterActions } from "@/components/layout/page-footer-actions";
import { PageHeader } from "@/components/layout/page-header";
import { AdvancedOptions, FormSection } from "@/components/layout/form-section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldValue } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { currencySymbol } from "@/lib/format";
import { useRouter } from "@/lib/navigation";

export default function NewCustomerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState<string>();
  const [notify, setNotify] = useState(true);
  const [phone, setPhone] = useState("");

  // onSubmit, not <form action>: React 19 empties a form after an action, and a failed form must stay filled.
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!String(form.get("name") ?? "").trim()) {
      setNameError("Saisissez le nom du client.");
      return;
    }
    setNameError(undefined);
    setSaving(true);
    // Call the app's API here; on failure: toast.error(...) and keep the form as it is.
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Client enregistré");
    router.push("/customers");
  }

  return (
    <form onSubmit={save} noValidate className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <PageHeader back={{ href: "/customers", label: "Clients" }} title="Nouveau client" className="mb-0" />
        <FormSection title="Identité" description="Ce qui s'affiche sur les factures et les messages.">
          <Field label="Nom complet" required error={nameError}>
            <Input name="name" autoComplete="name" />
          </Field>
          <Field label="Téléphone" hint="Le client reçoit ses reçus sur ce numéro.">
            <PhoneInput name="phone" value={phone} onChange={setPhone} />
          </Field>
          <Field label="Ville">
            <Select
              name="city"
              placeholder="Choisir une ville"
              options={[
                { value: "douala", label: "Douala" },
                { value: "yaounde", label: "Yaoundé" },
              ]}
            />
          </Field>
          <Field label="Plafond de crédit">
            <Input name="credit" type="number" inputMode="numeric" min={0} trailing={currencySymbol("XAF")} />
          </Field>
          <FieldValue label="Boutique">Demo Company</FieldValue>
        </FormSection>

        <FormSection title="Préférences">
          <div className="col-span-full flex flex-col gap-3">
            <Switch checked={notify} onCheckedChange={setNotify} label="Envoyer les reçus sur WhatsApp" />
            <Checkbox name="newsletter" label="Recevoir les promotions" description="Un message par mois au plus." />
          </div>
          <AdvancedOptions label="Options avancées">
            <Field label="Note interne" className="col-span-full">
              <Textarea name="note" />
            </Field>
          </AdvancedOptions>
        </FormSection>
      </div>

      <PageFooterActions>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" loading={saving}>
          Enregistrer
        </Button>
      </PageFooterActions>
    </form>
  );
}
