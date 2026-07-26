"use client";

import { useState } from "react";
import type { CancelBackResolution } from "@/platform/builder/contracts/cancel-back";
import { resolveCancelBackViaApi, type HandleCancelBackArgs } from "@/components/builder/shared/actions/handle-cancel-back";

export function useCancelBack() {
  const [resolution, setResolution] = useState<CancelBackResolution | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const triggerCancelBack = async (args: HandleCancelBackArgs) => {
    setIsResolving(true);
    setError(null);
    try {
      const res = await resolveCancelBackViaApi(args);
      setResolution(res);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to resolve cancel/back"));
      console.error("Error resolving cancel/back:", err);
    } finally {
      setIsResolving(false);
    }
  };

  const clearCancelBack = () => {
    setResolution(null);
  };

  return {
    resolution,
    isResolving,
    error,
    triggerCancelBack,
    clearCancelBack,
  };
}
