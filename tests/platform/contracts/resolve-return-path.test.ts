import { describe, it } from "node:test";
import assert from "node:assert";
import { resolveReturnPath } from "../../../src/platform/builder/contracts/return-paths";
import { WorkspaceContext } from "../../../src/platform/workspace";
import { OriginContext } from "../../../src/platform/builder/contracts/origin-context/origin-context-contract";
import { ActionOutcome } from "../../../src/platform/builder/contracts/return-paths";

describe("resolveReturnPath", () => {
  const baseWorkspaceContext: WorkspaceContext = {
    workspaceId: "ws-1",
    workspaceKey: "ws-1",
    actor: {
      type: "user",
      id: "u-1",
    },
    source: "ui",
    enabledModules: ["portfolio"],
    scopes: [],
    correlationId: "123",
    environmentMode: "real",
  };

  const baseOriginContext: OriginContext = {
    originPath: "/builder/portfolio",
    returnPath: "/builder/portfolio",
    returnLabel: "Return to Registry",
    isDemo: false,
    isSynthetic: false,
    isBlocked: false,
    isValidScope: true,
  };

  it("routes CREATE_SUCCESS to detail view", () => {
    const result = resolveReturnPath({
      outcome: "CREATE_SUCCESS",
      moduleKey: "portfolio",
      entityId: "123",
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/portfolio/detail/123");
    assert.strictEqual(result.status, "normal");
  });

  it("routes CREATE_CANCEL to safe origin path", () => {
    const result = resolveReturnPath({
      outcome: "CREATE_CANCEL",
      moduleKey: "portfolio",
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/portfolio");
    assert.strictEqual(result.label, "Return to Registry");
  });

  it("restricts CREATE_SUCCESS in demo mode", () => {
    const result = resolveReturnPath({
      outcome: "CREATE_SUCCESS",
      moduleKey: "portfolio",
      entityId: "123",
      workspaceContext: { ...baseWorkspaceContext, environmentMode: "demo" },
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/portfolio");
    assert.strictEqual(result.status, "demo_restricted");
  });

  it("routes EDIT_SUCCESS to detail view", () => {
    const result = resolveReturnPath({
      outcome: "EDIT_SUCCESS",
      moduleKey: "portfolio",
      entityId: "123",
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/portfolio/detail/123");
  });

  it("routes EDIT_CANCEL to detail view", () => {
    const result = resolveReturnPath({
      outcome: "EDIT_CANCEL",
      moduleKey: "portfolio",
      entityId: "123",
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/portfolio/detail/123");
    assert.strictEqual(result.label, "Cancel Edit");
  });

  it("routes DELETE_SUCCESS to list view", () => {
    const result = resolveReturnPath({
      outcome: "DELETE_SUCCESS",
      moduleKey: "portfolio",
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/portfolio");
    assert.strictEqual(result.label, "Return to Registry");
  });

  it("routes DETAIL_BACK to safe origin path", () => {
    const result = resolveReturnPath({
      outcome: "DETAIL_BACK",
      moduleKey: "portfolio",
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/portfolio");
    assert.strictEqual(result.label, "Return to Registry");
  });

  it("routes unknown outcome to list view", () => {
    const result = resolveReturnPath({
      outcome: "UNKNOWN_OUTCOME" as ActionOutcome,
      moduleKey: "portfolio",
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/portfolio");
    assert.strictEqual(result.label, "Return");
  });

  it("routes intercepted for blocked state", () => {
    const result = resolveReturnPath({
      outcome: "DETAIL_BACK",
      moduleKey: "portfolio",
      workspaceContext: baseWorkspaceContext,
      originContext: { ...baseOriginContext, isBlocked: true },
    });
    assert.strictEqual(result.destination, "/builder/dashboard");
    assert.strictEqual(result.status, "blocked");
  });
});
