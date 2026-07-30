import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Building2, Layers3, Blocks } from "lucide-react";
import { getIcon } from "@/components/builder/shell/shell-data";
import { BuilderSelectionButton } from "@/components/builder/selection/BuilderSelectionButton";
import { EmptyState } from "@/components/builder/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrganizationWorkspacePanel, getOrganizationsOverview } from "@/modules/admin/queries";
import { resolveNavigationInventory } from "@/platform/builder/contracts/navigation-inventory";
import { resolveSelectedWorkspaceContext } from "@/platform/workspace";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ organizationId?: string; workspaceId?: string }>;
}) {
  const [params, cookieStore] = await Promise.all([searchParams, cookies()]);
  const cookieWorkspaceId = cookieStore.get("x-workspace-id")?.value;
  const cookieOrganizationId = cookieStore.get("x-organization-id")?.value;
  if (!params.organizationId && cookieOrganizationId) {
    const workspaceParam = cookieWorkspaceId ? `&workspaceId=${cookieWorkspaceId}` : "";
    redirect(`/builder?organizationId=${cookieOrganizationId}${workspaceParam}`);
  }

  const selectedWorkspaceId = params.workspaceId;
  const selectedOrganizationId = params.organizationId ?? cookieStore.get("x-organization-id")?.value;
  const resolvedContext = await resolveSelectedWorkspaceContext({ workspaceId: selectedWorkspaceId, source: "ui" });
  const context = selectedOrganizationId && resolvedContext?.organizationId === selectedOrganizationId
    ? resolvedContext
    : null;

  if (!context) {
    if (selectedOrganizationId) {
      const panel = await getOrganizationWorkspacePanel(selectedOrganizationId);
      if (panel) {
        return (
          <div className="mx-auto max-w-5xl space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Organization Builder</p>
              <h1 className="mt-1 text-2xl font-semibold">{panel.organization.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">Selecione um workspace para liberar seus sistemas e fluxos.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {panel.workspaces.map((workspace) => (
                <Card key={workspace.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><Layers3 className="size-4" />{workspace.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-3">
                    <span className="truncate text-xs text-muted-foreground">{workspace.key}</span>
                    <BuilderSelectionButton organizationId={panel.organization.id} workspaceId={workspace.id}>
                      Trabalhar neste workspace
                    </BuilderSelectionButton>
                  </CardContent>
                </Card>
              ))}
            </div>
            {panel.workspaces.length === 0 ? (
              <EmptyState icon={Layers3} title="Nenhum workspace" description="Crie o primeiro workspace nesta organização antes de modelar sistemas." />
            ) : null}
          </div>
        );
      }
    }

    const organizations = await getOrganizationsOverview();
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Platform Builder</p>
          <h1 className="mt-1 text-2xl font-semibold">Selecione uma organização</h1>
          <p className="mt-2 text-sm text-muted-foreground">Nenhum workspace está ativo no nível da plataforma.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {organizations.map((organization) => (
            <Card key={organization.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Building2 className="size-4" />{organization.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">{organization.workspaceCount} workspaces</span>
                <BuilderSelectionButton organizationId={organization.id}>Selecionar</BuilderSelectionButton>
              </CardContent>
            </Card>
          ))}
        </div>
        {organizations.length === 0 ? (
          <EmptyState icon={Building2} title="Nenhuma organização" description="Crie uma organização antes de provisionar workspaces." />
        ) : null}
      </div>
    );
  }

  const inventory = resolveNavigationInventory(context);
  const activeModules = inventory.modules.filter((module) => module.href !== "/builder");

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="rounded-md border bg-card p-6">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Workflow Builder</p>
        <h1 className="mt-1 text-2xl font-semibold">{context.workspaceKey}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Somente sistemas instalados neste workspace aparecem abaixo.</p>
      </div>
      <div>
        <h2 className="mb-4 text-xl font-semibold">Sistemas e fluxos</h2>
        {activeModules.length === 0 ? (
          <EmptyState icon={Blocks} title="Nenhum sistema instalado" description="Instale capabilities neste workspace para iniciar a modelagem." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeModules.map((module) => {
              const Icon = getIcon(module.iconName);
              return (
                <Link href={module.href} key={module.label} className="flex items-center gap-4 rounded-md border bg-card p-4 hover:bg-muted/50">
                  <div className="rounded-md bg-primary/10 p-3 text-primary"><Icon className="size-6" /></div>
                  <h3 className="font-medium">{module.label}</h3>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
