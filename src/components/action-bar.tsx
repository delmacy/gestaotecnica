"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AvailableAction } from "@/platform/views/view-engine";
import { executeKernelAction } from "@/platform/actions/remote-actions";
import { useNextStep } from "./builder/shared/hooks/useNextStep";
import { SuccessTransition } from "./builder/shared/SuccessTransition";

type ActionBarProps = {
  actions: AvailableAction[];
  entityId: string;
  path?: string;
};

export function ActionBar({ actions, entityId, path }: ActionBarProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { resolution, triggerNextStep } = useNextStep();

  if (actions.length === 0) return null;

  async function handleAction(actionKey: string) {
    setLoading(actionKey);
    try {
      const payload: Record<string, unknown> = {};

      if (actionKey.endsWith(".complete")) payload.serviceOrderId = entityId;
      if (actionKey.endsWith(".transition")) payload.workItemId = entityId;
      if (actionKey.endsWith(".update_status")) payload.assetId = entityId;

      const result = await executeKernelAction(actionKey, payload, path);

      if (result.success) {
        // Integrate Success Next-Step Transition
        await triggerNextStep({
            outcome: "WORKFLOW_COMPLETED",
            moduleKey: "action",
            entityId,
            originContext: {
                originPath: path || "/",
                returnPath: path || "/",
                returnLabel: "Return",
                isBlocked: false,
                isDemo: false,
                isSynthetic: false,
                isValidScope: true
            }
        });
      } else {
        alert(`Erro: ${result.error?.message}`);
      }
    } catch {
      alert(`Falha técnica ao executar ação.`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
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
      <SuccessTransition resolution={resolution} />
    </>
  );
}
