import { describe, test } from "node:test";
import assert from "node:assert";
import { resolveNavigationInventory } from "../../src/platform/builder/contracts/navigation-inventory";
import { WorkspaceContext } from "../../src/platform/workspace";

describe("Navigation Inventory Contract", () => {
  test("should resolve navigation inventory for real environment mode", () => {
    const mockContext: WorkspaceContext = {
      workspaceId: "w-456",
      workspaceKey: "test-ws",
      actor: { type: "user" },
      source: "ui",
      correlationId: "cor-123",
      scopes: [],
      environmentMode: "real",
      enabledModules: ["work-items", "registry"],
    };

    const inventory = resolveNavigationInventory(mockContext);

    assert.strictEqual(inventory.environmentMode, "real");

    // Dashboard and UI Contracts are always active
    const dashboard = inventory.modules.find(m => m.href === "/builder");
    assert.strictEqual(dashboard?.status, "active");

    const uiContracts = inventory.modules.find(m => m.href === "/builder/ui-contracts");
    assert.strictEqual(uiContracts?.status, "active");

    // Tasker enabled because work-items is enabled
    const tasker = inventory.modules.find(m => m.href === "/builder/tasker");
    assert.strictEqual(tasker?.status, "active");

    // Form builder blocked because form-builder is not enabled
    const formBuilder = inventory.modules.find(m => m.href === "/builder/form-builder");
    assert.strictEqual(formBuilder?.status, "blocked");
  });

  test("should resolve synthetic mode", () => {
    const mockContext: WorkspaceContext = {
      workspaceId: "w-456",
      workspaceKey: "test-ws",
      actor: { type: "user" },
      source: "ui",
      correlationId: "cor-123",
      scopes: [],
      environmentMode: "synthetic",
      enabledModules: [],
    };

    const inventory = resolveNavigationInventory(mockContext);
    assert.strictEqual(inventory.environmentMode, "synthetic");
  });

  test("should correctly map future modules", () => {
    const mockContext: WorkspaceContext = {
      workspaceId: "w-456",
      workspaceKey: "test-ws",
      actor: { type: "user" },
      source: "ui",
      correlationId: "cor-123",
      scopes: [],
      environmentMode: "demo",
      enabledModules: [],
    };

    const inventory = resolveNavigationInventory(mockContext);
    const workflowBuilder = inventory.futureModules.find(m => m.href === "/builder/workflow-builder");
    assert.strictEqual(workflowBuilder?.status, "coming_soon");
  });
});
