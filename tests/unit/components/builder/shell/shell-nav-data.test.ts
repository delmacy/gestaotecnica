import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ACTIVE_MODULES, FUTURE_MODULES } from "../../../../../src/components/builder/shell/shell-data";

describe("Mobile Navigation Layout Data", () => {
  test("ACTIVE_MODULES should not have missing labels or hrefs", () => {
    ACTIVE_MODULES.forEach((module) => {
      assert.ok(module.label, "Module label should not be empty");
      assert.ok(module.href, "Module href should not be empty");
    });
  });

  test("ACTIVE_MODULES should contain persisted launch surfaces", () => {
    const activePaths = ACTIVE_MODULES.map(m => m.href);
    assert.ok(activePaths.includes("/builder/governance-matrix"), "Should contain Governance Matrix");
    assert.ok(activePaths.includes("/builder/operator-guide"), "Should contain Operator Guide");
    assert.ok(activePaths.includes("/builder/enterprise-map"), "Should contain Enterprise Map");
  });

  test("FUTURE_MODULES should not have missing labels or hrefs", () => {
    FUTURE_MODULES.forEach((module) => {
      assert.ok(module.label, "Module label should not be empty");
      assert.ok(module.href, "Module href should not be empty");
    });
  });
});
