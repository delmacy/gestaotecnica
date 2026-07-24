import { describe, it } from "node:test";
import assert from "node:assert";
import { resolveAdminNavigationInventory } from "../../src/platform/admin/contracts/navigation-inventory";

describe("resolveAdminNavigationInventory", () => {
  it("returns the correct active modules", () => {
    const inventory = resolveAdminNavigationInventory();

    assert.ok(inventory.activeModules.length > 0, "Should have active modules");

    const dashboardModule = inventory.activeModules.find(m => m.href === "/admin");
    assert.ok(dashboardModule, "Should have admin dashboard module");
    assert.strictEqual(dashboardModule.status, "active");
  });
});
