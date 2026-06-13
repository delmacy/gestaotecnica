import { test } from "node:test";
import assert from "node:assert";
import { heartbeatClaim } from "../../src/agent-work/services/lease-service";
import { validateOwnership } from "../../src/agent-work/services/collision-engine";

test("Path ownership correctly validates exact paths", () => {
  const result = validateOwnership({
      ownedPaths: ["src/core/**"],
      forbiddenPaths: ["src/core/**"]
  } as any);
  assert.strictEqual(result, false);
});

test("Path ownership validates nested paths", () => {
  const result = validateOwnership({
      ownedPaths: ["src/core/deep/file.ts"],
      forbiddenPaths: ["src/core/**"]
  } as any);
  assert.strictEqual(result, false);
});

test("Path ownership allows unrelated paths", () => {
  const result = validateOwnership({
      ownedPaths: ["src/integration/**"],
      forbiddenPaths: ["src/core/**"]
  } as any);
  assert.strictEqual(result, true);
});
