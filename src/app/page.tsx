import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Gauge,
  Search,
  Settings2,
} from "lucide-react";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
import type { DashboardSummary } from "@/modules/dashboard/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

const mvpModules = [
  {
    name: "Centro Operacional",
    description: "Painel de filas, pendências, responsáveis disponíveis e eventos recentes.",
    status: "MVP",
  },
  {
    name: "Busca Global",
    description: "Localização rápida de OS, demandas, ativos e responsáveis.",
    status: "MVP",
  },
  {
    name: "Planejamento",
    description: "Backlog, execução, revisão e carga operacional em visão de quadro.",
    status: "MVP",
  },
  {
    name: "Escalas",
    description: "Expediente, plantão, sobreaviso e ausências da equipe.",
    status: "Fase 2",
  },
  {
    name: "Documentos",
    description: "Workflow documental, revisão, aprovação e exportação.",
    status: "Fase 2",
  },
  {
    name: "Legado",
    description: "Protocolos e status de sincronização com sistemas oficiais.",
    status: "Fase 2",
  },
  {
    name: "Planos de Manutenção",
    description: "Planejamento preventivo por ativo, período, equipe e prioridade.",
    status: "Fase 3",
  },
  {
    name: "Projetos Técnicos",
    description: "Modernizações, melhorias, substituições e implantações.",
    status: "Fase 3",
  },
  {
    name: "Aquisições",
    description: "Necessidades de compra, justificativas e status administrativo.",
    status: "Fase 3",
  },
  {
    name: "Competências",
    description: "Catálogo de habilidades, matriz de competências e treinamentos.",
    status: "Fase 4",
  },
  {
    name: "Recursos",
    description: "Necessidades de pessoas, materiais, ferramentas e apoio operacional.",
    status: "Fase 4",
  },
  {
    name: "Automações",
    description: "Registro governado de gatilhos, endpoints e rotinas de integração.",
    status: "Fase 4",
  },
  {
    name: "Fornecedores",
    description: "Cadastro, contatos, status e contratos de apoio.",
    status: "Fase 5",
  },
  {
    name: "Estoque",
    description: "Itens, saldos, mínimo operacional e movimentações por OS.",
    status: "Fase 5",
  },
  {
    name: "Conformidade",
    description: "Auditorias, achados, riscos e ações corretivas rastreáveis.",
    status: "Fase 5",
  },
  {
    name: "Workspace Config",
    description: "Adaptação ativa, catálogo de módulos, filas, papéis e templates por cliente.",
    status: "Fase 6",
  },
  {
    name: "WorkItems",
    description: "Entrada, triagem e priorização das demandas antes de virarem OS.",
    status: "MVP",
  },
  {
    name: "Ordens de Serviço",
    description: "Execução autorizada, atribuição, tempo e evidências.",
    status: "MVP",
  },
  {
    name: "Ativos",
    description: "Equipamentos, sistemas e infraestrutura ligados ao histórico operacional.",
    status: "MVP",
  },
  {
    name: "Workforce",
    description: "Equipes, perfis, especialidades e disponibilidade para atribuição de OS.",
    status: "MVP",
  },
  {
    name: "Revisão Operacional",
    description: "Fila de aprovação, retorno e aceite das OS concluídas.",
    status: "MVP",
  },
  {
    name: "Event Log",
    description: "Memória rastreável de tudo que muda no fluxo operacional.",
    status: "MVP",
  },
  {
    name: "Evidências",
    description: "Biblioteca de comprovantes, fotos, documentos e links.",
    status: "MVP",
  },
  {
    name: "Horas",
    description: "Apontamentos de tempo, produtividade e esforço por OS.",
    status: "MVP",
  },
  {
    name: "Livro de Turno",
    description: "Consolidação de ocorrências, pendências e passagem de serviço.",
    status: "MVP",
  },
  {
    name: "Relatórios",
    description: "Leitura básica de OS, horas, ativos afetados e pendências.",
    status: "MVP",
  },
];

