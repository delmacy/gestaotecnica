"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function BuilderTopbar() {
  const pathname = usePathname();

  // Basic breadcrumb parsing based on URL
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6 shrink-0 w-full">
      <div className="flex items-center text-sm">
        <span className="text-slate-500">System Builder</span>

        {segments.map((segment, index) => {
          // Don't repeat 'builder' if it's the first segment (which is the root name)
          if (index === 0 && segment === "builder") return null;

          return (
            <React.Fragment key={index}>
              <span className="mx-2 text-slate-300">/</span>
              <span className={`capitalize ${index === segments.length - 1 ? "text-slate-800 font-medium" : "text-slate-500"}`}>
                {segment.replace(/-/g, " ")}
              </span>
            </React.Fragment>
          );
        })}
      </div>
      <div className="ml-auto flex items-center gap-4">
        {/* Placeholder for future topbar actions like User Profile, Notifications */}
        <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500 font-medium">
          U
        </div>
      </div>
    </header>
  );
}
