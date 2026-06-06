"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BuilderSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/builder", label: "Dashboard" },
    { href: "/builder/candidates", label: "Process Candidates" },
    { href: "/builder/workflows", label: "Workflows" },
    { href: "/builder/forms", label: "Formulários" },
    { href: "/builder/integrations", label: "Integrações" },
    { href: "/builder/settings", label: "Configurações" },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-200 shrink-0">
        <h1 className="font-bold text-slate-800 text-lg">System Builder</h1>
        <p className="text-xs text-slate-500">Control Plane</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-slate-200 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 shrink-0 text-xs text-slate-400">
        Alpha Version
      </div>
    </aside>
  );
}
