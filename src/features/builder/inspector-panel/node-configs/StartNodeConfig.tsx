import React from "react";
import type { NodeConfigComponentProps } from "./index";

export function StartNodeConfig({ node, actions }: NodeConfigComponentProps) {
  const config = node.config || {};
  const triggerLabel = (config.triggerLabel as string) ?? "Início do processo";
  const allowManualStart = config.allowManualStart !== false;

  const updateConfig = (key: string, value: import("../../types").BuilderJson) => {
    actions.updateSelectedNode({
      config: { ...node.config, [key]: value },
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Rótulo do Gatilho</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={triggerLabel}
          onChange={(e) => updateConfig("triggerLabel", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="allowManualStart"
          checked={allowManualStart}
          onChange={(e) => updateConfig("allowManualStart", e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="allowManualStart" className="text-xs font-medium text-slate-700 cursor-pointer">
          Permitir início manual
        </label>
      </div>

      <p className="text-xs text-slate-500">Configura como o processo pode ser iniciado.</p>
    </div>
  );
}
