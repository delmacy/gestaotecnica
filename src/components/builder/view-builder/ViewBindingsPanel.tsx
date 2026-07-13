"use client";

import { ViewBlueprint } from "./view-builder-types";
import { Link2 } from "lucide-react";

interface ViewBindingsPanelProps {
  blueprint: ViewBlueprint;
}

export function ViewBindingsPanel({ blueprint }: ViewBindingsPanelProps) {
  if (!blueprint || !blueprint.bindings) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-500 p-4 text-center">
        <div className="text-2xl mb-2">⚠️</div>
        <h3 className="text-sm font-medium mb-1">Invalid Model</h3>
        <p className="text-xs">Cannot render bindings for an invalid view model.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-gray-50 text-sm font-medium">
        <span>Data Bindings</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {blueprint.bindings.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            <Link2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            No bindings configured
          </div>
        ) : (
          <div className="space-y-3">
             {blueprint.bindings.map((binding) => (
                <div key={binding.id} className="border border-l-4 border-l-blue-400 rounded-md p-3 bg-white text-sm shadow-sm">
                   <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-800">{binding.target_id}</span>
                      <span className="text-[10px] uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {binding.target_type}
                      </span>
                   </div>
                   <div className="text-xs text-gray-500">{binding.description}</div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
