"use client";

import type { NextStepOutcome, NextStepResolution } from "../contracts/next-step/next-step-contract";
import type { OriginContext } from "../contracts/origin-context/origin-context-contract";

export interface HandleNextStepArgs {
    outcome: NextStepOutcome;
    moduleKey: string;
    entityId?: string;
    jobId?: string;
    originContext?: OriginContext;
    hasDestinationAccess?: boolean;
}

export async function resolveNextStepViaApi(args: HandleNextStepArgs): Promise<NextStepResolution> {
    const response = await fetch('/api/builder/navigation/next-step', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
    });

    if (!response.ok) {
        throw new Error(`Failed to resolve next step: ${response.statusText}`);
    }

    const resolution: NextStepResolution = await response.json();
    return resolution;
}
