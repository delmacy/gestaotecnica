import React from "react";
import type { NodeConfigComponentProps } from "./index";

export function ApprovalNodeConfig({ node, actions }: NodeConfigComponentProps) {
  const config = node.config || {};
  const approverMode = (config.approverMode as string) ?? "manual";
  const approverRef = (config.approverRef as string) ?? "";
  const requireSignature = config.requireSignature === true;
  const approvalInstructions = (config.approvalInstructions as string) ?? "";
  const rejectPathLabel = (config.rejectPathLabel as string) ?? "Rejeitar";

  const updateConfig = (key: string, value: import("../../types").BuilderJson) => {
    actions.updateSelectedNode({
      config: { ...node.config, [key]: value },
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Modo de Aprovação</label>
        <select
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={approverMode}
          onChange={(e) => updateConfig("approverMode", e.target.value)}
        >
          <option value="manual">Manual</option>
          <option value="role">Papel (Role)</option>
          <option value="user">Usuário Específico</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Referência do Aprovador</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={approverRef}
          onChange={(e) => updateConfig("approverRef", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Rótulo de Rejeição</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={rejectPathLabel}
          onChange={(e) => updateConfig("rejectPathLabel", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Instruções para Aprovação</label>
        <textarea
          rows={3}
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={approvalInstructions}
          onChange={(e) => updateConfig("approvalInstructions", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="requireSignature"
          checked={requireSignature}
          onChange={(e) => updateConfig("requireSignature", e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="requireSignature" className="text-xs font-medium text-slate-700 cursor-pointer">
          Exigir Assinatura Digital
        </label>
      </div>
    </div>
  );
}
