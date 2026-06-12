"use client";

import React from "react";
import { FormGovernanceWarning } from "./form-builder-types";
import { ShieldAlert, AlertTriangle } from "lucide-react";

interface Props {
  warnings: FormGovernanceWarning[];
}

export function FormGovernancePanel({ warnings }: Props) {
  if (warnings.length === 0) {
    return (
      <div className="p-4 h-full overflow-y-auto">
         <div className="mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
            <div title="Governance"><ShieldAlert className="h-4 w-4 text-green-600" /></div>
            Governance & Compliance
          </h3>
        </div>
        <div className="p-4 border rounded-lg text-center text-muted-foreground text-sm flex flex-col items-center justify-center gap-2 bg-green-50/30">
          <div title="Safe"><ShieldAlert className="h-8 w-8 text-green-400 opacity-50" /></div>
          Nenhum risco detectado neste campo.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <div title="Governance"><ShieldAlert className="h-4 w-4 text-red-600" /></div>
          Governance & Compliance
        </h3>
        <p className="text-xs text-muted-foreground">
          Alertas gerados pelas policies automáticas de governança do System Builder.
        </p>
      </div>

      <div className="space-y-3">
        {warnings.map((w, i) => (
          <div key={i} className="p-3 border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-lg flex gap-3 items-start">
             <div title="Warning" className="mt-0.5"><AlertTriangle className="h-4 w-4 text-red-500 shrink-0" /></div>
             <div>
               <span className="text-xs font-bold text-red-800 dark:text-red-400 block mb-1 uppercase tracking-wider">
                 {w.warning_type.replace(/_/g, " ")}
               </span>
               <p className="text-sm text-red-900 dark:text-red-300">
                 {w.message}
               </p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
