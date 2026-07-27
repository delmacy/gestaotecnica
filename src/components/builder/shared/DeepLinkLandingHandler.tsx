import React from "react";
import { DeepLinkResolution } from "@/platform/builder/contracts/deep-link-landing/deep-link-landing-contract";

export function DeepLinkLandingHandler({ resolution }: { resolution: DeepLinkResolution | null }) {
  if (!resolution) return null;

  return (
    <div className="p-4 border rounded bg-muted/50 mt-4" data-testid="deep-link-resolution-panel">
      <h3 className="font-semibold mb-2">Deep Link Resolution</h3>
      <div className="text-sm space-y-2">
        <p><strong>Status:</strong> <span data-testid="resolution-status">{resolution.status}</span></p>
        <p><strong>Target URL:</strong> <span data-testid="resolution-target-url">{resolution.targetUrl}</span></p>
        <p><strong>Context Hydrated:</strong> <span data-testid="resolution-context">{resolution.contextHydrated ? "Yes" : "No"}</span></p>
        {resolution.workspaceId && (
            <p><strong>Workspace ID:</strong> {resolution.workspaceId}</p>
        )}
      </div>
    </div>
  );
}
