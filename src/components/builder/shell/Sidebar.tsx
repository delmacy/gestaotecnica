"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BuilderModule, getActiveBuilderSection } from "./shell-utils";
import { Building2, Home, Layers3 } from "lucide-react";

export function Sidebar({
  modules,
  futureModules,
  className,
  hasWorkspace,
}: {
  modules: BuilderModule[];
  futureModules: BuilderModule[];
  className?: string
  hasWorkspace?: boolean;
}) {
  const pathname = usePathname();
  const activeModule = getActiveBuilderSection(pathname, modules);

  const taxonomyGroups = [
    {
      title: "Workspace Core",
      hrefs: ["/builder", "/builder/tasker"],
    },
    {
      title: "Architecture & Definition",
      hrefs: ["/builder/capabilities", "/builder/process-mirroring", "/builder/registry", "/builder/form-builder"],
    },
    {
      title: "Developer & Reference",
      hrefs: ["/builder/docs", "/builder/ui-contracts"],
    },
    {
      title: "Configuration",
      hrefs: ["/builder/settings"],
    },
  ];

  return (
    <aside className={cn("w-64 border-r bg-muted/40 hidden md:flex flex-col overflow-y-auto", className)}>
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm tracking-tight text-foreground">Navigation</h2>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        {!hasWorkspace ? (
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Platform Builder
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Home className="size-4" /> Command Center
                </Link>
              </li>
              <li>
                <Link href="/admin/organizations" className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Building2 className="size-4" /> Organizações
                </Link>
              </li>
              <li>
                <Link href="/builder" className="flex items-center gap-3 rounded-md bg-primary px-2 py-2 text-sm font-medium text-primary-foreground">
                  <Layers3 className="size-4" /> Selecionar workspace
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
        {taxonomyGroups.map((group) => {
          const groupModules = modules.filter((m) => group.hrefs.includes(m.href));

          if (groupModules.length === 0) return null;

          return (
            <div key={group.title}>
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {groupModules.map((module) => {
                  const Icon = module.icon;
                  const isActive = activeModule?.href === module.href;

                  return (
                    <li key={module.href}>
                      {module.status === "blocked" ? (
                        <div
                          className="flex items-center gap-3 px-2 py-2 rounded-md text-sm text-muted-foreground opacity-50 cursor-not-allowed"
                          title="Pro Feature"
                        >
                          <Icon className="w-4 h-4" />
                          {module.label}
                        </div>
                      ) : (
                        <Link
                          href={module.href}
                          className={cn(
                            "flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon className="w-4 h-4" />
                          {module.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {hasWorkspace ? <div>
          <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Future Modules
          </h3>
          <ul className="space-y-1">
            {futureModules.map((module) => {
              const Icon = module.icon as React.ElementType;

              return (
                <li key={module.label}>
                  <div
                    className="flex items-center gap-3 px-2 py-2 rounded-md text-sm text-muted-foreground/50 cursor-not-allowed"
                    title={`Status: ${module.status}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1">{module.label}</span>
                    <span className="text-[10px] uppercase bg-muted px-1.5 py-0.5 rounded">
                      {module.status === "blocked" ? "Blocked" : "Soon"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div> : null}
      </nav>
    </aside>
  );
}
