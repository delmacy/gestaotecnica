"use client";


import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { ACTIVE_MODULES } from "./shell-data";

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

    const getBreadcrumbs = () => {
        if (pathname === "/builder") {
            return ["Builder", "Dashboard"];
        }

        const paths = pathname.split("/").filter(Boolean);
        const currentModule = ACTIVE_MODULES.find(m => m.href === pathname);

        return paths.map((p, index) => {
            if (index === 0) return "Builder";
            if (index === 1 && currentModule) return currentModule.label;
            return p.charAt(0).toUpperCase() + p.slice(1);
        });
      };

    const breadcrumbs = getBreadcrumbs();

    return (
        <div className="px-6 pt-6 pb-2">
            <nav className="flex items-center text-sm font-medium text-muted-foreground mb-4">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb}>
                  <span className={index === breadcrumbs.length - 1 ? "text-foreground" : ""}>
                    {crumb}
                  </span>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-4 w-4 mx-2" />
                  )}
                </React.Fragment>
              ))}
            </nav>
        </div>
    )
}
