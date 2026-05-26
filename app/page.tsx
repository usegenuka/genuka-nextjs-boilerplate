import { requireAuth } from "@/lib/auth";
import { ScannerApp } from "@/components/scanner-app";

export default async function Home() {
  const company = await requireAuth();
  return <ScannerApp companyName={company.name} />;
}
