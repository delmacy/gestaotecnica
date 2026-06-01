import React from "react";
import type { NodeConfigComponentProps } from "./index";

export function DecisionNodeConfig({ node, actions }: NodeConfigComponentProps) {
  const config = node.config || {};
  const conditionType = (config.conditionType as string) ?? "expression";
  const expression = (config.expression as string) ?? "";
  const fieldKey = (config.fieldKey as string) ?? "";
  const expectedValue = (config.expectedValue as string) ?? "";

  const updateConfig = (key: string, value: import("../../types").BuilderJson) => {
    actions.updateSelectedNode({
      config: { ...node.config, [key]: value },
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Tipo de Condição</label>
        <select
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={conditionType}
          onChange={(e) => updateConfig("conditionType", e.target.value)}
        >
          <option value="expression">Expressão Manual</option>
          <option value="field_equals">Igualdade de Campo</option>
          <option value="manual">Decisão Humana</option>
        </select>
      </div>

      {conditionType === "expression" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">Expressão</label>
          <textarea
            rows={3}
            className="text-xs font-mono px-3 py-2 border border-slate-300 rounded bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={expression}
            onChange={(e) => updateConfig("expression", e.target.value)}
          />
        </div>
      )}

      {conditionType === "field_equals" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Chave do Campo</label>
            <input
              type="text"
              className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fieldKey}
              onChange={(e) => updateConfig("fieldKey", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Valor Esperado</label>
            <input
              type="text"
              className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={expectedValue}
              onChange={(e) => updateConfig("expectedValue", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
}
