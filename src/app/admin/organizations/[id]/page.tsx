import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, Layers3, Plus } from "lucide-react";
import { createWorkspaceForOrganization } from "@/modules/admin/actions";
import { getOrganizationWorkspacePanel } from "@/modules/admin/queries";
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

type WorkspaceListItem = {
  id: string;
  key: string;
  name: string;
  status: string;
  metadata: unknown;
  adaptationKey: string | null;
};

export default async function OrganizationWorkspacesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const panel = await getOrganizationWorkspacePanel(id);

  if (!panel) notFound();

  const { organization, workspaces } = panel;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div>
          <Button asChild variant="outline">
            <Link href="/admin/organizations">
              <ArrowLeft className="size-4" />
              Organizações
            </Link>
          </Button>
        </div>

        <section className="rounded-md border bg-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <BriefcaseBusiness className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Organização</p>
                <h1 className="truncate text-2xl font-semibold tracking-tight">{organization.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{organization.key}</p>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {getDescription(organization.metadata) ??
                    "Administre os workspaces desse cliente. Cada workspace isola dados, processos, formulários e dashboards."}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={organization.status === "active" ? "default" : "outline"}>{organization.status}</Badge>
              <Badge variant="secondary">{workspaces.length} workspaces</Badge>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Plus className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Criar workspace</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Dados e capacidades instaladas ficarão isolados nesse workspace.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form action={createWorkspaceForOrganization} className="space-y-4">
                <input name="organizationId" type="hidden" value={organization.id} />
                <input name="organizationKey" type="hidden" value={organization.key} />
                <label className="block">
                  <span className="text-sm font-medium">Nome do workspace</span>
                  <Input className="mt-1" name="name" placeholder="Ex: Operação São Paulo" required />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Chave curta</span>
                  <Input className="mt-1" name="key" placeholder="operacao-sp" />
                  <span className="mt-1 block text-xs text-muted-foreground">
                    A chave final receberá o prefixo da organização.
                  </span>
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Blueprint/adaptação</span>
                  <Input className="mt-1" name="adaptationKey" placeholder="gestao-tecnica" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Contexto operacional</span>
                  <Textarea className="mt-1" name="description" placeholder="Escopo, unidade, contrato ou observações desse workspace." />
                </label>
                <Button className="w-full" type="submit">
                  Criar workspace
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspaces do cliente</p>
              <h2 className="text-xl font-semibold tracking-tight">Ambientes operacionais</h2>
            </div>

            {workspaces.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium">Nenhum workspace criado para esta organização.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Crie um workspace para instalar capabilities e começar a modelar processos.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {workspaces.map((workspace: WorkspaceListItem) => (
                  <Card key={workspace.id}>
                    <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Layers3 className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="truncate text-base">{workspace.name}</CardTitle>
                          <p className="mt-1 truncate text-xs text-muted-foreground">{workspace.key}</p>
                        </div>
                      </div>
                      <Badge variant={workspace.status === "active" ? "default" : "outline"}>{workspace.status}</Badge>
                    </CardHeader>
                    <CardContent className="grid gap-3 p-4 pt-0 md:grid-cols-[1fr_auto] md:items-end">
                      <div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {getDescription(workspace.metadata) ?? "Sem contexto operacional cadastrado."}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Blueprint: {workspace.adaptationKey ?? "não definido"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                          <Link href="/workspace-config">Capabilities</Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link href="/operations">Operar</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
