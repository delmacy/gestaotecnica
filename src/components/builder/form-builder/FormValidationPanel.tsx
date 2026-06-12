"use client";

import React from "react";
import { FormField } from "./form-builder-types";
import { ShieldCheck, Plus } from "lucide-react";

interface Props {
  field: FormField;
}

export function FormValidationPanel({ field }: Props) {
  const validations = field.validation_rules || [];

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <div title="Validation"><ShieldCheck className="h-4 w-4 text-green-600" /></div>
          Validation Rules
        </h3>
        <button className="text-xs flex items-center gap-1 text-primary hover:underline">
          <div title="Add"><Plus className="h-3 w-3" /></div>
          Add Rule
        </button>
      </div>

      {validations.length === 0 ? (
        <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground text-sm">
          Nenhuma regra de validação customizada para este campo.
        </div>
      ) : (
        <div className="space-y-3">
          {validations.map((v, i) => (
            <div key={i} className="p-3 border rounded-lg bg-muted/10 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">{v.type}</span>
              </div>
              {v.value !== undefined && (
                <div className="text-sm border-l-2 border-primary/30 pl-2 ml-1 text-muted-foreground font-mono">
                  {Array.isArray(v.value) ? v.value.join(", ") : v.value}
                </div>
              )}
              <div className="text-xs text-red-600/80 bg-red-50 p-1.5 rounded border border-red-100">
                {v.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
