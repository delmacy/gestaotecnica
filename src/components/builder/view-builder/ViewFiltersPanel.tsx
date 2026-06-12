"use client";

import { ViewBlueprint } from "./view-builder-types";
import { Filter, Plus } from "lucide-react";

interface ViewFiltersPanelProps {
  blueprint: ViewBlueprint;
}

export function ViewFiltersPanel({ blueprint }: ViewFiltersPanelProps) {
  const getFieldLabel = (fieldId: string) => {
    return blueprint.fields.find((f) => f.id === fieldId)?.label || "Unknown Field";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-gray-50 text-sm font-medium flex justify-between items-center">
        <span>Default Filters</span>
        <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
          <div title="Add filter"><Plus className="w-3.5 h-3.5" /></div>
          Add Filter
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {blueprint.filters.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            <Filter className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            No default filters configured
          </div>
        ) : (
          blueprint.filters.map((filter) => (
            <div key={filter.id} className="border rounded-md p-3 bg-white text-sm shadow-sm">
              <div className="font-medium mb-2">{getFieldLabel(filter.field_id)}</div>
              <div className="flex items-center gap-2">
                <select
                  className="flex-1 text-xs border rounded p-1.5 bg-gray-50"
                  disabled
                  value={filter.filter_type}
                >
                  <option value="equals">Equals</option>
                  <option value="not_equals">Not Equals</option>
                  <option value="text_contains">Contains</option>
                  <option value="date_range">Date Range</option>
                  <option value="number_range">Number Range</option>
                  <option value="status_in">Status In</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
