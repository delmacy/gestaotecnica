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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default async function WorkspaceConfigPage() {
  const config = await getWorkspaceConfigOverview();
  const { adaptation, modules, totals } = config;

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
                  {adaptation.workspaceName}
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((item) => (
                    <TableRow key={item.key}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{layerLabels[item.layer]}</TableCell>
                      <TableCell>{statusLabels[item.status]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
                  {adaptation.queues.map((queue) => (
                    <Badge key={queue.key} variant="outline">
                      {queue.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Tipos de demanda</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {adaptation.demandTypes.map((type) => (
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
