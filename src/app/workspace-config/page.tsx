import Link from "next/link";
import { Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createWorkspaceCatalogItem,
  updateWorkspaceCatalogItem,
} from "@/modules/workspace-config/actions";
import { getWorkspaceConfigOverview } from "@/modules/workspace-config/queries";

export const dynamic = "force-dynamic";

const statusLabels = {
  implemented: "Implementado",
  adjusted: "Ajustado",
  planned: "Planejado",
} as const;

const layerLabels = {
  platform: "Core",
  module: "Modulo",
  adaptation: "Adaptacao",
} as const;

type EditableCatalogItem = {
  id: string;
  key: string;
  label?: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
  isEnabled?: boolean;
};

function EditableCatalogCard({
  catalog,
  description,
  items,
  supportsTarget = false,
  title,
}: {
  catalog: string;
  description: string;
  items: EditableCatalogItem[];
  supportsTarget?: boolean;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          action={createWorkspaceCatalogItem}
          className="grid gap-3 border bg-muted/30 p-3 md:grid-cols-[140px_1fr_1fr_120px_auto] md:items-end"
        >
          <input name="catalog" type="hidden" value={catalog} />
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">
              Chave
            </span>
            <Input className="mt-1" name="key" placeholder="nova_chave" required />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">
              Nome exibido
            </span>
            <Input className="mt-1" name="label" required />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">
              Descricao
            </span>
            <Input className="mt-1" name="description" />
          </label>
          {supportsTarget ? (
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">
                Alvo
              </span>
              <Input className="mt-1" name="target" placeholder="workspace" />
            </label>
          ) : (
            <input name="target" type="hidden" value="workspace" />
          )}
          <Button type="submit">Adicionar</Button>
        </form>

        {items.map((item) => (
          <form
            action={updateWorkspaceCatalogItem}
            className="grid gap-3 border p-3 md:grid-cols-[160px_1fr_1fr_92px_auto] md:items-end"
            key={item.id}
          >
            <input name="catalog" type="hidden" value={catalog} />
            <input name="id" type="hidden" value={item.id} />
            <div>
              <p className="font-mono text-xs uppercase text-muted-foreground">
                Chave
              </p>
              <p className="mt-2 truncate text-sm font-medium">{item.key}</p>
            </div>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">
                Nome exibido
              </span>
              <Input
                className="mt-1"
                defaultValue={item.label ?? item.name ?? item.key}
                name="label"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">
                Descricao
              </span>
              <Input
                className="mt-1"
                defaultValue={item.description ?? ""}
                name="description"
              />
            </label>
            <label className="flex h-10 items-center gap-2 text-sm">
              <input
                className="size-4"
                defaultChecked={item.isActive ?? item.isEnabled ?? true}
                name="isActive"
                type="checkbox"
              />
              Ativo
            </label>
            <Button type="submit" variant="outline">
              Salvar
            </Button>
          </form>
        ))}
      </CardContent>
    </Card>
  );
}

export default async function WorkspaceConfigPage() {
  const config = await getWorkspaceConfigOverview();
  const { adaptation, catalogs, modules, totals, workspace } = config;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <Badge className="w-fit" variant="secondary">
                Workspace ativo
              </Badge>
              <div>
                <h1 className="text-4xl font-semibold tracking-normal">
                  {workspace.name}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Configuracao que conecta o core replicavel aos modulos e ao
                  pacote de adaptacao do cliente.
                </p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                <Settings2 />
                Painel
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(totals).map(([key, value]) => (
              <Card key={key} size="sm">
                <CardHeader>
                  <CardDescription className="font-mono text-xs uppercase">
                    {key}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mapa do ecossistema</CardTitle>
              <CardDescription>
                Modulos que formam a plataforma e seu papel na separacao entre
                core, dominio e adaptacao.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modulo</TableHead>
                    <TableHead>Camada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Habilitado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((item) => (
                    <TableRow key={item.moduleKey}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {layerLabels[item.layer as keyof typeof layerLabels] ??
                          item.layer}
                      </TableCell>
                      <TableCell>
                        {statusLabels[item.status as keyof typeof statusLabels] ??
                          item.status}
                      </TableCell>
                      <TableCell>
                        <form action={updateWorkspaceCatalogItem}>
                          <input name="catalog" type="hidden" value="module" />
                          <input name="id" type="hidden" value={item.id} />
                          <input name="label" type="hidden" value={item.name} />
                          <input
                            className="size-4"
                            defaultChecked={item.isEnabled}
                            name="isActive"
                            onChange={(e) => e.target.form?.requestSubmit()}
                            type="checkbox"
                          />
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <EditableCatalogCard
            catalog="demandType"
            description="Tipos usados nos formularios e validacoes de demandas."
            items={catalogs.demandTypes}
            title="Tipos de demanda"
          />

          <EditableCatalogCard
            catalog="serviceOrderType"
            description="Classificacoes usadas ao criar uma ordem de servico."
            items={catalogs.serviceOrderTypes}
            title="Tipos de OS"
          />

          <EditableCatalogCard
            catalog="assetType"
            description="Familias de ativos disponiveis no cadastro tecnico."
            items={catalogs.assetTypes}
            title="Tipos de ativo"
          />

          <EditableCatalogCard
            catalog="shiftType"
            description="Tipos de agenda e escala usados pelo workspace."
            items={catalogs.shiftTypes}
            title="Tipos de escala"
          />

          <EditableCatalogCard
            catalog="queue"
            description="Filas operacionais para triagem, supervisao e continuidade."
            items={catalogs.queues}
            title="Filas"
          />

          <EditableCatalogCard
            catalog="documentTemplate"
            description="Modelos documentais usados no modulo de documentos."
            items={catalogs.documentTemplates}
            supportsTarget
            title="Templates documentais"
          />

          <EditableCatalogCard
            catalog="reportTemplate"
            description="Modelos usados na geracao de relatorios."
            items={catalogs.reportTemplates}
            supportsTarget
            title="Templates de relatorio"
          />
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{adaptation.name}</CardTitle>
              <CardDescription>Pacote de adaptacao selecionado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Filas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {catalogs.queues.map((queue) => (
                    <Badge key={queue.key} variant="outline">
                      {queue.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Tipos de demanda</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {catalogs.demandTypes.map((type) => (
                    <Badge key={type.key} variant="secondary">
                      {type.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Legado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {adaptation.legacyConfig.systemName} em modo{" "}
                  {adaptation.legacyConfig.mode}.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
