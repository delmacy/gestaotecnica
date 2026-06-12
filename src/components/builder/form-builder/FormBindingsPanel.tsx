"use client";

import React from "react";
import { FormField } from "./form-builder-types";
import { Link2, Database, Briefcase } from "lucide-react";

interface Props {
  field: FormField;
}

export function FormBindingsPanel({ field }: Props) {
  const binding = field.binding;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <div title="Bindings"><Link2 className="h-4 w-4 text-blue-600" /></div>
          Data Binding
        </h3>
        <p className="text-xs text-muted-foreground">
          Define em qual Entidade ou Capability o dado coletado neste campo será salvo ou utilizado.
        </p>
      </div>

      {!binding ? (
        <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground text-sm">
          Este campo não está vinculado ao backend. Ele servirá apenas de UI visual.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 border rounded-lg bg-blue-50/50 dark:bg-blue-900/10 space-y-3">
            <div>
              <span className="block text-[10px] uppercase text-muted-foreground font-semibold mb-1 flex items-center gap-1">
                <div title="Capability"><Briefcase className="h-3 w-3" /></div> Capability Context
              </span>
              <div className="text-sm font-medium">{binding.capability}</div>
            </div>

            <div>
              <span className="block text-[10px] uppercase text-muted-foreground font-semibold mb-1 flex items-center gap-1">
                <div title="Entity"><Database className="h-3 w-3" /></div> Target Entity
              </span>
              <div className="text-sm font-medium">{binding.entity}</div>
            </div>

            <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
              <span className="block text-[10px] uppercase text-muted-foreground font-semibold mb-1">Target Property</span>
              <div className="text-sm font-mono bg-background p-1.5 rounded border">
                {binding.entity}.{binding.field}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
