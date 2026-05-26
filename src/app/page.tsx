import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Gauge,
  Search,
  Settings2,
} from "lucide-react";
import { getDashboardSummary } from "@/modules/dashboard/queries";
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
    description: "Painel de filas, pendencias, tecnicos disponiveis e eventos recentes.",
    status: "MVP",
  },
  {
    name: "Busca Global",
    description: "Localizacao rapida de OS, demandas, ativos e tecnicos.",
    status: "MVP",
  },
  {
    name: "Planejamento",
    description: "Backlog, execucao, revisao e carga tecnica em visao de quadro.",
    status: "MVP",
  },
  {
    name: "Escalas",
    description: "Expediente, plantao, sobreaviso e ausencias da equipe tecnica.",
    status: "Fase 2",
  },
  {
    name: "Documentos",
    description: "Workflow documental tecnico, revisao, aprovacao e exportacao.",
    status: "Fase 2",
  },
  {
    name: "Legado",
    description: "Protocolos e status de sincronizacao com sistemas oficiais.",
    status: "Fase 2",
  },
  {
    name: "Planos de Manutencao",
    description: "Planejamento preventivo por ativo, periodo, equipe e prioridade.",
    status: "Fase 3",
  },
  {
    name: "Projetos Tecnicos",
    description: "Modernizacoes, melhorias, substituicoes e implantacoes tecnicas.",
    status: "Fase 3",
  },
  {
    name: "Aquisicoes",
    description: "Necessidades de compra, justificativas e status administrativo.",
    status: "Fase 3",
  },
  {
    name: "Competencias",
    description: "Catalogo de habilidades, matriz tecnica e treinamentos.",
    status: "Fase 4",
  },
  {
    name: "Recursos",
    description: "Necessidades de pessoas, materiais, ferramentas e apoio operacional.",
    status: "Fase 4",
  },
  {
    name: "Automacoes",
    description: "Registro governado de gatilhos, endpoints e rotinas de integracao.",
    status: "Fase 4",
  },
  {
    name: "Fornecedores",
    description: "Cadastro, contatos, status e contratos de apoio tecnico.",
    status: "Fase 5",
  },
  {
    name: "Estoque",
    description: "Itens, saldos, minimo operacional e movimentacoes por OS.",
    status: "Fase 5",
  },
  {
    name: "Conformidade",
    description: "Auditorias, achados, riscos e acoes corretivas rastreaveis.",
    status: "Fase 5",
  },
  {
    name: "Workspace Config",
    description: "Adaptacao ativa, catalogo de modulos, filas, papeis e templates por cliente.",
    status: "Fase 6",
  },
  {
    name: "WorkItems",
    description: "Entrada, triagem e priorizacao das demandas antes de virarem OS.",
    status: "MVP",
  },
  {
    name: "Ordens de Servico",
    description: "Execucao autorizada, atribuicao tecnica, tempo e evidencias.",
    status: "MVP",
  },
  {
    name: "Ativos",
    description: "Equipamentos, sistemas e infraestrutura ligados ao historico operacional.",
    status: "MVP",
  },
  {
    name: "Workforce",
    description: "Equipes, perfis tecnicos, especialidades e disponibilidade para atribuicao de OS.",
    status: "MVP",
  },
  {
    name: "Revisao Tecnica",
    description: "Fila de aprovacao, retorno e aceite das OS concluidas.",
    status: "MVP",
  },
  {
    name: "Event Log",
    description: "Memoria rastreavel de tudo que muda no fluxo tecnico.",
    status: "MVP",
  },
  {
    name: "Evidencias",
    description: "Biblioteca de comprovantes, fotos, documentos e links tecnicos.",
    status: "MVP",
  },
  {
    name: "Horas",
    description: "Apontamentos de tempo, produtividade tecnica e esforco por OS.",
    status: "MVP",
  },
  {
    name: "Livro de Turno",
    description: "Consolidacao de ocorrencias, pendencias e passagem de servico.",
    status: "MVP",
  },
  {
    name: "Relatorios",
    description: "Leitura basica de OS, horas, ativos afetados e pendencias.",
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
  "Planos de Manutencao": "/maintenance-plans",
  "Projetos Tecnicos": "/technical-projects",
  Aquisicoes: "/acquisitions",
  Competencias: "/skills",
  Recursos: "/resource-needs",
  Automacoes: "/automations",
  Fornecedores: "/suppliers",
  Estoque: "/inventory",
  Conformidade: "/compliance",
  "Workspace Config": "/workspace-config",
  WorkItems: "/work-items",
  Ativos: "/assets",
  "Ordens de Servico": "/service-orders",
  Workforce: "/workforce",
  "Revisao Tecnica": "/approvals",
  "Event Log": "/events",
  Evidencias: "/evidences",
  Horas: "/timesheets",
  "Livro de Turno": "/shifts",
  Relatorios: "/reports",
};

const phases = [
  "Fundacao Next.js, TypeScript, Vercel e documentacao viva",
  "Nucleo operacional com WorkItems, OS, ativos e eventos",
  "Governanca com aprovacoes, secretaria tecnica e documentos",
  "Planejamento, escalas, legado, automacoes e BI",
  "Capacitacao, recursos, integracoes e governanca operacional",
  "Suprimentos, estoque tecnico, conformidade e contratos",
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
  { href: "/operations", label: "Operacao", icon: Gauge },
  { href: "/search", label: "Busca", icon: Search },
  { href: "/workspace-config", label: "Config", icon: Settings2 },
  { href: "/inventory", label: "Estoque", icon: Boxes },
  { href: "/compliance", label: "Conformidade", icon: CheckCircle2 },
];

export default async function Home() {
  const dashboard = await getDashboardSummary();

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
                  Gestao Tecnica
                </h1>
                <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                  Base operacional para demandas, ordens de servico, ativos,
                  evidencias, livro de turno, suprimentos e governanca tecnica.
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
              dashboard.metrics.slice(0, 5).map((metric) => (
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
                Banco indisponivel no momento. A estrutura da aplicacao continua
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
              <CardTitle className="text-sm uppercase">Execucao atual</CardTitle>
              <CardDescription>
                Camadas do produto ja incorporadas na arquitetura.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>Fundacao Next.js, TypeScript, Tailwind, Vercel e Postgres.</p>
              <Separator />
              <p>Nucleo operacional, planejamento, secretaria tecnica e eventos.</p>
              <Separator />
              <p>Governanca com recursos, automacoes, contratos, estoque e conformidade.</p>
            </CardContent>
          </Card>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">
              Modulos da plataforma
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Um mapa navegavel da operacao tecnica, agora com uma base visual
              shadcn para evoluir os demais fluxos com mais consistencia.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {mvpModules.map((module) => (
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
                      Abrir modulo
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
