import { describe, it } from "node:test";
import * as assert from "node:assert";
import { resolveCancelBack } from "../../../src/platform/builder/contracts/cancel-back/resolve-cancel-back";
import { OriginContext } from "../../../src/platform/builder/contracts/origin-context/origin-context-contract";
import { WorkspaceContext } from "../../../src/platform/workspace";

describe("Cancel, Back, and Discard Behavior Backend Contract", () => {
  const defaultWorkspaceContext: WorkspaceContext = {
    workspaceId: "test-workspace-id",
    workspaceKey: "test-workspace-key",
    environmentMode: "real",
    actor: {
      type: "user",
      id: "sys-user"
    },
    source: "ui",
    enabledModules: [],
    scopes: [],
    correlationId: "test-correlation"
  };

  const defaultOriginContext: OriginContext = {
    originPath: null,
    returnPath: "/builder/portfolio",
    returnLabel: "Return to Portfolio",
    isBlocked: false,
    isDemo: false,
    isSynthetic: false,
    isValidScope: true
  };

  it("should return to safe origin when navigating back from a clean state", () => {
    const res = resolveCancelBack({
      action: "BACK",
      isDirty: false,
      moduleKey: "portfolio",
      workspaceContext: defaultWorkspaceContext,
      originContext: defaultOriginContext
    });

    assert.strictEqual(res.destination, "/builder/portfolio");
    assert.strictEqual(res.label, "Return to Portfolio");
    assert.strictEqual(res.requiresIntervention, false);
    assert.strictEqual(res.status, "normal");
  });

  it("should return to dashboard when blocked, ignoring dirty state", () => {
    const res = resolveCancelBack({
      action: "BACK",
      isDirty: true, // User somehow typed into a blocked form or it was dirty before blocking
      moduleKey: "portfolio",
      workspaceContext: defaultWorkspaceContext,
      originContext: { ...defaultOriginContext, isBlocked: true }
    });

    assert.strictEqual(res.destination, "/builder/dashboard");
    assert.strictEqual(res.label, "Return to Dashboard");
    assert.strictEqual(res.status, "blocked");
    assert.strictEqual(res.requiresIntervention, false); // Intervention skipped because they are blocked and shouldn't save anyway
  });

  it("should require intervention (Discard Gate) when navigating back from a dirty state", () => {
    const res = resolveCancelBack({
      action: "BACK",
      isDirty: true,
      moduleKey: "portfolio",
      workspaceContext: defaultWorkspaceContext,
      originContext: defaultOriginContext
    });

    assert.strictEqual(res.requiresIntervention, true);
    assert.strictEqual(res.label, "Discard and Return");
    assert.ok(res.message?.includes("Unsaved Changes"));
  });

  it("should require intervention when cancelling a dirty state", () => {
    const res = resolveCancelBack({
      action: "CANCEL",
      isDirty: true,
      moduleKey: "portfolio",
      workspaceContext: defaultWorkspaceContext,
      originContext: defaultOriginContext
    });

    assert.strictEqual(res.requiresIntervention, true);
    assert.strictEqual(res.label, "Discard and Return");
  });

  it("should explicitly trigger discard gate when action is DISCARD", () => {
    const res = resolveCancelBack({
      action: "DISCARD",
      isDirty: false, // Discard action explicitly triggers the flow even if dirty wasn't pre-validated
      moduleKey: "portfolio",
      workspaceContext: defaultWorkspaceContext,
      originContext: defaultOriginContext
    });

    assert.strictEqual(res.requiresIntervention, true);
    assert.strictEqual(res.label, "Discard and Return");
  });

  it("should handle demo mode with restricted status when intervention occurs", () => {
    const res = resolveCancelBack({
      action: "CANCEL",
      isDirty: true,
      moduleKey: "portfolio",
      workspaceContext: { ...defaultWorkspaceContext, environmentMode: "demo" },
      originContext: defaultOriginContext
    });

    assert.strictEqual(res.requiresIntervention, true);
    assert.strictEqual(res.status, "demo_restricted");
  });
});
