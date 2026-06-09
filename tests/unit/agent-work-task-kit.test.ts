import { describe, it } from "node:test";
import assert from "node:assert";

describe("Agent Work Task Kit Service", () => {
    it("should export getTaskKit function", async () => {
        const { getTaskKit } = await import("../../src/agent-work/services/task-kit");
        assert.strictEqual(typeof getTaskKit, "function");
    });
});
