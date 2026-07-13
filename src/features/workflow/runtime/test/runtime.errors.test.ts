import * as assert from "node:assert";
import { describe, it } from "node:test";
import { RuntimeErrorCode } from "../runtime.errors";

describe("Runtime Error Codes", () => {
  it("should have valid types (compile time check)", () => {
    const code: RuntimeErrorCode = "INVALID_INPUT";
    assert.strictEqual(code, "INVALID_INPUT");
  });
});
