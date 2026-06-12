"use client";

import React from "react";
import { UiSurfaceContract } from "./ui-contracts-types";
import { ShieldAlert, Info, Copy, CheckCircle2, Lock, ListChecks, Link as LinkIcon } from "lucide-react";

interface Props {
  contract: UiSurfaceContract;
}

export function UiContractDetailPanel({ contract }: Props) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple visual feedback could be added here, but omitted for simplicity in mock
  };

  const renderArrayOrString = (data: string | string[]) => {
    if (Array.isArray(data)) {
      return (
        <ul className="list-disc pl-4 space-y-1">
          {data.map((item, idx) => (
            <li key={idx} className="text-sm">{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-sm whitespace-pre-wrap">{data}</p>;
  };

  return (
    <div className="bg-background rounded-xl border shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b bg-muted/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{contract.surface_name}</h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span className="font-mono bg-muted px-2 py-0.5 rounded">{contract.surface_id}</span>
              <button
                onClick={() => copyToClipboard(contract.surface_id)}
                className="hover:text-foreground transition-colors"
                title="Copiar ID"
              >
                <div title="Copy"><Copy className="h-3.5 w-3.5" /></div>
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
             <span className="text-xs px-2.5 py-1 rounded-full border bg-primary/10 text-primary font-semibold">
              {contract.group.replace(/_/g, " ").toUpperCase()}
            </span>
             <span className="text-xs px-2.5 py-1 rounded-full border bg-background font-medium capitalize">
              Dev: {contract.dev_status.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Route Candidate:</span>
          <code className="bg-muted px-2 py-1 rounded text-primary">{contract.route_candidate}</code>
          <button
            onClick={() => copyToClipboard(contract.route_candidate)}
            className="text-muted-foreground hover:text-foreground"
          >
             <div title="Copy Route"><Copy className="h-3.5 w-3.5" /></div>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">

        {/* Core Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
              <div title="Info"><Info className="h-4 w-4" /></div>
              Purpose
            </h3>
            <p className="text-sm">{contract.purpose}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Scope</h3>
            <p className="text-sm">{contract.scope}</p>
          </div>
        </div>

        {/* Personas & Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border">
          <div>
            <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Context</span>
            <span className="text-sm font-medium capitalize">{contract.workspace_or_global}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Personas</span>
            <div className="text-sm">{renderArrayOrString(contract.persona)}</div>
          </div>
        </div>

        {/* Risks & Evidence (Warning boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10">
            <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-500 mb-2 flex items-center gap-2">
              <div title="Risk"><ShieldAlert className="h-4 w-4" /></div>
              Frontend Risks
            </h3>
            <div className="text-sm text-yellow-900 dark:text-yellow-400">
              {renderArrayOrString(contract.frontend_risks)}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-500 mb-2 flex items-center gap-2">
              <div title="Evidence"><ListChecks className="h-4 w-4" /></div>
              Evidence Required
            </h3>
            <div className="text-sm text-blue-900 dark:text-blue-400">
              {renderArrayOrString(contract.evidence_required)}
            </div>
          </div>
        </div>

        {/* Data IO & Commands */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6">
           <div>
            <h3 className="text-sm font-semibold mb-3">Data Inputs</h3>
            {contract.data_inputs.length > 0 ? (
               <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                 {contract.data_inputs.map((item, i) => <li key={i}>{item}</li>)}
               </ul>
            ) : <span className="text-sm text-muted-foreground">N/A</span>}
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Data Outputs</h3>
             {contract.data_outputs.length > 0 ? (
               <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                 {contract.data_outputs.map((item, i) => <li key={i}>{item}</li>)}
               </ul>
            ) : <span className="text-sm text-muted-foreground">N/A</span>}
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Commands</h3>
             {contract.commands.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {contract.commands.map((cmd, i) => (
                   <span key={i} className="px-2 py-1 bg-muted rounded text-xs border font-medium">
                     {cmd}
                   </span>
                 ))}
               </div>
            ) : <span className="text-sm text-muted-foreground">N/A</span>}
          </div>
        </div>

        {/* Relationships */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <div title="Links"><LinkIcon className="h-4 w-4" /></div>
            Related Tasks & Reviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {contract.related_tasks.length > 0 && (
               <div>
                 <span className="text-xs font-semibold text-muted-foreground uppercase block mb-2">Tasks</span>
                 <ul className="space-y-2">
                   {contract.related_tasks.map((task, i) => (
                     <li key={i} className="text-sm flex items-center gap-2">
                       <div title="Task"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /></div>
                       {task}
                     </li>
                   ))}
                 </ul>
               </div>
             )}
             {contract.related_reviews.length > 0 && (
               <div>
                 <span className="text-xs font-semibold text-muted-foreground uppercase block mb-2">Reviews</span>
                 <ul className="space-y-2">
                   {contract.related_reviews.map((rev, i) => (
                     <li key={i} className="text-sm flex items-center gap-2">
                       <div title="Review"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /></div>
                       {rev}
                     </li>
                   ))}
                 </ul>
               </div>
             )}
          </div>
        </div>

        {/* Dependencies */}
        {contract.dependencies.length > 0 && (
           <div className="border-t pt-6">
            <h3 className="text-sm font-semibold mb-3 text-red-600 dark:text-red-400 flex items-center gap-2">
               <div title="Blocked"><Lock className="h-4 w-4" /></div>
               Dependencies / Blockers
            </h3>
            <div className="space-y-3">
              {contract.dependencies.map((dep, i) => (
                <div key={i} className="p-3 bg-red-50/50 dark:bg-red-900/10 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-red-900 dark:text-red-300">{dep.name}</span>
                    {dep.isBlocking && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-bold">BLOCKING</span>}
                  </div>
                  {dep.reason && <p className="text-xs text-red-800/80 dark:text-red-400 mt-1">{dep.reason}</p>}
                </div>
              ))}
            </div>
           </div>
        )}

      </div>
    </div>
  );
}
