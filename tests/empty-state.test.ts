import { describe, it } from "node:test";
import * as assert from "node:assert";
import { resolveViewState } from "../src/platform/builder/contracts/empty-state/resolve-empty-state";
import type { WorkspaceContext } from "../src/platform/workspace";

describe("Empty State Taxonomy Backend Contract", () => {
  const baseContext: WorkspaceContext = {
    workspaceId: "test",
    workspaceKey: "test",
    actor: { type: "system" },
    source: "system",
    environmentMode: "real",
    enabledModules: ["registry", "work-items"],
    scopes: ["*"],
    correlationId: "123",
  };

  it("resolves Blocked state when module is not enabled", () => {
    const context = { ...baseContext, enabledModules: [] };
    const outcome = resolveViewState(context, { moduleKey: "registry", hasData: false });

    assert.strictEqual(outcome.state, "blocked");
    assert.strictEqual(outcome.title, "Module Unavailable");
    assert.ok(outcome.description.includes("requires additional privileges"));
    assert.strictEqual(outcome.isActionAllowed, false);
  });

  it("resolves Empty state for registry module with proper commercial language", () => {
    const outcome = resolveViewState(baseContext, { moduleKey: "registry", hasData: false });

    assert.strictEqual(outcome.state, "empty");
    assert.strictEqual(outcome.title, "Define Capabilities");
    assert.strictEqual(outcome.description, "Streamline your operations. Define your first business capability.");
    assert.strictEqual(outcome.primaryActionLabel, "Create Capability");
    assert.strictEqual(outcome.primaryActionHref, "/builder/capabilities/new");
  });

  it("resolves Demo state logic", () => {
    const context = { ...baseContext, environmentMode: "demo" as const };
    const outcome = resolveViewState(context, { moduleKey: "registry", hasData: false });

    assert.strictEqual(outcome.state, "demo");
    assert.ok(outcome.description.includes("Demo environment"));
    assert.strictEqual(outcome.isActionAllowed, false);
  });

  it("resolves Real state when data exists", () => {
    const outcome = resolveViewState(baseContext, { moduleKey: "registry", hasData: true });

    assert.strictEqual(outcome.state, "real");
  });
});
