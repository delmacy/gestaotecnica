"use client";

import { ViewField } from "./view-builder-types";
import { Eye, EyeOff, Settings2, GripVertical } from "lucide-react";

interface ViewFieldPaletteProps {
  fields: ViewField[];
  simulatedFields: Record<string, boolean>;
  onToggleVisibility: (fieldId: string) => void;
}

export function ViewFieldPalette({
  fields,
  simulatedFields,
  onToggleVisibility,
}: ViewFieldPaletteProps) {
  if (!fields || !Array.isArray(fields)) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-500 p-4 text-center">
        <div className="text-2xl mb-2">⚠️</div>
        <h3 className="text-sm font-medium mb-1">Invalid Model</h3>
        <p className="text-xs">Cannot render fields for an invalid view model.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-gray-50 text-sm font-medium flex justify-between items-center">
        <span>Available Fields</span>
        <span className="text-xs text-gray-500 font-normal">{fields.length} total</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {fields.map((field) => {
          const isVisible = simulatedFields[field.id] !== undefined ? simulatedFields[field.id] : field.visible;

          return (
            <div
              key={field.id}
              className={`flex items-center gap-2 p-2 border rounded-md text-sm transition-colors ${
                isVisible ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100 text-gray-400"
              }`}
            >
              <div title="Drag handle" className="cursor-grab text-gray-300 hover:text-gray-500">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{field.label}</p>
                <div className="flex gap-2 text-[10px] mt-0.5">
                  <span className="truncate">{field.field_type}</span>
                  {field.data_source_mode !== 'mock' && field.data_source_mode !== 'synthetic' && (
                    <span className={`px-1 rounded ${
                      field.data_source_mode === 'real_blocked' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {field.data_source_mode}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Field settings mock"
                >
                  <div title="Settings"><Settings2 className="w-3.5 h-3.5" /></div>
                </button>
                <button
                  onClick={() => onToggleVisibility(field.id)}
                  className={`p-1.5 rounded-md transition-colors ${
                    isVisible ? "text-blue-500 hover:bg-blue-50" : "text-gray-400 hover:bg-gray-100"
                  }`}
                  title={isVisible ? "Hide field" : "Show field"}
                >
                  <div title="Toggle visibility">
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
        Drag to reorder (simulated)
      </div>
    </div>
  );
}
