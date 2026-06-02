import React from "react";
import type { NodePreviewProps } from "./index";

export function StartNodePreview({ node }: NodePreviewProps) {
  const config = node.config || {};
  const triggerLabel = (config.triggerLabel as string) || "Início do processo";
  const allowManualStart = config.allowManualStart !== false;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-800">{node.label}</h3>
      {node.description && <p className="text-sm text-slate-600">{node.description}</p>}
      <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mt-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gatilho de Início</span>
          <span className="text-sm text-slate-800 font-medium">{triggerLabel}</span>
          <span className="text-xs text-slate-500 mt-2">
            Início Manual: <strong className={allowManualStart ? "text-green-600" : "text-slate-400"}>{allowManualStart ? "Permitido" : "Bloqueado"}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
