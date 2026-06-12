"use client";

import React from "react";
import { FormBlueprint } from "./form-builder-types";
import { FileText, CircleDashed, ShieldAlert, CheckCircle2 } from "lucide-react";

interface Props {
  blueprints: FormBlueprint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function FormBlueprintList({ blueprints, selectedId, onSelect }: Props) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready_for_demo":
      case "mock_ready":
        return <div title="Ready"><CheckCircle2 className="h-3 w-3 text-green-500" /></div>;
      case "needs_real_sources":
      case "blocked_runtime":
        return <div title="Blocked"><ShieldAlert className="h-3 w-3 text-red-500" /></div>;
      default:
        return <div title="Draft"><CircleDashed className="h-3 w-3 text-gray-400" /></div>;
    }
  };

  return (
    <div className="flex flex-col gap-1.5 p-2 h-full overflow-y-auto">
      {blueprints.map((bp) => (
        <button
          key={bp.id}
          onClick={() => onSelect(bp.id)}
          className={`text-left p-3 rounded-lg border transition-colors flex flex-col gap-1 ${
            selectedId === bp.id
              ? "bg-primary/5 border-primary shadow-sm"
              : "bg-background hover:bg-muted/50 border-border"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm truncate pr-2">{bp.name}</span>
            {getStatusIcon(bp.readiness_status)}
          </div>

          <span className="text-[10px] text-muted-foreground truncate">{bp.process_area}</span>

          <div className="flex flex-wrap gap-1 mt-1">
            {bp.synthetic && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full border bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Synthetic
              </span>
            )}
            {bp.data_source_mode === 'real_blocked' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full border bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                Blocked
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
