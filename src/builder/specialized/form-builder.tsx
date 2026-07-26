"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { executeKernelAction } from "@/platform/actions/remote-actions";
import { useNextStep } from "@/components/builder/shared/hooks/useNextStep";
import { SuccessTransition } from "@/components/builder/shared/SuccessTransition";

export function FormBuilder({ entityId }: { entityId: string }) {
  const [loading, setLoading] = useState(false);
  const { resolution, triggerNextStep } = useNextStep();

  async function handleSave() {
    setLoading(true);
    try {
       const result = await executeKernelAction("views.save_definition", {
         entityId,
         definition: { type: "form" }
       });

       if (result.success) {
           await triggerNextStep({
               outcome: "UPDATE_ENTITY_SUCCESS",
               moduleKey: "views",
               entityId,
               originContext: {
                   originPath: "/builder",
                   returnPath: "/builder",
                   returnLabel: "Return to Builder",
                   isBlocked: false,
                   isDemo: false,
                   isSynthetic: false,
                   isValidScope: true
               }
           });
       } else {
           alert("Erro ao salvar");
       }
    } catch {
       alert("Erro técnico");
    } finally {
       setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Form Builder</h2>
      <Button disabled={loading} onClick={handleSave}>
        {loading ? "Salvando..." : "Salvar Definição"}
      </Button>
      <SuccessTransition resolution={resolution} />
    </div>
  );
}
