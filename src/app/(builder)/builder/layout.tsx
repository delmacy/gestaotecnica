import type { Metadata } from "next";
import { BuilderShell } from "@/components/builder/shell/BuilderShell";
import { resolveSelectedWorkspaceContext } from "@/platform/workspace";
import { resolveNavigationInventory } from "@/platform/builder/contracts/navigation-inventory";
import { cookies } from "next/headers";
import { requireAccessProfile } from "@/modules/auth/authorization";
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
  await requireAccessProfile(["builder"]);
  const cookieStore = await cookies();
  const selectedOrganizationId = cookieStore.get("x-organization-id")?.value;
  const environmentMode = cookieStore.get("x-environment-mode")?.value as "synthetic" | "demo" | "real" | undefined;
  const resolvedContext = await resolveSelectedWorkspaceContext({
    workspaceId: cookieStore.get("x-workspace-id")?.value,
    source: "ui",
    ...(environmentMode ? { environmentMode } : {})
  });
  const context = selectedOrganizationId && resolvedContext?.organizationId === selectedOrganizationId
    ? resolvedContext
    : null;
  const inventory = context ? resolveNavigationInventory(context) : null;

  return (
    <BuilderShell context={context} inventory={inventory}>
      {children}
    </BuilderShell>
  );
}
