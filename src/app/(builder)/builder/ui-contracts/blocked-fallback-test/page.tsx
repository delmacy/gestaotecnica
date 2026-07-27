"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBlockedFallback } from "@/components/builder/shared/hooks/useBlockedFallback";
import type { BlockedFallbackReason } from "@/app/api/builder/navigation/blocked-fallback/blocked-fallback-contract";

export default function BlockedFallbackTestPage() {
  const router = useRouter();
  const { destination, isResolving, error, triggerFallback, clearFallback } = useBlockedFallback();

  const [reason, setReason] = useState<BlockedFallbackReason>("forbidden_workspace");
  const [originalPath, setOriginalPath] = useState<string>("/builder/w-123/capabilities/c-456");
  const [moduleName, setModuleName] = useState<string>("capabilities");
  const [workspaceId, setWorkspaceId] = useState<string>("w-123");
  const [environmentMode, setEnvironmentMode] = useState<'real' | 'demo' | 'synthetic'>("real");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerFallback({
      reason,
      originalPath,
      moduleName,
      workspaceId,
      environmentMode,
    });
  };

  const executeNavigation = (path: string) => {
     router.push(path);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Blocked & Fallback Paths Test Client</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-1">Reason</label>
          <select
            className="w-full border p-2 rounded"
            value={reason}
            onChange={(e) => setReason(e.target.value as BlockedFallbackReason)}
            data-testid="reason-select"
          >
            <option value="unauthorized">unauthorized</option>
            <option value="forbidden_workspace">forbidden_workspace</option>
            <option value="forbidden_platform">forbidden_platform</option>
            <option value="not_found">not_found</option>
            <option value="system_error">system_error</option>
            <option value="demo_restricted">demo_restricted</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Environment Mode</label>
          <select
            className="w-full border p-2 rounded"
            value={environmentMode}
            onChange={(e) => setEnvironmentMode(e.target.value as 'real' | 'demo' | 'synthetic')}
            data-testid="env-mode-select"
          >
            <option value="real">real</option>
            <option value="demo">demo</option>
            <option value="synthetic">synthetic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Original Path</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={originalPath}
            onChange={(e) => setOriginalPath(e.target.value)}
            data-testid="original-path-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Module Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            data-testid="module-name-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Workspace ID</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            data-testid="workspace-id-input"
          />
        </div>

        <button
          type="submit"
          disabled={isResolving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          data-testid="trigger-btn"
        >
          {isResolving ? "Resolving..." : "Trigger Action"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200" data-testid="error-message">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {destination && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-4" data-testid="fallback-result">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-800">Fallback Resolution</h2>
            <button
              onClick={clearFallback}
              className="text-sm text-blue-700 hover:underline"
              data-testid="clear-btn"
            >
              Clear
            </button>
          </div>

          <dl className="grid grid-cols-1 gap-2">
            <div>
              <dt className="text-sm font-semibold text-blue-800">User Message:</dt>
              <dd className="text-blue-900 bg-white p-2 rounded border border-blue-100 font-bold" data-testid="res-message">
                {destination.userMessage}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-blue-800">Fallback Path:</dt>
              <dd className="text-blue-900 bg-white p-2 rounded border border-blue-100 font-mono" data-testid="res-path">
                {destination.fallbackPath}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-blue-800">Reason Processed:</dt>
              <dd className="text-blue-900 bg-white p-2 rounded border border-blue-100" data-testid="res-reason">
                {destination.reason}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-blue-800">Should Redirect:</dt>
              <dd className="text-blue-900 bg-white p-2 rounded border border-blue-100" data-testid="res-redirect">
                {destination.shouldRedirect ? "Yes" : "No"}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex gap-4">
            <button
                onClick={() => executeNavigation(destination.fallbackPath)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                data-testid="navigate-btn"
            >
                Execute Navigation to {destination.fallbackPath}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
