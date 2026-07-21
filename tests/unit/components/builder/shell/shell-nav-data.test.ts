import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ACTIVE_MODULES, FUTURE_MODULES, buildActiveModules } from "../../../../../src/components/builder/shell/shell-data";

describe("Mobile Navigation Layout Data", () => {
  test("ACTIVE_MODULES should not have missing labels or hrefs", () => {
    ACTIVE_MODULES.forEach((module) => {
      assert.ok(module.label, "Module label should not be empty");
      assert.ok(module.href, "Module href should not be empty");
    });
  });

  test("buildActiveModules should include base modules", () => {
    const modules = buildActiveModules(undefined);
    assert.equal(modules.length, ACTIVE_MODULES.length);
  });

  test("buildActiveModules should inject persisted surfaces based on enabled keys", () => {
    const enabledModules = ["governance-matrix", "operator-guide", "enterprise-map", "unknown-module"];

    const modules = buildActiveModules(enabledModules);
    const activePaths = modules.map(m => m.href);

    assert.ok(activePaths.includes("/builder/governance-matrix"), "Should contain Governance Matrix");
    assert.ok(activePaths.includes("/builder/operator-guide"), "Should contain Operator Guide");
    assert.ok(activePaths.includes("/builder/enterprise-map"), "Should contain Enterprise Map");

    // Unknown modules from context shouldn't crash or be added randomly if they don't map to a builder surface
    assert.ok(!activePaths.includes("/builder/unknown-module"));
  });

  test("FUTURE_MODULES should not have missing labels or hrefs", () => {
    FUTURE_MODULES.forEach((module) => {
      assert.ok(module.label, "Module label should not be empty");
      assert.ok(module.href, "Module href should not be empty");
    });
  });
});
