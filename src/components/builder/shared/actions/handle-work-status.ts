"use client";

import type { WorkStatusResolution } from "@/platform/builder/contracts/work-status/work-status-contract";

export interface HandleWorkStatusArgs {
    workId?: string;
    moduleKey: string;
    isWorkEmpty?: boolean;
    returnPath?: string;
    returnLabel?: string;
}

export async function resolveWorkStatusViaApi(args: HandleWorkStatusArgs): Promise<WorkStatusResolution> {
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

    const resolution: WorkStatusResolution = await response.json();
    return resolution;
}
