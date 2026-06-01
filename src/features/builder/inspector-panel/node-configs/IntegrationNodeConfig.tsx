import React from "react";
import type { NodeConfigComponentProps } from "./index";

export function IntegrationNodeConfig({ node, actions }: NodeConfigComponentProps) {
  const config = node.config || {};
  const integrationId = (config.integrationId as string) ?? "";
  const actionName = (config.action as string) ?? "";
  const method = (config.method as string) ?? "POST";
  const endpoint = (config.endpoint as string) ?? "";
  const payloadTemplate = (config.payloadTemplate as string) ?? "{}";

  const updateConfig = (key: string, value: import("../../types").BuilderJson) => {
    actions.updateSelectedNode({
      config: { ...node.config, [key]: value },
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">ID da Integração</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={integrationId}
          onChange={(e) => updateConfig("integrationId", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Ação</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={actionName}
          onChange={(e) => updateConfig("action", e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-1.5 w-1/3">
          <label className="text-xs font-semibold text-slate-700">Método</label>
          <select
            className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={method}
            onChange={(e) => updateConfig("method", e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs font-semibold text-slate-700">Endpoint</label>
          <input
            type="text"
            className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endpoint}
            onChange={(e) => updateConfig("endpoint", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Payload (JSON Template)</label>
        <textarea
          rows={5}
          className="text-xs font-mono px-3 py-2 border border-slate-300 rounded bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={payloadTemplate}
          onChange={(e) => updateConfig("payloadTemplate", e.target.value)}
        />
      </div>
    </div>
  );
}
