"use client";


import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { BuilderModule, getActiveBuilderSection } from "./shell-utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { WorkspaceContext } from "@/platform/workspace";
import type { resolveNavigationInventory } from "@/platform/builder/contracts/navigation-inventory";
import { resolveBreadcrumbInventory, type BreadcrumbNode } from "@/platform/builder/contracts/breadcrumb/breadcrumb-inventory";
import { getIcon } from "./shell-data";
import Link from "next/link";

export function BuilderShell({
  children,
  context,
  inventory
}: {
  children: React.ReactNode;
  context: WorkspaceContext;
  inventory: ReturnType<typeof resolveNavigationInventory>;
}) {
  const modules: BuilderModule[] = inventory.modules.map((m) => ({
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
            modules={modules}
            futureModules={inventory.futureModules.map((m) => ({ ...m, icon: getIcon(m.iconName) }))}
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
          modules={modules}
          futureModules={inventory.futureModules.map((m) => ({ ...m, icon: getIcon(m.iconName) }))}
        />
        <main className="flex-1 overflow-y-auto bg-muted/10 relative">

          <BreadcrumbHeader context={context} />

          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Extract breadcrumb header to standard component to read pathname
function BreadcrumbHeader({ context }: { context: WorkspaceContext }) {
    const pathname = usePathname();
    if (!pathname) return null;

    const isNotFound = false; // Note: to be fully dynamic, these could be determined by context/props or specific nested routes
    const isBlocked = false;

    const breadcrumbs = resolveBreadcrumbInventory(context, {
      pathname,
      isNotFound,
      isBlocked
    });

    return (
        <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2">
            <nav className="flex items-center text-xs md:text-sm font-medium text-muted-foreground mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={index}>
                    {crumb.isClickable && crumb.href ? (
                      <Link href={crumb.href} className="hover:text-foreground transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        className={isLast ? "text-foreground" : ""}
                        {...(isLast ? { "aria-current": "page" } : {})}
                      >
                        {crumb.label}
                      </span>
                    )}

                    {!isLast && (
                      <ChevronRight className="h-3 w-3 md:h-4 md:w-4 mx-1 md:mx-2 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
        </div>
    )
}
