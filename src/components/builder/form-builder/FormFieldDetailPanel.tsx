"use client";

import React from "react";
import { FormField } from "./form-builder-types";

interface Props {
  field: FormField;
  onUpdateMock?: (updatedField: FormField) => void;
}

export function FormFieldDetailPanel({ field, onUpdateMock }: Props) {
  return (
    <div className="p-4 space-y-5 overflow-y-auto h-full text-sm">

      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground">Field Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdateMock?.({ ...field, label: e.target.value })}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground flex justify-between">
          <span>Field Key (Internal)</span>
          <span className="text-[9px] bg-muted px-1 py-0.5 rounded">Immutable</span>
        </label>
        <input
          type="text"
          value={field.key}
          disabled
          className="flex h-9 w-full rounded-md border border-input bg-muted/50 text-muted-foreground px-3 py-1 text-sm shadow-sm cursor-not-allowed"
        />
      </div>

      <div className="flex items-center justify-between p-3 rounded-md border bg-muted/20">
        <div>
          <span className="font-semibold text-sm">Required Field</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">User must fill this to proceed.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={field.required}
            onChange={(e) => onUpdateMock?.({ ...field, required: e.target.checked })}
          />
          <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground">Placeholder Text</label>
        <input
          type="text"
          value={field.placeholder}
          onChange={(e) => onUpdateMock?.({ ...field, placeholder: e.target.value })}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground">Help Text</label>
        <textarea
          value={field.help_text}
          onChange={(e) => onUpdateMock?.({ ...field, help_text: e.target.value })}
          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none"
        />
      </div>

      {field.options && (
         <div className="space-y-2 border-t pt-4">
           <label className="text-xs font-semibold text-muted-foreground">Options List</label>
           <div className="space-y-2">
             {field.options.map((opt, i) => (
               <div key={i} className="flex gap-2">
                 <input type="text" disabled value={opt.label} className="h-8 w-1/2 rounded border px-2 text-xs bg-muted/30" />
                 <input type="text" disabled value={opt.value} className="h-8 w-1/2 rounded border px-2 text-xs bg-muted/30 font-mono" />
               </div>
             ))}
           </div>
         </div>
      )}
    </div>
  );
}
