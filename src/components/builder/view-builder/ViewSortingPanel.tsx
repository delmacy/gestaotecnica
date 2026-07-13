"use client";

import { ViewBlueprint } from "./view-builder-types";
import { ArrowDownAZ, ArrowUpAZ, Columns3 } from "lucide-react";

interface ViewSortingPanelProps {
  blueprint: ViewBlueprint;
}

export function ViewSortingPanel({ blueprint }: ViewSortingPanelProps) {
  if (!blueprint || !blueprint.fields || !blueprint.sort_rules || !blueprint.group_rules) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-500 p-4 text-center">
        <div className="text-2xl mb-2">⚠️</div>
        <h3 className="text-sm font-medium mb-1">Invalid Model</h3>
        <p className="text-xs">Cannot render sorting rules for an invalid view model.</p>
      </div>
    );
  }

  const getFieldLabel = (fieldId: string) => {
    return blueprint.fields.find((f) => f.id === fieldId)?.label || "Unknown Field";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-gray-50 text-sm font-medium">
        <span>Sorting & Grouping</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-6">

        {/* Sorting Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Default Sort</h3>
          {blueprint.sort_rules.length === 0 ? (
             <div className="text-xs text-gray-400 italic">No sort rules configured.</div>
          ) : (
            <div className="space-y-2">
              {blueprint.sort_rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-2 border rounded bg-white text-sm">
                  <span className="font-medium truncate mr-2">{getFieldLabel(rule.field_id)}</span>
                  <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 gap-1 shrink-0">
                    {rule.direction === 'asc' ? <ArrowDownAZ className="w-3.5 h-3.5" /> : <ArrowUpAZ className="w-3.5 h-3.5" />}
                    {rule.direction.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grouping Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Default Grouping</h3>
          {blueprint.group_rules.length === 0 ? (
             <div className="text-xs text-gray-400 italic">No grouping configured.</div>
          ) : (
            <div className="space-y-2">
              {blueprint.group_rules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-2 p-2 border rounded bg-blue-50/50 border-blue-100 text-sm text-blue-900">
                  <div title="Group icon"><Columns3 className="w-4 h-4 text-blue-500" /></div>
                  <span className="font-medium">{getFieldLabel(rule.field_id)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
