import { test } from "node:test";
import assert from "node:assert";
import { classifyCollision, validateOwnership } from "../../src/agent-work/services/collision-engine";

test("Path validation: green on unrelated paths", () => {
  const result = classifyCollision(
    { ownedPaths: ["src/a/**"], forbiddenPaths: [] } as any,
    { ownedPaths: ["src/b/**"], forbiddenPaths: [] } as any
  );
  assert.strictEqual(result, "green");
});

test("Path validation: red on overlapping owned paths", () => {
  const result = classifyCollision(
    { ownedPaths: ["src/a/**"], forbiddenPaths: [] } as any,
    { ownedPaths: ["src/a/**"], forbiddenPaths: [] } as any
  );
  assert.strictEqual(result, "red");
});

test("Path validation: ownership validation prevents forbidden paths", () => {
  const isValid = validateOwnership({
    ownedPaths: ["src/core/**"],
    forbiddenPaths: ["src/core/**"]
  } as any);
  assert.strictEqual(isValid, false);
});
