"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WorkStatusResolution } from "@/platform/builder/contracts/work-status/work-status-contract";
import type { EventReceipt } from "@/platform/events/event-types";

export type UseWorkStatusArgs = {
  moduleKey: string;
  returnPath?: string;
  returnLabel?: string;
};

export function useWorkStatus(args: UseWorkStatusArgs) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const resolveWorkStatus = async (
    workId: string | undefined,
    isWorkEmpty?: boolean,
    receipt?: EventReceipt
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/builder/work-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workId,
          moduleKey: args.moduleKey,
          isWorkEmpty,
          returnPath: args.returnPath,
          returnLabel: args.returnLabel,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to resolve work status");
      }

      const resolution = (await res.json()) as WorkStatusResolution;

      if (resolution.status === "blocked") {
        toast.error("Acesso Restrito", {
          description: resolution.message,
        });
      } else if (resolution.status === "demo") {
         toast.info("Modo de Demonstração", {
          description: resolution.message,
        });
      } else if (resolution.status === "empty") {
        toast.warning("Nenhum dado criado", {
           description: resolution.message,
        });
      } else if (resolution.status === "real" || resolution.status === "synthetic") {
        toast.success(resolution.message, {
          description: receipt ? `Recibo de Operação: ${receipt.eventId}` : undefined
        });
      }

      if (resolution.destination) {
        router.push(resolution.destination);
      }

      return resolution;
    } catch (error) {
      console.error("Work status resolution failed:", error);
      toast.error("Ocorreu um erro ao processar o status.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resolveWorkStatus,
    isLoading,
  };
}
