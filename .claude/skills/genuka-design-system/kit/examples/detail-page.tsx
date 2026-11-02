// Example: app/(app)/customers/[id]/page.tsx, a detail page (the dashboard's customer page:
// identity and actions, KPIs, tabs, then a main column and a side column).
import { Pencil, ShoppingBag, Wallet } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { Tabs } from "@/components/ui/tabs";
import { formatDate, formatMoney } from "@/lib/format";
import { Link } from "@/lib/navigation";

import { CustomerActions } from "./customer-actions";

const ORDERS = [
  { id: "ORD-1490", date: "2026-10-30", total: 25000, status: "Payée" },
  { id: "ORD-1488", date: "2026-10-12", total: 12500, status: "Payée" },
  { id: "ORD-1479", date: "2026-09-21", total: 40000, status: "Remboursée" },
];

export default function CustomerPage() {
  return (
    <>
      <PageHeader
        back={{ href: "/customers", label: "Clients" }}
        title="Awa Ndiaye"
        badges={<Badge tone="success">Actif</Badge>}
        actions={
          <>
            <Button variant="secondary" asChild>
              <Link href="/customers/1/edit">
                <Pencil aria-hidden />
                Modifier
              </Link>
            </Button>
            <CustomerActions customerId="1" phone="+237 6 00 00 00 00" />
          </>
        }
      />

      <div className="flex flex-col gap-4">
        <KpiStrip
          kpis={[
            { key: "orders", label: "Commandes", value: 12, icon: <ShoppingBag />, theme: "orange" },
            { key: "spent", label: "Total dépensé", value: formatMoney(184500, "XAF"), icon: <Wallet />, theme: "green" },
          ]}
        />

        <Tabs
          label="Sections du client"
          value="overview"
          items={[
            { value: "overview", label: "Vue d'ensemble", href: "/customers/1" },
            { value: "orders", label: "Commandes", href: "/customers/1/orders", count: 12 },
            { value: "notes", label: "Notes", href: "/customers/1/notes" },
          ]}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-8">
            <Card
              title="Dernières commandes"
              action={
                <Link href="/customers/1/orders" className="text-xs text-primary hover:underline">
                  Tout voir
                </Link>
              }
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500">
                    <th className="py-2 font-normal">Commande</th>
                    <th className="hidden py-2 font-normal md:table-cell">Date</th>
                    <th className="py-2 text-right font-normal">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ORDERS.map((order) => (
                    <tr key={order.id}>
                      <td className="py-2.5 font-mono text-xs text-slate-700">{order.id}</td>
                      <td className="hidden py-2.5 text-slate-500 md:table-cell">{formatDate(order.date)}</td>
                      <td className="py-2.5 text-right tabular-nums text-slate-700">{formatMoney(order.total, "XAF")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-4">
            <Card title="Coordonnées">
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Téléphone</dt>
                  <dd className="text-slate-700">+237 6 00 00 00 00</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Client depuis</dt>
                  <dd className="text-slate-700">{formatDate("2026-09-14")}</dd>
                </div>
              </dl>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
