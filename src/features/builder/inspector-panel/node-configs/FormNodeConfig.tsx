import React from "react";
import type { NodeConfigComponentProps } from "./index";

export function FormNodeConfig({ node, actions }: NodeConfigComponentProps) {
  const config = node.config || {};
  const formId = (config.formId as string) ?? "";
  const formName = (config.formName as string) ?? "";
  const submitLabel = (config.submitLabel as string) ?? "Enviar";
  const fieldsJson = (config.fieldsJson as string) ?? "[]";

  const updateConfig = (key: string, value: import("../../types").BuilderJson) => {
    actions.updateSelectedNode({
      config: { ...node.config, [key]: value },
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">ID do Formulário</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formId}
          onChange={(e) => updateConfig("formId", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Nome do Formulário</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formName}
          onChange={(e) => updateConfig("formName", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Texto do Botão</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={submitLabel}
          onChange={(e) => updateConfig("submitLabel", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Campos (JSON)</label>
        <textarea
          rows={5}
          className="text-xs font-mono px-3 py-2 border border-slate-300 rounded bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={fieldsJson}
          onChange={(e) => updateConfig("fieldsJson", e.target.value)}
        />
      </div>
    </div>
  );
}
