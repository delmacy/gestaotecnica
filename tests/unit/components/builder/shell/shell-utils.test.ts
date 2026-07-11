import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getActiveBuilderSection, BuilderModule } from "../../../../../src/components/builder/shell/shell-utils";

describe("getActiveBuilderSection", () => {
  const MOCK_MODULES: BuilderModule[] = [
    { href: "/builder", label: "Dashboard", icon: null, status: "active" },
    { href: "/builder/tasker", label: "Tasker", icon: null, status: "active" },
    { href: "/builder/process-mirroring", label: "Process Mirroring", icon: null, status: "active" },
    { href: "/builder/settings", label: "Settings", icon: null, status: "active" },
  ];

  test("should return undefined if pathname is null", () => {
    const result = getActiveBuilderSection(null, MOCK_MODULES);
    assert.equal(result, undefined);
  });

  test("should map root pathname to root section", () => {
    const result = getActiveBuilderSection("/builder", MOCK_MODULES);
    assert.equal(result?.href, "/builder");
  });

  test("should map known section pathname to known section", () => {
    const result = getActiveBuilderSection("/builder/tasker", MOCK_MODULES);
    assert.equal(result?.href, "/builder/tasker");
  });

  test("should map nested path to parent section", () => {
    const result = getActiveBuilderSection("/builder/process-mirroring/as-is", MOCK_MODULES);
    assert.equal(result?.href, "/builder/process-mirroring");
  });

  test("should map deep nested path to parent section", () => {
    const result = getActiveBuilderSection("/builder/process-mirroring/as-is/detail", MOCK_MODULES);
    assert.equal(result?.href, "/builder/process-mirroring");
  });

  test("should return root if unknown section in builder", () => {
    const result = getActiveBuilderSection("/builder/unknown-section", MOCK_MODULES);
    assert.equal(result?.href, "/builder");
  });

  test("should return undefined if path is outside builder", () => {
    const result = getActiveBuilderSection("/other-route", MOCK_MODULES);
    assert.equal(result, undefined);
  });

  test("should return undefined if path is just a slash", () => {
    const result = getActiveBuilderSection("/", MOCK_MODULES);
    assert.equal(result, undefined);
  });

  test("should prefer longer match", () => {
    const MOCK_MODULES_WITH_NESTED: BuilderModule[] = [
      ...MOCK_MODULES,
      { href: "/builder/process-mirroring/nested", label: "Nested Mirroring", icon: null, status: "active" },
    ];

    const result = getActiveBuilderSection("/builder/process-mirroring/nested/item", MOCK_MODULES_WITH_NESTED);
    assert.equal(result?.href, "/builder/process-mirroring/nested");
  });
});
