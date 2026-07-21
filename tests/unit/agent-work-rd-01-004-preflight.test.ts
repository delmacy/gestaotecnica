import { test, describe } from "node:test";
import assert from "node:assert";

describe("Preflight Script Syntax and Behavior", () => {
  test("script can be imported without executing by default", async () => {
    // Importing the script should not throw
    const preflight = await import("../../src/scripts/db/preflight-env-binding.ts");
    assert.ok(preflight.runPreflight);
  });
});
