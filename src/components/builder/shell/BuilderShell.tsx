"use client";


import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { BuilderModule, getActiveBuilderSection } from "./shell-utils";
import { BuilderBreadcrumb } from "./breadcrumb-types";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { WorkspaceContext } from "@/platform/workspace";
import type { resolveNavigationInventory } from "@/platform/builder/contracts/navigation-inventory";
import { getIcon } from "./shell-data";

export function BuilderShell({
  children,
  context,
  inventory
}: {
  children: React.ReactNode;
  context: WorkspaceContext;
  inventory: ReturnType<typeof resolveNavigationInventory>;
}) {
  const activeModules: BuilderModule[] = inventory.activeModules.map(m => ({
    ...m,
    icon: getIcon(m.iconName)
  }));

  const mobileNav = (
    <div className="md:hidden flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <button
            title="Open Menu"
            className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open Menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">Access modules and future features</SheetDescription>
          <Sidebar
            activeModules={activeModules}
            futureModules={inventory.futureModules.map(m => ({ ...m, icon: getIcon(m.iconName) }))}
            className="flex border-none w-full md:flex"
          />
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Topbar mobileNavigation={mobileNav} context={context} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeModules={activeModules}
          futureModules={inventory.futureModules.map(m => ({ ...m, icon: getIcon(m.iconName) }))}
        />
        <main className="flex-1 overflow-y-auto bg-muted/10 relative">

          <BreadcrumbHeader activeModules={activeModules} />

          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Extract breadcrumb header to standard component to read pathname
function BreadcrumbHeader({ activeModules }: { activeModules: BuilderModule[] }) {
    const pathname = usePathname();
    if (!pathname) return null;

    const getBreadcrumbs = (): BuilderBreadcrumb[] => {
        if (pathname === "/builder") {
            return [{ label: "Builder" }, { label: "Dashboard", isActive: true }];
        }

        const paths = pathname.split("/").filter(Boolean);
        const currentModule = getActiveBuilderSection(pathname, activeModules);

        return paths.map((p, index) => {
            const isLast = index === paths.length - 1;
            if (index === 0) return { label: "Builder", isActive: isLast };
            if (index === 1 && currentModule) return { label: currentModule.label, isActive: isLast };
            return { label: p.charAt(0).toUpperCase() + p.slice(1), isActive: isLast };
        });
      };

    const breadcrumbs = getBreadcrumbs();

    return (
        <div className="px-6 pt-6 pb-2">
            <nav className="flex items-center text-sm font-medium text-muted-foreground mb-4">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <span
                    className={crumb.isActive ? "text-foreground" : ""}
                    {...(crumb.isActive ? { "aria-current": "page" } : {})}
                  >
                    {crumb.label}
                  </span>
                  {!crumb.isActive && (
                    <ChevronRight className="h-4 w-4 mx-2" />
                  )}
                </React.Fragment>
              ))}
            </nav>
        </div>
    )
}
