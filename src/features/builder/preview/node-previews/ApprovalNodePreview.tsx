import React from "react";
import type { NodePreviewProps } from "./index";

export function ApprovalNodePreview({ node }: NodePreviewProps) {
  const config = node.config || {};
  const approverMode = (config.approverMode as string) || "manual";
  const approverRef = (config.approverRef as string) || "N/A";
  const requireSignature = config.requireSignature === true;
  const approvalInstructions = (config.approvalInstructions as string) || "Por favor, revise os dados e aprove ou rejeite a solicitação.";

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-800">{node.label}</h3>
      {node.description && <p className="text-sm text-slate-600">{node.description}</p>}

      <div className="bg-white p-5 rounded-md border border-slate-200 mt-2 shadow-sm flex flex-col gap-4">
        <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded border border-blue-100 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>{approvalInstructions}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs border-y border-slate-100 py-3">
          <div className="flex flex-col">
            <span className="text-slate-500 font-semibold mb-1">Aprovador ({approverMode})</span>
            <span className="font-mono text-slate-700 bg-slate-50 p-1 rounded inline-block w-max">
              {approverRef}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 font-semibold mb-1">Assinatura Digital</span>
            <span className={requireSignature ? "text-amber-600 font-bold" : "text-slate-500"}>
              {requireSignature ? "Obrigatória" : "Não Necessária"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button disabled className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded text-sm font-medium opacity-50 cursor-not-allowed">
            {(config.rejectPathLabel as string) || "Rejeitar"}
          </button>
          <button disabled className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium opacity-50 cursor-not-allowed">
            Aprovar
          </button>
        </div>
      </div>
    </div>
  );
}