const moduleLinks: Record<string, string> = {
  "Centro Operacional": "/operations",
  "Busca Global": "/search",
  Planejamento: "/planning",
  Escalas: "/schedules",
  Documentos: "/documents",
  Legado: "/legacy",
  "Planos de Manutenção": "/maintenance-plans",
  "Projetos Técnicos": "/technical-projects",
  Aquisições: "/acquisitions",
  Competências: "/skills",
  Recursos: "/resource-needs",
  Automações: "/automations",
  Fornecedores: "/suppliers",
  Estoque: "/inventory",
  Conformidade: "/compliance",
  "Workspace Config": "/workspace-config",
  WorkItems: "/work-items",
  Ativos: "/assets",
  "Ordens de Serviço": "/service-orders",
  Workforce: "/workforce",
  "Revisão Operacional": "/approvals",
  "Event Log": "/events",
  Evidências: "/evidences",
  Horas: "/timesheets",
  "Livro de Turno": "/shifts",
  Relatórios: "/reports",
};

const phases = [
  "Fundação Next.js, TypeScript, Vercel e documentação viva",
  "Núcleo operacional com WorkItems, OS, ativos e eventos",
  "Governança com aprovações, documentos e integrações",
  "Planejamento, escalas, legado, automações e BI",
  "Capacitação, recursos, integrações e governança operacional",
  "Suprimentos, estoque, conformidade e contratos",
];

const statusTone: Record<string, "default" | "secondary" | "outline"> = {
  MVP: "default",
  "Fase 2": "secondary",
  "Fase 3": "secondary",
  "Fase 4": "outline",
  "Fase 5": "outline",
  "Fase 6": "outline",
};

const quickLinks = [
  { href: "/builder", label: "Builder", icon: Settings2 },
  { href: "/operations", label: "Operação", icon: Gauge },
  { href: "/search", label: "Busca", icon: Search },
  { href: "/workspace-config", label: "Config", icon: Settings2 },
  { href: "/inventory", label: "Estoque", icon: Boxes },
  { href: "/compliance", label: "Conformidade", icon: CheckCircle2 },
];

export default async function Home() {
  const context = await resolveWorkspaceContext({ source: "system" });
  const result = await runAction("dashboard.get_summary", {}, context);
  const dashboard = result.success ? (result.data as DashboardSummary) : { available: false, metrics: [] };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-3">
              <Badge className="w-fit" variant="secondary">
                Plataforma modular
              </Badge>
              <div className="space-y-3">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
                  System Builder Platform
                </h1>
                <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                  Base para montar sistemas operacionais por workspace, com
                  módulos, packs contextuais, plugins, automações e adaptações
                  por cliente.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Button asChild key={item.href} variant="outline">
                    <Link href={item.href}>
                      <Icon />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {phases.map((phase, index) => (
              <Card key={phase} size="sm">
                <CardHeader>
                  <CardTitle className="font-mono text-xs uppercase text-muted-foreground">
                    Fase {index}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6">{phase}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {dashboard.available ? (
              dashboard.metrics.slice(0, 5).map((metric: any) => (
                <Card key={metric.label} size="sm">
                  <CardHeader>
                    <CardDescription className="font-mono text-xs uppercase">
                      {metric.label}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold">{metric.value}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="sm:col-span-3 lg:col-span-5" size="sm">
                <CardContent className="text-sm text-muted-foreground">
                Banco indisponível no momento. A estrutura da aplicação continua
                carregando normalmente.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase">Execução atual</CardTitle>
              <CardDescription>
                Camadas do produto já incorporadas na arquitetura.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>Fundação Next.js, TypeScript, Tailwind, Vercel e Postgres.</p>
              <Separator />
              <p>Kernel, módulos operacionais, packs contextuais e eventos.</p>
              <Separator />
              <p>Governança com recursos, automações, contratos, estoque e conformidade.</p>
            </CardContent>
          </Card>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">
              Módulos da plataforma
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Um mapa navegável das capacidades que podem compor diferentes
              sistemas por workspace, cliente, departamento ou operação.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {mvpModules.map((module: any) => (
              <Card className="min-h-40 transition-colors hover:bg-muted/40" key={module.name}>
                <Link href={moduleLinks[module.name] ?? "#"} className="flex h-full flex-col">
                  <CardHeader>
                    <CardTitle>{module.name}</CardTitle>
                    <CardAction>
                      <Badge variant={statusTone[module.status] ?? "outline"}>
                    {module.status}
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {module.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Abrir módulo
                      <ArrowRight className="size-4" />
                    </span>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
