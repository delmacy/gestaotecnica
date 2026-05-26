import Link from "next/link";
import { getDashboardSummary } from "@/modules/dashboard/queries";

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
];

export default async function Home() {
  const dashboard = await getDashboardSummary();

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs uppercase text-[#65705f]">
              Plataforma modular
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-[#111510] sm:text-5xl">
              Gestao Tecnica
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[#4d5848]">
              Base operacional para demandas, ordens de servico, ativos,
              evidencias, livro de turno e relatorios da secao tecnica.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, index) => (
              <div
                className="border border-[#d7dccf] bg-white p-4 shadow-sm"
                key={phase}
              >
                <p className="font-mono text-xs text-[#6e7a66]">
                  Fase {index}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#273025]">{phase}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {dashboard.available ? (
              dashboard.metrics.slice(0, 5).map((metric) => (
                <div
                  className="border border-[#d7dccf] bg-white p-4 shadow-sm"
                  key={metric.label}
                >
                  <p className="font-mono text-xs text-[#6e7a66]">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[#111510]">
                    {metric.value}
                  </p>
                </div>
              ))
            ) : (
              <div className="border border-[#d7dccf] bg-white p-4 text-sm text-[#4d5848] shadow-sm sm:col-span-3 lg:col-span-5">
                Banco indisponivel no momento. A estrutura da aplicacao continua
                carregando normalmente.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="border-r border-[#d7dccf] pr-0 lg:pr-8">
          <h2 className="text-sm font-semibold uppercase text-[#65705f]">
            Execucao atual
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[#3f493b]">
            <p>Fase 0 iniciada: fundacao do projeto.</p>
            <p>Stack base: Next.js, TypeScript, Tailwind e Vercel.</p>
            <p>Proximo alvo: schema inicial e modulos do MVP.</p>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-[#111510]">
              Modulos do MVP
            </h2>
            <p className="text-sm leading-6 text-[#5b6655]">
              O primeiro recorte prova o fluxo operacional sem tentar cobrir
              toda a visao estrategica de uma vez.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {mvpModules.map((module) => (
              <Link
                href={moduleLinks[module.name] ?? "#"}
                className="min-h-40 border border-[#d7dccf] bg-white p-5 shadow-sm"
                key={module.name}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#182017]">
                    {module.name}
                  </h3>
                  <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">
                    {module.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#4d5848]">
                  {module.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
