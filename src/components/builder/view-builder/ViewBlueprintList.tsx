"use client";

import { ViewBlueprint } from "./view-builder-types";
import { Search, LayoutTemplate } from "lucide-react";

interface ViewBlueprintListProps {
  blueprints: ViewBlueprint[];
  selectedBlueprintId: string | null;
  onSelect: (id: string) => void;
}

export function ViewBlueprintList({
  blueprints,
  selectedBlueprintId,
  onSelect,
}: ViewBlueprintListProps) {
  return (
    <div className="w-64 border-r bg-gray-50/50 flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm mb-4">View Blueprints</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blueprints..."
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {blueprints.map((blueprint) => (
            <button
              key={blueprint.id}
              onClick={() => onSelect(blueprint.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-start gap-3 transition-colors ${
                selectedBlueprintId === blueprint.id
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div title="Blueprint Icon">
                <LayoutTemplate
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    selectedBlueprintId === blueprint.id
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="truncate">{blueprint.name}</span>
                <div className="flex gap-1 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600 font-normal">
                    {blueprint.view_type}
                  </span>
                  {blueprint.synthetic && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 font-normal">
                      synthetic
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
