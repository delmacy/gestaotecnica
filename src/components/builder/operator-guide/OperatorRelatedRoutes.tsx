"use client";

import { OperatorRelatedRoute } from "./operator-guide-types";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function OperatorRelatedRoutes({ routes }: { routes: OperatorRelatedRoute[] }) {
  if (!routes || routes.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-slate-800 mb-3">Rotas Relacionadas</h3>
      <div className="grid grid-cols-1 gap-2">
        {routes.map((route, idx) => (
          <Link
            key={idx}
            href={route.route_path}
            className="flex items-start gap-3 p-3 border border-slate-200 rounded-md bg-white hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <div className="mt-0.5 text-slate-400 group-hover:text-indigo-500 transition-colors">
              <div title="Link">
                 <ExternalLink className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="font-medium text-sm text-slate-800 group-hover:text-indigo-700 transition-colors">
                {route.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded">
                {route.route_path}
              </div>
              {route.description && (
                <div className="text-xs text-slate-500 mt-1.5">{route.description}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
