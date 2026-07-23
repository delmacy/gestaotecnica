import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { resolveNavigationInventory } from "../../../../../src/platform/builder/contracts/navigation-inventory";
import { getIcon } from "../../../../../src/components/builder/shell/shell-data";

describe("Mobile Navigation Layout Data", () => {
  const mockContext = {
    workspaceId: "ws-test",
    workspaceKey: "test",
    actor: { type: "user" as const },
    source: "ui" as const,
    environmentMode: "synthetic" as const,
    enabledModules: [],
    scopes: [],
    correlationId: "test",
  };

  test("resolveNavigationInventory should return active modules with no missing labels or hrefs", () => {
    const inventory = resolveNavigationInventory(mockContext);
    inventory.activeModules.forEach((module) => {
      assert.ok(module.label, "Module label should not be empty");
      assert.ok(module.href, "Module href should not be empty");
      assert.ok(getIcon(module.iconName), "Module should resolve to a valid icon");
    });
  });

  test("resolveNavigationInventory should include base modules", () => {
    const inventory = resolveNavigationInventory(mockContext);
    assert.ok(inventory.activeModules.length > 0);
    // Dashboard should always be present
    const dashboard = inventory.activeModules.find(m => m.href === "/builder");
    assert.ok(dashboard);
  });

  test("resolveNavigationInventory should inject persisted surfaces based on enabled keys", () => {
    const contextWithModules = {
      ...mockContext,
      enabledModules: ["registry", "form-builder", "unknown-module"]
    };

    const inventory = resolveNavigationInventory(contextWithModules);
    const activePaths = inventory.activeModules.map(m => m.href);

    assert.ok(activePaths.includes("/builder/capabilities"), "Should contain Capabilities (registry module)");
    assert.ok(activePaths.includes("/builder/form-builder"), "Should contain Form Builder");

    // Unknown modules from context shouldn't crash or be added randomly if they don't map to a builder surface
    assert.ok(!activePaths.includes("/builder/unknown-module"));
  });

  test("future modules should not have missing labels or hrefs", () => {
    const inventory = resolveNavigationInventory(mockContext);
    inventory.futureModules.forEach((module) => {
      assert.ok(module.label, "Module label should not be empty");
      assert.ok(module.href, "Module href should not be empty");
      assert.ok(getIcon(module.iconName), "Module should resolve to a valid icon");
    });
  });
});
