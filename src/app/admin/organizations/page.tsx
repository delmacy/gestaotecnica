import Link from "next/link";
import { Building2, Cloud, Link2, Plus, Server, Workflow } from "lucide-react";
import { createOrganization, registerSystemTradingWorkspaceAction } from "@/modules/admin/actions";
import { getOrganizationsOverview } from "@/modules/admin/queries";
import { getSystemTradingWorkspaceRegistration } from "@/platform/workspaces/system-trading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

function getDescription(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return null;
  const description = (metadata as { description?: unknown }).description;
  return typeof description === "string" && description.trim().length > 0 ? description : null;
}

type OrganizationListItem = {
  id: string;
  key: string;
  name: string;
  status: string;
  metadata: unknown;
  workspaceCount: number;
};

export default async function OrganizationsPage() {
  const [organizations, systemTrading] = await Promise.all([
    getOrganizationsOverview(),
    getSystemTradingWorkspaceRegistration(),
  ]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-md border bg-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Server className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Registro da plataforma
                </p>
                <h2 className="text-xl font-semibold tracking-tight">System Trading</h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Workspace registrado no System Builder com metadados de repositório e ambiente e
                  o módulo Trading Lab instalado.
                </p>
              </div>
            </div>
            <form action={registerSystemTradingWorkspaceAction}>
              <Button type="submit" variant="outline">
                <Plus className="size-4" />
                Registrar workspace
              </Button>
            </form>
          </div>

          {systemTrading ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Workspace</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold">{systemTrading.workspaceName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{systemTrading.workspaceKey}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Blueprint: {systemTrading.adaptationKey ?? "não definido"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Repositório</CardTitle>
                </CardHeader>
                <CardContent>
                  {systemTrading.repository ? (
                    <>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <Link2 className="size-4 text-primary" />
                        {systemTrading.repository.owner}/{systemTrading.repository.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {systemTrading.repository.url}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Branch: {systemTrading.repository.branch}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sem metadados de repositório registrados.
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Ambiente</CardTitle>
                </CardHeader>
                <CardContent>
                  {systemTrading.environment ? (
                    <>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <Cloud className="size-4 text-primary" />
                        {systemTrading.environment.label}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Stage: {systemTrading.environment.stage}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Runtime: {systemTrading.environment.runtime}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Database: {systemTrading.environment.database}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sem metadados de ambiente registrados.
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Módulos instalados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">Trading Lab</span>
                    <Badge variant={systemTrading.tradingLabInstalled ? "default" : "outline"}>
                      {systemTrading.tradingLabInstalled ? "Instalado" : "Não instalado"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {systemTrading.modules.length} módulo(s) instalado(s)
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              O workspace System Trading ainda não foi registrado. Clique em “Registrar workspace”
              para criá-lo com metadados de repositório e ambiente e Trading Lab instalado.
            </p>
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-md border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Plus className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Plataforma</p>
              <h1 className="text-xl font-semibold tracking-tight">Criar organização</h1>
            </div>
          </div>

          <form action={createOrganization} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Nome da organização</span>
              <Input className="mt-1" name="name" placeholder="Ex: Clínica Norte" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Chave</span>
              <Input className="mt-1" name="key" placeholder="clinica-norte" />
              <span className="mt-1 block text-xs text-muted-foreground">Usada como base para chaves dos workspaces.</span>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Contexto</span>
              <Textarea className="mt-1" name="description" placeholder="Setor, operação, contrato ou observações do cliente." />
            </label>
            <Button className="w-full" type="submit">
              Criar organização
            </Button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Clientes e tenants</p>
              <h2 className="text-2xl font-semibold tracking-tight">Organizações</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Selecione uma organização para criar e administrar seus workspaces.
              </p>
            </div>
            <Badge variant="secondary">{organizations.length} organizações</Badge>
          </div>

          {organizations.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium">Nenhuma organização cadastrada.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Crie a primeira organização para depois provisionar os workspaces do cliente.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {organizations.map((organization: OrganizationListItem) => (
                <Link key={organization.id} href={`/admin/organizations/${organization.id}`}>
                  <Card className="transition-colors hover:border-primary/50 hover:bg-secondary/40">
                    <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Building2 className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="truncate text-base">{organization.name}</CardTitle>
                          <p className="mt-1 truncate text-xs text-muted-foreground">{organization.key}</p>
                        </div>
                      </div>
                      <Badge variant={organization.status === "active" ? "default" : "outline"}>{organization.status}</Badge>
                    </CardHeader>
                    <CardContent className="grid gap-3 p-4 pt-0 sm:grid-cols-[1fr_auto] sm:items-end">
                      <p className="text-sm leading-6 text-muted-foreground">
                        {getDescription(organization.metadata) ?? "Sem contexto adicional cadastrado."}
                      </p>
                      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                        <Workflow className="size-4 text-primary" />
                        <span>{organization.workspaceCount} workspaces</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
        </section>
      </div>
    </div>
  );
}
