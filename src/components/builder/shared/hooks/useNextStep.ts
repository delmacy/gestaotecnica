"use client";

import { useState } from "react";
import type { NextStepResolution } from "@/platform/builder/contracts/next-step/next-step-contract";
import { resolveNextStepViaApi, type HandleNextStepArgs } from "@/components/builder/shared/actions/handle-next-step";

export function useNextStep() {
    const [resolution, setResolution] = useState<NextStepResolution | null>(null);
    const [isResolving, setIsResolving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const triggerNextStep = async (args: HandleNextStepArgs) => {
        setIsResolving(true);
        setError(null);
        try {
            const res = await resolveNextStepViaApi(args);
            setResolution(res);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to resolve next step"));
            console.error("Error resolving next step:", err);
        } finally {
            setIsResolving(false);
        }
    };

    const clearNextStep = () => {
        setResolution(null);
    };

    return {
        resolution,
        isResolving,
        error,
        triggerNextStep,
        clearNextStep,
    };
}
