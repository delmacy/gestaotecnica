import { describe, it } from "node:test";
import assert from "node:assert";
import { resolveReturnPath } from "../../src/platform/builder/contracts/return-paths/resolve-return-path";
import type { WorkspaceContext } from "../../src/platform/workspace";
import type { OriginContext } from "../../src/platform/builder/contracts/origin-context/origin-context-contract";

describe("Return Paths Contract - UX-NAV-02-009", () => {
  const baseWorkspaceContext = {
    scope: "workspace",
    userId: "u1",
    accountId: "a1",
    role: "admin",
    environmentMode: "real",
    workspaceId: "w1",
    workspaceKey: "wk1",
    actor: { id: "a1", role: "admin", name: "test", accountId: "a1" },
    source: "ui",
    requestId: "req1",
    permissions: [],
    features: [],
    enabledModules: [],
    scopes: [],
    correlationId: "c1"
  } as unknown as WorkspaceContext;

  const baseOriginContext: OriginContext = {
    isBlocked: false,
    returnPath: "/builder/work-items",
    returnLabel: "Voltar para Lista",
    originPath: null,
    isDemo: false,
    isSynthetic: false,
    isValidScope: true
  };

  it("should resolve CREATE_SUCCESS to detail view", () => {
    const result = resolveReturnPath({
      outcome: "CREATE_SUCCESS",
      moduleKey: "work-items",
      entityId: "123",
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/work-items/detail/123");
    assert.strictEqual(result.status, "normal");
  });

  it("should resolve CREATE_CANCEL to origin return path", () => {
    const result = resolveReturnPath({
      outcome: "CREATE_CANCEL",
      moduleKey: "work-items",
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/work-items");
    assert.strictEqual(result.label, "Voltar para Lista");
  });

  it("should resolve DETAIL_BACK to origin return path", () => {
    const result = resolveReturnPath({
      outcome: "DETAIL_BACK",
      moduleKey: "work-items",
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/work-items");
    assert.strictEqual(result.label, "Voltar para Lista");
  });

  it("should enforce demo state restrictions on CREATE_SUCCESS", () => {
    const result = resolveReturnPath({
      outcome: "CREATE_SUCCESS",
      moduleKey: "work-items",
      entityId: "123",
      workspaceContext: { ...baseWorkspaceContext, environmentMode: "demo" } as unknown as WorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/work-items");
    assert.strictEqual(result.status, "demo_restricted");
  });

  it("should enforce demo state restrictions on DELETE_SUCCESS", () => {
    const result = resolveReturnPath({
      outcome: "DELETE_SUCCESS",
      moduleKey: "work-items",
      entityId: "123",
      workspaceContext: { ...baseWorkspaceContext, environmentMode: "demo" } as unknown as WorkspaceContext,
      originContext: baseOriginContext,
    });
    assert.strictEqual(result.destination, "/builder/work-items/detail/123");
    assert.strictEqual(result.status, "demo_restricted");
  });

  it("should enforce blocked state rules regardless of outcome", () => {
    const result = resolveReturnPath({
      outcome: "CREATE_SUCCESS",
      moduleKey: "work-items",
      workspaceContext: baseWorkspaceContext,
      originContext: { ...baseOriginContext, isBlocked: true },
    });
    assert.strictEqual(result.destination, "/builder/dashboard");
    assert.strictEqual(result.status, "blocked");
  });
});
