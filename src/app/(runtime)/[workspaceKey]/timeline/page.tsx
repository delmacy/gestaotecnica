import Link from "next/link";
import { ArrowLeft, Clock, ListChecks, ClipboardList, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TimelinePage({ params }: { params: Promise<{ workspaceKey: string }> }) {
  const resolvedParams = await params;
  const { workspaceKey } = resolvedParams;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href={`/${workspaceKey}`} className="hover:text-foreground transition-colors">
                Workspace
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Linha do Tempo</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Linha do Tempo</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Acompanhe eventos, alterações de status, registros de evidências e o
              histórico completo de execução das ordens, demandas e ativos do
              workspace <strong>{workspaceKey}</strong>.
            </p>
          </div>
          <Link
            href={`/${workspaceKey}`}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium text-muted-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar ao workspace
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/work-items"
            className="group rounded-lg border border-border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md"
          >
            <ListChecks className="mb-3 size-8 text-primary" />
            <div className="flex items-center gap-1">
              <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                Demandas
              </h2>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Eventos e evidências vinculados a itens de trabalho na página de cada demanda.
            </p>
          </Link>

          <Link
            href="/service-orders"
            className="group rounded-lg border border-border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md"
          >
            <ClipboardList className="mb-3 size-8 text-primary" />
            <div className="flex items-center gap-1">
              <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                Ordens de Serviço
              </h2>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Histórico de execução, aprovações e comprovantes de OS na página de cada ordem.
            </p>
          </Link>

          <Link
            href="/evidences"
            className="group rounded-lg border border-border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md"
          >
            <Clock className="mb-3 size-8 text-primary" />
            <div className="flex items-center gap-1">
              <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                Evidências
              </h2>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Biblioteca de comprovantes, fotos e registros documentais.
            </p>
          </Link>
        </div>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Sobre a Linha do Tempo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cada demanda, ordem de serviço e ativo possui seu próprio timeline
            com eventos de alteração de status e evidências anexadas. Use os
            links acima para navegar até a lista de registros e selecione um
            item para ver seu histórico completo.
          </p>
        </section>
      </div>
    </div>
  );
}
