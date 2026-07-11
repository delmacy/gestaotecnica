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

  test("FUTURE_MODULES should not have missing labels or hrefs", () => {
    FUTURE_MODULES.forEach((module) => {
      assert.ok(module.label, "Module label should not be empty");
      assert.ok(module.href, "Module href should not be empty");
    });
  });
});
