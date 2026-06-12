"use client";

import { ViewBlueprint } from "./view-builder-types";
import { MousePointerClick } from "lucide-react";

interface ViewActionsPanelProps {
  blueprint: ViewBlueprint;
}

export function ViewActionsPanel({ blueprint }: ViewActionsPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-gray-50 text-sm font-medium">
        <span>View Actions</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {blueprint.actions.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            <MousePointerClick className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            No actions configured
          </div>
        ) : (
          blueprint.actions.map((action) => (
            <div key={action.id} className="border rounded-md p-3 bg-white text-sm shadow-sm flex items-center justify-between">
               <div className="font-medium">{action.label}</div>
               <div className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">
                 {action.action_type}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
