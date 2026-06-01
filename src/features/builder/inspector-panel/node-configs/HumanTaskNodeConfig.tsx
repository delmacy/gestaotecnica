import React from "react";
import type { NodeConfigComponentProps } from "./index";

export function HumanTaskNodeConfig({ node, actions }: NodeConfigComponentProps) {
  const config = node.config || {};
  const assigneeMode = (config.assigneeMode as string) ?? "manual";
  const assigneeRef = (config.assigneeRef as string) ?? "";
  const instructions = (config.instructions as string) ?? "";
  const allowComments = config.allowComments !== false;
  const requireManualCompletion = config.requireManualCompletion !== false;

  const updateConfig = (key: string, value: import("../../types").BuilderJson) => {
    actions.updateSelectedNode({
      config: { ...node.config, [key]: value },
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Modo de Atribuição</label>
        <select
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={assigneeMode}
          onChange={(e) => updateConfig("assigneeMode", e.target.value)}
        >
          <option value="manual">Manual</option>
          <option value="role">Papel (Role)</option>
          <option value="user">Usuário Específico</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Referência do Responsável</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={assigneeRef}
          onChange={(e) => updateConfig("assigneeRef", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Instruções</label>
        <textarea
          rows={3}
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={instructions}
          onChange={(e) => updateConfig("instructions", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allowComments"
            checked={allowComments}
            onChange={(e) => updateConfig("allowComments", e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="allowComments" className="text-xs font-medium text-slate-700 cursor-pointer">
            Permitir comentários
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="requireManualCompletion"
            checked={requireManualCompletion}
            onChange={(e) => updateConfig("requireManualCompletion", e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="requireManualCompletion" className="text-xs font-medium text-slate-700 cursor-pointer">
            Exigir conclusão manual
          </label>
        </div>
      </div>
    </div>
  );
}
