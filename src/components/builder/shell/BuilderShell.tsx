"use client";


import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { ACTIVE_MODULES } from "./shell-data";
import { getActiveBuilderSection } from "./shell-utils";
import { BuilderBreadcrumb } from "./breadcrumb-types";

export function BuilderShell({ children }: { children: React.ReactNode }) {
  // Client component inside for breadcrumbs, or we can just render standard wrapper here
  // We'll wrap children with a simple Client component for the Breadcrumb to work correctly

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/10 relative">

          <BreadcrumbHeader />

          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Extract breadcrumb header to standard component to read pathname
function BreadcrumbHeader() {
    const pathname = usePathname();
    if (!pathname) return null;

    const getBreadcrumbs = (): BuilderBreadcrumb[] => {
        if (pathname === "/builder") {
            return [{ label: "Builder" }, { label: "Dashboard", isActive: true }];
        }

        const paths = pathname.split("/").filter(Boolean);
        const currentModule = getActiveBuilderSection(pathname, ACTIVE_MODULES);

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
