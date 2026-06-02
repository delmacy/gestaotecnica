import React from "react";
import type { NodePreviewProps } from "./index";

export function IntegrationNodePreview({ node }: NodePreviewProps) {
  const config = node.config || {};
  const integrationId = (config.integrationId as string) || "N/A";
  const actionName = (config.action as string) || "N/A";
  const method = (config.method as string) || "POST";
  const endpoint = (config.endpoint as string) || "https://api.example.com";
  const payloadTemplate = (config.payloadTemplate as string) || "{}";

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-800">{node.label}</h3>
      {node.description && <p className="text-sm text-slate-600">{node.description}</p>}

      <div className="bg-slate-800 p-4 rounded-md border border-slate-700 mt-2 shadow-inner text-slate-300 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
          <span className="text-green-400 font-bold tracking-widest">{method}</span>
          <span className="text-slate-500 opacity-70 uppercase text-[10px]">{integrationId} • {actionName}</span>
        </div>

        <div className="mb-4">
          <span className="text-blue-300 block mb-1">URL:</span>
          <span className="text-slate-100">{endpoint}</span>
        </div>

        <div>
          <span className="text-blue-300 block mb-1">Payload:</span>
          <pre className="text-slate-300 bg-slate-900 p-2 rounded overflow-x-auto">
            {payloadTemplate}
          </pre>
        </div>
      </div>
    </div>
  );
}
