"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Archive,
  Bot,
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Code2,
  FileText,
  GitBranch,
  Home,
  LayoutDashboard,
  ListChecks,
  Network,
  PackageCheck,
  Search,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RAW_LAYOUT_PREFIXES = ["/auth", "/builder", "/api-docs"];

type NavItem = {
  href: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Operação",
    items: [
      { href: "/", label: "Dashboard", description: "Visão geral", icon: LayoutDashboard },
      { href: "/work-items", label: "Demandas", description: "Itens de trabalho", icon: ListChecks },
      { href: "/service-orders", label: "Ordens", description: "OS e execução", icon: ClipboardList },
      { href: "/schedules", label: "Escalas", description: "Agenda operacional", icon: CalendarDays },
      { href: "/assets", label: "Ativos", description: "Patrimônio técnico", icon: Boxes },
      { href: "/workforce", label: "Efetivo", description: "Pessoas e disponibilidade", icon: Users },
    ],
  },
  {
    label: "System Builder",
    items: [
      { href: "/builder", label: "Builder IDE", description: "Canvas em tela cheia", icon: Code2 },
      { href: "/candidates", label: "Candidatos", description: "Propostas de processo", icon: GitBranch },
      { href: "/workspace-config", label: "Workspace", description: "Configuração", icon: Settings },
      { href: "/skills", label: "Skills", description: "Capacidades", icon: Bot },
      { href: "/search", label: "Busca", description: "Consulta global", icon: Search },
    ],
  },
  {
    label: "Gestão técnica",
    items: [
      { href: "/operations", label: "Operações", icon: Activity },
      { href: "/planning", label: "Planejamento", icon: Network },
      { href: "/maintenance-plans", label: "Manutenção", icon: Wrench },
      { href: "/inventory", label: "Inventário", icon: Archive },
      { href: "/documents", label: "Documentos", icon: FileText },
      { href: "/reports", label: "Relatórios", icon: ClipboardCheck },
    ],
  },
  {
    label: "Governança",
    items: [
      { href: "/admin", label: "Admin", icon: ShieldCheck },
      { href: "/admin/users", label: "Usuários", icon: Users },
      { href: "/admin/workspaces", label: "Workspaces", icon: BriefcaseBusiness },
      { href: "/admin/workflows", label: "Workflows", icon: GitBranch },
      { href: "/compliance", label: "Compliance", icon: PackageCheck },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function shouldUseRawLayout(pathname: string) {
  return RAW_LAYOUT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";

  if (shouldUseRawLayout(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar/95 lg:flex lg:flex-col">
          <div className="border-b border-sidebar-border px-5 py-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                <Home className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-sidebar-foreground">System Builder</p>
                <p className="text-xs text-muted-foreground">Gestão técnica operacional</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
            {navGroups.map((group) => (
              <section key={group.label} className="space-y-1">
                <h2 className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {group.label}
                </h2>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActivePath(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                        )}
                      >
                        <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground")} />
                        <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
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
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Workspace operacional</p>
                <h1 className="truncate text-lg font-semibold tracking-tight">Gestão Técnica / System Builder</h1>
              </div>
              <div className="hidden items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
                <span className="size-2 rounded-full bg-primary" />
                Layout 27C compatível
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
                      "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
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
