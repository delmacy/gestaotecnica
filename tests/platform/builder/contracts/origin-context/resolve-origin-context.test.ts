import { describe, it } from "node:test";
import assert from "node:assert";
import { resolveOriginContext } from "@/platform/builder/contracts/origin-context/resolve-origin-context";
import { WorkspaceContext } from "@/platform/workspace";

describe("resolveOriginContext", () => {
  const defaultContext: WorkspaceContext = {
    workspaceId: "ws-1",
    workspaceKey: "ws-1-key",
    actor: {
      type: "user",
      id: "u-1",
    },
    source: "ui",
    environmentMode: "real",
    enabledModules: [],
    scopes: [],
    correlationId: "c-1",
  };

  it("should preserve origin and provide contextual return label", () => {
    const result = resolveOriginContext({
      workspaceContext: defaultContext,
      currentPath: "/builder/operations/detail/1",
      originPath: "/builder/operations",
    });

    assert.strictEqual(result.originPath, "/builder/operations");
    assert.strictEqual(result.returnPath, "/builder/operations");
    assert.strictEqual(result.returnLabel, "Return to Operations");
    assert.strictEqual(result.isValidScope, true);
  });

  it("should fallback to builder root if no origin provided for builder deep link", () => {
    const result = resolveOriginContext({
      workspaceContext: defaultContext,
      currentPath: "/builder/intake/new",
      originPath: null,
    });

    assert.strictEqual(result.originPath, null);
    assert.strictEqual(result.returnPath, "/builder");
    assert.strictEqual(result.returnLabel, "Return Home");
    assert.strictEqual(result.isValidScope, true);
  });

  it("should block cross-scope returns from admin to builder", () => {
    const result = resolveOriginContext({
      workspaceContext: defaultContext,
      currentPath: "/admin/settings",
      originPath: "/builder/operations",
    });

    assert.strictEqual(result.originPath, "/builder/operations");
    assert.strictEqual(result.returnPath, "/"); // Fallback for invalid scope
    assert.strictEqual(result.returnLabel, "Return to Dashboard");
    assert.strictEqual(result.isValidScope, false);
  });

  it("should block cross-scope returns from builder to admin", () => {
    const result = resolveOriginContext({
      workspaceContext: defaultContext,
      currentPath: "/builder/operations",
      originPath: "/admin/users",
    });

    assert.strictEqual(result.originPath, "/admin/users");
    assert.strictEqual(result.returnPath, "/builder/dashboard"); // Builder fallback
    assert.strictEqual(result.returnLabel, "Return to Dashboard");
    assert.strictEqual(result.isValidScope, false);
  });

  it("should correctly identify demo state", () => {
    const result = resolveOriginContext({
      workspaceContext: { ...defaultContext, environmentMode: "demo" },
      currentPath: "/builder/operations",
      originPath: null,
    });

    assert.strictEqual(result.isDemo, true);
    assert.strictEqual(result.isSynthetic, false);
  });

  it("should correctly identify synthetic data state", () => {
    const result = resolveOriginContext({
      workspaceContext: { ...defaultContext, environmentMode: "synthetic" },
      currentPath: "/builder/operations",
      originPath: null,
    });

    assert.strictEqual(result.isDemo, false);
    assert.strictEqual(result.isSynthetic, true);
  });
});
