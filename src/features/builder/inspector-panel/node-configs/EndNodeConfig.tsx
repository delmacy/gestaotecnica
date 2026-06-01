import React from "react";
import type { NodeConfigComponentProps } from "./index";

export function EndNodeConfig({ node, actions }: NodeConfigComponentProps) {
  const config = node.config || {};
  const completionStatus = (config.completionStatus as string) ?? "completed";
  const completionMessage = (config.completionMessage as string) ?? "Processo finalizado.";

  const updateConfig = (key: string, value: import("../../types").BuilderJson) => {
    actions.updateSelectedNode({
      config: { ...node.config, [key]: value },
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Status de Conclusão</label>
        <select
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={completionStatus}
          onChange={(e) => updateConfig("completionStatus", e.target.value)}
        >
          <option value="completed">Concluído (Sucesso)</option>
          <option value="cancelled">Cancelado</option>
          <option value="rejected">Rejeitado</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Mensagem de Conclusão</label>
        <textarea
          rows={3}
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={completionMessage}
          onChange={(e) => updateConfig("completionMessage", e.target.value)}
        />
      </div>
    </div>
  );
}
