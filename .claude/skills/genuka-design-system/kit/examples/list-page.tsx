// Example: app/(app)/customers/page.tsx, a list page (the dashboard's reference layout: KPIs, then the table).
// Search, filters, sort and page live in the URL; every link keeps the others (lib/url.ts).
import { Filter, Plus, ShoppingBag, UserPlus, Users, Wallet } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { Pagination } from "@/components/ui/pagination";
import { HiddenFields, SearchForm } from "@/components/ui/search-form";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatDate, formatMoney } from "@/lib/format";
import { Link } from "@/lib/navigation";
import { hrefWith, keptParams, parsePage, parseSort, type SearchParams } from "@/lib/url";

interface Customer {
  id: string;
  name: string;
  phone: string;
  orders: number;
  spent: number;
  status: "active" | "pending" | "blocked";
  createdAt: string;
}

// Replace with the customers read from Genuka, filtered, sorted and paginated on the server.
const CUSTOMERS: Customer[] = [
  { id: "1", name: "Awa Ndiaye", phone: "+237 6 00 00 00 00", orders: 12, spent: 184500, status: "active", createdAt: "2026-09-14" },
  { id: "2", name: "Jean-Paul Mbarga", phone: "+237 6 99 45 12 30", orders: 3, spent: 27000, status: "pending", createdAt: "2026-10-02" },
  { id: "3", name: "Fatou Diallo", phone: "+237 6 55 80 21 44", orders: 0, spent: 0, status: "blocked", createdAt: "2026-10-28" },
];

const PATH = "/customers";
const PAGE_SIZE = 10;

const STATUS: Record<Customer["status"], { label: string; tone: BadgeTone }> = {
  active: { label: "Actif", tone: "success" },
  pending: { label: "En attente", tone: "warning" },
  blocked: { label: "Bloqué", tone: "danger" },
};

const columns: Column<Customer>[] = [
  {
    key: "name",
    header: "Client",
    cell: (c) => (
      <Link href={`${PATH}/${c.id}`} className="rounded-md hover:text-primary">
        <Avatar name={c.name} tagline={c.phone} />
      </Link>
    ),
  },
  { key: "status", header: "Statut", cell: (c) => <Badge tone={STATUS[c.status].tone}>{STATUS[c.status].label}</Badge> },
  { key: "orders", header: "Commandes", align: "right", sortable: true, cell: (c) => c.orders },
  { key: "spent", header: "Dépensé", align: "right", sortable: true, cell: (c) => formatMoney(c.spent, "XAF") },
  { key: "createdAt", header: "Depuis le", hideOnMobile: true, cell: (c) => formatDate(c.createdAt) },
];

export default async function CustomersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const status = typeof params.status === "string" ? params.status : "";
  const sort = parseSort(params.sort, "-spent");

  const matching = CUSTOMERS.filter(
    (c) => (!q || c.name.toLowerCase().includes(q.toLowerCase())) && (!status || c.status === status),
  ).sort((a, b) => {
    const key = sort.key === "orders" ? "orders" : "spent";
    return (a[key] - b[key]) * (sort.direction === "asc" ? 1 : -1);
  });
  const pageCount = Math.ceil(matching.length / PAGE_SIZE);
  const page = parsePage(params.page, pageCount);
  const rows = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeFilters = [status].filter(Boolean).length;

  return (
    <>
      <PageHeader title="Clients" description="Les clients de la boutique et ce qu'ils ont acheté." />

      <div className="flex flex-col gap-6">
        <KpiStrip
          kpis={[
            { key: "total", label: "Clients", value: "1 248", icon: <Users />, theme: "blue" },
            { key: "new", label: "Nouveaux (30 j)", value: "86", icon: <UserPlus />, theme: "green", delta: 12, hint: "Clients créés ces 30 derniers jours." },
            { key: "orders", label: "Commandes", value: "3 410", icon: <ShoppingBag />, theme: "orange" },
            { key: "revenue", label: "Chiffre d'affaires", value: formatMoney(18450000, "XAF", { short: true }), icon: <Wallet />, theme: "amber", delta: -4.2 },
          ]}
        />

        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(c) => c.id}
          sort={{ ...sort, hrefFor: (key, direction) => hrefWith(PATH, params, { sort: `${direction === "desc" ? "-" : ""}${key}` }) }}
          toolbar={
            <>
              <SearchForm
                label="Rechercher un client"
                placeholder="Rechercher un client"
                defaultValue={q}
                keep={keptParams(params, ["q"])}
                total={`${matching.length} au total`}
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary">
                      <Filter aria-hidden />
                      Filtres{activeFilters > 0 && ` · ${activeFilters}`}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <form method="get" className="flex flex-1 flex-col gap-4">
                      <HiddenFields params={keptParams(params, ["status"])} />
                      <SheetHeader>
                        <SheetTitle>Filtres</SheetTitle>
                        <SheetDescription>Affinez la liste des clients.</SheetDescription>
                      </SheetHeader>
                      <Field label="Statut">
                        <Select
                          name="status"
                          defaultValue={status}
                          placeholder="Tous les statuts"
                          options={Object.entries(STATUS).map(([value, { label }]) => ({ value, label }))}
                        />
                      </Field>
                      <SheetFooter>
                        <Button variant="secondary" asChild>
                          <Link href={hrefWith(PATH, params, { status: undefined })}>Effacer</Link>
                        </Button>
                        <Button type="submit">Appliquer</Button>
                      </SheetFooter>
                    </form>
                  </SheetContent>
                </Sheet>
                <Button asChild>
                  <Link href={`${PATH}/new`}>
                    <Plus aria-hidden />
                    Nouveau client
                  </Link>
                </Button>
              </div>
            </>
          }
          mobileCard={(c) => (
            <>
              <div className="flex items-start justify-between gap-2">
                <Link href={`${PATH}/${c.id}`} className="min-w-0">
                  <Avatar name={c.name} tagline={c.phone} />
                </Link>
                <Badge tone={STATUS[c.status].tone}>{STATUS[c.status].label}</Badge>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                <span className="text-slate-500">
                  Commandes <span className="font-medium text-slate-700">{c.orders}</span>
                </span>
                <span className="text-slate-500">
                  Dépensé <span className="font-medium text-slate-700">{formatMoney(c.spent, "XAF")}</span>
                </span>
              </div>
            </>
          )}
          empty={
            q || status ? (
              <EmptyState
                icon={<Filter />}
                title="Aucun résultat"
                description="Aucun client ne correspond à cette recherche ou à ces filtres."
                action={
                  <Button variant="secondary" asChild>
                    <Link href={PATH}>Effacer les filtres</Link>
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={<Users />}
                title="Aucun client pour l'instant"
                description="Ajoutez votre premier client ou importez votre liste."
                action={
                  <Button asChild>
                    <Link href={`${PATH}/new`}>Nouveau client</Link>
                  </Button>
                }
              />
            )
          }
          footer={
            <Pagination
              page={page}
              pageCount={pageCount}
              hrefFor={(p) => hrefWith(PATH, params, { page: p })}
              aside={`Affichés : ${rows.length} sur ${matching.length}`}
              labels={{
                nav: "Pagination",
                first: "Première page",
                previous: "Page précédente",
                next: "Page suivante",
                last: "Dernière page",
                page: (p) => `Page ${p}`,
              }}
            />
          }
        />
      </div>
    </>
  );
}
