import { describe, it } from "node:test";
import assert from "node:assert";
import { resolvePrimaryAction } from "../../../src/platform/builder/contracts/primary-action/resolve-primary-action";
import type { WorkspaceContext } from "../../../src/platform/workspace";

describe("Primary Action Resolution Contract", () => {
  const baseContext: WorkspaceContext = {
    workspaceId: "ws-1",
    workspaceKey: "default",
    actor: { type: "user", id: "u-1" },
    source: "ui",
    environmentMode: "real",
    enabledModules: ["work-items", "process-mirroring"],
    scopes: [],
    correlationId: "c-1"
  };

  it("resolves active primary action for enabled module in real mode", () => {
    const action = resolvePrimaryAction(baseContext, { moduleKey: "work-items", routeContext: "list" });
    assert.strictEqual(action.state, "active");
    assert.strictEqual(action.label, "Log New Task");
    assert.strictEqual(action.href, "/builder/tasker/new");
  });

  it("blocks action if module is not enabled", () => {
    const action = resolvePrimaryAction(baseContext, { moduleKey: "form-builder", routeContext: "list" });
    assert.strictEqual(action.state, "blocked");
    assert.strictEqual(action.tooltipMessage, "Module not enabled in current workspace.");
  });

  it("handles non-destructive actions in demo mode", () => {
    const demoContext: WorkspaceContext = { ...baseContext, environmentMode: "demo" };
    const action = resolvePrimaryAction(demoContext, { moduleKey: "process-mirroring", routeContext: "list" });
    assert.strictEqual(action.state, "active");
    assert.strictEqual(action.label, "Start Analysis");
  });

  it("blocks destructive actions in demo mode", () => {
    const demoContext: WorkspaceContext = { ...baseContext, environmentMode: "demo" };
    const action = resolvePrimaryAction(demoContext, { moduleKey: "work-items", routeContext: "list" });
    assert.strictEqual(action.state, "blocked");
    assert.strictEqual(action.tooltipMessage, "Action restricted in Demo Mode");
  });

  it("functions normally in synthetic mode", () => {
    const syntheticContext: WorkspaceContext = { ...baseContext, environmentMode: "synthetic" };
    const action = resolvePrimaryAction(syntheticContext, { moduleKey: "work-items", routeContext: "list" });
    assert.strictEqual(action.state, "active");
    assert.strictEqual(action.label, "Log New Task");
  });
});
