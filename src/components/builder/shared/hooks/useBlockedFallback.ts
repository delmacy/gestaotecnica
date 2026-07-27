"use client";

import { useState } from "react";
import type { BlockedFallbackDestination, BlockedFallbackReason } from "@/app/api/builder/navigation/blocked-fallback/blocked-fallback-contract";
import { resolveBlockedFallbackViaApi, type HandleBlockedFallbackArgs } from "@/components/builder/shared/actions/handle-blocked-fallback";

export function useBlockedFallback() {
    const [destination, setDestination] = useState<BlockedFallbackDestination | null>(null);
    const [isResolving, setIsResolving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const triggerFallback = async (args: HandleBlockedFallbackArgs) => {
        setIsResolving(true);
        setError(null);
        try {
            const res = await resolveBlockedFallbackViaApi(args);
            setDestination(res);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to resolve fallback"));
            console.error("Error resolving blocked fallback:", err);
        } finally {
            setIsResolving(false);
        }
    };

    const clearFallback = () => {
        setDestination(null);
    };

    return {
        destination,
        isResolving,
        error,
        triggerFallback,
        clearFallback,
    };
}
