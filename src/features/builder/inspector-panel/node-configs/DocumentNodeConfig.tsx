import React from "react";
import type { NodeConfigComponentProps } from "./index";

export function DocumentNodeConfig({ node, actions }: NodeConfigComponentProps) {
  const config = node.config || {};
  const templateId = (config.templateId as string) ?? "";
  const documentName = (config.documentName as string) ?? "";
  const outputMode = (config.outputMode as string) ?? "attach";
  const requireTraceReceipt = config.requireTraceReceipt !== false;

  const updateConfig = (key: string, value: import("../../types").BuilderJson) => {
    actions.updateSelectedNode({
      config: { ...node.config, [key]: value },
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">ID do Template</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={templateId}
          onChange={(e) => updateConfig("templateId", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Nome do Documento</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={documentName}
          onChange={(e) => updateConfig("documentName", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Modo de Saída</label>
        <select
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={outputMode}
          onChange={(e) => updateConfig("outputMode", e.target.value)}
        >
          <option value="attach">Anexar ao Registro</option>
          <option value="download">Apenas Download</option>
          <option value="trace_receipt">Comprovante (Trace Receipt)</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="requireTraceReceipt"
          checked={requireTraceReceipt}
          onChange={(e) => updateConfig("requireTraceReceipt", e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="requireTraceReceipt" className="text-xs font-medium text-slate-700 cursor-pointer">
          Exigir Comprovante de Rastreabilidade
        </label>
      </div>
    </div>
  );
}
