"use client";

import type React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  ClipboardList,
  CheckSquare,
  Code2,
  FileCheck2,
  ListChecks,
  Network,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const platformActions = [
  { href: "/builder", label: "Abrir Builder", detail: "Construir organizações, workspaces e fluxos", icon: Code2 },
  { href: "/admin/organizations", label: "Selecionar workspace", detail: "Cliente/tenant ativo", icon: BriefcaseBusiness },
  { href: "/skills", label: "Capabilities globais", detail: "Disponíveis para qualquer cliente", icon: Bot },
  { href: "/workspace-config", label: "Instalar capabilities", detail: "Somente no workspace atual", icon: SlidersHorizontal },
  { href: "/admin/users", label: "Usuários e papéis", detail: "Acesso autenticado", icon: ShieldCheck },
];

const workspaceActions = [
  { href: "/operations", label: "Operações do workspace", detail: "Fila ativa do cliente", icon: Activity },
  { href: "/work-intake", label: "Work Intake", detail: "Captura e triagem", icon: ListChecks },
  { href: "/work-items", label: "Demandas", detail: "Entrada e triagem", icon: ListChecks },
  { href: "/service-orders", label: "Ordens de serviço", detail: "Execução técnica", icon: ClipboardList },
  { href: "/approvals", label: "Revisão Técnica", detail: "Aprovação de OS", icon: CheckSquare },
  { href: "/maintenance-plans", label: "Manutenção", detail: "Planos preventivos", icon: Wrench },
];

const governanceActions = [
  { href: "/admin/organizations", label: "Empresas", value: "Organizações", icon: BriefcaseBusiness },
  { href: "/admin/workflows", label: "Workflows", value: "Publicados", icon: Network },
  { href: "/reports", label: "Relatórios", value: "Operação", icon: FileCheck2 },
  { href: "/search", label: "Busca", value: "Global", icon: Search },
];

const readinessRows = [
  { label: "Seed golden", value: "27B", state: "Em validação" },
  { label: "Forms", value: "26", state: "Integrado" },
  { label: "Rules", value: "27", state: "Integrado" },
  { label: "Gateway", value: "28", state: "Próximo" },
];

function ActionLink({
  href,
  label,
  detail,
  icon: Icon,
}: {
  href: string;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-16 items-center gap-3 rounded-md border bg-card px-3 py-3 transition-colors hover:border-primary/50 hover:bg-secondary/60"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-5">{label}</span>
        <span className="block text-xs leading-4 text-muted-foreground">{detail}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

export default function SystemBuilderDashboard() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-md border bg-card p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Command Center</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">System Builder Platform</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Área autenticada para administrar a plataforma e operar dados sensíveis sempre dentro de um workspace selecionado.
                </p>
              </div>
              <div className="flex min-w-52 items-center gap-3 rounded-md border bg-background px-3 py-3">
                <ShieldCheck className="size-5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Acesso</p>
                  <p className="text-sm font-semibold">Sessão obrigatória</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-md border bg-background p-4">
                <p className="text-sm font-semibold">Administração da plataforma</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Capabilities são globais e reutilizáveis. A instalação acontece por workspace.
                </p>
                <div className="mt-4 grid gap-2">
                  {platformActions.map((action) => (
                    <ActionLink key={action.href} {...action} />
                  ))}
                </div>
              </div>

              <div className="rounded-md border bg-background p-4">
                <p className="text-sm font-semibold">Dados do workspace selecionado</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Demandas, ordens, processos, formulários e relatórios pertencem somente ao cliente ativo.
                </p>
                <div className="mt-4 grid gap-2">
                  {workspaceActions.map((action) => (
                    <ActionLink key={action.href} {...action} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Maturidade do ciclo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {readinessRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{row.label}</p>
                    <p className="text-xs text-muted-foreground">{row.state}</p>
                  </div>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {governanceActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="h-full transition-colors hover:border-primary/50 hover:bg-secondary/40">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                    <Icon className="size-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold">{item.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
