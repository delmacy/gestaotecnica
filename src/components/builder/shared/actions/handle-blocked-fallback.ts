"use client";

import type { BlockedFallbackDestination, BlockedFallbackReason } from "@/app/api/builder/navigation/blocked-fallback/blocked-fallback-contract";

export interface HandleBlockedFallbackArgs {
  reason: BlockedFallbackReason;
  originalPath?: string;
  moduleName?: string;
  workspaceId?: string;
  environmentMode?: 'real' | 'demo' | 'synthetic';
}

export async function resolveBlockedFallbackViaApi(args: HandleBlockedFallbackArgs): Promise<BlockedFallbackDestination> {
    const response = await fetch('/api/builder/navigation/blocked-fallback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
    });

    if (!response.ok) {
        throw new Error(`Failed to resolve blocked fallback: ${response.statusText}`);
    }

    const json = await response.json();
    const destination: BlockedFallbackDestination = json.destination || json;
    return destination;
}
