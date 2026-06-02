import React from "react";
import type { NodePreviewProps } from "./index";

export function HumanTaskNodePreview({ node }: NodePreviewProps) {
  const config = node.config || {};
  const instructions = (config.instructions as string) || "Nenhuma instrução adicional.";
  const assigneeMode = (config.assigneeMode as string) || "manual";
  const allowComments = config.allowComments !== false;
  const requireManualCompletion = config.requireManualCompletion !== false;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-800">{node.label}</h3>
      {node.description && <p className="text-sm text-slate-600">{node.description}</p>}

      <div className="bg-blue-50/50 p-4 rounded-md border border-blue-100 mt-2 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Instruções da Tarefa</span>
          <p className="text-sm text-slate-700 bg-white p-3 rounded border border-slate-200 min-h-[60px]">
            {instructions}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-500">Atribuição</span>
            <span className="text-slate-800 font-medium capitalize mt-0.5">{assigneeMode}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-500">Comentários</span>
            <span className="text-slate-800 font-medium mt-0.5">{allowComments ? "Sim" : "Não"}</span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="font-semibold text-slate-500">Conclusão Manual</span>
            <span className="text-slate-800 font-medium mt-0.5">{requireManualCompletion ? "Exigida" : "Opcional"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
