"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { WorkStatusResolution } from "@/platform/builder/contracts/work-status/work-status-contract";

export type UseWorkStatusArgs = {
  moduleKey: string;
  returnPath?: string;
  returnLabel?: string;
};

export function useWorkStatus(args: UseWorkStatusArgs) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resolveWorkStatus = async (workId?: string, isWorkEmpty?: boolean) => {
    setIsLoading(true);
    setError(null);

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

      // Handle states
      if (resolution.status === "blocked") {
        toast.error("Acesso Restrito", {
          description: resolution.message || "Você não tem permissão para visualizar este item.",
        });
      } else if (resolution.status === "demo") {
        toast.info("Modo Demonstração", {
          description: resolution.message || "Item criado localmente, sem persistência.",
        });
      } else if (resolution.status === "empty") {
        toast.warning("Nenhum dado", {
          description: resolution.message || "Nenhum dado foi registrado.",
        });
      } else {
        toast.success("Sucesso", {
          description: resolution.message || "Operação concluída com sucesso.",
        });
      }

      if (resolution.destination) {
        router.push(resolution.destination);
      }

      return resolution;
    } catch (err) {
      console.error("Work status resolution failed:", err);
      const newError = err instanceof Error ? err : new Error("Failed to resolve work status");
      setError(newError);
      toast.error("Erro", {
        description: "Falha ao processar o status da operação.",
      });
      throw newError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resolveWorkStatus,
    isLoading,
    error,
  };
}
