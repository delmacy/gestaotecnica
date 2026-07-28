"use client";

import { useState } from "react";
import type { WorkStatusResolution } from "@/platform/builder/contracts/work-status/work-status-contract";
import type { NextStepResolution } from "@/platform/builder/contracts/next-step/next-step-contract";

export interface HandleWorkStatusArgs {
    workId?: string;
    moduleKey: string;
    isWorkEmpty?: boolean;
    returnPath?: string;
    returnLabel?: string;
}

export function useWorkStatus() {
    const [resolution, setResolution] = useState<NextStepResolution | null>(null);
    const [isResolving, setIsResolving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const triggerWorkStatus = async (args: HandleWorkStatusArgs) => {
        setIsResolving(true);
        setError(null);
        try {
            const response = await fetch('/api/builder/work-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(args),
            });

            if (!response.ok) {
                throw new Error(`Failed to resolve work status: ${response.statusText}`);
            }

            const res: WorkStatusResolution = await response.json();

            // Map WorkStatusResolution to NextStepResolution for SuccessTransition
            const mappedResolution: NextStepResolution = {
                destination: res.destination,
                status: res.status === "blocked" ? "blocked" : (res.status === "demo" ? "demo_simulation" : "normal"),
                message: res.message,
                label: res.status === "empty" ? "No Data Created" :
                       res.status === "blocked" ? "Access Denied" :
                       res.status === "demo" ? "Demo Mode" :
                       "Work Created"
            };

            setResolution(mappedResolution);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to resolve work status"));
            console.error("Error resolving work status:", err);
        } finally {
            setIsResolving(false);
        }
    };

    const clearWorkStatus = () => {
        setResolution(null);
    };

    return {
        resolution,
        isResolving,
        error,
        triggerWorkStatus,
        clearWorkStatus,
    };
}
