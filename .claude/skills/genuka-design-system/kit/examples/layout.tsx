// Example: app/(app)/layout.tsx, the frame of every authenticated page.
import { LayoutDashboard, Settings, ShoppingBag, Users } from "lucide-react";

import { AppNav } from "@/components/layout/app-nav";
import { AppShell } from "@/components/layout/app-shell";

// 6 tabs at most. Group rare pages under one tab: `match` keeps it active on them, and the group's pages
// show a row of Tabs (href) right under this bar, above their title.
const NAV = [
  { href: "/", label: "Vue d'ensemble", icon: <LayoutDashboard />, exact: true },
  { href: "/customers", label: "Clients", icon: <Users /> },
  { href: "/orders", label: "Commandes", icon: <ShoppingBag /> },
  { href: "/settings", label: "Réglages", icon: <Settings />, match: ["/settings"] },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      nav={
        <AppNav
          label="Navigation de l'app"
          items={NAV}
          brand={<span className="text-sm font-medium text-slate-700">Mon app Genuka</span>}
        />
      }
    >
      {children}
    </AppShell>
  );
}
