"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACTIVE_MODULES, FUTURE_MODULES } from "./shell-data";
import { cn } from "@/lib/utils";
import { getActiveBuilderSection } from "./shell-utils";

export function Sidebar() {
  const pathname = usePathname();
  const activeModule = getActiveBuilderSection(pathname, ACTIVE_MODULES);

  return (
    <aside className="w-64 border-r bg-muted/40 flex flex-col overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm tracking-tight text-foreground">Navigation</h2>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        <div>
          <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Active Modules
          </h3>
          <ul className="space-y-1">
            {ACTIVE_MODULES.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule?.href === module.href;

              return (
                <li key={module.href}>
                  <Link
                    href={module.href}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {module.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Future Modules
          </h3>
          <ul className="space-y-1">
            {FUTURE_MODULES.map((module) => {
              const Icon = module.icon;

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
        </div>
      </nav>
    </aside>
  );
}
