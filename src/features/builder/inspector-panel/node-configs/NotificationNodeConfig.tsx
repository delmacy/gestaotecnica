import React from "react";
import type { NodeConfigComponentProps } from "./index";

export function NotificationNodeConfig({ node, actions }: NodeConfigComponentProps) {
  const config = node.config || {};
  const channel = (config.channel as string) ?? "system";
  const recipientMode = (config.recipientMode as string) ?? "current_user";
  const recipientRef = (config.recipientRef as string) ?? "";
  const messageTemplate = (config.messageTemplate as string) ?? "";

  const updateConfig = (key: string, value: import("../../types").BuilderJson) => {
    actions.updateSelectedNode({
      config: { ...node.config, [key]: value },
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Canal</label>
        <select
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={channel}
          onChange={(e) => updateConfig("channel", e.target.value)}
        >
          <option value="system">Sistema Interno</option>
          <option value="email">E-mail</option>
          <option value="webhook">Webhook</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Modo de Destinatário</label>
        <select
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={recipientMode}
          onChange={(e) => updateConfig("recipientMode", e.target.value)}
        >
          <option value="current_user">Usuário Atual</option>
          <option value="role">Papel (Role)</option>
          <option value="user">Usuário Específico</option>
          <option value="custom">Destinatário Customizado</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Referência do Destinatário</label>
        <input
          type="text"
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={recipientRef}
          onChange={(e) => updateConfig("recipientRef", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">Template da Mensagem</label>
        <textarea
          rows={4}
          className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={messageTemplate}
          onChange={(e) => updateConfig("messageTemplate", e.target.value)}
        />
      </div>
    </div>
  );
}
