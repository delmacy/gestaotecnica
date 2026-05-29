"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AvailableAction } from "@/platform/views/view-engine";
import { executeKernelAction } from "@/platform/actions/remote-actions";

type ActionBarProps = {
  actions: AvailableAction[];
  entityId: string;
  path?: string;
};

export function ActionBar({ actions, entityId, path }: ActionBarProps) {
  const [loading, setLoading] = useState<string | null>(null);

  if (actions.length === 0) return null;

  async function handleAction(actionKey: string) {
    setLoading(actionKey);
    try {
      const payload: Record<string, unknown> = {};

      // Convention: If action ends in .complete, it might need the ID field of the entity
      if (actionKey.endsWith(".complete")) payload.serviceOrderId = entityId;
      if (actionKey.endsWith(".transition")) payload.workItemId = entityId;
      if (actionKey.endsWith(".update_status")) payload.assetId = entityId;

      const result = await executeKernelAction(actionKey, payload, path);

      if (result.success) {
        alert(`${actionKey} executada com sucesso!`);
      } else {
        alert(`Erro: ${result.error?.message}`);
      }
    } catch {
      alert(`Falha operacional ao executar ação.`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 border border-[#d7dccf] bg-white p-4 shadow-sm">
      <h3 className="w-full mb-2 text-xs font-mono uppercase text-[#6e7a66]">Ações Disponíveis</h3>
      {actions.map((action) => (
        <Button
          key={action.key}
          variant="outline"
          size="sm"
          disabled={!!loading}
          onClick={() => handleAction(action.key)}
        >
          {loading === action.key ? "Processando..." : action.label}
        </Button>
      ))}
    </div>
  );
}
