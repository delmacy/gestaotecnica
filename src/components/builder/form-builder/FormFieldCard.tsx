"use client";

import React from "react";
import { FormField } from "./form-builder-types";
import { Lock, Settings2, GripVertical, AlertTriangle } from "lucide-react";

interface Props {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  hasGovernanceWarning: boolean;
}

export function FormFieldCard({ field, isSelected, onSelect, hasGovernanceWarning }: Props) {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col p-4 rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? "border-primary ring-1 ring-primary/20 bg-primary/5 shadow-sm z-10"
          : "border-border bg-background hover:border-primary/50"
      }`}
    >
      {/* Drag handle area (visual only) */}
      <div className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-l-lg hover:bg-muted cursor-grab">
        <div title="Drag"><GripVertical className="h-4 w-4 text-muted-foreground" /></div>
      </div>

      <div className="ml-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{field.label}</span>
            {field.required && <span className="text-red-500 text-xs font-bold">*</span>}
          </div>

          <div className="flex items-center gap-1.5">
             {hasGovernanceWarning && (
                <div title="Governance Warning">
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                </div>
             )}
             {field.data_source_mode === 'real_blocked' && (
                <div title="Blocked Runtime">
                  <Lock className="h-3.5 w-3.5 text-red-400" />
                </div>
             )}
            <span className="text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
              {field.field_type}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3">{field.help_text || "No help text"}</p>

        <div className="relative">
          {/* Mock visual representation of the field */}
          <div className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm text-muted-foreground opacity-50 flex items-center">
            {field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          </div>

          {/* Overlay to catch clicks and prevent interaction with the mock input */}
          <div className="absolute inset-0 z-10" />
        </div>
      </div>

      {/* Visual Settings Icon on select */}
      {isSelected && (
         <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-1.5 rounded-full shadow-md z-20">
           <div title="Settings"><Settings2 className="h-3 w-3" /></div>
         </div>
      )}
    </div>
  );
}
