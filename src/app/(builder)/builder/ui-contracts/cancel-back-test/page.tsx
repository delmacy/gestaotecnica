"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCancelBack } from "@/components/builder/shared/hooks/useCancelBack";
import type { CancelBackAction } from "@/platform/builder/contracts/cancel-back";

export default function CancelBackTestPage() {
  const router = useRouter();
  const { resolution, isResolving, error, triggerCancelBack, clearCancelBack } = useCancelBack();
  const [actionType, setActionType] = useState<CancelBackAction>("CANCEL");
  const [isDirty, setIsDirty] = useState(false);
  const [moduleKey, setModuleKey] = useState("form-builder");
  const [originPath, setOriginPath] = useState<string>("/builder/portfolio");
  const [returnPath, setReturnPath] = useState<string>("/builder/portfolio");
  const [returnLabel, setReturnLabel] = useState<string>("Return to Portfolio");
  const [isDemo, setIsDemo] = useState(false);
  const [isSynthetic, setIsSynthetic] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isValidScope, setIsValidScope] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerCancelBack({
      action: actionType,
      isDirty,
      moduleKey,
      originContext: {
        originPath,
        returnPath,
        returnLabel,
        isDemo,
        isSynthetic,
        isBlocked,
        isValidScope,
      },
    });
  };

  // Real routing execution
  const executeNavigation = (destination: string) => {
     router.push(destination);
  };

  // If resolution does NOT require intervention, automatically route.
  // In a real hook consumption scenario, this logic might be in a useEffect or inside the trigger function.
  // We'll leave it manual here for the test client so playwright can assert it, but we add a button to prove routing.

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Cancel, Back, and Discard Test Client</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-1">Action Type</label>
          <select
            className="w-full border p-2 rounded"
            value={actionType}
            onChange={(e) => setActionType(e.target.value as CancelBackAction)}
            data-testid="action-select"
          >
            <option value="CANCEL">CANCEL</option>
            <option value="BACK">BACK</option>
            <option value="DISCARD">DISCARD</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDirty"
            checked={isDirty}
            onChange={(e) => setIsDirty(e.target.checked)}
            data-testid="is-dirty-checkbox"
          />
          <label htmlFor="isDirty" className="text-sm font-medium">Is Dirty (Unsaved Changes)</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Module Key</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={moduleKey}
            onChange={(e) => setModuleKey(e.target.value)}
            data-testid="module-key-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Origin Path</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={originPath}
            onChange={(e) => setOriginPath(e.target.value)}
            data-testid="origin-path-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Return Path</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={returnPath}
            onChange={(e) => setReturnPath(e.target.value)}
            data-testid="return-path-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isDemo" checked={isDemo} onChange={(e) => setIsDemo(e.target.checked)} />
            <label htmlFor="isDemo" className="text-sm">Is Demo</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isSynthetic" checked={isSynthetic} onChange={(e) => setIsSynthetic(e.target.checked)} />
            <label htmlFor="isSynthetic" className="text-sm">Is Synthetic</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isBlocked" checked={isBlocked} onChange={(e) => setIsBlocked(e.target.checked)} />
            <label htmlFor="isBlocked" className="text-sm">Is Blocked</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isValidScope" checked={isValidScope} onChange={(e) => setIsValidScope(e.target.checked)} />
            <label htmlFor="isValidScope" className="text-sm">Is Valid Scope</label>
          </div>
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

      {resolution && (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 space-y-4" data-testid="resolution-result">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-green-800">Resolution Result</h2>
            <button
              onClick={clearCancelBack}
              className="text-sm text-green-700 hover:underline"
              data-testid="clear-btn"
            >
              Clear
            </button>
          </div>

          <dl className="grid grid-cols-1 gap-2">
            <div>
              <dt className="text-sm font-semibold text-green-800">Destination:</dt>
              <dd className="text-green-900 bg-white p-2 rounded border border-green-100" data-testid="res-destination">
                {resolution.destination}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-green-800">Label:</dt>
              <dd className="text-green-900 bg-white p-2 rounded border border-green-100" data-testid="res-label">
                {resolution.label}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-green-800">Status:</dt>
              <dd className="text-green-900 bg-white p-2 rounded border border-green-100" data-testid="res-status">
                {resolution.status}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-green-800">Requires Intervention (Discard Gate):</dt>
              <dd className="text-green-900 bg-white p-2 rounded border border-green-100" data-testid="res-intervention">
                {resolution.requiresIntervention ? "Yes" : "No"}
              </dd>
            </div>

            {resolution.message && (
              <div>
                <dt className="text-sm font-semibold text-green-800">Message:</dt>
                <dd className="text-green-900 bg-white p-2 rounded border border-green-100" data-testid="res-message">
                  {resolution.message}
                </dd>
              </div>
            )}
          </dl>

          {!resolution.requiresIntervention && (
              <div className="mt-4">
                  <button
                      onClick={() => executeNavigation(resolution.destination)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                      data-testid="navigate-btn"
                  >
                      Execute Navigation to {resolution.destination}
                  </button>
              </div>
          )}

          {resolution.requiresIntervention && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
              <h3 className="text-yellow-800 font-bold mb-2">Discard Intervention Gate</h3>
              <p className="text-yellow-900 mb-4">{resolution.message || "You have unsaved changes."}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => executeNavigation(resolution.destination)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  data-testid="confirm-discard-btn"
                >
                  {resolution.label}
                </button>
                <button
                  onClick={clearCancelBack}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  data-testid="cancel-discard-btn"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
