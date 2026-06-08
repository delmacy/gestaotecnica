import Link from "next/link";
import { Building2, Plus, Workflow } from "lucide-react";
import { createOrganization } from "@/modules/admin/actions";
import { getOrganizationsOverview } from "@/modules/admin/queries";
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
  const organizations = await getOrganizationsOverview();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.85fr_1.15fr]">
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
      </div>
    </div>
  );
}
