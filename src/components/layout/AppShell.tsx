"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bot,
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  CheckSquare,
  Code2,
  Compass,
  FileText,
  GitBranch,
  Home,
  LayoutDashboard,
  ListChecks,
  Network,
  PackageCheck,
  PanelLeftClose,
  PanelsTopLeft,
  Rocket,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RAW_LAYOUT_PREFIXES = ["/auth", "/builder", "/api-docs", "/blocked", "/admin"];

type NavItem = {
  href: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  description: string;
  mode: "platform" | "workspace" | "workspaceGovernance";
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Administração da plataforma",
    description: "Recursos globais, tenants e capacidades reutilizáveis.",
    mode: "platform",
    items: [
      { href: "/", label: "Command Center", description: "Visão geral segura", icon: LayoutDashboard },
      { href: "/admin/organizations", label: "Clientes", description: "Organizações e workspaces", icon: BriefcaseBusiness },
      { href: "/skills", label: "Capabilities globais", description: "Catálogo reutilizável", icon: Bot },
      { href: "/workspace-config", label: "Instalações", description: "Capabilities por workspace", icon: SlidersHorizontal },
      { href: "/admin/users", label: "Usuários", description: "Acessos e papéis", icon: Users },
      { href: "/admin/gateway/receipts", label: "Agent Gateway", description: "Recibos e auditoria", icon: Network },
      { href: "/admin", label: "Admin", description: "Controles da plataforma", icon: ShieldCheck },
    ],
  },
  {
    label: "Workspace selecionado",
    description: "Dados sensíveis do cliente/tenant ativo.",
    mode: "workspace",
    items: [
      { href: "/operations", label: "Operações", description: "Painel de execução", icon: Activity },
      { href: "/work-intake", label: "Work Intake", description: "Captura e triagem", icon: ListChecks },
      { href: "/work-items", label: "Demandas", description: "Entrada e triagem", icon: ListChecks },
      { href: "/service-orders", label: "Ordens", description: "OS e execução", icon: ClipboardList },
      { href: "/approvals", label: "Revisão Técnica", description: "Aprovação de OS", icon: CheckSquare },
      { href: "/planning", label: "Planejamento", description: "Carteira operacional", icon: Network },
      { href: "/schedules", label: "Escalas", description: "Agenda e plantões", icon: CalendarDays },
      { href: "/assets", label: "Ativos", description: "Patrimônio técnico", icon: Boxes },
      { href: "/workforce", label: "Efetivo", description: "Pessoas e disponibilidade", icon: Users },
      { href: "/maintenance-plans", label: "Manutenção", description: "Planos preventivos", icon: Wrench },
    ],
  },
  {
    label: "Governança do workspace",
    description: "Processos, auditoria e leituras do tenant ativo.",
    mode: "workspaceGovernance",
    items: [
      { href: "/builder", label: "Builder IDE", description: "Modelagem do workspace", icon: Code2 },
      { href: "/candidates", label: "Candidatos", description: "Propostas do workspace", icon: GitBranch },
      { href: "/admin/workflows", label: "Workflows", description: "Definições publicadas", icon: GitBranch },
      { href: "/automations", label: "Automações", description: "Fluxos e integrações", icon: Rocket },
      { href: "/documents", label: "Documentos", description: "Evidências e arquivos", icon: FileText },
      { href: "/reports", label: "Relatórios", description: "Leituras gerenciais", icon: ClipboardCheck },
      { href: "/search", label: "Busca", description: "Consulta global", icon: Search },
      { href: "/compliance", label: "Compliance", description: "Auditoria e riscos", icon: PackageCheck },
    ],
  },
];

const modeMeta = {
  platform: {
    label: "Admin da plataforma",
    eyebrow: "System Builder",
    title: "Administração da plataforma",
    description: "Gerencie tenants, usuários e capabilities globais.",
    icon: PanelsTopLeft,
  },
  workspace: {
    label: "Workspace selecionado",
    eyebrow: "Runtime",
    title: "Dados do workspace",
    description: "Dados operacionais isolados no tenant ativo.",
    icon: BriefcaseBusiness,
  },
  workspaceGovernance: {
    label: "Governança do workspace",
    eyebrow: "Workspace",
    title: "Processos e auditoria",
    description: "Workflows, candidates e relatórios do tenant ativo.",
    icon: Store,
  },
} as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function shouldUseRawLayout(pathname: string) {
  return RAW_LAYOUT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function getActiveGroup(pathname: string) {
  return navGroups.find((group) => group.items.some((item) => isActivePath(pathname, item.href))) ?? navGroups[0];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const activeGroup = getActiveGroup(pathname);
  const activeItem = activeGroup.items.find((item) => isActivePath(pathname, item.href));
  const activeMode = modeMeta[activeGroup.mode];
  const ActiveModeIcon = activeMode.icon;

  if (shouldUseRawLayout(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-80 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
          <div className="border-b border-sidebar-border px-5 py-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                <Home className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-sidebar-foreground">System Builder</p>
                <p className="text-xs text-muted-foreground">Área autenticada</p>
              </div>
            </Link>
          </div>

          <div className="border-b border-sidebar-border px-4 py-4">
            <div className="flex items-start gap-3 rounded-md border border-sidebar-border bg-background/70 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ActiveModeIcon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{activeMode.eyebrow}</p>
                <p className="truncate text-sm font-semibold text-sidebar-foreground">{activeMode.label}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{activeMode.description}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
            {navGroups.map((group) => (
              <section key={group.label} className="space-y-1">
                <div className="px-3 pb-1">
                  <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {group.label}
                  </h2>
                  <p className="mt-1 text-xs leading-4 text-muted-foreground">{group.description}</p>
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActivePath(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-sidebar-border"
                            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                        )}
                      >
                        <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground")} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{item.label}</span>
                          {item.description ? (
                            <span className="block truncate text-xs text-muted-foreground">{item.description}</span>
                          ) : null}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-card text-primary lg:hidden">
                  <PanelLeftClose className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{activeMode.eyebrow}</p>
                  <h1 className="truncate text-lg font-semibold tracking-tight">
                    {activeItem?.label ?? activeMode.title}
                  </h1>
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs text-muted-foreground sm:flex">
                <Compass className="size-4 text-primary" />
                Escopo: {activeMode.label}
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto border-t border-border/60 px-4 py-2 lg:hidden">
              {navGroups.flatMap((group) => group.items).map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
