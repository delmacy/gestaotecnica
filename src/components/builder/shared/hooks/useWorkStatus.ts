"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WorkStatusResolution } from "@/platform/builder/contracts/work-status/work-status-contract";

export type UseWorkStatusArgs = {
  moduleKey: string;
  returnPath?: string;
  returnLabel?: string;
};

export type ResolveStatusArgs = {
  workId?: string;
  isWorkEmpty?: boolean;
};

export function useWorkStatus(configArgs: UseWorkStatusArgs) {
  const router = useRouter();
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resolveStatus = useCallback(async (args: ResolveStatusArgs) => {
    setIsResolving(true);
    setError(null);
    try {
      const res = await fetch("/api/builder/work-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workId: args.workId,
          moduleKey: configArgs.moduleKey,
          isWorkEmpty: args.isWorkEmpty,
          returnPath: configArgs.returnPath,
          returnLabel: configArgs.returnLabel,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to resolve work status");
      }

      const resolution = (await res.json()) as WorkStatusResolution;

      // User-facing outcomes based on status
      if (resolution.status === "blocked") {
        toast.error("Access Restricted", {
          description: resolution.message || "You do not have permission.",
        });
      } else if (resolution.status === "demo") {
        toast.info("Demo Mode", {
          description: resolution.message || "Simulating action, changes not saved.",
        });
      } else if (resolution.status === "empty") {
        toast.error("Empty Data", {
          description: resolution.message || "No data was created. Please try again.",
        });
      } else if (resolution.status === "synthetic") {
        // standard success but synthetic data
        if (resolution.message) {
            toast.success("Synthetic Data", {
                description: resolution.message,
            });
        }
      } else {
        // real data success
        if (resolution.message) {
          toast.success("Success", {
            description: resolution.message,
          });
        }
      }

      // Execute navigation
      if (resolution.destination) {
        router.push(resolution.destination);
      }

      return resolution;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Failed to resolve work status");
      setError(errorObj);
      console.error("Error resolving work status:", err);
      toast.error("An error occurred", {
        description: errorObj.message,
      });
      throw err;
    } finally {
      setIsResolving(false);
    }
  }, [router, configArgs.moduleKey, configArgs.returnPath, configArgs.returnLabel]);

  return {
    resolveStatus,
    isResolving,
    error,
  };
}
