"use client";

import { Search, ChevronRight, UserCircle, Bell, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { CURRENT_WORKSPACE, MOCK_USER, ACTIVE_MODULES } from "./shell-data";
import React from "react";
import { getActiveBuilderSection } from "./shell-utils";

export function Topbar() {
  const pathname = usePathname();

  // Simple Breadcrumb logic
  const getBreadcrumbs = () => {
    if (!pathname) return ["Builder"];

    if (pathname === "/builder") {
        return ["Builder", "Dashboard"];
    }

    const paths = pathname.split("/").filter(Boolean);

    // Attempt to map to module label
    const currentModule = getActiveBuilderSection(pathname, ACTIVE_MODULES);

    const formattedPaths = paths.map((p, index) => {
        if (index === 0) return "Builder";
        if (index === 1 && currentModule) return currentModule.label;
        // capitalize first letter
        return p.charAt(0).toUpperCase() + p.slice(1);
    });

    return formattedPaths;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex flex-1 items-center gap-4">

        {/* Workspace Context Indicator Mock */}
        <div className="hidden md:flex items-center gap-2 border rounded-md px-3 py-1.5 bg-muted/30">
          <span className="text-xs text-muted-foreground font-medium">Workspace:</span>
          <span className="text-sm font-semibold">{CURRENT_WORKSPACE.name}</span>
        </div>

        {/* Search Placeholder */}
        <div className="flex-1 md:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full md:w-[300px] bg-muted/50 rounded-md border border-input pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled
            />
          </div>
        </div>

      </div>

      {/* Synthetic/Demo Mode Badge */}
      <div className="hidden sm:flex items-center bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-orange-200 dark:border-orange-800">
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        SYNTHETIC / DEMO MODE
      </div>

      {/* Quick Actions / Help / Profile */}
      <div className="flex items-center gap-3 border-l pl-4 ml-2">
        <button className="text-muted-foreground hover:text-foreground transition-colors" title="Help & Documentation">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors" title="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 pl-2">
          <UserCircle className="h-6 w-6 text-muted-foreground" />
          <div className="hidden lg:block text-right">
            <div className="text-sm font-medium leading-none">{MOCK_USER.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{MOCK_USER.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
