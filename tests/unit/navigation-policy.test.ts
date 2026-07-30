import assert from "node:assert/strict";
import test from "node:test";
import { getVisibleNavigationModes, resolveNavigationLevel } from "../../src/modules/navigation/navigation-policy";

test("platform builder starts without an active workspace", () => {
  const level = resolveNavigationLevel("builder", {});
  assert.equal(level, "platform");
  assert.deepEqual(getVisibleNavigationModes(level), ["platform"]);
});

test("platform builder advances through organization and workspace builder", () => {
  assert.equal(resolveNavigationLevel("builder", { organizationId: "org-1" }), "organization");
  assert.equal(
    resolveNavigationLevel("builder", { organizationId: "org-1", workspaceId: "ws-1" }),
    "workspace-builder",
  );
});

test("organization admin selects a workspace before operation", () => {
  assert.equal(resolveNavigationLevel("admin", {}), "organization");
  assert.equal(resolveNavigationLevel("admin", { workspaceId: "ws-1" }), "operation");
});

test("operator only receives operational navigation", () => {
  const level = resolveNavigationLevel("operador", {});
  assert.equal(level, "operation");
  assert.deepEqual(getVisibleNavigationModes(level), ["workspace"]);
});
