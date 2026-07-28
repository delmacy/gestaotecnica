"use server";

import type { WorkStatusResolution } from "@/platform/builder/contracts/work-status/work-status-contract";
import { headers } from "next/headers";

export interface HandleWorkStatusArgs {
    workId?: string;
    moduleKey: string;
    isWorkEmpty?: boolean;
    returnPath?: string;
    returnLabel?: string;
}

export async function resolveWorkStatusViaApi(args: HandleWorkStatusArgs): Promise<WorkStatusResolution> {
    const headersList = await headers();
    const envMode = headersList.get("x-environment-mode") || "real";
    const blocked = headersList.get("x-is-blocked") || "false";

    // Determine the base URL dynamically based on environment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/builder/work-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-environment-mode': envMode,
            'x-is-blocked': blocked
        },
        body: JSON.stringify(args),
    });

    if (!response.ok) {
        throw new Error(`Failed to resolve work status: ${response.statusText}`);
    }

    const resolution: WorkStatusResolution = await response.json();
    return resolution;
}
