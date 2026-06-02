import React from "react";
import type { NodePreviewProps } from "./index";

export function DecisionNodePreview({ node }: NodePreviewProps) {
  const config = node.config || {};
  const conditionType = (config.conditionType as string) || "expression";
  const expression = (config.expression as string) || "";
  const fieldKey = (config.fieldKey as string) || "";
  const expectedValue = (config.expectedValue as string) || "";

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-800">{node.label}</h3>
      {node.description && <p className="text-sm text-slate-600">{node.description}</p>}

      <div className="bg-amber-50/50 p-4 rounded-md border border-amber-200 mt-2">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Lógica de Decisão</span>

        <div className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">Tipo de Condição</span>
            <span className="text-sm text-slate-800 font-medium capitalize">{conditionType.replace("_", " ")}</span>
          </div>

          {conditionType === "expression" && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Expressão de Avaliação</span>
              <code className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-200">
                {expression || "<vazia>"}
              </code>
            </div>
          )}

          {conditionType === "field_equals" && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Regra de Igualdade</span>
              <div className="text-sm text-slate-700 bg-white p-2 rounded border border-slate-200 flex gap-2 items-center">
                <span className="font-mono">{fieldKey || "<campo>"}</span>
                <span className="text-amber-500 font-bold">==</span>
                <span className="font-mono">{expectedValue || "<valor>"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
