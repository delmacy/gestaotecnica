import type { Metadata } from "next";
import { BuilderShell } from "@/components/builder/shell/BuilderShell";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { resolveNavigationInventory } from "@/platform/builder/contracts/navigation-inventory";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "System Builder | Architecture Environment",
  description: "Ambiente de composição e arquitetura organizacional.",
};

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const environmentMode = cookieStore.get("x-environment-mode")?.value as "synthetic" | "demo" | "real" | undefined;
  const context = await resolveWorkspaceContext({
    source: "ui",
    ...(environmentMode ? { environmentMode } : {})
  });
  const inventory = resolveNavigationInventory(context);

  return (
    <BuilderShell context={context} inventory={inventory}>
      {children}
    </BuilderShell>
  );
}
