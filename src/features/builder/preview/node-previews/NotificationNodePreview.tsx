import React from "react";
import type { NodePreviewProps } from "./index";

export function NotificationNodePreview({ node }: NodePreviewProps) {
  const config = node.config || {};
  const channel = (config.channel as string) || "system";
  const recipientMode = (config.recipientMode as string) || "current_user";
  const recipientRef = (config.recipientRef as string) || "N/A";
  const messageTemplate = (config.messageTemplate as string) || "Sua solicitação foi processada.";

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-800">{node.label}</h3>
      {node.description && <p className="text-sm text-slate-600">{node.description}</p>}

      <div className="bg-white p-4 rounded-md border border-slate-200 mt-2 shadow-sm relative overflow-hidden">
        {/* Fake phone/toast header UI */}
        <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {channel === "system" ? "Push Interno" : channel}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            <span>Para: <span className="text-slate-800 font-mono font-normal ml-1 bg-slate-50 px-1 py-0.5 rounded">{recipientMode === "current_user" ? "Usuário Atual" : recipientRef}</span></span>
          </div>
          <div className="text-sm text-slate-800 bg-slate-50 p-3 rounded-md border border-slate-100 italic">
            "{messageTemplate}"
          </div>
        </div>
      </div>
    </div>
  );
}
